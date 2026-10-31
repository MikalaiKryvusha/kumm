# Run report — 2026-10-31 · the HUD-size row of «Моды Krinik'а» (KrinikConanModPackManager)

## 1. Work

KrinikConanModPackManager reads `mpm_hud_scale` from the window's store at load and after «Сохранить» (on the next game-window close); the window's
page for it goes live. Basis — `testcases/TC_conan_hub_mpm_page_2026-10-31.md` (M1–M5).

## 2. Contour

Conan Exiles 3.0.1, the full build; KrinikConanUI and KrinikConanModPackManager deployed from the pack's working tree; the owner's live
`KrinikConanModPackManager/config.lua` (and the camera's) copied to `_save-backup/2026-10-31_2228-camera-config-before-hub-page` and put back
byte-equal; the store removed before and after; the save restored from `_save-backup/2026-10-31_1004-before-w13-arrows`.

## 3. Runs

- 2026-10-31 22:37 — launch 1: `launch-bg.ps1`, `enter-world-remote.sh`; the live scale read by `pult.sh "lua … FindAllOf('W_SmoothHP_C') … RenderTransform.Scale.X"`;
  the window by `ActivateModule`; a real click on «KrinikConanModPackManager» (`mouse-seq.ps1`); `Sl_Krinik_mpm_hud_scale:SetValue(150, false)`; a real
  «Сохранить и закрыть»; `ActivateModule('CharacterInventory', false)`.
- 2026-10-31 22:39 — launch 2 (restart): the log and the live scale read; «Сбросить к исходным» and «Сохранить и закрыть» by the real mouse; the inventory closed.

## 4. Checks

Hygiene: `luac -p` on both files — ok.
Functional run: the window walked in the live world with the real mouse; the mod's log line, the store file and the live widget scale READ after each
step; a frame of the top HUD.

| Case | Status |
|---|---|
| M1 load without a key — x1.25 from config.lua | pass |
| M2 the page live, 125, «в процентах» | pass |
| M3 a save applies at the inventory close — x1.50 | pass |
| M4 survives a restart | pass |
| M5 the default deletes the key — back to 1.25 | pass |

## 5. Found

none

## 6. Traces

Session scratchpad `seams/`: `m0.webp` (the list with the sliding name), `m2c.webp` (the page), `m3_world.webp`, `m3_hud.webp`; `UE4SS.log` lines quoted in the case file.

## 7. Verdict

pass
