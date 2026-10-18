# Run report — ночные находки владельца: полоса, черепа, окно вестей (2026-10-18)

## Work

кейсы `testcases/TC_svarog_owner_night_items_2026-10-18.md` (S0–S2, N1–N2, W1–W2, Q1, K1) по плану 31.

## Contour

живая игра Svarog's Dream, 3840×2160; сейв владельца — копия `_backups/svarog-saves-2026-10-18_0114-owner-night` (снята при его
игре, перезапуск — по его слову «можно!!!!»); KrinikUIRework `f6790e48` холодной выкладкой, KrinikColorRework `c8544434`.

## Runs


- 2026-10-18 01:14 `bash tools/h.sh "kill"` → `save-check.sh --restore` (8 из 8) → `deploy-cold.sh KrinikUIRework KrinikColorRework`
- 2026-10-18 01:15 `LOCK_MINUTES=20 bash tools/run-game.sh` → экран гибели героя → `h.sh "kill"` → `SAVE_POINT=…0114… save-check.sh --restore` (4 файла отличались)
- 2026-10-18 01:18 `run-game.sh` в фоне + `h.sh "static WorldState isGodMode True"` до входа в мир
- `click …/ActionBarEnabler`; `active UI/GamePopUps/WorldEvents/86-ScandalAtCourt 1`, `…/56-BowsDown 1`; `click UI/Enablers/Inventory` ×2; `findall KrinikBagShadeSide`; `dump`
- 2026-10-18 01:20 `h.sh "kill"` → `save-check.sh --restore` (8 из 8) → `reg-snap.sh restore`
- 2026-10-18 01:26 третий запуск под кейс Q1: `run-game.sh` в фоне + бессмертие пультом → экран гибели героя (бессмертие не успело до входа в мир) →
  `h.sh "kill"` → `save-check.sh --restore` к копии 01:14 (8 из 8) → `reg-snap.sh restore`

## Checks


Hygiene: `dotnet build src/KrinikUIRework -c Release` — 0 ошибок.
Functional run: живая игра, вызовы пультом; прочитаны дамп, журнал `icon … Warning`, кадры `s0_view`, `s1b_bottom`, `s2_pair`, `n_pair`.

| # | Status | Observation |
|---|---|---|
| S0 | pass | бессмертие до входа в мир, герой жив |
| S1 | pass (2-й запуск) | полосы нет; 1-й запуск — гибель героя, откачено |
| S2 | pass | боковины только при открытой сумке |
| N1 | pass | полоса выросла, строка над «ОК» |
| N2 | pass | короткая весть как у игры |
| W1 | pass | череп 56 → 102 px, общая цель значков |
| W2 | skipped | время |
| Q1 | blocked | третий запуск 01:26 — гибель героя при загрузке, откачено; прогнать на другой точке сейва |
| K1 | pass | сейв — копия 01:14, 8 из 8 |

## Found


- Первый запуск: Тамара погибла в схватке с ордой сразу после загрузки — бессмертие пульта, оставленное мной с 00:34, я снял в 01:10, когда
  владелец уже дрался с ордой. Сейв откачен к копии 01:14 (героиня жива, в бою, 197 из 1027 здоровья во втором запуске).
- Панель быстрых действий в сейве свёрнута кнопкой игры `ActionBarEnabler` — не дефект мода.

## Traces

`SvarogsDream/_harness/s0_view.webp`, `s1b_bottom.webp`, `s2_pair.webp`, `n_pair.webp`; `D:/Games/Svarog's Dream/BepInEx/LogOutput.log`.

## Verdict

partial — прогнанные кейсы pass; W2 не прогнан, Q1 заблокирован (третий запуск — гибель героя).
