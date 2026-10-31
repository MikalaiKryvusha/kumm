# Run report — 2026-10-31 · the camera page of «Моды Krinik'а»

## 1. Work

KrinikConanCamera ↔ the hub window (plan 38 step 6): the window shows the camera's current values and a save moves the camera and writes the camera's
own `config.lua`. Basis — `testcases/TC_conan_hub_camera_page_2026-10-31.md` (C1–C8).

## 2. Contour

Conan Exiles 3.0.1, the full build; KrinikConanUI and KrinikConanCamera deployed from the pack's working tree (`Deploy-ModPack.ps1 -Deploy -Only
KrinikConanUI,KrinikConanCamera`) twice; the owner's live camera `config.lua` (`offset_z = 80.0`) copied to `_save-backup/2026-10-31_2228-camera-config-before-hub-page`
and put back after each deploy and at the end; the owner's save restored from `_save-backup/2026-10-31_1004-before-w13-arrows`.

## 3. Runs

- 2026-10-31 22:28 — launch 1: `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`; `pult.sh "lua return tostring(ModRef:GetSharedVariable('KrinikCameraValues'))"`;
  `ActivateModule('CharacterInventory')`, `ActivateModule('KrinikModSettings')`; `Sl_Krinik_cam_height:SetValue(120, false)`; real click «Сохранить и
  закрыть» by `mouse-seq.ps1`; `ActivateModule('CharacterInventory', false)`; reopen, `SetValue(40)`, real click «Закрыть без сохранения».
- 2026-10-31 22:32 — launch 2 (fixes: rounding to step, the distance only when changed): `SetValue` height 100 and distance 400, real click «Сохранить и
  закрыть», inventory closed; the arm read by `StaticFindObject('…BasePlayerChar_C_….ThirdPersonSpringArm')`.

## 4. Checks

Hygiene: `luac -p` on both files — ok; `check-lua-game-thread.py` — 0 worker-thread calls.
Functional run: the window walked in the live world by the remote and the real mouse; the camera's and the window's log lines, the camera's `config.lua`,
the store file and the hero's spring arm READ after each step; a world frame.

| Case | Status |
|---|---|
| C1 the camera publishes | pass |
| C2 the page shows the camera's values (80, not 75) | pass |
| C3 a save moves the camera | pass — `SocketOffset Z 100.0 arm 400.0` |
| C4 the camera's own file, no camera key in the store | pass after a fix (float noise `120.00000762939` → rounding to the step) |
| C5 reopen shows the new value | pass |
| C6 control: no save, no move | pass |
| C7 the owner's file back | pass — `cmp` equal |
| C8 the wheel's distance kept when the distance is not changed | fix in; the unmoved branch not observed on the fixed build |

## 5. Found

1. The game slider hands back float noise (`120.00000762939`) — the window now rounds every slider value to its row's step (all pages).
2. `apply(true)` on every save would reset the wheel's distance — the camera now moves the distance only when the window changed it.

## 6. Traces

Session scratchpad `seams/`: `c2.webp` (the camera page), `c3_world_100_400.webp`; `UE4SS.log` lines quoted in the case file.

## 7. Verdict

partial — C1–C7 pass on the live game; C8's unmoved branch is not observed.
