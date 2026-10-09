# Run report — Svarog's Dream: небо, третья редакция — солнце садится, закаты по сезонам, разные ночи

## 1. Work

`KrinikColorRework` (`Sky.cs`: `sink`, `Dusk()` по сезону, `NightVariety`, `TestNight`, `TestMeteor`; `Plugin.cs` — `Sunset = Season`)
и шейдер `Krinik/Sky/Gradient` (фаза луны, Млечный путь со звёздной пылью, густота звёзд, сияние, падающая звезда, объём облаков);
случаи — `testcases/TC_svarog_sky_v3_2026-10-09.md` (C1–C9); основание — слово владельца после демо 2026-10-09 ≈23:15–23:25 (цитаты
в шапке случаев).

## 2. Contour

игра `D:\Games\Svarog's Dream`, 4K во весь экран, сейв владельца 17:46 (копия `_backups/svarog-saves-2026-10-09_1746-owner`);
SvarogsDream `88e9604` + рабочее дерево; пакет `krinik.shaders` 555 380 → 555 461 B (четыре сборки).

## 3. Runs

Пять запусков игры: 2026-10-09 23:33, 23:40, 23:46, 23:48, 23:50 (между ними — пересборка пакета:
`E:\Unity\2020.3.49f1\Editor\Unity.exe -batchmode -nographics -quit -projectPath unity/KrinikShaders -executeMethod KrinikBuild.Bundles`).
Запуск `bash tools/run-game.sh`; пульт `bash tools/h.sh "callon Managers/StandardManagers/WorldTimeManager WorldTime IncreaseTimeByOneHour True"`
`"call KrinikCameraRework.Plugin TestFaceSun <наклон> <угол>"` `"call KrinikColorRework.Sky TestNight <сдвиг>"`
`"call KrinikColorRework.Sky TestMeteor"` `"cfg krinik.svarogsdream.colorrework Sky Enabled true|false"`
`"cfg krinik.svarogsdream.camerarework DrawDistance GrassDistance 500|750"` `"shot <имя>"`; замер
`timeout 25 _tools/PresentMon-2.5.1-x64.exe --process_name "Svarog's Dream.exe" --output_file pm_<…>.csv --timed 15 --no_console_stats --stop_existing_session --session_name kumm-pm`;
закрытие `bash tools/h.sh "kill"`; сейвы `sha256sum -c _backups/svarog-saves-2026-10-09_1746-owner.sha256`.

## 4. Checks

Hygiene: `dotnet build src/KrinikColorRework -c Release` — 0 ошибок; пакет — 4 шейдера без ошибок импорта.
Functional run: игра на 4K, сейв владельца, часы игры и пульт; кадры изнутри движка прочитаны глазом листами, журнал `sky night …`,
CSV PresentMon. C1 pass, C2 pass, C3 partial (видено только лето), C4 pass с четвёртого прогона, C5 pass, C6 pass, C7 pass, C8 partial
(разведка и цена, визуального сравнения нет), C9 pass.

## 5. Found

(1) Млечный путь большим кругом под наклоном в кадр пологой камеры не попадал (6 ночей — 0), затем лёг за лес (высота от опущенной
линии неба), затем читался серой дымкой — исправлено волной высоты 0.24 ± 0.07 и звёздной пылью; (2) низ сияния прячется за лесом —
зелёный поднят; (3) узкая кайма облаков рисовала «линии высот» — шире и слабее; (4) летний закат вышел светлым, кремово-золотым — на
вкус владельца; (5) трава 750 м стоит +1.4 мс (56 → 52 FPS), лысое кольцо — 500–750 м; (6) небо ночью со всеми слоями — +0.2…0.7 мс,
в пределах разброса.

## 6. Traces

`SvarogsDream/gallery/game/2026-10-09_небо/v3-*.webp` (закат, рассвет, фазы луны, Млечный путь, сияние, падающая звезда);
`SvarogsDream/_harness/sunset_sheet.webp`, `nights_sheet.webp`, `aurora_sheet.webp`, `aurora2_sheet.webp`, `nights4_sheet.webp`,
`k0_crop.webp`, `k1_crop.webp`, `meteor_sheet.webp`, `sunrise_sheet.webp`, `g_day.webp`, `gr500.webp`, `gr750.webp`; журнал
`BepInEx/LogOutput.log` строки `sky night N: moon phase … aurora … milky …`; CSV — scratchpad сессии `demo/pm_night_*.csv`, `pm_gr*.csv`.

## 7. Verdict

partial — солнце садится и встаёт, ночи разные (фаза луны, Млечный путь, сияние, падающие звёзды), облака объёмнее, цена неба в
пределах шума; закаты весны, осени и зимы в игре не видены; трава вдали — только разведка и замер, решение за владельцем.
