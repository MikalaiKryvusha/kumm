# Bug 69 — first-person camera looking straight up goes inside the hero's neck

**Status:** 🔴 OPEN · **Severity:** S2 · **Version/build:** Conan Exiles Enhanced 3.0.1, the 3.0.1 build of the pack
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

Fixing: this session, after bug 68.

## Decisions made without the owner

(at closing)
