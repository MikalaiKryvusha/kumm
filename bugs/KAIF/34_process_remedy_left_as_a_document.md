# KAIF improvement request: a process remedy closes only as a gate, a hook or a script that refuses the old way — never as a document

kaif-fp: canon/AGENT_GUIDE "A batch of bugs from the owner is one process incident" :: remedy-as-document :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/201
**Autocapture:** filed by the agent under the standing order «every feedback signal to the KAIF origin goes out without asking» (KUMM `AGENT_GUIDE.md`, the owner's
word 2026-09-18); field project KUMM, plan 59 step 6, 2026-11-20.
**Dedup attestation:** searched `bugs/KAIF/` (`grep -rl -i -E "remedy|process plan|left as a document|process document|bug wave" bugs/KAIF/` → no hit).

## Gap

`AGENT_GUIDE.md` → «A batch of bugs from the owner is one process incident» orders a process document in `plans/` — verdict, diagnosis, remedies as process
changes, steps — and names a health metric (the next wave is smaller). It does not say WHAT a remedy must be to count as done. A weak session writes the remedy as a
paragraph («play the build before a release», «test by the player's path»), ticks the plan, and the next release walks the old way, because no step of the
release reads the paragraph.

## Field evidence

One field project (KUMM, a modded game build), three process documents for the same root «the check went from my edit, not from the player»:

1. Plan 32 (2026-10-18) after the owner's first wave (bugs 55–62 in five minutes of play): the root named; no step executed.
2. Plan 47 (2026-11-06): «a crash check is active gameplay, never fly-throughs» — a house rule; no play run ever walked it.
3. Release 0.9.1-RC1 (2026-11-20) shipped; the owner found 12 bugs in his first 30 minutes of play, among them blockers (a dead journey button, a dead map).
   Plan 59 traced the wave to the two earlier remedies that no release step read.

The cure in the field (2026-11-20, plan 59 steps 3–5): the remedy became code in the release path — `check_play_report.py` (no release without a filled play
report of an hour of play: every matrix row a status and an observation, the video, god mode off) called as step 0 of `make_release.sh`; proven red on the real
RC1 tree (no report → refused) and on seven mutants of a green fixture. A second remedy (cheats never stay in the owner's save) became a read in the world-entry
script that prints a warning when god mode is on — proven red and green in the owner's world.

## Proposal

1. In the process-incident rule, a remedy is DONE only as a gate, a hook or a script that refuses the old way, committed with the plan and proven red against
   the old way (the same «a guard that never went red proves nothing» of `BUG_FIXING_FRAMEWORK.md`, applied to process).
2. `/end-chat-soft` and `/end-chat-force` name an open process plan with an unticked remedy as debt in the farewell.
3. `/fable-judge` gains the hunt «a process remedy closed as prose».

## Local remediation

KUMM plan 59 remedy 5 and steps 3–5 (2026-11-20); lesson EXP-0582 (the class) in KUMM `EXPERIENCE.md`.
