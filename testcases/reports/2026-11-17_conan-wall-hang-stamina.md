# Test run report — Conan: the hang on a wall spends stamina (our reason flag, bug 106 item 2)

**Created:** 2026-11-17 09:51 +03:00 · **Run by:** the agent, the remote only (no real input — the owner at the keyboard) ·
**Version/build:** the Conan build on 3.1.0, pack working tree after `965f10f` — KrinikConanLocomotion `krinik_wall_jump.lua` r1 (09:38), r2 after judge round 1
(09:43), r3 after judge round 2 (09:48)

## 1. Work

The recon of how the game spends stamina over time (the owner's counter-question «можно без таймера?» and «в спринте как сейчас игра тратит выносливость?») and
the feature built from his answer «новый флаг разрабатываем» — the hang flag up at the grab, down at the climb's end, the drain of 2 / s in the game's own stamina
tick on the wall. Basis: `testcases/TC_conan_wall_hang_stamina_2026-11-17.md` (R1–R6, H1–H6, K1); the owner's words verbatim in
`interviews/interview_037_conan_wall_climb_bow_and_hang_stamina.md`.

## 2. Contour

The desert arch (`tp_ground.sh 17929 244723`, `wall-stand.lua find` ×2, `climb`), the game in the BACKGROUND (`launch-bg.ps1`, `enter-world-remote.sh`), stamina
set by `AdjustStaminaCurrent`; the sampler `KUMM/.work/hangstamina/stamina-calls-probe.lua` (`sample` — the bar every 15 ms, one row per change; `arm`/`read` — call
counts of 56 stamina / climb UFunctions), `degen-bits-probe.lua` (the bits passed to `StaminaDegenerationBitmaskSet / Clear`), `stamina-data-probe.lua`
(`GetStaminaData` and the hero's stamina fields), `crawl.lua` (a crawl by `AddMovementInput`). Machine lock `kumm` 09:25–09:50.
REAL WORLD: accumulated — the owner's save and his 3.1.0 install with the whole build; data and machine — his save, his PC; path — the game's own climb and its
events driven by the remote's input events (the same events the keys fire); real keys — not run (the owner at the keyboard, rule 30).

## 3. Runs

All on 2026-11-17 (+03:00), from `ConanExiles/_config`, `bash pult.sh "lua …"` unless named.

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 09:25–09:26 | `powershell -File launch-bg.ps1` · `bash enter-world-remote.sh` | 0 · the build before the edit |
| 2 | 09:26–09:27 | `_G.__scp_cmd='arm'` / `reset` / `read` standing, in a sprint (`sprint-run-probe.lua`) | 56 hooks; sprint: `StaminaDegenerationBitmaskSet` ×1, bar 108 → 92 in 1.95 s |
| 3 | 09:28 | `degen-bits-probe.lua` standing, in a sprint | sprint `Set(2)` ×1, `GetStaminaDegen` −8.0; water `Set(4)`; end `Clear(6)` |
| 4 | 09:29 | `wall-stand.lua find` ×2, `climb`; hang still 4 s | K1: 83 → 83; `ReceiveClimbingStaminaCostModifier` 10.1 / s |
| 5 | 09:29–09:31 | `StaminaDegenerationBitmaskSet(8)`, `(2)` on the wall | 8: degen 0, bar still; 2: −8 / s (83 → 59 in 3 s) |
| 6 | 09:31 | bits 1 … 1024 one by one, `GetStaminaDegen` | 2 −8.0 · 4 −2.5 · 32 −6.7 · the rest 0; `SprintStaminacost` 8, `SwimStaminacost` 2.5 |
| 7 | 09:31 | `Set(4)` on the wall, sample 16 s | 27 → 0 in 10.4 s, the game dropped the hero (mode 7 → 3 → 1); the bit kept draining on the ground (−14) until `Clear(4)` |
| 8 | 09:34 | `stamina-data-probe.lua` | `StaminaData`: `ClimbingStaminaCost` 5.0, `ChargeHoldStaminaCost` 10.0, `StaminaAccumulation`, `StaminaDegenerationSourceBitmask` |
| 9 | 09:38–09:41 | r1: `Deploy-ModPack.ps1 -Deploy -Only KrinikConanLocomotion` (md5 = pack) · launch · H1 · H4 (`jumpwall`) | the four hooks set; H1, H4 below |
| 10 | 09:43–09:46 | r2 (judge round 1 fixed) · launch · H3 · H5 + H2 (`crawl.lua`) · H4b (`ExitClimbing`, then with `bWantsToClimb=false`) | below |
| 11 | 09:48–09:50 | r3 (judge round 2 fixed) · launch · hang 5 s · push | below; game closed by PID 27908, lock released |

## 4. Checks

Hygiene: none separate (the game's Lua load is the syntax check — the four «перехват … поставлен» lines on every start).
Functional run: the game's own climb on the owner's save, the bar read every 15 ms, the mod's log lines read — the cases below.

| Case | Status | Observation |
|---|---|---|
| H1 hang still 10 s | pass | 108 → 88 in 10.0 s, one step per 0.49–0.52 s (r1); r3: 108 → 98 in 5.0 s |
| H2 crawl 1.5 s (z +135 cm) | pass | 108 → 94 in 2.5 s: the game's crawl cost plus ours; ours alone over the same 2.5 s = 5 |
| H3 empty bar | pass | 10 → 0 in 4.9 s, the game dropped the hero at 0 (mode 7 → 3 at 4.94 s), the bar never below 0, regen on the ground after ≈ 1.5 s |
| H4 push | pass | «вис кончился (режим 3): 36.6 с …, расход виса 73» before the push line; on the ground 22 → 108, no drain |
| H4b climb down | pass | `ExitClimbing` with the stand's wish standing re-grabbed the same wall in 0.04 s — the first hang closed («9.3 с, 18»), the new one drained from zero (86 → 81 in 2.6 s); with the wish cleared: mode 3 → 1, 13 → 108, no drain, «36.8 с, 73» |
| H5 re-grab from zero | pass | every hang's line: taken = 2 × time (7.6 s → 15, 9.3 s → 18, 12.4 s → 24, 36.6 s → 73, 36.8 s → 73) — no lump from the time off the wall |
| H6 cost | partial | ticks 10 / s on the wall (366 in 36.6 s); calls that crossed the 1 ms clock step — 6 / 76, 2 / 92, 28 / 368, 18 / 124 (≈ 2–15 %), i.e. a mean below ≈ 0.15 ms per tick; background path — the in-front cost (rule 6f) not measured |
| K1 control (the build before) | pass | hang still 4 s: 83 → 83 |

## 5. Found

- none in the feature. Two notes: the stand's leftover `bWantsToClimb` re-grabs a wall after `ExitClimbing` (the stand's known trait — `wall-stand.lua` header);
  judge round 1 — 6 findings (all confirmed, fixed in r2: the push ends the hang itself, the tick tied to our hero's address, the cost line by clock steps, a
  per-hook error budget, a wrong comment, a respawn ends the hang with its line); judge round 2 — no defect, 6 quality / cosmetic items (all applied in r3).

## 6. Traces

`D:/Games/Conan Exiles 3.1.0/ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log` lines `[KrinikConanLocomotion:WallJump] вис кончился …` 09:41:16, 09:45:10, 09:45:50,
09:46:27, 09:50:04; the probes in `KUMM/.work/hangstamina/`; the judges' diffs `judge_r1.diff`, `judge_r2.diff` there.

## 7. Verdict

pass for H1–H5 and K1 on the remote's path; H6 partial (the cost in front not measured). Real keys — the owner's play.
