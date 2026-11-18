#!/usr/bin/env node
// ru-reply-check.mjs — Stop hook: the agent's Russian text of the turn is checked by the owner's stylometric core (§8, genre `reply`)
// before the turn ends. Why: the core existed and did not help — it was never loaded at the moment of writing and nothing read the chat
// (the owner 2026-11-18 09:05–09:06, «проект стилометрического ядра пока что НЕ РАБОТАЕТ» · «с ним должен писать красиво»; KUMM plans/58,
// criterion 6). The rules live in ONE place — `krinik-stylometry/AUTHOR_STYLOMETRY.md` §8, read through the core's own `tools/voice-check.mjs`.
//
// Behaviour: every Stop reads the assistant text since the last real user prompt, logs `{at, chars, hits}` to `.work/ru-reply-log.jsonl`
// (the measure: hits per reply over days), and on a hit blocks ONCE with the list (the agent writes a corrected message); a second Stop
// in the same chain (`stop_hook_active`) only logs. A line carrying `<!-- ru-ok: <reason> -->` is not checked (a quoted defect, a citation).
// Self-test: node tools/hooks/ru-reply-check.mjs --selftest
// [TESTED: 2026-11-18 · selftest 5/5; first live catch 09:29 («поэтому» in the agent's reply, corrected); a judge replayed 13 real turns of three
//  transcripts, no loop, 52 MB transcript parsed in 309 ms · KUMM testcases/reports/2026-11-18_conan-launcher-judge4-fixes.md lists the stand of the day]
import { readFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CORE = join(ROOT, 'krinik-stylometry', 'AUTHOR_STYLOMETRY.md');
const CHECKER = join(ROOT, 'krinik-stylometry', 'tools', 'voice-check.mjs');
const LOG = join(ROOT, '.work', 'ru-reply-log.jsonl');

function isRealPrompt(rec) {
  // isMeta: a skill body, a Stop hook's feedback — the harness's records, not the owner's prompt (seen in this chat's transcript 2026-11-18).
  if (rec.type !== 'user' || !rec.message || rec.isMeta) return false;
  const c = rec.message.content;
  if (typeof c === 'string') return c.trim().length > 0;
  return Array.isArray(c) && c.some((p) => p && p.type === 'text') && !c.some((p) => p && p.type === 'tool_result');
}

/** The assistant's text blocks after the last real user prompt. */
export function turnText(transcript) {
  const recs = [];
  for (const line of transcript.split('\n')) {
    if (!line.trim()) continue;
    try { recs.push(JSON.parse(line)); } catch { /* a partial line */ }
  }
  let start = 0;
  for (let i = recs.length - 1; i >= 0; i--) if (isRealPrompt(recs[i])) { start = i + 1; break; }
  const parts = [];
  for (const rec of recs.slice(start)) {
    if (rec.type !== 'assistant' || !rec.message) continue;
    const c = rec.message.content;
    if (typeof c === 'string') parts.push(c);
    else if (Array.isArray(c)) for (const p of c) if (p && p.type === 'text' && p.text) parts.push(p.text);
  }
  return parts.join('\n');
}

export async function check(text) {
  const { parseCore, lint } = await import(pathToFileURL(CHECKER).href);
  const rules = parseCore(readFileSync(CORE, 'utf8'));
  const kept = text.split('\n').map((l) => (l.includes('<!-- ru-ok:') ? '' : l)).join('\n');
  return { rules: rules.length, hits: lint(kept, rules, 'reply') };
}

async function selftest() {
  const t = [];
  const bad = await check('Это не просто фильм, это опыт.\nОтличный вопрос! Исследования показывают, что это важно.');
  t.push(['defective lines are caught', bad.hits.length >= 4]);
  const good = await check('Сборка является набором модов.\nЭто не просто так.\nЗапушил код в закрытый репозиторий.');
  t.push(['legal lines pass', good.hits.length === 0]);
  const marked = await check('Пример дефекта: «это не просто фильм» <!-- ru-ok: quoted defect -->');
  t.push(['a marked line is skipped', marked.hits.length === 0]);
  const tr = [
    JSON.stringify({ type: 'user', message: { content: 'старый вопрос' } }),
    JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'старый ответ не просто так' }] } }),
    JSON.stringify({ type: 'user', message: { content: 'новый вопрос' } }),
    JSON.stringify({ type: 'user', isMeta: true, message: { content: [{ type: 'text', text: 'Base directory for this skill' }] } }),
    JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'первый блок' }, { type: 'tool_use', name: 'Bash' }] } }),
    JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', content: 'вывод' }] } }),
    JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'второй блок' }] } }),
  ].join('\n');
  const got = turnText(tr);
  t.push(['the turn starts at the last real prompt, tool results do not reset it', got === 'первый блок\nвторой блок']);
  t.push(['the core has rules', bad.rules >= 30]);
  const fails = t.filter(([, ok]) => !ok);
  for (const [name, ok] of t) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
  console.log(fails.length ? `ru-reply-check self-test: ${fails.length} of ${t.length} failed` : `ru-reply-check self-test: ${t.length}/${t.length}`);
  return fails.length === 0;
}

if (process.argv.includes('--selftest')) {
  process.exit((await selftest()) ? 0 : 1);
}

try {
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  // The transcript keeps only part of the turn's text (a text block sent together with a tool call was not in it, 2026-11-18), so the
  // final message the harness hands to the hook is checked always, the transcript's text of the turn in addition.
  const last = typeof event.last_assistant_message === 'string' ? event.last_assistant_message.trim() : '';
  // A missing or unreadable transcript must not leave the final message unchecked (judge 2026-11-18, risk 5).
  let fromTranscript = '';
  try { fromTranscript = event.transcript_path ? turnText(readFileSync(event.transcript_path, 'utf8')).trim() : ''; } catch { fromTranscript = ''; }
  // Trimmed on both sides: a trailing newline made the same defect count twice (judge 2026-11-18, item 4).
  const text = fromTranscript.includes(last) ? fromTranscript : [fromTranscript, last].filter(Boolean).join('\n');
  if (!/[а-яё]/i.test(text)) process.exit(0);
  const { hits } = await check(text);
  mkdirSync(dirname(LOG), { recursive: true });
  appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), chars: text.length, hits: hits.map((h) => h.fragment), repeat: !!event.stop_hook_active }) + '\n');
  if (hits.length && !event.stop_hook_active) {
    const list = hits.slice(0, 12).map((h) => `«${h.fragment}» — ${h.hint}`).join('\n');
    process.stdout.write(JSON.stringify({
      decision: 'block',
      reason: `ru-reply-check: в русском тексте этого хода сторож ядра (§8, жанр reply) нашёл ${hits.length}:\n${list}\n` +
        'Напиши владельцу короткое исправление этих мест (правило 35 HOUSE_RULES, план 58). Цитата чужого дефекта помечается <!-- ru-ok: причина -->.',
    }));
  }
  process.exit(0);
} catch (e) {
  // A broken guard must not look like a clean reply: the error goes to the same log the measure is read from.
  try { mkdirSync(dirname(LOG), { recursive: true }); appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), error: String(e && e.message || e) }) + '\n'); } catch { /* no disk */ }
  process.exit(0);
}
