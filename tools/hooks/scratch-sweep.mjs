#!/usr/bin/env node
// scratch-sweep.mjs — хук Claude Code (SessionStart): агент убирает за собой. Черновики прошлых сессий этого проекта
// (`<TEMP>/claude/<проект>/<id сессии>/`), в которые никто не писал дольше суток, удаляются по одному файлу, затем пустые папки.
// Слово владельца 2026-10-30 ≈10:5x: `[OWNER]` «и как-то нужно, чтобы ИИ агенты сами за собой прибирались...» · «если оно нужно для
// работы - ок» · «если работа сделана, и оно больше не нужно - хорошо бы удалять мусор». Повод: на D: осталось 8 ГБ свободных,
// 168 ГБ лежало в черновиках закрытых сессий (распаковки паков Конана, копии, кадры) — ценности не нашлось (проверено по байтам).
//
//   SessionStart (startup): удалить черновики чужих сессий старше IDLE_HOURS; текущую сессию не трогать; итог — в контекст агента.
//   Что нужно следующему чату, живёт в репозитории (STATUS, plans/, researches/, пак), а не в черновике — HOUSE_RULES §1 п. 15.
//
//   node scratch-sweep.mjs                              # событие на stdin; на любом неожиданном — молча 0
//   node scratch-sweep.mjs --root <dir> --session <id>  # проверки tools/test-guards.mjs, часть L
//   node scratch-sweep.mjs --dry-run                    # только список: что ушло бы
//
// @guard scratch-sweep
// THREAT:         закрытые сессии оставляют десятки гигабайт рабочих файлов, диск D: переполняется, владелец чистит руками
// PROVED-AGAINST: tools/test-guards.mjs часть L — старая сессия удалена, свежая и текущая (даже старая) целы, корень вне <TEMP>/claude
//                 отвергнут, мусор на stdin — выход 0; мутант «без проверки текущей сессии» красный
// GAP:            сессию, поставленную на /pause дольше суток, хук тоже уберёт — поэтому правило: нужное — в репозиторий; жёсткие ссылки
//                 удаляются как имена, место возвращается, только если других имён у файла нет
// ON-REAL-PATH:   NOT YET — 2026-10-30 10:35 a SessionStart event on the real root with --dry-run named 24 idle (empty) session dirs and
//                 kept 23 fresh ones, this session among them; wiring in .claude/settings.local.json waits for the owner (the auto-mode
//                 classifier refused the agent's own settings edit)
// [NOT-TESTED]
import { readFileSync, readdirSync, statSync, lstatSync, unlinkSync, rmdirSync, existsSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';

const IDLE_HOURS = 24;   // сутки тишины = сессия закрыта; /pause дольше суток — нужное уже в репозитории (HOUSE_RULES §1 п. 15)
const HOUR_MS = 3600 * 1000;

// Папка проекта в черновиках Claude Code: D:\work\ai_sandbox\KUMM → d--work-ai-sandbox-KUMM (всё, кроме букв и цифр, — дефис).
export const projectSlug = (cwd) => String(cwd).replace(/[^A-Za-z0-9]/g, '-');

// Самое свежее время записи в дереве (файлы и папки): удаление файла меняет время папки — это тоже «запись».
function newest(dir) {
  let t = lstatSync(dir).mtimeMs, n = 0, bytes = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { const r = newest(p); t = Math.max(t, r.t); n += r.n; bytes += r.bytes; }
    else { const s = lstatSync(p); t = Math.max(t, s.mtimeMs); n++; bytes += s.size; }
  }
  return { t, n, bytes };
}

// Удаление перечислением: каждый файл — unlink, потом пустые папки снизу вверх (рекурсивное удаление одной командой запрещено).
function removeByEnumeration(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) removeByEnumeration(p); else unlinkSync(p);
  }
  rmdirSync(dir);
}

export function sweep({ root, session, now = Date.now(), dryRun = false, idleHours = IDLE_HOURS }) {
  const base = resolve(tmpdir(), 'claude') + sep;
  if (!resolve(root).startsWith(base) && !process.env.SCRATCH_SWEEP_ANY_ROOT) return { refused: `корень вне ${base}` };
  if (!existsSync(root)) return { removed: [], kept: [] };
  const removed = [], kept = [];
  for (const e of readdirSync(root, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const dir = join(root, e.name);
    if (e.name === session) { kept.push({ id: e.name, why: 'текущая' }); continue; }
    const r = newest(dir);
    if (now - r.t < idleHours * HOUR_MS) { kept.push({ id: e.name, why: 'свежая' }); continue; }
    if (!dryRun) removeByEnumeration(dir);
    removed.push({ id: e.name, files: r.n, bytes: r.bytes });
  }
  return { removed, kept };
}

function main() {
  const a = process.argv.slice(2);
  const opt = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
  let ev = {};
  if (!a.includes('--root')) { try { ev = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { return; } }
  if (ev.hook_event_name && ev.hook_event_name !== 'SessionStart') return;
  if (ev.source && ev.source !== 'startup') return;
  const cwd = process.env.CLAUDE_PROJECT_DIR || ev.cwd || process.cwd();
  const root = opt('--root') || join(tmpdir(), 'claude', projectSlug(cwd));
  const res = sweep({ root, session: opt('--session') || ev.session_id, dryRun: a.includes('--dry-run') });
  if (res.refused) { process.stdout.write(`scratch-sweep: отказ — ${res.refused}\n`); return; }
  const gb = res.removed.reduce((s, r) => s + r.bytes, 0) / 2 ** 30;
  const head = a.includes('--dry-run') ? 'ушло бы' : 'убрано';
  const line = res.removed.length
    ? `scratch-sweep: ${head} черновиков прошлых сессий — ${res.removed.length} (${res.removed.reduce((s, r) => s + r.files, 0)} файлов, ${gb.toFixed(1)} ГБ по размерам файлов); оставлено ${res.kept.length}.`
    : `scratch-sweep: черновиков старше ${IDLE_HOURS} ч нет; оставлено ${res.kept.length}.`;
  process.stdout.write(line + '\n');
}

try { main(); } catch { /* fail-open: хук сессию не роняет */ }
