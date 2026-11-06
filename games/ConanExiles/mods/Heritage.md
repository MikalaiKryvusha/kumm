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
`ProfessionTemplate`, `StatTemplate`, `NPCClass` — so over Bosses My New Besties (loaded earlier) it wipes that mod's recruitability on 17 bosses (plan 45 step 4).

## Open

- 2026-11-06 (plan 45 step 4): wins 17 boss / elite spawn rows over Bosses My New Besties; loses 2 dialogue-NPC rows (Muriela the Artisan, Yakira) to Era of
  Trials.
