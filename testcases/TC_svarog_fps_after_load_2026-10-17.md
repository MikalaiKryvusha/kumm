# Тест-кейсы — провал кадров после загрузки мира (репро)

**Created:** 2026-10-17 · **Under test:** первые секунды игры после загрузки сейва (все моды выложены, сборки вечера)
**Test basis:** `[OWNER]` «после загрузки очень низкий фпс был» · «12» · 2026-10-17. Видеокарта — режим KAGO (Optimised, кривая `4215c7`);
досье: `PresentMon-2.5.1-x64.exe`, своя сессия `kumm-pm` (HOUSE_RULES §4).

## 1. Goal vector

Achieve: воспроизвести провал и назвать его длину и глубину числом, прежде чем искать причину.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | Запись времени кадров shall покрыть загрузку и 60 с после появления HUD | CSV PresentMon, строки с момента запуска |
| R2 | Провал shall быть измерен | доля кадров дольше 50 мс (< 20 к/с) в первые 30 с после HUD против следующих 30 с |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered |
|---|---|---|
| точка | сейв владельца у дома в Граде, ночь | другие места, день |
| запуск | чистый запуск `run-game.sh` | загрузка из меню без перезапуска игры |

## 4. Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| C1 | PresentMon `--process_name "Svarog's Dream.exe" --timed 150` до запуска, затем `run-game.sh` → CSV есть | use case | [NOT-TESTED] |
| C2 | разбор CSV: кадры по секундам от появления HUD (журнал `waitfor … ok`) → есть ли отрезок < 20 к/с и сколько он длится | use case | [NOT-TESTED] |

## 5. Control cases

| # | Control → expected | Status + evidence |
|---|---|---|
| K1 | 30 с через минуту после загрузки — кадры обычные (~80+ к/с, как в 18:34) | [NOT-TESTED] |
