# TC — Conan: the bow in the hero's hands in the first-person view (bug 95)

> **Created:** 2026-11-13 · **Parent:** `bugs/95_conan_first_person_bow_not_visible.md` · **Status:** written 2026-11-13 12:56 +03:00, not run yet
> **Outbound:** —

## Test basis

`[OWNER]` 2026-11-13 11:01 «Есть проблемка с видом от первого лица - не видно лука в руках». The expectation: in first person the bow the hero holds or draws is seen in the
frame, as in the game without our camera edits. KrinikConanArchery shifts the first-person camera arm during a draw (`fp_aim_offset` −5 / 16 / 6 with RMB,
`fp_hip_offset` −5 / 24 / 11 without), and narrows the view on the aim.

## Dimensions

- State: bow held (no draw) · draw without RMB (hip) · RMB aim with the draw.
- Our first-person shift: on (as shipped) · off (control — the arm's `SocketOffset` zeroed by the remote while the draw holds).
- Left out: other weapons; third person (not reported).

## Stand

The oasis of the owner's save `Game_1`, background path; the crafted bow 51401 on hot-bar slot 3 in the hero's hands; stand keeper on (god, NPCs within 600 m
killed every 20 s); first person by `hero:SwitchToFirstPersonCamera()`; the view level on open ground; real RMB only when `owner-idle.ps1` says FREE; frames by
`capture-window.ps1 -Width 1600` taken while the draw holds (a parallel capture during `mouse-seq.ps1`).

## Cases

| # | Situation | Action | Expected (observable) | Status |
|---|---|---|---|---|
| V1 | First person, bow held, no draw | a frame | the bow (or the hands with it) in the frame — or not: the vanilla baseline of the held pose | **seen** 12:57 — no bow and no hands in the frame (open beach, pitch −5, FOV 107.5, arm offset 0 0 0 — our shift is off outside a draw); frame `b95_v1_held` |
| V2 | First person, RMB aim + draw (our shift on) | a frame at ≈ 2 s of the hold | the bow seen in the frame | not run |
| V3 | The same, the arm's offset zeroed by the remote (control) | a frame | the difference with V2 names whether our shift hides the bow | not run |
| V4 | First person, a draw without RMB (hip, our shift on) | a frame | the bow seen | not run |

## Option B — the upright upper body while the bow is held and not drawn (added 2026-11-13 14:3x, the kit edit `_config/devkit/kit-ab-fp-upright.py`)

> **VOID 2026-11-13 15:27:** the build these rows ran on (the `AB_human_male` override) stood the heroine in the bind pose — the owner saw it 15:26; rolled back. The
> «pass» marks below are observations of a broken build and do not count; the cases are re-run on plan 52's post-process route, plus C1 (no pose change anywhere).

Basis: `[OWNER]` 2026-11-13 13:20 (option B, verbatim in bug 95). The edit switches the first-person pose selector of `AB_human_male` to the peaceful pose when
the main weapon's archetype is 3 (a bow) and the hero is not attacking (a draw is an attack). Dimensions: the weapon (bow · melee · bare hands) × the state (held · drawn
or swinging) × the view pitch (0 · −55 · −80) × the build (ours · control without the archery pak). Left out: riding, swimming, crouching with the bow (to add if
the owner plays them), the female hero (the same asset). Stand: as above, plus `GUIModuleController:EnableVanityCameraMode(false)` (the idle orbit void readings —
bug 95 forensics); frames by `capture-window.ps1 -Width 3840`, WebP.

| # | Situation | Action | Expected (observable) | Status |
|---|---|---|---|---|
| B1 | First person, the bow held, no draw, pitch −55 | a frame | the chest, the arms and the bow in the lower half of the frame (vanilla: sand only, frame `b95_pitch_*`) | **pass** 15:16 (pak with the edit deployed 15:14, a real «3» wields the bow): flags `isPassive` false · `isAttacking` false · `KrinikFirstPersonUpright` true; `fp-bow-angle.lua` — the bow hand 34° off the centre vs half view 37.5° (vanilla 78°); frame `b1_bow_m55`: the chest, the clothing and the bow's limb on the left |
| B2 | The same at pitch −80 | a frame | the bow and the hands in the frame; the head does not dive forward over the hands | **pass** 15:17 — the bow hand 9° off the centre (vanilla 77°); frame `b_bow_p-80`: the chest from above fills the lower two thirds, the bow on the left — the look is the owner's taste |
| B3 | The same at pitch 0 | a frame | the view as before the edit (no bow expected at a level view — the bow hangs low) | **pass** 15:17 — the bow hand 89° off the centre (out of the frame, as expected at a level view); frame `b_bow_p0` |
| B4 | The bow held, RMB draw at pitch −30 | a frame at ≈ 2 s of the hold | the aim follows the view as in vanilla (the drawn bow and the arrow seen, the full bend) | not run |
| B5 | The draw released (the shot), the bow still held | 1 s after the shot | the body back upright; no stuck bend | not run |
| B6 | A melee weapon (sword) held, no swing, pitch −55 | a frame | unchanged against vanilla (the combat pose — the edit is the bow's only) | not run |
| B7 | Bare hands, pitch −55 | a frame + `UE4SS.log` / `ConanSandbox.log` | unchanged; no new log lines | not run |
| B8 | Control: the build without `KrinikConanArchery.pak` | B1 again | the vanilla frame (sand) — proves the edit makes the difference | not run |
| B9 | Cost: first person with the bow, 60 s still scene, A-B (with / without the pak) | PresentMon `MsCPUBusy` median | no worse than noise (HOUSE_RULES rule 7) | not run |
| B10 | The neck un-hidden by the remote (`Mesh:UnHideBoneByName('b_neck_1')`), first person, pitch +80 — bow held (upright pose), bare hands, a sword | a frame each | whether the camera still sinks into the neck in each stance: clear in all → the bug-69 crutch (KrinikConanCamera neck hiding) goes; skin in some → it stays for those | **baseline before the edit 15:03–15:04** (vanilla pose, the neck un-hidden by the remote, open beach, pitch +89): bow held (`isPassive` false — the combat pose) — the left half of the frame is skin (frame `b10_bow_up89`, bug 69 reproduced); bare hands (the bow on `sheath_bow` by a real «3», `isPassive` true — the peaceful pose) — clean sky (frame `b10_bare_up89`). The neck clipping belongs to the combat pose's full bend — the same root as the hidden bow. **After the edit 15:17:** the bow held (`KrinikFirstPersonUpright` true), the neck un-hidden, pitch +89 — clean sky (frame `b10_after_bow_up89`); a sword — owed (no sword at the stand) |
