#!/usr/bin/env node
// fixture-pack.mjs — постоянный стенд для игровой половины движка: поддельный пак во временной папке ОС (манифест, библиотека
// с именами по схеме libraryName, папка «игры» с файлом-признаком) и прогон Deploy-ModPack.ps1 по нему — без сети, без игры,
// без пака владельца.
// Зачем: 08.09.2026 разовый стенд в скретчпаде за один заход нашёл ЧЕТЫРЕ дефекта переносимости (bugs/03_DONE, EXP-0043) и умер
// вместе с сессией (пункт беклога STATUS «A fixture pack»).
// Срез 2026-10-14: -ListMods (разбор манифеста, список модов) и -Deploy -DryRun (поиск архива по nexusId через зеркало разбора
// имени в PowerShell, пропуск выключенного). Срез 2026-10-15 (`84e4ba4`): настоящая раскатка -Deploy в папку стенда, -Verify
// (удалённый сторожевой файл — [FAIL] и код 1), паки после -Only — всего 20 проверок; прогон 2026-10-16 — все 20 прошли.
// Запуск: node tools/fixture-pack.mjs      (код 0 — режимы прошли; папка стенда печатается и остаётся до перезагрузки — temp ОС)
//         KUMM_DEPLOY=<другой Deploy-ModPack.ps1> — прогнать стенд по копии скрипта.
// 2026-10-14 14:36: 10 проверок прошли; копия скрипта с дефектом бага 03 (id ровно из четырёх цифр) — красные ровно две названные
// заранее: «-DryRun: код 0» и «More Katanas (id 41) найден по nexusId». [NOT-TESTED]
import { mkdirSync, writeFileSync, readFileSync, existsSync, unlinkSync, readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KUMM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(tmpdir(), `kumm-fixture-${Date.now()}`)
const LIB = path.join(DIR, 'mods')
const GAME = path.join(DIR, 'game')

// Моды стенда: длинное имя с версией внутри (ловушка разбора), короткий id Конана, выключенный мод.
const MODS = [
  { name: 'Camera Control', kind: 'lua', version: '1.0.4', nexusId: 3659, file: 'Camera Control 1.0.4 3659 1.0.4 2026-07-16T17-00Z abcdefghi.zip' },
  { name: 'More Katanas', kind: 'pak', version: '1.0.1', nexusId: 41, file: 'More Katanas 41 1.0.1 2026-09-08T00-00Z abcdefghi.zip' },
  { name: 'Parked Mod', kind: 'pak', version: '2', nexusId: 7, enabled: false, file: 'Parked Mod 7 2 2026-09-01T10-00Z abcdefghi.zip' },
  // баг 46: мод без шагов install кладёт 0 файлов — раскатка должна предупредить, а не сказать [ok]
  { name: 'Empty Mod', kind: 'lua', version: '1', nexusId: 9, noInstall: true, file: 'Empty Mod 9 1 2026-09-02T10-00Z abcdefghi.zip' },
]

mkdirSync(LIB, { recursive: true })
mkdirSync(GAME, { recursive: true })
// Архивы — настоящие крошечные zip (одна строка текста): -Deploy -DryRun их открывает. Пишет их PowerShell (Compress-Archive) —
// zip в Node без зависимостей не собрать.
const SEED = path.join(DIR, 'seed.txt')
writeFileSync(SEED, 'kumm fixture\n')
const q = s => `'${s.replace(/'/g, "''")}'`   // строка PowerShell в одинарных кавычках; -Command не передаёт $args
for (const m of MODS)
  execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -LiteralPath ${q(SEED)} -DestinationPath ${q(path.join(LIB, m.file))}`])
writeFileSync(path.join(GAME, 'FixtureGame.exe'), '')
// Без маски source.archive: раскатка ищет архив по nexusId, разбирая имена библиотеки, — зеркало parseArchive в Deploy-ModPack.ps1.
// Маска «<имя> <id> *» не ловила «Camera Control 1.0.4 3659 …» (стенд 14:35 — дефект стенда, не движка).
writeFileSync(path.join(DIR, 'modpack.json'), JSON.stringify({
  packName: 'KUMM fixture pack', builtFor: 'fixture', nexusGame: 'fixturegame', gameExe: 'FixtureGame.exe', library: 'mods',
  // шаг install «всё из архива → Mods/<имя>»: без шагов (и без kind pak + modsDir) раскатка кладёт 0 файлов и говорит [ok] (проба 14:38)
  // Camera Control — со строкой verify (сторожевой путь), More Katanas — без неё: «nothing to verify» (баг 46)
  mods: MODS.map(({ file, noInstall, ...m }) => ({ ...m, ...(noInstall ? {} : { install: [{ from: '.', to: `Mods/${m.name}` }] }),
    ...(m.name === 'Camera Control' ? { verify: ['Mods/Camera Control/seed.txt'] } : {}) })),
}, null, 2))
writeFileSync(path.join(DIR, 'targets.json'), JSON.stringify({ targets: [{ name: 'fixture', path: GAME }] }, null, 2))

// KUMM_DEPLOY — другой Deploy-ModPack.ps1 (копия со внесённой поломкой — доказать, что стенд краснеет)
const DEPLOY = process.env.KUMM_DEPLOY || path.join(KUMM, 'Deploy-ModPack.ps1')
const ps = args => {
  try {
    return { code: 0, out: execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', DEPLOY, '-PackDir', DIR, ...args], { encoding: 'utf8' }) }
  } catch (e) { return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` } }
}

let bad = 0
const expect = (label, good, detail) => { if (!good) bad++; console.log(`  ${good ? 'OK  ' : 'МИМО'}  ${label}${good ? '' : `\n${detail}`}`) }

console.log(`fixture: ${DIR}`)
const list = ps(['-ListMods'])
expect('-ListMods: код 0', list.code === 0, list.out)
for (const m of MODS) expect(`-ListMods: «${m.name}» ${m.enabled === false ? 'disabled' : 'enabled'}`,
  new RegExp(`${m.enabled === false ? 'disabled' : 'enabled'}\\s+${m.name}`).test(list.out), list.out)
expect('-ListMods: имя пака в шапке', list.out.includes('KUMM fixture pack'), list.out)

const dry = ps(['-Deploy', '-DryRun'])
expect('-Deploy -DryRun: код 0', dry.code === 0, dry.out)
expect('-Deploy -DryRun: режим «ничего не пишется»', dry.out.includes('DRY RUN'), dry.out)
for (const m of MODS.filter(x => x.enabled !== false))
  expect(`-Deploy -DryRun: «${m.name}» найден по nexusId`, new RegExp(`\\[ok\\]\\s+${m.name}`).test(dry.out), dry.out)
expect('-Deploy -DryRun: выключенный пропущен', /Parked Mod: skipped \(disabled/.test(dry.out), dry.out)

// ---- боевая раскатка в папку стенда и -Verify (баг 46)
const dep = ps(['-Deploy'])
expect('-Deploy: Camera Control положил файл', existsSync(path.join(GAME, 'Mods', 'Camera Control', 'seed.txt')), dep.out)
expect('-Deploy: мод с 0 файлов — предупреждение, не [ok]', /\[warn\]\s+Empty Mod 1\s+\(0 files/.test(dep.out), dep.out)
const ver = ps(['-Verify'])
expect('-Verify: сторожевой путь Camera Control найден', /\[ok\]\s+Camera Control: Mods\/Camera Control\/seed\.txt/.test(ver.out), ver.out)
expect('-Verify: мод без verify — «nothing to verify»', /\[warn\]\s+More Katanas: nothing to verify/.test(ver.out), ver.out)
unlinkSync(path.join(GAME, 'Mods', 'Camera Control', 'seed.txt'))
const ver2 = ps(['-Verify'])
expect('-Verify: удалён сторожевой файл — [FAIL] и код 1', ver2.code === 1 && /\[FAIL\]\s+Camera Control/.test(ver2.out), ver2.out)

// ---- второй пак «как Конан»: моды-паки, порядок загрузки в modlist.txt (баг 06)
const PDIR = path.join(DIR, 'pakpack'), PLIB = path.join(PDIR, 'mods'), PGAME = path.join(PDIR, 'game')
mkdirSync(PLIB, { recursive: true }); mkdirSync(PGAME, { recursive: true })
const PAKS = [
  { name: 'Alpha Arms', kind: 'pak', version: '1', nexusId: 11, pak: 'AlphaArms.pak', file: 'Alpha Arms 11 1 2026-09-03T10-00Z abcdefghi.zip' },
  { name: 'Beta Bows', kind: 'pak', version: '1', nexusId: 12, pak: 'BetaBows.pak', file: 'Beta Bows 12 1 2026-09-04T10-00Z abcdefghi.zip' },
  // Gamma — мод-папка (source.folder), как наши моды кита: по нему -Only находит место нового пака (хвост бага 06, 2026-10-28)
  { name: 'Gamma Gear', kind: 'pak', version: '1', source: { folder: 'gamma' }, pak: 'GammaGear.pak' },
]
mkdirSync(path.join(PDIR, 'gamma'), { recursive: true })
writeFileSync(path.join(PDIR, 'gamma', 'GammaGear.pak'), 'pak')
for (const m of PAKS.filter(m => m.file)) {
  const pakFile = path.join(PDIR, m.pak)
  writeFileSync(pakFile, 'pak')
  execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -LiteralPath ${q(pakFile)} -DestinationPath ${q(path.join(PLIB, m.file))}`])
}
writeFileSync(path.join(PGAME, 'FixtureGame.exe'), '')
writeFileSync(path.join(PDIR, 'modpack.json'), JSON.stringify({
  packName: 'KUMM fixture pak pack', builtFor: 'fixture', nexusGame: 'fixturegame', gameExe: 'FixtureGame.exe', library: 'mods',
  modsDir: 'Game/Mods', modList: 'Game/Mods/modlist.txt', mods: PAKS.map(({ file, pak, ...m }) => m),
}, null, 2))
writeFileSync(path.join(PDIR, 'targets.json'), JSON.stringify({ targets: [{ name: 'fixture', path: PGAME }] }, null, 2))
const pps = args => {
  try { return { code: 0, out: execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', DEPLOY, '-PackDir', PDIR, ...args], { encoding: 'utf8' }) } }
  catch (e) { return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` } }
}
const LIST = path.join(PGAME, 'Game', 'Mods', 'modlist.txt')
const lines = () => existsSync(LIST) ? readFileSync(LIST, 'utf8').split(/\r?\n/).filter(Boolean).join(',') : '(нет файла)'
const full = pps(['-Deploy'])
expect('паки: полная раскатка — modlist по манифесту', full.code === 0 && lines() === 'AlphaArms.pak,BetaBows.pak,GammaGear.pak', `${full.out}\nmodlist: ${lines()}`)
const one = pps(['-Deploy', '-Only', 'Beta Bows'])
expect('паки: -Only одного мода не выключает остальные (баг 06)', lines() === 'AlphaArms.pak,BetaBows.pak,GammaGear.pak', `${one.out}\nmodlist: ${lines()}`)
const pv = pps(['-Verify'])
expect('паки: -Verify после -Only — код 0, ни одного «not in modlist»', pv.code === 0 && !/not in modlist/.test(pv.out), pv.out)
// Новый пак при -Only — на своё место по манифесту, а не в конец (живая раскатка 2026-10-28: пак встал после того, кто обязан быть последним)
writeFileSync(LIST, 'AlphaArms.pak\r\nGammaGear.pak\r\n')
const ins = pps(['-Deploy', '-Only', 'Beta Bows'])
expect('паки: -Only нового пака — место по манифесту (перед модом-папкой ниже)', lines() === 'AlphaArms.pak,BetaBows.pak,GammaGear.pak', `${ins.out}\nmodlist: ${lines()}`)
// Переименованный мод при -Only: строка старого пака, которого уже нет рядом со списком, уходит (живая раскатка 2026-10-30:
// KrinikUIFixes.pak -> KrinikConanUI.pak, мёртвая строка осталась, и -Verify упал на «modlist names a missing pak»)
writeFileSync(LIST, 'AlphaArms.pak\r\nOldBows.pak\r\nGammaGear.pak\r\n')
const ren = pps(['-Deploy', '-Only', 'Beta Bows'])
expect('паки: -Only после переименования — мёртвая строка старого пака убрана, новый на месте', lines() === 'AlphaArms.pak,BetaBows.pak,GammaGear.pak' && /dropped OldBows\.pak/.test(ren.out), `${ren.out}\nmodlist: ${lines()}`)
const rv = pps(['-Verify'])
expect('паки: -Verify после переименования — код 0, ни одного «missing pak»', rv.code === 0 && !/missing pak/.test(rv.out), rv.out)
// Запись "export": false — только для машины сборщика: -Export её не везёт (приборы KrinikConanHarness, 2026-10-30: «в поставку сборки не включаем»)
const mp = JSON.parse(readFileSync(path.join(PDIR, 'modpack.json'), 'utf8'))
mp.mods.find(m => m.name === 'Beta Bows').export = false
writeFileSync(path.join(PDIR, 'modpack.json'), JSON.stringify(mp, null, 2))
const EXP = path.join(PDIR, '..', 'export-out')
const ex = pps(['-Export', EXP])
const srcDirs = existsSync(path.join(EXP, 'pack', 'src')) ? readdirSync(path.join(EXP, 'pack', 'src')).join(',') : '(нет src)'
expect('экспорт: запись "export": false не попала в архив, есть строка «dev-only»', !/Beta/i.test(srcDirs) && /dev-only, not exported: Beta Bows/.test(ex.out), `${ex.out}\nsrc: ${srcDirs}`)
expect('экспорт: соседняя запись на месте (контроль)', /Alpha/i.test(srcDirs), `src: ${srcDirs}`)

// Мод на ходу переписывает cvar, который задаёт Engine.ini сборки (пункт автономного пула STATUS, 2026-10-30): -Verify предупреждает с файлом и
// строкой; cvar, которого в Engine.ini нет, и сам файл Engine.ini сборки внутри папки мода — молчат. Последним: Engine.ini у цели не раскатан,
// и -Verify здесь законно даёт код 1 — проверяются только строки.
mkdirSync(path.join(PDIR, 'gamma', 'ue4ss', 'Scripts'), { recursive: true })
writeFileSync(path.join(PDIR, 'gamma', 'ue4ss', 'Scripts', 'main.lua'),
  '-- r.ViewDistanceScale 9 в комментарии не считается\nlocal x = 1\nExecuteConsoleCommand("r.ViewDistanceScale 3")\nExecuteConsoleCommand("r.NotInPack 1")\n')
writeFileSync(path.join(PDIR, 'gamma', 'Engine.ini'), '[SystemSettings]\r\nr.ViewDistanceScale=2\r\nr.Fog=0\r\n')
const mp2 = JSON.parse(readFileSync(path.join(PDIR, 'modpack.json'), 'utf8'))
mp2.engineIni = { file: 'gamma/Engine.ini', target: 'Game/Engine.ini', section: '[SystemSettings]' }
writeFileSync(path.join(PDIR, 'modpack.json'), JSON.stringify(mp2, null, 2))
const cv = pps(['-Verify'])
expect('Engine.ini: мод задаёт на ходу cvar сборки — предупреждение с файлом и строкой',
  /\[warn\]\s+Gamma Gear sets r\.ViewDistanceScale=3 at runtime \(ue4ss[\\/]Scripts[\\/]main\.lua:3\); the pack's Engine\.ini sets 2/.test(cv.out), cv.out)
expect('Engine.ini: cvar не из Engine.ini, комментарий и сам Engine.ini сборки — без предупреждений',
  !/r\.NotInPack/.test(cv.out) && !/main\.lua:1\)/.test(cv.out) && !/Engine\.ini:\d/.test(cv.out), cv.out)

// ---- журнал отката: установка возвращается на то, что лежало в игре ДО неё (KUMM bugs/72, 2026-10-31: раскатка затирала
// ролики, настройки и modlist.txt без копий, -Remove не знал паков). «Ваниль» стенда: свой пак игрока в modlist, родной ролик,
// родной Engine.ini, ПУСТАЯ родная папка (её откат обязан оставить). Путь игрока — запуск самого деинсталлятора .cmd.
const UDIR = path.join(DIR, 'undopack'), UGAME = path.join(UDIR, 'game')
const put = (p, s) => { mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s) }
put(path.join(UGAME, 'FixtureGame.exe'), '')
put(path.join(UGAME, 'Game', 'Mods', 'modlist.txt'), 'PlayerOwn.pak\r\n')
put(path.join(UGAME, 'Game', 'Mods', 'PlayerOwn.pak'), 'players own mod')
put(path.join(UGAME, 'Game', 'Movies', 'Intro.bk2'), 'vanilla movie')
put(path.join(UGAME, 'Game', 'Config', 'Engine.ini'), '[SystemSettings]\r\nr.Vanilla=1\r\n')
mkdirSync(path.join(UGAME, 'Game', 'Localization', 'Game'), { recursive: true })
put(path.join(UDIR, 'alpha', 'AlphaArms.pak'), 'pak')
put(path.join(UDIR, 'nointro', 'Intro.bk2'), 'stub')
put(path.join(UDIR, 'loc', 'Game.locres'), 'ru')
put(path.join(UDIR, 'deep', 'x.txt'), 'new')
put(path.join(UDIR, 'Engine.ini'), '[SystemSettings]\r\nr.Pack=1\r\n')
put(path.join(UDIR, 'un.cmd.txt'), '@echo off\r\nchcp 65001 >nul\r\necho Удаление сборки\r\npowershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0{BACKUP}\\Deploy-ModPack.ps1" -Restore -GameDir "%~dp0."\r\nif errorlevel 1 ( pause & exit /b 1 )\r\nif not "{SHORTCUT}"=="" powershell -NoProfile -Command "Remove-Item -LiteralPath (Join-Path ([Environment]::GetFolderPath(\'Desktop\')) \'{SHORTCUT}.lnk\') -ErrorAction SilentlyContinue"\r\npause\r\n(goto) 2>nul & del "%~f0"\r\n')
writeFileSync(path.join(UDIR, 'modpack.json'), JSON.stringify({
  packName: 'KUMM fixture undo pack', builtFor: 'fixture', nexusGame: 'fixturegame', gameExe: 'FixtureGame.exe', library: 'mods',
  modsDir: 'Game/Mods', modList: 'Game/Mods/modlist.txt',
  engineIni: { file: 'Engine.ini', target: 'Game/Config/Engine.ini', section: '[SystemSettings]' },
  uninstall: { cmd: 'Uninstall.cmd', template: 'un.cmd.txt' },
  mods: [
    { name: 'Alpha', kind: 'pak', version: '1', source: { folder: 'alpha' } },
    { name: 'NoIntro', kind: 'files', version: '1', source: { folder: 'nointro' }, install: [{ from: 'Intro.bk2', to: 'Game/Movies/Intro.bk2' }], verify: ['Game/Movies/Intro.bk2'] },
    { name: 'Loc', kind: 'files', version: '1', source: { folder: 'loc' }, install: [{ from: 'Game.locres', to: 'Game/Localization/Game/Game.locres' }], verify: ['Game/Localization/Game/Game.locres'] },
    { name: 'Deep', kind: 'files', version: '1', source: { folder: 'deep' }, install: [{ from: 'x.txt', to: 'Game/NewFolder/Deep/x.txt' }], verify: ['Game/NewFolder/Deep/x.txt'] },
  ],
}, null, 2))
mkdirSync(path.join(UDIR, 'mods'), { recursive: true })
writeFileSync(path.join(UDIR, 'targets.json'), JSON.stringify({ targets: [{ name: 'fixture', path: UGAME }] }, null, 2))
const ups = args => {
  try { return { code: 0, out: execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', DEPLOY, '-PackDir', UDIR, ...args], { encoding: 'utf8' }) } }
  catch (e) { return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` } }
}
// Снимок дерева: файлы с содержимым и папки (пустые тоже) — сравнение строкой.
const snap = root => {
  const out = []
  const walk = d => { for (const n of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(d, n.name), rel = path.relative(root, p)
    if (n.isDirectory()) { out.push(`D ${rel}`); walk(p) } else out.push(`F ${rel} ${readFileSync(p).toString('hex')}`) } }
  walk(root); return out.join('\n')
}
const before = snap(UGAME)
const JR = path.join(UGAME, '_kumm_backup', 'journal.txt'), UN = path.join(UGAME, 'Uninstall.cmd')
const u1 = ups(['-Deploy', '-WithEngineIni', '-NoVerify'])
expect('откат: раскатка — журнал и деинсталлятор на месте', u1.code === 0 && existsSync(JR) && existsSync(UN), u1.out)
expect('откат: деинсталлятор из шаблона — кириллица цела, {BACKUP} подставлен',
  existsSync(UN) && readFileSync(UN, 'utf8').includes('Удаление сборки') && readFileSync(UN, 'utf8').includes('%~dp0_kumm_backup\\Deploy-ModPack.ps1'), existsSync(UN) ? readFileSync(UN, 'utf8') : '(нет файла)')
expect('откат: раскатка заменила родной ролик и Engine.ini (условие проверки)',
  readFileSync(path.join(UGAME, 'Game', 'Movies', 'Intro.bk2'), 'utf8') === 'stub' && readFileSync(path.join(UGAME, 'Game', 'Config', 'Engine.ini'), 'utf8').includes('r.Pack'), u1.out)
const u2 = ups(['-Deploy', '-WithEngineIni', '-NoVerify'])
const jr = existsSync(JR) ? readFileSync(JR, 'utf8') : ''
expect('откат: повторная раскатка не затирает копию оригинала (одна строка на путь, копия — ваниль)',
  u2.code === 0 && (jr.match(/replaced\tGame\\Movies\\Intro\.bk2/g) || []).length === 1 &&
  readFileSync(path.join(UGAME, '_kumm_backup', 'files', 'Game', 'Movies', 'Intro.bk2'), 'utf8') === 'vanilla movie', `${u2.out}\n${jr}`)
let cmdOut = ''
try { cmdOut = execFileSync('cmd', ['/c', UN], { input: '\r\n\r\n', encoding: 'utf8' }) } catch (e) { cmdOut = `${e.stdout ?? ''}${e.stderr ?? ''} code ${e.status}` }
const after = snap(UGAME)
expect('откат: деинсталлятор игрока вернул папку игры побайтно (свой пак игрока, ролик, Engine.ini, пустая родная папка; без копий и без себя)',
  after === before, `${cmdOut}\n--- было\n${before}\n--- стало\n${after}`)
const u3 = ups(['-Restore', '-GameDir', UGAME])
expect('откат: контроль — без журнала отказ с кодом 1', u3.code === 1 && /no install journal/.test(u3.out), u3.out)
ups(['-Deploy', '-WithEngineIni', '-NoVerify'])
const u4 = ups(['-Remove'])
expect('откат: -Remove при журнале = тот же откат, папка как до установки, деинсталлятор убран',
  u4.code === 0 && snap(UGAME) === before, `${u4.out}\n${snap(UGAME)}`)

// ---- кусок Engine.ini, который несёт сам мод (поле engineIni мода; KrinikConanEngineTweaks, 2026-11-10): раскатка вливает его в Engine.ini
// сборки ПО СЕКЦИЯМ — ключ той же секции заменяется (с предупреждением), новые строки встают в конец секции, новая секция — в конец файла;
// -Verify видит каждую строку куска; -EngineIniOut пишет тот же текст в файл; выключенный мод свой кусок не вливает.
const IDIR = path.join(DIR, 'inipack'), IGAME = path.join(IDIR, 'game'), IINI = path.join(IGAME, 'Game', 'Config', 'Engine.ini')
put(path.join(IGAME, 'FixtureGame.exe'), '')
put(path.join(IDIR, 'gfx', 'Engine.ini'), '[Core.System]\r\nPaths=../x\r\n\r\n[SystemSettings]\r\n; наш комментарий\r\nr.Pack=1\r\nr.Keep=5\r\n\r\n[Tail]\r\nT=1\r\n')
put(path.join(IDIR, 'tweaks', 'Engine.tweaks.ini'), '[SystemSettings]\r\nr.Tweak=1\r\nr.Pack=2\r\n\r\n[/Script/Nav.Recast]\r\nbAsync=True\r\n')
// Plain — обычный мод рядом: при выключенном Tweaks раскатке есть что ставить (иначе «No mods selected», контроль ниже)
put(path.join(IDIR, 'plain', 'p.txt'), 'plain')
const IMODS = [{ name: 'Tweaks', kind: 'config', version: '1', source: { folder: 'tweaks' }, engineIni: 'Engine.tweaks.ini' },
  { name: 'Plain', kind: 'files', version: '1', source: { folder: 'plain' }, install: [{ from: 'p.txt', to: 'Game/p.txt' }], verify: ['Game/p.txt'] }]
const writeIni = mods => writeFileSync(path.join(IDIR, 'modpack.json'), JSON.stringify({
  packName: 'KUMM fixture ini pack', builtFor: 'fixture', nexusGame: 'fixturegame', gameExe: 'FixtureGame.exe', library: 'mods',
  engineIni: { file: 'gfx/Engine.ini', target: 'Game/Config/Engine.ini', section: '[SystemSettings]' }, mods }, null, 2))
writeIni(IMODS)
mkdirSync(path.join(IDIR, 'mods'), { recursive: true })
writeFileSync(path.join(IDIR, 'targets.json'), JSON.stringify({ targets: [{ name: 'fixture', path: IGAME }] }, null, 2))
const ips = args => {
  try { return { code: 0, out: execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', DEPLOY, '-PackDir', IDIR, ...args], { encoding: 'utf8' }) } }
  catch (e) { return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` } }
}
const WANT = '[Core.System]\r\nPaths=../x\r\n\r\n[SystemSettings]\r\n; наш комментарий\r\nr.Pack=2\r\nr.Keep=5\r\n; ===== Tweaks (tweaks/Engine.tweaks.ini, merged by KUMM) =====\r\nr.Tweak=1\r\n\r\n' +
  '[Tail]\r\nT=1\r\n\r\n; ===== Tweaks (tweaks/Engine.tweaks.ini, merged by KUMM) =====\r\n[/Script/Nav.Recast]\r\nbAsync=True\r\n'
const i1 = ips(['-Deploy', '-WithEngineIni', '-NoVerify'])
const got = existsSync(IINI) ? readFileSync(IINI, 'utf8') : '(нет файла)'
expect('кусок ini: слит по секциям — ключ заменён, новая строка в конце секции, новая секция в конце, комментарии сборки целы',
  i1.code === 0 && got === WANT, `${i1.out}\n--- ждали\n${WANT}\n--- вышло\n${got}`)
expect('кусок ini: раскатка говорит, что кусок перебил ключ сборки', /\[warn\]\s+Engine\.ini: Tweaks .* sets r\.Pack=2 over the pack's r\.Pack=1/.test(i1.out), i1.out)
expect('кусок ini: мод без файлов — [ok] про Engine.ini, не «0 files»', /\[ok\]\s+Tweaks 1\s+\(its part goes into Engine\.ini/.test(i1.out) && !/Tweaks 1\s+\(0 files/.test(i1.out), i1.out)
const iv = ips(['-Verify'])
expect('кусок ini: -Verify — строки куска на месте, «nothing to verify» нет', iv.code === 0 && /\[ok\]\s+fixture: Engine\.ini part of Tweaks in place/.test(iv.out) && !/Tweaks: nothing to verify/.test(iv.out), iv.out)
writeFileSync(IINI, got.replace('r.Tweak=1\r\n', ''))
const iv2 = ips(['-Verify'])
expect('кусок ini: игра потеряла строку куска — -Verify [FAIL] и код 1', iv2.code === 1 && /\[FAIL\]\s+fixture: Engine\.ini part of Tweaks: missing or different \[systemsettings\] r\.tweak=1 \(game: none\)/.test(iv2.out), iv2.out)
const IOUT = path.join(IDIR, 'merged.ini')
const io = ips(['-EngineIniOut', IOUT])
expect('кусок ini: -EngineIniOut пишет тот же текст, что раскатка', io.code === 0 && existsSync(IOUT) && readFileSync(IOUT, 'utf8') === WANT, `${io.out}\n${existsSync(IOUT) ? readFileSync(IOUT, 'utf8') : '(нет файла)'}`)
// Игра переписала файл: пробелы вокруг «=» пропали, комментариев нет — проверка по секции и ключу остаётся зелёной (судья 2026-11-10)
writeFileSync(IINI, WANT.replace(/^;.*\r\n/gm, '').replace('r.Tweak=1', 'r.Tweak = 1'))
const iv3 = ips(['-Verify'])
expect('кусок ini: игра переписала файл без комментариев и с пробелами у «=» — -Verify всё равно зелёный', iv3.code === 0 && /Engine\.ini part of Tweaks in place/.test(iv3.out), iv3.out)
// База с повтором секции: ключ куска заменяется в каждой копии (игра берёт последнее значение); кусок без секции — отказ, не тихая потеря
const GFX = path.join(IDIR, 'gfx', 'Engine.ini'), GFX0 = readFileSync(GFX, 'utf8')
writeFileSync(GFX, '[SystemSettings]\r\nr.Pack=1\r\n\r\n[Tail]\r\nT=1\r\n\r\n[SystemSettings]\r\nr.Pack=3\r\n')
const id = ips(['-EngineIniOut', IOUT])
const dup = existsSync(IOUT) ? readFileSync(IOUT, 'utf8') : ''
expect('кусок ini: секция дважды в базе — ключ заменён в обеих копиях, новая строка в последней',
  id.code === 0 && (dup.match(/r\.Pack=2/g) || []).length === 2 && !/r\.Pack=[13]/.test(dup) &&
  dup.indexOf('r.Tweak=1') > dup.lastIndexOf('[SystemSettings]') && dup.indexOf('r.Tweak=1') < dup.indexOf('[/Script/Nav.Recast]'), `${id.out}\n${dup}`)
writeFileSync(GFX, GFX0)
const TW = path.join(IDIR, 'tweaks', 'Engine.tweaks.ini'), TW0 = readFileSync(TW, 'utf8')
writeFileSync(TW, '; no section\r\nr.Lost=1\r\n')
const ih = ips(['-EngineIniOut', IOUT])
expect('кусок ini: кусок без секции — отказ с кодом 1 и причиной', ih.code === 1 && /has key lines before its first \[section\]/.test(ih.out), ih.out)
writeFileSync(TW, 'r.Pre=7\r\n[SystemSettings]\r\nr.Tweak=1\r\n')
const ip = ips(['-EngineIniOut', IOUT])
expect('кусок ini: ключ до первой секции (игра его не читает) — отказ, а не перенос в секцию', ip.code === 1 && /before its first \[section\]/.test(ip.out), ip.out)
writeFileSync(TW, TW0)
// Ключ с несколькими значениями в базе (Paths= в [Core.System] Конана — 90 строк): кусок не схлопывает их в одно, а отказывает (судья, третий круг)
writeFileSync(TW, '[Core.System]\r\nPaths=../d\r\n')
writeFileSync(GFX, '[Core.System]\r\nPaths=../a\r\nPaths=../b\r\n\r\n[SystemSettings]\r\nr.Pack=1\r\n')
const im = ips(['-EngineIniOut', IOUT])
expect('кусок ini: ключ с несколькими значениями в базе — отказ, а не схлопывание', im.code === 1 && /a key with 2 values in \[Core\.System\]/.test(im.out), im.out)
// -Verify с таким сломанным куском — [FAIL] и код 1, проверка доходит до конца (не падает)
const ivb = ips(['-Verify'])
expect('кусок ini: сломанный кусок под -Verify — [FAIL] с причиной, проверка дошла до конца', ivb.code === 1 && /\[FAIL\]\s+fixture: Engine\.ini parts: .*multi-value key/.test(ivb.out) && /Summary/.test(ivb.out), ivb.out)
writeFileSync(GFX, GFX0)
writeFileSync(TW, TW0)
// Пак «база с Nexus + добавка» (engineIni.base/appendFile, как у Palworld): кусок мода влить некуда — раскатка отказывает, а не теряет его молча
const BASEZ = path.join(IDIR, 'mods', 'BaseIni 1 1 2026-09-01T10-00Z abcdefghi.zip'), BASESRC = path.join(IDIR, 'basesrc', 'Engine.ini')
put(BASESRC, '[SystemSettings]\r\nr.Base=1\r\n')
execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -LiteralPath ${q(BASESRC)} -DestinationPath ${q(BASEZ)}`])
put(path.join(IDIR, 'append.ini'), 'r.Append=1\r\n')
const mpb = JSON.parse(readFileSync(path.join(IDIR, 'modpack.json'), 'utf8'))
writeFileSync(path.join(IDIR, 'modpack.json'), JSON.stringify({ ...mpb, engineIni: { base: 'BaseIni*.zip', baseEntry: 'Engine.ini', appendFile: 'append.ini', target: 'Game/Config/Engine.ini' } }, null, 2))
const iba = ips(['-Deploy', '-WithEngineIni', '-NoVerify'])
expect('кусок ini: пак «база + добавка» — отказ «needs the pack\'s engineIni.file», кусок не теряется молча', /needs the pack's engineIni\.file/.test(iba.out) && !/wrote .*Engine\.ini \(read-only/.test(iba.out), iba.out)
writeIni([{ ...IMODS[0], enabled: false }, IMODS[1]])
const i3 = ips(['-Deploy', '-WithEngineIni', '-NoVerify'])
expect('кусок ini: контроль — мод выключен, Engine.ini = файл сборки байт в байт', i3.code === 0 && readFileSync(IINI, 'utf8') === readFileSync(path.join(IDIR, 'gfx', 'Engine.ini'), 'utf8'), `${i3.out}\n${readFileSync(IINI, 'utf8')}`)
const i4 = ips(['-Deploy', '-Only', 'Tweaks', '-WithEngineIni', '-NoVerify'])
expect('кусок ini: выключенный мод, названный в -Only, — предупреждение «part is NOT merged»', /\[warn\]\s+Tweaks 1\s+\(disabled in the manifest - its Engine\.ini part is NOT merged\)/.test(i4.out), i4.out)
const ir = ips(['-Remove', '-Only', 'Tweaks', '-IncludeDisabled'])
expect('кусок ini: -Remove мода с куском — предупреждение, как убрать кусок', /\[warn\]\s+Tweaks: its Engine\.ini part stays/.test(ir.out), ir.out)

// ---- ярлык на рабочем столе (manifest.shortcut; слово владельца 2026-11-01 11:11 «сборка на рабочем столе создает ярлык Krinik Conan»): install.ps1
// из -Export создаёт его после удачной раскатки — на программу сборки, со значком сборки; деинсталлятор игрока его убирает. Путь игрока: выгрузка →
// install.ps1 → uninstall .cmd. Имя уникальное: ярлык стенда живёт секунды на НАСТОЯЩЕМ рабочем столе и не путается с ярлыками владельца.
// Контроль «без shortcut — без ярлыка и без ошибки» — прогоны выше: их деинсталлятор шёл с пустым {SHORTCUT}.
// Своя чистая папка игры: в «ванили» выше лежит пак игрока вне modlist, и -Verify установки законно даёт код 1 — ярлык тогда не создаётся.
const SC = `KUMM fixture ${Date.now()}`
const SGAME = path.join(UDIR, 'game_clean'), SUN = path.join(SGAME, 'Uninstall.cmd')
put(path.join(SGAME, 'FixtureGame.exe'), '')
const sBefore = snap(SGAME)
put(path.join(UDIR, 'Launcher.exe'), 'stub')
put(path.join(UDIR, 'build.ico'), 'ico')
const mp3 = JSON.parse(readFileSync(path.join(UDIR, 'modpack.json'), 'utf8'))
Object.assign(mp3, { shortcut: { name: SC, target: 'Launcher.exe', icon: 'build.ico' }, extras: ['Launcher.exe', 'build.ico'] })
writeFileSync(path.join(UDIR, 'modpack.json'), JSON.stringify(mp3, null, 2))
const UEXP = path.join(DIR, 'undo-export')
const ue = ups(['-Export', UEXP])
const posh = cmd => execFileSync('powershell', ['-NoProfile', '-Command', cmd], { encoding: 'utf8' }).trim()
const LNK = path.join(posh("[Environment]::GetFolderPath('Desktop')"), `${SC}.lnk`)
let inst
try { inst = { code: 0, out: execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(UEXP, 'install.ps1'), '-GameDir', SGAME], { encoding: 'utf8' }) } }
catch (e) { inst = { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` } }
const lnkInfo = existsSync(LNK) ? posh(`$s = (New-Object -ComObject WScript.Shell).CreateShortcut(${q(LNK)}); $s.TargetPath + '|' + $s.IconLocation`) : '(нет ярлыка)'
expect('ярлык: установка из выгрузки создала ярлык на рабочем столе — на программу сборки, со значком сборки',
  ue.code === 0 && inst.code === 0 && lnkInfo.toLowerCase() === `${path.join(UEXP, 'Launcher.exe')}|${path.join(UEXP, 'build.ico')},0`.toLowerCase(),
  `${ue.out}\n${inst.out}\n${lnkInfo}`)
expect('ярлык: в деинсталляторе подставлено имя ярлыка', existsSync(SUN) && readFileSync(SUN, 'utf8').includes(`'${SC}.lnk'`), existsSync(SUN) ? readFileSync(SUN, 'utf8') : '(нет файла)')
let un2 = ''
try { un2 = execFileSync('cmd', ['/c', SUN], { input: '\r\n\r\n', encoding: 'utf8' }) } catch (e) { un2 = `${e.stdout ?? ''}${e.stderr ?? ''} code ${e.status}` }
expect('ярлык: деинсталлятор игрока убрал ярлык, папка игры как до установки', !existsSync(LNK) && snap(SGAME) === sBefore, `${un2}\n${snap(SGAME)}`)
if (existsSync(LNK)) unlinkSync(LNK)   // стенд не оставляет владельцу свой ярлык ни при каком исходе

console.log(bad ? `\nСТЕНД: ${bad} провал(ов)` : '\nстенд: все проверки прошли')
process.exit(bad ? 1 : 0)
