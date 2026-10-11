# Research — world zone map for Svarog's Dream (shared by all our mods)

> **Created:** 2026-10-11 · **Parent:** owner's word in chat · **Status:** recon started 2026-10-11 13:57; nothing built ·
> **Outbound:** —

## The ask

`[OWNER]` «о, прикольно, если ты можешь карту мира зонами разметить! Может много для чего понадобится в будущих модах. Например, где какие
монстры спавнятся, где какой цветокор и так далее» · 2026-10-11. First consumer: the colour mod — day temperature −10 everywhere except the
desert (`[OWNER]` «-10 нравится везде, кроме пустыни - пропадает жарость песка»).

## What is known (observed 2026-10-11)

- **No desert flag in the game.** `WorldState` has only `isAtKorenIsland`, `isAtPantheonOfOak`, … ; enum `WorldArea` = `HollyEmpireTown,
  HollyEmpireBor, UnitedTownsSwamp, BezdanTavern` — towns, not biomes. Weather: `WorldWeatherManager.isRaining/isSnowing`, no zones.
- **Ground layers do not tell the desert.** Harness `ground`: at Bara 35 % of `t26-desert2` under the hero; at Death Pits (the hot sand)
  `t19-road2` 0.64 + `t33-mud` 0.36 and no desert layer (`testcases/TC_svarog_ground_recon_2026-10-11.md`). → zones must come from the map.
- **World ↔ map formula (decompiled `WorldMap`, ~line 722):** `playerOnMap.anchoredPosition = (map.rect.width * x / 300, map.rect.height *
  z / 300)` — the `map` RectTransform's size equals ONE world area (300 × 300 units, the streaming tile), the map's origin is world (0, 0).
  So the transform is exact: map pixel = world / 300 × rect size, no fitting by eye. Map image: `ActualMap`, sprite
  `MapaFinalnaVerzijaReducedSize_Natural` (our natural-colour palette version), with `Fog` over it.
- **Seasons exist:** `WorldDateTime.SeasonOfTheYear` (Spring, Summer, Fall, Winter); winter changes day length. No air temperature.
- **The game already tags every world area — by its ambient sound (decompiled 2026-10-11 14:06, ilspycmd over `Assembly-CSharp.dll`).**
  Each 300 × 300 area is a `TerrainId` (`Row`, `Column`, `worldAudioAmbient`); enum `WorldAmbients` = `Fields, Woods, Swamp, Ancient,
  Underworld, Towns, Ocean, Desert, Snow, Pantheon, Heavens, Island, IslandAncient, IslandWoods, FirstWorld`. The area under the hero is
  `WorldState.playerArea` (set by `WorldStreamingManager.GetCurrentTerrainId`, the closest terrain). → **a coarse zone map for free**:
  dump all `TerrainId` (row, column, ambient) → the first pass of our zones; our own cells only refine it (edges, sub-area spots).
- **Snow in the desert — the game guards it by that tag.** The hourly roll `WorldTime.TriggerTimeRelatedEvents`: after quest `Thunder` is
  done and only if `playerArea.worldAudioAmbient` is neither `Desert` nor `Ocean` — in winter snow 10 % per hour (else rain 5 %), other
  seasons rain 0.5 % per hour; 60 s each. Snow turns on buff `Cold` (spell power −40 %, `CastSpell.cs` ~966); no snow, no rain in
  dungeons, the underworld, Iriy, Pantheon, Heavensgate, World's End, First World (`IsNoWeatherZone`). Potions and quests can force snow
  anywhere (`ConsumeManager` 300 s, `PathOfNonDoing3`, the Morana fight). No temperature exists; cold is only "snow is falling".

## Temperature as a system (the owner's wish, 2026-10-11)

`[OWNER]` «в Palworld и Medieval Dynasti классно сделано, что меняется температура, возле костров и факелов теплее, в разных местах
карты меняется температура, в разные поры года и времена дня» · «и в Римворлде так сделано» · 2026-10-11 14:06. Proposed shape (not
started): air temperature at the hero = zone base (from the ambient tag + our cells) + season offset + time-of-day curve + heat sources
nearby (fires, torches, forges — found by their objects or lights in the loaded areas). Readers: the colour grading first (warm/cold
tint instead of a fixed −10), later a HUD readout, and gameplay hooks (the game's own `Cold` buff, breath) only by the owner's word.

## Plan (proposed, not started)

1. Export the map sprite texture to a file (harness command), read `map.rect` and `ActualMap` rect → world-units-per-map-pixel.
2. Zones as a coarse grid over the world (e.g. 10–20 m cells, a few hundred × few hundred), each cell a tag (desert, swamp, forest, snow,
   town, water…). First pass — classify the map image by colour; corrections — an HTML page over the map where cells are painted by click.
3. Shared runtime module `KrinikZones` (in `src/Shared`): `ZoneAt(worldPos)`, `Weight(zone, worldPos, radius)` for smooth blends.
4. First consumer: colour mod — day temperature per zone (desert 0, elsewhere −10), blended by distance; later per season.
   `[OWNER]` «кстати, если ты разметишь карту, то мы сможем и "карту температур ввести" - которая, кстати, будет от поры года
   зависеть» · 2026-10-11 14:03. Shape: a **temperature map** = per zone a base value plus a per-season offset
   (`WorldDateTime.SeasonOfTheYear`), sampled at the hero with the same distance blend; the grading reads it, not a fixed −10.
   Other readers can use it later (breath, snow, NPC lines). Values are the owner's to taste, proposed as a sheet of variants.
5. Later consumers (owner's examples): monster spawns by zone, colour grading by zone.
