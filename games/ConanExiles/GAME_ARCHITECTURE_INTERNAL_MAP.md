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
| Камни, волокно — экземпляры растительности | `/Script/ConanSandbox.EnvironmentFunctionLibrary:PickupGatheringOneInstance(WorldContextObject, Actor, Controller, Eye, ViewDir, TraceLength, TraceRadius, out OutFoliage, out OutInstance) → bool` — static, called from Lua (2026-11-02, bug 77); `UpdateHighlightTarget` passes Eye = active camera (`AdjustableCamera` 1st person / `CameraThirdPerson`) + forward × `InteractionDistanceThirdPersonBonus` (0 / arm length — written only at the E press), ViewDir = camera forward; true → `ServerSetHighlightedObject(foliage, instance)` | `PickupInteractionDistance` 25 (+ our camera mod's bonus → 90), `PickupTraceSphereRadius` 200; 0.089 ms a call |
| Foliage pickups — what they are (2026-11-01 21:2x–21:4x, plan 42) | 16 `InstancedFoliageActor`s near the oasis (iterate `FindAllOf`, never `FindFirstOf`); 694 foliage components, 281 of class `PickupFoliageComponent_C` = 55 meshes (rocks, branches, fibre, berries, herbs, algae, fungi, `SM_grub`, eggs, feathers, cobweb); collision QueryOnly, object type 22; NO physics overlaps or overlap queries ever return them (trigger, sensor, `SphereOverlapComponents` — 0); the native `GetInstancesOverlappingSphere(centre, r, true)` finds them (≈ 9 µs a component; indices via `r[j]:get()`; `GetInstanceTransform(idx, t, true)` → `t.Scale3D` 0 = already taken) | the game's own search at E (CORRECTED 21:53 from the camera mod's `update_interact_reach` notes): it starts at «camera + view × spring-arm length» (at the hero), runs `PickupInteractionDistance` (90 = 25 + the camera mod's margin) and takes a sphere `PickupTraceSphereRadius` 200 — so E takes off-aim near the hero; `GetLineTraceStartAndEndFromCamera` starts at the camera itself and is NOT that probe; the «E Взять» prompt copies it (`krinik_pickup_prompt.lua`). A sweep of `LineTraceSingle` over channels 0…31 crashed the game (EXP-0433) |
| An enemy's health bar and name over its head (2026-11-03 23:2x, bug 64 items 12 / 12a) | the GAME's own widgets on the character, as `WidgetComponent`s: `HealthbarComp` → `/Game/UI/HUD/FloatingNames/W_EnemyHealthbar.W_EnemyHealthbar_C`, `FloatingName` and `FloatingName2` → `W_FloatingName_C`; the bar's component stands ≈ 33 units above the `b_head` bone (a summoned «[Fighter]»); the bar's tree: `VerticalBox_1` → `Container_Bars` · `Container_Skull` · `Container_Buffs` (`ConanExiles/_config/devkit/kit-probe-tree.json`) | read by `actor:K2_GetComponentsByClass(StaticFindObject('/Script/UMG.WidgetComponent'))` → `c:GetUserWidgetObject()` (no component sweep — EXP-0330) |
| Eggs among the foliage pickups (2026-11-03 23:1x, bug 82) | over ALL loaded `InstancedFoliageActor`s the only egg mesh is `SM_SnakeEggs_single` (`PickupFoliageComponent_C`, 57 instances); the game's probe and our «E Взять» see it (seen at −62077, 254132). Nest eggs (ostrich / birds) are NOT foliage — another object kind, not read yet; the ostrich-nest canyon (−61703, 268654) had no egg and no nest actor within 25–30 m | an instance's place: `c:GetInstanceTransform(i, t, true)` fills the Lua table `t` (`t.Translation`, `t.Scale3D`; scale 0 = taken) |
| When the game looks for a pickup (hooks on `FunCombat_PlayerController_C`, the owner pressing E on a stone, 2026-11-01 21:20) | ONLY AT THE PRESS: `UpdateHighlightTarget` 1 call, `OnClientInteractWithHighlighted` 2, `OnServerInteractWithHighlightedSimplePress` 2, `Server/ClientSetHighlightedObject` 1; while merely looking at the stone — nothing but `CleanUpHighlightedObject` every frame (4207 calls in ≈ 70 s) | that is why no «E» prompt exists over foliage: before the press the game does not know a pickup is under the crosshair; the pickup search IS callable from Lua — the static `EnvironmentFunctionLibrary:PickupGatheringOneInstance` (row above; «not a UFunction» of 2026-11-01 corrected 2026-11-02) — plan 42 |
| Stones by the remote (2026-11-01) | `StaticFindObject('/Script/Foliage.FoliageInstancedStaticMeshComponent')` → `ipairs(InstancedFoliageActor:K2_GetComponentsByClass(cls))` | 684–692 components in the oasis; `FindAllOf` by this class name or by `HierarchicalInstancedStaticMeshComponent` ends the call. **An element of the returned array must be unwrapped: `local c = arr[i]:get()`** — without it every method and `StaticMesh` read fails (the morning's «mesh not readable» was this; corrected 12:4x). Then `c.StaticMesh:GetFName():ToString()`, `c:GetInstanceCount()`, `c:GetInstanceTransform(k, t, true)` (t.Translation, t.Scale3D) work. **Pickable stones** = mesh `SM_rock_small01…04` in components named `…PickupFoliageComponent_C_<n>` (≈ 15–16 k instances each mesh); a picked stone keeps its index with scale 0. `AddInstance` on such a component returns −1 (no new pickable stone). **Stand (case R2, 2026-11-01 12:4x):** list the nearest `SM_rock_small*` instance with scale > 0, put the hero 2 m east (`K2_SetActorLocation`, Z + 100), aim by `SetControlRotation` from `PlayerCameraManager:GetCameraLocation()` to the instance (+10 Z), real E by `mouse-seq.ps1`; picked = weight +0.06 (`GetFloatStat(12, 0)`) and the instance's scale → 0. **Teleport only next to a found instance (its Z + 100), never to a computed spot:** 2026-11-01 22:20 a spot «no pickup within 5 m» 8 m from the stand lay under the oasis ruins — the game's `UndermeshDetectionSubsystem` lifted the hero 10 m and held its in-game loading screen 90 s («Delaying playing state» → `RemoveIngameLoadingScreen`); the crosshair widget is re-created after it |
| Проверка после попадания | `InteractionLenientDistanceCheck(ImpactLocation)` | расстояние точка ↔ ГЕРОЙ < `dw.BaseLenientInteractionDistance` 500 |
| Окна в мире | `BasePlayerChar_C::WidgetInteraction` на `CameraThirdPerson` | дистанция = штанга + 500, игра пересчитывает сама |
| Постройка | `BasePlayerChar_C::BP_BuildSystem_v2` (`BuildSystemComponent`) | `m_BuildRange` 2000, `m_DestructRange` 5000, `PlacementGhostRadius` 600 — от камеры или от героя, не проверено |
| Приказы рабам | контроллер | `CommandRange` 3000, `CommandTargetTraceRadius` 50 |
| `TraceOrigin` | стрелка на герое, `CollisionCylinder` + (0, 0, 82) | перенос её на камеру ломает взаимодействие от третьего лица полностью (опыт 2026-10-26) |

Все дистанции «от камеры» рассчитаны на родную камеру в 200 см (`ThirdPersonCameraDefaultTargetArmLength`; диапазон 130–250). Мод камеры, который
отодвигает камеру дальше, обязан удлинять их на столько же: `KrinikConanCamera` → `update_interact_reach` (надбавка и поиск камней,
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

Reading the rows live (2026-10-31 16:20): `StaticFindObject('/Game/UI/Data/DataTables/DT_UIModuleTable.DT_UIModuleTable'):ForEachRow(function(name,row) … end)` —
255 rows (`GetRowNames` is not exposed to UE4SS Lua — fails). Map / minimap / meter modules: `FullscreenMap`, `PlayerMarkerDialog`, `SM_Minimap`, `SM_UI_Settings`,
`SM_Tutorial`, `SM_MarkerTutorial`, `SM_UI_CustomMarkerMenu`, `SM_UI_AddMapMarker`, `SM_DEBUG`, `WSEMap` (Waystones map), `DN_UI_DmgWidget` (opens but does NOT
expand the collapsed meter — the player expands it by holding F1 and clicking its expand button; the meter's notes `games/ConanExiles/mods/DamageNumber.md`), `DN_UI_Settings`, `DN_UI_ColorPicker`, `DN_UI_FNContainer`, `DN_UI_FakeEmpty`; no row for Edit Appearance.

255 строк живой таблицы `/Game/UI/Data/DataTables/DT_UIModuleTable` — имена модулей (игра + моды: `CharacterInventory` — хаб, `IngameMenu`,
`HosavHUD_EnemyHealthbar` — полосы здоровья врагов Hosav, `SML_ModList`, `DN_UI_DmgWidget`, `ExilesFishingTuning`, `EAA_*` …). Открыть модуль
прямым вызовом: `FindFirstOf('GUIModuleController'):ActivateModule(FName('CharacterInventory'), true, false)`; `false` вторым
аргументом — закрыть. Меню паузы — `IngameMenu` (с ним открывается панель Simple Modlist). Окна настроек модов открываются консольной командой
пультом: `exec dc PIFCSettings` и т. п.; консоль игры 3.0.1 — `~` (на русской раскладке Ё) и F10 (живые `InputSettings.ConsoleKeys`:
Tilde, ё, F10).

Вкладки хаба (снято 2026-10-26): Q/E = `W_Carousel_C:NextCarouselWindow()` / `PrevCarouselWindow()` (пультом, без клавиш). Вкладку «Снаряжение»
выдаёт модуль `XCS_Panel` (боковая панель «Моды Xevyr»): открыт с хабом на «Снаряжении», закрывается при уходе на другую вкладку. Окно модуля —
`XCS_W_Container_C` (`WindowRoot`, класс `/Game/ModsShared/Xevyr_Shared/CommonSettings/XCS_W_Container`): создаётся заново при каждом входе на «Снаряжение»,
после события модуля; внутри `MenuContainer` — красный язычок и выезжающий список четырёх модов Xevyr (кнопки `XCS_W_BasicButton_C`, поле `Payload` — имя
модуля окна). Нижняя панель хаба — ванильный `ButtonBar` в `Overlay_0` окна `CraftingGUI_C` (`ButtonContainerRight`: «Закрыть»; на «Талантах» слева —
«Показать контент из DLC»). С 2026-11-01 в ней одна кнопка модов — «Настройки модов» со списком (`KrinikConanUI`, раздел `krinik_mods_button`); боковая
вкладка Xevyr свёрнута (перехват `Construct` её окна), кнопка Hosav `W_UI_SettingsButton` свёрнута, кнопка Exiles Fishing не вставляется (её `Graft` не
зовётся). Раньше: Hosav — отдельный виджет поверх экрана с опросом `Delay 3.0` (в сборке заглушён); Exiles Fishing `W_EFT_AdminButton` — в
`ButtonContainerRight` функцией `BPC_EFT_Tuning.Graft` по таймерам 0.3/0.5 с. Esc в окне мода поверх инвентаря оставляет инвентарь, только когда строка
модуля — категория Modal И `CloseOnESC` true (2026-11-01; правка строки на лету действует только на ещё не созданный модуль). Окна настроек модов — модули `DT_UIModuleTable` (`DN_UI_Settings`, `SM_UI_Settings`, `PrP_Settings`,
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
**Item table field `RepairXP` (read 2026-11-06 over the 3.0.1 `Items/ItemTable`, 5 821 rows):** non-zero in 2 930 rows; the vanilla maximum is 2000 (tier-5 armour
almost all 2000; tier 1 median 472, tier 2 — 1004, tier 3 — 1848). **Meaning — Funcom's own modding wiki, «Item Table Primer», section «Durability»:
«Repair XP - How much XP you get from repairing the item.»** (https://conanexiles.com/wp-content/wiki/3051061965.html, read 2026-11-06 09:55; the same page
describes every column of the item table — the reference for any item field). Corrected the same minute: my 09:53 guess «XP for crafting» (from Essence of Rot
carrying 2000 — a value on an item nobody repairs, a data quirk) was wrong. Our XP curve to set it against: `KrinikConanGameplay` 500 × level^0.5 per level (≈ 4 240 at
level 72, ≈ 7 070 at 200), `PlayerXPRateMultiplier` 1 in the 3.0.1 `ServerSettings.ini`.
**The other interaction prompts (kit probe `kit-probe-tree.py`, 2026-11-06, bug 83).** Besides `WBP_ContainerInfo` (corpses, chests, crafting stations, a
campfire) the game draws five sibling prompts from `/Game/UI/HUD/FloatingNames/`: `W_DialogueNPCInfo` (an NPC to talk to: `T_Name`, `T_Title`, `T_State`,
`ActionTutorial`), `W_PlaceableInfo` (a building / placeable: name, owner, bound player, decay), `W_SimpleInfo` (a simple object: name + action), `W_ThrallInfo`
(a thrall: name, title, owner, state), `W_DBNORevive` (a downed ally: «Revive» / «Revive and Follow Me»). One shape for all: root Overlay → SizeBox (centre,
centre) → Border `Container` (the dark backing, brush colour alpha 0.6 in vanilla) → VerticalBox (padding top/bottom 12) → texts and the shared
`W_ActionTutorial`. `W_OnScreenInfoContainer` has an empty designer tree (it switches the modules by name). None of the build's paks overrides them
(`mod-overrides.py` over the game's Mods, 2026-11-06). Stand (bug 83): a talkable NPC by the oasis — `BP_HumanoidDialogueNPC_C` «Поборник Внешней тьмы»
(take the NEAREST: several live in the world, one 4.5 km off); the prompt shows only within ≈ 3 m — hero `K2_TeleportTo` 2 m off, `SetControlRotation` toward
it, a real Shift tap and the game held in front; any of the five prompts by code — `_config/info-open.lua` (`_G.__io_w`, `_G.__io_actor`, read-back by `_G.__io_read`).
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
3.0.1 (bytecode 2026-10-30): the falling check is `InSubstate(8)` at `.uexp`+66573 of `BaseBPCombat::ActionTry`; `HandleOnMovementModeChanged`
fires at take-off (mode 3, twice) and at landing. A jump during an attack: `BasePlayerChar::CanJumpInternal = Super() AND NOT InSubstate(13) AND
NOT IsAttacking()` (a bow draw is an attack), `StartJump` itself refuses on substates 18 and 14 (exhausted) and on `CanJump`. UE4SS: hooks on
blueprint functions run AFTER the body (a fix inside `ActionTry` comes too late); `CanJumpInternal` is called from C++ — a hook on it never fires.
Climbing (remote recon 2026-11-02 14:1x, for the owner's 09:07 request «кнопка Прыжок должна выполнять прыжок героя прямо из состояния ползания … чуть-чуть отталкивается … в направлении вектора нормали, и немножко - вверх»): the climb is NATIVE — `ConanCharacterMovementComponent` (`p.CharacterMovement`): functions `ExitClimbing`, `OnClimbingTakeDamage`, `ClientTookClimbingDamage`; fields `CurrentWall` (struct — the wall, its normal expected inside; read it WHILE climbing), `ClimbDirection`, `HoldToClimb` false, `HoldingClimbButtonTime` 0.075, `ClimbingDamageCooldown` 2.0; on foot `MovementMode` 1, `CustomMovementMode` 0 (the climbing value — read while climbing). The hero BP: `AddClimbSpeedModifier`, `ApplyNewClimbMovementSpeed`, `ReceiveClimbingStaminaCostModifier`, `WasThirdPersonBeforeClimbing`. Way for the request: the jump hook KrinikConanGameplay already has (`StartJump`, below) — while climbing: `ExitClimbing()` then `LaunchCharacter(normal × small + up × small)`; first a remote read of `CurrentWall` and the movement mode with the hero on a wall (needs real input to start climbing). Tried 14:07: yaw 0 by the remote, `mouse-seq` W 0.9 s + Space + W 1.5 s at the rock of `SM_Nest_ostrich` — no climb (mode 1, custom 0); next — a tall wall right before the hero (a line trace to check the distance) and the owner's own climb key.
Working route (KrinikConanArchery 0.7.0): at take-off `ExitSubstate(8)` for the player with the bow in hand; after a refused `StartJump` while
attacking with the bow — `LaunchCharacter(0, 0, JumpZVelocity 420)`. Out params from Lua: `local o = {}; c:InSubstate(s, o); o.Success`. Bow in
hand = an attached `BP_bow_2h_C` on `Socket_Bow` (on the back — `sheath_bow`).
Stand note (2026-10-30): at the owner's oasis save a hostile boss `HumanoidNPCCharacter_20percentbigger_boss_C` spawns near the hero with a random
name («Цирия Безголовая [Боец]», «Арнос из Киммерии [Боец]» — a skull by the health bar = hostile, NOT a thrall); kill it by the remote
(`KillCharacter`) before any shooting case.
Screen placement of the module (2026-10-28 23:50, pult): `WBP_ContainerInfo_C` has NO UMG parent (outer = the game instance) — the module
system places it itself from its desired size AT ACTIVATION; a later visibility change of `W_QuickLootPanel` (native `SlotTakeAll` writes
Hidden = 2 on the same instance; class default is Hidden too) does not re-place it, even when set Collapsed (overlay shrinks to 1141×144, strip stays).
Native class chain of the panel: `W_QuickLootPanel_C` → `QuickLootPanel` (`SlotTakeAll`, `SlotTakeOne`, `SetActor`, `UpdateTooltip`, `m_Actor`) →
`RootWidget` → `UserWidget`. Hotkey icons (`UI/Framework/W_HotkeyIcon`, native `HotkeyIcon`): HBox binding-name text · `TextBlockHoldPrompt`
«(удерживайте)» · primary/secondary icon; the hold prompt is switched natively by the action's long-press flag and per instance by
`HoldPromptVisibility` (default 3; 1 hides it); also `ShowOnlyText`, `BindingLabel`, `NoPresentationVisibility`.
Loot change event (2026-10-29 00:2x, counters on nine candidates around a REAL Q hold): only the native `QuickLootPanel:SlotItemAddedOrRemoved`
fires (UE4SS hooks it); the blueprint `HandleInventoryChanged` / `HandleLootContainerInventoryChanged` of `WBP_ContainerInfo` stay silent on a corpse.
**When the quick-loot window opens (corrected 2026-11-03 20:0x):** by itself when the crosshair is on a corpse that HAS LOOT of its own — `[OWNER]` 2026-11-03
19:55 «убиваю кого-то, например, дикаря. и навожу на труп прцелл - окно само открывается» · 20:04 «окно квиклута показывается. когда есть что залутать из
трупа»; a beast corpse (a Kappa — harvested, no loot) never opened it on any of nine stands of 19:22–19:50, not even with items put in by
`AddItemTemplate` (`corpse-fill.lua`). The Shift tap of the 2026-11-02 recipe does NOT open the window — it WAKES THE IDLE CAMERA: after ≈30 s without real input
the game's idle camera ignores `SetControlRotation` until a real key (line «The game's idle camera» below); most likely why the remote aims of 2026-11-03 19:2x–20:5x missed (inferred, NOT measured)
(corrected 20:5x — the 19:5x note «the Shift recipe is wrong» was itself wrong). Stand rule: a HUMANOID
enemy corpse (it carries loot), never a beast; or `strip-open.sh` (the strip opened by code also shows the window). Spawning: `CheatManager:Summon` of the bare
`/Game/Characters/NPCs/Humanoid/HumanoidNPCCharacter.HumanoidNPCCharacter_C` gives a template NPC titled «[Fighter]» in English (no table row — not a build
defect); an NPC teleported from an UNLOADED area and killed at once falls through the ground (its body at z −44718 over ground −19850).
**The quick-loot grid and its rim (2026-11-03, bug 75):** `W_QuickLootPanel.InventoryGridView` = `InventoryGridView_C` (6 × 3, `m_HideEmptySlots` true,
`EnableNavigationWrap` false) → `SizeBox` → `ScrollBox` → `InventoryBox` → CanvasPanel `ItemGrid` with 18 POOLED `InventoryGridSlotView_C` cells (pools
`m_GridSlotViewPool`, `m_ItemIconViewPool`; a rebuild re-places them — canvas order ≠ place, read `Slot:GetPosition()`, steps of 100). The selection rim is
the cell's `SelectIndicator` (Border, visibility 3) whose render opacity the cell's animation `AnimSelect` (0.3 s) drives. An F take rebuilds the grid
natively and walks the selection: the walk's last cell keeps a full rim ≈ 250 ms (the owner's «прыгает в нижнюю правую»), then the rim lands on the item that
slid into the taken place — vanilla (control B2); our `krinik_loot_rim` hides the other rims meanwhile. `QuickLootPanel:SetActor` fires EVERY frame while the
window shows (270 calls in a minute) — never hook it for work. Every panel bound to the same corpse inventory (a code-opened strip too) gets the slots.
`UE4SS.log` is written with a delay of up to minutes (EXP-0453).
**The aim for a corpse stand (2026-11-03 21:2x):** the hero 1.5 m from the body (from 3 m the window never opened); a real Shift tap; the view from the HERO
toward the body at pitch −40; the game in front; `aim-sweep.lua` until the game shows the strip — `_config/loot-aim.sh` (EXP-0454).
Quick-loot input (bug 75 stand, 2026-11-02): the CELL is chosen by the WHEEL
(`QuickLootCycleSelectionNext = MouseScrollDown`, `…Prev = MouseScrollUp`), F takes the chosen stack, Shift is «Перейти» (to the inventory). Corpse skeleton
bones are `b_root`, `b_pelvis`, `b_spine_1…` (170 bones on a humanoid); the mesh root lies at the feet, `GetSocketLocation(FName("pelvis"))` returns the root.
Items into a corpse's loot: `Corpse_C.ItemInventoryReplicateToAll:AddItemTemplate(id, −1, None, n, true, 1, 0)` (`_config/corpse-fill.lua`).
`Overlay_Main` of `WBP_ContainerInfo` spans the whole screen: a slot alignment there is relative to the SCREEN edges.
Corpse prompt text: vanilla target `Exiles_UI`, key `DA4E821B4EE35B69F5E9128CF11CB58F` «Разделайте труп и получите ресурсы или нажмите {0}, чтобы
забрать предметы»; the widget lays it out as one row «text · key icon · text» (a `\n` inside breaks only the first piece).
The row is `ActionTutorial` = the shared `/Game/UI/HUD/Notifications/W_ActionTutorial` (exports read 2026-10-30 16:2x: `HorizontalBox_0` → `PreText` ·
`Icon` · `PostText`, no BP functions — the game cuts the localized string at `{0}` natively), inside the strip `WBP_ContainerInfo` (`Border_Underlay`
→ VerticalBox `Content`, texts `T_Name`, `T_Type`, `T_State`, `T_Decayed`, `Text_Owner`; BP functions `SetCorpseText`, `UpdateInfo_CorpseBase`, `SetState`).
Killing an NPC for a corpse stand: `KillCharacter` is a function of the character class `/Game/Characters/BaseBPCombat.BaseBPCombat_C` — an ANCESTOR
of every character (`BasePlayerChar_C ← BaseSurvivalChar_C ← BaseBPCombat_C`, line ≈228), not a component (params HitLocation byte · killerNameInput Text ·
killer Object · OverridingCauseOfDeath STRUCT · StateChangeDelay float · DamageCauser Object). The 10-28 way works: on the live NPC itself
`npc:KillCharacter(0, FText(''), hero, {}, 0.0, hero)` (case R1). The 2026-10-30 16:20 crash came from MY loop `FindAllOf('BaseBPCombat_C')` + `GetOwner()` on
every result, class defaults included — the EXP-0386 class, not the `{}` (EXP-0387). A hostile boss `HumanoidNPCCharacter_20percentbigger_boss_C` spawns
near the hero at the owner's oasis save (line ≈110) — a ready corpse source.
Changing the shared row's layout changes every action prompt of the game. The two-line corpse prompt (W6, done 2026-10-30 18:5x): the slots of
`W_ActionTutorial` are `PreText` justify RIGHT · VAlign Center, `Icon` and `PostText` VAlign Center (kit probe); our kit pak puts `Icon` and
`PostText` at the BOTTOM (icon bottom padding 1 keeps one-line prompts within 1 px; measure the key plate by its edges — `_config/plate-measure.py`) and the override row breaks the string before «или» — line 2 then
reads «или нажмите [E], чтобы забрать предметы», line 1 stands above it right-aligned (frame P1). The icon ≈20 units, a text line taller; the
viewport scale at 4K is 2.09. The remote cannot read widget sizes now (`GetDesiredSize` and `GetCachedGeometry` are not callable from Lua, 2026-10-30) — measure by frames. Our `Game` target
overrides a vanilla key when the entry carries the vanilla hashes (`_config/devkit/vanilla-override.py`, proven 2026-10-29 00:34).
Crosshair (`/Game/UI/Widgets/HUD/Reticles/WBP_Crosshair.WBP_Crosshair_C`): the spread bars (curve `C_CrosshairAccuracyAlpha`) show as soon as a bow
is in hand, before any draw — zeroing the curve keys hides them at once.
Bow shot effects (vanilla, control runs 2026-11-02 12:32–12:37): full draw → `P_bow_powercharge_charged` at the hand; the release → `P_bow_powercharge_release`
on `b_R_prop` (its emitter E0 is disabled in the game's own asset; E1 white 0.15 s showed no pixel when spawned before the camera) and the arrow's tracer
`P_arrow_trail_powershot` (E0–E3 ribbon trail, E4 the rings `M_particle_powershot_circles` — rings round the arrow, then a dome over it). In the aim view of our
camera the hand and the bow's lower part sit under the quick bar at the screen's bottom edge. Detail and the open question (the owner's «sprite by the bow») —
`games/ConanExiles/mods/KrinikConanArchery.md` → Open.
Bow string (2026-11-02 13:4x, the remote): the string is the BOW's own animation — `BP_bow_2h_C` → `SkeletalMeshComponent` in single-node mode (`AnimSingleNodeInstance.CurrentAsset`), driven by the hero's montage `AM_combat_2h_bow_combo_heavy_c0` notifies through `AB_human_male_C` (`AnimNotify_bow_secondary_draw` @0.067 → `A_combat_bow_string_heavy_charge` 1.833 s; `…_loop` @1.833 → `…heavy_loop` 4 s; the shot → `…heavy_fire` 0.967 s; `…_settle` @6.843 or a plain RMB up → `A_bow_3rd_secondary_special_settle` 0.667 s). A draw started at low stamina is cut at 0.41–0.46 (substate 14, before the charge hold at 0.517) and nothing settles the string — it froze drawn (bug 76, fixed in KrinikConanArchery). End-of-attack event: `/Game/Characters/BasePlayerChar.BasePlayerChar_C:OnSubstateChanged_Attacking(SubState, Entered)`.
Bow combat-ready stance (vanilla, no paks, 2026-11-02 13:20–13:21): after ANY draw (a plain one or one broken by stamina) the hero holds the bow horizontal **CORRECTED 2026-11-02 13:5x: the conclusion above was drawn from BEHIND and is WRONG for the owner's case — his front frame shows the string frozen at the drawn point (a triangle to the chest, hands on the grip): the bow's string animation `A_combat_bow_string_heavy_charge` stuck on its last frame after a draw cut by exhaustion; fixed in KrinikConanArchery (bug 76, B1–B3 pass). Vanilla from the front — not checked.**
before him with the string at his right hand for ≈ 10–11 s after RMB up, then lowers it (left hand, slanted, string straight) — it looks like a drawn string
(bug 76). A stamina break mid-draw: `AdjustStaminaCurrent(-200)` (HUD −60/99); the draw cost per hold — `ReceiveChargeHoldStaminaCostModifier`. Without our
mods the game shows the modal «Играть без подключения» after world entry (a click on «Подтвердить» closes it). Hero inventory edits by the remote:
`p.ShortcutBarInventory:RemoveItem(<slot index>, FName("None"), nil)` (params Index, Context, ObserverAlreadyUpToDate); `BackpackInventory` is an `ItemInventory`
with `RemoveItem`, `DropItem`, `GetItemCount`.
Hosav numbers («k», «M») — `games/ConanExiles/mods/UIMod_Hosav.md`.
**Palm-leaf shadow flicker, proven 2026-11-07 17:0x–17:5x (bug 67, clean stand):** leaflet shadows pop only when the sun light's DIRECTION changes AND the leaves move in
the wind together (turning 0.0025 at wind 0.18–0.20: 8–11 % of sand pixels blink, 17–20 % at 0.23–0.27, 1–2 % at 0.15–0.17; still sun 0.03 %; still sun with
`r.Shadow.Virtual.Cache 0` 0.01 %); the weather moves `MPC_BiomeSettings.WindIntensity` 0.15–0.27 (`_config/wind.lua read`); **root cause (18:54): `M_Foliage`
`MaxWorldPositionOffsetDisplacement = 0` and the palm MIs do not override it — Nanite pads no WPO into the leaf cluster bounds, so a re-cull under a turning sun drops
wind-displaced leaflets on some frames; the hero, trunks and rocks (no WPO) never blink.** The property is writable live by UE4SS; proxies take it after `r.Nanite 0` → `1`; Nanite buffers ×2, `r.Shadow.NaniteLODBias 0`, `QualityScale.MinQuality 1` — no effect;
finer VSM bias −2/−3 halves it. `r.Nanite 0` leaves the palms a bare trunk in the shadow (the Nanite fallback has no crown). `r.Shadow.Virtual.Visualize` /
`ShowFlag.VisualizeVirtualShadowMap` draw nothing in the Shipping exe. **Nanite streaming pool** `r.Nanite.Streaming.StreamingPoolSize`: 512 MB live (device profile
Windows_HighVRAM), resizes at runtime (a resize flushes the pool); **2048 = fatal crash** («must be smaller than the largest allocation supported by the graphics hardware
(2048MB)», NaniteStreamingManager.cpp:640, 2026-11-07 17:39) — keep it ≤ 1536 on this RTX 5070 Ti. **RenderDoc** captures the Shipping exe (DX12, ≈ 5 GB per frame at 4K)
but the build carries no GPU markers and no resource names — a frame is 20 k anonymous actions (`_config/rdoc/`). Live now: `SolarUpdateAngleDelta` 0.0025 in the pack (the owner's smooth sun, 2026-11-07 16:12).
Sun and shadows (history below — 0.003 was set for a smooth sun, then 2.0, now 0.0025): `DynamicSky.SolarUpdateAngleDelta = 0.003` (game 0.015) turns the sun light ~50×/s; live `2.0` (light turns in steps
seconds apart) — the owner under palms 2026-10-29 00:46: «ну сейчас словно тени в порядке»; back at 0.003: «да, вернулось». The pack carries 2.0
(bug 67; 2.0 written, reverted once for the smooth sun, then 2.0 by the owner's final choice 2026-10-29 01:10 — no cvar keeps 0.003 smooth without the redraw); the game log shows the quality group 0.015 first, then ours.
Stand rule (2026-10-28 23:52 crash): never keep a killed creature in `_G` — the dead actor is destroyed and the next call on it is an access
violation in UE4SS; read its location BEFORE `KillCharacter`.
Для замера модуль можно открыть пультом: `ActivateModule(FName('ContainerInfo'), true, false)` + `SetObject(<труп>, 0)` у `WBP_ContainerInfo_C`; игра
его сама не закроет — после замера `ActivateModule(FName('ContainerInfo'), false, false)` (2026-10-28: плашка висела на экране владельца:
«а почему плашка обыска трупа открыта? я не смотрю на труп»).
Second stand (2026-10-30, the owner's «саму плашку кодом открывай»): our OWN instance — `_config/strip-open.sh <tag> [class]` (`Create(pc, cls, pc)` →
`AddToViewport(50)` → `SetObject`; removed by the next call). A code-opened strip on a corpse also shows the quick-loot window. Non-corpse strip in the
oasis save: a campfire `BP_PL_Crafting_CampFire_C` (≈ 1064 m; `MAXD_M=2000`) — no chest within reach there; placeables are found by `FindAllOf('PlaceableBase')`.
The strip's dark backing: `Border_Underlay` — see `mods/KrinikConanUI.md` (brush, its texture's fade, the Border's own padding).

Quitting the game by the remote (2026-10-31 00:10): `StaticFindObject('/Script/Engine.Default__KismetSystemLibrary'):QuitGame(pc, pc, 0, false)` — the game
exits cleanly in ≈ 10 s; `pc:ConsoleCommand('quit', false)` fails in the remote.
Main menu backdrop (2026-10-31, KUMM bug 71): `W_MainMenu_MainMenu` holds `BackgroundMovies` (6 × `BinkMediaPlayer` `/Game/Movies/TitleScreen_<X>`,
X = Claws, Icefield, Jungle, UnnamedCity, Volcano, WineCellar — loose `Content/Movies/TitleScreen_<X>.bk2`, ≈ 65 MB each) and `BackgroundMovieTextures`
(`/Game/Movies/MediaTextures/TitleScreen_<X>_Tex`, `BinkMediaTexture`) and puts one onto `Image_BinkPlayer` (`Overlay_Content`, Fill) at run time — a
different one per start. The mod kit has NO `/Game/Movies`: a kit override of this widget loses both arrays → `Image_BinkPlayer` keeps its bare white
brush. Check any overridden vanilla asset with `_config/devkit/kit-missing-refs.py`. «MainMenuMoviePlayer.OpenSource called with null MediaSource»
in the log is printed on a good start too — noise.
The game's logo texture `/Game/UI/Textures/Logos/T_UI_ConanExiles_Enhanced_Logo` (game pak, read 2026-10-31 by `retoc to-legacy` + `uaj tojson`):
1024×512, `PF_B8G8R8A8` uncompressed, `TC_EditorIcon`, `NeverStream` true — and a FULL mip chain (`.uexp` 2 796 746 bytes = 1024×512×4 × 4/3):
drawn at 768 px on 4K, the sampler blends mip 1 → the owner's «мутное». Our logo was imported without mips and reads sharp. A replacement goes
by the kit override at the same path, `TMGS_NO_MIPMAPS` (plan 36 W26; the owner's upscale).
Menu logos (kit probe 2026-10-30 22:4x, `_config/devkit/kit-probe-tree.json`; no pack mod overrides either widget). Main menu
`/Game/UI/Widgets/MainMenu/W_MainMenu_MainMenu`: `Image_Logo` in `Overlay_Main`, Left/Top, padding L 72 T 120, brush 384×192 of
`/Game/UI/Textures/Logos/T_UI_ConanExiles_Enhanced_Logo` (1024×512, alpha); the nav column `Overlay_0` starts at T 340; the game version is
`Text_VersionValue` in `VerticalBox_0` (right column). Esc menu `/Game/UI/HUD/W_IngameMenu`: `Image_Logo` in `Overlay_1`, Right/Top, padding
R 72 T 88, brush 512×256; key art `Image_KeyArtOver/Under` Right/Bottom; version `Text_VersionNumber` in `VBox_Meta` (bottom left).
Подсветка цели (байткод кита 2.2, `FunCombat_PlayerController::UpdateHighlightTarget`, читается `uaj func <ассет кита> VER_UE5_6 <функция>` +
скретч-разборщик): в третьем лице игра САМА ставит `InteractionDistanceThirdPersonBonus` = длине штанги `ThirdPersonSpringArm`; сферический луч
`InteractionDistance + бонус`; каждое попадание проходит `CheckLineOfSight(actor, ImpactPoint + вперёд_камеры·10, компонент, экземпляр)`: цель =
`InteractTargetOverride` → да; труп и `LootContainer` → `IsActorInInteractableRange(pawn)`, затем родная `IsInteractableInLineOfSight`;
`PickupFoliage` и `IsPickupInterface` → расстояние героя < √300000 ≈ 548 см; прочее → `IsInteractableInLineOfSight`.
**Order of the targets (3.0.1 kit bytecode, read 2026-11-03 19:5x — `uaj func … FunCombat_PlayerController.uasset VER_UE5_6 UpdateHighlightTarget` + the
asset's import table by `uaj tojson <asset> <out.json> VER_UE5_6`):** `InteractTargetOverride` → `SphereTraceMulti` + `LineTraceMulti` (appended) → the hit loop
(water, interfaces, `CheckLineOfSight`, lore items) sets `HasValidTarget` and highlights the ACTOR → only when no actor target: the foliage probe
`PickupGatheringOneInstance` → the instance highlighted. So an actor under the crosshair (a corpse in a bush) wins over a foliage pickup at the same spot,
and our «E Взять» plate may show there while E takes the corpse — to fix: `[OWNER]` 2026-11-03 19:57 «над трупом в кустах - чинить».
**Правило для мода камеры (2026-10-26, подтверждено в игре):** игра продлевает луч взаимодействия на длину штанги и пересчитывает надбавку сама
(запись мода затирается за ≈1 с). Камера обязана стоять от героя на длину штанги: сдвиг «назад» держать в `TargetArmLength`, не в
`SocketOffset.X` — иначе луч короче на этот сдвиг и не достаёт низкие цели (трупы).
Первое лицо включается, когда колёсико ведёт штангу ниже `ThirdPersonCameraMinArmLength`; при 30 (наш `zoom_min`) переход не срабатывает, при
130 срабатывает (2026-10-26 20:59). `SwitchToFirstPersonCamera` сама переставляет `InteractionDistance`.
Читы прогона пультом (2026-10-26): время суток — `FindFirstOf('BP_TimeOfDayManager_C'):SetTimeOfDay(12.0)` (часы 0–24; консольной
`SetTimeOfDay 1200` в 3.0.1 НЕТ — «Command not recognized»); бессмертие — НЕ `exec God` (в 3.0.1 консольная команда ничего не включает, замер 2026-10-30 11:31), а `bash _config/god-on.sh [off]` (прямой `CheatManager:God()` по состоянию `bCanBeDamaged`); голод и жажда на 0 % убивают и при бессмертии — перед прогоном смотреть строку еды/воды на кадре стенда и копировать `Saved/Game_0.db` (EXP-0381). Correction for the record: every run report and case before 2026-10-30 11:31 that says «god mode» / `exec God` ran with a MORTAL hero; выносливость — `AdjustStaminaRegenMod(1000.0)` и поля героя
`SprintStaminacost`, `SwimStaminacost`, `StaminaJumpCost`, `JumpStaminaCostModifier` = 0, `SetClimbingStaminaCostModifier(0.0)`; выдача — `exec MakeMeAdmin`,
затем `exec SpawnItem <id> <n>` (железная стрела 53612, «Мощный охотничий лук» 51405; без `MakeMeAdmin` пульт отвечает «ok», а предмета нет —
2026-10-27). Всё сбрасывается перезапуском. Убрать врагов рядом: `GameplayStatics:ApplyDamage(…, 100000)` у Конана НЕ убивает (нежить Night Terrors
осталась жива, 2026-10-27 19:53) — работает только `K2_DestroyActor()` (без добычи); неуязвимость существа — `bCanBeDamaged=false`.
`God` НЕ спасает от жажды и голода (2026-10-26: смерть `CauseOfDeath: Thirst` при включённом God). Выживание — `p:GetHungerSystem()`
(`BP_HungerSystem_C`): `EnableThirst(false,false)`, `EnableHunger(false,false)`, `AddDrink(nil,100.0)`, `AddFood(nil,100.0)` (сеттеры `SetDrinkCurrent`
ждут два аргумента — не годятся). Correction 2026-10-30 12:06: `AddFood(nil,100.0)` / `AddDrink(nil,100.0)` left `FoodCurrent` and `DrinkCurrent`
at 0.0 (read back); a direct write `h.FoodCurrent = 100.0; h.DrinkCurrent = 100.0` holds (re-read at +3 s: 100.0) — use the write and read it back.
Ground blood (2026-10-30, `researches/conan-blood-decals/`): a WEAPON hit lays `M_blood_ground_decal` from the attacker's `BP_CollisionComponent.DoHandleHitFeedback`
(`SpawnDecalAtLocation` life 3.0 → `SetFadeOut(0, 3, true)`); arrows on a creature lay none; the material draws the full stain only while
`DecalLifetimeOpacity` is ≈0.45–0.9 (a ghost at 1, nothing below). Our `KrinikLingeringBlood`, in a post-hook of `DecalComponent:SetFadeOut`:
`SetFadeOut(297, 3)` + `SetFadeIn(-500, 1000)` (value 0.5 → 0.8 over 300 s). `SetLifeSpan` of a decal is not callable from Lua.
UE4SS hook on a STATIC UFunction (`GameplayStatics:*`): the first callback parameter is the default object, the real parameters follow; the
return value is not passed; editing a parameter in the pre-hook does not reach the call.
Stand for creature hits (2026-10-30): the creature keeps its controller and normal time (detached or `CustomTimeDilation` 0.0001 — it never
attacks); it hits the god hero; then `K2_DestroyActor` it. The game's idle camera (no real input ≈30 s) hides the HUD and orbits the hero —
`SetControlRotation` is ignored until a real key (a Shift tap by `mouse-seq.ps1`). **No-input twin (2026-11-07):** a spawned `CameraActor` made the view target
(`_config/fixed-cam.lua`, `GameplayStatics:BeginDeferredActorSpawnFromClass` + `FinishSpawningActor`, `SetViewTargetWithBlend`) holds a fixed view through the idle
camera, the game behind, 30+ clips. The oasis camp boss is `HumanoidNPCCharacter_20percentbigger_boss_C` (quiet-stand prefix `HumanoidNPCCharacter`). **Wind:**
foliage sway reads `MPC_BiomeSettings` `WindIntensity` / `Wind Speed` / `Wind Strength` (live 0.1 each; set by `KismetMaterialLibrary:SetScalarParameterValue`)
plus the level's `WindDirectionalSource2` (strength 0.1, speed 3.482; `SetStrength`/`SetSpeed`) — all 0 = still palms. **Oasis palms:** ISM meshes
`GFL_AfricanOilPalm01…05` (+ `_HLOD` billboards, `M_Foliage_Billboard`, masked 0.5), leaf materials `/Game/Environment/Foliage/Materials/FLX/MI_AfricanOilPalm01`,
`…D01`, `…02` on `M_Foliage` — OPAQUE (BlendMode 0), two-sided; with `r.RayTracing.Enable 1` their ray-traced shadows come from baked proxies (blobs).
`r.RayTracing.Enable` takes > 10 s to switch (the remote times out; read it back). **Foliage material (2026-11-07):** `M_Foliage` (`/FLX_Materials/Materials/
Environment/Core/M_Foliage`, in the kit; Material Attributes, Nanite, opaque, two-sided) moves vertices inside `MF_FLX-TreeMotion` = `MF_WindWaveFront` +
`MF_TreeBend` + `MF_BranchBend` (mask from UV / vertex-colour weights × wind vector) + `MF_LeafShimmer` (lerp × `VertexNormalWS`) — MASK-based, no per-leaf
pivot or axis; `MF_FLX_UVPivot_WPO` (pivots in UV1/UV2 + local bounds) sits behind `UVPivotWind_Enable` (default off). The kit holds only a 64-triangle fallback of
the palm meshes. Material-function links are read from a T3D export (`devkit/kit-export-t3d.py`); `MaterialEditingLibrary.get_inputs_for_material_expression`
refuses functions. At night Night Terrors (`BP_NightTerrors_*`) come to the hero. `AdjustStaminaRegenMod(1000)` выносливость НЕ удержал; работает повтор `AdjustStaminaCurrent(1000.0)` раз в 250 мс.
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
Gravity per tick (3.0.1 bytecode, `ExecuteUbergraph_BP_BaseProjectile`, `kismet-trace.py` 2026-10-30): in the tick branch, IF
`IsValid(ProjectileGravityCurve)` → `ProjectileMovement.ProjectileGravityScale = Curve.GetFloatValue(GetGameTimeSinceCreation) × (1.0 −
PowerChargeGravityModMax × PowerChargeMod)` (the 1.0 is a Double at `.uexp`+27347); then, IF `IsValid(ProjectileSpeedCurve)`, `Velocity ×=
SpeedCurve(time)`. Both curves are set by the weapon through the interface events `SetProjectileGravityCurve` / `SetProjectileSpeedCurve`
when the arrow is born (≈1 s before launch). The bow curves are single-key constants: `FC_BowProjectileGravCurve_15m` 1.2 · `_30m` 1.0 · `_45m`
0.8 · `FC_CrossbowProjectileGravCurve_45m` 0.8 (`/Game/Systems/Combat/Projectile/`) — the bow's range class. Setting the arrow's
`ProjectileGravityCurve = nil` at launch (UE4SS Lua accepts it) skips the block: a gravity written once then holds (KrinikConanArchery 0.6.0,
run 2026-10-30 10:43–10:45, 0.55 at +0.3/+0.6 s on 4 of 4 shots).
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
ассетов не везёт. Hosav (`W_SmoothHP` и его слоты, `W_NewHealthUI`, настройки, кнопка, окно, мерцание еды/воды/веса, числа «k») — **конспект мода
`games/ConanExiles/mods/UIMod_Hosav.md`**. Строка опыта — шаблон `{xpCurrent}{suffix1} / {xpMax}{suffix2} ({xpNeeded}{suffix3})`, перевод «Опыт: …»
(интервью #003, строка 299).

Перевод модов: цель `Content/Localization/Game` в чистой игре пуста (ванильный перевод в паках) — там только наши `Game.locmeta` и
`ru/Game.locres`, их ставит запись манифеста `Krinik Russian Translation`.

## Слияние таблиц модов (снято 2026-10-26, живые таблицы пультом)

| Что | Как на самом деле |
|---|---|
| Строка, которую пишут мод и игра (или два мода) | ЗАВИСИТ ОТ ТОГО, КАК ВЛИВАЕТ ПОЗДНИЙ МОД (журнал в обоих случаях пишет `MergeDataTables - Found existing table entry … overwriting`). ПО ПОЛЯМ: Heritage (17 рядов боссов над BMNB — вербовка и расы живые), таблицы Era of Trials `*_Merge` (54 оружия над LegitReligious — у луков список стрел LR + стрела EoT 47210132; 2 NPC над Heritage), TDI / Ancient Civilization (2026-10-26). ЦЕЛИКОМ: Mines of Set (предмет 51420 над Severe Weather), EAA (7 рядов боссов над BMNB — в той же таблице появления!), рецепты Era of Trials `*_Add`. Каждую пару — вживую `_config/live-rows.lua` (2026-11-06) |
| Массив (`CraftingGroups`, `BonusRecipes`) | дописывается: `Armorer_4` — 8 игровых групп + 1 Ancient Civilization = 9, 30 рецептов + 1 TDI = 31 |
| Пустое поле мода (`[]`, `None`, 0) | не затирает игровое: у TDI `ThrallTier 0`, `StatTemplate None` — в игре 4 и Artisan Base |
| Два мода, разные поля одной строки | оба применяются: боссы — расы Heritage + характеристики и оглушение Bosses My New Besties |
| Исключение, не понятое до конца | `ThrallGroup = Warrior` Ancient Civilization в `Armorer_4` не применился (в игре Crafter) |

Чтение живой строки: `StaticFindObject('/Game/Systems/SpawnTable/<Таблица>.<Таблица>'):ForEachRow(function(name, row) … row.<Поле> … end)`
(имя строки — строка Lua; массив — `:GetArrayNum()`, имя — `:ToString()`). Если поздний мод вливает по полям, потеря правки — только там, где два мода меняют ОДНО поле (`ConanExiles/docs/17`); если он заменяет
строку целиком, теряется всё, что он оставил игровым (ряд 51420, 7 боссов EAA — план KUMM 45 шаги 1 и 4).
Живое значение полей ряда против таблицы мода одним вызовом — `_config/live-rows.lua` (текстом через `DataTableFunctionLibrary:GetDataTableColumnAsString`;
мягкую ссылку из ряда в функцию не передавать — падение игры, KUMM EXP-0459).

## Камера (снято 08.09–26.10)

| Поле `BasePlayerChar_C` | Родное | У нас (`KrinikConanCamera`) |
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
UE4SS build 1181 (`8333063`), threads (source read 2026-11-07, bug 85): `RegisterKeyBind` / `RegisterKeyBindAsync` callbacks run on UE4SS's event-loop thread;
`RegisterHook` callbacks and delayed-action batches run on the game thread WITHOUT the mod lock; a mod's Lua threads share one `lua_State` → no key binds in our
mods (guard `check-lua-game-thread.py`). Gameplay keys on the game thread: `/Game/Characters/BasePlayerChar.BasePlayerChar_C:InpActEvt_AnyKey_K2Node_InputKeyEvent_1(Key)`
(the hero BP has no input event for E «use» — handled in C++). Two delayed actions of the same delay: one may never run (EXP-0486) — chain setup in one action.

## Где наши моды встают в игру

| Мод | Точка | Как |
|---|---|---|
| `KrinikConanCamera` | штанга камеры героя, контроллер (дистанции взятия) | Lua UE4SS; сторож зума 30 мс (план 34 — переписать на события) |
| `KrinikConanUI` (since 2026-10-30; was KrinikUIFixes + KrinikFpsCounter + KrinikHudOutline + KrinikPauseGameInMenu) | kit pak: overrides of `WBP_ContainerInfo`, `W_QuickLootPanel`, `W_ItemIconTooltipView`, `W_AttributeInfoEntry_PerkView`; Lua: `GUIModuleController:ActivateModule` (pause), `TextBlock` of `W_NewHealthUI_C` (outline, FPS), `WBP_ContainerInfo_C` hooks, `WBP_ButtonBase` glyph boxes | one Lua mod of sections: `Scripts/main.lua` does `pcall(require, "<section>")` for four files in `Scripts/` (UE4SS puts the mod's own `Scripts/` on `package.path`, as `ConsoleCommandsMod` does; section files carry the `krinik_` prefix so a name cannot meet another mod's module); log prefix `[KrinikConanUI:<section>]` |
| `KrinikLevelUncapped` | таблицы уровней игры | пак-подмена ассетов, без кода |
| `KrinikAgentRemote` (прибор) | `cmd.txt` → игровой поток | страж `no-component-sweep`: перебор компонентов отказывает (EXP-0330) |

## Facts of 2026-10-29 (camera, Severe Weather, widget events, stuck arrows)

- **First-person camera and the neck.** The FP camera sits on bone `b_headcam` (child of `b_head`, `b_neck_2`, `b_neck_1`; hero mesh 174 bones). Looking straight up it is inside the neck. `Mesh:HideBoneByName('b_neck_1', 0)` hides the neck and head in rendering only; the `b_headcam` socket does not move (equal to 0.01 cm). `KrinikConanCamera` does it on `BasePlayerChar_C:SwitchToFirstPersonCamera` / `SwitchToThirdPersonCamera` (the real wheel calls them). In this mod `NotifyOnNewObject("/Script/ConanSandbox.BasePlayerChar")` does not fire; hooks on the hero class go in from `try_install_zoom_hook`.
- **Severe Weather night light.** `dc SW_config disable_custom_GI` → `SW_DataCmd_Actor` (string switch) → `SW_ModController` event «SW_config light»(False); the variable `light enabled` (default True). **Corrected 2026-10-29 11:42:** the console `dc SW_config …` does not reach the mod at all (the variable does not change, also as admin) — the 2026-10-26 «disable_custom_GI подан пультом» changed nothing. The event «SW_config light»(Visuals) sets `light enabled` and marks the controller's `PersistenceComponent` dirty (meant for the world save); call it by the remote: `local c=FindFirstOf('SW_ModController_C'); c['SW_config light'](c, false)`. A loop (Delay 1 s) applies the mod light to `Ultra_Dynamic_Sky_BP_C` only while `light enabled`. Night brightness at 23:11, same pose: mod light 21, vanilla 41. The pack ships `light enabled = False` (KRINIK MODIFIED).
- **Clicks on our own widgets (2026-10-31, plan 36 W37).** `RegisterHook` on `/Script/UMG.UserWidget:OnMouseButtonDown` / `:OnMouseMove` registers
  without an error and never fires (real clicks on an image in the main menu; neither menu overrides those events). What works:
  `RegisterKeyBind(Key.LEFT_MOUSE_BUTTON)` → `ExecuteInGameThread` → `<button>:IsHovered()` (true on the widget, false off it — remote 01:17). LMB is the
  attack too: keep the menus from `NotifyOnNewObject`, no scene search on the click. Hover visuals — a UMG `Button` style (normal / hovered / pressed).
- **Widget creation events.** `NotifyOnNewObject` works for widget BP classes: `/Game/Mods/UIMod_Hosav/W_SmoothHP.W_SmoothHP_C` (fires per object, templates too, 1–3 ms of work each), `/Game/UI/Widgets/MainMenu/W_MainMenu_MainMenu.W_MainMenu_MainMenu_C`. Costs on the game thread (remote, 2026-10-29): `FindFirstOf(<class>)` 3 ms, `FindAllOf(<class>)` 2 ms, `FindAllOf('UserWidget')` 1928 objects 5 ms + `GetFullName` loop 21 ms, a full read of `ConanSandbox.log` (2 MB) 30 ms.
- **Stuck arrows.** The game attaches the stuck copy `BP_DummyProjectile_C` to the hit bone itself (socket = `HitResultFromProjectile.BoneName`, e.g. Kappa `rig_bone_L_leg_J01`); the copies are removed within ≈ 20 s. Aimed at the Kappa's capsule centre, the arrows hit the left-leg body.
- **Quick-loot rows.** `W_QuickLootPanel` → `WidgetSwitcherTooltips` takes the widest child: action row `LootActionTooltip` 650, navigation row `NavTooltip` («F Забрать · Q … · Esc Отмена») 519, grid 645 — the window width does not change between the rows.
- **Hero spawn event and int stats (2026-10-29, remote on the owner's level-50 hero).** `NotifyOnNewObject("/Game/Characters/BasePlayerChar.BasePlayerChar_C")`
  fires on world entry and on re-entry (a new object each time, e.g. `…60400` → `…31996`); at that moment `GetIntStat(19, 0)` already answers. One
  `BasePlayerChar_C` in single player. `GetIntStat(id, 0)`: 0 = 199 (max HP), 1 = 195 (HP), 2 = 4, 3 = 354, 4 = 50 (level), 5 = 99, 6 = 99, 7 = 100,
  8 = 100, 11 = 1; **14–40 all 0 — Agility (19, the 2.x id) included.** Either the hero's attributes are really 0 after the 3.0 attribute reset
  (`ConanCharacter.ShowAttributeResetNotification`, `IsAttributeVersionUpToDate` = true) or 3.0.1 keeps attributes elsewhere. **Resolved 15:46:** the character
  window «Хар-ки» shows all six 0 and «Доступные очки 52» — the ids are right (19 = Agility), the points are unspent.
- **Mods that inject into the hub (2026-10-29).** Era of Trials: `EoT_AC_InterfaceInjectorComponent` subscribes to `SignalActivated` of the modules
  `CharacterInventory` and `CharacterStatsWindow`, casts the window root to `W_Carousel_C`, waits `Delay` 0.1–0.2 s and `Create` + `AddChild`s
  `EoT_W_CharInfoMagicDisplay` (six magic-school icons right of the paperdoll; on Construct a looping 0.5 s `Update` timer). A tab round trip
  re-creates the paperdoll: `XCS_Panel` false/true are the only module events, a NEW magic display follows +150 ms; the icons showed 0.2–2.2 s late.
  Arrow Quick Swap: `AQS_Actor_Component.UpdateDisplayUI` adds `UI_AmmoDisplay` to the viewport on substate 16 (aiming), removes it on exit;
  the wheel path is `HideDisplay` → `RevealDisplay` (animation `Reveal` on `CanvasPanel_32.RenderOpacity`), auto-hide after `MinDisplayTime`.
  Trace recipe: a remote `lua` `RegisterHook("/Script/ConanSandbox.GUIModuleController:ActivateModule", …)` + `NotifyOnNewObject(<widget BP>)` printing
  `os.clock()` — every call, not only state changes (the pause mod logs changes only).
- **The hub carousel asset (2026-11-06, kit probes `_config/devkit/kit-probe-carousel.py` / `kit-probe-hub-windows.py`, JSON next to them).**
  `/Game/UI/HUD/Carousel/W_Carousel`: tree `Content` (Overlay) → `Background` (Image, material `M_UI_RadialBackgroundGradient` — the dark backing) +
  `VerticalBox_3` → `SizeBox_0` → `TabButtonBox` (9 `WBP_ButtonBase` tabs + `ImageLeft` / `ImageRight` Q/E glyphs) + `Img_Divider`. Class default
  `CarouselWindowNames` = CharacterInventory, FeatWindow, Attributes, CharacterStatsWindow, ExilesJourney, Guild, Followers, FullscreenMap, Stores (the
  screen order: Снаряжение, Таланты, Хар-ки, Параметры, Путешествие, Клан, Спутники, Карта, Базар). One animation `AnimBackgroundFadeOut`: a
  `MovieSceneWidgetMaterialTrack` on `Background`, `MaskOffset` 0 → 1 over 10 frames at 20 fps (0.5 s; tick resolution 60000; the playback range END is
  EXCLUSIVE — vanilla ends 1 tick after the last key) — the mask slide between «Снаряжение» (no backing, the world shows) and the other tabs: the
  «dark wave». Tab windows (rows of `DT_UIModuleTable`, widget classes `CraftingGUI_C`, `W_FeatWindow_C`, `W_Attributes_C`, `W_CharacterStatsWindow_C`,
  `W_NewJourneyWindow_C`, `W_GuildView_C`, `W_FollowersView_C`, `W_FullscreenMap_C`, `W_StoreWindow_C`) have NO widget animations and no fade fields; most
  rows `NonBlockingLoad` True. Measured 2026-11-06 (KUMM bug 64): each page assembles over 4–6 frames after the click (≈ 93 fps) — panels, list rows and
  auto-wrapped texts arrive frames apart.
- **Hub tab switching by the MOUSE (2026-11-06 22:2x, KUMM plan 48).** `CarouselWindow` UFunctions (by `ForEachFunction`; the remote's `funcs` fails on it):
  SetCarouselIndex, PrevCarouselWindow, NextCarouselWindow, ButtonPressed, OnChildActivated, CloseOtherModules, OnUndistributedAttributePointsChanged,
  OnCharacterFeatPointsChanged; the blueprint adds UpdateTabIndexes. A click on a tab = `ButtonPressed` → native `SetCarouselIndex` in C++ — a UE4SS hook
  on Next/Prev/SetCarouselIndex does NOT fire for it (the remote's own calls do); `OnChildActivated` fires on every switch after the new window exists. The
  switch removes the old tab window from the viewport and later collapses it; the object stays valid (`hub-switch-probe.lua`). A left tab's window is then
  DESTROYED — one instance per tab at a time, rebuilt (100–300 widgets, 50–500 ms) on every visit. `IsPersistent = true` set on the 9 hub rows by a live
  `dt:ForEachRow` edit at the main menu does NOT keep them (2026-11-06 22:59): the flag is read at module registration, before the main menu. Set at
  `NotifyOnNewObject('/Script/ConanSandbox.GUIModuleController')` (a UE4SS mod, 23:09) it DOES keep them — the left windows live off-screen — but each page
  still rebuilds its content on every show (lists, cells, perks: the same late changes, run 9). The page's refresh on activation is the assembly's cause.
  `CraftingGUI_C` rebuilds its centre/right panels (`BP_Handle*PanelWidgetCreated`) on the MODULE ACTIVATION, not on a plain `AddToViewport`; a page that
  STAYS in the viewport and is only Collapsed / shown re-creates nothing on later shows (0 births, 3 cycles — `hubswitch/collapse-test.lua`, 23:45).
  A page instance created by OUR code (`WidgetBlueprintLibrary:Create(pc, <class>, pc)` + `AddToViewport`) builds COMPLETE without the module controller
  (`W_FeatWindow`, `CraftingGUI` — frames 2026-11-06 23:56–23:57); 9 such extra instances do not disturb native switches (bisect 2026-11-07 00:10).
  **CRASH RULE (bisect 00:10, 5 steps):** `SetVisibility` on ANY widget inside a `CarouselWindow:OnChildActivated` hook (inside the native switch) crashes
  the game (EXCEPTION_ACCESS_VIOLATION in UE4SS) — `SetRenderOpacity` there is safe (prototypes v3/v4, 22:2x–22:35). Visibility changes go to the next tick.
  UE4SS `NotifyOnNewObject` with a page CLASS path did not fire for the game's page windows (00:11) — use the `UserWidget` notify + a class check.
  **STALE-REF RULE (2026-11-07 06:29, plan 48):** a Lua ref to a widget is a raw pointer; the game DESTROYS extra page instances (every native activation of
  «Параметры» creates `W_CharacterStatsWindow_C` twice and kills any other stats window, ours included) — touching the dead ref crashes inside UE4SS. Keep a
  widget by its `GetFullName()` and find it alive through `FindAllOf(<class>)` before each touch (`hubswitch/shadow-pages-v5.lua`: 27 switches, 0 crashes).
  `OnChildActivated` fires twice per switch. The remote's `NextCarouselWindow` / `PrevCarouselWindow` walk the ring of ALL 9 tabs (fast-burst-eq, 20 bursts, 2026-11-07 10:2x; the «4 tabs only» of 06:46 was wrong — corrected). A page
  instance built by our code: `CraftingGUI_C` shows the hotbar only (no inventory, no paperdoll — the panels come with the module activation);
  `W_Attributes_C` and `W_FeatWindow_C` are complete with the hero's data (the test save's attributes are really 0 with 77 points unspent — the game's own
  page shows the same, frame 2026-11-07 06:5x). Native parents: `WindowRoot` (`SetupUI`, `Open`, `Close`, `SendWindowOpenedNotifications`, `m_GUIModule`),
  `CraftingGUIBase` (`GetPanel`, `BP_Handle*PanelWidgetCreated`, `AddDefaultSelectedInventoryGrid`), `AttributesBase` (`BindAttributeDelegates` — fails
  when called on our instance, `UpdateAttributeInfo`). `WindowRoot:SetInteractionActor` builds an inventory window's panels (hero → the follower layout,
  `nil` → the hub's own) — and an inventory window with its actor set entering the viewport CLOSES the open hub: the game keeps one open inventory window;
  opening the hub takes any other CraftingGUI out of the viewport (plan 48, 2026-11-07 06:58–07:00). `CarouselWindow:SetCarouselIndex(k)` (0-based) reaches
  every tab natively, the header highlight stays on the old tab.
- **Hub tab switching (2026-10-29 16:56, remote probes).** The tabs are changed by the NATIVE parent class of `W_Carousel_C`:
  `/Script/ConanSandbox.CarouselWindow` — `NextCarouselWindow` (E), `PrevCarouselWindow` (Q), `SetCarouselIndex`; the blueprint has no own Next/Prev
  (a hook by the blueprint path fails «no UFunction»). Module events lag the switch: `NextCarouselWindow` 17.535 → `XCS_Panel` false 17.681
  (146 ms); `PrevCarouselWindow` → `XCS_Panel` true 42 ms (log timestamps; `os.clock()` is process CPU time, not wall time — do not measure gaps with it).
  Exiles Fishing: `BPC_EFT_Tuning` sets a LOOPING 0.3 s timer `CheckInventory` (in BeginPlay and again in `TryLocal`), which polls
  `IsModuleActive(CharacterInventory)` and on the rising edge calls `Graft`; `Graft` is idempotent (removes every `W_EFT_AdminButton_C`, then
  `Create` + `AddChild` into `CraftingGUI_C.ButtonBar.ButtonContainerRight` of the visible hub, only when `bAdminLocal`). The button click is the
  widget's `CustomEvent` → module `ExilesFishingTuning`. KRINIK MODIFIED since 2026-10-29: both 0.3 s timers → 1e9, `Graft` called by
  `KrinikPauseGameInMenu` 0.8.0 on `XCS_Panel` true.
- **Late hub elements and the pause (2026-10-29 17:55–18:10).** `KrinikPauseGameInMenu` runs the hub at `GlobalTimeDilation` 0.03, and every blueprint
  `Delay` counts GAME time: a mod's `Delay 1.0` lasts ≈33 s in the hub. On a tab return the hub re-creates its widgets in this order (probe): carousel
  switch → `CraftingGUI_C`, `WBP_ButtonBar_C` + ~10 `WBP_ButtonBase_C` (+0 ms) → `XCS_Panel` true (+37) → `CharacterInventory.SignalActivated` (+47) →
  `W_PaperdollPanel_C`, `W_UICharacterDisplay_C` (`/Game/UI/Inventory/CharacterDisplay/W_UICharacterDisplay`, +100) → `W_HotkeyIcon_C` (+170).
  EAA `AC_EAA_Inventorybutton` (on the hero): signal → `Delay 1.0` → resume `ExecuteUbergraph(286)`: `GetAllWidgetsOfClass(UICharacterDisplay)` →
  `Create(BP_EAA_InventoryButton)` (`Button_Axe` = the sword emblem, its gem = the indicator; «Аксессуары» is the Accessory System's `W_acs_InventoryButton`, below) → `AddChild` to the display's grandparent.
  EoT `EoT_AC_InterfaceInjectorComponent` (on the hero): «Character Inventory Activated» → `Delay 0.1` (1st 0.1 in the ubergraph) → resume 15 (paperdoll
  icons); «Character Stats Window Activated» → `Delay 0.1` (2nd) → resume 1060; «GUI Carousel Activated» → 0.1 (3rd) → 2380. Since KRINIK MODIFIED
  2026-10-29 the EAA delay and the EoT 1st delay are 1e9, and `KrinikPauseGameInMenu` 0.9.0 calls those resume points on the display's birth.
  Components are reached through the hero: `FindFirstOf('PlayerController'):K2_GetPawn():GetComponentByClass(StaticFindObject('<class path>'))`
  (the remote refuses `FindAllOf` on `…Component` classes — EXP-0330).
- **Item tooltip.** `UI/Inventory/W_ItemIconTooltipView` (`Border_Background` → `Border_Frame` padding 20/12 → `Text_Content`, a `GeneralText`):
  `AutoWrapText` True, `WrapTextAt` 800, nothing sets a width — the tooltip is sized by its content, and auto-wrap wraps at the width the PREVIOUS
  frame allotted (frame minus padding), so the text collapses to one word per line. Measured 2026-10-29 21:2x by `hover-watch.ps1` + `tooltip-bbox.py`
  (4K): «Грубая повязка» — first frame the frame box 405 px wide for one line with the text already in two lines below it, next frame 274×165 (two lines),
  3 of 3 hovers. `AutoWrapText` False (remote, on the class template `…W_ItemIconTooltipView_C:WidgetTree.Text_Content` — the game builds a NEW
  tooltip widget per hover, so the template is enough): 405×107, one line from the first frame, 3 of 3. In full screen the hover tooltip is drawn
  INSIDE the game window, not as a window of its own; the hover needs the real cursor (`hover-watch.ps1`).
- **Fishing panel tooltip (Exiles Fishing, 2026-10-30).** `JaarFishing/Tuning/W_EFT_Tooltip`: `TipFrame` (Border) → `TipSize` (SizeBox,
  `MaxDesiredWidth` 380) → `Txt_Tip` (`AutoWrapText` True, no `WrapTextAt`) — the same previous-frame wrap as the item tooltip (owner saw it flicker).
  The texts come from bytecode of `W_EFT_Panel`: `Tip(<button name>, <FText const>)` calls, LocalizedText with keys → translated by `Game.locres`;
  the five profile-slot tips (`Btn_Prof0…`) have a UTF-16 source (the «•») and were missed by the inventory scan until 2026-10-30 (EXP-0376).
  The panel's classes load AFTER `ActivateModule ExilesFishingTuning` and are reloaded on every open (a template edit is lost after a re-open);
  the panel builds its 34 tooltips at birth. Our fix — `KrinikPauseGameInMenu` 0.13.0, 1 s after the event, every open. `W_EFT_Tooltip`'s name map
  (102 names) has no `WrapTextAt` — a splice `addprop` of it crashed the game (EXP-0377).
- **Hotkey glyph (`UI/Framework/W_HotkeyIcon`, 2026-10-29).** `HorizontalBox_1`: `TextBlockBindingName` (size 10, Collapsed in play) · `TextBlockHoldPrompt` · `SizeBoxPrimaryIcon` → `ScaleBoxPrimaryIcon` → `ImagePrimary` · the same for Secondary (Collapsed for one-key actions) · `AnimFadeIn`. The glyph texture is 128 px; the ScaleBox scales it by the previous frame's geometry, so a NEW icon is 128 units wide on its first frame and 42.7 (Esc, Space) or 32 (F) after — every new button with a key (the hub bottom bar is rebuilt on every tab) jumps by ≈ 85 units. The bar: `WBP_ButtonBar` (`ButtonContainerLeft`, `ButtonContainerRight`, `CloseButton`) → `WBP_ButtonBase` (`ContentContainer`: `HotkeyIcon` · `ImgIcon` · `TxtLabel`, padding 20/10). From the remote `GeneralText:GetText()` is not reachable («TrivialObject»). Width-free glyph contexts (survey of 115 live icons, 2026-10-29): `WBP_ButtonBase` (height 32,
  settled 42.7 / 32) and `W_ActionTutorial` (height 38, settled 50.7); Q/E (48×48) and journey (24×24) override both sides. The native `HotkeyIcon` setters
  (`SetInputActionName`, `SetIconSize`, `SetGamepadKey`) do not fire `RegisterHook`. A property set in a `NotifyOnNewObject` callback (the SizeBox's birth)
  SURVIVES the archetype copy (34 of 34) — the birth is a usable event for per-instance layout fixes; `KrinikUIFixes` Lua 1.2.0 caps `MaxDesiredWidth` 42.67
  on `SizeBoxPrimaryIcon` inside `WBP_ButtonBase` this way.
- **Hub bottom row: Hosav and fishing buttons (2026-10-29, `KrinikPauseGameInMenu` 0.10.0).** Hosav's `W_UI_SettingsButton` is its own viewport layer
  (`CanvasPanel_0` → `Overlay_0` → `Border_0` 20/20/20/13 → a vanilla `WBP_ButtonBase`, `ContentPadding` 5; click → BP `BndEvt…SignalClicked` →
  `ActivateModule('HosavUIsettings')`); on screen its button spans 21…321.5 units — the layer is ×1.094 larger than the button's desired 274.8. Moved
  (`RemoveFromParent` + `AddChildToHorizontalBox`) into the bar it STOPS clicking (handler never called); a second instance of the widget made by
  `WidgetBlueprintLibrary:Create` never fires its handler either. Exiles Fishing's `W_EFT_AdminButton` (`Pad` border 15 + its slot 15 → `Size_Btn_Open` 214 →
  UMG `Btn_Open`, style paddings 8/2 → text) clicks via `CustomEvent` → `ActivateModule('ExilesFishingTuning')`; it takes a vanilla `WBP_ButtonBase` as
  HitTestInvisible content (`SetContent`) and keeps its own click — but then the hover glow is lost. The bar: `WBP_ButtonBar` → `ButtonContainerLeft` (starts
  at x 0) / `ButtonContainerRight`. Remote facts: inside a module activation callback `IsModuleActive(<that module>)` is still false; `GetCachedGeometry`
  through `SlateBlueprintLibrary` returns zeros; `GUIModuleController` has no `DeactivateModule`, but `ActivateModule(FName('CharacterInventory'), false, false)` closes the hub (2026-11-07 06:59, frames) —
  only while «Снаряжение» is shown; on another tab the hub closes by that TAB's module (`FeatWindow`, `FullscreenMap`, `CharacterStatsWindow` … `, false, false`,
  2026-11-07 07:19). The hero dies by the remote's console `exec suicide`; with no bedroll the game respawns him by itself ≈ 8 s later (2026-11-07 07:41).
- **Esc and windows over the hub (2026-10-30, KRINIK MODIFIED + `KrinikPauseGameInMenu` 0.11.0).** Module rows (`UIModuleTableRow`): vanilla popups over a hub
  tab (`PerkSelection`, `ThrallBonuses`, `InventorySettingsPopup`) are `Category Modal`, `FullscreenGUIAction None`, `CloseOnESC true` — and Esc is taken by their
  OWN cancel button: a `WBP_ButtonBase` (native `FLXButtonBase`) with `KeyShortcutName` «Escape» (the input action `Escape` = Esc / gamepad B). The controller does
  not close a Modal on Esc by itself: a Modal mod window without such a button swallows Esc (the fishing panel stayed open, the hub too). A `Fullscreen` module
  opened from the hub replaces it — Esc then closes everything; `FullscreenGUIAction Close` closes the hub when the window opens. Hosav's settings window
  (`W_ExampleWidget_User_C`) has its live row `HosavUIsettings` in `UIModuleTable_UIH` (a twin `HosavUISettings` sits in `DT_UIModuleTable_HosavNew`); the value
  `EGUIModuleCategory::Popup` is not used by any vanilla row. Hosav's button BP calls `ActivateModule('CharacterInventory', False, False)` then
  `ActivateModule('HosavUIsettings', True, False)`; `ActivateModule(<open module>, True)` is harmless (hub and its buttons stay). Mod windows are `WindowRoot`
  (`RootWidget`) subclasses: `TryCloseWindow()` closes one cleanly, the hub under it stays, `IsModuleActive` drops a moment later. The game builds a NEW window
  instance per open and the closed one lingers until GC — find the open one by `FindAllOf(<class>)` + `IsOpen()`, never `FindFirstOf`.
- **Vanilla button hover (2026-10-30, `KrinikPauseGameInMenu` 0.12.0).** `WBP_ButtonBase` has no inner Slate button: `Overlay_16` → `ImgBackground` (Visible,
  material `MID_M_UI_DetailedStoneButton_Base`), `ImgFrame` (material `MID_M_UI_StoneButton_Frame`), `ImgIcon`, `ContentContainer`; the native `FLXButtonBase`
  lights it on mouse-over by the materials' scalar `PercentHover` 0 → 1 (no BP events, no hookable UFunction), and as a hit-testable widget it handles the click
  itself. To keep another widget's click AND the vanilla hover: put that widget (here the mod's transparent `Btn_Open`) as the LAST child of the look's
  `Overlay_16` and the look `SelfHitTestInvisible` — Slate sends mouse-enter along the whole cursor path, so the look-parent glows, the child takes the click.
  A widget detached from its tree is no longer found by `GetWidgetFromName` — take it by the BP variable (`e.Btn_Open`). An `Overlay` built from Lua
  (`StaticConstructObject`) together with a brush-struct copy in one remote call crashed the game (2026-10-30 00:22).
- **Exiles Fishing fish card (`W_EFT_FishCard`).** `RowBox`: `IconSize` · `NameCol` (Fill: `Txt_FishName`, `Txt_FishInfo`) · `BaseSize` (`Txt_Base` «table N», size 13,
  no clipping — overflow runs under the field) · `EditSize` (`Edit_Weight`). Widths since 2026-10-30: `BaseSize` 92, `EditSize` 76 → 66 (KRINIK MODIFIED); the
  name column then holds «Пустынная луна-рыба» / «Обыкновенная форель» whole. «table» = the weight of the mod's «Vanilla» preset → «ваниль».
- **«Хар-ки» perk rows (read from the 3.0.1 assets 2026-10-29).** `UI/Inventory/Attributes/W_AtrributeInfoEntry` (sic): `Overlay_120` →
  `VerticalBox_173` with `PrimaryPerkView` (slot padding Bottom −2) over `BranchedPerkView` (Top −2), both `W_AttributeInfoEntry_PerkView`; the
  link icon `PerkIconLink` sits in the same overlay with padding Left 40, Top 82, Bottom 82 — the row is drawn for one-line descriptions. The perk
  view: `Overlay_0` → `HorizontalBoxMainContent` → `PerkDescription` (`GeneralText`, size 13, `AutoWrapText` True, slot padding Top 2 Bottom 5) +
  `W_AttributePerkPip`; `ButtonBase` over it (padding 8). The parent `W_AttributeInfo.Description` wraps at a fixed `WrapTextAt` 430 (no auto-wrap).
  Cause of the «Берсерк» / «Кровожадный берсерк» overlap (bug 64 item 46; helper recon 2026-10-29 from the assets and bytecode): rows DO grow with the text —
  a row is max(120, text + 7) tall (`SetupFromPerkPip` gives the pip brushes 120/80/40; the description slot is Fill, VAlign Center, padding Top 2 Bottom 5) —
  but `W_AttributeInfo.ConstructInfoWidgets` gives every entry the padding (0, −4, 0, −4) and the pair rows overlap by 4 (the −2/−2): the gap between two
  descriptions is −1 unit between entries and 3 inside a pair. English (1–2 lines) hides in the 120 minimum; Russian 4–5 lines touch. Container: `W_Attributes`
  `SizeBox_0` 585×1000, clipped; text column 465 units. The link icon (`PerkIconLink`, VAlign Fill, Top/Bottom 82, under the pips) stays hidden up to ≈ 6.9 lines
  per description. Fix (kit, `KrinikUIFixes`): `PerkDescription` slot padding 10/10. `WBP_ButtonBase.TxtLabel` has no
  auto-wrap (default text «Text Block»); `WBP_ButtonMinor.TxtLabel` `WrapTextAt` 106 inside `SizeBox` `WidthOverride` 148.
- **Accessory System (`/Game/ModsShared/AccessorySystem`, 2026-10-29).** Shipped inside BOTH Enhanced Armory and Arsenal and Highmane's Arsenal, in
  different versions (the `AC_acs_AccessorySystem_Persistent` chunk 50 451 vs 50 347 bytes); the game loads the EAA copy (a patch of the Highmane's
  copy changed nothing). «Аксессуары» under the boots = `W_acs_InventoryButton` (`LabelView`), created by `AC_acs_AccessorySystem_Persistent` (on
  the hero): `InventoryActivated` → `GUIModule_Activate` async → `OnActivate_9DB3…` → `Delay 0.2` → resume 61 (cast of the persistent
  `Temp_object_Variable` = the hub window → find the paperdoll → `Create` + `AddChild`). Calling 61 from Lua crashes the game (EXP-0371); since
  KRINIK MODIFIED the delay is 0.0015. Click → module `acs_WardrobeGUI` («Гардероб — Экипировка»). Build with `PATCH_VIEW_EXCLUDE=HighmanesArsenal`.
  By the remote (2026-11-07 08:5x, background): the BARE module opens empty («Wardrobe — Placeholder Text») — open the inventory, then call the button's own
  `BndEvt__W_acs_InventoryButton_acsButton_K2Node_ComponentBoundEvent_3_OnButtonClickedEvent__DelegateSignature()`; a category (`WBP_ButtonBase_C` with its label in a
  TextBlock) is switched by the window's `W_acs_Wardrobe_C:ButtonToggled(<button>, true)` — the button's own `SetIsToggledOn(true)` does not switch the layout.
- **The mods' UI modules, live list (2026-11-07 09:0x):** every mod merges its own table (`FindAllOf('DataTable')` with «UIModule» in the path;
  `dt:ForEachRow(function(name) … end)` — `name` may come as a string, `ToString()` otherwise; on the merged vanilla table the call errors). Settings windows a
  bare `ActivateModule(<row>, true, false)` opens well: `AMR_Settings`, `Pickup+_Settings`, `EmberlightMasterConfig`, `UIHortiSettings`, `LLH_Settings`,
  `PIFC_Settings`, `PrP_Settings`, `SM_UI_Settings`, `DN_UI_Settings`; bare and NOT representative: `LBPRWidgetID` (over the HUD), `AmbushMultiUserWidgetID`
  (nothing), `acs_WardrobeGUI` (empty — use the button), `PRMainMenu` (crashed 2026-10-26). Also: `HosavUIsettings`, `EAA_*` (≈50 rows), `IronlightAdminUI`,
  `TLI` `PetStatsWindow` / `FollowerStatsWindow`, `JaarFishing`, `CodexPiscium`, `ExilesFishingTuning`, `WSEMap`.
  `KrinikPauseGameInMenu` 0.9.1 also runs its pause poll on the `XCS_Panel` open event — the hub's time is 0.03 from its first frame.
- **Stand: the hub pause must be armed first (2026-10-29 18:33).** `KrinikPauseGameInMenu` arms only after it sees the hero in the world with the
  full-screen UI CLOSED (log «взведено: герой в мире…»). A hub opened by the remote ≈1 s after `enter-world-remote.sh` stays at time 1.0 for the whole
  run — every timing case is then wrong. Stand step: after entering the world wait for «взведено» in `UE4SS.log`, then open the hub.

Temperature (2026-10-30, live + Hosav bytecode): the hero's temperature is `BPEnergyReceiver` (`/Game/Systems/BPEnergyReceiver`, a component of the hero) energy of type 1 — `GetEnergy(1)`; its `EnergyReceived` fires ≈1 Hz (no delegates on the class). The game's steps (Hosav `W_SmoothHP::Get_TempImage` thresholds): ≥55 heatstroke, ≥40 extremely warm, ≥30 very warm, ≥20 warm, −20…20 soothing (heart), ≤−20 cold, ≤−30 very cold, ≤−40 extremely cold, ≤−55 frostbite. The HUD °C is NOT the energy (energy 21.1 ↔ «32 °C», −20.5 ↔ «−8 °C»). Text fields: `TextBlock_TempText` in `W_SmoothHP` and `W_SmoothHP_Cernter` (children of Hosav's `W_NewHealthUI_C`), `TextBlock_Temp` in `W_TestHudOverlay_C`; no colour binding — `SetColorAndOpacity` holds. Desert oasis: noon → +20 in ~1 min, night → −20 in seconds.

## Facts of 2026-10-31 (minimized window, the notification window)

- **World entry under a MINIMIZED game window crashes the game** (seen once, 2026-10-31 07:49:03): the remote pressed «Продолжить» while the
  window was minimized (`ShowWindow` 6 by the feedback collector) → at «Starting Login» `LogRHI: Error: Check 'DestX + …' failed … Subresource …
  dimensions [8, 8, 1], copying from [0, 0, 0] to [1920, 1080, 1]` → D3D12 `E_INVALIDARG` fatal in a background worker. Control the same session: not
  minimized → enters fine; minimized 10 s IN the world → lives. A player cannot press a button of a minimized window, so this is the agent's path only:
  `_config/enter-world-remote.sh` restores a minimized window (SW_SHOWNOACTIVATE) before the press.
- **`WBP_QueuedNotificationWindow_C` lives under the GAME INSTANCE**, one instance from the main menu on (`…GameInstance…WBP_QueuedNotificationWindow_C_<N>`),
  visibility 4 (SelfHitTestInvisible) — whatever collapses it in the menu keeps it collapsed in the world. `KrinikMenuProbe` did so 25 s after every
  start from 2026-10-25 to 2026-10-31 (a refuted experiment left in; removed).
- **Enemy combat shouts are SUBTITLES** (2026-10-31 08:33–08:34, a remote hook on `/Script/UMG.TextBlock:SetText` near a fighting boss): «Чтоб тебя!»,
  «Умри!» are set into `…BP_ConanGameInstance_C_<N>.W_SubtitleEntryView_C_<N>.WidgetTree_<N>.textView` (a `GeneralText`), one new entry widget per
  line, under the game instance. Their Russian text is not in the deployed `ru/Game.locres` as UTF-16 («побери» absent) — the source of those lines is
  still to find. Plan 36 W29 (the «fly in» flicker) starts from this widget: its appear animation, recorded at 60 fps.
- **Subtitle lifecycle (2026-10-31 09:1x–09:2x, remote + Dev Kit probes `_config/devkit/kit-probe-subtitle.py`).** `W_SubtitleRenderer_C` (native
  `/Script/ConanSandbox.SubtitleRenderer`; tree `Overlay_0 → SizeBoxEntryListContainer` (OverlaySlot bottom-centre, padding L/R 50, bottom 140) `→
  EntryListView` (VerticalBox); BP function `UpdateEntryListPosition` sets that slot from `EntryListPadding/…Alignment`; native props `EntryViewClass`,
  `m_ActiveEntry`, `m_PendingEntryList`; native functions only `SlotKillAllSubtitles`, `GetIsSubtitleVisible`, `Initialize/DeinitializeBindings`). Per
  line the native code creates a NEW `W_SubtitleEntryView_C` (native `SubtitleEntryView`, root = one `GeneralText` `TextView`, Noto Sans `FS_Text_Body`),
  calls its BP event `SetText` in the same tick, `SetTextActive(true)` 8–197 ms later; visibility stays 4; the line is removed from the list with no
  event (`UserWidget:Destruct` hook silent) after the voice length (0.93–1.75 s seen; 0.09 s when replaced). The engine's subtitle manager is not a
  UObject — no duration readable from Lua. The text arrives as an ICU pattern («Не на того {Gender}|gender(напал,напала)!»), `GeneralText` formats it.
- **Building UI into a live widget from Lua (proven 2026-10-31, KrinikConanUI sections `krinik_shout_fade`, `krinik_minimap_coords`).** A panel widget:
  `StaticConstructObject(StaticFindObject('/Script/UMG.SizeBox' | '/Script/UMG.Border'), <owner>.WidgetTree, FName('<name>'))`, then
  `<overlay>:AddChildToOverlay(w)` → the slot (`SetHorizontalAlignment` 2 centre, `SetVerticalAlignment` 1 top / 3 bottom, `SetPadding{…}`). A user
  widget of a game class: `StaticFindObject('/Script/UMG.Default__WidgetBlueprintLibrary'):Create(pc, <class>, pc)`, put by `SizeBox:SetContent` /
  `Border:SetContent`. A Border's own brush: `b.Background` copy, `DrawAs = 4` (RoundedBox) + `OutlineSettings.CornerRadii {X,Y,Z,W}` +
  `RoundingType 0` → `SetBrush`, colour by `SetBrushColor` after it. Moving a widget: `RemoveFromParent()` then `SetContent` into ours. A root panel
  that is not a BP variable (`Overlay_0`, `MinimapOverlay`) is reached as `<known child>:GetParent()`.
- **A Canvas slot pushed past the screen edge is drawn SHRUNK, not moved** (Simple Minimap, 2026-10-31 09:51/09:58: `SetPosition` 6 units toward the
  corner kept the ring's edge on the same pixel and made it smaller). To move a widget into a corner use `SetRenderTranslation{X,Y}` — render only, size kept.
- **An actor handle kept in `_G` across remote calls can read a zero vector** (2026-10-31 10:05: a frozen boss, `IsValid` true, `K2_GetActorLocation`
  0 0 0 on the next call). Keep its NAME and re-find it each call (`corpse-stand.sh` pattern); copy X/Y/Z into numbers at once.
- **The game HUD can stand hidden as a whole** (2026-10-31 09:2x, after `launch-fg.ps1` → world entry → god → teleport): `W_NewHealthUI_C`,
  `WBP_MainHotbar_C`, `W_SubtitleRenderer_C` at visibility 2; `FunCombat_PlayerController_C:ToggleHUD(<1 param>)` with true/false changed nothing;
  `SetVisibility(4)` by the remote restores each. Cause unknown (input action `HideGui` exists on the controller).

- **The cheat manager on a stand (2026-10-31, `BP_ConanCheatManager_C` = `FindFirstOf('PlayerController').CheatManager`, after `exec MakeMeAdmin`):** works when CALLED
  directly — `God()` (`_config/god-on.sh`), `SetLevel(65)` (badge 65, the uncapped XP step), `Summon('<full class path>')` (spawns ≈ 0.7 m before the hero;
  only an ALREADY-LOADED class — else «Failed to find class» in the game log; the figure needs ≈ 10 s to load its look — the owner 11:33; a plain
  `HumanoidNPCCharacter_C` comes without a look). Does NOT work: `SetStat('Athleticism', 20)` (attributes move only by the points of the «Хар-ки»
  window), and the console `exec SetStat …` / `exec God` (reach nothing). Green Kappa: `/Game/Characters/NPCs/Primates/Blueprints/BP_NPC_Wildlife_Kappa_Green.BP_NPC_Wildlife_Kappa_Green_C`.
  The archery stand — `_config/arrow-stand.sh`. Set-up that worked 2026-11-01 17:4x–17:50 (cases L1–L5, V1–V3): `arrow-stand.sh summon` (green Kappa) →
  `place 8` → `freeze` BEFORE EVERY shot (an inventory visit lets it walk again); the hero's companion frozen too — `CLASS=HumanoidNPCCharacter_C
  arrow-stand.sh freeze` (he killed the target mid-recording); every `mouse-seq.ps1` sequence opens with a harmless F13 `kdown:0x7C` (the first input is
  eaten by the window's activation, EXP-0412 — otherwise the quick-slot key toggles the bow out of sync); a shot = `rdown,wait:1000,lclick,wait:400,rup`;
  the save's bow in slot 1 broke in the stands — a new «Мощный охотничий лук» by `exec MakeMeAdmin` + `exec SpawnItem 51405 1` lands in quick slot 3. A flight
  of 8 m lasts ≈ 3 frames at 60 fps: record with `ddagrab` and the desktop HDR off (`SvarogsDream/tools/hdr.ps1 off`, `on` after).

## Loot generation (read 2026-11-01 08:5x from `/Game/Systems/Loot/New/Culture/RelicHunters/DT_LC_RelicHunter`, 22 rows)

A loot table is a RECIPE of random rolls, not a list of items. Each row: `ItemID` (0 = no fixed item) or `UseTable` + `Table` (a nested table / row);
`RequiredTags` — a gameplay-tag query over the item catalogue (e.g. `ALL(Loot.General, Loot.T3)`, `ALL(Culture.Stygia, Item.Placeable …)`), so the item is
drawn at random from every item carrying those tags; `PercentChance` (100, 75 …), `Min` / `Max` amount, `NumRolls` (row 2: three rolls), `MinDurability` /
`MaxDurability`, `IntStatModifier` / `FloatStatModifier` (random stat changes on the dropped item), `RequiredEventTag`. A chest's spawner points at a table with
row `None` (`DT_LC_Exiles`, `DT_LC_RelicHunter`). So any item that carries the right tags enters the pools by itself — a mod's items can join the world's loot
by tags, without a table of their own.

## Test stands by place (2026-11-01)

- **Put the hero on the ground:** `bash _config/tp_ground.sh X Y [hover_s]` — flying hover, a line trace down, the hero 120 above the hit; no hit → exit 3,
  the hero stays hovering. Never `K2_SetActorLocation` onto an unknown Z (falls through unstreamed terrain). A teleport INTO the Caverns of Set loads their
  level (a loading screen); moving the hero again during that load leaves the screen stuck at 99 % — wait for the load or relaunch.
- **Points:** the save's beach (-78471, 245900) ground −20167, day energy ≈ 21–22 («тепло»); the volcano (-60000, -220000) ground 45640, energy 70 within
  seconds; the caverns (-154300, 6216) energy ≈ 33; the north-west (-300000, -260000) at night −26 … −30 (no ground point below −30 found yet).
- The game day lasts 55.2 min (`ConanTimeOfDayManager:GetDayLength`), ≈ 2.3 min per game hour; `GetTimeOfDay` / `SetTimeOfDay` on `BP_TimeOfDayManager_C`.
- So the sun moves ≈ 0.11°/s, and the shadow-casting light turns (`DynamicSky.SolarUpdateAngleDelta`, the disk always smooth): 0.003° ≈ 36×/s, 0.1° ≈ 1×/s,
  0.25° ≈ every 2.3 s, 2.0° ≈ every 18 s (bug 67). A light/shadow measurement fixes the time before each clip (EXP-0469).
- The idle vanity camera hides the HUD: `FindFirstOf('GUIModuleController'):EnableVanityCameraMode(false)` before a HUD frame.
- **Every named place of the map with its coordinates (2026-11-02 19:0x):** the DataTable `/Game/Systems/Map/MapMarkers_ConanSandbox` (424 rows; row fields
  `Name` — Russian FText, `Location` — a vector in cm), read by `t:ForEachRow(function(name,row) … end)` from the remote; the English names come from
  `Conan Exiles Mods/_text-extract-3.0.1/glossary-3.0.1.tsv` (en → ru). The game's 55 «Vista» places (the community's list of scenic spots —
  guides4gamers / wand pages name them, without coordinates) are rows of that table: Oasis Overlook «Вид на оазис» (−253832, 16193, 1233), Canopy Outlook
  (220425, 43688), Godsight Spire (−135060, 74567), Skyfall Ridge (−177478, −141986), Riversend (−193946, −32220), Shattered Springs (−193314, 21149), Eyelet
  Lake (−179518, −170940), The Crowngrove (−256864, −10091), Oasis of Nekhet (−256741, 39991), Imi's Cradle (32653, 21022), Priestking's Retreat
  (−28442, 27185) and more — the scripts `markers.lua` / `vistas.py` of that session, the method above is enough to redo them.
- **The corpse / quick-loot stand (2026-11-03 19:3x, KUMM bug 75):** the oasis beach at (−78166, 245999) — `p:K2_TeleportTo({X=-78166,Y=245999,Z=-15000},…)`
  (he lands at z −20073; `exec TeleportPlayer` does nothing in 3.0.1), open sand and grass, crocodiles and Kappas around — `quiet-stand.lua` leaves their corpses;
  the hero next to one by `corpse-face.lua` (`_G.__cf_dist=300`, the east side is open here) or `corpse-approach.lua` (his own side). NOT suitable: Iruk city
  (townsfolk respawn, a living cook under the crosshair), the ostrich-nest canyon (−61703, 268654 — `corpse-face` puts the hero into the cliff). Takeable nest eggs (2026-11-06, bug 82): actors
`/Game/Items/GatheringResources/SM_KappaEggs_Blueprint_C` by the `SM_KappaNest` meshes (`Gameplay_NPCs_Desert_SouthWest`), 3 loaded from the oasis save, the
nearest ≈70 m — a gathering-resource ACTOR, not foliage; the vulture nests (`SM_Nest_ostrich` mesh, `Wildlife_split113`) are decoration.
- **The release screenshot stand (2026-11-02 19:15, `[OWNER]` «КАДР ОХУЕННЫЙ!!!!»):** the edge of the Oasis Overlook plateau (+9 m) at (−253750, 18150) — south of it the
  plateau drops to the green Nekhet oasis floor (−45 m) with palms and water, the ruined temple on the left, dunes and rock pillars beyond; the hero faces
  south (yaw ≈ 92), the owner's own camera (`config.lua`) and wheel distance 745; noon by `SetTimeOfDay(11.0)`. Height grids by `_config/terrain-probe.sh`
  (rays only hit streamed terrain — run them with the hero within ≈ 1 km, far points return «?»). Scouting from above: the hero flying (`SetMovementMode(5)`)
  300–500 m over a point, one frame each.
- **Quick-bar kit without a crash:** `ShortcutBarInventory:RemoveItem(<occupied slot>, FName('None'), nil)` then `exec MakeMeAdmin` + `exec SpawnItem <id> <n>` —
  the item lands in the first free quick slot; one slot per step. **A crash paid:** a loop of `BackpackInventory:RemoveItem(i, …)` over indices 120…0 together
  with `ShortcutBarInventory:AddItemTemplate(id, slot, nil, n, true, 1, 0)` killed the game (EXCEPTION_ACCESS_VIOLATION in UE4SS, 2026-11-02 19:11, while the
  owner stood in the world) — never call inventory functions on slots that may be empty, never in the owner's running game. Item ids: ItemTable rows
  (`/Game/Items/ItemTable`, `row.Name:ToString()` Russian): Лук из кости дракона 54003, Лук из звездного металла 51586, Лук Бездны 43001, Меч Крома 50506,
  Огромный меч Великого Волка 50543, Обсидиановая стрела 51503, Взрывная стрела 53617, Змеиная стрела 53651. Food and water — the fields
  `GetHungerSystem().FoodCurrent / DrinkCurrent = 100.0`.

## The game's own mod list (main menu «Моды», 2026-11-03, plan 44)

- The panel «Сведения о моде» shows a pak's `modinfo.json` fields as they are: `name`, `description`, `author`, `authorUrl`, `changeNote` (and the version) —
  Workshop BBCode and links are drawn raw; Cyrillic renders. The fields live in the outer wrapper (`ConanSandbox/Mods/modinfo.json` next to `manifest.json`
  with the MD5 of every file); `_config/devkit/set-pak-modinfo.py` rewrites them without a re-cook (the file list and every other file byte-equal).
- Opening the list by the remote: `call W_MainMenu_MainMenu_C_<N> BndEvt__W_MainMenu_MainMenu_B_Mods_K2Node_ComponentBoundEvent_1_SignalClicked__DelegateSignature WidgetTree_<M>.B_Mods`.
- Only cooked mods are listed. A wrapper with only modinfo/manifest → «Incompatible Mods Detected … Missing platform-specific pak»; with tiny legacy
  `<Mod>-Windows.pak` / `-WindowsServer.pak` → «Missing AssetRegistry.bin in mod folder» (the modal blocks a clean close). A Lua-only mod needs a kit-cooked
  empty mod to appear (`kit-buildmod.py`).
- An in-game loading screen (`W_IngameLoadingScreen_C`: `TeleportPlayer`, waystones, respawn) counts as full-screen GUI (`IsFullscreenGUIActive`) and is
  followed by a NEW Damage Meter widget `DN_UI_DmgWidget_C` (and a new Hosav HUD) — mods that decorate widgets must re-apply on the widget's own birth (bug 79,
  KrinikConanUI notes).

## Thrall placement (read 2026-11-06 14:17 +03:00, plan 45 step 8a)

- The hero's `BP_ThrallSystemComponent` (`BasePlayerChar_C….BP_ThrallSystemComponent`, class `/Game/Systems/Thrall/BP_ThrallSystemComponent`, parent
  `/Script/ConanSandbox.ThrallSystemComponent`) — functions `ShowThrallPlaceable(ThrallInfo) → ghost actor`, `StopPlacingThrall`, `StartMovingThrall(thrall)`,
  `PlaceThrall`, `CanBePlaced`, `CheckValidPlacement`; state `IsPlacingThrall`, `ThrallPlacementMode` (1 placing from an item; the BP compares 2 and 3 too).
- `FThrallInfo`: ThrallName, ThrallIcon, ThrallTier_DEPR, ThrallProfessionTier, ThrallBuff, ThrallProfession, BonusRecipes, CraftingGroups, ThrallTemplateID, ThrallGroup,
  SpawnTableId, IsFemale, ThrallItemID. The ghost's LOOK comes from the thrall item's character layout (`ThrallItem.ThrallCharLayout`), not from `SpawnTableId`:
  the barkeeper item with `SpawnTableId = Aesir_Boss` shows the same naked human ghost.
- Stand: `exec MakeMeAdmin` + `exec SpawnItem 25002 1` (`XX_Barkeeper Thrall Item`, row `Tavern_Barkeeper`; 147 `ThrallItem` rows in `ItemTable`, field
  `SpawnTemplateID`) → the instance `ThrallItem_…` in `BackpackInventory` → `item:OnUseItem(hero, controller)` = the player's «use»: placement starts, the ghost stands
  where the camera looks (open walkable ground — a Kappa in front hid it). Tool: `ConanExiles/_config/thrall-ghost-probe.lua` (modes list · use · hook · seen · stop).
- A thrall the player owns comes only through the wheel of pain: `BasePlayerChar_C:StartThrallifyingPrisoner(ThrallConverter: Actor)` → a `ThrallItem` in the
  wheel's inventory. `FindOrSetupThrallComponent(npc, ThrallInfo)` returns a component but does NOT make the NPC the player's thrall.
- What NOT to do: `StartMovingThrall(<hostile NPC>)` crashed the game (access violation 0x10, 13:59; again 16:56 after `FindOrSetupThrallComponent`, and the same
  with the original LBPR pak — a call on an NPC the player does not own); reading `PlaceableThrallActor` / `CurrentThrallBrushClass` from Lua
  preceded a crash (0x242, 14:08); the remote refuses `FindAllOf(<…Component>)` (it crashed the game before). `RegisterHook` on `Actor:SetActorScale3D` does not see
  BP→native calls; the hook on the BP `ShowThrallPlaceable` fires once per use (after the body) but its return value is not readable in Lua.
- The ghost actor is not a `Character`/`Pawn` and was not found by class name; its scale was not read as a number (G3 judged by a frame).

## Kappa nests (read 2026-11-06 14:36, bug 82)

- `SM_KappaEggs_Blueprint_C` (`/Game/Items/GatheringResources/SM_KappaEggs_Blueprint`, actors `SM_KappaEggs_North_Camp_10/11/12` near the oasis) holds no eggs:
  a SceneComponent and one `InstancedStaticMeshComponent` `InstancedBushes`, mesh `palm_ground_misc_01` (5 palm-bush instances per nest). The plate's «E Взять»
  over it and a real E there are a BUSH case (the E press raised the water stat; no item entered the backpack).
- The eggs a hero takes by E: pickable foliage `SM_SnakeEggs_single` in `PickupFoliageComponent_C` (e.g. a nest of three at (−57399, 237721, −20027);
  18 within 400 m of the oasis); E gives item 13011 «Egg». Stand: `ConanExiles/_config/egg-find.lua`.
- Do not loop `FindAllOf('StaticMeshActor')` reading their components — that crashed the game (14:35).

## Music (read 2026-11-06, plan 46 — KrinikConanMusic)

- Places: ONE `BP_SoundStage_C` (native `AConanSoundStage`) plays rows of `SoundStageAudioTable` (group 0 = music, 2 crossfading slots; group 1 =
  ambience, 5 slots); the playing music cue is `AudioComponents[1..2].Sound`, `AudioInfo[i].State` 0/1/2. Mods add stage tables (Caverns of Set, Ymir's Respite).
- Combat: component `BP_AC_AudioController_C` of the hero — `AggroList` (in combat while not empty), `PlayingCombatMusicThreatLevel` (tier of the last
  combat track, never reset), `AudioComp1/2`, BP event `UpdateCombatMusicStateWithNewActor`; tiers from `CombatMusicTable` (VeryEasy … Avatar).
- Sound classes per kind: `Soundstage_2d_Music`, `MusicCombat`, `MusicCombat_Boss`, `MusicDeath`, `MusicPurge`, `MusicMenu`; `Properties.Volume` set at
  runtime takes effect at once. Death ← `FunCombat_PlayerController`, Purge ← `BasePlayerChar` / `ConanCharacter:OnPurgeMusicRequested`, menu ←
  `GUIModuleController:PlayMusic`. Detail, the cue list and the rows — `researches/conan-custom-music-mods/conan_music_system.md`,
  `games/ConanExiles/mods/KrinikConanMusic.md`.
