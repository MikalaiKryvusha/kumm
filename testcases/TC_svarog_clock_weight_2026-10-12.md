# Test cases — вес шрифта часов: между Manrope SemiBold и Rubik Black

> **Основание:** `[OWNER]` «часам нужно легче вес» · затем, увидев Manrope SemiBold, «вес часов тяжелее» · 2026-10-12.
>
> **Сборка:** пакет `krinik_manrope_ttf` + Rubik Bold (700), SemiBold (600), Medium (500), нарезаны из Rubik[wght] fontTools-ом;
> KrinikUIRework — настройка `Hud.WorldClockFont` (список), по умолчанию `Rubik-Bold`.
>
> **Сцена:** сейв владельца (копия `_backups/svarog-saves-2026-10-11_2342-owner-exit`), время идёт. После — `kill`, сейв 7/7, реестр.

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| C1 | Мир, `WorldClockFont` = Rubik-Black · Rubik-Bold · Rubik-SemiBold · Rubik-Medium · Manrope-SemiBold | вес убывает по шагам; цифры в ячейках не дёргаются; шрифт в `dump` тот, что задан | кадры `cw_<имя>`, лист; `dump` поле `font=` | pass 08:56 — пять шрифтов, `font=` в дампе совпал с заданным каждый раз; вес убывает по шагам (лист `cw_sheet`); в игре Rubik-Bold — `[OWNER]` «часы суппер» · 2026-10-12 08:56 |
| C2 | После: `kill`, сейв 7/7, реестр | как до прогона | `cmp`, `reg-snap.sh restore` | pass 08:56 — сейв 7/7, реестр вернул |
