# Research — sky for Svarog's Dream: the simplest path to a sky instead of the void

> **Created:** 2026-10-09 (on the owner's request in chat, ≈18:30) · **Parent:** owner's word in chat — `[OWNER]` «запрос на
> новый мод: скайбоксы … хоть примитивно, но чтобы не пустота была на фоне, а небо, дневное, расветное, закатное, ночное,
> туманное, дождливое» · «можешь погуглить, как в нашем стеке быстро и просто небо сделать. Полноценно не нужно, наша камера
> небольшую полосу над горизонтом позволяет увидеть» · **Status:** recon done 2026-10-09 18:34; live probe — next ·
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
