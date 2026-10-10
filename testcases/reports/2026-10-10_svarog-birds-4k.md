# Run report — Svarog's Dream: птицы в 4K (C55; к C22, C24, C31 — partial на 720p)

## 1. Work

Без правок кода: проверка птиц неба (`KrinikColorRework/Sky.cs` — виды, пути, появление) в разрешении владельца. Случай —
`testcases/TC_svarog_sky_v3_2026-10-09.md` C55. Основание: план 18, «Птицы в дневном небе» — «на 4K — глаз владельца» → сначала
глаз агента.

## 2. Contour

Игра `D:\Games\Svarog's Dream`, 3840×2160, DX11. Сейв владельца 02:15:41 (`_backups/svarog-saves-2026-10-10_0216-owner`). Автосейва
не было, sha256 4/4. Перемотка к полудню — на паузе игры; ход времени — днём в деревне.

## 3. Runs

Запуск игры 2026-10-10 03:23 (`bash tools/run-game.sh`). Пульт:
- `bash tools/h.sh "timescale 0"`, `"callon … IncreaseTimeByOneHour True"` ×9, `"timescale 1"`, `"wait 12"`;
- `"callon Camera CameraFollow SetMaxZoom"`, `"call KrinikCameraRework.Plugin TestFaceSun 10 90"`;
- `"call KrinikColorRework.Sky TestBirds 1"` (гуси) → `shot bg1a/b/c`;
- `TestBirds 4` (скворцы) → `bg4a/b`;
- `TestBirds 3` (канюк) → `bg3a/b`.

Закрытие — `"kill"`.

## 4. Checks

Hygiene: код не менялся.

Functional run: игра запущена агентом, день в Бору, камера на небо. Прочитано:
- кадры 4K и вырезки в полном разрешении;
- журнал `sky birds: geese / starlings / buzzard`.

Итог: C55 partial.

## 5. Found

1. Гуси видны серыми вытянутыми фигурами в планировании. Клин целиком в кадр не попал — остальные гуси за кроной дерева.
2. Скворцы — стайка тёмных точек над лесом, видна ясно.
3. Канюк в двух кадрах с шагом 3 с не пойман.
4. Плавность появления и ухода не мерилась — нужна серия чаще или видео.

## 6. Traces

- `SvarogsDream/gallery/game/2026-10-09_небо/v5-птицы-гуси-4K.webp`, `v5-птицы-скворцы-4K.webp`.
- `SvarogsDream/_harness/bg1a–c`, `bg4a–b`, `bg3a–b` (`.webp`).
- Журнал — `SvarogsDream/_harness/logs/2026-10-10_0323_Player-birds.log`.

## 7. Verdict

**partial.** Птицы в 4K читаются как птицы (гуси, скворцы). Канюк и плавность ухода не подтверждены; вкус — глаз владельца.
