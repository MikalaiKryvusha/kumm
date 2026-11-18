#!/usr/bin/env node
// text-fact-parity — the fact check of a rewrite by whole sentences and blocks (HOUSE_RULES 35.6.3, the owner 2026-11-18 15:04–15:05).
// The rewrite may change every word; the FACTS of the old text must survive. The tool extracts fact tokens from the old and the new text —
// numbers with their unit, versions, URLs, file paths, `code` spans, «quoted» names, Latin words (mod and product names), e-mail addresses —
// and lists every token the old text has more often than the new one. Each listed token is either restored or named in the report with a reason.
// HTML is read as text (tags and attributes dropped, href / src kept as tokens).
// Usage: node tools/text-fact-parity.mjs <old-file> <new-file> [--json]
//        node tools/text-fact-parity.mjs --git <repo> <old-rev> <new-rev|WORKTREE> <path> [--json]
// Exit: 0 — every fact token of the old text is in the new one · 1 — tokens are missing (listed) · 2 — wrong call or unreadable input.
// [NOT-TESTED]
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const args = process.argv.slice(2)
const json = args.includes('--json')
const pos = args.filter(a => a !== '--json')

function readInputs() {
  if (pos[0] === '--git') {
    const [, repo, oldRev, newRev, path] = pos
    if (!path) return null
    const show = rev => rev === 'WORKTREE' ? readFileSync(`${repo}/${path}`, 'utf8')
      : execFileSync('git', ['-C', repo, 'show', `${rev}:${path}`], { encoding: 'utf8', maxBuffer: 64 << 20 })
    return [show(oldRev), show(newRev), `${oldRev}:${path}`, `${newRev}:${path}`]
  }
  if (pos.length < 2) return null
  return [readFileSync(pos[0], 'utf8'), readFileSync(pos[1], 'utf8'), pos[0], pos[1]]
}

// HTML → text, keeping link targets as tokens.
function plain(text) {
  const links = [...text.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m => m[1])
  const body = text.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
  return body + '\n' + links.join('\n')
}

const PATTERNS = [
  ['url', /\bhttps?:\/\/[^\s)<>"»]+/g],
  ['email', /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g],
  ['code', /`[^`\n]+`/g],
  ['quoted', /«[^«»\n]{1,80}»/g],
  ['version', /\b\d+\.\d+(?:\.\d+)*\b/g],
  ['path', /(?:[A-Za-z]:)?(?:[\w.-]+[\\/])+[\w.-]+/g],
  ['number', /\b\d[\d  ]*(?:[.,]\d+)?\s?(?:%|ГБ|МБ|КБ|GB|MB|KB|мс|ms|с|мин|ч|px|K|к\/с|FPS|fps)?(?![\w.])/g],
  ['latin', /\b[A-Z][A-Za-z0-9]*(?:[ -][A-Z0-9][A-Za-z0-9]*)*\b/g],
]

function tokens(text) {
  const t = plain(text)
  const bag = new Map()
  for (const [kind, re] of PATTERNS) {
    for (const m of t.matchAll(re)) {
      const v = m[0].trim().replace(/[.,;:]+$/, '').replace(/\s+/g, ' ')
      if (!v || (kind === 'number' && v.length < 2 && !/\d/.test(v))) continue
      const key = `${kind}\t${v}`
      bag.set(key, (bag.get(key) || 0) + 1)
    }
  }
  return bag
}

const inputs = readInputs()
if (!inputs) {
  console.error('usage: node tools/text-fact-parity.mjs <old> <new> [--json] | --git <repo> <old-rev> <new-rev|WORKTREE> <path> [--json]')
  process.exit(2)
}
const [oldText, newText, oldName, newName] = inputs
const a = tokens(oldText), b = tokens(newText)
const missing = []
for (const [key, n] of a) {
  const m = b.get(key) || 0
  if (m < n) { const [kind, value] = key.split('\t'); missing.push({ kind, value, old: n, new: m }) }
}
missing.sort((x, y) => x.kind.localeCompare(y.kind) || x.value.localeCompare(y.value))
if (json) console.log(JSON.stringify({ old: oldName, new: newName, oldTokens: a.size, newTokens: b.size, missing }, null, 1))
else {
  console.log(`fact parity: ${oldName} → ${newName}: ${a.size} distinct fact tokens in the old text, ${missing.length} with fewer uses in the new one`)
  for (const x of missing) console.log(`  ${x.kind.padEnd(7)} ${x.value}  (old ${x.old}, new ${x.new})`)
}
process.exit(missing.length ? 1 : 0)
