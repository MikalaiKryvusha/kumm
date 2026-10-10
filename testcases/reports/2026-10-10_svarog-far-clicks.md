# Run report — Svarog's Dream: щелчок по далёкому предмету или жителю на отдалении — мод камеры 1.3.2 (баг 34)

**Created:** 2026-10-10 19:07 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikCameraRework 1.3.1 → 1.3.2,
KrinikDevHarness с полем `cam=` в `comps`

## 1. Work

- Жалоба владельца после его игры 16:14–18:45: `[OWNER]` «вдали кликаю по цветку или жителю - герой подбигает и ничего не делает» ·
  2026-10-10 ≈18:46. Баг `bugs/34_DONE_svarog_far_clicks_ray_150m_short_of_view.md`.
- Случаи — `testcases/TC_svarog_far_clicks_2026-10-10.md` (K1–K2, C1–C6).

## 2. Contour

- Игра `D:\Games\Svarog's Dream`, release-плеер, 1280×720 без рамки (реестр владельца — он играл через удалённый стол).
- Сейв владельца после его игры: копия `_backups/svarog-saves-2026-10-10_1848-owner` (7 файлов + его журнал игры). Бара, часы стоят
  (`fieldon … isTimeDisabled True`), камера на пределе отдаления (123.8 м от героя), наклон 50° (C1–C3 — 35°).
- Действие у владельца — правая кнопка мыши (левая по миру не действует: K1).
- REAL WORLD: accumulated — сейв владельца после его игры, его настройки модов и управления; data and machine — его машина, его режим
  экрана; path — отдаление до предела, правый щелчок по далёкой цели, как он играет.

## 3. Runs

1. 2026-10-10 18:51–18:52 — `bash tools/run-game.sh` (1.3.1; сторож «40 rays in 33 methods»); `bash tools/h.sh "fieldon
   Managers/StandardManagers/WorldTimeManager WorldTime isTimeDisabled True" "callon Camera CameraFollow SetMaxZoom" "cursorinfo"
   "comps GroundItemInteraction 40"`.
2. 2026-10-10 18:53–18:55 — K1: `powershell -File tools/mouse.ps1 -X 855 -Y 71 -Button left`, `-X 787 -Y 69 -Button left`,
   `-X 600 -Y 470 -Button left` (герой не двинулся); `-X 836 -Y 270 -Button right` (банкир — разговор); `-X 697 -Y 667 -Button left`
   («Уйти»); `-X 692 -Y 25 -Button right` (топор, 163 м — не поднят); контроль `-X 627 -Y 374 -Button right` (топор, 124 м — поднят);
   `h.sh "call KrinikUIRework.IconProbe List"`, `"shot r1c_after"`.
3. 2026-10-10 18:56 — `bash tools/h.sh "kill"`; сверка `sha256sum` сейва с копией — 7/7.
4. 2026-10-10 18:57 — `dotnet build src/KrinikCameraRework -c Release`, копия в `BepInEx/plugins/KrinikCameraRework/`,
   `bash tools/run-game.sh` (1.3.2; сторож 40/33); `grep "mouse ray reach:" LogOutput.log`.
5. 2026-10-10 18:57–19:00 — `h.sh "call KrinikCameraRework.Plugin TestTilt 35"`; C1 `tools/mouse.ps1 -X 816 -Y 98 -Button right`
   (топор, 175 м); C3 `-X 552 -Y 124 -Button move` + `cursorinfo`; C2 `-X 552 -Y 124 -Button right` (стражник, 172 м); C3 контроль над
   тем же стражником рядом; C5 `-X 712 -Y 582 -Button right` (рыбак, 24.6 м); кадры `c1_after`, `c2_after`, `c5_after`.
6. 2026-10-10 19:05–19:06 — владелец вышел из игры через меню посреди следующего замера (выход записал сейв 19:05:14); откат 3 файлов
   из копии 18:48, `sha256sum` — 7/7.

## 4. Checks

- Hygiene: сборки мода камеры и пульта без ошибок; сторож `tools/ray-reach-check.sh` — «40 rays in 33 methods — matches the census» на
  1.3.1 и на 1.3.2.
- Functional run: игра владельца на его сейве и в его режиме экрана; правые щелчки мышью по далёким и близким целям; прочитаны `comps`
  (есть ли вещь, где герой), `cursorinfo` (ручка курсора системы), кадры экрана.
- K1 — pass (поломка воспроизведена): топор в 163 м от камеры — герой у топора, топор лежит; тот же топор в 124 м — поднят.
- K2 — skipped: тот же луч, что у K1.
- C1 — pass: топор в 175 м от камеры (64 м от героя) поднят.
- C2 — pass: стражник в 172 м от камеры — герой прошёл 58 м, стражник ответил пузырём.
- C3 — pass: курсор над стражником вдали и рядом — одна ручка 1463883893; над землёй — 249895191.
- C4 — pass: 10 лучей щелчков и курсора → «camera far clip» (`clickReach=280` в мире), 30 лучей заклинаний, бомбы и питомцев — 150.
- C5 — pass: рыбак в 24.6 м — герой подошёл, ответ пузырём.
- C6 — pass: сейв владельца откачен, 7/7 с копией 18:48.

## 5. Found

- Мод камеры 1.3.1 (баг 33) давал лучам 150 м, а камера под наклоном видит землю на 160–290 м — дальние цели не брались (баг 34, исправлен).
- Строка игры не переведена: «Travel requires 3 food, but you only have 0.» (окно карты; класс бага 28).
- У сейва владельца сытость героя 0 — быстрое перемещение закрыто до еды (состояние его игры, не дефект).

## 6. Traces

- Кадры: `SvarogsDream/_harness/r1c_after.webp`, `r1k_after.webp`, `c1_before.webp`, `c1_after.webp`, `c2_after.webp`, `c5_after.webp`,
  `bara_inn.webp`.
- Журнал мода: `D:\Games\Svarog's Dream\BepInEx\LogOutput.log` (строки «mouse ray reach:»).
- Сейв: копия владельца `_backups/svarog-saves-2026-10-10_1848-owner`, запись прогона `_backups/svarog-saves-2026-10-10_1905-agent-run`.
- Декомпиляция `PlayerController`, `CastSpell`, `CursorIcons`, `WorldMap` — scratchpad сессии (`acs/`).

## 7. Verdict

Pass: на отдалении до предела правый щелчок по далёкому предмету и жителю (172–175 м от камеры) работает — герой дошёл, поднял,
заговорил; курсор над далёким жителем — «говорить»; близкие цели как раньше; контроль на 1.3.1 — поломка. Не прогнано: заклинания и
команды питомцам вдали (оставлены ×1.5 намеренно, FORK в баге 34).
