# Research — why palm leaflet shadows vanish, return and "fill in" over frames under a turning sun (VSM + Nanite, UE 5.8)

> **Created:** 2026-11-07 (helper agent, web + local read-only, no game run; written 16:24 +03:00) · **Parent:** bug 67 ·
> **Status:** recon done; 2026-11-07 16:5x tests 1, 3 (buffers ×2), 4 (MinQuality 1), 5 (NaniteLODBias 0) run on a clean stand with a STILL light — the forced
> re-render does not make leaflets blink on the sand, every lever within noise (bug 67, «CORRECTION 16:57»); the turning-sun run is next · **Outbound:** test order → the main session (bug 67)
>
> Builds on `2026-11-06_vsm_foliage_recon.md` and `2026-11-07_continuous_sun_crisp_foliage.md` (not retold). Registry = `ConanExiles/_config/cvars-registered.txt`.
> Every cvar here was grepped as an exact line (✅ present / ❌ absent). Help texts were read from `ConanSandbox-Win64-Shipping.exe` (UTF-16 scan, read-only).
> Effective values come from the game log `Saved/Logs/ConanSandbox.log` (2026-11-07 12:40 session). Marks: **[SRC]** quoted source · *[INF]* inference · **[UNC]** unverified.

## 0. What the live day already rules out (bug 67, 15:45–16:13)

- **CORRECTED 2026-11-07 18:2x — this paragraph is wrong:** the texel size was assumed, never measured; on a clean stand the stair-steps of the −1 texel are visible on the
  leaflet edges and the needle tips stay thinner than a texel at −3 (bug 67, «THE LINE»). Original text, kept for the record:
- ~~**Grid aliasing is not the main cause of the leaflet drop-outs.**~~ At bias −4.3 a texel is sub-centimetre and a leaflet is several centimetres, and leaflets still vanish
  for 2–3 frames. *[INF]* A caster several texels wide cannot drop out of a fine grid because of re-sampling. On those frames **its geometry is missing from
  the shadow render**, or its shadow is computed from a different (coarser) version of the geometry. Grid re-sampling explains the edge crawl (SMRT 0 "progress bars"). It does not explain whole leaflets disappearing.
- **Temporal history is not the cause.** DLSS off at 16:13: «не помогло, мерцают». The "fill in" is therefore not DLSS or TSR convergence. *[INF]* Lumen's indirect light is low-frequency and cannot draw leaflet shapes.
- **Caching and staleness are not the cause.** `r.Shadow.Virtual.Cache 0` still pops. VSM resolution throttle off and pool 8192 still pop. Finer texels and `MaxPixelsPerEdge` 0.25 do **not help**.
- **The trigger:** the light still → calm, the light turning → pops. A turning light re-renders the whole clipmap every frame. *[INF]* So look for mechanisms that **drop or coarsen caster geometry when the shadow-render load is high**, and that the "fixes" tried so far (finer bias, finer edges) make worse. Classes C1 and C2 below fit that pattern.

## 1. Candidates

| # | Mechanism | Switch (registry) | Evidence | Verdict |
|---|---|---|---|---|
| C1 | **Nanite cluster / node queue overflow in the VSM raster.** Clusters past the buffer limit are dropped. Which ones are dropped depends on GPU work order, so it changes every frame | `r.Nanite.MaxCandidateClusters` ✅, `r.Nanite.MaxVisibleClusters` ✅, `r.Nanite.MaxNodes` ✅, `r.Shadow.Virtual.Nanite.AllowMultipassViews` ✅, `r.Nanite.ShowStats` ✅, `r.Nanite.StatsFilter` ✅ | §2.1 | **strongest** |
| C2 | **Nanite streaming pool pressure.** QualityScale raises pixels-per-edge, and pages thrash. Requests come from GPU feedback and arrive frames later, so geometry "fills in" | `r.Nanite.Streaming.QualityScale.{MinQuality, MinPoolPercentage, MaxPoolPercentage}` ✅, `r.Nanite.Streaming.StreamingPoolSize` ✅, `…Debug.StreamingPoolResize` ✅, `…MaxPendingPages` ✅, `…MaxPageInstallsPerFrame` ✅ | §2.2 | **strong** |
| C3 | **The shadow pass uses its own Nanite LOD bias** (coarser than the main view). Simplified leaf clusters lose thin leaflets | `r.Shadow.NaniteLODBias` ✅ | §2.3 | medium |
| C4 | **Nanite shadow-raster time budget** (dynamic pixels-per-edge) | `r.Nanite.ShadowRaster.TimeBudgetMs` ✅, `…ShadowRaster.PixelsPerEdgeScaling` ✅ | §2.4 | likely refuted |
| C5 | **HZB occlusion culling of shadow casters** (a previous-frame HZB culls wrongly) | `r.Shadow.Virtual.UseHZB` ✅, `…NonNanite.UseHZB` ✅, `…Cache.InvalidateUseHZB` ✅, `r.Nanite.Culling.HZB` ✅ | §2.5 | refuted for Nanite (already 0) |
| C6 | **Per-instance GPU occlusion culling** (non-Nanite) | `r.InstanceCulling.OcclusionCull` ✅ | §2.5 | weak (palms are Nanite) |
| C7 | **Page marking / one-frame-late page requests, pool overflow** | `r.Shadow.Virtual.MarkPixelPages` ✅, `…PageMarkingPixelStrideX/Y` ✅, `…PageDilationBorderSizeDirectional` ✅, `…AllowScreenOverflowMessages` ✅ | §2.6 | weak |
| C8 | **Temporal upscaler history on a static receiver** | `r.NGX.DLSS.Enable` ✅ | live 16:13 | refuted as the cause |
| C9 | **SMRT screen trace / slope extrapolation** | `r.Shadow.Virtual.ScreenRayLength` ✅, `…SMRT.ExtrapolateMaxSlopeDirectional` ✅; `…SMRT.ScreenRayLengthDirectional` ❌, `…SMRT.MaxSlopeBiasDirectional` ❌ | §2.7 | secondary (edge noise) |

## 2. Details

### 2.1 C1: Nanite buffer overflow in the shadow pass

- **Effective limits are half the engine's.** Log: `Pushing Device Profile CVar: [[r.Nanite.MaxVisibleClusters:4194304 -> 2097152]]` ·
  `[[r.Nanite.MaxCandidateClusters:16777216 -> 8388608]]` · `Selected Device Profile: [Windows_HighVRAM]` **[SRC: game log]**. Funcom's `[SystemSettings]` values
  (1 048 576 / 4 194 304, kit `DefaultEngine.ini:1332–1334`) are «ignored as it is lower priority than the previous 'SetByDeviceProfile'». The engine's own
  defaults, 4 194 304 and 16 777 216, appear as the "from" values of the push. *[INF]*
- **This exact game, the same kind of symptom, the Epic VSM engineer.** On Conan Exiles: Enhanced, the shadows «are patchy» and «change with the sun's stepped motion».
  Ola Olsson replied: «There may also be overflows in the Nanite queues, I forget whether we had feedback for those in 5.6» · «I'd focus on the Nanite buffer
  overflow investigation first». He suggested raising `r.Nanite.MaxVisiblePatches / MaxVisibleClusters / MaxCandidateClusters / MaxNodes` at runtime, and the diagnostics
  `nanitestats virtualshadowmaps` (or `r.Nanite.StatsFilter = virtualshadowmaps & r.Nanite.ShowStats 1`)
  **[SRC: https://forums.unrealengine.com/t/high-screen-percentage-virtual-shadow-cache-large-shadow-artifacts/2729841, May 2026; his staff badge is not shown on the page, UNC]**.
  The thread has no resolution.
- **Foliage is what overflows.** «Nanite candidate cluster buffer overflow detected. New high-water mark is 29106729 / 16777216» and «visible cluster buffer
  overflow… 7773324 / 4194304», with the advice to raise the cvar «to prevent potential visual artifacts». The reporter adds that «disabling the foliage made the error disappear»
  **[SRC: https://forums.unrealengine.com/t/missing-geometries-by-nanite/2689501]**.
- **The exe has a multipass escape hatch.** `r.Shadow.Virtual.Nanite.AllowMultipassViews`: «allows multiple Nanite passes if the view count might exceed Nanite
  limits… can maintain correct rendering in some extreme cases» **[SRC: exe help]**. The exe also holds the string «Nanite view overflow detected: %d / %d». The 5.8 text of the cluster-overflow
  warning was **not found** in the exe, and no overflow line appears in any 3.0.1 log. *[INF: the 5.8 warning may be missing or worded differently. Ola's
  remark says the feedback may be silent, so the log's silence is not a refutation.]*
- *[INF] Why C1 fits every observation.* A still light renders only a few pages per frame (cached), so no overflow. A turning light re-renders every page, and each page culls the
  palms again, so the cluster count multiplies. Finer bias means more pages, and `MaxPixelsPerEdge` 0.25 means about (1.2/0.25)² ≈ 23× more triangles, hence more clusters.
  Both raise the overflow, which explains why the "fixes" made nothing better. Dropped clusters scatter all over the crown, not only at the tips.
- **Test:** read `r.Nanite.MaxCandidateClusters`, `MaxVisibleClusters`, `MaxNodes`, then run `nanitestats virtualshadowmaps` with the sun turning (also try
  `r.Nanite.StatsFilter virtualshadowmaps` + `r.Nanite.ShowStats 1`; **[UNC]** whether they work in Shipping). Then exec ×2: `16777216` / `4194304` / MaxNodes ×2, and
  `r.Shadow.Virtual.Nanite.AllowMultipassViews 1`. **[UNC]** whether the buffers resize at runtime; Ola says «at runtime». After the exec, check the log for a
  read-only warning. Last, set `r.Nanite.MaxPixelsPerEdge` back to 1.2: if C1 is the cause, 0.25 should pop **more** than 1.2.

### 2.2 C2: Nanite streaming pool, quality scaling and thrash

- The effective pool is **512 MB** (HighVRAM; Funcom's 320 is ignored) **[SRC: game log]**. 512 is also the engine default **[SRC: Epic ticket answer quoted in
  https://forums.unrealengine.com/t/preventing-nanite-pop-in-issues-in-2d-rendering-use-cases/2512906]**.
- Exe help: `QualityScale.MaxPoolPercentage` «Adjust quality down whenever the streaming pool load percentage goes above this threshold» · `MinPoolPercentage`
  «Adjust quality up whenever… below» · `MinQuality` «Quality scaling will never go below this limit. 1.0 disables any scaling» **[SRC: exe]**. Epic (Tim Stullich):
  «Push it low enough and r.Nanite.Streaming.QualityScale kicks in and starts raising pixels per edge to keep the visible set in budget»
  **[SRC: https://forums.unrealengine.com/t/is-changing-r-nanite-streaming-streamingpoolsize-at-runtime-production-safe/2836829]**.
- Thrash: «cache thrashing can occur where streaming never settles even for a static view» (Sam Lapere). Latency: «After a few frames (and I think it is even just one frame)
  the right resolution is shown» **[SRC: 2512906 above]**. Exe help for `r.Nanite.Streaming.Debug.GPURequests`: «Process requests coming from GPU rendering feedback».
- *[INF]* At 4K with fine shadow pages, the shadow views ask for finer clusters than the main view. When pool load crosses Max%, the quality scale drops and pixels-per-edge rises
  for every view. Leaflets are the first thing simplification erodes. When load falls below Min%, quality returns and the fine pages are requested again. Each
  re-request reaches the GPU frames later, which looks exactly like «исчезают, появляются и заполняются». `MaxPixelsPerEdge` 0.25 pushes the pool load higher, so it cannot help.
- **Test:** read the three QualityScale values and `StreamingPoolSize`. Then `r.Nanite.Streaming.QualityScale.MinQuality 1` (disables the scaling, per the help). Second, a larger pool:
  `r.Nanite.Streaming.StreamingPoolSize 1024`. Runtime resize «shipped in 5.5» (same thread); `Debug.StreamingPoolResize` ✅. Epic advises against changing the pool at runtime in production, which does not matter for a test.

### 2.3 C3: shadow-only Nanite LOD bias

`r.Shadow.NaniteLODBias`: «LOD bias for nanite geometry in shadows. 0 = full detail. >0 = reduced detail» **[SRC: exe]**. Ola Olsson: «leaving it at 1 is typically
a win» (for performance) **[SRC: https://forums.unrealengine.com/t/ue-5-7-2-vsm-performance-with-nanite-voxelize-and-r-shadow-nanitelodbias/2706943]**. The default in
5.8 is **[UNC]**. A forum tip on twinkling leaves: enable Nanite **Preserve Area** «so leaf cards don't drop out between LODs» **[SRC: https://forums.unrealengine.com/t/the-leaves-of-the-plant-model-are-twinkling/2845231; community, UE 5.4]**.
This is an asset setting and out of reach (protected pak). *[INF]* `MaxPixelsPerEdge` 0.25 did not help, which argues against C3 alone, unless C1 or C2 capped the refinement.
**Test:** read the value, then `r.Shadow.NaniteLODBias 0`.

### 2.4 C4: Nanite shadow-raster time budget

Exe help: `ShadowRaster.TimeBudgetMs` «Frame's time budget for Nanite shadow raster in milliseconds»; `ShadowRaster.PixelsPerEdgeScaling` «Lower limit percentage to
scale the Nanite shadow raster MaxPixelsPerEdge value when over budget». In 5.4 the source default is 100.0 («100% - no scaling») **[SRC: https://indxzero.github.io/ue544cvarwiki/articles/r.nanite.shadowraster.pixelsperedgescaling]**.
Late 2025: «r.Nanite.ShadowRaster.PixelsPerEdgeScaling doesn't actually seem to be used by the engine». Epic support (Sam Lapere): the «implementation wasn't
finished», and the commit is «flagged as WIP» **[SRC: https://forums.unrealengine.com/t/nanite-performance-options/2687737]**. Neither the kit configs nor the pack set it. **Likely
refuted.** **Test:** read both; if `PixelsPerEdgeScaling` < 100, set it to 100.

### 2.5 C5/C6: occlusion culling of casters

- `r.Shadow.Virtual.UseHZB` is **already 0** (log: `Set CVar [[r.Shadow.Virtual.UseHZB:0]]`; kit `DefaultEngine.ini:67`). 5.8 help: «Enables two pass occlusion
  culling for (Nanite) Virtual Shadow Maps» **[SRC: exe]**. So Nanite palms are not HZB-culled in VSM. **C5 is refuted for Nanite**, unless something overrode it live **[UNC → read it]**.
- Non-Nanite: in 5.4, `NonNanite.UseHZB` 1 = «HZB from previous frame. Can incorrectly cull in some cases due to outdated data» **[SRC: https://indxzero.github.io/ue544cvarwiki/articles/r.shadow.virtual.nonnanite.usehzb]**.
  `r.InstanceCulling.OcclusionCull`: «Whether to do per instance occlusion culling for GPU instance culling» **[SRC: exe]**. The Palworld field note says it makes «dynamic foliage shadows
  disappear or flicker» (11-06 Finding 10). *[INF]* Both matter only if the palm crowns are non-Nanite.
- **Test (cheap):** read `UseHZB`; set `r.Shadow.Virtual.NonNanite.UseHZB 0` and `r.InstanceCulling.OcclusionCull 0`.

### 2.6 C7: page marking, request lag, pool overflow

Epic: «Pages are allocated and rendered only as needed to shade on-screen pixels based on an analysis of the depth buffer». A pool overflow «manifests visually as a
checkerboard pattern, or corrupt or missing shadows» **[SRC: https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-shadow-maps-in-unreal-engine]**. The docs do not say
which frame's depth is used **[UNC]**. *[INF]* A missing page loses a whole page-sized square on the sand, not single leaflets, and the camera hardly moves. Pool 8192 was tested.
`PageMarkingPixelStrideX` warns of «artifacts due to missing pages» if raised **[SRC: exe]**. **Weak. Test:** read the stride (expect 1); set `r.Shadow.Virtual.AllowScreenOverflowMessages 1` and look for on-screen VSM overflow messages.

### 2.7 C9: SMRT screen ray and extrapolation

`ScreenRayLength`: «Length of the screen space shadow trace away from receiver surface (smart shadow bias) before the VSM / SMRT lookup» **[SRC: exe]**. Community: the screen
ray pushes through thin geometry, and a 5.5 commit «VSM: disable screen ray and normal bias on subsurface materials» **[SRC: search excerpts of
https://forums.unrealengine.com/t/subsurface-transmission-and-smrtrayoffset/2702960 and …/nanite-trees-self-shadowing-disappears-at-distance/2272248, UNC]**.
`ExtrapolateMaxSlopeDirectional`: «Higher values allow softer penumbra edges but can introduce light leaks behind second occluders» **[SRC: exe]**. *[INF]* Both act near the
receiver and on penumbra edges. They cannot remove a leaflet that sits metres up in the crown. Their per-frame random rays feed the edge noise, but 32 rays did not change the pops. **Test:**
`ScreenRayLength 0`, then `ExtrapolateMaxSlopeDirectional 0`, edges only.

## 3. Recommended live tests, in order

Stand: delta 0.0025, 11:00, the palm under the camera, 144-fps capture + `shadow_pop_map.py` / `leaf_pop_finder.py`, one launch, A–B–A. The agent can run these
alone; the owner's eye is needed only for the winner.

1. **Discriminator: full re-render with the light still.** `DynamicSky.SolarUpdateAngleDelta 2.0` + `r.Shadow.Virtual.Cache.ForceInvalidateDirectional 1` ✅
   (the 11-06 experiment 1, never run). Leaflets pop with the light still → the per-render geometry drop (C1–C3) is the cause and the rotation is innocent.
   Calm → the cause is specific to the light direction; go to step 6 and the 11-07 paths.
2. **C1 read:** `nanitestats virtualshadowmaps` (and `r.Nanite.StatsFilter virtualshadowmaps` + `r.Nanite.ShowStats 1`) at delta 2.0 vs 0.0025. Compare the
   candidate and visible cluster counts with 8 388 608 / 2 097 152.
3. **C1 fix try:** `r.Nanite.MaxCandidateClusters 16777216`, `r.Nanite.MaxVisibleClusters 4194304`, `r.Nanite.MaxNodes` ×2, `r.Shadow.Virtual.Nanite.AllowMultipassViews 1`.
   Then `r.Nanite.MaxPixelsPerEdge` 0.25 vs 1.2 (C1 predicts that 0.25 is worse).
4. **C2:** read the QualityScale trio; `r.Nanite.Streaming.QualityScale.MinQuality 1`, then `r.Nanite.Streaming.StreamingPoolSize 1024`.
5. **C3/C4:** `r.Shadow.NaniteLODBias 0`; read `ShadowRaster.PixelsPerEdgeScaling` (set 100 if lower).
6. **Cheap culling checks (C5/C6):** read `r.Shadow.Virtual.UseHZB` (expect 0); `r.Shadow.Virtual.NonNanite.UseHZB 0`; `r.InstanceCulling.OcclusionCull 0`.
7. **Edges (C9):** `r.Shadow.Virtual.ScreenRayLength 0`, then `SMRT.ExtrapolateMaxSlopeDirectional 0`.

Any winner goes into the pack's `Engine.ini` only if a value that the device profile sets can be overridden from there. The log shows `SetByDeviceProfile` beats
`SetBySystemSettingsIni`. **[UNC]** whether `[ConsoleVariables]` outranks it, or whether a Lua `exec` at load is needed.

## Sources

- Epic forum: Conan Exiles Enhanced, patchy VSM shadows (Ola Olsson) — https://forums.unrealengine.com/t/high-screen-percentage-virtual-shadow-cache-large-shadow-artifacts/2729841
- Epic forum: missing geometry, Nanite cluster overflow — https://forums.unrealengine.com/t/missing-geometries-by-nanite/2689501
- Epic forum: Nanite performance options (ShadowRaster scaling WIP) — https://forums.unrealengine.com/t/nanite-performance-options/2687737
- Epic forum: runtime StreamingPoolSize, QualityScale — https://forums.unrealengine.com/t/is-changing-r-nanite-streaming-streamingpoolsize-at-runtime-production-safe/2836829
- Epic forum: Nanite pop-in, pool default, thrash — https://forums.unrealengine.com/t/preventing-nanite-pop-in-issues-in-2d-rendering-use-cases/2512906
- Epic forum: VSM invalidation during Nanite streaming — https://forums.unrealengine.com/t/vsm-invalidation-during-nanite-streaming/2511072
- Epic forum: NaniteLODBias and voxels — https://forums.unrealengine.com/t/ue-5-7-2-vsm-performance-with-nanite-voxelize-and-r-shadow-nanitelodbias/2706943
- Epic forum: twinkling leaves (community) — https://forums.unrealengine.com/t/the-leaves-of-the-plant-model-are-twinkling/2845231
- Epic docs: Virtual Shadow Maps — https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-shadow-maps-in-unreal-engine
- UE 5.4 cvar wiki — …/r.nanite.shadowraster.pixelsperedgescaling, …/r.shadow.virtual.usehzb, …/r.shadow.virtual.nonnanite.usehzb (https://indxzero.github.io/ue544cvarwiki/)
- Local: exe help (scratchpad `helpscan.py`, read-only), `Saved/Logs/ConanSandbox.log` (device profile pushes), kit `UE4/Config/DefaultEngine.ini`, `DefaultDeviceProfiles.ini`.

## 4. Shader reading 2026-11-07 17:2x (helper, kit `F:/CEUE5Devkit/Engine/Shaders/Private/`; no renderer C++ in the kit)

Measured first (bug 67, clean stand): only a change of the light DIRECTION pops leaflets; a full re-render with the same direction is stable. What in the shaders
switches on only when the light moves — the C++ marks a moving directional light's views UNCACHED (`VSM_PROJ_FLAG_UNCACHED` / `NANITE_VIEW_FLAG_UNCACHED`), and then:

1. **Receiver-mask culling of casters (prime suspect).** `Nanite/NaniteInstanceHierarchyCulling.usf:194` `Cull.bUseReceiverMask = Cull.bUseReceiverMask && Cull.bIsViewUncached;`
   · `Nanite/NaniteCullingCommon.ush:350` `bUseReceiverMask = bUseReceiverMask && !bInCacheAsStatic;` · the mask marks only the receiver's own 8×8-per-page cell, with no
   widening for SMRT ray spread or texel dither (`VirtualShadowMaps/VirtualShadowMapPageMarking.ush:75-79`, `MarkPageReceiverMask`) · clusters outside the marked cells
   are culled (`VirtualShadowMaps/VirtualShadowMapPageOverlap.ush:181-199`, `IntersectMask8x8`). Switch: `r.Shadow.Virtual.UseReceiverMaskDirectional` (live 1).
   *[INF]* SMRT samples the map along rays AWAY from the receiver's texel, into cells whose leaf clusters were culled — and the cells and rays change every frame.
2. **No static caching for an uncached view** — `VirtualShadowMapPageCacheCommon.ush:96` `if (bViewUncached) { return false; }` in `ShouldCacheInstanceAsStatic`;
   with a still light a leaf beyond its WPO-disable distance is cached static (`:40`, `:104`).
3. **One-pass occlusion against the previous frame's HZB through the previous light matrix** — `Nanite/NaniteCullingCommon.ush:619` («VSM supports one-pass
   occlusion culling … using only previous-frame with artifacts as a result»), `:632`, `:639`; WPO leaves protected only by `MaxWPOExtent` padding.
4. Dynamic depth-cull range for non-static geometry (`NaniteCullingCommon.ush:535-537`).
SMRT's random seed is `View.StateFrameIndex` (`VirtualShadowMapProjectionDirectional.ush:244`) — per frame with or without light motion, so it is not the trigger alone.
Test order: `UseReceiverMaskDirectional 0` under the turning sun (series c7), then the HZB path.
