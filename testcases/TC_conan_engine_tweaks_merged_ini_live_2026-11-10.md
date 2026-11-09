# TC — Conan: the merged Engine.ini (KrinikConanEngineTweaks part merged by KUMM) is read by the running game

> **Created:** 2026-11-10 · **Parent:** `testcases/reports/2026-11-10_engine-ini-mod-parts-merge.md` · **Status:** ✅ 4/4 pass, run from 02:31 to 02:33

Stand: the working game `D:\Games\Conan Exiles 3.0.1`, Engine.ini written by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanEngineTweaks -WithEngineIni` 2026-11-10 02:26;
background launch (`launch-bg.ps1`), world entry by the remote (`enter-world-remote.sh`), machine lock held; no input, no measurement.

| Case | Action | Expected | Status | Observed |
|---|---|---|---|---|
| E1 | `pult.sh` reads `RecastNavMesh.bDoFullyAsyncNavDataGathering` | true | pass | `async gathering=true` (02:33, world loaded in 24 s) |
| E2 | the game log after the launch | `Set CVar [[niagara.CreateShadersOnLoad:1]]` | pass | `LogConfig: Set CVar [[niagara.CreateShadersOnLoad:1]]` (log 02:32) |
| E3 | the game log after the launch | `p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce` set to 100000 | pass | `LogConfig: Set CVar [[p.Chaos.AccelerationStructureTimeSlicingMaxQueueSizeBeforeForce:100000]]` |
| E4 | `Deploy-ModPack.ps1 -Verify` after the game closed (the game rewrites Engine.ini on exit) | «Engine.ini part of KrinikConanEngineTweaks in place» | pass | the file rewritten by the game (6544 bytes, comments gone) — the part in place, «Verify clean» |
