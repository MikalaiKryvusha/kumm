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
| Гоблинский очаг варит в 10 раз быстрее | `CookingManager.cs:561` |
| Нет рецепта: 50 % — Неудачное Зелье, иначе малое лечебное/маны; с Кровью Богов — Божественное Зелье. Неудачное: 50/50 +100 здоровья или −100, не убивает | `CookingManager.cs:641–647`, `ConsumeManager.cs:456–477` |
| Неиссякаемый Рог не расходуется, лечит 300 | `ConsumeManager.cs:41, 541` (тип и откат слота не проверены) |
| Зелье Берсерка 30 с: дробящий и рубящий урон +50 %, скорость атаки +0.5, лечит 10 % нанесённого; −10 % текущего здоровья в секунду, пока его больше 50 | `ConsumeManager.cs:518`, `PlayerStats.cs:361` |
| Зелье Защиты от Магии — 60 с неуязвимости к магическому урону | `ConsumeManager.cs:511`, `CharacterStats.cs:1341` |
| Яд — только на следующий удар оружием (не заклинание): 10 с по 2 % текущего здоровья цели (Сильный — 3 %) | `CharacterStats.cs:3407–3432` |
| Еда лечит 10 с, по разу в секунду; всё, что лечит ману, тем же процентом лечит энергию | `ConsumeManager.cs:255, 414` |
| Кольцо Зверя — урон ×2 в зверином облике | `PlayerStats.cs:1501` |
| **Ошибка автора:** броня ровно качества 8 (Мифическое) получает +100 к бонусу здоровья (`if (quality == 8) … + 100`), 9+ — нет; мана — не сверена. Починить в `KrinikFixes` (STYLE §0, «баги у автора исправляй в наших модах») | `ItemStats.cs:174–178` (прочитано 2026-10-13) |

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
| Не взято: вмешательство и бонусы последователя — `DevotionManager.followedGod` ставится только загрузкой сейва; пожертвования Бездне Велеса — у `VelesBezdanCounter` нет вызова | |

### 3.3. Выживание, время, бой

| Механика | Код |
|---|---|
| Ночью звери и нежить (`Fractions.Beasts`, `Undead`) бьют +50 % и получают −25 % урона — только снаружи, в подземельях нет | `CharacterStats.cs:386–405, 1378` |
| Серебро — урон ×1.5 по «зверям» `IsBeast()` (оборотни, вампиры, големы, грифоны, гарпии, Лесник, вендиго — по словам разведчика, список не сверен) | `CharacterStats.cs:1465–1470` |
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
| Рыбалка: заброс на 10–30 м в воду глубже 3 — лучший замах, клюёт быстрее (обычно 5–15 с); улов — опыт Ловкости, ночью ещё Храбрости; редкий улов от замаха не зависит | `FishingRod.cs:352–366`, `FishingManager.cs:214–235` |

### 3.4. Механики наших модов (о них — советом: `[OWNER]` «Если наши моды вносят механику - говорим, как совет» · 2026-10-13)

| Механика | Где в нашем коде |
|---|---|
| Поворот и наклон камеры с зажатой ЛКМ (после сдвига мыши, короткий щелчок — игре) или зажатым колесом; наклон 10–90° | `KrinikCameraRework/Plugin.cs:107–116` (`MouseButton` 0, `MouseButton2` 2, `MinPitch` 10, `MaxPitch` 90) |
| Отдаление колесом в 1.5 раза дальше игры; щелчки по целям вдали дотягиваются | `KrinikCameraRework/Plugin.cs:117` (`MaxZoomFactor` 1.5); лучи мыши — баг 33/34 |
| Окно настроек всех модов — F8 или кнопка «Настройки модов» в меню паузы | ConfigurationManager 19.0 + `KrinikModMenu` |
| F9 — сравнение с картинкой игры, F10 — час вперёд (инструменты, не механика для игрока — в советы не идут) | `KrinikColorRework/Plugin.cs:122–123` |

## 4. Где в игру влезают наши моды (цели патчей и обращений, снято grep по `typeof(…)` в `src/`)

| Мод | Классы игры |
|---|---|
| KrinikUIRework | `LoadingScreen`, `ItemToolTip`, `SpellToolTip`, `UITalentTooltip`, `UIBuffTooltip`, `UIGlobeTooltip`, `MasteryTooltip`, `UIMastery`, `UIAlmanac`, `QuestsListUI`, `QuestHeaderUI`, `ProgressManager`, `GameLogsManager`, `UIHelpManager`, `UISkillUp`, `UIPopUpSpawner`, `PlayerActionBar`, `StaticEquipmentInterface`, `InventoryObject`, `CursorIcons`, `CharacterIcon`, `PlayerController`, `OptionsPresenter`, `ExitGameMessages`, `YellHandler`, `CFXR_ParticleText_Runtime` |
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
