# Run report — трава у героя тает при отдалении камеры (баг 35)

**Created:** 2026-10-11 14:39 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** `krinik.shaders` 928 859 Б (8 шейдеров: + `Krinik/TerrainEngine/Details/WavingDoublePass`, `…/BillboardWavingDoublePass`), KrinikColorRework 2.4.0 (`GrassCoverage.cs`), KrinikCameraRework 1.5.0

## 1. Work

`[OWNER]` «трава возле героя исчезает даже просто при отдалении камеры=(» · «неужели трава столько ФПС кушает, что ты ее так сильно
ограничил?» · 2026-10-11. Случаи — `testcases/TC_svarog_grass_zoom_vanish_2026-10-11.md` (C1–C8); баг — `bugs/35_DONE_svarog_grass_melts_at_zoom_out.md`.

## 2. Contour

- Svarog's Dream, 1280×720, полный экран, сейв владельца, время идёт (world=running); Бара у пирса; отдаление — поле игры `CameraFollow.targetZoom`.
- REAL WORLD: accumulated — сейв владельца (7/7 до и после); data and machine — его машина; path — его камера при отдалении.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 14:25–14:32 | `run-game.sh`; колесо `mouse.ps1`; `mats Nature`; `cfg … GrassFade 1500`, `GrassDistance 1500`; `matmul NatureManufacture _CullFarStart 10`, `matmul Nature _AlphaTestThreshold 0.3`, `matmul Nature _NatureRendererDistanceControl 0`, `matmul TerrainEngine/Details _Cutoff 0.3`; `fieldon Camera CameraFollow targetZoom 40…240`; `shot gz_*`, `gzz_*`, `gc3_*`, `ga_*`, `gd_*`, `ge_*` | причина — альфа-тест по мипам |
| 2 | 2026-10-11 14:32 | `kill`; `reg-snap.sh restore`; `cmp` сейва | 7/7 |
| 3 | 2026-10-11 14:33–14:34 | копии шейдеров травы Unity + `GrassCoverage.cs`; `Unity.exe -batchmode … KrinikBuild.Bundles`; `dotnet build`; пакет и DLL в `plugins/KrinikColorRework/` | 8 шейдеров, 0 ошибок |
| 4 | 2026-10-11 14:34–14:38 | `run-game.sh`; `targetZoom 40/100/160/240` × `cfg … Terrain GrassNoMelt true|false`; `perf 10` ×4; `global _KrinikGrassMipScale 0.15|0.25|0.4`; `shot gn_*`, `gm_0*` | трава держится |
| 5 | 2026-10-11 14:38 | `targetZoom 125`; `kill`; `reg-snap.sh restore`; `cmp` сейва; `.cfg` | 7/7 |

## 4. Checks

Hygiene: пакет шейдеров — 0 ошибок, мод — 0 предупреждений.
Functional run: мир игры при идущем времени, отдаление камеры игрой, кадры прочитаны глазом, `perf` world=running.

- C1 pass — воспроизведено; затухание всех 16 материалов Nature — 480: первая версия причины неверна.
- C2 fail (ожидаемо как отсев) — ни дальность 1500, ни затухание 1500, ни отсечения Nature/NatureManufacture траву не вернули.
- C3 pass — редеет постепенно: 40 густо, 70 реже, 100–130 едва, с 160 нет.
- C4 pass — порог `_Cutoff` скрытых шейдеров Unity ×0.3 вернул траву на 160: причина — альфа-тест по мипам.
- C5 pass — своя копия шейдеров на 50 материалах: трава держится на 100/160/240, на 40 как в игре; выкл — как в игре.
- C6 pass — плотность 0.15/0.25/0.4 близки, оставлено 0.25.
- C7 pass — FPS выкл 69.3 (прогрев) / 74.0, вкл 74.2 / 73.8.
- C8 pass — сейв 7/7, реестр, настройки.

## 5. Found

- Траву участков Unity рисует двумя путями: модели травы — шейдерами Nature/NatureManufacture (прототипы с моделью), текстурная трава —
  своими скрытыми `TerrainEngine/Details/*` (по материалу на участок и шейдер). Таяла текстурная.
- Колесо мыши через `mouse.ps1` в этом прогоне двигало камеру непредсказуемо; надёжно — `fieldon Camera CameraFollow targetZoom <N>`.
- Не проверено: трава на `Details/Vertexlit` (у Бары таких прототипов нет) и другие места мира.

## 6. Traces

- Кадры: `SvarogsDream/_harness/gz_*.webp`, `gzz_sheet.webp`, `ge_sheet.webp`, `gn_sheet.webp`, `gm_density.webp`; галерея —
  `SvarogsDream/gallery/game/2026-10-11_трава-при-отдалении/`.

## 7. Verdict

Pass: трава у героя больше не тает при отдалении камеры, цены нет; DONE бага 35 — после глаза владельца в игре.
