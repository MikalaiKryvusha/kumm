# Тест-кейсы — ночь 2026-10-18, пачка 7: значок строки на бумаге стопки, сборка без цикла сеток, пауза проверки покоя

**Created:** 2026-10-18 · **Under test:** `SvarogsDream/src/KrinikUIRework/MessageStack.cs` (`Icon`, бумага по тексту и значку), `TooltipFit.cs`
(сборка без цикла «сетки до раскладки»), `tools/deploy-hot.sh` (пауза 3 с перед `rest-check.sh`).
**Test basis:** план 31, пункт 7 (рулбук §10 п. 3 «всё ли прилеплено»; кейс M2 пачки 6 — значок отдельно от плашки); кейс T7a пачки 6; находка пачки 6
про ложную тревогу проверки покоя. Экран, вероятно, заблокирован — события пульта и кадры изнутри игры (EXP-0314).
**Dimensions:** строка — с картинкой · простая; стопка — вкл · выкл; выкладка — холодная · горячая. Не покрыто: настоящая мышь (T8 пачки 5).

## Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| A3 | `SAFE_SPOT="-590,96,1863" bash tools/run-game.sh` → бессмертие после `waitfor`, телепорт, снято; HUD виден (иначе щелчок «Оружие») | setup | pass 2026-10-18 06:18 · `False -> True` после `waitfor`, телепорт 1580 м, `True -> False`; HUD скрыт (`isEquiped False`) — щелчок `ActionBarEnabler` вернул (`KrinikHeroCard=True`) |
| M2r | `callon UI/ActionBar/InfoMessages GameUI.UIInfoMessages ShowNewCustomMessageWithImage New~Virtue Fight` → текст и значок на одной бумаге, по центру над рядом; кадр | use case | pass 2026-10-18 06:19 · «New~Virtue» и значок «Fight» на одной бумаге, по центру над рядом (лист `m2_sheet.webp`, кадр `m2r`); журнал `'New~Virtue' adopted, live 1` |
| M2s | следом простая строка `ShowNewCustomMessage Fast~travel` → бумага по тексту, как раньше (регресс) | equivalence | pass 2026-10-18 06:19 · «Fast~travel» под ней, бумага по тексту (кадр `m2s`), журнал `live 2` |
| M2c | контроль: `cfg … Hud MessageStack false` → новая строка с картинкой на месте игры, без нашей бумаги; `true` — обратно | control | partial 2026-10-18 06:19 (поправка по суду: половина «`true` — обратно» не наблюдалась — после включения новой строки не было) · `MessageStack false` → журнал `message stack: restored`; «Talent~developed» (значок на конце полосы игры) и «Fast~travel» — на месте игры слева, без нашей бумаги (кадр `m2c_s.webp`); `true` — выставлено, новая строка не вызывалась; обратное включение проверено в пачке 8 (M2v, pass) |
| T7b | `hover` «1» → E → «6» (после `AssignSpell 12 4`, `17 5`) → журнал: сдвиги `above cell …` при `alpha 0,00`, карточки на местах (кадр E) | state transition | pass 2026-10-18 06:20 · сборка без цикла сеток; журнал: «1» — `moved 1317,-18 … alpha 0,00`, `moved -54,-55 … alpha 0,00`; E — `moved 776,-162`, `moved 436,0`, оба `alpha 0,00`; «6» — `moved 1212,-127`, `moved 0,-34`, оба `alpha 0,00`; кадр `t7be_crop.webp`: «Малое Зелье Исцеления» над E, левый край по рамке |
| R1 | `bash tools/deploy-hot.sh KrinikUIRework` той же сборки → строка проверки покоя зелёная (UI ≤ 40) — пауза 3 с действует | control | pass 2026-10-18 06:20 · `deploy-hot.sh` → `RELOADED`, `rest check: ui moved 16 per frame (limit 40)` — после паузы зелёная (без паузы в пачках 5–6 трижды 103–112) |
| S1 | после прогона: `isGodMode False`, `h.sh "kill"` → `cfg run diff: 0 changed`; журнал — копией; сейвы — откат к точке; `reg-snap.sh restore` | control | pass 2026-10-18 06:21 · `isGodMode False -> False`; `h.sh "kill"` → `cfg run diff: 0 changed`; журнал — `_harness/log_batch7.log`; сейвы — откат к точке (8 из 8); `reg-snap.sh restore`; замок FREE |
