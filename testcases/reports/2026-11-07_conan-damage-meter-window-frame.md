# Run report — Conan: the Damage Meter settings window, the slider and the buttons (bug 64 item 21)

## Work

Bug 64 item 21 (the opacity slider ran into «Масштаб», «Донат» over «Discord», «Сохранить» touching «Отмена») — the edit of 2026-10-26 20:3x
(`asset-strings/DamageNumber__DN_UI_SettingsWindow.tsv`: `Spacer_17` 4, labels 12, slider 64) was never seen on a frame; plan 36 item 8.

## Contour

Conan Exiles 3.0.1 build, pack `82dd21c`-era (The Damage Meter KRINIK MODIFIED as deployed), background game at 3840×2160, world by `enter-world-remote.sh`.

## Runs

- 2026-11-07 08:50–08:51 — `bash walk-mod-windows.sh <scratchpad>/dm DN_UI_Settings` (opens the module by the remote, `capture-window.ps1`, closes it).

## Checks

Hygiene: none.
Functional run: the real build, the mod's settings window opened through the game's module controller (the path its menu button takes), the frame READ.
- The opacity slider ends ≈ 33 px (4K) before «Масштаб» — no overlap; «Донат» and «Discord» apart; «Сохранить» and «Отмена» apart; every label inside its row.

## Found

none at 4K.

## Traces

Frame `w_DN_UI_Settings.jpg` in the session scratchpad (working file); no crash report.

## Verdict

pass at 4K — item 21 closed for 4K; 720p, 1080p, 2K go with the plan 35 release gate (HOUSE_RULES rule 17).
