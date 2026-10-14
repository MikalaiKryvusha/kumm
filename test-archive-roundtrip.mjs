#!/usr/bin/env node
/**
 * Круговой ход имени архива: libraryName() ПИШЕТ имя файла в библиотеке, parseArchive() его ЧИТАЕТ — kumm.mjs.
 *
 * ЗАЧЕМ. test-parse-archive.mjs проверяет только ЧТЕНИЕ готовых имён. Пара должна сходиться и в обратную сторону:
 * имя, записанное при скачивании, читается назад в тот же modId и ту же версию, а дата загрузки — в ту же минуту, что
 * у карточки Nexus (иначе `check` сочтёт свежий файл устаревшим и будет качать его снова). Вторая половина пункта
 * автономного беклога STATUS «Round-trip check for the archive naming scheme» (первая — 08.09.2026).
 *
 * КАК. Как test-parse-archive.mjs: libraryName и sameFile не экспортированы из kumm.mjs (импорт CLI уже не запускает —
 * гард IS_MAIN с 2026-10-14), поэтому исходный текст функций вырезается из файла и исполняется — проверяется настоящий код.
 *
 * Запуск:  node test-archive-roundtrip.mjs      (код 0, если всё сошлось)
 * [NOT-TESTED]
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const src = readFileSync(path.join(HERE, 'kumm.mjs'), 'utf8')

const grabFn = (name) => {
  const start = src.indexOf(`function ${name}(`)
  if (start < 0) throw new Error(`не найдена функция ${name} в kumm.mjs`)
  let depth = 0, i = src.indexOf('{', start)
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}' && --depth === 0) break
  }
  return src.slice(start, i + 1)
}
const grabConst = (name) => {
  const m = src.match(new RegExp(`^const ${name} =[^\\n]*(?:\\n(?!const |function |//|\\n)[^\\n]*)*`, 'm'))
  if (!m) throw new Error(`не найдено const ${name} в kumm.mjs`)
  return m[0]
}

const isVersionPart = s => /^[0-9]+$/.test(s) || /^v?[0-9]+(\.[0-9]+)*$/i.test(s)
const { libraryName, parseArchive, sameFile } = new Function('path', 'isVersionPart', `
  ${grabConst('token')}
  ${grabFn('libraryName')}
  ${grabFn('parseNexusName')}
  ${grabFn('parseArchive')}
  ${grabConst('stamp')}
  ${grabConst('sameFile')}
  return { libraryName, parseArchive, sameFile }
`)(path, isVersionPart)

// Карточки — как их читает listFiles с живой страницы Nexus (имя, версия, дата загрузки ISO); последнее — версия, какой её прочтут назад.
const CASES = [
  // настоящие имена библиотеки Palworld (test-parse-archive.mjs), записанные заново
  [{ name: 'AutomaticallySkipModCaution', version: '5', uploaded: '2026-08-13T08:16:42Z' }, '3595', '.zip', '5'],
  [{ name: 'Camera Control 1.0.4', version: '1.0.4', uploaded: '2026-07-16T17:00:05Z' }, '3659', '.zip', '1.0.4'],
  [{ name: 'Palworld - Ultimate Unreal Engine.ini (No VRR)', version: '13', uploaded: '2026-08-11T21:16:59Z' }, '2972', '.zip', '13'],
  [{ name: 'RarePalAppearanceLua', version: '1.0.1', uploaded: '2026-07-11T07:53:00.000Z' }, '3613', '.rar', '1.0.1'],
  // короткий id Конана, миллисекунды в дате, версии нет (пишется «0»)
  [{ name: 'More Katanas', version: '1.0.1', uploaded: '2026-09-08T00:00:31.250Z' }, '41', '.7z', '1.0.1'],
  [{ name: 'Corpse Stripper', uploaded: '2026-09-08T12:34:00Z' }, '14', '.zip', '0'],
  // версия файла с пробелом — Nexus их допускает («1.2 beta»): записанное имя не читалось назад ни одной половиной движка
  // (проба 2026-10-14) — пробелы версии пишутся «_»
  [{ name: 'Some Mod', version: '1.2 beta', uploaded: '2026-09-01T10:00:00Z' }, '777', '.zip', '1.2_beta'],
  [{ name: 'Some Mod (Steam)', version: '1.0 (Steam)', uploaded: '2026-09-01T10:00:00Z' }, '778', '.zip', '1.0_(Steam)'],
]

let ok = 0
const bad = []
for (const [card, modId, ext, wantVer] of CASES) {
  const file = libraryName(card, modId, ext)
  const got = parseArchive(file)
  const good = !!got && got.modId === modId && got.version === wantVer && sameFile(got, card)
  if (good) ok++
  else bad.push(file)
  console.log(`  ${good ? 'OK  ' : 'МИМО'}  ${file}`)
  if (!good) console.log(`          прочитано ${JSON.stringify(got)}, ждали id=${modId} ver=${wantVer} и ту же минуту, что ${card.uploaded}`)
}

console.log(`\nпройдено ${ok} из ${CASES.length}`)
if (bad.length) console.log('\nЗАПИСЬ И ЧТЕНИЕ ИМЕНИ РАЗОШЛИСЬ — check сочтёт скачанный файл чужим или устаревшим.')
process.exit(bad.length ? 1 : 0)
