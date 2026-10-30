#!/usr/bin/env node
// autonomy-guard.mjs — хук Claude Code: приказ владельца «работай автономно» держится механикой, а не памятью агента.
// Слово владельца 2026-10-30 ≈09:5x: `[OWNER]` «Я давал тебе команду работать автономно, не задал время, до которого работать - это значит я
// ожидал: ты работаешь автономно; когда окно контекста переполняется - ты начинаешь завершать дела, и начинаешь закрытие чата; по закрытию чата
// пишешь прощальное сообщение» · «Почему так не сработало?». Не сработало, потому что агент сам кончил ход «на удобном месте» при 68 % окна (на
// глаз решил, что контекст большой), не вошёл в /dayloop, а ни один Stop-хук такой остановки не запрещал (KUMM EXP-0379).
//
//   UserPromptSubmit: «работай автономно / работай сам / автопилот» → режим ВКЛ (`.kaif/autonomy.json`); «стоп / пауза / хватит / остановись» в
//                     начале сообщения → ВЫКЛ. Остальные реплики режим не трогают: вопрос посреди автономной работы — ответить и работать дальше.
//   Stop:             режим ВКЛ → остановку не пускает: окно < 75 % — «работай дальше»; ≥ 75 % — «закрывай чат (/end-chat-soft)». Ход, в котором
//                     вызван навык закрытия, пускает и режим выключает. Объявленное исключение — строка `<!-- autonomy-pause: <почему> -->` в
//                     последнем сообщении (всё оставшееся ждёт владельца, и он позван голосом).
//
//   node autonomy-guard.mjs                 # событие на stdin; на любом неожиданном — молча 0
//   node autonomy-guard.mjs --state <файл>  # где маркер (проверки tools/test-guards.mjs, часть K)
//
// [TESTED: 2026-10-30 · testcases/reports/2026-10-30_autonomy-guard-wider-order.md (verdict partial) · arming: part K 13 cases incl. the owner's «гоу автономно», red on the old pattern; the live marker flips on his words · a live Stop refused by the guard: NOT yet observed]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { lastUsage, contextOf, WINDOW, PCT_CLOSE } from '../../.claude/hooks/context-budget.mjs';
import { readTurn } from './farewell-capture.mjs';

// Any «автономно / автономный…» is the order, whatever word stands before it («гоу автономно», «давай автономно», «работай автономно»):
// 2026-10-30 ≈16:00 «гоу автономно, делаем дальше сборку» slipped past the old «работай автономно» pattern and the agent stopped
// (`[OWNER]` «а чего ты стал? … или я не говорил работать автономно?»). A negation right before it («не работай автономно») is not the order.
const ON = /автономн|автопилот|(работай|работать)\s+сам/i;
const NOT_ON = /(^|[\s,.!?])не\s+(работай\s+|работать\s+)?(автономн|сам)/i;
const OFF = /^\s*(стоп|stop|пауза|хватит|остановись)(?=$|[\s,.!?])/i;   // \b в JS не видит границу кириллицы
const PAUSE_MARK = /<!--\s*autonomy-pause:\s*\S/;

export function decideStop({ on, pct, closed, text }) {
  if (!on) return null;
  if (closed) return { off: true };
  if (text && PAUSE_MARK.test(text)) return null;
  if (pct >= PCT_CLOSE) return { block: `autonomy-guard: автономный режим и окно ${pct.toFixed(0)} % ≥ ${PCT_CLOSE} % — закрывай чат: /end-chat-soft (передача дел, коммит, прощальное сообщение — его запишет хук прощания).` };
  return { block: `autonomy-guard: владелец велел работать автономно, окно ${pct.toFixed(0)} % < ${PCT_CLOSE} % — не останавливайся. Бери следующий пункт беклога (/dayloop: STATUS «Where to continue», план 36) и работай; чат закрывается только на ${PCT_CLOSE} % окна или по слову владельца. Всё оставшееся ждёт владельца — позови голосом (node .kaif/tools/contour/review.mjs --call "<что нужно>") и поставь в последнем сообщении <!-- autonomy-pause: <почему> -->.` };
}

function main() {
  const args = process.argv.slice(2);
  const i = args.indexOf('--state');
  const ev = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const state = i >= 0 && args[i + 1] ? args[i + 1] : join(process.env.CLAUDE_PROJECT_DIR || ev.cwd || process.cwd(), '.kaif', 'autonomy.json');
  let st = { on: false };
  try { if (existsSync(state)) st = JSON.parse(readFileSync(state, 'utf8')); } catch { /* битый маркер — выключен */ }

  if (ev.hook_event_name === 'UserPromptSubmit') {
    const p = String(ev.prompt || '');
    if (OFF.test(p)) writeFileSync(state, JSON.stringify({ on: false, at: new Date().toISOString(), by: p.slice(0, 80) }));
    else if (ON.test(p) && !NOT_ON.test(p)) writeFileSync(state, JSON.stringify({ on: true, at: new Date().toISOString(), by: p.slice(0, 80) }));
    return;
  }
  if (ev.hook_event_name !== 'Stop' || !st.on) return;
  const usage = ev.transcript_path ? lastUsage(ev.transcript_path) : null;
  const pct = usage ? (contextOf(usage) / WINDOW) * 100 : 0;
  const turn = ev.transcript_path ? readTurn(readFileSync(ev.transcript_path, 'utf8').split('\n')) : { closed: false, text: '' };
  const text = typeof ev.last_assistant_message === 'string' && ev.last_assistant_message ? ev.last_assistant_message : turn.text;
  const d = decideStop({ on: st.on, pct, closed: turn.closed, text });
  if (!d) return;
  if (d.off) { writeFileSync(state, JSON.stringify({ on: false, at: new Date().toISOString(), by: 'closure skill' })); return; }
  process.stdout.write(JSON.stringify({ decision: 'block', reason: d.block }));
}

try { main(); } catch { /* fail-open */ }
process.exit(0);
