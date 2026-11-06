# Mod notes — Heritage (Workshop 3726392245)

> **Created:** 2026-11-06 · **Parent:** plan 45 step 4, the knowledge-hook lock; facts from `ConanExiles/modpack.json`
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Human appearance redone system-wide: random appearance ranges rebuilt for both sexes of every race, the randomness removed for «special» NPCs,
162 NAMED characters given fixed faces, race presets of character creation fixed (manifest; the owner's pick of 2026-09-09).

## Assets

`/Game/Mods/Heritage/` (listed 2026-11-06): spawn rows — `HeritageSpawnDataUniques` (the named characters) and `HeritageSpawnDataMasses` (the crowd), merged
into the game's `Systems/SpawnTable/SpawnDataTable` by `HeritageSpawnControl`; race templates `HeritageRaceTemplateUniques` / `…Special` / `…Masses`;
character-creation presets `HeritageCCMalePresets`, `HeritageCCFemalePresets`, `HeritageTrueHairCC`; `HeritageHub`; old copies under `Holdovers/` (not
merged — check before reading them as live). Read 2026-11-06 (`patch-mod-asset.py extract Heritage HeritageSpawnDataUniques|HeritageSpawnDataMasses`, imports
57 / 47): its spawn rows change `MaleRaceTemplate` / `FemaleRaceTemplate` (e.g. Keymaster → `Race_HyperboreanMale/Female`) and `LootTable`, and keep the game's
`ProfessionTemplate`, `StatTemplate`, `NPCClass`. **It does NOT wipe Bosses My New Besties (loaded earlier):** the game merges rows field by field — the live
`SpawnDataTable` (2026-11-06 11:09 +03:00, this pak unmodified) holds BMNB's four recruitability fields AND this mod's races on all 17 shared boss rows (plan 45 step 4,
`_config/live-rows.lua`). Corrected: an earlier line here said «wipes that mod's recruitability» from a file-level reading — false (KUMM EXP-0458). Ships unmodified.

## Open

- 2026-11-06 (plan 45 step 4): shares 17 boss / elite spawn rows with Bosses My New Besties — judged, the game merges them (above); 2 dialogue-NPC rows
  (Muriela the Artisan, Yakira) shared with Era of Trials — not judged yet (`live-rows.lua`).
