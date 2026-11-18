#!/usr/bin/env node
// contour-page-lock.mjs — PreToolUse (Write | Edit | MultiEdit): a document of the interactive contour is not edited while its page holds it.
// Why: 2026-11-18 13:54 the agent wrote the answer into interview #039 while the owner typed it on the open page; his save got 409, the answer
// survived only in the window's storage (PROJECT_HISTORY entry 2026-11-18 13:55, EXP-0564, HOUSE_RULES 36.3). A page that is open — or whose
// answer waits to be picked up — owns its document: `interviews/decisions/<doc>.lock` (or the decisions folder of `homeworks/`) exists.
// The queue page (`_queue.lock`) owns every document too. What to do instead: an answer that came in chat → `node .kaif/tools/contour/review.mjs <doc> --close`, then edit; a page whose server died →
// `node .kaif/tools/contour/review.mjs --queue --list` picks the saved answer up and releases the lock.
// Self-test: node tools/hooks/contour-page-lock.mjs --selftest
// [TESTED: 2026-11-18 · selftest 4/4; driven on the real interview #039 with and without a lock (exit 2 / 0); refused a live Edit through the harness · testcases/reports/2026-11-18_russian-norms-guards.md]
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * The lock file that owns this document, or null. Documents live in `interviews/` and `homeworks/`; review.mjs writes EVERY lock into one
 * folder (`contour.decisionsDir` of `.kaif/kaif.json`, default `interviews/decisions`) as `<basename>.lock`, and the queue page holds
 * `_queue.lock` while it serves every document with its answer form (judge 2026-11-18, defects 1 and 2).
 */
export function lockFor(file, root = ROOT) {
  const rel = relative(root, String(file || '')).replace(/\\/g, '/');
  const m = /^(interviews|homeworks)\/([^/]+)\.md$/i.exec(rel);
  if (!m) return null;
  let dir = 'interviews/decisions';
  try { dir = JSON.parse(readFileSync(join(root, '.kaif', 'kaif.json'), 'utf8')).contour?.decisionsDir || dir; } catch { /* the default */ }
  for (const name of [`${m[2]}.lock`, '_queue.lock']) {
    const lock = join(root, dir, name);
    if (existsSync(lock)) return lock;
  }
  return null;
}

if (process.argv.includes('--selftest')) {
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync, rmdirSync } = await import('node:fs');
  const root = mkdtempSync(join(ROOT, '.work', 'lock-test-'));
  mkdirSync(join(root, 'interviews', 'decisions'), { recursive: true });
  const doc = join(root, 'interviews', 'interview_900_x.md');
  const lock = join(root, 'interviews', 'decisions', 'interview_900_x.lock');
  const t = [];
  t.push(['no lock → the edit passes', lockFor(doc, root) === null]);
  writeFileSync(lock, '{"pid":1}');
  t.push(['a lock → the edit is refused', lockFor(doc, root) === lock]);
  t.push(['a plan beside it is not a contour document', lockFor(join(root, 'plans', 'p.md'), root) === null]);
  t.push(['the decision file itself is not refused', lockFor(join(root, 'interviews', 'decisions', 'interview_900_x.decision.json'), root) === null]);
  // A homework's lock lives where review.mjs writes it: interviews/decisions/<name>.lock.
  const hw = join(root, 'homeworks', '04_x.md');
  t.push(['a homework without its lock passes', lockFor(hw, root) === null]);
  writeFileSync(join(root, 'interviews', 'decisions', '04_x.lock'), '{}');
  t.push(['a homework whose lock is in interviews/decisions is refused', lockFor(hw, root) !== null]);
  rmSync(join(root, 'interviews', 'decisions', '04_x.lock'));
  rmSync(lock);
  writeFileSync(join(root, 'interviews', 'decisions', '_queue.lock'), '{}');
  t.push(['the queue page lock refuses an interview edit', lockFor(doc, root) !== null]);
  rmSync(join(root, 'interviews', 'decisions', '_queue.lock'));
  rmdirSync(join(root, 'interviews', 'decisions')); rmdirSync(join(root, 'interviews')); rmdirSync(root);
  for (const [n, ok] of t) console.log(`${ok ? 'PASS' : 'FAIL'} ${n}`);
  const bad = t.filter(([, ok]) => !ok).length;
  console.log(bad ? `contour-page-lock self-test: ${bad} failed` : `contour-page-lock self-test: ${t.length}/${t.length}`);
  process.exit(bad ? 1 : 0);
}

try {
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const file = event.tool_input && (event.tool_input.file_path || event.tool_input.path);
  const lock = lockFor(file);
  if (!lock) process.exit(0);
  let info = '';
  try { const j = JSON.parse(readFileSync(lock, 'utf8')); info = ` (page ${j.url || '?'}, pid ${j.pid || '?'}, saved: ${j.saved})`; } catch { /* an unreadable lock still owns the document */ }
  const doc = relative(ROOT, file).replace(/\\/g, '/');
  process.stderr.write(`KUMM guard (tools/hooks/contour-page-lock.mjs): ${doc} belongs to its contour page${info} — the lock ${basename(lock)} exists.\n` +
    `An answer given in chat: close the page first — node .kaif/tools/contour/review.mjs ${doc} --close — then edit. A page whose server died: ` +
    `node .kaif/tools/contour/review.mjs --queue --list picks the saved answer up and releases the lock (HOUSE_RULES 36.3, EXP-0564).\n`);
  process.exit(2);
} catch {
  process.exit(0);
}
