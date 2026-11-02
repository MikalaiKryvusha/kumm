# Bug 78 — in the bow aim the mouse wheel zooms our camera instead of choosing arrows

**Status:** 🔴 OPEN · **Severity:** S2 (a mod feature unusable: the arrow choice of Arrow Quick Swap) · **Version/build:** pack ConanExiles `40db56d`
(KrinikConanCamera wheel zoom; Arrow Quick Swap + KrinikConanArchery `on_aqs_display`) · **When/context:** 2026-11-02 14:23 +03:00, the owner's play
**Fixing:** the next chat, right after bug 77

`[OWNER]` «а как выбирать стрелы при натяжении?» · (answer: the wheel in the aim) · «зум камеры меняется» · 2026-11-02 14:22–14:23.

## Symptom

RMB held (aim), mouse wheel: the camera zoom of KrinikConanCamera changes; the arrow kind is expected to change (Arrow Quick Swap's wheel path), the list
right of the crosshair to show it.

## Fix plan

Recon first (`games/ConanExiles/mods/KrinikConanCamera.md` and `ArrowQuickSwap.md`): where our camera mod reads the wheel (key bind or axis) — while the hero
aims with a bow (substate 16, or the archery mod's aim state), the camera mod leaves the wheel to the game/mods (no zoom step); check that Arrow Quick Swap
then receives it (`InpAxisKeyEvt_MouseWheelAxis`), the control case with our camera section off. Cases: aim + wheel → the arrow kind changes, zoom unchanged;
no aim + wheel → zoom as before.

## Decisions made without the owner

(at closing)
