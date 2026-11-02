# Mod notes — Lore & Loot Highlight (another author's — Xevyr)

> **Created:** 2026-11-02 · **Parent:** plan 40.3 I6.3 (its page in the Xevyr hub); facts from `researches/conan-mod-settings-hub/xevyr-settings-recon.md` §4
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Lore sources and loot chests in the world are highlighted in a colour. Pak `LLHighlight.pak`, assets under `/Game/Mods/LLHighlight/`.

## Settings — where each value lives

| Row (our hub) | Field (SaveGame `LLH_SAV_Settings_C`, slot `LLH_Settings`; the same names on `LLH_AC_PlayerComp_C`) | Default |
|---|---|---|
| Подсветка знаний | `LoreHighlightEnabled` | true |
| (colour — waits for I6.2) | `LoreHighlightColor` | (1, 0, 0, 1) |
| Подсветка сундуков с добычей | `LootHighlightEnabled` | true |
| (colour — waits for I6.2) | `LootHighlightColor` | (0, 1, 0.933, 1) |
| Яркость подсветки | `HighlightIntensity` (0.1–1.0; the author's slider shows 10–100) | 1.0 |

The author's window `LLH_W_Settings_C` (module `LLH_Settings`): «Подтвердить» → `SaveSettings` → `ApplySettings` = the player character's
`LLH_AC_PlayerComp_C.UpdateSettings(LoreEnabled, LootEnabled, Intensity, LoreColor, LootColor)` (a plain BP function, client). The component loads the
slot at begin play. `LLH_Settings.sav` does not exist until the player confirms once.

## Our use

- The Xevyr hub page `llh` (`KrinikConanUI` `krinik_mod_settings.lua`, `AUTHORS.llh`): reads the component; writes by `UpdateSettings` (the colours kept
  as the component holds them) and saves the slot itself (`CreateSaveGameObject` when absent). Cases X1, X2, X5, X7, X8 of
  `testcases/TC_conan_hub_rows_audit_2026-11-01.md`.
- Its settings row in the module table is Modal + CloseOnESC (KRINIK MODIFIED, plan 40.3 B11).
