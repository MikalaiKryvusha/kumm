// Applies reviewer fixes: node fix.mjs <fixes.json> — [[lang, index, old, new], ...]; refuses when the old value does not match.
import fs from 'node:fs'
const V = JSON.parse(fs.readFileSync('values.json', 'utf8'))
const F = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
for (const [lang, i, oldV, newV] of F) {
  if (V[lang].values[i] !== oldV) throw new Error(`${lang}[${i}] is "${V[lang].values[i]}", expected "${oldV}"`)
  V[lang].values[i] = newV
}
fs.writeFileSync('values.json', JSON.stringify(V, null, 1) + '\n')
console.log('applied', F.length)
