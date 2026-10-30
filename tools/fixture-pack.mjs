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
import { mkdirSync, writeFileSync, readFileSync, existsSync, unlinkSync } from 'node:fs'
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

console.log(bad ? `\nСТЕНД: ${bad} провал(ов)` : '\nстенд: все проверки прошли')
process.exit(bad ? 1 : 0)
