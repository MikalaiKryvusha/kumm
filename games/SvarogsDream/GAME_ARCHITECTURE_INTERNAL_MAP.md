# Svarog's Dream — внутренняя карта (как игра устроена: классы, связи, механики с числами)

> **Created:** 2026-10-13 · по слову владельца: `[OWNER]` «ты же пишешь документ-конспект по внутреннему устройству игры?» ·
> «я просил об этом, или нет?» · «он нужен, чтобы не изучать игру каждый раз по-новому» · «как внешняя и внутренняя карты KAIF,
> только подробный, по каждой игре, которую мы модифицируем» · 2026-10-13 (правило — «записывай всё, что находишь и узнаешь - в
> конспекты, чтобы не терялось» · 2026-10-08)
> **Parent:** досье `games/SvarogsDream/README.md` · пара — `GAME_STRUCTURE_EXTERNAL_MAP.md` (что где лежит)
> **Status:** 🔧 заведена 2026-10-13: разделы 1, 2, 4 сняты с декомпиляции и нашего кода; раздел 3 наполняется разведкой по коду
> **Outbound:** —

**Как пользоваться.** Прежде чем лезть в декомпиляцию — сюда. Нашёл в коде новое (класс, формулу, число, подвох) — дописать сюда тем
же ходом, с адресом `Файл.cs:строка` и проверкой «вызывается ли». Узкие разведки (раздел 5) остаются своими файлами, здесь — указатель.

## 0. Как получить код

- Код игры — один файл `Svarog's Dream_Data\Managed\Assembly-CSharp.dll` (4 284 928 байт, 31.03.2026). Изменился размер — номера
  строк ниже могли уехать, сверять по имени метода.
- Целиком (≈1080 файлов, класс на файл): `D:\work\ai_sandbox\_tools\ilspycmd\ilspycmd.exe -p -o <scratchpad>\decomp\full "<dll>"`;
  один класс — `-t <Класс>`. Декомпиляцию в репозиторий не кладём (чужой код); номера строк — по ней.
- Раскладка декомпиляции: без пространства имён — в корне (менеджеры, герой, мир); подпапки — `GameUI/` (окна и подсказки:
  `ItemToolTip`, `UIMastery`, `UIAlmanac`, `QuestsListUI`, `UserInterface`…), `Fluent/` (разговоры: `OptionsPresenter`, `YellHandler`,
  `FluentPlayer`), `GameSave/`, `GameMainMenuUI/`, `GameHacks/`, `ActionBarUI/`; чужие пакеты — `CartoonFX/` (боевые надписи
  `CFXR_ParticleText_Runtime`), `CTI/` (деревья), `MagicArsenal/`, `EZCameraShake/`, `MirzaBeig…`, `UnityEngine.UI.Extensions/`.
  Вода Lux (`LuxWater_PlanarReflection`) — в другой сборке, `Assembly-CSharp-firstpass.dll` (не декомпилирована).
  Поиск класса — рекурсивно: `grep -rlE "class <Имя>\b" <decomp>/full`.

## 1. Скелет — менеджеры по областям

В игре ≈75 классов `*Manager` (каждый — компонент на сцене); общее состояние мира — `WorldState`. Сгруппировано по смыслу:

| Область | Классы |
|---|---|
| Время, погода, ночь | `WorldTime`, `WorldWeatherManager`, `NightLightsManager`, `PostProcessingManager` |
| Мир и подгрузка | `WorldStreamingManager`, `SlowStreamingManager`, `WorldTravelersManager` (путники), `NPCSpawnManager`, `DungeonsManager`, `SailingManager`, `CartDrivingManager` |
| Герой | `PlayerController`, `CharacterStats`, `TalentsManager`, `LevelUpManager`, `BuffsManager`, `AnimalFormManager`, `SoulManager`, `VirtuesManager`, `AutoEatFoodManager`, `ConsumeManager` |
| Бой и умения | `SpellsActionManager`, `ProjectileManager`, `SummonsManager`, `CombatSoundsManager` |
| Ремесло и вещи | `CookingManager`, `FishingManager`, `StorageManager`, `NPCEquipmentManager`, `InventoryObject` |
| Боги | `DevotionManager`, `GodsFavorsManager`, `GodsInterventionManager`, `GodConversationManager`, `PantheonOfOakManager`, `TotemsRotationManager`, `UnderworldManager`, `FirstWorldManager`, `WorldsEndManager` |
| Фракции, война, закон | `FactionsManager`, `FactionWarManager`, `SiegeManager`, `CrimeManager`, `HeadHuntManager`, `NpcFlagsManager` (+`Expansion`) |
| Сюжет и события | `QuestManager`, `ProgressManager`, `EventsManager`, `WorldEventsManager`, `WorldNewsManager`, `GameLogsManager`, `PlayerCommentsManager` |
| Интерфейс | `UserInterface`, `UIHelpManager`, `UISugestionManager`, `TipsManager`, `AlmanacManager`, `MapIconsManager`, `LoadingScreen` |
| Сохранение, настройки | `LoadSaveGameManager`, `GameSettingsManager`, `DifficultyManager`, `CharacterSelectionManager` |
| Прочее | `AssetManager`, `ParticlesManager`, `GlobalAudioManager`, `AmbientMusicAudioManager`, `UIAudioManager`, `SteamStatsManager`, `AdManager`, `DemoManager`, `CreditManager`, `ErrorsLogManager` |

Разговоры — ≈100 классов `Conversation*` (по классу на собеседника); квесты Велеса, Перуна, Пантеона, Бездана — свои семейства классов.

## 2. Экран загрузки — `LoadingScreen`

- Советы — `private string[] loadingTips = new string[61]` прямо в коде (LoadingScreen.cs:27); отдельного файла нет.
- `ShowRandomTip()` (:74): `Random.Range(0, loadingTips.Length)` — любой элемент массива любой длины; текст
  `$"Tip {num + 1}: {loadingTips[num]}"`. Вызов — в `OnEnable()` (:71) и раз в 10 с из `Update()` (`tipsCountdown = 10f`, :25, :52–56).
- Картина экрана — `Random.Range(0, loadingArts.Length)` в `OnEnable()` (:69).
- Следствие для мода: дописать свои строки в массив при `OnEnable` — рандомайзер выберет и их, номер продолжит авторский.
  Наш `KrinikUIRework/LoadingLayout.cs` уже правит этот экран (место совета, высота картин).

## 3. Механики с числами (по коду)

Проверка каждой строки: разведчик приносит `Файл:строка` + цитату → скрипт ищет цитату в файле (±15 строк) → спорное агент
читает сам. Номера ниже — проверенные (2026-10-13). Имена предметов — константы `ItemId`; показное имя — из данных, сверять с игрой.

### 3.1. Предметы и ремесло

| Механика | Код |
|---|---|
| Торговец продаёт в 5 раз дороже, чем покупает; с чертой `isVulgar` (Грубиян) ещё ×1.2 | `ItemStats.cs:567–572` |
| Проданное по ошибке выкупается у того же торговца по цене продажи, без ×5 | `StaticTradeInterface.cs:90`, `StorageManager.cs:4802` |
| У торговца ограничено золото; сделку больше его кошелька не примет; купленное у него пополняет кошелёк | `StorageManager.cs:4785, 4796`, `StaticTradeInterface.cs:142` |
| Предел веса = 100 + 2 × Сила; Зелье Силача — ×2 на 300 с | `PlayerStats.cs:155, 164`; `ConsumeManager.cs:514` |
| Сумки: Торговца — всё ×0.8; Алхимика — алхимия ×0.5 (Тонкая ×0.4); Оружейника, Бронника — своё ×0.5; Световида — еда и зелья ×0.5; Проклятая — проклятое ×0.1, прочее ×1.2; Велеса — всё ×1.5; Бабы Яги — ×0 при 5+ дурных чертах | `InventoryObject.cs:202–230` |
| Перегруз: быстрое перемещение — голода ×1.5, часов ×1.25 | `WorldMap.cs:3091, 3121` |
| Каждая ступень качества: вес −5 %, урон +5 % (одного типа; +2.5 %, если типов несколько), шанс крита +2 | `ItemStats.cs:78–89, 123` |
| Улучшение в кузне: 5 % цены вещи за 0→1 … 100 % за 8→9; потолок кузни 9, лучшей 10, Орды 11, большой Орды 12 | `StaticForgeInterface.cs:165, 555` |
| Мифрил заменяет любой материал улучшения; разбор Именной вещи даёт 10 Мифрила | `StaticForgeInterface.cs:337`, `DismantleInterface.cs:342` |
| Варка: шанс лишней порции = навык Алхимии %, затем второй бросок; порция 7 с → ≈1 с с ростом навыка | `CookingManager.cs:378, 579–585` |
| Гоблинский очаг готовит в 10 раз быстрее — это ЕДА (`CookingType.GoblinFood` → `StartFastCookingFood`), не зелья | `CookingManager.cs:561`, `CookingInteraction.cs:39–41` |
| Бросок лишней порции по навыку Алхимии — и в готовке еды, и в варке зелий | `CookingManager.cs:579–585` (еда), `885–891` (зелья) |
| Нет рецепта: 50 % — Неудачное Зелье, иначе малое лечебное/маны; с Кровью Богов — Божественное Зелье. Неудачное: 50/50 +100 здоровья или −100, не убивает | `CookingManager.cs:641–647`, `ConsumeManager.cs:456–477` |
| Неиссякаемый Рог не расходуется, лечит 300 | `ConsumeManager.cs:41, 541` (тип и откат слота не проверены) |
| Зелье Берсерка 30 с: дробящий и рубящий урон +50 %, скорость атаки +0.5, лечит 10 % нанесённого; −10 % текущего здоровья в секунду, пока его больше 50 | `ConsumeManager.cs:518`, `PlayerStats.cs:361` |
| Зелье Защиты от Магии — 60 с неуязвимости к магическому урону | `ConsumeManager.cs:511`, `CharacterStats.cs:1341` |
| Яд — только на следующий удар оружием (не заклинание): 10 с по 2 % текущего здоровья цели (Сильный — 3 %) | `CharacterStats.cs:3407–3432` |
| Еда лечит 10 с, по разу в секунду; всё, что лечит ману, тем же процентом лечит энергию | `ConsumeManager.cs:255, 414` |
| Кольцо Зверя — урон ×2 в зверином облике | `PlayerStats.cs:1501` |
| **Ошибка автора:** броня ровно качества 8 (Мифическое) получает +100 к бонусу здоровья (`if (quality == 8) … + 100`), 9+ — нет; у маны то же (`GetBonusMana`, сверено 2026-10-14). Улучшение в кузне 8→9 (100 % цены вещи) отнимает эти +100; цена вещи у торговца считается от тех же бонусов. Починить в `KrinikFixes` (STYLE §0, «баги у автора исправляй в наших модах») | `ItemStats.cs:168–192`, `GetPrice` строка 668 (прочитано 2026-10-13, мана — 2026-10-14) |

### 3.2. Мир, боги, фракции

| Механика | Код |
|---|---|
| Милость за Цветы Сна: 1 → +1, 7 → +3, 21 → +21, 40 → +50 | `GodsFavorsManager.cs:655–688` ← `ProgressManager` |
| Милость за дела (`Record*` ← `ProgressManager`, `CharacterStats`, `PlayerStats`): Световид — рыбалка (после 20 рыб, затем каждые 50, до 50 милостей); Мокошь — травы (после 50, каждые 100, до 20); Дажбог — огненные заклинания (после 50, каждые 100, до 20); Морана — победы (после 100, каждые 200, до 20) и враг с одного удара; Перун — удар от 300 урона; Велес — на волосок от смерти | `GodsFavorsManager.cs:365–519` |
| Больше 10 000 золота в азартных играх — Мокошь разово возвращает 1 000 и +2 милости | `ProgressManager.cs:510`, `GodsFavorsManager.cs:611–620` |
| Очищенная пещера — милость Велеса и бафф `CaveHaste`, до 3 раз | `GodsFavorsManager.cs:627` |
| Вступить: в Дом Веры — Порядок мира ≥ 40 %; в Орду — Хаос ≥ 30 %; к гоблинам — Хаос ≥ 40 %; к Пожирателям — Хаос ≥ 90 % | `FactionsManager.cs:100–106` (Орда открывается и после квеста об атаке на Град) |
| Выбор фракции меняет отношение богов: Дом Веры — Мокошь −3, Перун и Велес −1; Свободные Люди и Орда — Перун и Велес +1 | `FactionsManager.cs:121–157` |
| Кара богов: сложность Высокая и выше, уровень души > 10, отношение с богом < 3 → раз в 10 с проверка, кара (Перун, Морана, Единый Бог, Мокошь, Дажбог), затем пауза 1000 с (500 в «Неприветливом мире») | `GodsInterventionManager.cs:267–322, 364` |
| Порядок поднимает Единого Бога, Мокошь, Световида и роняет Перуна, Морану, Дажбога; Велесу всё равно | `DevotionManager.cs:753–795` |
| Тюрьма: дней = штраф / 50 (2–100); каждые 10 дней −1 очко атрибутов (2–10), +1 Выносливость; убийство +1 000 к штрафу | `CrimeManager.cs:789–810` |
| Пойман на краже без денег — отпустят за всё золото, если его не меньше четверти цены | `CrimeQuestioning.cs:22–36` |
| Ямы Смерти: 13 500 монет за все бои (1 000 → 3 500), приглашение в подземные ямы (Адские Врата); там Последний Страж на волнах 200, 400, 600, 800 | `DeathPitsQuest.cs:97–235`, `InfiniteArena.cs:219–225` (волны — средняя уверенность) |
| Полубог Велеса — 50 % пережить смертельный удар с 1 здоровьем; Полубог Перуна — потолок роста атрибутов +200 | `CharacterStats.cs:2289`, `PlayerStats.cs:1364` |
| Пожертвования в Баре: 1 000 / 10 000 / 30 000 — деревня строится; > 50 000 — событие бесплатной еды, раз в день, лучше после 100k/300k/500k | `NpcFlagsManager.cs:2504–2514`, `WorldEventsManager.cs:1261` |
| Свободные Люди: статуя святыни за 10 000 — +10 милостей и +1 к выбранному богу | `TrainerFreeDevotionStructures.cs:20`, `DevotionManager.cs:250` |
| Дом изнутри: триггер `HouseVisibility` вокруг дома — вход героя (`PlayerStats`) → `houseExteriors.SetActive(false)` (наружный вид целиком; коллайдеров у каменных стен нет ни у скрытых, ни у видимых — пульт `colliders` 2026-10-16, трактир Града; было записано «с коллайдерами стен» — поправлено), `additionalDisablings` выкл, `disabledWhenHidden` вкл, `weatherManager.SetIndoors(true)`; таверна — `WorldState.isInTavern`; выход — обратно. Ходьбу держит навигационная сетка, физику прыжка — край сетки, `Jump.cs` `PhantomWall` (KUMM `bugs/49`) | `HouseVisibility.cs` (декомпиляция 2026-10-14) |
| Не взято: вмешательство и бонусы последователя — `DevotionManager.followedGod` ставится только загрузкой сейва; пожертвования Бездне Велеса работают: `StaticInterface.cs:263` зовёт `VelesBezdanCounter` после броска в Бездну, каждые 10 000 золота — Божья Милость (`GodsFavorsManager.cs:591`, до 1000; поправлено 2026-10-13: здесь стояло «нет вызова» — неверно) | |

### 3.3. Выживание, время, бой

| Механика | Код |
|---|---|
| Ночью звери и нежить (`Fractions.Beasts`, `Undead`) бьют +50 % и получают −25 % урона — только снаружи, в подземельях нет | `CharacterStats.cs:386–405, 1378` |
| Серебро — урон ×1.5 по «зверям» `IsBeast()` (`IsBeast()`: оборотень, вампир, големы и Мать Големов, Крикун, грифон, гарпия, Лесник, вендиго, Дубовый Энт, Лесной Голем, Крампус — прочитано :3077) | `CharacterStats.cs:1465–1470` |
| Мокрый (дождь, глубокая вода): огонь −10 %, вода +20 %; Замёрзший (снег): огонь −40 %, вода +40 %; под крышей снимается. Зелье Дажбога — огонь +50 % | `CastSpell.cs:957–1008`, `WorldWeatherManager.cs:254–286` |
| Сон в кровати: лечит яд и чуму, трезвит; «Хорошо Отдохнул» — 5 мин (сон < 3 ч) или 10 мин (≥ 3 ч), выносливость восстанавливается в 10 раз быстрее; час сна — 2 голода; в Кровавую Луну не уснуть | `GameUI/SleepingManager.cs:52–130`, `PlayerStats.cs:321` |
| Броня убывает в пользе: очки 1–20 — по 1 % защиты, 20–60 — по 0.5 %, 60–140 — по 0.25 %, предел 90 % | `CharacterStats.cs:464` |
| 30 с после загрузки сейва — только 5 % урона (`BuffID.Fresh`); снимается первым своим ударом | `LoadSaveGameManager.cs:484`, `CharacterStats.cs:2132–2143` |
| Пьяный: удары ближнего боя по герою +50 % промаха (+80 % с Кольцом Хмеля `TipsyRing`); 60 с, сон снимает | `CharacterCombat.cs:368–375`, `ConsumeManager.cs:76–83` |
| Ночью снаружи максимум Храбрости вдвое меньше; Ночное Зрение (зелье, черта) отменяет | `PlayerStats.cs:1854–1863`, `BuffsManager.cs:1610–1625` |
| Зима: день 8:00–20:00 вместо 6:00–22:00; травы не сажаются, ульи без мёда | `WorldTime.cs:141–152`, `Planting.cs:100`, `BeeHouse.cs:13` |
| Укус вампира: Кровь Вампира (15 %) — урон ночью +30 %, днём −10 %; Вампиризм (33 %) — лечение ночью +25 %, днём −50 %; чеснок лечит только Вампиризм | `AIVampire.cs:127–135`, `CharacterStats.cs:1471, 3176`, `ConsumeManager.cs:138–141` |
| Облик оборотня и вампира ночью сильнее (скорость, атака, лечение ударом при низком здоровье); превращение ближе 20 м к людям — погоня | `PlayerStats.cs:1656–1758`, `AIPlayerScanner.cs:123–128` (средняя уверенность) |
| Шагом — +15 Камуфляжа; враг видит в конусе 120° минус Камуфляж — подходить со спины | `PlayerStats.cs:1618`, `AIDecisionMaker.cs:234` (какой кнопкой «шаг» — не найдено) |
| Погладить зверя: шанс подружиться 25 % + бонус охоты; каждое поглаживание — 10 опыта светлой души | `LevelUpManager.cs:250`, `AIAnimal.cs:160, 207` |
| Как гладят: держать клавишу `KeyCodes[13]` (по умолчанию C) с курсором над зверем, луч мыши 100 м по слою Interactable → герой сам идёт к зверю (`SetFocus`); вне боя; правая кнопка НЕ нужна — авторский совет «нажмите C и щёлкните правой» устарел (ошибка автора, наш перевод исправлен) | `PlayerController.cs:310–326`, `ControllsManager.cs:39, 71` |
| Героя двигает ТОЛЬКО `NavMeshAgent` по навигационной сетке: в `PlayerController` нет ни `Rigidbody`, ни `CharacterController`; скорость — `_agent.velocity` (бег ≈11,5 м/с по журналу прыжка). Вне сетки герой не ходит: вершина холма у лагеря (−640/145/−253) — отдельный остров сетки, пути от стоянки нет. Наш прыжок (идея 17) снимает героя с агента (`updatePosition = false`) и возвращает `Warp`; лазание (идея 16) — тот же режим «вне сетки» | `PlayerController.cs:26, 109, 135, 858–890, 1210` (декомпиляция 2026-10-14) |
| **Панель быстрых действий — как она устроена у игры и что с ней делают наши моды.** Ячейки — `UISpellSlot` (наследник `UISlotBase`), менеджер — `SpellsActionManager`: `spellSlots[]` — все ячейки по номеру, `assignedSpells[]` — навык каждой ячейки (в сейв), `foodSlot` (Q, номер 51) и `potionSlot` (E) — общие. **Два набора:** номера 0–11 — основной (`MainSkillSlots`), 12–23 — второй (`SecondarySkillSlots`); второй набор — набор запасного оружия: `PlayerEquipment.SwapWeapons()` меняет оружие (слоты снаряжения 11, 12) и зовёт `SwapSpellSlots()` (вкл/выкл двух групп), клавиша игры — тот же вызов; второй набор есть, только если в настройках игры включены вторые ячейки. **Q, E — вне наборов** (у них нет двойника), поэтому в нашем ряду стоят в конце: 1…0, F, G, Q, E (интервью #023, Q5). **Ячейки «Пробел» на панели нет:** у игры это превращение в зверя (`animalFormSlot`, `humanFormSlot`), пробел у нас — прыжок, ячейку прячет мод прыжка (`KrinikFixes/Jump.cs`, слово владельца — в шапке файла). Ряд одной линией и подписи клавиш — `KrinikUIRework/HudRow.cs`; вещи на ячейках — ссылки (`HotbarDrag.cs`, интервью #021, #022). **Ошибка автора:** `UISlotBase.OnBeginDrag` сбрасывает перенос при `DragKeyModifierIsDown()`, а для `None` она отвечает true — миниатюры при переносе с панели нет (чиним `PatchDragGhost`). Перезарядка ячейки — `UISlotCooldown`, общий словарь по номеру навыка, идёт по игровому времени (при открытой сумке игра на паузе — стоит). Отказы действия («Not enough mana.») — отдельная полоса `SpellActivator.CastBarNoMana` (`UICastBar.StartCastingSafe`). Щелчок по ячейке — `SpellActivator.OnSpellClick`: молча выходит, если герой мёртв, полоса каста выключена или уже идёт каст; лечебное зелье при полном здоровье не пьётся — отказ «Health is already full.» (`SpellActivator.cs:406–431`) (с маной — «Health and mana are already full.»); для проверки перезарядки E — сперва `fieldon Player PlayerStats currentHealth <меньше>` (статы героя — компонент `PlayerStats` на объекте `Player`). Загрузка сейва сбрасывает статический `WorldState.isGodMode` (пульт 2026-10-18 05:29: True до «Продолжить», False после; `GameStartController` → `GameHealthCheck.ResetAllStaticVariables`); в схватке с ордой Подземного Мира `AdManager.UpdateAdStatus` сам включает и выключает `isGodMode` (`AdManager.cs:70–138`) — бессмертие пульта игра там может перебить. Перезарядка ссылки на вещь (наш `HotbarDrag.StartCooldown`) должна ставить и цифру — `CountdownTimer.countdown`, как игра в `SpellActivator.cs:490–491` Кнопка `Action Bar/Enablers/ActionBarEnabler` (`InventoryEnabler.cs:225–233`; заодно выключает настройку «прятать панель») и клавиша Caps Lock (`KeyCodes[8]`, `ControllsManager.cs:164–166`) — `playerActionBar.SetActionManager(!WorldState.isEquiped)`: оружие в руки или убрать; без оружия в руках игра прячет панель действий, а с ней и нашу карточку героя — после загрузки сейва HUD бывает скрыт (`isEquiped` False; пульт 2026-10-18 06:00, вернул щелчок по кнопке). Цифра перезарядки ячейки — не `UISlotCooldown.m_TargetText` (у ячеек пусто), а текст «CountdownTimer» (`CountdownTimer.countdownTimer`, прямоугольник 47×22, вверх-вправо, кегль 42 — вываливается влево и вниз); наш ряд ставит его по центру коробки (`HudRow.cs`) | `SpellsActionManager.cs:16–49, 85–93, 671–683, 803`; `PlayerEquipment.cs:296–307`; `ControllsManager.cs:186, 323`; `UISlotBase.cs:549–591`; `UISlotCooldown.cs`; `SpellActivator.cs:11, 437` (декомпиляция 2026-10-18) |
| **Смена оружия и набора** — клавиша `ControllsManager.KeyCodes[10]` (по умолчанию X) в `ControllsManager.Update` зовёт `WorldState.Instance.playerEquipment.SwapWeapons()`; до неё `Update` выходит при съёмке (`isCapturing`), во вступлении (`IntroSceneManager.isPreGameStartState`), при вводе текста (`isTyping`) и в подземном мире (`npcFlags.isPlayerInUnderworld`). `SwapSpellSlots` меняет ряд, только если `gameSettings.isSecondarySlots`; флаг набора — статический `SpellsActionManager.isSecondarySlots` (пишется в сейв). Наша кнопка ⇅ справа от ряда — тот же вызов (`KrinikUIRework/HudRow.cs`, `KrinikSwapButton`) | `ControllsManager.cs:24–64, 117–137, 184, 321`; `PlayerEquipment.cs:297`; `SpellsActionManager.cs:85–93` (декомпиляция 2026-10-18) |
| **Всплывающие сообщения игры** — две ветки. (1) `UISugestionManager` (`worldStateInjector.suggestionManager`): `NewCustomUISuggestion(true, текст)` — простое (35 мест: открыт быстрый переход, альманах) и `NewCustomUISuggestionWithImage(true, текст, значок)` — с картинкой (черты «Talent developed/Talent/Curse/Removed», добродетели «New Virtue», 9 мест); обе зовут `UIInfoMessages.ShowNewCustomMessage(WithImage)`, которые делают `Instantiate(заготовка, transform UIInfoMessages)` и пишут текст первому `Text` копии. (2) У `UIInfoMessages` свои заготовки на всё остальное: начато и кончено задание, сохранение, новый уровень, город, главы, крики богов в битвах. Милости и кары богов — свои объекты `GodsFavorsManager` (`SetActive`). Отказ действия «Not enough mana.» — полоса `SpellActivator.CastBarNoMana` (`UICastBar.StartCastingSafe`). Пульт 2026-10-18: копия `CustomMessage(Clone)` под `UI/ActionBar/InfoMessages` — чёрная полоса от левого края на ≈45 % высоты экрана, въезд слева `UISlideIn` (500 точек), угасание `UIFadeAway` — **погасшую копию игра не уничтожает, а выключает** (`SetActive(false)`): под `InfoMessages` копятся все сообщения сессии; вмешательства богов — `InfoMessages/GodsFavors/GodsInterventions` (внизу слева, над карточкой); полосы каста — `UI/ActionBar/ActionBarMain/AlwaysVisibleBars/Cast Bar (Player)` и `Cast No Mana` (справа внизу). Наш мод ставит всё это стопкой по центру над рядом — `KrinikUIRework/MessageStack.cs`. Строки достижений без побочных действий (только `Instantiate` заготовки) — `UIInfoMessages.ShowQuestFinishedMessage`, `ShowNewQuestMessage`, `ShowNewLevelUpMessage`, `ShowNewSoulLevelUpMessage`, `ShowRecipeDiscoveredMessage`; в игре по-русски: «Квест завершен.», «Уровень повышен!», «Новый рецепт обнаружен.» (пульт 2026-10-18 06:55). «Уровень повышен!» — крупный текст с красной чертой, без фона `Background`: в стопке переливается в две строки и налезает на соседнюю (KUMM пачка 9, кейс AC2) | `UISugestionManager.cs:24–75`; `GameUI/UIInfoMessages.cs:469–490`; `TalentsManager.cs:364, 432, 500`; `VirtuesManager.cs:112`; `GodsFavorsManager.cs:137–279` (декомпиляция 2026-10-18) |
| **Частота ударов и «Суммарный Урон».** Пауза между ударами — `defaultWaitTime / скорость` = 2 / скорость с (ближний бой); лук — 2 / скорость − 0,15 с; маг — 2 / (скорость × 0,8) с. Крит — бросок шанс/100, удар ×2 (выше 100 % — всегда ×2). «Суммарный Урон» окна сумки = (сумма средних уронов) × скорость × (1 + крит/100) ÷ 2 (без «÷ 2» и со «*» — при двух оружиях): средний урон в секунду. У автора в нём три ошибки — деление целых в крите (множитель 1 ниже 100 %), крит выше 100 % без потолка, частота лука и мага; все чинит `KrinikFixes/AuthorBugs.cs`, правка 5 (лук 2,18 / 144,9 / 30 %: автор 157,94 → наш 245,455) | `CharacterCombat.cs:15, 113–137`; `CharacterStats.cs:1497`; `GameUI/UserInterface.cs:154–187`; `UtilMethods.cs:42` (декомпиляция 2026-10-18) |
| **Перезарядка ячейки «залипает» красной.** `UISlotCooldown.StartCooldown` у выключенной ячейки красит фон и заливку и ставит «на перезарядке», а таймер не запускает; при показе (`OnEnable` → `CheckForActiveCooldown`) без общей записи ничего не сбрасывает — сбрасывает только `OnDisable`. Рассылка — `SpellActivator.HandleCasterSpellUI` всем ячейкам с тем же навыком, и спрятанным. Правка — `KrinikUIRework/HotbarDrag.cs`, `PatchStaleCooldown` (KUMM bugs/54) | `ActionBarUI/UISlotCooldown.cs:136–260`; `SpellActivator.cs:483–492` |
| **Карточка ячейки ряда.** `UISpellSlot.OnTooltip`: у пустой ячейки — `emptySpellToolTipPrefab`, у полной — `spellToolTipPrefab` (`Action Bar/NewSpellTooltip`; у Q и E — карточка с `isConsumableTooltip`); обе через `SpellToolTip.PopulateSpellToolTip(…, transform.position ячейки, isEmptySlot, isSelectionPage: false)`. `isSelectionPage: false` бывает только у ячеек ряда, окно «Мастерства» зовёт с `true` (`GameUI/UIMastery.cs:51`). Место считается от центра ячейки под старую панель в углу: полная — вверх на высоту/1,45 и вправо на ширину/2,5 (у Q, E ещё −20), пустая — вверх на высоту/2 и вправо на ширину/4,5; над нашим рядом по центру экрана карточка E вставала слева, над серединой ряда. Наш мод ставит полную над самой ячейкой, левым краем по рамке (`KrinikUIRework/TooltipFit.cs`, `PatchSlotTipAboveCell`), пустую — своей карточкой там же (`SpellPicker.cs`) | `SpellToolTip.cs:37–68`; `ActionBarUI/UISpellSlot.cs:192–210` (декомпиляция 2026-10-18) |
| **Вести мира** (окна «-НОВОСТИ-»: `UI/GamePopUps/WorldEvents/<номер>-<имя>`, например `86-ScandalAtCourt`). `WorldEventsManager.ShowEventMessageManually(событие, задержка)` не только показывает окно: `ShowHideEventManually` останавливает или замедляет время мира и зовёт `ActivateEvent` — событие действует на мир. Для проверки вида окна — пульт `active <путь окна> 1` (только окно, без события), закрыть — `active <путь> 0`; кнопка «ОК» окна зовёт `CloseEventMessage` (время мира — обратно) | `WorldEventsManager.cs:1865–1920` (декомпиляция 2026-10-18) |
| **Вода и дымка.** Воды две: Lux (`Lux Water/WaterSurface Tessellation` — озёра, болота, пещеры; туман свой, режим зашит при сборке, числа — `unity_FogParams`) и река NatureManufacture (`R2_River_Tesseled_Big`, `NatureManufacture Shaders/Water/Water River Tesseled Vertex Color Flow`). Обе слушают туман Unity, который задаёт дымка `KrinikColorRework/Sky.cs` (EXP2, ≈0,00144): замер у Бора 2026-10-18 03:00 — при густоте ×2,5 река уходит в дымку, как трава (KUMM `researches/svarogs-dream/water-haze-recon.md`) | пульт `call UnityEngine.RenderSettings get_fog…`, `mats River`, `mats Lux` |
| Физические слои (`LayerEnum`): 0 Default · 1 TransparentFx · 2 IgnoreRaycast · 4 Water · 5 UI · 8 Ground · 9 Interactable · 10 PostProcessing · 11 Ragdoll · 12 Item · 13 Inventory · 14 CharacterModel · 15 Storage · 16 AdditionalLighting · 17 WoodPlatform · 18 Recipe. Земля под ногами в коде игры — луч вниз по `Ground` (`PlayerController.cs:770–815`); клик мыши — `Raycast(ray, out hit, LayerMask.GetMask(…))` во многих местах: маска встаёт на место дальности, луч бьёт по всем слоям (баг 34, закрыт). Слой меняется на ходу: убитый, невидимый, спрятавшийся — 2 IgnoreRaycast, вернулся — 9 Interactable (`CastSpell.cs:3311, 5315`, `CrimeManager.cs:473`, `AIWalkingDead.cs:379`). Утёсы `SM_Cliff_*` коллайдера не имеют вовсе — их видит только наша сцена форм мода камеры (`KrinikCameraRework/RockProxies.cs`, EXP-0256). Какие слои у деревьев, камней, стен и у самого героя — пульт `colliders` (кейс F0 `TC_svarog_jump_physics`), не проверено | `LayerEnum.cs`; декомпиляция 2026-10-14 |
| Полоска бега — `currentEndurance` (в коде stamina), в игре «Энергия» (глоссарий: Energy — шкала); растёт раз в 3/2/… с, вдвое быстрее ночью с «Ночным Охотником», ×10 с «Хорошо Отдохнул»; атрибут Выносливость (Endurance) — её максимум; тратится на бегу по 1 каждые 0,5 с (`staminaSpendingTimer`, с чертой «Берсерк» — по 2), пока герой движется; цена у торговца — `ItemObject.GetPrice(isTraderItem, quality, …)` (подсказка вещи, окно торговли) | `PlayerStats.cs:290–351`; `ItemObject.cs:43`; `GameUI/StaticTradeInterface.cs:18, 90, 120` (декомпиляция 2026-10-18) |
| Рыбалка: заброс на 10–30 м в воду глубже 3 — лучший замах, клюёт быстрее (обычно 5–15 с); улов — опыт Ловкости, ночью ещё Храбрости; редкий улов от замаха не зависит | `FishingRod.cs:352–366`, `FishingManager.cs:214–235` |

### 3.4. Механики наших модов (о них — советом: `[OWNER]` «Если наши моды вносят механику - говорим, как совет» · 2026-10-13)

| Механика | Где в нашем коде |
|---|---|
| Поворот и наклон камеры с зажатой ЛКМ (после сдвига мыши, короткий щелчок — игре) или зажатым колесом; наклон 10–90° | `KrinikCameraRework/Plugin.cs:107–116` (`MouseButton` 0, `MouseButton2` 2, `MinPitch` 10, `MaxPitch` 90) |
| Отдаление колесом в 1.5 раза дальше игры; щелчки по целям вдали дотягиваются | `KrinikCameraRework/Plugin.cs:117` (`MaxZoomFactor` 1.5); лучи мыши — баг 33/34 |
| Окно настроек всех модов — F8 или кнопка «Настройки модов» в меню паузы | ConfigurationManager 19.0 + `KrinikModMenu` |
| F9 — сравнение с картинкой игры, F10 — час вперёд (инструменты, не механика для игрока — в советы не идут) | `KrinikColorRework/Plugin.cs:122–123` |

### 3.5. Подгрузка участка — что стоит кадр (декомпиляция `WorldStreamingManager`, 2026-10-17)

- `EnableWorldAreaContent(area, true)` → `StartCoroutine(EnableWorldAreaContentAfter)`: корутина до первой паузы идёт **в том же вызове** — если
  `isLoadingAny` ложно, сразу `worldArea.areaContent.SetActive(true)`: всё дерево участка включается одним кадром (`OnEnable` всех объектов).
  Замер (KUMM TC_svarog_review_fixes A8): 7,3–9,2 мс на бегу, 14,96 мс сразу после телепорта. Потом, если статики ещё нет, через 0,1 с —
  `EnableContentAfterTime` → `SpawnTerrainContent` (своя корутина). При `GameSettingsManager.isSmallAreaStreaming` следом — `EnableWorldAreaTerrain`.
- `EnableWorldAreaTerrain` — ≤ 0,79 мс (тот же замер).
- Выключение: ждёт `isContentJustEnabled` (5 с после включения, `AllowContentToBeDisabledAfterTime`), при исследовании карты (`isExploringMap`) не выключает.
- **Один замок на всю загрузку — `isLoadingAny`** (декомпиляция 2026-10-17 07:21). `LoadTerrainData` (террейн, `await SpawnObjectUnderParent`)
  и `SpawnTerrainContent` (статика участка — дома, растения; тоже асинхронно) держат его всё время загрузки, несколько кадров. Кто застал
  замок занятым, перепроверяет через 0,05 с (`CallMethodAfterDelay`, `CallLoadMethodAfterDelay`, цикл в `EnableWorldAreaContentAfter`); очереди
  нет — замок берёт тот, кто первым спросил при свободном. Сторож: занятый дольше 1,5 с замок `Update` снимает сам. Пока идёт
  `StreamRepeatingAfterTeleport` (`_isStreamingAfterTeleport`, `IsTeleporting()`), замок не проверяется, а `EnableWorldAreaContentAfter` содержимое
  не включает вовсе. После телепорта игра вызывает `StreamWorldMap(isRecalculate: true, isStreamingContent: true)` и `StreamWorldAroundPlayer`.
- Наш мод камеры (`PatchStreaming`, квадрат шире игры) включает недостающие участки своего квадрата в одном кадре (17,93 мс на беге на запад).
  Очередь «по одному за кадр» 2026-10-17 откачена: после первого телепорта дом у героя появлялся через 3–8 с (KUMM план 26).

### 3.6. Выбор героя — кто выпадает, черты и характеристики (декомпиляция `CharacterSelectionManager`, `CharacterSelectionUI`, `StoryCharacter`, 2026-10-17)

- **Герои — данные автора:** `CharacterSelectionManager.storyCharacters` — 62 героя (`art/heroes.tsv`, `tools/heroes_extract.py`). У каждого свои
  характеристики и **ровно три черты, вписанные автором** (`playerTalent1..3`): все 62 тройки разные, разных черт — 78. Черты приходят с героем.
- **Начало игры** — герои 0, 1, 2 (`GetFirstThreeCharacters`), без случая; их выбор ведёт в сцену вступления (`SetupOrcAttackScene`).
- **После смерти** (`UnderworldManager` → `InitializeCharacterSelection(false)` → `PopulateCharactersAfterPlayerDeath`): `GetRandomThreeCharacters`.
  Пул — герои с номера 3: сперва ни разу не показанные (`characterUsage.isShown`); меньше трёх — не сыгранные (`isUsed`); меньше трёх — все.
  Три разных `Random.Range`, без прошлой тройки (`rerollCharacter1Id1..3` — переброс всегда даёт новые лица); если первые два одного пола — третий
  другого. Показанный помечается `isShown`, сыгранный и погибший — `isUsed` (`deadCharacters`). Фанатик-последователь вместо выбора — герой 47.
- **Характеристики** (`UpdateCharacterToMatchTheLevel` — копия героя, `MemberwiseClone`): `(int)(основа + основа × уровень души × 0.07)`; затем бой
  в Аду (`AdFight`) ×1.4, с помощью ×2.3, не выше 100; День Смерти ×3; «усиленные герои» (`isImprovedCharacter`) ×1.5; **выше 95 → 90** (похоже на
  опечатку автора); полубог Велеса — все 100. Уровень героя = уровень души игрока.
- **Переброс** — 3 Божьих Милости (`RerollCharacters`); строка цены — `SetRerollsUI` после трёх `PopulateCharacters`.
- **Выбор** (`FinishCharacterInitialization`): черты карточки (`selectableCharacter.storyCharacter` — копия) → `talentsManager.InitializePlayerTalents`;
  характеристики — в `playerStats`. После загрузки сейва (`isItAfterSelection: false`) метод выходит до черт — черты живут в сейве, не в герое.
- **Черты в сейве** (декомпиляция 2026-10-17): `SaveFile.cs:491` пишет `playerTalentIds` (ключи `aquiredPlayerTalents`) через `BinaryFormatter`
  (`SaveGameBinarySerializer`, `Assembly-CSharp-firstpass`) — номер вне `PlayerTalentId` пишется и читается. Загрузка (`LoadSaveGameManager.cs:318`
  → `TalentsManager.AddPlayerTalent:626–631`) ищет черту в `availablePlayerTalents`; нет её там — NullReference, загрузка обрывается (try нет),
  альманах и прогресс не встают. Свои черты — в своём файле рядом с сейвом, не в списке игры (`researches/svarog-hero-traits-recon` §5).
- **Сколько черт может быть у героя** (декомпиляция `TalentsManager`, `CharacterSelectionUI`, `StoryCharacter`, 2026-10-17): у игрока черты — словарь
  `aquiredPlayerTalents` без предела (`AddPlayerTalent`; при 15 и больше игра пишет статистику Steam `stat68`), `InitializePlayerTalents` принимает
  список любой длины. Ровно три — только у героя-карточки: поля `StoryCharacter.playerTalent1..3`, список при выборе собирается из них тремя `Add`,
  карточка окна выбора рисует три слота `selectableCharacter.uiTalent1..3`. Другое число черт = свой список мода + подмена списка в
  `InitializePlayerTalents` при выборе + слоты карточки (спрятать лишние, добавить четвёртый и пятый).
- Открыть окно выбора пультом (без смерти): `callon Managers/DataManagers/CharacterSelectionManager CharacterSelectionManager InitializeCharacterSelection False`.

## 4. Где в игру влезают наши моды (цели патчей и обращений, снято grep по `typeof(…)` в `src/`)

| Мод | Классы игры |
|---|---|
| KrinikUIRework | `LoadingScreen`, `ItemToolTip`, `SpellToolTip`, `UITalentTooltip`, `UIBuffTooltip`, `UIBuffs` (`PopulateBuffs` раскладывает значки в порядке словаря `BuffsManager._activeBuffs`, а `Dictionary` .NET отдаёт место снятого бафа следующему — новый может встать левее; пассивка оружия в словаре, только пока оружие в руках. Постфикс `PassiveBuffs.cs` раскладывает полосу заново: выученные пассивки всегда, обычным значком, затем временные по номеру появления; черты героя — первыми детьми той же сетки (`HeroTraits.cs`), сетка `FixedColumnCount` 12, угол снизу слева — лишнее уходит строкой выше. Интервью #024, Q4, 2026-10-18; ночная версия с приглушением 0,45 × 0,62 ≈ 28 % яркости значок почти прятала), `UIGlobeTooltip`, `MasteryTooltip`, `UIMastery`, `UIAlmanac`, `QuestsListUI`, `QuestHeaderUI`, `ProgressManager`, `GameLogsManager`, `UIHelpManager`, `UISkillUp`, `UIPopUpSpawner`, `PlayerActionBar`, `StaticEquipmentInterface`, `InventoryObject`, `CursorIcons`, `CharacterIcon`, `PlayerController`, `OptionsPresenter`, `ExitGameMessages`, `YellHandler`, `CFXR_ParticleText_Runtime` |
| KrinikColorRework | `PostProcessingManager`, `WorldTime`, `WorldWeatherManager`, `HelpingLightEnabler`, `LuxWater_PlanarReflection` (firstpass) |
| KrinikCameraRework | `CameraFollow`, `CharacterStats`, `WorldStreamingManager`, `Traveler`, `TerrainQuarter` |
| KrinikFixes | `TreasureHuntMask` (патч Harmony); границы воды Lux — своим классом `LuxWaterBounds` |
| KrinikDevHarness | `WorldTime`, `WorldMap` |

## 5. Узкие разведки (уже написаны, `researches/svarogs-dream/`)

| Тема | Файл |
|---|---|
| Моддинг, русификатор, ночной фильтр | `README.md` |
| Свойства предметов в окне предмета | `item-properties-recon.md` |
| Что делает каждый стат инвентаря | `inventory-stats-mechanics.md` |
| Вместимость и прокрутка инвентаря | `inventory-capacity-scroll.md` |
| Прокачка выше 100, формулы | `progression-uncap.md` |
| ИИ жителей, «живой мир» | `simulation.md`, `living-world/` |
| Зоны мира | `world-zones.md` |
| Главный поток, профиль кадра | `main-thread-recon.md`, `main-thread-profile-2026-10-10.md`, `main-thread-wait-and-transforms.md` |
| Небо, вода | `sky-recon.md`, `water-recon.md`, `water-sspr-recon.md` |
| Подсказки настроек, тексты HUD | `settings-tips-recon.md`, `hud-texts-recon.md` |
| Тексты, собираемые кодом | `procedural-text-ru.md` |
