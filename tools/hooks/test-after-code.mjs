#!/usr/bin/env node
// test-after-code.mjs — «хук тестирования»: агент написал код → хук ПРИКАЗЫВАЕТ его проверить; агент не уходит, пока написанное не
// проверено прогоном. Перенесён из Unliminium (`D:\work\UnliminiumTheDigitalGame\tools\hooks\test-after-code.mjs`, слово владельца
// там 2026-10-24 17:59: «Аггент что-то запрограммировали -> ХУК приказывает это протестировать! -> … -> чинит. Программирует дальше ->
// ХУК ПРИКАЗЫВАЕТ ЭТО ПРОТЕСТИРОВАТЬ!!!!» · «Агент не просит разрешения у владельца!») словом владельца в KUMM 2026-10-25 ≈11:10:
// `[OWNER]` «сходи в проект цифровой игры UInliminium - возьми оттуда хук в KUMM про цикл код - тесты - правки - код - тесты - правки».
//
// Отличие от Unliminium: сессия KUMM правит код не только в KUMM, но и в репозиториях сборок рядом (ConanExiles, SvarogsDream,
// MedievalDynasty, Palworld …) — поэтому ключ долга — путь от D:\work\ai_sandbox, а виды такие:
//   engine — KUMM/kumm.mjs, KUMM/Deploy-ModPack.ps1: гасит тест ядра (`node test-*.mjs`), стенд `tools/fixture-pack.mjs` или запуск
//            самого файла;
//   game   — код модов игры: `.lua` (UE4SS), `.cs` (BepInEx и пр.) в репозиториях сборок: гасит живая игра — `run-game.sh`, пульт
//            `h.sh`, `launch-bg.ps1` · `launch-fg.ps1` (the two paths, 2026-10-30), `capture-window.ps1`, `measure-walk.sh`, `tools/test-*.mjs`;
//   tool   — прочие скрипты (`.mjs .js .py .ps1 .sh`): гасит запуск самого файла (имя файла в команде).
// `--check`, `--help`, `py_compile` — гигиена, не прогон: долг не гасят (TESTING_FRAMEWORK.md → «What the word "test" means»).
// Состояние — `.kaif/test-debt.json` (вне git). Stop с долгом — блок; повторная остановка без новых правок — пропуск (от вечного круга).
// Проверить нельзя (нет устройства, игра занята владельцем) — `node tools/hooks/test-after-code.mjs --waive "<почему>"`.
// Хук что-то сломал — молча выход 0 (сессию не роняет).
//
//   node tools/hooks/test-after-code.mjs            # событие Claude Code на stdin
//   node tools/hooks/test-after-code.mjs --status   # долг сейчас
//   node tools/hooks/test-after-code.mjs --selftest
//
// @guard test-after-code
// THREAT:         агент пишет код, проверяет его синтаксисом и говорит «готово» (или спрашивает владельца, можно ли проверить) — код не
//                 видел живого прогона
// PROVED-AGAINST: --selftest — правка .lua мода → долг и полный приказ; правка скрипта → короткий; `node --check` и `py_compile` долг не
//                 гасят; запуск игры гасит game, но не tool; запуск самого скрипта гасит его; тест ядра гасит engine; Stop с долгом → block;
//                 повторный Stop без правок → тишина; правка .md → не долг; файл вне ai_sandbox → не долг; мутант без записи долга → красный
// GAP:            хук видит, что прогон БЫЛ, не что он проверял написанное и что результат прочитан — это судья и отчёт прогона; код,
//                 записанный мимо Write/Edit (heredoc в Bash), хуку не виден; имя файла в команде — признак запуска, не доказательство
//                 + 2026-10-25 16:4x: данные сборки (modpack.json, .ini, .locres, .pak вне KUMM) и раскатка в игру (Deploy-ModPack -Deploy
//                 без -DryRun, deploy-localization.py, deploy-hot/cold.sh, translation_deploy.sh) — долг game; прежняя версия на этих
//                 случаях красная в 5 точках; самопроверка стражей tools/test-guards.mjs долг игры не гасит (была красной в 1 точке)
//                 + 2026-10-26: `cp` в папку игры (ConanSandbox/Mods и др.) — долг раскатки; долг раскатки гасит только ЗАПУСК игры после
//                 неё (снимок окна и пульт открытого сеанса — нет), кроме горячей выкладки Сварога; мутанты «без проверки запуска» и «без
//                 разбора цели копии» красные (по 1 и 2 точкам). Дыра --waive (агент сам себе пишет отказ) — остаётся, отказы видны в
//                 .kaif/test-debt.json → waivers
// ON-REAL-PATH:   2026-10-25 11:11 — wired mid-session in .claude/settings.local.json; the full order reached the context after the next
//                 Edit of this very file, and its own --selftest run cleared the debt («прогон засчитан … непроверенного кода нет»);
//                 2026-10-25 16:4x — живая раскатка `deploy-localization.py` записала `deploy:deploy-localization.py [game]` и полный приказ;
//                 2026-10-26 13:11 — `cp` пака JaarFishing в ConanSandbox/Mods записал `deploy:copy JaarFishing.pak`, запуск launch-bg.ps1 погасил
//                 2026-10-28 22:3x — живое событие Stop на дереве KUMM: блок с 15 кейсами без прогона (матрица ПКМ 27.10, F3–F5, C1)
// [TESTED: 2026-10-25 · --selftest 14 steps green, the mutant without the debt write red on 6 points; live order and clear in this session —
//  testcases/reports/2026-10-25_test-after-code-hook.md]
// 2026-10-28: открытые кейсы — --selftest зелёный (свежий файл: S3 blocked и F3 [NOT-TESTED] найдены, старый файл и pass/fail — нет; Stop
// блок, повтор без правок — тишина, после прогона — тишина); мутант «openCases пуст» красный в 2 точках.
import { readFileSync, writeFileSync, mkdtempSync, rmSync, mkdirSync, readdirSync, statSync, utimesSync } from 'node:fs';
import { join, resolve, relative, isAbsolute, extname, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..', '..');   // KUMM — здесь живёт состояние
const SANDBOX = resolve(ROOT, '..');                                       // D:\work\ai_sandbox — откуда считаются пути долга
const STATE = '.kaif/test-debt.json';
const SKIP = /\/(node_modules|_catalog|bin|obj|\.kaif|\.git)\//;

/** The kind of a code file (path relative to ai_sandbox), or null for anything that is not code (docs, data, images). */
export function kindOf(rel) {
  const p = rel.replaceAll('\\', '/');
  if (SKIP.test('/' + p)) return null;
  const ext = extname(p).toLowerCase();
  if (p === 'KUMM/kumm.mjs' || p === 'KUMM/Deploy-ModPack.ps1') return 'engine';
  if (ext === '.lua' || (ext === '.cs' && !p.startsWith('KUMM/'))) return 'game';
  // Данные сборки меняют игру не меньше кода: манифест, конфиги движка, перевод, паки (2026-10-25: Severe Weather, r.Fog=1 и перевод
  // на 7 147 записей ушли в игру, а хук молчал — `[OWNER]` «в мире не видел - почему хук тебя не дернул»)
  if (!p.startsWith('KUMM/') && (/(^|\/)modpack\.json$/.test(p) || ['.ini', '.locres', '.pak'].includes(ext))) return 'game';
  if (['.mjs', '.js', '.py', '.ps1', '.sh'].includes(ext)) return 'tool';
  return null;
}

// tools/test-guards.mjs — самопроверка стражей KUMM, а не прогон игры (2026-10-25 она погасила долг раскатки)
const GAME_RUN = /run-game\.sh|\bh\.sh\b|launch-[bf]g\.ps1|capture-window\.ps1|measure-walk\.sh|tools\/test-(?!guards\.mjs)[\w-]+\.mjs/;
const ENGINE_RUN = /test-[\w-]+\.mjs|fixture-pack\.mjs|kumm\.mjs\s+(?!--check)\S|Deploy-ModPack\.ps1/;
const HYGIENE = /--check\b|--help\b|py_compile|-m\s+compileall|PSParser/;
// Раскатка в игру — тоже долг вида game: что ушло в игру, проверяется в игре. Пробный прогон (-DryRun, -ListMods, -Verify) — нет.
const DEPLOYS = [
  ['Deploy-ModPack.ps1', /Deploy-ModPack\.ps1\b(?=.*\s-Deploy\b)(?!.*\s-DryRun\b)/],
  ['deploy-localization.py', /deploy-localization\.py\b/],
  ['deploy-hot.sh', /deploy-hot\.sh\b/],
  ['deploy-cold.sh', /deploy-cold\.sh\b/],
  ['translation_deploy.sh', /translation_deploy\.sh\b/],
];

// Копирование файла в папку игры — тоже раскатка (2026-10-26: паки DamageNumber и UIMod_Hosav легли в ConanSandbox/Mods обычным `cp`,
// долга не было — `[OWNER]` «игре я это ещё не видел - почему хук тебя не дернул»). Цель копии — последнее слово команды копирования.
const COPY_VERB = /(^|[\s;&|(])(cp|copy|Copy-Item|xcopy|robocopy|mv|Move-Item)\s/i;
const GAME_DIR = /\/(ConanSandbox\/(Mods|Content|Binaries)|BepInEx\/(plugins|config)|Pal\/(Content|Binaries)|Content\/Paks)(\/|"|'|$)/i;
// Раскатку, которую игра читает только при запуске, гасит только ЗАПУСК после неё: снимок окна или пульт открытого сеанса смотрят на
// старые файлы (2026-10-26: снимок сеанса 11:24 погасил долг перевода, раскатанного в ≈12:03). Горячая выкладка Сварога — исключение:
// её игра подхватывает на ходу, и её гасит любой прогон игры.
const LAUNCH = /run-game\.sh|launch-[bf]g\.ps1|enter-world[\w-]*\.ps1|run-camera-test\.ps1/;
const HOT = new Set(['deploy:deploy-hot.sh']);

/** Debt keys a command creates by deploying into a game. */
export function deploysOf(command) {
  const cmd = (command || '').replaceAll('\\', '/');
  if (HYGIENE.test(cmd)) return [];
  const out = DEPLOYS.filter(([, re]) => re.test(cmd)).map(([name]) => `deploy:${name}`);
  for (const seg of cmd.split(/;|&&|\|\||\n/)) {
    const m = seg.match(COPY_VERB);
    if (!m) continue;
    const words = seg.slice(m.index + m[0].length).trim().match(/"[^"]*"|'[^']*'|\S+/g) || [];
    const dest = (words.filter((w) => !w.startsWith('-')).pop() || '').replace(/^["']|["']$/g, '');
    if (GAME_DIR.test(dest + '/')) out.push(`deploy:copy ${basename(dest) || dest}`);
  }
  return out;
}

/** The debt entries a command clears (their keys), from the debt as it stands. */
export function cleared(command, debt) {
  const cmd = (command || '').replaceAll('\\', '/');
  if (HYGIENE.test(cmd)) return [];
  const out = [];
  for (const [rel, d] of Object.entries(debt)) {
    if (d.kind === 'game' && rel.startsWith('deploy:') && !HOT.has(rel)) { if (LAUNCH.test(cmd)) out.push(rel); }
    else if (d.kind === 'game' && GAME_RUN.test(cmd)) out.push(rel);
    else if (d.kind === 'engine' && ENGINE_RUN.test(cmd)) out.push(rel);
    else if (d.kind === 'tool' && cmd.includes(basename(rel))) out.push(rel);
  }
  return out;
}

const FULL = (files) => `test-after-code · ТЫ НАПИСАЛ КОД — ПРОТЕСТИРУЙ ЕГО (слово владельца: «Агент не просит разрешения у владельца!» · цикл «код - тесты - правки - код - тесты - правки»). Непроверено: ${files}. Шаги, сам, без вопроса владельцу: 1) TESTING_FRAMEWORK.md — «What the word "test" means» и «The testing activities»; 2) что код должен делать и какой результат ОЖИДАЕШЬ — кейсы в testcases/TC_*.md; 3) прогон на живом продукте по пути пользователя (мод — игра под замком машины, журнал и кадр читать; движок — тесты ядра и стенд fixture-pack; скрипт — запуск самого файла на настоящих данных); 4) сравни ОЖИДАЕМОЕ с ФАКТИЧЕСКИМ; 5) косяк — почини и прогони снова. Синтаксис, --check и линтер — гигиена, не тест. Можно писать всю пачку кода и тестировать пачкой — но до остановки. Проверить нельзя — \`node tools/hooks/test-after-code.mjs --waive "<почему>"\`.`;
const SHORT = (n, files) => `test-after-code · непроверенного кода: ${n} (${files}) — протестируй прогоном, прежде чем остановиться или сказать «готово».`;

// Открытые кейсы (2026-10-28): долг game гасит любой запуск игры, и остановка смотрела только на него — кейс S3 «дзинь только герою»
// остался `blocked`, а хук молчал (`[OWNER]` «почему тебя не дёрнул хук?» · 2026-10-28 22:2x). Теперь остановка читает и таблицы кейсов:
// строка со статусом `[NOT-TESTED]` или `blocked` в TC_*.md, тронутом за последние CASE_WINDOW_H часов, — тот же долг. [NOT-TESTED]
const CASE_WINDOW_H = 6;
const OPEN_STATUS = /^\s*(\[NOT-TESTED\]|blocked\b)/i;

/** Cases still waiting for a run: `<file>:<case id>` from the status column of every table in recently touched TC files. */
export function openCases(root, now) {
  const dir = join(root, 'testcases');
  const since = Date.parse(now) - CASE_WINDOW_H * 3600e3;
  let names = [];
  try { names = readdirSync(dir).filter((n) => /^TC_.*\.md$/.test(n)); } catch { return []; }
  const out = [];
  for (const n of names) {
    const p = join(dir, n);
    if (statSync(p).mtimeMs < since) continue;
    let col = -1;
    for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
      if (!line.startsWith('|')) { col = -1; continue; }
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (col < 0) { col = cells.findIndex((c) => /^status$/i.test(c)); continue; }
      if (/^:?-{3,}/.test(cells[0] || '')) continue;
      if (OPEN_STATUS.test(cells[col] || '')) out.push(`${n.replace(/\.md$/, '')}:${cells[0]}`);
    }
  }
  return out;
}

const CASES = (ids) => `test-after-code · КЕЙСЫ БЕЗ ПРОГОНА: ${ids.slice(0, 8).join(', ')}${ids.length > 8 ? ` и ещё ${ids.length - 8}` : ''}. Прогони их сейчас по пути пользователя и запиши статус с наблюдением. Нужен владелец (его руки, его экран) — позови: \`node .kaif/tools/contour/review.mjs --call "<что нужно>"\` и впиши кейс в STATUS «ждёт владельца»; «blocked» без зова — не исход.`;

function list(debt) {
  const keys = Object.keys(debt);
  return keys.slice(0, 6).join(', ') + (keys.length > 6 ? ` и ещё ${keys.length - 6}` : '');
}

function load(root) {
  try { return JSON.parse(readFileSync(join(root, STATE), 'utf8')); } catch { return { debt: {}, waivers: [], lastStopDebt: '' }; }
}
function save(root, s) {
  mkdirSync(dirname(join(root, STATE)), { recursive: true });
  writeFileSync(join(root, STATE), JSON.stringify(s, null, 1) + '\n');
}

/** One Claude Code event → the hook's stdout object (or null for silence). Mutates the state file. */
export function handle(event, root = ROOT, sandbox = SANDBOX, now = new Date().toISOString()) {
  const s = load(root);
  s.debt ||= {}; s.waivers ||= [];
  const tool = event.tool_name || '';
  const name = event.hook_event_name || '';
  if (name === 'Stop') {
    const keys = Object.keys(s.debt);
    const cases = openCases(root, now);
    if (!keys.length && !cases.length) { s.lastStopDebt = ''; save(root, s); return null; }
    const sig = keys.sort().join('|') + '@' + (keys.length ? Math.max(...Object.values(s.debt).map((d) => Date.parse(d.at))) : 0) + '#' + cases.join('|');
    if (event.stop_hook_active && s.lastStopDebt === sig) return null;   // asked already, nothing new written — no endless loop
    s.lastStopDebt = sig;
    save(root, s);
    return { decision: 'block', reason: [keys.length ? FULL(list(s.debt)) : '', cases.length ? CASES(cases) : ''].filter(Boolean).join(' ') };
  }
  if (/^(Write|Edit|MultiEdit)$/.test(tool)) {
    const path = (event.tool_input || {}).file_path;
    if (!path) return null;
    const rel = relative(sandbox, resolve(path)).replaceAll('\\', '/');
    if (!rel || rel.startsWith('..') || isAbsolute(rel)) return null;
    const kind = kindOf(rel);
    if (!kind) return null;
    const first = Object.keys(s.debt).length === 0;
    s.debt[rel] = { kind, at: now };
    save(root, s);
    const text = first ? FULL(list(s.debt)) : SHORT(Object.keys(s.debt).length, list(s.debt));
    return { hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: text } };
  }
  if (/^(Bash|PowerShell)$/.test(tool)) {
    const command = (event.tool_input || {}).command || '';
    const done = cleared(command, s.debt);
    for (const k of done) delete s.debt[k];
    const deployed = deploysOf(command);
    if (deployed.length) {
      const first = Object.keys(s.debt).length === 0;
      for (const k of deployed) s.debt[k] = { kind: 'game', at: now };
      save(root, s);
      const text = first ? FULL(list(s.debt)) : SHORT(Object.keys(s.debt).length, list(s.debt));
      return { hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: text } };
    }
    if (!done.length) return null;
    save(root, s);
    const left = Object.keys(s.debt).length;
    return { hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext:
      `test-after-code · прогон засчитан для: ${done.join(', ')} — прочитай его результат и сравни с ожидаемым${left ? `; непроверенным осталось: ${list(s.debt)}` : '; непроверенного кода нет'}.` } };
  }
  return null;
}

// ── CLI ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
if (argv[0] === '--status') {
  const s = load(ROOT);
  const keys = Object.keys(s.debt || {});
  console.log(keys.length ? `test debt: ${keys.length} — ${keys.map((k) => `${k} [${s.debt[k].kind}]`).join(', ')}` : 'test debt: none');
  process.exit(0);
}
if (argv[0] === '--waive') {
  const why = argv.slice(1).join(' ').trim();
  if (!why) { console.log('--waive needs a reason: why this code cannot be run (no device, the owner is in the game, …)'); process.exit(1); }
  const s = load(ROOT);
  const keys = Object.keys(s.debt || {});
  (s.waivers ||= []).push({ at: new Date().toISOString(), files: keys, why });
  s.debt = {};
  save(ROOT, s);
  console.log(`waived ${keys.length} file(s): ${why}`);
  process.exit(0);
}
if (argv[0] === '--selftest') {
  const dir = mkdtempSync(join(tmpdir(), 'test-after-code-'));
  const sb = join(dir, 'ai_sandbox');
  const fails = [];
  const ev = (o) => handle(o, dir, sb, '2026-06-15T12:00:00.000Z');
  const edit = (p) => ev({ hook_event_name: 'PostToolUse', tool_name: 'Edit', tool_input: { file_path: join(sb, p) } });
  const bash = (c) => ev({ hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command: c } });
  const ctx = (r) => r?.hookSpecificOutput?.additionalContext || '';
  try {
    if (edit('KUMM/STATUS.md') !== null) fails.push('a .md became debt');
    if (ev({ hook_event_name: 'PostToolUse', tool_name: 'Write', tool_input: { file_path: join(dir, 'scratch', 'x.py') } }) !== null) fails.push('a file outside ai_sandbox became debt');
    const a = ctx(edit('ConanExiles/_unpacked/ConanModPackStatus/Scripts/main.lua'));
    if (!a.includes('ПРОТЕСТИРУЙ') || !a.includes('TESTING_FRAMEWORK')) fails.push(`first edit: no full order (${a.slice(0, 40)})`);
    const b = ctx(edit('ConanExiles/_config/devkit/build-ru-table.py'));
    if (!b.includes('непроверенного кода: 2')) fails.push(`second edit: no short order (${b})`);
    if (bash('python -m py_compile ConanExiles/_config/devkit/build-ru-table.py') !== null) fails.push('py_compile cleared debt');
    if (bash('node --check tools/hooks/x.mjs') !== null) fails.push('--check cleared debt');
    const stop = ev({ hook_event_name: 'Stop', stop_hook_active: false });
    if (stop?.decision !== 'block' || !stop.reason.includes('main.lua')) fails.push('Stop with debt not blocked');
    if (ev({ hook_event_name: 'Stop', stop_hook_active: true }) !== null) fails.push('repeated Stop without new edits blocked again (loop)');
    const g = ctx(bash('powershell -File _config/launch-bg.ps1'));
    if (!g.includes('main.lua') || g.includes('build-ru-table.py,')) fails.push(`game run: wrong clear (${g})`);
    if (!load(dir).debt['ConanExiles/_config/devkit/build-ru-table.py']) fails.push('a game run cleared a tool');
    bash('python -I -X utf8 ../devkit/build-ru-table.py a b c');
    if (Object.keys(load(dir).debt).length) fails.push('running the tool did not clear it');
    if (ev({ hook_event_name: 'Stop', stop_hook_active: false }) !== null) fails.push('Stop without debt blocked');
    edit('KUMM/Deploy-ModPack.ps1');
    if (load(dir).debt['KUMM/Deploy-ModPack.ps1']?.kind !== 'engine') fails.push('Deploy-ModPack.ps1 is not engine');
    bash('bash tools/run-game.sh');
    if (!load(dir).debt['KUMM/Deploy-ModPack.ps1']) fails.push('a game run cleared engine code');
    bash('node tools/fixture-pack.mjs');
    if (Object.keys(load(dir).debt).length) fails.push('the fixture stand did not clear engine code');
    edit('SvarogsDream/src/KrinikUIRework/TipsBag.cs');
    bash('bash SvarogsDream/tools/h.sh "call X"');
    if (Object.keys(load(dir).debt).length) fails.push('the Svarog console did not clear game code');
    // 2026-10-25: build data and the deploy itself change the game as much as code does (Severe Weather + r.Fog=1 + 7 147-entry
    // locres went into the game and nothing asked for a world run — the owner: «в мире не видел - почему хук тебя не дернул»)
    edit('ConanExiles/modpack.json');
    edit('ConanExiles/_config/Engine.ini');
    edit('ConanExiles/_config/localization/Game/ru/Game.locres');
    for (const k of ['ConanExiles/modpack.json', 'ConanExiles/_config/Engine.ini', 'ConanExiles/_config/localization/Game/ru/Game.locres'])
      if (load(dir).debt[k]?.kind !== 'game') fails.push(`${k} is not game debt`);
    bash('powershell -File _config/launch-bg.ps1');
    if (Object.keys(load(dir).debt).length) fails.push('a game run did not clear build data');
    if (edit('KUMM/.kaif/kaif.json') !== null || edit('KUMM/package.json') !== null) fails.push('KUMM json became game debt');
    bash('& D:/work/ai_sandbox/KUMM/Deploy-ModPack.ps1 -Deploy -DryRun -PackDir D:/work/ai_sandbox/ConanExiles');
    bash('python -I -X utf8 deploy-localization.py --check');
    if (Object.keys(load(dir).debt).length) fails.push('a dry run or --check became deploy debt');
    const dep = ctx(bash('& D:/work/ai_sandbox/KUMM/Deploy-ModPack.ps1 -Deploy -WithEngineIni -PackDir D:/work/ai_sandbox/ConanExiles'));
    if (load(dir).debt['deploy:Deploy-ModPack.ps1']?.kind !== 'game' || !dep.includes('ПРОТЕСТИРУЙ')) fails.push(`a real deploy is not game debt (${dep.slice(0, 40)})`);
    bash('python -I -X utf8 deploy-localization.py');
    if (!load(dir).debt['deploy:deploy-localization.py']) fails.push('deploy-localization.py is not game debt');
    bash('node D:/work/ai_sandbox/KUMM/tools/test-guards.mjs');
    if (!load(dir).debt['deploy:deploy-localization.py']) fails.push('the guards self-test cleared game debt (it is not a game run)');
    // 2026-10-26: a snapshot of a session started BEFORE the deploy cleared it — only a launch after the deploy clears now
    bash('powershell -File _config/capture-window.ps1 -Out x.jpg');
    bash('bash _config/pult.sh "lua return 1"');
    if (!load(dir).debt['deploy:deploy-localization.py']) fails.push('a snapshot / pult of the open session cleared deploy debt');
    bash('powershell -File _config/launch-bg.ps1');
    if (Object.keys(load(dir).debt).length) fails.push('a launch after the deploy did not clear deploy debt');
    // 2026-10-26: `cp` of a pak into the game's Mods folder was no deploy at all
    const cp = ctx(bash('cp "D:/Games/Conan Exiles Mods/mods/_krinik-modified/3748867573/UIMod_Hosav.pak" "D:/Games/Conan Exiles 3.0.1/ConanSandbox/Mods/UIMod_Hosav.pak" && md5sum x'));
    if (!load(dir).debt['deploy:copy UIMod_Hosav.pak'] || !cp.includes('ПРОТЕСТИРУЙ')) fails.push(`cp into the game Mods folder is not deploy debt (${cp.slice(0, 40)})`);
    bash('cp "D:/Games/Conan Exiles 3.0.1/ConanSandbox/Mods/UIMod_Hosav.pak" /d/Temp/scratch/x.pak');
    bash('cp "D:/Games/Conan Exiles Mods/mods/_workshop/1/A.pak" "D:/Games/Conan Exiles Mods/_patch-originals/A.pak"');
    if (Object.keys(load(dir).debt).length !== 1) fails.push(`a copy OUT of the game or into the library became deploy debt (${Object.keys(load(dir).debt)})`);
    bash('powershell -File _config/launch-bg.ps1');
    edit('SvarogsDream/src/X.cs');
    bash('bash SvarogsDream/tools/deploy-hot.sh');
    bash('bash SvarogsDream/tools/h.sh "call X"');
    if (Object.keys(load(dir).debt).length) fails.push('the Svarog hot deploy is no longer cleared by its console');
    // 2026-10-28: a case left `blocked` / `[NOT-TESTED]` in a fresh TC file is debt too (S3 «дзинь» — the hook stayed silent)
    mkdirSync(join(dir, 'testcases'), { recursive: true });
    const tc = join(dir, 'testcases', 'TC_x.md');
    const old = join(dir, 'testcases', 'TC_old.md');
    const nowD = new Date('2026-06-15T12:00:00.000Z');
    writeFileSync(old, '| # | Case | Status |\n|---|---|---|\n| Z9 | old | [NOT-TESTED] |\n');
    utimesSync(old, new Date(nowD - 24 * 3600e3), new Date(nowD - 24 * 3600e3));
    writeFileSync(tc, '| # | Case | Steps | Status | Observation |\n|---|---|---|---|---|\n| Q1 | a | b | pass | seen |\n| S3 | ding | rmb | blocked | owner at the machine |\n| F3 | empty | look | [NOT-TESTED] | |\n| Q2 | c | d | fail (build 3) → build 4 | x |\n');
    utimesSync(tc, nowD, nowD);
    const oc = openCases(dir, '2026-06-15T12:00:00.000Z').join(',');
    if (oc !== 'TC_x:S3,TC_x:F3') fails.push(`open cases read wrong (${oc}; want TC_x:S3,TC_x:F3, an old file and pass/fail rows ignored)`);
    const st = ev({ hook_event_name: 'Stop', stop_hook_active: false });
    if (st?.decision !== 'block' || !st.reason.includes('TC_x:S3')) fails.push('Stop with a blocked case not blocked');
    if (ev({ hook_event_name: 'Stop', stop_hook_active: true }) !== null) fails.push('repeated Stop on the same open cases blocked again (loop)');
    writeFileSync(tc, '| # | Case | Status |\n|---|---|---|\n| S3 | ding | pass |\n| F3 | empty | pass |\n');
    utimesSync(tc, nowD, nowD);
    if (ev({ hook_event_name: 'Stop', stop_hook_active: false }) !== null) fails.push('Stop with every case run still blocked');
  } finally { rmSync(dir, { recursive: true, force: true }); }
  console.log(fails.length ? `❌ selftest FAILED — ${fails.join(' · ')}` : '✅ selftest OK — code edit → full then short order; --check/py_compile do not clear; game/engine/tool runs clear their own kind; Stop blocks with debt, not twice without new edits; .md and files outside ai_sandbox are not debt');
  process.exit(fails.length ? 1 : 0);
}

try {
  const event = JSON.parse(readFileSync(0, 'utf8').replace(/^﻿/, ''));
  const out = handle(event);
  if (out) process.stdout.write(JSON.stringify(out));
} catch { /* a hook never breaks the session */ }
process.exit(0);
