# Test run report — the farewell hook: an explicit farewell mark (bug 103)

**Created:** 2026-11-17 05:46 +03:00 · **Run by:** the agent · **Version/build:** KUMM working tree after `35d33ee` — `tools/hooks/farewell-capture.mjs` (+ the mark path),
`tools/test-guards.mjs` part J, `.claude/skills/end-chat-soft/SKILL.md` Step 5 and `end-chat-force/SKILL.md` Step 3 (the mark), new `tools/farewell-replay.mjs`

## 1. Work

Bug 103 (`bugs/103_farewell_capture_turn_split_by_notification_and_compaction.md`): the farewell file kept the waiting line of a closure («Жду итог судьи…»)
instead of the farewell that came after the judge. Two attempts this morning: (1) a new turn model (the turn starts only at the owner's prompt, a queued
attachment with origin human counted; the longest stop text of a closure wins) — REFUTED by an independent judge who replayed 78 real closure transcripts:
9 closures lost their farewell because the owner typed during the closure, 1 took a reply written after the farewell, an image-only owner message did not
count; the hook was put back to HEAD at 05:38. (2) The fix tested here: the closure skills end the farewell with the hidden line `<!-- farewell -->`, and the
hook writes the message that carries it whatever came before it in the turn; without the mark the committed logic runs unchanged.

## 2. Contour

The hook as a process fed with Stop events (`--out` into a temp file) — the same entry the live harness uses; real transcripts of this machine
(`F:/Claude/.claude/projects/d--work-ai-sandbox-KUMM/*.jsonl`) replayed stop by stop by `tools/farewell-replay.mjs` (cuts the transcript at every
`system:stop_hook_summary`, passes the last assistant text as `last_assistant_message`, as the live event does). REAL WORLD: accumulated — the owner's real
closing transcripts of 2026-10-30 … 2026-11-16; data and machine — this PC's transcripts; path — the Stop hook entry the harness calls. The mark path itself
has not yet met a live closure (no transcript carries the mark) — the first live proof is this chat's own closure.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-17 05:0x | `node tools/farewell-replay.mjs <b9342015…jsonl>` (and ea639d79, 2a24c0f4) on the committed hook | reproduced: the waiting line wins in all three |
| 2 | 2026-11-17 05:38 | `node tools/farewell-replay.mjs <1b272a24…jsonl> --hook .work/farewell/refuted-r1.mjs` vs the committed hook | the refuted turn model writes nothing, HEAD writes «Чат закрыт…» — the judge's main finding confirmed; the hook put back to HEAD |
| 3 | 2026-11-17 05:4x | `node tools/test-guards.mjs` | 301 of 301 |
| 4 | 2026-11-17 05:4x | the same with the committed hook copied over the new one (restored after) | 295 of 301 — the six new part-J cases red on HEAD |
| 5 | 2026-11-17 05:4x | for 15 transcripts (1b272a24, 31346b3e, 6461285c, 687d7b07, 7ff945d4, aabd6f1c, b6fd4b85, c5fe291c, cd0c9a3d, 63ad6b9e, 0da73ffb, 5db69748, b9342015, ea639d79, 2a24c0f4): `farewell-replay.mjs <t> --hook .work/farewell/head.mjs --quiet` vs `farewell-replay.mjs <t> --quiet` | 15 of 15 the same FINAL — no regression on unmarked closures |
| 6 | 2026-11-17 06:0x | judge round 1 on the mark (2 defects: the mark accepted on any line of any message; the «longer stop after the mark» case did not guard the state write) fixed: the mark only at the END of the message and only in a chat with an accepted closure (`closedEver`), the test from a fresh state, self-contained controls; autonomy-guard counts a marked farewell as the closure; `node tools/test-guards.mjs` | 308 of 308; with both HEAD hooks copied in (restored after): 298 of 308 — ten new cases red |
| 7 | 2026-11-17 06:0x | the mark injected into the real farewell of ea639d79 and b9342015 (`node .work/farewell/inject-mark.mjs <t> <copy> "<prefix>"`), then `farewell-replay.mjs <copy>` and `--hook .work/farewell/head.mjs` | new: the real farewell (ea639d79 — the 2821-char «BOUNDARY: …», the later reply after a notification does not overwrite it; b9342015 — «Всё отправлено, хвостов нет…»); HEAD: the waiting line |
| 8 | 2026-11-17 06:0x | the 15-transcript comparison of run 5 repeated on the final hook | 15 of 15 the same as HEAD |

## 4. Checks

Hygiene: `node --check` on the hook and the replay tool; test-guards 301/301; the six new cases proven red against the committed hook (`git show HEAD:tools/hooks/farewell-capture.mjs`).
Functional run: the hook process fed with Stop events cut from 15 real closing transcripts of this machine, stop by stop, the farewell file READ after every stop
(runs 1, 2, 5, 8); the mark path on two REAL transcripts with the mark injected into their real farewell (run 7) and by fixtures (part J, K) — a live marked closure: NOT yet.

| Case | Status | What was read |
|---|---|---|
| the marked farewell replaces the waiting line of the same closure | pass (red on HEAD) | the file holds «Прощание M1.» without the mark line |
| a later, longer unmarked stop of that closure keeps the marked farewell | pass (red on HEAD) | the file still «Прощание M1.» |
| the marked farewell after a «<task-notification>» user record (turn split) | pass (red on HEAD) | «Прощание M2.» |
| the marked farewell after the owner's words typed mid-closure (queued, origin human) | pass (red on HEAD) | «Прощание M3.» |
| the marked farewell after a hand-back (queued, origin peer) | pass (red on HEAD) | «Прощание M4.» |
| control: the mark quoted mid-line is not a mark | pass | the file unchanged |
| control: a message ending with the mark in a chat with no closure | pass | the file unchanged |
| the mark after the last words on the same line | pass | «Пока.» written, the mark stripped |
| a marked farewell as the first stop, then a hook answer (fresh state) | pass | «Прощание M0.» stays |
| autonomy-guard: a marked farewell after a notification split the turn | pass | the stop passes (the closure); without the mark — blocked «close softly» |
| two real transcripts with the mark injected | pass | the real farewell written; HEAD keeps the waiting line |
| 15 real unmarked closures: new = HEAD | pass | identical FINAL lines |

## 5. Found

- The turn-model attempt (run 2) — a regression on 9 real closures: refuted by the judge, not shipped (`.work/farewell/refuted-r1.mjs` kept for the record until the commit).
- The committed hook loses the farewell whenever a closure waits for a judge (run 1) — closed for marked farewells by this change.

## 6. Traces

Replays printed to the chat log of this session; the refuted hook copy `KUMM/.work/farewell/refuted-r1.mjs`, the HEAD copy `KUMM/.work/farewell/head.mjs`; the
judge's own fixtures (scratchpad of this session, `fx.mjs`, `fxk.mjs`).

## 7. Verdict

partial — the mark path passes its fixtures and changes nothing on 15 real unmarked closures; its first live proof is the next closure (the farewell file must
then hold the marked message).
