# Run report — Svarog's Dream: лучи мыши игры на 100 м и наше отдаление — правка мода камеры 1.3.1

## 1. Work

- План 18, «Наведение на значок жителя не меняет курсор»; баг `bugs/33_svarog_mouse_rays_100m_at_zoom_out.md`.
- Случаи — `testcases/TC_svarog_mouse_ray_reach_2026-10-10.md` (C1–C6, K1).

## 2. Contour

- Игра `D:\Games\Svarog's Dream`, release-плеер; на C1 — 4K `ExclusiveFullScreen`, затем 1280×720 без рамки (как у владельца).
- Сейв владельца; копии `_backups/svarog-saves-2026-10-10_1522-owner`, `…_1533-owner` (владелец выходил через меню в 15:22:05 и
  15:33:46 — выход пишет сейв). Часы игры стоят.
- Пульт: `cursor`, новый `cursorinfo`, `comps ColorOnHover`, `call KrinikUIRework.IconProbe List`.
- `KrinikCameraRework` 1.3.1 — `PatchMouseRayReach`; перепись `SvarogsDream/tools/ray_census.mjs`; сторож `tools/ray-reach-check.sh`.

## 3. Runs

1. 2026-10-10 15:32–15:33 — `bash tools/run-game.sh` (пульт с `cursorinfo`); `bash tools/h.sh "call UnityEngine.Screen SetResolution 3840 2160 ExclusiveFullScreen"`
   `"call CameraFollow SetMaxZoom"` `"call KrinikUIRework.IconProbe List"` `"comps ColorOnHover 6"`; `"cursor x y"` + `"cursorinfo"` над
   землёй, значком и телом банкира; `powershell -File tools/focus-game.ps1`. Владелец взял мышь и в 15:33:46 вышел из игры.
2. 2026-10-10 15:35 — `bash tools/run-game.sh` для музыки (`[OWNER]` «давай пока молча, только музыка»), 1.3.0.
3. 2026-10-10 15:37–15:38 — 1.3.1 первый выпуск: `kill`, копия библиотеки, `run-game.sh`; журнал `grep "mouse ray reach"`.
4. 2026-10-10 15:39–15:40 — 1.3.1 с сопрограммами и лучом-параметром; `node tools/ray_census.mjs <декомпиляция> <8 классов>`;
   `bash tools/ray-reach-check.sh` (40 33) и `bash tools/ray-reach-check.sh 31 8`.

## 4. Checks

Hygiene: `dotnet build` мода камеры и пульта — без ошибок; `bash -n tools/run-game.sh` — ок.
Functional run: игра с сейвом владельца — прочитаны ответы пульта (ручки курсора, расстояние камеры), журнал мода (места патча,
исключения 0). Наведение и щелчок мышью после правки — НЕ прогнаны (владелец у экрана с мышью).

| Случай | Итог |
|---|---|
| C1 повтор поломки | partial — камера 123.8 м; тело — «говорить» после фокуса; значок снят до фокуса |
| C2 значок на приближении по умолчанию | blocked — владелец у экрана |
| C3 значок после правки | blocked — владелец у экрана |
| C4 щелчок по значку | blocked — владелец у экрана |
| C5 места патча | pass (повтор) — 40 в 33, как перепись; первый выпуск — fail, 24 в 17 |
| K1 контроль | blocked |
| C6 после | открыт — игра оставлена открытой для музыки |

## 5. Found

1. Камера на максимальном отдалении — **123.8 м** от героя; 40 лучей мыши игры бьют на 100 м: наведение курсора, щелчки по предметам,
   рецептам и жителям, наведение заклинаний, команды питомцам, бросок бомбы.
2. Первый выпуск патча не видел сопрограмм (`<…>d__N.MoveNext`) и метода с лучом-параметром; первая перепись не видела лучей через
   переменную `ray`. Оба правила дополнены и сошлись: 40 в 33.
3. Наведение мыши читается только при окне игры впереди (`focus-game.ps1`); при владельце у экрана опыт с мышью невозможен.

## 6. Traces

- Журнал `D:\Games\Svarog's Dream\BepInEx\LogOutput.log` — строки `mouse ray reach: … sites=40 methods=33`.
- Ответы пульта — `SvarogsDream/_harness/out.txt` (последний вызов).
- Декомпиляция — scratchpad `acs/` (ilspycmd по `Assembly-CSharp.dll`).

## 7. Verdict

Partial: правка выложена и сходится с переписью (C5 pass), сторож доказан; поведение мышью (C2–C4, K1) не проверено — ждёт прогона,
когда владельца нет у экрана.
