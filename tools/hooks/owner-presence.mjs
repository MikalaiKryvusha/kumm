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
import { readFileSync, writeFileSync, existsSync, statSync, unlinkSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, resolve, sep } from 'node:path'
import { tmpdir } from 'node:os'

const MIN_IDLE_S = 10
const NOTE_EVERY_MS = 5 * 60 * 1000
const REAL_PROBE = 'D:/work/ai_sandbox/_tools/owner-idle.ps1'
// The stub probe of the self-test (test-guards part M) is honoured only when the project dir is a temp sandbox: an `env` line in the settings could
// otherwise swap the real probe for one that always says FREE (judge 2026-11-13, finding 9).
const inTmp = (p) => !!p && resolve(p).toLowerCase().startsWith(resolve(tmpdir()).toLowerCase() + sep)
const PROBE = process.env.OWNER_PRESENCE_PROBE && inTmp(process.env.CLAUDE_PROJECT_DIR) ? process.env.OWNER_PRESENCE_PROBE : REAL_PROBE
// a RUN of the tool (its script file), not its name in text; git commands that only mention the files (add / commit / diff …) are not runs — the first version
// refused `git add _config/mouse-seq.ps1` + a commit message naming it (2026-11-07 12:3x, a false hit)
// + input.ps1 and m6-air-shot.sh (2026-11-07 19:3x: input.ps1 sent a real Space while the owner typed — it was missing here and had no guard of its own)
// The distinctive names match without «.ps1» too (`& ./_config/launch-fg` runs the script), and `enter-world-focused.ps1` taps ALT and clicks with no guard of its own
// (judge round 2, 2026-11-13); `input` keeps its extension — the bare word is everywhere.
// + (judge 2026-11-13, finding 11) the extension-less `./_config/input`, `-EncodedCommand` (hides any call), and the input tools of the sibling projects a KUMM
// session runs: SvarogsDream / MedievalDynasty `keys.ps1`, `mouse.ps1`, `focus-game.ps1`, `route-restart-load.ps1`, `_tools/perf-harness/shot.ps1` (SetForegroundWindow).
const REAL_INPUT = /(mouse-seq|hover-watch|launch-fg|esc-when-idle|game-front|enter-world-focused)(\.ps1)?\b|\binput\.ps1|[\\/]input(\.ps1)?\b|(loot-aim|loot-take-clip|hub_run|m6-air-shot)\.sh|\b(keys|mouse|focus-game|route-restart-load)\.ps1\b|perf-harness[\\/]shot\.ps1|\s-(e|ec|enc|encodedcommand)\s/i
// A read-only command that only NAMES a tool is exempt ALONE: git, or one reader (cat, grep, rg, head, tail, ls, wc, sed -n). No chaining (`;`, `&`, `|`, a newline or a
// lone CR — PowerShell 5.1 runs both sides of a CR) and no command inside it (`$(…)`, backticks, `(…)`, `<(…)`) — `git log $(<mouse-seq>)` and `git -c alias.x="!…"`
// passed the earlier form (judge 2026-11-13, finding 2); `grep -n launch-fg STATUS.md` was refused while he typed (finding 8).
// Round 4 (judge D, A2): git only with a read / record subcommand right after `git` — no `-c` (aliases, core.pager), no `--exec` / `-x`, no `bisect run`,
// no `submodule foreach`; `rg` without `--pre`; `sed` dropped (its `e` command runs a shell).
// separators are a space or a tab only: `\s` also takes a CR, and «git status<CR><mouse-seq>» passed (PowerShell 5.1 runs both sides of a lone CR)
const ONLY_READ = /^[ \t]*(cd[ \t]+[^ \t\r\n]+[ \t]*&&[ \t]*)?(git[ \t]+(status|log|diff|show|add|commit|push|grep|ls-files|rev-parse|blame|check-ignore)\b|cat|grep|rg|head|tail|ls|wc)[ \t][^;&|\n\r`$()<]*$/i
const RUNS_INSIDE = /\s(-c|--config-env|--exec|-x|--pre)(\s|=)|\bbisect\s+run\b|\bsubmodule\s+foreach\b/i
const onlyRead = (cmd) => ONLY_READ.test(cmd) && !RUNS_INSIDE.test(cmd)
const STAMP = join(process.env.CLAUDE_PROJECT_DIR || '.', 'tools', 'hooks', '.owner-presence-note.stamp')

function idle() {
  const r = spawnSync('powershell', ['-NoProfile', '-File', PROBE, '-MinIdle', String(MIN_IDLE_S)], { encoding: 'utf8', timeout: 8000, windowsHide: true })
  return { busy: r.status === 5, line: (r.stdout || '').trim() }
}

// The owner's own order beats his presence (2026-11-13 16:05, [OWNER] «я тебя явно попросил запустить мне игру, а хук тупой не понимает этого!» · «он должен быть тебе
// помощником, а не препятствием»): bringing the GAME to the front passes while he types ONLY when all of this holds:
//  1. the command ONLY brings the game forward — with the launch-fg / game-front calls cut out nothing of REAL_INPUT is left — and carries the mark `-OwnerAsked`;
//  2. the main session runs it — a subagent (ev.agent_id) never borrows the owner's ask;
//  3. the agent wrote his words VERBATIM into OWNER_ASK (`tools/hooks/.owner-ask.txt`, ≥ ASK_MIN_CHARS letters), and they stand in his LAST human message: a typed
//     prompt (type user, origin human, not isMeta) or a message typed mid-turn (attachment queued_command, origin human); pasted blocks, IDE blocks and reminders cut
//     out first; the newest human message decides even when it has no text (an image) — then it refuses; an interrupt marker after it refuses;
//  4. that message is younger than ASK_TTL_MS and not from the future (> CLOCK_SLACK_MS).
// Why a quote and not a regex: judge rounds 1–2 (2026-11-13 16:2x–16:5x) — guessing «he asks for the game» from Russian text by patterns passed «почему ты сейчас
// запустил игру?», «я могу пока что запустить Конана», pasted agent text, loop wake-ups, and refused «перезапусти игру». The MODEL judges what he asked (it reads
// Russian); the CODE checks the judgment rests on his real, fresh, last words (PHILOSOPHY «code before cognition»).
// [NOT-TESTED] on the real path (an owner's live ask while he types). Hygiene only: tools/test-guards.mjs part M, 237 of 237 on 2026-11-13 20:0x (fixture
// transcripts of the real record shapes, the probe stubbed busy / free).
const GAME_FRONT = /(launch-fg|game-front)(\.ps1)?\b/i
const GAME_FRONT_ALL = /(launch-fg|game-front)(\.ps1)?\b/gi
const OWNER_ASK = join(process.env.CLAUDE_PROJECT_DIR || '.', 'tools', 'hooks', '.owner-ask.txt')
const ASK_MIN_CHARS = 8
const ASK_TTL_MS = 20 * 60 * 1000
const CLOCK_SLACK_MS = 60 * 1000
const SCAN_LINES = 3000
const CUT = /<(ide_selection|ide_opened_file|system-reminder)>[\s\S]*?<\/\1>|<pasted_content[^>]*>[\s\S]*?<\/pasted_content[^>]*>/g
// letters and digits only, one space between: «запусти, пожалуйста, игру» = «запусти пожалуйста игру», a dash or an apostrophe of another kind no longer refuses a
// real ask (judge 2026-11-13, finding 7); quote marks go too, so a negation is checked by the word before the quote (below)
const norm = (s) => ' ' + s.toLowerCase().replace(/ё/g, 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim() + ' '
const textOf = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.filter((b) => b?.type === 'text').map((b) => b.text).join('\n') : '')
// → { text } for a human message; { stop: true } for a turn the owner did NOT start (an interrupt marker, a loop wake-up, a task notification, a peer's message — a
// typed text record whose origin is not human); null for anything inside a turn (tool results, meta lines, mid-turn attachments not his). Until 2026-11-13 the
// non-human turn starts were skipped and the scan reached his older ask: an ask of 17:00 let the agent bring the game forward at 17:10 in a turn a background-task
// notification had started (judge 2026-11-13, finding 1 — the defect).
function humanRecord(rec) {
  if (rec?.type === 'attachment') {
    const a = rec.attachment
    return a?.type === 'queued_command' && a?.origin?.kind === 'human' ? { text: textOf(a.prompt) } : null
  }
  // a turn started by a peer or the system (a subagent hand-back, «Continue from where you left off», an idle notice) is a `user` record with isMeta AND a
  // non-human turnOrigin — it ends the search before the isMeta skip (judge D, A1: the earlier skip let his older ask through); Stop-hook feedback and skill
  // bodies carry no turnOrigin and stay skipped
  if (rec?.type === 'user' && rec.turnOrigin && rec.turnOrigin !== 'human') return { stop: true }
  if (rec?.type !== 'user' || rec.isMeta || rec.isCompactSummary) return null
  const content = rec?.message?.content
  if (Array.isArray(content) && content.some((b) => b?.type === 'tool_result')) return null   // a tool result — inside a turn
  const t = textOf(content).trim()
  if (t.startsWith('[Request interrupted')) return { stop: true }
  if (rec?.origin?.kind === 'human') return { text: t }   // his message, an image-only one too (then no quote is in it — refused)
  return t ? { stop: true } : null
}
export const onlyGameFront = (cmd) => GAME_FRONT.test(cmd) && /-OwnerAsked\b/i.test(cmd) && !REAL_INPUT.test(cmd.replace(GAME_FRONT_ALL, ''))
// → '' when his ask covers this command, otherwise the reason (said in the refusal — the agent knows what to fix instead of retrying blind; finding 10).
// The quote is ONE-SHOT: written by the agent after reading his message (its time ≥ the message's), deleted by the pass (finding 5: one quote unlocked every later
// launch for 20 min, and an old quote matched a later message that happened to contain it).
function askVerdict(transcript, now = Date.now()) {
  try {
    if (!existsSync(OWNER_ASK)) return 'нет файла цитаты tools/hooks/.owner-ask.txt'
    if (!transcript || !existsSync(transcript)) return 'нет журнала чата'
    const quote = norm(readFileSync(OWNER_ASK, 'utf8'))
    if (quote.replace(/[^\p{L}]/gu, '').length < ASK_MIN_CHARS) return `цитата короче ${ASK_MIN_CHARS} букв`
    const quoteAt = statSync(OWNER_ASK).mtimeMs
    const lines = readFileSync(transcript, 'utf8').split('\n').slice(-SCAN_LINES).reverse()
    for (const l of lines) {
      if (!l.trim()) continue
      let rec
      try { rec = JSON.parse(l) } catch { continue }   // a torn line is skipped, not the whole scan
      const h = humanRecord(rec)
      if (!h) continue
      if (h.stop) return 'последний ход начал не владелец (прерывание, пробуждение цикла, уведомление, сообщение соседа)'
      const at = Date.parse(rec.timestamp || rec?.attachment?.timestamp || '')
      if (!Number.isFinite(at) || now - at > ASK_TTL_MS || at - now > CLOCK_SLACK_MS) return 'его последнее сообщение старше 20 мин (или из будущего)'
      if (quoteAt + CLOCK_SLACK_MS < at) return 'цитата записана раньше его последнего сообщения — она от прошлой просьбы'
      const msg = norm(h.text.replace(CUT, ' '))
      if (!msg.includes(quote)) return 'цитаты нет в его последнем сообщении'
      if (msg.includes(' не' + quote)) return 'перед цитатой «не» — это не просьба'
      return ''
    }
    return 'в журнале нет его сообщения'
  } catch (e) { return 'ошибка проверки: ' + String(e && e.message).slice(0, 80) }   // fail closed: the strict rule stays
}

try {
  const ev = JSON.parse(readFileSync(0, 'utf8'))
  const cmd = String(ev?.tool_input?.command ?? '')
  if (REAL_INPUT.test(cmd) && !onlyRead(cmd)) {
    let why = ''
    if (!ev?.agent_id && onlyGameFront(cmd)) {
      why = askVerdict(ev?.transcript_path)
      if (!why) { try { unlinkSync(OWNER_ASK) } catch { /* already gone */ } process.exit(0) }
    }
    const s = idle()
    if (s.busy) {
      process.stderr.write(`owner-presence: за компьютером человек (${s.line}) — команда с настоящим вводом / игрой впереди отклонена ` +
        `(HOUSE_RULES правило 30).${why ? ' Просьба владельца не засчитана: ' + why + '.' : ''} Делай работу без ввода и повтори, когда owner-idle.ps1 скажет FREE.\n`)
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
