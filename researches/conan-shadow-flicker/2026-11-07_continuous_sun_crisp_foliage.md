# Research — continuous sun + crisp palm shadows without flicker: what is left after 11-07 refutations

> **Created:** 2026-11-07 (helper agent, web + local read-only, no game run; read 15:37 +03:00) · **Parent:** bug 67 ·
> **Status:** recon done; the experiments below are not run · **Outbound:** experiment order → the main session (bug 67)
>
> This builds on `2026-11-06_vsm_foliage_recon.md` (patterns A–H, not retold here), `2026-11-06_engine_cvars_read.md`, the 10-29 notes and
> `testcases/reports/2026-11-07_conan-palm-shadow-levers-wind-steps.md`. Registry = `ConanExiles/_config/cvars-registered.txt`. Every name was grepped
> as an exact line (✅ present / ❌ absent). Help texts were read from `ConanSandbox-Win64-Shipping.exe` (UTF-16 scan, read-only), and the configs from the Dev Kit `F:/CEUE5Devkit/UE4/Config/`.
> Marks: **[SRC]** quoted source · *[INF]* inference · **[UNC]** unverified.

## 0. The owner's acceptance and what it rules out

Smooth light (no step of any size) + crisp shadow (no blur, no wider penumbra) + no frame-to-frame frond pop. That removes patterns A, C and E-with-blur
of the 11-06 table. Pattern B survives only in a form that makes no visible jump (§1.4). Two families remain. (1) A world-space shadow test against
full-detail geometry: ray tracing, or screen-space as a complement. (2) A shadow map whose resolution stays stable while the light turns. §2.1 shows
that this build may NOT keep it stable.

## 1. Shipped practice (question 1)

1. **Texel snapping cannot fix rotation.** «snapping only removes shimmer from camera translation… if the directional light rotates (e.g., dynamic
   day/night cycles), the shadow map will still shimmer because texel orientations rotate relative to world geometry» **[SRC: search excerpt of
   https://salivity.github.io/glsl/article/fixing-shadow-shimmering-with-texel-snapping; page not fetched, UNC]**. No source found offers a sub-texel
   "rotate only by whole-texel angles" scheme. *[INF: a direction change moves casters and receivers by different amounts (∝ height), so no angle
   maps every texel onto a texel. This is the classic moving-thin-caster aliasing, and only resolution or a non-grid test cures it.]*
2. **Quantize the rotation** is the textbook VSM answer: «With a dynamic time-of-day system, all pages would be invalidated every frame… the Sun's
   rotation can be quantized such that invalidation only occurs every N frames» **[SRC: https://graphics-programming.org/blog/virtual-shadow-maps §4.3]**.
   The owner rejected this.
3. **Temporal filtering of the shadow result:** «temporal filtering causes temporal lag… but shimmering is totally eliminated» · «temporal antialiasing
   has the nice side effect that it also works as a noise filter» **[SRC: search excerpts of gamedev.net threads 666828 / 588182; the pages answer 403,
   UNC]**. In UE this already happens through SMRT per-frame noise + DLSS (11-06 Finding 5). It hides the pop only by averaging, and its lag looks like softness.
4. **Interpolate two stable shadow maps** (the non-jumping form of pattern B): one developer «generate[d] two shadow map sets for discrete light
   positions and interpolate[d] between them in the shader… relatively OK while eliminating the edge shimmering for a slow-moving light» **[SRC:
   search excerpt, https://gamedev.net/forums/topic/676190-interpolating-between-directional-shadow-maps-to-reduce-edge-shimmer/, 403, UNC]**.
   *[INF: with 0.1° steps (≈2 cm shadow shift, 11-07 report) blended over the whole step interval, the edge never jumps. It slides, and it is at most ~1 texel
   wide during the blend, so it stays crisp. Both maps keep a FIXED direction, so neither re-rolls. In UE this means two directional lights crossfaded by
   intensity. The atmosphere sun coupling and the cost of a second VSM need a check. This is Dev Kit or Lua work, see §3 path C.]*
5. **Screen-space sun shadows (Bend Studio, Days Gone)** «greatly improving distant shadow detail… complement shadow maps by capturing small details
   that would be exceedingly difficult to capture with traditional, non-ray traced methods»; «the first title to use this technique for sun light
   shadows» **[SRC: https://www.bendstudio.com/blog/inside-bend-screen-space-shadows/]**. Limits: «prone to artifacts at the edges of the screen…
   since it only uses depth, partial artifacts may occur» **[SRC: https://winter-crown-works.com/en/tech/003/]**. It traces the depth buffer in world
   or screen space, so it has no light-space grid and does not re-roll under rotation. It only catches casters that are on screen.
6. **Ray-traced sun shadows with full geometry**: «These shadows can be more accurate than traditional shadow maps»; «smaller values sharpen the shadows»
   (source angle) **[SRC: https://dev.epicgames.com/documentation/en-us/unreal-engine/hardware-ray-tracing-in-unreal-engine]**. This is the only family
   that gives smooth + crisp + no grid re-roll. Its condition is that the BVH holds the leaves. In this build it showed blobs (11-07). §2.2 shows why
   and what is left to try.

## 2. UE 5.8 specifics (question 2)

### 2.1 VSM: nothing tolerates rotation, but resolution throttling can make a rotating sun worse

- 11-06 already found that no `r.Shadow.Virtual.*` keeps pages across a rotation. Epic's Fortnite answer was uncached + accept the shimmer. Nothing new
  overturns this. The 5.8 staff thread names no moving-light feature **[SRC: https://forums.unrealengine.com/t/vsm-cached-page-mode-in-5-8/2843727]**.
- **New: VSM dynamic-resolution throttling exists and is cost-driven.** Exe help, 3.0.1:
  `r.Shadow.Virtual.DynamicRes.MaxResolutionLodBias` ✅ «As memory or compute-time cost limits are approached, VSM resolution ramps down by biasing the LOD
  up… Memory pressure is based on page allocation compared to pool capacity… 0 = disabled» (UE 5.4 default 2.0 **[SRC: https://indxzero.github.io/ue544cvarwiki/articles/r.shadow.virtual.dynamicres.maxresolutionlodbias, UNC for 5.8]**);
  `…DynamicRes.MaxPagePoolLoadFactor` ✅ «If allocation exceeds this factor of total page pool capacity, shadow resolution will be biased downwards. 0 = disabled»
  (5.4 default 0.85, same wiki); `…DynamicRes.LoadBudget` ✅ «Scale LOD bias based on an estimate of the ShadowDepths load… Experimental»;
  `…DynamicRes.TimeBudgetMs` ✅; `…DynamicRes.PerVSMBiasHistoryWeight` ✅ «Smoothen out the per-VSM LOD bias over time»;
  `…DynamicRes.MaxComputeResolutionLodBiasDirectional` ✅. Epic staff (5.8 thread): «it was key to us not dropping frames… on the Witcher demo»;
  «You can see the status of throttling in the vsm stats view» (`r.Shadow.Virtual.ShowStats 1` ✅); «it is also not designed to mitigate performance
  spikes». The Witcher demo used `LoadBudget` 1.2–1.5 and `MaxComputeResolutionLodBiasDirectional` 0.2. The live 3.0.1 values are **[UNC]** and must be read.
- *[INF] Why it fits the 11-07 numbers.* A cached (still) sun draws few pages, so neither load nor pool pressure builds. A sun that turns every frame
  re-renders the whole clipmap, so both rise and the throttle raises the LOD bias, coarsening texels only while the sun turns, by a smoothed amount that drifts
  with load. That would explain the anomaly in the report: finer texels (−1.5, −2.0) came out **equal or worse** (0.34–0.70 vs 0.19–0.32), while pure
  aliasing predicts better. Finer texels ⇒ more pages and more clusters ⇒ more throttling and pool pressure. The pool is small for 4K. The game's Cine has
  `r.Shadow.Virtual.MaxPhysicalPages=4096` (kit `DefaultScalability.ini` `[ShadowQuality@Cine]`), and the pack sets the same 4096 (`_unpacked/KrinikConanGraphics/Engine.ini:261`).
  ×2 comes only via `MaxPhysicalPagesScale=2.0` in the `Windows_HighVRAM` profile (kit `DefaultDeviceProfiles.ini:857`), and whether that profile is
  active is **[UNC]**. The 11-06 note "Moving bias = static bias, so the resolution is not lowered" did not cover this second path.
- `r.Nanite.VSMInvalidateOnLODDelta=1` is set by Funcom (kit `DefaultEngine.ini`, «Bugfix for Nanite + Tesselated landscape shadow artifacts») ✅. It is
  an invalidation source, not a rotation stabilizer. It is listed only so that nobody turns it off by mistake.
- Funcom has its own **adaptive system** (`UConanAdaptiveSystemComponent`, a class name in the exe; kit `DefaultDeviceProfiles.ini [Windows DeviceProfile]`
  `+AdaptiveSystemSettings=(Map=EXILESMAP_ExiledLands, MinShadowDistanceScale=0.00, MaxShadowDistanceScale=0.85, MinStaticMeshLODDistanceScale=5.00,
  MaxStaticMeshLODDistanceScale=1.00, … MinShadowRadiusThreshold=3.00, MaxShadowRadiusThreshold=0.04)`). Whether it runs on PC, and which cvars it drives
  (`r.StaticMeshLODDistanceScale` ✅, `r.Shadow.RadiusThreshold` ✅, `r.Shadow.DistanceScale` ✅), is **[UNC]**. If it reacts to GPU time, a re-rendering sun
  would swap palm LODs, and the frond geometry in the shadow would pop. It costs one read to rule out. Nothing in KUMM or ConanExiles mentions it so far.

### 2.2 Ray tracing: why the shadows came out as blobs, and the levers not tried yet

- In 5.7+ a Nanite mesh gets a dedicated **Ray Tracing Proxy**, separate from the Nanite fallback **[SRC: Epic staff via search,
  https://forums.unrealengine.com/t/handling-raytracing-proxy-meshes/2736791]**. «The proxy is rebuilt at cook for each platform…»; «LOD0 is added with
  MaxNumOfTriangles = MAX_uint32, so it's the unreduced Nanite LOD0 mesh»; «Only two proxy LODs exist (LOD0 = full, LOD1 = LOD1MaxNumOfTriangles)»,
  and LOD1MaxNumOfTriangles defaults to **64**; «LOD1 is reached only by setting r.RayTracing.Geometry.NaniteProxies.LODBias = 1», or by
  streaming/residency fallback when the LOD0 BLAS is evicted or not built yet; LODBias «per device profile… without recooking» **[SRC: same thread,
  Tim Stullich, Epic-Pro-Support tag]**. *[INF: a 64-triangle palm is exactly a "blob". The 11-07 blobs point at proxy LOD1, through a LODBias ≥ 1
  or a BLAS still being built. A full-leaf proxy LOD0 may already sit in the cooked data.]*
- Funcom ships `r.RayTracing=1`, `r.RayTracing.Enable=0`, `r.RayTracing.RayTracingProxies.ProjectEnabled=True` (kit `DefaultEngine.ini`). Help:
  «Whether ray tracing proxies are generated by default for this project», a cook-time setting *[INF]*, so flipping it at runtime should do nothing.
- Runtime levers (exe help):
  `r.RayTracing.Geometry.NaniteProxies` ✅ «0: … not created. 1: … added to the RayTracing scene (default). 2: … runtime culled… keeps the cached state for fast
  toggling»; `r.RayTracing.Geometry.NaniteProxies.LODBias` ✅; `r.RayTracing.Geometry.NaniteProxies.WPO` ✅;
  `r.StaticMesh.RayTracingProxies` ✅ «Whether to use dedicated ray tracing LODs»; `r.StaticMesh.RayTracingProxies.LOD1MaxNumOfTriangles` ✅
  (build-time per the thread); `r.RayTracing.Nanite.Mode` ✅ «0 - fallback mesh (default); 1 - streamed out mesh; 2 - use CLAS».
  Epic docs: «0 (default) supports Nanite's fallback mesh. 1 supports the streamed out mesh» **[SRC: HWRT doc above]**. Mode 1 «preserves all detail while
  using significantly less GPU memory than zero-error Fallback Meshes», though it is «experimental» and can «suffer from strange corruption issues» **[SRC:
  https://forums.unrealengine.com/t/ray-tracing-full-nanite-meshes-supported-in-5-1-preview/663855]**. The VRAM growth is large in 5.6
  **[SRC: https://forums.unrealengine.com/t/nanite-and-raytracing-using-increasing-amounts-of-vram-in-5-6-1-after-upgrading-from-5-4-4/2657184]**.
- The limit for **Nanite Foliage (assemblies/voxels, 5.7)**: «raytraced shadows still use the nanite fallback mesh, rather than the nanite assemblies»;
  Mode 1 «works on regular meshes but not on Nanite Foliage trees» **[SRC: community, https://forums.unrealengine.com/t/bad-raytraced-shadows-with-voxelised-nanite-foliage-in-5-7/2696233]**;
  `r.Nanite.Foliage` ✅. Whether the GFL palms are classic Nanite, Nanite Foliage or non-Nanite ISM is **[UNC]**. MinLOD 0 did not help on 11-07, which
  suggests Nanite *[INF]*.
- Wind: «Check the Evaluate World Position Offset property… to opt in to using WPO with ray tracing» **[SRC: HWRT doc]**. If RT leaves do not sway
  while the real fronds do, the owner will see a shadow that does not follow the leaves.
- Recook: proxy topology needs a recook or your own meshes («you will need to provide your own meshes or extend the builder»). LODBias and Nanite.Mode are
  runtime **[SRC: proxy thread; Epic docs]**. The palms are in a protected pak, so a recook is out of reach. Only runtime levers count.
- MegaLights (`r.MegaLights.DefaultShadowMethod` ✅: «0 - Ray Tracing… dependent on the BVH representation quality. 1 - Virtual Shadow Maps») inherits
  the same BVH problem. It is not a separate path.

### 2.3 Screen-space shadows in this build

`r.ContactShadows.Standalone.Method` ✅ «0 - Stochastic Jittering. 1 - Bend Screen Space Shadows»; `r.ContactShadows.Bend.OverrideSurfaceThickness` ✅;
`r.ContactShadows.OverrideLength` ✅ «overriding the contact shadow length for all directional lights. Disabled when < 0»; `…OverrideLengthInWS` ✅;
`r.ContactShadows` ✅. Epic's legacy doc: the length is a screen fraction, and «a longer trace produces more noise» (fixed sample count) **[SRC:
https://dev.epicgames.com/documentation/en-us/unreal-engine/contact-shadows-in-unreal-engine]**. *[INF]* As a complement it fills frond pixels
that the VSM drops, but it cannot shadow sand from fronds that are off screen (the camera looks down). That makes it a mask for the pop, not a cure.

## 3. Most promising cause-level path (question 3)

**Path A: stop the VSM resolution from changing while the sun turns (check this first, it costs minutes).** If throttling or pool pressure drives the extra
flicker, then the right config gives a continuous sun with a constant, fine texel grid. That leaves only the true sub-texel aliasing, which finer texels then
DO shrink. The refuted "finer texels" lever comes back. There is no blur and no step.
*Discriminating experiment* (stand of 11-07, delta 0.003, bias −1.0, A–B–A, one launch):
1. Read only. Exec without a value prints the current value: `r.Shadow.Virtual.DynamicRes.MaxResolutionLodBias`, `…LoadBudget`, `…TimeBudgetMs`,
   `…MaxPagePoolLoadFactor`, `…MaxComputeResolutionLodBiasDirectional`, `r.Shadow.Virtual.MaxPhysicalPages`, `r.Shadow.Virtual.MaxPhysicalPagesScale`. Then
   `r.Shadow.Virtual.ShowStats 1` and one frame by eye at delta 2.0 and at 0.003. Compare the throttle/LOD-bias line and the page-pool fill.
2. B: `r.Shadow.Virtual.DynamicRes.MaxResolutionLodBias 0` + `…MaxPagePoolLoadFactor 0` + `…LoadBudget 0` + `r.Shadow.Virtual.MaxPhysicalPages 8192`.
   Measure (metric + clip). Then repeat B at bias −2.0.
   Reading: B calmer than A, and −2.0 under B calmer than −1.0 under B ⇒ the throttle/pool was the amplifier. Keep B and the finest bias the
   VRAM allows. No change ⇒ Path A is dead. The remaining flicker is plain grid aliasing of thin fronds, so go to Path B.

**Path B: ray-traced sun shadows with the full leaves (the only family that satisfies all three by construction, at a per-frame GPU cost).**
Experiment: `r.RayTracing.Enable 1`, `r.RayTracing.Shadows 1`. Read `r.RayTracing.Geometry.NaniteProxies.LODBias` (≥ 1 ⇒ set 0) → frame. Then
`r.RayTracing.Geometry.NaniteProxies 2`: the palm shadow vanishes ⇒ the palms go through Nanite proxies. Back to 1. Then `r.RayTracing.Nanite.Mode 1`
(note VRAM; experimental) → frame; leaves present? Then `r.StaticMesh.RayTracingProxies 0`, then toggle `r.RayTracing.Enable 0/1` to rebuild the scene
**[UNC: it may apply only on render-state creation]**. If any variant shows leaves: run the 0.003 flicker metric, check sway (`…NaniteProxies.WPO 1`) and fps.
If no variant shows leaves (Nanite Foliage assemblies), this path is closed without a recook.

**Path C (Dev Kit or Lua, only if A and B fail): a crossfade of two lights with fixed directions** (§1.4). The game light steps 0.1° (calm per 11-07). A second
directional light holds the previous direction, and the intensity weight moves linearly across each step interval, so the edge slides and never jumps. It
needs: spawning or holding a second light without the atmosphere-sun flag, the cost of a second clipmap, and a check that an intensity change does not
invalidate VSM pages **[UNC]**. Exe strings exist for `SetIntensity`, `SetAtmosphereSunLight`, `SetLightSourceAngle`, `SetCastShadows`. This is design
only, untested.

## 4. Cvar table (exact-line grep, 3.0.1 registry)

| Present ✅ | Absent ❌ (do not write) |
|---|---|
| `r.Shadow.Virtual.DynamicRes.{MaxResolutionLodBias, MaxPagePoolLoadFactor, LoadBudget, TimeBudgetMs, PerVSMBiasHistoryWeight, MaxComputeResolutionLodBiasDirectional}`, `r.Shadow.Virtual.{ShowStats, MaxPhysicalPages, MaxPhysicalPagesScale, ScreenRayLength, UseHZB, NonNanite.UseHZB, Visualize, Cache.ForceInvalidateDirectional}` | `r.Shadow.Virtual.Cache.StaticSeparate` |
| `r.RayTracing.{Enable, Shadows, Shadows.SamplesPerPixel, Nanite.Mode, Geometry.NaniteProxies, Geometry.NaniteProxies.LODBias, Geometry.NaniteProxies.WPO, RayTracingProxies.ProjectEnabled}`, `r.StaticMesh.RayTracingProxies`, `r.StaticMesh.RayTracingProxies.LOD1MaxNumOfTriangles`, `r.Nanite.Foliage`, `r.MegaLights.DefaultShadowMethod` | `r.Shadow.Virtual.SubsurfaceShadowMode` |
| `r.ContactShadows`, `r.ContactShadows.{Standalone.Method, Bend.OverrideSurfaceThickness, OverrideLength, OverrideLengthInWS}`, `r.Shadow.Denoiser` | `r.Shadow.Virtual.Cache.DrawInvalidatingBounds` (a comment in the pack's `Engine.ini` names it; it is not in this build) |
| `r.StaticMeshLODDistanceScale`, `r.Shadow.RadiusThreshold`, `r.Shadow.DistanceScale`, `r.Nanite.VSMInvalidateOnLODDelta`, `DynamicSky.SolarUpdateAngleDelta` | — |

## 5. Recommended next experiments, in order

1. **Throttle/pool read + disable (Path A, steps 1–2).** Read-only values and ShowStats at 2.0 vs 0.003, then DynamicRes off + pool 8192 at bias −1.0
   and −2.0. This decides whether the "finer texels" lever was refuted by a confound.
2. **Funcom adaptive system check.** Read `r.StaticMeshLODDistanceScale`, `r.Shadow.RadiusThreshold`, `r.Shadow.DistanceScale` three times at 2.0 and
   three times at 0.003. Lua `FindAllOf("ConanAdaptiveSystemComponent")` gives the count (read only, skip templates). Values that move ⇒ freeze them and re-measure.
3. **RT with full leaves (Path B):** `NaniteProxies.LODBias` read/0 → `NaniteProxies 2` discriminator → `Nanite.Mode 1` → `StaticMesh.RayTracingProxies 0`.
   Leaves visible ⇒ flicker metric + sway + fps.
4. **Grid-twist sanity check (cheap):** delta 0.003 at time of day 9.0 vs 14.0. *[INF: near noon a small sun move is a large yaw change, so the light-space
   basis twists more per frame. Flicker that is stronger at 14.0 confirms grid re-parameterization (Fortnite's explanation) and argues for Path B/C over A.]*
5. **Bend SSS as a complement:** `r.ContactShadows.Standalone.Method 1` + `r.ContactShadows.OverrideLength 0.2` (screen) at 0.003, then the clip by
   eye. It may mask the dropped frond pixels; the owner must judge it.
6. **Path C design** (two-light crossfade) only if 1–3 all fail. It is a Dev Kit or Lua job and needs the owner's taste check on a 0.1° crossfade clip.

## Sources

- Epic docs: HWRT — https://dev.epicgames.com/documentation/en-us/unreal-engine/hardware-ray-tracing-in-unreal-engine ; Contact Shadows — https://dev.epicgames.com/documentation/en-us/unreal-engine/contact-shadows-in-unreal-engine
- Epic forum (staff): VSM Cached Page mode in 5.8 — https://forums.unrealengine.com/t/vsm-cached-page-mode-in-5-8/2843727 ; Handling Raytracing Proxy Meshes — https://forums.unrealengine.com/t/handling-raytracing-proxy-meshes/2736791
- Epic forum (community): voxelised Nanite Foliage RT shadows — https://forums.unrealengine.com/t/bad-raytraced-shadows-with-voxelised-nanite-foliage-in-5-7/2696233 ; RT proxy for foliage — https://forums.unrealengine.com/t/ray-tracing-proxy-problem-for-foliage/2746871 ;
  full Nanite RT — https://forums.unrealengine.com/t/ray-tracing-full-nanite-meshes-supported-in-5-1-preview/663855 ; VRAM 5.6.1 — https://forums.unrealengine.com/t/nanite-and-raytracing-using-increasing-amounts-of-vram-in-5-6-1-after-upgrading-from-5-4-4/2657184
- UE 5.4 cvar wiki (DynamicRes defaults) — https://indxzero.github.io/ue544cvarwiki/articles/r.shadow.virtual.dynamicres.maxresolutionlodbias , …/r.shadow.virtual.dynamicres.maxpagepoolloadfactor
- graphics-programming.org, Virtual Shadow Maps — https://graphics-programming.org/blog/virtual-shadow-maps
- Bend Studio, Inside Bend: Screen Space Shadows — https://www.bendstudio.com/blog/inside-bend-screen-space-shadows/ ; Winter Crown Works — https://winter-crown-works.com/en/tech/003/
- gamedev.net 676190 / 666828 / 588182 and salivity texel-snapping (search excerpts only; the pages answered 403 or were not fetched) **[UNC]**
- Local: exe help strings (scratchpad `cvarhelp.py`); kit `UE4/Config/DefaultEngine.ini`, `DefaultDeviceProfiles.ini`, `DefaultScalability.ini`, `Engine/Config/BaseScalability.ini`;
  pack `ConanExiles/_unpacked/KrinikConanGraphics/Engine.ini`.
