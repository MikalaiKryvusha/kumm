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
Плашка над трупом и окно быстрого лута (2026-10-28, баг 64 п. 32) — ОДИН родной виджет, модуль `ContainerInfo` = `UI/Widgets/HUD/Interact/
WBP_ContainerInfo` (pakchunk1110; моды сборки его не переопределяют): `Overlay_Main` → `OverlaySlot_5` (плашка `Border_Underlay` → `Content`: имя,
«Труп», `ActionTutorial` «нажмите E…»; отступы слева и справа 20) и `OverlaySlot_3` (`W_QuickLootPanel`, отступ слева 500 — место окна жёстко от левого
края плашки). Модуль ставит на экран модульная система, `W_OnScreenInfoContainer` только включает его по имени (`ContainerInfo` и др.).
Окно быстрого лута `W_QuickLootPanel`: сетка `InventoryGridView` (слот `VerticalBox_1.VerticalBoxSlot_2`, отступы 10) и внизу
`WidgetSwitcherTooltips` — ряд навигации (индекс 0, при открытии) и ряд действий с предметом (индекс 1, после выбора колесом); переключатель
меряется по активному ряду, и окно меняло ширину при прокрутке (2026-10-28). Замер 22:05 (пульт, ширина по содержимому, единицы UMG): ряд
навигации `NavTooltip` 539,7, ряд действий `LootActionTooltip` 650,4 (значок 30 · отступ 10 · подпись · отступ 20 …; у «Забрать все»
`LootButtonLabel_1` отступ справа 0 — на экране «Забрать всеEsc»), слот переключателя — отступы 35/10/35/10. Масштаб интерфейса при 4K —
2,09 px на единицу (`WidgetLayoutLibrary:GetViewportScale`). Окно стоит по центру ≈ x 2966 (4K), кромка панели квеста — 3717–3722.
`KrinikUIFixes` сборки 4: сетка 35, ряд подсказок 20, зазор перед Esc 20 — ширину задаёт сетка, правый край на кромке квеста.
Убить NPC пультом для трупа: `KillCharacter(HitLocation, killerNameInput, killer, OverridingCauseOfDeath, StateChangeDelay, DamageCauser)` —
`x:KillCharacter(0, FText(''), <герой>, {}, 0.0, <герой>)` (`BaseBPCombat_C`); модуль лута на трупе — `SetObject(<Corpse_C>, 0)`, где
`Corpse_C` — владелец `DismemberedBodySkeletalMesh_C` (`GetOwner()`).
Атака в воздухе (2026-10-28, план 37): `BaseBPCombat::ActionTry` отказывает при `InSubstate(8)` с причиной `IsFalling` — поэтому лук не
стреляет в прыжке; `IsFalling` ещё в `DodgeTry` и ubergraph `BasePlayerChar` (поиск — `uaj grepfn <ассет> <версия> <строка>`).
Screen placement of the module (2026-10-28 23:50, pult): `WBP_ContainerInfo_C` has NO UMG parent (outer = the game instance) — the module
system places it itself from its desired size AT ACTIVATION; a later visibility change of `W_QuickLootPanel` (native `SlotTakeAll` writes
Hidden = 2 on the same instance; class default is Hidden too) does not re-place it, even when set Collapsed (overlay shrinks to 1141×144, strip stays).
Native class chain of the panel: `W_QuickLootPanel_C` → `QuickLootPanel` (`SlotTakeAll`, `SlotTakeOne`, `SetActor`, `UpdateTooltip`, `m_Actor`) →
`RootWidget` → `UserWidget`. Hotkey icons (`UI/Framework/W_HotkeyIcon`, native `HotkeyIcon`): HBox binding-name text · `TextBlockHoldPrompt`
«(удерживайте)» · primary/secondary icon; the hold prompt is switched natively by the action's long-press flag and per instance by
`HoldPromptVisibility` (default 3; 1 hides it); also `ShowOnlyText`, `BindingLabel`, `NoPresentationVisibility`.
Loot change event (2026-10-29 00:2x, counters on nine candidates around a REAL Q hold): only the native `QuickLootPanel:SlotItemAddedOrRemoved`
fires (UE4SS hooks it); the blueprint `HandleInventoryChanged` / `HandleLootContainerInventoryChanged` of `WBP_ContainerInfo` stay silent on a corpse.
`Overlay_Main` of `WBP_ContainerInfo` spans the whole screen: a slot alignment there is relative to the SCREEN edges.
Corpse prompt text: vanilla target `Exiles_UI`, key `DA4E821B4EE35B69F5E9128CF11CB58F` «Разделайте труп и получите ресурсы или нажмите {0}, чтобы
забрать предметы»; the widget lays it out as one row «text · key icon · text» (a `\n` inside breaks only the first piece). Our `Game` target
overrides a vanilla key when the entry carries the vanilla hashes (`_config/devkit/vanilla-override.py`, proven 2026-10-29 00:34).
Crosshair (`/Game/UI/Widgets/HUD/Reticles/WBP_Crosshair.WBP_Crosshair_C`): the spread bars (curve `C_CrosshairAccuracyAlpha`) show as soon as a bow
is in hand, before any draw — zeroing the curve keys hides them at once.
Hosav numbers: `BlueprintLibrary/BPFL_Hosav_UI.TextOverflowPrevention_Numbers` (Hosav's, not the game's): ≥ 100 000 → `Divide_IntInt(x, 10)` → `/100.0`
+ «k»; ≥ 1 000 000 → `/10000` → `/100.0` + «M»; truncation, two decimals.
Sun and shadows (0.003 was set for a smooth sun; now 2.0 by the owner's choice): `DynamicSky.SolarUpdateAngleDelta = 0.003` (game 0.015) turns the sun light ~50×/s; live `2.0` (light turns in steps
seconds apart) — the owner under palms 2026-10-29 00:46: «ну сейчас словно тени в порядке»; back at 0.003: «да, вернулось». The pack carries 2.0
(bug 67; 2.0 written, reverted once for the smooth sun, then 2.0 by the owner's final choice 2026-10-29 01:10 — no cvar keeps 0.003 smooth without the redraw); the game log shows the quality group 0.015 first, then ours.
Stand rule (2026-10-28 23:52 crash): never keep a killed creature in `_G` — the dead actor is destroyed and the next call on it is an access
violation in UE4SS; read its location BEFORE `KillCharacter`.
Для замера модуль можно открыть пультом: `ActivateModule(FName('ContainerInfo'), true, false)` + `SetObject(<труп>, 0)` у `WBP_ContainerInfo_C`; игра
его сама не закроет — после замера `ActivateModule(FName('ContainerInfo'), false, false)` (2026-10-28: плашка висела на экране владельца:
«а почему плашка обыска трупа открыта? я не смотрю на труп»).
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
затем `exec SpawnItem <id> <n>` (железная стрела 53612, «Мощный охотничий лук» 51405; без `MakeMeAdmin` пульт отвечает «ok», а предмета нет —
2026-10-27). Всё сбрасывается перезапуском. Убрать врагов рядом: `GameplayStatics:ApplyDamage(…, 100000)` у Конана НЕ убивает (нежить Night Terrors
осталась жива, 2026-10-27 19:53) — работает только `K2_DestroyActor()` (без добычи); неуязвимость существа — `bCanBeDamaged=false`.
`God` НЕ спасает от жажды и голода (2026-10-26: смерть `CauseOfDeath: Thirst` при включённом God). Выживание — `p:GetHungerSystem()`
(`BP_HungerSystem_C`): `EnableThirst(false,false)`, `EnableHunger(false,false)`, `AddDrink(nil,100.0)`, `AddFood(nil,100.0)` (сеттеры `SetDrinkCurrent`
ждут два аргумента — не годятся). `AdjustStaminaRegenMod(1000)` выносливость НЕ удержал; работает повтор `AdjustStaminaCurrent(1000.0)` раз в 250 мс.
Стенд прогона пультом (2026-10-28, правило дома о тестовом окружении): убрать всех рядом — `K2_DestroyActor` у каждого `Character` в радиусе
60 м (лагерь NPC вокруг героя — враги стоят вплотную и бьют); существа дальше ≈150 м от героя СПЯТ (`bHidden`, тик и столкновения выключены):
перенос спящего к герою его не будит (сеттеры столкновений не действуют, стрелы проходят насквозь), а игра потом прячет его в пул (0,0,0) —
переносить ГЕРОЯ к существу (`p:K2_SetActorLocation(точка, false, {}, true)`), через ≈5 с оно бодрствует; держать на месте —
`CustomTimeDilation = 0.0001`, без урона — `bCanBeDamaged=false`; NPC-людей смирными — `DetachFromControllerPendingDestroy()` (стоит, монтажи
играет); монтаж на NPC — `PlayAnimMontage(M, 1.0, FName('None'))`. Прицел пультом — `SetControlRotation` на точку существа: `K2_GetActorLocation`
крокодила у земли, для тела +70 см. Цель для убийства на стенде — только по ТОЧНОМУ имени класса (`x:GetClass():GetFName():ToString() == 'HumanoidNPCCharacter_C'`):
`FindAllOf('HumanoidNPCCharacter_C')` отдаёт и подклассы, среди них `BP_HumanoidDialogueNPC_C` — NPC с диалогом (2026-10-28 22:56 и ≈23:05
убиты два таких, «Поборник Внешней тьмы» и ещё один, — ошибка стенда). Набранные буквы владельца в окне игры открывают хаб (J — «Путешествие») — перед настоящим вводом ждать
простоя ввода ≥ 10 с (`GetLastInputInfo`) и кадром проверить, что меню закрыто.
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
`PowerChargeMod`, `PowerChargeGravityModMax`, `ProjectileGravityScale` компонента; замер 22:39: заряд 1,00 → гравитация 0,120, заряд
0,64 → 0,510, `PowerChargeGravityModMax` 0,9). Владелец: «игра сама ослабляет гравитацию для заряженного выстрела - это, в принципе, хорошо».
Полоски слева и справа от точки прицела (кит 2.2, `/Game/UI/Widgets/HUD/Reticles/WBP_Crosshair`, режим `Ranged`) — указатель разброса:
виджет зовёт `CalculateProjectileSpread` → `MaxDeviation`, сдвигает полоски по кривой `C_CrosshairAccuracyPositioning` и гасит по
`C_CrosshairAccuracyAlpha` (материал `M_UI_Reticle_Accuracy`); шире полоски — больше случайное отклонение стрелы (`AccuracyOffset` в
`GetProjectileDirection`). `KrinikArrowAim` с 22:55 снимает только подъём, разброс игры оставляет (вариант Б владельца); полоски скрыты
обнулённой кривой `C_CrosshairAccuracyAlpha` (владелец: «полоски мешают, путают»). Подъём = 0.0675 × `CrosshairOffsetMod` (аргумент
функции), по замеру `CrosshairOffsetMod` ≈ 1 − 0,72 × заряд (заряд 0,60: до 2,11°, снято 2,19°). Выстрел без натяжки (заряд 0):
гравитация компонента 1,2, разброс до ±4–5° (22:55: остаток −3,8…+4,4° вверх, до +5,5° вправо), полный заряд — 0,12 и доли градуса.
Разброс в ванили — `BasePlayerChar::CalculateProjectileSpread` (байткод кита, `uaj func`, 2026-10-26): наибольшее отклонение `MaxDeviation`
складывается из штрафа за движение (скорость героя `GetVelocity` / скорость бега — своя у ездового `RunSpeed` из таблицы, иначе
450 / 750), стата точности героя (`GetIntStat`, при низком — `LowAttributeDeviationPenalty`; верхняя граница стата 20), стата
ездового верхом (`IsRiding` → `AccuracyStatMount`), бонуса `ProjectileDeviationBonus` (перки, вещи), с полом `AccuracyMinDeviation` 0,01;
константы функции 0,75 · 0,6 · 0,733 · 0,408 · 10 · 450 · 750. Само отклонение в `GetProjectileDirection` — случайное, по колоколу
`FC_AccuracyBellCurve` в пределах `MaxDeviation`.
Прицел после выстрела (план 36 п. 34) — кандидаты в `BasePlayerChar` (кит 2.2): `WasSecondaryKeyDown`, `WasQueueSecondaryKeyDown`,
`SecondaryActionHold`, `TriggerSecondaryByPrimary`, `StopSecondaryAttack`; у лука `BP_bow_2h` — `UnDrawBow`, `bIsDrawn`; байткод не читан.
Цепочка класса героя 3.0.1: `BasePlayerChar_C` ← `BaseSurvivalChar_C` ← `BaseBPCombat_C` ← `BaseBPChar_C` ← `/Script/ConanSandbox.ConanCharacter`.
`StopSecondaryAttack`, `ServerStopSecondaryAttack`, `StopTriggerSecondaryByPrimary`, `StartTriggerSecondaryByPrimary` — в `BaseBPCombat_C`
(RegisterHook встаёт по этому пути); `ClientStopSecondaryAttack`, `ClientStopTriggerSecondaryByPrimary` — в `BasePlayerChar_C`.
Разовые наблюдатели «[aim-probe]» поставлены пультом 22:59 (живут до перезапуска).
**Выстрел пультом (2026-10-26 23:53):** `p:InpActEvt_PrimaryActionV2_K2Node_InputActionEvent_9({KeyName=FName('LeftMouseButton')})` у
`BasePlayerChar_C` с луком в руках выпускает стрелу (журнал `KrinikArrowAim` #10) — стрельба проверяется без владельца. ПКМ:
`InpActEvt_SpecialActionV2_K2Node_InputActionEvent_7/_8` (вызов пультом работает), но `IsInputKeyDown(RightMouseButton)` видит только
физическую кнопку — «зажатую ПКМ» пультом не изобразить.
Выход в главное меню пультом: `exec disconnect` в одиночной игре ничего не делает (2026-10-26 23:17, герой остался в мире) — сценарий
«меню → снова в мир» — с 2026-10-29 агентом: Esc настоящим вводом, затем пультом `FindFirstOf('W_IngameMenu_C'):CloseAndReturnToMainMenu()`, затем `enter-world-remote.sh`. После такого перезахода объекты героя меняются: моды, державшие старые ссылки, читают
поля как `TrivialObject` (баг 65). Управление луком: ПКМ — прицел, ЛКМ — выстрел
(`InpActEvt_PrimaryActionV2_…_9/_10` срабатывают на выстреле; выстрел #4 23:02 ушёл с отпущенной ПКМ).
«Камера отъезжает после выстрела» (владелец 23:0x) — это ОБЗОР, не штанга: замер 23:05–23:07, пять выстрелов с зажатой ПКМ — штанга 170
неизменна, обзор 53,8° до 100 мс → 88–105° на 200 мс → 107,5° на 300–650 мс → снова 54° к 1300 мс. Обзором правит компонент героя
`BP_PlayerFovController` (`/Game/Systems/Combat/`): `SetFieldOfViewTarget`, `FieldOfViewReset`, `FieldOfViewChange`, `SetCameraFov`; поля
`FieldOfViewTarget` (107,5 вне прицела), `FieldOfViewChangeDuration` 0,1, `FieldOfViewLingerDuration` 0,1, `RevertOnExpire`.
`SetFieldOfViewTarget(0)` — обычный обзор, `(1)` — прицельный (53,76°); на выстреле игра зовёт 0 и через ≈0,7 с снова 1. Перехват UE4SS
этой BP-функции срабатывает ПОСЛЕ её тела (цель уже новая), второй обработчик RegisterHook («после») не вызывается, подмена аргумента
не действует. Запись поля `FieldOfViewTarget` в обработчике держит прицел только пока у контроллера идёт переход (23:37, AIM9); после
отпускания ПКМ поле менялось, а реальный угол камеры оставался 53,8° — ни `SetFieldOfViewTarget(0)`, ни `FieldOfViewChange(0.1,0)`, ни
`SetCameraFov(107.5)` его не вернули (контроллер неактивен, 2026-10-26 23:56). Удержание через перехваты снято (`KrinikArrowAim` 0.2.0);
следующий путь — данные `FieldOfViewSubstateTrigger` у героя (EXP-0349).
**Как контроллер считает обзор** (байткод 3.0.1, `kismet-trace.py` по выгрузке `retoc-5.8 to-legacy` пака игры, 2026-10-28): `SetFieldOfViewTarget(Mod)`
пишет `FieldOfView = Mod` и `FieldOfViewTarget` = `GetFieldOfViewDefault()` (это `UserSettingsLibrary.GetFOV` — обзор из настроек игрока, 107,5) ×1
при Mod 0 · ×0,5 при Mod 1 (прицел) · ×0,95 при Mod 2. `FieldOfViewChange(Duration, Target)` при новом Mod ставит `FieldOfViewChangeDuration` =
`FieldOfViewChangeCurrent` = Duration, задержку `Linger` = Duration, `RevertOnExpire` = false и зовёт `SetFieldOfViewTarget`. Тик, пока
`ChangeCurrent > 0`: обзор камеры = Lerp(`GetFieldOfViewTarget()`, текущий обзор камеры, Current/Duration) через `BPI_FieldOfView.SetCameraFov`
владельца, затем Current −= dt. Поле `FieldOfViewTarget` тик читает каждый кадр перехода — запись поля в начале перехода меняет итоговый угол,
вне перехода не действует. Множитель один на оба вида; свой обзор от первого лица — запись поля в перехвате (`KrinikArrowAim`, `fp_aim_fov_scale`).
`FieldOfViewChange(d, 0)` при цели уже 0 — пустой вызов (так «не помог» 26.10, EXP-0349); при цели 1 — переход к обычному обзору за d.
После выстрела монтаж натяжки доигрывает сам, отпускание ПКМ его не прерывает: конец уведомления обзора раньше конца монтажа (родные 6,08,
пробные 6,346) роняет зум при зажатой ПКМ (кейс N1 2026-10-28), поэтому `KrinikBowFixes` тянет уведомление до 7,05, а выход из прицела по
отпусканию ПКМ после выстрела делает `KrinikArrowAim`. UE4SS `ExecuteWithDelay(16)` срабатывает раз в кадр игры (≈29 мс при 4K) — время
переходов в модах считать по `os.clock`, не по числу шагов.
**Без ПКМ лук не натягивается** (настоящий ввод 2026-10-28 19:01, оба вида): ЛКМ (`PrimaryActionV2`) и средняя кнопка (`SecondaryActionV2` —
тяжёлая атака владельца) дают мгновенный выстрел, заряд 0,00; уведомлений `BP_PowerCharge`/`BP_SetChargeHold` при этом нет — монтаж натяжки
играет только в прицельной стойке. Признак начала любого выстрела — стрела на тетиве: снаряд со скоростью 0 появляется за ≈0,4 с до вылета
(без ПКМ) или за ≈1 с (с натяжкой); вылетает уже новый снаряд.
Ширина ленты следа — `ParticleModuleSize_0.StartSize.Table.Values` шаблона (запечено 0,10,0; один модуль на четыре ленты; правится в памяти).
Лента расплывалась к хвосту («разрастается по толщине чем дальше летит стрела»): частицы рождаются в шаре R 3 см
(`ParticleModuleLocationPrimitiveSphere_0.StartRadius`) и сносятся 20 см/с (`ParticleModuleVelocity_0.StartVelocity` 0,−20,0);
`ParticleModuleSizeMultiplyLife_0` — сужение 1→0 за жизнь, не рост. `KrinikArrowAim` обнуляет радиус и снос.
Поломка стрелы при ударе (владелец: «иногда стрелы не втыкаются и исчезают»): `BP_BaseProjectile` — `CanBreakOnImpact`,
`PercentageChanceToBreakOnImpact` (шаблон `BP_Visual_BowProjectileBase`: false / 0.65; у КАЖДОЙ летящей стрелы — true / 0.65, замер 22:39:
две из трёх исчезают; `KrinikArrowAim` ставит false на выстреле); целая стрела при
ударе заменяется воткнутой копией для подбора, сломанная исчезает; попадание туда, куда воткнуться нельзя, — тоже поломка (комментарий в
ассете). След заряженной стрелы — `TracerParticleSystem` (`P_arrow_trail_powershot`: лента + кольца `M_particle_powershot_circles`).
Лента следа — марево (материал `M_particle_weapon_speed_trail_arrow_linger`, `distort` 0.6), не свет: внешний параметр `glow` (8 вместо 1)
делает её «толстой, дымной» (владелец, 22:42); масштаб компонента следа игра сама ставит по заряду (полный заряд — 0,50 к первому тику;
`KrinikArrowAim` ×0,5 → 0,25, замер 22:43:57); 22:46 — в полёте у следа 0,250 при любом заряде (0,00–1,00), а масштаб, поставленный
на первом тике, игра перекрывает позже; шаблон компонента `TracerParticleSystem_GEN_VARIABLE` — 1,000 (не тронут); масштаб и `opacity` компонента игра пишет каждый кадр
(наш 0,062 через 60 мс → снова 0,250 к 100 мс). Кривые в памяти (пульт 22:47): `Curve_BowPowerChargeProjectileTrailSize` 0→0, 0,95→0,1,
1→1; анимация `FadeTrail` — `BP_Visual_BowProjectileBase_C:CurveFloat_1` 1→0 за 20 с (прозрачность следа, правится в памяти:
`FloatCurve.Keys` → `k:get().Value`), `CurveFloat_0` 1→0 за 0,2 с (гашение при попадании); откуда постоянные 0,250 масштаба — не найдено; параметры шаблона — `opacity`, `glow`, `trailstart_*`, `ringsize` (только кольца). Эффекты
лука при заряде: `P_bow_powercharge` (натяжка), `P_bow_powercharge_charged` (золотой свет «заряжено»), `P_bow_powercharge_release`
(выпуск) — параметров яркости нет. Lua-мод в живую игру без перезапуска — пультом `lua dofile([[<Mods>/<Мод>/Scripts/main.lua]])`
(подписку NotifyOnNewObject держать одну через глобальную ссылку на обработчик — так сделан `KrinikArrowAim`).
Ветка сведения в 3.0.1 (2026-10-26): ассет `/Game/Characters/BasePlayerChar` (только в паке игры, ни один мод сборки его не перекрывает) —
`GetProjectileDirection` байткод с `.uexp`+457496 (legacy-вид от `retoc to-legacy --version UE5_7 -f BasePlayerChar`); `JumpIfNot` +5013 (.uexp 462509),
его условие `False` 0x28 на .uexp 462514 — единственный 0x28 в функции; `True` = 0x27, размер тот же. Доставка — свой контейнер с одним пакетом;
путь legacy→zen для блюпринта ломает импорты (build-level-mod.py, 13.09) — нужен перенос zen-куска и записи заголовка без пересборки.
Ветка сведения считает баллистику к точке, а схема владельца 2026-10-27 — прямая без баллистики (`[OWNER]` «балистику свавнер не считает» ·
«это ответственность игрока - брать поправку на баллистику»), поэтому `KrinikArrowAim` 0.3.0 ветку не включает, а направляет стрелу сам.
**Стрельба `KrinikArrowAim` 0.3.0 (2026-10-27):** стрела рождается у гнезда лука и не переносится; на выстреле — щуп из камеры по взгляду
(канал видимости, 100 м, начало — точка луча напротив лука, чтобы препятствие между отодвинутой камерой и героем не давало точку позади),
скорость = прямая «гнездо → точка» + разброс игры теми же углами, родной подъём снят. Замер незаряженной стрелы: вбок −3…+1 см на 5–86 м,
по высоте только падение (−6 см на 5,1 м, −16 на 7,7 м, −26 на 10 м).
**Каналы столкновений на мобе** (пульт, детёныш каппы, 2026-10-27 19:10): канал видимости (`ETraceTypeQuery` 0) попадает в ТЕЛО
`CharacterMesh0`; канал 5 — в капсулу `CollisionCylinder` (радиус 49 см, полувысота 49 у детёныша каппы); каналы 2–4, 6–7 — мимо; 1 и 8 —
только земля; поиск по типам объектов: Pawn — капсула, PhysicsBody — ничего. Профиль столкновений стрелы — «Custom» (отклики по каналам),
`LineTraceSingleByProfile` с ним мобов не видит. Летящая стрела бьётся НЕ о капсулу, а о тело: журнал 19:21–19:25 — «удар в
CharacterMesh0 (SkeletalMeshComponentBudgeted), прицеплена к CharacterMesh0»; канал 5 стрелой не используется. Воткнутая копия —
`/Game/Items/Weapons/BP_DummyProjectile` (поля `HitResultFromProjectile`, `ProjectileVelocityOnImpact`, `PenetrationDepth`, `MyBoneName`
— последнее пультом не читается, TrivialObject); в земле копия ни к чему не прицеплена. `FindFirstOf('BP_DummyProjectile_C')` может
вернуть запасной экземпляр за километры — искать копию по событию появления, не поиском.
Блеск полного заряда — `/Game/Effects/Particles/P_bow_powercharge_charged`: четыре излучателя, стартовый размер 200 / 200 / 40 / 20
(`ParticleModuleSize_0..3`, материалы `M_particle_powershot_charged`, `…_chargedflash`, `…_chargedglow`); соседи
`P_bow_powercharge`, `P_bow_powercharge_release`. Лук берётся в руки событием `InpActEvt_Shortcut0_K2Node_InputActionEvent_25` (ячейка 1).
Удержание прицела после выстрела (0.3.0): перехват `SetFieldOfViewTarget` только смотрит; «был 1, пришёл 0, ПКМ зажата» → на следующем тике
родной вызов `(1)`, полей не пишем. `SetFieldOfViewTarget(1)` вне прицельной стойки обзор не меняет. Застрявший прицельный обзор
(после нашего `(1)` ПКМ отпущена раньше родного возврата ≈0,7 с; `(0)` вне перехода не принимается) снимает родной
`BP_PlayerFovController:FieldOfViewReset()` — пульт 2026-10-27 19:55: 90,9° → 105,8°. **Поправка 20:2x: `FieldOfViewReset` откатывает к
ПРЕДЫДУЩЕЙ цели, а не к обычному обзору** — вызов при обычном обзоре 103,1° дал прицельный 53,8°, второй вызов вернул 107,5°. Звать его «на
всякий случай» нельзя: страж, звавший его по условию, качал камеру туда-сюда. Пульт: события ПКМ
`InpActEvt_SpecialActionV2_…_7` переключают стойку со скрытым состоянием, `_8` не действует — настоящее отпускание пультом не изобразить.
**Монтаж натяжки лука** (кит `F:\CEUE5Devkit`, 2026-10-27 20:1x): `Characters/humans/animations/combat/2h_bow/AM_combat_2h_bow_combo_heavy_c0` —
участки `…_heavy_charge`, `…_heavy_loop`, `…_heavy_fire`, `…_heavy_settle`; слоты `AttackMontageTorso1st` / `AttackMontageTorso3rd` (у первого
лица свой слот торса); уведомления-состояния (`AnimNotifyState`, `Received_NotifyBegin` / `Received_NotifyEnd`) из `/Game/Systems/Combat/`:
`BP_PowerCharge` (натяжка: `SetPowerCharge` / `EndPowerCharge`), `BP_SetChargeHold` (`ChargeHoldEnterFromNotify` — заряд полный, удержание;
на этом отрезке горит `P_bow_powercharge_charged` — событие для звука заряда), `BP_FieldOfViewChangeForDuration` (`BeginFieldOfViewChange`,
`FieldOfViewMod` типа `E_FieldOfViewModifiers`, `Duration` — вероятная причина отъезда камеры на выстреле, п. 34: правка данных монтажа),
`BP_ProjectileAttack`, `BP_AttackRotationSet`, `BP_QueueWindow`, `BP_CancelDodgeWindow`, `AnimNotify_PlaySound`. Данные уведомлений в монтаже
3.0.1 (`retoc-5.8 to-legacy` + `uaj tojson … VER_UE5_8`, 20:19): `BP_FieldOfViewChangeForDuration_C_0` — `EaseIn` 1,5, `EaseOut` 0,1 (остальное по
умолчанию класса) — сужение обзора за натяжку и возврат за 0,1 с на выстреле: это и есть «камера отъезжает при выстреле» (замер 26.10:
53,8° до 100 мс → 88–105° на 200 мс → 107,5° к 300 мс); остальные уведомления монтажа — без своих полей.
**Прогон настоящим вводом 2026-10-27 20:26–20:29** (`_config/mouse-seq.ps1` — SendInput; `fov-sampler.lua` — обзор каждые 50 мс): ПКМ →
53,8° за ≈450 мс; выстрел при зажатой ПКМ → 106° за ≈120 мс, держится ≈650 мс, назад за ≈500 мс (дефект владельца); отпускание в любой момент
→ 107,5° за ≈120 мс, родное залипание не найдено ни в одном стыке. Участки монтажа натяжки: `sc` 0 · `EarlyRelease` 0,16 · `pc` 0,55 · `sl`
1,83 (петля удержания) · `se` 5,83 (выстрел) · `ss` 6,80; уведомление обзора — от 0 длиной 6,08 с, то есть кончается через 0,24 с после
начала выстрела (соседи `BP_CancelDodgeWindow` 7,30, `BP_AttackRotationSet` 7,05). `EaseIn`/`EaseOut` уведомления — форма кривой, не время:
`EaseOut` 3 в памяти не удержал прицел (обзор ушёл за 600 мс вместо 120). Первое лицо — `BasePlayerChar_C:SwitchToFirstPersonCamera()` /
`SwitchToThirdPersonCamera()`; синтетическое колёсико игра не видит; с настоящей ПКМ от первого лица обзор тоже сужается до 53,8°.
Обход `Notifies` монтажа пультом (`ForEach` по структурам) уронил игру 20:29:31 — времена уведомлений читать из выгрузки (`uaj tojson`).
**От первого лица прицел обзор не меняет** (пульт 20:17: ПКМ зажата, обзор 107,5°, камера в точке `FirstPersonCameraArm` и `b_headcam`) —
всё, что в моде привязано к `SetFieldOfViewTarget`, от первого лица не срабатывает; признак стойки там — ПКМ или уведомления монтажа. Обзор через прицел —
`AO_combat_2h_bow_aim_fullbody` / `…_aim_head` (сдвиги прицеливания вверх/вниз 90°).
Стрела на тетиве (пульт, 2026-10-27 20:12): прицеплена к сокету героя `Socket_Bow_Arrow` (сторона лука), не к руке; в натяжке при ходьбе
её ось отклонена от линии «правая рука → лук» на 24,7°, до руки 35 см — древко проходит сквозь рукоять (п. 44). Сокеты героя: `Socket_Bow`,
`Socket_Bow_Arrow`, `Socket_xbow_bolt`, `b_R_hand`, `b_L_hand`, `b_headcam`. Камера от первого лица — в точке `FirstPersonCameraArm`
(`bUsePawnControlRotation` true; `SocketOffset` сдвигает её в осях взгляда).
Пульт: чтение `RootComponent` у удаляемой стрелы уронило игру в UE4SS (19:11:54, чтение 0x18) — у актёров снарядов поля читать только после
`IsValid` и не в момент их уборки.
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

Лук и камера (замеры 2026-10-28, `_config/fov-sampler.lua`): от первого лица камера на штанге `FirstPersonCameraArm` у головы, и поза
выстрела опускает её вместе с головой на 10–11 см (покой 73,9 см над героем, поза 63,0–63,6); `KrinikArrowAim` возвращает высоту сдвигом
штанги (`fp_hip_offset` Z 11). Обзор лука ведёт `BP_PlayerFovController`: цель 0/1 (`SetFieldOfViewTarget`), уведомление монтажа
`BP_FieldOfViewChangeForDuration`; при новом натяжении с зажатой ПКМ монтаж перезапускается, и между концом старого уведомления (цель 0) и
началом нового (цель 1) проходит кадр — без удержания обзор успевает отъехать 75° → 80,8°.
Монтаж натяжки `AM_combat_2h_bow_combo_heavy_c0` (7,05 с, кит, 2026-10-28): `BP_SetChargeHold` 0,517 (1,333 с) и 1,851 (3,963 с — полный
заряд), `BP_PowerCharge` 0,552 (1,28 с), выстрел `ProjectileAttack` 5,865, `BP_QueueWindow` 6,346. Монтаж общий с NPC-лучниками: звук,
положенный в монтаж, слышен и у врагов — «дзинь» полного заряда `KrinikConanArchery` играет герою из Lua, уведомление в монтаже немое.
Опыт: `BP_ProgressionSystem` — `ExperiencePoints` (весь), `LevelStart`, `LevelEnd`; HUD Hosav показывает весь / `LevelEnd` (остаток), окно
персонажа (`W_PaperdollPanel`) — родной шаблон `ST_UI_GeneralText` / `Level_ExpandedDetails` «({Percentage}% {CurrentXp}/{MaxXp})», значения внутри
уровня, формируются кодом (2026-10-28).
Lua-моды UE4SS ждут только отложенными действиями игрового потока (`ExecuteInGameThreadWithDelay`): рабочий поток задержек роняет игру (баг 66).

## Где наши моды встают в игру

| Мод | Точка | Как |
|---|---|---|
| `ConanCameraControl` | штанга камеры героя, контроллер (дистанции взятия) | Lua UE4SS; сторож зума 30 мс (план 34 — переписать на события) |
| `KrinikPauseGameInMenu` | `GUIModuleController:ActivateModule` | перехват + опрос 250 мс |
| `KrinikHudOutline` | `TextBlock` в `W_NewHealthUI_C` (HUD Hosav) | обводка шрифта на новом HUD |
| `KrinikLevelUncapped` | таблицы уровней игры | пак-подмена ассетов, без кода |
| `KrinikAgentRemote` (прибор) | `cmd.txt` → игровой поток | страж `no-component-sweep`: перебор компонентов отказывает (EXP-0330) |

## Facts of 2026-10-29 (camera, Severe Weather, widget events, stuck arrows)

- **First-person camera and the neck.** The FP camera sits on bone `b_headcam` (child of `b_head`, `b_neck_2`, `b_neck_1`; hero mesh 174 bones). Looking straight up it is inside the neck. `Mesh:HideBoneByName('b_neck_1', 0)` hides the neck and head in rendering only; the `b_headcam` socket does not move (equal to 0.01 cm). `ConanCameraControl` does it on `BasePlayerChar_C:SwitchToFirstPersonCamera` / `SwitchToThirdPersonCamera` (the real wheel calls them). In this mod `NotifyOnNewObject("/Script/ConanSandbox.BasePlayerChar")` does not fire; hooks on the hero class go in from `try_install_zoom_hook`.
- **Severe Weather night light.** `dc SW_config disable_custom_GI` → `SW_DataCmd_Actor` (string switch) → `SW_ModController` event «SW_config light»(False); the variable `light enabled` (default True). **Corrected 2026-10-29 11:42:** the console `dc SW_config …` does not reach the mod at all (the variable does not change, also as admin) — the 2026-10-26 «disable_custom_GI подан пультом» changed nothing. The event «SW_config light»(Visuals) sets `light enabled` and marks the controller's `PersistenceComponent` dirty (meant for the world save); call it by the remote: `local c=FindFirstOf('SW_ModController_C'); c['SW_config light'](c, false)`. A loop (Delay 1 s) applies the mod light to `Ultra_Dynamic_Sky_BP_C` only while `light enabled`. Night brightness at 23:11, same pose: mod light 21, vanilla 41. The pack ships `light enabled = False` (KRINIK MODIFIED).
- **Widget creation events.** `NotifyOnNewObject` works for widget BP classes: `/Game/Mods/UIMod_Hosav/W_SmoothHP.W_SmoothHP_C` (fires per object, templates too, 1–3 ms of work each), `/Game/UI/Widgets/MainMenu/W_MainMenu_MainMenu.W_MainMenu_MainMenu_C`. Costs on the game thread (remote, 2026-10-29): `FindFirstOf(<class>)` 3 ms, `FindAllOf(<class>)` 2 ms, `FindAllOf('UserWidget')` 1928 objects 5 ms + `GetFullName` loop 21 ms, a full read of `ConanSandbox.log` (2 MB) 30 ms.
- **Stuck arrows.** The game attaches the stuck copy `BP_DummyProjectile_C` to the hit bone itself (socket = `HitResultFromProjectile.BoneName`, e.g. Kappa `rig_bone_L_leg_J01`); the copies are removed within ≈ 20 s. Aimed at the Kappa's capsule centre, the arrows hit the left-leg body.
- **Quick-loot rows.** `W_QuickLootPanel` → `WidgetSwitcherTooltips` takes the widest child: action row `LootActionTooltip` 650, navigation row `NavTooltip` («F Забрать · Q … · Esc Отмена») 519, grid 645 — the window width does not change between the rows.
