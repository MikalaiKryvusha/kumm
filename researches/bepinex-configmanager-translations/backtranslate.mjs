// Back-translates every value of every language file to English through the free Google endpoint XUnity itself uses
// (translate.googleapis.com, client=gtx). One request per language, sequential, 1.5 s apart. Writes JSON + markdown.
import fs from 'node:fs'
import path from 'node:path'

const [REPO, OUT] = process.argv.slice(2)
const REL = 'Text/Plugins/ConfigurationManager/ConfigurationManager.txt'
const parse = f => fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => l && !l.startsWith('//')).map(l => {
  const i = l.startsWith('r:"') ? l.indexOf('"=') + 1 : l.indexOf('=')
  return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, '')]
})
const sleep = ms => new Promise(r => setTimeout(r, ms))
const langs = fs.readdirSync(path.join(REPO, 'Translations')).filter(l => l !== 'ru')
const result = {}
for (const lang of langs) {
  const pairs = parse(path.join(REPO, 'Translations', lang, REL))
  const q = pairs.map(p => p[1]).join('\n')
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${lang}&tl=en&dt=t&q=${encodeURIComponent(q)}`
  const res = await fetch(url)
  if (!res.ok) { console.log(lang, 'HTTP', res.status); result[lang] = null; await sleep(3000); continue }
  const j = await res.json()
  const back = j[0].map(s => s[0]).join('').split('\n')
  result[lang] = pairs.map((p, i) => ({ key: p[0], value: p[1], back: (back[i] ?? '???').trim() }))
  console.log(lang, back.length === pairs.length ? 'ok' : `LINE MISMATCH ${back.length}/${pairs.length}`)
  await sleep(1500)
}
fs.writeFileSync(path.join(OUT, 'backtranslation.json'), JSON.stringify(result, null, 1))
let md = ''
for (const [lang, rows] of Object.entries(result)) {
  md += `\n### ${lang}\n\n| English key | Value | Back to English |\n|---|---|---|\n`
  for (const r of rows || []) md += `| ${r.key.replace(/\|/g, '\\|')} | ${r.value.replace(/\|/g, '\\|')} | ${r.back.replace(/\|/g, '\\|')} |\n`
}
fs.writeFileSync(path.join(OUT, 'backtranslation.md'), md)
