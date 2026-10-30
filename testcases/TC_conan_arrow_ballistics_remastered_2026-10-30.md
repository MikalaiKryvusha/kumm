# TC — arrow ballistics as in Oblivion Remastered (KrinikConanArchery 0.5.0)

> **Created:** 2026-10-30 · **Parent:** plan 36 W15; `[OWNER]` «баллистика стрел Oblivion Remastered с повышенным минимумом минимальной скорости
> скорости» · 2026-10-30 08:33; numbers — `researches/conan-archery/README.md`
> **Status:** 2026-10-30 09:18–09:24 — BLOCKED: three real-input attempts fired no arrow (LMB, LMB×2, slot 6 + LMB, RMB held 2.3 s); RMB reaches the game (the mod logged the crosshair creation) and Tab opens the hub, but no draw notification and no shot. Suspects: the F1 cursor mode of Simple Minimap («F1» in the HUD corner) eating clicks, or the bow not loaded. 09:26 — the F1 hypothesis REFUTED (F1 pressed, then LMB and RMB+LMB: still no shot). Next: research the stand, not retries — compare with the 2026-10-29 run that fired 240 shots (`TC_conan_rapid_fire_no_crash_2026-10-29.md`: beach, god mode, first person by the real wheel), read the hero state by the remote (equipped weapon, ammo), then B1–B5. 09:28–09:31 — third launch: the remote fire call (`InpActEvt_PrimaryActionV2_K2Node_InputActionEvent_9`) returned ok but no arrow; a 4K crop showed the bow SLUNG on the back (my key 1 of the first launch put it away, the save kept it so); after key 1 the next remote call failed and the game had gone back to the main menu (`ConanSandbox.log` 06:31:16 UTC: «Force closing message box type Disconnecting», `LoadMap /Game/Maps/Startup`) — cause not found. Next session: stand research first (the 2026-10-29 recipe: god mode, `exec MakeMeAdmin` + `SpawnItem 51405`/`53612`, bow drawn checked by a crop BEFORE firing; why the session disconnected).
> **Outbound:** the minimum speed share (0.4 / 0.5 / 0.6) — the owner's eye

**Goal (Achieve).** The draw sets the arrow's SPEED at a constant gravity 0.55 (Remastered `ArrowGravityScale`); an instant shot flies at
`min_speed_share` of the bow's speed (0.5 now), a full draw at 1.0. Expected drop at eye level, from `0.5 × 980 × 0.55 × (d / v)²`:
full draw (≈5000 cm/s) — 11 cm at 10 m, 43 cm at 20 m; instant (≈2500 cm/s) — 43 cm at 10 m, 1.7 m at 20 m.

**Stand.** The owner's save, the hero in the oasis where the save stands (no enemies seen on the last frames), the bow in slot 1, arrows in the
quick bar; target — a rock or a wall at 10–30 m under the crosshair; shots by REAL input (`mouse-seq.ps1` / `input.ps1`); the game in front.
The mod's log line per shot gives charge, probe distance, speed before → after, gravity before → after, a re-read at +0.3 s, and where the arrow
stuck against the probe point («вверх …» = the drop). Techniques: partitions (instant / full draw), boundary (charge 0 and 1), control (the
same shots with `ballistics` false — the old flight).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| B1 | Instant shot | LMB without RMB at a rock 10–20 m | log: charge 0.00, speed → ≈ 0.5 × before, gravity → 0.55; +0.3 s: gravity still 0.55 | not run — the stand fired no arrow (see Status); next session, after the stand research |
| B2 | Full draw | RMB held ≥ 2 s, then LMB, same rock | log: charge ≈1.00, speed unchanged, gravity 0.55; +0.3 s: still 0.55 | not run — the stand fired no arrow (see Status); next session, after the stand research |
| B3 | Drop | B1 and B2 landing lines | drop close to the formula above (±30 %) — instant clearly lower than full draw | not run — the stand fired no arrow (see Status); next session, after the stand research |
| B4 | Game does not override | +0.3 s re-read in B1/B2 | gravity 0.55 (not 1.2/0.12, not a curve value) | not run — the stand fired no arrow (see Status); next session, after the stand research |
| B5 | No crash / no errors | the whole run | no crash; no Lua error lines of the mod | not run — the stand fired no arrow (see Status); next session, after the stand research |
