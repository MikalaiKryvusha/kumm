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
