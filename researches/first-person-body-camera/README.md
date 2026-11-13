# Research — the first-person camera with a visible body: how the industry places the eyes and bends the body

> **Created:** 2026-11-13 (on the owner's word 15:20: `[OWNER]` «Поищи в интернетте, как такое делают в индустрии. Давно решённый вопрос в индустрии.»)
> **Parent:** `bugs/95_conan_first_person_bow_not_visible.md` (option B built; the owner's remark 15:19 `[OWNER]` «у тебя камера прямо вниз смотрит из центра головы - так не
> бывает в реальности» · 15:20 «глаза всегда чуть вынесены вперёд от наклонившейся вниз головы.»)
> **Status:** recon done 2026-11-13 15:2x; the owner's choice between «body visible, eyes forward» and «arms and weapon only» pending (review folder 84)
> **Outbound:** the owner's pick → the kit edit (`ConanExiles/_config/devkit/kit-ab-fp-upright.py`)

## 1. What the industry does (sources at the end)

1. **The camera sits at the EYES, not at the head bone's pivot.** DICE moved Mirror's Edge's camera «into the character's eyes as opposed to her head» (it also cut the head
   bob); the head bone's pivot sits near the base of the skull, the capture point belongs between the eyes — a socket on the head bone offset forward (UE forums). So when
   the head tilts down the eyes TRAVEL forward and down, not only rotate («when you look down, not only you rotate your eyes in space, you also move them forward» — a VR
   developer). Battlefield 3 inherited it: the camera «sits on the animation rig».
2. **The look pitch is distributed along a chain — spine → neck → head**, never one rigid piece and never «almost nothing»: a Control Rig «distribute rotation» across
   spine3 → neck → head, or authored additive Aim Offset poses for up / down (Froyok, «True First Person Camera in UE4»: the camera attached to the head, «we never modify the
   camera position or rotation directly», the body poses do it); a UE tutorial splits it «spines and neck 15 %, head 40 %, summing to 100 % at the head».
3. **Known artifacts** of a head-bound camera: seeing inside the neck or the body (hidden head / neck is the common workaround — hidden for the owner only, the shadow kept),
   animation-driven head bob (authored first-person poses keep the head steady).

## 2. What Conan does (measured 2026-11-13, bug 95)

- The first-person camera sits at `b_headcam` ≈ the head bone's position (the gauge `fp-bow-angle.lua`: camera = `b_head`, both «ahead −1 up 80» at pitch −55) — the head's
  centre, not the eyes.
- The combat pose bends the whole upper body by the full pitch at `b_spine_3` (rigid) — the hands swing behind the camera (the bow 73–78° under the centre), and looking up the
  camera sinks into the neck (bug 69, hidden by KrinikConanCamera's `b_neck_1` hiding — a crutch over this pose).
- The peaceful pose bends `b_spine_3` and `b_neck_1` by 15 % each — the head barely tilts; with our option B (the peaceful pose while the bow is held and not drawn) the bow
  is in the frame (34° at −55, 9° at −80), but the camera looks straight down from the head's centre onto the chest (the owner's remark).
- The hero's body is split: `MergedLodMesh` (the torso with the upper arms), `…_underwear_upperbody`, `…_underwear`, `…_legs`, `…_feet`, and SEPARATE `…_forearms` and
  `…_hands`; the head and the hair are already invisible in first person.

## 3. The two ways for the owner

- **A — body visible, done the industry way:** in the upright pose the neck takes a bigger share of the pitch when looking down (the head and the camera go forward and
  down over the chest), and the camera point moves from the head's centre to the eyes. Kit work: the passive chain's `b_neck_1` rotation and `b_head` translation pins
  (thread-safe math only — EXP-0510); the shares and the eye offset are taste numbers — tuned live by the remote, the owner picks.
- **B — arms and weapon only:** in first person hide everything but `…_forearms`, `…_hands` and the weapon (a local hide at the first-person switch, like the neck). Seen in
  the experiment 15:23 (review folder 84): the forearms end at the elbow — stumps at the frame's lower edge at −80; the hair shows from above (to hide as well). Armour pieces
  (chest, gloves) are other components — the rule must pick by slot, not by the naked mesh names.

## 4. The head's shadow without the head in the view (the owner 2026-11-13 16:25, bug 98)

`[OWNER]` 2026-11-13 16:25 «нужна будет тень головы и шеи, но чтобы голова и шея не мещали обзору камеры от перовго лица. Нужно придумать, как это сделать»

Industry practice (UE, sources below): a part the owner's camera must not see but whose shadow must stay is NOT collapsed by a bone hide (a hidden bone collapses the
shadow too) — it gets **`bOwnerNoSee` + `bCastHiddenShadow`** (the "true first person" head: a separate head component, owner-no-see, casts a hidden shadow). Since UE 5.5
the engine's own route is **`FirstPersonPrimitiveType`**: `FirstPerson` (the visible first-person body, no world shadow) and `WorldSpaceRepresentation` (invisible to the
owner's camera, casts the world shadow — the engine sets owner-no-see itself). Field reports on 5.7–5.8: an owner-no-see part with a hidden shadow loses the shadow for its
owner's camera with Nanite + virtual shadow maps; a `WorldSpaceRepresentation` mesh cast no shadow after a 5.7 upgrade. Fallback: a shadow twin (a copy following the hero's
pose, not drawn in the main pass, shadow only).
**For Conan:** the head, the hair, the beard and the helmet are separate components (section 2) — the flags can be set from Lua at the camera switch, no asset edit;
KrinikConanCamera's `b_neck_1` hide goes. The neck: gone with the head if it is in the head mesh; if it is the torso's — the camera at the eyes ahead of it (plan 52's eye
offset). **Hypothesis for bug 98:** the game's first person marks the hero's parts `FirstPerson` (no world shadow by design) while the arrow is a plain component — read
`FirstPersonPrimitiveType` of every part in both views first.
**Stand (when the game is mine):** read the head component, whether it holds the neck, every part's `FirstPersonPrimitiveType` and shadow flags in first and third person;
then owner-no-see + hidden shadow on the head parts with the bone hide off; frames: the ground shadow, looking up, looking down — one HTML page to the owner.

## Sources

- Epic, First Person Rendering (5.5+, `FirstPerson` / `WorldSpaceRepresentation`): https://dev.epicgames.com/documentation/unreal-engine/first-person-rendering · the enum:
  https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/EFirstPersonPrimitiveType
- Owner-no-see head + cast hidden shadow: https://forums.unrealengine.com/t/hide-mesh-from-owner-but-keep-shadow-rendered/132825 ·
  https://forums.unrealengine.com/t/first-person-inside-head-hide/1965165/4
- 5.7–5.8 field reports: https://forums.unrealengine.com/t/5-8-nanite-owner-no-see-mesh-with-cast-hidden-shadow-casts-no-shadow-for-its-owners-camera-virtual-shadow-maps/2845872 ·
  https://forums.unrealengine.com/t/no-shadows-from-world-space-representation-first-person-rendering/2701045
- Mirror's Edge camera in the eyes: https://www.wurb.com/stack/?p=669 · DICE GDC 2009 «Creating First Person Movement for Mirror's Edge»: https://gdcvault.com/play/1012171/Creating-First-Person-Movement-for · Battlefield 3: https://www.engadget.com/2012/08/13/how-mirrors-edge-gave-legs-and-more-to-battlefield-3/
- Froyok, True First Person Camera in UE4: https://www.gamedeveloper.com/programming/true-first-person-camera-in-unreal-engine-4
- Head pivot vs the capture point between the eyes: https://forums.unrealengine.com/t/modifying-the-distance-between-the-cameras-pivot-point-and-its-capture-point/135811
- Pitch distributed across spine → neck → head: https://forums.unrealengine.com/t/first-person-camera-tech/2670673 · https://forums.unrealengine.com/t/implementing-a-true-first-person-camera/112451/26
- The eyes move forward when looking down (VR): https://communityforums.atmeta.com/discussions/dev-pcvr/how-to-not-allow-the-player-to-look-down/319133
