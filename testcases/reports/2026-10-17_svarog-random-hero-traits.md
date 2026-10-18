# Run report — Svarog's Dream: мод KrinikExtendedHeroesTraits, описания 93 Талантов, починки автора 8–10

## Work
Кейсы `testcases/TC_svarog_random_hero_traits_2026-10-17.md` (R1–R8) по плану 27 (`plans/27_svarog_random_hero_traits.md`) и интервью 019.
Код — `SvarogsDream/src/KrinikExtendedHeroesTraits/Plugin.cs`, `src/KrinikFixes/AuthorBugs.cs` 8–10, `translation/selection_ru.tsv`.

## Contour
Svarog's Dream (GOG), 3840×2160, BepInEx 5.4.23.5, XUnity. Прогон на машине владельца по его слову «комп твой, делай, тестируй»: сейв —
точка `_backups/svarog-saves-2026-10-17_1138-owner-hero-select` (7 из 7 после каждого запуска), окно выбора — пультом.

## Runs
- 2026-10-17 11:48 чистый запуск (мод 1-й версии); 11:50 20 перебросов пультом `callon UI/CharacterSelection GameUI.CharacterSelectionUI PopulateCharactersAfterPlayerDeath True`
- 2026-10-17 11:50 чистый запуск (выбор шагами владельца); 20 перебросов
- 2026-10-17 11:58 чистый запуск (списки несовместимых); 200 перебросов; 11:59 «Переброс» настоящей мышью `tools/mouse.ps1 -X 1229 -Y 77 -Button left`
- 2026-10-17 12:17 чистый запуск (журнал `chosen:`); «Выбор» мышью `-X 655 -Y 1895`
- 2026-10-17 12:28 чистый запуск (KrinikFixes 8–10, перевод не выложен); 12:34 `translation_deploy.sh`, 12:35 чистый запуск, наведение на 3 Таланта
- 2026-10-17 12:36 `h.sh kill`, `save-check.sh --restore` (7 из 7), `reg-snap.sh restore`

## Checks
Hygiene: `dotnet build` трёх модов — Build succeeded; `glossary_check.py --strict` — 0 наших (после правок); `selection_xunity.py` — talent-desc 95/95.
Functional run: окно выбора героя в игре, журнал мода и кадры пульта — прочитаны.
- R1 pass — пул 78 Талантов из 62 героев.
- R2a partial, R2 pass, R2b pass — 603 героя: повторов 0, несовместимых 0, совпадения между героями есть.
- R3 pass — значки карточек = строка `roll:`.
- R4b pass — герой получил ровно три Таланта карточки; переброс не висит над окном «Сменить класс?».
- R6 pass — кнопка «Переброс»: новая тройка, Милостей 0, строка «Не хватает…».
- R7 fail → R7b pass — новые описания на экране после строгого глоссария.
- R8 pass (загрузка) — починки 8–10 загружены без ошибок; в бою не проверены.
- R5 (выключатель настройки) — не прогнан.

## Found
- Строгая проверка терминов молча остановила выкладку перевода (R7) — исправлены 8 строк, 2 исключения с причиной (EXP-0295).
- Ошибки автора: «Шрамы» и «Проклятие Голода» не действовали, кровотечение «Несущего Страдания» ×7 — починены в KrinikFixes; бафф Staggered
  переведён «Поэтапно»; атрибут выше 95 становится 90 — в очереди плана 27.

## Traces
`SvarogsDream/_harness/`: `rt_1.webp`, `rt2_20.webp`, `rt3_200.webp`, `rb_after.webp`, `r4b.webp`, `r7_sheet.webp`, `r7b_sheet.webp`;
журнал `BepInEx/LogOutput.log` (строки `Krinik Extended Heroes Traits`); разбор — scratchpad `check_rolls3.py`.

## Verdict
partial — работа мода и описания проверены; починки 8–10 — только загрузка (бой не прогнан), R5 не прогнан.
