# Test run report — Svarog's Dream, ночь 2026-10-18, пачка 6: цифра перезарядки в коробке, бумага подписей кнопок, первый кадр подсказки, еда на Q

**Created:** 2026-10-18 06:13 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `cfb5669` + правки пачки 6 (`HudRow.cs` — цифра
перезарядки; `Hud.cs`, `Plates.cs`, `KrinikTip.cs` — `TipPaper`; `TooltipFit.cs` — журнал 10 кадров с прозрачностью; пульт — аргумент `Sprite`)

## 1. Work

План 31, пункты 19 (цифра перезарядки на шве, рулбук В4), 20 (подпись кнопки — бумага с каймой, К1, К6, Т3, В1), 18 (первый кадр подсказки,
T7r/T7a), 7 (строка с картинкой, M2); кейсы P8, P16 (еда на Q); исправленный `SAFE_SPOT` (A2). Кейсы — `testcases/TC_svarog_night_batch6_2026-10-18.md`.

## 2. Contour

Игра владельца (BepInEx 5.4.23.5), 4K, сейв — точка `_backups/svarog-saves-2026-10-18_0225-live-before-night-agent`, перед запуском в файл ссылок
дописана строка `51 268` (бобы на Q); после — откат точки (8 из 8). Экран заблокирован (`LogonUI.exe`): наведение и щелчки — событиями пульта, кадры
изнутри игры — **замена** мыши и видео. Холодная выкладка `KrinikUIRework` и `KrinikDevHarness`, затем две горячие. REAL WORLD: accumulated —
настройки модов владельца (`cfg_run_diff.py`: 0 изменённых) — verified on the real world; data and machine — его игра, копия его сейва — verified
with real state; path — ряд, кнопки, стопка, как у игрока, но наведение событием пульта — verified with real state.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-18 05:59 +03:00 | `bash tools/deploy-cold.sh KrinikUIRework KrinikDevHarness`; `SAFE_SPOT="-590,96,1863" LOCK_MINUTES=45 bash tools/run-game.sh` | 0 · `False -> True`, телепорт, `True -> False` |
| 2 | 2026-10-18 06:00 +03:00 | `bash tools/h.sh "call SpellsActionManager AssignSpell 12 4" … "click …/Slots/Slot~(8)" … "cfg … Hud ActionRow false/true"` | 0 · HUD скрыт — кадры пустые |
| 3 | 2026-10-18 06:03 +03:00 | `bash tools/h.sh "click …/Enablers/ActionBarEnabler"` ×3, `static WorldState equipedWeaponType`, `active UI/ActionBar/KrinikHeroCard` | 0 · HUD прячет «оружие убрано» |
| 4 | 2026-10-18 06:04 +03:00 | `bash tools/h.sh "fieldon Player PlayerStats currentHealth 600" "click …/Slot~(8)" "click …/Group~(1)/Slot~(1)" …` | 0 · CD1, CD2 fail (лист `cd_sheet.webp`) |
| 5 | 2026-10-18 06:05 +03:00 | `bash tools/h.sh "dump …/Slot~(8)" "fieldon …/Cooldown ActionBarUI.UISlotCooldown m_TargetText" "dump …/Group~(1)/Slot~(1)"` | 0 · цифра — текст «CountdownTimer» |
| 6 | 2026-10-18 06:06 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework`; `bash tools/h.sh "tmoved 1 30"` | 0 · RELOADED; в покое UI 16 |
| 7 | 2026-10-18 06:08 +03:00 | `bash tools/h.sh "click …/Group~(1)/Slot~(1)" … "cfg … Hud ActionRow false" … "true"` | 0 · D4 pass (лист `d4_sheet.webp`) |
| 8 | 2026-10-18 06:09 +03:00 | `bash tools/h.sh "hover …/ActionBarEnabler" "hover UI/Enablers/InfoPanel" … "give 268" "give 268" "click …/Slot~(7)" … "callon UI/ActionBar/InfoMessages GameUI.UIInfoMessages ShowNewCustomMessageWithImage New~Virtue Fight"` | 0 · лист `b6_sheet.webp` |
| 9 | 2026-10-18 06:10 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework`; `bash tools/h.sh "hover …" …` ×4 | 0 · журнал с прозрачностью |
| 10 | 2026-10-18 06:10 +03:00 | `bash tools/h.sh "kill"`; `save-check.sh --restore`; `reg-snap.sh restore` | 0 · `cfg run diff: 0 changed`, замок FREE |

## 4. Checks

- Hygiene: `dotnet build` KrinikUIRework и KrinikDevHarness — Build succeeded; `bash -n` для `run-game.sh`, `deploy-hot.sh`; проверка покоя после
  выкладок красная (103–112) только в первую секунду после перезагрузки — в покое 16 (`tmoved 1 30`: UI 10, значки мира 6); пауза перед проверкой
  в `deploy-hot.sh` — правка, не проверена.
- Functional run: перезарядка запущена щелчками по ячейкам на живом HUD, подписи кнопок и подсказки показаны событием наведения, еда съедена со
  ссылки на Q, строка с картинкой показана методом игры — кадры, дампы, ответы пульта и журнал прочитаны. Мышью и видео не проверено — экран заблокирован.

| Case | Status | What was read |
|---|---|---|
| A2 безопасный старт | pass | ответы пульта `False -> True`, `True -> False`; журнал `4 links` |
| CD1, CD2 цифра перезарядки | fail → правка (двигался пустой `m_TargetText`) | `cd_sheet.webp`, дампы |
| CD3 контроль | blocked → закрыт D4 | — |
| D4 цифра по центру, контроль | pass | `d4_sheet.webp`, `d4off_bottom.webp` |
| CP1, CP2 подписи кнопок | pass | `b6_sheet.webp` (`cp1`, `cp2`) |
| T7r первый кадр подсказки | fail (два сдвига остались) | журнал 06:09 |
| T7a прозрачность сдвигов | pass (оба сдвига при 0,00) | журнал 06:10 |
| P8 еда на Q | pass | `p8a`, `p8b`, журнал `hotbar use: cell 51 … consume` |
| P16 подсказка еды | partial (половина с зельем — нечем) | `p16q` |
| M2 строка с картинкой | partial (значок отдельно от плашки) | `m2`, журнал `adopted` |
| S1 уборка | pass | `cfg run diff: 0 changed`, сейвы 8 из 8 |

## 5. Found

1. Цифра перезарядки ячейки — текст «CountdownTimer», а не `UISlotCooldown.m_TargetText` (у ячеек пуст): первая правка двигала пустоту — исправлено, D4.
2. После загрузки сейва HUD может быть скрыт: оружие убрано, игра прячет панель и нашу карточку (Caps Lock, `SetActionManager(!isEquiped)`) — записано в карту игры.
3. Первый кадр подсказки меряет прошлую карточку — второй сдвиг есть, но оба при прозрачности 0: не виден; бесполезный цикл «сетки до раскладки» убран.
4. Строка с картинкой в стопке: значок висит справа от плашки, отдельно — план 31, пункт 7.
5. Ложная тревога проверки покоя сразу после перезагрузки — правка в `deploy-hot.sh` (пауза 3 с).
6. Храповик эпика 26 (поиски 65 → 71, перестройки 13 → 14): в кадре поисков меньше (8 → 7), LINQ в кадре 26 → 0; выросли поиски при загрузке и одна
   перестройка в окне выбора героя (`HeroSelect.cs`, открытие окна — лаг разрешён); порог не поднят. Семь поисков «в кадре» по переписи: `Fonts.cs`
   (`FontsTick` — раз в секунду и только пока HUD не найден) и `HeroPortraits.cs` (`HeroPortraitsTick` — раз в секунду до предела попыток после загрузки
   сцены) в кадр геймплея не попадают; `Purse.cs` (поиск не чаще раза в `PurseKickEvery` с и не больше `PurseKickTries` раз), `MapPalette.cs` (скан по
   назначенному событию `_scanAt`), `MiniMapLight.cs` (перебор шейдеров один раз, если `Shader.Find` не нашёл) — тоже ограждены, по коду (в игре не мерено).

## 6. Traces

`SvarogsDream/_harness/`: `a2.webp`, `now6.webp`, `w6.webp`, `cd_sheet.webp`, `d4_sheet.webp`, `d4off_bottom.webp`, `b6_sheet.webp`, `cp1.webp`, `cp2.webp`,
`p8a.webp`, `p8b.webp`, `p16q.webp`, `m2.webp`; журнал — `_harness/log_batch6.log`.

## 7. Verdict

partial — цифра перезарядки в коробке, бумага подписей, еда на Q, безопасный старт и невидимость второго сдвига подсказки прошли в игре; строка с
картинкой (значок отдельно) и подсказка зелья (P16, половина) — открыты; мышью и видео — замена пультом, экран заблокирован.
