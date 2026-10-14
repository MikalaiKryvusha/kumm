#!/usr/bin/env node
// fixture-pack.mjs — постоянный стенд для игровой половины движка: поддельный пак во временной папке ОС (манифест, библиотека
// с именами по схеме libraryName, папка «игры» с файлом-признаком) и прогон Deploy-ModPack.ps1 по нему — без сети, без игры,
// без пака владельца.
// Зачем: 08.09.2026 разовый стенд в скретчпаде за один заход нашёл ЧЕТЫРЕ дефекта переносимости (bugs/03_DONE, EXP-0043) и умер
// вместе с сессией (пункт беклога STATUS «A fixture pack»).
// Срез 2026-10-14: -ListMods (разбор манифеста, список модов) и -Deploy -DryRun (поиск архива по nexusId через зеркало разбора
// имени в PowerShell, пропуск выключенного). Дальше — -Verify и боевая раскатка в папку стенда.
// Запуск: node tools/fixture-pack.mjs      (код 0 — режимы прошли; папка стенда печатается и остаётся до перезагрузки — temp ОС)
//         KUMM_DEPLOY=<другой Deploy-ModPack.ps1> — прогнать стенд по копии скрипта.
// 2026-10-14 14:36: 10 проверок прошли; копия скрипта с дефектом бага 03 (id ровно из четырёх цифр) — красные ровно две названные
// заранее: «-DryRun: код 0» и «More Katanas (id 41) найден по nexusId». [NOT-TESTED]
import { mkdirSync, writeFileSync } from 'node:fs'
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
  mods: MODS.map(({ file, ...m }) => m),
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

console.log(bad ? `\nСТЕНД: ${bad} провал(ов)` : '\nстенд: все проверки прошли')
process.exit(bad ? 1 : 0)
