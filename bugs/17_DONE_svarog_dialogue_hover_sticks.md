# Bug 17 — Svarog's Dream: подсветка ответа в разговоре остаётся после ухода курсора

**Status:** ✅ DONE 2026-10-04 23:19 +03:00 — проверено в игре владельца (отчёт ниже)
**Severity:** S2 — пункт выглядит выбранным, хотя курсора на нём нет; выбор ответа читается неверно
**Version/build:** `SvarogsDream` `src/KrinikUIRework/Dialogue.cs` (коммит `e09f869`)
**When/context:** 2026-10-04 23:15 +03:00, слово владельца посреди обхода вкладок меню (тот же разговор с торговцем был
открыт на экране)

## Goal vector

Avoid: залипшая подсветка ответа. Где хотим быть: подсвечен только тот ответ, на котором стоит курсор; курсор ушёл —
все ответы в обычном цвете.
Критерий: курсор на ответе → ответ золотой; курсор в мире → ни одного золотого ответа на кадре и
`call EventSystem get_currentSelectedGameObject` не называет пункт ответа.

## Symptom

`[OWNER]` «бесит, что в диалоговых окнах остаётся выделение пункта цветом ховера. даже если убрать курсор, какой-то
сломанных механизм ховера и его снятия» · 2026-10-04 23:15.

## Repro (deterministic)

Разговор с торговцем открыт (в SvarogsDream):

1. `powershell -File tools/mouse.ps1 -X 700 -Y 1913 -Button move` — курсор на «Покажите, что у вас есть.»
2. `tools/h.sh "call EventSystem get_currentSelectedGameObject" "shot hv1_on"` → `NewOptionItemUIComplex(Clone)`
3. `powershell -File tools/mouse.ps1 -X 1900 -Y 700 -Button move` — курсор в мир
4. `tools/h.sh "call EventSystem get_currentSelectedGameObject" "shot hv1_off"` → **всё ещё** `NewOptionItemUIComplex(Clone)`;
   на кадре `hv1_off` ответ «Покажите…» золотой, стрелка яркая.

## Forensics

- Игра при наведении ставит пункт ответа «выбранным» (`EventSystem.currentSelectedGameObject`) и при уходе курсора выбор
  не снимает: шаг 4 выше.
- `KrinikOption.Apply`: `bool hi = _hover || _selected;` — подсветка горит, пока пункт выбран, то есть до наведения на
  другой пункт или до конца разговора.

## Root cause

Подсветка привязана к выбору, а выбор игра ставит наведением и не снимает. Уход курсора гасит `_hover`, но `_selected`
остаётся.

## Fix plan

`OnPointerExit` снимает и выбор, если его поставило наведение: `_selected = false` и
`EventSystem.SetSelectedGameObject(null)`, когда выбран этот пункт. Выбор клавиатурой (без курсора) подсвечивает
по-прежнему. Проверка — Repro выше: шаг 4 должен дать `null` и кадр без золотого ответа.
`TWINS: searched ISelectHandler|OnSelect(|currentSelectedGameObject in SvarogsDream/src — found 0 other sites`.

## Decisions made without the owner

- `[AI]` Снимать выбор при уходе курсора, а не убрать выбор из подсветки совсем: так подсветка от клавиатуры (если игра её
  даёт) остаётся, а от мыши — гаснет вместе с курсором.

## Links

`ideas/07_svarog_mods.md` п. 23 (подсветка без мерцания — та же правка ввела `_selected`) ·
`testcases/reports/2026-10-04_svarog-dialogue-dark-paper.md`

## ✅ STATUS: DONE (2026-10-04 23:19 +03:00)

Hygiene: сборка без ошибок. Functional run: разговор с торговцем в игре владельца, настоящий курсор — на ответе золотой,
в мире ни одного золотого и выбранного нет (`void`), переход на соседний ответ гасит прежний; клавиатура не проверялась.
Отчёт `testcases/reports/2026-10-04_svarog-dialogue-hover-sticks.md`, кадры
`SvarogsDream/gallery/game/2026-10-04_залипшая-подсветка/`. Слово владельца о результате — ещё нет.
