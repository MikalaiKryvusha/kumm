#!/usr/bin/env node
// release-ritual-gate.mjs — PreToolUse (Bash | PowerShell): a `gh release create` of the Conan build waits until the release ritual has no TODO.
// The owner 2026-11-20 21:22: «У тебя должен быть хук-ритуал-тудулист ЧТО НУЖНО ОБНОВИТЬ И ГДЕ И ЧЕМ ПРИ ВЫПУСКЕ ОЧЕРЕДНОГО РЕЛИЗА» · 21:23 «ЭТО ЦЕЛЫЙ РИТУАЛ
// МНОГО ЧЕГО!!!». The ritual is ConanExiles/_config/release/release_checklist.py (stages A–D before publication; E after it with --published).
// Exit 2 with the ritual's lines = refused; 0 = not a build release command, or the ritual is clean.
// [NOT-TESTED]
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const CHECKLIST = 'D:/work/ai_sandbox/ConanExiles/_config/release/release_checklist.py'
const REPO = 'Kriniks_Conan_Exiles_Enhanced_ModPack'

let input = {}
try { input = JSON.parse(readFileSync(0, 'utf8') || '{}') } catch { process.exit(0) }
const cmd = String((input.tool_input || {}).command || '')
if (!/gh\s+release\s+create/.test(cmd) || !cmd.includes(REPO)) process.exit(0)
try {
  execFileSync('python', ['-I', '-X', 'utf8', CHECKLIST], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  process.exit(0)
} catch (e) {
  const out = String(e.stdout || '') + String(e.stderr || '')
  process.stderr.write('release-ritual-gate: the release ritual has TODO items — do them before `gh release create` (HOUSE_RULES 42):\n' + out)
  process.exit(2)
}
