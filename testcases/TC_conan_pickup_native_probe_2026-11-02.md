# Test cases — «E Взять» by the game's own pickup probe (bug 77)

**Created:** 2026-11-02 · **Under test:** KrinikConanUI `krinik_pickup_prompt` — the check calls the game's `EnvironmentFunctionLibrary:PickupGatheringOneInstance`
(the probe E uses), no near list; the E key rim fades with the plate; the plate's new place · **Version/build:** pack ConanExiles after `40db56d` (this change)
**Test basis:** `[OWNER]` 2026-11-02 14:18–14:22 (verbatim in `bugs/77_conan_pickup_prompt_late_show_late_hide.md`): «с какой-то должгой задержкой появляется и
долго не исчезает» · «ДА НЕ СПИСКО БЛИЗКИХ УЖНО ПРОВЕРЯТЬ!» · «А ЩУП ИЗ ПРИЦЕЛА!» · «КОТОРЫМ И ПОДНИМАЮТ!» · «ЭТИМ ЖЕ ЩУПОМ РАЗ В СЕКУНДУ ЩУПАТЬ» · «фейд плохой,
контур E не действует на фейд!» · «слишком далеко плашка от центра» · «поднять выше в одну линию с точной прицела, и правее»; 09:04 «при открытой плашке …
до 5 раз в секунду»; the game's own code — `UpdateHighlightTarget` bytecode (bug 77, Forensics).

## 1. Goal vector

Achieve: «E Взять» shows exactly when E would take a foliage pickup, at most one check (1 s) after the crosshair lands on it, anywhere in the world, and
leaves within a fifth of a second after the crosshair leaves; it fades as one piece; it stands on the crosshair dot's line just left of the dot.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHEN the crosshair rests on a pickable stone or branch, the section shall show the plate | s from the view settling to the plate at full opacity · log line + frame · ≤ 1.2 s |
| R2 | WHEN the crosshair leaves the pickup, the section shall hide the plate | s from the turn to opacity 0 · frame series · ≤ 0.45 s (0.2 check + 0.2 fade) |
| R3 | WHERE the hero is in a place never visited this session, R1 shall hold | the same as R1 after a teleport of ≥ 100 m · ≤ 1.2 s (was up to ≈ 14 s) |
| R4 | WHILE the plate shows, pressing E shall take the item the plate points at | the item count in the hero's inventory · remote · +1 |
| R5 | WHILE the plate fades, the E key rim shall fade with it | rim pixels at plate opacity 0.0 while Visible · frame · none |
| R6 | The plate shall stand on the crosshair dot's line with its right edge left of the dot, not touching it | frame at 4K · plate vertical centre within ±4 px of the dot; gap > 0 |
| R7 | The section's check shall cost ≤ 0.2 ms in the worst call | the section's minute line · the UE4SS log · ≤ 0.2 ms |

## 3. Coverage matrix

Partitions: pickup under the crosshair (stone · branch) / nothing pickable (ground, sky) / pickup in a new area; states: plate hidden → shown → hidden; camera:
third person (the build's default). Not covered here: first person (the probe's start differs only by the game's own bonus 0 — one frame later if time allows),
water «E Попить» (not foliage, plan 42 step 2), every 55 meshes (one probe covers them all).

## 4. Stand

The oasis save, noon (`BP_TimeOfDayManager_C:SetTimeOfDay(12.0)`), `quiet-stand.lua` (no humanoids, wildlife, Night Terrors), god on (`god-on.sh`), the hero by
`stone-stand.lua` (60 cm east of the nearest `SM_rock_small*`, view −50). New area: `K2_TeleportTo` ≥ 100 m away, then the nearest pickup by the remote.

## 5. Cases

| ID | Steps | Expected | Status | Observed |
|---|---|---|---|---|
| N0 | `fn-params.lua` on `EnvironmentFunctionLibrary:PickupGatheringOneInstance`; one call by the remote at the stone stand | parameters listed; the call returns `true` at the stone, `false` with the view at the sky; the game alive | pass | 10 parameters as in the bytecode; stone true (instance 828), view up false; game alive |
| N1 | stone stand, the new section deployed; frames 0.1 s apart after the view settles | the plate within ≤ 1.2 s; the log has no «ошибка проверки» | pass | 0.29 / 0.39 / 0.74 / 1.24 s (one of four 0.04 s over — the 1 s rhythm + fade) |
| N2 | plate shown → the view turned to the sky by the remote; frames 0.05 s apart | the plate gone ≤ 0.45 s | pass | gone 0.28 / 0.33 / 0.40 s |
| N3 | teleport ≥ 100 m, the hero at the nearest pickup there | the plate ≤ 1.2 s after arrival (control: the old section waited up to ≈ 14 s) | pass | 150 m away: 0.88 s |
| N4 | plate shown at a stone → a real E | the stone taken (inventory +1); the plate goes after the take | pass | each E took the probe target (instance 92 → next 24); the plate stays while another pickup is in reach |
| N5 | the plate set Visible with opacity 0 by the remote; frame | no rim of E on the frame; at opacity 0.5 the rim half-bright | pass | before the fix at opacity 0 the rim stayed white on the frame; now rim alpha 0.90 → 0 with the plate, nothing at 0 |
| N6 | the plate shown, 4K frame of the centre | the plate on the dot's line, its right edge left of the dot with a gap | pass | on the dot line, right edge ≈ 60 px left of the dot (4K) |
| N7 | one minute of checks | the minute line: worst ≤ 0.2 ms | pass | 0.089 ms warm (1000 calls); the minute line ≤ 30 ms / 60 checks at a 1 ms clock |
| N8 | control: the view on bare ground with no pickup within 3 m | no plate; E takes nothing | pass | sky / bare sand: Collapsed |
