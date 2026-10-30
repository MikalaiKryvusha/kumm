#!/usr/bin/env node
// farewell-capture.mjs — хук Claude Code (Stop): прощальное сообщение закрытого чата ложится в файл
// FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md в корне проекта, целиком заменяя прежнее, — следующий чат читает его в /resume.
// Слово владельца 2026-10-30 ≈07:45: `[OWNER]` «это нужно чтобы по хуку ты записывал в FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md,
// полностью стирая то, что там была, и оставляя только твоё прощальное сообщение» · «Я все равно каждый раз это руками копирую и
// вставляю в новый чат, а так оно будет автоматически в файл собираться».
//
// Как: событие Stop на stdin. Прощание — последний текст хода, в котором вызван навык закрытия (/end-chat-soft или
// /end-chat-force: инструментом Skill или словом владельца «/end-chat-…» в начале хода). Ход — всё, что в журнале
// (transcript_path, JSONL) после последней настоящей реплики владельца. Текст берётся из поля last_assistant_message,
// без него — из журнала: текст ассистента после последнего вызова инструмента в ходе. Ход без закрытия файл не трогает:
// «спасибо» после прощания прощание не затирает. Другой Stop-хук не дал остановиться, агент дописал — файл перепишется
// новым последним текстом (stop_hook_active не пропускаем намеренно).
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
// не обёртка локальной команды CLI (/effort и подобные пишутся как <local-command-caveat>).
function isOwnerPrompt(rec) {
  if (!rec || rec.type !== 'user' || rec.isMeta) return false;
  const bs = blocks(contentOf(rec));
  if (!bs.length || bs.some((b) => b.type === 'tool_result')) return false;
  const text = bs.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
  return Boolean(text.trim()) && !text.startsWith('<local-command-caveat>');
}

// → { closed, text }: был ли в последнем ходе навык закрытия, и последний текст хода по журналу.
export function readTurn(lines) {
  const recs = [];
  for (const l of lines) { if (!l.trim()) continue; try { recs.push(JSON.parse(l)); } catch { /* битая строка журнала */ } }
  let start = 0;
  for (let i = recs.length - 1; i >= 0; i--) if (isOwnerPrompt(recs[i])) { start = i; break; }
  const turn = recs.slice(start);
  let closed = false, tail = [];
  for (const rec of turn) {
    const bs = blocks(contentOf(rec));
    if (rec.type === 'user') {
      const text = bs.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
      if (!rec.isMeta && CLOSURE_COMMAND.test(text)) closed = true;
      if (bs.some((b) => b.type === 'tool_result')) tail = [];
      continue;
    }
    if (rec.type !== 'assistant') continue;
    for (const b of bs) {
      if (b.type === 'tool_use') {
        if (b.name === 'Skill' && b.input && CLOSURE_SKILL.test(String(b.input.skill || '').trim())) closed = true;
        tail = [];
      } else if (b.type === 'text' && b.text && b.text.trim()) tail.push(b.text);
    }
  }
  return { closed, text: tail.join('\n\n').trim() };
}

function main() {
  const args = process.argv.slice(2);
  const outArg = args.indexOf('--out');
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  if (!event.transcript_path) return;
  const turn = readTurn(readFileSync(event.transcript_path, 'utf8').split('\n'));
  if (!turn.closed) return;
  const text = (typeof event.last_assistant_message === 'string' && event.last_assistant_message.trim())
    ? event.last_assistant_message.trim() : turn.text;
  if (!text) return;
  const out = outArg >= 0 && args[outArg + 1] ? args[outArg + 1]
    : join(process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd(), FAREWELL_FILE);
  // Через временный файл и переименование: оборванная запись не оставит следующему чату половину прощания.
  const tmp = out + '.tmp';
  writeFileSync(tmp, text + '\n', 'utf8');
  renameSync(tmp, out);
}

try { main(); } catch { /* fail-open: хук никогда не мешает остановке */ }
process.exit(0);
