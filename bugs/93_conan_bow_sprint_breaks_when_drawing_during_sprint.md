# Bug 93 — Conan: a sprint started BEFORE the draw breaks at the draw (KrinikConanLocomotion · krinik_bow_sprint)

**Status:** 🔧 fix built and deployed 2026-11-13 09:32, the real-input case S1b owed (the owner at the keyboard) · **Severity:** S2 (the owner's playtime on the feature he named
most important) · **Version/build:** Conan Exiles 3.0.1, pack `ConanExiles` working tree, section build 3 (2026-11-10 19:54) → build 4 (2026-11-13) ·
**When/context:** reported by the owner 2026-11-13 09:14–09:15 after his play of 2026-11-10 19:5x–20:4x · **Fixing:** this session

## Goal vector

Achieve: with the bow in hand, a sprint the player is ALREADY in survives pressing RMB — the hero keeps sprinting while drawing and can shoot on the run, as in the
draw-first order. Acceptance: TC `testcases/TC_conan_bow_sprint_2026-11-10.md` case S1b — substate 7 kept through 11 / 15 / 16, MaxWalkSpeed 735 at every 100 ms
sample from the RMB press to the release, the shot fires, the sprint goes on after it.

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-13 09:14 «по спринту и луку, есть баг» · «в момент натяжения, когда выполняется приближение камеры - спринт прерывается» · 09:15 «то есть не
получается в постоянном спринте без его прерывания выполнить ПКМ для натяжения и продолжая спринт - выстрелить».

## Repro

W + LShift (sprint) → RMB held (the draw; the aim camera zooms in) → the sprint stops, the hero walks at the aim speed (214). Real input only: the remote's RMB
event is a tap and cannot hold a draw (`ConanExiles/_config/sprint-bow-sample.lua` header).

## Forensics

- The owner's session log (UE4SS.log of 2026-11-10 19:51–20:43; the lines after 20:36 were read by judge round 2 before the 09:23 launch overwrote the file):
  «разрешений 0, переходов 0» every minute 19:52–20:36; «разрешений 106» 20:39:33, «148» 20:40:33 with «тип движения — спринт (1…5)» 20:39:28 — the section
  engaged in some tries and not in others.
- The agent's own cases of 2026-11-10 (run report `testcases/reports/2026-11-10_conan-bow-sprint.md`) pressed RMB FIRST, then W + LShift (S1, S2, S4): the
  owner's order was never tested.
- Bytecode of `BasePlayerChar` (2026-11-13, `retoc-5.8 to-legacy --filter BasePlayerChar` + `uaj exports` + UAssetGUI `tojson` + `kismet-trace.py`):
  `SprintAction(Pressed)` → `ClientStartSprint` / `ClientStopSprint` (→ native `StopSprint`); the instance flag `SprintKeyIsDown` is set True on the sprint press
  and False on the release; `OnSubstateChanged_Attacking` (substate 11 entered) only adjusts stamina; `ResetSprint` re-enters substate 7. No blueprint path
  clears the sprint on a draw — the stop comes from native code or from the movement row change.

## Root cause (hypothesis, judge round 2 finding 2 — to confirm by S1b)

The gate opened only in substates 15 / 16 (power charge, charge hold). A draw starts in substate 11 (attack). During 11 the gate stayed shut, the Ranged row
won (214), the game stopped the sprint and its `bTrySprint` went false; when 15 came, the gate's `bTrySprint` test failed for the rest of the draw. In the
draw-first order LShift was pressed AFTER the draw had reached 15, so `bTrySprint` was set fresh — why the agent's cases passed.

## Fix (build 4, 2026-11-13)

`krinik_bow_sprint.lua`: `DRAW_SUBSTATES = { 11, 15, 16 }` (with the bow in hand 11 is the bow's own attack, never a melee swing); the redundant nested
`EvaluateMovement_Sprint` call dropped (judge finding 4, also cost — finding 3); hook registration retried per hook, error text through `"%s"` (finding 5).
Sampler `sprint-bow-sample.lua` reads `SprintKeyIsDown` beside `bTrySprint`. If S1b still fails with `try=false key=true` right after the RMB press, the next
lever is the native stop itself (who clears `bTrySprint` on the draw) — not a re-set after the game's stop (HOUSE_RULES rule 24).

## Runs 2026-11-13 (real input by `mouse-seq.ps1`, sampler 100 ms + `stop-sprint-probe.lua`)

- **Build 4 refuted** as the fix: with a sprint running, RMB → `StopSprint` + `WeaponEquipped` (twice) in the same frame → `bTrySprint` false, `SprintKeyIsDown`
  true, substate 11, MaxWalkSpeed 192 — the judge's «substate 11» hypothesis does not explain the stop: the game clears the sprint flag BEFORE our gate is asked.
- **Root cause (observed):** taking the weapon up again on RMB (`BaseBPCombat_C:WeaponEquipped` → `StopSprint` → `bTrySprint = False`).
- **Build 5:** lever c — a post-hook of `WeaponEquipped` sets `bTrySprint` back when `SprintKeyIsDown`, the bow in hand, running forward on the ground, not
  exhausted. Seen: after `WeaponEquipped` the flag stays true, the log line «лук взят на бегу с зажатым спринтом: спринт сохранён», the sprint (733) resumes
  right after the attack substate ends while Shift is held.
- **NOT yet verified:** the sprint DURING a real draw (15 / 16). The test hero's bow was put into the equipment slot by the remote; the game does not wield it
  (RMB = an unarmed attack, substate 11 only, no shot, also standing — control 10:2x). The owner was asked to equip the hero his way (chat + voice 10:19).
- Earlier runs of this session (09:47, 09:49) had NO bow in hand at all (the owner's catch «ты лук в руки не планируешь взять») — their conclusions were withdrawn.

## Runs with a REAL bow — 2026-11-13 10:30–10:33 (the hero crafted bow 51401 by recipe 51401 and took it up by a real «3»)

- **CORRECTION:** «build 4 refuted» above came from runs with no real bow (fists / a remote-attached model) — withdrawn. With a properly wielded bow an RMB in
  a sprint does NOT call `WeaponEquipped` (no lever-c line in the build-6 run), the game does not clear `bTrySprint`, and the sprint holds through 7,11 →
  7,11,15,16 at 660 with the shot fired — levers a and b with the gate open from substate 11. So the owner's break is most likely judge round 2's finding 2
  (the gate shut during 11 — build 4's fix); not proven by a control run of build 3 on this stand.
- **Build 6** (judge round 3: lever c only with substate 7 still set and a BOW item; IsPlayerControlled first): S1b, S3, S6 pass (TC). Lever c stays as cover
  for the sheathed-bow path (case S9, owed).
- Cost: the minute with the runs read «худший 2.000 мс» (clock step 1 ms) — finding 3 still open (frame-time A-B owed).
- Stand lesson: a weapon made by `AddItemTemplate` cannot be wielded (neither by the agent nor by the owner, 10:21 «НЕ ПОЛУЧАЕТСЯ ЭТОТ ЛУК ВЗЯТЬ В РУКИ»); a bow the
  hero CRAFTS (`CraftItems` of a known recipe, ingredients by `AddItemTemplate`) is wielded by a real hot-bar key. Arrows from the backpack.

REAL WORLD: accumulated — the owner's own build and his test save `Game_1` (his new game of 2026-11-10); data and machine — his PC; path — real keys and mouse into the
game. S1b verified on the real world; the owner's own play of build 6 not yet.

## Open from judge round 2

- Finding 1: the K2_CanSprint override also skips the game's other refusals (an overloaded hero, low stamina at the start, mounted) — case S8 owed.
- Finding 3: the worst call read 2 ms in the owner's session (clock step 1 ms) — re-measure on build 4 by the minute line and a frame-time A-B.
- Finding 6: `krinik_mod_settings.lua` registers the placeholder-perk widget hooks with the perks off — register only when `PLACEHOLDER_PERKS` is true.
- Finding 7 (dev-only probe `sprint-run-probe.lua` swallows errors) — declined: not used for this case; the sampler is the instrument.

## Decisions made without the owner

- `[AI]` Substate 11 counts as «drawn» only with the bow in hand (the gate's last test); a melee weapon never opens the gate.

## Links

`games/ConanExiles/mods/KrinikConanLocomotion.md` (section «sprint with the bow drawn») · plan: STATUS handover item 1 · bug 85 (the crash class the sampler
avoids: no `LoopAsync`).
