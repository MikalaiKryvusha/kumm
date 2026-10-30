# Run report — Conan: arrow gravity held constant (KrinikConanArchery 0.6.0)

**Work.** KrinikConanArchery 0.6.0 — the per-tick gravity rewrite of `BP_BaseProjectile` removed by dropping the arrow's `ProjectileGravityCurve`
at launch; basis — `testcases/TC_conan_arrow_ballistics_remastered_2026-10-30.md`, cases B6–B9; the owner's decision on Remastered ballistics
(plan 36 W15, 2026-10-30 08:33).

**Contour.** Conan Exiles 3.0.1 (`D:\Games\Conan Exiles 3.0.1`), UE4SS, the build's 64 paks + Lua mods; mod `main.lua` deployed by copy at 10:41;
the owner's save in the oasis; the bow in slot 1 held in front (checked by eye, frame s1); god mode on for the run (intended by `exec God`, which does nothing in 3.0.1 — the hero was mortal; EXP-0381); a hostile boss (taken for a companion at the time) moved 15 m
behind the hero before the pillar shots (interference removed); the game in the foreground; machine lock taken 10:41:48, released after.

**Runs.**
- 10:41:48 launch — `Start-Process …\ConanSandbox-Win64-Shipping.exe`, `enter-world-focused.ps1` (in the world after 30 s).
- 10:43:29 — `mouse-seq.ps1 -Seq "lclick,wait:2500,rdown,wait:2500,lclick,wait:1200,rup,wait:1500"` (shots #1 instant, #2 full draw, at the ground ahead).
- 10:44:50 — the same sequence after `pult.sh 'lua … SetControlRotation …'` toward the bridge pillar (shots #3, #4).
- 10:45 — `pult.sh "exec God"` (off), `close-game.ps1` (closed cleanly in 6.7 s).

**Checks.**
- Hygiene: none beyond the run (the mod is Lua, loaded by the game).
- Functional run: four real shots by SendInput on the live build; read — the mod's log lines per shot (`UE4SS.log`), frames s1–s4 of the stand.
- B6 pass — «кривая гравитации FC_BowProjectileGravCurve_15m → снята» on 4 of 4 shots, no error lines.
- B7 pass — gravity 0.55 at +0.3 s and +0.6 s on all shots; speed 2499–2530 cm/s at charge 0.00, 4998–5018 at charge 1.00.
- B8 pass by time of flight — impacts on the ground (the pillar shots passed through the gap above it): 1.18 s instant, 1.60 s full draw from
  ≈1.5 m at pitch +3° → effective gravity ≈0.45 for both draws (vanilla: 1.2 vs 0.12).
- B9 pass by the 0.5.0 run 09:38–09:44 (same code without the curve drop): gravity back to 1.20 / 0.12 at +0.3 s.

**Found.** none (the mod); a stand note — the oasis boss (hostile, not a thrall) walks into the line of fire; kill it by the remote first.

**Traces.** `D:\Games\Conan Exiles 3.0.1\ConanSandbox\Binaries\Win64\ue4ss\UE4SS.log` lines `[KrinikConanArchery] #1…#4` (10:43:29–10:44:56);
frames `D:\Temp\claude\d--work-ai-sandbox-KUMM\77faa752-1410-4183-9ee5-b174918b40dc\scratchpad\w15\s1–s4.jpg` (scratch, not kept); bytecode trace of
`ExecuteUbergraph_BP_BaseProjectile` — recorded in `researches/conan-archery/README.md`.

**Verdict.** pass — gravity stays 0.55 whatever the draw; the draw sets the speed. Open for the owner's eye: the minimum speed share (0.4 / 0.5 / 0.6)
and the feel of the arc.
