# Run report — трава вдали гуще (ручки шейдера земли); желтизна картинки по местам

**Created:** 2026-10-11 13:07 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** `krinik.shaders` 767 981 Б (ручки `_KrinikFarGrassCover`,
`_KrinikFarGrassBlades`), KrinikColorRework 2.3.0, KrinikCameraRework 1.5.0

## 1. Work

`[OWNER]` «а можно вдали траву таким же приемом сделать? … а то лысая земля вдали меня удручает» · «давай попробуем» · «и немножко игва всё
желтоватая, или мне кажется?.... промеряй в разных локациях … мне кажется, я мог цветокор чуть неверно нстроить» · 2026-10-11. Случаи —
`testcases/TC_svarog_far_grass_yellow_2026-10-11.md` (C1–C4).

## 2. Contour

- Svarog's Dream, 1280×720, полный экран, сейв владельца, время идёт (world=running); места — Бара, «Лесная Хижина», Бездан, «Мёртвый Остров».
- REAL WORLD: accumulated — сейв владельца (7/7 до и после); data and machine — его машина; path — мир игры с его сейвом.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 12:53–12:55 | правка `KrinikTerrainCommon.cginc`; `Unity.exe -batchmode … KrinikBuild.Bundles`; пакет в `plugins/KrinikColorRework/` | 6 шейдеров |
| 2 | 2026-10-11 12:55–13:00 | `run-game.sh`; виды: Бара, `teleport greenFieldsLocation`, `houseMountainLocation`, `houseBaraLocation`, `teleport 139,88,-652`; `TestFaceSun 8 60`; `global _KrinikFarGrass 0|1`, `_KrinikFarGrassCover 0.6|1`, `_KrinikFarGrassBlades 1`; `shot fg_*` | лист вариантов |
| 3 | 2026-10-11 13:01–13:02 | 2 × (`global … 0 0` / `1 1`) + `perf 10` | цены нет |
| 4 | 2026-10-11 13:02–13:06 | `teleport` по 5 полям WorldMap; `TestFaceSun 25 180`; `cfg … General GradingEnabled false|true`; `cfg … General Tonemapper Neutral|ACES`; `cfg … Day Temperature -10|-20|0`; `shot yl_*`, `yt_*`, `yv_*` | замер жёлтости |
| 5 | 2026-10-11 13:07 | `kill`; `reg-snap.sh restore`; `cmp` сейва; `.cfg` цвета | 7/7 |

## 4. Checks

Hygiene: пакет шейдеров — 0 ошибок.
Functional run: мир игры при идущем времени, кадры прочитаны глазом и замером цвета, `perf` world=running.

- C1 pass — густота травы вдали делает лысую бежевую равнину оливково-зелёной; узор на 720p почти не виден.
- C2 pass — FPS: 43.15 → 43.6 (цены нет).
- C3 pass — жёлтость нашего цветокора в 3–6 раз выше, чем у игры; причины — ACES и потерянный синий противовес игры (`gamma (0.7, 0.7, 1.0)`).
- C4 pass — сейв 7/7, настройки вернулись.

## 5. Found

- Цветокор игры уравновешивает тёплые текстуры синим в средних тонах (`original grading: … gamma (0,7, 0,7, 1,0, -0,5)`); наш берёт у
  ручек только яркость — синий теряется, плюс ACES желтит. Варианты (лес, вечер): сейчас 0.79, температура −10 — 0.62, −20 — 0.44,
  нейтральный тонмаппер + −10 — 0.48, игра 0.14.
- Поле `frozenLakeLocation` у WorldMap не нашлось — снег не снят. Бездан ставит героя на высоту 911 м (в кадре небо), смерти нет.

## 6. Traces

- Кадры: `SvarogsDream/_harness/fg_*.webp`, `yl_*.webp`, `yt_*.webp`, `yv_*.webp`; листы — `SvarogsDream/gallery/game/2026-10-11_трава-вдали/варианты.webp`,
  `SvarogsDream/gallery/game/2026-10-11_желтизна/варианты-лес-вечер.webp`, `места-наш-и-игры.webp`.

## 7. Verdict

Pass: оба вопроса измерены и показаны вариантами; что ставить по умолчанию (густота травы, тёплость картинки) — выбор владельца.
