# Test run report — Medieval Dynasty: пилот по якорям, маршрут «загрузить сейв по имени» (план 17, шаги 17.2–17.3)

**Created:** 2026-10-08 10:51 +03:00 · **Run by:** агент (Claude Opus 5.5), автономный час · **Version/build:** Medieval
Dynasty 2.7.0.3, UE4SS 1161; пак `MedievalDynasty`: `KrinikPilot` v1 (`wait`/`call`/`set`/`pickslot`/`confirmslot`/`usefn`/`sleep`),
`KrinikBridge` v10

## 1. Work

Может ли агент пройти путь «главное меню → сейв по имени → мир» вызовами виджетов игры, без клавиш и кликов (`[OWNER]`
«быструю автоматизацию, ала селением по якорям»). Основа — `plans/17_md_anchor_pilot.md` (критерий 1); кейсы
`testcases/TC_md_anchor_pilot_2026-10-08.md` (A1–A3).

## 2. Contour

Машина владельца, его игра; маршрут выбирает его сейв `Autosave2_Ox` (09:46) — только чтение сейва, загрузка до мира не
дошла. Окно игры в прогонах было впереди (игра только что запущена) — пилот не шлёт клавиш и кликов, но работа при окне
игры ЗА другим окном не проверена. REAL WORLD: сейвы владельца не писались (до мира не дошли).

## 3. Runs

Окно прогонов: 2026-10-08 10:41 – 2026-10-08 10:51 +03:00 (время в таблице — того же дня).

| # | Время | Команда | Что прочитано |
|---|---|---|---|
| 1 | ≈10:41 | `lua tools/test-pilot.lua _unpacked/KrinikPilot/Scripts/main.lua`; `MUTANT=1` | ALL OK (после правки — с фикстурой «пустой экземпляр меню»); мутант «не выбирает строку» — 1 FAILED |
| 2 | 10:42:50 | `pilot.txt`: `call UI_MainMenu_C Load` · `wait UI_LoadMenu_C 10` · `sleep 1500` · `pickslot Autosave2_Ox` · `call UI_LoadMenu_C ConfirmSelection` | шаги 1–3 ок; шаг 4 — сбой «UObject instance is nullptr» (`FindFirstOf` дал пустой экземпляр меню); снимок — открыт список сейвов |
| 3 | 10:44:41 | тот же маршрут с `confirmslot` (меню — среди `FindAllOf`, у которого список заполнен) | 5/5 ок, «строка 2 из 24»; снимок — «Соло / Кооператив» |
| 4 | 10:45:34 | `wait UI_NetworkModeSelectingMenu_C 5` · `call … ConfirmAction` · `wait UI_MapChoosingMenu_C 10` · … | шаги 1–2 ок → снимок «Оксбоу (Соло) / Начать игру»; шаг 3 СТОП «не дождался UI_MapChoosingMenu_C» |
| 5 | 10:47:02 | `wait UI_SessionCodeNewGame_C 3` · `call UI_SessionCodeNewGame_C ConfirmAction` | класс жив; у него нет `ConfirmAction` (СТОП) |
| 6 | 10:48:38 | полный маршрут из 9 шагов, последний `usefn LoadSaveGame` (`UseFunction` у меню загрузки) | 9/9 «ок», но мир не загрузился (мост: «героя нет»), снимок — «Начать игру» |
| 7 | ≈10:50 | `CloseMainWindow` | процессов 0 |

## 4. Checks

Hygiene: стенд `tools/test-pilot.lua` ALL OK, мутант краснеет.
Functional run: игра владельца, маршрут через `pilot.txt`, прочитаны `pilot-out.txt`, мост `where`, снимки экрана после
каждого маршрута.

- A1 pass — пилот загружается.
- A2 pass (со 2-й попытки) — меню → список → строка по имени → «Соло / Кооператив» → «Начать игру» без клавиш и кликов;
  последний шаг («Начать игру» → мир) не найден.
- A3 skipped — покрыт стендом (P2).

## 5. Found

- **Якорями проходится 8 шагов из 9:** `UI_MainMenu_C:Load` → `UI_LoadMenu_C` (`SelectedSaveSlot` + `ConfirmSelection`) →
  `UI_NetworkModeSelectingMenu_C:ConfirmAction` → экран «Начать игру».
- **`FindFirstOf` даёт не тот экземпляр меню** (живых `UI_LoadMenu_C` 4, у первого `SB_SaveSlots` пустой) — рабочий
  выбирается по заполненному списку. Тот же риск у любого `call`: нужен выбор экземпляра по признаку, а не первого.
- **Якорь «Начать игру» не найден:** `UI_MapChoosingMenu_C` не живёт, `UI_SessionCodeNewGame_C` без `ConfirmAction`,
  `UseFunction("LoadSaveGame")` у меню загрузки — без эффекта. Следующий шаг: найти виджет кнопки по `ButtonFunction`
  (строка) у живых кнопок меню и её `ParentPanel`.

## 6. Traces

`D:\Games\Medieval Dynasty (2021)\Medieval Dynasty\Medieval_Dynasty\Binaries\Win64\ue4ss\Mods\KrinikPilot\pilot-out.txt`
(10:42–10:48); снимки экрана — в рабочей папке сессии (не сохранялись в репозиторий); код —
`MedievalDynasty/_unpacked/KrinikPilot/Scripts/main.lua`, стенд `MedievalDynasty/tools/test-pilot.lua`.

## 7. Verdict

partial — путь по якорям доказан до экрана «Начать игру» (8 из 9 шагов, без клавиш и кликов); последний шаг и работа при
окне игры за другим окном — не проверены.
