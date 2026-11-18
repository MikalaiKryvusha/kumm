#!/usr/bin/env node
// ru-build-text-check.mjs — PostToolUse (Write | Edit | MultiEdit): a file of the Conan build with Russian text for the player was just written —
// run the build's dash lint on that file and the owner's stylometric core §8 (genre `document`) on its Russian lines, and tell the agent at once.
// Why: the owner wants the build's Russian correct and the core to WORK at the moment of writing (2026-11-18 09:00–09:12; KUMM plans/58, HOUSE_RULES 35).
// Non-blocking: the write stays; the findings come back as additional context, the agent fixes them in the same move.
// Since 2026-11-18 14:0x it also reads the Russian documents the agent writes for the owner in KUMM — interviews, homeworks, the voice phrases,
// every `*_ru.md` copy — and the core's own manuals `krinik-stylometry/russian_norms/`, each by the core's genre of its purpose (HOUSE_RULES 35.4:
// a text addressed to a person is checked as a message or a reply, a strict description as a document). The owner 2026-11-18 13:33: guards,
// linters and hooks around the strengthened core (PROJECT_HISTORY entry 2026-11-18 13:55).
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

// Russian text for the owner inside KUMM, with the core's genre by the text's purpose (HOUSE_RULES 35.4). First match wins.
const OWNER_TEXT = [
  { re: /\/interviews\/[^/]+\.md$/i, genre: 'message' },
  { re: /\/homeworks\/[^/]+\.md$/i, genre: 'message' },
  { re: /\/voice\/[^/]+\.txt$/i, genre: 'reply' },
  { re: /\/krinik-stylometry\/russian_norms\/[^/]+\.md$/i, genre: 'document' },
  { re: /_ru\.md$/i, genre: 'document' },
];
/** The core's genre for a KUMM file the owner reads, or null when the file is not one. */
export function ownerTextGenre(p) {
  const f = String(p || '').replace(/\\/g, '/');
  if (!f.toLowerCase().startsWith(ROOT.replace(/\\/g, '/').toLowerCase() + '/')) return null;
  const hit = OWNER_TEXT.find((o) => o.re.test(f));
  return hit ? hit.genre : null;
}

/** Russian lines of an owner document: HTML comments and lines marked `ru-ok` (a quoted defect, the owner's own words) are left out. */
function ownerLines(text) {
  return text.replace(/<!--(?![^>]*ru-ok)[\s\S]*?-->/g, ' ').split(/\r?\n/)
    .map((l) => (l.includes('<!-- ru-ok:') || !/[а-яё]/i.test(l) ? '' : l)).join('\n');
}

export async function ownerFindings(file, genre) {
  const text = ownerLines(readFileSync(file, 'utf8'));
  if (!text.trim() || !existsSync(CORE)) return [];
  const { parseCore, lint } = await import(pathToFileURL(CHECKER).href);
  const hits = lint(text, parseCore(readFileSync(CORE, 'utf8')), genre);
  return hits.length ? [`ядро §8 (жанр ${genre}):\n` + hits.slice(0, 10).map((h) => `  ${h.line}: «${h.fragment}» — ${h.hint}`).join('\n')] : [];
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
  t.push(['an interview is owner text of genre message', ownerTextGenre(join(ROOT, 'interviews', 'interview_039_x.md')) === 'message']);
  t.push(['a voice phrase is a reply, a _ru copy and a core manual are documents', ownerTextGenre(join(ROOT, 'voice', 'a.txt')) === 'reply'
    && ownerTextGenre(join(ROOT, 'plans', 'X_ru.md')) === 'document' && ownerTextGenre(join(ROOT, 'krinik-stylometry', 'russian_norms', 'RUSSIAN_RULES.md')) === 'document']);
  t.push(['an English plan and a file outside KUMM are not owner text', ownerTextGenre(join(ROOT, 'plans', '58_EPIC_x.md')) === null
    && ownerTextGenre('D:/work/ai_sandbox/ConanExiles/interviews/a.md') === null]);
  // A defect written into an owner document is reported; the same line marked ru-ok is not (a quoted defect).
  const { writeFileSync: wf, mkdtempSync, rmSync, rmdirSync } = await import('node:fs');
  const tmp = mkdtempSync(join(ROOT, '.work', 'ru-owner-'));
  const probe = join(tmp, 'probe.md');
  wf(probe, 'Лаунчер осуществляет проверку сборки, и вы можете его запустить.\n');
  const caught = await ownerFindings(probe, 'message');
  wf(probe, 'Цитата дефекта: «осуществляет проверку сборки» <!-- ru-ok: quoted defect -->\n');
  const skipped = await ownerFindings(probe, 'message');
  rmSync(probe); rmdirSync(tmp);
  t.push(['a defect in an owner document is caught, a ru-ok line is skipped', caught.length === 1 && /осуществля/.test(caught[0]) && skipped.length === 0]);
  for (const [n, ok] of t) console.log(`${ok ? 'PASS' : 'FAIL'} ${n}`);
  const bad = t.filter(([, ok]) => !ok).length;
  console.log(bad ? `ru-build-text-check self-test: ${bad} failed` : `ru-build-text-check self-test: ${t.length}/${t.length}`);
  process.exit(bad ? 1 : 0);
}

try {
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const file = event.tool_input && (event.tool_input.file_path || event.tool_input.path);
  if (!file || !existsSync(file)) process.exit(0);
  const genre = ownerTextGenre(file);
  if (genre) {
    const o = await ownerFindings(file, genre);
    if (o.length) {
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse',
        additionalContext: `ru-build-text-check · ${file}: русский текст для владельца (HOUSE_RULES 35; ядро §8):\n${o.join('\n')}\nИсправь этим же ходом; цитата чужого дефекта помечается <!-- ru-ok: причина -->.` } }));
    }
    process.exit(0);
  }
  if (!isBuildText(file)) process.exit(0);
  const f = await findings(file);
  if (f.length) {
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse',
      additionalContext: `ru-build-text-check · ${file}: русский текст сборки (HOUSE_RULES 33, 35; план 58):\n${f.join('\n')}\nИсправь этим же ходом; законное тире — в dash_lint_allow.txt с классом.` } }));
  }
  process.exit(0);
} catch {
  process.exit(0);
}
