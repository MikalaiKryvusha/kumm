# Bug 103 — the farewell hook loses the real farewell when the closing turn waits for a background judge or crosses an autocompaction

**Status:** 🔧 FIX BUILT 2026-11-17 05:4x — an explicit farewell mark (below); the first live marked closure PASSED (06:38, read 2026-11-17 by the next /resume) · filed 2026-11-14 23:58 +03:00 · **Severity:** S2 (a closing chat's farewell is lost or stale; the next `/resume` reads the waiting text) · **Version/build:** KUMM
`tools/hooks/farewell-capture.mjs` as of the closure-ladder change (2026-11-14) · **When/context:** judge rounds 3–4 of the closure-ladder work <!-- attribution-ok: the order's verbatim is in PROJECT_HISTORY entry 2026-11-14 22:3x -->
(the order of 2026-11-14 22:29, verbatim in PROJECT_HISTORY entry 2026-11-14 22:3x) · **Fixing:** after the closure-ladder commit — a separate change with its own judge rounds (out of that order's scope)

## Goal vector

Achieve: the farewell file holds the LAST message of a closing turn even when the closure waits for a background judge (task notifications, peer hand-backs) or
crosses an autocompaction; a closure from an earlier turn never ends an autonomy order the owner gave later. Acceptance: replays of the real transcripts named
below through `farewell-capture.mjs --out` write the real farewell; `tools/test-guards.mjs` parts J and K carry the multi-Stop sequences that happen live.

## Symptom (the judges' replays of real transcripts, verified by them)

- 2a24c0f4 (a soft closure at line 2382, Stops at 2553 / 2589 / 2780) and 5cbe3ee0 (line 39): the file stays the interim «Судья проверяет передачу…» /
  «Судья работает в фоне…»; the real farewell is never written. Cause: Stop #1 fires on the waiting text and records closure id X; every later Stop of the same
  closure is skipped by `if (turn.closureId && seen === turn.closureId) return;` (the guard that keeps a knowledge-hook «новых знаний нет» from overwriting).
- A `<task-notification>` user record (isMeta false; 143 of 147 in the transcripts follow a Stop) splits the turn, so after it the closure is not seen at all.
- A peer hand-back («Another Claude session sent a message…», isMeta true) does not reset the farewell tail: closure → «Жду судью.» → hand-back → «Прощание.»
  gives «Жду судью.\n\nПрощание.» on the journal path.
- An autocompaction summary (`isCompactSummary: true`, no isMeta) counts as the owner's prompt and splits the turn — a soft closure running into the
  autocompaction (≈ 96.7 % of 1 M) loses its farewell, and in autonomy mode the guard orders «work on».

- **Seen live again 2026-11-16** (the soft closure of 21:46): `FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md` (21:47) held the interim «Сообщение коммита закрытия готово.
  Жду итог судьи, после него коммит и отправка.»; the real farewell came after the judge and was never written. The owner pasted it into the next chat by hand
  (2026-11-16 22:12, «твои слова из прошлого чата») — the cost of this bug, paid by the owner. The first face above (Stop #1 on the waiting text, later Stops skipped).

## The tried fix and why it was rolled back (2026-11-14 23:5x)

Treating `<task-notification>` as NOT the owner's prompt fixed the split but made a regression: an owner message typed mid-turn arrives as an `attachment`
(`queued_command`, `origin.kind: human`) which `readTurn` never treats as a prompt — so an OLD closure now reached past the notification and switched off a NEW
autonomy order (judge round 4, fixture with real shapes). Rolled back to the old behaviour; the J case that asserted the new behaviour was removed with it.

## 2026-11-17 — the turn model refuted again; the fix is an explicit farewell mark

- **Reproduced stop by stop** on the real closures b9342015 (2026-11-16 23:54 → 00:00), ea639d79 (21:47 → 21:52) and 2a24c0f4 by the new
  `tools/farewell-replay.mjs` (cuts a transcript at every `system:stop_hook_summary`, feeds the hook the last assistant text as the live event does): the
  waiting line wins in all three. Record shapes read in this chat's own transcript (b50f4e05): a task notification and a hand-back arrive mid-turn as
  `attachment` / `queued_command` with `origin.kind` `task-notification` / `peer`; the owner's words typed mid-turn as the same with `origin.kind` `human`.
- **Attempt 1 (05:0x–05:2x) — REFUTED by an independent judge** who replayed all 78 closure transcripts: the turn started only at the owner's prompt (queued
  human counted), notifications / hand-backs / compaction did not split it, the longest stop text of a closure won. 9 real closures lost their farewell
  (1b272a24, 31346b3e, 6461285c, 687d7b07, 7ff945d4, aabd6f1c, b6fd4b85, c5fe291c, cd0c9a3d — the owner typed during the closure), 63ad6b9e took a reply written
  after the farewell, an image-only owner message did not count (0da73ffb). Verified on 1b272a24 (nothing written vs HEAD's «Чат закрыт…»); the hook was put back
  to HEAD at 05:38. Lesson: the farewell cannot be derived from the turn's shape — the owner talking during the closure is the most common real case.
- **Attempt 2 (05:4x) — the producer marks it:** `/end-chat-soft` Step 5 and `/end-chat-force` Step 3 end the farewell with the hidden line `<!-- farewell -->`;
  the hook writes the message carrying it (on a line of its own), whatever came before in the turn; without the mark the committed logic runs unchanged.
  test-guards 301/301, the six new part-J cases red on HEAD; 15 real unmarked closures give the same file as HEAD (report
  `testcases/reports/2026-11-17_farewell-capture-marker.md`). Open: the first live marked closure (this chat's own); the old path's losses stay for an unmarked farewell.
- **The first live marked closure — PASS, read 2026-11-17 10:40 +03:00 by the next chat's `/resume` step 0:** `FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md` (written 2026-11-17 06:38:30,
  after the closing commit 06:37:44) holds the soft closure's farewell itself («Всё сделанное за чат проверено и отправлено на GitHub… Чат закрываю мягко…»), not a
  waiting line; the mark path worked on the real path once. The old path stays the fallback for unmarked closures.
- **Judge round 1 on the mark (06:0x, 2 defects, 4 risks, 2 cosmetic):** the mark counted on any line of any message (a code block showing the convention
  mid-chat would overwrite the file) — FIXED: only at the END of the message and only in a chat with an accepted closure (`closedEver`); a test did not guard
  the marked path's state write — FIXED (a fresh-state case); the control cases depended on order — FIXED; autonomy-guard did not know the mark (a second
  ceremony after a split turn) — FIXED; the same-line mark — accepted; the skill sentence moved to the end of Step 5. test-guards 308/308, ten cases red on HEAD;
  the mark injected into two real farewells writes them (HEAD: the waiting line); 15 unmarked closures unchanged. Committed `bb44eb3`; the skills' mirrors for the other agent systems re-synced by `node .kaif/kaif-core.mjs sync` (`c3f3acb`); KAIF #181 field update posted.

## Fix plan (2026-11-14 — superseded by the mark of 2026-11-17)

1. One turn model for all the hooks that read turns: the owner's prompt = a user text record that is not meta, not a tool result, not a CLI caveat, not a task
   notification, not a compaction summary — PLUS the queued `attachment` with `origin.kind: human` (it IS the owner's word).
2. The farewell file is rewritten on every Stop of the same closure while the new text is longer than a knowledge-hook short answer (or: the knowledge-hook's
   answer is recognised and skipped), so the last real farewell wins.
3. The tail resets at a peer hand-back and a notification.
4. Cases in parts J and K from the replays above (multi-Stop sequences, a queued owner order after an old closure, a compaction inside a closing turn).

## Decisions made without the owner

- `[AI]` Filed instead of fixed inside the closure-ladder change: the defects are older than it, and a fourth round of fixes in the turn model was already
  producing new defects (`PHILOSOPHY.md` → the rule when stuck).

## Links

`testcases/reports/2026-11-14_context-budget-soft-80-force-92.md` (rounds 1–4) · KAIF bug 26 · `tools/hooks/autonomy-guard.mjs` (shares `readTurn`)

**Correction 2026-11-17 06:37 +03:00:** the commit `bb44eb3` says «review: 3 rounds»; there were TWO judge rounds — the turn-model attempt (refuted) and the mark's round 1 (2 defects fixed). The commit message stays as history; this line corrects it (the closing judge's caveat 4).
