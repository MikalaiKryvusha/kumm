// Generates Translations/<lang>/Text/Plugins/ConfigurationManager/ConfigurationManager.txt for 20 languages.
// Keys and their order come from the ru file (the maintainer-accepted reference), so every file has exactly its key set.
import fs from 'node:fs'
import path from 'node:path'

const REPO = process.argv[2]
const REL = 'Text/Plugins/ConfigurationManager/ConfigurationManager.txt'
const ru = fs.readFileSync(path.join(REPO, 'Translations/ru', REL), 'utf8').split(/\r?\n/)
const keys = ru.filter(l => l && !l.startsWith('//')).map(l => l.startsWith('r:"') ? l.slice(0, l.indexOf('"=') + 1) : l.slice(0, l.indexOf('=')))
if (keys.length !== 23) throw new Error('ru key count ' + keys.length)

// One row per language: name for the header, then 23 values in ru key order.
// The regex value (index 13) is written without quotes here; the generator adds them.
const T = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), 'values.json'), 'utf8'))

for (const [lang, row] of Object.entries(T)) {
  const vals = row.values
  if (vals.length !== keys.length) throw new Error(`${lang}: ${vals.length} values, expected ${keys.length}`)
  const lines = [
    `// ${row.name} translation of the Configuration Manager window for XUnity.AutoTranslator.`,
    '// Plugin-specific: applies only to text drawn by ConfigurationManager.dll, never to the game or other plugins.',
    '// Plugin names, setting names and descriptions come from the plugins and are not translated here.',
  ]
  keys.forEach((k, i) => {
    const v = vals[i]
    if (!v.trim() || v.includes('\n')) throw new Error(`${lang}: bad value for ${k}`)
    if (k.startsWith('r:')) {
      if (!v.includes('$1')) throw new Error(`${lang}: regex value lacks $1`)
      lines.push(`${k}="${v}"`)
    } else {
      if (v.includes('=')) throw new Error(`${lang}: '=' in value for ${k}`)
      lines.push(`${k}=${v}`)
    }
  })
  const out = path.join(REPO, 'Translations', lang, REL)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, lines.join('\n') + '\n', 'utf8')
  console.log(lang, lines.length - 3, 'lines')
}
