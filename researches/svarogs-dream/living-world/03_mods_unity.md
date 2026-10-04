# Живой мир Сварога — как моды пришивали живой мир к готовым играм и что из Unity доступно нашему моду

> **Created:** 2026-10-05 (автономное окно 02:37–03:07)
> **Parent:** `05_architecture.md` этой папки
> **Status:** разведка исследователя: 25+ источников, скрипты модов прочитаны на GitHub (ModDB и Nexus не пускали
> автоматическое чтение — отмечено «не проверено»), сборки игры просмотрены только чтением
> **Outbound:** —

## 1. Моды — как сделано и что ломалось

| Мод (игра) | Как устроено | Что ломалось | Источник |
|---|---|---|---|
| **Warfare** (S.T.A.L.K.E.R. Anomaly) | у фракций точки (базы, ресурсы, логова); на обновлении точки: ресурсы → оборона → патрули → цели → отряды; родное возрождение игры отключено; отряды ночью домой, утром к ресурсам; расстояния между точками кэшируются в сохранении | падения («база без отрядов»), **вал порождения после перемотки времени** — защита «Big time jump (>1 hour): advance spawn timers» | [Warfare GAMMA](https://github.com/SaloEater/Warfare-Alife-Overhaul-Gamma-Patch) |
| **Бой офлайн** (Anomaly, Tronex) | «When 2 enemy squads get close… a battle will be simulated… power is determind by the sum of NPC ranks»; проверка раз в 180 игровых секунд, раунд раз в 180 с, **не больше 30 раундов за тик** (догонялка с пределом) | копились «исключённые» отряды | там же, `sim_offline_combat.script` |
| **Движок X-Ray** | переключение онлайн ⇄ офлайн с **буфером**: `online = switch·(1 − factor)`, `offline = switch·(1 + factor)`; бюджет обновления `process_time`, `objects_per_update` | — | [OpenXRay](https://github.com/OpenXRay/xray-16) |
| **AlifePlus** (Anomaly, 2026) — лучше всех описан | **одна точка записи в движок** (цель отряда), без порождения и телепорта; часы: раз в секунду 20 отрядов по кругу, цена постоянна; бюджет **0.1 мс в среднем, предел 2 мс** на вызов, разовые пачки — по одному предмету в кадр; торговля: запись живёт до пополнения лавки и вносится при пополнении; только предметы игры — мод удаляется безопасно | двухфазная загрузка (сущностей ещё нет при чтении сохранения); переиспользованные ID (держать ID, не ссылки); цели заданий НЕ защищены — «ты провалишь задание» | [AlifePlus](https://github.com/damiansirbu-stalker/AlifePlus) |
| **Project A-Life** (Project Zomboid) | «Squads still exist even when you're nowhere near them. They travel along actual roads at walking speed. If two hostile factions meet they can fight»; только предметы игры — ставится и снимается без порчи | «WE ARE AWARE OF CURRENT STATE OF ENCOUNTERS IT IS DIFFICULT» | [Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=3803984183) |
| **Warzones / OBIS** (Skyrim) | не симуляция: точки встреч у игрока с охлаждением (Warzones); 100 слотов патрулей с маршрутами (OBIS) — число актёров ограничено слотами | — | [разбор плагинов](https://github.com/justty32/modding_skyrim/tree/main/analysis/mod-survey/findings) |
| **Supply and Demand** (Skyrim) | цена меняется от покупок/продаж и дрейфует к базовой каждый день | — | там же |
| **Обливион (движок)** | путь вдали — по графу ячеек без загрузки земли; актёры вдали друг с другом не взаимодействуют; ИИ урезали: «the AI is so goddamned smart and determined it screws up our quests!» | — | [Radiant AI](https://blog.paavo.me/radiant-ai/) |
| **Economy Mod** (Warband) | города — числа (богатство, процветание), сходятся к идеалу на часовых триггерах | — | [github](https://github.com/mbw-economy/Economy-Mod-for-Mount-and-Blade--Warband) |
| **ButterLib** (Bannerlord) | данные мода — отдельно, JSON: «Your mod will never save custom data that prevents the game from loading properly when your mod is disabled» | старый способ привязывал сохранение к моду | [ButterLib](https://github.com/BUTR/Bannerlord.ButterLib/blob/dev/docs/articles/SaveSystem/Overview.md) |
| **Rim War** (RimWorld) | тик мира по модулю, одно поселение действует за раз; «очки» поселений; ветка с потоками — **потоки для отрядов выключены** (`if (false)`) | ошибки пути отрядов | [RimWar](https://github.com/TorannD/RimWar) |
| **Kenshi VSE** (в разработке) | отдельный процесс через мост памяти; «Identity Hijack» — подменяет личность у персонажей, которых порождает игра | — | [itch.io](https://problemchild1500.itch.io/kenshi-virtual-simulation-engine) |

## 2. Unity 2020.3 Mono под BepInEx — что можно

В папке игры (только чтение): нет Unity.Burst, Unity.Collections, Unity.Mathematics, Newtonsoft; в `CoreModule` есть
`IJobParallelFor`, `NativeArray`, `JobHandle`; в `AIModule` — `NavMeshQuery`; JSON — только `JsonUtility` (без словарей).

| Приём | Вердикт | Почему |
|---|---|---|
| Простой C#, главный поток, по кругу с бюджетом | **да, берём** | AlifePlus: 776 отрядов, 20 в секунду, < 0.1 мс в среднем |
| `System.Threading` для чистых данных | можно, но применять — только в главном потоке | Rim War сделал так и выключил для отрядов |
| Jobs без Burst | работает, **выигрыша нет** | замер: «Mono (no Burst): 103 ms» против «Regular C#: 5.5 ms»; Йоахим Анте: «In mono a normal array access is faster than NativeArray access» ([форум](https://discussions.unity.com/threads/ecs-jobs-are-surprisingly-slow-without-burst.729320/)) |
| Burst | **нет** | моды с Burst — с Unity 2021.1 и с редактором; игра на 2020.3 без Burst ([док](https://docs.unity3d.com/Packages/com.unity.burst@1.8/manual/modding-support.html)) |
| `NavMeshQuery` в заданиях | возможно с оговорками | по одному запросу на `IJob`; мод BepInEx делает это, но патчит движок блокировкой от падений ([LC_PathfindingLib](https://github.com/Zaggy1024/LC_PathfindingLib)) |
| `NavMesh.CalculatePath` для дальних путей | **нет** — только короткие отрезки рядом с героем | синхронный, длинный путь обрывается ([док](https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.CalculatePath.html)) |
| Грубый граф мира (A*/Дейкстра на сотнях–тысячах узлов) | **да** | как у Обливиона (ячейки), Project A-Life (дороги), Kenshi VSE (атлас) |
| Вычислительные шейдеры из пакета ресурсов | возможно, не нужно | известная ошибка 2020.3 «Kernel not found» из пакета; при нашем масштабе смысла нет |
| JSON рядом со слотом сохранения | **да** | файл копируется вместе со слотом ([Nautilus](https://github.com/SubnauticaModding/Nautilus)) |

## 3. Что это меняет в архитектуре (внесено в `05_architecture.md`)

1. **Решает группа, а не одиночка** — для путников, отрядов, стай; жители деревень вдали — по формуле распорядка, без
   решений.
2. **Положение вдали — по формуле** (время выхода + длина ребра / скорость по грубому графу), а не пошагово; догонялка
   после перемотки — в закрытой форме или с пределом раундов.
3. **Грубый граф мира** (центры участков, поселения, развилки) с длинами рёбер, посчитанными заранее; `NavMesh` — только у
   героя.
4. **Бюджет:** главный поток, по кругу, 0.1 мс в среднем, предел 2 мс на шаг; материализация — не больше одного персонажа
   в кадр и никогда в кадре у героя; буфер между линиями «проснуться» и «уснуть»; «надгробие» у записи, чтобы не поставить
   дважды.
5. **Сохранение:** отдельный JSON на слот, пишется внутри сохранения игры (временный файл → переименование), с версией
   схемы, игровым временем и отпечатком сохранения; загрузка в две фазы; только ID, не ссылки; нет файла — книга
   собирается из сцены; свой маленький сериализатор (у `JsonUtility` нет словарей).
6. **Экономика:** вносить товар в лавку при её пополнении (6:00) и только предметами игры — мод снимается без порчи.
7. **Задания:** защищать торговцев, выдающих задания, спутников, сюжетных — и **цели активных заданий** (читать список
   заданий игры), иначе «провалишь задание».
8. **Пределы роста** на фракцию и участок, чистка залежавшихся записей, защита от вала порождения после перемотки.
