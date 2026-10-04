# Test run report — Svarog's Dream: пузырь реплики над героем читается (баг 16)

**Created:** 2026-10-04 23:36 +03:00 · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** `SvarogsDream` `src/KrinikUIRework/Dialogue.cs` поверх `9b1553c`, `BubbleTextColor`

## 1. Work

Баг `bugs/16_svarog_hero_bubble_black.md`: над героем пузырь чёрный и текст в нём чёрный. Основание — слово владельца в баге
и его критерий: светлая полоса с тёмным текстом или тёмная полоса со светлым, контраст не ниже 4.5.

## 2. Contour

Игра владельца Svarog's Dream, 4K, его сейв, деревня у шатра торговца. Мод `KrinikUIRework` перезагружен горячо. Реплика
героя вызвана методом самой игры (`PlayerCommentsManager.MakeComment`) — тот же путь, которым игра даёт герою реплики сама.
REAL WORLD: accumulated — сейв, настройки и объекты игры владельца с метками прошлых сборок; data and machine — его машина;
path — реплика героя по пути игры, пузырь жителя — разговор правой кнопкой и «(Уйти)». Проверено на реальном мире.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-04 23:31 +03:00 | `grep -a "bubble " LogOutput.log` | у одного пузыря полоса `1D1D1DED`, у остальных `FFFFFFD7`; текст у всех `000000FF` |
| 2 | 2026-10-04 23:33 +03:00 | `tools/deploy-hot.sh KrinikUIRework` | 0 · RELOADED (attempt 1) |
| 3 | 2026-10-04 23:34 +03:00 | `tools/h.sh "call PlayerCommentsManager MakeComment Bara 1" "shot b16_after"` | пузырь закрыт окном «Новости» (смена сезона) — кадр негодный |
| 4 | 2026-10-04 23:34 +03:00 | `tools/mouse.ps1 -X 2004 -Y 1507` (ОК новостей) → `tools/h.sh "call PlayerCommentsManager MakeComment Bara 1" "wait 0.5" "shot b16_after2"` | тёмная полоса, светлый текст «Грязь, туман и страдания.» |
| 5 | 2026-10-04 23:35 +03:00 | `tools/mouse.ps1 -X 2107 -Y 1164 -Button right` → `tools/mouse.ps1 -X 230 -Y 1840` → `tools/h.sh "wait 0.6" "shot b16_npc"` | прощальный пузырь торговца белый, точки чёрные |

## 4. Checks

Hygiene: сборка `dotnet build` без ошибок (старое предупреждение `Letters.cs` CS0414) — тестов кода нет
Functional run: реплика героя и прощание торговца в игре владельца · прочитаны кадры глазом, замеры по кадру 4K (контраст
WCAG, высота букв по строкам), журнал игры

| Case | Status | Observation |
|---|---|---|
| C1 причина | pass | журнал: полоса героя `1D1D1DED`, жителей `FFFFFFD7`; код ставил чёрный всем |
| C2 пузырь героя | pass | `b16_after2`: контраст 14.98, буквы 43 точки |
| C3 контроль: пузырь жителя | pass | `b16_npc`: полоса белая, текст («…») чёрный |
| C4 выключенный разговорный стиль | skipped | не переключал; правка ставит тот же цвет и при выключенном стиле |

## 5. Found

- `bugs/16_svarog_hero_bubble_black.md` — закрыт этим прогоном
- Подсказка мини-карты: «Направления» налезает на «1077м», описание курсивом (кадр `b16_after`) — записано в `ideas/07`
- Двойники класса «цвет текста без взгляда на подложку» — светлые полосы списков «Помощи» и «Альманаха» (беды 2–3 листа
  меню) — ждут слова владельца о порядке работ

## 6. Traces

`SvarogsDream/gallery/game/2026-10-04_пузырь-героя/` (кадры C2–C3, README) · `SvarogsDream/_harness/b16_*` · журнал
`D:\Games\Svarog's Dream\BepInEx\LogOutput.log`, строки `event: bubble`

## 7. Verdict

pass — C1–C3 сходятся с критерием бага; C4 не проверен и назван.
