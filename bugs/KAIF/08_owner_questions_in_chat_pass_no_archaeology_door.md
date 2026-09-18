# KAIF improvement request: the 2.7 archaeology door guards questions that enter through interviews/ — a question typed into a chat reply passes no door, and that is where an agent puts it

kaif-fp: canon `AGENT_GUIDE.md` → "The place of questions" · `/interview` step 3d · contour `review.mjs --check` :: owner-question-bypasses-door :: v2.7
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/82
**Autocapture:** KAIF 2.7 (updated 2.5 → 2.7, route `bootstrap`, 2026-09-18) · project KUMM · sphere `programming` ·
language `ru` (language pack) · tracking `origin` · agent system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `ls bugs/KAIF/` → #78's ticket (05) is about the field-report text, not the door;
`gh issue list --repo MikalaiKryvusha/KAIF --state all --search "question in chat archaeology"` and
`--search "chat reply question owner door"` → #50 (confusion is a research trigger — closed, a different step), #78,
field reports #76, #79. No match found. The class is #70's (13 questions an owner had already answered).

## Gap

2.7 made a question to the owner a checked claim: a live question of an interview opens only with the archaeology
attestation, and `--check` refuses it otherwise. The canon also says (AGENT_GUIDE → "The place of questions"): «this
rule gets broken even by agents that KNOW it — chat is cheaper in the moment». Both are true at once, and the second
defeats the first: the door stands on `interviews/`, the agent writes in the chat.

Field case, this project, 2026-09-18, right after the update the door arrived with: the closing reply listed three
items «Ждёт вашего слова» — install two guards against my own repeated errors; send the field report upstream; the
prayer cadence. No interview, no archaeology, links instead of the matter. The owner answered «Что тебе KAIF обо всём
этом говорит, к чему тебя обязывает?» — and the search, run afterwards, settled two of the three without him: the
canon's "two strikes → a mechanism" plus his own «кодом, проверками, хуками» (2026-09-12); origin #15 plus 18 field
reports already in this tracker. The third was a real per-project setting, and `review.mjs --queue --list` showed it
`НИ РАЗУ НЕ ПОКАЗАН` for 13 days.

## Proposal

The reply never lands on disk, so a repository tool cannot see it — but the harness can. The refresh-hooks module
already ships a `Stop` hook (`stop-status-guard.mjs`). A second Stop-time check could read the last assistant
message from the transcript the event names, find the owner-ask phrases of the project's language pack
(«ждёт вашего слова», «awaiting your word», «отправлять ли», «shall I»…), and when it finds them without an
`interviews/…` address beside them, block the stop once with the ready archaeology command — the same message the
`--check` door prints. Advisory form first (a warning injected into the next turn), a door only after the origin's
polygon shows the false-hit rate.

A cheaper half needs no hook: `/end-chat-soft`, `/end-chat-force` and `/pause` could list "questions to the owner in
this reply" as a checked line of the farewell, the way 2.7 made them ask for the standing falsehood by name.

## Field evidence

This project, 2026-09-18 — the owner's two messages quoted in the field report #79 (R6) and in ticket #78.
`EXPERIENCE.md` `EXP-0122`, class `question-already-answered` — the first slug of the 2.7 starter list.

## Local remediation

Recorded as a lesson with its trigger phrases (`EXP-0122`); no hook — this project already runs one agent-restricting
hook (`tools/hooks/no-backslash-heredoc.mjs`) and a second one of a different kind is the origin's call to design.
