# Run report — баг 15: матовая земля на участках, подгруженных после перемещения героя

**Created:** 2026-10-11 11:36 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikColorRework 2.1.0 (в игре с 2026-10-05);
KrinikDevHarness сборки 2026-10-11 ≈11:31 (`render` — участки по шейдеру, новая команда `teleport`)

## 1. Work

Остаток бага 15 до DONE по земле: «terrain swap while walking (streaming) not observed» (`bugs/15_…`, `plans/18`). Случаи C1–C5 —
`testcases/TC_svarog_bug15_terrain_streaming_2026-10-11.md`.

## 2. Contour

- Svarog's Dream (Unity 2020.3.49f1, Mono, BepInEx 5.4.23.5), 1280×720, полный экран, сейв владельца.
- REAL WORLD: accumulated — сейв владельца (7/7 с копией 23:57 до прогона); data and machine — его машина; path — мир игры после
  загрузки сейва, перенос героя тем же вызовом, что у быстрого перемещения игры.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-11 11:32–11:35 | `dotnet build src/KrinikDevHarness -c Release`; dll в `plugins/KrinikDevHarness/`; `bash tools/run-game.sh`; `tools/h.sh "render"` | C1 |
| 2 | 2026-10-11 11:35 | `tools/h.sh "teleport innGradLocation" "wait 10" "render" "shot b15w_grad"`; `grep -c "matte terrain on" LogOutput.log` | C2 |
| 3 | 2026-10-11 11:35–11:36 | `tools/h.sh "teleport houseMountainLocation" "wait 10" "render"` | C3 |
| 4 | 2026-10-11 11:36 | `tools/h.sh "cfg krinik.svarogsdream.colorrework Terrain Matte false" "wait 3" "render" "cfg … true" "wait 3" "render"` | C4 |
| 5 | 2026-10-11 11:36 | `tools/h.sh "kill"`; `reg-snap.sh restore`; `cmp` семи файлов сейва; `reg query` | C5 |

## 4. Checks

Hygiene: сборка пульта — 0 ошибок.
Functional run: мир игры с сейвом владельца, два дальних переноса героя; прочитаны вывод пульта, журнал BepInEx и кадр.

- C1 pass — 25 из 25 участков на `Krinik/Terrain/Matte`.
- C2 pass — перенос 2158 м: через 10 с 25 из 25 матовые, строк подмены в журнале 5 → 12 (прошло 50 участков), земля на кадре без блика.
- C3 pass — перенос 1716 м: 25 из 25 матовые.
- C4 pass — контроль: подмена выключена — 25 на `Nature/Terrain/Standard`; включена — снова 25 матовые.
- C5 pass — сейв 7/7 без отката, реестр 1280×720.

## 5. Found

- none — дефектов нет. Пешая ходьба через границу участка не прогонялась (то же событие подгрузки, другой путь вызова).

## 6. Traces

- Кадр: `SvarogsDream/_harness/b15w_grad.webp`.
- Журнал: `D:/Games/Svarog's Dream/BepInEx/LogOutput.log` — «matte terrain on: N terrains, held M», «teleport … m».

## 7. Verdict

Pass: участки, подгруженные после перемещения героя, получают матовую землю за ≤ 10 с; подмена выключается и включается на лету.
