# KAIF improvement request: capture the closing chat's farewell into a file by a Stop hook, and read it in `/resume` Step 0

kaif-fp: skills/resume + skills/end-chat-soft + skills/end-chat-force + hooks/ :: farewell-capture :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/181
**Autocapture:** KAIF 2.9 · project KUMM · sphere programming · language ru · tracking origin · agent system claude-code (Claude Opus 5.5, 1 M window) · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `grep -ril "farewell" bugs/KAIF/` → 08 only (a line about the closing ritual's checked lines, not about carrying the
farewell); `gh issue list -R MikalaiKryvusha/KAIF --state all --search "farewell"`, `--search "closing message"`, `--search "handover file resume"` → empty.

## Gap

The closing rituals (`/end-chat-soft`, `/end-chat-force`) end with a farewell message — the outcome-first summary of the whole chat: what was
done, what waits for the owner's eye, the standing falsehoods corrected, the next steps. It is the densest handover the framework produces,
and it lives only in the chat. `STATUS.md` carries a handover too, but written BEFORE the closing commit, while the farewell is written after
it and is shorter and fresher. Nothing carries the farewell into the next session: the owner copies it by hand and pastes it under `resume`.

## Field evidence

KUMM, every chat since at least 2026-10-17: the owner opens a new chat with «resume твои слова из прошлого чата» + the pasted farewell
(transcripts 00d3c311, b6fd4b85, fab940bf, 05ca5e3e, 1b272a24; the same in the owner's Unliminium project — 68d0f491, 27c058d8). On
2026-10-30 the owner ordered it automated, verbatim: «вводим новый хук … это нужно чтобы по хуку ты записывал в
FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md, полностью стирая то, что там была, и оставляя только твоё прощальное сообщение» · «Я все равно
каждый раз это руками копирую и вставляю в новый чат, а так оно будет автоматически в файл собираться» · «И в скил RESUME добавляем - когда
это первый RESUME в чате (не часовое перечитывание контекста), то нужно прочесть FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md».

## Proposal

1. **A shipped Stop hook in the refresh-hooks module** (`.kaif/hooks/stop-farewell-capture.mjs`): in a turn that invoked `/end-chat-soft` or
   `/end-chat-force` (Skill tool_use or the owner's slash command since the last real prompt), take the turn's last message
   (`last_assistant_message`, else the transcript text after the last tool call) and REPLACE `FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md` at
   the project root with it whole (temp file + rename). A turn without closure leaves the file alone, so a "thanks" after the farewell does
   not overwrite it. **A second stop of the same turn (`stop_hook_active`) leaves it alone too** — other Stop hooks (a knowledge prompt, a
   STATUS guard) block the first stop and the agent's one-line answer to them would replace the farewell (correction of the same morning,
   posted as a comment on #181). The file is session state → its `.gitignore` line ships in the ignore-first set (the hook writes after the closing
   commit, a tracked file would stay dirty forever).
2. **`/resume` Step 0:** on the chat's FIRST `/resume` (not an hourly refresh, not a second `/resume`), read the file before the canon; check
   its mtime against the newest commit (older → the hook missed the last closure: say so, trust `STATUS.md`); carry its "show first / do
   first" items into Step 2.
3. Optional: the closing skills name the hook in their last step, so the farewell is written to stand alone (no "see above").

## Local remediation

KUMM commit `76a02f9` (2026-10-30): `tools/hooks/farewell-capture.mjs` wired locally in `.claude/settings.local.json` → `hooks.Stop`; Step 0
added to the deployed `/resume` in all five agent systems (`.claude`, `.agents`, `.grok`, `.cline` skills, `.roo/commands`); self-test
`tools/test-guards.mjs` part J (9 cases; a mutant without the closure check reddens 3); functional run on the real transcript of the
previous chat — the captured text is exactly the farewell the owner pasted (`testcases/reports/2026-10-30_farewell-capture-hook.md`). Reconcile
at the next `/kaif-update`: the deployed `/resume` diverges from origin by Step 0.
