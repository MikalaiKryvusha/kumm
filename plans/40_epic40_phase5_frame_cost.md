# Plan 40.5 — frame cost of our Lua mods: ≤ 1 ms in the worst gameplay frame, the blink spikes explained

> **Created:** 2026-11-01 · **Parent:** `plans/40_EPIC_conan_1.0.0_unfinished_six.md` phase 5 (criterion 5); plan 39 B4; plan 36 item 23; TC `testcases/TC_conan_3.0.1_ru_fps_perf_2026-10-25.md`
> **Status:** written 2026-11-01 by a helper agent; not started; runs after phases 1–4 (it measures the FINAL Lua set)
> **Outbound:** the game must be in FRONT for the flights (background `os.clock` is wall-clock) — the time slot is agreed with the owner (his screen; HOUSE_RULES rule 16)

## Goal vector (Achieve)

There is no proof that our Lua mods keep the budget of 1 ms on the game thread in the worst gameplay frame (MASTER_PLAN budget; memory «Сварог: 1 мс
процессора на все моды» applied to the build); the last A-B (2026-10-26, six older mods) gave ≈ 0.4 ms median CPU, and the blink section logs 3–6 ms worst once
a minute with the game in the background (report `2026-11-01_conan-hud-blink-all-steps-video.md`). Where we want to be: an A-B-A-B flight series «build» vs
«build without our Lua mods» with the game in front, the sections' own `os.clock` summaries from the same flights plus a combat/run segment, every worst handler
named, the total ≤ 1 ms, and the minute spikes either gone or explained by a measured cause.

## Acceptance criteria (scenario form)

1. **A-B-A-B median CPU.**
   - Situation. The final build (phases 1–4 deployed), the game in front at the owner's 4K settings, warm (one warm-up flight), the `krinik-show` route.
   - Action. The agent flies A (all mods), B (our Lua mods off), A, B.
   - Result. The difference of median `MsCPUBusy` A − B is ≤ 1.0 ms and hitches (≥ 50 ms) of A are within the A–A noise of B (±4, the 10-26 noise).
   - Check. Scale: ms · Meter: `bench-flight.sh krinik-show <label>` report lines (PresentMon `MsCPUBusy` median, hitches) · Target: mean(A) − mean(B) ≤ 1.0 ms.
2. **The sections' worst handler.**
   - Situation. Flights A plus a 3-minute gameplay segment (run, 10 bow shots, 10 melee hits, inventory open/close ×5, a kill) with the game in front.
   - Action. The agent collects every minute summary of every Krinik section from `UE4SS.log`.
   - Result. Each section's `worst` ≤ 1.0 ms and the sum of the sections' worsts within one minute ≤ 1.0 ms (an upper bound of one frame's total).
   - Check. `grep -h "минут\|worst" "<game>/ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log"` (recon the exact summary formats per mod, step R2) → a table per
     section and minute in the report; Target as stated.
3. **The blink spikes.**
   - Situation. Food at 8 % (the blink zone), the game in front, 5 minutes idle.
   - Action. The agent reads the blink section's five minute summaries.
   - Result. Either no worst > 1 ms, or the cause is named by a probe that moves it (e.g. the summary's own log write, Lua GC) and fixed.
   - Check. Five summary lines `worst ≤ 1.0 ms` after the fix; the probe run's lines before it.
4. **The opening lag is allowed, gameplay is not.** Window openings (hub fill 4 ms) are logged apart and excluded by the owner's rule (memory: «открытие окон —
   лаг допустим»); Check: the report lists them in their own column.

## The stand (HOUSE_RULES rule 11)

| Part | Value | Set up by |
|---|---|---|
| Game | the final build, deployed, `-Verify` 0; the bench mod `KrinikConanBench` copied into `ue4ss/Mods/` (dev only, removed after) | `Deploy-ModPack.ps1 -Deploy -PackDir …`; copy `_unpacked/KrinikConanBench` (BN1 of the TC) |
| Screen | the game in FRONT, full screen 4K, nobody typing; no film on the GPU (the owner's word for the slot) | `launch-fg.ps1` |
| World | the `krinik-show` route, `time=1000`, `clear=true` (BN7); hero lands home after each flight (BN-L passed) | `bench-flight.sh` |
| Hero | god on, food / water 100 read back (except criterion 3: food 8 %) | `god-on.sh`; `GetHungerSystem()` write |
| Gameplay segment | open ground, a frozen Kappa 8 m ahead for shots, a second at 1.5 m for melee, then killed | `arrow-stand.sh`, `aim-shot.sh`, `mouse-seq.ps1 -Seq "kdown:W,wait:20000,kup:W"` |
| «No Lua» state B | each of our Lua mods' `enabled.txt` → `enabled.txt.off` (the 10-26 P34-B method), restored after | file renames, listed in the report |
| Machine | the KAGO lock for the whole series; the GPU mode stated in the report (HOUSE_RULES_REFERENCE §5, lock rule 5) | `machine-lock.mjs take --who kumm --what "epic40 p5 frame cost" --minutes 120` |

## Steps

### Recon (≈ 0.5 h, offline)

- [ ] R1. Our Lua mods and their folders: `grep -n '"to": "ConanSandbox/Binaries/Win64/ue4ss/Mods/Krinik' D:/work/ai_sandbox/ConanExiles/modpack.json` —
      the list for state B (today with `ue4ss` halves: Archery, Gameplay, Graphics, ModPackManager, UI; locate KrinikConanCamera's Lua folder the same way).
- [ ] R2. Every section's minute-summary line format: `grep -rn "os.clock" _unpacked/Krinik*/ue4ss/Scripts/*.lua` and the camera's; a section without a summary
      gets one (rule 7: «a mod measures itself») before the flights — that is the only code of this phase besides fixes.
- [ ] R3. Read the TC's unrun cases (PF1, BN1–BN4, BN7–BN9, BN11–BN16, MT5) and plan 36 item 23; mark which this phase runs (BN1, BN4, BN7, PF1) and which stay
      (route beauty BN12–BN15 — not needed for a cost number).

### Implementation (≈ 0.5–1.5 h)

- [ ] I1. Missing minute summaries added (R2) — same shape `n / sum / worst` per handler bucket, own error counter.
- [ ] I2. **Blink spike probe** (`krinik_hud_blink.lua`): hypotheses, each a one-switch probe — (h1) the spike is the summary minute itself (its string
      format + log write inside the timed region) → time the summary separately; (h2) Lua GC → log `collectgarbage("count")` with each summary and run one
      minute with `collectgarbage("step")` at the summary; (h3) wall-clock while backgrounded → the front run answers it. Fix the one that moves the spike.
- [ ] I3. Hygiene: `loadfile`, `check-lua-game-thread.py` 0, `check-lua-templates.py` 0.

### Test in the live game (≈ 2–3 h, game in front)

- [ ] T1. Cases into `testcases/TC_conan_epic40_frame_cost_<YYYY-MM-DD>.md` first: F1 warm-up, F2 A1, F3 B1, F4 A2, F5 B2 (criterion 1); F6 gameplay segment
      (criterion 2); F7 blink 5 min (criterion 3) before and after I2; F8 restore of `enabled.txt` and `-Verify`. Refer to the 10-25 TC's BN/PF ids the run
      also closes, and set their status there.
- [ ] T2. Lock; `launch-fg.ps1`; `enter-world-remote.sh`; `bench-flight.sh krinik-show e40-warm`; then `bench-flight.sh krinik-show e40-A1` … with game close /
      relaunch between A and B (the `enabled.txt` switch needs a restart) — or `bench-batch.sh` if one launch per state is enough (two launches: A A, B B,
      then A again for drift — A-B-A-B over three launches, order recorded).
- [ ] T3. Gameplay segment F6 and blink F7 in the A launch; `UE4SS.log` copied out after each launch (the next launch overwrites it).
- [ ] T4. `close-game.ps1`; `enabled.txt` restored; `Deploy-ModPack.ps1 -Verify` 0; the bench mod removed from `ue4ss/Mods/`; lock released.
- [ ] T5. Report `testcases/reports/<YYYY-MM-DD>_conan-epic40-frame-cost.md`: the flight table, the section table, the blink verdict, the GPU mode, the owner's
      slot word; a fail → a fix and a re-run the same day (rule 7: an edit is accepted by an A-B-A flight).

### Packaging into the build (≈ 0.5 h, only for code changes I1–I2)

- [ ] P1. Sources: the touched `ConanExiles/_unpacked/<Mod>/ue4ss/Scripts/*.lua`.
- [ ] P2. `modpack.json`: touched entries' `version` text; `Deploy-ModPack.ps1 -PackDir D:/work/ai_sandbox/ConanExiles -Deploy -Only <Mod>` per touched mod,
      then `-Verify` → 0.
- [ ] P3. Same commit (rule 20): each touched mod's notes (cost numbers), `KrinikConanUI.md` Open («its cost per poll is unmeasured» → measured), the 10-25 TC
      statuses, plan 36 item 23, plan 39 B4, MASTER_PLAN budget line if the number changes it. Pack commit + push; KUMM commit + push.

## Risks

- (a) Bench noise (±4 hitches, ≈ ±0.2 ms CPU) larger than our cost → the criterion holds by the upper bound; four more flights if the difference is within noise.
- (a) The flight is camera-only, not combat — criterion 2's gameplay segment covers the combat handlers.
- (b) The owner's screen is taken for ≈ 1.5 h — one slot agreed by voice beforehand; a run with the owner typing is void (BN4v lesson).
- (b) Disabling a pak-paired Lua mod changes the world (e.g. `KrinikConanGameplay` tables are the pak; only its Lua goes off) — note per mod what state B removes.
- (c) The blink spike is UE4SS-internal (not ours) → named with evidence, the owner told; not «fixed» by a guess.

## Effort

≈ 3.5–5.5 h: recon 0.5 h · summaries and the blink probe 0.5–1.5 h · flights and segments 2–3 h · packaging 0.5 h.
