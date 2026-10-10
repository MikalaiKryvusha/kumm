# Test cases — Svarog's Dream: полный снимок профайлера (development-плеер) и разбор в текст

> **Основание:** `[OWNER]` «ты поставил плеер developer, я думал, оно как профайлер будет показывать ВСЕ, что тратит ресурсы
> процессора» · «думал, что ыт поймешь, что не оптимально сделано в ядре игры, и как это оптимально пеерделать» · 2026-10-10.
> Эпик 19, критерий 1 (`plans/19_EPIC_svarog_main_thread_offload.md`).
>
> **Сборка:** SvarogsDream после `a1c03dc` — пульт `pcap <кадров> <имя>` (Profiler.logFile + enableBinaryLog), редакторский
> `unity/KrinikShaders/Assets/Editor/KrinikProfDump.cs` (ProfilerDriver.LoadProfile → HierarchyFrameDataView → текст).
> Плеер — `tools/player-swap.sh dev`. Сейв владельца (Бор, ночь), копия 0918; часы стоят; 4K; отдаление до предела.

| № | Шаг | Ожидается | Как смотрим | Статус |
|---|---|---|---|---|
| C1 | Development-плеер скриптом → `run-game.sh` | мир загружен; шесть модов «loaded»; UnityException от наших модов — 0 | журналы | [NOT-TESTED] |
| C2 | `pcap 300 bor_night` в Боре ночью, 4K, отдаление до предела | файл `_harness/bor_night.raw` больше нуля | ответ пульта | [NOT-TESTED] |
| C3 | Unity пакетно: `-executeMethod KrinikProfDump.Dump -profFile … -profOut …` | три текста: дерево, горячие места, потоки; среднее время кадра близко к `perf` | файлы + журнал Unity | [NOT-TESTED] |
| C4 | В дереве под `BehaviourUpdate` — скрипты игры по имени (`…Update()`) | есть имена классов игры с мс на кадр | `_tree.txt` | [NOT-TESTED] |
| C5 | После: часы идут, `kill`, `player-swap.sh release`, сейв 7/7, реестр 3840/2160/1 | всё как до прогона | `sha256sum`, `reg query`, `status` | [NOT-TESTED] |
