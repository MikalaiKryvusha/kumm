# Research — Conan 3.0.1 water reflections: a third way besides screen traces and hardware rays

> **Created:** 2026-11-09 · **Parent:** owner's request 2026-11-09 00:07 · **Status:** recon · **Outbound:** candidates to try live

## The question

Conan Exiles 3.0.1 (UE 5.8, Lumen) reflects the far shore, palms and mountains in its water by two known paths:

1. **Lumen screen traces** (`r.Lumen.Reflections.ScreenTraces 1`): rejected by the owner. They break behind occluders (a white streak behind palm trunks) and off-screen.
2. **Hardware ray tracing** (`r.RayTracing.Enable 1`, `ScreenTraces 0`, `DistantScreenTraces 0`, `SampleSceneColorAtHit 0`): this works, but it costs about 17 % FPS on a CPU-bound scene (RTX 5070 Ti, Ryzen 7 5700G).

With both paths off, the water shows only a grey-blue sky colour. Nothing on the shore is reflected, not even the near shore.

**Goal:** find a third way that reflects distant geometry (hundreds of metres away), uses no screen space, and costs less than hardware RT.

**Source caveat.** Epic's public docs list few cvar names. Cvar names, defaults and flags below were checked against the **UE 5.4.4 cvar wiki** generated from engine source (indxzero.github.io/ue544cvarwiki). This is the newest public cvar listing I found. **No cvar has been checked against 5.8.** Before you trust a line, type the cvar name alone in the console: an existing cvar prints its value, and an unknown one prints nothing. "Unverified" means I found no source for it.

---

## 0. Diagnosis first: is there a software Lumen scene at all?

The "sky only" result with RT off is the key clue. Lumen software ray tracing traces **mesh distance fields** and the **global distance field** built from them. Landscape is traced as heightfields.

- `r.GenerateMeshDistanceFields`: "Whether to build distance fields of static meshes, needed for Lumen Software Ray Tracing and Distance Field AO". Engine default 0, `ECVF_ReadOnly`, set by the project at cook time. [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.generatemeshdistancefields)
- `r.DistanceFields.SupportEvenIfHardwareRayTracingSupported`: "Setting it to 0 will skip distance field overhead when hardware ray tracing is supported". Default 1, `ECVF_ReadOnly`. `DoesProjectSupportDistanceFields()` returns false when this is 0 and ray tracing is allowed. [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.distancefields.supportevenifhardwareraytracingsupported). Epic also names it in the Lumen docs. [Lumen Technical Details](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-technical-details-in-unreal-engine)

If Funcom shipped 3.0 as a hardware-RT Lumen project and set either cvar off, the cooked game has **no distance fields**. Software Lumen then has nothing to hit, and every reflection ray falls back to the sky. That matches what we saw exactly. This is a hypothesis; it has not been observed.

**Live check.** Both cvars are read-only, so this only prints their values:

```
r.GenerateMeshDistanceFields
r.DistanceFields.SupportEvenIfHardwareRayTracingSupported
r.DistanceFields.LogAtlasStats 1
```

`r.DistanceFields.LogAtlasStats 1` is named in Epic's Lumen docs. It writes the distance field atlas usage to the log; an empty atlas means no mesh SDFs.

- **Either cvar is 0, or the atlas is empty:** candidate A below is dead. No console setting can bring distance fields back, because they are cook-time data. Go straight to B and C.
- **Both are 1 and the atlas has data:** software Lumen exists, but something stopped it from being used or from reaching far enough. Candidate A is the fix.

A second suspect: `r.RayTracing.Enable 0` is an "experimental" runtime toggle. [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.raytracing.enable) It may not leave Lumen in the same state as `r.Lumen.HardwareRayTracing 0`. Candidate A therefore switches Lumen to software mode explicitly. This is unverified.

---

## Candidates

### A. Lumen software ray tracing with extended reach

**What it does.** Reflection rays march the global distance field and landscape heightfields, then light each hit from the Lumen surface cache. Epic's docs say:

- "With Software Ray Tracing, the Lumen Scene covers 200 m from the camera"; the Lumen Scene View Distance setting can raise this to 800 m.
- Per-mesh SDFs are traced only for "the first two meters" of a ray; the global distance field covers the rest.
- Lumen Reflections "support Single Layer Water materials, with reflections forced to mirror".

Sources: [Lumen Technical Details](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-technical-details-in-unreal-engine) · [Lumen GI and Reflections](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine)

**Reach knobs.** All of these are present in the 5.4.4 wiki and none is read-only, so all can be set by console:

| Cvar | Default | Effect | Source |
|---|---|---|---|
| `r.Lumen.HardwareRayTracing` | 1 | 0 = Lumen uses software tracing | [wiki listing](https://indxzero.github.io/ue544cvarwiki/docs/alphabetic/r/) |
| `r.Lumen.TraceDistanceScale` | 1.0 | Multiplies the post-process Max Trace Distance. Code: `LumenMaxTraceDistance * GLumenTraceDistanceScale`, clamped to the internal `Lumen::MaxTraceDistance` (that constant's value is unverified). Scalability, render-thread safe. | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.lumen.tracedistancescale) |
| `r.AOGlobalDistanceField.NumClipmaps` | 4 | Number of global SDF clipmaps. "Setting this to anything other than 4 is currently only supported by Lumen." Also sets how far mesh SDF mips are requested. | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.aoglobaldistancefield.numclipmaps) |
| `r.LumenScene.GlobalSDF.ClipmapExtent` | 2500 | Extent of the first clipmap (cm). Each further clipmap doubles it, so 4 clipmaps reach 2500 × 2³ = 20 000 cm, the 200 m above (my arithmetic). | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.lumenscene.globalsdf.clipmapextent) |
| `r.LumenScene.Heightfield.Tracing` | 1 | Software tracing of landscape. Cliffs and hills built from landscape come from this. | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.lumenscene.heightfield.tracing) |
| `r.Lumen.TraceMeshSDFs` / `r.Lumen.Reflections.TraceMeshSDFs` | 1 / 1 | Detail tracing of mesh SDFs. In reflections it runs only on the **opaque** pass (`ReflectionPass == ELumenReflectionPass::Opaque`), so water reflections use the global SDF only. | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.lumen.reflections.tracemeshsdfs) · [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.lumen.tracemeshsdfs) |
| `r.Lumen.TraceMeshSDFs.TraceDistance` | not shown | "Max trace distance against Mesh Distance Fields and Heightfields" | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.lumen.tracemeshsdfs.tracedistance) |

**Lumen Scene View Distance has no cvar.** It is a post-process setting (`LumenSceneViewDistance`), and I found no cvar override for it. The global SDF code adds clipmaps two at a time only when the next one fits inside that view distance. [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.aoglobaldistancefield.numclipmaps) Whether `NumClipmaps 6` alone extends the range past the post-process limit is **unverified**.

**Cost.** GPU, a few ms at most. Raising clipmaps or extent coarsens voxels or adds GPU update work; changing them forces a one-off global SDF rebuild (a hitch). CPU cost is light: mesh SDF streaming plus scene updates. No acceleration structure is rebuilt every frame (that rebuild is the HWRT cost). Epic calls software global tracing "the fastest tracing method in Lumen". [Performance Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-performance-guide-for-unreal-engine)

**Will it reach the far shore?** Partly:

- **Within reach:** the far shore of a lake or oasis inside ~200 m, landscape cliffs, and buildings with distance fields.
- **Coarse quality:** global SDF reflections are blurry and blobby, never mirror-sharp. Epic: hardware RT is "the only way to get high-quality mirror reflections".
- **Possibly missing:** palms appear only if their foliage has "Affect Distance Field Lighting" (a level setting, not a cvar). World Position Offset is not supported in SDFs. Small meshes are culled from the Lumen Scene, and areas without surface cache coverage "appear black in reflections". [Technical Details](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-technical-details-in-unreal-engine)
- **Mountains beyond 200–800 m:** out of reach. An Epic forum answer: mountains "too far away to be drawn into Lumen's raytracing representation… will just reflect the skylight." [forum](https://forums.unrealengine.com/t/how-can-i-increase-lumen-reflection-max-distance-on-water/615633)

**Verdict.** This is the real third way, but **only if diagnosis 0 shows distance fields exist**.

### B. Single Layer Water: force reflection captures and sky

`r.Water.SingleLayer.Reflection`. Default 1; flags `ECVF_RenderThreadSafe | ECVF_Scalability`, so it can be set by console. [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.water.singlelayer.reflection)

| Value | Meaning |
|---|---|
| 0 | Off |
| 1 | Same technique as the scene; the only value that allows Lumen on water |
| 2 | **Forced reflection captures and sky** |
| 3 | Forced SSR |

- **What 2 gives.** Captures are cubemaps taken from a point. Parallax error shrinks with distance, so distant mountains and the far shore are the best case for a capture placed near the water. It is not screen space, so it has no occluder streaks.
- **Cost:** about zero.
- **Limits.** It works only if 3.0's levels place reflection captures near the water, or if the sky light uses **Captured Scene** mode. A Real Time Capture sky light holds only "SkyAtmosphere, VolumetricCloud… sky domes", with no level geometry. [Sky Lights](https://dev.epicgames.com/documentation/en-us/unreal-engine/sky-lights-in-unreal-engine) If neither holds, the result looks like today's grey-blue sky.
- **Requires** that Conan's water uses the Single Layer Water shading model. This is unverified.

**Verdict.** A one-line test that settles itself on sight.

**Modding variant (no cvar; needs UE4SS or Lua, unverified).** Switch the sky light to Captured Scene with a low **Sky Distance Threshold** ("Distance from the Sky Light at which any geometry should be treated as part of the sky (also used by Reflection Captures)"), then call `RecaptureSky()` once ("at least 120 ms" stall). [Sky Lights](https://dev.epicgames.com/documentation/en-us/unreal-engine/sky-lights-in-unreal-engine) This bakes the distant mountains into the sky cubemap that the water already falls back to, and costs nothing per frame. Caveat: it changes sky lighting everywhere. A sphere capture spawned at runtime "worked in the editor viewport but not at runtime" for one forum user. [forum](https://forums.unrealengine.com/t/how-can-i-increase-lumen-reflection-max-distance-on-water/615633)

### C. Hardware RT with the CPU cost trimmed

This is not a new technique, but it may be the cheapest way to keep the image the owner already accepted. The 17 % loss is on a **CPU-bound** scene. Epic: HWRT "requires rebuilding the Top Level Acceleration Structure (TLAS) every frame", and that cost "scales with the number of instances". [Performance Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-performance-guide-for-unreal-engine) Dynamic geometry (WPO foliage, skinned characters) adds per-frame updates on top. All names below are in the 5.4.4 wiki listing:

| Cvar | Values and notes | Source |
|---|---|---|
| `r.RayTracing.Culling` | 0 off; 1 behind camera; 2 front and behind (distance AND angle); 3 front and behind (distance OR angle). Code default 3. | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.raytracing.culling) |
| `r.RayTracing.Culling.Radius` | Default 30000 (300 m) | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.raytracing.culling.radius) |
| `r.RayTracing.Culling.Angle` | Epic's example: 0.5 | [Performance Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-performance-guide-for-unreal-engine) |
| `r.RayTracing.Geometry.StaticMeshes.WPO` | 0 hide WPO meshes; 1 visible with WPO evaluation (default, dynamic geometry); **2 visible, no WPO evaluation**. With 2, palms stay in reflections as static shapes. | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.raytracing.geometry.staticmeshes.wpo) |
| `r.RayTracing.Geometry.SkeletalMeshes` | Default 1; 0 removes characters and creatures from RT, so they leave the water reflections | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.raytracing.geometry.skeletalmeshes) |
| `r.RayTracing.Geometry.LandscapeGrass` | Name verified; values unverified (presumably 0/1) | [wiki listing](https://indxzero.github.io/ue544cvarwiki/docs/alphabetic/r/) |
| `r.Lumen.ScreenProbeGather.HardwareRayTracing` | 0 = GI uses software tracing (needs distance fields); reflections keep HWRT through `r.Lumen.Reflections.HardwareRayTracing 1`. This saves GPU, not the TLAS CPU cost. | [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.lumen.screenprobegather.hardwareraytracing) · [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.lumen.reflections.hardwareraytracing) |

- **How to check:** compare `Stat SceneRendering` → "Ray tracing active instances" against the FPS change (Epic's suggested counter).
- **Reach:** full; this is today's HWRT image.
- **Cost:** something between 0 % and 17 %. It has to be measured A-B-A-B.

### Rejected or not applicable

- **Lumen Far Field** (`r.LumenScene.FarField`, `r.LumenScene.FarField.MaxTraceDistance`): this is the engine's answer for distant reflections. Epic: "Lumen Hardware Ray Tracing implements Far Field traces". It also needs `r.LumenScene.FarField=1` in DefaultEngine.ini and World Partition HLOD1 built. [Technical Details](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-technical-details-in-unreal-engine) It is HWRT-only and cook-dependent, so it is not a third way. It could extend candidate C past 300 m with a smaller culling radius; whether Conan's cook has HLOD1 is unknown. [forum, Epic reply on distant meshes](https://forums.unrealengine.com/t/include-huge-always-loaded-distant-meshes-in-the-far-field-for-lumen-reflections/2687349)
- **Hit lighting** (`r.Lumen.HardwareRayTracing.LightingMode`): HWRT-only. It improves the lighting of hits, not reach, and costs more. [Lumen GI and Reflections](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine)
- **Legacy SSR** (`r.ReflectionMethod 2`, `r.SSR.Quality`, `r.SSR.MaxRoughness`, or `r.Water.SingleLayer.Reflection 3`): screen space, with the same occluder and off-screen failure the owner rejected, so it does not count. Epic notes `r.Lumen.Reflections.Allow 0` swaps Lumen reflections for SSR. [Performance Guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-performance-guide-for-unreal-engine) · [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.reflectionmethod)
- **`r.ReflectionMethod 0`** (None: "Reflection Captures, Planar Reflections and Skylight"): the same sources as B, but for the whole scene. B is the narrower, water-only form.
- **Planar reflections:** not reachable from the console:
  - They need a `PlanarReflection` actor placed in the level.
  - `r.AllowGlobalClipPlane` is `ECVF_ReadOnly`, and changing it "causes a full shader recompile", so the shipped shaders lack the permutation. [wiki](https://indxzero.github.io/ue544cvarwiki/articles/r.allowglobalclipplane)
  - The scene is re-rendered for the reflection, which roughly doubles CPU draw cost: the wrong trade on a CPU-bound scene.
  - A 5.8 forum report says a planar actor "renders no reflection when Lumen Global Illumination is active". [forum](https://forums.unrealengine.com/t/5-8-lumen-overwrites-planar-reflection-actor/2836896)
- **`r.Lumen.Reflections.DistantScreenTraces`**: screen space. Already off.

---

## Ranking: what to try live

**1. Diagnose, then software Lumen with longer reach (A).** Run the three diagnostic lines from section 0 first. If distance fields exist:

```
r.Lumen.HardwareRayTracing 0
r.Lumen.Reflections.ScreenTraces 0
r.Lumen.Reflections.DistantScreenTraces 0
r.LumenScene.Heightfield.Tracing 1
r.Lumen.TraceDistanceScale 4
r.AOGlobalDistanceField.NumClipmaps 6
```

If the shore is still not reflected, add `r.LumenScene.GlobalSDF.ClipmapExtent 5000`. To return to today's state: `r.Lumen.HardwareRayTracing 1`, `r.Lumen.TraceDistanceScale 1`, `r.AOGlobalDistanceField.NumClipmaps 4`, `r.LumenScene.GlobalSDF.ClipmapExtent 2500`.

**2. Captures and sky on the water only (B).** A one-line test at zero cost; the result shows whether 3.0's levels have reflection captures:

```
r.Water.SingleLayer.Reflection 2
```

Revert with `r.Water.SingleLayer.Reflection 1`.

**3. Trimmed hardware RT (C).** Keeps the accepted image; measure the FPS against plain HWRT (A-B-A-B):

```
r.RayTracing.Enable 1
r.Lumen.Reflections.ScreenTraces 0
r.Lumen.Reflections.DistantScreenTraces 0
r.Lumen.Reflections.SampleSceneColorAtHit 0
r.RayTracing.Culling 3
r.RayTracing.Culling.Radius 20000
r.RayTracing.Culling.Angle 0.5
r.RayTracing.Geometry.StaticMeshes.WPO 2
r.RayTracing.Geometry.SkeletalMeshes 0
r.RayTracing.Geometry.LandscapeGrass 0
```

Try one line at a time to see which one buys the FPS. `SkeletalMeshes 0` takes characters out of the reflections; drop that line if the owner wants them reflected.

**Open points to observe live:**

- whether the 5.8 cvar names match the 5.4.4 list;
- whether Conan's water uses the Single Layer Water shading model;
- the values of the two distance field cvars;
- the sky light's mode (Real Time Capture or Captured Scene).

## Live result (2026-11-09 00:4x – 01:39)

- Distance fields ARE cooked in 3.0.1: `r.GenerateMeshDistanceFields` 1, `r.DistanceFields.SupportEvenIfHardwareRayTracingSupported` 1 (read live). Defaults read:
  `r.Lumen.TraceDistanceScale` 1, `r.AOGlobalDistanceField.NumClipmaps` 4, `r.LumenScene.GlobalSDF.ClipmapExtent` 2500, `r.LumenScene.Heightfield.Tracing` 1,
  `r.Water.SingleLayer.Reflection` 1.
- Candidate 1 tried as variant `sw` of `ConanExiles/_config/set-reflections.sh` (RT 0, screen traces 0, TraceDistanceScale 4, 6 clipmaps, extent 5000): the far shore,
  cliffs and arch appear in the water as warm, soft (coarse) reflections over the whole surface; with the defaults (`off`) the water shows only the sky.
- Cost on four still river beaches (one-minute captures, NPCs frozen, no rain): `sw` ≈ −1 % FPS vs `off`, hardware rays (variant 6) ≈ −6 %; the fifth scene is void
  (hitches + rain) — report `testcases/reports/2026-11-09_conan-water-reflections-five-scenes.md`, review folder 76. Candidates 2 and 3 not tried yet.
