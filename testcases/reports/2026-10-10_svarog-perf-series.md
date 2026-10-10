# Run report — Svarog's Dream: серия замеров кадра — потоки-помощники, кеш рамок воды, аниматоры предметов, сон дальних жителей

**Created:** 2026-10-10 23:04 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikFixes (`Perf.cs` — кеш рамок воды,
аниматоры предметов), KrinikCameraRework 1.4.1

## 1. Work

- Слово владельца 2026-10-10 ≈22:50–22:53 и случаи C1–C6 — `testcases/TC_svarog_perf_series_2026-10-10.md`; кандидаты — разведка
  `researches/svarogs-dream/main-thread-wait-and-transforms.md` (К1 потоки, К2 вода, К3 аниматоры) и мысль владельца о сне дальних.

## 2. Contour

- Игра владельца, release-плеер, 1280×720 без рамки; сейв — копия `_backups/svarog-saves-2026-10-10_1848-owner`; место героя после
  загрузки (C2, C3, C5), Бара после быстрого перемещения (C4); камера на пределе, часы стоят.
- REAL WORLD: accumulated — сейв и настройки модов владельца; data and machine — его машина и режим экрана; path — мир на отдалении.

## 3. Runs

1. 2026-10-10 22:54 — `bash tools/run-game.sh`; журнал мода; `call Unity.Jobs.LowLevel.Unsafe.JobsUtility get_JobWorkerCount` → 15.
2. 2026-10-10 22:54–23:01 — `h.sh` серией: `wait 60`; по три пары `call … set_JobWorkerCount 15|4` + `perf 8`; `cfg krinik.svarogsdream.fixes
   Perf LuxWaterBoundsCache true|false` + `perf 8`; `cfg krinik.svarogsdream.camerarework DrawDistance SleepFarCharacters true|false` +
   `perf 8` (строки — `SvarogsDream/_harness/ps_series1.txt`).
3. 2026-10-10 22:59–23:00 — `callon Player PlayerStats HealHunger 100 False`, карта → `BaraInn` → `FastTravelBtn`.
4. 2026-10-10 23:00–23:04 — `wait 60`; три пары `cfg … Perf PropAnimatorsCull true|false` + `perf 8`.
5. 2026-10-10 23:04 — `h.sh "kill"`; откат сейва из копии (перемещение записало три файла), 7/7; `reg query`.

## 4. Checks

- Hygiene: сборка KrinikFixes без ошибок; транспайлер заменил 2 обращения к рамке.
- Functional run: игра владельца на копии его сейва; прочитаны строки `perf` (главный поток), журнал мода.
- C1 pass · C2 на грани шума · C3 fail по ожиданию · C4 fail по ожиданию · C5 pass (цена измерена) · C6 pass.

## 5. Found

- **Потоки-помощники 15 → 4:** 13.34 → 13.11 мс (−0.23, две пары из трёх) — на грани шума; 8 не мерились.
- **Кеш рамок воды:** 13.15 против 13.10 мс — в шуме у места героя (выигрыш профиля Бора 0.46 мс здесь не виден).
- **Аниматоры предметов «всегда» → «вне кадра кости стоят»:** в Баре 41–42 таких предмета; 14.90 против 14.79 мс — выигрыша нет.
  Вечерние «94 аниматора — 0.8 мс» мерил пульт `animcull`, который переключает ВСЕХ, с жителями: дорогие — жители, не предметы.
- **Сон дальних жителей (дальше 300 м):** разбудить — +0.5 мс (13.17 → 13.67 мс, 76 → 73 FPS), три пары из трёх. Утренний довод
  «41.5 → 58.8 FPS» (2026-10-05) снят со старой службой значков — сегодня цена втрое-вчетверо меньше.

## 6. Traces

- Строки замеров: `SvarogsDream/_harness/ps_series1.txt`; кадры `ps_scene.webp`, `ps_bara.webp`.
- Журнал: `D:\Games\Svarog's Dream\BepInEx\LogOutput.log` (`lux water: …`, `prop animators: …`).

## 7. Verdict

Partial: замеры сделаны и прочитаны; две правки выигрыша не дали (аниматоры выключены по умолчанию, кеш воды оставлен — безвреден),
потоки — на грани шума, оставлены как в игре. Цена «разбудить дальних» — 0.5 мс; будить ли — решение владельца.
