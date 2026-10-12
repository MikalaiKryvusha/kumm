# Bug 36 — Svarog's Dream: camera rotation on the middle mouse button is gone

**Status:** ✅ DONE 2026-10-12 — KrinikCameraRework 1.6.0
**Severity:** S2 — raised: dragging items in the open inventory rotates the camera (breaks inventory use)
**Version/build:** mod set as deployed 2026-10-11 (KrinikCameraRework 1.5.1 from 10-10 00:50, KrinikUIRework with HeroPortraits, KrinikModMenu 10-11 11:15)
**When/context:** 2026-10-11 ≈23:34, tossed by the owner mid-task while the agent's run (portraits check) had the game open: `[OWNER]` «по СКМ вращение камеры исчезло».

## Symptom
Holding the middle mouse button no longer rotates the camera.

## Forensics (observed 2026-10-11 23:34–23:37)
- `LogOutput.log` of the run: no exception or error lines; camera mod status line normal.
- The game's own key bindings (`%USERPROFILE%\AppData\LocalLow\VI Games\Svarog's Dream\gameSettings`, last entry of the bindings list) read `"Mouse3"` — identical (md5 prefix `01272111`) in every backup from `svarog-saves-2026-10-04_0945` to `…-2026-10-11_2332-before-portraits`. Unity: `Mouse2` = middle, `Mouse3` = side button. So the binding did not change in this period.
- No code in our mods reads the middle button (`grep GetMouseButton(2)|Mouse2` over `SvarogsDream/src` — none).
- Assembly identifiers: `isCameraEverRotated`, `cameraOriginalRotation`, `originalCamRotation`.

## Hypotheses (ranked, unverified)
1. The rotation binding is `Mouse3` (side button), and the middle button never rotated in this game — the owner may have used the side button. Check: hold `Mouse3` in game.
2. Something of ours swallows the game's rotation input (KrinikDevHarness hover/cursor, a UI raycast target of KrinikUIRework covering the screen). Check: disable plugins one by one (`*.dll.off`), test after each.
3. The game rotates only when not over UI — a full-screen invisible Image of ours (e.g. the new portraits module or settings layer) blocks it.

## Fix plan
Reproduce first (owner's word on which button he used before), then bisect by plugin.

## Root cause (found 2026-10-12, by code, not by bisecting)
The game itself rotates the camera ONLY with Alt + ←/→ (`CameraFollow.LateUpdate`, decompiled) — mouse rotation is entirely ours
(KrinikCameraRework `PatchMouseRotate`). Both symptoms are one cause:
1. On 2026-10-10 ≈00:50 the single setting `Camera.MouseButton` was switched from 2 (middle) to 0 (left) by the owner's word
   (`[OWNER]` «сдейлай вращение камерой по клику и удержанию лкм, срочно!!!»), commit `df4ee1a`. One button only — the middle one
   simply stopped being a rotation button. Hypothesis 1 (`Mouse3` in the game's bindings) is refuted: the game's own bindings never
   rotated the camera.
2. `Rotate` read `Input.GetMouseButton` with no look at the UI, so an LMB drag that starts on an inventory slot rotated the camera.

## Fix (KrinikCameraRework 1.6.0)
- Second rotation button `Camera.MouseButton2`, default 2 (middle); −1 — none. LMB stays the first (owner's word of 10-10).
- The held button is remembered at press time; a press that starts over UI (`EventSystem.IsPointerOverGameObject`) does not rotate
  until release.
- `tools/mouse.ps1` gained `-Button drag-left|drag-middle -DX -DY -Steps` — the run is repeatable.

TWINS: searched `GetMouseButton(Down|Up)?\(` over `SvarogsDream/src` — 1 site, the fixed method itself; no other held-button reader.

## Decisions made without the owner
- `[AI]` Both buttons rotate (LMB from 10-10 and the middle one back), rather than swapping back to the middle only: both owner words
  stand, and neither withdrew the other.
- `[AI]` The "not over UI" rule applies to BOTH buttons — one rule, fewer special cases; the middle button over a window did nothing
  in the game anyway.
- `[AI]` Default `MouseButton2 = 2` written into the owner's config by BepInEx on first load (new key).

## ✅ STATUS: DONE (2026-10-12 08:37 +03:00)
Hygiene: build clean (one old CS0649 warning).
Functional run: in game on the owner's save — middle and LMB drags on the world rotate (+57° each), an LMB drag of an item in the open
inventory leaves the angle unchanged, control with `MouseButton2 -1` does not rotate; save 7/7 afterwards
(`testcases/reports/2026-10-12_svarog-camera-two-buttons.md`). Not checked: the owner's physical mouse.

## Second symptom — same root likely (`[OWNER]` «в открытом инвентаре хватаю преддмет - это как ЛКМ зажатое крутит камеру!!!  БАГ!» · 2026-10-11)
With the inventory open, dragging an item with the LEFT button rotates the camera. Together with symptom 1 this reads as: camera rotation moved from the middle button to the held left button, and it ignores open UI. Priority up: it breaks inventory use. First check: which button the game rotates with now (hold LMB / MMB / Mouse3 on empty ground), and whether any of our mods (KrinikCameraRework, KrinikUIRework, KrinikDevHarness hover/cursor) maps or forwards mouse buttons; then bisect by plugin.
