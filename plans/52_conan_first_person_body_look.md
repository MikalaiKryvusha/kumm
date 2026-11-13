# Plan 52 — Conan: the first-person body look done the industry way (post-process anim blueprint on the hero only)

> **Created:** 2026-11-13 15:3x · **Parent:** `bugs/95_conan_first_person_bow_not_visible.md` (option B → the owner's pick A 15:25), recon `researches/first-person-body-camera/README.md`
> **Status:** step 1 (recon of the vanilla bone-modify spaces and the kit's anim-node catalog) in progress 2026-11-13 15:3x
> **Outbound:** the frames to the owner as ONE HTML page with captions (HOUSE_RULES rule 32)

## Goal vector

Achieve: in first person, while a bow is held and not drawn, looking down shows the chest, the arms and the bow the way a person sees them — the eyes in front of the
head's pivot, the neck bending more than the spine — and NO animation anywhere changes otherwise (the hero in third person, NPCs, thralls, every mod's anim blueprint).
`[OWNER]` 2026-11-13 15:25 «A — тело видно, сделано по-индустриальному.» · 15:29 «и без анимаций и поз корректных нет смысла смотреть это. чини».

## Why not the parent override (paid 2026-11-13 15:14–15:27)

Overriding `AB_human_male` (kit recompile) stood the heroine in the bind pose: its children (`AB_human_female`, `AB_human_werewolf`, Immersive Warriors'
`IMWA_AB_MaleChildDrunk`, likely more in Emberlight / Highmane's Arsenal) carry cooked data of the vanilla parent («inconsistent folded node data»); other mods' children
cannot be re-cooked without their sources. Rolled back 15:27.

## The route — a post-process anim blueprint set on the hero's mesh only

`SkeletalMeshComponent:SetOverridePostProcessAnimBP(class, true)` exists in this engine; the hero has no post-process instance and its mesh no PP asset (remote 15:3x).
Our own new anim blueprint runs after the game's on the hero's leader mesh (`CharacterMesh0`, followers copy its pose, the first-person camera follows `b_headcam`).
The kit's graph editor creates any action-menu node by `create_node_from_name("Category|Name", location, context_pins)` and lists them by `list_available_nodes`.

## Acceptance criteria

- C1. Third person, first person bare hands, first person with a sword: frames identical to the vanilla build (no pose change).
- C2. First person, bow held, not drawn, pitch −55 / −80: the hands and the bow in the frame (`fp-bow-angle.lua` angle < the half view); the camera ahead of the head's
  pivot (the gauge «camera ahead» > `b_head` ahead).
- C3. The draw: the full vanilla bend (the aim follows the view), back to C2 on release, no snap (blend).
- C4. NPCs and thralls in view: no bind pose; `ConanSandbox.log` without «inconsistent folded node data» and without new anim errors.
- C5. Cost: the hero only — one small anim blueprint; an A-B frame-time pair (rule 7).

## Steps

1. [ ] Recon: the vanilla `b_spine_3` / `b_neck_1` ModifyBone rotation mode and space (to counter the full bend exactly); the hero skeleton asset; the anim-node names
       `create_node_from_name` takes in an AnimGraph (`list_available_nodes`).
       **Read 15:37** (`_config/devkit/kit-probe-pp-abp.py` → `.json`): skeleton `/Game/Characters/humans/meshes/sk_human_skeleton.SK_human_Skeleton`; the combat chain's
       `b_spine_3` — rotation ADDITIVE in COMPONENT space (`Roll = −Pitch`) → our counter is ADDITIVE, COMPONENT, `Roll = +Pitch × 0.85` (rotations about one axis at one
       pivot add exactly); the passive chain's `b_neck_1` and `b_head` — rotation REPLACE in component space; `b_head` translation ADDITIVE (`HeadFOVAdjustments`, Y 10.3
       at −55, 5.6 at +30 — the game already pushes the head forward looking down). A new anim blueprint gets `AnimGraph` + `EventGraph` and one node «Выходная поза»
       (Root); the catalog of 53 351 actions is localized — grep `kit-probe-pp-abp-catalog.txt`.
2. [ ] (trial runs 15:44–15:49: the graph builds — 23 AnimGraph + 15 EventGraph links, compile True, the bone modes and names hold; kit facts paid: the pose pins are
       `Pose` → `LocalPose` / `ComponentPose` → ModifyBone `ComponentPose`·`Alpha`·`Translation`·`Rotation` → `Pose` → C2L `ComponentPose` → Root `Result`; the
       cast's typed output is `AsAnim Instance Human Male`; `reconstruct_node` does not exist (the pins are there anyway); `get_basic_type_by_name("float")` makes an
       INTEGER member (0.85 reads 0) — the run of 15:49 builds the pin type by hand, category `real` / subcategory `double`)
       Kit: create `ABP_KrinikFirstPersonLook` (parent `AnimInstance`, the hero skeleton) — Input Pose → spine counter-bend → neck bend (looking down) → eye point
       (`b_headcam` forward) → Output; alphas and amounts from members; the EventGraph reads the owner's main anim instance (`Pitch`, `isAttacking`, `isThirdPerson`) and
       the weapon archetype (3 = bow). Saved as a NEW asset of KrinikConanArchery — no vanilla asset touched.
3. [ ] Lua (KrinikConanArchery): at the hero's birth `Mesh:SetOverridePostProcessAnimBP(<class>, true)` — once, an event.
4. [ ] Kit build → deploy → cases C1–C5 (TC `TC_conan_fp_bow_visible_2026-11-13.md`), the neck share and the eye offset tuned live by the remote; frames to the owner as
       one HTML page.
