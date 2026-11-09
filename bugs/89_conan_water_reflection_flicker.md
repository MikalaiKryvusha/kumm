# Bug 89 — Conan: the reflections on the water flicker, like the palm-leaf shadows on the sand did

**Status:** 🔴 OPEN · **Severity:** S2 (the look the owner picked for the build) · **Fixing:** this session, after plan 51's measurements (R, C1, D)
**Version/build:** Conan 3.0.1 + the build, KrinikConanGraphics Engine.ini with software Lumen reflections (shipped 2026-11-09 01:48)
**When/context:** 2026-11-09 15:45 +03:00, the owner watching plan 51's measured pass in front (five still river beaches, 11:00, weather frozen, NPCs frozen)

## Symptom

`[OWNER]` 2026-11-09 15:45 «сейчас видно, как отражения на воде мерцают. Очень похоже, как тени листвы пальм мерцали на песку».
Twin of the owner's queue item 7 of 2026-11-07 20:05 (STATUS): «с шеудером водыы, предположительно, похожая проблема, как и с шейдером тени листвы пальм - есть какая- то
неестественная рябь, что-то то появляется то исчезает» — fine sparkling speckles over the oasis water (that was BEFORE the software reflections shipped).
Expected: a still reflection of the far shore, cliffs and palms; no part of it blinking from frame to frame.

**The scene — the owner's frame 2026-11-09 15:45 («вот эта сцена» · «запомни её, потом исследуем продлему»):** `river_bend` of plan 51 — start (98739, 205258), march −80,
view −46 (`water-scenes.sh` spec `"river_bend 98739 205258 -80 -46"`, game map → five river beaches): red cliffs on the left, rock spires and jungle haze ahead, palms on the
right bank. On his frame (chat only, 1188×900 crop): short DARK HORIZONTAL DASHES and grain over the whole water surface, denser and finer towards the far shore, broken
streaks across the reflected haze — a scan-line-like pattern, not a smooth reflection. Our still 4K frame of the same view without the interface from the measured pass:
`ws-ram/03_river_bend_sw.jpg` (scratchpad) → to be copied here as the «before» frame.

## Repro (deterministic — to build)

The stand of plan 51: `water-scenes.sh` scene (weather frozen, NPCs frozen, 30 s, 11:00), the camera still; a 60 fps recording of the water (memory «UI flicker needs a 60 fps
video» — a frame series at 6–7 fps misses one-two-frame blinks), then a strip over time (`burst-strip.py`) of the reflected palms.

## Hypotheses (ranked, not yet checked)

1. **Swaying palm leaves in the reflection** — WPO foliage (the bug 67 class): the reflection traces the Lumen scene / distance fields, where the leaves' WPO is not the
   drawn position; leaf cards drop in and out. Control: wind / WPO off (or the palms hidden) → the blink must go.
2. **The sun step** `DynamicSky.SolarUpdateAngleDelta=0.0025` (bug 67's fix for the shadows) re-lights the Lumen scene every small step; the reflection's lighting
   updates in steps. Control: time frozen at 11:00 vs moving.
3. **Software Lumen reflection noise** — temporal denoise of rough reflections; screen traces are off by design (the owner banned screen-space reflection). Control: `off`
   mode on the same view (no reflection) and rays (variant 6) — does the blink follow the mode?

## Recon (2026-11-09 16:4x, no game)

**What the water is made of** (`retoc-5.8 list --path` over the game's utoc, listing in the session scratchpad): the sea AND the big river are one `WaterBodyOcean_2`
(game map). Candidates for its material: Epic's Water plugin `Engine/Plugins/Experimental/Water/Content/Materials/WaterSurface/Water_Material_Ocean` (+ `_LOD`; Single
Layer Water, Gerstner waves `Waves/GerstnerWaves_Ocean`) or Funcom's `ConanSandbox/Content/Environment/Water/Material/OptimizedWater/MI_water_4_way_pan_cheap_Ocean`.
Rivers and lakes elsewhere use `Environment/Water/Material/FLX/MI_Water_River_*` / `MI_Water_Standing_Lake_*`; the game also ships the FluidFlux marketplace system
(`Marketplace/FluidFlux/…`, with its own `MF_SSRTrace`, `MF_SSROutline`, `MF_SingleLayerWater`). **Which material `WaterBodyOcean_2` actually draws — to read live**
(`WaterBodyComponent:GetWaterMaterial()` / its MID by the remote).

**Known engine causes of this look (forums, UE 5.1–5.6 — not verified on 5.8):**
- Gerstner waves are World Position Offset; Lumen does not support WPO, so the reflection is traced from the flat surface while the drawn surface moves — streaks on
  waves ([forum: Single Layer Water reflection artifacts 5.1/5.2](https://forums.unrealengine.com/t/single-layer-water-reflection-artifacts-5-1-5-2/1171411)). The bug 67 class.
- Dense per-pixel normals make noisy reflections; workarounds: less refraction, screen traces off ([5.3 glitch](https://forums.unrealengine.com/t/rendering-glitch-in-unreal-5-3-lumen-reflections/1392035)).
- TSR ghosting / noise on water: the water writes no velocity → `r.VelocityOutputPass 1` (5.5) or `r.Water.SingleLayer.ForceVelocity 1` (5.6+)
  ([TSR ghost thread](https://forums.unrealengine.com/t/singlelayerwater-and-temporal-aa-ghost-effect/2677186)).
- Stripe artifact tied to full-resolution refraction → `r.Water.SingleLayer.RefractionDownsampleFactor`
  ([stripe thread](https://forums.unrealengine.com/t/stripe-artifact-renders-on-single-layer-water-surface/2719346)).
- Diagnostics: `r.Water.SingleLayer.Reflection 0` (reflections off on water only).

**Static read of the engine (2026-11-09 16:5x, the owner: «а ты не хочешь пока заняться шейдером? статически его почитать»):**
- Shaders (kit `F:/CEUE5Devkit/Engine/Shaders/Private/`): Lumen reflections run a separate pass for the water — `Lumen/LumenReflectionCommon.ush:27` «0: Opaque, 1:
  SingleLayerWater, 2: FrontLayerTranslucency», `:333-335` `ReflectionPass == 1 → IsSingleLayerWater`; the same downsampled tracing + temporal pipeline as opaque surfaces,
  on a surface whose waves move every frame. Composite: `SingleLayerWaterComposite.usf`, shading `SingleLayerWaterShading.ush`.
- The water pass has its OWN levers, registered in 3.0.1 (`ConanExiles/_config/cvars-registered.txt`); help texts read from the game exe (UTF-16 strings next to the
  names, script `cvar_help.py` in the session scratchpad — the help string PRECEDES its name in the exe):
  - `r.Water.SingleLayer.Reflection.Denoising` — «Whether to use denoising for Single Layer Water reflection traces. Adds some cost and makes reflections softer, but
    **removes noise and flickering**.» ← the owner's symptom, word for word.
  - `r.Water.SingleLayer.Reflection.DownsampleFactor` — «Downsample factor for Single Layer Water Reflection. Downsampling will introduce extra noise, so it's
    recommend to be used together with denoising (r.Water.SingleLayer.Reflection.Denoiser 1).» (the `.Denoiser` name of the help is not registered — `.Denoising` is.)
  - `r.Water.SingleLayer.Reflection.ScreenSpaceReconstruction` — «Usually not needed, as water has mostly mirror reflections.»
  - `r.Water.SingleLayer.Reflection.DownsampleCheckerboard` (help not separated), `r.Water.SingleLayer.TiledComposite`, `r.Water.SingleLayer.ForceVelocity`
    («0 none · 1 depth prepass (default, supports Motion Vector World Offset) · 2 base pass»).
- **Hypothesis 0 (ranked first now):** the water reflection is traced downsampled / checkerboarded WITHOUT its denoiser → per-frame noise on the waves = dark dashes and
  grain that blink. Not observed yet: the live values are unknown.

**Control ladder for the live session (same still view, 60 fps clip each, one lever at a time):** (0) READ the live values of the five water-reflection cvars above;
then `r.Water.SingleLayer.Reflection.Denoising 1` (if 0) — does the blink go? then `DownsampleFactor 1` / `DownsampleCheckerboard 0`; (1) `r.Water.SingleLayer.Reflection 0`
— does the blink go with the reflection? (2) `r.Water.SingleLayer.ForceVelocity` / `r.VelocityOutputPass 1` — TSR? (3) `r.Water.SingleLayer.RefractionDownsampleFactor 2`
— the stripes? (4) the waves frozen — WPO? (5) reflections mode `off` vs `sw` vs rays. Every lever that helps — its FPS cost A-B-A-B before it enters Engine.ini.

## Live result (2026-11-09 17:02–17:09, river_bend, cases `testcases/TC_conan_water_reflection_flicker_2026-11-09.md`)

- **Hypothesis 0 CONFIRMED in part:** the water reflection is full-resolution (DownsampleFactor 1, no checkerboard) but its denoiser is OFF (`Denoising 0`).
- Flicker metric (far-water band, frame-to-frame mean abs diff): shipped 5.64 / 5.39 · no reflection 1.23 · **denoiser on 4.17 / 4.11 / 4.05** · + half res 4.41 · TSR
  velocity modes 4.06 / 4.07 (no effect) · rays 5.43 → 4.66 with the denoiser. The remaining ≈ 4 is common to rays too — the reflection moving with the waves, not a defect.
- By eye (4K crop, folder 78): the dark dashes / grain go; the reflection gets softer, with soft dark blotches where the cliffs reflect — the owner's call.
- **Fix candidate:** `r.Water.SingleLayer.Reflection.Denoising=1` in KrinikConanGraphics' Engine.ini — waits for its FPS cost (KCCP's quiet window) and the owner's eye.

## Fix plan

**The owner's target** (`[OWNER]` 2026-11-09 16:59 «какой конфиг даст: - красивая вода и отркжения - без мерцаний - много FPS ?»). Candidates on top of the shipped `sw`
reflections, each judged at river_bend by a 4K frame + a 60 fps clip + a one-minute capture (the look — his eye, review folder; flicker and FPS — measured):

| Variant | Lines | Expected (not observed) |
|---|---|---|
| A — denoiser | `r.Water.SingleLayer.Reflection.Denoising=1` | the blink goes, the reflection a little softer; small GPU cost |
| B — full res + denoiser | A + `r.Water.SingleLayer.Reflection.DownsampleFactor=1` + `r.Water.SingleLayer.Reflection.DownsampleCheckerboard=0` | no blink, sharper; more GPU |
| C — half res + denoiser | A + `r.Water.SingleLayer.Reflection.DownsampleFactor=2` | no blink, the softest; the cheapest |

Rationale `[AI]`: the game is CPU-bound (CPU ≈ GPU 13–15 ms on the beaches), water-reflection work is GPU — a denoiser is expected to cost little FPS. Step 0 still first:
if the live `Denoising` already reads 1, hypothesis 0 is refuted and the ladder below goes on (waves / TSR velocity / refraction).

Control cases first (HOUSE_RULES rule 24: find who makes it), each A-B on the same still view with a 60 fps clip; the fix at the cause, then the cost A-B-A-B.
The owner foresees the route: `[OWNER]` 2026-11-09 15:45 «может и шейдер отражений в воде придется переписывать» — if the controls point at the water material, it is
overridden through the kit like bug 67's `M_Foliage` (our asset in the KrinikConanGraphics pak, `kit-buildmod.py`), not compensated by cvars.

## Decisions made without the owner

(filled at closing)

## Links

`bugs/67_DONE_conan_palm_leaf_shadows_flicker.md` · `games/ConanExiles/mods/KrinikConanGraphics.md` (water reflections section) · `testcases/reports/2026-11-09_conan-water-reflections-five-scenes.md` ·
`plans/51_DONE_conan_water_fps_after_ram_tuning.md`
