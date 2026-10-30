# Mod notes — KrinikConanRussianTranslation (ours: the Russian of every mod of the build)

> **Created:** 2026-10-30 · **Parent:** plan 36 W33 (the rename), the mod-notes lock (KAIF #186) — written from the pack's `_config/localization/README.md` and today's W6 work
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Not a pak: one `Game.locres` of the engine's localization target `Game` (plus `Game.locmeta`), installed as loose files into
`ConanSandbox/Content/Localization/Game/`. Manifest entry `KrinikConanRussianTranslation` (kind `files`, source folder `_config/localization/Game`).
Renamed from «Krinik Russian Translation» 2026-10-30 (W33). ≈54 451 entries (2026-10-30 19:0x).

## Where things are

- Source: `ConanExiles/_config/localization/Game/ru/Game.locres` (tracked in the pack); how it is built — `_config/localization/README.md` (steps 1–7:
  tables → `hosav-ru-entries.py` → kit `GatherText` compile → `locres-regress.py` → copy).
- Why loose files under our own target: a `.locres` inside a mod pak at a game path is refused by the mod loader (`ValidateMod_FilenameNotAllowed`,
  EXP-0090); a loose file over `Exiles_UI` loses to the pak; `+LocalizationPaths` in Engine.ini did nothing (README «три двери»).
- Our Russian over VANILLA strings (target `Exiles_UI`): `_config/localization/vanilla-overrides-ru.tsv`, applied by `_config/devkit/vanilla-override.py
  <Game.locres> <vanilla Exiles_UI.locres> <table>` after every full rebuild (the rebuild drops them); the vanilla Russian `Exiles_UI.locres` copy used
  2026-10-30 lies in `D:\Temp\claude\vanilla-ru\`. Letter fixes without a rebuild — `devkit/locres-set-tr.py` + `locres-fixes-*.tsv`.
- Deploy: `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanRussianTranslation` (one name per `-Only` when called through `-File`).

## Our edits of vanilla strings (vanilla-overrides-ru.tsv)

| Key (Exiles_UI) | Text | Why |
|---|---|---|
| `DA4E821B4EE35B69F5E9128CF11CB58F` | «Разделайте труп и получите ресурсы\nили нажмите {0}, чтобы забрать предметы» | the corpse prompt on two lines (W6), ON since 2026-10-30 18:4x — needs KrinikConanUI's `W_ActionTutorial` layout (`KrinikConanUI.md`) |
| four hold-suffix keys | «(удерж.)» instead of «(удерживайте)» | the owner 2026-10-30 08:32 (W10a) |

## Checks

- After any change: `python -I -X utf8 _config/devkit/locres-regress.py <before> <after>` — «пропало 0» is the gate (2026-10-30: 54450 → 54451, 0 lost, 0 changed).
- In game: the string seen in its widget (frame), e.g. W6 cases in `testcases/TC_conan_corpse_prompt_two_lines_2026-10-30.md`.

## Open

- A control run swaps the game's `Game.locres` for an older one by hand (W6 C1, 2026-10-30 19:3x) — redeploy the pack's file after it.
