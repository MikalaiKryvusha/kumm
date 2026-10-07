# Test run report — Svarog's Dream: KrinikFixes, выплата за маску-клад

**Created:** 2026-10-07 16:26 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `014dcd0` + новый мод
KrinikFixes 1.0.0 и команды пульта `give`, `gold`

## 1. Work

`KrinikFixes` 1.0.0 — патч `MaskPayoutPatch` на `TreasureHuntMask.SellMask` (доплата до обещанных 8000); команды пульта `give`,
`gold [reset]`. Case set: `testcases/TC_svarog_fixes_mask_payout_2026-10-07.md` (F1–F3, K1). Basis: `[OWNER]` «и у нас поправь» ·
2026-10-07; текст торговца «8000 coins.», код автора `AddGold(5000)`.

## 2. Contour

Svarog's Dream в `D:\Games\Svarog's Dream`, BepInEx 5; моды KrinikFixes (plugins, сборка 2026-10-07 16:24) и KrinikDevHarness
(plugins, сборка 16:24) поверх сборки SvarogsDream `014dcd0`; сейв владельца, без записи (закрытие командой пульта `kill`).

## 3. Runs

Один прогон, 2026-10-07 16:25–16:26:
- `bash tools/run-game.sh` — мир и HUD в 16:25:52.
- `bash tools/h.sh "gold" "call TreasureHuntMask SellMask" "gold"` — 16:26:05 (F2).
- `bash tools/h.sh "cfg krinik.svarogsdream.fixes Fixes MaskPayout false" "give 488" "gold" "call TreasureHuntMask SellMask" "gold"` — 16:26:10 (K1).
- `bash tools/h.sh "gold reset" "cfg krinik.svarogsdream.fixes Fixes MaskPayout true" "give 488" "gold" "call TreasureHuntMask SellMask" "gold" "call TreasureHuntMask SellMask" "gold"` — 16:26:17 (F1, F3).
- `bash tools/h.sh "kill"` — 16:26:25, процесса игры нет.

## 4. Checks

Hygiene: `dotnet build src/KrinikFixes -c Release` и `src/KrinikDevHarness` — 0 ошибок.
Functional run: метод игры `SellMask` вызван пультом в живом мире на сейве владельца; прочитаны золото и флаг до и после, журнал
BepInEx. Вариант разговора «По рукам. (Продать маску)» не нажимался — он зовёт тот же метод.

| # | Status | Observed |
|---|---|---|
| F2 | pass | без маски 1614 → 1614, флаг false |
| K1 | pass | исправление выключено: 1614 → 6614 (+5000) — так платит игра автора |
| F1 | pass | исправление включено: 6614 → 14614 (+8000); журнал «mask payout: +3000 (promised 8000, game paid 5000)» |
| F3 | pass | повторный вызов: 14614 → 14614 |

## 5. Found

Ошибка автора подтверждена в игре: обещано 8000, без мода платится 5000 (K1). Дефектов мода — none.

## 6. Traces

`D:\Games\Svarog's Dream\BepInEx\LogOutput.log` — строка «mask payout», одна за весь прогон; вывод пульта — в разделе Runs.

## 7. Verdict

pass — все четыре случая; путь через кнопку в разговоре не пройден (риск низкий: тот же метод).
