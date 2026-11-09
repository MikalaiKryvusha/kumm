# Research — FluidFlux: distant shimmer of the water surface (Conan 3.0.1, KUMM bug 89)

> **Created:** 2026-11-09 · **Parent:** bugs/89_conan_water_reflection_flicker.md · **Status:** recon · **Outbound:** levers to A-B in game

Recon 2026-11-09 17:45–18:06. Three kinds of evidence, labelled throughout:

- **[WEB]**: the author's pages (imaginaryblend.com, the Epic forum product thread, itch.io) and third-party pages, each with its URL.
- **[PORT]**: [DaiZiLing/Flux2-Shoreline-Wave-HLSL](https://github.com/DaiZiLing/Flux2-Shoreline-Wave-HLSL). This is a third-party HLSL port of the Fluid Flux **2.0** `M_FluxSurfaceOver` graph (README: "only most of the key nodes … translated", "cannot be used as shader directly"). It is a reading aid. 3.x may differ and the code is not to be copied (it ports a paid asset).
- **[GAME]**: the cooked 3.0.1 assets. `retoc-5.8 to-legacy -f FluidFlux/Surface` from the game paks went into the session scratchpad (read-only on the game), then `uaj tojson … VER_UE5_8`, the name map and the tagged bools of the cached expression data. Also the kit's engine shaders `F:/CEUE5Devkit/Engine/Shaders/Private/`.

## Summary

- **The author documents no fix for distant aliasing or shimmer.** Nothing in the documentation, the 1.1 / 2.0 / 3.0 release notes, the forum product thread or the itch.io comments covers it. The only anti-aliasing guidance the author gives: 2.0 release notes, Known issues, "TSR antialiasing still causes some issues, so it is better to use TemporalAA" ([2.0 notes](https://imaginaryblend.com/2023/05/25/fluid-flux-2-0-release-notes/)). The project settings in the docs are "Velocity Pass: Write During Base Pass" and "Default Renderer Motion Vector: Precise" ([docs](https://imaginaryblend.com/2025/01/10/fluid-flux-documentation/)). A 2.1 note (secondhand via 80.lv) says "Adjustments for distant surface rendering. Added OceanWaveRange and OceanWaveFaloff parameters" ([80.lv](https://80.lv/articles/this-fluid-simulation-add-on-for-ue5-gets-an-infinite-ocean-map)). These are today's `WaveTextureRange` / `WaveTextureFalloff`, which bug 89 tried: no effect.
- **The master's shipped switch defaults** [GAME] (decoded from `StaticSwitchValues`): `UseWaterRoughnessAdvanced` **ON**, `UseScreenSpaceReflections` **ON**, `UseFluxWaveGerstner` **OFF**, `UseWaveTextureRenderTarget` **OFF**, `UseFluxWaveDistant` OFF, `StateCheapNormal` ON. `MI_OceanOver_SCW` overrides only Ocean / Coastline / Simulation / SimulationBlend / DetailWave / PreciseCoastline / FluxWaveDistant / FoamDithering. So **`GerstnerNormalScale` could not have worked**: the Gerstner layer is compiled out.
- **The engine's geometric specular AA is not compiled into this material** [GAME]. `bNormalCurvatureToRoughness` is absent from the material's properties, so `r.NormalCurvatureToRoughness*` (registered) are inert here. Even when enabled, the engine reads the derivatives of the **vertex** normal (`MaterialTemplate.ush:4284-4302`), not of the per-pixel wave normal.
- **TSR's anti-flicker cannot act on this water** [GAME, engine shader]. `TSRDilateVelocity.usf:361-365` marks a pixel "moving" when its world position changed by more than a pixel radius or it has pixel animation. The flicker heuristic only accumulates on static pixels (`TSRRejectShading.usf:230-239`, `bIsStatic`). The water writes velocity for its WPO waves (`r.Water.SingleLayer.ForceVelocity`, the depth prepass by default), so its pixels most likely count as moving. That would explain why `r.TSR.ShadingRejection.Flickering 1` measured nothing (an inference from the shader code; the IsMoving mask was not looked at live, `r.TSR.Visualize` could show it). The master does **not** use Temporal Responsiveness (`bUsesTemporalResponsiveness` false; `bUsesMotionVectorWorldOffset` false; `bHasVertexInterpolator` TRUE).
- **The FluidFlux surface layers are computed per vertex** [PORT + GAME]. In the port the whole `MF_SurfaceLayer` result is called `SurfaceLayerVS` and every texture read in it is `SAMPLE_TEXTURE2D_LOD(…, 0)`. The cooked master has `bHasVertexInterpolator` TRUE and `MF_SurfaceFlux_VertexInterpolator`. The coastline, ocean wave and simulation normals are therefore **point samples at the water mesh's vertices, at mip 0**, interpolated across triangles. Texture mip bias, LOD bias and Toksvig-filtered mips cannot reach them. Only fading their amplitude with distance can.
- **`WaveTextureDecodeNormal` is a divisor** [PORT]: `XY = (rg − 0.5) * (1 / NormalScale)` in `MF_DecodeNormaDerivate`. The value 0 is a divide-by-zero (inf / NaN normals), not "off". The 2.4× worse reading in bug 89 is that artefact. It is not evidence that the wave-texture normal is "the smooth part". Raising it above 1 flattens the ocean wave-texture normal.

## 1. UseFluxWaveDistant, MF_DistantLayer, UseWaterRoughnessAdvanced: the author's distant fix?

**UseFluxWaveDistant / MF_DistantLayer.** This is the switch for a **horizon cap material**. It does not fade distance inside the main surface.

- [GAME] The game ships `/Game/Marketplace/FluidFlux/Surface/Templates/Ocean/Materials/MI_OceanOver_Waves_Horizon`. Its switches: `UseFluxWaveDistant` **True**, `UseSimulation` False, `UseCoastline` False, `UseFoam` False, `UseDetailWaveWPO` False, `UseDetailWave` True, `UseOcean` True, `UseCheapScattering` / `UseNormalScattering` True. Its scalar is `DetailWaveRange 0`. The other permutations shipped are `MI_OceanOver_00W`, `_0CW`, `_S00`, `_S0W`, `_SCW` (S = simulation, C = coastline, W = waves).
- [WEB] 2.0 notes, "Niagara Infinite Mesh": "a simplified distant mesh is employed to cap the surface on the horizon". The same notes: "Material is not working on the distant ocean mesh after updating the project … Remove distant meshes and switch Surface->SurfaceMeshMode to InfiniteGrid_128_Niagara" ([2.0 notes](https://imaginaryblend.com/2023/05/25/fluid-flux-2-0-release-notes/)).
- [PORT] With `UseFluxWaveDistant` on, `MF_SurfaceFlux_WaveTexture` returns `Flux_A` (normal `(0,0,1)`, no foam, no velocity) instead of the decoded wave. `MF_WaterlineCorrection` keeps the layer's own WPO. The far surface becomes flat plus whatever `MF_DistantLayer` adds. That function is not in the port, so its content is unknown.
- **Verdict:** this is the author's cheap far mesh, not a per-distance anti-aliasing blend. It is a static switch, so it cannot be flipped on the live MID. Applied to the whole water body it would flatten the near water too. It is useful as a **diagnostic**: swap the water body's material to `MI_OceanOver_Waves_Horizon` and look at the far band (lever D below).

**UseWaterRoughnessAdvanced.** The master default is ON and SCW does not override it [GAME]. So the "advanced" roughness is what the game renders. That fits bug 89, where `WaterRoughnessFromFresnel` changed the metric. [PORT] `MF_FluidWaterLayer`:

```
R  = (dot(H, N) - WaterRoughnessFromSpecularDiv) / (1 - WaterRoughnessFromSpecularDiv) * WaterRoughnessFromSpecular   // H = half vector to the sun
R += WaterRoughnessFromFresnel * pow(1 - dot(N, V), 5)
R  = max(R, WaterRoughnessMin);   if (!UseWaterRoughnessAdvanced) R = WaterRoughnessMin;
```

The specular term adds at most 0.007, only inside the sun glint. The Fresnel term rises at grazing view, so with distance. It is the only built-in "roughness grows far" term. **But it is computed from the same per-pixel normal `N` that aliases**, and at grazing `(1 − N·V)^5` is very sensitive to `N`. So raising it makes the roughness flicker together with the normal. That matches the measurements: 0.6 / 1.0 made it worse. This is not the author's distant fix either. No distance input reaches roughness.

## 2. Parameters that control normal / roughness at distance (exact names)

All names below are from the cooked master's name map [GAME]. Values are the `MI_OceanOver_SCW` overrides; "master" means not overridden. Semantics come from [PORT] where 2.0 has them, otherwise they are inferred and marked.

| Parameter | SCW value | What it does | Tried in bug 89 |
|---|---|---|---|
| `WaveTextureRange`, `WaveTextureFalloff` | 4000, 120000 | 3.x replacement of 2.0's `WaveTextureDistanceBlend` (port: `Fade = saturate(dist / DistanceBlend − 0.25)`, wave amplitude × (1 − Fade), `LOD = Fade*4` computed but the sample is at LOD 0). Distance fade of the ocean wave texture. | yes: 1000 / 20000, no effect |
| `DetailWaveRange` | 25000 | distance range of the detail wave (inferred) | yes: 8000, no effect |
| `CoastlineNormalRange` | 14 | [PORT] finite-difference baseline of the coastline normal: `MF_TriangleNormal(W0, W1 @ +Range x, W2 @ +Range y)`. Larger = smoother normal. | **no** |
| `CoastlineNormalFalloff` | 30000 | 3.x only, not in the 2.0 port. By its name and value, a distance falloff of the coastline normal (300 m), inferred. | **no** |
| `WaterSpecularHorizonDistance`, `WaterSpecularHorizonOffset`, `WaterSpecular` (Bias, Scale, Power, **A = horizon floor**) | 90000, 6, (0.05, 0.4, 8, 0.2) | [PORT] Specular is faded by distance: `Hd = HorizonDistance − dz·Offset`, `fade = saturate((Hd − dist)/(0.9·Hd))² + WaterSpecular.a`, × Fresnel(Bias, Scale, Power). At 90000 the fade only starts mattering near 900 m. This is the one built-in distance → reflection-strength term. | **no** |
| `FoamNormalScale`, `FoamNormalBlend`, `FoamDistanceBlend` | 0.8, master, master | foam normal strength and its distance blend (inferred from the names) | **no** |
| `HorizonCorrectionNormalIntensity`, `…Edge`, `…Fresnel` | master | horizon normal correction | Intensity only, no effect |
| `WaterRoughnessMin`, `WaterRoughnessFromFresnel`, `WaterRoughnessFromSpecular(Div)` | 0.07, 0.3, 0.007 / 0.997 | see §1 | yes |
| `SSRMaxIterations`, `SSRMaxThickness` | master | the material's own SSR (`MF_SSRTrace`; `UseScreenSpaceReflections` ON by default) | Iterations 0, no effect |
| `StateSteepnessScale`, `StateVelocityScale`, `StateDistanceDepth*` | master, 0.9 | simulation layer | Steepness / Velocity 0, no effect |

**No mip-bias or "far normal" parameter exists** in the master (no `*Mip*`, `*LOD*`, `FarNormal*` names). Compare Epic's own `Water_Material` in the kit, whose name map has `Near Normal Strength`, `Far Normal Strength`, `Default Distant Normal Strength`, `Water Distant Normal Length` / `Offset`, `Far Normal Fresnel Power` [GAME, kit asset strings]. Epic's water fades the far normal. FluidFlux fades only per layer (wave texture, detail, coastline) and never touches roughness by distance.

## 3. Known issues: distant shimmer / flicker with Lumen or TSR; the author's settings

- **Nothing on distant shimmer** from the author. Searched: the docs ([2025 docs](https://imaginaryblend.com/2025/01/10/fluid-flux-documentation/), empty comments), the original page ([2021](https://imaginaryblend.com/2021/09/26/fluid-flux/)), the release notes ([1.1](https://imaginaryblend.com/2022/05/19/fluid-flux-update-1-1/) · [2.0](https://imaginaryblend.com/2023/05/25/fluid-flux-2-0-release-notes/) · [3.0](https://imaginaryblend.com/2024/11/21/fluid-flux-3-0-release-notes/)), the [Epic forum thread](https://forums.unrealengine.com/t/imaginaryblend-fluid-flux/2420009) and [itch.io comments](https://imaginaryblend.itch.io/fluid-flux/comments). The Discord ([invite](https://discord.gg/rG2q3SB5EB)) cannot be read without an account. Not searched.
- **What the author does say:**
  - [2.0 notes](https://imaginaryblend.com/2023/05/25/fluid-flux-2-0-release-notes/), Known issues: "TSR antialiasing still causes some issues, so it is better to use TemporalAA".
  - [2021 page](https://imaginaryblend.com/2021/09/26/fluid-flux/), 2023-06-11, replying to "foam … extremely fuzzy": "Is disabling TSR anti aliasing solving the problem for you ?".
  - [docs](https://imaginaryblend.com/2025/01/10/fluid-flux-documentation/), Project settings: Velocity Pass = Write During Base Pass (`r.VelocityOutputPass 1`) and Default Renderer Motion Vector = Precise. Both are "improves the motion vector rendering". The Precise setting concerns the Niagara renderer of `InfiniteGrid_128_Niagara`; Conan draws the water through Epic's `WaterBodyOcean` mesh instead. The docs also list HighQualityTranslucencyReflections and `r.OIT.SortedPixels`.
  - [2021 page](https://imaginaryblend.com/2021/09/26/fluid-flux/), shadows: "Shadows on water may look a bit blocky", with `r.Water.SingleLayer.DepthPrepass=1`, `ShadersSupportVSMFiltering=1`, `VSMFiltering=1`.
- **User reports:** close-camera flicker ([itch.io](https://imaginaryblend.itch.io/fluid-flux/comments), "water flickering when the camera is close to it at times", no answer). Black horizon line at height ([forum](https://forums.unrealengine.com/t/fluid-flux-rendering-problems/2660407)). MRQ wave loss, fixed by AA warm-up or a baked state ([forum](https://forums.unrealengine.com/t/problem-rendering-fluid-flux-water-through-the-movie-render-queue/2694602)).
- **No "Responsive AA" or temporal-responsiveness advice** anywhere. The master does not write Temporal Responsiveness [GAME].

## 4. DetailWaveUVSwitching

- No author text on it anywhere. Names in the master [GAME]: `DetailWaveUVSwitching` (SCW 1.35), `DetailWaveUVOffset` (−0.3), `DetailWaveUVVelocity`, functions `MF_FluidDetailWave`, `MF_WaveDetail`, `MF_AdvectWaveSample2D`, `MF_AdvectTexture2D`, `MF_AdvectUV3`. The 2.0 port has the parameters (`_DetailWaveUVSwitching` 1.0, `_DetailWaveUVOffset` −0.3, `_DetailWaveUVVelocityScale` 11) but not `MF_FluidDetailWave` (the include is commented out).
- Reading [inferred, not verified]: the parameters have the shape of flow-map advection. The detail texture's UV is advected by the flow velocity and periodically reset ("switching" = phase rate, "offset" = phase shift), with two phases cross-faded. That technique pulses at the switching period by design.
- **It is not the far blink:** `DetailWaveHeight 0` and `DetailWaveRange 8000` changed nothing (bug 89). A periodic pulse would also have a period, and the owner's symptom is per-frame grain.

## Known algorithms (`[OWNER]` 2026-11-09 17:49–17:50 «уверне, что вода красиво сделана во многих играх» · «и алгоритмы давно изучены и описаны в papers»)

The constraint for every row: `M_FluxSurfaceOver` cannot be recompiled. The kit has no source graph and the cooked material functions carry no graph. So "apply" means one of four routes:

- (a) an MI parameter;
- (b) an engine cvar, checked against `ConanExiles/_config/cvars-registered.txt`;
- (c) a texture asset change (mips / LOD bias of `T_DetailWaveTexture_00/_01`, the ocean wave volume `WaveTextureAnimation`, the wave RT);
- (d) a material rewrite.

| Algorithm | Idea (two lines) | Source | How it could apply here |
|---|---|---|---|
| **Toksvig 2005**, mipmapping normal maps | Averaging normals in a mip shortens them. The length loss is the normal variance in the footprint. Turn it into a wider specular lobe (lower exponent / higher roughness) per mip. | [NVIDIA tech brief](https://developer.download.nvidia.com/whitepapers/2006/Mipmapping_Normal_Maps.pdf) (JGT 10(3) 2005) | (c) only for PS-sampled textures, and FluidFlux has no roughness texture to receive the variance. Its roughness is computed. The VS-sampled layers read mip 0 [PORT], so mips do not reach them. Pre-flattening the detail texture's low mips only removes far detail from the detail wave, which is not the source (bug 89). **Effectively needs (d).** |
| **LEAN mapping**, Olano & Baker 2010 | Store the first and second moments of bump slopes in textures. Hardware mip / anisotropic filtering then yields the slope covariance = an anisotropic Beckmann lobe at every distance. | [UMBC page](https://userpages.cs.umbc.edu/olano/papers/lean/) (I3D 2010) | (d): needs moment textures and a shader that reads them. Note the Take-Two patent (US 9,684,975, inventors Baker & Olano). |
| **LEADR mapping**, Dupuy et al. 2013 | LEAN for **displacement**: mipmapped moments of displacement slopes. Geometry, normals and BRDF stay consistent as detail drops below a pixel. | [paper](https://perso.liris.cnrs.fr/victor.ostromoukhov/publications/pdf/SAsia2013-LEADR.pdf) (SIGGRAPH Asia 2013) | (d) only. It matches FluidFlux's case best (displaced waves), but it needs the waves as textures with moment mips. |
| **Kaplanyan et al. 2016**, NDF filtering / geometric specular AA | Estimate the pixel footprint in slope space from screen derivatives of the normal (or half vector). Widen the NDF / roughness by that variance. Temporally stable, works with deferred shading. | [NVIDIA page](https://research.nvidia.com/publication/2016-06_filtering-distributions-normals-shading-antialiasing) · [GDC 2016 deck](https://developer.download.nvidia.com/gameworks/events/GDC2016/akaplanyan_specular_aa.pdf); follow-ups [Tokuyoshi & Kaplanyan JCGT 2021](https://www.jcgt.org/published/0010/02/02/paper-lowres.pdf) (grazing-angle error, i.e. exactly far water); [Vlachos GDC 2015](https://media.steampowered.com/apps/valve/2015/Alex_Vlachos_Advanced_VR_Rendering_GDC2015.pdf) (roughness clamped from ddx/ddy of the shading normal) | (b) UE's version is "Normal Curvature to Roughness" (`r.NormalCurvatureToRoughnessScale / Bias / Exponent`, registered). It is **inert**: the material flag is off [GAME] and it reads the vertex normal only (`MaterialTemplate.ush:4284-4302`). The water mesh's vertex normal is flat. (d) `R = max(R, k·max(|ddx N|², |ddy N|²))` on the final per-pixel normal, inside the material. This is the targeted fix: near water stays a mirror, far sub-pixel normals get rough. **Rewrite only.** |
| **Bruneton, Neyret, Holzschuch 2010**, ocean geometry → normal → BRDF | Per screen area keep mean position, mean normal and a BRDF. As distance grows, wave detail moves from geometry to normals to BRDF roughness (slope variance), with no seams or aliasing. | [HAL / INRIA](https://hal.archives-ouvertes.fr/inria-00443630v3) · [EG digital library](https://diglib.eg.org/items/fb727c69-2be2-4edd-833e-f7a9baea9b63) (CGF 29(2) 2010) | Half of it is available through (a): the per-layer distance fades (`WaveTextureRange/Falloff`, `DetailWaveRange`, `CoastlineNormalFalloff`) move detail out of geometry and normals. The other half, putting the removed slope variance into roughness, has **no input**. `WaterRoughnessMin` is global and `FromFresnel` is driven by the aliased normal (§1). Full form: (d). |
| Epic's own Water plugin (precedent) | Near / far normal strengths with a distant-normal length / offset: flatten the far normal. | kit asset strings of `Engine/Plugins/Experimental/Water/Content/Materials/WaterSurface/Water_Material.uasset` [GAME] | Shows the industry's cheap form. In FluidFlux only through (a), per layer. |
| Crest (Unity ocean) | "Vary Smoothness Over Distance": `Smoothness Far`, `Smoothness Far Distance`, `Smoothness Falloff`, which "helps to spread out specular highlight in mid-to-background". `Softness` is a mip bias of the reflection. | [Crest docs](https://crest.readthedocs.io/en/stable/user/water-appearance.html) | The direct product form of "roughness by distance". FluidFlux has no such parameter. (d) only. |

**AAA talks.**
- Sea of Thieves ([SIGGRAPH 2018 talk](https://history.siggraph.org/wp-content/uploads/2022/09/2018-Talks-Ang_The-Technical-Art-of-Sea-of-Thieves.pdf)): FFT ocean after Tessendorf, stylised, with an area-specular "large, low-frequency sheen". The two-page abstract read through search excerpts says nothing about distant anti-aliasing.
- AC III / AC IV Black Flag ([GDC Vault AC III](https://gdcvault.com/play/1017710/contactUs), [AC IV](https://www.gdcvault.com/play/1020397/Assassin-s-Creed-IV-Black)): the listings mention ocean rendering, but no distant-specular content turned up in excerpts. Slides not read.
- Ghost of Tsushima, RDR2: nothing found on ocean anti-aliasing.
- Tessendorf's normal-map paper for vast oceans ([PDF](https://jtessen.people.clemson.edu/reports/papers_files/normalmap_eg.pdf)) could not be read: the file is over 10 MB.

**Not found:** an AAA talk that explains distant ocean anti-aliasing.

## Levers to try live (ranked)

Bench: the owner's spot (bug 89 box), **denoiser OFF**, `flicker-metric.py` + a 60 fps clip, one lever at a time, restore after. "Near" is the water under the camera, "far" is 100–300 m.

| # | Lever (exact name) | How | Expected near / far | Source |
|---|---|---|---|---|
| A | `CoastlineNormalFalloff` 30000 → 10000 → 3000 | MID scalar | near: none (if it is a distance falloff) · far: flatter coastline normal → less blink, if the coastline layer carries it | [GAME] name + SCW value; semantics inferred |
| B | `CoastlineNormalRange` 14 → 40 → 100 | MID scalar | near: the coastline waves a little softer · far: a wider finite-difference baseline → less sub-pixel normal noise | [PORT] `MF_SurfaceFlux_Coastline` |
| C | `FoamNormalScale` 0.8 → 0 (then `FoamDistanceBlend`, `FoamNormalBlend`) | MID scalar | near: flatter foam · far: removes the foam's normal contribution; isolates it | [GAME] names; untested |
| D | Layer isolation by the shipped permutations: set the water body's material to `MI_OceanOver_0CW` (no simulation), `_S0W` (no coastline), `_00W` (waves only), `MI_OceanOver_Waves_Horizon` (distant mode) | remote, WaterBody material + MID rebuild; read back which MI renders | diagnostic: which layer carries the blink; a look change, not a fix | [GAME] permutations shipped in the pak |
| E | `WaterSpecularHorizonDistance` 90000 → 30000, `WaterSpecular.A` 0.2 → 0.05 | MID scalar / vector | near: unchanged (fade ≈ 1 within ~50 m) · far: weaker specular → the blink's amplitude down proportionally; the far water less mirror-bright (a look change) | [PORT] `MF_FluidWaterLayer` formula |
| F | `r.AntiAliasingMethod 2` (TemporalAA) vs 4 (TSR) | cvar | near: possibly softer · far: the author's own advice for 2.0 | [WEB] 2.0 notes, Known issues |
| G | `r.Lumen.Reflections.SmoothBias` 0.3 → 0 | cvar | global: reflections less mirror everywhere; −8 % measured WITH the denoiser, not yet without | bug 89 |
| H | `r.TSR.History.ScreenPercentage 200` | cvar | −10 % measured; a GPU cost | bug 89 |
| I | `r.Water.WaterMesh.LODScaleBias` / `r.Water.WaterMesh.TessFactorBias` | cvar (registered) | the layers are sampled per vertex [GAME + PORT]: the far vertex density decides how the wave field is point-sampled; direction of effect unknown, measure both signs | [GAME] `bHasVertexInterpolator`; [forum](https://forums.unrealengine.com/t/tesselation-of-water-surface/2551545) for the cvar |
| J | `WaveTextureDecodeNormal` 1 → 2 | MID scalar | flattens the ocean wave-texture normal everywhere. Low prior: `WaveTextureHeight 10` did nothing. Mainly to retire the divide-by-zero reading of the 0 test | [PORT] `MF_DecodeNormaDerivate` |

**Not worth trying:**
- `r.NormalCurvatureToRoughness*`: the material flag is off, and it uses the vertex normal.
- `r.TSR.ShadingRejection.Flickering*`: moving pixels are excluded by design.
- `GerstnerNormalScale`: the Gerstner layer is compiled out.
- Texture mip / LOD bias: it does not reach the VS-sampled layers, and the PS-sampled detail is not the source.
- `UseFluxWaveDistant` / `UseWaterRoughnessAdvanced` on the MID: static switches.
- `WaveTextureDecodeNormal 0`: divide by zero.

**If A–E leave the blink in place:** the radical fix is route (d). A kit material that adds Kaplanyan / Vlachos roughness from `ddx/ddy` of the final normal, plus a distance → roughness term (Crest's "Smoothness Far"). Without the FluidFlux graph that means a new water master: rebuilt on Epic's `Water_Material` (it has Near / Far normal strengths) or written as HLSL. The FluidFlux look is then lost or has to be recreated. The owner's call.

## Reproduce [GAME]

`retoc-5.8/retoc.exe to-legacy --no-shaders --no-script-objects -f "FluidFlux/Surface" "<game>/ConanSandbox/Content/Paks" <scratch>` → `uaj tojson <asset> <out.json> VER_UE5_8`. The master's switch defaults are the 38-entry bool array `StaticSwitchValues` in `.uexp`, in the order of the static-switch `ParameterInfo` list (`UseEpicUnderwater`, `UseCoastline`, `UseOcean`, `UseCoastlineData`, `UsePreciseCoastline`, `UseExtraMasking`, `StateCheapNormal`, `UseSimulation`, `UseSimulationBlend`, `UseSurfaceDebug`, `UseWaterRoughnessAdvanced`, …). Values `0 0 0 0 0 1 1 1 0 0 1 1 1 1 0 1 0 0 0 1 0 1 1 1 1 0 0 0 1 1 0 1 0 1 0 1 0 0`. The order mapping is an assumption, and it is consistent with every MI override seen. The cached-expression bools are tags with flag `0x10` = true.
