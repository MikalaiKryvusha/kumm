# Run report — Svarog's Dream: часы (дата +10 %, к карте, контур, серее), знак выбора (выбор Б), флажки, совет и подпись расширения главного меню, дальние снова каждый кадр, перепись строк с подстановкой

**Created:** 2026-10-10 21:48 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikUIRework (часы, `Menus.DropdownCheck*`,
флажки галочкой в кольце, `FitExpansionInfo`, флажки под серединой списков), KrinikCameraRework 1.4.1, `zz_krinik.txt` (совет), `tools/text_census.py`

## 1. Work

- Слово владельца 2026-10-10 ≈21:20–21:47 — дословно в `testcases/TC_svarog_clock_check_variants_2026-10-10.md` (шапка и строки C7–C10).
- Случаи C1–C10c того же файла; перепись строк — контроль на строке «Travel requires … food» (см. Checks).

## 2. Contour

- Игра `D:\Games\Svarog's Dream`, release-плеер; режим владельца 1280×720 без рамки; кадры 4K — `ExclusiveFullScreen` и возврат.
- Сейв владельца — копия `_backups/svarog-saves-2026-10-10_1848-owner` (сверено 21:21, 7/7); мир грузился в двух запусках из шести,
  остальные — только главное меню.
- REAL WORLD: accumulated — сейв и настройки модов владельца, его файл `camerarework.cfg` (FarAgentMeters 150 → 0) и `uirework.cfg`
  (DropdownCheckSize 0.62 → 0.8); data and machine — его машина, его режим экрана; path — мир на отдалении, главное меню → «Настройки».

## 3. Runs

1. 2026-10-10 21:26–21:29 — `bash tools/run-game.sh`; `h.sh "fieldon … isTimeDisabled True" "callon Camera CameraFollow SetMaxZoom"
   "call KrinikCameraRework.Plugin FarAgentsStatus" "shot k1_clock_045" "cfg … Hud WorldClockShift 0.9" "shot k2_clock_09"`, кадры 1080p/2K/4K;
   выход в главное меню; шесть вариантов знака `cfg … Menus DropdownCheckStyle|DropdownCheckSize` + `click …/GraphicPreset/Dropdown`; `kill`.
2. 2026-10-10 21:30–21:34 — запуск до главного меню (`Start-Process`), шесть вариантов через `callon …/Dropdown Dropdown Show|Hide`;
   «Продолжить», кадр часов 4K (попал на экран загрузки); `kill`.
3. 2026-10-10 21:35 — `bash tools/run-game.sh`, кадр серых часов 4K, `kill`.
4. 2026-10-10 21:37 — `python -I tools/text_census.py "D:/Games/Svarog's Dream" translation/text_census.tsv` (до и после правки — сравнение).
5. 2026-10-10 21:38–21:44 — запуск до главного меню; `dump` совета и подписи расширения; `bash tools/deploy-hot.sh KrinikUIRework`;
   `bash tools/translation_deploy.sh`; перезапуск; кадры 720p и 4K; `kill`.
6. 2026-10-10 21:45–21:48 — три запуска до главного меню: флажки, щелчок `click …/GraphicMenu/CensorContent` туда и обратно, кадры 4K; `kill`.
7. После каждого — `cmp` семи файлов сейва с копией (откат, где записал выход в меню), `reg query` экрана.

## 4. Checks

- Hygiene: сборки двух модов без ошибок; выкладка перевода — проверки зелёные («ours 0»); сторож лучей 40/33; проверка покоя — ui moved 0.
- Functional run: игра владельца на копии его сейва и в главном меню, в его режиме экрана; прочитаны кадры, журнал мода, ответы пульта.
- C1–C4 — pass (часы, мод камеры 1.4.1 `slowAgents=0`); C5 — fail (знак пропадал в открытом списке), C5b — pass; C6a — pass (серее);
  C7, C8, C9 — pass; C10 — pass с замечанием (серая кайма), C10b — fail (кайма внутри), C10c — pass. Подробно — файл случаев.
- Перепись: прежняя выдача — 0 строк «Travel requires», новая — 1 (`WorldMap $Travel requires {travelFoodCost} food, but you only have {num}.`);
  все 65 прежних строк остатка на месте; новых строк с подстановкой вне словарей — 127 (из них ≈42 — журнал разработчика: «Failed to…»,
  «Tried to…»).

## 5. Found

- Перепись `text_census.py` не считала строки с подстановкой `$"…{x}…"` — класс, через который прошла строка окна карты. Закрыт: места
  подстановок — дырками, как `{{A}}` ключа и группы `r:`; остаток 65 → 192.
- Знак в открытом списке пропадал, когда смена настройки уничтожала картинку (C5) — картинка больше не уничтожается.
- Знак флажка игры не ребёнок подложки — растяжка по якорям давала кольца разного размера (C10b); ставится по мировому прямоугольнику.
- Совет над настройками: машинный перевод держал перенос автора после «из главного меню» — первая строка длиннее плашки (C7).
- Подпись расширения шла к самому краю экрана, за плашку (C8).

## 6. Traces

- Кадры: `SvarogsDream/_harness/k1_clock_045.webp`, `k2_clock_09.webp`, `k3_clock_*.webp`, `k6_clock_gray_2160.webp`, `v_*.webp`,
  `fx_mm_720.webp`, `c9_set_*.webp`, `c10_*.webp`, `c10b*.webp`, `c10c_*.webp`.
- Галерея: `SvarogsDream/gallery/game/2026-10-10_часы-и-галочка/` (`галочка_варианты_4K.webp`, `часы_было-А-Б_720p.webp`,
  `часы_А_4K_крупно.webp`, `часы_белые-серые_4K.webp`), `…/2026-10-10_настройки-все-страницы/главное-меню_было-стало_4K.webp`.
- Перепись: `SvarogsDream/translation/text_census.tsv`; журнал: `D:\Games\Svarog's Dream\BepInEx\LogOutput.log`.

## 7. Verdict

Pass: всё сказанное владельцем этим вечером сделано и снято на его сейве и в его режиме экрана; выбор знака — его (Б, кольцо 80 %).
Кадры 1080p и 2K для главного меню не снимались (720p и 4K — да). Перевод 127 найденных строк с подстановкой — не сделан, очередь бага 28.
