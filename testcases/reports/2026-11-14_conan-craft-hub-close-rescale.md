# Run report — Conan: hub crafting finished instantly after the close (bug 94) — reproduced by the owner's path and fixed

## Work

Bug 94 (`[OWNER]` 2026-11-13 09:46 «Я закрываю хаб - и они МГНОВЕННО изготавляются»), dayloop item 3 of 2026-11-14. Basis — `testcases/TC_conan_craft_hub_close_2026-11-14.md`
(C1–C5), the bug document.

## Contour

The 3.1.0 game, the owner's world `Game_1`, machine lock «kumm»; KrinikConanUI `krinik_pause_in_menu.lua` with `rescale_queue` (stats 16 / 9 of the hero queue's
entries × new / old on every multiplier change); remote `pult.sh`, probes `KUMM/.work/arrows/` (`craft-watch.lua`, `bow-count.lua`, `queue-stats.lua`), real input
`mouse-seq.ps1` only when `owner-idle.ps1` said FREE, the hub closed by `CraftingGUI_C:TryCloseWindow()`.

## Runs

- 2026-11-14 10:4x — launch 3 (PID 40688): C1 twine by real R; the crafting GUI's handlers and the queue API read.
- 10:5x–11:00 — launch 4 (PID 18952): C2 before the fix (click + real F in one sequence, close after ≈ 2 s, bows counted); the hero `CustomTimeDilation` lever (ruled
  out); `queue-stats.lua` (stats 9 / 16 / 17); stat 16 set near the elapsed (`SetFloatStat(16, e + 0.02, true)`); stat 9 written and read back.
- 11:02–11:2x — launch 5 (PID 40668) after `bash .work/arrows/deploy-ui.sh` with the fix: C2f (close after ≈ 2 s, 14 samples), C5 (close, reopen mid-batch, 10 samples).
  Recorded moments (bug 94 and the STATUS block of that chat, now in PROJECT_HISTORY entry 2026-11-14 15:4x): C2f seen 2026-11-14 11:06 +03:00 (one bow per ≈ 3 s
  after the close); C5 PASSED 2026-11-14 11:12 +03:00; E1 (the Esc menu does not rescale) PASSED 2026-11-14 11:28 +03:00.

## Checks

Hygiene: an independent judge round on the diff (round 3 of the day); the UE4SS log lines «крафт героя: очередь переведена A → B, записей N».
Functional run: the real game, the owner's path (the hub's crafting column, a real click on the bow, real F «Сделать 10»), READ by the remote (bow counts, stats,
  dilation) and frames: C1 pass; C2 — the defect reproduced (nine bows within ≈ 2 s of the close, ≈ 22 s expected); C2f pass (one bow per ≈ 3 s after the close:
  t 163.4, 165.9, 169.0, 172.0, 175.1, 178.6); C5 pass (inside the reopened hub one bow per ≈ 3 s: t 519.5, 522.1, 525.1, 528.2). After judge round 3 (the Esc menu keeps the multiplier) — launch 7 (PID 7820):
  E1 pass (after the close ≈ 3 s a bow; in the Esc menu the batch stands; after it ≈ 3 s; «сбоев 0»); a first try with a separate scale variable failed (bug 100)
  and was replaced. C3, C4 not run (the TC says why).

## Found

- The multiplier is baked into each queue entry's stat 16 at ENQUEUE (the batch = the item in progress + one stack entry) — the 2026-11-13 «read at the item's
  start» came from the confounded remote path; corrected in the bug.
- The hero's `CustomTimeDilation` does not move the queue (it runs on world time).
- The remote `CraftItems` path and the GUI's `SlotCraftTenButton` called directly do not reproduce the player's batch (the latter queued nothing).

## Traces

`KUMM/.work/arrows/craft_c2_inhub_q.webp`, `craft_l1_q.webp` (the queue: one bow + a stack of 9), the probe outputs in this report; the game's `UE4SS.log` lines of
11:04–11:2x. Window closures: launches 3–4 closed by PID, no crash-report window.

## Verdict

pass — the batch keeps its real-time pace across the hub's open and close; the owner's own play is the final check.
