# Test cases — the mouse wheel in the bow aim chooses arrows, not the camera distance (bug 78)

**Created:** 2026-11-02 · **Under test:** (1) the build's Russian translation — Arrow Quick Swap's service string «None» (key `D71D7D204737C8044CCD97BC0B6B9301`)
kept untranslated, so the mod's `CheckCustomBindings` binds `CycleArrow_UP/DOWN` to the wheel; (2) KrinikConanCamera — the game's zoom step `CameraZoomAmount`
held at 0 while the hero aims (the AQS flag `AllowShowingUI`, read in its `UpdateDisplayUI`) · **Version/build:** pack ConanExiles after `40db56d` (this change)
**Test basis:** `[OWNER]` 2026-11-02 14:22–14:23 «а как выбирать стрелы при натяжении?» · (the wheel in the aim) · «зум камеры меняется»; the AQS bytecode
(`ArrowQuickSwap.md`): the wheel axis event is empty, arrows cycle by the actions `CycleArrow_UP/DOWN`, which `CheckCustomBindings` maps to `MouseScrollUp/Down`
only when `Key_GetDisplayName(first key) == "None"` (a localizable text — our «Нет» broke it).

## 1. Goal vector

Achieve: in the bow aim each wheel click changes the arrow kind and leaves the camera where it is; out of the aim the wheel zooms as before.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHEN the game has loaded the world, the input settings shall hold `CycleArrow_UP=MouseScrollUp` and `CycleArrow_DOWN=MouseScrollDown` | remote read of `Default__InputSettings.ActionMappings` · both rows |
| R2 | WHILE the hero aims a bow with ≥ 2 arrow kinds, a wheel click shall change `ActiveAmmo` | the AQS component's `ActiveAmmo` · in-game recorder · changes on each click |
| R3 | WHILE the hero aims, a wheel click shall leave the camera distance unchanged | `ThirdPersonSpringArm.TargetArmLength` · recorder · Δ = 0 |
| R4 | WHILE the hero does not aim, a wheel click shall change the camera distance as before | recorder · Δ ≠ 0 |
| R5 | The translation file shall change exactly that one entry | `locres-regress.py` · «пропало 0, изменилось 1» |

## 3. Coverage matrix

Partitions: aiming / not aiming; arrow kinds 3 (the stand: bone, iron, + one); wheel down. Not covered: gamepad shoulder buttons (AQS's own path), first
person aim, a player who rebinds `CycleArrow_*` in the game's keys menu (AQS then keeps his key — its own design).

## 4. Stand

The oasis save, noon, `quiet-stand.lua`, god on; the bow in hand (`BP_bow_2h_C@Socket_Bow`); iron arrows by `exec MakeMeAdmin` + `exec SpawnItem 53612 10`
(the save holds bone arrows). Input — real, `mouse-seq.ps1` in ONE sequence (separate calls release RMB when the foreground is handed back). Recorder —
`aqs_rec.lua` (session scratchpad): `AllowShowingUI`, `ActiveAmmo`, arm length, target, zoom step every 100 ms.

## 5. Cases

| ID | Steps | Expected | Status | Observed |
|---|---|---|---|---|
| W0 | before the fix: aim + two wheel clicks (repro) | arm changes, ammo stays | pass (reproduced) | aim: arm 273 → 299 → 329 → 294, ammo 51184 throughout |
| W1 | after the fix, world loaded: read the action mappings | both `CycleArrow_*` rows on the wheel keys | pass | CycleArrow_UP=MouseScrollUp, CycleArrow_UP=Gamepad_DPad_Up, CycleArrow_DOWN=MouseScrollDown — added by AQS itself |
| W2 | aim + wheel down ×2 + wheel up ×1, recorder on | `ActiveAmmo` changes on every click; arm constant | pass | ammo 51184 → 53612 → 51184; arm 230, step 0 |
| W3 | no aim + wheel down ×1 | arm changes by one zoom step | pass | arm 230 → 250, step back to 20–23 |
| W4 | the regress of `Game.locres` | 54457 → 54457, lost 0, changed 1 | pass | 54457 → 54457, lost 0, changed 1 |
| W5 | (found in W2: wheel UP never changed the arrow — `CurrentAmmo` [51184, 51184, 53612], one row per STACK) after `one_row_per_kind`: aim + wheel up ×3, recorder | `ActiveAmmo` changes on every up click; the Archery log «стопок 3, видов 2» | pass | 6 stacks: «стопок 6, видов 2»; up ×3 changes the arrow each click |
| W6 | the list frame in the aim after a wheel click (4K crop right of the crosshair) | one row per arrow kind, no second bone row | pass | 6 rows (3 per kind, the wrap ring) instead of 18; frame «Железная · Костяная · Железная» |
