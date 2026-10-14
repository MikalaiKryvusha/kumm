# Разведка — моды Сварога как продолжение игры: Unity, устройство игры, приёмы программирования

> **Created:** 2026-10-14 · по слову владельца: `[OWNER]` «нужно наши моды писать как продолжение игры, расширяющее её нативный код, а не
> как костыли. Можно свои новые структуры данных заводить. улучшать и переписывать старые - все во благо оптимизации и эффективности
> алгоритмов!!!!» · «разведка на этому тему!» · «и записать ресерч док! применительно к юнити, к нашей игре и как она устроена, и к лучшим
> практикам программирования» · 2026-10-14 ≈21:00
> **Parent:** `plans/24_svarog_cpu_budget_1ms.md` (бюджет 1 мс); правило — `MASTER_PLAN.md`, «Моды — продолжение игры, а не костыли»
> **Status:** 🔧 разведка 2026-10-14 вечером (веб + декомпиляция игры + перепись наших модов); правила ниже — `[AI]`, ждут слова владельца
> **Outbound:** правила — в план 24 и в рулбук модов после «да» владельца

## 1. Что не так сейчас

Наши моды узнают о мире игры опросом: каждый кадр ищут объекты по сцене, перебирают окна и пересчитывают то, что не менялось. Числа
плана 24 и переписи `node SvarogsDream/tools/scene_search_census.mjs` (2026-10-14):

- **87 поисков по сцене** в модах (`FindObjectsOfTypeAll`, `FindObjectsOfType`, `FindObjectOfType`, `GameObject.Find`), **23 — в покадровых
  методах** (`Update`, `LateUpdate`, `*Tick`): `MiniMapLightTick`, `WorldClockTick`, `CompassTick`, `PurseKickTick` и другие.
- Пузырь реплики: `PatchYellBubble.Postfix` — 11–12 мс за вызов, `KrinikBubbleFit.LateUpdate` — до 11 мс.
- Окно писем: `KrinikLetter.LateUpdate` 2 с после показа делает полный проход каждый кадр.
- `IconHoverTick` — до 0,45 мс на бегу: перебор значков у курсора и поиск хозяина значка.
- `PurseKickTick` после горячей выкладки — 10 вызовов `FindObjectOfType<UserInterface>()` по 55–65 мс.

## 2. Unity: как правильно (источники)

- **Поиск по сцене — не в кадре.** Документация Unity: `FindObjectsOfType` «очень медленный», вызывать его каждый кадр не рекомендуется;
  вместо него — одиночка (singleton) или ссылка, сохранённая заранее ([Unity: FindObjectsOfType](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/object/findobjectsoftype)).
  Реальный случай: `LateUpdate` с `FindObjectsByType<TMP_InputField>` каждый кадр давал недопустимое время кадра на больших сценах,
  лечение — убрать поиск из кадра ([форум realvirtual](https://forum.realvirtual.io/communities/1/topics/923-scenemousenavigationlateupdate-uses-findobjectsbytypetmp-inputfield-every-frame-catastrophic-global)).
- **Реестр вместо поиска.** Компонент сам вписывает себя в статический список в `OnEnable` и вычёркивает в `OnDisable`; кто ищет — читает
  список. Ни одного прохода по сцене, а выключенные объекты учитываются сами. (`[AI]` общая практика Unity; поиск прямого источника не дал.)
- **Ссылки — один раз.** `GetComponent`, `GameObject.Find`, `Camera.main` — в `Awake`/`Start`, результат хранить в поле
  ([GameDev.net: How We Optimised Our Scripts](https://gamedev.net/tutorials/programming/general-and-gameplay-programming/how-we-optimised-our-scripts-in-unity-r5167);
  [старое руководство Unity по скриптам](https://docs.unity3d.com/jp/460/Manual/MobileOptimizationPracticalScriptingOptimizations.html)).
- **Без выделения памяти в кадре.** Никаких `new`, массивов из `Find…`, склейки строк в `Update`; строки — через `StringBuilder` или кеш;
  цель — ноль в колонке «GC Alloc» профайлера во время игры ([GameDev.net](https://gamedev.net/tutorials/programming/general-and-gameplay-programming/how-we-optimised-our-scripts-in-unity-r5167)).
- **Один цикл обновления вместо многих.** Каждый `Update` вызывается из нативного кода движка; при тысячах объектов свой менеджер с массивом
  быстрее: на форуме Unity — 0,3–0,4 мс у менеджера против 4,4–5,2 мс у отдельных `Update` на 10 000 объектов
  ([Unity: 10000 Update() calls](https://unity.com/blog/engine-platform/10000-update-calls);
  [руководство: custom update manager](https://docs.unity.com/en-us/engine/6000.5/manual/scripting/managing-update-order/events-per-frame-optimization.md);
  [форум Unity](https://discussions.unity.com/t/a-lot-of-update-call-performance-test-results-why-unity-not-using-array/1542201)).
- **Интерфейс.** Одно изменённое поле перестраивает весь холст — динамику держать на своих маленьких холстах; `Raycast Target` выключать у
  неинтерактивного ([Unity UI optimization tips](https://unity.com/how-to/unity-ui-optimization-tips)). Раскладку помечать на перестройку
  (`MarkLayoutForRebuild`), а `ForceRebuildLayoutImmediate` — только когда без второго прохода никак
  ([Unity: LayoutRebuilder](https://docs.unity3d.com/Packages/com.unity.ugui@1.0/api/UnityEngine.UI.LayoutRebuilder.html)).

## 3. Моддинг на Harmony: как правильно (источники)

- **Узнавать о событии, а не опрашивать.** Постфикс на метод игры, который событие и делает (начало сессии, показ окна, смена участка), а
  тяжёлое — вне `Update`; повторяющееся — реже и с порогом ([7 Days to Die: Harmony Patch Targets](https://7d2dmodding.wiki.gg/wiki/Harmony_Patch_Targets)).
  Патчи закрыты флагом «вне игры — ничего не делать» ([SpawnTracker](https://www.mintlify.com/AntiParty/SpawnTracker/development/harmony-patches)).
- **Разрешать типы и методы один раз** — в `TargetMethod()` при установке патча, а не при каждом вызове ([SpawnTracker](https://www.mintlify.com/AntiParty/SpawnTracker/development/harmony-patches));
  ставить патчи точечно, а не `PatchAll` по всей сборке ([HarmonyX wiki](https://github.com/BepInEx/HarmonyX/wiki/Patching-with-Harmony)).
- **Закрытые поля — без отражения в кадре.** Публикация сборки (`BepInEx.AssemblyPublicizer`) или делегат доступа, созданный один раз
  (`AccessTools.FieldRefAccess`); `FieldInfo.GetValue` в кадре — поиск и упаковка значения каждый вызов
  ([BSMG: Harmony Patching](https://bsmg.wiki/modding/pc/harmony-patching.html);
  [Microsoft: FieldInfo.GetValue](https://learn.microsoft.com/ko-kr/dotnet/api/system.reflection.fieldinfo.getvalue?view=net-8.0)). (`[AI]` прямого замера
  `FieldRefAccess` поиск не дал.)
- **Горячие места — транспайлером.** Моды RimWorld переводят самые нагруженные патчи на транспайлеры ради меньших накладных расходов и
  «чтобы лучше пользоваться поисками самой игры» ([Toggleable Overlays](https://steamcommunity.com/sharedfiles/filedetails/changelog/2661792499);
  [Underground Power Conduits](https://steamcommunity.com/sharedfiles/filedetails/changelog/2608654598); [RimWorld Wiki: HarmonyTranspiler](https://rimworldwiki.com/wiki/Modding_Tutorials/HarmonyTranspiler)).
- **Переписывать медленные методы игры — с тем же поведением.** Performance Fish (RimWorld) «патчит разные методы ради эффективности, сохраняя
  поведение тем же»; каждый патч включается и выключается в настройках ([Performance Fish](https://github.com/bbradson/Performance-Fish)).
  Это прямой образец слова владельца «улучшать и переписывать старые».
- **Журнал не в кадре.** Частые строки — уровнем `Debug`, иначе вывод в консоль сам тормозит ([lc_memsaver](https://thunderstore.io/c/lethal-company/p/RuntimeCollective/lc_memsaver/v/1.0.0/)).

## 4. Как устроен Сварог — куда встраиваться

Декомпиляция `Assembly-CSharp.dll` (ilspycmd, 2026-10-14):

- **`WorldState.Instance`** — одиночка мира; в нём `playerStats`, `playerCombat` и **`worldStateInjector`** — 97 открытых полей со ВСЕМИ
  менеджерами игры: `castSpellManager`, `worldTimeManager`, `questManager`, `playerInventoryEnabler`, `characterPanelEnabler`,
  `popUpSpawner` (всплывающие окна), `enemyHealthBar` (полосы врагов), `buffsManager`, `levelUpManager`, `talentsManager`, `mainCamera`,
  `progressManager`, `itemDatabase`, `gameSettingsManager` и другие. **Любой менеджер — одно поле, без поиска по сцене.**
- **`PlayerController`** — `Update` героя: скорость агента, ввод WASD (`HandleKeyboardMovement`), отдых, оглушение. Наш прыжок уже читает
  отсюда клавиши `ControllsManager.KeyCodes`.
- **Окна создаются через `popUpSpawner` и «включатели» (`*Enabler`)** — значит, о показе окна мод узнаёт постфиксом на их методах показа, а
  не перебором окон каждый кадр (пример: `Letters` 2 с полного прохода).
- **Игра сама опрашивает в `Update`** (тот же `PlayerController`): переписывать её медленные места разрешено словом владельца, с тем же
  поведением и выключателем в настройках мода.

## 5. Правила для наших модов (`[AI]`, ждут «да» владельца)

1. **Доступ к игре — через `WorldState.Instance.worldStateInjector.<менеджер>`**; свои ссылки — в поле при создании объекта (постфикс на
   `Awake`/`Start`/`OnEnable` его класса). Поиск по сцене — только при загрузке сцены и смене участка, никогда в кадре.
2. **Свои объекты — в реестре**: статический список, запись в `OnEnable`, вычёркивание в `OnDisable`.
3. **Событие вместо опроса**: изменение мир сообщает постфиксом на метод игры, который его делает (показ окна, смена участка, урон,
   повышение навыка). `Update` мода — только для того, что правда меняется каждый кадр (слежение за камерой, анимация).
4. **Один тик на мод**: одна точка `Update`/`LateUpdate`, внутри — подсистемы с флагом «грязно»; работа только у грязных.
5. **Ноль выделений памяти в кадре геймплея**: без LINQ, без `new` массивов и списков, строки — кеш или `StringBuilder`.
6. **Интерфейс — только при изменении значения**: сравнить с прошлым и выйти; без `ForceRebuildLayoutImmediate` в кадре; `Raycast Target`
   выключен у неинтерактивного.
7. **Свои структуры данных под задачу**: ближайшие значки к курсору — сетка ячеек по экрану вместо перебора всех; кеш ответа «чей значок».
8. **Медленное место игры — переписать** (префикс-замена или транспайлер) с тем же поведением и выключателем — как Performance Fish.
9. **Отражение — один раз при старте** (`FieldRefAccess`, сохранённый `MethodInfo`), не в кадре.
10. **Проверка — числом**: перепись `node SvarogsDream/tools/scene_search_census.mjs` — в покадровых методах **0**; замер пульта `modcost` в
    кадрах геймплея ≤ 1 мс на все моды.

## 6. План 24 через эти правила

| Пункт плана 24 | Правило | Правка |
|---|---|---|
| 23 поиска по сцене в покадровых методах | 1, 2 | ссылка при создании или поле `worldStateInjector`; реестр своих объектов |
| `PurseKickTick`: 10 × `FindObjectOfType<UserInterface>()` | 1 | ссылка один раз или постфикс на создание `UserInterface` |
| `KrinikLetter.LateUpdate` — 2 с полного прохода | 3, 6 | постфикс на показ окна → одна правка; дальше — только при смене текста |
| Пузырь реплики 11–12 мс | 3, 5, 6 | разобрать секундомером части; мерить текст один раз на реплику, без перестройки раскладки |
| `IconHoverTick` 0,45 мс | 7 | сетка значков по экрану, кеш хозяина значка |
| Перепись материалов шесть раз после смены участка | 3, 4 | один проход по событию смены участка, общий для всех модов |

## 7. Аудит наших модов по этим правилам (2026-10-14 21:06)

Счёт по исходникам `SvarogsDream/src` без пульта `KrinikDevHarness` (команды — `grep -r --include=*.cs -o '<приём>' .`; поиски по сцене в
кадре — `node SvarogsDream/tools/scene_search_census.mjs`). Счёт grep по всему коду (с папкой `Shared` и строками комментариев); точный разрез по файлам и по кадру — `node SvarogsDream/tools/refactor_inventory.mjs`: 87 поисков (25 в кадре), 57 покадровых методов, 13 ForceRebuild, 14 GetValue, 127 LINQ (44 в кадре); чеклист — `plans/26_EPIC_svarog_native_refactor.md`.

| Приём | Сколько у нас | Что значит |
|---|---|---|
| `WorldState.Instance` / `worldStateInjector` | 112 / 40 | точкой входа игры уже пользуемся — но не везде |
| Поиски по сцене (`Find…`) | 97 (23 — в покадровых методах) | там, где есть поле `worldStateInjector` или можно взять ссылку при создании, — костыль |
| Реестры (`OnEnable` в файле) | 9 файлов | приём почти не применён: своё ищем, а не держим в списке |
| Покадровые методы (`Update`/`LateUpdate`) + тики | 46 + 8 | много отдельных опросов вместо одного тика на мод и событий |
| Постфиксы Harmony / транспайлеры | 73 / 11 | на события игры уже садимся; переписывать медленные места игры начали |
| `popUpSpawner` (спавнер окон игры) | 2 | о показе окон узнаём опросом, а не постфиксом на спавнере |
| `ForceRebuildLayoutImmediate` / `MarkLayoutForRebuild` | 14 / 3 | «последнее средство» по Unity — у нас обычный путь (BubbleBox, CardTips, ItemWindow, TooltipFit, WorldClock, Quests и др.) |
| `AccessTools.Field` + `GetValue` / `FieldRefAccess` | 23 / 10 | отражение с упаковкой значения там, где хватило бы делегата доступа |
| LINQ (`Where`, `Select`, `ToList`…) | 124 | выделение памяти; в кадре — нарушение правила 5 (разрез по кадру — не снят) |
| Пространственная сетка значков | 0 | `IconHoverTick` перебирает значки у курсора |

**Не пользовались вовсе или почти:** реестры своих объектов; один тик на мод с флагами «грязно»; постфикс на спавнере окон вместо опроса;
`MarkLayoutForRebuild` вместо принудительной перестройки; сетка по экрану для ближайших значков.

**Пользовались зря (в кадре):** поиски по сцене в 23 покадровых методах; полный проход окна писем 2 с; принудительная перестройка раскладки
как обычный путь; отражение `GetValue` вместо делегата.

**Пользовались верно — продолжать:** `WorldState.Instance.worldStateInjector` (40 мест), постфиксы на методах игры (73), транспайлеры (11),
`FieldRefAccess` (10).

## Источники

Unity: [FindObjectsOfType](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/object/findobjectsoftype) ·
[10000 Update() calls](https://unity.com/blog/engine-platform/10000-update-calls) ·
[custom update manager](https://docs.unity.com/en-us/engine/6000.5/manual/scripting/managing-update-order/events-per-frame-optimization.md) ·
[Unity UI optimization tips](https://unity.com/how-to/unity-ui-optimization-tips) ·
[LayoutRebuilder](https://docs.unity3d.com/Packages/com.unity.ugui@1.0/api/UnityEngine.UI.LayoutRebuilder.html) ·
[форум: тесты Update](https://discussions.unity.com/t/a-lot-of-update-call-performance-test-results-why-unity-not-using-array/1542201) ·
[форум: update manager](https://discussions.unity.com/t/should-i-use-an-update-manager-the-50k-update-conundrum/765661) ·
[realvirtual: поиск каждый кадр](https://forum.realvirtual.io/communities/1/topics/923-scenemousenavigationlateupdate-uses-findobjectsbytypetmp-inputfield-every-frame-catastrophic-global) ·
[GameDev.net](https://gamedev.net/tutorials/programming/general-and-gameplay-programming/how-we-optimised-our-scripts-in-unity-r5167).
Моддинг: [HarmonyX wiki](https://github.com/BepInEx/HarmonyX/wiki/Patching-with-Harmony) · [BepInEx: runtime patching](https://docs.bepinex.dev/articles/dev_guide/runtime_patching.html) ·
[BSMG](https://bsmg.wiki/modding/pc/harmony-patching.html) · [7 Days to Die wiki](https://7d2dmodding.wiki.gg/wiki/Harmony_Patch_Targets) ·
[SpawnTracker](https://www.mintlify.com/AntiParty/SpawnTracker/development/harmony-patches) · [RimWorld Wiki: транспайлер](https://rimworldwiki.com/wiki/Modding_Tutorials/HarmonyTranspiler) ·
[Performance Fish](https://github.com/bbradson/Performance-Fish) · [Toggleable Overlays](https://steamcommunity.com/sharedfiles/filedetails/changelog/2661792499) ·
[Underground Power Conduits](https://steamcommunity.com/sharedfiles/filedetails/changelog/2608654598).
