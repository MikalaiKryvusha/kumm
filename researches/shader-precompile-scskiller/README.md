# Research — SCSKiller: предсборка шейдеров до запуска игры (для Конана 3.0.1 на UE5)

> **Created:** 2026-10-25 · по слову владельца: «я недавно новость читал, что какие-то энтузиасты собрали какой-то инструмент, который
> игры ускоряет - мол шейдеры все заранее собираются»
> **Parent:** бенч-облёт Конана (`ConanExiles/docs/18-бенч-облёт.md`) — холодный первый облёт: 54 рывка против 16–18 у прогретых
> **Status:** разведка по прессе; репозиторий и код инструмента ещё не читаны, на Конане не пробовали · **Outbound:** —

## Что это (по прессе, октябрь 2026)

- **SCSKiller** — бесплатная открытая утилита для Windows, вышла в конце сентября 2026. До запуска игры, из своего процесса, собирает
  шейдеры и состояния конвейера (PSO), которые игра будет использовать, и кладёт их в кэш шейдеров драйвера NVIDIA/AMD. Игру не правит.
- Поддержка: Unreal Engine 4 и 5, Unity, RE Engine, движки FromSoftware; для остальных — запись шейдеров за несколько минут игры.
  С большинством игр под античитом не работает.
- Замеры автора: Hogwarts Legacy 1 014 → 87 «зависаний», Star Wars Jedi: Survivor 9 038 → 11; Hardware Unboxed — Jedi Survivor +25 %.
  Wccftech: рывки сборки шейдеров в целом ушли.
- **Не лечит** рывки подгрузки мира и ассетов (traversal / streaming); в Hogwarts Legacy большая доля рывков — от чтения данных.
- NVIDIA выигрывает больше (большой кэш драйвера), у AMD в свежих драйверах есть своя фоновая сборка для UE4/5.
- Цена: время сборки и место на диске (в одном тесте ≈ 9 ГБ кэша), выше расход памяти.
- Расхождения в прессе: имя автора (BlueHeisenberg / HeisenbergVR), последняя версия (1.2.2 на 6 октября / 1.3.1) — сверять по GitHub.

## Что это значит для нашей сборки

| Наш замер (эталон `krinik-show`, 25.10 23:33–23:43) | Чем он похож | Поможет ли SCSKiller |
|---|---|---|
| первый облёт после входа: 54 рывка ≥ 50 мс, 1 % низких 22,3 | сборка шейдеров на лету (новые материалы) | да, это его класс |
| прогретые облёты: 16–18 рывков, все — над руинами и в новых местах на севере | подгрузка мира на ходу | нет, это не его класс |
| процессор 16 мс против видеокарты 13,5 мс | главный поток | нет |

Видеокарта — RTX 5070 Ti (NVIDIA), то есть случай, где выигрыш у инструмента больше. Античит Конана (BattlEye) в одиночной игре
владельца — проверить, не мешает ли.

## Как проверить (план)

1. Найти официальный репозиторий на GitHub, прочитать README и код сборки для UE5 (что читает из игры, куда пишет, как откатить).
2. Замер «до»: эталон с ХОЛОДНОГО запуска (первый облёт после входа в мир) — у нас уже есть: 54 рывка, 1 % низких 22,3.
3. Прогнать SCSKiller для Конана, затем снова холодный эталон. Успех — рывков первого облёта заметно меньше, ближе к прогретым 16–18.
4. Откат — очистка кэша шейдеров драйвера (способ — из README инструмента).

## Пробуем на Конане (2026-10-25 → 26, по слову владельца «давай попробуем»)

- Скачан `SCSKiller-1.3.2-Portable.zip` с Releases официального репозитория `BlueHeisenberg/SCSKiller` (GPL-3.0; форки DAOWAce,
  Felipe-Rodr, Predat1000 — не брать); SHA-256 `e95a778d…6ab5` совпал с примечаниями к выпуску. Распакован в
  `D:\work\ai_sandbox\_tools\SCSKiller-1.3.2\app`; настройки и данные — `%LOCALAPPDATA%\SCSKiller`.
- Командная строка без окна: `app\current\cli\scskiller.exe` — `scan`, `add <exe> <папка>`, `status <игра>`, `compile <игра>`,
  `cache clear <игра>` (откат). У команд нет `--help`: `scan --help` просто выполняет поиск.
- Конан добавлен вручную (`add …\ConanSandbox-Win64-Shipping.exe "D:\Games\Conan Exiles 3.0.1"`, id `manual:397886492cfc049b`):
  опознан как **Unreal 5.8, D3D12**, «Ready: not tested on this engine version yet», античит **BattlEye** (записыватель в папку игры
  не ставится). В паках найдено 99 179 шейдеров, план — 111 285 состояний конвейера, оценка «2,5 ГБ, 4 мин».
- Сборка (`compile`, под замком машины) началась 23:58; в 00:29 ещё шла — кэш шейдеров Windows (`%LOCALAPPDATA%\D3DSCache`) вырос с
  2,5 до 3,5 ГБ; оценка времени на нашей машине не сбылась.
- **Итог (2026-10-26 00:38):** сборка 37 мин 30 с, 111 285 из 111 285, ошибок 0; кэш Windows для Конана 3,7 ГБ, на диске 5,5 ГБ.
- **Холодный облёт эталона после него (00:41):** 47 рывков ≥ 50 мс против 54 до него (23:33), 1 % низких 23,0 против 22,3, худший
  156 мс против 181 — выигрыш в пределах разброса. Рывки обоих холодных облётов — в одних и тех же секундах: это первая подгрузка мира, а не
  шейдеры. Вывод: на Конане 3.0.1 SCSKiller почти не помогает; вреда нет, оставлен. Откат при нужде — `scskiller.exe cache clear manual:397886492cfc049b`.

## Рядом найдено в самой игре (реестр переменных `_config/cvars-registered.txt` пака)

- Встроенного CSV-профайлера UE5 в сборке нет (из `csv.*` — одна `csv.RecordActorCountThreshold`) — «кто ест главный поток» мерить
  иначе: Windows Performance Recorder (`wpr`, загрузка процессора по потокам и модулям) и облёты «Lua-моды вкл/выкл».
- Ручки предсборки UE5 есть: `r.PSOPrecache.ProxyCreationStrategy` (не рисовать объект, пока его шейдер не собран: вместо рывка —
  позднее появление), `r.PSOPrecache.DumpStats` (сколько шейдеров не успели собрать), `r.PSOPrecache.Mode`,
  `r.PSOPrecache.D3D12.DriverCacheAware` и др. — кандидаты для замера эталоном «до/после».

## Источники

- https://www.club386.com/banish-shader-compilation-stutters-games-sc/
- https://xenospectrum.com/en/scskiller-shader-stutter-precompile-limits/
- https://tech-insider.org/scskiller-shader-precompile-tool-pc-stutter-2026/
- https://www.resetera.com/threads/wccftech-new-free-open-source-scskiller-tool-targets-pc-shader-compilation-stutter-compiles-shaders-before-game-is-launched.1650727/
- https://en.gamegpu.com/news/igry/vyshla-besplatnaya-utilita-scskiller-dlya-ustraneniya-statterov-kompilyatsii-shejderov-na-pk
- https://www.techspot.com/review/3189-fix-shader-compilation-stutter/
- https://www.tweaktown.com/news/114019/scskiller-improves-jedi-survivor-performance-by-25-open-source-app-pre-compiles-shaders-to-gpu-drivers-shader-cache/index.html
- https://hothardware.com/news/scskiller-tool-eliminate-gpu-shader-stutters
- https://www.unrealengine.com/tech-blog/game-engines-and-shader-stuttering-unreal-engines-solution-to-the-problem
