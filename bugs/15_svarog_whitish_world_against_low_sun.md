# Bug 15 — Svarog's Dream: against a low sun the distant ground, grass and foliage turn whitish ("frost")

> **Created:** 2026-10-04 · **Parent:** камера 1.2.0 (низкий наклон, поворот) — `testcases/reports/2026-10-04_svarog-camera-draw-distance.md`
> **Status:** 🔬 research — 9 hypotheses tested, cause not found; next: impostors, same-spot control
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
