#!/usr/bin/env node
// ru-build-text-check.mjs — PostToolUse (Write | Edit | MultiEdit): a file of the Conan build with Russian text for the player was just written —
// run the build's dash lint on that file and the owner's stylometric core §8 (genre `document`) on its Russian lines, and tell the agent at once.
// Why: the owner wants the build's Russian correct and the core to WORK at the moment of writing (2026-11-18 09:00–09:12; KUMM plans/58, HOUSE_RULES 35).
// Non-blocking: the write stays; the findings come back as additional context, the agent fixes them in the same move.
// Self-test: node tools/hooks/ru-build-text-check.mjs --selftest
// [NOT-TESTED]
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PACK = 'D:/work/ai_sandbox/ConanExiles';
const CORE = join(ROOT, 'krinik-stylometry', 'AUTHOR_STYLOMETRY.md');
const CHECKER = join(ROOT, 'krinik-stylometry', 'tools', 'voice-check.mjs');
// The build's player-facing text files (the same families dash_lint.py scans), by path fragment.
const BUILD_TEXT = [/\/_config\/localization\/[^/]+\.(tsv|md|txt)$/i, /\/_config\/player-report\/[^/]+\.(ps1|txt|cmd)$/i, /\/_config\/launcher\/[^/]+\.cs$/i,
  /\/docs\/guide\/guide-[^/]+\.html$/i, /\/_config\/public_release\/README\.template\.md$/i, /\/_unpacked\/Krinik[^/]+\/.*\.lua$/i];

export function isBuildText(p) {
  const f = String(p || '').replace(/\\/g, '/');
  return f.toLowerCase().startsWith(PACK.toLowerCase()) && BUILD_TEXT.some((re) => re.test(f));
}

/** Russian lines of a prose-like file for the core check (code files are left to dash_lint, which reads their strings). */
function proseLines(file, text) {
  if (!/\.(tsv|md|txt|html)$/i.test(file)) return '';
  return text.split(/\r?\n/).map((l) => (/\.tsv$/i.test(file) ? l.split('\t').slice(1).join(' ') : l.replace(/<[^>]+>/g, ' ')))
    .map((l) => (/[а-яё]/i.test(l) ? l : '')).join('\n');
}

export async function findings(file) {
  const out = [];
  try {
    execFileSync('python', ['-I', '-X', 'utf8', join(PACK, '_config/release/dash_lint.py'), '--only', file.replace(/\\/g, '/').split('/').slice(-2).join('/')],
      { cwd: PACK, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    const lines = String(e.stdout || '').split('\n').filter((l) => /^\s+\d+:/.test(l)).slice(0, 8);
    if (lines.length) out.push('тире вместо глагола (dash_lint):\n' + lines.join('\n'));
  }
  const prose = proseLines(file, readFileSync(file, 'utf8'));
  if (prose.trim() && existsSync(CORE)) {
    const { parseCore, lint } = await import(pathToFileURL(CHECKER).href);
    const hits = lint(prose, parseCore(readFileSync(CORE, 'utf8')), 'document');
    if (hits.length) out.push('ядро §8 (жанр document):\n' + hits.slice(0, 8).map((h) => `  ${h.line}: «${h.fragment}» — ${h.hint}`).join('\n'));
  }
  return out;
}

if (process.argv.includes('--selftest')) {
  const t = [
    ['a translation table is build text', isBuildText('D:\\work\\ai_sandbox\\ConanExiles\\_config\\localization\\dm-fish-ru.tsv')],
    ['the launcher source is build text', isBuildText('D:/work/ai_sandbox/ConanExiles/_config/launcher/KrinikConanLauncher.cs')],
    ['a KUMM plan is not build text', !isBuildText('D:/work/ai_sandbox/KUMM/plans/58_EPIC_academic_russian_guards_and_proofreading.md')],
    ['a pack tool script is not build text', !isBuildText('D:/work/ai_sandbox/ConanExiles/_config/release/dash_lint.py')],
  ];
  const f = await findings(join(PACK, '_config/localization/dm-fish-ru.tsv'));
  t.push(['the real translation table runs without error', Array.isArray(f)]);
  for (const [n, ok] of t) console.log(`${ok ? 'PASS' : 'FAIL'} ${n}`);
  const bad = t.filter(([, ok]) => !ok).length;
  console.log(bad ? `ru-build-text-check self-test: ${bad} failed` : `ru-build-text-check self-test: ${t.length}/${t.length}`);
  process.exit(bad ? 1 : 0);
}

try {
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const file = event.tool_input && (event.tool_input.file_path || event.tool_input.path);
  if (!isBuildText(file) || !existsSync(file)) process.exit(0);
  const f = await findings(file);
  if (f.length) {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse',
      additionalContext: `ru-build-text-check · ${file}: русский текст сборки (HOUSE_RULES 33, 35; план 58):\n${f.join('\n')}\nИсправь этим же ходом; законное тире — в dash_lint_allow.txt с классом.` } }));
  }
  process.exit(0);
} catch {
  process.exit(0);
}
