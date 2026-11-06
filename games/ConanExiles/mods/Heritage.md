# Mod notes — Heritage (Workshop 3726392245)

> **Created:** 2026-11-06 · **Parent:** plan 45 step 4, the knowledge-hook lock; facts from `ConanExiles/modpack.json`
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Human appearance redone system-wide: random appearance ranges rebuilt for both sexes of every race, the randomness removed for «special» NPCs,
162 NAMED characters given fixed faces, race presets of character creation fixed (manifest; the owner's pick of 2026-09-09).

## Assets

Its spawn rows reach the game's `Systems/SpawnTable/SpawnDataTable` (the log names it as the writer); the asset name is not «*spawn*table*» — list the
container (`UnrealPak <ExtractedMods>/Heritage-Windows.utoc -List`) to find it.

## Open

- 2026-11-06 (plan 45 step 4): wins 17 boss / elite spawn rows over Bosses My New Besties; loses 2 dialogue-NPC rows (Muriela the Artisan, Yakira) to Era of
  Trials.
