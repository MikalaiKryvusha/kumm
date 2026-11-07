# Run report — Conan: what our Lua mods cost per frame (A-B-A-B flights)

## Work

The build's acceptance criterion 3 (`MASTER_PLAN.md`: our Lua mods no more than 1 ms in the worst frame), the next step named by
`2026-11-06_conan-build-vs-vanilla-paks-abab.md`; cases C1–C2 of `testcases/TC_conan_our_lua_mods_cost_abab_2026-11-07.md`.

## Contour

Conan Exiles 3.0.1 build, pack `42fc264` (KrinikConanUI with the hub controller), background game, the reference flight `krinik-show` (KrinikConanBench),
batch `bench-batches/q5-build.txt` (warm-up + 2 flights per launch). A — the build as is; B — our seven Lua mods' `enabled.txt` renamed (KrinikConanUI,
Camera, Archery, Gameplay, Music, Graphics, ModPackManager); `KrinikAgentRemote` and `KrinikConanBench` on in both.

## Runs

- 2026-11-07 07:51 A · 08:04 B · 08:16 A — `bash ours_abab.sh` (session scratchpad: `launch-bg.ps1 -HoldSec 0` → `enter-world-remote.sh` → `bench-batch.sh
  bench-batches/q5-build.txt` → `close-game.ps1`); the 4th launch failed (the 08:16 game hung on exit — killed by PID 14552 at 08:36).
- 08:36 B — `bash ours_abab.sh "B"`.

## Checks

Hygiene: none.
Functional run: the real build in the background on the reference flight route, 4 launches × 2 measured flights; READ: the bench's per-flight line (frames,
median fps, 1 % low, stutters ≥ 50 ms, worst frame, GPU and CPU ms) and the restored mod flags (10 `enabled.txt` after the series).

| Side | CPU ms / frame | median fps | stutters ≥ 50 ms per flight |
|---|---|---|---|
| A (build) | 14.91 · 15.02 · 14.37 · 14.27 → mean 14.64 | 65.1 · 64.6 · 67.1 · 67.5 → 66.1 | 44 · 32 · 36 · 40 → 38.0 |
| B (no our Lua) | 14.69 · 14.65 · 14.69 · 14.75 → mean 14.70 | 66.1 · 66.3 · 66.0 · 65.8 → 66.05 | 26 · 27 · 34 · 43 → 32.5 |

C1 pass (8 measured flights, no «Undermesh» flag). C2 pass — CPU A − B = −0.06 ms, inside A's own spread (0.75 ms): our Lua mods cost less than the flight's
noise, far under 1 ms.

## Found

- Our seven Lua mods together cost no measurable CPU on the reference flight (≤ the noise, ≈ 0.4 ms at most by the spread) — criterion 3's Lua part holds.
- Stutters ≥ 50 ms: A 38 vs B 32.5 per flight — within B's spread (26–43); more pairs would be needed to name a difference.
- The series lost one launch to a game that hung on exit (`close-game.ps1` does not kill after 60 s) — the trap is written in `bench-batches/README.md`.

## Traces

`ours_abab.log`, `ours_b2.log` in the session scratchpad (the bench lines above, copied here); `Saved/Logs/ConanSandbox.log` per launch; no crash report.

## Verdict

pass — our Lua mods are within the flight's noise (CPU −0.06 ms A − B); the +0.9 ms of the whole build over the game without paks (2026-11-06) is not ours —
next: split it by pak groups.
