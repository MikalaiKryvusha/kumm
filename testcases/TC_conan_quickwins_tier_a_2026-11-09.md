# TC — Conan: quick wins of tier A (stutter without a look change) — shaders on load, upload-page retention

> **Created:** 2026-11-09 · **Parent:** `researches/ue5-guru-tweaks-2026-11/README.md` §2.1 and §4; STATUS → "Where to continue", FIRST next chat (the owner's word
> «в новом продолжим делать Квик Вины по сборке», verbatim in STATUS)
> **Status:** 🟡 written 2026-11-09 18:52 +03:00, waiting for the machine (KCCP lock to 19:45)
> **Outbound:** the before/after numbers → the owner (chat); a line into `_unpacked/KrinikConanGraphics/Engine.ini` only with numbers and his word

## 1. Goal vector

Avoid: the hitches a player meets the first time something is drawn in a session (effects of the first fight, first sight of a material), and the stalls of freeing
and re-creating GPU upload pages, with no change to the picture. Stutter first, average FPS second (`[OWNER]` 2026-11-09 16:50 «ещё бы фризы уменьшить - было бы суппер»).

Acceptance (per candidate):
- Scale: frames ≥ 50 ms per cold `krinik-show` flight (whole flight and its first 60 s), worst frame ms · Meter: `bench-flight.sh` → `bench-report.py` (PresentMon) ·
  Target: B below A on BOTH pairs by more than the pair's own spread (A1 vs A2). A gain inside the spread is «not seen» — and is NOT shipped.
- Cost read per launch: time from launch to «in world», game working set (GB), VRAM used (MB) after the flight. A cost the owner has not accepted blocks the ship.
- Look: none expected for A1–A3; A4/A5 checked by eye (torches carried by NPCs, weapon trails).

## 2. Stand

- Machine: the lock `kumm` (`machine-lock.mjs take`), KCCP asked «no builds / downloads / GUI windows» (HOUSE_RULES 11.6c); `owner-idle.ps1` FREE before a front launch.
- Game `D:\Games\Conan Exiles 3.0.1` with the build, BACKGROUND path (`launch-bg.ps1 -HoldSec 0` → `no-power-throttle.ps1` → `enter-world-remote.sh`); a background
  flight is compared only with background flights (EXP-0491, EXP-0494).
- The ini line goes in before the launch: `python _config/ini-temp.py add <game>/ConanSandbox/Saved/Config/Windows/Engine.ini <tag> <name=value>` and comes back with
  `ini-temp.py revert` after `close-game.ps1` (the game rewrites the file on exit — a refused revert is read before the next launch).
- The value is confirmed in `ConanSandbox.log` (`LogConfig: Set CVar [[name:value]]`) or by `exec <name>` through the remote before the launch's numbers count.
- Per launch: enter world → 30 s settle (the bench holds the first point 30 s) → ONE cold `krinik-show` flight → numbers → `close-game.ps1` (a «STILL RUNNING» close →
  `Stop-Process -Id <own PID>`, bench README trap).
- Interference: stand keeper OFF (no kill passes in a measurement, HOUSE_RULES 11.6b); weather stopped + frozen before the flight.

## 3. Cases

| # | Case | Expected | Status |
|---|---|---|---|
| S0 | the four candidate names absent from the pack's ini and our configs (`grep -ri` over `ConanExiles/`) | no hit outside the registry dumps | pass 18:5x — only `cvars-from-binary-2026-09-08.txt` lists `r.CreateShadersOnLoad`, `r.RenderTargetPoolMin` |
| S1 | `ini-temp.py add` then `revert` on the game's Engine.ini with the game closed | the file comes back byte-equal (sha256 before = after) | pass 18:52 — the line landed under `[SystemSettings]` (file line 99), revert: sha256 `0C74F450…CB49A` before = after, the `.bak-s1test` copy gone |
| A1-L1 | launch A (no line), cold flight | numbers recorded | pass 19:08 — 58.3 FPS, 59 hitches (17 in the first 60 s), worst 140.1 ms; RAM/VRAM not read (gap) |
| A1-L2 | launch B `niagara.CreateShadersOnLoad=1`, log shows `Set CVar [[niagara.CreateShadersOnLoad:1]]`, cold flight | numbers recorded | — |
| A1-L3 | launch A again | the A spread = \|L1 − L3\| | — |
| A1-L4 | launch B again | B below A on both pairs beyond the spread, or «not seen» | pass 19:3x — plus a reversed pair L5 B / L6 A (the hitch count fell launch by launch): A 59 · 47 · 49 vs B 48 · 28 · 31, −31 %; FPS / RAM / VRAM same; worst frame not better; report `testcases/reports/2026-11-09_conan-quickwins-shaders-on-load.md` |
| A2-L5…L8 | the same four launches for `r.CreateShadersOnLoad=1` (on top of A1 only if A1 shipped) | same | — |
| A3 | `d3d12.FastAllocator.MinPagesToRetain` 5 → 32 live by `exec` on WARM flights A-B-A-B in one launch (a batch file in `bench-batches/`); if `exec` does not take it live — an ini launch pair | hitches ≥ 50 ms and the worst frame | — |
| A4/A5 | `FX.BatchAsync=1`, then `FX.EarlyScheduleAsync=1` live, median `MsCPUBusy` in a busy camp at night | blocked: first find whether Conan's effects are Cascade (`dumpticks` in a camp) | — |
| CB | the first fight after a fresh launch (A1/A2's real target) | blocked: the remote has no proven way to start a fight with effects — the flight is the proxy; the gap is said in the report | — |

## 4. Left out on purpose

- A6, B1, B2 wait for the WPR thread split (research §4 item 4).
- The flight is a proxy for the first fight: it shows first-sight shader stalls of the world, not of combat effects loaded with the hero.
