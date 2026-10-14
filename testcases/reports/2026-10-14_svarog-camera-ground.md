# Test run report — Svarog's Dream: камера не уходит под землю

**Created:** 2026-10-14 08:39 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream, мод `KrinikCameraRework` 1.7.0
(сборка 08:33 в `plugins/`, настройка `Camera/GroundClearance` меняется на лету)

## 1. Work

Правка `PatchMouseRotate.KeepAboveGround`: камера, оказавшаяся ниже участка земли, подъезжает по своему лучу к точке взгляда, пока не
встанет над землёй с запасом `GroundClearance`. Основание — `[OWNER]` «камера не упирается в землю» · «движок позволел камеру в землю
переместить» · 2026-10-13, кадр 23:17. Кейсы — `testcases/TC_svarog_camera_ground_2026-10-14.md` (G0–G7).

## 2. Contour

Игра Svarog's Dream (GOG, BepInEx), 4K во весь экран, сейв-воспроизведение `_backups/svarog-saves-2026-10-13_2318-owner-camera-under-ground`
(сейв владельца 23:18 до прогона — копия `_backups/svarog-saves-2026-10-14_0832-owner-before-camera-ground`). Камеру в прогонах 2 и 3 вёл
владелец: он сам воспроизвёл баг в запущенной игре.
`REAL WORLD:` accumulated — сейв и конфиги владельца, его место у склона; data and machine — его машина и установка игры; path — его
камера мышью и колесом. Проверено на реальном мире: сейв владельца, камера в его руках.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-14 08:35 +03:00 | `bash tools/h.sh "cfg … GroundClearance 0" "call KrinikCameraRework.Plugin TestFaceSun 10 <0…315>" "callon Camera CameraFollow SetMaxZoom" "call KrinikCameraRework.Plugin CameraGround"` | 0 · восемь поворотов, камера над участком на 7–41 ед. — не воспроизведено |
| 2 | 2026-10-14 08:36 +03:00 | `bash tools/h.sh "call KrinikCameraRework.Plugin CameraGround" "fieldon Camera CameraFollow targetZoom" "shot g0_owner"` | 0 · вид владельца (отдаление 200): небо сквозь склон внизу кадра; `CameraGround` упал (вызов ушёл в копию мода из горячей выкладки) |
| 3 | 2026-10-14 08:37 +03:00 | `bash tools/h.sh "cfg … GroundClearance 1.5" "shot g2_fix" "cfg … GroundClearance 0" "shot g1_off" "cfg … 3" "shot g2_c3" "cfg … 5" "shot g2_c5"` | 0 · журнал `camera ground: pulled 56,3 of 100,5 toward the hero, clear -4,40 -> 1,51` |

## 4. Checks

Hygiene: `dotnet build src/KrinikCameraRework -c Release` — сборка без ошибок.
Functional run: игра владельца на его сейве, его камера у склона; прочитаны кадры `shot` и журнал мода.

- G0 — pass со второго прогона: воспроизвёл владелец, кадр `g0_owner.webp`.
- G1 — pass: правка выключена — внизу небо сквозь склон (`g1_off.webp`).
- G2 — pass: правка включена — полосы нет, камера на 1,5 над землёй (журнал), герой у костра в кадре (`g2_fix.webp`; лист
  `SvarogsDream/_harness/camera_ground_off_on.webp`). Шов: при 1,5 в кадр лез лист куста — запас по умолчанию поднят до 3 (`g2_c3`, `g2_c5` —
  чисто; камеру между снимками повернул владелец, сравнение 3 и 5 не на одном виде).
- G3–G7 — не прогнаны: игра в руках владельца.

## 5. Found

- Горячая выкладка (`deploy-hot.sh`) мод камеры не перезагружает: он грузится из `plugins/`, а не из `scripts/`; копия в `scripts/` не
  загрузилась, вызовы пульта ушли в неё и упали. Копия удалена; мод камеры выкладывается только при закрытой игре.
- Проверка по высоте участков не находит баг на виде, повёрнутом не туда, — репро требует отдаления 200 и вида владельца (прогон 1).

## 6. Traces

`SvarogsDream/_harness/g0_owner.webp`, `g1_off.webp`, `g2_fix.webp`, `g2_c3.webp`, `g2_c5.webp`, `camera_ground_off_on.webp`;
журнал `D:/Games/Svarog's Dream/BepInEx/LogOutput.log` (строки `camera ground:`); ответы пульта `SvarogsDream/_harness/out.txt`.

## 7. Verdict

partial — баг на месте владельца не воспроизводится с правкой (G1/G2), но обход по кругу, движение, цена и разрешения (G3–G7) не прогнаны.
