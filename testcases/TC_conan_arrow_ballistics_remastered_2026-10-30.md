# TC — arrow ballistics as in Oblivion Remastered (KrinikConanArchery 0.5.0)

> **Created:** 2026-10-30 · **Parent:** plan 36 W15; `[OWNER]` «баллистика стрел Oblivion Remastered с повышенным минимумом минимальной скорости
> скорости» · 2026-10-30 08:33; numbers — `researches/conan-archery/README.md`
> **Status:** run 2026-10-30 09:38–09:43 (after the owner: «так ты в руки лук возьми!!!» — my first four launches fired with the bow slung on the back; I had also wrongly read a crop as «in hand»). Speed by the draw WORKS; the game REWRITES gravity every tick (0.55 set, back to 1.20 / 0.12 at +0.3 s even with re-sets at 40 and 150 ms). Next: recon of the arrow blueprint’s per-tick gravity (charge → curve `FC_BowProjectileGravCurve_*`) and a native edit in our pak.
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
| B1 | Instant shot | LMB without RMB at a rock 10–20 m | log: charge 0.00, speed → ≈ 0.5 × before, gravity → 0.55; +0.3 s: gravity still 0.55 | pass for the speed — 5000 → 2500 cm/s at charge 0.00 (log #1, 09:40 and 09:44) |
| B2 | Full draw | RMB held ≥ 2 s, then LMB, same rock | log: charge ≈1.00, speed unchanged, gravity 0.55; +0.3 s: still 0.55 | pass for the speed — 5001 → 5001 at charge 1.00 |
| B3 | Drop | B1 and B2 landing lines | drop close to the formula above (±30 %) — instant clearly lower than full draw | fail — the drop is the GAME’s: instant landed 22.6 m short of a 31.6 m point (gravity 1.20), full draw 4.7 m short |
| B4 | Game does not override | +0.3 s re-read in B1/B2 | gravity 0.55 (not 1.2/0.12, not a curve value) | fail — gravity at +0.3 s and +0.6 s back to 1.20 (charge 0) / 0.12 (charge 1) despite re-sets at 40 and 150 ms: the blueprint sets it every tick |
| B5 | No crash / no errors | the whole run | no crash; no Lua error lines of the mod | pass — no crash, no mod error lines over 4 shots |
