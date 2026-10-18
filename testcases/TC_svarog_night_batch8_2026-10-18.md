# Тест-кейсы — ночь 2026-10-18, пачка 8: цифра перезарядки у E и Q, цифра у ссылки на еду, обратное включение стопки

**Created:** 2026-10-18 · **Under test:** `SvarogsDream/src/KrinikUIRework/HudRow.cs` (цифра по центру коробки — E и Q), `HotbarDrag.cs` (`StartCooldown`:
цифра у ячейки со ссылкой), `MessageStack.cs` (обратное включение стопки).
**Test basis:** суд пачек 6–7 (`scratchpad/judge67/judge67.md`): R2 — после правки цифры смотрели только «1», у Q со ссылкой красная рамка без цифры
(кадр `p8b`); R3 — у M2c не увидено обратное включение. План 31, пункты 19 и 7. Экран, вероятно, заблокирован — события пульта, кадры изнутри игры.
**Dimensions:** ячейка — E (зелье игры) · Q (ссылка на еду); стопка — выкл → вкл. Не покрыто: настоящая мышь.

## Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| A4 | до запуска строка `51 268` в `krinik_hotbar_items.txt`; `SAFE_SPOT="-590,96,1863" bash tools/run-game.sh`; HUD виден (иначе щелчок «Оружие») | setup | pass 2026-10-18 06:43 · строка `51 268` дописана (CRLF); `False -> True` после `waitfor`, телепорт 1580 м, `True -> False`; HUD скрыт (оружие убрано) — щелчок «Оружие» вернул (`KrinikHeroCard=True`) |
| CE | `fieldon Player PlayerStats currentHealth 600` → `click` E → цифра перезарядки по центру коробки E, не на шве Q/E; кадр | use case | pass 2026-10-18 06:44 · здоровье 600 → `click …/Slots/Slot~(8)` → на E «29» по центру коробки, на шве Q/E ничего (лист `c8_sheet.webp`, кадр `ce`) |
| CQ | `give 268` ×2 → на Q «3» → `click` Q → на Q красная рамка И цифра перезарядки по центру коробки Q; кадр | use case | pass 2026-10-18 06:44 · `give 268` ×2 → на Q «3» (`cq0`); `click …/Slots/Slot~(7)` → журнал `hotbar use: cell 51 268-CookedBeans (Food) -> consume`; на Q «2», красная рамка и «29» по центру коробки (`cq1`) — до правки в пачке 6 цифры не было (`p8b`) |
| M2v | `cfg … Hud MessageStack false` → `true` → новая строка `ShowNewCustomMessage After~on` → на нашей бумаге по центру над рядом, журнал `adopted` | control | pass 2026-10-18 06:44 · `MessageStack false` → `true` → `ShowNewCustomMessage After~on` → журнал `'After~on' adopted, live 1`; кадр `m2v_crop.webp`: строка на нашей бумаге по центру над рядом (на том же кадре цифры на Q «27» и E «25» — по центру) |
| S1 | после прогона: `isGodMode False`, `h.sh "kill"` → `cfg run diff: 0 changed`; журнал — копией; сейвы — откат к точке; `reg-snap.sh restore` | control | pass 2026-10-18 06:45 · `isGodMode False -> False`; `h.sh "kill"` → `cfg run diff: 0 changed`; журнал — `_harness/log_batch8.log`; сейвы — откат к точке (8 из 8); `reg-snap.sh restore`; замок FREE |
