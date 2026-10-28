# Smooth sun without leaf-shadow flicker: light rotation vs the VSM cache (Conan Exiles Enhanced 3.0.1, UE 5.8)

> **Created:** 2026-10-29 01:04 · **Parent:** `2026-10-29_recon.md` (this folder; cause H1 = the sun's light rotates almost every frame) ·
> KUMM `bugs/67_conan_palm_leaf_shadows_flicker.md` · **Status:** 🟡 recon done, no run yet · **Outbound:** none
>
> Question: can the sun move smoothly (`DynamicSky.SolarUpdateAngleDelta=0.003`) AND the palm-frond shadows stay calm, «как в других играх»?

## Bottom line

1. **No engine cvar tolerates small light rotation.** All 11 `r.Shadow.Virtual.Cache.*` names in this build were checked (list below).
   None has a rotation threshold or light-relative caching. Epic: «Any light movement or rotation will invalidate all cached pages for that
   light.» Funcom's `DynamicSky.SolarUpdateAngleDelta` already *is* the rotation-tolerance knob, one level up: the light holds still until the
   sun has moved Δ degrees.
2. **The invalidation itself is not what flickers.** Re-rendering a page with the same light direction gives the same pattern. What flickers
   is the shadow grid moving against the world. *Inference (UE clipmap snapping, not quoted source):* VSM texels are snapped in a light space
   that rotates about the world origin. A rotation by Δθ therefore slides the grid by |P|·Δθ at a point P. At about 2 km from the origin and
   about 0.003° per frame (0.2°/s at 70 fps) the slide is **about 10 cm per frame**, many finest-level texels. The real shadow of a 10 m palm
   moves only **about 0.5 mm per frame**. So the "smooth sun" costs almost nothing in shadow *position*, but it re-rolls the aliasing of the
   thin fronds every frame. A cache that ignored small rotations would give the same result as a larger `SolarUpdateAngleDelta`.
3. **The sky sun and the light are already separate in Conan.** Conan's sky is Ultra Dynamic Sky (`/Game/Marketplace/UltraDynamicSky/…`,
   log). UDS docs: the sun/moon orientation goes «constantly to the Sun World Rotation and Moon World Rotation variables… the lights update on
   their own periodic schedule» (the "Lights Update settings in the Directional Light category"). Funcom's help text says the same: «before we
   rotate the corresponding directional light to match». The disk moves smoothly at any delta. *[NOT-VERIFIED in game: confirm that the disk
   does not step at delta 2.0.]* What the owner saw as "ticks" at 2.0 was the **shadows** jumping (2° ≈ 35 cm at 10 m), not the disk.
4. **That leaves two real ways out:**
   (a) take the sun's shadows out of the light-space grid: ray-traced shadows (RT is compiled in this build and toggles live), or
   (b) keep VSM and pick a step that is too small to see as motion yet rare enough not to read as constant shimmer (about 0.05–0.25°),
   together with stronger shadow anti-aliasing.

## Findings table

Registry = `ConanExiles/_config/cvars-registered.txt` (3.0.1). Help texts come from `ConanSandbox-Win64-Shipping.exe` via `cvarhelp.py`
(read-only), 2026-10-29.

| name | what it does (quoted) | in registry | relevance |
|---|---|---|---|
| `DynamicSky.SolarUpdateAngleDelta` | «How many degrees can the sun/moon move in the sky before we rotate the corresponding directional light to match.» | ✅ (the only `DynamicSky.*` cvar) | **the** step knob; game ini 0.015f, pack 0.003 (log lines 756, 1874) |
| `DynLight.OverrideFrequency` / `.OverridePerTick` | «If non-zero, will override the subsystem's adjustment frequency.» / «…the number of lights adjusted per tick.» | ✅ / ✅ | Funcom light subsystem, scope unknown (probably placed lights). Read only, do not tune blind |
| `r.Shadow.Virtual.Cache.ForceInvalidateDirectional` | «Forces the clipmap to always invalidate, useful to emulate a moving sun to avoid misrepresenting cache performance.» | ✅ | perf / bookkeeping only (Fortnite uses it). Does not touch flicker |
| `r.Shadow.Virtual.Cache.FramesStaticThreshold` | «Number of frames without an invalidation before an object will transition to static caching.» | ✅ | per object, not per light. Irrelevant |
| other `…Cache.*`: AllocateViaLRU, CPUCullInvalidationsOutsideLightRadius, DebugSkipRevealedPrimitivesInvalidation, DeformableMeshesInvalidate, ForceInvalidateLocal, InvalidateUseHZB, MaxLightAgeSinceLastRequest, MaxPageAgeSinceLastRequest | none mentions light rotation | ✅ | **no rotation tolerance exists** |
| `r.Shadow.Virtual.Cache.StaticSeparate`, `…ClipmapPanning`, any "rotation threshold" or "UseRotationCaching" | — | ❌ | dead names, do not write |
| `r.Shadow.Scene.LightActiveFrameCount` | «Number of frames before a light that has been moving … goes to inactive state … spreads invalidations out over a longer time.» | ✅ | only blends the `…Moving` LOD bias. Moot while the pack sets both biases equal (-1/-1) |
| `r.Shadow.Virtual.PrefilteredDistant` + `.HistoryBlendFactor` | «experimental prefiltered distant shadow feature… `ProjectEnable` must be enabled» · «proportion of history to blend into the current frame» | ✅ ✅ ✅ | the only temporal-blend shadow feature, but distant levels only and needs cook-time shaders. Read `ProjectEnable` and expect 0 |
| `r.Shadow.Virtual.SMRT.TexelDitherScaleDirectional` | «Applies a dither to the shadow map ray casts for directional lights to help hide aliasing due to insufficient shadow resolution. Setting this too high can cause shadows light leaks near occluders.» | ✅ | **anti-aliasing of the re-roll.** The dither turns the pattern into noise that DLSS can accumulate |
| `r.Shadow.Virtual.ResolutionLodBiasDirectional` + `…Moving` | «-1.0 doubles resolution» | ✅ ✅ | finer grid, so each re-roll is smaller (recon R4) |
| `DirectionalLightComponent.SetLightSourceAngle` (UFunction, pult) | engine: wider source angle means a wider SMRT penumbra | exe string ✅ | blurs frond detail below the texel scale, so less aliasing. Look cost: softer sun |
| `r.RayTracing.Enable` | «Whether ray tracing is enabled at runtime. If r.RayTracing.EnableOnDemand is enabled, ray tracing can be toggled on/off at runtime.» | ✅ | log: `r.RayTracing:1`, `r.RayTracing.Enable:0`, «Ray tracing is enabled (dynamic). Reason: r.RayTracing=1 and r.RayTracing.EnableOnDemand=1» (lines 662–663, 1108) |
| `r.RayTracing.Shadows` (+ `.Lights.Directional`, `.EnableMaterials`, `.SamplesPerPixel`) | «0: use traditional rasterized shadow map (default) / 1: use ray tracing shadows» · «Enables ray tracing shadows for directional lights (default = 1)» · «samples-per-pixel for directional light occlusion (default = 1)» | ✅ all | **cures the cause**: rays are traced in world space, so there is no light-space grid to slide. Epic VSM docs: ray-traced shadows «take precedence over VSMs». Per light: `SetCastRaytracedShadow` (exe ✅) |
| `r.Shadow.Denoiser` | «0: Disabled (default); 1: Forces the default denoiser…» | ✅ | needed if RT soft shadows look noisy |
| `r.MegaLights.DirectionalLights` | «Whether to support directional lights.» Epic: «Directional lights are disabled by default and have to be manually enabled using r.MegaLights.DirectionalLights 1» | ✅ | second world-space path; stochastic + temporal denoise. Alpha-masked fronds: «only Screen Space Traces can correctly handle alpha masked surfaces» unless `r.MegaLights.HardwareRayTracing.EvaluateMaterialMode 1` |
| `r.MegaLights.Allowed` / `EnableForProject` / `DefaultShadowMethod` | «allowed by scalability and device profiles» · «0 - Ray Tracing. Preferred… 1 - Virtual Shadow Maps» | ✅ ✅ ✅ | the game ships MegaLights scalability lines (log 741–750), so the feature is probably cooked. `EnableForProject` value unknown, read it |
| `r.Shadow.Virtual.Enable 0` (CSM) / `r.DistanceFieldShadowing` | — | ✅ / ✅ (log: DF shadowing 1) | CSM snaps to a rotating light space too (same re-roll). DF shadows are world-space, but palm fronds in mesh SDFs are poor. Discriminators only |

## Ranked candidates (for "smooth AND no flicker")

| # | candidate | registry | expected effect | cost / risk |
|---|---|---|---|---|
| **1** | **Ray-traced sun shadows, delta kept at 0.003**: `r.RayTracing.Enable 1` then `r.RayTracing.Shadows 1` (default `.Lights.Directional 1`, `.EnableMaterials` read, keep 1 for masked fronds) | ✅ all; RT compiled and on-demand (log) | the shadow moves continuously at its true sub-mm/frame speed, with no grid, so no re-roll. The only lever that removes H1 instead of hiding it | several ms at 2228×1253 input; BVH VRAM; foliage needs any-hit for masks; palms may be Nanite with a coarse RT fallback; WPO sway may not appear in the BVH (then the shadows stand still while the fronds sway); 1-spp soft-shadow noise, so try `r.Shadow.Denoiser 1`. Must check that VSM really steps aside (Epic: RT «takes precedence») |
| **2** | **VSM, step 0.05–0.25°** instead of 0.003 (+ biases -1.5/-1.5 from recon R4) | ✅ | one re-roll every ~0.3–1.5 s instead of every frame, and calm in between (2.0 proved that calm). Shadow jump per step on a 10 m palm: 0.05° ≈ 0.9 cm, 0.1° ≈ 1.7 cm, 0.25° ≈ 4.4 cm, all far below the 35 cm "tick" of 2.0. The disk stays smooth (UDS) | a soft "blink" of the frond pattern at each step. The owner judges whether a 0.5 s blink beats continuous shimmer. Free in fps (fewer redraws than 0.003) |
| **3** | **Anti-alias the re-roll inside VSM** (with 0.003 or with #2): `r.Shadow.Virtual.SMRT.TexelDitherScaleDirectional` up (read the default first, try ×2), sun `SetLightSourceAngle` up (read first, try ×2), biases -1.5/-2.0, DLSS Quality/DLAA | ✅ ✅ ✅ / exe ✅ | smaller and noisier re-roll that DLSS can average. Mitigation, not a cure | dither: light leaks near occluders; wider angle: softer sun overall; bias: pages ×2 per -0.5 step; DLAA: fps |
| 4 | MegaLights for the sun: `r.MegaLights.DirectionalLights 1` (+ `DefaultShadowMethod 0`) | ✅ | world-space stochastic shadows, so no grid | experimental; fronds need screen traces or `EvaluateMaterialMode 1`; temporal noise and ghosting on swaying leaves are likely; may not be cooked (read `EnableForProject`) |
| 5 | `PrefilteredDistant` temporal blend | ✅ | far levels only | almost certainly not cooked; palms are near |
| ✗ | `Cache.ForceInvalidateDirectional`, `UseReceiverMaskDirectional`, `FramesStaticThreshold`, `LightActiveFrameCount` | ✅ | perf only; does not change the per-frame grid slide | — |

How other games do it (sourced where possible): Fortnite (UE5, continuously moving sun) found that «Simply throttling or skipping shadow page
updates produces obvious artifacts close to the camera». Its tree "base pose cache + reprojection" «looked poor in practice», and in the end it
re-renders the sun pages (`ForceInvalidateDirectional`). Epic notes that «it is fairly common to "cheat" a bit on this as long as the sun is not
moving too quickly». UDS (the sky Conan ships) separates the smooth sky sun from a periodically updated light, the same pattern as
`SolarUpdateAngleDelta`. *Inference:* games that look calm with a moving sun hide the re-roll with resolution, soft filtering and temporal AA,
or trace shadows in world space. None of them avoids the re-roll in a rotating shadow map.

## First run (one session, under the palms, live `exec` via the pult, A–B–A per the recon stand)

Stand as in `2026-10-29_recon.md` → "Stand": machine lock, `launch-bg.ps1`, God mode, fixed point, absolute camera,
`SetTimeOfDay(13.0)` before each pair, `capture-burst.ps1 -Count 40 -IntervalMs 25 -Width 3840`, `frame-diff.py` on a fixed sand box,
PresentMon for frame time.

0. **Read only** (send the name with no value): `r.RayTracing.Enable`, `r.RayTracing.Shadows`, `r.RayTracing.Shadows.EnableMaterials`,
   `r.Shadow.Denoiser`, `r.Shadow.Virtual.SMRT.TexelDitherScaleDirectional`, `r.MegaLights.Allowed`, `r.MegaLights.EnableForProject`,
   `r.MegaLights.DirectionalLights`, `r.Shadow.Virtual.PrefilteredDistant.ProjectEnable`, `DynLight.OverrideFrequency`; the sun light's
   `LightSourceAngle` and `CastRaytracedShadow` through Lua.
1. **A** = now (VSM, 0.003). **B1** = `exec r.RayTracing.Enable 1`, wait ~5 s for the BVH, then `exec r.RayTracing.Shadows 1` (delta stays
   0.003). **A** = `r.RayTracing.Shadows 0`, `r.RayTracing.Enable 0`. Look at: are frond shadows present and do they sway; flicker yes/no;
   noise; frame time; the log for RT errors. If the shadows are calm and still sway, that is the fix candidate.
2. In the same session, **B2** = VSM with `exec DynamicSky.SolarUpdateAngleDelta 0.1`, capture for 3 s across at least four steps; then 0.25.
   **A** = 0.003. Look at: is the frond pattern calm between steps, how visible is the blink at a step, is there any shadow "tick".
3. The owner gets both clips (B1, B2) in his review folder. The verdict is his eye. If B1 is too costly or noisy, take B2 + candidate 3
   (dither ×2, then light source angle ×2) as the next pair.

## Sources

- Epic, Virtual Shadow Maps — https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-shadow-maps-in-unreal-engine («Any light
  movement or rotation will invalidate all cached pages for that light»; Moving LOD bias; RT shadows take precedence)
- Epic tech blog, VSM in Fortnite Ch.4 — https://www.unrealengine.com/en-US/tech-blog/virtual-shadow-maps-in-fortnite-battle-royale-chapter-4
  (403 to fetch; quotes via search snippets: «fairly common to "cheat"…», «Simply throttling or skipping…», base pose «looked poor in practice»)
- Epic, MegaLights — https://dev.epicgames.com/documentation/en-us/unreal-engine/megalights-in-unreal-engine (directional off by default;
  RT default method; alpha-masked only with screen traces)
- Epic forum, «Constant invalidation of VSM dynamic shadows in 5.7.0» — https://forums.unrealengine.com/t/constant-invalidation-of-vsm-dynamic-shadows-in-5-7-0/2686534
- Epic forum, «Opaque shadows on clouds when using megalights + raytraced shadows» — https://forums.unrealengine.com/t/opaque-shadows-on-clouds-when-using-megalights-raytraced-shadows/2731841
  (a side effect: RT sun gives no VSM for volumetric clouds)
- Ultra Dynamic Sky 8.1 docs — https://www.ultradynamicsky.com/Documentation/V8/8-1 ("Lights Update settings in the Directional Light
  category"; Sun World Rotation as the intermediary)
- Exe help strings: `D:\Games\Conan Exiles 3.0.1\ConanSandbox\Binaries\Win64\ConanSandbox-Win64-Shipping.exe` (read-only scan, 2026-10-29;
  also UFunction names `SetLightSourceAngle`, `SetCastRaytracedShadow`, `SetSolarAngle`, `GetSolarUpdateAngleDelta`, class `ADynamicSkyBase`,
  `AConanTimeOfDayManager`, `UltraDynamicSkyHelper_UpdateRelevantAreaIndices`)
- Live values: `D:\Games\Conan Exiles 3.0.1\ConanSandbox\Saved\Logs\ConanSandbox-backup-2026.10.28-21.21.23.log` (lines 662–663, 725, 741–750,
  756, 1108, 1874, 3831)
- Not found: any UDS or Epic setting that keeps VSM pages across a small light rotation; no `r.RayTracing.Shadows` deprecation source for 5.8
