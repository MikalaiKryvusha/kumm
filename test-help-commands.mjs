#!/usr/bin/env node
/**
 * Список команд KUMM в трёх местах — один и тот же: шапка kumm.mjs (её печатает `help`), диспетчер (`case '…'` в
 * switch) и таблица «Команды» в README.md.
 *
 * ЗАЧЕМ. Три копии одного списка правились руками и могли разойтись (реестр пар «истина ↔ зеркало»,
 * PROJECT_STRUCTURE_EXTERNAL_MAP.md; пункт беклога STATUS «A real help command»). Истина — шапка: её показывает
 * `node kumm.mjs help`; switch и README сверяются с ней.
 *
 * Запуск:  node test-help-commands.mjs      (код 0, если три списка совпали)
 * [NOT-TESTED]
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const src = readFileSync(path.join(HERE, 'kumm.mjs'), 'utf8')
const readme = readFileSync(path.join(HERE, 'README.md'), 'utf8')

// шапка — то, что печатает help; команды — строки «//    <команда> …» между «Команды» и пустой строкой
const help = execFileSync(process.execPath, [path.join(HERE, 'kumm.mjs'), 'help'], { encoding: 'utf8' })
const block = help.split(/\r?\n/)
const from = block.findIndex(l => /^\/\/\s+Команды\s*$/.test(l))
const header = []
for (let i = from + 1; i < block.length && /^\/\/\s+\S/.test(block[i]); i++) header.push(block[i].replace(/^\/\/\s+/, '').split(/\s/)[0])
const sw = [...src.matchAll(/^\s*case '([a-z]+)':/gm)].map(m => m[1])
const table = readme.split(/\r?\n/)
const tFrom = table.findIndex(l => /^## Команды/.test(l))
const rd = []
for (let i = tFrom + 1; i < table.length && !/^## /.test(table[i]); i++) {
  const m = table[i].match(/^\| `([a-z]+)/)
  if (m) rd.push(m[1])
}

const norm = a => [...a].sort().join(' ')
let bad = 0
const say = (label, a) => {
  const good = norm(a) === norm(header) && a.length > 0
  if (!good) bad++
  console.log(`  ${good ? 'OK  ' : 'МИМО'}  ${label}: ${a.length} — ${norm(a)}`)
}
console.log(`  шапка (help): ${header.length} — ${norm(header)}`)
say('switch kumm.mjs', sw)
say('README «Команды»', rd)
const helpOnlyHeader = !/Диспетчер - только при запуске/.test(help) && help.split(/\r?\n/).length < 60
if (!helpOnlyHeader) bad++
console.log(`  ${helpOnlyHeader ? 'OK  ' : 'МИМО'}  help печатает только шапку: ${help.split(/\r?\n/).length} строк`)
if (bad) console.log('\nСПИСКИ КОМАНД РАЗОШЛИСЬ — справка, диспетчер и README говорят разное.')
process.exit(bad ? 1 : 0)
