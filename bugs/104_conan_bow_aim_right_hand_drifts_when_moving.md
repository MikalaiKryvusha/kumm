# Bug 104 — Conan: in the bow aim (RMB), starting to move shifts the right hand with the arrow off the string to the right

**Status:** 🔴 OPEN — filed 2026-11-16 18:41 +03:00 · **Severity:** S2 (the owner's play of the archery he named important) · **Version/build:** Conan Exiles Enhanced 3.1.0 with the
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
A first try (third person, the default camera behind the hero, `KUMM/.work/bowhand/h1_stand.jpg`, `h2_walk.jpg`, 1920 wide): the bow and the right hand are seen
from behind at ≈ 1/6 of the frame height — too small to tell the hand on the string from off it, and the «standing» frame fell inside the draw (taken 1.4 s
after RMB, the full hold comes ≈ 0.55 s + the draw). NEXT: a close side camera on the hero's right shoulder (the camera remote / `fixed-cam.lua` at ≈ 1.2 m, the
bow arm in frame), frames only in the FULL hold (substates 11,15,16 read by the 15 ms recorder at the frame's moment), standing vs walking in one sequence.

**Side frames 2026-11-17 06:11** (a fixed camera 2.3 m to the hero's right and 1.7 m ahead, chest height, `fixed-cam.lua`; RMB held 3.2 s then W 2.4 s; frames
`KUMM/.work/bowhand/s1_stand.webp` — 2.4 s, the full hold standing; `s2_walk.webp` — ≈ 1 s into W): standing, the right hand pulls the string to the chin, the
nock at the hand; walking, the right hand sits further FORWARD, in front of the face, the draw visibly shorter, the string still meeting the hand at the nock
as far as the frame shows. Whether this is the owner's «уходит с тетивы и тела лука вправо» is NOT settled — the fixed camera's angle to the hero changes as she
walks, and from the game camera (behind, zoomed in by 3 wheel notches) the hotbar covered the hand and the view turned to the rock. NEXT: (1) the H7 / H8 control
(vanilla vs ours — if vanilla shortens the draw the same way, it is the game's moving-aim animation); (2) a camera that follows the hero (re-placed relative to
her before each frame, or the game camera with the HUD hidden) for a same-angle pair; (3) the pair to the owner on one HTML page («это тот сдвиг?»).

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
