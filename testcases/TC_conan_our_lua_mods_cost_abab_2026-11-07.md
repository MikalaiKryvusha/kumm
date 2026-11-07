# Test cases — Conan: what our Lua mods cost per frame (A-B-A-B flights)

**Created:** 2026-11-07 · **Under test:** our Lua mods of the build (KrinikConanUI, Camera, Archery, Gameplay, Music, Graphics, ModPackManager) ·
**Version/build:** Conan 3.0.1 build, pack `42fc264`
**Test basis:** the build's acceptance criterion 3 (`MASTER_PLAN.md`: «our Lua mods no more than 1 ms in the worst frame»; HOUSE_RULES rule 7); the next step
named by `testcases/reports/2026-11-06_conan-build-vs-vanilla-paks-abab.md` («split the cost … by our Lua mods»).

## 1. Goal vector

Maintain: our Lua mods together cost ≤ 1 ms of CPU per frame in gameplay. Measure the build with and without them on the same world and route.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | Our Lua mods together shall cost ≤ 1 ms of CPU per frame on the reference flight | Scale: median CPU ms per frame · Meter: `bench-flight.sh krinik-show` (the bench) over A-B-A-B · Target: A − B ≤ 1.0 ms, within B's spread |

## 3. Stand

Background game (`launch-bg.ps1 -HoldSec 0`), world by `enter-world-remote.sh`, 30 s settle; batch `bench-batches/q5-build.txt` (warm-up + 2 flights) per
launch; A — the build as is; B — the same with our Lua mods' `enabled.txt` renamed to `enabled.txt.off` (`KrinikAgentRemote` and `KrinikConanBench` stay on — the
stand needs them); restored on any exit (`trap`).

## 4. Cases

| # | Case | Steps | Expected | Status · observation |
|---|---|---|---|---|
| C1 | A-B-A-B over 4 launches | the script `ours_abab.sh` in the session scratchpad | 4 launches × 3 flights, no «⚠ Undermesh» flag | pass (07:51–08:49; the 4th launch redone at 08:36 after a hung exit) — report `2026-11-07_conan-our-lua-mods-cost-abab.md` |
| C2 | the cost | median CPU ms of A flights minus B flights | ≤ 1.0 ms | pass — A 14.64 vs B 14.70 ms (−0.06), inside A's spread 0.75 |
