#!/usr/bin/env node
// farewell-capture.mjs — хук Claude Code (Stop): прощальное сообщение закрытого чата ложится в файл
// FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md в корне проекта, целиком заменяя прежнее, — следующий чат читает его в /resume.
// Слово владельца 2026-10-30 ≈07:45: `[OWNER]` «это нужно чтобы по хуку ты записывал в FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md,
// полностью стирая то, что там была, и оставляя только твоё прощальное сообщение» · «Я все равно каждый раз это руками копирую и
// вставляю в новый чат, а так оно будет автоматически в файл собираться».
//
// Как: событие Stop на stdin. Прощание — последний текст хода, в котором ПРИНЯТ вызов навыка закрытия (/end-chat-soft или
// /end-chat-force: инструментом Skill — отказанный хуком context-budget не в счёт — или словом владельца «/end-chat-…» в начале хода). Ход — всё, что в журнале
// (transcript_path, JSONL) после последней настоящей реплики владельца. Текст берётся из поля last_assistant_message,
// без него — из журнала: текст ассистента после последнего вызова инструмента в ходе. Ход без закрытия файл не трогает:
// «спасибо» после прощания прощание не затирает. Повторная остановка того же хода (stop_hook_active — другой Stop-хук не дал
// остановиться: knowledge-hook «есть ли новое знание?», страж STATUS) файл НЕ переписывает: агент отвечает на хук строкой
// «новых знаний нет», и она затёрла бы прощание. Вопрос владельца 2026-10-30 ≈08:26: «оно не будет конфликтовать с сообщением о
// записе знаний чата?» — будет, этот же ход в чате показал: knowledge-hook и страж STATUS остановили финал.
//
//   node farewell-capture.mjs                 # событие Stop на stdin; на любом неожиданном — молча 0: хук не ломает сессию
//   node farewell-capture.mjs --out <файл>    # куда писать (проверки tools/test-guards.mjs, часть J)
//
// [NOT-TESTED] живое событие Stop закрытия чата ещё не наблюдалось; часть J test-guards — гигиена на собранных журналах
import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';

export const FAREWELL_FILE = 'FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md';
const CLOSURE_SKILL = /^(?:[\w-]+:)?end-chat-(?:soft|force)$/;
const CLOSURE_COMMAND = /<command-name>\/?end-chat-(?:soft|force)<\/command-name>/;

const contentOf = (rec) => (rec && rec.message ? rec.message.content : undefined);
const blocks = (c) => (Array.isArray(c) ? c.filter(Boolean) : typeof c === 'string' ? [{ type: 'text', text: c }] : []);

// Настоящая реплика владельца: user, не служебная (isMeta — тело навыка, напоминания), не результат инструмента,
// не обёртка локальной команды CLI (/effort и подобные пишутся как <local-command-caveat>). Уведомление фоновой задачи (<task-notification>,
// user с isMeta false) ход РВЁТ — известная дыра: прощание, написанное после ожидания фонового судьи, теряется, автосжатие рвёт ход так же;
// попытка 2026-11-14 не считать уведомление репликой дала регресс (старое закрытие гасило новый приказ владельца, пришедший очередью) и
// откатана — bugs/103_farewell_capture_turn_split_by_notification_and_compaction.md.
const NOT_OWNER = /^\s*<local-command-caveat>/;
function isOwnerPrompt(rec) {
  if (!rec || rec.type !== 'user' || rec.isMeta) return false;
  const bs = blocks(contentOf(rec));
  if (!bs.length || bs.some((b) => b.type === 'tool_result')) return false;
  const text = bs.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
  return Boolean(text.trim()) && !NOT_OWNER.test(text);
}

// → { closed, text }: был ли в последнем ходе навык закрытия, и последний текст хода по журналу.
export function readTurn(lines) {
  const recs = [];
  for (const l of lines) { if (!l.trim()) continue; try { recs.push(JSON.parse(l)); } catch { /* битая строка журнала */ } }
  let start = 0;
  for (let i = recs.length - 1; i >= 0; i--) if (isOwnerPrompt(recs[i])) { start = i; break; }
  const turn = recs.slice(start);
  // Отклонённый вызов навыка закрытия — не закрытие: ворота хука context-budget отказывают /end-chat-force ниже 92 % (и мягкому ниже 80 %), и такой
  // отказ раньше выключал автономный режим и писал ложное прощание (судья 2026-11-14 22:4x, проверено фикстурой на 86 %). Закрытие навыком считается,
  // только пока его tool_result не пришёл с is_error. Отказ гасит ТОЛЬКО свой вызов: принятое раньше мягкое закрытие и отказанное потом срочное — это
  // закрытие (судья, раунд 2: иначе прощание терялось, а страж автономности гнал церемонию заново). Вызов без ответа (нет id) — считается.
  // [TESTED: 2026-11-14 · testcases/reports/2026-11-14_context-budget-soft-80-force-92.md · test-guards J, K]
  // Вызовов в полёте может быть несколько (параллельная пачка: мягкое и срочное одним сообщением — судья, раунд 3): каждый ждёт СВОЙ ответ.
  let byCommand = '', accepted = '', tail = [];
  const pending = [];
  for (const rec of turn) {
    const bs = blocks(contentOf(rec));
    if (rec.type === 'user') {
      const text = bs.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
      if (!rec.isMeta && CLOSURE_COMMAND.test(text)) byCommand = String(rec.uuid || 'command');
      for (const b of bs) {
        const i = b.type === 'tool_result' ? pending.indexOf(b.tool_use_id) : -1;
        if (i < 0) continue;
        if (b.is_error !== true) accepted = pending[i];
        pending.splice(i, 1);
      }
      if (bs.some((b) => b.type === 'tool_result')) tail = [];
      continue;
    }
    if (rec.type !== 'assistant') continue;
    for (const b of bs) {
      if (b.type === 'tool_use') {
        if (b.name === 'Skill' && b.input && CLOSURE_SKILL.test(String(b.input.skill || '').trim())) pending.push(String(b.id || 'skill:' + (rec.uuid || '')));
        tail = [];
      } else if (b.type === 'text' && b.text && b.text.trim()) tail.push(b.text);
    }
  }
  const closureId = pending[pending.length - 1] || accepted || byCommand;
  return { closed: Boolean(closureId), closureId, text: tail.join('\n\n').trim() };
}

function main() {
  const args = process.argv.slice(2);
  const outArg = args.indexOf('--out');
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  // stop_hook_active НЕ причина молчать: он стоит и на ПЕРВОЙ остановке после закрытия, если раньше в том же ходе другой Stop-хук не
  // пустил остановку (2026-10-30 11:4x: закрытие после отказов стража автономности — прощание не записалось, владелец: «опять расходится
  // твое сообщение с тем, что в FAREWELL_MESSAGE…»). Защита от «новых знаний нет» — номер закрытия: одно закрытие пишет файл один раз.
  if (!event.transcript_path) return;
  const turn = readTurn(readFileSync(event.transcript_path, 'utf8').split('\n'));
  if (!turn.closed) return;
  const stateFile = (outArg >= 0 && args[outArg + 1] ? args[outArg + 1] : join(process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd(), FAREWELL_FILE)) + '.state';
  let seen = '';
  try { seen = JSON.parse(readFileSync(stateFile, 'utf8')).closureId || ''; } catch { /* нет записи */ }
  if (turn.closureId && seen === turn.closureId) return;   // вторая остановка того же закрытия
  const text = (typeof event.last_assistant_message === 'string' && event.last_assistant_message.trim())
    ? event.last_assistant_message.trim() : turn.text;
  if (!text) return;
  const out = outArg >= 0 && args[outArg + 1] ? args[outArg + 1]
    : join(process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd(), FAREWELL_FILE);
  // Через временный файл и переименование: оборванная запись не оставит следующему чату половину прощания.
  const tmp = out + '.tmp';
  writeFileSync(tmp, text + '\n', 'utf8');
  renameSync(tmp, out);
  writeFileSync(stateFile, JSON.stringify({ closureId: turn.closureId, at: new Date().toISOString() }));
}

// Прямой запуск — хук; импорт (autonomy-guard берёт readTurn) — только функции, без чтения stdin и выхода.
const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1].split(/[\\/]/).pop());
if (isDirectRun) {
  try { main(); } catch { /* fail-open: хук никогда не мешает остановке */ }
  process.exit(0);
}
