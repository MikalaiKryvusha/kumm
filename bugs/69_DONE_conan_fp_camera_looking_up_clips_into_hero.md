# Bug 69 — first-person camera looking straight up goes inside the hero's neck

**Status:** ✅ DONE 2026-10-29 10:56 · **Severity:** S2 · **Version/build:** Conan Exiles Enhanced 3.0.1, the 3.0.1 build of the pack
**When/context:** 2026-10-29 10:3x, the owner playing (screenshot: the whole screen is skin texture with the crosshair dot)

## Symptom

`[OWNER]` «в FPV камере при поднятии камеры 90 градусов вверх - камера проникает в текстуру героя. Можно исправить?» · 2026-10-29.

## The owner's frame for the fix

`[OWNER]` «сдвигая камеру вперёд или скрывая голову и шею героя - в принципе, логично. Они не нужны при видео FPV» · «только, конечно, это должно быть
сокрытие ТОЛЬКО для игрока, чтобы по сети другим игрокам голова и шея были видны» · «нужно выбрать более простое решение, чтобы меньше кода, но решало
проблему провала камеры в текстуру» · 2026-10-29.

## Candidates (simplest first)

1. Hide the head bone of the local hero's mesh while the camera is first-person (`HideBoneByName` / `UnHideBoneByName` on the view switch) —
   a Lua visual change is local to this client, other players render their own copy.
2. Raise the near clip plane (`r.SetNearClipPlane`) — no code, but may clip the bow and hands close to the camera.
3. Move the camera forward with the pitch — more code.

## Fix

Candidate 1: `ConanCameraControl` hooks `BasePlayerChar_C:SwitchToFirstPersonCamera` → `Mesh:HideBoneByName('b_neck_1', PBO_None)` and
`SwitchToThirdPersonCamera` → `UnHideBoneByName`; installed from `try_install_zoom_hook` (the hero-appearance event does not fire in this mod).

## Decisions made without the owner

- `[AI]` The bone: `b_neck_1` (hides the neck and the head with it) — `b_head` alone would leave the neck the camera sits in.
- `[AI]` In the camera mod, not in the archery mod — the camera is its subject.

## ✅ STATUS: DONE (2026-10-29 10:56 +03:00)

Hygiene: `luac -p`.
Functional run: the owner's save, real wheel FP/TP/FP, frames: sky in FP looking up, the head in TP; camera point unchanged.
Report `testcases/reports/2026-10-29_conan-fp-neck-hidden.md`. Not checked: the hero's shadow in FP.
REAL WORLD: accumulated — the owner's save and game folder; data and machine — his machine; path — the real mouse wheel, verified on the real world.
