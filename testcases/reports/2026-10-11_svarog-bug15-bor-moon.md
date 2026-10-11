# Run report — баг 15: Бор ночью при луне — блик частокола и светлые крыши

**Created:** 2026-10-11 12:17 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikColorRework 2.2.0, `krinik.shaders` 731 199 Б

## 1. Work

`[OWNER]` «тут пхоло видно. Перемещайся в город в лесу, Бор, там ночью в луну было сильно это видно, найклоняй камеру и вращай, пока не
увидишь» · 2026-10-11. Случаи C1–C3 — `testcases/TC_svarog_bug15_bor_moon_2026-10-11.md`.

## 2. Contour

- Svarog's Dream, 1280×720, полный экран; сейв владельца, герой перенесён в Бор (`teleport innBorLocation`), 23:27, `timescale 0`.
- REAL WORLD: accumulated — сейв владельца (7/7 до и после); data and machine — его машина; path — мир игры с его сейвом.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 12:09–12:11 | `run-game.sh`; `teleport innBorLocation` + `wait 20`; `timescale 0`; 13 × `IncreaseTimeByOneHour true`; `TestFaceSun 25 0`; `shot bor_probe` | ночь 23:27 |
| 2 | 2026-10-11 12:11–12:13 | 16 ракурсов `TestFaceSun 15|35 0…315` × `cfg … Foliage BuildingsMatte true|false` × `shot bm_*` | пары кадров |
| 3 | 2026-10-11 12:14–12:16 | тот же ракурс: `cfg … Night Sun 0.9|0.6|0.4` + `call WorldTime SetDayNightSceneLighting`; `cfg … Night Bloom 0`; `active …/CameraTarget/NightLight 0`; `call UnityEngine.Rendering.GraphicsSettings SetShaderMode DeferredReflections Disabled`; `comps Light 25`; `mats roof` | крыши без перемен |
| 4 | 2026-10-11 12:16 | `kill`; `reg-snap.sh restore`; `cmp` сейва; `reg query` | 7/7, 1280×720 |

## 4. Checks

Hygiene: —.
Functional run: Бор ночью с сейвом владельца, 26 кадров прочитаны глазом и замером цвета участков (крыша справа, крыша в центре, частокол).

- C1 pass — Бор, ночь.
- C2 partial — частокол: настройка снимает светлые кромки (88/70/39 → 81/62/33); крыши: светлые (173/148/90), ни один из пяти
  рычагов (луна, свечение, свет героя, отражения, срез блика) их не меняет больше чем на 1–2 %.
- C3 pass — сейв 7/7, настройки ночи вернулись.

## 5. Found

- Светлые соломенные крыши ночью в Боре — не блик и не луна: причина не найдена. Материалы крыш — неметалл (`M_RoofReed`: металл 0,
  гладкость 0; `M_Roof_WoodStructure_*`: металл 0, гладкость 0.5). Кандидаты для разведки: рассеянный свет сцены (`ambientIntensity`),
  запечённый свет (lightmap) или эмиссия материала, ночная цветокоррекция (тени +0.15).

## 6. Traces

- Кадры: `SvarogsDream/_harness/bor_probe.webp`, `bm_{15,35}_{0…315}_{on,off}.webp`, `nv_*.webp`, `nl_*.webp`, `rf_*.webp`; лист —
  `SvarogsDream/gallery/game/2026-10-11_листва-блик/бор-ночь-дома-и-дерево.webp`.
- Свойства материалов крыш — `SvarogsDream/_harness/dump.txt` (`mats roof`).

## 7. Verdict

Partial: блик частокола ночью снят настройкой; светлые крыши ночью — причина не найдена, остановка по правилу трёх попыток, дальше —
разведка с вопросом владельцу, то ли это место.
