# Research — UE 5.8 engine side of the palm-shadow flicker: VSM cvars read from the engine binary (2026-11-06)

> **Created:** 2026-11-06 · on the owner's word «нужна глубокая разведка кода. устройства игры, устройство UE 5,8» (19:23, bug 67)
> **Parent:** bug 67; `2026-11-06_vsm_foliage_recon.md` (the web track, a helper) · **Status:** engine track — read 2026-11-06 19:25 +03:00; the game-asset track and the
> discriminating runs next · **Outbound:** the experiment grid → bug 67

## Source and method

The EpicGames/UnrealEngine source is not reachable (GitHub 404 — the account is not Epic-linked). The Conan Dev Kit ships the 5.8 engine: shaders
`F:/CEUE5Devkit/Engine/Shaders/Private/VirtualShadowMaps/*.usf|.ush` (incl. `VirtualShadowMapCacheInvalidation.ush`, `VirtualShadowMapCacheGPUInvalidation.usf`)
and binaries. The cvar help texts were read from `Engine/Binaries/Win64/UnrealEditor-Renderer.dll` (UTF-16 strings; in this binary the help string
stands right BEFORE the cvar name — pairing checked on known cvars), script `scratchpad tools/cvar_help.py`; the full dump of 120 `r.Shadow.Virtual*` /
`r.Shadow.Scene*` cvars — session scratchpad `vsm_cvars.txt`.

## What the engine says (help texts, verbatim)

| Cvar | Help text (engine 5.8) | In this build |
|---|---|---|
| `r.Shadow.Virtual.ResolutionLodBiasDirectionalMoving` | «Bias applied to LOD calculations for directional lights that are moving. -1.0 doubles resolution, 1.0 halves it and so on. The bias transitions smoothly back to ResolutionLodBiasDirectional as the light transitions to non-moving, see 'r.Shadow.Scene.LightActiveFrameCount'.» | our Engine.ini sets −1.0 = the static bias (applied, game log 16:22:13) — so a moving sun does NOT get a lower resolution here; this is NOT the cause |
| `r.Shadow.Scene.LightActiveFrameCount` | «Number of frames before a light that has been moving (updated or transform changed) goes to inactive state. This determines the number of frames that the MobilityFactor goes to zero over, and thus a higher number spreads invalidations out over a longer time.» | registered |
| `r.Shadow.Virtual.Cache.ForceInvalidateDirectional` | «Forces the clipmap to always invalidate, useful to emulate a moving sun to avoid misrepresenting cache performance.» — i.e. a moving sun invalidates the directional clipmap every frame | registered |
| `r.Shadow.Virtual.Cache.FramesStaticThreshold` | «Number of frames without an invalidation before an object will transition to static caching.» | registered |
| `r.Shadow.Virtual.Clipmap.WPODisableDistance` | «When enabled, disables WPO animation in clipmap levels based on a primitive's WPO disable distance and r.Shadow.Virtual.Clipmap.WPODisableDistance.LodBias setting.» | registered |
| `r.Shadow.Virtual.Clipmap.WPODisableDistance.LodBias` | «The number of clipmap levels further than the distance that an instance would be animated to allow shadow animation. Typically 2-4 works well but may need to be adjusted for very low light angles with significant WPO movement.» | registered |
| `r.Shadow.Virtual.Clipmap.ZRangeScale` | «… Should generally be at least 10 or it will result in excessive cache invalidations. Values that are too large cause depth imprecisions and shadow flickering.» (pairing to be confirmed) | — |

## The game's own sun model (help text read from `ConanSandbox-Win64-Shipping.exe`, 2026-11-06)

`DynamicSky.SolarUpdateAngleDelta` — «How many degrees can the sun/moon move in the sky before we rotate the corresponding directional light to match.»
So Conan ALREADY separates the visible sun from the shadow-casting light: the disk in the sky moves smoothly, the directional light (and every shadow)
follows in steps of this many degrees. 0.003° ⇒ a light turn almost every frame (full clipmap re-render, the flicker); 0.015° (the game's quality default);
2.0° ⇒ a step every few seconds of play, visible as a jump. The owner's target (bug 67, 19:26): smooth sun + no flicker + no constant re-render — a
smooth SHADOW motion without per-frame invalidation is the open question for the web track.

## Reading

1. A sun turned every frame (`SolarUpdateAngleDelta` 0.003) keeps the directional light «moving»: its clipmap is re-rendered every frame (engine's own words
   at ForceInvalidateDirectional). The resolution is NOT lowered in our build (Moving bias = static bias, −1.0).
2. What remains different between a smooth and a stepped sun: every frame the shadow map's texel grid turns slightly against the world; on thin swaying
   leaves that re-sampling crawls (shadow-map swimming). With a still light the grid is still and the cache holds. This is the classic explanation, NOT yet
   proven here — the discriminating grid below decides.
3. Wind (WPO) and the sun are two separate invalidation sources; the engine has a per-primitive WPO disable distance for shadows — whether the palm assets set
   it is the game-asset track (Dev Kit).

## The discriminating grid (under palms, one place, one camera, 60 fps video, the owner's eye)

| Run | Sun | Leaf wind in shadows | Shadows | Reads |
|---|---|---|---|---|
| G1 | smooth (0.003) | on | VSM | the complaint |
| G2 | stepped (2.0) | on | VSM | the current build («calm») |
| G3 | smooth | OFF (WPO disabled for shadows / far) | VSM | does the wind matter |
| G4 | smooth | on | VSM off (`r.Shadow.Virtual.Enable=0`, cascades) | VSM vs shadow maps in general |
| G5 | smooth | on | VSM, `r.Shadow.Virtual.Cache=0` | caching vs re-render |
