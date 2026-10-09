# Run report — Svarog's Dream: небо вместо пустоты, облака, солнце, луна, звёзды, молнии; картины загрузки во всю ширину

- **Work:** раздел «Небо» мода `KrinikColorRework` (шейдер `Krinik/Sky/Gradient`, `Sky.cs`, `ShaderBundle.cs`) и вторая редакция
  `KrinikUIRework/LoadingLayout.cs`; случаи — `testcases/TC_svarog_sky_2026-10-09.md` (C1–C19); основание — слово владельца в чате
  2026-10-09 ≈18:30–18:56 (цитаты в шапке случаев и в шапке `Sky.cs`).
- **Contour:** игра `D:\Games\Svarog's Dream` (Unity 2020.3.49, deferred, HDR), 4K во весь экран; сейв владельца 17:46 (копия
  `_backups/svarog-saves-2026-10-09_1746-owner`); SvarogsDream `4116988`, `887917a` + рабочее дерево 19:04.
- **Runs:** восемь запусков — 18:38, 18:45, 18:48, 18:51, 18:57, 19:00, 19:02 (+ ночь и дождь 19:03); `bash tools/run-game.sh`; пульт
  `bash tools/h.sh "call KrinikCameraRework.Plugin TestFaceSun 15 0" "cfg krinik.svarogsdream.colorrework Sky ForceMood <Day…Rain>"
  "cfg … Sky Sunset <Raspberry|Golden>" "call KrinikColorRework.Sky TestLightning" "call KrinikColorRework.Sky TestFlashHold 4"
  "callon Managers/StandardManagers/WorldTimeManager WorldTime IncreaseTimeByOneHour True" "callon Managers/StandardManagers/WeatherManager
  WorldWeatherManager SetRainWithPrerain False" "shot <…>"`; закрытие `bash tools/h.sh "kill"`; сейвы
  `sha256sum -c _backups/svarog-saves-2026-10-09_1746-owner.sha256`; пакет — `Unity.exe -batchmode … -executeMethod KrinikBuild.Bundles`.
- **Checks:**
  - Hygiene: `dotnet build` обоих модов — 0 ошибок; пакет `krinik.shaders` — 4 шейдера без ошибок компиляции.
  - Functional run: игра, сейв владельца, камера 15° (ночь — 5°), кадры 4K изнутри движка, прочитаны глазом и журналом
    `BepInEx/LogOutput.log` — C1 pass (сейвы 7/7 после каждого kill), C2 pass, C3 pass, C4 pass, C5 partial → C12, C6 pass,
    C7 partial (ночь наступила по часам: 1:43, night=1.00 — рассвет и закат по часам не прогонялись), C8 → C16, C9 не прогонялся,
    C10 fail → причина найдена, C11 pass, C12 pass, C13 partial (два заката pass, диск солнца за крышей), C14 partial, C15 → C18,
    C16 pass, C17 pass по журналу (гром), C18 partial (ночь pass), C19 pass.
- **Found:** (1) пустота — сам скайбокс игры `Skybox/6 Sided` (в ракурсе 15° чёрный); (2) видимая полоса неба пологой камеры лежит
  ниже настоящего горизонта — облака там не рисовались, исправлено `_HorizonDrop` 0.12; (3) вода отражает небо — озеро меняет цвет с
  настроением; (4) за краем подгруженной земли — бежевая плоская полоса дальнего террейна; (5) диск солнца на середине полосы уходил
  под край земли — поставлен под верх кадра; (6) вспышка 0.06 с не ловилась кадром — гаснет за 0.1 с, три мерцания, для кадра —
  `TestFlashHold`; (7) удержание вспышки переживает смену настроения (свойство команды пульта).
- **Traces:** `SvarogsDream/gallery/game/2026-10-09_небо/` (варианты неба, солнце-луна-звёзды-молния, было-стало, экран загрузки,
  диагностика облаков); `SvarogsDream/_harness/mood_*.webp`, `s_*.webp`, `n_clear.webp`, `n_rain.webp`, `f_on.webp`, `ld_b.webp`;
  журнал игры строки `sky on/off`, `sky: lightning`, `sky: thunder`, статус `night= … moon= stars=`, `loading art: … cropped to`.
- **Runs, вторая половина (19:06–19:27):** ещё четыре запуска — 19:06 (матовая земля, закат по часам, солнце ±25°), 19:09 (пастельный
  малиновый, ±10°), 19:11 и 19:14 (дымка Linear → ExponentialSquared), 19:15 (PresentMon:
  `timeout 45 _tools/PresentMon-2.5.1-x64.exe --process_name "Svarog's Dream.exe" --output_file pm_<off|on>.csv --timed 15
  --no_console_stats --stop_existing_session --session_name kumm-pm`). C20 fail прогона → C23 pass; C21 pass; C22 pass; C24 fail → C25
  pass; C26 pass (без неба 20.89 мс медиана, с небом 19.41 мс — разброс больше цены неба).
- **Found, вторая половина:** (8) густой малиновый после ACES пурпурный — сделан пастельным; (9) дымка вида Linear белила ближнюю
  воду: вода игры — Lux Water со своим туманом EXP2 и плотностью игры 0.01 — дымка переведена на ExponentialSquared 0.0012, вода
  чистая; (10) PresentMon 2.5.1 после `--timed` не выходит — снимать по `timeout`.
- **Verdict:** partial — небо, шесть настроений, облака, два заката, солнце, луна, звёзды, ночной дождь, вспышка, гром по журналу,
  закат по часам, дымка, матовая земля и экран загрузки проверены в игре, цена неба в кадрах неразличима; не прогнаны: рассвет по
  ходу часов, гром ухом, снег игры (туман неба), подземелья и Ирий (возврат фона игры).
