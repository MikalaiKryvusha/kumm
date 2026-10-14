#!/usr/bin/env node
/**
 * Регрессия выбора файла и сравнения дат: pickCard, sameFile, stamp из kumm.mjs.
 *
 * ЗАЧЕМ. `pickCard` решает, КАКОЙ из главных файлов мода сверять с библиотекой
 * (Steam/Gamepass, Capped/обычный, пресеты), а `sameFile` — устарел ли он: по
 * ДАТЕ загрузки до минуты, не по версии (авторы перезаливают, не трогая номер —
 * WorldSettingsUnlocker; у файла и у мода версии разные — PauseOnMenu 1.0 против
 * 1.0.0). Ошибка здесь молча качает не тот вариант или не видит обновление.
 * Пункт автономного беклога STATUS «Cases for sameFile/stamp and pickCard».
 *
 * КАК. Импортировать kumm.mjs нельзя — он запускает CLI при импорте (пункт
 * беклога «запуск-гард»); как и test-parse-archive.mjs, тест вырезает исходный
 * текст функций из файла и исполняет ЕГО — проверяется настоящий код.
 *
 * Запуск:  node test-pick-card.mjs      (код 0, если всё сошлось)
 * Доказательство мутациями 2026-10-14 (копия kumm.mjs в скретчпаде, адресаты названы до прогона): M1 — дата до часа, а не до
 * минуты → красный только «перезалит через минуту»; M2 — без выбора по длине имени → только «старая версия → не Capped»; M3 — без
 * отсева архивных файлов → только «архивные не выбираются»; целый код — 17 из 17. Это гигиена (проверка чистых функций), не прогон
 * движка по пути владельца. [NOT-TESTED]
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
// однострочные (и двухстрочные) const-стрелки: от «const имя =» до пустой строки или следующего объявления
const grabConst = (name) => {
  const m = src.match(new RegExp(`^const ${name} =[^\\n]*(?:\\n(?!const |function |//|\\n)[^\\n]*)*`, 'm'))
  if (!m) throw new Error(`не найдено const ${name} в kumm.mjs`)
  return m[0]
}

const { pickCard, sameFile, stamp } = new Function('path', `
  ${grabConst('squash')}
  ${grabConst('stamp')}
  ${grabConst('sameFile')}
  ${grabFn('pickCard')}
  return { pickCard, sameFile, stamp }
`)(path)

let ok = 0
const bad = []
const check = (label, got, want) => {
  const good = got === want
  if (good) ok++
  else bad.push(label)
  console.log(`  ${good ? 'OK  ' : 'МИМО'}  ${label}${good ? '' : `  — дало ${JSON.stringify(got)}, ждали ${JSON.stringify(want)}`}`)
}

// ---------------------------------------------------------------- stamp / sameFile
// Дата архива — из имени по схеме движка («2026-08-13T08-16Z»), дата карточки — с Nexus (ISO с секундами).
console.log('sameFile / stamp:')
check('stamp: имя архива и ISO Nexus — одна минута', stamp('2026-08-13T08-16Z'), stamp('2026-08-13T08:16:42.000Z'))
check('тот же файл: минута совпала, секунды разные', sameFile({ uploaded: '2026-08-13T08-16Z' }, { uploaded: '2026-08-13T08:16:59Z' }), true)
check('перезалит через минуту — устарел', sameFile({ uploaded: '2026-08-13T08-16Z' }, { uploaded: '2026-08-13T08:17:00Z' }), false)
check('перезалит другим днём — устарел', sameFile({ uploaded: '2026-08-13T08-16Z' }, { uploaded: '2026-08-14T08:16:00Z' }), false)
check('архива нет — не тот же', sameFile(null, { uploaded: '2026-08-13T08:16:00Z' }), false)
check('карточки нет — не тот же', sameFile({ uploaded: '2026-08-13T08-16Z' }, null), false)

// ---------------------------------------------------------------- pickCard
const card = (name, uploaded, old = false) => ({ name, uploaded, old })
const arch = file => ({ file })
console.log('pickCard:')
const steamGp = [card('Reveal Full Map (Gamepass)', '2026-08-05T21:20:00Z'), card('Reveal Full Map (Steam)', '2026-08-05T21:21:00Z')]
check('Steam в библиотеке → Steam, не Gamepass',
  pickCard(steamGp, arch('Reveal Full Map (Steam) 3762 3 2026-08-05T21-21Z i1xzaS7dZ.zip'), '3762')?.name, 'Reveal Full Map (Steam)')
check('Gamepass в библиотеке → Gamepass',
  pickCard(steamGp, arch('Reveal Full Map (Gamepass) 3762 3 2026-08-05T21-20Z abcdefghi.zip'), '3762')?.name, 'Reveal Full Map (Gamepass)')
check('--variant побеждает библиотеку',
  pickCard(steamGp, arch('Reveal Full Map (Steam) 3762 3 2026-08-05T21-21Z i1xzaS7dZ.zip'), '3762', 'Gamepass')?.name, 'Reveal Full Map (Gamepass)')

const capped = [card('ProgressiveWorkSuitability 1.0.8 Capped', '2026-08-08T18:54:00Z'), card('ProgressiveWorkSuitability 1.0.8', '2026-08-08T18:50:00Z')]
check('обычный в библиотеке (имя с версией) → обычный, не Capped',
  pickCard(capped, arch('ProgressiveWorkSuitability 1.0.8 3725 8 2026-08-08T18-54Z o9mnFCNkg.zip'), '3725')?.name, 'ProgressiveWorkSuitability 1.0.8')
check('старая версия в библиотеке → ближайшее по длине имя, не Capped',
  pickCard(capped, arch('ProgressiveWorkSuitability 1.0.7 3725 7 2026-07-01T10-00Z abcdefghi.zip'), '3725')?.name, 'ProgressiveWorkSuitability 1.0.8')

const nexusScheme = [card('DeclutterHUD Lite', '2026-07-21T23:00:00Z'), card('DeclutterHUD', '2026-07-21T23:07:00Z')]
check('имя по схеме Nexus («-id-») → тот же файл',
  pickCard(nexusScheme, arch('DeclutterHUD-3671-1-1-0-1753132020.zip'), '3671')?.name, 'DeclutterHUD')

const three = [card('Alpha', '2026-07-01T00:00:00Z'), card('Beta', '2026-08-01T00:00:00Z'), card('Gamma', '2026-07-15T00:00:00Z')]
check('пустая библиотека → самый свежий', pickCard(three, null, '1')?.name, 'Beta')
check('общего начала имени нет → самый свежий', pickCard(three, arch('Zeta 1 1 2026-01-01T00-00Z abcdefghi.zip'), '1')?.name, 'Beta')

const withOld = [card('Mod v2', '2026-08-01T00:00:00Z'), card('Mod v3 beta', '2026-09-01T00:00:00Z', true)]
check('архивные (old) файлы не выбираются, пока есть главные', pickCard(withOld, null, '5')?.name, 'Mod v2')
check('все файлы архивные → самый свежий из них',
  pickCard([card('A', '2026-01-01T00:00:00Z', true), card('B', '2026-02-01T00:00:00Z', true)], null, '5')?.name, 'B')
check('карточек нет → null', pickCard([], null, '5'), null)

console.log(`\nпройдено ${ok} из ${ok + bad.length}`)
if (bad.length) console.log('\nВЫБОР ФАЙЛА ИЛИ СРАВНЕНИЕ ДАТ СЛОМАНЫ — движок качает не тот вариант или не видит обновление.')
process.exit(bad.length ? 1 : 0)
