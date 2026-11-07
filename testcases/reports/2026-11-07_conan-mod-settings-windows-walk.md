# Run report — Conan: a walk of 8 mod settings windows, Russian fit (bug 64 item 13)

## Work

Bug 64 item 13 (our Russian wider than the mods' fixed slots; the guide's 1.0.0 list «русский текст не помещается в кнопки и поля»): frame the settings windows
of the build's mods, fix what overflows in the translation.

## Contour

Conan Exiles 3.0.1 build, background game at 3840×2160; the windows opened as bare UI modules (the path our «Настройки модов» hub takes); the translation
`KrinikConanRussianTranslation` (pack `291942b`) deployed by `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanRussianTranslation`.

## Runs

- 2026-11-07 09:03–09:05 — module names from the live mods' UI module tables (remote); `bash walk-mod-windows.sh <dir> LBPRWidgetID AMR_Settings
  Pickup+_Settings AmbushMultiUserWidgetID EmberlightMasterConfig UIHortiSettings LLH_Settings PIFC_Settings`.
- 09:06 — `python -I -X utf8 devkit/locres-set-tr.py localization/Game/ru/Game.locres localization/locres-fixes-2026-11-07b.tsv` (source rows edited first),
  `locres-regress.py` (54 457 → 54 457, lost 0, changed 11), the deploy.
- 09:07–09:08 — `bash walk-mod-windows.sh <dir> AMR_Settings EmberlightMasterConfig UIHortiSettings` after the fix.

## Checks

Hygiene: `locres-regress.py` lost 0, changed 11; the tool's source guard.
Functional run: the real build, each window opened through the game's module controller, the frames READ before and after.
- Al-Merayah: before — the longest label pushed its slider and value box past the panel; after — «Возрождение: …», the value boxes in one line.
- Emberlight master config and farming settings: before — «Сохранить настройки» over the button's icon; after — «Сохранить», the icon apart.
- Farming settings: before — two descriptions cut at the panel edge; after — wrapped, inside.
- Knowledge highlight (LLH) and Player Ignores Follower Collision — fine, no change.

## Found

- Pickup+'s hint «If set to < 100 = off | Max. = 5000 | Standard = 900» shows in English though its row (4459) is translated — the string does not reach the game.
- Pickup+'s «Yes» option untranslated — left (an option may be compared in code, bug 78).
- LBPR (bare module over the HUD) and the Ambush module (nothing shown bare) — to be judged on the player's own path.

## Traces

Sheets `mw1.jpg`, `mw2.jpg`, crops `mw3.jpg`, `mw4.jpg` in the session scratchpad (working files); no crash report.

## Verdict

partial — three windows fixed and seen; Pickup+'s hint, LBPR and Ambush stay open in item 13.
