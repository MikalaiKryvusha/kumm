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
| 4 | 2026-10-14 09:00 +03:00 | `bash tools/h.sh "fieldon Camera CameraFollow targetZoom <80…200>" "call KrinikCameraRework.Plugin TestFaceSun <10/20/35> <0…345>" "call KrinikCameraRework.Plugin CameraGround"` ×288 | 0 · `clear` ≥ 2,95 везде, но герой за гребнем холма на кадре `g3_200_0` → поиск по лучу от героя |
| 5 | 2026-10-14 09:12 +03:00 | `bash tools/h.sh "pick 2202 1804 6" "comps Collider 200"` | 0 · в точке среза `Rocks/SM_Cliff_Formation_03` без коллайдера |
| 6 | 2026-10-14 09:20 +03:00 | `bash tools/h.sh "cfg … AvoidRocks false" "call KrinikCameraRework.Plugin TestBackTo <10/15> SM_Cliff_Formation_03 <-30/0/30>" "shot g10_…"` ×12 | 0 · контроль: стена скалы и срез полигона |
| 7 | 2026-10-14 09:21 +03:00 | то же с `AvoidRocks true`, `shot g11_…` ×12 | 0 · 12 из 12 чисто, журнал `… by rock` |
| 8 | 2026-10-14 09:22 +03:00 | `bash tools/h.sh "perf 4"` ×3 (вкл / выкл / вкл) | 0 · 15,44 / 16,15 / 14,75 мс главного потока |
| 9 | 2026-10-14 09:41 +03:00 | `tools/keys.ps1 -Key W -Ms 3000` + `bash tools/h.sh "call KrinikCameraRework.Plugin CameraGround" ×30` | 0 · G6 fail: скачок назад 15,8 за 0,1 с |
| 10 | 2026-10-14 09:50 +03:00 | то же на сборке с плавным отходом (чистый запуск) | 0 · G6 pass: шаги ≤ 6,6 за 0,1 с, `below` нет |
| 11 | 2026-10-14 09:51 +03:00 | `bash tools/h.sh "call UnityEngine.Screen SetResolution <W H> ExclusiveFullScreen" … "shot g7_<H>"` ×4, затем `3840 2160 FullScreenWindow` | 0 · G7 pass: подтяжка 14,66 на всех |
| 12 | 2026-10-14 09:53 +03:00 | `bash tools/h.sh "call KrinikCameraRework.Plugin TestBackTo 30 SM_Cliff_Formation_03 180" … "cfg … GroundClearance 0" …` | 0 · G4 pass: `pulled 0`, `clear 47,22` с правкой и без |

## 4. Checks

Hygiene: `dotnet build src/KrinikCameraRework -c Release` — сборка без ошибок.
Functional run: игра владельца на его сейве, его камера у склона; прочитаны кадры `shot` и журнал мода.

- G0 — pass со второго прогона: воспроизвёл владелец, кадр `g0_owner.webp`.
- G1 — pass: правка выключена — внизу небо сквозь склон (`g1_off.webp`).
- G2 — pass: правка включена — полосы нет, камера на 1,5 над землёй (журнал), герой у костра в кадре (`g2_fix.webp`; лист
  `SvarogsDream/_harness/camera_ground_off_on.webp`). Шов: при 1,5 в кадр лез лист куста — запас по умолчанию поднят до 3 (`g2_c3`, `g2_c5` —
  чисто; камеру между снимками повернул владелец, сравнение 3 и 5 не на одном виде).
- G3 — fail → G8: камера над рельефом в 288 точках, но героя закрывал гребень — поиск переделан на луч от героя к камере.
- G9 — fail у владельца (срез полигона утёса `SM_Cliff_Formation_03`, модель без коллайдера) → невидимые формы скал в своей физической
  сцене (`RockProxies.cs`); G10 (контроль) — pass, дефект виден; G11 — pass, 12 из 12 чисто (`g10_sheet.webp`, `g11_sheet.webp`,
  `camera_rocks_off_on.webp`).
- Мир при замере: часы идут (на кадрах `g10_*`/`g11_*` время игры 06:52 → 08:33, `timescale` не трогал).
- G12 — partial: главный поток не дороже по `perf 4`, но обход первого участка 1,72 мс (порог 1 мс); G5 — fail по порогу: 0,038 мс/кадр
  (порог 0,02).
- G6 — fail → плавный отход назад (как Damping у Cinemachine) → pass; G7 — pass (720p–4K); G4 — pass (ровная сторона не подтягивается).
- G13 — не прогнан (перенос героя без высоты земли в точке — риск для сейва «Железного человека»); G8 — пропущен (прогон остановлен
  владельцем), видимость героя проверена кадрами G11.
- Вердикт владельца по камере у утёса: `[OWNER]` «да, сейчас хорошо» · 2026-10-14.

## 5. Found

- Горячая выкладка (`deploy-hot.sh`) мод камеры не перезагружает: он грузится из `plugins/`, а не из `scripts/`; копия в `scripts/` не
  загрузилась, вызовы пульта ушли в неё и упали. Копия удалена; мод камеры выкладывается только при закрытой игре.
- Проверка по высоте участков не находит баг на виде, повёрнутом не туда, — репро требует отдаления 200 и вида владельца (прогон 1).
- Проверка одной точки камеры мала: гребень холма между героем и камерой закрывал героя (прогон 4).
- Утёсы `SM_Cliff_*` — модели без коллайдера: рельеф и физика игры их не видят (прогон 5).
- Кадр «Ева, осень», показанный владельцу как текущий, — вчерашний файл с тем же именем (`owner_now.webp`): снимок пульта его не перезаписал
  за время показа; имена снимков — с меткой времени.
- На кадре 09:11 (`owner_now2.webp`) панель ячеек развалена на два блока справа; на кадрах 09:20–09:21 она цела — не разобрано.

## 6. Traces

`SvarogsDream/_harness/g0_owner.webp`, `g1_off.webp`, `g2_fix.webp`, `g2_c3.webp`, `g2_c5.webp`, `camera_ground_off_on.webp`;
журнал `D:/Games/Svarog's Dream/BepInEx/LogOutput.log` (строки `camera ground:`); ответы пульта `SvarogsDream/_harness/out.txt`.

## 7. Verdict

partial — под рельеф и в утёс у места владельца камера с правкой не уходит (G1/G2, G10/G11), на бегу отходит плавно (G6), одинакова
на 720p–4K (G7), на ровном месте не трогается (G4); не прогнана жизнь форм при выгрузке участков (G13); обход первого участка 1,72 мс —
выше порога 1 мс, цена камеры 0,038 мс/кадр — выше порога 0,02 (G5).
