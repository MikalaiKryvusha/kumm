# Тест-кейсы — ночь 2026-10-18, пачка 9: сообщения достижений в стопке над рядом

**Created:** 2026-10-18 · **Under test:** `SvarogsDream/src/KrinikUIRework/MessageStack.cs` (`Scan`: стопка берёт только копии с `UIFadeAway`).
**Test basis:** план 31, пункт 7 — `[OWNER]` «сообщения богов и достижений появляются внизу слева поверх нашего худ виджета - нужно в центр переносить над
квик экшенами»; интервью #022, Q3 — А. Достижения ночью не вызывались (суд пачек 6–7). Показы игры без побочных действий: `UIInfoMessages.
ShowQuestFinishedMessage`, `ShowNewLevelUpMessage`, `ShowRecipeDiscoveredMessage` (только `Instantiate` заготовки).
**Dimensions:** заготовка — задание выполнено · новый уровень · рецепт открыт. Не покрыто: настоящая мышь не нужна.

## Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| A5 | `SAFE_SPOT="-590,96,1863" bash tools/run-game.sh`; щелчок «Оружие» → HUD виден | setup | partial 2026-10-18 06:55 · безопасный старт: `False -> True`, телепорт, `True -> False`; щелчок «Оружие» сделан без проверки состояния — на кадре `ac3` HUD скрыт (ни карточки, ни ряда): видимо, щелчок оружие убрал |
| AC1 | `callon UI/ActionBar/InfoMessages GameUI.UIInfoMessages ShowQuestFinishedMessage` → строка в стопке по центру над рядом, не внизу слева; журнал `adopted`; кадр | use case | partial 2026-10-18 06:55 · журнал `'Квест завершен.' adopted, live 1` — стопка подхватила, текст по-русски; место относительно ряда не оценено — HUD скрыт (кадр `ac3_crop.webp`) |
| AC2 | `… ShowNewLevelUpMessage` → то же | equivalence | fail 2026-10-18 06:55 · журнал `'Уровень повышен!' adopted, live 2`; кадр `ac3_crop.webp`: крупный текст в две строки с красной чертой налезает на «Новый рецепт обнаружен.» (рулбук В4) — у этой заготовки стопка, видимо, не выравнивает текст (нет фона `Background`); правка — следующая сессия |
| AC3 | `… ShowRecipeDiscoveredMessage` → то же | equivalence | partial 2026-10-18 06:55 · журнал `'Новый рецепт обнаружен.' adopted, live 3`, на бумаге; под неё залез текст AC2; место относительно ряда не оценено — HUD скрыт |
| L2r | правка `VisibleRect` (холодная выкладка, второй запуск): `static WorldState isEquiped` → щелчок «Оружие» только при False; `ShowNewLevelUpMessage` → `ShowRecipeDiscoveredMessage` → строки одна над другой, «Уровень повышен!» не налезает на соседнюю; по центру над рядом; кадр | state transition | fail 2026-10-18 07:01 · `isEquiped False` → щелчок «Оружие» → `KrinikHeroCard=True`; стопка по центру над рядом (кадр `l2r_crop.webp`), но серия кадров 0,3–1,2 с (`l2r_series.webp`): вторая строка «повышен!» стоит на бумаге «Новый рецепт обнаружен.» во всех четырёх кадрах — это не движение стопки, правка `VisibleRect` не помогла; код откатан, в игру выложена прежняя сборка. Гипотеза на следующую сессию: текст заготовки выровнен вверх и переливается вниз, а высота считается от центра прямоугольника — мерить по нарисованным строкам текста (`Text.cachedTextGenerator`) |
| K2 | перевод (выложен 2026-10-18, без прогона): `callon … ShowNewSoulLevelUpMessage` → «Уровень Души повышен!» по-русски (было «Soul Level Up!» — нет ни в одном словаре, `translation/data_census.tsv`); `ShowNewLevelUpMessage` → «Уровень повышен!» из нашего словаря, а не машинного | use case | [NOT-TESTED] |
| S1 | после прогона: `isGodMode False`, `h.sh "kill"` → `cfg run diff: 0 changed`; сейвы — откат к точке; `reg-snap.sh restore` | control | pass 2026-10-18 06:56 · `isGodMode False -> False`; `h.sh "kill"` → `cfg run diff: 0 changed`; журнал — `_harness/log_batch9.log`; сейвы — откат к точке (8 из 8); `reg-snap.sh restore`; замок FREE |
