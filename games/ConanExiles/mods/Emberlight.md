# Mod notes — Emberlight (another author's)

> **Created:** 2026-11-07 · **Parent:** the knowledge-hook (a notes file before mod work), bug 64 item 13
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Farming and husbandry: gardens, animal pens and breeding corrals, decorative trees, an entertainer, its own settings. UI modules (live
2026-11-07): `UIEntertainerVolume`, `W_AnimalPen`, `W_BreedingCorral`, `UIGarden`, `UIHortiSettings`, `W_DecoGUI`, `W_WaterBlurEmber`, `EmberlightConfirm`,
`EmberlightMasterConfig` (table `/Game/Mods/Emberlight/Shared/DataTables/DT_Ember_UIModuleTable`).

## Our edits

| Where | Edit | Why |
|---|---|---|
| translation `dm-fish-ru.tsv` rows 8388, 7534 (`UIHortiSettings`) | two farming descriptions wrapped with a line break | cut at the panel's right edge (frame 2026-11-07 09:0x; `locres-fixes-2026-11-07b.tsv`) |
| translation row 1209 (one source «Save Settings» for every mod) | «Сохранить» | «Сохранить настройки» ran over the button's icon in `EmberlightMasterConfig` and `UIHortiSettings` |

## How to look inside

`python -I -X utf8 _config/devkit/patch-mod-asset.py extract Emberlight <Asset> <work>` (the container name to confirm on the first extract); windows by the remote —
`bash _config/walk-mod-windows.sh <dir> <module>` (game map, «The mods' UI modules»).

## Open

- **The animal pen (`W_AnimalPen`) shows «FOOD», «WATER», «ADD», «REMOVE» in English** (frame 2026-11-07 09:41, bare module). Read 09:4x: the container is
  `Emberlight` (`extract Emberlight W_AnimalPen` — 243 exports, 391 imports); all four are CULTURE-INVARIANT FText («FOOD» ×1, «WATER» ×1, «ADD» ×2, «REMOVE» ×5)
  → an `asset-strings/Emberlight__W_AnimalPen.tsv` («FOOD ⇥ ЕДА», «WATER ⇥ ВОДА», «ADD ⇥ ДОБАВИТЬ», «REMOVE ⇥ ЗАБРАТЬ» — to fit, check by a frame) and a
  `krinikBuild` entry for Emberlight (KRINIK MODIFIED), like Ironlight's admin panel. 15 candidates of `DT_HortiDecoPrimaryButtonsTable` in `_config/compat/ui-overflow-candidates.tsv` wait for
  a frame of the decoration window.
