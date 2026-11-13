# Bug 95 — Conan: in the first-person view the bow is not visible in the hero's hands

**Status:** 🔴 OPEN — filed 2026-11-13 11:02 · **Severity:** S2 (the owner's play, the archery he named important) · **Version/build:** Conan Exiles 3.0.1 build,
KrinikConanLocomotion build 7, KrinikConanArchery / KrinikConanCamera as shipped · **When/context:** the owner's message 2026-11-13 11:01 after his own play of the
bow sprint · **Fixing:** the next session (this one closes near the context limit)

## Goal vector

Achieve: in the first-person view the drawn bow and the arrow are seen in the hero's hands as in vanilla. Acceptance: a first-person frame with the bow drawn shows the
bow; the same frame with our first-person camera edits off (control) — the difference names the cause.

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-13 11:01 «спринт и стрельба работают» · «Есть проблемка с видом от первого лица - не видно лука в руках».
**Clarified** `[OWNER]` 2026-11-13 12:59 «по ПКМ лук появляется, но он должен быть виден внизу, ели голову опустить.» · «В виде от третьего лица видно, что герой держит лук
наготове внизу» — the defect is the HELD bow (the ready pose, low in the hands) unseen in first person when the view looks down; the drawn bow on RMB is seen.

## Leads (from the game map, not yet observed for this bug)

- KrinikConanArchery `KrinikArrowAim` moves the first-person camera arm `FirstPersonCameraArm` (`fp_hip_offset` Z 11) to cancel the shot pose's 10–11 cm head drop, and
  writes its own first-person field of view (`fp_aim_fov_scale`) — game map lines 438, 578–580.
- The numbers (`KrinikConanArchery/ue4ss/Scripts/main.lua:74–85`, read 2026-11-13): `fp_aim_offset` X −5, Y 16, Z 6 (RMB aim; `[OWNER]` 2026-10-27 «камеру нужно
  помещать над стрелой» · «левее»), `fp_hip_offset` X −5, Y 24, Z 11 (a draw without RMB; `[OWNER]` 2026-10-28 «может в обычной стрельбе нужно сильнее правее двигать»,
  Y 24 an `[AI]` number «до первого взгляда владельца»); measured pose: the bow 82 forward, 22 right, 15 DOWN from the camera — the camera raised by 6–11 plus the aim's
  narrower field of view may push the bow under the frame's lower edge. Hypothesis — frames with the shift and without it decide.
- First person in combat is the game's `AllowFirstPersonCamera` / `AllowFirstPersonCameraInCombat` (pack reference: True since 2026-10-26).
- The camera mod KrinikConanCamera (its first-person settings) — read its notes first.

## Forensics

- 2026-11-13 12:57 (background path, the owner's save, crafted bow 51401 in hand, first person by `SwitchToFirstPersonCamera()`, open beach, pitch −5): with the bow
  only HELD, the frame shows no bow and no hands; FOV 107.5; `FirstPersonCameraArm.SocketOffset` 0 0 0 — our shift is not applied outside a draw, so the held-pose
  frame is the vanilla first person (TC `TC_conan_fp_bow_visible_2026-11-13.md` V1). Next: V2–V4 (the draw, with and without our shift) — need a real RMB, PC free.
- 2026-11-13 13:0x — **why the held bow never enters the first-person frame** (remote `b95c.lua`, first person, the idle orbit stopped by
  `GUIModuleController:EnableVanityCameraMode(false)` — without it the idle camera orbits after ≈ 30 s and every reading is void). The body in the hero's frame
  (cm from the actor origin, «ahead» along the facing):

  | view pitch | camera = `b_head` (ahead / up) | bow hand `b_L_prop` (ahead / up) | the bow hand off the view centre |
  |---|---|---|---|
  | 0 | 14 / 69 | 39 / −12 | 73° |
  | −30 | 37 / 58 | 12 / −25 | 77° |
  | −55 | 51 / 43 | −12 / −24 | 78° |
  | −80 | 57 / 26 | −33 / −13 | 77° |

  The half vertical view at FOV 107.5 is 37.5°. The upper body pitches WITH the view as one rigid piece (`b_spine_3` stays at 2 / 31 — the bend is above it): the head
  goes forward over the hands and the hands swing back, so the bow keeps one place in the camera's frame ≈ 75° below the centre — out of the frame at every pitch
  (frames −55, −80: sand only; −89: knees and feet, no hands). Not ours: `KrinikConanCamera` hides `b_neck_1` (head and neck only — `b_L_clavicle`'s parent is
  `b_spine_3`; unhidden → the same frame at −70); `KrinikConanArchery`'s arm shift is 0 outside a draw. The body mesh `CharacterMesh0` is invisible in first person
  (the visible body is `MergedLodMesh` and its batched followers). A camera move that would bring the bow into view: ≈ 68 cm back at −55, or ≈ 75 cm down —
  inside or behind the body; so the way is the pose (the first-person aim offset of the upper body), not the camera.
- Existing mods (web, 2026-11-13 13:1x, two searches): none for Conan Exiles that shows the held weapon in first person; a 2018 Steam thread says the game's first
  person shows no weapons in general (steamcommunity.com/app/440900/discussions/0/1694922526913807608). Sheathed-weapon mods (Wonderbody, IQoL) are another feature.

**DECIDED 2026-11-13 13:20 — option B:** `[OWNER]` «Б (советую). Пока лук в руках и не натянут, верх тела не наклоняется, наклоняется только взгляд. Тогда, опустив
голову, вы увидите грудь, руки и лук, как они видны со стороны. Правка в анимации героя через кит; сначала разведка анимации.» Next: recon of the hero's anim
blueprint (where the first-person view pitch bends the upper body), then the kit edit.

## Recon of the anim blueprint (2026-11-13 13:2x, kit 3.0.1 `F:/CEUE5Devkit/UE4/Content/Master_AnimBP/AB_human_male.uasset`, 18.5 MB, editor graphs present)

- Read by `uaj tojson … VER_UE5_6` (names, exports) + `uaj func … ExecuteUbergraph_AB_human_male` → `_config/devkit/kpseudo.py` (2 025 lines). The hero's update
  (ubergraph statements 1171–1221): third person — `AdjustForLookingUpAndDownThirdPerson` = `MakeRotator(Roll = −Pitch) × 0.15`; first person —
  `AdjustForLookingUpAndDownFirstPersonAgressive` = `MakeRotator(Roll = −Pitch)` (the FULL view pitch) and `AdjustForLookingUpAndDownFirstPersonPassive` =
  Aggressive × 0.15; `FirstPersonPelvisHeight` = (0, −8, 100) standing, (0, −12, 100 − crouched half height) crouched.
- The AnimGraph reads them through property access (`AnimBlueprintExtension_PropertyAccess_0`) and keeps two cached poses `FirstPersonPosePassive`
  (`AnimGraphNode_SaveCachedPose_83`) and `FirstPersonPoseNotPassive` (`_64`). Working reading: the bow held = the combat («not passive») pose with the FULL bend —
  the measured rigid upper body; option B = the passive 15 % share while the bow is held and not drawn (the draw keeps the full bend — the aim follows the view).
- **The AnimGraph, read 2026-11-13 14:17** (kit probe `_config/devkit/kit-probe-ab-fp-look.py` run 2, report `kit-probe-ab-fp-look.json`; run 1 at 13:28 died on a
  deprecated property of `AnimNode_BlendListByBool` turned into an exception — every read is guarded now):
  - NotPassive chain: Local→Component → `Transform (Modify) Bone b_spine_3`, Rotation = `…FirstPersonAgressive` (the full pitch) → `b_L_upperarm` translation
    (−5.3, 0.1, −19.2) → `b_R_upperarm` → … → `Save cached pose FirstPersonPoseNotPassive`.
  - Passive chain: Local→Component → `b_spine_3`, Rotation = `…FirstPersonPassive` (15 %) → `b_neck_1`, Rotation = the same 15 % → `b_head`, Translation =
    `HeadFOVAdjustments` → Component→Local → `Save cached pose FirstPersonPosePassive`.
  - The selector: `Blend Poses by bool`, `bActiveValue` = `Get isPassive` (True → the Passive pose), then `isSwimming` and `isThirdPerson` blends above it.
  - `isPassive` / `isAggressive` / `isAttacking` are written by the combat component (`CombatBP->UpdateVarsFromConanCharacter`), not computed in the anim blueprint.
- **The game's own bow test** (`BaseBPCombat::EvaluateMovement_RangeCombat`, `uaj func` + `kpseudo.py`, 14:2x): `RangedCombat = IsAttacking AND
  GetWeaponItemActive()->GetWeaponArcheType() == 3` — 3 = `WeaponArcheTypes::TwoHanded_Ranged` (`/Script/ConanSandbox.WeaponArcheTypes`); a bow draw is an attack.
  In the anim blueprint: `GetWeaponItemPrimary(CombatBP)` is a native function of its parent `AnimInstanceHumanMalePlayer`, `GetWeaponArcheType` a native one of
  `GameItem`. `HandleHeldBow` (the same class) only drives the draw montage's sections — no flag there.
- **No overlap:** `AB_human_male` is in the vanilla `pakchunk0` only among the build's 107 containers (`retoc list --path`, 14:2x) — no mod of the build overrides it.
- **The edit (FORK: options <the selector's pin logic in the AnimGraph | a member bool set in the EventGraph> · price of error <a per-frame cost on every human NPC
  (the EventGraph runs for all) vs one off-fast-path pin for the first-person player only> · consulted <own reasoning; the price is small and measured by case B9 —
  decided on the spot by the fourth door's small-price clause>):** `bActiveValue = isPassive OR (GetWeaponArcheType(GetWeaponItemPrimary(CombatBP)) == 3 AND NOT
  isAttacking)` — `_config/devkit/kit-ab-fp-upright.py`, saved into `KrinikConanArchery` (its `Local/CookInfo.ini` gets the `AB_human_male` line). Cases B1–B9 in the TC.
  **On the move to 3.1.0 the edit is re-run on the new kit** — the override is a whole copy of the hero's anim blueprint.
- **The kit runs of the edit (2026-11-13 14:31–15:0x; every run stops before the save, reports `_config/devkit/kit-ab-fp-upright.run*.json` / `.bis_*.json`):**
  1. 14:31 — the condition as pure nodes on the selector's AnimGraph pin: all 10 links made, compile False, no `LogBlueprint` error line, no new node mark.
  2. 14:35 — control: the UNTOUCHED vanilla asset compiles True in this kit (two old warnings: looping animations under automatic transition rules).
  3. 14:39 — control: the same pin rewiring with thread-safe math only (`isPassive OR NOT isAttacking`) compiles True; `use_multi_threaded_animation_update` True.
  4. 14:44 — the condition moved to the EventGraph (a member `KrinikFirstPersonUpright` set at the head of `BlueprintUpdateAnimation` behind
     `Branch(isThirdPerson OR isNPC)`; the pin reads the member): 21 links made, compile False — so not thread safety alone.
  5. Bisection of 4: v1 (no game functions) True · v2 (+ `GetWeaponItemPrimary`, the item into `IsValid`) True · v3 (+ `GetWeaponArcheType` → `EqualEqual_ByteByte`
     with 3) False. The game itself calls `GetWeaponItemPrimary` in its EventGraph exactly so (`Character` ← `CombatBP`, `self` empty).
  So the failing piece is the `GetWeaponArcheType` call or its enum into a byte pin — split next: v3a (the call, output unused) · v3b (the enum → `Conv_ByteToInt` →
  `EqualEqual_IntInt`). **v3a True (15:0x)** — the call compiles; the failure is the enum output wired into the byte pin of `EqualEqual_ByteByte` (the Python link
  says True, the compiler refuses silently).
- **The owner's question 15:00–15:01** (`[OWNER]` «мне кажется, его отключили в каком-то из наших модов, потому что взглыд упирался в части тела» · «Отключение, как я
  понимаю, было неправильным слишком простых фиксом» · «а лук и руки не прячет?»): read in the live game 15:0x, first person — `CharacterMesh0` hidden bones
  `b_neck_1`, `b_head`, `b_headcam` (KrinikConanCamera, bug 69: the camera inside the neck looking up); NOT hidden: `b_spine_3`, both clavicles, `b_L_upperarm`, both
  hands, `b_L_prop`, `b_R_prop`; the bow `BP_bow_2h_C` visible (`IsVisible` true, no owner-no-see). The bow is drawn but out of the frame by the pose. The two symptoms
  share one root — the full-pitch bend of the upper body in the combat first person (looking up: the camera into the neck; looking down: the hands behind the
  camera); a case after option B: the neck un-hidden in the upright pose looking up — if the camera stays clear, the bug-69 crutch goes (HOUSE_RULES rule 24).

- **BUILT and seen 2026-11-13 15:07–15:17:** the edit saved (compile True, marks unchanged), the archery pak 220 KB → 9.1 MB (`AB_human_male` cooked for both platforms),
  deployed 15:14: `KrinikFirstPersonUpright` true with the bow held and not drawn; the bow hand 34° off the centre at −55 and 9° at −80 (vanilla 78° / 77°); looking up with
  the neck un-hidden — clean sky. TC B1–B3, B10 pass; B4 (the draw) waits for a free PC.
- **The owner's remarks on the look 15:19–15:22** (`[OWNER]` «у тебя камера прямо вниз смотрит из центра головы - так не бывает в реальности» · «глаза всегда чуть
  вынесены вперёд от наклонившейся вниз головы.» · «Поищи в интернетте, как такое делают в индустрии.» · «можно нахуй тело не рисовать, если так проще. только руки и
  лук в руках, например, или руки и мечь в руках» · «в общем - руки и оружие, если так проще»): recon `researches/first-person-body-camera/README.md` (the camera at the
  eyes, the pitch spread spine → neck → head); the two ways A (the body, the industry way) and B (arms and weapon only — experiment 15:23, forearms cut at the elbow)
  shown in review folder 84; **the owner picked A 15:25** (`[OWNER]` «A — тело видно, сделано по-индустриальному.» · «покажи»).
- **T-POSE — the edit broke the hero, ROLLED BACK 15:27** (`[OWNER]` 15:26 «а почему герой в т позе стоит? это ты считаешь достойным для моего отсмотра?» · «а не
  беру!»): the heroine's anim instance is `AB_human_female_C` — a CHILD of `AB_human_male`; overriding the parent alone leaves every child's cooked data stale —
  `ConanSandbox.log`: «Anim BP 'AB_human_werewolf_C' has inconsistent folded node data at node 519 (AnimNode_RotationMultiplier): expected 19 entries but cooked data has 6.
  This usually means a parent/root anim BP was over[ridden]…»; the hero stood in the bind pose (frame `tpose_check`). Missed by the agent: after the deploy only
  first-person frames were looked at — no third-person frame, no NPC, no log read before the show. The archery pak is back to the 2026-11-02 build (220 KB).
  A parent anim BP override must ship with every child anim BP re-cooked against it (or the edit goes into the child the hero uses).
- **How to show** (`[OWNER]` 15:28 «не понимаю, что смотреть в этой папке, что ты открыл. Отвратительно» · «хочешь что-то такое показать и пояснить - HTML страницей с
  подписями») — HOUSE_RULES rule 32.

## Options (the owner's choice — the look of first person)

- A. Keep the game's first person: the bow is seen on the RMB draw only (as now) — the bug closes as the game's design.
- B. `[AI]` recommended: in first person with a bow held and not drawn, the upper body stays upright and only the view pitches — looking down shows the chest,
  the arms and the bow as the third person shows them. Native: the hero's anim blueprint first-person aim offset (a kit edit, recon of the AnimBP first).
- C. A separate bow model fixed in the lower frame corner (a «viewmodel» of classic shooters) — not the body's own bow; a new visual element.

## Plan

1. Read `games/ConanExiles/mods/KrinikConanArchery.md` and `KrinikConanCamera.md` (first-person parts).
2. Stand: the honest bow stand (game map «Stand gear»: the hero crafts bow 51401), first person by `SwitchToFirstPersonCamera()`.
3. Frames: first person, bow drawn — with our first-person edits on, then off (control); vanilla first person without our Lua.
4. Fix at the cause (HOUSE_RULES rule 24), cases in a TC, frames for the owner.

## Decisions made without the owner

- none yet

## Links

bug 93 (the bow sprint) · game map «Лук и камера» · `testcases/reports/2026-11-13_conan-bow-sprint-sprint-then-draw.md`
