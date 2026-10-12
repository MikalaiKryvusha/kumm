# Research — Svarog's Dream: screen-space planar reflection (SSPR) of houses, people and trees in the water, GPU only

> **Created:** 2026-10-12 · **Parent:** `ideas/13_svarog_otrazheniya_v_vode.md`; `[OWNER]` «да, нужно без нагрузки на процессор, и предметы
> отражать - только те, что рядом» · «дома, люди. деревья - они низкие. их далено отдаражть не нужно, как горы» · «всё, что можно и понятно как
> СЧИТАТь на GPU - нужно на нём считать, а не на CPU. Только где выигрыш реально оправдан» · 2026-10-12 · **Status:** recon done 23:14, no code ·
> **Outbound:** the plan below — to the owner before code (it replaces the planar camera for near objects)

## Facts of this game (pult, 2026-10-12 23:13–23:14, owner's save near Bor)

| Fact | Value | Why it matters |
|---|---|---|
| `Camera.depthTextureMode` of the main camera | `Depth, DepthNormals, MotionVectors` | the depth texture SSPR needs is ALREADY produced — no extra scene pass on the CPU |
| `Camera.actualRenderingPath` | `DeferredShading` | depth comes from the G-buffer for free; opaque world is in the G-buffer |
| `SystemInfo.supportsComputeShaders` | `True` | the two SSPR passes are compute dispatches |
| `QualitySettings.activeColorSpace` | `Linear` | the reflection texture is linear colour (ARGBHalf or ARGB32 sRGB-aware) |
| Water | Lux Water, transparent, own planar camera per plane (`LuxWater_PlanarReflection`) | Unity SSR (Post Processing v2) works on opaque deferred surfaces only — it does NOT reach transparent water, so the built-in SSR is not the path |
| Planar camera cost measured | ground-only reflection at the Bor pond ≈ +4.4 ms main thread (bug 40, 22:54) | the CPU cost SSPR removes |

## The technique (Remi Genin, «Screen Space Plane Indexed Reflection in Ghost Recon Wildlands»; Colin Leung's MobileSSPR; URP port)

1. **Hash pass (compute, one thread per screen pixel):** reconstruct the pixel's world position from the depth texture; if it is above the
   water plane `y = h` and within the near radius (the owner's «только те, что рядом»), reflect it across the plane (`y' = 2h − y`), project
   to screen → target pixel. Write into a `uint` buffer at the target pixel `InterlockedMin(packed)` where the packed value holds the source
   pixel (and its reflected screen-y in the high bits, so the source nearest to the plane wins — that is what resolves occlusion order).
2. **Resolve pass (compute):** for every pixel with a hash entry fetch the scene colour of the source pixel → reflection texture; empty
   pixels → fill from neighbours (a small blur covers the holes — the URP port says blur «should really always be on»).
3. **Water samples the reflection texture** by screen UV — in place of the planar camera's `_ReflectionTex` for near objects; far mountains
   keep the existing cheap path or the sky (owner: mountains — «как горы» — far reflection is a different thing).

Known limits (the URP port and the GDC material): only what is on screen reflects — a house above the top edge of the frame has no
reflection; holes and stretching near screen edges; one plane height per dispatch (our ponds are planes at their own heights — group by
height, the same grouping as bug 40's fix).

## Plan in the built-in pipeline (Unity 2020, deferred, our shader bundle `krinik.shaders`)

1. `CommandBuffer` on the main camera at `CameraEvent.AfterForwardOpaque` (after the opaque G-buffer lighting, before transparent water):
   copy the colour target to a half-resolution RT; dispatch hash + resolve compute shaders (`KrinikSSPR.compute` in the bundle) with
   `_CameraDepthTexture`, the water height and the camera matrices.
2. Water: per visible water plane, set its material's reflection texture to the SSPR result instead of the planar camera's; planar camera
   OFF for those planes (the CPU cost goes away).
3. Settings: on/off, resolution (half/quarter), near radius in metres (start 60 m — «низкие, далеко не нужно»), blur.
4. Acceptance (`perf 8` at the Bor pond): main thread ≤ reflection-off + 0.3 ms (CPU almost unchanged); GPU busy grows within its reserve
   (the game uses ≈ 9–11 ms of GPU of a 21 ms frame); frames: houses, people, trees near the pond reflected; no popping when the camera turns.

## Price of error / risks

- The water shader (Lux): the planar script sets `_LuxWater_ReflectionTex` on the water material (`LuxWater_PlanarReflection.reflectionSampler`, decompile 2026-10-12) — a screen-layout texture from the mirrored camera; the SSPR result has the same layout, so step 2 is one `SetTexture` per material (planar component disabled). Still to confirm by eye: whether the Lux shader flips or distorts the UV.
- Holes and edge stretching are visible artefacts — taste: frames to the owner before it becomes default.
- Compute shaders must be compiled into our asset bundle for the game's graphics API (D3D11) — the bundle build already exists.

## Sources

- [URP_ScreenSpacePlanarReflections (Steven Cannavan) — URP port, based on Remi Genin's Wildlands work](https://github.com/Steven-Cannavan/URP_ScreenSpacePlanarReflections)
- [Adam Cichocki, «Pixel-Projected Reflections», SIGGRAPH 2017 Advances in Real-Time Rendering](https://www.advances.realtimerendering.com/s2017/PixelProjectedReflectionsAC_v_1.92_withNotes.pdf)
- [Unity Post Processing v2 — Screen Space Reflections (deferred, opaque only)](https://docs.unity3d.com/Packages/com.unity.postprocessing@3.4/manual/Screen-Space-Reflections.html)
