# Bug 93 — Conan: a sprint started BEFORE the draw breaks at the draw (KrinikConanLocomotion · krinik_bow_sprint)

**Status:** 🔧 build 7 deployed; S1b, S3, S6 PASS by real input 2026-11-13 10:43 (report `testcases/reports/2026-11-13_conan-bow-sprint-sprint-then-draw.md`); **the owner's own play confirms it** — `[OWNER]` 2026-11-13 11:01 «спринт и стрельба работают»; open: S8, S9, the cost (build 4 deployed 09:32); his next remark —
the bow unseen in first person — is bug 95 · **Severity:** S2 (the owner's playtime on the feature he named
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
- **Build 6** (judge round 3: lever c only with substate 7 still set and a BOW item; IsPlayerControlled first): S1b, S3, S6 pass (TC). Lever c (later REMOVED in build 7 — it never fired with a wielded bow) was meant as cover
  for the sheathed-bow path (case S9, owed).
- Cost: the minute with the runs read «худший 2.000 мс» (clock step 1 ms) — finding 3 still open (frame-time A-B owed).
- Stand lesson: a weapon made by `AddItemTemplate` cannot be wielded (neither by the agent nor by the owner, 10:21 «НЕ ПОЛУЧАЕТСЯ ЭТОТ ЛУК ВЗЯТЬ В РУКИ»); a bow the
  hero CRAFTS (`CraftItems` of a known recipe, ingredients by `AddItemTemplate`) is wielded by a real hot-bar key. Arrows from the backpack.

REAL WORLD: accumulated — the owner's own build and his test save `Game_1` (his new game of 2026-11-10); data and machine — his PC; path — real keys and mouse into the
game. S1b verified on the real world; the owner's own play of build 7 confirms it (2026-11-13 11:01).

## The owner's next wish — the aim zoom in a sprint (2026-11-13 11:07–11:08, typed into the KCCP chat by mistake, relayed verbatim by the KCCP session)

`[OWNER]` «кстати, нравится, что в спринте приближение камеры уходит при прилцеливании» · «ведь не может идти речи ни о какой точности при стрельбе в спринте =)» ·
«аааа, только это не всегда работает» · «если уже спринт и прицелиться - есть приближение» · «если сразу прицеливание, а затем спринт - уходит приближение - вот это
нравится» · «если уже спринт и прицелиться - есть приближение / Вот тут, если можно. я бы вбирал приближение».
So: draw first, then sprint — the aim zoom goes (liked); sprint first, then draw — the zoom stays; he wants it gone there too (no aim zoom while sprinting with the
bow). Lead: the zoom is `BP_PlayerFovController` (`SetFieldOfViewTarget` 0/1) + the montage notify `BP_FieldOfViewChangeForDuration`, and KrinikConanArchery's aim
FOV (game map «Лук и камера»); in the sprint-first order the notify fires at the draw's start while the hero is already sprinting. NEXT session, with bug 95.

## The owner's order — the aim zoom and the sprint (2026-11-16 18:40, chat, verbatim)

`[OWNER]` «2) нужно сделать адекватно зум в комбинации со спринтом.» · «- герой в прикладке - есть зум (будет перком, и чем больше ступеней перка, тем сильнее зум).
Начали спринт - зум отменяется. Если ПКМ удерживается, а спринт закончился - возвращается зум автоматически.» · «- герой не в прикладке. Начали бежать спринтом.
Делаем прикладку - зум не делается, так как герой в спринте. Спринт остановился, ПКМ прикладки удерживается - зум автоматически срабатывает.»

Acceptance (the four transitions, both orders): Z1 aim (RMB held) → zoom in · Z2 aim, then sprint starts → zoom out · Z3 aim held, sprint ends → zoom back in by itself ·
Z4 sprint first, then RMB → no zoom while sprinting · Z5 then the sprint stops with RMB held → zoom in by itself · Z6 RMB released → zoom out as in vanilla. «Будет перком»
(the zoom strength by perk ranks) — a perk of the perk list (plan 49), not this bug: here the zoom is the current one, on or off.

**Built 2026-11-16 18:58 (second version — CORRECTED 2026-11-16 19:07 +03:00: the first version of 18:48 used `FieldOfViewReset()` and a bare `SetFieldOfViewTarget` and was
replaced the same session, EXP-0540)** (pack working tree, `KrinikConanArchery/ue4ss/scripts/main.lua`, section «зум прицела и спринт», table `SZ`; `luac -p` clean,
main-chunk locals 196 of Lua's 200): `CFG.sprint_unzoom`; a post-hook of `OnSubstateChanged_Sprint` — the BaseBPCombat_C path takes (the BasePlayerChar_C one fails) →
after 120 ms: sprint entered and the controller still in aim (mode 1) → the native `FieldOfViewChange(0.1, 2)` (the sprint view); sprint left, RMB held, the hero drawing
(11 / 15 / 16), not in aim → `FieldOfViewChange(0.1, 1)` (Z3, Z5 — our FOV post-hook then sets 75°); in the FOV post-hook an aim entry while sprinting → target × 1.9 (the sprint
angle) and `FieldOfViewChange(0.1, 2)` next tick (Z4); no redraw-hold while sprinting. Remote: Z1, Z2, Z4 pass.
**Real keys 2026-11-16 19:05–19:06 (the owner's word «КОМПЬЮТЕР СВОБОДЕН!!!», `mouse-seq.ps1`, the recorder `KUMM/.work/zoom-rec.lua`):** series A (RMB → Shift + W → Shift up
→ RMB up): mode 1 / 75° → mode 2 / 102° with substates 7, 15, 16 (the draw held in the sprint) → at the Shift release the DRAW ENDS (15 / 16 gone) and the mode goes to 0 —
RMB still held, no draw, nothing to zoom: Z1, Z2 pass; Z3 FAILS by the bow sprint, not by the zoom. Series B (Shift + W → RMB → Shift up → RMB up): mode 2 all along, NO draw
substate at all — an RMB in a sprint does not draw on 3.1.0 (S1b passed on 3.0.1, 2026-11-13 10:43, before the move). Open: the bow sprint on 3.1.0 (control case with
`krinik_bow_sprint` off, then the native cause), then Z3 / Z5 again. Judge round 1 on the zoom code (19:06): risks — the game's own exit from the sprint view rides the sprint
KEY, not the substate (the 120 ms order to check by real keys in both orders), silent failures (log the first N events), hot reload (lazy hook), the ×1.9 numbers (rule 24 —
the hero's `FieldOfViewSubstateTrigger` is the native route), a 5° pump on a shot in a sprint, `IsLocallyControlled`. Fixed 2026-11-16 19:11 +03:00: the first N sprint events and any error
go to the log, the lazy hook in the FOV post-hook, `IsLocallyControlled`, the working hook path first; open: the sprint-KEY order, ×1.9 → the native route, the shot pump.
**Run 19:1x (real keys, the logging build):** the hook FIRES on the sprint start and end (each logged twice); `ToggleWieldWeapon()` did NOT wield the bow this time
(`HasWeaponsEquipped` false — the RMB was an unarmed attack); the event line read **«ПКМ false» while `mouse-seq` held RMB** — `rmb_held` (`IsInputKeyDown`) may not see
SendInput's button: check it (an RMB-held read during a real `rdown` with the bow drawn) before Z3 / Z5 can pass even with the bow sprint fixed.
**Control case 19:14 — BLOCKED by the stand:** `krinik_bow_sprint` taken out of the GAME copy's section list only (the log: three sections loaded), the game in front —
the bow did not come to hand: `HasWeaponsEquipped` false after the load, after `ToggleWieldWeapon()` (19:1x) and after a real «3» (19:15). After the agent's game kills the
save no longer has the bow wielded. The copy restored by `-Deploy -Only KrinikConanLocomotion` (md5 = the pack source). Stand first next time: a bow the heroine can wield
(NOT `bow-stand.lua`'s craft branch — it crashed the game, below), `HasWeaponsEquipped` true BEFORE any series.
**CRASH in the agent's run 19:18:04 (the stand step):** `EXCEPTION_ACCESS_VIOLATION reading address 0x70` 2 s after `god-on.sh` executed (19:18:02), while the remote ran
`_G.__bs = {craft = true}; dofile('…/_config/bow-stand.lua')` (no «исполнено» line for it) — most likely the remote `CraftingQueue:CraftItems` on 3.1.0, whose patch rewrote the
crafting queue (plan 53 step 12, the station's event graph). The crash window closed by PID 5580; the Locomotion copy restored (md5 = the pack). **Do not run `bow-stand.lua`
`{craft = true}` on 3.1.0** until its craft call is re-read against the 3.1.0 queue; the other route — the owner's own bow in his save, or a bow crafted by him.
**NEXT (in order):** (1) the bow sprint on 3.1.0 — control case with `krinik_bow_sprint` off (does a draw survive the Shift release; does RMB draw in a sprint); (2) `rmb_held`
under SendInput; (3) Z3 / Z5 by real keys; (4) the judge's open risks.

## Open from judge round 2

- Finding 1: the K2_CanSprint override also skips the game's other refusals (an overloaded hero, low stamina at the start, mounted) — case S8 owed.
- Finding 3: the worst call read 2 ms in the owner's session (clock step 1 ms) — re-measure on build 4 by the minute line and a frame-time A-B.
- Finding 6: `krinik_mod_settings.lua` registers the placeholder-perk widget hooks with the perks off — FIXED 2026-11-13 10:5x (pack `ca3cdef`, judge clean; live: hub
  opened/closed, no KrinikConanUI errors, no «perks merge» lines).
- Finding 7 (dev-only probe `sprint-run-probe.lua` swallows errors) — declined: not used for this case; the sampler is the instrument.

## Decisions made without the owner

- `[AI]` Substate 11 counts as «drawn» only with the bow in hand (the gate's last test); a melee weapon never opens the gate.

## Links

`games/ConanExiles/mods/KrinikConanLocomotion.md` (section «sprint with the bow drawn») · plan: STATUS handover item 1 · bug 85 (the crash class the sampler
avoids: no `LoopAsync`).
