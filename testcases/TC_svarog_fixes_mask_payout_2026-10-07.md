# Test cases — Svarog's Dream: KrinikFixes, выплата за маску-клад

**Created:** 2026-10-07 16:24 +03:00 — до первого прогона · **Under test:** `KrinikFixes` 1.0.0 (`src/KrinikFixes/Plugin.cs`,
патч `MaskPayoutPatch` на `TreasureHuntMask.SellMask`) и команды пульта `give`, `gold` (`KrinikDevHarness`) · **Version/build:**
SvarogsDream `014dcd0` + новый мод
**Test basis:** `[OWNER]` «и у нас поправь» · 2026-10-07 (о выплате за маску); текст торговца: «I'll buy the artifact from ya for a
sweet 8000 coins», «8000 coins.»; код автора: `SellMask` — `RemoveItemFromInventory(488)` → `AddGold(5000)`,
`isDemonMaskSold = true` (декомпиляция ilspycmd, 2026-10-07).

## 1. Goal vector

Achieve: продав маску торговцу, герой получает обещанные 8000 монет, а не 5000; без маски и при повторном вызове лишних денег нет.

## 2. Requirements under test

| # | Requirement (EARS) | Fit criterion |
|---|---|---|
| R1 | WHEN игра продаёт маску (`SellMask` снял маску и поставил флаг), the mod shall доплатить 3000 монет | `gold` до и после: +8000 |
| R2 | IF маски в сумке нет, THEN the mod shall не платить ничего | `gold` до и после: +0, флаг false |
| R3 | IF маска уже продана (флаг true), THEN the mod shall не платить повторно | второй вызов: +0 |
| R4 | WHERE настройка `Fixes.MaskPayout` выключена, the game shall платить свои 5000 | контрольный K1 |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered (risk named) |
|---|---|---|
| Наличие маски | есть · нет | — |
| Флаг продажи до вызова | false · true | — |
| Настройка | вкл · выкл | — |
| Путь вызова | `call TreasureHuntMask SellMask` (метод игры напрямую) | вариант «По рукам. (Продать маску)» в разговоре — тот же метод через Fluent; риск низкий, патч висит на методе |

## 4. Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| F2 | маски нет, флаг false: `gold` → `call TreasureHuntMask SellMask` → `gold` — золото то же, флаг false | граница: нет предмета | pass · 2026-10-07 16:26 · `gold 1614 maskSold=False` до и после |
| K1 | `cfg krinik.svarogsdream.fixes Fixes MaskPayout false` → `give 488` → `gold` → `call TreasureHuntMask SellMask` → `gold` — +5000, флаг true | контроль: исправление выключено | pass · 16:26 · 1614 → 6614 (+5000), `maskSold=True`: ошибка автора видна в игре |
| F1 | `gold reset` → `cfg … MaskPayout true` → `give 488` → `gold` → `call TreasureHuntMask SellMask` → `gold` — +8000, флаг true, в журнале «mask payout: +3000» | основной путь | pass · 16:26 · 6614 → 14614 (+8000); журнал: «mask payout: +3000 (promised 8000, game paid 5000)» — одна строка за весь прогон |
| F3 | сразу после F1 второй `call TreasureHuntMask SellMask` → `gold` — +0 | повтор: флаг уже true | pass · 16:26 · 14614 → 14614 |

Прогон — на сейве владельца без записи: игра закрывается командой пульта `kill` (run-game.sh), «Продолжить» не сохраняет.
