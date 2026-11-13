# TC — Conan: the owner's bush shows no «E Взять» — is the bush taken by E at all, and does our plate ask what E does (bug 96)

> **Created:** 2026-11-13 · **Parent:** `bugs/96_conan_no_take_prompt_over_bush.md` · **Status:** run 1 (build as shipped) 11:51–12:09 — the plate's defect found; run 2
> (the fix deployed) 12:12–12:17 — F1–F5, F7 pass, F6 not run
> **Outbound:** —

## Test basis

`[OWNER]` 2026-11-13 11:09 «смотрю на куст, нет E Взять - баг» · «проверь» (his frame `Снимок экрана 2026-11-13 110924.png`: third person, bow in hand, a large leafy
bush filling the view, the crosshair dot on it, no plate). The plate's contract (`krinik_pickup_prompt.lua` header, bug 77): the plate shows exactly when the game's own
pickup probe `PickupGatheringOneInstance` (the one E uses) answers true. The owner's log of that play (`UE4SS.log`, 11:08:53–11:09:26): 60 probe calls, 30 found,
no gate stall — at the moment of the frame the game's own probe most likely answered «nothing to take».

## Dimensions

- Object kind under the crosshair: the owner's bush (unknown class) · a known hand-pickable plant (control).
- What decides: the game's probe (the plate's question) vs what a real E press does (inventory, the instance).
- Gates of the plate: the corpse / prompt gates (a crocodile corpse lies ≈ 10 m away in the owner's save) — read, not assumed.
- Left out: first person (the owner was in third person), other bushes of the map (one place, the owner's).

## Stand

1. Game: the build as deployed (pack `ca3cdef`), background path (`launch-bg.ps1`), world entry `enter-world-remote.sh` = «Continue» = the owner's save `Game_1`
   (saved 11:10, the hero at the owner's spot).
2. Place: the hero where the save put him (read `K2_GetActorLocation`), the crocodile corpse of 11:09:13 near (106650, 201500) — noted, not removed.
3. Hero: god mode by the remote; the bow stays in hand as in the frame.
4. Aim: the control rotation set by the remote so the crosshair sits on the bush of the frame (the bush's instance found by a single line trace from the camera).
5. Time: as loaded (the frame was taken in sunlight); no NPC within 30 m except the corpse — killed / frozen by the remote if any walks in.
6. Real input (one E) only when `owner-idle.ps1` answers FREE.

## Cases

| # | Situation | Action | Expected (observable) | Status |
|---|---|---|---|---|
| B1 | The hero at the owner's spot, the crosshair on the bush | one line trace from the camera along the view (remote) | the hit component's class and mesh are named (foliage pickup or not) | not run |
| B2 | The same aim | the plate's own probe call (remote), the plate's state read | probe answer true/false; the plate shown exactly when true | not run |
| B3 | The same aim | the gates read: `ContainerInfo` module active, any of the six prompt widgets in the viewport and visible | both false — or the gate that hides the plate is named | not run |
| B4 | The same aim, the PC free | a REAL E | inventory item count before / after; the bush instance scale; a frame — E takes something, or E does nothing | not run |
| B5 | The crosshair on a hand-pickable plant near the spot (probe true) | look, then a frame | «E Взять» on the frame (control: the plate works at this stand) | not run |

Verdict rule: B2 false + B4 «nothing taken» → the bush is not taken by hand in the game (not a defect of the plate; the owner gets the answer and the bush's
kind). B2 false + B4 «an item taken» → our probe differs from the press — a defect of the plate. B2 true + no plate → a gate or the plate's drawing — a defect.

Run 1 (11:51–12:09, build as shipped) — the findings are in `bugs/96_…` «Forensics»: B1 the trace passes through leaves (Visibility channel) — the bush named by
the foliage list instead (`GFL_Sarcobatus_Jungle01`, pickup); B2 untouched bush — probe true, plate on; B3 gates false; B4 real E #1 took the instance (13013 ×2) and the
game spawned `BP_ResourceActor_C` with the same bush — plate dark (frame `b96_05` = the owner's frame); real E #3 at the converted bush took 12001 +2, 13015 +2 with
the foliage probe false — **fail of the plate** (it promises nothing while E gathers); B5 control — the plate shows over the untouched bush (frame `b96_03`).

## Cases of the fix (the plate asks the game's actor branch first — `bugs/96_…` «Fix plan»)

| # | Situation | Action | Expected (observable) | Status |
|---|---|---|---|---|
| F1 | A pickup bush touched once by E (a `BP_ResourceActor_C` on its place), the crosshair on it | look (no key) | the plate shown (remote: `HB_KrinikPickup` vis 3, op 1; frame) | **pass** 12:16 — after real E #1 (12001 9 → 11) the actor stands (`GetIsPickupResource` true), the foliage probe false, plate vis 3 op 1.00, frame `b96_f1_converted` shows «E Взять» over the bush (the same state before the fix — frame `b96_05`, plate dark: the control) |
| F2 | The same | a REAL E | the backpack gains items (template counts before / after) | **pass** 12:16 — 12001 11 → 12, 13015 5 → 6; the plate stays (the actor keeps more to take) |
| F3 | An untouched pickup bush (foliage), the crosshair on it | look | the plate shown (no regression of the foliage branch) | **pass** 12:13 — no actor target, probe true, plate vis 3 op 1.00, frame `b96_f3_untouched` |
| F4 | The crosshair on open sand, nothing pickable within the probe | look | the plate dark | **pass** 12:14 — 0 hits, no target, probe false, plate vis 1 op 0, frame `b96_f4_sand` (beach and water) |
| F5 | The crosshair on a corpse (an actor target that is not a resource) | look | the plate dark (E opens the corpse) | **pass** 12:14 — target `Corpse_C` (interface, line of sight), plate vis 1 op 0, frame `b96_f5_corpse`: the game's corpse strip and loot window, no «E Взять» |
| F6 | A resource actor the game calls NOT a pickup (a tree or rock hit by a tool) | look | the plate dark | not run — no tool at the stand; two arrows into a palm did not turn it into an actor (12:0x); the answer is the game's own `GetIsPickupResource` |
| F7 | The plate's self-measure line in `UE4SS.log` after a minute of F1–F5 | read | the worst check stays ≤ 2 ms at the 1 ms clock step (the old line: 1–2 ms) | **pass** 12:16 — worst 1 ms, 22–35 ms per 60 checks (before the fix 17–28); 200 repeats: the actor branch 0.125 ms a call, the foliage probe 0.045 ms |

### Run 3 — after judge round 1 (the component target as the game's `SelectObject`, `GetIsPickupResource` also for `PickupFoliage`, the plate dark on a check error; redeployed 12:37)

| # | Situation | Action | Expected (observable) | Status |
|---|---|---|---|---|
| S1 | A pickable stone `SM_rock_small02` 60 cm from the hero, pitch −50 (`stone-stand.lua`) | look | the plate shown — the judge's regression risk (a foliage component as an actor-branch target) checked | **pass** 12:39 — the traces hit only the landscape, no target, probe true, plate vis 3 |
| S2 | A snake egg 150 cm off | look | the plate shown | **pass** 12:39 — no target, probe true, plate vis 3, frame `b96_r2_egg` |
| F3 | The untouched bush | look | the plate shown | **pass** 12:40 — no target, plate vis 3 |
| F1 | The bush after one real E (12001 12 → 13) | look | the plate shown | **pass** 12:40 — target `BP_ResourceActor_C`, probe false, plate vis 3, frame `b96_r2_f1` |
| F5 | A corpse 150 cm off | look | the plate dark | **pass** 12:4x — target `Corpse_C`, the game's corpse strip on, plate vis 1 op 0 |
| F4 | Sand, the camera clear of any touched bush | look | the plate dark | **pass** 12:4x — no target, probe false, plate vis 1 |
| F4b | Sand view (yaw −150) at the touched bush — the camera sits INSIDE it | look, then a REAL E | the game's target is the bush (the trace starts in it) → plate on; E gathers | **pass** 12:4x — target `BP_ResourceActor_C`, plate vis 3; real E: 12001 13 → 14, 13015 6 → 8 (also covers F2: E under the plate gathers) |

### Run 4 — after judge round 2 (the cosine before the game calls; the summary by steps with errors; the first GetIsPickupResource failure logged; the current pawn per check; the third-person camera only when active — written 2026-11-13 14:3x)

Basis: the second judge's findings, verified against the code and the 3.0.1 bytecode of `UpdateHighlightTarget` (bug 96 «Judge round 2»). Dimensions added: the number of hits
in the traces (few · a camp with many interactables), the camera state (first person · third person · neither active), the error path (a check that fails).

| # | Situation | Action | Expected (observable) | Status |
|---|---|---|---|---|
| R1 | F1, F3, F4, F5 again (touched bush, untouched bush, sand, corpse) | look | the same verdicts as run 3 (the reorder is exact: the same target) | **partial** 14:48–14:50 (final code, Lua redeployed 14:46): F3 pass — untouched `Sarcobatus` #130 at 129 cm, third-person camera active, plate vis 3 op 1.00; F4 pass — the oasis beach, plate vis 1 op 0, frame `r1_f4c`; F1 pass 14:57 — a real E (PC free) at view yaw 33.6 / pitch −17: 12001 14 → 15, 13013 ×2 to the hot bar, the bush became a resource actor (`GetIsPickupResource` true), plate vis 3 op 1.00, frame `r1_f1` («E Взять» over the touched bush); F5 not run — no corpse within 30 m (the stand keeper's kills do not stay); the branch is covered by R2 |
| R2 | The old and the new order on the SAME traces, 24 view directions (yaw every 30°, pitch −10 / −35) — `_config/pickup-target-diff.lua`; a camp with many interactables for the cost | one remote call | the same target in every direction; the new order no costlier | **pass (targets)** 14:48 — SAME 24 DIFF 0 (targets incl. `EAA_FeralCroc_C`, up to 10 hits a direction); cost under load (the kit compiling beside): old 0.033 ms, new 0.029 ms a call; the quiet-machine number and a many-hit camp owed |
| R3 | The plate's minute line in `UE4SS.log` | read after a minute | «за 60 шагов проверок N, своё время …, плашка горела K раз, ошибок 0» | **pass** 14:39–14:40 — four lines in the new form, «ошибок 0» (times inflated by the kit compiling beside) |
| R4 | A forced check error (the remote breaks the cached controller — `pc_cached` set to an invalid object is not reachable; instead: a check during a loading screen) | read the log | the summary keeps coming, its «ошибок» counts the failures | not run |
| R5 | First person (`SwitchToFirstPersonCamera`) over the untouched bush | look | the plate shown (the first-person camera, bonus 0) | **pass** 14:55 — `Sarcobatus` #130 at 85 cm, pitch −71, first-person camera active, plate vis 3 op 1.00; frame `r5_fp_bush`: «E Взять» left of the dot |
| R6 | The fifth finding (the game asks `CameraThirdPerson:IsActive()`) copied into the plate | the stand after the idle orbit | — | **refuted as a change** 14:4x — after the idle orbit BOTH cameras read inactive at a normal view with the HUD back (`EnableVanityCameraMode(false)`, frame `r1_f3c`); a fresh world entry reads the third-person camera active. The game asks only at the E press, when real input has re-activated the camera; the copy darkened the plate over a bush E takes — reverted, the reason at the code line |
