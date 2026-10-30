#!/usr/bin/env node
// context-budget — хук Claude Code «окно контекста кончается: доводи работу до среза и закрывай чат».
// На UserPromptSubmit и PreToolUse читает хвост транскрипта сессии (`transcript_path`), берёт `usage` последнего ответа
// основной сессии (ответы субагентов, `isSidechain`, пропускает) и считает контекст =
// input_tokens + cache_read_input_tokens + cache_creation_input_tokens. Доля от окна WINDOW:
//   < PCT_WARN — молчит; ≥ PCT_WARN — «новое большое не начинай»; ≥ PCT_CLOSE — «доведи до среза и закрывай чат»;
//   ≥ PCT_FORCE — «бросай текущее, закрывайся сейчас», строка на КАЖДОМ вызове.
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
  if (pct >= PCT_CLOSE) return `${head} ПОРА ЗАКРЫВАТЬ ЧАТ: доведи текущую работу до ближайшего логического среза, новое не `
    + `начинай, затем ${CLOSE_SOFT}.`;
  return `${head} Новую большую работу не начинай: доводи текущую до логического среза — на ${PCT_CLOSE} % пора закрывать чат.`;
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
    ['72 % подсказка', /доводи текущую до логического среза/.test(decide(U, lastUsage(warn))?.text || '')],
    ['78 % приказ закрыть', /ПОРА ЗАКРЫВАТЬ ЧАТ/.test(decide(U, lastUsage(close))?.text || '')],
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
    const d = decide(input, lastUsage(input.transcript_path), state);
    if (d) {
      writeFileSync(sf, JSON.stringify({ step: Math.max(state.step || 0, d.step) }));
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: input.hook_event_name, additionalContext: d.text } }));
    }
  } catch { /* молчим: хук никогда не мешает работе */ }
  process.exit(0);
}
