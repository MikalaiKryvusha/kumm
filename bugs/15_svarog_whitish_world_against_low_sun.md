# Bug 15 — Svarog's Dream: against a low sun the distant ground, grass and foliage turn whitish ("frost")

> **Created:** 2026-10-04 · **Parent:** камера 1.2.0 (низкий наклон, поворот) — `testcases/reports/2026-10-04_svarog-camera-draw-distance.md`
> **Status:** 🔧 fix shipped 2026-10-05 10:10 — KrinikColorRework 2.1.0, matte terrain on; darkening 0.6 by the owner's
> word ≈10:16 (`[OWNER]` «темнее нравится, но немножко темнее, а то ночью (1) ну слишком темно»); run
> `testcases/reports/2026-10-05_svarog-matte-terrain.md` — pass in 4 times of day × 3 views, FPS unchanged. Not DONE yet:
> terrain swap while walking (streaming) not observed — watch in normal play. Cause confirmed 09:55 (A/B/C/A2)
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

## Session 2026-10-05 09:46–09:56 — own shader, cause CONFIRMED

Unity licence: active (owner signed in; `unity license status` → Unity Personal). The 2020.3.49f1 editor took it in batch
mode (`Serial number assigned … UnityPers…`), `-createProject` 24 s.

**How the game renders** (new harness command `render`, 09:52): main camera `DeferredShading` (actual too), HDR, linear;
the deferred lighting shader is CUSTOM — `Hidden/CTI/Internal-DeferredShading` (CTI tree package), not Unity's own;
terrain `Nature/Terrain/Standard`, 25 terrains, `drawInstanced True`, basemapDistance 1000; fog off. Direct3D 11.

**Own shader:** project `SvarogsDream/unity/KrinikShaders` — `Krinik/Terrain/Matte` + `-AddPass` + `-Base`, copies of the
2020.3 Standard terrain shaders (MIT source `builtin_shaders-2020.3.49f1`) on `StandardSpecular`: specular colour =
0.04 · `_KrinikTerrainSpecular` (global, default 0), smoothness × `_KrinikTerrainSmoothness`, layer metallic ignored.
Rationale: `UnityStandardBRDF.cginc:308` — `specularTerm *= any(specColor) ? 1.0 : 0.0` — a zero specular colour kills
the specular lobe, Fresnel included. Bundle `krinik.shaders` (3 shaders, 547 724 B) built by
`Unity.exe -batchmode -nographics -quit -projectPath … -executeMethod KrinikBuild.Bundles` in 28 s, no compile errors; fog
and instancing variants kept by the build script. Loaded in game by the harness `bundle <path>`: 3 shaders `supported True`.

**A/B at a frozen sun (elevation 30°, camera facing the sun, pitch 15), frames `SvarogsDream/_harness/b15p_*`, sheet
`b15p_sheet.webp`:**

| Frame | Terrain | Seen |
|---|---|---|
| A | game's `Nature/Terrain/Standard` | far ground, plateau and path pale beige-white |
| B | `Krinik/Terrain/Matte`, specular 0 | **no white at all** — olive-green ground, red-brown path, dark far plateau |
| C | same, specular 1 (= ordinary non-metal 0.04) | the white is back, as in A |
| A2 | restored | identical to A — the control holds |

C vs B isolates the cause: the specular lobe of the default dielectric 0.04 — Fresnel at grazing light — and nothing else.
The custom CTI deferred shader honours a zero specular colour like Unity's own.

**Open before it ships:**
1. Top-down view (`b15n_A/B`, 09:54): with the matte shader the near ground is LIGHTER — the game's layers have metallic
   0.5–0.92, and metallic darkens the diffuse (×0.96·(1−m)); the matte shader drops it. Taste call → owner, with a frame of
   the normal game camera: true colour, or keep the game's darkening and only remove the glare.
2. FPS on frame B read 50 against 72 — at that moment the owner had just started a Unity 6 editor (≈20 shader compilers
   from 09:55:04), and B was the first frame after the swap; measure with `perf` before any conclusion.
3. New terrains streamed in while walking (5×5 around the hero) must get the material too — the mod swaps on the
   terrain-count change event, never on a timer (EXP-0127).

## Session 2026-10-05 10:00–10:10 — shipped into the mod, tested across the day

KrinikColorRework 2.1.0 (`MatteTerrain.cs`): loads `krinik.shaders` from its folder, every second swaps the material of each
loaded terrain (no scene-wide search), settings «Земля без белёсого блика» (on), «Земля: блеск» (0), «Земля: темнее ↔
светлее» (`_KrinikTerrainMetalDarken` — the game's metallic darkening of the diffuse, ×0.96·(1−m)). Shaders got the darkening
control; bundle 551 057 B.

Test set (owner: «и не тольок на закате протестируй» · «и не только против солнца» · ≈10:01): hour 20 sun 30°, hour 0 moon
10°, hour 7 sun 45°, hour 12 sun 80° × facing the sun / sun behind / game camera 55° × game / darkening 1 / darkening 0.
Ground luma (left 60 %, rows 20–85 %): darkening 1 is DARKER than the game in the game view (the metallic specular had added
brightness), 0 is lighter; the match is k ≈ 0.36 (morning, evening), 0.22 (noon), 0.66 (night). Picked 0.35 and verified:
game view evening 0.226 vs 0.223, noon 0.424 vs 0.438, night 0.105 vs 0.084; facing the low sun 0.278 vs 0.404 (glare gone).
FPS: 75.1 / 75.7 matte vs 74.7 / 76.3 game. Comparison page: `SvarogsDream/gallery/game/2026-10-05_матовая-земля/index.html`.

## Owner's verdict — 2026-10-09: ground accepted, foliage still slightly whitish

`[OWNER]` «принят, но на листве чуть-чуть белесость осталось словно» · 2026-10-09, до 08:36 (груминг беклога,
`plans/18_svarog_backlog_checklist.md`).

The matte terrain shader is accepted; the bug stays open for the FOLIAGE. Hypotheses 2–4 (leaf translucency, Tree Creator
gloss, CTI back-face smoothness) changed little; the confirmed mechanism for the ground (Fresnel of the 0.04 dielectric
specular at grazing light) most likely applies to leaves too — all opaque geometry is lit by the custom deferred shader
`Hidden/CTI/Internal-DeferredShading`. Water is transparent (forward) and is not lit by it.
Next: same-spot A/B at a frozen low sun with the leaf specular zeroed (CTI / Tree Creator leaf materials, or our own leaf
shader copy, as with the ground).

## Decisions made without the owner (this fix)

- `[AI]` Matte shader as a copy of Unity's own terrain shader on StandardSpecular (community fix: no specular on terrain),
  not a replacement of the CTI deferred lighting shader — touches the ground only, water glitter stays (his word «хорошо
  смотрится на воде»).
- `[AI]` Default darkening 0.35 — chosen by measurement to keep the game's brightness in the game view; shown to the owner
  with both extremes. **Superseded by the owner's word ≈10:16 → 0.6** (frames 10:18–10:20: game view evening 0.188 vs game
  0.223, noon 0.362 vs 0.438, night 0.087 vs 0.084; facing the sun no white at any value). Accepted on the comparison
  page: `[OWNER]` «да, 0.6 хорошо, оставляем, спасибо» · 2026-10-05 ≈10:22.
- `[AI]` The bundle is a build artefact, not in git (`unity/*/Bundles/` ignored); the mod build fails without it.

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
