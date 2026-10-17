# Эпик 26 — переписать все моды Сварога как продолжение игры: быстрее, а работает всё как работало

> **Created:** 2026-10-14 · по слову владельца: `[OWNER]` «нужно будет начать с того, что перепишем и отрефакторим все наши моды по этим
> гайдлайнам.. И протестируем, что ничего не сломали, и что все как работало, так и работает, и столо только быстрее» · «Запиши открытый
> чек лист по всему, что нужно будет переписать и протестировать» · «и с этого начинаем в новом чате» · 2026-10-14
> **Parent:** правило `MASTER_PLAN.md` «Моды — продолжение игры, а не костыли»; разведка `researches/svarog-native-mod-architecture/README.md`
> (правила §5, аудит §7); бюджет `plans/24_svarog_cpu_budget_1ms.md`
> **Status:** 🔲 открыт 2026-10-14 вечером; начать в новом чате (STATUS, пункт 0)
> **Outbound:** —

## Цель и приёмка

**Цель (Achieve):** все моды Сварога (`SvarogsDream/src`: KrinikUIRework, KrinikCameraRework, KrinikColorRework, KrinikFixes, KrinikModMenu,
Shared) переписаны по правилам §5 разведки — доступ через `WorldState.Instance.worldStateInjector`, реестры, события вместо опроса, один тик
на мод, ноль выделений памяти в кадре, медленные места игры переписаны. **Поведение то же (Maintain), скорость выше.**

Приёмка — три числа и регресс:

1. **Перепись:** `node SvarogsDream/tools/refactor_inventory.mjs` — поиски по сцене в кадре **0** (было 25), LINQ в кадре **0** (было 44),
   `ForceRebuildLayoutImmediate` — только там, где без второго прохода никак, с причиной в комментарии (было 13); `node
   SvarogsDream/tools/scene_search_census.mjs` — в покадровых методах **0**.
2. **Скорость:** пульт `modcost` на тех же сценах «до» и «после» (фаза 0) — каждая сцена не дороже, кадры геймплея ≤ 1 мс на все моды.
3. **Регресс:** каждая функция модов из списка фазы 3 — кадр «после» совпадает по смыслу с кадром «до» (то же окно, те же подписи, тот же
   вид); расхождение — дефект или осознанная правка с записью.

## Фаза 0 — база «до» (до первой правки)

- [ ] Точка сейва: копия `LocalLow/VI Games/Svarog's Dream` → `_backups/svarog-saves-<дата>_<время>-before-refactor` + `save-check.sh` 10/10.
- [x] Перепись «до»: `node tools/refactor_inventory.mjs > _harness/refactor_before.txt`, `node tools/scene_search_census.mjs > _harness/census_before.txt`.
      Снята 2026-10-14 21:14: 87 поисков (25 в кадре), LINQ 127 (44 в кадре), перепись поисков — 87 (23 в покадровых методах).
- [ ] Замер «до», чистый запуск: `modcost` у костра, бег по лагерю, бег через границу участков, бой (волки), реплики жителей в городе,
      открытие окон (сумка, персонаж, карта, письмо, настройки модов F8) — числа в отчёт `testcases/reports/<дата>_svarog-refactor-baseline.md`.
- [ ] Кадры «до» — каждой функции из фазы 3 (тем же пультом, теми же координатами) → `SvarogsDream/_harness/refactor_before/`.
- [~] Тест-кейсы эпика — `testcases/TC_svarog_native_refactor_<дата>.md`: одна строка на функцию фазы 3 + три числа приёмки.
      Пачка 1 — `testcases/TC_svarog_native_refactor_2026-10-14.md` (R1–R13 по тронутым функциям, A1–A4); строки остальных функций
      фазы 3 — с пачкой, которая их тронет.
- [ ] Порядок захода (слово владельца — `[OWNER]` «сразу пиши, а потом запускай и пачкой тестируй, потом фикси пачкой, опять пачкой
      тестируй» · 2026-10-14): база «до» снимается в том же заходе, что и «после» — запуск на нынешних сборках → кейсы и `modcost` →
      выкладка пачки → те же кейсы.

## Фаза 1 — общий фундамент (Shared), до правок модов

- [~] `Shared/GameRefs` — ссылки на менеджеры игры из `worldStateInjector` и на объекты интерфейса, взятые один раз при загрузке сцены
      (2026-10-14: корень UI один раз на сцену + `UiFind(путь)` через `Transform.Find`; `Injector`, `WorldTime`; собрано, не прогнано)
      (постфикс на создание), сброс при смене сцены.
- [~] `Shared/Registry<T>` — реестр своих компонентов: запись в `OnEnable`, вычёркивание в `OnDisable`.
      (2026-10-14: реестр объектов игры — постфикс на их `Start`/`Awake` + один `Seed` при загрузке мода, мёртвые выбрасываются при
      чтении; `KrinikUIRework/GameHooks.cs`: MiniMap, UserInterface, CharacterSelectionManager; свои компоненты — ещё нет)
- [ ] Один тик на мод: диспетчер подсистем с флагом «грязно» — работа только у изменившихся.
- [ ] События окон: постфикс на `popUpSpawner` и `*Enabler` (показ / скрытие окна) — подписка вместо опроса.
- [~] Событие смены участка — одно на все моды (сейчас перепись материалов шесть раз).
      (2026-10-14: `KrinikColorRework/TerrainWatch.cs` — один ключ участков и один перебор материалов на смену участков для пяти
      компонентов мода цвета; мод камеры (`ScanGrassMaterials`) — свой перебор, сборки разные; `Shared/DeadKeys.cs` — чистка мёртвых
      ключей без LINQ в семи местах)
- [ ] Доступ к закрытым полям — делегаты `AccessTools.FieldRefAccess`, созданные один раз (вместо `GetValue`).
- [x] Прибор: `refactor_inventory.mjs` — в проверку сборки (предупреждение, если в кадре появился поиск или LINQ).

## Фаза 2 — правки по файлам (вывод `node SvarogsDream/tools/refactor_inventory.mjs --md`, 2026-10-14)

Сверху — тяжелее: поиски по сцене в кадре, много покадровых методов, принудительная перестройка. Каждая строка закрывается правкой по
правилам §5 и строкой регресса в фазе 3.

- [~] `KrinikUIRework/LootLook.cs` — поиски по сцене в кадре 3 · покадровые: LootLookTick
- [~] `KrinikUIRework/WorldClock.cs` — поиски по сцене в кадре 2 · поиски вне кадра 1 · покадровые: WorldClockTick, CompassTick · ForceRebuild 1
- [~] `KrinikUIRework/HeroCard.cs` — поиски по сцене в кадре 2 · поиски вне кадра 5 · покадровые: LateUpdate, Update
- [~] `KrinikUIRework/Purse.cs` — поиски по сцене в кадре 2 · покадровые: PurseKickTick, LateUpdate
- [ ] `KrinikUIRework/Fonts.cs` — поиски по сцене в кадре 2 · поиски вне кадра 5 · покадровые: FontsTick · LINQ 1
- [~] `KrinikUIRework/HeroPortraits.cs` — поиски по сцене в кадре 2 · поиски вне кадра 1 · покадровые: HeroPortraitsTick · GetValue 4
- [~] `KrinikUIRework/MiniMapLight.cs` — поиски по сцене в кадре 2 · покадровые: MiniMapLightTick
- [~] `KrinikCameraRework/Plugin.cs` — поиски по сцене в кадре 1 · поиски вне кадра 12 · покадровые: Update, WakeTick · LINQ в кадре 8
- [~] `KrinikColorRework/BillboardFog.cs` — поиски по сцене в кадре 1 · покадровые: Update · LINQ в кадре 2
- [~] `KrinikUIRework/EquipPlaceholders.cs` — поиски по сцене в кадре 1 · покадровые: EquipPlaceholdersTick
- [~] `KrinikColorRework/FoliageCoverage.cs` — поиски по сцене в кадре 1 · покадровые: Update · LINQ в кадре 2
- [~] `KrinikColorRework/GrassCoverage.cs` — поиски по сцене в кадре 1 · покадровые: Update · LINQ в кадре 4
- [ ] `KrinikColorRework/MapPalette.cs` — поиски по сцене в кадре 1 · покадровые: Update · LINQ в кадре 1
- [~] `KrinikUIRework/MiniMapArrow.cs` — поиски по сцене в кадре 1 · покадровые: MiniMapArrowTick
- [~] `KrinikColorRework/NightParticles.cs` — поиски по сцене в кадре 1 · покадровые: Update · LINQ в кадре 3
- [~] `KrinikColorRework/RoofFog.cs` — поиски по сцене в кадре 1 · покадровые: Update · LINQ в кадре 8
- [~] `KrinikColorRework/WaterReflection.cs` — поиски по сцене в кадре 1 · покадровые: Update · LINQ в кадре 4
- [ ] `KrinikUIRework/DeathScreen.cs` — поиски вне кадра 1 · покадровые: LateUpdate · ForceRebuild 2
- [ ] `KrinikUIRework/SpellPicker.cs` — поиски вне кадра 1 · покадровые: Update · ForceRebuild 2
- [~] `KrinikUIRework/BubbleBox.cs` — поиски вне кадра 3 · покадровые: LateUpdate · ForceRebuild 1
- [ ] `KrinikUIRework/HeroSelect.cs` — поиски вне кадра 2 · ForceRebuild 2
- [ ] `KrinikUIRework/Icons.cs` — покадровые: IconStatsTick, IconTick
- [ ] `KrinikUIRework/ItemWindow.cs` — поиски вне кадра 1 · покадровые: LateUpdate · ForceRebuild 1
- [ ] `KrinikColorRework/Plugin.cs` — покадровые: Update, LateUpdate
- [ ] `KrinikUIRework/Plugin.cs` — поиски вне кадра 2 · покадровые: Update, LateUpdate
- [ ] `KrinikUIRework/Quests.cs` — ForceRebuild 2
- [ ] `KrinikUIRework/TooltipFit.cs` — покадровые: LateUpdate · ForceRebuild 1
- [ ] `KrinikUIRework/BuffTipColors.cs` — покадровые: LateUpdate
- [ ] `KrinikUIRework/CardTips.cs` — поиски вне кадра 1 · ForceRebuild 1 · LINQ 2
- [ ] `KrinikUIRework/CharacterCards.cs` — покадровые: LateUpdate
- [ ] `KrinikUIRework/DevotionCards.cs` — покадровые: LateUpdate · GetValue 1
- [ ] `KrinikUIRework/Dialogue.cs` — поиски вне кадра 2 · покадровые: LateUpdate · GetValue 1
- [~] `KrinikColorRework/FarGrassMap.cs` — покадровые: Update · LINQ в кадре 6
- [ ] `KrinikColorRework/FoliageGlare.cs` — покадровые: Update
- [ ] `KrinikUIRework/HudRow.cs` — покадровые: LateUpdate
- [~] `KrinikUIRework/IconClick.cs` — покадровые: IconHoverTick · LINQ 2
- [ ] `KrinikUIRework/InventoryHelp.cs` — покадровые: LateUpdate
- [ ] `KrinikUIRework/Letters.cs` — поиски вне кадра 1 · покадровые: LateUpdate · LINQ 1
- [ ] `KrinikUIRework/MapLayout.cs` — покадровые: LateUpdate · LINQ 12
- [ ] `KrinikUIRework/MasteryCards.cs` — покадровые: LateUpdate
- [ ] `KrinikColorRework/MatteTerrain.cs` — покадровые: Update · LINQ в кадре 2
- [ ] `KrinikUIRework/MobBars.cs` — поиски вне кадра 1 · покадровые: LateUpdate
- [ ] `KrinikUIRework/Pages.cs` — поиски вне кадра 2 · покадровые: LateUpdate
- [ ] `KrinikFixes/Plugin.cs` — покадровые: Update
- [ ] `KrinikModMenu/Plugin.cs` — поиски вне кадра 2 · покадровые: Update · GetValue 4 · LINQ 4
- [ ] `KrinikUIRework/PopupLook.cs` — покадровые: LateUpdate
- [ ] `KrinikUIRework/ProgressLayout.cs` — поиски вне кадра 1 · покадровые: LateUpdate
- [ ] `KrinikUIRework/SettingsLayout.cs` — поиски вне кадра 4 · покадровые: SettingsLayoutTick · LINQ 22
- [ ] `KrinikColorRework/Sky.cs` — покадровые: LateUpdate · GetValue 1
- [ ] `KrinikUIRework/StatsLayout.cs` — поиски вне кадра 1 · покадровые: LateUpdate
- [ ] `KrinikUIRework/SunMirror.cs` — поиски вне кадра 5 · покадровые: OnGUI
- [ ] `KrinikColorRework/WaterProbe.cs` — покадровые: Update · LINQ в кадре 4
- [ ] `KrinikColorRework/WaterSurface.cs` — покадровые: Update
- [ ] `KrinikUIRework/BigButtons.cs` — поиски вне кадра 1
- [ ] `KrinikUIRework/CombatText.cs` — GetValue 1 · LINQ 2
- [ ] `KrinikUIRework/Hud.cs` — поиски вне кадра 2
- [ ] `KrinikUIRework/InventoryX2.cs` — поиски вне кадра 1
- [ ] `KrinikUIRework/LoadingTips.cs` — LINQ 1
- [ ] `KrinikUIRework/MenuFonts.cs` — поиски вне кадра 2
- [ ] `KrinikFixes/Perf.cs` — поиски вне кадра 1
- [ ] `KrinikUIRework/Popups.cs` — GetValue 1
- [ ] `KrinikUIRework/QuestionTips.cs` — поиски вне кадра 1
- [ ] `KrinikColorRework/ShaderBundle.cs` — LINQ 2
- [ ] `KrinikUIRework/Tables.cs` — LINQ 16
- [ ] `KrinikColorRework/WaterSSPR.cs` — GetValue 1
**Итого (2026-10-14):** файлов 65 · поисков по сцене 87 (в кадре 25) · покадровых методов 57 · ForceRebuild 13 · GetValue 14 · LINQ 127 (в кадре 44).

## Фаза 3 — регресс: всё, что умеют моды, работает как работало

Основа — 98 файлов `testcases/TC_svarog_*.md` (кейсы прошлых прогонов). Для каждой функции — кадр «до» (фаза 0) и «после», тот же путь
пульта. Перечень функций собрать в начале фазы 0 из шапок файлов модов (`grep -h "^// " src/*/*.cs` — первая строка каждого файла), группами:

- [ ] **Интерфейс (KrinikUIRework):** сумка и справка «?», персонаж и карточки, сравнение и окно предмета, письма и «Вести мира», разговор,
      советы загрузки, плашки повышения, полосы врагов, значки в мире и наведение, компас и часы, мини-карта, кошелёк, квесты, смерть,
      выбор героя, заклинания, настройки, пузыри реплик, шрифты.
- [ ] **Камера (KrinikCameraRework):** отдаление и наклон, камера над землёй и в утёсах, сцена форм утёсов, высота травы после подгрузки.
- [ ] **Цвет (KrinikColorRework):** день/ночь, небо, дымка крыш, вода (SSPR), матовая земля, трава вдали.
- [ ] **Исправления (KrinikFixes):** прыжок и урон от падения, броня 8+, маска-клад и прочие ошибки автора.
- [ ] **Меню модов (KrinikModMenu):** окно F8, тема, перевод окна.
- [ ] Все три числа приёмки «после» — в отчёт `testcases/reports/<дата>_svarog-refactor-after.md` рядом с «до».

## Пачки

**Пачка 1** (2026-10-14 вечер; SvarogsDream `ac38323`…`b614f80`; вычитана агентом-скептиком, прогнана «до/после» —
`testcases/reports/2026-10-14_svarog-refactor-batch1.md`, вердикт partial; выложена в игру 21:52 — было «не выложена»): фундамент `GameRefs`/`Registry`/`DeadKeys`,
`TerrainWatch` мода цвета, поиски по сцене в тиках интерфейса, перепись материалов крыш и листвы, пузырь (строки имени шейдера и Traverse),
наведение на значок (матрица кадра), `WaterSSPR` (делегат поля), меню модов, храповик. Кейсы — `testcases/TC_svarog_native_refactor_2026-10-14.md`.

**Пачка 2** (2026-10-14 22:36–22:52; SvarogsDream `b7f5d69`, `e7c63a6`, `978953a`; три чистых запуска, отчёт
`testcases/reports/2026-10-14_svarog-refactor-batch2.md`, вердикт partial; выложена в игру — UIRework, ColorRework с шейдерами, CameraRework):

- [x] Высота травы на новом участке — была присвоением `detailPrototypes` (9,7–25,2 мс на участок, вся цена — `RefreshPrototypes`). Стало:
      мод камеры ставит глобальное `_KrinikGrassHeightCut`, мод цвета (`GrassGround.cs`) копирует карты высот участков в массив текстур на
      видеокарте, шейдеры травы сжимают траву стоя и модели к земле, траву к камере — по `tangent.y`. Костёр 26 → 0,97 мс, бег 10,9 → 0,75 мс
      худшего кадра. `FORK:` варианты < бандл игры 550 МБ | видеокарта с картами высот | присвоение по участку за кадр > · цена ошибки —
      сломать загрузку мира / трава висит или утоплена / бюджет · сверился — исходник `TerrainEngine.cginc` 2020.3 и правило владельца о GPU
      (`MASTER_PLAN.md`). Связка «камера пересоздаёт траву → мод цвета перебирает память» ушла сама (1 строка за заход вместо 17–24).
- [~] Пузырь реплики — разобран: первая фраза после переноса 10,5 мс, цена поровну по всем частям (журнал строения 1,6 · плашка 2,1 · свой
      текст TMP 1,5 · раскладка 1,7 · подгонка 3,6), атлас шрифта ни при чём (глифов +0); вторая подгонка в постфиксе убрана. Сделано и
      выложено (`274648d`): запас 24 плашек при загрузке сцены, строка строения — у первых двух; цену первой фразы это НЕ сняло (прогрев
      компиляцией — тоже, убран): дорог МОМЕНТ сразу после переноса (EXP-0276), обычный первый показ — 2,15 мс (переподвешивание плашки 1,3).
      **Дальше:** чем занят кадр после переноса; почему `SetParent` плашки к холсту пузыря стоит 1,3 мс; вид плашки из запаса — глазом (B6).
- [ ] `ScanGrassMaterials` мода камеры — свой перебор материалов на смену участков (вторая сборка, общий снимок мода цвета ей не виден).
- [ ] `PropAnimators` (`KrinikFixes/Perf.cs`) — перебор аниматоров раз в 10 с; настройка выключена по умолчанию.
- [ ] Окна (вне бюджета, лаг при открытии допустим): письма `KrinikLetter` 2 с полного прохода, `Fonts.FontsTick` в меню — событием,
      `ForceRebuildLayoutImmediate` (13 мест) — где можно, `MarkLayoutForRebuild`.

**Пачка 3** (2026-10-15 21:00–21:34; SvarogsDream `1050849`, `44800c5`, `444138f`, `2c03461`; отчёт `testcases/reports/2026-10-15_svarog-batch3-smallbugs.md`,
вердикт partial):

- [x] `ScanGrassMaterials` — снимок материалов у `TerrainWatch` мода цвета (делегат один раз), известные без `_ScaleFade` не проверяются:
      0,62 / 0,04 мс на смену участков вместо ~2 (первый проход после загрузки — 2,5 мс).
- [~] Пузырь — журнал `bubble #N` на каждую реплику: дорог момент 0,3–1 с после переноса (10,5–16,6 мс), обычные 0,4–1,4 мс; вторая группа
      2,5–3,8 мс без переноса. Правки нет.
- [x] Патчи Harmony по одному классу во всех модах (`Shared/PatchEach.cs`, EXP-0278).
- [ ] Окна — не тронуты.

## Порядок работы

Мод за модом, сверху списка фазы 2: правка → сборка → один чистый запуск → кейсы этого мода → `modcost` → итог. Горячая выкладка — только
`KrinikUIRework` (из `scripts`, не больше двух подряд); остальные — из `plugins`, чистым запуском. Перед правкой кода — разведка (хук
`arch-gate`), `plans/24` — какие места дороже всего. После каждого мода — коммит SvarogsDream и строка в этом плане.

## Решения без владельца

`[AI]` Порядок фаз (база → фундамент → файлы → регресс) и состав фундамента — по разведке; меняется словом владельца.

## Ход 2026-10-16 (пачка 4, отчёт `testcases/reports/2026-10-16_svarog-batch4-walls-hotbar-savecard-linq.md`)

- [x] LINQ в покадровых методах мода цвета — **26 → 0** по переписи (`a61b62c`): `Shared/CsvList.cs` (список настройки и маска слоёв —
      один разбор на значение), `DeadKeys` в WaterReflection и MatteTerrain, циклы вместо Any/Where/Select/OrderBy в RoofFog, WaterProbe,
      BillboardFog, NightParticles, MapPalette, FarGrassMap. Регресс L1–L3 pass (те же строки журнала, что до правки).
- [ ] Поиски по сцене «в кадре» — 7 по переписи, все разовые (первая попытка, запасной путь после `Shader.Find`, выгрузка мода, меню до мира
      у `Fonts.FontsTick`); прибор засчитывает их по соседству с `Update`. `[AI]` оставлены как объяснённые исключения.
- [~] **Перепись материалов на смене участка — проходом по кадрам с бюджетом (time-slicing).** 2026-10-16 сделано у RoofFog (`86c3c12`, 1,41 → 0,87 мс), NightParticles (`a146e16`, 1,61 → 0,95), FoliageCoverage (`743d17f`, 1,47 → 0,88) — кейсы L8–L10; GrassCoverage (L11, 1,22 → 0,68); осталось: BillboardFog (≈1,0–1,2), MatteTerrain (1,9–2,5 — цикл по участкам: смотреть, что дорого) и **сам перебор памяти снимка** `FindObjectsOfTypeAll<Material>` — до 3,8 мс кадра у того, кто спросил первым (L11): брать материалы подгруженного участка из его рендереров, без перебора всей памяти. Замер 2026-10-16 09:48 (перенос в Град,
      мир устоялся): GrassCoverage 1,43 мс, RoofFog 1,41, FoliageCoverage 1,26, BillboardFog 1,07, NightParticles 0,81 — каждая выше или
      около 1 мс в одном кадре. Гипотеза «пять переборов памяти» опровергнута (объявление участков после успокоения — выигрыша нет, откатано):
      дорог сам цикл компонента по тысячам материалов. Шаг: курсор по снимку `TerrainWatch.Materials`, N материалов за кадр до 0,2 мс.
      **Поправка 2026-10-17:** «перебор памяти снимка — до 3,8 мс» — неверно: замер `MaterialScanProbe` (TC
      `testcases/TC_svarog_terrainwatch_scan_2026-10-17.md` M1–M2) — 0,4–1,0 мс на 3200–4000 материалах, и при подгрузке тоже; «из рендереров
      участка» невозможно — картинки деревьев и трава участков `HideAndDontSave`, их видит только перебор всей памяти. 3,835 мс RoofFog в L11 —
      настоящий замер, но не перебора; что ещё было в том кадре — не найдено.

## Ход 2026-10-17 (отчёт `testcases/reports/2026-10-17_svarog-terrainwatch-framebudget.md`)

- [x] **Один бюджет кадра на всю порционную работу мода цвета** (`Shared/FrameBudget.cs`, 0,3 мс; SvarogsDream `cefd82c`): снимок
      `TerrainWatch.Fresh` списывает своё время, проходы RoofFog, NightParticles, FoliageCoverage, GrassCoverage, а теперь и BillboardFog
      (был целиком) и MatteTerrain (участок за участком) — из того же бюджета. 400 м пешком через границы участков (пульт `walk`), худший кадр:
      MatteTerrain 2,48 → 0,53 мс, BillboardFog 1,10 → 0,64, FoliageCoverage 0,88 → 0,56, GrassCoverage 0,80 → 0,51, NightParticles 0,88 →
      0,77. Остаток — сам перебор памяти (0,5–1,0 мс) в кадре снимка у первого спросившего.
- [x] Мод камеры на ходу (SvarogsDream `927be3d`): проход по траве `ScanGrassMaterials` порциями из бюджета кадра, дальности участков пишутся
      только при отличии — `Plugin.Update` 4,87 → 1,32 мс худшего кадра (кейсы K1–K2).
- [x] Боевые надписи (SvarogsDream `fc31b6f`): буквы и переводчик — при загрузке сцены, не в первом бою — `PatchCombatTextRussian.Prefix`
      6,3–7,7 → 0,38 мс худшего кадра (кейс B3).
- [x] Жители (SvarogsDream `240fd71`): кости, сон, прятанье и пробуждение — из бюджета кадра мода камеры — `PatchCharacterDraw.Postfix`
      1,3–1,8 → 0,61 мс (P1); размер боевых надписей — один раз на спавнер (P2 — в бою не наблюдался).
- [x] **Один бюджет кадра на все моды** (SvarogsDream `3f7a30c`): ячейка `Shared/FrameBudget` в данных домена приложения (было — своя у
      каждой сборки); из неё — новый значок под службу, запись дальностей в новый участок и запрос снимка травы (камера), новая работа мода
      цвета на смене участков; `TerrainWatch.Fresh` — один на кадр. Худший кадр всех модов на ходу: 2,50 → 1,83 (G3), 2,04 / 1,40 (G4, два
      прогона); значок растения 1,03 → 0,34 мс. Пол — сам перебор памяти (0,5–1,0 мс) в кадре снимка у первого спросившего.
- [x] Полосы мобов (SvarogsDream `2b49b05`): новая полоса и её первый кадр — из общего бюджета; ниже 0,33 мс, худший кадр всех модов на
      ходу 1,61 мс (H1–H2).
- [x] Фон жителей (SvarogsDream `5f59850`): решение «прятать/показывать/усыпить» раз в 4 кадра вразбивку — `PatchCharacterDraw` 0,099 →
      0,066 мс/кадр, средний расход всех модов 0,569 → 0,551 (F1).
- [ ] Дальше: `PatchCombatTextDamage` — проверить в бою; фон `Sky.LateUpdate` 0,05 мс/кадр (небо пересчитывается каждый кадр — вид, звёзды по
      реальному времени: трогать только с замером кадров); перебор памяти снимка — единственный путь к спрятанным материалам травы и картинок
      деревьев (`HideAndDontSave`), искать событие их создания в Unity не нашлось.
- Выкладка для чистого запуска — `SvarogsDream/tools/deploy-cold.sh <Мод>…` (пара `.dll` + `.pdb`, EXP-0288).
