# Research — sky for Svarog's Dream: the simplest path to a sky instead of the void

> **Created:** 2026-10-09 (on the owner's request in chat, ≈18:30) · **Parent:** owner's word in chat — `[OWNER]` «запрос на
> новый мод: скайбоксы … хоть примитивно, но чтобы не пустота была на фоне, а небо, дневное, расветное, закатное, ночное,
> туманное, дождливое» · «можешь погуглить, как в нашем стеке быстро и просто небо сделать. Полноценно не нужно, наша камера
> небольшую полосу над горизонтом позволяет увидеть» · **Status:** recon done 2026-10-09 18:34; built and run in the game 18:38–19:27
(SvarogsDream `4116988`…`357134b`, run report `testcases/reports/2026-10-09_svarog-sky.md`) ·
> **Outbound:** —

## What the game is (observed)

- Unity 2020.3.49 Mono, built-in pipeline; main camera **Deferred**, HDR, linear colour space; **fog off**
  (harness `render`, `bugs/15` 2026-10-05 09:52). Post-processing stack v2 is in the build (`Unity.Postprocessing.Runtime.dll`).
- The camera sees sky only when our `KrinikCameraRework` tilts it flat (MinPitch 15°, FOV top above the horizon); the
  game's own 55° camera never shows it. Far clip then goes to 1500 (`FitFarClip`).
- What the camera clears to now (flags / colour / `RenderSettings.skybox`) — **not probed yet**: `render` does not print it.

## What the game already gives us to drive the sky (decompiled, ilspycmd → scratchpad)

| Need | Source in the game | Notes |
|---|---|---|
| day ↔ night | `WorldTime.currentDayNightRatio` (private float, 0 night … 1 day), moves 0.1/s towards the target | our `KrinikColorRework` already reads it (`RatioRef`) — sky blends in step with our colour grade |
| dawn vs dusk | `WorldState.Instance.currentWorldTime.currentHour` (+ `seasonOfTheYear`) | `IsItDayTime`: day 5–22 h, winter 7–20 h; ratio rising = dawn, falling = dusk |
| sun direction | `WorldTime.mainLight` (directional), Euler X per hour; `RenderSettings.sun` | a skybox pass gets `_WorldSpaceLightPos0` of the sun — glow around the sun for free |
| rain / snow | `WorldWeatherManager.isRaining`, `isSnowing` (public static bool) | rain starts with a 5 s «pre-rain» ramp; no-weather zones (dungeons, Iriy, underworld) |
| fog | none: the game has no weather fog; `FogRiser` is a local effect | «foggy» sky = our own state (grey, wide horizon band); terrain-into-sky blend needs fog |

## How the industry does a cheap sky (web)

- **Built-in `Skybox/Procedural`** — no textures, tint/exposure/sun from properties, sun position from the directional light
  ([Unity manual](https://docs.unity3d.com/2020.1/Documentation/Manual/shader-skybox-procedural.html)). Risk in a shipped game:
  the shader may be stripped from the player build → `Shader.Find` null / pink; the reliable mod path is shipping our own
  shader in our own AssetBundle.
- **Gradient (hemisphere) skybox** — three colours (top, horizon, bottom) lerped by the view direction's Y
  ([keijiro/SkyboxPlus](https://github.com/keijiro/SkyboxPlus), MIT, «Hemisphere»). The minimal sky; exactly what a narrow
  strip above the horizon needs.
- Applying: `RenderSettings.skybox = material` + `camera.clearFlags = CameraClearFlags.Skybox`
  ([CameraClearFlags](https://docs.unity3d.com/ScriptReference/CameraClearFlags.html) — without a skybox the camera clears to
  `backgroundColor`).

## The chosen path `[AI]`

`FORK:` options <built-in Skybox/Procedural | own gradient shader in our bundle | cubemap textures per mood> · price of
error <pink/absent sky in the build; six cubemaps cost art and memory> · consulted <Unity manual, keijiro SkyboxPlus, our
own bundle pipeline already proven by `Krinik/Terrain/Matte`>.

1. **Shader `Krinik/Sky/Gradient`** in `unity/KrinikShaders/Assets/Shaders` (the build script bundles every `*.shader` there):
   top · horizon · bottom colours, horizon sharpness, a soft sun glow from `_WorldSpaceLightPos0`. No textures.
2. **Moods are colour sets**, not assets: day · dawn · dusk · night · fog · rain (snow → fog-like). Each is a row of
   colours in the config; the mod blends them by `currentDayNightRatio`, the hour (rising/falling) and the weather flags.
3. **Seam where the land ends** (far clip / unloaded areas against the sky): the horizon colour should equal the fog colour.
   Deferred ignores `RenderSettings.fog` for opaque objects; PPv2's `PostProcessLayer.fog` («Deferred Fog») applies it —
   a later step, only if the edge is visible in frames.

## Risks

- (a) The camera may clear to a solid colour on purpose because a far plane cuts the land — sky may show «holes» at the land's
  edge. Check by frames at pitch 15 in hills and on open plain.
- (b) Our colour grade (`KrinikColorRework`) tonemaps the sky too — colours are picked in the game, not in a picker.
- (c) Interiors/dungeons/Iriy may rely on the solid clear colour — the sky is applied only in the open world (same zones as
  `IsNoWeatherZone`).

## What the live runs taught (2026-10-09 18:38–19:27)

- **The void was the game's own skybox**: camera already `Skybox`, material `Skybox/6 Sided` — black in the 15° view.
- **The visible strip lies BELOW the true horizon.** The camera is high; at pitch 15° the frame top is at d.y ≈ −0.015, and the sky
  shows where the loaded land ends. A sky drawn "above the horizon" paints that strip with the below-horizon colour and no clouds.
  Fix: the sky line is lowered by `_HorizonDrop` 0.12; sun and moon discs are placed by the mod just under the frame top
  (`DiscBelowTop` 0.032), at the real sun azimuth (moon opposite).
- **Water reflects the skybox** — every sky feature (clouds, sunset tint, moon) shows in lakes for free.
- **Scene fog vs the game's water**: the water is the Lux Water asset; it computes fog itself with `FOG_EXP2` (its
  `LuxWater_Setup.cginc`, doc "Lux Water 1.2.3", deferred fog section) using `RenderSettings.fogDensity` (game: 0.01). A Linear haze
  left the water on EXP2 at 0.01 → near water whitened. Haze must be `ExponentialSquared`; density 0.0012 keeps the near world clear.
  PPv2's deferred fog (`PostProcessLayer.fog`, on in the game, `excludeSkybox`) applies it to opaque geometry once `RenderSettings.fog`.
- **Cost**: PresentMon 15 s each — sky off 20.89 ms median, sky on (clouds, haze) 19.41 ms; run-to-run spread exceeds the sky's cost.
- **Lightning**: thunder via the game's own `CombatSoundsManager.PlayThunderUniqueSound(AudioSource, ThunderSounds, volume)` — volume
  follows the game's effects slider. A flash shorter than ~0.3 s is not caught by the harness `shot` — `TestFlashHold` exists for that.

## Закаты по сезонам (web, 2026-10-09 ≈23:20)

Источники: [Northern Woodlands](https://northernwoodlands.org/outside_story/article/ride-off-into-the-sunset),
[UCAR — The Appearance of the Sky](https://scied.ucar.edu/learning-zone/atmosphere/appearance-sky),
[EarthNova](https://earthnova.org/news/climate-science/sunsets-winter-simply-spectacular),
[Optimist Daily](https://optimistdaily.com/2019/11/why-winter-sunsets-are-best-according-to-a-meteorologist).
- Colour comes from scattering along the long low path; aerosols are hygroscopic — they swell in humid air and dim and desaturate
  the light. Winter air (cold, dry, often arctic, few aerosols) gives purer, more vivid colour; summer humidity mutes it; autumn
  harvest dust makes the sky hazier. The claim is only partly settled (sources disagree on how much aerosols help).
- Applied (`Sky.cs`, `SunsetStyle.Season`): winter — clean raspberry; summer — soft gold in haze; autumn — dense amber (not red:
  the owner's «красное небо - пхоло»); spring — no source, `[AI]` pastel between. Each evening drifts up to 40 % toward the
  neighbouring season's palette by a per-day hash, so two evenings in a row differ.
- Real photos by season (capture date from Commons): `SvarogsDream/gallery/refs/sky/real-sunset/` (README there).

## Night variety and far grass (live runs 2026-10-09 23:33–23:53)

- **Milky Way**: a tilted great circle crosses the horizon at two azimuths only and the flat camera almost never sees it (6 nights,
  0 hits); a height wave over azimuth (0.24 ± 0.07 above the dropped sky line) is in frame in any direction. A glow alone reads as grey
  haze — the band needs dense fine «star dust» (hash cell ×720 inside the band).
- **Aurora**: the curtain's base hides behind the treeline — green must be the tall part, violet only at the very top.
- **Moon**: phase from a 16-day cycle, lit side by a hemisphere test; reflections in water come for free.
- **Cost** (PresentMon 15 s, 4K, night with aurora + Milky Way, camera at it): sky off 19.95 ms, on 20.19 / 20.70 ms — within the 0.5 ms
  spread of two identical runs.
- **Far grass**: world = 300×300 terrains, 5×5 streamed (`StreamRadius 2`) → ground to ≈750 m; grass to 500 m (`GrassDistance`) →
  bald ring 500–750 m, then a flat stub. Grass 750 m costs +1.4 ms (17.87 → 19.24 ms, 56 → 52 FPS, 4K day). A zero-cost alternative is
  a grass tint/streak pattern in our terrain shader for the ring — needs `worldPos` in the terrain `Input` (fork of
  `TerrainSplatmapCommon.cginc`) and the same in the base-map shader for far terrain.
- Visual references gathered: `SvarogsDream/gallery/refs/sky/` (Skyrim, Oblivion, real night, real sunsets, haze and clouds — 75 WebP).
