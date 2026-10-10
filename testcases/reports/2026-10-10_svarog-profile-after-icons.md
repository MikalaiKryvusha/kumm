# Run report — Svarog's Dream: рельеф инстансингом и профиль главного потока после правки значков

## 1. Work

- Эпик 19 (`plans/19_EPIC_svarog_main_thread_offload.md`), профиль `researches/svarogs-dream/main-thread-profile-2026-10-10.md`.
  `[OWNER]` «оставляй модом, но пиши код оптимально!» · 2026-10-10.
- Случаи: `testcases/TC_svarog_terrain_instanced_2026-10-10.md` (C1–C3) — даст ли `Terrain.drawInstanced` выигрыш на рельефе (0.79 мс);
  `testcases/TC_svarog_profile_capture_2026-10-10.md` (C8–C9) — что теперь самое дорогое после правок значков и лучей камеры.

## 2. Contour

- Игра `D:\Games\Svarog's Dream`, Unity 2020.3.49f1, DX11, 4K `ExclusiveFullScreen`. Сейв владельца (Бор, ночь, «Железный человек»),
  копия `_backups/svarog-saves-2026-10-10_0918-pre-devplayer`, часы игры стоят (`fieldon … isTimeDisabled True`), отдаление до предела.
- SvarogsDream `a6505b5` (служба значков по правилам Unity, лучи камеры по движению).
- Прогон 1 — release-плеер; прогон 2 — development-плеер (`tools/player-swap.sh dev`, после — `release`).

## 3. Runs

1. 12:36–12:38 — `bash tools/run-game.sh`; `bash tools/h.sh "terrainset drawInstanced True|False|True"` с `"perf 6"` ×2 в каждом
   положении; `"fieldon … isTimeDisabled False"` `"kill"`; `sha256sum -c …/SHA256SUMS`; `reg query`.
2. 12:39–12:41 — `bash tools/player-swap.sh dev`; `bash tools/run-game.sh`; `bash tools/h.sh "pcap 300 bor_after"`; ходьба
   `tools/keys.ps1 -Key S -Ms 4500` + `"pcap 200 bor_walk"`; `"kill"`; `bash tools/player-swap.sh release`; разбор
   `Unity.exe -batchmode -executeMethod KrinikProfDump.Dump -profFile _harness/bor_after.raw|bor_walk.raw`.

## 4. Checks

Hygiene: нет правок кода в этих прогонах — только пульт и разбор.
Functional run: игра с сейвом владельца, ответы пульта (`perf`, `terrainset`, `pcap`) и тексты разбора прочитаны; сейв и реестр сверены.

| Случай | Итог |
|---|---|
| Рельеф C1 | fail — ключ у игры уже включён («True -> True on 25 terrains»); выключение — Main Thread 16.4 → 18.2–18.6 мс |
| Рельеф C2 | skipped — менять нечего |
| Рельеф C3 | pass — True возвращено (14.17 мс), сейв 7/7, реестр 3840/2160/1 |
| Профиль C8 | pass — кадр 19.40 → 15.85 мс, таблица «что теперь самое дорогое» записана в профиль |
| Профиль C9 | pass — `kill`, release (94c7a4d7913e7df7), сейв 7/7, реестр 3840/2160/1 |

## 5. Found

1. `Terrain.drawInstanced` у игры уже `True` на всех 25 участках; шаги `Terrain.Heightmap.RenderStep1–3` (0.78 мс) — это цена с
   инстансингом. Опыт закрыт без правки.
2. После правки значков своё время главного потока: ожидание рабочих потоков 5.39 → 3.39 мс, рассылка сдвигов 2.78 → 2.33,
   `UGUI.Rendering.UpdateBatches` 0.33 → 0.07, `Canvas.BuildBatch` 0.19 → 0.02.
3. Верх кадра теперь — игры: рассылка сдвигов (под ней — `NavMeshAgent` жителей 0.44 + 0.46 мс), трава 1.53, навигация 1.22,
   холсты 1.29. Следующий опыт — цена дальнего жителя по частям (`testcases/TC_svarog_far_parts_2026-10-10.md`).

## 6. Traces

- `SvarogsDream/_harness/prof_bor_after_{tree,self,threads}.txt`, `prof_bor_walk_{tree,self,threads}.txt`, снимки `bor_after.raw`,
  `bor_walk.raw`; прошлый — `prof_bor_night_*`.
- Ответы пульта — `SvarogsDream/_harness/out.txt`.

## 7. Verdict

Pass по профилю (C8–C9); рельеф — без выигрыша, ключ уже у игры (C1 fail по ожиданию, не по вреду). Сейв и реестр — как до прогонов.
