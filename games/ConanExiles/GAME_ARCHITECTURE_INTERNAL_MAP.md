# Conan Exiles Enhanced 3.0.1 — внутренняя карта: как устроены подсистемы и где в них наши моды

> **Created:** 2026-10-26 · **Parent:** правило «две карты на каждую игру» (`AGENT_GUIDE.md` → Notes from the human); первая запись — разбор
> бага 64, п. 11 (камни не брались от третьего лица) · **Status:** заведена 2026-10-26, разделы дописываются по мере разборов · **Outbound:** —

Числа и имена сняты с живой игры пультом `KrinikAgentRemote` (только чтение отражения), если не сказано иное. Внешняя карта (где что лежит) —
`GAME_STRUCTURE_EXTERNAL_MAP.md` рядом.

## Взаимодействие: «взять», «открыть», «подобрать» (снято 2026-10-26)

| Что | Где | Числа |
|---|---|---|
| Луч прицела | `FunCombat_PlayerController_C::GetLineTraceStartAndEndFromCamera(Distance)` | начало = камера, направление = центр экрана (прицел), длина = `Distance` |
| Подсветка цели и выбор | `FunCombat_PlayerController_C::UpdateHighlightTarget` | `InteractionDistance` 330 + `InteractionDistanceThirdPersonBonus` 55 (от третьего лица), сфера `TraceSphereRadius` 20 |
| Камни, волокно — экземпляры растительности | родная `PickupGatheringOneInstance(TraceLength, TraceRadius)` из `UpdateHighlightTarget` | `PickupInteractionDistance` 25, `PickupTraceSphereRadius` 200 — тоже от камеры |
| Проверка после попадания | `InteractionLenientDistanceCheck(ImpactLocation)` | расстояние точка ↔ ГЕРОЙ < `dw.BaseLenientInteractionDistance` 500 |
| Окна в мире | `BasePlayerChar_C::WidgetInteraction` на `CameraThirdPerson` | дистанция = штанга + 500, игра пересчитывает сама |
| Постройка | `BasePlayerChar_C::BP_BuildSystem_v2` (`BuildSystemComponent`) | `m_BuildRange` 2000, `m_DestructRange` 5000, `PlacementGhostRadius` 600 — от камеры или от героя, не проверено |
| Приказы рабам | контроллер | `CommandRange` 3000, `CommandTargetTraceRadius` 50 |
| `TraceOrigin` | стрелка на герое, `CollisionCylinder` + (0, 0, 82) | перенос её на камеру ломает взаимодействие от третьего лица полностью (опыт 2026-10-26) |

Все дистанции «от камеры» рассчитаны на родную камеру в 200 см (`ThirdPersonCameraDefaultTargetArmLength`; диапазон 130–250). Мод камеры, который
отодвигает камеру дальше, обязан удлинять их на столько же: `ConanCameraControl` → `update_interact_reach` (надбавка и поиск камней,
запас `interact_reach_extra_cm` — 2,5 м перед героем по слову владельца).

## Тексты модов: где живут и чем переводятся (снято 2026-10-26)

| Вид текста | Как выглядит в ассете | Чем переводится |
|---|---|---|
| FText с ключом в данных (`TextProperty`, история Base) | ключ + исходник | `.locres` (`Game/ru/Game.locres`) |
| FText с ключом в байткоде | `29 01 1F <исходник>\0 1F <ключ 32 hex>\0 1F <пространство>\0` (EX_TextConst LocalizedText) | `.locres`; опись `all-mods-ftext.csv` пропускала многострочные (Era of Trials, подсказки школ магии) — скан `_config/compat/missing-bytecode-ftext.py` |
| Текст элемента без ключа (`TextProperty`, история None) | только строка | правка ассета (`_config/devkit/patch-mod-asset.py`, таблицы `_config/localization/asset-strings/`) |
| Строковое свойство (`StrProperty`) в шаблоне | длина + строка | правка ассета |
| Строка в байткоде (`EX_StringConst` 0x1F без 0x29 перед ней, `EX_UnicodeStringConst` 0x34) | склейки вроде «Fishing Power: » | строка `lit:` в таблице ассета → `_config/devkit/kismet.py`: удлиняет литерал и сдвигает адреса переходов (с 2026-10-26) |

Сборка правленого ассета — склейкой: исходный zen-заголовок с новыми смещениями экспортов + пропатченный `.uexp`; `retoc to-zen` для блюпринтов 5.8
не годится (EXP-0338).

Что склейка умеет и чего нет (2026-10-26):

| Правка | Можно? | Как |
|---|---|---|
| Строка, текст без ключа | да | таблица `<Мод>__<Ассет>.tsv` в `_config/localization/asset-strings/`, строка «английский → русский» |
| Число или флаг, который УЖЕ записан в ассете (значение мода по умолчанию, шрифт, отступ, место слота) | да | строка `prop:<Имя>` (все свойства с этим именем) или `prop:<Экспорт>/<путь>` (`ModListBox/WidgetStyle/TextStyle/Font/Size`); первый случай — `RestoreAnchor` счётчика DPS |
| Новое свойство, которого в ассете нет (`AutoWrapText`, `WidthOverride`), новая ссылка на чужой ассет | нет | имени нет в таблице имён исходного zen-заголовка; нужен свой писатель заголовка |
| Строка в байткоде (`EX_StringConst`, `EX_UnicodeStringConst`) | да (с 2026-10-26) | `lit:<английский>\t"<русский>"` → `kismet.py`: разбор Kismet 5.8 (самопроверка — размер функции в памяти = числу в её заголовке), замена на UTF-16, сдвиг переходов и пропусков; граф событий (ubergraph) — отказ |

Байткод UE 5.8 на диске (`kismet.py`, сверено на 190 функциях): ссылка на объект 4 байта (в памяти 8), FName 8 (в памяти 12), ссылка на
свойство — FFieldPath (число имён, имена, владелец; в памяти 8); перед байткодом два int32 — размер в памяти и на диске. Текстовая
константа вида 4 бывает с одной строкой следом («— empty —» рыбалки).

Значения по умолчанию наших правок в поставке: угол свёрнутого счётчика DPS (`DN_SG_SaveSettings.RestoreAnchor` 0), метрики сервера Hosav
выключены (`SaveUISettings_UIH.ServerInfo` false). Они действуют у игрока без сохранённых настроек мода; у кого настройки уже сохранены —
меняются в окне мода. Пересобранный внешний пак без сжатия — в 2–3 раза больше авторского (Hosav 26 → 51 МБ), на работу не влияет;
сжатие при упаковке — улучшение прибора.

Exiles Fishing (`JaarFishing`, 2026-10-26): у мода своя таблица текстов `DT_ExilesFishing_Texts` (структура `S_ExilesFishing_Texts`), её
читают рыбы, кодекс, мини-игра и `JaarFishing_ActorComponent`; переводы автора (FR `3724537904`, DE, ES, PT) — паки таблиц, без блюпринтов.
Админ-панель (`BPC_EFT_Tuning`, `W_EFT_FishCard`) таблицу НЕ читает: 9 строк-литералов в функциях `FPText`, `WaitText`, `TierText`,
`PerHourText`, `PresetText`, `ProfStore`, `Init` («Fishing Power: », «Min FP », «table », « %   (vanilla » …) — английские и у французов.
Исходников мода публично нет; автор — Jaar F Love, Discord `discord.gg/kvKxrjpXeE`.

## Модули интерфейса (снято 2026-10-26)

255 строк живой таблицы `/Game/UI/Data/DataTables/DT_UIModuleTable` — имена модулей (игра + моды: `CharacterInventory` — хаб, `IngameMenu`,
`HosavHUD_EnemyHealthbar` — полосы здоровья врагов Hosav, `SML_ModList`, `DN_UI_DmgWidget`, `ExilesFishingTuning`, `EAA_*` …). Открыть модуль
прямым вызовом: `FindFirstOf('GUIModuleController'):ActivateModule(FName('CharacterInventory'), true, false)`; `false` вторым
аргументом — закрыть. Меню паузы — `IngameMenu` (с ним открывается панель Simple Modlist). Окна настроек модов открываются консольной командой
пультом: `exec dc PIFCSettings` и т. п.; консоль игры 3.0.1 — `~` (на русской раскладке Ё) и F10 (живые `InputSettings.ConsoleKeys`:
Tilde, ё, F10).

Простой (снято 2026-10-26 14:13): после ≈4 мин без ввода игра скрывает HUD (`W_NewHealthUI_C` видимость 2) и камера облетает героя; кадр
окна в простое выходит без HUD и без открытой панели — снимать сразу после открытия.

Окна настроек «универсального» вида (`*_US_DT_Settings` / `*_DT_SettingsAPI`): подписи и описания строк окна — в РЯДАХ таблицы данных.
У Player Ignores Follower Collision это `StrProperty` (`.locres` не видит, правка ассета), у модов Xevyr (`LLH_`, `PrP_`, `DN_`, `SM_`,
`AMR_DT_SettingsAPI`) — ключевые тексты `Text:Base` (идут через `.locres`).

Simple Minimap ставит карту во время игры: центр слота `MinimapScale` — (1684, 150) при 3840×2160, выравнивание 0,5; отступ слота в ассете
(слева 1730, сверху 180) на место не влияет (опыт 14:41). Смещение перетаскиванием — `w_Position` в `SM_BP_SaveGame` (по умолчанию ноль).

Панель быстрых ячеек — ванильный `WBP_MainHotbar_C` прямо в окне игры (слота нет, масштаб 1, сдвига нет; 2026-10-26); ни один мод сборки её
ассетов не везёт. Hosav: верхний HUD — `W_SmoothHP` (рядом авторская копия `SUPERUI_Backup_ForFuckups/W_SmoothHP`), виджеты врага
`W_EnemyHealthbar_InHUD` / `W_NewEnemyHealth` — рамка цели в HUD, не полоска над головой моба; настройки — `SaveUISettings_UIH`, слот
`HosavUISave_New` (файл появляется после сохранения настроек игроком).

Перевод модов: цель `Content/Localization/Game` в чистой игре пуста (ванильный перевод в паках) — там только наши `Game.locmeta` и
`ru/Game.locres`, их ставит запись манифеста `Krinik Russian Translation`.

## Слияние таблиц модов (снято 2026-10-26, живые таблицы пультом)

| Что | Как на самом деле |
|---|---|
| Строка, которую пишут мод и игра (или два мода) | сливается ПО ПОЛЯМ, хотя журнал пишет `MergeDataTables - Found existing table entry … overwriting` |
| Массив (`CraftingGroups`, `BonusRecipes`) | дописывается: `Armorer_4` — 8 игровых групп + 1 Ancient Civilization = 9, 30 рецептов + 1 TDI = 31 |
| Пустое поле мода (`[]`, `None`, 0) | не затирает игровое: у TDI `ThrallTier 0`, `StatTemplate None` — в игре 4 и Artisan Base |
| Два мода, разные поля одной строки | оба применяются: боссы — расы Heritage + характеристики и оглушение Bosses My New Besties |
| Исключение, не понятое до конца | `ThrallGroup = Warrior` Ancient Civilization в `Armorer_4` не применился (в игре Crafter) |

Чтение живой строки: `StaticFindObject('/Game/Systems/SpawnTable/<Таблица>.<Таблица>'):ForEachRow(function(name, row) … row.<Поле> … end)`
(имя строки — строка Lua; массив — `:GetArrayNum()`, имя — `:ToString()`). Потеря правки — только там, где два мода меняют ОДНО поле
(`ConanExiles/docs/17`).

## Камера (снято 08.09–26.10)

| Поле `BasePlayerChar_C` | Родное | У нас (`ConanCameraControl`) |
|---|---|---|
| `ThirdPersonCameraMinArmLength` / `Max` | 130 / 250 | 60 / 2000 |
| `ThirdPersonCameraDefaultTargetArmLength` | 200 | `zoom_default` |
| `CameraZoomAmount` (шаг колеса) | 20 | 5 у героя, дальше 15 % дистанции |
| штанга `SocketOffset` | — | X −100, Z 65; наклон камеры 4° |

Подробности зума и его ловушек — `ConanExiles/docs/07-зум-камеры.md`.

## Где наши моды встают в игру

| Мод | Точка | Как |
|---|---|---|
| `ConanCameraControl` | штанга камеры героя, контроллер (дистанции взятия) | Lua UE4SS; сторож зума 30 мс (план 34 — переписать на события) |
| `KrinikPauseGameInMenu` | `GUIModuleController:ActivateModule` | перехват + опрос 250 мс |
| `KrinikHudOutline` | `TextBlock` в `W_NewHealthUI_C` (HUD Hosav) | обводка шрифта на новом HUD |
| `KrinikLevelUncapped` | таблицы уровней игры | пак-подмена ассетов, без кода |
| `KrinikAgentRemote` (прибор) | `cmd.txt` → игровой поток | страж `no-component-sweep`: перебор компонентов отказывает (EXP-0330) |
