# Test cases — Conan: the right hand with the arrow stays on the string when moving in the bow aim (bug 104)

> **Created:** 2026-11-17 · **Parent:** `bugs/104_conan_bow_aim_right_hand_drifts_when_moving.md` · **Status:** H1, H2, H7 + H8 run 2026-11-17 06:11–06:15 — the cause is the game's own moving-aim pose; H3–H6 not run (the owner's choice first) · **Outbound:** —

**Basis.** `[OWNER]` 2026-11-16 18:40 (verbatim in bug 104): in the RMB aim, starting to move shifts the right hand holding the arrow to the right, off the string.
Expected: the right hand and the arrow nock stay on the string, as when standing.

**Stand.** The desert arch (`tp_ground.sh 17929 244723`), the hero facing the open desert (the wall stand's yaw + 180), third person, the bow wielded
(`ToggleWieldWeapon()` after a restart), stamina refilled, the stand keeper's kill timer off for the frames, noon light (`SetTimeOfDay` 12:00 by the remote).
Real input only while `owner-idle.ps1` says FREE; the game in front. Frames by `capture-window.ps1 -Width 3840` during the hold, two per case, the same camera
distance (the camera is not touched between cases).

Dimensions: standing vs moving × direction (W, A, D, S) × walking vs sprinting (the bow sprint gate) × our parts on vs off (KrinikConanArchery, KrinikConanLocomotion).
Left out: first person (the owner named the hero's model, third person), gamepad.

| Case | Steps | Expected | Status |
|---|---|---|---|
| H1 standing aim | RMB held 2.5 s, frames at 1.5 s and 2.2 s | the right hand at the bow, the nock on the string — the reference | **done** 2026-11-17 06:11 (side camera, frame at 2.4 s): the right hand at the chin, the nock at the hand (`НА ОТСМОТР НИКОЛАЕМ/89_ruka_na_tetive_na_hodu/s1_stand.webp`) |
| H2 walking forward in the aim | RMB held, after 1.5 s W held 1.5 s, frames 0.5 s and 1.2 s into W | the hand where H1 has it (the owner: it moves right) | **differs** 06:11: the right hand forward in front of the face, the draw shorter (`s2_walk.webp`) — most likely the owner's symptom — his answer settles it (interview #038) |
| H3 strafing left | as H2 with A | as H1 | [NOT-TESTED] |
| H4 strafing right | as H2 with D | as H1 | [NOT-TESTED] |
| H5 backwards | as H2 with S | as H1 | [NOT-TESTED] |
| H6 sprinting in the aim | as H2 with W + LShift (the bow sprint gate opens) | as H1 | [NOT-TESTED] |
| H7 control — KrinikConanArchery off | H1 + H2 with the mod's `enabled.txt` moved out of the game copy (restart) | names who moves the hand: same drift → not Archery | **done together with H8** 06:15: both mods out — the same change (`c1_stand_vanilla.webp`, `c2_walk_vanilla.webp`): the game's own moving-aim pose |
| H8 control — KrinikConanLocomotion off | H1 + H2 with Locomotion's `enabled.txt` out (restart) | same drift → not Locomotion; both off and the drift stays → the game's own blend | **done with H7** — the drift stays with both off → the game's own blend |
