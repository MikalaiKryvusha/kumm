# Water recon — Svarog's Dream (Lux Water): why the pond looks like "a hole in the ground"

> **Created:** 2026-10-12 · **Parent:** `ideas/13_svarog_otrazheniya_v_vode.md` · **Status:** recon done 11:05; fix in progress ·
> **Outbound:** variants (layers × resolution) with frame cost → to the owner as a sheet

Owner: `[OWNER]` «Шейдер воды как - дыра в земле, словно не хватает отражения.... и эффектов поверхности воды» · 2026-10-11;
«давай воду красивой сделаем, беремся за воду» · «шейдерами» · 2026-10-12. Earlier: «пусть примитивно, с минимум фпс затраченных» · 2026-10-10.

## Facts (observed, 2026-10-12 11:01–11:05, owner's save, pond by the village)

- Water asset: **Lux Water**, code in `Svarog's Dream_Data/Managed/Assembly-CSharp-firstpass.dll`, namespace `LuxWater`
  (`LuxWater_PlanarReflection`, `LuxWater_WaterVolume`, `LuxWater_UnderWaterRendering`, …; decompiled with `ilspycmd -p`).
- Pond: `WorldAreas/Area (98-100)/Content/Details/_WaterPlane (1)`, material `Water Swamp`, shader `Lux Water/WaterSurface Tessellation`,
  queue 2999. Five water planes nearby each carry `LuxWater_PlanarReflection` (enabled, `Resolution=Half`, `reflectSkybox=True`,
  `renderShadows=True`, `isMaster=False`).
- Material (`mats Water Swamp`): `_PlanarEnabled 1`, `_ReflectionStrength 0.63`, `_FresnelPower 5`, `_ReflectionBumpScale 0.3`,
  `_Glossiness 0.9`, Gerstner waves on, foam on, caustics on, `_Refraction 120`.
- **Root cause:** the reflection camera `_WaterPlane (1)ReflectionCamera` has `cullingMask = 0` (pult `camrt Reflection`): it renders
  **only the skybox** (frame `camrt_0.jpg` — blue sky with clouds, no terrain, no houses). `cullingMask = reflectionMask & ~Water`,
  so the component's `reflectionMask` is set to Nothing by the game's author — the planar reflection runs every frame and reflects
  only the sky. Hence mountains, forest and huts never appear in water (idea 13) and the water reads as a flat hole.
- Reflection camera: forward path, far 1000, half resolution (640×360 at 720p; 1920×1080 at 4K), with shadows — the cost of adding layers
  is a second scene render per visible water plane.
- Layers of the game: 0 Default · 1 TransparentFX · 2 Ignore Raycast · 4 Water · 5 UI · 6 River · 8 Ground · 9 Interactable ·
  10 PostProcessing · 11 Ragdoll · 12 Item · 13 Inventory · 14 CharacterModel · 15 Storage · 16 AdditionalLighting · 17 WoodPlatform ·
  18 Recipe.

## Results (2026-10-12 11:07–11:16, owner's save, 1280×720, `perf 8`)

| Variant | FPS | median | low1% | batches | look |
|---|---|---|---|---|---|
| author (sky only) | 52–60 | 15.6–16.4 ms | 10–11.6 | 5651 | water = sky |
| planar, Default+Ground+WoodPlatform, Quarter | 41.4 | 23.1 ms | 10.7 | 9981 | mountains in the pond — **too expensive** (owner closed the game) |
| planar, same, Half | 39.0 | 24.4 ms | 10.7 | 10320 | same |
| reflection probe 128, every 4 s, planar off | 50.2 | 14.9 ms | 7.5 | — | water dark olive, sky gone — **worse** |
| **planar, Ground only, terrain without grass and trees during the reflection pass, one camera, Quarter** | **54.2** | **16.3 ms** | **11.5** | 6148 | **mountains and shore in the pond, +0.5 ms** — default on |

The bottleneck is the main thread (Gfx wait ≈ 0): the cost of a reflection is the number of draw calls of the second pass, not
its pixels. Lesson — EXP-0222.

## Plan

1. Our mod sets `reflectionMask` of every `LuxWater_PlanarReflection` to a configured layer set (start: Default + Ground + WoodPlatform —
   terrain, trees, buildings), shadows in the reflection off, resolution a setting (Half/Quarter). Off → the author's values back.
2. Measure frame cost (`perf 8`) at 4K by the pond: author's · layers Half · layers Quarter.
3. Surface effects (ripples, glints, shore blend) — second step, by the same material after the reflection is in place.
