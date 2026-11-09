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
  velocity modes 4.06 / 4.07 (no effect) · rays 5.43 → 4.66 with the denoiser. The remaining ≈ 4 is common to rays too. ~~— the reflection moving with the waves, not a defect~~
  **CORRECTED 2026-11-09 17:21:** that conclusion was mine and wrong — the owner, after the A-B video: `[OWNER]` «с шумодавом лучше, но радикально проблему не решает» ·
  «мы с тенями решили радикаольно проблему». The remainder common to rays means the cause sits BEFORE the reflection method — the surface itself (sub-pixel wave normals
  at distance → specular aliasing), not that it is fine.
- By eye (4K crop, folder 78): the dark dashes / grain go; the reflection gets softer, with soft dark blotches where the cliffs reflect.
- The denoiser is a partial fix (owner: «лучше»); the RADICAL fix is at the cause, the way bug 67 was fixed in `M_Foliage`: the water material — identify the material live,
  read its parameters (normal detail / far normal / roughness), try them live by A-B videos, then override the material through the kit.

## The water material (live, 2026-11-09 17:28–17:40)

- `WaterBodyOcean_2` draws **FluidFlux**, not Epic's water material: `WaterMaterial` = `/Game/Maps/MI_OceanOver_EpicTest` (MIC) → parent
  `/Game/Marketplace/FluidFlux/Surface/Templates/Ocean/Materials/Permutations/MI_OceanOver_SCW` → master `/Game/Marketplace/FluidFlux/Surface/Materials/M_FluxSurfaceOver`;
  rendered through the MID `GetWaterMaterialInstance()` (`WaterMID_*`). The game map's material candidates were wrong — corrected there.
- Preset values (MI_OceanOver_SCW): `WaterRoughnessMin 0.07` (near-mirror), `WaterRoughnessFromFresnel 0.3`, `WaterRoughnessFromSpecular 0.007 / Div 0.997`,
  `DetailWaveHeight 25`, `DetailWaveLength 1000`, `DetailWaveRange 25000`, `WaveDetailWPOScale 1.1`, `WaveTextureRange 4000`, `WaveTextureFalloff 120000`,
  `StateVelocityScale 0.9`, `WaterSpecular (0.05, 0.4, 8, 0.2)`; switches `UseOcean`, `UseSimulation`, `UseSimulationBlend`, `UseDetailWave`, `UseCoastline` on,
  `UseFluxWaveDistant`, `UsePreciseCoastline`, `UseFoamDithering` off. EpicTest overrides only scattering / refraction / foam colour.
- **Live levers on the MID (denoiser on; flicker metric, base 4.0–4.3):** `WaterRoughnessMin` 0.15 → 3.78, **0.35 → 2.75 (−35 %)** · `DetailWaveHeight 0` 4.10 ·
  `DetailWaveRange 8000` 4.19 · `WaveDetailWPOScale 0` 3.84 · `WaterRoughnessFromFresnel 0` 4.40 · `WaveTextureFalloff 20000` 4.10 · `StateVelocityScale 0` 3.92 ·
  `WaveTextureRange 1000` 3.98. All restored after.
- **Reading:** the blink lives in the ROUGHNESS dimension — a near-mirror surface (0.07) with sub-pixel wave normals far away = specular aliasing; detail waves, their WPO and
  the simulation's flow are not it. A global roughness raise mattes the near water too (a look change). The radical fix at the cause: roughness that grows with
  DISTANCE (or with normal variance — specular anti-aliasing) inside `M_FluxSurfaceOver`, near water kept a mirror — a kit override like bug 67's `M_Foliage`.
  Next: read `M_FluxSurfaceOver` in the kit (T3D export) — where roughness and the wave normals are computed, which master parameters exist beyond the preset.

## The owner's spot and the engine levers (2026-11-09 17:22–17:35)

- **FPS cost of the denoiser = none** (KCCP's quiet window, river_bend, background, 60 s each, A-B-A-B): off 71.2 / 72.2 · on 71.8 / 72.9 FPS, 0 hitches.
- Engine state read live: `r.NGX.DLSS.Enable 0` (TSR, `r.AntiAliasingMethod 4`), `r.Lumen.Reflections.SmoothBias 0.3` (pulls reflections towards mirror), `r.Lumen.Reflections.
  Temporal.MaxFramesAccumulated 12`, `MaxRoughnessToTrace −1`. (I set DLSS to 1 by mistake at the end of one series — restored to 0, read back.)
- **The owner's spot** (`[OWNER]` 17:34 «мерцание особенно вот тут видно» · «я этот участок рассматриваю, где две горы отражается» — the far water under the two spires,
  box x 0.52–0.66 · y 0.465–0.52 of the frame; `flicker-metric.py … 0.465 0.52 0.52 0.66`): no reflection 0.97 · **shipped 6.18 / 6.23** · denoiser 3.46 / 3.57 (−44 %) ·
  + half res 4.20 · + roughness 0.15 2.90 · + roughness 0.35 2.08 · + 32 frames accumulated 2.85 · SmoothBias 0 3.17 · rays + denoiser 3.28 · rays alone 3.98.
  The wide band hid it: the spot is where the blink concentrates.
- Candidates for the owner's A-B videos: B1 = denoiser + 32 frames (no look change expected) · B2 = B1 + `WaterRoughnessMin 0.15` (MIC parameter of the water; a look change).

## The owner's verdict on the denoiser and the root hunt WITHOUT it (2026-11-09 17:38–17:55)

- `[OWNER]` 17:40–17:41 «вблизи резкая вода красивее, из-за четких светов и теней на ней» · «но в дали сильнее прыгает всё» · «сглаженная вода вблизи - мыльная» ·
  «вдали прыгает меньше» · «но вблизи некрасиво» · «нужно решать проблему мерцания в корне, чтобы без шумодава вода была четкой и не мерцало».
  → **The denoiser is REJECTED as the fix** (soap near). The target: no denoiser, near water sharp, far water stable. Global roughness is out for the same reason.
- Levers tried WITHOUT the denoiser at the owner's spot (base 4.9–5.4): `WaterRoughnessFromFresnel` 0.6 / 1.0 → 5.32 / 5.95 · Lumen 32 frames → 5.41 ·
  `r.TSR.ShadingRejection.Flickering 1` (was 0) → 5.34, Period 3 → 5.34 · `r.TSR.History.ScreenPercentage 200` → 4.73–4.81 (−10 %) ·
  `r.Lumen.Reflections.FixedStateFrameIndex 0` → 5.41 (the reflection rays' jitter is NOT it) · `WaveTextureDecodeNormal 0` → **12.65** (the wave texture's normal is the
  smooth part; without it something finer dominates) · `WaveTextureChoppiness 30` 4.76 · `StateSteepnessScale 0` 5.34 · `WaveTextureHeight 10` 4.86.
- Reading: the blink is the SURFACE — a mirror reflection of the dark spires and the bright sky sampled by wave normals finer than a pixel far away; the reflection method
  only scales it (sw 6.2, rays 4.0 raw). The source normal term is not found among the preset's levers.
- **Stopped poking (BUG_FIXING_FRAMEWORK: 3 attempts → research).** Next: `/bug-research` — FluidFlux's own documentation, changelog and forum (Imaginary Blend) on distant
  shimmering / specular aliasing; which normal terms the ocean preset combines at distance (`UseFluxWaveDistant` off, `UseWaterRoughnessAdvanced`, `MF_DistantLayer`,
  `MF_ImposibleNormalFix`, `DetailWaveUVSwitching`); whether the game ships a permutation with `UseFluxWaveDistant` / `UseWaterRoughnessAdvanced` on (another MI using them).

## Two more probes (2026-11-09 17:51–17:58)

- The game ships FluidFlux permutations `MI_OceanOver_{00W, 0CW, S00, S0W, SCW}` and `MI_OceanOver_Waves_Horizon` (the only one overriding `UseFluxWaveDistant` besides SCW).
  `SetWaterMaterial(MI_OceanOver_Waves_Horizon)` on `WaterBodyOcean_2`: the metric fell 6.66 → 1.29 — but the WATER VANISHED (the river bed showed): it is a horizon-edge
  material, not a fix. ~~Restored (`MI_OceanOver_EpicTest` read back).~~ **CORRECTED 18:30:** only the NAME came back — the water stayed GONE on screen (the owner: «ты решил воду вообще отключить? по сталину: нет воды - нет проблем?» · «ты видишь, что тут нет воды?»); `SetWaterMaterial` at runtime breaks the water body for the session, a game restart restores it. A metric number is never read without the frame.
- Render targets alive in the world (14): ripples / forces / interaction normal / sand / foam / water distance field / rain / UI — none is the ocean's wave texture, so
  «a wave render target without mips aliasing far away» is not supported; the wave normals come from ordinary textures (with mips) and the simulation state.
- Owner 17:49–17:50: «уверне, что вода красиво сделана во многих играх» · «и алгоритмы давно изучены и описаны в papers» → the research (`researches/fluidflux-distant-shimmer/`)
  also covers Toksvig 2005, LEAN 2010, LEADR 2013, Kaplanyan 2016 specular AA, Bruneton 2010 ocean lighting — and how each could apply without the FluidFlux source.

## Research levers tried (2026-11-09 18:10–18:27, research `researches/fluidflux-distant-shimmer/README.md`)

- The FluidFlux author documents no distant-aliasing fix; his 2.0 note «TSR antialiasing still causes some issues, so it is better to use TemporalAA». `WaveTextureDecodeNormal`
  is a divisor — the earlier «0 → 12.65» was a division by zero, not a clue. The Gerstner layer is compiled out (`UseFluxWaveGerstner` off) — `GerstnerNormalScale` could do nothing.
- At the owner's spot (no denoiser, base 5.76–5.84): `r.AntiAliasingMethod 2` (TAA) **8.85 — worse** · `CoastlineNormalFalloff 3000` 6.12 · `CoastlineNormalRange 100` 5.85 ·
  `FoamNormalScale 0` 5.44 · `WaterSpecularHorizonDistance 30000` 5.00 (−13 %, weaker far reflection — a look change).
- Shipped permutations `MI_OceanOver_{00W, 0CW, S00, S0W}` swapped in: 1.34–1.38 — every one makes the water INVISIBLE (frames), so no diagnostic value; and the swap broke
  the water for the session (EXP-0496).
- **Status:** no lever on the shipped material reaches the root. The research's conclusion: the real fixes (roughness from normal variance — Toksvig / LEAN; distance fade of the
  fine normal — Bruneton) need a rewritten water material (no FluidFlux source in the kit). That choice is the owner's.

## Epic's own water material — the same blink (2026-11-09 18:33–18:37)

- `SetWaterMaterial(/Water/Materials/WaterSurface/Water_Material_Ocean)` on `WaterBodyOcean_2` (the last step of a session, one-way): the water renders — turquoise, clear,
  near-mirror reflections of the spires (frame `ep_epic.jpg`); metric at the owner's spot 5.93 vs FluidFlux 6.58.
- `[OWNER]` 18:35 «она точно так же мерцает и шумит вдали». **Two unrelated materials blink alike far away → the root is NOT in FluidFlux** but in the shared path:
  Single Layer Water shading + Lumen reflections («forced to mirror» on SLW, Epic docs) + TSR. Rays blinked less raw (3.98 vs 6.2 FF).
- `r.ScreenPercentage` 0 (auto), `r.Upscale.Quality 3`, DLSS off; native `r.ScreenPercentage 100` → 5.66 vs 5.94 / 6.03 — the internal resolution is not it.
- Open: the engine side of far mirror reflections on SLW (Lumen water reflection pass without temporal history when its denoiser is off; TSR rejecting water history as
  moving). Engine shaders are in the kit; the engine binary is not ours to rebuild — only cvars and materials are reachable.

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
