# Research — leaflet shadows blink under a continuously turning sun (VSM, WPO wind): what Epic and other engines do

> **Created:** 2026-11-07 (helper agent, web only, no game run; written 18:19 +03:00) · **Parent:** bug 67 ·
> **Status:** recon done; no new lever proven, two stand checks proposed (§4) · **Outbound:** test order → the main session (bug 67)
>
> Builds on `2026-11-06_vsm_foliage_recon.md`, `2026-11-07_continuous_sun_crisp_foliage.md`, `2026-11-07_leaf_shadows_fill_in_recon.md` (not retold).
> Marks: **[SRC: url]** quoted or paraphrased source · *[INF]* my inference. The Fortnite VSM blog and several gamedev.net threads returned HTTP 403 to the fetcher;
> their lines below come from search-engine excerpts and are marked as such.

## 1. Epic's position on a continuously moving sun

- **Moving the light throws away the cache.** «Any light movement or rotation will invalidate all cached pages for that light.» [SRC: https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-shadow-maps-in-unreal-engine]
  Caching is not our cause: a still light with `r.Shadow.Virtual.Cache 0` is stable.
- **Fortnite Ch.4 ships exactly our case.** Lauritzen and Olsson write that «a significant amount of animated deformation—chiefly trees—and a continuously moving sun» «heavily undercut the ability to cache shadow maps».
  They say the sun movement causes «quite significant shadow page table changes frame to frame», and that Fortnite moved to **uncached** sun shadows with a coarse-page map for volumetrics.
  The blog also notes that «it is fairly common to "cheat" a bit on this as long as the sun is not moving too quickly», i.e. other engines reuse stale shadow data while the sun moves slowly.
  It names `r.Shadow.Virtual.SubsurfaceShadowMode` for tree-shading artifacts. [SRC: https://www.unrealengine.com/tech-blog/virtual-shadow-maps-in-fortnite-battle-royale-chapter-4 — search excerpts only, 403]
  Nothing in the visible excerpts addresses frame-to-frame shimmer of sub-texel leaves. *[INF]* Epic treats this as a cost problem, not a stability problem.
- **The Epic support reply (UDN mirror) is about cost only.** Chris Anderson (PrismaticChris), 2025-04-14: «The directional lights will invalidate their caches every frame in a continuous time of day, but other lights will retain their caches.»
  He suggests `r.Shadow.Virtual.ResolutionLodBiasDirectional` and `r.Shadow.Virtual.Cache.StaticSeparate 0` «if the lights are always updating». He says reducing the update frequency «is somewhat misleading as the frame time of update frames will still exhibit the issues».
  Time-slicing tests were «unsatisfactory». [SRC: https://forums.unrealengine.com/t/virtual-shadows-and-dynamic-time-of-day/2509500] He gives no remedy for shimmer.
- **Docs on aliasing:** «There is no simple solution to solving projective aliasing with shadow maps.» For foliage: «using only Contact Shadows is a sufficient substitute for high resolution shadow maps» (grass, sometimes foliage).
  [SRC: same docs URL]
- **I found no Epic-staff reply** (Lauritzen "punkUser", Olsson, Lapere) on forums or GitHub about a moving sun making foliage shadows shimmer in VSM in 5.4–5.8.
  The relevant threads are user-only:
  - «Constantly Moving Directional Light Makes Shadows Flicker» (2018–2023, CSM, unsolved) [SRC: https://forums.unrealengine.com/t/constantly-moving-directional-light-makes-shadows-flicker/439543]
  - «Flickering/Wobbly Shadows Issue due to Day/Night Cycle» (CSM): «If I stop my animated directional light … the problem stops»; mitigated by higher `r.Shadow.MaxCSMResolution`
    [SRC: https://forums.unrealengine.com/t/flickering-wobbly-shadows-issue-due-to-day-night-cycle/1965998]
  - pixel artefacts on *moving* VSM shadows «caused by adaptive ray count», fixed with `r.Shadow.Virtual.SMRT.AdaptiveRayCount 0` (two users)
    [SRC: https://forums.unrealengine.com/t/virtual-shadow-maps-for-high-quality-rendering-cinematics/1922741]

## 2. The engine machinery that changes when the light moves

- `r.Shadow.Virtual.ResolutionLodBiasDirectionalMoving` (code default 0.5; BaseScalability 0 / 0 / −0.5 / −1.5 / −1.5 for ShadowQuality 0..Cine): «The bias transitions smoothly back to ResolutionLodBiasDirectional as the light transitions to non-moving».
  The clipmap code blends the two biases by `LightMobilityFactor`, adds `Log2(LodScale)` and the per-light bias, then clamps: `ResolutionLodBias = FMath::Max(0.0f, ResolutionLodBias); // Clamp negative absolute resolution biases as they would exceed the maximum resolution/ranges allocated`.
  [SRC: https://indxzero.github.io/ue544cvarwiki/articles/r.shadow.virtual.resolutionlodbiasdirectionalmoving]
- `r.Shadow.Scene.LightActiveFrameCount` (default 10): «Number of frames before a light that has been moving … goes to inactive state. This determines the number of frames that the MobilityFactor goes to zero over».
  [SRC: https://indxzero.github.io/ue544cvarwiki/articles/r.shadow.scene.lightactiveframecount]
- *[INF]* From memory of the engine source, which I could not re-read here (the repository needs an Epic-linked account): `InterpolateResolutionBias` lerps toward `Max(Static, Moving)`, so a moving light is never finer than the static bias.
  Bug 67 records both biases at −1.0. If the −2/−3 runs changed only `ResolutionLodBiasDirectional`, the moving value stayed at −1, and the ceiling may have been the cap, not the physics.
- *[INF]* The `Max(0, …)` clamp on the **absolute** bias also explains why −3 is «no better than» −2: past a point the clipmap is already at its maximum virtual resolution for that distance.

## 3. A moving light outside UE: what other engines do

- **Texel snapping fixes camera translation, not light rotation.** It is the standard «stabilize the shadow map» trick [SRC: https://learn.microsoft.com/en-us/windows/win32/dxtecharts/common-techniques-to-improve-shadow-depth-maps].
  gamedev.net consensus: when a directional light rotates, «texel orientations rotate relative to world geometry», so snapping cannot help.
  [SRC: https://gamedev.net/forums/topic/676190-interpolating-between-directional-shadow-maps-to-reduce-edge-shimmer/ — excerpt, 403]
  The same thread lists the known options:
  - update the light only «once every 10 seconds or so» (visible jumps);
  - «blending between the shadow at two different light positions» (effective but costly);
  - stop the sun while the camera is still;
  - temporal filtering — shimmer «totally eliminated» at the cost of lag.
- **Unity HDRP** caches directional shadows and re-renders them only after the light rotates past `cachedShadowAngleUpdateThreshold` (diff default 0.5°), i.e. a stepped sun.
  [SRC: https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@15.0/api/UnityEngine.Rendering.HighDefinition.HDAdditionalLightData.cachedShadowAngleUpdateThreshold.html ; https://github.com/Unity-Technologies/Graphics/pull/2275/files]
- **Open VSM write-up (2026):** «the Sun's rotation can be quantized such that invalidation only occurs every N frames. A reprojection scheme … can be used to eliminate the resulting artifacts.»
  [SRC: https://graphics-programming.org/blog/virtual-shadow-maps]
- I found no Frostbite, Decima, Snowdrop or CryEngine talk that solves «smooth sun + sharp sub-texel foliage shadow» without stepping, crossfading or temporal filtering.
  *[INF]* The industry answer is one of three: step the sun and hide the step (crossfade or reprojection), filter temporally (softens and lags), or add resolution.

## 4. What this means for bug 67

*[INF]* The physics: a leaflet thinner than a shadow texel covers a texel or misses it depending on the exact light-space grid. With a still light that grid is constant, so the leaflet is stable even while it is re-rendered.
A new direction every frame resamples the leaflet onto a new grid; wind adds sub-texel motion on top, which matches «more with stronger wind».
No cvar removes this. Only three things reduce it: more texels per leaflet, a filter wider than a texel, or temporal accumulation.

Checks for the stand, cheapest first:
1. **Repeat the bias series with BOTH cvars set** (`ResolutionLodBiasDirectional` = `…DirectionalMoving` = −2, then −3). Also run `r.Shadow.Scene.LightActiveFrameCount 1` against `100`.
   If the moving bias capped the earlier runs, this is free resolution. Watch the page pool (`r.Shadow.Virtual.ShowStats 2`) and `DynamicRes.MaxResolutionLodBias`, which bug 67 lists as 2.0 and which can coarsen pages under load.
2. **`r.Shadow.Virtual.SMRT.AdaptiveRayCount 0`.** Users report it fixes artefacts on moving VSM shadows. It differs from the ray-count levers already refuted.
3. **Contact shadows on the palm material or light** (Epic's own foliage advice) give a sharp screen-space contact that does not depend on the shadow-map grid. This is an addition, not a fix.
4. **Engine-side only (no cvar):**
   - quantize the shadow-projection direction while the visible sun keeps moving, and crossfade the shadow mask between the two last projections (2× shadow cost);
   - or temporally accumulate the directional shadow mask.
   Both keep the sun smooth and the edge sharp. Neither is available as a stock cvar in UE 5.8 as far as I found.
   Whether a smooth crossfade between two projections still counts as «stepped» for the owner is his call.
