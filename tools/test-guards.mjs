#!/usr/bin/env node
// test-guards.mjs — набор проверок двух стражей 2026-09-18, живущий в репозитории, а не в скретчпаде сессии
// (TESTING_FRAMEWORK → «The work produces its own means of checking»: проверка, оставшаяся в скретчпаде, умирает
// вместе с сессией; первые наборы этих стражей там и лежали — находка судьи).
//
//   node tools/test-guards.mjs          # из корня репозитория; код 0 — все случаи как ожидалось, 1 — нет
//
// Части A–G (E — хук методички перевода, 2026-10-06; F — хук тест-кейсов; G — хук штампов, 2026-10-07):
//   A. tools/hooks/no-backslash-heredoc.mjs — события PreToolUse, собранные в JS (ни одна оболочка не трогает слэши);
//   B. tools/check-claim-before-evidence.mjs в режиме файлов;
//   C. он же в режиме --staged, в одноразовых git-репозиториях;
//   D. tools/hooks/pre-commit целиком в одноразовом репозитории: коммит из переименования с выдуманным штампом;
//   E. tools/hooks/style-gate.mjs — запись перевода без прочитанной методички (метка во временном каталоге).
// Временные каталоги создаются в системном temp и убираются ПЕРЕЧИСЛЕНИЕМ: сначала каждый файл, потом пустые
// каталоги снизу вверх — рекурсивное удаление одной командой в этом проекте запрещено правилом владельца.
// Это гигиена стражей (самопроверка прибора), а не функциональный прогон: функциональные прогоны — настоящий
// коммит и настоящий вызов Bash — описаны в отчётах testcases/reports/.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, readdirSync, statSync, unlinkSync, rmdirSync, copyFileSync, utimesSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = process.cwd();
const HOOK = resolve(ROOT, 'tools/hooks/no-backslash-heredoc.mjs');
const GUARD = resolve(ROOT, 'tools/check-claim-before-evidence.mjs');
const BS = String.fromCharCode(92), NL = String.fromCharCode(10), CRLF = String.fromCharCode(13, 10), TAB = String.fromCharCode(9);
const pad = (n) => String(n).padStart(2, '0');
const localStamp = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const offset = (() => { const m = -new Date().getTimezoneOffset(); const s = m >= 0 ? '+' : '-'; const a = Math.abs(m); return `${s}${pad(Math.floor(a / 60))}:${pad(a % 60)}`; })();
// Прошлое и будущее держатся внутри СЕГОДНЯШНИХ суток: «сейчас ± 10 минут» у полуночи уезжало во вчера / в завтра, и
// controls-loose-times краснел ни за что (прогон 2026-10-08 00:00 — 97 из 98, в 00:01 и 01:31 — 98 из 98). Остаётся окно
// в одну минуту (23:59 — будущее равно «сейчас»): GAP, а не ложь стража.
const DAY_START = new Date(); DAY_START.setHours(0, 0, 0, 0);
const DAY_LAST_MINUTE = DAY_START.getTime() + 86400000 - 60000;
const FUT = localStamp(Math.min(Date.now() + 10 * 60000, DAY_LAST_MINUTE));
const PAST = localStamp(Math.max(Date.now() - 10 * 60000, DAY_START.getTime()));
const TOMORROW = localStamp(Date.now() + 26 * 3600000);
const FUT_Z_FRAC = new Date(Date.now() + 10 * 60000).toISOString();   // 2026-…T…:…:….123Z
const EXISTING_REPORT = 'testcases/reports/2026-09-18_kaif-update-sweep.md';

let bad = 0, total = 0;
const check = (name, got, want) => { total++; const ok = got === want; if (!ok) bad++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${got} (want ${want}) — ${name}`); };

const TMP_PREFIX = join(tmpdir(), 'kumm-test-guards-');
const tmps = [];
const newTmp = () => { const d = mkdtempSync(TMP_PREFIX); tmps.push(d); return d; };
function removeByEnumeration(dir) {
  if (!resolve(dir).startsWith(TMP_PREFIX)) throw new Error('refusing to clean outside the tool temp: ' + dir);
  const files = [], dirs = [];
  const walk = (p) => { for (const n of readdirSync(p)) { const q = join(p, n); if (statSync(q).isDirectory()) { dirs.push(q); walk(q); } else files.push(q); } };
  walk(dir);
  for (const f of files) unlinkSync(f);
  for (const d of dirs.sort((a, b) => b.split(sep).length - a.split(sep).length)) rmdirSync(d);
  rmdirSync(dir);
}

// ---------- A. the heredoc hook
console.log('A. no-backslash-heredoc');
const hookCase = (name, input, want) => check(name, spawnSync(process.execPath, [HOOK], { input, encoding: 'utf8' }).status, want);
const ev = (command) => JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command } });
hookCase("<<'EOF', slash in body", ev("cat > x <<'EOF'" + NL + "p = '." + BS + "Deploy-ModPack.ps1'" + NL + 'EOF'), 2);
hookCase('<<EOF, double slash in body', ev('cat > x <<EOF' + NL + 'a' + BS + BS + 'b' + NL + 'EOF'), 2);
hookCase('<<-END, tab-indented end', ev('cat <<-END' + NL + TAB + 'C:' + BS + 'x' + NL + TAB + 'END'), 2);
hookCase('<<' + BS + 'EOF (judge 2026-09-18)', ev('cat > x <<' + BS + 'EOF' + NL + 'C:' + BS + 'probe' + NL + 'EOF'), 2);
hookCase("<<'END.' (judge)", ev("cat > x <<'END.'" + NL + 'C:' + BS + 'probe' + NL + 'END.'), 2);
hookCase("<<'my-eof' (judge)", ev("cat > x <<'my-eof'" + NL + 'C:' + BS + 'probe' + NL + 'my-eof'), 2);
hookCase('<<"EOF"', ev('cat > x <<"EOF"' + NL + 'C:' + BS + 'probe' + NL + 'EOF'), 2);
hookCase('CRLF command', ev("cat > x <<'EOF'" + CRLF + 'C:' + BS + 'probe' + CRLF + 'EOF'), 2);
hookCase('two heredocs, slash only in the second', ev('cat <<A <<B' + NL + 'one' + NL + 'A' + NL + 'two' + BS + NL + 'B'), 2);
hookCase('control: heredoc without a slash', ev("cat > x <<'EOF'" + NL + 'plain' + NL + 'EOF'), 0);
hookCase('control: slash outside the body', ev("grep 'a" + BS + "|b' f && cat <<'EOF'" + NL + 'plain' + NL + 'EOF'), 0);
hookCase('control: here-string <<<', ev('cat <<< "a' + BS + 'b"'), 0);
hookCase('control: no heredoc, slash in args', ev('echo a' + BS + 'b'), 0);
hookCase('control: arithmetic shift, no slash anywhere', ev('echo $((1<<2))'), 0);
hookCase('control: another tool', JSON.stringify({ tool_name: 'Write', tool_input: { content: 'a' + BS + 'b' } }), 0);
hookCase('control: garbage on stdin (fail-open)', '{not json', 0);

// ---------- B. the claim guard, file mode
console.log('B. check-claim-before-evidence, files');
const B = newTmp();
const guardFile = (name, content, want) => { const f = join(B, name); writeFileSync(f, content); check(name, spawnSync(process.execPath, [GUARD, f], { cwd: ROOT, encoding: 'utf8' }).status, want); };
guardFile('future-local.md', `closed ${FUT}${NL}`, 1);
guardFile('future-offset.md', `closed ${FUT} ${offset}${NL}`, 1);
guardFile('future-z-fraction.md', `at ${FUT_Z_FRAC}${NL}`, 1);
guardFile('marker-no-report.md', `// [TESTED: 2026-09-18 · ran it]${NL}`, 1);  // claim-ok: a test fixture that is broken on purpose
guardFile('marker-missing-report.md', `// [TESTED: 2026-09-18 · see testcases/reports/2099-01-01_nope.md]${NL}`, 1);  // claim-ok: a test fixture that is broken on purpose
guardFile('marker-no-space.md', `// [TESTED:2026-09-18 · ran it]${NL}`, 1);  // claim-ok: a test fixture that is broken on purpose
guardFile('controls.md', `closed ${PAST}${NL}planned ${TOMORROW}${NL}prose: a [TESTED] marker${NL}call ${FUT} claim-ok: a planned call${NL}`, 0);
// 2026-10-06: the agent wrote «2026-10-06, между 17:26 и 17:31», «2026-10-06 ≈16:40», «между 16:33 и 16:40» at 17:28 / 16:36 — claim-ok: quoting the misses
// the guard knew only the glued form «YYYY-MM-DD HH:MM» and stayed green; these cases were red against that version
const [TODAY_D, FUT_HM, PAST_HM] = [FUT.slice(0, 10), FUT.slice(11, 16), PAST.slice(11, 16)];
guardFile('future-after-date-window.md', `said ${TODAY_D}, между ${PAST_HM} и ${FUT_HM}${NL}`, 1);
guardFile('future-after-date-approx.md', `opened ${TODAY_D} ≈${FUT_HM}${NL}`, 1);
guardFile('future-bare-approx.md', `opened ≈${FUT_HM}${NL}`, 1);
guardFile('future-bare-window.md', `said между ${PAST_HM} и ${FUT_HM}${NL}`, 1);
guardFile('controls-loose-times.md', `opened ≈${PAST_HM}${NL}said между ${PAST_HM} и ${PAST_HM}${NL}meeting at ${FUT_HM}${NL}${TOMORROW.slice(0, 10)} ≈${FUT_HM}${NL}`, 0);
// a paragraph about another day: its date stands on the line above, the bare «≈HH:MM» continues it (STATUS.md, 2026-10-05 ≈20:27)
guardFile('control-bare-time-other-day-above.md', `note 2000-01-01 morning,${NL}word · ≈${FUT_HM}${NL}`, 0);
guardFile('bare-time-today-above.md', `note ${TODAY_D} evening,${NL}word · ≈${FUT_HM}${NL}`, 1);
guardFile('marker-report-next-line.md', `// [TESTED: 2026-09-18 · see${NL}//  ${EXISTING_REPORT}]${NL}`, 0);  // claim-ok: a test fixture; its report path is a variable in this source
check('a directory as the argument', spawnSync(process.execPath, [GUARD, B], { encoding: 'utf8' }).status, 2);
check('a missing file', spawnSync(process.execPath, [GUARD, join(B, 'nope.md')], { encoding: 'utf8' }).status, 2);

// ---------- C. the claim guard, --staged, in throwaway repositories
console.log('C. check-claim-before-evidence, --staged');
function repo() {
  const d = newTmp();
  const git = (...a) => execFileSync('git', a, { cwd: d, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  git('init', '-q'); git('config', 'user.email', 't@t'); git('config', 'user.name', 't'); git('config', 'core.autocrlf', 'false');
  writeFileSync(join(d, 'base.md'), 'base' + NL); git('add', 'base.md'); git('commit', '-q', '-m', 'base');
  return { d, git, write: (p, c) => { mkdirSync(join(d, p, '..'), { recursive: true }); writeFileSync(join(d, p), c); } };
}
const staged = (r) => spawnSync(process.execPath, [GUARD, '--staged'], { cwd: r.d, encoding: 'utf8' }).status;
{ const r = repo(); r.write('a.md', `x${NL}++ note${NL}closed ${FUT}${NL}`); r.git('add', 'a.md'); check('a content line "++ " before a future stamp (judge)', staged(r), 1); }
{ const r = repo(); r.write('заметка.md', `closed ${FUT}${NL}`); r.git('add', '.'); check('a non-ASCII file name (judge)', staged(r), 1); }
{ const r = repo(); r.write('testcases/reports/r.md', 'report' + NL); r.write('t.md', `// [TESTED: 2026-09-18 · testcases/reports/r.md]${NL}`); r.git('add', 't.md');  // claim-ok: a test fixture that is broken on purpose
  check('report on disk but not in the commit (judge)', staged(r), 1);
  r.git('add', 'testcases/reports/r.md'); check('control: report staged with the marker', staged(r), 0); }
{ const r = repo(); r.write('.kaif/x.md', `closed ${FUT}${NL}`); r.git('add', '.'); check('control: framework path excluded', staged(r), 0); }
{ const r = repo(); r.write('b.md', `closed ${PAST}${NL}`); r.git('add', 'b.md'); check('control: past stamp', staged(r), 0); }

// ---------- D. the whole pre-commit hook: a rename that carries a future stamp
console.log('D. tools/hooks/pre-commit');
try {
  const r = repo();
  mkdirSync(join(r.d, 'tools', 'hooks'), { recursive: true });
  for (const f of ['tools/hooks/pre-commit', 'tools/scrub-identity.mjs', 'tools/check-claim-before-evidence.mjs']) copyFileSync(join(ROOT, f), join(r.d, f));
  r.git('config', 'core.hooksPath', 'tools/hooks');
  // A file big enough that git sees `git mv` + a one-line edit as a RENAME (R0xx), not as delete + add: a tiny file
  // falls under the 50 % similarity and the old ACM filter would have caught it as an add — the test proved nothing.
  const body = Array.from({ length: 60 }, (_, i) => `line ${i + 1} of a document that is only renamed`).join(NL) + NL;
  // Fixture setup bypasses the hook on purpose: the copied guard carries its own [TESTED] marker whose report is not
  // in this throwaway repo, and the gate would (rightly) refuse the setup commit itself.
  r.write('a.md', body); r.git('add', '.'); r.git('commit', '-q', '--no-verify', '-m', 'tools and a.md');
  const head0 = r.git('rev-parse', 'HEAD').trim();
  r.git('mv', 'a.md', 'b.md'); r.write('b.md', `${body}closed ${FUT}${NL}`); r.git('add', 'b.md');
  check('git sees the change as a rename', r.git('diff', '--cached', '--name-status').trim().charAt(0), 'R');
  const c = spawnSync('git', ['commit', '-q', '-m', 'rename with a future stamp'], { cwd: r.d, encoding: 'utf8' });
  check('rename + future stamp: commit refused (judge)', c.status === 0 ? 0 : 1, 1);
  check('rename + future stamp: HEAD did not move', r.git('rev-parse', 'HEAD').trim() === head0 ? 'same' : 'moved', 'same');
  r.write('b.md', `${body}closed ${PAST}${NL}`); r.git('add', 'b.md');
  const ok = spawnSync('git', ['commit', '-q', '-m', 'rename with a past stamp'], { cwd: r.d, encoding: 'utf8' });
  check('control: the same rename with a past stamp commits', ok.status, 0);
} catch (e) {
  // A crash is a failed case, never a silent absence of cases (the first old-version run crashed here and printed
  // no summary line at all).
  check('part D ran to the end', 'crashed: ' + String(e && e.message).split(NL)[0].slice(0, 80), 'completed');
}

// ---------- E. the style-gate hook: translation is written only after the methodology was read (owner 2026-10-06)
console.log('E. style-gate');
try {
  const E = newTmp();
  const STYLE = join(E, 'SvarogsDream', 'translation', 'STYLE.md'), STAMP = join(E, 'style.stamp');
  mkdirSync(join(E, 'SvarogsDream', 'translation'), { recursive: true });
  writeFileSync(STYLE, Array.from({ length: 30 }, (_, i) => 'rule ' + i).join(NL) + NL);   // 30 lines: an excerpt (limit 20) is shorter than the file
  const SG = resolve(ROOT, 'tools/hooks/style-gate.mjs');
  const run = (mode, ev, max) => spawnSync(process.execPath, [SG, mode, '--style', STYLE, '--stamp', STAMP, ...(max ? ['--max', max] : [])],
    { input: JSON.stringify(ev), encoding: 'utf8' }).status;
  const tr = 'D:/work/ai_sandbox/SvarogsDream/translation/items_ru.tsv';
  const write = (p) => ({ tool_name: 'Write', tool_input: { file_path: p } });
  const bash = (c) => ({ tool_name: 'Bash', tool_input: { command: c } });
  check('no stamp: Write items_ru.tsv refused', run('--gate', write(tr)), 2);
  check('no stamp: Edit zz_krinik.txt (backslash path) refused', run('--gate', { tool_name: 'Edit', tool_input: { file_path: 'D:' + BS + 'work' + BS + 'SvarogsDream' + BS + '_config' + BS + 'xunity' + BS + 'zz_krinik.txt' } }), 2);
  check('no stamp: phrases_add.py batch refused', run('--gate', bash('$PY tools/phrases_add.py "D:/Games/x" b.txt')), 2);
  check('no stamp: items_xunity.py --add refused', run('--gate', bash('$PY tools/items_xunity.py "D:/Games/x" --add b.tsv')), 2);
  check('control: items_xunity.py without --add (regeneration) passes', run('--gate', bash('$PY tools/items_xunity.py "D:/Games/x"')), 0);
  check('no stamp: Write notes_ru.tsv refused', run('--gate', write('D:/work/ai_sandbox/SvarogsDream/translation/notes_ru.tsv')), 2);
  check('no stamp: notes_xunity.py --add refused', run('--gate', bash('$PY tools/notes_xunity.py "D:/Games/x" --add b.tsv')), 2);
  check('control: notes_xunity.py without --add (regeneration) passes', run('--gate', bash('$PY tools/notes_xunity.py "D:/Games/x"')), 0);
  // 2026-10-07: dash_src.py apply пишет источники перевода — хук его не знал, партии записок шли при прочтении методички 60+ мин назад.
  check('no stamp: dash_src.py apply refused', run('--gate', bash('$PY -I tools/dash_src.py apply translation/notes_ru.tsv b.txt')), 2);
  check('control: dash_src.py list (read only) passes', run('--gate', bash('$PY -I tools/dash_src.py list translation/notes_ru.tsv')), 0);
  check('no stamp: dialogue_xunity.py --add refused', run('--gate', bash('$PY tools/dialogue_xunity.py "D:/Games/x" --add b.tsv')), 2);
  check('no stamp: dialogue_xunity.py --adopt refused', run('--gate', bash('$PY tools/dialogue_xunity.py "D:/Games/x" --adopt')), 2);
  check('control: dialogue_xunity.py without flags (regeneration) passes', run('--gate', bash('$PY tools/dialogue_xunity.py "D:/Games/x"')), 0);
  // 2026-10-07: события мира — свой инструмент партий (KUMM plans/14, фаза 6); без строки в TOOLS партия шла бы мимо методички.
  check('no stamp: worldevents_xunity.py --add refused', run('--gate', bash('$PY -I tools/worldevents_xunity.py "D:/Games/x" --add b.tsv')), 2);
  check('control: worldevents_xunity.py without --add (regeneration) passes', run('--gate', bash('$PY -I tools/worldevents_xunity.py "D:/Games/x"')), 0);
  check('control: a foreign file passes', run('--gate', write('D:/work/ai_sandbox/KUMM/STATUS.md')), 0);
  check('control: editing STYLE.md itself passes', run('--gate', write(STYLE)), 0);
  check('control: Read of another file leaves no stamp', (run('--mark', { tool_name: 'Read', tool_input: { file_path: tr } }), statSync(STAMP, { throwIfNoEntry: false }) ? 'stamp' : 'none'), 'none');
  run('--mark', { tool_name: 'Read', tool_input: { file_path: STYLE, offset: 1, limit: 20 } });
  check('Read of a STYLE.md excerpt (limit shorter than the file) leaves no stamp', statSync(STAMP, { throwIfNoEntry: false }) ? 'stamp' : 'none', 'none');
  run('--mark', { tool_name: 'Read', tool_input: { file_path: STYLE, offset: 5 } });
  check('Read of STYLE.md from the middle (offset) leaves no stamp', statSync(STAMP, { throwIfNoEntry: false }) ? 'stamp' : 'none', 'none');
  run('--mark', { tool_name: 'Read', tool_input: { file_path: STYLE.split('/').join(BS) } });
  check('Read of STYLE.md sets the stamp', statSync(STAMP, { throwIfNoEntry: false }) ? 'stamp' : 'none', 'stamp');
  check('fresh stamp: Write items_ru.tsv passes', run('--gate', write(tr)), 0);
  check('stamp older than --max refused', run('--gate', write(tr), '-1'), 2);
  const later = new Date(Date.now() + 5000); utimesSync(STYLE, later, later);
  check('STYLE.md changed after reading: refused', run('--gate', write(tr)), 2);

  // E2. Тот же хук — руководство интерфейса (--paths): код мода интерфейса правится по прочитанной философии прекрасного (≈22:35).
  const RB = join(E, 'UI_RULEBOOK.md'), RS = join(E, 'ui.stamp');
  writeFileSync(RB, 'philosophy' + NL);
  const PATHS_UI = 'svarogsdream/src/krinik(uirework|modmenu)/[^/]*' + BS + '.cs$';
  const ui = (mode, ev) => spawnSync(process.execPath, [SG, mode, '--style', RB, '--stamp', RS, '--paths', PATHS_UI, '--label', 'ui-gate'],
    { input: JSON.stringify(ev), encoding: 'utf8' });
  const cs = 'D:/work/ai_sandbox/SvarogsDream/src/KrinikUIRework/DevotionCards.cs';
  const r1 = ui('--gate', write(cs));
  check('ui: no reading: Edit of a UI mod file refused', r1.status, 2);
  check('ui: the refusal names its label', /^ui-gate:/.test(r1.stderr) ? 'ui-gate' : r1.stderr.slice(0, 20), 'ui-gate');
  check('ui: no reading: Write in KrinikModMenu refused', ui('--gate', write('D:/work/ai_sandbox/SvarogsDream/src/KrinikModMenu/Plugin.cs')).status, 2);
  check('ui control: a translation file is not this gate', ui('--gate', write(tr)).status, 0);
  check('ui control: a translation batch command is not this gate', ui('--gate', bash('$PY tools/phrases_add.py x b.txt')).status, 0);
  check('ui control: another mod passes', ui('--gate', write('D:/work/ai_sandbox/SvarogsDream/src/KrinikCameraRework/Plugin.cs')).status, 0);
  ui('--mark', { tool_name: 'Read', tool_input: { file_path: RB } });
  check('ui: after reading the rulebook the Edit passes', ui('--gate', write(cs)).status, 0);
} catch (e) {
  check('part E ran to the end', 'crashed: ' + String(e && e.message).split(NL)[0].slice(0, 80), 'completed');
}

// ---------- F. the testcase-gate hook: a run in the game only after test cases are written (owner 2026-10-06 ≈21:25)
console.log('F. testcase-gate');
try {
  const F = newTmp();
  const TG = resolve(ROOT, 'tools/hooks/testcase-gate.mjs');
  // v2 (2026-10-06 ≈21:50, «ужесточай хук»): ждущий случай обязателен; между прогонами таблица случаев обязана измениться.
  const STAMP = join(F, 'stamp.json');
  const run = (cmd) => spawnSync(process.execPath, [TG, '--gate', '--dir', F, '--stamp', STAMP],
    { input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: cmd } }), encoding: 'utf8' }).status;
  const DEPLOY = 'bash tools/deploy-hot.sh KrinikUIRework';
  const HEAD = '# Test cases' + NL + '| # | Case | Technique | Status |' + NL;
  const tc = (rows) => writeFileSync(join(F, 'TC_x.md'), HEAD + rows.join(NL) + NL);
  check('no TC document: deploy-hot.sh refused', run(DEPLOY), 2);
  check('no TC document: run-game.sh refused', run('timeout 300 bash tools/run-game.sh'), 2);
  check('control: a pult shot without a TC document passes', run('bash tools/h.sh "shot x"'), 0);
  check('control: a foreign command passes', run('git status'), 0);
  // v2.2 (2026-10-07 09:3x): чтение скрипта — не прогон. `sed -n 1,40p tools/run-game.sh` в 09:34 был засчитан прогоном, и настоящий
  // запуск после него отбит («таблица не изменилась»); то же 2026-10-06 23:16 (строка GAP v2). Запуск — имя скрипта в позиции команды.
  check('reading the script is not a run: sed passes', run('cd /d/x && sed -n 1,40p tools/run-game.sh; echo ----; sed -n 1,30p tools/h.sh'), 0);
  check('reading the script is not a run: grep/cat pass', run('grep -n alive tools/deploy-hot.sh && cat tools/run-game.sh'), 0);
  check('a run without bash: ./tools/run-game.sh refused', run('./tools/run-game.sh'), 2);
  check('a run after cd and time: refused', run('cd /d/x && time bash tools/run-game.sh 2>&1 | tail -5'), 2);
  writeFileSync(join(F, 'TC_x.md'), '# Test cases' + NL + 'no table yet' + NL);
  check('TC document without a case table: refused', run(DEPLOY), 2);
  tc(['| C1 | open → seen | state | pass — shot a |']);
  check('all cases already passed (nothing written for this change): refused', run(DEPLOY), 2);
  tc(['| C1 | open → seen | state | pass — shot a |', '| C2 | hover → gold | state | [NOT-TESTED] |']);
  check('a case waiting for its run: deploy-hot.sh passes', run(DEPLOY), 0);
  check('second run with the case table unchanged: refused', run(DEPLOY), 2);
  const later = new Date(Date.now() + 5000); utimesSync(join(F, 'TC_x.md'), later, later);
  check('file touched, rows unchanged: refused', run(DEPLOY), 2);
  tc(['| C1 | open → seen | state | pass — shot a |', '| C2 | hover → gold | state | fail — still grey, shot b |']);
  check('result recorded (fail waits for the rerun): passes', run(DEPLOY), 0);
  tc(['| C1 | open → seen | state | pass — shot a |', '| C2 | hover → gold | state | pass — shot c |', '| C3 | close → gone | state | [NOT-TESTED] |']);
  check('result recorded and a new case added: passes', run(DEPLOY), 0);
  // Контрольный случай — тоже строка таблицы: записанный итог K1 открывает следующий прогон (22:08 v2 его не видел).
  tc(['| C1 | open → seen | state | pass — shot a |', '| C2 | hover → gold | state | pass — shot c |', '| C3 | close → gone | state | fail — shot d |', '| K1 | flag off → absent | control | [NOT-TESTED] |']);
  check('a control case written: passes', run(DEPLOY), 0);
  tc(['| C1 | open → seen | state | pass — shot a |', '| C2 | hover → gold | state | pass — shot c |', '| C3 | close → gone | state | fail — shot d |', '| K1 | flag off → absent | control | pass — shot e |']);
  check('only the control result recorded: passes', run(DEPLOY), 0);
} catch (e) {
  check('part F ran to the end', 'crashed: ' + String(e && e.message).split(NL)[0].slice(0, 80), 'completed');
}

// ---------- G. the stamp-gate hook: a today-dated stamp ahead of the clock is refused BEFORE it lands in a file
// (2026-10-07: «Created: 2026-10-07 09:45» при часах 09:34 и «09:51» при 09:49 — оба поймал сам агент после записи; страж коммита
// видит только KUMM, а код и случаи SvarogsDream — нет; EXP-0137 → EXP-0160 → сегодня дважды: урок без механизма не держит)
console.log('G. stamp-gate');
try {
  const SG = resolve(ROOT, 'tools/hooks/stamp-gate.mjs');
  const sg = (tool, input) => spawnSync(process.execPath, [SG], { input: JSON.stringify({ tool_name: tool, tool_input: input }), encoding: 'utf8' }).status;
  check('Write with a future stamp: refused', sg('Write', { file_path: 'x.md', content: '**Created:** ' + FUT + ' ' + offset }), 2);
  check('Edit with a future «≈» stamp: refused', sg('Edit', { file_path: 'x.cs', old_string: 'a', new_string: '// v2.2 — ' + FUT.slice(0, 10) + ' ≈' + FUT.slice(11) + ' ' + offset }), 2);
  check('Write with a past stamp: passes', sg('Write', { file_path: 'x.md', content: 'pass · ' + PAST }), 0);
  check('Write with a stamp tomorrow (a plan): passes', sg('Write', { file_path: 'x.md', content: 'plan ' + TOMORROW }), 0);
  check('future stamp with claim-ok on the line: passes', sg('Write', { file_path: 'x.md', content: 'meeting ' + FUT + ' claim-ok: назначенная встреча' }), 0);
  check('control: Bash is not this hook', sg('Bash', { command: 'echo ' + FUT }), 0);
  check('control: garbage on stdin (fail-open)', spawnSync(process.execPath, [SG], { input: '{not json', encoding: 'utf8' }).status, 0);
} catch (e) {
  check('part G ran to the end', 'crashed: ' + String(e && e.message).split(NL)[0].slice(0, 80), 'completed');
}

for (const d of tmps) { try { removeByEnumeration(d); } catch (e) { console.log(`note: temp left at ${d} (${e.code || e.message})`); } }
console.log(`-- ${total - bad} of ${total} as expected`);
process.exit(bad ? 1 : 0);
