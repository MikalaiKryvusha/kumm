#!/usr/bin/env node
// context-budget — хук Claude Code «окно контекста кончается: доводи работу до среза и закрывай чат».
// На UserPromptSubmit и PreToolUse читает хвост транскрипта сессии (`transcript_path`), берёт `usage` последнего ответа
// основной сессии (ответы субагентов, `isSidechain`, пропускает) и считает контекст =
// input_tokens + cache_read_input_tokens + cache_creation_input_tokens. Доля от окна WINDOW:
//   < PCT_WARN — молчит; ≥ PCT_WARN и ≥ PCT_CLOSE — ТОЛЬКО предупреждения «работай дальше» (слово владельца 2026-10-31 21:26);
//   ≥ PCT_SOFT — «доделай текущую работу до среза и закрывай мягко» (/end-chat-soft целиком: судья, передача, коммит, пуш, прощание);
//   ≥ PCT_FORCE — «срочно закрывай» (/end-chat-force), строка на КАЖДОМ вызове.
// Шум: на PreToolUse строка уходит только при переходе в новую ступень по 5 % (память ступени — файл сессии в tmp);
// на UserPromptSubmit — всегда, пока доля ≥ PCT_WARN. Ворота закрытия (closeGate) — единственное, что хук отклоняет: навык закрытия
// раньше своего порога без слова владельца. При любой ошибке молчит (exit 0 без вывода).
// Самопроверка: `node context-budget.mjs --check`.
// В KUMM — с 2026-10-28 по слову владельца («разверни у нас такой хук… и самостоятельно закрывать чаты, когда окно
// заканчивается»), источник — D:\skill.md. Окно 1 млн: прошлый чат той же модели (claude-opus-5-5) дошёл до 689 тыс. токенов.
import { readFileSync, writeFileSync, openSync, readSync, fstatSync, closeSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Размер окна модели в токенах: 200 000 — стандартное окно, 1 000 000 — окно 1M. Переопределение — env CONTEXT_BUDGET_WINDOW.
export const WINDOW = Number(process.env.CONTEXT_BUDGET_WINDOW) || 200_000;
export const PCT_WARN = 70;
export const PCT_CLOSE = 75;
// С 80 % — доделать текущую работу до среза и запустить мягкое закрытие: при закрытии на 85 % места на его церемонии уже не было (2026-11-14 18:35
// чат упёрся в 85 % и закрылся принудительно). Срочное закрытие — только с 92 %, не раньше. `[OWNER]` 2026-11-14 19:10 «на 80% начинай доделывать и
// мягкое закрытие запускать» · 22:29 «быстрое закрытие только при 92%, не раньше» (KUMM PROJECT_HISTORY, запись 2026-11-14 22:3x).
export const PCT_SOFT = 80;
export const PCT_FORCE = 92;

// Что агенту делать при закрытии — ритуалы KUMM (навыки закрытия в .claude/skills/end-chat-*).
export const CLOSE_SOFT = 'запусти /end-chat-soft целиком, без спешки: судья по итогам чата, передача дел в STATUS.md («Where to continue» — что '
  + 'сделано, что в работе, с чего продолжить), обрезка STATUS в хронику, коммит и пуш KUMM, пак Конана — `git push origin main`, игру своего '
  + 'прогона закрыть, замок машины снять, прощальное сообщение';
export const CLOSE_FORCE = 'запусти /end-chat-force: короткая передача в STATUS.md, коммит и пуш, игру своего прогона закрыть, замок '
  + 'машины снять, и скажи владельцу открыть новый чат';

const TAIL_BYTES = 4 * 1024 * 1024; // последний ответ модели всегда в хвосте; весь транскрипт бывает сотни мегабайт

// Размер контекста по usage одного ответа. Мутант `noCache` — для самопроверки.
export const contextOf = (u, noCache = false) =>
  (u.input_tokens || 0) + (noCache ? 0 : u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);

// usage последнего ответа основной сессии из хвоста файла транскрипта.
export function lastUsage(path, tailBytes = TAIL_BYTES) {
  const fd = openSync(path, 'r');
  try {
    const size = fstatSync(fd).size, len = Math.min(size, tailBytes);
    const buf = Buffer.alloc(len);
    readSync(fd, buf, 0, len, size - len);
    const lines = buf.toString('utf8').split('\n');
    if (len < size) lines.shift(); // первая строка хвоста обрезана
    for (let i = lines.length - 1; i >= 0; i--) {
      if (!lines[i].includes('"usage"')) continue;
      let o; try { o = JSON.parse(lines[i]); } catch { continue; }
      if (o.type === 'assistant' && !o.isSidechain && o.message && o.message.usage) return o.message.usage;
    }
    return null;
  } finally { closeSync(fd); }
}

// Доля для показа — вниз до десятой: округление вверх печатало «окно 92 % — меньше 92 %» и звало на отклоняемое срочное закрытие (судья 2026-11-14).
// (+1e-6 — ошибка плавающей точки: 714 000 из 1 млн давало 71.3 вместо 71.4; порог не пересекает — судья, раунд 4.)
export const shown = (pct) => (Math.floor(pct * 10 + 1e-6) / 10).toFixed(1);

export function message(tokens, pct) {
  const head = `context-budget · контекст ≈ ${Math.floor(tokens / 1000)} тыс. токенов = ${shown(pct)} % окна ${WINDOW / 1000} тыс.`;
  // Автосжатие в этом проекте наблюдалось при 967–969 тыс. токенов из 1 млн (≈ 96,7 %, шесть случаев в транскриптах, замер 2026-11-14 23:05) —
  // от 92 % до него ≈ 47 тыс. Просьба владельца и здесь делается сразу, коротко (судья, раунд 2), — потом закрытие.
  if (pct >= PCT_FORCE) return `${head} СРОЧНО ЗАКРЫВАЙ ЧАТ: до автосжатия считанные шаги. Свою текущую работу не доводи, своего `
    + `нового не начинай (просьбу владельца — сделай коротко, сейчас); следующим действием ${CLOSE_FORCE}. Если /end-chat-soft уже идёт — `
    + `сожми его до шагов срочного: передача, коммит, пуш, прощание.`;
  // С PCT_SOFT — мягкое закрытие: сначала доделать начатое (не бросать), потом церемонии целиком; срочное — не раньше PCT_FORCE (слово 2026-11-14 22:29).
  // Просьба владельца в заполненном чате — не «новое»: её делают сейчас (`[OWNER]` 2026-10-30 «НЕТ, ТЫ СДЕЛАЕШЬ!!!», память owner-order-beats-budget-hint).
  if (pct >= PCT_SOFT) return `${head} ПОРА ЗАКРЫВАТЬ МЯГКО: доделай текущую работу до логического среза (проверено, закоммичено), `
    + `своего нового не начинай (просьбу владельца — делай сейчас); затем ${CLOSE_SOFT}. Срочное закрытие (/end-chat-force) — только с ${PCT_FORCE} %.`;
  // 70 % и 75 % — ТОЛЬКО предупреждение, без слов закрытия даже о будущем пороге: `[OWNER]` «на 70 и 75 я просил лишь предупреждать, а не закрываться» ·
  // «ты слишком рано закрываешься» · 2026-10-31 21:26 (агент свернулся на 70 %, прочитав «на 75 % пора закрывать»; KAIF bug 26).
  if (pct >= PCT_CLOSE) return `${head} Предупреждение (второе): работай дальше в обычном темпе, держи STATUS.md свежим после каждого среза.`;
  return `${head} Предупреждение: работай дальше в обычном темпе.`;
}

// Решение: что сказать (или null). state — { step } из файла сессии; возвращает { text, step }.
export function decide(input, usage, state = {}) {
  if (!usage) return null;
  const tokens = contextOf(usage), pct = (tokens / WINDOW) * 100;
  if (pct < PCT_WARN) return null;
  const step = Math.floor(pct / 5) * 5;
  // На ≥ PCT_FORCE строка идёт на каждом вызове: срочный приказ не прячется за памятью ступени. Доля упала ниже запомненной ступени (было
  // автосжатие) — память не глушит новые ступени: после сжатия с 95 % до 20 % строки на 80 / 85 / 90 % молчали (судья, раунд 3).
  const prev = state.step || 0;
  if (input.hook_event_name === 'PreToolUse' && pct < PCT_FORCE && step <= prev && !(step < prev - 5)) return null;
  return { text: message(tokens, pct), step };
}

// Ворота закрытия: /end-chat-soft при окне < PCT_SOFT и /end-chat-force при окне < PCT_FORCE отклоняются, если в аргументах навыка нет слова
// владельца («owner: «…»» — его дословная просьба закрыть). 2026-11-01 23:43: я закрыл чат на 68 % «по ощущению предела»; `[OWNER]` «ты опять слишком
// рано чат закрыл, 28% еще свободно окна мне показывает твой харнес» · «И ХУК ИСПРАВЬ». 2026-11-14 22:29: `[OWNER]` «быстрое закрытие только при 92%,
// не раньше» — между PCT_SOFT и PCT_FORCE срочное закрытие отклоняется в пользу мягкого. Возвращает объект ответа хука (deny) или null.
export function closeGate(input, usage) {
  if (input.hook_event_name !== 'PreToolUse' || input.tool_name !== 'Skill') return null;
  const ti = input.tool_input || {};
  const m = /^end-chat-(force|soft)$/.exec(String(ti.skill || ''));
  if (!m) return null;
  if (/owner:\s*«[^»]+»/.test(String(ti.args || ''))) return null;
  if (!usage) return null;                                    // нечем мерить — не мешаем
  const pct = (contextOf(usage) / WINDOW) * 100;
  const deny = (why) => ({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason:
    `context-budget: окно ${shown(pct)} % — ${why} По слову владельца — args «owner: «<его дословная просьба закрыть>»».` } });
  if (pct < PCT_SOFT) return deny(`меньше ${PCT_SOFT} %: закрывать чат рано, работай дальше. Мягкое закрытие — с ${PCT_SOFT} %, срочное — с ${PCT_FORCE} %.`);
  if (m[1] === 'force' && pct < PCT_FORCE) return deny(`меньше ${PCT_FORCE} %: срочное закрытие рано. Доделай текущую работу до среза и `
    + `запусти /end-chat-soft — его церемонии помещаются до ${PCT_FORCE} %.`);
  return null;
}

const stateFile = (sid) => join(tmpdir(), `context-budget-${String(sid || 'none').replace(/[^\w-]/g, '')}.json`);

function selfCheck() {
  const dir = mkdtempSync(join(tmpdir(), 'cb-check-'));
  const line = (o) => JSON.stringify(o);
  // Доли считаются от WINDOW: самопроверка верна при любом окне.
  const asst = (pct, extra = {}) => line({ type: 'assistant', ...extra,
    message: { usage: { input_tokens: 2, cache_read_input_tokens: Math.round(WINDOW * pct / 100) - 1002, cache_creation_input_tokens: 1000, output_tokens: 50 } } });
  const write = (name, rows) => { const p = join(dir, name); writeFileSync(p, rows.join('\n') + '\n'); return p; };
  const low = write('low.jsonl', [line({ type: 'user' }), asst(33)]);
  const warn = write('warn.jsonl', [asst(33), line({ type: 'user' }), asst(72)]);
  const close = write('close.jsonl', [asst(78)]);
  const soft = write('soft.jsonl', [asst(82)]);
  const mid = write('mid.jsonl', [asst(86)]);          // бывший порог срочного закрытия — теперь всё ещё мягкое
  const force = write('force.jsonl', [asst(93)]);
  // Границы порогов — ровно на них и на десятую ниже: мутанты PCT_FORCE 90 и PCT_SOFT 81 проходили прежние кейсы (судья 2026-11-14)
  const b799 = write('b799.jsonl', [asst(79.9)]), b800 = write('b800.jsonl', [asst(80)]);
  const b919 = write('b919.jsonl', [asst(91.9)]), b920 = write('b920.jsonl', [asst(92)]), b9196 = write('b9196.jsonl', [asst(91.96)]);
  const gate = (skill, p) => closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill } }, lastUsage(p));
  const side = write('side.jsonl', [asst(33), asst(95, { isSidechain: true })]);
  const pad = 'x'.repeat(200);
  const big = write('big.jsonl', [asst(95), ...Array.from({ length: 30000 }, () => line({ type: 'user', pad })), asst(10)]);
  const pctOf = (p, tail) => contextOf(lastUsage(p, tail)) / WINDOW * 100;
  const U = { hook_event_name: 'UserPromptSubmit' }, P = { hook_event_name: 'PreToolUse' };
  const cases = [
    ['33 % молчит', decide(U, lastUsage(low)) === null],
    // 2026-10-31 21:26 — слово владельца: на 70 и 75 % только предупреждать; эти два случая раньше требовали «закрывай» на 75 %
    // Ни одного слова закрытия в предупреждении — и о будущем пороге тоже (KAIF bug 26: «на 75 % пора закрывать» на 70 % свернуло агента)
    // «срез» запрещать нельзя: «держи STATUS.md свежим после каждого среза» — одобренное владельцем предупреждение 2026-10-31
    ['72 % предупреждение: работай дальше, без слов закрытия', /работай дальше/.test(decide(U, lastUsage(warn))?.text || '')
      && !/закры|доде|довод|заверш|сверн|свора|прощ|мягк|end-chat/i.test(decide(U, lastUsage(warn))?.text || '')],
    ['78 % предупреждение, без слов закрытия', /работай дальше/.test(decide(U, lastUsage(close))?.text || '')
      && !/закры|доде|довод|заверш|сверн|свора|прощ|мягк|end-chat/i.test(decide(U, lastUsage(close))?.text || '')],
    ['93 %: просьба владельца делается и при срочном', /просьбу владельца — сделай коротко, сейчас/.test(decide(U, lastUsage(force))?.text || '')],
    ['79.9 % — ещё предупреждение', !/ПОРА ЗАКРЫВАТЬ/.test(decide(U, lastUsage(b799))?.text || '')],
    ['80.0 % — мягкое закрытие', /ПОРА ЗАКРЫВАТЬ МЯГКО/.test(decide(U, lastUsage(b800))?.text || '')],
    ['91.9 % — ещё мягкое', !/СРОЧНО/.test(decide(U, lastUsage(b919))?.text || '') && /МЯГКО/.test(decide(U, lastUsage(b919))?.text || '')],
    ['92.0 % — срочное', /СРОЧНО ЗАКРЫВАЙ ЧАТ/.test(decide(U, lastUsage(b920))?.text || '')],
    ['91.96 % показывается как 91.9, не 92.0', /= 91\.9 %/.test(decide(U, lastUsage(b9196))?.text || '')
      && /окно 91\.9 %/.test(gate('end-chat-force', b9196)?.hookSpecificOutput?.permissionDecisionReason || '')],
    ['мягкое: просьба владельца делается сейчас', /просьбу владельца — делай сейчас/.test(decide(U, lastUsage(soft))?.text || '')],
    ['гейт: мягкое на 79.9 % запрещено, на 80.0 % разрешено', gate('end-chat-soft', b799) !== null && gate('end-chat-soft', b800) === null],
    ['гейт: срочное на 91.9 % запрещено, на 92.0 % разрешено', gate('end-chat-force', b919) !== null && gate('end-chat-force', b920) === null],
    ['PreToolUse: 86 % в той же ступени 85 молчит', decide(P, lastUsage(mid), { step: 85 }) === null],
    // после автосжатия доля падает ниже памяти ступени — новые ступени снова говорят (судья, раунд 3: с памятью 95 молчали 80 / 85 / 90 %)
    ['PreToolUse: после сжатия (память 95) 82 % говорит', /МЯГКО/.test(decide(P, lastUsage(soft), { step: 95 })?.text || '')
      && decide(P, lastUsage(soft), { step: 95 })?.step === 80],
    ['78 % — ещё не срочно', !/СРОЧНО/.test(decide(U, lastUsage(close))?.text || '')],
    // 2026-11-14 19:10 / 22:29 — слово владельца: с 80 % доделать работу и мягкое закрытие, срочное — только с 92 %
    ['82 % мягкое закрытие: доделай и /end-chat-soft', /ПОРА ЗАКРЫВАТЬ МЯГКО/.test(decide(U, lastUsage(soft))?.text || '')
      && /доделай/.test(decide(U, lastUsage(soft))?.text || '') && /end-chat-soft/.test(decide(U, lastUsage(soft))?.text || '')],
    ['82 % — не срочно', !/СРОЧНО/.test(decide(U, lastUsage(soft))?.text || '')],
    ['86 % — всё ещё мягкое, не срочное', /ПОРА ЗАКРЫВАТЬ МЯГКО/.test(decide(U, lastUsage(mid))?.text || '')
      && !/СРОЧНО/.test(decide(U, lastUsage(mid))?.text || '')],
    ['86 % на PreToolUse: новая ступень говорит', decide(P, lastUsage(mid), { step: 80 })?.step === 85],
    ['93 % срочный приказ', /СРОЧНО ЗАКРЫВАЙ ЧАТ/.test(decide(U, lastUsage(force))?.text || '')],
    ['93 % на PreToolUse говорит и в той же ступени', /СРОЧНО/.test(decide(P, lastUsage(force), { step: 90 })?.text || '')],
    ['последний ответ, а не первый', Math.round(pctOf(warn)) === 72],
    ['субагент пропущен', Math.round(pctOf(side)) === 33],
    ['хвост большого файла: последний ответ', Math.round(pctOf(big, 64 * 1024)) === 10],
    ['PreToolUse: та же ступень молчит', decide(P, lastUsage(close), { step: 75 }) === null],
    ['PreToolUse: новая ступень говорит', decide(P, lastUsage(close), { step: 70 })?.step === 75],
    ['UserPromptSubmit: говорит всегда', decide(U, lastUsage(close), { step: 75 }) !== null],
    ['нет usage — молчит', decide(U, null) === null],
    ['мутант без cache_read краснеет', contextOf(lastUsage(close), true) / WINDOW * 100 < PCT_WARN],
    // 2026-11-01 23:43 — слово владельца: «ты опять слишком рано чат закрыл, 28% еще свободно окна» · «И ХУК ИСПРАВЬ» (я вызвал /end-chat-force на 68 %)
    ['закрытие на 72 % без слова владельца запрещено', typeof closeGate === 'function'
      && closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill: 'end-chat-force' } }, lastUsage(warn)) !== null],
    ['мягкое закрытие на 78 % запрещено', closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill: 'end-chat-soft' } }, lastUsage(close)) !== null],
    ['мягкое закрытие на 82 % разрешено', closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill: 'end-chat-soft' } }, lastUsage(soft)) === null],
    ['срочное закрытие на 86 % запрещено — только с 92 %', /end-chat-soft/.test(closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill',
      tool_input: { skill: 'end-chat-force' } }, lastUsage(mid))?.hookSpecificOutput?.permissionDecisionReason || '')],
    ['срочное закрытие на 93 % разрешено', closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill: 'end-chat-force' } }, lastUsage(force)) === null],
    ['мягкое закрытие на 93 % разрешено', closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill: 'end-chat-soft' } }, lastUsage(force)) === null],
    ['срочное на 86 % по слову владельца разрешено', closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill',
      tool_input: { skill: 'end-chat-force', args: 'owner: «закрывай срочно»' } }, lastUsage(mid)) === null],
    ['закрытие по слову владельца разрешено', typeof closeGate === 'function'
      && closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill: 'end-chat-force', args: 'owner: «закрывай чат»' } }, lastUsage(warn)) === null],
    ['другой навык не трогается', typeof closeGate === 'function'
      && closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill: 'dayloop' } }, lastUsage(warn)) === null],
  ];
  rmSync(dir, { recursive: true, force: true });
  let bad = 0;
  for (const [name, ok] of cases) { if (!ok) bad++; console.log(`${ok ? '✓' : '✗'} ${name}`); }
  console.log(bad ? `context-budget: ${bad} из ${cases.length} провалено` : `context-budget: ${cases.length}/${cases.length} ✓ (окно ${WINDOW})`);
  process.exit(bad ? 1 : 0);
}

const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).pop());
if (isDirectRun) {
  if (process.argv.includes('--check')) selfCheck();
  try {
    const input = JSON.parse(readFileSync(0, 'utf8'));
    const sf = stateFile(input.session_id);
    let state = {}; try { state = JSON.parse(readFileSync(sf, 'utf8')); } catch { /* первый вызов */ }
    const usage = lastUsage(input.transcript_path);
    const gate = closeGate(input, usage);
    if (gate) { process.stdout.write(JSON.stringify(gate)); process.exit(0); }
    const d = decide(input, usage, state);
    if (d) {
      const prev = state.step || 0;   // после автосжатия память ступени опускается вместе с долей (см. decide)
      writeFileSync(sf, JSON.stringify({ step: d.step < prev - 5 ? d.step : Math.max(prev, d.step) }));
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: input.hook_event_name, additionalContext: d.text } }));
    }
  } catch { /* молчим: хук никогда не мешает работе */ }
  process.exit(0);
}
