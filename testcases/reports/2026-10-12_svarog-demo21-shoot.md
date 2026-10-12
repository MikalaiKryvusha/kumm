# Run report — Svarog's Dream: съёмка и черновой монтаж демо авторам, первая половина (акты 0–3 и финал)

## 1. Work

Съёмка сцен по сценарию `KUMM/plans/22_svarog_demo_script.md` и черновой монтаж первой половины ролика; случаи —
`testcases/TC_svarog_demo21_2026-10-12.md` (C1–C13). Основание: план `plans/21_svarog_demo_for_authors.md` (SDR, 4K 60, H.265 15 Мбит/с,
облёт камерой, голос C на 15 % быстрее), `[OWNER]` «приступай. Комп твой. Можешь работать автономно полтора часа … Сам иногда
пересматривай глазом, получилось ли показать то, что хотели» · 2026-10-12.

## 2. Contour

Release-плеер, 4K во весь экран на «Beyo TV» (HDR Windows выключен на время записи), сейв владельца (точка сверки
`_backups/svarog-saves-2026-10-11_2342-owner-exit`), SvarogsDream `e178522` + рабочая копия: `KrinikCameraRework` с `DemoOrbit`/`DemoSky`,
инструменты `rec_clip.sh`, `hdr.ps1`, `save-check.sh`, `demo21_narrate.py`, `demo21_cut.py`, `demo21_ui.sh`; голос Kokoro (`_tools/tts-venv`).

## 3. Runs

1. 2026-10-12 17:15–17:24 — запуск `bash tools/run-game.sh`; `powershell -File tools/hdr.ps1 off`; пробы `bash tools/rec_clip.sh probe_static 4 …`,
   `probe_orbit 12 "call KrinikCameraRework.Plugin DemoOrbit 8 11 40 15"`; клипы `b01_*`, `b02_golden_hour`, `a1_night_f9*` (F9 через
   `tools/keys.ps1 -Key F9`), `b20_aurora_p*`; `h.sh kill`, `save-check.sh --restore`.
2. 17:24–17:38 — перезапуск с `DemoSky`; клипы `b19_*`, `b12_orbit360`, `b18_storm*` (`WorldWeatherManager SetRainWithPrerain`,
   `Sky TestLightning`), `b20_aurora_sky_p0/p2/p3`, `b22_meteors`, `a1_matte_ground`, `b17_sunset_*` (`cfg … Sky Sunset Raspberry|Golden`),
   `b24_water_reflection` (`cfg … Water Reflections false → true`); `h.sh kill`, `save-check.sh`, `reg-snap.sh restore`, `hdr.ps1 on`.
3. 17:43–17:56 — `python -I tools/demo21_cut.py _harness/demo21/edl_part1.json _harness/demo21/demo21_part1_draft.mp4`;
   `ffmpeg … loudnorm=I=-16:TP=-1.5` → `demo21_part1_v1.mp4`.
4. 17:58–18:04 — `run-game.sh`, `hdr.ps1 off`, `rec_clip.sh ui_tour 190` + `bash tools/demo21_ui.sh 6`; `rec_clip.sh ui_items 23 …`;
   `h.sh kill`, `save-check.sh --restore`, `reg-snap.sh restore`, `hdr.ps1 on` → «hdrEnabled=True».

5. 18:04–18:10 — пересъём: `run-game.sh`, `hdr.ps1 off`; карточки предметов `hover` ячейки «…/KrinikBagScroll/Viewport/Content/Slot Prefab(Clone)»
   и «#1» → `rec_clip.sh ui_items2 20 …`; небо вживую `rec_clip.sh a15_sky_void2 11 "wait 5" "cfg … Sky Enabled true"`; ночь промоткой
   7 часов, `mouse.ps1 -Button wheel -Clicks 12`, F9 → `rec_clip.sh a7_hero_light 10 …`; настройки вернуты (`Icons VisibleMeters 100`,
   `Sky Enabled true`), `h.sh kill`, `save-check.sh --restore` — 7/7, `reg-snap.sh restore`, `hdr.ps1 on` — «hdrEnabled=True».
6. 18:12 — `demo21_cut.py` второй дубль с новыми сценами 7 и 15 → `demo21_part1_v2.mp4`.

## 4. Checks

Hygiene: `dotnet build src/KrinikCameraRework -c Release --no-incremental` — Build succeeded; `bash -n tools/demo21_ui.sh` — ok.
Functional run: игра в 4K на сейве владельца, каждый клип прочитан глазом листом кадров (`*.sheet.webp`, сводные `_aurora_sky_all.webp`,
`_sunsets.webp`, `_water_pair.webp`, `_ui_sheet.webp`, `_items.webp`), молнии — яркостью кадров (70 → 120), падающие звёзды — сложением
кадров максимумом (`_meteor_trails.webp`), черновик — листом кадров каждые 4 с (`_part1_sheet.webp`) и `loudnorm`.

| Случай | Итог |
|---|---|
| C1 HDR off/on | pass |
| C2 запись против `shot` | pass — разница ≤ 1.7 из 255 |
| C3–C4 облёт / контроль | pass |
| C5 формат клипа | pass — hevc 3840×2160 60/1, aac |
| C6 красота | partial — значки при `VisibleMeters 0` по горизонту (пересняли с 1 м); сияние при наклоне 10° — узкая полоса (пересняли `DemoSky`) |
| C7 сейв и реестр | pass — 7/7 после каждого `kill` |
| C8 `DemoSky` | pass |
| C9 монтаж | pass — 257.6 с, 13.3 Мбит/с, −16.1 LUFS |
| C10 птицы | fail |
| C11 матовая земля вживую | fail — взята пара галереи |
| C12 обход окон | partial — 17 окон; нет карточки навыка, предметов, подсказка обрезана |
| C13 карточки предметов | fail — пути ячеек устарели |
| C14 сцена 15 вживую | pass |
| C15 карточки предметов, новый путь | pass |
| C16 сцена 7 — свет у героя | pass |

## 5. Found

- `Icons VisibleMeters 0` значит «без предела» (значки до горизонта), а не «выключено».
- Пологая камера у героя при 10° видит неба узкую полосу — для неба нужна `DemoSky`.
- Первая секунда клипа с `DemoSky`, поданной внутри записи, — переходный кадр (срезать в монтаже или подавать до записи).
- Лист кадров `rec_clip.sh` для клипа > ≈130 с выходит выше предела WebP (16383 px) — пустой файл.
- Сумка мода: ячейки теперь `…/InventoryScreen/KrinikBagScroll/Viewport/Content/Slot Prefab(Clone)#N`; пути `demo_tour.sh` устарели;
  наведение пульта на ячейку карточку не показало (разобрать).
- Птицы `TestBirds` в кадр `DemoSky` не попали (два клипа).
- Закат быстрый: игровой час ≈ 1 мин, окно заката ≈ 1 мин — снимать сразу после промотки, без голоса между клипами.

## 6. Traces

`SvarogsDream/_harness/demo21/clips/*.mkv` (сырьё 4K), `*.sheet.webp`, `_ui_sheet.webp`, `_items.webp`, `ui_marks.tsv`;
`SvarogsDream/_harness/demo21/narration/` (голос, `durations.json`); `SvarogsDream/_harness/demo21/edl_part1.json`;
черновик `SvarogsDream/_harness/demo21/demo21_part1_v1.mp4`; лист `_part1_sheet.webp`.

## 7. Verdict

partial — первая половина ролика (акты 0–3, финал; 24 сцены, 4 мин 18 с) смонтирована и проверена глазом; сцены 11, 13, 14, 19 не сняты;
акты 4–7 (интерфейс, лица и слова, граница, как работаем) — сырьё обхода окон есть частично, монтажа нет.
