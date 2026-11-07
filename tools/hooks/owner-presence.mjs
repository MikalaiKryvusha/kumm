#!/usr/bin/env node
// owner-presence.mjs — хук Claude Code (PreToolUse на Bash и PowerShell): работает ли человек за компьютером прямо сейчас.
//
// Слово владельца 2026-11-07 12:36–12:37 (дословно в HOUSE_RULES правило 30): «тебе бы было полезно видеть, что кто-то что-то с физической клавы
// набирает - это я - когда это происходит - лучше тебе тесты не запускать» · «а когда с клавы никто не набирает - значит нет пользователя за ПК, можно тестить
// смело» · «разработай себе тулз, который даёт тебе понимание, работает юзер с компом, или комп свободен» · «пусть он в фоне, когда ты работаешь над KUMM,
// сообщает тебе такие сведения». Повод: проверка рамки лута 12:33 вывела игру вперёд, пока он набирал, — его ввод сорвал прицел.
//
// Что делает:
//  1. Команда настоящего ввода или вывода игры вперёд (mouse-seq, hover-watch, launch-fg, loot-aim, loot-take-clip, hub_run, esc-when-idle) при
//     человеке за клавиатурой (простой < MIN_IDLE_S) — ОТКЛОНЕНА (код 2, причина модели). Свободен — пропущена.
//  2. Любая другая команда — не чаще раза в NOTE_EVERY_MS в контекст агента уходит строка «компьютер: СВОБОДЕН/ЗАНЯТ, простой N с» (additionalContext).
// Простой меряет D:/work/ai_sandbox/_tools/owner-idle.ps1 (GetLastInputInfo). Собственная ошибка хука → код 0 (fail-open: сломанный страж не запирает работу).
// [TESTED: 2026-11-07 · см. отчёт testcases/reports/2026-11-07_owner-presence-hook.md]
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const MIN_IDLE_S = 10
const NOTE_EVERY_MS = 5 * 60 * 1000
const PROBE = 'D:/work/ai_sandbox/_tools/owner-idle.ps1'
// a RUN of the tool (its script file), not its name in text; git commands that only mention the files (add / commit / diff …) are not runs — the first version
// refused `git add _config/mouse-seq.ps1` + a commit message naming it (2026-11-07 12:3x, a false hit)
// + input.ps1 and m6-air-shot.sh (2026-11-07 19:3x: input.ps1 sent a real Space while the owner typed — it was missing here and had no guard of its own)
const REAL_INPUT = /(mouse-seq|hover-watch|launch-fg|esc-when-idle|input|game-front)\.ps1|(loot-aim|loot-take-clip|hub_run|m6-air-shot)\.sh/i
const ONLY_GIT = /^\s*(cd\s+\S+\s*&&\s*)?git\s/i
const STAMP = join(process.env.CLAUDE_PROJECT_DIR || '.', 'tools', 'hooks', '.owner-presence-note.stamp')

function idle() {
  const r = spawnSync('powershell', ['-NoProfile', '-File', PROBE, '-MinIdle', String(MIN_IDLE_S)], { encoding: 'utf8', timeout: 8000, windowsHide: true })
  return { busy: r.status === 5, line: (r.stdout || '').trim() }
}

try {
  const ev = JSON.parse(readFileSync(0, 'utf8'))
  const cmd = String(ev?.tool_input?.command ?? '')
  if (REAL_INPUT.test(cmd) && !ONLY_GIT.test(cmd) && !/\bgit\s+(add|commit|diff|log|show)\b/i.test(cmd)) {
    const s = idle()
    if (s.busy) {
      process.stderr.write(`owner-presence: за компьютером человек (${s.line}) — команда с настоящим вводом / игрой впереди отклонена ` +
        `(HOUSE_RULES правило 30). Делай работу без ввода и повтори, когда owner-idle.ps1 скажет FREE.\n`)
      process.exit(2)
    }
    process.exit(0)
  }
  const last = existsSync(STAMP) ? Number(readFileSync(STAMP, 'utf8')) || 0 : 0
  if (Date.now() - last >= NOTE_EVERY_MS) {
    writeFileSync(STAMP, String(Date.now()))
    const s = idle()
    const word = s.busy ? 'ЗАНЯТ — владелец за клавиатурой, тесты с вводом и игрой впереди не запускать' : 'СВОБОДЕН — можно тестировать смело'
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: `owner-presence · компьютер ${word} (${s.line})` } }))
  }
  process.exit(0)
} catch {
  process.exit(0)
}
