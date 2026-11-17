# Bug 104 — Conan: in the bow aim (RMB), starting to move shifts the right hand with the arrow off the string to the right

**Status:** 🟡 the cause found 2026-11-17 06:15 — the game's own moving-aim pose (control with our mods out); the owner's choice asked on a page 06:2x · filed 2026-11-16 18:41 +03:00 · **Severity:** S2 (the owner's play of the archery he named important) · **Version/build:** Conan Exiles Enhanced 3.1.0 with the
Krinik build (KrinikConanArchery, KrinikConanLocomotion, KrinikConanCamera) · **When/context:** the owner's word after his play of 2026-11-16 18:31–18:40 (look B) ·
**Fixing:** this session — recon first (whose pose moves the hand: the game's moving-aim blend or ours), then the fix at the source (HOUSE_RULES rule 24)

## Goal vector

Achieve: while the hero holds the bow in the aim (RMB) and starts or keeps moving, the right hand holding the arrow stays on the string and against the bow — the
same hand position as when standing. Acceptance: frames of the aim standing and moving (W, A, D, S) from the same camera — the right hand and the arrow nock on the
string in every frame; a control case with our archery / locomotion / first-person parts off names who moves the hand.

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-16 18:40 «по луку и нашим модам передвижения и лука нужно будет всё же две проблемы исправить:» · «1) В прикладке по ПКМ, если начать двигаться - то
правая рука, удерживающая стрелу, в модельке героя сдвигается правее - изза чего рука вместо со срелой уходит с тетивы и тела лукаправо всторону - нужно пофиксить,
чтобы правая рука оставалась неподвижной при начале движения, е сдвигалась правее - это изменение анимации и стойки героя, как я понимаю»

## Repro (to confirm)

Bow in hand → RMB held (the draw, the aim camera) → W (or A / D) → the right hand with the arrow moves right, off the string. Real input (a held RMB) — the remote's
RMB is a tap (bug 93, `sprint-bow-sample.lua` header); a FREE PC and the game in front (HOUSE_RULES rule 30), or the owner's frame.

## First frames 2026-11-17 05:48 (inconclusive)

Cases written — `testcases/TC_conan_bow_aim_hand_2026-11-17.md` (H1 standing, H2–H5 moving W / A / D / S, H6 sprinting, H7 / H8 controls with Archery / Locomotion out).
A first try (third person, the default camera behind the hero, two frames 1920 wide, deleted after the side frames replaced them): the bow and the right hand are seen
from behind at ≈ 1/6 of the frame height — too small to tell the hand on the string from off it, and the «standing» frame fell inside the draw (taken 1.4 s
after RMB, the full hold comes ≈ 0.55 s + the draw). NEXT: a close side camera on the hero's right shoulder (the camera remote / `fixed-cam.lua` at ≈ 1.2 m, the
bow arm in frame), frames only in the FULL hold (substates 11,15,16 read by the 15 ms recorder at the frame's moment), standing vs walking in one sequence.

**Side frames 2026-11-17 06:11** (a fixed camera 2.3 m to the hero's right and 1.7 m ahead, chest height, `fixed-cam.lua`; RMB held 3.2 s then W 2.4 s; frames
`НА ОТСМОТР НИКОЛАЕМ/89_ruka_na_tetive_na_hodu/s1_stand.webp` — 2.4 s, the full hold standing; `s2_walk.webp` — ≈ 1 s into W): standing, the right hand pulls the string to the chin, the
nock at the hand; walking, the right hand sits further FORWARD, in front of the face, the draw visibly shorter, the string still meeting the hand at the nock
as far as the frame shows. Whether this is the owner's «уходит с тетивы и тела лука вправо» is NOT settled — the fixed camera's angle to the hero changes as she
walks, and from the game camera (behind, zoomed in by 3 wheel notches) the hotbar covered the hand and the view turned to the rock. NEXT: (1) the H7 / H8 control
(vanilla vs ours — if vanilla shortens the draw the same way, it is the game's moving-aim animation); (2) a camera that follows the hero (re-placed relative to
her before each frame, or the game camera with the HUD hidden) for a same-angle pair; (3) the pair to the owner on one HTML page («это тот сдвиг?»).

**Control 2026-11-17 06:15 — the game's own animation (H7 + H8 together):** KrinikConanArchery and KrinikConanLocomotion out of the game copy (`enabled.txt` →
`enabled.txt.control-off`, restored after; UE4SS.log: 0 lines of either), the same stand, the same side camera and the same input: `c1_stand_vanilla.webp`
(standing — the right hand at the chin) and `c2_walk_vanilla.webp` (walking — the right hand forward in front of the face, the draw shorter) show the SAME change
as with our mods (`s1` / `s2`). So the hand's move on walking comes from the game's moving-aim pose (the locomotion blend under the draw), not from our sections
(HOUSE_RULES rule 24: the cause is the game's). A fix is an edit of the game's own animation data — the owner's call (what he wants: the standing draw kept while
walking, or only the hand kept on the string), asked with the four frames on one page. **Shown 2026-11-17 06:2x** — the page `D:/Games/Conan Exiles Mods/НА ОТСМОТР НИКОЛАЕМ/89_ruka_na_tetive_na_hodu/ruka_na_tetive.html` opened for the owner (the four frames; A — the standing draw kept while walking; Б — only the hand and the arrow kept on the string; В — he meant something else). Waits for his answer.

## The owner's answer and the build's road (2026-11-17 10:40 +03:00)

`[OWNER]` 2026-11-17 09:18 (interview #038): A — «Как стоя» (the standing draw kept while walking). Recon by the remote (10:39): the hero's anim class is
`/Game/Master_AnimBP/AB_human_female.AB_human_female_C`, a child of `AB_human_male` (the graph lives there — `ConanExiles/_config/devkit/kit-probe-ab-children.json`);
the draw montage `AM_combat_2h_bow_combo_heavy_c0` (7.05 s) plays in the slots `AttackMontageTorso3rd` / `AttackMontageTorso1st` — a TORSO slot layered over the
locomotion, so walking mixes the locomotion's arm pose into the draw. The cause fix (rule 24) is in that layered blend of `AB_human_male`'s AnimGraph: the bow draw's
arms taken whole from the montage while moving (the branch filter of the torso `LayeredBoneBlend` for the arm chains, or a bow-draw pose branch) — not a bone
correction afterwards. NEXT: read the AnimGraph's torso slot → `LayeredBoneBlend` node and its branch filters by the kit (the node list and graph names are in
`devkit/kit-probe-ab-fp-look.json`, `anim_graph_nodes`; the tool `kit-probe-ab-fp-look.py` already walks `LayeredBoneBlend` / `BlendListBy`), then a kit edit + cook
of the AB into a Krinik pak, A-B frames standing / walking from the side camera (the stand of 06:11). **The place of the edit already exists:** KrinikConanArchery ships a
whole override of `AB_human_male` (bug 95, `ConanExiles/_config/devkit/kit-ab-fp-upright.py` — saved into `Mods/KrinikConanArchery/Content/Master_AnimBP/`, its cook
line in that mod's `Local/CookInfo.ini`; logic only through member bools set in the EventGraph — the AnimGraph runs on worker threads, impure calls there fail the
compile). The walking-draw edit goes into the same override by the same pattern (a member bool «bow drawn while moving» → the torso blend's branch). Cases
`testcases/TC_conan_bow_draw_walking_pose_2026-11-17.md`. The probe `devkit/kit-probe-ab-torso-slot.py` (2026-11-17 10:48) reads the torso slot and every
`LayeredBoneBlend`.
**Probe 1 read 2026-11-17 10:51 +03:00 (`devkit/kit-probe-ab-torso-slot.json`, 492 AnimGraph nodes, 27 LayeredBoneBlend):** the slot `AttackMontageTorso3rd` is saved as the cached pose
`TorsoAttackPose`; a «Blend Poses by bool» takes on one pose `TorsoAttackPose` WHOLE (standing — the full draw, the hand at the chin) and on the other a
LayeredBoneBlend (base `PostEquip…` — the locomotion with the equipped arms; layer `TorsoAttackPose`; mesh-space rotation blend ON) — walking: the legs from the
locomotion, the torso from the draw. That layered branch is where the hand leaves the chin. Probe 2 (`devkit/kit-probe-ab-torso-blend.py`) reads its branch filters
(bones, blend depths) and the bool that picks the branch.
**Probe 2 read 2026-11-17 10:55 +03:00 (`devkit/kit-probe-ab-torso-blend.json`, the 6 LayeredBoneBlends fed by `TorsoAttackPose`):**
- a `Blend Poses by bool` driven by **`isCrouching`** (blend 0.1 s): True → ONE layered blend — base `PostEquipPose`, layer `TorsoAttackPose`, filter `b_spine_1` depth 3,
  weight 1.0, mesh-space rotation — the whole upper body from the draw over the legs; False → another bool blend → the standing / walking chain;
- the walking chain is hand-tuned PARTIAL blends: `TorsoAttackPose` over `PostEquipPose` at `b_pelvis` depth 6 weight 0.7 → `b_pelvis` depth 1 (`b_L_clavicle` −1)
  weight 0.33 → `b_spine_3` depth 1 weight 0.44, then TWO blends that take `b_R_clavicle` / `b_L_clavicle` (depth 2 and depth 1, weight 1.0) BACK from `PostEquipPose`
  — the locomotion's shoulders and upper arms: the right arm follows the walk and the hand leaves the chin (the owner's symptom).
**The build (next):** the pattern of `kit-ab-fp-upright.py` in the same KrinikConanArchery override — a member bool `KrinikBowDrawUpper`; the `isCrouching` selector's
`bActiveValue` reads it; the EventGraph sets it at the head of Update Animation: `isCrouching OR (GetWeaponArcheType(GetWeaponItemPrimary(CombatBP)) == 3 AND
isAttacking)` (the game's own bow test, `Conv_ByteToInt` for the enum — fp-upright runs 4 / v3b). A bow draw then takes the crouch branch's clean upper body while
standing and walking; melee and an empty-handed walk keep the game's chain. Then: cook, the pak, W1–W6 by real RMB (the side camera), the control K1.
**⚠️ STOP found 2026-11-17 10:59 +03:00 — the override is not in the build, and a parent-only override is the bug-95 T-pose:** KrinikConanArchery's kit folder has NO
`Content/Master_AnimBP/` and its `Local/CookInfo.ini` no AB line (bug 95 shipped look B as the post-process `ABP_KrinikFirstPersonLook` instead). `AB_human_male` is the
PARENT of `AB_human_female` (the heroine) and `AB_human_werewolf`; overriding it alone left the children's cooked data stale — the hero in the bind pose (bug 95,
2026-11-14 15:26–15:27, the owner's words there). So the edit script `ConanExiles/_config/devkit/kit-ab-bow-draw-upper.py` (written, NEVER run) refuses to run unless
`KRINIK_AB_WITH_CHILDREN=1`. **A is REFUTED by the project's own lesson EXP-0511 (2026-11-17 11:02 +03:00):** other mods ship children of `AB_human_male` too (Immersive Warriors' `IMWA_AB_MaleChildDrunk`) and
they cannot be re-cooked without their sources — «never override a PARENT anim blueprint in a modded build»; the route is the post-process one (plan 52,
`ABP_KrinikFirstPersonLook` — how bug 95 shipped). **FORK** (the next chat): options <~~A: override the parent + re-compile and save both children~~ · B: another lever without overriding the graph (e.g. the draw montage — already overridden by KrinikConanArchery — or a curve the graph reads) — recon
first> · price of error: a T-pose hero, stale children after a patch, a conflict with any future mod touching the hero's graph · consulted: bug 95's run (the T-pose and
its log line), `retoc list` (no mod of the build overrides `AB_human_male`); a frame of the hero in third person, an NPC and `ConanSandbox.log` are read BEFORE any show.

## Hypotheses (ranked, none tested)

1. The game's own aim-while-moving blend (the bow's upper-body draw pose layered over the locomotion; the moving pose of the right arm differs) — vanilla; control
   case: the same input with every Krinik mod of the bow off.
2. Ours: KrinikConanLocomotion's sprint-with-bow gate (bug 93) or the jump-in-the-air section changes the movement row / pose while drawing.
3. Ours: the first-person post-process `ABP_KrinikFirstPersonLook` (look B) — active only in first person WITHOUT a draw (`isAttacking` turns it off), so in a draw it
   should be off; still in the control set.

## Decisions made without the owner

— (filled at closing)

## Links

`games/ConanExiles/mods/KrinikConanArchery.md` · `games/ConanExiles/mods/KrinikConanLocomotion.md` · bug 93 (the sprint with the bow; the zoom order of 2026-11-16) ·
plan 52 (the first-person body look)
