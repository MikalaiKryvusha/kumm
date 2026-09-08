#!/usr/bin/env node
/**
 * Регрессия разбора имени архива: parseArchive из kumm.mjs.
 *
 * ЗАЧЕМ. `libraryName()` ПИШЕТ имя, `parseArchive()` его ЧИТАЕТ — самая
 * нагруженная пара в кодовой базе (PROJECT_ARCHITECTURE_INTERNAL_MAP.md:
 * имя архива несёт личность мода и дату загрузки БЕЗ всякой базы данных).
 * Разошлись — и движок перестаёт видеть библиотеку, молча и без ошибки.
 *
 * ПОВОД. 08.09.2026 нашлось, что разбор требовал modId из РОВНО четырёх цифр.
 * Это работало для Palworld (id 2972..3762) и не находило НИЧЕГО у Conan Exiles
 * Enhanced, где id одно- и двузначные (1, 29, 41). Дефект «палворлдовской
 * формы» — ровно тот класс, который Phase 2 мастер-плана обязана выловить.
 *
 * ПОЧЕМУ ТАК СТРАННО УСТРОЕН. Импортировать kumm.mjs нельзя: он ЗАПУСКАЕТ CLI
 * при импорте (открытый пункт беклога — «запуск-гард»). Поэтому тест вырезает
 * исходный текст нужных функций из файла и исполняет ЕГО — то есть проверяет
 * настоящий код, а не его копию. Когда гард появится, заменить на import.
 *
 * Запуск:  node test-parse-archive.mjs      (код 0, если всё сошлось)
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const src = readFileSync(path.join(HERE, 'kumm.mjs'), 'utf8')

// вырезаем ровно те функции, что участвуют в разборе
const grab = (name) => {
  const start = src.indexOf(`function ${name}(`)
  if (start < 0) throw new Error(`не найдена функция ${name} в kumm.mjs`)
  let depth = 0, i = src.indexOf('{', start)
  const from = i
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}' && --depth === 0) break
  }
  return src.slice(start, i + 1)
}

const isVersionPart = s => /^[0-9]+$/.test(s) || /^v?[0-9]+(\.[0-9]+)*$/i.test(s)
const parseArchive = new Function('path', 'isVersionPart', `
  ${grab('parseNexusName')}
  ${grab('parseArchive')}
  return parseArchive
`)(path, isVersionPart)

// ---------------------------------------------------------------- случаи
const CASES = [
  // --- НАСТОЯЩИЕ имена из живой библиотеки Palworld (D:\Games\Palworld Mods\mods).
  //     Это защита от регрессии: пак владельца используется ежедневно.
  ['AutomaticallySkipModCaution 3595 5 2026-08-13T08-16Z ixXXgdEk6.zip', '3595', '5'],
  ['DeclutterHUD 3671 1.1.0 2026-07-21T23-07Z LaIGiH1K2.zip', '3671', '1.1.0'],
  ['PauseOnMenu 3751 1.0.0 2026-07-14T01-06Z 3axus49w0.zip', '3751', '1.0.0'],
  ['RarePalAppearanceLua 3613 1.0.1 2026-07-11T07-53Z Ab1rBHitO.rar', '3613', '1.0.1'],
  // имя мода САМО содержит версию — ловушка для наивного разбора
  ['Camera Control 1.0.4 3659 1.0.4 2026-07-16T17-00Z 17f5AjWvZ.zip', '3659', '1.0.4'],
  ['ProgressiveWorkSuitability 1.0.8 3725 8 2026-08-08T18-54Z o9mnFCNkg.zip', '3725', '8'],
  // имя со скобками, дефисами и точкой в середине
  ['Palworld - Ultimate Unreal Engine.ini (No VRR) 2972 13 2026-08-11T21-16Z rcpMZVWMx.zip', '2972', '13'],
  ['PALNo-IntroFix-v.0.3 3598 0.3 2026-07-29T15-39Z bszyYFtom.zip', '3598', '0.3'],
  ['Reveal Full Map (Steam) 3762 3 2026-08-05T21-21Z i1xzaS7dZ.zip', '3762', '3'],

  // --- Conan Exiles Enhanced: КОРОТКИЕ id. До правки не разбирался ни один.
  ['No-Intro-Splash 1 1.0 2026-09-08T00-00Z abcdefghi.zip', '1', '1.0'],
  ['Level and Attribute Overhaul 29 1.2 2026-09-08T00-00Z abcdefghi.zip', '29', '1.2'],
  ['More Katanas 41 1.0.1 2026-09-08T00-00Z abcdefghi.zip', '41', '1.0.1'],
  ['Corpse Stripper 14 2 2026-09-08T00-00Z abcdefghi.zip', '14', '2'],

  // --- вторая схема: имя как его отдаёт сам Nexus (EXP-0018)
  ['DeclutterHUD-3671-1-1-0-1753132020.zip', '3671', '1.1.0'],
]

let ok = 0
const bad = []
for (const [name, wantId, wantVer] of CASES) {
  const got = parseArchive(name)
  const good = got && got.modId === wantId && got.version === wantVer
  if (good) ok++
  else bad.push([name, wantId, wantVer, got])
  console.log(`  ${good ? 'OK  ' : 'МИМО'}  ${wantId.padStart(4)}  ${name}`)
  if (!good) console.log(`          дало ${JSON.stringify(got)}, ждали id=${wantId} ver=${wantVer}`)
}

// --- отрицательный контроль: мусор НЕ должен разбираться ---------------------
const JUNK = [
  'readme.txt',
  'Impostor.pak',
  'какой-то архив без чисел.zip',
]
for (const name of JUNK) {
  const got = parseArchive(name)
  const good = got === null
  if (good) ok++
  else bad.push([name, 'null', '-', got])
  console.log(`  ${good ? 'OK  ' : 'МИМО'}  мусор  ${name}${good ? '' : ` -> ${JSON.stringify(got)}`}`)
}

const total = CASES.length + JUNK.length
console.log(`\nпройдено ${ok} из ${total}`)
if (bad.length) console.log('\nРАЗБОР ИМЁН СЛОМАН — движок перестанет видеть библиотеку.')
process.exit(bad.length ? 1 : 0)
