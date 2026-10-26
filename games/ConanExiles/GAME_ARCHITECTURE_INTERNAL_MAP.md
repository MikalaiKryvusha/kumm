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
| Строка в байткоде (`EX_StringConst` 0x1F без 0x29 перед ней) | склейки вроде «Fishing Power: » | не решено: правка байткода сдвигает адреса переходов |

Сборка правленого ассета — склейкой: исходный zen-заголовок с новыми смещениями экспортов + пропатченный `.uexp`; `retoc to-zen` для блюпринтов 5.8
не годится (EXP-0338).

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
