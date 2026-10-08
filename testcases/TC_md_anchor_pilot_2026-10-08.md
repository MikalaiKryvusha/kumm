# TC — Medieval Dynasty: пилот по якорям, первая половина маршрута «загрузить сейв по имени» (план 17, шаги 17.2–17.3)

> **Создан:** 2026-10-08 · **Основа:** `plans/17_md_anchor_pilot.md` (критерий 1 «Load by name without focus»); мод
> `KrinikPilot` v1, стенд `MedievalDynasty/tools/test-pilot.lua` (ALL OK, мутант «не выбирает строку» краснеет).

## Измерения

- Журнал `pilot-out.txt`: каждый шаг маршрута — ок / СТОП с причиной, время.
- Снимок экрана после маршрута: какое окно меню открыто.
- Не покрыто: вторая половина (Соло/Кооператив → «Начать игру») — якорь панели ещё не найден; фиксированная копия сейва.

## Кейсы

| # | Шаг | Ожидание | Статус | Наблюдение |
|---|-----|----------|--------|------------|
| A1 | Игра в главном меню (запуск без загрузки), пилот загружен | `pilot-out.txt`: «KrinikPilot v1 загружен» | pass | 10:42:38 и 10:44:15 «KrinikPilot v1 загружен» |
| A2 | Маршрут `call UI_MainMenu_C Load` · `wait UI_LoadMenu_C` · `sleep 1500` · `pickslot Autosave2_Ox` · `call UI_LoadMenu_C ConfirmSelection` — окно игры НЕ выводится вперёд | журнал: 5 шагов ок, «маршрут пройден»; на снимке — окно «Соло / Кооператив» | pass (со 2-й попытки) | 10:42:52 pickslot упал: FindFirstOf дал пустой экземпляр меню (SB_SaveSlots nullptr) → починено (выбор среди FindAllOf + шаг confirmslot), стенд воспроизводит; 10:44:43 все 5 шагов ок, «строка 2 из 24», на снимке — «Соло / Кооператив». 10:45:34 ConfirmAction у UI_NetworkModeSelectingMenu_C → экран «Оксбоу (Соло) / Начать игру» (снимок); последний якорь не найден: UI_MapChoosingMenu_C не живёт, у UI_SessionCodeNewGame_C нет ConfirmAction, usefn LoadSaveGame у меню загрузки (10:48:43) — без эффекта, мир не загружен |
| A3 | Контроль: `pickslot Nope_Ox` | СТОП со списком имён сейвов из меню | skipped (покрыт стендом P2) | живьём не гоняли — время автономного часа |
| A4 | Полный маршрут якорями: … `confirmslot` · `call UI_NetworkModeSelectingMenu_C ConfirmAction` · `sleep 1500` · `callin UI_NetworkModeSelectingMenu_C UI_NewGameConfigurationMenu_C ConfirmAction`; снимок сейвов до, `route-close` после | мост `where` даёт координаты (мир загружен) без единой клавиши и клика; сейвы после = снимок | pass | 12:23:41 «шаг 9 ок: callin … UI_NewGameConfigurationMenu_C_2147481686», мир через 38 с от запуска (мост 20362 50375 4449), feed, route-close: 50 из 50 = снимок; затем tools/route-pilot-load.ps1 одной командой 12:24:41 — мир 29.4 с, 12:33:17 — 31.9 с |
