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

## Plan 52 — the post-process look `ABP_KrinikFirstPersonLook` on the hero only (added 2026-11-14 22:41 +03:00)

Basis: `plans/52_conan_first_person_body_look.md` acceptance C1–C5 (`[OWNER]` 2026-11-13 15:25 «A — тело видно, сделано по-индустриальному.» · 15:29 «и без анимаций
и поз корректных нет смысла смотреть это. чини»). The class lives in the archery pak (3.1.0 kit re-cook 2026-11-14 00:4x); until step 3's Lua exists the remote
`_config/fp-look-pp.lua` sets it on the hero and drives `Active`. Dimensions: the view (third · first) × the weapon (bow held · drawn · sword · bare hands) × the
pitch (0 · −55 · −80 · +80) × `Active` (on · off) × who (the hero · NPCs / thralls in view). Left out: the female hero's child class (a separate row when her save is
used), riding, swimming. Stand: as above (the oasis, background path, stand keeper, the crafted bow 51401 wielded by a real «3» on a FREE PC, the idle orbit off by
`EnableVanityCameraMode(false)`); the angle by `fp-bow-angle.lua`; frames `capture-window.ps1 -Width 3840` → WebP; `ConanSandbox.log` read for anim errors after
every class set.

| # | Situation | Action | Expected (observable) | Status |
|---|---|---|---|---|
| C1a | Third person, the PP class set, `Active` on | a frame + `ConanSandbox.log` | the pose as vanilla (no bind pose, no bend); no «inconsistent folded node data», no new anim lines | **pass** 2026-11-14 22:45 — the heroine (`AB_human_female_C`, a CHILD of the hero anim BP — the T-pose class of 2026-11-13), class set, `Active` off: the third-person frame equals the frame before the set (`.work/fp52/c1a_tp_*.jpg`); `ConanSandbox.log` 0 anim lines at 22:45 and again 23:02 after every set / remove |
| C1b | First person, bare hands and a sword, `Active` off, pitch −55 | a frame each | the same as without the class | **partial** 22:53 — bare hands: the same frame and angle with the class (`Active` off) and without (49° / 50°); the sword — not run |
| C2a | First person, the bow held, not drawn, `Active` on at full `Alpha`, pitch −55 | a frame + the angle | the chest, the arms and the bow in the lower frame; the bow hand angle < the half view (37.5°) | **pass, look open** 22:59 — vanilla 77° (sand only) · the build values A (neck 0.5, spine 0.85) 37° — a bow limb at the lower-left edge · B (neck 1.0, spine 1.0) 31° — the bow and the hand on its grip at the bottom, partly under the quick bar; which look — the owner's eye (frames `.work/fp52/{V,A,B}_m55.jpg`) |
| C2b | The same at pitch −80 | a frame + the angle | the bow and the hands in the frame; the camera ahead of `b_head` (the gauge «camera ahead» > `b_head` ahead) | **pass** 22:59 — B 11°: the bow held across, the gripping hand and both forearms fill the lower half (`B_m80.jpg`); A 18°; vanilla 76°. The gauge «camera ahead > b_head» cannot tell them apart: the eye offset moves `b_head` itself (the sweep in plan 52) |
| C2c | The same at pitch +80 | a frame | clean sky — no shoulder or neck from inside (the owner's 2026-11-13 16:08 frame) | **pass** 22:59 — B and vanilla at +80: rock and sky, no shoulder or neck from inside (`B_p80.jpg`, `V_p80.jpg`) |
| S3a | Step 3 Lua (KrinikConanArchery «вид тела от первого лица»): first person, the bow taken up by a REAL «3» | the log + `Active` | the log «взято оружие, тип 3» → «класс поставлен» → «вкл. (взял оружие)»; `Active` true | **pass** 2026-11-14 23:16 (after a fix: the first build read the bow's socket 100 ms after the event — still in the hand on «убрал», `Active` stayed true at 23:12; now the event decides) |
| S3b | The same, the bow put away by a REAL «3» | `Active` | false at once | **pass** 2026-11-14 23:22 +03:00 — after the real «3» the bow sits on `sheath_bow`, `Active` false, `Alpha` 0.00 (23:16 and 23:20 refused by the input tool, exit 5 — the owner at the keyboard) |
| S3e | The REWORKED step-3 Lua (judge round 1: a `do … end` block, decisions on the next game-thread step, the draw from `isAttacking`, state reset at hero birth, a socket re-read 1.5 s after each equip event), clean stand after a reload | the log + `Active` | first person → on; a real RMB draw → off with `isAttacking` true, on after the release; a real key equip logs the archetype | **pass** 2026-11-14 23:52 (log «вкл. (первое лицо)» → «выкл. (натяжение)» → «вкл. (конец натяжения)»; the equip line «тип 3» at 23:48 for a bow, «тип 0» for fists). The first rework HUNG the game at the first-person switch (23:41: the class set synchronously inside the `SwitchToFirstPersonCamera` hook) — fixed by deferring; the put-away by a real key NOT re-run on this build (after the reload the hot-bar keys 3 / 4 did not toggle the equipped bow) |
| S3f | Judge round 2 fixes (no class set inside `update`, state keyed by the hero, the section switch honoured, hook errors logged) | the log + state | world entry in third person — no class; first person — class set + on; third person — off; 0 anim log lines | **pass** 2026-11-15 00:14 (log «класс поставлен» → «вкл. (первое лицо)» → «выкл. (третье лицо)»; game responding). Deferred from round 2: a climb case (L4), the first switch mid-action (L5), hot reload (L8), co-op (L9) |
| S3d | The view switched by the remote with the bow in hand: third person, then first | `Active` | false in third person, true in first | **pass** 2026-11-14 23:21 (`SwitchToThirdPersonCamera` → false / 0.00; `SwitchToFirstPersonCamera` → true / 1.00) |
| S3c | The view switched to first person with the bow already in hand (world entry from a save, no equip event) | `Active` | true via the camera hook; the class set on the first «on» | **pass** 2026-11-14 23:12 (log «вкл. (первое лицо)») |
| C3 | The bow drawn (RMB) with `Active` on | a frame at ≈ 2 s of the hold, then 1 s after the release | the draw aims with the view (full vanilla bend); back to C2a after the release without a snap | **pass** 2026-11-14 23:20 (step 3 Lua, a REAL RMB hold 2.6 s by `mouse-seq.ps1`): 2.3 s into the draw `Active` false, `Alpha` 0.00 (our layer fully out — the vanilla pose); 1.5 s after the release `Active` true, `Alpha` 1.00 (the blend is the ABP's own `BlendSpeed`); a mid-draw frame was not taken |
| C4 | NPCs / thralls in view while the hero's class is set | a frame + the log | no bind pose on anyone; the log as in C1a | **pass by state** 2026-11-15 00:05 (reworked Lua, stand keeper OFF so the NPCs live): of 46 loaded `BaseNPC_C` (1 within 50 m) NONE carries `ABP_KrinikFirstPersonLook_C` as its post-process instance; the hero carries it, `Active` true; `ConanSandbox.log` 0 anim lines; the game responding. A frame of an NPC was not taken |
| C5 | Cost: first person, the bow, 60 s still scene, A-B (class set · removed by `off_pp`) | PresentMon `MsCPUBusy` median, game in front | no worse than noise (HOUSE_RULES rule 7) | not run |

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
