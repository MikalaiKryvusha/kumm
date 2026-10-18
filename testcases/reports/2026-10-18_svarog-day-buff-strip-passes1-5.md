# Test run report — Svarog's Dream, день 2026-10-18, заходы 1–5: полоса состояний (порядок, пассивки, перенос строк), цифра перезарядки, ряд кнопок на 720p, подсказка значка

**Created:** 2026-10-18 13:4x +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KrinikUIRework — заход 1 `197b4430` (SvarogsDream
`a63b6f3`), заход 2 13:13:54, заход 3 тот же, заход 4 `6403c64e`, заход 5 `7bc323b2`; код заходов 2–5 и правка `InstantTranslate` — коммит закрытия

## 1. Work

Кейсы `testcases/TC_svarog_buff_strip_order_wrap_2026-10-18.md` (S1–S12, S7b, S8b, S10b, S10c, S11b, W1, CD1, CD2, V1, G1, B1, R1); основа — интервью
#024 Q3, Q4 и слова владельца о второй и третьей строке (план 31, пункты 16б, 16в, 19б).

## 2. Contour

Игра владельца (BepInEx 5.4.23.5), 4K@144 на весь экран, D3D11; машина — по слову владельца «комп твой, можешь тестить» (13:0x, после перезагрузки
по перебою питания в 12:59). Сейв — точка `_backups/svarog-saves-2026-10-18_1303-live-before-day-run` (= ночная 0225, 8 из 8), запуск с `SAFE_SPOT`.
REAL WORLD: accumulated — настройки модов владельца (`cfg_run_diff` после каждого захода: 0 изменённых) — verified on the real world; data and
machine — его игра, его сейв (копия) — verified with real state; path — HUD, сумка, окно персонажа, смена наборов как у игрока — verified on the
real world; настоящая мышь — заходы 3–5.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-18 13:04 +03:00 | `deploy-cold.sh KrinikUIRework`; `LOCK_MINUTES=45 SAFE_SPOT="-590,96,1863" bash tools/run-game.sh` | 0 · мир |
| 2 | 13:05–13:11 | `h.sh "click …KrinikSwapButton"`, `"cfg … Hud IdlePassives false/true"`, `"call BuffsManager ActivateBuffForTime <id> 300"`, `"call BuffsManager DeactivateBuff StrengthUp"`, `"click …Slot~(8)"`, `"shot d_*"`; `node tools/digit_center.mjs _harness/d_cd.webp 2700 2089` | 0 · кадры `d_*`, E `dy 0 px` |
| 3 | 13:12 | `h.sh "kill"`; `save-check.sh --restore`; `reg-snap.sh restore` | 0 · `cfg run diff: 0 changed` |
| 4 | 13:15–13:17 | заход 2: `run-game.sh`; `h.sh` S8b, S7b; `rec_clip.sh v1_strip 8 …`; `hdr.ps1 on` при открытой игре | игра упала 13:16:57 в `nvwgf2umx.dll` (EXP-0318) |
| 5 | 13:20–13:24 | заход 3: `run-game.sh`; `hdr.ps1 on` (страж, код 2); `h.sh` S9; `tools/mouse.ps1 -Button move` S10; `cfg … HeroCard Enabled false/true` S11; `call UnityEngine.Screen SetResolution 1280 720 ExclusiveFullScreen` S12; `h.sh "kill"` | 0 |
| 6 | 13:27–13:32 | заход 4: S10b мышью, `comps UIBuffTooltip`, `dump …/BuffToolTip`, S11b, B1; `h.sh "kill"` | 0 |
| 7 | 13:33–13:35 | заход 5: S10c, R1 мышью; владелец вошёл в игру и открыл свои окна — прогон остановлен, игру закрыл владелец | blocked |

## 4. Checks

- Hygiene: `dotnet build src/KrinikUIRework -c Release` — 0 ошибок после каждой правки; `node tools/digit_center.mjs` проверен на кадре 3б (4 ячейки).
- Functional run: полоса состояний, ряд ячеек, сумка, окно персонажа, смена наборов и разрешения в игре владельца; кадры, клип, дампы и журнал
  мода прочитаны; настоящая мышь в заходах 3–5.

| Case | Status | What was read |
|---|---|---|
| S1–S6, S8, W1 | pass (S2 — только набор без лука; «совсем без оружия» не прогнан) | `d_s0_card`, `d_s1_card`, `d_s4_strip`, `d_s5_strip`, `d_s5_ctrl`, `d_s6_card`, `d_s8_pair` |
| S7 → S7b | fail → правка `Grow` → pass | журнал `9 timed (of 12)` → `22 shown in 22 slots`, `e_s7_strip` |
| S8b | pass | `e_s8b` |
| V1 | pass | `v1_strip.mkv`, `v1_tiles.webp` |
| G1 | pass | закрытая игра — код 0, запущенная — код 2 |
| S9, S12, B1, S11b | pass | `f_s9`, `f_s12`, `g_b1_row`, `g_s11off_full` |
| S10 → S10b | fail → правка `PatchBuffTipAboveIcon` → partial | `f_s10`; `g_s10b`, `g_gap`: левый край по значку, зазор 95 вместо ≈10 → правка `Bounds` по кайме |
| S10c, R1 | blocked | заход 5 прерван (владелец в игре); журнал: габарит `550x250` по кайме вместо `550x337` |
| S11 → S11b | fail → правка `_buffsSize` → pass | `f_s11off_full`, дамп `x 3659`; `g_s11off_full` |
| CD1 | blocked | навыка в первом наборе нет, `AssignSpell 0 4` не поставил |
| CD2 | E pass · Q blocked | `dy 0 px · 0.0 %`; еды на Q нет |

## 5. Found

1. У игры 10 заготовок значков, лишнее молча пропадало (S7) — правка `PassiveBuffs.Grow`.
2. Выключатель `Hud.IdlePassives` перестраивал полосу только при следующей смене состояний — правка `PassiveBuffs.Refresh`.
3. Возврат полосы игре не снимал ширину карточки — значки уезжали за край (S11, изъян с 17.10) — правка `_buffsSize`, `startAxis`.
4. Ряд круглых кнопок после 4K → 720p разъезжался, «Оружие» на ячейке E (шаг в пикселях 4K) — правка `Hud.ButtonsRow`.
5. Подсказка значка состояния — левее значка (формула игры) — правка `PatchBuffTipAboveIcon`; габарит по невидимому корню игры — правка `Bounds`.
6. Игра упала в драйвере NVIDIA после `hdr.ps1 on` при открытой игре — страж в `hdr.ps1`, EXP-0318, KAGO уведомлён (карта была на заводских).
7. Правила словаря с буквой шаблона не работали в мгновенном переводе — правка `InstantTranslate` (баги 56, 57), в игре не проверена.
8. Владелец за 5 минут игры — баги 55–62 и кнопка ⇅ (план 31, строки 20б–28); разбор процесса — план 32.

## 6. Traces

`SvarogsDream/_harness/`: `d_*.webp`, `e_*.webp`, `f_*.webp`, `g_*.webp`, `h_*.webp`; клип `_harness/demo21/clips/v1_strip.mkv`, лист `v1_tiles.webp`;
дамп `_harness/dump.txt` (BuffToolTip); падение — `%LOCALAPPDATA%\Temp\VI Games\Svarog's Dream\Crashes\Crash_2026-10-18_101657144`.

## 7. Verdict

partial — порядок полосы, пассивки, перенос в три строки, добор ячеек, выключатель, сумка, 720p, возврат игре и цифра на E прошли в игре;
подсказка над значком — левый край прошёл, зазор после правки `Bounds` не проверен (S10c, R1); CD1 и Q заблокированы; правка мгновенного
перевода в игре не проверена.
