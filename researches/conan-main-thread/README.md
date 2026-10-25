# Разведка — главный поток и подгрузка мира в Conan Exiles 3.0.1 (UE 5.8)

> **Created:** 2026-10-26 · **Parent:** бенч-облёт Конана, замеры 25.10 · **Status:** разведка, ничего не применено · **Outbound:** —

Вопрос: как разгрузить игровой поток и сделать подгрузку мира «уважительнее» (меньше рывков при полёте в новые места). Игру не
запускал, конфиги не трогал. Прочитаны: свои конспекты `researches/ue5-cvars/` (README, threading, streaming-worldpartition),
`researches/conan-performance-mods-2026-10/`, план 33 п. 4б, `ConanExiles/docs/dw-cvars/` (stream, ai-lod, nav-move, spawn-ai),
реестр `ConanExiles/_config/cvars-registered.txt`, оба `Engine.ini`, журналы игры 25.10, `bench.log` мода KrinikConanBench, карты
кадров `D:\Games\Conan Exiles Mods\_bench\fps-map\*.tsv`. Справки к переменным сняты строками из
`ConanSandbox-Win64-Shipping.exe` (справка в бинарнике лежит прямо перед именем — метод из `docs/dw-cvars/stream.md`).

## 0. Главное, что нашлось до всяких переменных

**Рывки прогретых облётов 25.10 — в основном не подгрузка ландшафта.** Журнал игры (`ConanSandbox-backup-2026.10.25-20.44.13.log`,
время журнала = местное − 3 ч) сопоставлен посекундно с картами кадров облётов `etalon-fog` (C2) и `etalon-nofog-b` (C3). Начало
облёта найдено по строке `dw.DisableWeatherSystem = "1"`: она есть и в журнале игры, и в `bench.log`, а до старта ровно 20 с
зависания. C2 стартовал в 20:37:32.056, C3 — в 20:41:01.226 (время журнала).

| секунда облёта | рывков (C2 / C3) | худший кадр, мс | что в журнале в ту же секунду (±1 с) |
|---|---|---|---|
| 110 / 111 | 4 / 5 | 101,8 / 105,1 | `LogConanPlayerController: Finishing delayed playing state`: игра снимает свой экран загрузки и заново строит HUD |
| 119–120 | 1 / 1 | 75,3 / 83,6 | спавн нежити Безымянного города: `NPC: Error … NPC_Charred_Remains`, `NPC_Dark_Soul_Boss` |
| 135 | 1 / 1 | 53,3 / 51,7 | спавн: `NPC_Charred_Remains`, `destroyed on spawn` (олень) |
| 145 | 1 / 1 | 72,5 / 69,5 | спавн `NPC_Charred_Remains` |
| 150–152 | 1 / 2 | 50,1 / 52,5 | спавн `Elk_King … destroyed on spawn` (C3) |
| 157–158 | 2 / 3 | 88,7 / 74,7 | смена региона `Presence: "PS_Wasteland" => "PS_Highlands"` (и достижение `ACH_ReachHighlands` за 0,2 с до неё) |
| 171–174 | 4 / 3 | 80,7 / 87,9 | 10–12 строк `Recreating Clothing Actors` в секунду (спавн людей у дома героя) и смена региона обратно |
| 4–7 | 2 / 2 | 59,1 / 55,9 | ничего |

Итог: из 12 секунд с рывками в каждом прогретом облёте 10 стоят в пределах секунды от записанного события. Холодный облёт C1
(`etalon-nofog-a`) показывает те же пятна плюс прогрев: худший кадр 181 мс в секунду 99 — сразу после входа в регион
`PS_UnnamedCity` (t = 97,2 с), в прогретых облётах на этом месте рывка нет.

**Самый крупный пакет рывков (t = 110–111) — артефакт бенча.** После каждого облёта герой оказывается под землёй (X = −36149,
Y = 137393, Z ≈ −20 000). Подсистема игры `UndermeshDetectionSubsystem` это видит (20:37:00, 20:40:30, 20:43:59), телепортирует героя
и включает режим «телепорт + экран загрузки» (`ClientState: 2`, `ShaderPipelineCache: Resumed Batching`, `Waiting for streaming
completed (teleport…)`, `Levels loaded: 1462/1462`, `Delaying playing state`). Следующий облёт стартует внутри этого режима, а режим
кончается на 110–112 с полёта перестройкой интерфейса. Значит, первые ~110 с эталонов C2 и C3 сняты не в обычном состоянии игры.
В сессии 21:42 (облёт после SCSKiller) строк `Undermesh` уже нет — видимо, помогла правка посадки героя (коммит eecdf9d), но эталон
с ней ещё не переснят.

**Вывод для выбора рычагов.** Подгрузка плиток мира (World Composition, `LogConanWorldComposition`) в журнал не пишет, поэтому её доля
пока не видна: отсутствие строк ≠ отсутствие работы. Но то, что видно, указывает на **спавн NPC** (люди с тканью, нежить руин) и на
**смену региона**. Ари Арнбьёрнссон (Epic, доклад «The Great Hitch Hunt», Unreal Fest 2025) называет спавн актёров со скелетными
мешами одной из главных причин рывков: такой актёр рождается за миллисекунды. Поэтому кандидаты ниже ранжированы под спавн, а
приборы раздела 2 нужны, чтобы доказать или опровергнуть эту гипотезу до правок.

**Чего в Конане нет.** World Partition карта не использует: ни одной строки `LogWorldPartition` за все сессии, а у Funcom своя ручка
`dw.WCStreamAroundAllClientsInListenServer` со справкой про World Composition. Поэтому всё семейство `wp.Runtime.*` к нашему случаю
не относится. `WorldPersistence` грузит из базы 17 актёров один раз при входе («Finished loading 17 actors in 0.1 seconds») — в полёте
не работает. Одиночная игра — listen-сервер (`LoadMap … ?listen`): серверная логика (NPC, спавнеры, постройки) живёт в том же игровом
потоке, что и клиент.

## 1. Кандидаты, по убыванию ожидаемой отдачи

Колонка «у нас» — из журнала 25.10 (`LogConfig: Set CVar`), «не видно» — читать пультом: `exec <имя>` без значения пишет в журнал
строку `<имя> = "<значение>"` (так в журнале видны `r.Fog = "0"`). Реестр — `cvars-registered.txt` (строгое совпадение имени).
Справка в кавычках — дословно из бинарника 3.0.1.

| № | переменная / действие | что делает | в реестре 3.0.1 | у нас | эффект на наш случай | риск | источник |
|---|---|---|---|---|---|---|---|
| 1 | **Чистый эталон**: облёт только после строки `Finishing delayed playing state` и без `Undermesh teleport activated` в окне облёта | убирает из замера экран загрузки игры и перестройку HUD | — | не соблюдалось в C2/C3 | минус 4–5 рывков и худший кадр 105 мс у **каждого** прогретого облёта; без этого A-B не отличит правку от шума | нет | журнал 25.10, раздел 0 |
| 2 | `dw.EnableAISpawning 0` — **прибор**, не лечение | выключает спавн NPC | да | не видно | если рывки 119–158 с исчезнут, гипотеза «спавн» доказана; иначе — ищем в подгрузке плиток | новые NPC не появляются, мир пустеет до возврата `1`; играть с ним нельзя | `docs/dw-cvars/spawn-ai.md` (рецепт пустой карты); справки в бинарнике нет |
| 3 | `p.Chaos.EnableAsyncInitBody 1`; парный `p.SkeletalMeshComponent.EnableAsyncInitBody` | «[Experimental] Master switch for async body instance creation AND destruction … body init/term work runs on worker threads … Read-only — must be set … before world init. Default is false.» | оба да | не видно (по справке — 0) | создание физических тел при спавне NPC и вводе плиток уходит на рабочие потоки; бьёт ровно в найденные пятна 119–174 с | экспериментально: Epic не советует выпускать с ним игру, при росте физсцены проблема может вернуться сильнее; возможны падения; ставится только в ini до запуска | справка 3.0.1; Ари Арнбьёрнссон, Unreal Fest 2025 |
| 4 | `p.ClothPhysics 0` | симуляция ткани (в UE 5.1 по умолчанию 1) | да | не видно | каждый спавн человека пишет `Recreating Clothing Actors` (10–12 строк в секунду на 171–174 с); узнаём, сколько стоит ткань при рождении NPC. Пропускает ли `0` само создание — **источника нет**, только замер | плащи и волосы перестанут колыхаться (видно глазом, решает владелец) | `ue5-cvars/threading.md` §8; журнал 25.10 |
| 5 | `LevelStreaming.AllowIncrementalPreRegisterComponents 1` → затем `LevelStreaming.MaximumMakingVisibleLevels 2` | «incremental pre-registration of actor components»; второе — «maximum number of levels in the process of being made visible (default is 1) … in conjunction with incremental component pre-registration & asynchronous physics state creation … set to a value greater than 1 to maximize the usage of the time limit allowed by s.LevelStreamingActorsUpdateTimeLimit» | оба да | не видно | ввод плитки в мир дробится по кадрам точнее; поможет, только если прибор (раздел 2, `.tsv` профайлера подгрузки) покажет, что рывки — `AddToWorld` | справка: «Can cause an infinite hang if LevelStreaming.MaximumMakingVisibleLevels is too low»; второй шаг — только вместе с №3 | справка 3.0.1 |
| 6 | `s.AdaptiveAddToWorld.Enabled 1` | «Enables the adaptive AddToWorld timeslice (replaces s.LevelStreamingActorsUpdateTimeLimit) (default: off)»; коридор `…TimeSliceMin/Max` 1/6 мс | да | не видно (по справке 0); фиксированный бюджет `s.LevelStreamingActorsUpdateTimeLimit` = 3 мс поставила Funcom | бюджет ввода плиток подстраивается под очередь вместо постоянных 3 мс; эффект — только если узкое место в `AddToWorld` | включение отменяет `s.LevelStreamingActorsUpdateTimeLimit`; потолок рывка от ввода — 6 мс по умолчанию | справка 3.0.1; `streaming-worldpartition.md` табл. C |
| 7 | **Цена дальности**: `r.ViewDistanceScale`, `foliage.LODDistanceScale`, `grass.CullDistanceScale` → 1.0, `r.StaticMeshLODDistanceScale` → 1.0 | наш `Engine.ini` вдвое раздвинул отрисовку, листву и траву | все да | 2.0 / 2.0 / 2.0 / 0.75 | площадь травы и листвы ×4 (квадрат радиуса): больше компонентов травы рождается на ходу и больше примитивов в видимости → и средний CPU busy, и рывки при полёте 25–30 м/с. Это **замер цены**, а не совет урезать: дальность — выбор владельца | на глаз — мир «короче»; решение владельца. Мягче, без потери дальности: `grass.MaxCreatePerFrame` («Maximum number of Grass components to create per frame»), `grass.TickInterval` | наш `Engine.ini`; `ue5-cvars/grass-foliage.md` |
| 8 | `tick.AllowConcurrentTickQueue 1`, `tick.AllowAsyncTickDispatch 1`, `tick.AllowAsyncTickCleanup 1`, `tick.IdleTaskWorkMS` | «queue ticks concurrently using multiple threads … can change the order of ticking»; «ticks are dispatched in a task thread»; «cleaned up in a task thread»; IdleTaskWorkMS — сколько мс игровой поток в простое берёт чужих задач | все да | не видно; `tick.AllowBatchedTicks` = 1 | снимает с игрового потока работу планировщика тиков; у listen-сервера с тысячами NPC и станков тиков много. Ждём снижения **медианы** CPU busy, не рывков | порядок тиков меняется → редкие ошибки логики (Funcom под это не проверяла); проверять бой, верховую езду, станки | справки 3.0.1; веб-описаний нет |
| 9 | Бюджет анимации: `a.Budget.BudgetMs 2.0 → 1.0`; альтернатива — `a.URO.ForceAnimRate` | «The time in milliseconds that we allocate for skeletal mesh work … When overbudget various other CVars come into play» | да | `a.Budget.Enabled` 1, `BudgetMs` 2.0, `MaxTickRate` 5, `a.ForceParallelAnimUpdate` 1 | меньше анимации на игровом потоке в толпе (руины, город, своя база); на спавн не влияет | дальние NPC двигаются рывками; URO работает только у мешей, где игра его включила (`a.URO.Draw` в Shipping, вероятно, вырезан) | справка 3.0.1; `threading.md` §8 |
| 10 | AI LOD Конана: `dw.AILOD1Distance` (в 2.x было 3000 = 30 м), `dw.NpcLOD0ListenServer*TickRate`, `dw.SkeletalMeshTickRate` (0.25) | сколько NPC живут на полном тике и как часто думают | да | 2.x: 3000 / 0.25; в 3.0.1 не видно | средний расход в населённых местах; на спавн не влияет | поведение NPC; разбор, порядок проверки и ловушка `dw.ReapplyControllerTickRates` — в `docs/dw-cvars/ai-lod.md` | `ai-lod.md` |
| 11 | Lua-моды: опросы `FindFirstOf` раз в 250 мс (KrinikFpsCounter, KrinikPauseGameInMenu), сторож камеры раз в 30 мс (ConanCameraControl), покадровый цикл KrinikConanBench; UE4SS с `HookProcessInternal = 1` и `HookAActorTick = 1` | каждый `FindFirstOf`/`FindAllOf` идёт по массиву объектов на игровом потоке | — | 8 модов включены (`enabled.txt`) | ожидаю малое: на Medieval Dynasty «только UE4SS» дал 10,88 мс против 10,93 ванили (план 16, п. 0.6), но наших модов там не было. KrinikHudOutline после перестройки HUD проходит по всем `TextBlock` дважды — возможный вклад в рывок 110–111 с | нет | код модов; план 16 |
| 12 | Вынос работы рендер-потока: `r.Visibility.TaskSchedule 1`, `r.AsyncCacheMeshDrawCommands`, `r.AsyncCreateLightPrimitiveInteractions`, `r.GPUScene.ParallelUpdate N` | видимость — «on an async task graph»; кэш команд отрисовки и связи свет–примитив — «offloaded to an async task»; GPUScene — параллельно, если элементов больше N | все да | не видно | только если WPR покажет, что упор в **рендер-поток**, а не в игровой: PresentMon их не различает | малый; `r.GPUScene.ParallelUpdate` в 5.8 — порог N, а не 0/1 | справки 3.0.1; LTSharpe (план 33 п. 4б) |
| 13 | Инкрементальный сборщик мусора: `gc.AllowIncrementalReachability 1`, `gc.AllowIncrementalGather 1`, `gc.IncrementalReachabilityTimeLimit 0.002` | разметка достижимости дробится по кадрам с мягким лимитом | все да | не видно; `gc.TimeBetweenPurgingPendingKillObjects` 61.1 | рывков с периодом ~61 с в картах кадров не видно, поэтому отдача ожидается малой | Epic: экспериментально, «not fully thread safe», советует только однопоточные сборки (выделенный сервер); игра должна держать ссылки в `TObjectPtr` — у чужой игры это не проверить | документация Epic (Incremental GC) |
| 14 | `r.Nanite.Streaming.NumInitialRootPages 3072`, `r.RHICmd.ParallelTranslate.Enable` | начальный буфер страниц Nanite без роста посреди игры; параллельная трансляция командных списков | оба да | не видно | рендер и RHI, не игровой поток; уже стоят в плане 33 п. 4б | малый | LTSharpe; справка 3.0.1 |

**Пятно без рычага.** Смена региона (`Presence: …`) даёт 1–3 рывка 75–92 мс в каждом облёте. За 0,2 с до неё пишется достижение
(`ACH_ReachHighlands … written successfully`). Что именно делает игра при смене региона (музыка, окружение, запись достижения) —
источника нет. Переменной против этого в реестре не нашёл; путь — WPR (раздел 2), затем, возможно, Lua-перехват.

**Не кандидаты (проверено, почему).**
- `wp.Runtime.*` — World Partition в карте нет (см. раздел 0).
- `WorldPersistence.EnableAsyncDBActorsLoading`, `…MaxInFlightAsyncDBQueries` — работают при входе в мир, 17 актёров за 0,1 с.
- `dw.WCStreamAroundAllClientsInListenServer` — в одиночной игре «все игроки» = один герой (`docs/dw-cvars/stream.md`).
- `s.IoDispatcher*`, `r.Streaming.PoolSize` — упор не в диск и не в видеопамять; LTSharpe мерили `r.Streaming.PoolSize 6000` и
  `p.EnableDeferredPhysicsCreation 1`: на рывки в дороге не влияют (`conan-performance-mods-2026-10/README.md`).
- `s.AsyncLoadingTimeLimit`, `s.PriorityAsyncLoadingExtraTime` (у нас 15), `s.LevelStreamingActorsUpdateTimeLimit` (у нас 3) — по
  одному крутить вслепую нельзя: в сети советы противоположные (мод Ready or Not ставит 2.0, гайд bugnet — 5.0), а по нашему конспекту
  один тяжёлый актор пробивает любой лимит целиком. Сначала `s.WarnIfTimeLimitExceeded 1` (раздел 2).
- Отсутствуют в реестре 3.0.1, не предлагать: `gc.MultithreadedDestructionEnabled`, `r.ISM.ParallelProxySetup`,
  `r.UseParallelGetDynamicMeshElementsTasks`, `r.ParallelInitViews`, `fx.Niagara.AllowAsyncWorkToEndOfFrame`,
  `r.Nanite.Streaming.MaxPageInstallsPerUpdate`, `r.LevelStreamingDistanceScale`, `grass.UseHaltonDistribution`.
- Шейдеры и PSO (`r.pso.*`, `r.PSOPrecache.*`) — тема SCSKiller; туман — отдельная тема.

## 2. Как узнать, кто ест главный поток, без CSV-профайлера

`stat fps` в этой сборке вырезан (план 33 п. 4а); строки `stat unitgraph` в exe есть, но работает ли команда — неизвестно: проверить
одним `exec stat unit` и не рассчитывать на него. Строк `StartFPSChart`, `Trace.Start`, `-trace=` в exe нет — Unreal Insights и
FPS-чарт недоступны.

**А. Windows Performance Recorder / Analyzer — главный прибор.** На машине стоят `C:\Windows\System32\wpr.exe` и полный комплект в
`C:\Program Files (x86)\Windows Kits\10\Windows Performance Toolkit\` (`wpa.exe`, `wpaexporter.exe`, `xperf.exe`). Нужна консоль
администратора и замок машины (`_tools/machine-lock.mjs`).

```
wpr -start CPU -start GPU -filemode
:: облёт krinik-show (отдельный от облётов PresentMon: стеки добавляют нагрузку)
wpr -stop "D:\Games\Conan Exiles Mods\_bench\wpr\<метка>.etl"
"C:\Program Files (x86)\Windows Kits\10\Windows Performance Toolkit\wpa.exe" "D:\Games\Conan Exiles Mods\_bench\wpr\<метка>.etl"
```

Что смотреть в WPA:
- **CPU Usage (Sampled)**, группировка Process → Thread Name → Module. Отвечает на вопрос «игровой или рендер-поток». Имена
  потоков (`GameThread`, `RenderThread`, `RHIThread`, `Foreground Worker`, `Background Worker`) в exe есть строками. Microsoft
  пишет, что имена, заданные `SetThreadDescription`, видны в WPA. Проверить на первой записи; если имён нет, игровой поток — тот,
  что с наибольшей долей и стеком из стартовой точки exe.
- Разбивка игрового потока по модулям без PDB: `ConanSandbox-Win64-Shipping.exe` (движок и игра), `Dreamworld.dll` (код Funcom:
  AI LOD, спавн, постройки), `UE4SS.dll` (Lua-моды), драйвер `nvwgf2umx.dll`, Streamline/DLSS. Имён функций не будет, но доля
  Funcom против движка против модов — будет.
- **CPU Usage (Precise)**: ждёт ли игровой поток рендер-поток (Ready Thread) или работает сам.
- Рывок находится по событиям Present из провайдера GPU (`-start GPU`) — длинный промежуток между Present; выделить его на шкале и
  смотреть, какой поток и модуль заняты в этом окне.
- Повторяемый отчёт: один раз сохранить вид в WPA как профиль, затем
  `wpaexporter.exe -i <etl> -profile <вид>.wpaProfile -outputfolder <папка>` даёт CSV без окон.

**Б. Журнал игры как прибор (команды пультом `exec`, имена есть в реестре).**
- `s.WarnIfTimeLimitExceeded 1` (у нас 0) — предупреждение в журнал, какой бюджет подгрузки превышен и насколько;
  `s.TimeLimitExceededMultiplier` 1.5 и `s.TimeLimitExceededMinTime` 0.005 оставить.
- `LevelStreaming.Profiling.Enabled.Shipping=1` и `LevelStreaming.Profiling.StartAutomatically=1` — **только в ini до запуска**
  (подсистема создаётся вместе с миром). Справка: «Whether to enable the LevelStreamingProfilingSubsystem automatically». По
  документации Epic (API 5.8) подсистема пишет в каталог Profiling файл `.tsv`: на каждый уровень — `TimeQueuedForLoading`,
  `TimeLoading`, `TimeAddingToWorld`, `FinalStreamInDistance`, `FinalStreamInLocation`. Это прямой ответ «рывки — ввод плиток или
  нет». Файл пишется по `StopTrackingAndReport()`; вызывается ли он сам при выходе из мира — источника нет, проверить выходом в меню
  и поиском `.tsv` в `ConanSandbox\Saved\Profiling\`. Порог «поздней подгрузки» — `LevelStreaming.Profiling.LateStreamingDistanceSquared`.
- `dumpticks` (строка «Usage: dumpticks» в exe) — список всех тиков в журнал: снять в пустыне и над руинами, сравнить число тиков
  по классам.
- `dw.ControllerTickRateAuditEnabled 1` — аудит тик-рейтов контроллеров NPC (`docs/dw-cvars/ai-lod.md`).
- `t.SlowFrameLoggingThreshold 0.05` (в секундах, по справке) и `tick.LightweightTimeguardThresholdMS 20` — имена есть, но
  пишут ли они что-то в Shipping, неизвестно. Один заход, затем поиск в журнале.

**В. Сопоставление журнала с картой кадров.** Метод раздела 0: время старта облёта по `dw.DisableWeatherSystem` (журнал игры ↔
`bench.log`), затем посекундный счёт событий и рывков. Скрипты этой разведки:
`D:\Temp\claude\d--work-ai-sandbox-KUMM\fab940bf-4248-496d-bd79-4dc736b7928d\scratchpad\mainthread\events_per_second.py` (запуск:
`python -I <скрипт> <журнал игры> <карта .tsv> <ЧЧ:ММ:СС.ммм старта>`) и `events_vs_hitches.py` рядом. Стоит перенести в
`ConanExiles/_config/` и вызывать из `bench-flight.sh`, чтобы каждый облёт сам получал строку «рывки ↔ события».

**Г. A-B-A без модов.** Облёт с выключенными Lua-модами (кроме KrinikConanBench и KrinikAgentRemote — без них нет облёта и пульта):
убрать `enabled.txt` у KrinikFpsCounter, KrinikHudOutline, KrinikPauseGameInMenu, KrinikOblivionLocomotion, ConanCameraControl,
ConanModPackStatus → облёт → вернуть. Сравнивать медиану `MsCPUBusy` и число рывков.

**Д. Грубые разделители.** DLSS «Сверхпроизводительность» вместо 0,58: если `MsCPUBusy` и рывки не изменились, упор в процессор
(игровой или рендер-поток — этим не различить). `dw.EnableAISpawning 0` (кандидат 2) — разделяет спавн и подгрузку плиток.

## 3. План замера

**Общий протокол.** Облёт `krinik-show` (`bash _config/bench-flight.sh krinik-show <метка>`), игра на переднем плане, кино владельца
выключено (его слово), замок машины. Один прогревочный облёт после входа в мир, затем A-B-A (лучше A-B-A-B) только прогретыми
облётами. Облёт засчитывается, если в его окне в журнале игры нет `Undermesh teleport activated` и старт был после
`Finishing delayed playing state` (кандидат 1). Переменные пультом меняются между облётами; помеченные «только ini» — перезапуском
игры, тогда на каждый запуск свой прогревочный облёт.

**Что считать.** По PresentMon: число рывков ≥ 50 мс всего и в окне севера 115–160 с, худший кадр, 1 % низких, медиана к/с и медиана
`MsCPUBusy`. По журналу: события в секундах рывков (метод 2В). Шум бенча — разброс A-A: 25.10 два прогретых облёта дали 16 и 18
рывков, то есть ±2 рывка в сумме и ±1 в окне севера. Успех — **оба** B лучше **обоих** A больше чем на этот разброс, и в тех же
секундах, где были рывки.

| № | облёт «до/после» | успех |
|---|---|---|
| 1 | переснять эталон: прогрев + 3 прогретых облёта без экрана загрузки игры | пакет на 110–111 с исчез; новый разброс A-A записан в `HOUSE_RULES` вместо цифр C2/C3 |
| 2 | A: как есть · B: `exec dw.EnableAISpawning 1→0` до старта облёта · A: вернуть `1` | рывки на 119–158 с пропали в B → спавн доказан; остались → ищем в подгрузке плиток (приборы 2Б) |
| 3 | A · B (перезапуск с `p.Chaos.EnableAsyncInitBody=1` в ini) · A (перезапуск без) | рывки у спавнов (119–158, 171–174) реже или короче; в журнале строка `Set CVar [[p.Chaos.EnableAsyncInitBody:1]]`; ни падений, ни NPC сквозь землю за 3 облёта |
| 4 | A · B `exec p.ClothPhysics 0` · A `1` | меньше рывков в секунды со строками `Recreating Clothing Actors`; если разницы нет — ткань при спавне не виновата |
| 5 | сначала прибор: `LevelStreaming.Profiling.*=1` в ini, `.tsv` за облёт; затем A · B `LevelStreaming.AllowIncrementalPreRegisterComponents 1` · A | `.tsv` показал уровни с большим `TimeAddingToWorld` в секунды рывков; в B эти рывки реже. Если `.tsv` чист — кандидаты 5–6 не нужны |
| 6 | A · B `exec s.AdaptiveAddToWorld.Enabled 1` · A | как 5; дополнительно `s.WarnIfTimeLimitExceeded 1` в A и B — число предупреждений в B меньше |
| 7 | A · B четыре строки дальности в 1.0 (ini, перезапуск) · A | цифры — цена дальности в мс `MsCPUBusy` и в рывках; итог несёт владельцу как выбор, не как правку |
| 8 | A · B `tick.AllowConcurrentTickQueue 1`, затем отдельно `tick.AllowAsyncTickDispatch 1` · A | медиана `MsCPUBusy` ниже разброса A-A; после — 10 минут обычной игры (бой, езда, станки) без странностей |
| 9 | A · B `a.Budget.BudgetMs 1.0` · A | медиана `MsCPUBusy` над руинами ниже; глазом — нет заметной дёрганости ближних NPC |
| 10 | по `docs/dw-cvars/ai-lod.md` (там свой порядок, сначала чтение значений) | там же |
| 11 | A · B без шести Lua-модов (2Г) · A | разница медианы `MsCPUBusy` и рывков; если в пределах шума — моды оправданы |
| 12 | только если WPR (2А) показал упор в рендер-поток: A · B `r.Visibility.TaskSchedule 1` · A, затем остальные по одному | время рендер-потока в WPR ниже, медиана к/с выше |
| 13–14 | по плану 33 п. 4б | там же |

Порядок работ: 1 → 2 (и WPR одним облётом) → по результату ветка «спавн» (3, 4) или ветка «плитки» (5, 6) → средний расход (7–11).

## 4. Итоги замеров 2026-10-26 01:02–01:20 (кино владельца выключено, его слово 01:01)

| Шаг плана | Итог |
|---|---|
| 1. Чистый эталон | прогретые A1/A2: 57,3/58,3 к/с, 38/46 рывков, процессор 15,1/15,0 мс; ни `Undermesh`, ни режима ожидания в журнале; шум бенча ±4 рывка. Цифры C2/C3 (16–18 рывков) были занижены режимом ожидания игры |
| 2. `dw.EnableAISpawning 0` | 65,3 к/с (медиана 70,4), 20 рывков, процессор 13,8 мс — **гипотеза «спавн» доказана**: больше половины рывков и ≈ 1,2 мс процессора на кадр  (поправка 2026-10-26 02:32 закрытия: облёт ОДИН — по EXP-0335 это сильный сигнал, а не доказательство; повторить A-B-A-B)|
| 5 (прибор). Профайлер подгрузки | `ConanSandbox/Saved/Profiling/LevelStreaming/LevelStreaming_(<дата>_<время>).tsv` пишется сам при выходе из мира (ini до запуска); дольше всех вводятся `Heightmap_X4_Y2b` 1,4–1,7 с и `Caverns_of_Set_Level` (мод) 1,05–1,26 с + 0,3–0,4 с загрузки, по разу на облёт |
| 2Б. `s.WarnIfTimeLimitExceeded 1` | 105 предупреждений за сеанс: `Event_DeferredPostLoadExportBundle` 82, `CreateAsyncPackagesFromQueue` 19 — 6–8 мс за кадр |
| 2А. WPR | `wpr -start CPU -filemode` → облёт → `wpr -stop <etl>` (6 ГБ за 3 мин, 71 508 событий потеряно; запись ест кадры — облёт не для сравнения). Разбор без окон: `xperf -tle -i <etl> -a profile -detail` — **без `-tle` xperf при потерянных событиях молча отдаёт пустой вывод**; по модулям, не по потокам |

**WPR по модулям** (`_bench/wpr/profile-detail.txt`, процесс игры = 46,4 % всего процессора из 16 потоков): exe 26,26 % (57 % игры) ·
драйвер NVIDIA `nvwgf2umx.dll` 6,98 % (15 %) · `ntoskrnl.exe` 6,57 % (14 %) · `ntdll.dll` 1,74 % · **`UE4SS.dll` 1,59 % (3,4 %)** ·
`vcruntime140.dll` 0,96 % · `D3D12Core.dll` 0,88 % · `Dreamworld.dll` 0,01 % — код Funcom живёт в exe, не в этой dll. `UE4SS.dll` —
четверть одного ядра; его перехваты (`HookProcessInternal`, `HookAActorTick`) и Lua-моды работают на игровом потоке, поэтому верхняя
оценка — до ~4 мс кадра. Гипотеза, не замер: разбивки по потокам у `-a profile` нет. Проверка — A-B-A без Lua-модов (2Г) и с выключенными
перехватами в `UE4SS-settings.ini`, если моды без них живут.

**Асинхронная подгрузка (версия владельца 2026-10-26 ≈01:49: «может некорректно стриминг и ассинхронная подругзка сделаы в игре»).**
Funcom ставит (`LogConfig: Set CVar`): `s.AsyncLoadingThreadEnabled 1`, `s.EventDrivenLoaderEnabled 1`, `s.UseBackgroundLevelStreaming 1`,
`s.PriorityAsyncLoadingExtraTime 15.0` (при срочной загрузке — +15 мс в кадре), `s.LevelStreamingActorsUpdateTimeLimit 3`,
`s.PriorityLevelStreamingActorsUpdateExtraTime 5.0`, `s.LevelStreamingComponentsRegistrationGranularity 10`, `s.UnregisterComponentsTimeLimit 1.0`.
Не ставит `s.AsyncPostLoadEnabled` (есть в реестре; поле `bAsyncPostLoadEnabled` в `FAsyncLoadingThreadSettings` Epic — что делает,
в документации не сказано), `s.AsyncLoadingTimeLimit`, `s.AsyncLoadingUseFullTimeLimit`, `s.AsyncCreatePackagesFromQueueMaxTimeLimitMs`.
По Epic: PostLoad по умолчанию — на игровом потоке, потому что игровой код в нём не обязан быть потокобезопасным; объект разрешает его
в потоке загрузки через `IsPostLoadThreadSafe()`. Наши 6–8 мс `Event_DeferredPostLoadExportBundle` — это та самая доводка на игровом
потоке. Кандидаты A-B-A (каждый — ini до запуска, чистыми облётами): `s.AsyncPostLoadEnabled 1` (риск — гонки и зависания, известны
баги Epic UE-166872 и взаимоблокировка 5.7 с PropertyBag), `s.AsyncLoadingTimeLimit` меньше (доводка размажется на больше кадров —
меньше пик, дольше появление объектов), `s.PriorityAsyncLoadingExtraTime` 15 → 5.
Источники: https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/CoreUObject/FAsyncLoadingThreadSettings ·
https://dev.epicgames.com/documentation/unreal-engine/asynchronous-level-loading-in-unreal-engine · https://issues.unrealengine.com/issue/UE-166872 ·
https://forums.unrealengine.com/t/deadlock-between-gamethread-and-fasyncloadingthread-inupropertybag-getorcreatefromdescs/2745473

**Пачка q1 (2026-10-26 01:58–02:17, один запуск, `ConanExiles/_config/bench-batches/q1-runtime.txt`):** шум A-облётов — 39–52 рывка
(шире, чем ±4 по двум облётам 01:05/01:08). `s.AsyncLoadingTimeLimit 2` + `s.PriorityAsyncLoadingExtraTime 5` (с 5 и 15) — 39 рывков,
в шуме; `r.Streaming.PoolSize 8000` (с 1200) — 43, в шуме, видеокарта +0,4 мс; **`p.ClothPhysics 0` — 28 рывков** (на 11 меньше лучшего
A) — кандидат ветки «спавн», повтор A-B-A — пачка `q3b-cloth-repeat.txt`: **опровергнут** 02:30 — без ткани 40 рывков, A6 сразу после — 36; 28 из q1 — шум. Вывод о шуме: один облёт ничего не решает, решает пара A-B-A-B. Идея владельца «грузить дальше по дистанции, но больше кадров
выделять» на ручке бюджета подгрузки эффекта не дала; дальность плиток World Composition Конана ручкой не задаётся (в реестре нет) —
следующий кандидат той же идеи — `s.AsyncPostLoadEnabled` (q2).

Следующая ветка по плану раздела 3 — «спавн»: кандидаты 3 (`p.Chaos.EnableAsyncInitBody`) и 4 (`p.ClothPhysics 0`), каждый A-B-A чистыми облётами.

## Источники

- Справки переменных Conan Exiles 3.0.1 — строки из `D:\Games\Conan Exiles 3.0.1\ConanSandbox\Binaries\Win64\ConanSandbox-Win64-Shipping.exe`
  (UTF-16 строка справки стоит перед именем), снято 2026-10-26.
- Журнал игры `D:\Games\Conan Exiles 3.0.1\ConanSandbox\Saved\Logs\ConanSandbox-backup-2026.10.25-20.44.13.log`, `bench.log` мода
  KrinikConanBench, карты кадров `D:\Games\Conan Exiles Mods\_bench\fps-map\etalon-{nofog-a,fog,nofog-b}.tsv`.
- Ари Арнбьёрнссон (Epic), «The Great Hitch Hunt», Unreal Fest 2025 — [видео](https://www.youtube.com/watch?v=HaVTYSnGvxA),
  [пересказ Wccftech, 29.07.2025](https://wccftech.com/unreal-engine-declares-great-hitch-hunt-rid-games-stutters/): спавн, физика,
  подгрузка уровней, GC как причины рывков; асинхронная инициализация физики (5.5/5.6) экспериментальна. Доклад не смотрел — только пересказ.
- Epic, [Incremental Garbage Collection](https://dev.epicgames.com/documentation/en-us/unreal-engine/incremental-garbage-collection-in-unreal-engine).
- Epic, API 5.8: [ULevelStreamingProfilingSubsystem](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/ULevelStreamingProfilingSubsyste-),
  [FLevelStats](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/ULevelStreamingProfilingSubsyste-/FLevelStats).
- Epic, [Streaming Settings](https://dev.epicgames.com/documentation/unreal-engine/streaming-settings-of-the-unreal-engine-project-settings) — бюджеты и гранулярность подгрузки уровней.
- Digital Foundry о «traversal stutter» как отдельной от шейдеров беде — только во вторичном пересказе
  ([Wccftech о Silent Hill 2](https://wccftech.com/silent-hill-2-remake-pc-is-yet-another-unreal-engine-case-of-stutter-struggle/amp/));
  первоисточник DF не открыт, на выводы разведки не влияет.
- Сообщество Engine.ini: [Ready or Not, Nexus 7373](https://www.nexusmods.com/readyornot/mods/7373) (`s.AsyncLoadingTimeLimit=2.0`) против
  [bugnet](https://bugnet.io/blog/fix-unreal-level-streaming-hitches-open-world) (5.0) — пример противоположных советов без замеров.
- Microsoft, [How to set a thread name in native code](https://learn.microsoft.com/pl-pl/previous-versions/visualstudio/visual-studio-2017/debugger/how-to-set-a-thread-name-in-native-code?view=vs-2017) — имена `SetThreadDescription` видны в WPA.
- Свои: `researches/ue5-cvars/threading.md`, `streaming-worldpartition.md`, `grass-foliage.md`; `researches/conan-performance-mods-2026-10/README.md`
  (LTSharpe); `ConanExiles/docs/dw-cvars/{stream,ai-lod,spawn-ai,nav-move}.md`; `plans/16_epic15_phase0_recon_and_stand.md` п. 0.6.
