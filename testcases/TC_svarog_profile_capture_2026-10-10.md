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
| C1 | Development-плеер скриптом → `run-game.sh` | мир загружен; шесть модов «loaded»; UnityException от наших модов — 0 | журналы | pass 11:35: мир за 48 с, «loaded» — 5 строк (Fixes «loaded» не пишет), UnityException 0 |
| C2 | `pcap 300 bor_night` в Боре ночью, 4K, отдаление до предела | файл `_harness/bor_night.raw` больше нуля | ответ пульта | pass 11:35: «pcap 300 frames in 5,8s → bor_night.raw (88 MB)» |
| C3 | Unity пакетно: `-executeMethod KrinikProfDump.Dump -profFile … -profOut …` | три текста: дерево, горячие места, потоки; среднее время кадра близко к `perf` | файлы + журнал Unity | pass 11:36–11:38: «[KrinikProfDump] ok: 300 frames»; кадр 19.40 мс против `perf` 18.65; потоки после правки — без простоя (главный 13.9, отрисовки 3.75, рабочие ≈0.5) |
| C4 | В дереве под `BehaviourUpdate` — скрипты игры по имени (`…Update()`) | есть имена классов игры с мс на кадр | `_tree.txt` | pass: `PlantProgressBar.Update` 0.45 (192), `NPCController.Update` 0.10 (21), `CharacterStats.Update` 0.07 (68) и ещё ≈20 классов |
| C5 | После: часы идут, `kill`, `player-swap.sh release`, сейв 7/7, реестр 3840/2160/1 | всё как до прогона | `sha256sum`, `reg query`, `status` | pass 11:36: `kill`, release, сейв 7/7, реестр 3840/2160/1 |
| C6 | Глубокий профайлинг — `[OWNER]` «ты профайлером всю игру изучил?» · «все методы и функции понял, сколько CPU потребляют?» · 2026-10-10. `boot.config` + `profiler-enable-deep-profiling-support=1` (копия оригинала в `_backups/svarog-player-release/boot.config`), development-плеер, `GAME_ARGS=-deepprofiling`, `pcap 120 deep_bor_night`, разбор | в дереве — функции внутри `Update` скриптов игры (вызовы второго и глубже уровня из Assembly-CSharp) | `_tree.txt`, `_self.txt` | pass 11:46–11:48: 215 МБ на 120 кадров, дерево 688 строк — внутри `PlantProgressBar.Update` наш `PatchPlantIconSize.Postfix` → `SizeIcon` → `IconVisiblePx` → `GetWorldCorners`; внутри `CharacterStats.Update` — `Discover` → `GetRelations` |
| C7 | После глубокого: `boot.config` как оригинал (sha256), `player-swap.sh release`, сейв 7/7, реестр | всё как до прогона | `sha256sum`, `status` | pass 11:48: `boot.config` = оригинал (a5715a6a…), release, сейв 7/7, реестр 3840/2160/1 |
