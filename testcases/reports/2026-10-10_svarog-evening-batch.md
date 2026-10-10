# Run report — Svarog's Dream: вечерний прогон 2026-10-10 — часы, знак выбора, дальние жители рывками, Бор/Бара, снимки настроек и экрана смерти

**Created:** 2026-10-10 19:37 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikUIRework (часы ×1.5, дата сверху;
зелёная галочка в списках), KrinikCameraRework 1.4.0 (`FarAgentMeters` 150 / `FarAgentEveryFrames` 4), KrinikDevHarness (+ `die`)

## 1. Work

- Слово владельца 2026-10-10 18:46–19:12 (часы, интервью #011 В1 и В2, Бор/Бара, снимки всех настроек и экрана смерти) — дословно в
  `testcases/TC_svarog_evening_batch_2026-10-10.md`, план 18 («Слово владельца 2026-10-10 ≈18:46»).
- Случаи C1–C11 того же файла.

## 2. Contour

- Игра `D:\Games\Svarog's Dream`, release-плеер; режим владельца 1280×720 без рамки; на C2/C4 — 1080p, 2K, 4K `ExclusiveFullScreen`.
- Сейв владельца после его игры — копия `_backups/svarog-saves-2026-10-10_1848-owner`; часы стоят; перемещения между городами после
  `HealHunger` (сытость героя у владельца 0); смерть героя (C10) — на копии, откат после.
- REAL WORLD: accumulated — сейв владельца после его игры, его настройки модов; data and machine — его машина, его режим экрана;
  path — мир на отдалении, меню по Esc, главное меню → «Настройки», как он играет.

## 3. Runs

1. 2026-10-10 19:13–19:14 — сборки (`dotnet build src/KrinikCameraRework|KrinikUIRework -c Release`), копии в `BepInEx/plugins`,
   `BepInEx/scripts`; `bash tools/run-game.sh` (сторож лучей 40/33); `h.sh "fieldon … isTimeDisabled True" "callon Camera CameraFollow
   SetMaxZoom" "call KrinikCameraRework.Plugin FarAgentsStatus" "shot c1_clock_720"`.
2. 2026-10-10 19:14–19:15 — C6: `h.sh "comps CharacterStats 120" "wait 2" "comps CharacterStats 120"`, `python -I _harness/c6_cmp.py`.
3. 2026-10-10 19:16–19:17 — C7: `h.sh "cfg krinik.svarogsdream.camerarework DrawDistance FarAgentMeters 150|0" "wait 3" "perf 8"` ×6.
4. 2026-10-10 19:17–19:28 — C8: карта → `BaraInn` → `BorInn` → `BaraInn` (`click … FastTravelBtn`), в каждом `"wait 60" "perf 8"` ×3,
   `"prof 8 12"`; раскладка Бары: `animcull transforms|restore`, `particles pause|play`, `farchars 60|restore`, `farparts 60
   nav|render|anim|ai|phys` + `restore`, по окну `perf 6`.
5. 2026-10-10 19:28–19:31 — C9: `click UI/MainMenu/MainMenu_Canvas/Buttons/<страница>` + `shot`; подвкладки — `tools/mouse.ps1 -X 350
   -Y <100…262> -Button left`; поп-апы — `tools/mouse.ps1 -Button move` на «?».
6. 2026-10-10 19:29–19:32 — C2: `call UnityEngine.Screen SetResolution 1920 1080|2560 1440|3840 2160 ExclusiveFullScreen` + `shot`;
   выход в главное меню (`click …/MainMenu`, `…/Yes`); C3/C4: `click MainMenu/MainMenu_Canvas/MenuDefaultButtons_Canvas/Buttons/Settings`,
   `click …/GraphicPreset/Dropdown` + `shot` на четырёх разрешениях; `SetResolution 1280 720 FullScreenWindow`.
7. 2026-10-10 19:34–19:35 — `h.sh "kill"`, пульт с `die`, `run-game.sh`; C10: `h.sh "die" "wait 2" "shot c10_death_0" …`.
8. 2026-10-10 19:36 — C11: `h.sh "kill"`; откат 6 файлов сейва из копии, `sha256sum` 7/7; `reg query`.

## 4. Checks

- Hygiene: сборки трёх модов без ошибок; сторож лучей мыши — 40/33.
- Functional run: игра владельца на копии его сейва, в его режиме экрана; прочитаны кадры, строки `perf`/`prof`, ответы пульта, журнал.
- C1 — pass: часы «Лето, день 12» / «10:09», кегль 72 (было 48), на круг карты не налезают; дата = дата карты игры.
- C2 — pass: на 720p, 1080p, 2K, 4K вид пропорционально тот же.
- C3 — pass: у выбранной «Свой» — зелёная галочка в кольце, у остальных знака нет.
- C4 — pass: знак чёткий и круглый на всех четырёх разрешениях.
- C5 — pass: мод камеры 1.4.0, `slowAgents=52`, исключений 0.
- C6 — pass: дальше 150 м за 2 с сдвинулись 17 из 23 персонажей — ходьба не встала.
- C7 — fail по ожиданию: 13.51 мс против 13.61 мс — разница в шуме; правка оставлена по слову владельца.
- C8 — pass (замер сделан): см. «Found».
- C9 — pass: 6 страниц, 6 подвкладок, 2 поп-апа, главное меню сняты.
- C10 — pass: экран смерти снят (3 кадра).
- C11 — pass: игра закрыта, сейв 7/7 с копией, реестр 1280/720/1.

## 5. Found

- **Бор против Бары.** В одних условиях у трактиров (камера на пределе, 50°, часы стоят): Бор — 71 FPS (14.0–14.5 мс); Бара после
  Бора — 61.6 FPS (16.2 мс); Бара сразу после загрузки — 70 FPS (14.3 мс), но загружено втрое меньше (рендеров 2154 против 6218,
  частиц 97 против 409). Цена Бары: 79 персонажей дальше 60 м — 4.3 мс (отрисовка тел 1.5, скрипты игры 0.6, анимация 0.3, навигация
  и физика ≈0); частицы — 1.4 мс; 94 аниматора «двигать всегда» (~~не жители~~ — поправка 2026-10-10 23:04: пульт `animcull` переключал и жителей; у одних предметов — ≈0, `testcases/reports/2026-10-10_svarog-perf-series.md`) — 0.8 мс. У Бора персонажей 83 против 95, частиц 324
  против 409, «двигать всегда» 37 против 94, треугольников 4.3 млн против 5.6 млн.
- **Замер зависит от того, сколько мира загружено:** сразу после загрузки сейва та же точка Бары легче на 2 мс, чем после поездки.
- **В1 (дальние рывками) — выигрыш ≈0** в Баре у банка (13.51 против 13.61 мс).
- **Настройки — «ужас» по рулбуку** (список по страницам — `SvarogsDream/gallery/game/2026-10-10_настройки-все-страницы/README.md`):
  поп-ап «?» на «Видео» уходит под левую колонку; первая подвкладка «…льзовательский интерфейс» обрезана; 13 подписей налезают на
  флажки и «?»; «Целевая частота кадро…» под списком; три левые линии на «Графике»; на «Управлении» наложение «Показать Панель Действий
  ? CapsLock» и машинные переводы клавиш («Побег», «Левый», «Мышь3»); «Окружающий» на ползунке; «Настройки модов» — английское окно
  ConfigurationManager.
- **Экран смерти** (`SvarogsDream/gallery/game/2026-10-10_экран-смерти/README.md`): эпитафия мелкая, серая, прямым шрифтом; эпитафия,
  портрет и кнопка не выровнены; в миг гибели справа обрезан всплывающий «25 вынос…».
- Строка игры не переведена: «Travel requires 3 food, but you only have 0.» (окно карты).

## 6. Traces

- Кадры: `SvarogsDream/_harness/c1_clock_720*.webp`, `c2_clock_sheet.webp`, `c3_dropdown_720*.webp`, `c4_dd_sheet.webp`,
  `set_*.webp`, `set_subtabs_sheet.webp`, `set_tips_sheet.webp`, `mm_settings_720.webp`, `c10_*.webp`, `c8_*.webp`, `map_date_crop.webp`.
- Галерея: `SvarogsDream/gallery/game/2026-10-10_часы-и-галочка/`, `…_настройки-все-страницы/`, `…_экран-смерти/` (README в каждой).
- Строки замеров: `SvarogsDream/_harness/c8_bara1.txt`, `c8_bor1.txt`, `c8_bara2.txt`, `c6_pos.txt`.
- Журнал: `D:\Games\Svarog's Dream\BepInEx\LogOutput.log`; сейв: копия `_backups/svarog-saves-2026-10-10_1848-owner`.

## 7. Verdict

Partial: часы, знак выбора, дальние щелчки и снимки — pass на сейве владельца и в его режиме экрана; В1 работает (дальние идут
рывками), но кадров в замере не дал (C7 — fail по ожиданию выигрыша, правка оставлена по слову владельца). Вкус часов и галочки — глаз
владельца.
