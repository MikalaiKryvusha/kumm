# Bug 15 — Svarog's Dream: against a low sun the distant ground, grass and foliage turn whitish ("frost")

> **Created:** 2026-10-04 · **Parent:** камера 1.2.0 (низкий наклон, поворот) — `testcases/reports/2026-10-04_svarog-camera-draw-distance.md`
> **Status:** 🔬 research — 11 hypotheses tested; 2026-10-05 ≈01:58: the white is the TERRAIN itself, and the leading
> explanation (community + BRDF arithmetic) is the Fresnel of Unity's Standard shading at forward-scattering grazing light,
> which smoothness 0 does not remove; fix needs a shader the build does not ship — fork to the owner (section 2026-10-05)
> **Severity: S2** — about an hour of the owner's evening; the owner wants it fixed: `[OWNER]` «лучше белеснявость исправить» · 2026-10-04

## Symptom

Owner, 2026-10-04 evening: `[OWNER]` «странно свет на листве деревьев выглядит и на траве в сильном наклоне» ·
«деревья нормально смотрятся, если на 180 градусов камеру повернуть, и странно — когда вот наоборот. Словно направление
солнца влияет» · «ты видишь, что и земля тоже вдали белесая? когда против солнца смотреть» · «может дело не в листве? а
это земля сквозь листву такой эффект даёт?»

Observed (frames `SvarogsDream/_harness/rA…`, `rBack…`): facing the sun (elevation ≈25°, morning/evening), camera pitch
15°, the far ground, cliff tops, grass blades and leaf edges are pale beige-white; with the sun behind the camera the same
place is saturated green and brown. The game's own camera (55°, fixed yaw) never looks into a low sun — the mod's rotation
and low tilt expose it.

## Repro

`bash tools/run-game.sh` → `h.sh "call CameraFollow SetMaxZoom" "call KrinikCameraRework.Plugin TestFaceSun 15 0" "shot a"`
and `… TestFaceSun 15 180 …` for the control.

## Hypotheses tested (all refuted)

| # | Hypothesis | Test | Result |
|---|---|---|---|
| 1 | Shadows end at 225 m, everything beyond is unshadowed | shadows ×3 (450) | near trees slightly better, frost stays |
| 2 | Tree Creator leaf translucency (`_TranslucencyColor` white on some) | ×0 on 34 prefab materials, then on all 662 in-memory copies (`matmul`) | no change |
| 3 | Tree Creator leaf gloss (`o.Gloss = trngls.a * _Color.r`, Unity source) | `_Color` ×0 on 672 materials | barely visible on some deciduous trees |
| 4 | CTI foliage (oaks, conifers) back-face gloss / ambient translucency | `_BackFaceSmoothness` ×0, `_AmbientTranslucency` ×0 (6 materials) | no change |
| 5 | Environment reflections (Fresnel of the sky at grazing angles) | `RenderSettings.reflectionIntensity` | already 0 in the game |
| 6 | Bloom | our Bloom 0 (day and night) | no change |
| 7 | Secondary fill directional light | our Day.Secondary 0 | no change |
| 8 | Terrain layers metallic/smoothness (metallic 0.5–0.92 on dirt/grass layers — data defect of the game) | `layers 0` | near ground brighter, far ground unchanged |

| 9 | Far ground is the BASEMAP baked with the old layers | `terrainset basemapDistance 5000` + `layers 0` | far ground unchanged |

Also present with our grading and light OFF (`GradingEnabled=false`, `LightEnabled=false`) — the game's own look.

**Caveat on the control:** `TestFaceSun 15 180` shows a DIFFERENT place (lake and house), not the same plateau from the
other side — "clean with the sun behind" compares two places. The far plateau may simply be pale sand; the next control
must look at the SAME spot from both sides (walk the hero across it, or orbit by yaw around a fixed point).

**New lead (20:31):** the scene holds many `Imposter Camera` objects — an impostor system (far trees replaced by baked
billboards with their own baked lighting). Whitish far trees may be impostors baked under a different light; test by
disabling the impostor renderers or raising their switch distance.

## Owner's direction — 2026-10-05

`[OWNER]` «солнце в игре очень яркое. Это хорошо смотрится на воде. Но это же приводит к тому, что дальняя земля светится, и
листья. Нужно отражение от земли и от листьев уменьшать лучей света, или bloom менять как-то - это по проблеме свечения земли
и листвы, белеснявость» · 2026-10-05 ≈01:39.

Against the table above: bloom 0 (6) and terrain metallic/smoothness 0 (8) were tried and the FAR ground did not change —
but 8 may have hit only the near splat (lead 1: the far ground is the basemap baked at load). Next step in his direction:
regenerate the basemap after `layers 0` (`terrainData.SetBaseMapDirty()`), then leaf specular/translucency of the impostors
(the far trees), each on the SAME spot from both sides; keep the sun's strength on water untouched (his word: «хорошо
смотрится на воде»).

## Session 2026-10-05 01:47–01:58 — controlled A/B at a frozen sun

New harness tools: `layers <k>` now rebuilds the basemap (`SetBaseMapDirty`), `timescale 0` freezes game time (the sun
moves ~10° per game hour and a game hour is 60 real seconds — WorldTime.cs:76-88), `terrainshader <name>|restore` swaps
the terrain material. Time travel: `call WorldTime IncreaseTimeByOneHour true` + `call WorldTime SetInstantSungAngle`.

| # | Hypothesis | Test (same frame, A/B/A) | Result |
|---|---|---|---|
| 8b | Terrain layer smoothness/metallic, near AND far (basemap rebuilt) | sun 29°→26°, `layers 0` / `layers 1` | **no change** — refuted for the far ground too. (A morning pair that "showed" a big change was taken 22 s apart while the sun climbed — contaminated, retracted in chat) |
| 10 | Grass detail translucency (Nature Shaders) | sun 20°, `terrainset detailObjectDensity 0/1` | **refuted** — with no grass the bare terrain is beige-white; grass is darker than the ground |
| 11 | No-specular terrain shader | `terrainshader Nature/Terrain/Diffuse` | **not in the build** (also `Nature/Terrain/Specular`, `Splatmap/Diffuse-Base`, `Specular-Base`); `Legacy Shaders/Diffuse` is in the build but breaks terrain rendering — frame unusable |

Frames: `SvarogsDream/_harness/b15e_A/B/A2`, `b15g_A/B/A2`, `b15s_*` (local).

**Leading explanation.** At a low sun in front of the camera, light and view are nearly opposite: the half-vector sits
near the surface normal and L·H is small, so Schlick Fresnel → 1. For a fully rough Standard surface (GGX, a = 1) the
specular term ≈ V·D·π·N·L·F ≈ 1.16 · 0.34 · ~0.8 ≈ 0.3 of the light, against a diffuse of ≈ 0.14 for albedo 0.4 — the
white specular outweighs the colour of the ground. Smoothness 0 does not remove it. This matches every observation:
only against the sun, only at a low sun, stronger far away, on ground and foliage alike.

**What the Unity community writes** (searched 2026-10-05):
- "Unity's Standard shading model has more Fresnel than most people want … terrain can get super bright on the horizon";
  smoothness 0 does not remove it (a clamped minimum) — [Fresnel on standard shader too strong](https://forum.unity.com/threads/fresnel-on-standard-shader-too-strong.314252/),
  [Standard shader is weirdly bright at glancing angles](https://forum.unity.com/threads/standard-shader-is-weirdly-bright-at-glancing-angles.312307/),
  [Terrain too bright when viewed at an angle (BIRP)](https://discussions.unity.com/t/built-in-render-pipeline-terrain-too-bright-when-viewed-at-an-angle/920380),
  [remove view-direction-dependent lighting from the standard shader](https://discussions.unity.com/t/solved-how-to-remove-viewdirection-dependent-lighting-specular-from-the-standard-shader/891046).
- The usual fix: do not use the Standard terrain shader — `Default-Terrain-Diffuse` (no specular) or `-Specular` with a
  black spec colour; or edit the BRDF — [Why does my Terrain look glossy and has sun reflection?](https://forum.unity.com/threads/why-does-my-terrain-look-glossy-and-has-sun-reflection.898445/),
  [Standard Terrain Shader: Smoothness](https://discussions.unity.com/t/standard-terrain-shader-smoothness-solved/567278).
- Grass in the DEFERRED path is lit by the Standard model with the terrain normal → "super shiny"; fixed by recompiling
  the grass shader with `exclude_path:deferred` — [Shiny Grass on Terrain?](https://discussions.unity.com/t/shiny-grass-on-terrain/588391).

**Fork for the owner (not decided):**
1. Proper: build our own shader in the Unity 2020.3.49 editor (terrain without Fresnel; or a replacement of the deferred
   lighting shader via `GraphicsSettings.SetCustomShader(BuiltinShaderType.DeferredShading, …)` if the game renders
   deferred — check `Camera.actualRenderingPath` first) and load it from an AssetBundle. Needs the editor installed (GBs).
2. Workaround in his own words («уменьшать лучей»): dim the sun and lift the ambient at dawn/dusk in KrinikColorRework
   (it already drives sun/ambient by hour). The white goes, but the water glitter at dusk weakens too — taste call.

Next step before either: `Camera.actualRenderingPath` (forward/deferred) — it decides which shader would be replaced.

**Owner's decision:** `[OWNER]` «Правильный» · «качай, устанавливай юнити» · 2026-10-05 ≈02:00 — path 1. Done the same
minute: Unity Hub installed silently (`C:\Program Files\Unity Hub`), the editor 2020.3.49f1 (changeset `18249dd5551b`,
the game's own — `Player.log`) downloading to `E:\Unity\_installers`, target `E:\Unity\2020.3.49f1`. Blocker named:
a Unity Personal licence is activated only by signing in to Unity Hub with the owner's Unity account (manual activation
of Personal is no longer supported — [Unity manual](https://docs.unity3d.com/Manual/ManagingYourUnityLicense.html),
[game-ci #235](https://github.com/game-ci/unity-test-runner/issues/235)); after that the editor runs in batch mode.

## Leads for the next session (research, not guessing)

1. **Far terrain is the BASEMAP** (`Hidden/TerrainEngine/Splatmap/Standard-BaseGen`): baked once at load with the
   original layers — hypothesis 8 may have been tested on the near splat only. Re-test with the basemap regenerated
   (`terrainData.SetBaseMapDirty()`), or `terrain.basemapDistance` raised to the far clip.
2. **Pick the pixel**: a harness command that renders an ID/replacement-shader pass or toggles renderers by type
   (terrain / trees / details) to see which layer carries the white — instead of guessing shaders.
3. The black sky above the horizon at low tilt (seen in the same frames) — the game never showed sky; decide skybox/fog.

## Decisions made without the owner

- `[AI]` Stopped after 8 failed hypotheses (BUG_FIXING_FRAMEWORK: 3 attempts → research) and recorded instead of
  continuing blind — the owner asked not to spend long on the FPS side and wants the UI done.
