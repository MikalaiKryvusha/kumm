# Test cases — Conan: sprint with the bow drawn (KrinikConanLocomotion · krinik_bow_sprint)

> **Created:** 2026-11-10 · **Parent:** `games/ConanExiles/mods/KrinikConanLocomotion.md` «Sprint + bow»; the owner 2026-11-10 19:03 / 19:09
> **Status:** cases written 2026-11-10 19:31 +03:00 · **Outbound:** —

**Basis.** `[OWNER]` 2026-11-07 20:50 «Спринт и стрельбу делаем возможными одновременно» · 2026-11-10 19:09 «Спринт с луком делаем». Expected: with the bow
drawn and Shift + W held the hero sprints (substate 7, MaxWalkSpeed = the hero's sprint speed, 735 at Agility 26) and can shoot on the run; the game's own
limits stay (forward only, stamina, exhausted hero).

**Stand.** The owner's save (the oasis camp, god on by `god-on.sh`, bow `BP_bow_2h_C` in hand on `Socket_Bow`), the game on the background path, real input by
`mouse-seq.ps1` (it brings the game forward and gives the window back) only while `owner-idle.ps1` says FREE; stamina refilled by the remote
(`AdjustStaminaCurrent(1000.0)`) before each case; sampler `ConanExiles/_config/sprint-bow-sample.lua` (game-thread chain, 150–300 ms steps).
Dimensions: draw on/off × sprint key on/off × direction forward/sideways × shot on/off; left out: gamepad, mounted, overloaded hero, swimming.

| Case | Steps (real input) | Expected | Status |
|---|---|---|---|
| S0 control — no draw | W + LShift 2.8 s | sub 7, max 735 | pass (build 1 19:33, build 3 19:56) |
| S1 draw + sprint | RMB held, then W + LShift 2.8 s | sub 7 with 15 / 16, max 735; log «тип движения — спринт» | pass builds 1–2; build 3 owed |
| S1b **sprint FIRST, then draw** (the owner's order, his play 2026-11-10 19:5x–20:4x: «в момент натяжения, когда выполняется приближение камеры - спринт прерывается», 2026-11-13 09:14) | W + LShift 1.5 s, then RMB held 2 s (keys kept), LMB, 1 s more | sub 7 kept through the draw (15 / 16), max 735 all along; the shot fires; the sprint goes on after it; sampler: `try` (bTrySprint) and `key` (SprintKeyIsDown) read every 100 ms | FAIL by the owner; his session log: «разрешений 0» every minute 19:52–20:36, then «разрешений 106» 20:39:33 and «148» 20:40:33 with «тип движения — спринт» (lines read by judge round 2 before the 09:23 launch overwrote the log) — the sprint engaged in some of his tries, not in this order; added 2026-11-13 09:22 |
| S2 shot on the run | RMB, W + LShift 1.8 s, LMB | Archery log «из лука»; the sprint goes on after the shot | pass builds 1–2 (19:33:50, 19:44:36); build 3 owed |
| S3 draw + walk (no Shift) | RMB held, W 2 s | max 214 (the game's aim speed) — unchanged | pass build 1; build 3 owed |
| S4 draw + sprint sideways | RMB held, D + LShift 2 s | no sprint, no sub 7 (the Sprint row's 0…65° window): max 214 | fail build 1 (428) → fixed; build 3 owed |
| S4b draw + sprint diagonal | RMB held, W + D + LShift 2 s | sprint (46° is inside the window; vanilla sprints diagonally too) | pass build 2 |
| S6 draw + Shift standing | RMB held, LShift 2 s, no W | no sub 7, no stamina drain beyond the draw (judge round 1, finding 1) | build 3 owed |
| S7 crosshair on the run | S1 with a frame | the aim crosshair and spread as when walking with the draw (judge finding 7) | owed |
| S5 control — section off | `krinik_bow_sprint` out of SECTIONS (or remote: the same input without the mod in an earlier run) | max 214, no sub 7 | pass 19:2x (live remote, before the section existed) |
| C1 cost | the section's minute line | sum well under 1 ms a minute of gameplay | |
