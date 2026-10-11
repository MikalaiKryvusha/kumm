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

## Plan (proposed, not started)

1. Export the map sprite texture to a file (harness command), read `map.rect` and `ActualMap` rect → world-units-per-map-pixel.
2. Zones as a coarse grid over the world (e.g. 10–20 m cells, a few hundred × few hundred), each cell a tag (desert, swamp, forest, snow,
   town, water…). First pass — classify the map image by colour; corrections — an HTML page over the map where cells are painted by click.
3. Shared runtime module `KrinikZones` (in `src/Shared`): `ZoneAt(worldPos)`, `Weight(zone, worldPos, radius)` for smooth blends.
4. First consumer: colour mod — day temperature per zone (desert 0, elsewhere −10), blended by distance; later per season.
5. Later consumers (owner's examples): monster spawns by zone, colour grading by zone.
