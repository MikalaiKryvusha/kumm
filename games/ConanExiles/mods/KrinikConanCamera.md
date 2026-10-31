# Mod notes — KrinikConanCamera (ours: the third-person camera straight behind the hero)

> **Created:** 2026-10-31 · **Parent:** the rename `ConanCameraControl` → `KrinikConanCamera` (`[OWNER]` «Наши моды начинаются отныне с Krinik» · names
> «KrinikConanCamera + KrinikConanModPackStatus» · 2026-10-31 16:3x; HOUSE_RULES rule 19); written from the mod's header (`Scripts/main.lua`) and the manifest
> **Status:** living notes — the ONE place for this mod's internals (the mod had no notes file before the rename)
> **Outbound:** the mod's Nexus page draft `NEXUS_PAGE.md` still says ConanCameraControl — a publication under a new name is the owner's call

**What it is.** A Lua mod (UE4SS) that puts the third-person camera straight behind the hero (the owner's Palworld CameraControl, Nexus 3659, `offset_y = 0`),
with distance, height, side offset and the rotation axis tuned live from the numpad and saved to `config.lua`.

## Where things are

- Source `ConanExiles/_unpacked/KrinikConanCamera/` (until 2026-10-31 `_unpacked/ConanCameraControl/`) → game `ConanSandbox/Binaries/Win64/ue4ss/Mods/KrinikConanCamera`
  (install step `"."` — the whole folder, Nexus drafts and pictures included; a cleanup of the shipped set is open).
- `Scripts/main.lua` (`MOD_NAME = "KrinikConanCamera"`, log prefix `[KrinikConanCamera]`), `config.lua` beside `Scripts/` (paths relative: `SCRIPT_DIR .. "../config.lua"`),
  `agent-cmd.txt` (the stand's command file, `_config/run-camera-test.ps1`, `_config/corpse-prompt-test.sh`). Key layout — `README.md` (truth for the keys).
- Writes into the native `USpringArmComponent` (`SocketOffset`, `TargetArmLength`); the component is found and logged by name at start, never guessed.

## The owner's live config

The owner's tuned `config.lua` lives in the GAME folder, not in the pack (the pack's file is the default for players). Any redeploy that recreates the folder
must carry it over: copy it out before, back after (done at the rename 16:4x — byte-equal, the log «config.lua перебил 9 настроек кода»).

## The «Моды Krinik'а» window (plan 38 step 6, since 2026-10-31 22:3x)

`config.lua` stays the camera's ONLY store — the window never writes it and the window's `KrinikSettings.lua` holds no camera key. Eight keys are shown
and changed by the window (`HUB_KEYS` in `main.lua`): `offset_z` → `cam_height`, `offset_y` → `cam_side`, `arm_length` → `cam_dist`, `camera_pitch` →
`cam_pitch`, `zoom_min` / `zoom_max` → `cam_zoom_min` / `cam_zoom_max`, `own_arm_length` → `cam_sharp`, `zoom_interp_speed` → `cam_zoom_smooth`.
- The camera publishes the UE4SS shared variable `KrinikCameraValues` (`id=value;…`, sorted) at load and after every `write_config` — the window shows
  them, so numpad tuning is never overwritten by a stale window value.
- The window's «Сохранить» sets `KrinikCameraSet` (all eight rows, rounded to the row's step) and bumps `KrinikSettingsVersion`; the camera takes it in a
  pre-hook of `GUIModuleController:ActivateModule` when a window CLOSES (no timer): cfg, `apply(moved)` (the distance only when the window changed
  it — the wheel's distance is kept otherwise), `write_config`. Log line «ОКНО «Моды Krinik'а»: принято 8 настроек …».
- Cases `testcases/TC_conan_hub_camera_page_2026-10-31.md` (C1–C7 pass 2026-10-31 22:29–22:34; the unmoved-distance branch not yet observed).

## Checks

- In game 2026-10-31 16:41: `[KrinikConanCamera]` 81 log lines, «config.lua прочитан», «ВЫБРАН компонент: SpringArmComponent …». Cases of the camera work —
  `testcases/TC_conan_*camera*`, `TC_conan_bow_camera_rmb_matrix_2026-10-27.md`.
