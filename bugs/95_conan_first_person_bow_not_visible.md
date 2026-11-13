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
