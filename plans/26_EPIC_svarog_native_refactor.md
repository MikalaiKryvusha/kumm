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

## Порядок работы

Мод за модом, сверху списка фазы 2: правка → сборка → один чистый запуск → кейсы этого мода → `modcost` → итог. Горячая выкладка — только
`KrinikUIRework` (из `scripts`, не больше двух подряд); остальные — из `plugins`, чистым запуском. Перед правкой кода — разведка (хук
`arch-gate`), `plans/24` — какие места дороже всего. После каждого мода — коммит SvarogsDream и строка в этом плане.

## Решения без владельца

`[AI]` Порядок фаз (база → фундамент → файлы → регресс) и состав фундамента — по разведке; меняется словом владельца.
