# Bug 95 — Conan: in the first-person view the bow is not visible in the hero's hands

**Status:** 🔴 OPEN — filed 2026-11-13 11:02 · **Severity:** S2 (the owner's play, the archery he named important) · **Version/build:** Conan Exiles 3.0.1 build,
KrinikConanLocomotion build 7, KrinikConanArchery / KrinikConanCamera as shipped · **When/context:** the owner's message 2026-11-13 11:01 after his own play of the
bow sprint · **Fixing:** the next session (this one closes near the context limit)

## Goal vector

Achieve: in the first-person view the drawn bow and the arrow are seen in the hero's hands as in vanilla. Acceptance: a first-person frame with the bow drawn shows the
bow; the same frame with our first-person camera edits off (control) — the difference names the cause.

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-13 11:01 «спринт и стрельба работают» · «Есть проблемка с видом от первого лица - не видно лука в руках».

## Leads (from the game map, not yet observed for this bug)

- KrinikConanArchery `KrinikArrowAim` moves the first-person camera arm `FirstPersonCameraArm` (`fp_hip_offset` Z 11) to cancel the shot pose's 10–11 cm head drop, and
  writes its own first-person field of view (`fp_aim_fov_scale`) — game map lines 438, 578–580.
- First person in combat is the game's `AllowFirstPersonCamera` / `AllowFirstPersonCameraInCombat` (pack reference: True since 2026-10-26).
- The camera mod KrinikConanCamera (its first-person settings) — read its notes first.

## Plan

1. Read `games/ConanExiles/mods/KrinikConanArchery.md` and `KrinikConanCamera.md` (first-person parts).
2. Stand: the honest bow stand (game map «Stand gear»: the hero crafts bow 51401), first person by `SwitchToFirstPersonCamera()`.
3. Frames: first person, bow drawn — with our first-person edits on, then off (control); vanilla first person without our Lua.
4. Fix at the cause (HOUSE_RULES rule 24), cases in a TC, frames for the owner.

## Decisions made without the owner

- none yet

## Links

bug 93 (the bow sprint) · game map «Лук и камера» · `testcases/reports/2026-11-13_conan-bow-sprint-sprint-then-draw.md`
