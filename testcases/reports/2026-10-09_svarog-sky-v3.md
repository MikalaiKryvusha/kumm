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

Девять запусков игры: 2026-10-09 23:33, 23:40, 23:46, 23:48, 23:50, 23:58, 2026-10-10 00:01, 00:05, 00:07 (между ними — пересборка пакета:
`E:\Unity\2020.3.49f1\Editor\Unity.exe -batchmode -nographics -quit -projectPath unity/KrinikShaders -executeMethod KrinikBuild.Bundles`).
Запуск `bash tools/run-game.sh`; пульт `bash tools/h.sh "callon Managers/StandardManagers/WorldTimeManager WorldTime IncreaseTimeByOneHour True"`
`"call KrinikCameraRework.Plugin TestFaceSun <наклон> <угол>"` `"call KrinikColorRework.Sky TestNight <сдвиг>"`
`"call KrinikColorRework.Sky TestMeteor"` `"cfg krinik.svarogsdream.colorrework Sky Enabled true|false"`
`"cfg krinik.svarogsdream.camerarework DrawDistance GrassDistance 500|750"` `"global _KrinikFarGrass 0|1"` `"global _KrinikFarGrassFrom 480"` `"shot <имя>"`; замер
`timeout 25 _tools/PresentMon-2.5.1-x64.exe --process_name "Svarog's Dream.exe" --output_file pm_<…>.csv --timed 15 --no_console_stats --stop_existing_session --session_name kumm-pm`;
закрытие `bash tools/h.sh "kill"`; сейвы `sha256sum -c _backups/svarog-saves-2026-10-09_1746-owner.sha256`.

## 4. Checks

Hygiene: `dotnet build src/KrinikColorRework -c Release` — 0 ошибок; пакет — 4 шейдера без ошибок импорта.
Functional run: игра на 4K, сейв владельца, часы игры и пульт; кадры изнутри движка прочитаны глазом листами, журнал `sky night …`,
CSV PresentMon. C1 pass, C2 pass, C3 partial (видено только лето), C4 pass с четвёртого прогона, C5 pass, C6 pass, C7 pass, C8 partial
(разведка и цена), C9 pass, C10 pass (трава вдали шейдером, пультом), C11 pass (из настроек), C12 skipped (видео: 4K-стол не тянется переводом HDR),
C13 pass (ночной диск), C14 blocked (цена финальной сборки).

## 5. Found

(1) Млечный путь большим кругом под наклоном в кадр пологой камеры не попадал (6 ночей — 0), затем лёг за лес (высота от опущенной
линии неба), затем читался серой дымкой — исправлено волной высоты 0.24 ± 0.07 и звёздной пылью; (2) низ сияния прячется за лесом —
зелёный поднят; (3) узкая кайма облаков рисовала «линии высот» — шире и слабее; (4) летний закат вышел светлым, кремово-золотым — на
вкус владельца; (5) трава 750 м — +1.4 мс (56 → 52 FPS) по одному замеру, того же порядка, что разброс, лысое кольцо — 500–750 м; (6) небо ночью — +0.2…0.7 мс в пределах разброса, но замер сборки ДО звёздной пыли;
финальную сборку перемерить не удалось (PresentMon перестал писать файлы — C14 blocked); (7) трава вдали шейдером (вариант Б) — пятна травяного цвета на лысом кольце, цена в пределах шума
(16.63 и 17.99 мс вкл против 17.11 выкл); пятна резковаты — на вкус владельца; (8) судья 00:05: ночью 0–3 ч диск солнца получал полную силу на настоящей высоте солнца —
исправлено (`sink` = 1 в глубокую ночь), C13 pass; (9) трава вдали красит ЛЮБУЮ землю дальше 480 м — дороги, песок, камень, снег
зимой не проверены; `FarGrassFrom` не связан с «Дальностью травы» камеры — при траве 750 м пятна лягут на настоящую траву.

## 6. Traces

`SvarogsDream/gallery/game/2026-10-09_небо/v3-*.webp` (закат, рассвет, фазы луны, Млечный путь, сияние, падающая звезда);
`SvarogsDream/_harness/sunset_sheet.webp`, `nights_sheet.webp`, `aurora_sheet.webp`, `aurora2_sheet.webp`, `nights4_sheet.webp`,
`k0_crop.webp`, `k1_crop.webp`, `meteor_sheet.webp`, `sunrise_sheet.webp`, `g_day.webp`, `gr500.webp`, `gr750.webp`, `fg_crop.webp`,
`fg2_crop.webp`; журнал
`BepInEx/LogOutput.log` строки `sky night N: moon phase … aurora … milky …`; CSV — scratchpad сессии `demo/pm_night_*.csv`, `pm_gr*.csv`, `pm_fg*.csv`.

## 7. Verdict

partial — солнце садится и встаёт, ночи разные (фаза луны, Млечный путь, сияние, падающие звёзды), облака объёмнее, цена неба (до звёздной пыли) в
пределах шума, финальная не измерена; закаты весны, осени и зимы в игре не видены; трава вдали — пятнами шейдером земли, включена по умолчанию (`Terrain FarGrass` 1), вкус — за владельцем.
