# Test run report — Svarog's Dream: подсветка ответа гаснет вместе с курсором (баг 17)

**Created:** 2026-10-04 23:19 +03:00 · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** `SvarogsDream` `src/KrinikUIRework/Dialogue.cs` поверх `e09f869`, правка `KrinikOption.OnPointerExit`

## 1. Work

Баг `bugs/17_svarog_dialogue_hover_sticks.md`: после ухода курсора с ответа подсветка оставалась на нём. Основание
проверки — слово владельца в баге и его критерий: курсор на ответе → золотой; курсор в мире → ни одного золотого и
`EventSystem` не держит пункт ответа выбранным.

## 2. Contour

Игра владельца Svarog's Dream (`D:\Games\Svarog's Dream`), 4K, его сейв, разговор с торговцем у шатра в деревне. Мод
`KrinikUIRework` перезагружен горячо (ScriptEngine), разговор после перезагрузки закрыт и открыт заново, чтобы пункты
получили новый код. Курсор — настоящий курсор Windows (`tools/mouse.ps1 -Button move`), события наведения шлёт сама игра.
REAL WORLD: accumulated — сейв и настройки владельца, его игра, открытая у него; data and machine — его машина; path —
мышь, как он играет. Проверено на реальном мире.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-04 23:16 +03:00 | `tools/mouse.ps1 -X 700 -Y 1913 -Button move` → `tools/h.sh "call EventSystem get_currentSelectedGameObject" "shot hv1_on"` → `tools/mouse.ps1 -X 1900 -Y 700 -Button move` → `tools/h.sh "call EventSystem get_currentSelectedGameObject" "shot hv1_off"` | старая сборка: выбран пункт и после ухода курсора, подсветка горит (воспроизведение) |
| 2 | 2026-10-04 23:17 +03:00 | `tools/deploy-hot.sh KrinikUIRework` | 0 · RELOADED (attempt 1) |
| 3 | 2026-10-04 23:18 +03:00 | те же команды, что в прогоне 1, кадры `hv5_on` / `hv5_off` | новая сборка: на пункте — выбран и подсвечен; в мире — `void`, подсветки нет |
| 4 | 2026-10-04 23:18 +03:00 | `tools/mouse.ps1 -X 700 -Y 1913 -Button move` → `tools/mouse.ps1 -X 400 -Y 1987 -Button move` → `tools/h.sh "shot hv6_move"` | подсвечен только «Кто ты?» |

## 4. Checks

Hygiene: сборка `dotnet build` без ошибок (одно старое предупреждение `Letters.cs` CS0414) — тестов кода нет
Functional run: разговор с торговцем в игре владельца, наведение и уход настоящим курсором · прочитаны кадры пульта
глазом и ответ `EventSystem.currentSelectedGameObject`

| Case | Status | Observation |
|---|---|---|
| C1 воспроизведение на старой сборке | pass | `hv1_off`: курсор в мире, «Покажите…» золотой; выбран `NewOptionItemUIComplex(Clone)` |
| C2 контроль: курсор на ответе | pass | `hv5_on`: «Покажите…» золотой, стрелка яркая |
| C3 курсор в мире | pass | `hv5_off`: все ответы обычного цвета; выбранного нет (`void`) |
| C4 переход с ответа на ответ | pass | `hv6_move`: золотой только «Кто ты?», «Покажите…» погас |
| C5 выбор клавиатурой | skipped | управляет ли игра ответами с клавиатуры — не проверял |

## 5. Found

- `bugs/17_svarog_dialogue_hover_sticks.md` — подсветка залипала (закрыт этим прогоном)
- Прощальный пузырь торговца «…» растянут почти на треть экрана (кадр сразу после горячей перезагрузки; на чистом
  запуске не проверено) — записан в `ideas/07` как увиденное агентом

## 6. Traces

`SvarogsDream/gallery/game/2026-10-04_залипшая-подсветка/` (кадры C1–C4 и пузырь, README с историей) ·
`SvarogsDream/_harness/hv1_*`, `hv5_*`, `hv6_*` (полные кадры 4K)

## 7. Verdict

pass — C1–C4 сходятся с критерием бага; C5 (клавиатура) не проверен и назван.
