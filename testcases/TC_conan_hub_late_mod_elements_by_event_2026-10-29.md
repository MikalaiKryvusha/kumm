# TC — the EAA emblem, «Аксессуары» and the Era of Trials magic icons come with the «Снаряжение» tab (bug 64 items 17, 26)

> **Created:** 2026-10-29 · **Parent:** bug 64 item 17 (`[OWNER]` «вот что обвел с задержкой появляется на экране, а не сразу при его открытии» ·
> 2026-10-29 17:5x, his frame: the EoT icons right of the hero, «Аксессуары», the sword emblem with the green gem)
> **Status:** run 2026-10-29 18:13–18:37 — I1–I7 pass (KrinikPauseGameInMenu 0.9.1, EAA KRINIK MODIFIED with the Accessory System delay, EoT KRINIK MODIFIED)
> **Outbound:** —

**Basis.** Probes 17:55–18:06: EAA waits `Delay 1.0`, EoT `Delay 0.1` in GAME time after `CharacterInventory.SignalActivated`, which comes ≈50 ms
before the hub re-creates the hero display; the hub runs at time dilation 0.03 (our pause mod) — EAA ≈33 s, EoT up to 3.3 s. Fix: both delays → 1e9
(KRINIK MODIFIED), `KrinikPauseGameInMenu` 0.9.0 calls their resume points (EAA 286, EoT 15) on the birth of `W_UICharacterDisplay_C` while on
«Снаряжение».

**Stand.** The owner's save, the hero in the world, 4K; the hub opened by the remote (`ActivateModule CharacterInventory`); tabs switched by the remote
(`CarouselWindow` Next/Prev — the same native calls as E/Q); a `NotifyOnNewObject` probe on the EAA widget, the EoT icons and the display (log
timestamps); frame bursts `capture-burst.ps1` (≈7 fps) on the returns. Techniques: state transitions (hub closed → open on «Снаряжение»; «Снаряжение»
→ «Таланты» → back; «Снаряжение» → «Хар-ки» → back), control — the probe timings of 17:56 before the fix (dilation 0.03: EAA not born in 6 s,
EoT +0.8 s).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| I1 | Hub open on «Снаряжение» | open the hub by the remote; probe; burst | EAA widget and EoT icons born ≤ 1 frame after the display; first full frame of the tab shows the emblem, «Аксессуары», the icons | pass 18:34 (0.9.1, the pause armed first): `XCS_Panel` 29.205 with «меню открыто: замедление» in the same event → display 29.229 → EAA widget 29.277, EoT icons 29.278, «Аксессуары» (ACS) 29.283; burst frame +697 ms: emblem, gem green, «Аксессуары», icons. Two earlier attempts failed and led to fixes: 18:26 (0.9.0) — ACS born 6.6 s late, the Highmane's copy had been patched, the game loads the EAA copy; 18:33 — no ACS at all: the hub opened 1 s after the world load, before the pause armed (stand defect), and at time 1.0 the 0.0015 delay fires before the display — 0.9.1 engages the pause on the tab event |
| I2 | Return from «Таланты» | Next, 2 s, Prev; probe; burst | same as I1 | pass 18:34:36: Prev 36.800 → display 36.883 → EAA 36.961, EoT 36.963, ACS 36.968; burst frame +562 ms (first frame of the tab): all elements in place |
| I3 | Five returns in a row | Next/Prev × 5 | exactly one EAA widget and one EoT icon set born per return (no duplicates growing) | pass 18:34:36–18:35:02: 6 returns — display, EAA widget, EoT icons, ACS button born exactly once each per return (12 probe lines each, probes registered twice) |
| I4 | No late duplicates | wait 40 s on «Снаряжение» after I3 | no EAA widget / EoT icons born by the old delays | pass 18:35:03–18:35:37: no birth of any of the four after the last return (34 s, not 40 — the game was needed for I5–I6) |
| I5 | Other tabs keep their EoT | «Хар-ки» tab frame | the stats window looks as before (its EoT path not touched) | pass 18:36: «Хар-ки» frame — the stats tab has no hero display, nothing changed; found by the way: the perk descriptions on the right overlap («Берсерк» / «Кровожадный берсерк») — bug 64, new item |
| I6 | The buttons work | remote call of the «Аксессуары» (`W_acs_InventoryButton`) and `Button_Axe` click handlers (or `funcs`) | the accessories window / the EAA menu opens | pass 18:35–18:36: «Аксессуары» click (remote `BndEvt…acsButton…`) → module `acs_WardrobeGUI`, frame «Гардероб — Экипировка»; emblem click (`BndEvt…Button_Axe…`) → frame «Enhanced Armory & Arsenal: меню» (the menu stays over the world after the hub closes — its own ✕; vanilla behaviour of the mod) |
| I7 | No errors | `UE4SS.log` grep `KrinikPauseGameInMenu`, «упал», «НЕ встала»; `ConanSandbox.log` grep EraOfTrials / EnhancedArmory errors | none; «вставки EAA 1, EoT 1» on each return | pass: `UE4SS.log` — no «упал» / «НЕ встала» of the pause mod; «вставки EAA 1 (индикатор 1), EoT 1 (4–5 мс)» on every birth; `ConanSandbox.log` — 0 error lines for EnhancedArmory / EraOfTrials / AccessorySystem; one crash in the recon (18:19, the remote call of ACS 61 — EXP-0371), not in the shipped path |
