# Mod notes — Ironlight Settlements (another author's; KRINIK MODIFIED)

> **Created:** 2026-11-07 · **Parent:** the knowledge-hook (a notes file before mod work), bug 64 items 13 and 20, plan 36 item 14
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Settlements of thralls: a town centre, resource beacons, needs, skills, training, a settlement log. Manifest entries `Ironlight-Settlements`
(Workshop 3741725671, the pak `Ironlight-Core`, KRINIK MODIFIED, source folder `_krinik-modified/3741725671`) and `Ironlight-Settlements-RPG` (Workshop 3780656133).
UI modules (live 2026-11-07): `IronlightTownCenter`, `IronlightTargetSelection`, `IronlightMontageSelection`, `IronlightTalkToClaude`, `IronlightBeaconPanel`,
`IronlightLogisticBeacon`, `IronlightAdminUI`, `IronlightPlaceableInfo`, `IronlightShop`, `IronlightSchedulerPanel`.

## Our edits

| Where | Edit | Why |
|---|---|---|
| `IL_WBP_AdminUI` (widget, 2026-11-07, pack `6413000`) | «ПОСЕЛЕНИЕ», «ТРЕНИРОВКИ И РАБОТА», «ПОТРЕБНОСТИ», «НАВЫКИ», «СОХРАНИТЬ», «ЗАКРЫТЬ» (`_config/localization/asset-strings/Ironlight__IL_WBP_AdminUI.tsv`) | culture-invariant FText (`Flags: CultureInvariant`, `CultureInvariantString`) — the `.locres` never reaches them; `uaj` replaces the invariant string by the exact old text; seen 09:28 |
| `IL_DT_EventPhrases` (table) | 23 settlement-log phrases in Russian (`_config/localization/il-event-phrases-ru.tsv`; no past tense — the settler's sex is unknown) | the `.locres` does not reach this table (bug 64 item 20, plan 36 item 14, 2026-10-28) |

Rebuild after a mod update (the original in `_patch-originals`): `python -I -X utf8 _config/devkit/patch-mod-asset.py build Ironlight-Core IL_DT_EventPhrases <work>
_config/localization/il-event-phrases-ru.tsv _config/localization/asset-strings/Ironlight__IL_WBP_AdminUI.tsv IL_WBP_AdminUI` → `<work>/out/Ironlight-Core.pak` into
`D:/Games/Conan Exiles Mods/mods/_krinik-modified/3741725671` (the library, not git; `modpack.json` `krinikBuild`).

## The admin panel (`IL_WBP_AdminUI`, module `IronlightAdminUI`)

- Its gathered strings (rows 1111–1130, 1209–1212 of `dm-fish-ru.tsv`) are Russian in game; the section headers «SETTLEMENT», «TRAINING & WORK», «NEEDS»,
  «SKILLS» and the buttons «SAVE» / «CLOSE» are English — they are not in `all-mods-ftext.csv` at all (frame 2026-11-07 09:12, a bare-module walk).

## How to look inside

`python -I -X utf8 _config/devkit/patch-mod-asset.py extract Ironlight-Core <Asset> <work>` → `<work>/<Asset>.json`. `IL_WBP_AdminUI` (2026-11-07): 189 exports,
175 imports; the six headers/buttons are `TextPropertyData` with `Flags: CultureInvariant`, `HistoryType: None`, the text in `CultureInvariantString` — one
occurrence each.

## Open

- The admin panel's English headers and buttons — FIXED 2026-11-07 09:28 (table above).
