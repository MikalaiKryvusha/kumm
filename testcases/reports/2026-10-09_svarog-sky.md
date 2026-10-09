# Run report — Svarog's Dream: небо вместо пустоты, облака, картины загрузки во всю ширину

- **Work:** раздел «Небо» мода `KrinikColorRework` (шейдер `Krinik/Sky/Gradient`, `Sky.cs`, `ShaderBundle.cs`) и вторая редакция
  `KrinikUIRework/LoadingLayout.cs`; случаи — `testcases/TC_svarog_sky_2026-10-09.md` (C1–C12); основание — слово владельца в чате
  2026-10-09 ≈18:30–18:45 (цитаты в шапке случаев).
- **Contour:** игра `D:\Games\Svarog's Dream` (Unity 2020.3.49, deferred, HDR), 4K во весь экран; сейв владельца 17:46 (копия
  `_backups/svarog-saves-2026-10-09_1746-owner`); SvarogsDream `4116988` + правки шейдера после него.
- **Runs:** четыре запуска — 18:38, 18:45, 18:48, 18:51; `bash tools/run-game.sh`; пульт `bash tools/h.sh "call KrinikCameraRework.Plugin
  TestFaceSun 15 0" "cfg krinik.svarogsdream.colorrework Sky ForceMood <Day…Rain>" "shot mood_<…>"`; закрытие `bash tools/h.sh "kill"`;
  сейвы `sha256sum -c _backups/svarog-saves-2026-10-09_1746-owner.sha256`; пакет — `Unity.exe -batchmode … -executeMethod KrinikBuild.Bundles`.
- **Checks:**
  - Hygiene: `dotnet build` обоих модов — 0 ошибок; пакет `krinik.shaders` — 4 шейдера без ошибок компиляции.
  - Functional run: игра, сейв владельца, камера 15° на солнце, кадры 4K изнутри движка, прочитаны глазом и журналом
    `BepInEx/LogOutput.log` — C1 pass, C2 pass, C3 pass, C4 pass, C5 partial (камера, переснято в C12), C6 pass, C7–C9 не прогонялись,
    C10 fail → причина найдена, C11 pass, C12 pass.
- **Found:** (1) пустота — сам скайбокс игры `Skybox/6 Sided` (в ракурсе 15° чёрный); (2) видимая полоса неба пологой камеры лежит
  ниже настоящего горизонта — облака там не рисовались, исправлено `_HorizonDrop` 0.12; (3) вода отражает небо — озеро меняет цвет с
  настроением (вопрос вкуса владельцу); (4) за краем подгруженной земли — бежевая плоская полоса дальнего террейна.
- **Traces:** `SvarogsDream/gallery/game/2026-10-09_небо/` (лист вариантов, было-стало, экран загрузки, диагностика облаков);
  `SvarogsDream/_harness/mood_*.webp`, `ld_a.webp`, `ld_b.webp`; журнал игры строки `sky on/off`, `loading art: … cropped to`.
- **Verdict:** partial — небо, шесть настроений, облака и экран загрузки проверены в игре; не прогнаны: ход суток по часам (C7), дождь
  погодой игры (C8), матовая земля после переноса загрузки пакета глазом (C9; журнал `supported=True`), цена облаков в FPS.
