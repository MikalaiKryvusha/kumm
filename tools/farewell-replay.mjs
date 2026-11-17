#!/usr/bin/env node
// farewell-replay.mjs — прогон прощального хука (tools/hooks/farewell-capture.mjs) по НАСТОЯЩЕМУ журналу чата так, как его видел живой хук:
// остановка за остановкой. Журнал режется по каждой записи `system:stop_hook_summary` (Claude Code пишет её после Stop-хуков каждой остановки)
// и по последней записи; хук получает урезанный журнал и last_assistant_message — последний текст ассистента до этой точки, как в живом событии Stop.
// После каждой остановки печатается, что лежит в файле прощания. Зачем: баг 103 — живой хук писал промежуточную строку и пропускал прощание,
// а прогон целого журнала одним Stop этого не показывает (2026-11-17: целый журнал b9342015 дал верное прощание, живой файл держал «Окно контекста 70 %…»).
//
//   node tools/farewell-replay.mjs <журнал.jsonl> [--hook <путь к хуку>] [--quiet]
//   код 0 — прогон прошёл; последняя строка «FINAL: …» — что осталось в файле после последней остановки
//
// Рабочие файлы — в .work/farewell/ (правило 15 HOUSE_RULES), удаляются в конце прогона. [NOT-TESTED]
import { readFileSync, writeFileSync, mkdirSync, rmSync, rmdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const src = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--hook');
const hi = args.indexOf('--hook');
const HOOK = hi >= 0 ? args[hi + 1] : join(ROOT, 'tools', 'hooks', 'farewell-capture.mjs');
const quiet = args.includes('--quiet');
if (!src || !existsSync(src)) { console.error('usage: node tools/farewell-replay.mjs <transcript.jsonl> [--hook <file>] [--quiet]'); process.exit(2); }

const WORK = join(ROOT, '.work', 'farewell', 'replay-' + process.pid);   // per run: two replays at once never share files (judge 2026-11-17)
mkdirSync(WORK, { recursive: true });
const OUT = join(WORK, 'farewell.md');
const CUT = join(WORK, 'cut.jsonl');
for (const f of [OUT, OUT + '.state', CUT]) rmSync(f, { force: true });

const lines = readFileSync(src, 'utf8').split('\n');
const recs = lines.map((l) => { try { return l.trim() ? JSON.parse(l) : null; } catch { return null; } });
const stops = [];
recs.forEach((r, i) => { if (r && r.type === 'system' && r.subtype === 'stop_hook_summary') stops.push(i); });
if (stops[stops.length - 1] !== lines.length - 1) stops.push(lines.length - 1);

const lastText = (upto) => {
  for (let i = upto; i >= 0; i--) {
    const r = recs[i];
    if (!r || r.type !== 'assistant') continue;
    const c = r.message && r.message.content;
    const t = (Array.isArray(c) ? c : []).filter((b) => b && b.type === 'text' && b.text && b.text.trim()).map((b) => b.text).join('\n\n');
    if (t) return t;
  }
  return '';
};
const short = (s) => s.replace(/\s+/g, ' ').slice(0, 90);

let prev = '';
for (const k of stops) {
  // up to the stop record, without it: the live hook runs BEFORE Claude Code writes that stop's summary (the last line is kept — no summary there)
  const end = recs[k] && recs[k].type === 'system' && recs[k].subtype === 'stop_hook_summary' ? k : k + 1;
  writeFileSync(CUT, lines.slice(0, end).join('\n') + '\n', 'utf8');
  const event = { transcript_path: CUT, last_assistant_message: lastText(k), hook_event_name: 'Stop' };
  execFileSync(process.execPath, [HOOK, '--out', OUT], { input: JSON.stringify(event) });
  const now = existsSync(OUT) ? readFileSync(OUT, 'utf8').trim() : '';
  if (!quiet) console.log(`stop @${k}: last «${short(event.last_assistant_message)}» → file ${now === prev ? 'unchanged' : 'WRITTEN'}: «${short(now)}»`);
  prev = now;
}
console.log(`FINAL: «${short(prev)}»`);
for (const f of [OUT, OUT + '.state', CUT]) rmSync(f, { force: true });
try { rmdirSync(WORK); } catch { /* not empty or gone */ }
