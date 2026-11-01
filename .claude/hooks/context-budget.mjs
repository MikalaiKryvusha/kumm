#!/usr/bin/env node
// context-budget — хук Claude Code «окно контекста кончается: доводи работу до среза и закрывай чат».
// На UserPromptSubmit и PreToolUse читает хвост транскрипта сессии (`transcript_path`), берёт `usage` последнего ответа
// основной сессии (ответы субагентов, `isSidechain`, пропускает) и считает контекст =
// input_tokens + cache_read_input_tokens + cache_creation_input_tokens. Доля от окна WINDOW:
//   < PCT_WARN — молчит; ≥ PCT_WARN и ≥ PCT_CLOSE — ТОЛЬКО предупреждения «работай дальше» (слово владельца 2026-10-31 21:26);
//   ≥ PCT_FORCE — «закрывай чат», строка на КАЖДОМ вызове.
// Шум: на PreToolUse строка уходит только при переходе в новую ступень по 5 % (память ступени — файл сессии в tmp);
// на UserPromptSubmit — всегда, пока доля ≥ PCT_WARN. Никогда не блокирует; при любой ошибке молчит (exit 0 без вывода).
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
export const PCT_FORCE = 85;

// Что агенту делать при закрытии — ритуалы KUMM (навыки закрытия в .claude/skills/end-chat-*).
export const CLOSE_SOFT = 'запусти /end-chat-soft: передача дел в STATUS.md («Where to continue» — что сделано, что в работе, с чего '
  + 'продолжить), коммит и пуш KUMM, пак Конана — `git push origin main`, игру своего прогона закрыть, замок машины снять; '
  + 'затем одной строкой скажи владельцу, что чат пора сменить на новый';
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

export function message(tokens, pct) {
  const head = `context-budget · контекст ≈ ${Math.round(tokens / 1000)} тыс. токенов = ${pct.toFixed(1)} % окна ${WINDOW / 1000} тыс.`;
  if (pct >= PCT_FORCE) return `${head} СРОЧНО ЗАКРЫВАЙ ЧАТ: до автосжатия считанные шаги. Текущую работу не доводи, ничего `
    + `нового не начинай; следующим действием ${CLOSE_FORCE}.`;
  // 70 % и 75 % — ТОЛЬКО предупреждение, работа идёт дальше: `[OWNER]` «на 70 и 75 я просил лишь предупреждать, а не закрываться» ·
  // «ты слишком рано закрываешься» · 2026-10-31 21:26 (агент свернулся на 70 %). Закрытие — на PCT_FORCE.
  if (pct >= PCT_CLOSE) return `${head} Предупреждение (второе): работай дальше в обычном темпе, держи STATUS.md свежим после каждого `
    + `среза. Чат закрывается только на ${PCT_FORCE} %.`;
  return `${head} Предупреждение: работай дальше; чат закрывается только на ${PCT_FORCE} %.`;
}

// Решение: что сказать (или null). state — { step } из файла сессии; возвращает { text, step }.
export function decide(input, usage, state = {}) {
  if (!usage) return null;
  const tokens = contextOf(usage), pct = (tokens / WINDOW) * 100;
  if (pct < PCT_WARN) return null;
  const step = Math.floor(pct / 5) * 5;
  // На ≥ PCT_FORCE строка идёт на каждом вызове: срочный приказ не прячется за памятью ступени.
  if (input.hook_event_name === 'PreToolUse' && pct < PCT_FORCE && (state.step || 0) >= step) return null;
  return { text: message(tokens, pct), step };
}

// Ворота закрытия: вызов /end-chat-force или /end-chat-soft при окне < PCT_FORCE отклоняется, если в аргументах навыка нет слова владельца
// («owner: «…»» — его дословная просьба закрыть). 2026-11-01 23:43: я закрыл чат на 68 % «по ощущению предела»; `[OWNER]` «ты опять слишком рано чат
// закрыл, 28% еще свободно окна мне показывает твой харнес» · «И ХУК ИСПРАВЬ». Возвращает объект ответа хука (deny) или null.
export function closeGate(input, usage) {
  if (input.hook_event_name !== 'PreToolUse' || input.tool_name !== 'Skill') return null;
  const ti = input.tool_input || {};
  if (!/^end-chat-(force|soft)$/.test(String(ti.skill || ''))) return null;
  if (/owner:\s*«[^»]+»/.test(String(ti.args || ''))) return null;
  if (!usage) return null;                                    // нечем мерить — не мешаем
  const pct = (contextOf(usage) / WINDOW) * 100;
  if (pct >= PCT_FORCE) return null;
  return { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny',
    permissionDecisionReason: `context-budget: окно ${pct.toFixed(1)} % < ${PCT_FORCE} % — закрывать чат рано, работай дальше. `
      + `Закрытие — только на ${PCT_FORCE} % по числу этого хука или по слову владельца: args «owner: «<его дословная просьба закрыть>»».` } };
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
  const force = write('force.jsonl', [asst(86)]);
  const side = write('side.jsonl', [asst(33), asst(95, { isSidechain: true })]);
  const pad = 'x'.repeat(200);
  const big = write('big.jsonl', [asst(95), ...Array.from({ length: 30000 }, () => line({ type: 'user', pad })), asst(10)]);
  const pctOf = (p, tail) => contextOf(lastUsage(p, tail)) / WINDOW * 100;
  const U = { hook_event_name: 'UserPromptSubmit' }, P = { hook_event_name: 'PreToolUse' };
  const cases = [
    ['33 % молчит', decide(U, lastUsage(low)) === null],
    // 2026-10-31 21:26 — слово владельца: на 70 и 75 % только предупреждать; эти два случая раньше требовали «закрывай» на 75 %
    ['72 % предупреждение: работай дальше', /работай дальше/.test(decide(U, lastUsage(warn))?.text || '')
      && !/закрыва[йт]|ЗАКРЫВА[ЙТ]|end-chat/.test((decide(U, lastUsage(warn))?.text || '').replace(/закрывается только на/, ''))],
    ['78 % предупреждение, не приказ закрыть', /работай дальше/.test(decide(U, lastUsage(close))?.text || '')
      && !/ЗАКРЫВАЙ|ПОРА ЗАКРЫВАТЬ|end-chat/.test(decide(U, lastUsage(close))?.text || '')],
    ['78 % — ещё не срочно', !/СРОЧНО/.test(decide(U, lastUsage(close))?.text || '')],
    ['86 % срочный приказ', /СРОЧНО ЗАКРЫВАЙ ЧАТ/.test(decide(U, lastUsage(force))?.text || '')],
    ['86 % на PreToolUse говорит и в той же ступени', /СРОЧНО/.test(decide(P, lastUsage(force), { step: 85 })?.text || '')],
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
    ['закрытие на 86 % разрешено', typeof closeGate === 'function'
      && closeGate({ hook_event_name: 'PreToolUse', tool_name: 'Skill', tool_input: { skill: 'end-chat-soft' } }, lastUsage(force)) === null],
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
      writeFileSync(sf, JSON.stringify({ step: Math.max(state.step || 0, d.step) }));
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: input.hook_event_name, additionalContext: d.text } }));
    }
  } catch { /* молчим: хук никогда не мешает работе */ }
  process.exit(0);
}
