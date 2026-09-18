#!/usr/bin/env node
// test-guards.mjs — набор проверок двух стражей 2026-09-18, живущий в репозитории, а не в скретчпаде сессии
// (TESTING_FRAMEWORK → «The work produces its own means of checking»: проверка, оставшаяся в скретчпаде, умирает
// вместе с сессией; первые наборы этих стражей там и лежали — находка судьи).
//
//   node tools/test-guards.mjs          # из корня репозитория; код 0 — все случаи как ожидалось, 1 — нет
//
// Четыре части:
//   A. tools/hooks/no-backslash-heredoc.mjs — события PreToolUse, собранные в JS (ни одна оболочка не трогает слэши);
//   B. tools/check-claim-before-evidence.mjs в режиме файлов;
//   C. он же в режиме --staged, в одноразовых git-репозиториях;
//   D. tools/hooks/pre-commit целиком в одноразовом репозитории: коммит из переименования с выдуманным штампом.
// Временные каталоги создаются в системном temp и убираются ПЕРЕЧИСЛЕНИЕМ: сначала каждый файл, потом пустые
// каталоги снизу вверх — рекурсивное удаление одной командой в этом проекте запрещено правилом владельца.
// Это гигиена стражей (самопроверка прибора), а не функциональный прогон: функциональные прогоны — настоящий
// коммит и настоящий вызов Bash — описаны в отчётах testcases/reports/.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, readdirSync, statSync, unlinkSync, rmdirSync, copyFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = process.cwd();
const HOOK = resolve(ROOT, 'tools/hooks/no-backslash-heredoc.mjs');
const GUARD = resolve(ROOT, 'tools/check-claim-before-evidence.mjs');
const BS = String.fromCharCode(92), NL = String.fromCharCode(10), CRLF = String.fromCharCode(13, 10), TAB = String.fromCharCode(9);
const pad = (n) => String(n).padStart(2, '0');
const localStamp = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const offset = (() => { const m = -new Date().getTimezoneOffset(); const s = m >= 0 ? '+' : '-'; const a = Math.abs(m); return `${s}${pad(Math.floor(a / 60))}:${pad(a % 60)}`; })();
const FUT = localStamp(Date.now() + 10 * 60000);
const PAST = localStamp(Date.now() - 10 * 60000);
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

for (const d of tmps) { try { removeByEnumeration(d); } catch (e) { console.log(`note: temp left at ${d} (${e.code || e.message})`); } }
console.log(`-- ${total - bad} of ${total} as expected`);
process.exit(bad ? 1 : 0);
