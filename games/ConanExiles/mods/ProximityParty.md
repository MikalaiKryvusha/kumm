# Mod notes — Proximity Party (another author's — Xevyr)

> **Created:** 2026-11-02 · **Parent:** plan 40.3 I6.3 (its page in the Xevyr hub); facts from `researches/conan-mod-settings-hub/xevyr-settings-recon.md` §2
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** An on-screen list of the companions near the hero (`PrP_UI_MainList_C`); F1 shows the mouse cursor over the game (shared with The Damage
Meter and Simple Minimap). Pak `ProximityParty.pak`, assets under `/Game/Mods/ProximityParty/`.

## Settings — where each value lives

| Row (our hub) | SaveGame field (`PrP_SAV_WindowSettings_C`, slot `ProximityParty`) | Author's control (`PrP_UI_Settings_C`) | Applied | Default |
|---|---|---|---|---|
| Включено | `IsEnabled` | `IsEnabled` | list visibility, `PrP_AC_PlayerChar_C.Enabled` | true |
| Масштаб | `UIScale` (0.5–1.0) | `ScaleSlider`, v = (x − 0.5) / 0.5 | list `SetScale` (preview on drag) | 0.8 |
| Радиус отслеживания | `trackRadius` (500–6000, step 100) | `RadiusSlider`, v = (x − 500) / 5500 | `PrP_AC_PlayerChar_C.DetectionRange` | 4000 |
| Отслеживать, не больше | `maxChars` (1–15) | `widgetCount`, v = (x − 1) / 14 | `PrP_AC_PlayerChar_C.CharLimit` | 5 |

The window's only button «Закрыть» → `SaveSetting` (writes the four fields, `SaveGameToSlot`, applies to the component); no cancel. Constructing the window
rewrites `ProximityParty.sav` (`LoadSave`).

## Our use

- The Xevyr hub page `prp` (`KrinikConanUI` `krinik_mod_settings.lua`, `AUTHORS.prp`): reads the slot (the CDO when absent), writes through the author's
  window — its module `PrP_Settings` opened, the controls set, `SaveSetting` called, the module closed. Cases X1–X3, X7, X8 of
  `testcases/TC_conan_hub_rows_audit_2026-11-01.md`.
- Its settings row in the module table is Modal + CloseOnESC (KRINIK MODIFIED, `krinik_patches`, plan 40.3 B11 — `KrinikConanUI.md`).

- `SaveSetting` reads the sliders themselves: a slider set by the remote (no handler fired) reached the slot and the component (case X3, 2026-11-02 07:53).
