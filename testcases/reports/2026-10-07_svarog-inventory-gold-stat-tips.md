# Test run report — Svarog's Dream: низ инвентаря «Золото · Вес», «?» у цифр статов, цвета статов, тире в предметах и «Помощи»

**Created:** 2026-10-07 10:09 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `030be05` + рабочие правки
этого прогона (`StatsLayout.cs`, `StatTips.cs`, `ProgressLayout.cs`, `glossary_fix.py`, `help_ru.py`, `items_ru.tsv`, `gametips_ru.tsv`)

## 1. Work

ideas/07 п. 30 (золото полностью, видом «Цена · Вес» карточки), п. 32 («?» у каждой цифры статов с объяснением по коду игры),
п. 33 (срез: цвета окна статов — из палитры «Прогресса», без смены вида), п. 34 (срез: тире в описаниях предметов, «Помощи»,
глоссарии). Набор случаев — `testcases/TC_svarog_inventory_2026-10-07.md` (C0–C13, K1–K3), написан до прогонов.

## 2. Contour

Игра владельца `D:\Games\Svarog's Dream`, его сейв (копия до запуска — `D:\work\ai_sandbox\_backups\svarog-saves-2026-10-07_0934`),
мод `KrinikUIRework` горячей перезагрузкой (ScriptEngine), пульт `KrinikDevHarness` (новая сборка в `plugins` с 10:05), экран
3840×2160. REAL WORLD: accumulated — сейв владельца с его сумкой (золото 1614, вес 105,6/144) и его конфиг модов; data and machine —
его машина и его игра; path — окно инвентаря, наведение настоящей мышью (`tools/mouse.ps1 -Button move`). Выход — `kill` (без записи сейва).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-07 09:36 +03:00 | `bash tools/run-game.sh` → `bash tools/h.sh "click UI/Enablers/Inventory" "wait 1" "shot inv_before"` | 0 · кадр «было» (C0) |
| 2 | 2026-10-07 09:42 +03:00 | `bash tools/run-game.sh` → `bash tools/h.sh "click UI/Enablers/Inventory" "wait 1" "shot inv_after"` | 0 · сумма целиком, плашки великоваты (C3 pass, C4 fail) |
| 3 | 2026-10-07 09:44 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` → переоткрытие инвентаря, `shot inv_after2` | RELOADED · C4 fail (низ на кайме) |
| 4 | 2026-10-07 09:45 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.uirework Inventory PurseScale 0.7"`; `deploy-hot.sh` → `shot inv_after3` | C4 fail (4 px до каймы) |
| 5 | 2026-10-07 09:46 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` → `shot inv_after4` | C4 pass |
| 6 | 2026-10-07 09:47 +03:00 | `settext … PlayerGold 1 234 567`, `settext … CurrentWeight 999,9/999`, `shot inv_c5`; `cfg … FullGold false` / `PurseBoxes false` / обратно, `shot inv_k1 inv_k2 inv_back` | C5, K1, K2 pass |
| 7 | 2026-10-07 10:05 +03:00 | `bash tools/run-game.sh`; `bash tools/h.sh "call UtilMethods GetNicelyFormatedGoldAmount <n>"` для 0 · 999 · 1000 · 9999 · 10000 · 123456 · 1234567; `shot q_after` | C1, C2 pass; C6 fail (38 px против 35) |
| 8 | 2026-10-07 10:06 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework`; `powershell -File tools/mouse.ps1 -X 3601 -Y 993 -Button move` + `shot q_camo`; то же на Y 748, 831, 644; Y 1290/1212 по предметам | C6–C9, C11, C13 pass |
| 9 | 2026-10-07 10:08 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.uirework Inventory StatQuestions false" … "shot q_k3" … true … "shot q_k3_back"`; `bash tools/h.sh "kill"` | K3 pass; игра закрыта |

## 4. Checks

Hygiene: `dotnet build` KrinikUIRework и KrinikDevHarness — Build succeeded; `python -I tools/dash_check.py _config/xunity` — предметы 0, «Помощь» 0, глоссарий 0 (всего 637, было 670); сверка вывода генераторов с закоммиченными файлами (`gametips_xunity.py`, `help_ru.py`) — расхождения только задуманные; ряд «Цена · Вес» карточки до и после выноса `LabeledBox` — пиксели совпали
Functional run: окно инвентаря в игре владельца, его сейв — прочитаны кадры низа окна, столбика статов и подсказок под настоящей мышью, описания предметов в карточке, ответы пульта на вызов функции игры

| Case | Status | Observation |
|---|---|---|
| C0 | pass | «1,6k 🪙 105,6/144 ⚖» охрой, без подписей (`inv_before_bottom.webp`) |
| C1 | pass | 0 · 999 · 1000 · 9999 — как есть |
| C2 | pass | «10 000», «123 456», «1 234 567» (U+202F) |
| C3 | pass | «Золото 1614 🪙» на сейве владельца |
| C4 | pass (с 4-го захода) | плашки карточки, 12 px до ячеек и 11 px до каймы (`inv_after4_bottom.webp`) |
| C5 | pass | «1 234 567» целиком, перегруз веса — цветом «хуже» |
| C6 | pass (со 2-го захода) | 15 «?» 35×35 на одной вертикали с «?» урона |
| C7 | pass | подсказка «Камуфляж» у значка, целиком |
| C8 | pass | «Запас Здоровья», «Защита: Дробящий» — у значка, целиком |
| C9 | pass | поп-ап «Суммарного Урона» игры, как прежде |
| C10 | pass | тексты без тире, числа сверены по коду |
| C11 | pass | цвета статов прежние: разница 0,2, ни одного пикселя > 40 |
| C12 | pass | предметы, «Помощь», глоссарий — 0 тире |
| C13 | pass | «Синий Млечник»: «Редкий гриб. Говорят, кто его съест, становится умнее.» |
| K1 | pass | `FullGold` выкл. — «1,6k» |
| K2 | pass | `PurseBoxes` выкл. — вид игры, включение возвращает плашки |
| K3 | pass | `StatQuestions` выкл. — «?» нет, «?» урона на месте |

## 5. Found

- Пульт: `call` статического класса игры падал `ArgumentNullException` (FindObjectsOfTypeAll на не-Unity типе) — починено в этом же заходе (SvarogsDream `030be05`).
- Хук `testcase-gate`: чтение скрипта (`sed -n … run-game.sh`) засчитывалось прогоном — починено (KUMM `0462470`, v2.2).
- Правки тире 07.10 ночью (`ad633ef`) легли в сгенерированные `zz_krinik_help.txt` и `zz_krinik_gametips.txt`, а не в их источники: перегенерация вернула бы тире — перенесено в `help_ru.py` и `gametips_ru.tsv`; генератор «Помощи» падал на втором ключе «Press the 'I' key…» — выбор ключа починен.
- Игра (вне мода): «Суммарный Урон» не учитывает крит — `criticalChance / 100` целочисленным делением (`UserInterface.cs:157`, разведка `researches/svarogs-dream/inventory-stats-mechanics.md`).

## 6. Traces

Кадры — `D:\work\ai_sandbox\SvarogsDream\_harness\`: `inv_before*.webp`, `inv_after*_bottom.webp`, `inv_c5_bottom.webp`, `inv_k_sheet.webp`,
`q_after_stats.webp`, `q_camo_crop.webp`, `q_sheet.webp`, `q_items_sheet.webp`, `q_k3_sheet.webp`; дампы — `_harness/dump.txt` (последний);
журнал игры `D:\Games\Svarog's Dream\BepInEx\LogOutput.log`.

## 7. Verdict

pass — все случаи C0–C13 и контрольные K1–K3 пройдены функциональным прогоном в игре владельца; вкус (размер плашек, вид «?», тексты
подсказок) — глаз владельца.
