# Bug 35 — Svarog's Dream: grass around the hero melts away when the camera zooms out

**Status:** 🔧 fixed 2026-10-11 14:36 (KrinikColorRework 2.4.0, verified by the agent at zoom 40/100/160/240); DONE after the owner's eye
**Severity:** S2 — the owner's main view (zoomed-out camera) shows bald ground where the game has grass
**Version/build:** game release player, BepInEx 5.4.23.5; SvarogsDream `krinik.shaders` 928 859 B · **When/context:** 2026-10-11, owner's
report in chat

## Symptom

`[OWNER]` «трава возле героя исчезает даже просто при отдалении камеры=(» · «неужели трава столько ФПС кушает, что ты ее так сильно
ограничил?» · 2026-10-11. Reproduced at Bara (`testcases/TC_svarog_grass_zoom_vanish_2026-10-11.md`, C3): game zoom
`CameraFollow.targetZoom` 40 — dense grass; 70 — thinner; 100–130 — barely; 160 and more — none. Gradual, not a hard edge.

## Root cause

- Not a distance limit. Grass distance 500 m (our camera mod), fade `_ScaleFade` of all 16 Nature Shaders grass materials 480 m, the
  NatureManufacture far cull ×10, `_NatureRendererDistanceControl` 0, Nature alpha threshold ×0.3, grass distance 1500 m — none of them
  brought the grass back (C1, C2). The first guess from the code (unscanned materials keep the game's 100 m fade) was wrong.
- The texture grass of the terrains (Bara: `GrassDry01`, `Grass04`, `gr4` …) is drawn by Unity's own
  `Hidden/TerrainEngine/Details/WavingDoublePass` and `BillboardWavingDoublePass` (one material per terrain and shader) with an alpha
  test `clip(alpha − 0.375)`. Zoomed out, a 1 m blade is a few pixels, the texture comes from a small mip, the thin blades' alpha is
  averaged below 0.375 — whole blades are clipped. Lowering `_Cutoff` ×0.3 on those 75 materials brought the grass back at zoom 160 (C4).

## Fix

Own copies of the two Unity shaders (`unity/KrinikShaders/Assets/Shaders/KrinikGrassWaving.shader`, `KrinikGrassBillboard.shader`,
`KrinikGrassCommon.cginc`) with "coverage by mip" (Ben Golus, anti-aliased alpha test): alpha × (1 + mip level × 0.25) — nothing
changes at mip 0 (close), the coverage holds far. `src/KrinikColorRework/GrassCoverage.cs` swaps the shader of those materials (found
at start and when the set of terrains changes; off — Unity's shader back). Settings: Terrain → «Трава не тает при отдалении камеры»
(on), «Трава при отдалении: плотность» 0.25.

## Verification

C5–C7 of the TC (2026-10-11 14:35–14:38): 50 materials swapped; zoom 100/160/240 — the grass holds, zoom 40 — as in the game
(sheet `SvarogsDream/gallery/game/2026-10-11_трава-при-отдалении/`); FPS at zoom 160 off/on 74.0 / 74.2 / 73.8 — no cost; density
0.15 / 0.25 / 0.4 differ little. Report `testcases/reports/2026-10-11_svarog-grass-zoom-vanish.md`.
Not checked: mesh grass on `Hidden/TerrainEngine/Details/Vertexlit` (no such prototypes at Bara) and the Nature Shaders mesh grass —
they did not melt in the frames, but other places were not walked.
