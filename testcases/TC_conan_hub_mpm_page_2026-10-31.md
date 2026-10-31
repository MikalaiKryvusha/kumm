# TC — plan 38 step 6: the «Размер HUD вверху экрана» row (KrinikConanModPackManager reads the window's store)

> **Created:** 2026-10-31 · **Parent:** `plans/38_epic38_phase2_krinik_hub_window.md` step 6 («Left: ModPackManager»)
> **Status:** written 2026-10-31 22:36 +03:00; run 22:37–22:41 (M1–M5 pass)
> **Outbound:** —

**Goal (Achieve).** The window's HUD-size row changes the scale of Hosav's top HUD block at once after «Сохранить» (on the next game-window close) and
after a restart; with no key in the store the mod keeps its own `config.lua` value (1.25).

**Stand.** As `TC_conan_hub_camera_page_2026-10-31.md`; the owner's live `KrinikConanModPackManager/config.lua` copied before the deploy and put back
byte-equal; the store file removed before and after the run.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| M1 | Load without a key | world entry | log `масштаб HUD x1.25 (config.lua, загрузка)`; the HUD block scale 1.25 (remote read of the live `W_SmoothHP_C` `RenderTransform.Scale.X`) | pass 22:37 — the log line as expected; live scales `1.25 1.25` |
| M2 | The page is live | the window opened, «KrinikConanModPackManager» clicked by the real mouse | one row «Размер HUD вверху экрана» showing 125, hint «в процентах» | pass 22:38 — `page mpm`; one row, 125, «в процентах» (crop m2c); the long name slides in the list (frame m0) |
| M3 | A save applies at once | slider to 150 by the remote, real «Сохранить и закрыть», the inventory closed | the store `mpm_hud_scale = 1.5`; log `масштаб HUD x1.50 (окно «Моды Krinik'а», номер …)`; the live scale 1.5; a frame of the top HUD | pass 22:38 — store `["mpm_hud_scale"] = 1.5`, the log line at the inventory close, live `1.50 1.50`, the top HUD visibly larger (crop m3_hud) |
| M4 | Survives a restart | the game restarted, world entry | log `x1.50 (окно «Моды Krinik'а», загрузка)`; scale 1.5 | pass 22:40 — as expected, live `1.50 1.50` |
| M5 | The default deletes the key | the window: «Сбросить к исходным», «Сохранить и закрыть», inventory closed | no `mpm_hud_scale` in the store; scale back 1.25 | pass 22:41 — `page mpm reset to defaults`, `store written: 0 keys, 1 changed`, `x1.25 (config.lua, номер …)`, the store `return { }`, live `1.25 1.25` |
