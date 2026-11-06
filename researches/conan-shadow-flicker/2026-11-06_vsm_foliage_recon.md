# Research — VSM foliage shadow flicker with a moving sun: authoritative practice (2026-11-06)

> **Created:** 2026-11-06 · **Parent:** bug 67 (the owner's word 2026-11-06 19:22) · **Status:** recon done (web + local read-only; no game run) ·
> **Outbound:** the experiment plan → the main session
>
> Builds on `README.md`, `2026-10-29_recon.md`, `2026-10-29_light-rotation-cache.md` (not retold) and the sibling engine track
> `2026-11-06_engine_cvars_read.md`. Registry = `ConanExiles/_config/cvars-registered.txt` (3.0.1), every name below grepped as an exact line.
> Help texts quoted from `ConanSandbox-Win64-Shipping.exe` (read-only UTF-16 scan, 2026-11-06). Engine shaders read from the Dev Kit
> `F:/CEUE5Devkit/Engine/Shaders/Private/VirtualShadowMaps/` (the kit is UE **5.8.2**, `Build.version`, branch `++exiles+release`).
> Marks: **[SRC]** = quoted source · *[INF]* = my inference · **[UNC]** = uncertain, check before relying on it.

## How games get all three (smooth sun · calm foliage shadows · no per-frame shadow redraw)

The owner's target is the three at once. Sources show that no shipped engine gets all three from a shadow map that rotates every frame. Shipped games use one of
the patterns below, often two together. Pattern A+B is the classic answer. It is also what "old games" did.

| # | Technique (who does it, source) | Gets | Conan Exiles Enhanced 3.0.1 (UE 5.8): reachable how |
|---|---|---|---|
| A | **Split the visible sun from the shadow-casting light.** The sky disk moves every frame. The light (and its shadow map) turns only after the sun has moved Δ. Skyrim: `fSunUpdateThreshold` (vanilla 0.5) **[SRC: STEP SSE thread]**. Unity HDRP cached shadows: "Update on light movement" with `cachedShadowAngleUpdateThreshold` in degrees **[SRC: Unity HDRP docs; the 0.5° default comes from a PR diff, UNC]**. Ultra Dynamic Sky (Conan's sky): "Lights Update settings in the Directional Light category… allow the lights to only periodically change rotation… to reduce the frequency that cached directional shadows need updating" **[SRC: UDS 8.1 docs]**. Funcom wraps the same idea in `DynamicSky.SolarUpdateAngleDelta`: «How many degrees can the sun/moon move in the sky before we rotate the corresponding directional light to match» **[SRC: exe help]** | 1 ✅ 3 ✅ (one full redraw per step). 2 ✅ between steps | **cvar, already live** (`DynamicSky.SolarUpdateAngleDelta`, registry ✅). Is the disk smooth at 2.0? The UDS docs say the sun orientation is cached apart from the light. **[UNC: confirm by eye that the disk does not step at 2.0]** |
| B | **Hide the step with a transition.** Skyrim (2011): `fSunShadowUpdateTime` «sets the speed of sun-shadow transitions in seconds» (vanilla 1.0, community 0.25) **[SRC: STEP]**. Skyrim SE made shadows «move constantly with the movement of the sun by default (bDisableShadowJumps=1)», and the community note says: «This can cause constant shadow flickering at places» **[SRC: STEP SSE thread]**. This is the old-engine proof that a continuously rotating shadow map shimmers, while a step + transition does not | 1 ✅ 2 ✅ 3 ≈✅ (redraw only during the short transition) | **No cvar.** **Dev Kit, sky blueprint**: the light can be eased toward its new direction over a short time, but each frame of the ease is a rotation, so shimmer and redraw last for that time only. A two-light crossfade (old and new direction, intensities swapped over about 0.5 s) would hide the step with no rotation at all. *[INF, untested; costs a second VSM during the fade; UDS sky/atmosphere lighting would need checking]* |
| C | **Small invisible step, no transition.** Pick Δ so that the shadow jump per step is below notice (2026-10-29 note: 0.1° moves a 10 m palm's shadow about 1.7 cm) | 1 ✅ 3 ✅ 2 ✅ between steps, one "re-roll blink" per step | **cvar** (`SolarUpdateAngleDelta` 0.05–0.25). Free in GPU |
| D | **Texel snapping / stabilization.** MS DirectX article: shimmer «occurs because the light projection matrix is being recalculated every time the camera moves». The fix is to round the ortho bounds «to pixel size increments». The factors listed include «Location of the light» and «Orientation of the view frustum» **[SRC: MS Learn]** | fixes **camera translation only**. No source offers a snap for **light rotation**. *[INF: rotation changes the grid's orientation, which no rounding can undo]* | VSM already snaps its clipmaps (engine-internal). Nothing to set |
| E | **Re-render the sun's shadow every frame and hide the shimmer with resolution, soft filtering and temporal AA.** Fortnite Ch.4: «a continuously animating sun direction… it is fairly common to "cheat" a bit on this as long as the sun is not moving too quickly… it is not just the shadow data rotating, it is the entire parameterization of where the pages fall. This effect can be quite pronounced even for visibly slow sun movement for pages near the camera». So Epic «shift[ed] our strategy for Fortnite's sun shadows» to **uncached** and halved the resolution (`r.Shadow.Virtual.Cache.ForceInvalidateDirectional`) **[SRC: Epic tech blog]**. Classic CSM games also re-render cascades every frame. Their soft, low-resolution PCF hides the sub-texel re-roll *[INF]* | 1 ✅ 2 ≈ (hidden, not removed) 3 ❌ | **cvar** (SMRT, LOD bias, DLSS mode). This is what Conan does now at 0.003, minus enough blur and AA to hide it |
| F | **Cache-reprojection of rotating pages.** Fortnite tried it: «we can only reconstruct a new page if all source pages that it covers were mapped in the previous frame… looking into a noisy object like a tree has so many holes… very few pages can be reconstructed» **[SRC: Epic]**. Epic rejected it | — | **Not reachable** (not in the engine; needs engine source) |
| G | **World-space shadows (ray-traced sun).** No light-space grid, so a rotation cannot re-roll the pattern | 1 ✅ 2 ✅ 3 ❌ (traced every frame, its own cost) | **cvar** (`r.RayTracing.Enable`/`r.RayTracing.Shadows`, registry ✅; RT is on-demand in this build per 10-29 recon). WPO in the BVH: `r.RayTracing.Geometry.StaticMeshes.WPO` ✅ |
| H | **Foliage stops invalidating the cache** (`Shadow Cache Invalidation Behavior = Rigid/Static`, WPO disable distance): «Rigid: Suppress invalidations that would otherwise be generated by, for example, World Position Offset» **[SRC: Epic VSM docs]**. Fortnite: «World Position Offset distance culling for the shadow pass (relative to the main camera position, not the light)» **[SRC: Epic blog]** | 3 ✅ for foliage pages. The frond shadows then stop swaying (Rigid) | **Dev Kit / runtime property**: `ShadowCacheInvalidationBehavior` is a reflected property in the exe. `SetEvaluateWorldPositionOffset` and `SetWorldPositionOffsetDisableDistance` are UFunction strings in the exe. The palm meshes are not loose in the kit (none under `UE4/Content/Environment/Trees`; probably in `ProtectedAssets.pak`, 13 GB) **[UNC]**. Far levels by cvar: `r.Shadow.Virtual.Clipmap.WPODisableDistance` ✅ |

**Bottom line of the table.** "Smooth moving shadows without flicker" in older games is mostly A+B: the light steps, and a 0.25–1 s transition hides the step.
Fortnite uses E at a real GPU cost. In Conan, A and C are reachable today by cvar. B needs a sky-blueprint edit in the kit. 3 at near distance, with fronds still swaying, cannot
be reached: WPO pages are re-rendered every frame by design («materials using World Position Offset… always invalidates cached pages every frame» **[SRC: Epic docs]**).
That per-frame foliage redraw is local (pages under the palms), not the full-clipmap redraw a rotating sun causes.

## Findings

1. **Rotation invalidates everything; WPO invalidates its own pages every frame.** «Any light movement or rotation will invalidate all cached pages for that
   light» · «materials using World Position Offset or Pixel Depth Offset always invalidates cached pages every frame»
   (https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-shadow-maps-in-unreal-engine). An Epic forum reply (staff status not shown on the page): «The
   directional lights will invalidate their caches every frame in a continuous time of day». Throttling updates gives frame spikes, and «time slicing… unsatisfactory»
   (https://forums.unrealengine.com/t/virtual-shadows-and-dynamic-time-of-day/2509500). **No rotation threshold exists in VSM.** All 115 `r.Shadow.Virtual.*` names in
   this build were scanned: none tolerates rotation (agrees with the 10-29 note).
2. **The re-render itself is not what flickers. The light-space re-parameterization is.** Fortnite: «it is the entire parameterization of where the pages fall…
   pronounced even for visibly slow sun movement for pages near the camera»
   (https://www.unrealengine.com/en-US/tech-blog/virtual-shadow-maps-in-fortnite-battle-royale-chapter-4, fetched in full this time). Our own observation agrees.
   At delta 2.0 the palm pages are STILL re-rendered every frame: WPO is Auto, and since 5.7 `UseReceiverMaskDirectional=1` keeps dynamic pages uncached
   (https://forums.unrealengine.com/t/constant-invalidation-of-vsm-dynamic-shadows-in-5-7-0/2686534). Yet the owner saw calm shadows. So a per-frame
   redraw under a FIXED light direction is stable. A redraw under a NEW direction re-samples the thin fronds at a new sub-texel phase. **This is the most likely
   cause.**
3. **Old engines had the same flicker under continuous rotation.** Skyrim SE `bDisableShadowJumps=1` (continuous) «can cause constant shadow flickering at
   places». Skyrim's original design was a step (`fSunUpdateThreshold`) plus a transition (`fSunShadowUpdateTime`)
   (https://stepmodifications.org/forum/topic/15233-shadow-optimization-for-sse/). The owner's "old games" memory most likely is A+B, not continuous rotation.
   *[INF: individual titles not verified frame by frame]*
4. **Texel snapping cannot fix rotation.** The MS article fixes only the camera-driven matrix change, by rounding the ortho bounds to texel increments
   (https://learn.microsoft.com/en-us/windows/win32/dxtecharts/common-techniques-to-improve-shadow-depth-maps).
5. **SMRT is temporally noisy by construction.** In the 5.8.2 kit shader `VirtualShadowMapProjectionDirectional.ush`, each ray takes
   `VirtualShadowMapGetRandomSample(PixelPos, View.StateFrameIndex, i, MaxRayCount)`, a **per-frame** random ray direction and texel dither. Its
   comment says the dither «help[s] hide aliasing due to insufficient shadow resolution». So the penumbra is new noise every frame, and DLSS has to accumulate
   it. Epic: «Fewer rays show visible noise in the penumbra… values between 4 and 8 samples works well» (VSM docs). *[INF: with a static light this noise
   converges under DLSS. With a rotating light the underlying pattern also changes, and the two add up]*
6. **Foliage levers (Epic docs).** Shadow Cache Invalidation Behavior Auto/Always/Rigid/Static. «The World Position Offset Disable Distance property on primitives can be
   set to limit the distance at which WPO is applied». «Replacing WPO usage with skeletal animation or modifying the instance transform avoids this pitfall»
   (VSM docs). Community (Recourse Design): «Shadow Invalidation… set this to static», which keeps WPO running but stops the shadow update
   (https://forums.unrealengine.com/t/vsm-with-nanite-foliage-wpo/776406). `r.Shadow.Virtual.Cache.MaxMaterialPositionInvalidationRange` is reported dead even
   in 5.2 (same thread) and is **absent** in this build.
7. **Clipmap WPO distance (exe help, 3.0.1).** `r.Shadow.Virtual.Clipmap.WPODisableDistance`: «disables WPO animation in clipmap levels based on a primitive's WPO
   disable distance and …LodBias». `…LodBias`: «Typically 2-4 works well but may need to be adjusted for very low light angles with significant WPO movement».
   `…InvalidateOnScaleChange`: «can sometimes make things visually more consistent but can also introduce unpredictable performance spikes, so it is disabled by
   default». These act on far levels. The palms in question are near.
8. **Fortnite's foliage practice.** Grass gets contact shadows only ("not rendered into the shadow map"). Trees get shadow proxies, cheap precomputed WPO, no alpha test.
   The improved subsurface shadow mode is `r.Shadow.Virtual.SubsurfaceShadowMode 1` (Epic blog). That cvar is **absent** in 3.0.1. The surviving
   relative is `r.Shadow.Virtual.SubsurfaceShadowMinSourceAngle` ✅: «VSM can increase the light source radius depending on the material opacity… the higher this
   value, the more diffuse the shadowing».
9. **Upscaler as amplifier.** No NVIDIA source on shadows over static receivers was found. Community threads tie UE5 foliage "buzzing" to motion vectors
   and presets (https://forums.developer.nvidia.com/t/ue5-1-dlss-buzzing-artifacts-on-foliage/249160). Sand is static, so DLSS reuses its history while the
   shadow ON it changes. *[INF]* That makes the upscaler a plausible amplifier, but the 2.0 result shows it is not the driver.
10. **Community UE5 fixes are weak.** Forum fixes for VSM foliage flicker: `ResolutionLodBiasDirectional` 0 (reported to help, with new trunk artifacts),
    `OnePassProjection.MaxLightsPerPixel 64`, removing grass shadows (https://forums.unrealengine.com/t/foliage-shadow-flicker-in-render-with-ue-5-7/2700658,
    https://forums.unrealengine.com/t/flickering-foliage-shadows/510715). None has an Epic-confirmed cause. Palworld (the sibling project, field-proven 15.08.2026)
    found a different flicker class: `r.InstanceCulling.OcclusionCull` («dynamic foliage shadows to disappear or flicker at certain viewing distances and/or
    angles», from that mod author). It is ✅ in the Conan registry, but its symptom is pop on/off, not shimmer.
11. **Pack vs game.** Per the 10-29 recon, the pack forces `ResolutionLodBiasDirectional/Moving = -1.0` over the game's Cine **-1.5**. That means coarser sun texels than the game
    ships at Cine, so more sub-texel re-roll per rotation. *[INF]* This is a pack-made amplifier and costs nothing to revert.

## Levers table

| Lever | What it does | How set | In this build? | Expected effect on flicker | Risk / cost |
|---|---|---|---|---|---|
| `DynamicSky.SolarUpdateAngleDelta` | light turns only after the sun moves Δ° | cvar | ✅ | the driver: 0.003 → re-roll ~every frame; 0.1–0.25 → one blink per 0.5–1.5 s | step visible if Δ too big (2.0) |
| Sky BP: eased / crossfaded light step (Pattern B) | hides the step | **Dev Kit** (UDS `Ultra_Dynamic_Sky_BP`, `BP_TimeOfDayManager` in kit `Content/Systems/`) | asset; the UDS BP itself not found loose in kit **[UNC]** | removes the visible step; calm between | dev work; second light during fade |
| `r.Shadow.Virtual.ResolutionLodBiasDirectional` + `…Moving` → -1.5 (game Cine) / -2.0 | finer sun texels | cvar | ✅ ✅ | smaller re-roll per rotation (mitigation) | ×2 pages per -1.0 step |
| `r.Shadow.Virtual.SMRT.RayCountDirectional` / `SamplesPerRayDirectional` / `TexelDitherScaleDirectional` | penumbra rays, samples, dither (per-frame random) | cvar | ✅ ✅ ✅ | more rays = less per-frame noise; dither hides aliasing | 16 rays already tried (Sept) alone; dither → light leaks |
| Sun `LightSourceAngle` (via Lua `SetLightSourceAngle`) | wider penumbra | runtime UFunction / kit | exe string ✅ | blurs sub-texel detail, so less visible re-roll | softer sun overall |
| `r.Shadow.Virtual.SubsurfaceShadowMinSourceAngle` | diffuses shadows of subsurface (leaf) materials | cvar | ✅ | softer frond self-shadow; on sand only if fronds use subsurface **[UNC]** | look change |
| Per-primitive `ShadowCacheInvalidationBehavior = Rigid` on palms | WPO no longer invalidates | **Dev Kit** asset, or runtime property write + render-state dirty **[UNC]** | property in exe ✅ | stops per-frame foliage redraw (goal 3). Does not touch rotation flicker | frond shadows freeze while fronds sway (stale shadow) |
| `WorldPositionOffsetDisableDistance` / `SetEvaluateWorldPositionOffset` | WPO off beyond distance / entirely | Dev Kit / runtime UFunction | exe strings ✅ | discriminator (WPO on/off); far-only as fix | sway gone |
| `r.Shadow.Virtual.Clipmap.WPODisableDistance` (+`.LodBias` 2–4) | WPO off in far clipmap levels | cvar | ✅ ✅ | far palms only | far sway gone |
| `r.WPODisableDistanceScale` | scales all primitives' WPO disable distance | cvar | ✅ (Cine 1.5) | ~0 as a crude WPO-off test **[UNC: 0 may mean "no disable"]** | — |
| `r.Shadow.Virtual.Cache.ForceInvalidateDirectional` | always re-render the clipmap (Fortnite) | cvar | ✅ | **discriminator**: redraw without rotation | GPU cost |
| `r.Shadow.Virtual.Cache` | cache on/off | cvar | ✅ | discriminator (same as above, coarser) | GPU cost |
| `r.Shadow.Virtual.UseReceiverMaskDirectional` | 5.7+ dynamic pages uncached | cvar | ✅ | perf only | — |
| `r.Shadow.Virtual.MarkCoarsePagesDirectional 2` | suppress WPO invalidation in coarse pages | cvar | ✅ | far only | far lag |
| `r.RayTracing.Shadows` (Pattern G) | world-space sun shadow | cvar | ✅ | removes rotation re-roll | ms per frame, WPO-in-BVH, noise |
| DLSS mode/preset (`r.NGX.DLSS.Preset`, menu DLAA) | upscaler history | cvar / menu | ✅ | amplifier only | fps; preset 13 crashed (bug 63) |
| `r.Shadow.Virtual.Enable 0` | CSM fallback | cvar | ✅ | discriminator | quality |
| `r.Shadow.Virtual.Cache.MaxMaterialPositionInvalidationRange`, `…Cache.StaticSeparate`, `r.Shadow.Virtual.SubsurfaceShadowMode` | — | — | ❌ absent | do not write | — |

## Discriminating experiments, in order

Stand per `2026-10-29_recon.md` → "Stand" (live `exec` via the pult, A–B–A in one session, fixed pose and absolute camera, `SetTimeOfDay(13.0)` before each pair,
60 fps clip of a fixed sand box under the fronds, d2/d1 instrument). The owner's eye on 4K is the arbiter.

1. **Redraw without rotation:** delta `2.0` (light still) + `r.Shadow.Virtual.Cache.ForceInvalidateDirectional 1` vs `0`.
   Calm in both → per-frame redraw is innocent. The owner's goal 3 is then a perf goal only, and the flicker = rotation re-parameterization (Finding 2). Flicker with ForceInvalidate
   → re-rendering itself is unstable (SMRT noise or page dynamics). Go to 4.
2. **Rotation without WPO:** delta `0.003`; palm WPO off (Lua `SetEvaluateWorldPositionOffset(false)` on the palm components under the camera, or
   `r.WPODisableDistanceScale 0.0001` **[UNC]**). Still flickers with still fronds → rotation alone drives it; WPO and the foliage levers (H) cannot fix it.
   Calm → WPO + rotation interact; go to Rigid tests.
3. **Shadow-map family:** delta `0.003`, `r.Shadow.Virtual.Enable 0`. CSM shimmers too → generic rotating-shadow-map aliasing (Patterns A–C, G are the cures).
   CSM calm → VSM-specific (page parameterization or SMRT), so VSM-side levers matter. Caveat: CSM is blurrier, and calm may only be blur.
4. **SMRT noise:** delta `0.003`, `SMRT.RayCountDirectional 0` (single-sample hard shadows, no per-frame random). The shimmer turns into a crisp crawling pattern
   → the core is the grid re-roll and SMRT only dresses it. It gets clearly calmer → per-frame SMRT noise under DLSS is a main part. Raise rays and samples, and
   try `TexelDitherScaleDirectional`.
5. **Upscaler:** delta `0.003`, menu DLAA, then `r.NGX.DLSS.Enable 0`. A big drop → DLSS amplifies. Keep DLAA or Quality, or a preset via the NVIDIA App.
6. **Resolution:** delta `0.003`, LOD bias `-1.5/-1.5` (game Cine), then `-2.0`. The flicker shrinks in size → aliasing scale confirmed. Keep the finest the pool allows.
7. **Step size (Pattern C):** delta `0.05`, `0.1`, `0.25`, each ≥ 4 steps on clip. Look for: calm between steps, how the blink reads, any visible "tick".

## Recommended fix path (cause-level, sun stays smooth)

1. Run experiments 1–4 first. They settle whether the cause is the rotation re-parameterization (expected, Finding 2) or the redraw/WPO.
2. If rotation is confirmed: **keep the light stepping, but invisibly** (Patterns A+C), and remove the pack amplifiers:
   - small step (0.1–0.25, picked by exp. 7);
   - LOD bias back to the game's Cine `-1.5/-1.5` or finer (Finding 11);
   - SMRT and DLAA per exp. 4–5.
   The sky disk stays smooth, because the sky caches its own sun rotation (UDS); **[UNC]** check this by eye.
3. If the owner still sees each step: **Dev Kit Pattern B**. Edit the sky blueprint so the light update crossfades two directional lights (or eases over ≤ 0.5 s).
   First read which BP sets the light rotation (`BP_TimeOfDayManager` is loose in the kit; the UDS BP appears to sit in `ProtectedAssets.pak` **[UNC]**).
4. Goal 3 for the foliage itself: per-frame WPO redraw under palms is by Epic's design. The only cure is Rigid/Static or WPO distance on the palm primitives (frond shadows
   stop swaying near the player). That is the owner's taste call. Offer it as a separate A/B after 1–3.
5. Ray-traced sun shadows (Pattern G) stay the fallback that keeps rotation every frame without the grid. They cost GPU every frame and fail goal 3.

## Sources

- Epic, Virtual Shadow Maps — https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-shadow-maps-in-unreal-engine
- Epic tech blog, VSM in Fortnite Battle Royale Ch.4 — https://www.unrealengine.com/en-US/tech-blog/virtual-shadow-maps-in-fortnite-battle-royale-chapter-4 (full text, via curl)
- Epic forum, Virtual shadows and dynamic time of day — https://forums.unrealengine.com/t/virtual-shadows-and-dynamic-time-of-day/2509500
- Epic forum, Constant invalidation of VSM dynamic shadows in 5.7.0 — https://forums.unrealengine.com/t/constant-invalidation-of-vsm-dynamic-shadows-in-5-7-0/2686534
- Epic forum, VSM with Nanite Foliage (WPO) — https://forums.unrealengine.com/t/vsm-with-nanite-foliage-wpo/776406
- Epic forum, Foliage shadow flicker in render with UE 5.7 — https://forums.unrealengine.com/t/foliage-shadow-flicker-in-render-with-ue-5-7/2700658
- Epic forum, Flickering foliage shadows — https://forums.unrealengine.com/t/flickering-foliage-shadows/510715
- Ultra Dynamic Sky 8.1 docs — https://www.ultradynamicsky.com/Documentation/V8/8-1
- Unity HDRP, Shadows / update mode — https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@16.0/manual/shadow-update-mode.html ; threshold default 0.5 from https://github.com/Unity-Technologies/Graphics/pull/2275/files **[UNC]**
- STEP, Shadow optimization for SSE (Skyrim `bDisableShadowJumps`, `fSunShadowUpdateTime`, `fSunUpdateThreshold`) — https://stepmodifications.org/forum/topic/15233-shadow-optimization-for-sse/
- Microsoft Learn, Common Techniques to Improve Shadow Depth Maps — https://learn.microsoft.com/en-us/windows/win32/dxtecharts/common-techniques-to-improve-shadow-depth-maps
- NVIDIA dev forum, UE5.1 DLSS buzzing artifacts on foliage — https://forums.developer.nvidia.com/t/ue5-1-dlss-buzzing-artifacts-on-foliage/249160
- Local: kit shaders `F:/CEUE5Devkit/Engine/Shaders/Private/VirtualShadowMaps/VirtualShadowMapProjectionDirectional.ush` (SMRT per-frame random, dither);
  exe help strings and UFunction or property names (`ShadowCacheInvalidationBehavior`, `SetEvaluateWorldPositionOffset`, `SetWorldPositionOffsetDisableDistance`);
  `D:/work/ai_sandbox/Palworld/_config/Krinik-Palworld-UE5-Engine.ini` (OcclusionCull note).
- Not found: any engine or Epic setting that keeps VSM pages across a small light rotation; NVIDIA guidance on shadows over static receivers; the UDS
  "Lights Update" variable names (the docs only name the category).
