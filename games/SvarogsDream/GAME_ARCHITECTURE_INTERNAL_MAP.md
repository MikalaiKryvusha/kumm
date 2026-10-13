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

### 3.1. Предметы и ремесло
_(наполняется разведкой 2026-10-13)_

### 3.2. Мир, боги, фракции
_(наполняется разведкой 2026-10-13)_

### 3.3. Выживание, время, бой
_(наполняется разведкой 2026-10-13)_

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
