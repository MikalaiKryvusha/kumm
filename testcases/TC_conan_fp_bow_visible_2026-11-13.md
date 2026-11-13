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
