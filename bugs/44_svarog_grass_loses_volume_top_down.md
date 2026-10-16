# Bug 44 — Svarog: grass loses its green volume when the camera looks straight down (≈90°)

**Status:** 🔧 fixed 2026-10-17 02:05 (SvarogsDream `a38e9e0`), seen by the agent before/after from one camera spot; awaits the owner's eye (taste)
**Severity:** S3 (visual; owner-visible on the camera he uses)
**Version/build:** SvarogsDream `5f4137b` + working tree · **When/context:** 2026-10-13 evening, owner playing; tossed mid-task.
Owner's words: `[OWNER]` «шейдер травы странный. Если ровно под 90 градкусов камеру повернуть - зеленева травы исчезает» · «словно трава
тонкая, и под 90 нет объема травы» · 2026-10-13
**Test case:** `testcases/TC_svarog_loot_window_2026-10-13.md` W1
Again, 2026-10-14 ≈22:54 (while epic 26 batch 2 moved grass height onto the GPU): `[OWNER]` «трава выглядит плоским листом» · «когда камеру
вверх вертикально ставишь» · «то видно, что трава - тонкий без толщины спрайт» · «поэтому сверху трава смотрится некрасиво» · 2026-10-14

**Recon of 2026-10-14 22:37 that bears on this** (`testcases/TC_svarog_native_refactor_batch2_2026-10-14.md`, G1/G3): terrain grass is three
kinds — texture «to camera» `GrassBillboard` (296 of 791 prototypes at camp), texture standing `Grass` (214), meshes in `Grass` mode (281); all
of them now draw with OUR shader copies (`KrinikGrassWaving.shader`, `KrinikGrassBillboard.shader`, vertex functions `KrinikGrassCommon.cginc`),
so a top-down fix has its place. `[AI]` hypothesis: the billboard kind extrudes the blade along `_CameraUp` (`TerrainEngine.cginc`,
`TerrainBillboardGrass`) — with the camera straight down `_CameraUp` is horizontal, so the blade lies FLAT on the ground (the «flat sheet»);
the standing kind is seen edge-on (a thin line). Taste class — mock-ups on our meadow before any choice.

## Symptom
Camera pitch at the top limit (our camera mod: `MaxPitch` 90, clamped inside to `MaxSafePitch` 89.5, `KrinikCameraRework/Plugin.cs:742`)
— the green of the grass disappears; the grass reads thin, without volume. At lower pitch the grass is green and full.

## Repro
1. Any meadow (owner's save, day 10, Bara outskirts).
2. Rotate the camera down to the limit (≈89.5°).
3. Compare a `shot` at 85° and at 89.5° on the same spot.

## Hypotheses (ranked; nothing verified yet)
1. **Horses:** grass is vertical crossed quads (Unity terrain detail `WavingDoublePass` / Nature Shaders grass, bug 35 forensics) — seen
   straight from above, the quads are edge-on: only their thin edges and the ground remain. Standard remedies in the industry: tilt the
   quads toward the camera at steep angles (vertex shader), add a ground-tint layer under grass, or cap the pitch a few degrees short of 90.
2. Nature Shaders' view-angle fade (hides quads seen edge-on) fades the whole field at 90°.
3. Our grass changes (`krinik.shaders`, bug 35: alpha threshold ×0.3, fade distances) interact with the steep angle.

## Fix plan
Recon first (`researches/`): which shader draws the meadow grass at the hero (dump of `mats` near the hero), whether it has a view-angle
fade, how top-down games keep grass volume. Then a single change with frames at 85° / 89.5°, control with the change off.

## Root cause (confirmed by source + frames, 2026-10-17)
Unity 2020.3 `TerrainEngine.cginc` `TerrainBillboardGrass` extrudes the «to camera» blade along `_CameraUp`; with the camera looking down that
vector lies in the ground plane — the blade lies flat (the owner's «flat sheet»). Standing grass (`WavingDoublePass`) is vertical quads — edge-on
from above. Hypothesis 1 confirmed; 2 and 3 not needed.

## Fix (2026-10-17, SvarogsDream `a38e9e0`)
`KrinikGrassCommon.cginc`, global `_KrinikGrassTopDown` (setting `Terrain.GrassTopDown`, default 1, 0 = as the game): the billboard «up» never drops
below sin 35° (what the game camera at 55° gives); standing grass leans from the root up to 50° when seen straight from above, the direction per
2×2 clump, length kept. Nothing changes at 55° or flatter.

## Verification (TC `testcases/TC_svarog_camera_director_grass_water_2026-10-17.md` G1–G4, report `testcases/reports/2026-10-17_svarog-camera-director-grass-water.md`)
One camera spot (`CamOrbit -608.5,130.1,-215.5 0 89.5 30`, meadow at the camp), the global switched 0 → 1: brown ground with sparse thin blades →
dense green (`SvarogsDream/_harness/g_pair.webp`); 55° identical (`g3_pair`), 72° smooth (`g4_pair`). Shown to the owner 02:06 (opened in the viewer).

## Decisions made without the owner
- `[AI]` 35° minimum blade rise and 50° lean — taken from the game camera's own 55° look, not tuned by eye; the owner's eye decides (taste).
- `[AI]` default ON (1); `Terrain.GrassTopDown` 0 returns the game's look.

## Links
`bugs/35_DONE_svarog_grass_melts_at_zoom_out.md` (grass materials and shaders inventory)
