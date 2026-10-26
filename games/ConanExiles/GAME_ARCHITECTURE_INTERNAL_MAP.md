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

Вкладки хаба (снято 2026-10-26): Q/E = `W_Carousel_C:NextCarouselWindow()` / `PrevCarouselWindow()` (пультом, без клавиш). Вкладку «Снаряжение»
выдаёт модуль `XCS_Panel` (боковая панель «Моды Xevyr»): открыт с хабом на «Снаряжении», закрывается при уходе на другую вкладку. Нижняя панель
хаба — ванильный `ButtonBar` (`ButtonContainerRight`: «Закрыть»; на «Талантах» слева — «Показать контент из DLC»). Кнопки модов в ней:
Hosav `W_UI_SettingsButton` — отдельный виджет поверх экрана, у автора опрос `Delay 3.0` + `IsModuleActive(CharacterInventory)` (в сборке заглушён,
видимость — `KrinikPauseGameInMenu` по `XCS_Panel`); Exiles Fishing `W_EFT_AdminButton` — вставлен в `ButtonContainerRight` функцией
`BPC_EFT_Tuning.Graft` по таймерам 0.3/0.5 с. Окна настроек модов — модули `DT_UIModuleTable` (`DN_UI_Settings`, `SM_UI_Settings`, `PrP_Settings`,
`LLH_Settings`, `AMR_Settings`, `NightTerrorsSettings`, `EAA_*`, `ModControlPanel`, `HosavUIsettings`, …); часть через голый `ActivateModule` не
открывается, `PRMainMenu` (PackRat Helper) так ронял игру. Карточки классов EAA — картинки: текст нарисован в текстурах. Окна, которые
открываются, делают это не каждый раз: `EAA_Famemenu`, `EAA_Armorsettings`, `DN_UI_Settings` после пары «открыть → закрыть» в одном сеансе
открывались через раз (26.10, обходы 18:03–19:33) — кадр пустой → повторить вызов один раз, прежде чем писать «окно не открылось».

Трупы (2026-10-26, баг 64 п. 11): отдельный актёр `Corpse_C` (`CorpseBase`), не сам погибший `BaseBPCombat_C`; своя проверка
`IsActorInInteractableRange(InActor)` щедрая (истина с 9,8 м и для камеры); свежевание — `HarvestableComponent_v2_C`. Подсветку даёт сферический
луч `UpdateHighlightTarget` от камеры (`TraceSphereRadius` 20, длина `InteractionDistance` 330 + `InteractionDistanceThirdPersonBonus`).
Мод CorpseStripper (`CorpseStripper_MC_C`) тоже работает с трупами.
Подсветка цели (байткод кита 2.2, `FunCombat_PlayerController::UpdateHighlightTarget`, читается `uaj func <ассет кита> VER_UE5_6 <функция>` +
скретч-разборщик): в третьем лице игра САМА ставит `InteractionDistanceThirdPersonBonus` = длине штанги `ThirdPersonSpringArm`; сферический луч
`InteractionDistance + бонус`; каждое попадание проходит `CheckLineOfSight(actor, ImpactPoint + вперёд_камеры·10, компонент, экземпляр)`: цель =
`InteractTargetOverride` → да; труп и `LootContainer` → `IsActorInInteractableRange(pawn)`, затем родная `IsInteractableInLineOfSight`;
`PickupFoliage` и `IsPickupInterface` → расстояние героя < √300000 ≈ 548 см; прочее → `IsInteractableInLineOfSight`.
**Правило для мода камеры (2026-10-26, подтверждено в игре):** игра продлевает луч взаимодействия на длину штанги и пересчитывает надбавку сама
(запись мода затирается за ≈1 с). Камера обязана стоять от героя на длину штанги: сдвиг «назад» держать в `TargetArmLength`, не в
`SocketOffset.X` — иначе луч короче на этот сдвиг и не достаёт низкие цели (трупы).
Первое лицо включается, когда колёсико ведёт штангу ниже `ThirdPersonCameraMinArmLength`; при 30 (наш `zoom_min`) переход не срабатывает, при
130 срабатывает (2026-10-26 20:59). `SwitchToFirstPersonCamera` сама переставляет `InteractionDistance`.
Читы прогона пультом (2026-10-26): время суток — `FindFirstOf('BP_TimeOfDayManager_C'):SetTimeOfDay(12.0)` (часы 0–24; консольной
`SetTimeOfDay 1200` в 3.0.1 НЕТ — «Command not recognized»); бессмертие — `exec God`; выносливость — `AdjustStaminaRegenMod(1000.0)` и поля героя
`SprintStaminacost`, `SwimStaminacost`, `StaminaJumpCost`, `JumpStaminaCostModifier` = 0, `SetClimbingStaminaCostModifier(0.0)`; выдача — `exec MakeMeAdmin`,
затем `exec SpawnItem <id> <n>` (железная стрела 53612, «Мощный охотничий лук» 51405). Всё сбрасывается перезапуском.
`God` НЕ спасает от жажды и голода (2026-10-26: смерть `CauseOfDeath: Thirst` при включённом God). Выживание — `p:GetHungerSystem()`
(`BP_HungerSystem_C`): `EnableThirst(false,false)`, `EnableHunger(false,false)`, `AddDrink(nil,100.0)`, `AddFood(nil,100.0)` (сеттеры `SetDrinkCurrent`
ждут два аргумента — не годятся). `AdjustStaminaRegenMod(1000)` выносливость НЕ удержал; работает повтор `AdjustStaminaCurrent(1000.0)` раз в 250 мс.
Бессмертие нового героя после смерти — поле `bCanBeDamaged=false`. Повтор пульта: `LoopInGameThreadWithDelay` с флагом `_G.krinik_cheat2_on`.
Родная камера (шаблон кита `ThirdPersonSpringArm_GEN_VARIABLE`): штанга 200 (колёсико 130–250), `SocketOffset` (20, 52, −38) — над правым
плечом и ниже точки штанги; цель `TPCameraSocketOffsetTarget` по умолчанию (0,0,0). При натяжении лука игра камеру НЕ двигает — только обзор
107 → 54–58 (замер 2026-10-26).
Направление стрелы (байткод кита 2.2, `BasePlayerChar::GetProjectileDirection`, 2026-10-26): сведения в точку прицела НЕТ — ветка «луч из
камеры на 10000 см → цель → баллистика к точке попадания» выключена константой `if not (False)` (инструкция 178). Работает ветка 232–239:
вылет из гнезда лука `SocketLocation`, направление = взгляд камеры (`CamRot`) + разброс `AccuracyOffset` + подъём `(0,0, 0.0675 × CrosshairOffsetMod)`
(≈3,9°), нормализовано. Подъём подобран под родную камеру над правым плечом; при нашей камере (строго за спиной, выше) стрела уходит вбок на
поперечный разрыв камера↔лук и вверх на неподходящий подъём (жалоба владельца 2026-10-26 «выше и правее»). Захват цели (`TargetLockLocation`)
— своя баллистика к точке захвата.
Летящая стрела героя (замер 2026-10-26 22:12–22:28): актёр `BP_Visual_BowProjectileBase_C` (`/Game/Items/Weapons/Bow/`; `BP_Item_…` — предмет,
не снаряд), на КАЖДЫЙ выстрел игра создаёт ДВА таких снаряда — первый без скорости за ≈1 с до вылета (стрела на тетиве), второй летит.
Со стрелой, перенесённой на луч камеры (наш `KrinikArrowAim`), траектория относительно луча прицела: вбок 0…−5 см, вверх +16…+26 на
7–11 м, +22…+40 на 14–20 м, −17…+32 на 34 м (родной подъём 0.0675 и гравитация по кривым `FC_BowProjectileGravCurve_15m/30m/45m/60m`);
воткнувшаяся стрела ещё ≥0,6 с стоит на месте, и её точку можно прочесть (потом игра её убирает). Перенос актёра — `K2_SetActorLocation(точка, false, {}, true)`.
Заряд меняет падение, не скорость (замер 22:32–22:34, подъём снят модом): скорость всегда ≈5000 см/с; родной подъём у полного натяжения
1,1–1,2° (`0.0675 × CrosshairOffsetMod`), у неполного 3,7–3,8°; заряженная без подъёма −6 см на 19 м (владелец: «словно заряженная летит
точно в точку прицеливания с любой дистанции»), незаряженная −55 на 18 м, −101 на 23 м — у заряженной гравитация слабее (поля снаряда
`PowerChargeMod`, `PowerChargeGravityModMax`, `ProjectileGravityScale` компонента — числа в журнале `KrinikArrowAim`).
Поломка стрелы при ударе (владелец: «иногда стрелы не втыкаются и исчезают»): `BP_BaseProjectile` — `CanBreakOnImpact`,
`PercentageChanceToBreakOnImpact` (шаблон `BP_Visual_BowProjectileBase`: false / 0.65 — значит, включает их выстрел); целая стрела при
ударе заменяется воткнутой копией для подбора, сломанная исчезает; попадание туда, куда воткнуться нельзя, — тоже поломка (комментарий в
ассете). След заряженной стрелы — `TracerParticleSystem` (`P_arrow_trail_powershot`: лента + кольца `M_particle_powershot_circles`).
Ветка сведения в 3.0.1 (2026-10-26): ассет `/Game/Characters/BasePlayerChar` (только в паке игры, ни один мод сборки его не перекрывает) —
`GetProjectileDirection` байткод с `.uexp`+457496 (legacy-вид от `retoc to-legacy --version UE5_7 -f BasePlayerChar`); `JumpIfNot` +5013 (.uexp 462509),
его условие `False` 0x28 на .uexp 462514 — единственный 0x28 в функции; `True` = 0x27, размер тот же. Доставка — свой контейнер с одним пакетом;
путь legacy→zen для блюпринта ломает импорты (build-level-mod.py, 13.09) — нужен перенос zen-куска и записи заголовка без пересборки.
Первое лицо в бою (лук в руках) — родная настройка геймплея `Game.ini` → `[Settings.Gameplay] AllowFirstPersonCamera` (в коде
`AllowFirstPersonCameraInCombat`): при False игра выставляет `BlockFirstPersonByCombat`, и `UpdateFirstPersonCameraCombatBlockingStatus` уводит
камеру в третье лицо, запомнив прежний вид (`WasInThirdPersonOnBlockFirstPerson`). В эталоне пака с 2026-10-26 — True. Режим камеры — `CurrentCameraMode`.
Выход из простоя пультом: `BasePlayerChar_C:OnUserInactiveChanged(false)` — HUD снова виден (кадры 2026-10-26 20:36).

Простой (снято 2026-10-26 14:13): после ≈4 мин без ввода игра скрывает HUD (`W_NewHealthUI_C` видимость 2) и камера облетает героя; кадр
окна в простое выходит без HUD и без открытой панели — снимать сразу после открытия.

Окна настроек «универсального» вида (`*_US_DT_Settings` / `*_DT_SettingsAPI`): подписи и описания строк окна — в РЯДАХ таблицы данных.
У Player Ignores Follower Collision это `StrProperty` (`.locres` не видит, правка ассета), у модов Xevyr (`LLH_`, `PrP_`, `DN_`, `SM_`,
`AMR_DT_SettingsAPI`) — ключевые тексты `Text:Base` (идут через `.locres`).

Simple Minimap ставит карту во время игры: центр слота `MinimapScale` — (1684, 150) при 3840×2160, выравнивание 0,5; отступ слота в ассете
(слева 1730, сверху 180) на место не влияет (опыт 14:41). Смещение перетаскиванием — `w_Position` в `SM_BP_SaveGame` (по умолчанию ноль).
Место считает `SM_UI_Minimap.LoadSettings` (байткод прочитан `_config/devkit/kismet-trace.py`, 2026-10-26): половина = `GetSize × UIScale × 0.5`,
по умолчанию центр = (ширина вьюпорта / масштаб − половина X, половина Y) — карта вплотную к правому верхнему углу; сохранённый `w_Position`
(если не ноль) берётся вместо него; затем `FClamp` по X и Y от 0 до (вьюпорт − половина) и `SetPosition` слота `MinimapScale`. Строку координат
(`Coordinates` в `MinimapOverlay`) над картой прижимал край экрана; в сборке множитель 0.5 → 0.52 (KRINIK MODIFIED, `dbl:` правка на месте;
0.58 владелец счёл слишком далеко от угла). Замер 2026-10-26: каждые 0.01 множителя = −3 по X и +3 по Y единиц интерфейса от (1684, 150);
в 4K при 0.50 цифры целы, но до края ≈ 8 пикселей.

Панель быстрых ячеек — ванильный `WBP_MainHotbar_C` прямо в окне игры (слота нет, масштаб 1, сдвига нет; 2026-10-26); ни один мод сборки её
ассетов не везёт. Hosav: верхний HUD — `W_SmoothHP` (рядом авторская копия `SUPERUI_Backup_ForFuckups/W_SmoothHP`), виджеты врага
`W_EnemyHealthbar_InHUD` / `W_NewEnemyHealth` — рамка цели в HUD, не полоска над головой моба; настройки — `SaveUISettings_UIH`, слот
`HosavUISave_New` (файл появляется после сохранения настроек игроком).

Слоты `W_SmoothHP` (`CanvasPanelSlot_N` → элемент; правка — `prop:CanvasPanelSlot_N/LayoutData/Offsets/Left|Top|Right|Bottom`, таблица
`ConanExiles/_config/localization/asset-strings/UIMod_Hosav__W_SmoothHP.tsv`). Сборка 2026-10-26 — две колонки, ряды 77 · 102 · 127:
урон `_12` значок / `_13` текст · броня `_8` / `_10` · температура `_9` / `_11` (колонка −240 / −220); еда `_22`, шкала `_35` / `_23` · вода
`_24`, шкала `_33` / `_25` · вес `_20` / `_21` (колонка −10 / 10) — порядок по слову владельца ≈15:45. Верхний ряд 5: опыт `_16` значок (сжат до 0×0) / `_17` текст (−240), порча
`_14` / `_15` (−10 / 10). Полосы: здоровье `_36`, выносливость `_1`, фон `_27` (T −11, высота 160). Строка опыта — шаблон
`{xpCurrent}{suffix1} / {xpMax}{suffix2} ({xpNeeded}{suffix3})`, перевод «Опыт: …» (интервью #003, строка 299).

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
