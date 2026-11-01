# Plan 41 · phase 8 — stability: the unrun cases and a long run without crashes on the final build

> **Created:** 2026-11-01 · **Parent:** `plans/41_EPIC_conan_1.0.0_defects_and_stability.md` phase 8; `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md`;
> `[OWNER]` 2026-10-26 «она 1_ должна работать стабильно 2_ моды не должны конфликтовать, должны быть рабочими»; 2026-11-01 13:28 «Стабильность: кейсы на
> стабильность не прогнаны, долгого прогона без падений нет»
> **Status:** written 2026-11-01 13:30 +03:00; not started; runs LAST — after phases 1–7 of this epic and epic 40 phases 1–5, before epic 40 phase 7 (archive)
> **Outbound:** the verdict line in STATUS and plan 39 C; a crash found → a bug file (`/report-bug`)

## Goal vector (Achieve)

The longest recorded run of the build is 59 min (S1e, 2026-10-26, no combat) — on a build that has changed a lot since; cases C2, C3, W1 never ran; S1 is
partial; U6 left Edit Appearance and Waystones half-done; the Damage Meter by the player's path (DM0, F1 held + click) and PackRat by its own button (S1d)
were never walked. Where we want to be: every case of the stability file has a verdict on the final build, and one process survives ≥ 120 min of flights,
hub, mod windows and combat — 0 new crash folders, no new error class, no Lua error line, memory not growing without bound.

## Acceptance criteria

1. **Cases with a verdict.** Situation: the final build deployed, `-Verify` green. Action: C2, C3, W1, U6 (rest), DM0 (player's path), S1d (PackRat by its
   button), CAM4 (a spawned stone at 6 m, far zoom), FP1 (bow drawn in first person) run. Result: each pass / fail with its observation. Check: the TC file
   rows updated with the date and the run report path.
2. **Long run.** Situation: one game process, world entered. Action: 120 min — block A 60 min `long-run.sh 60 lr41a` (flights `krinik-show` + hub open/close);
   block B 30 min combat (below); block C 30 min windows + hub (`walk-mod-windows.sh` over the safe module list in a loop, the inventory button of epic 40
   phase 3, the hub tab round trip). Result: the process alive at the end. Check: `Get-Process -Id <PID>` at the end; `Saved/Crashes` folder count before /
   after equal.
3. **No new error class.** Check: the game log `Error:` lines grouped (digits folded) against the L2 baseline list (TC L2 + S1e families); `UE4SS.log` — 0
   lines «ошибка» / «упал» / Lua error of our mods; every new class written in the report with its first line.
4. **Memory bounded.** Check: the working set sampled once per long-run lap (one `Get-Process -Id <PID> | Select WS` per flight — part of the action loop,
   not a waiting loop); after the first 15 min the growth ≤ 10 % per hour `[AI]`; the curve in the report.
5. **Frame health in passing.** Check: PresentMon CSV (already started by `long-run.sh`) — stutter count per block; no block worse than block A by > 2× `[AI]`.
6. **A crash, if any, is handled.** Check: the report carries «окно отчёта о падении закрыто, PID …», the crash folder's call stack, the classification
   (build / instrument), one repro attempt; a build crash → a bug file.

## Stand (house rule 11)

- Machine lock for the whole run (`machine-lock.mjs take --who kumm --what "plan41 phase8 long run" --minutes 180`); KAGO told if the lock blocks it.
- Launch `launch-bg.ps1` (background — the owner keeps his screen; the combat block and the real-click cases borrow focus only after `wait-input-idle.ps1 -Min 10`);
  `enter-world-remote.sh`; `god-on.sh`; `exec MakeMeAdmin`; `exec t.MaxFPS 141`.
- Combat block B: on the clear beach (`tp_ground.sh`), waves of 3 hostiles spawned by the remote every 5 min (`arrow-stand.sh summon` / `exec SpawnNPC <row>`),
  the hero fights by remote shots (`InpActEvt_PrimaryActionV2_…` — the pult shot of AIM11) and melee by `mouse-seq.ps1` clicks when focus is free; god on, so
  the run never ends by death. Corpses looted once per wave (quick-loot path).
- NO reflection probe during the long run (S1c 2026-10-26 17:32 — a crash in the agent's own probe); the remote only for spawns, shots and module opens.
- Saves used freely (rule 6).

## Steps

- [ ] 1. **RECON — the case list.** Read the TC file; list every row whose status is «not run», «partial», «waits»; drop the superseded; for each — the stand
      it needs (C2: Highmane crossbow `BP_HA_Crossbow` spawned + bolts, fired once by the remote; C3: a Caverns of Set torch / EAA gem upgrader SPAWNED in
      front of the hero, frame of its flame; W1: actor class names near the camera during `krinik-show` — names only, EXP-0330; DM0: hold F1 + `mouse-seq.ps1`
      click on the expand button; S1d: PackRat's own inventory button by a real click — never the bare `PRMainMenu` module).
- [ ] 2. **RECON — `long-run.sh`.** Its header says `[NOT-TESTED]` for the crash-reporter line; read the script: does it record the working set and the
      PresentMon file path? If not — add one `Get-Process -Id <PID>` sample per lap and the PresentMon path to its summary (a tool edit in the pack, tested by
      a 5-min run `long-run.sh 5 lrtest` before the real one).
- [ ] 3. **RECON — the error baseline.** Build `errors-baseline.txt` (the L2 family list + S1e families, digits folded) next to the case file; a grouping
      one-liner `grep "Error:" <log> | sed -E 's/[0-9]+/N/g' | sort | uniq -c | sort -rn` named in the case.
- [ ] 4. **Case file** — new rows appended to `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md` (S2 long run 120 min, S2-mem, S2-pm) and the
      rerun columns of C2, C3, W1, U6, DM0, S1d, CAM4, FP1; the stand section first (rule 11.1).
- [ ] 5. **TEST — the cases** (one session, ≈ 60 min): each case by its stand; frames `capture-window.ps1 -Width 3840`; the logs read once at the end.
- [ ] 6. **TEST — the long run** (a fresh process, 120 min): `Saved/Crashes` count and the game PID noted; blocks A → B → C; at the end — the summary of
      `long-run.sh`, the error grouping vs the baseline, the memory curve, PresentMon stutters per block; `close-game.ps1` (it calls `close-crash-reporter.ps1`).
- [ ] 7. **On a crash** (rule 9): `Get-Process CrashReportClient | Select Id, StartTime, MainWindowTitle` → `Stop-Process -Id <PID>`; copy the new
      `Saved/Crashes/<folder>/` (minidump, `CrashContext.runtime-xml` call stack, the log tail) into the session scratchpad; classify — the agent's probe in
      flight (instrument) or the build; one relaunch and the same block to see if it repeats; a build crash → `/report-bug` with the stack; the long run
      restarts from zero after the fix (a run with a crash does not count).
- [ ] 8. **FIX** — only what a case or the run proves broken, by the fixing rules of the epic (native first, rule 8); each fix re-runs its case, and a fix to a
      Lua mod or a pak restarts the long run.
- [ ] 9. **PACKAGING (if step 8 changed anything)** — pak / Lua into the pack, `modpack.json` note, `.\Deploy-ModPack.ps1 -Deploy -Only "<Mod>" -PackDir
      D:\work\ai_sandbox\ConanExiles`, `-Verify`; the long run on the redeployed build.
- [ ] 10. **Run report** `testcases/reports/<date>_conan-stability-long-run.md` (work · contour with the pack commit hash · runs · checks · found · traces ·
      verdict); same commit: the TC rows, plan 39 C (the stability line), STATUS (the one verdict line: «долгий прогон 120 мин — …»), the guide only if it
      claims stability.

## Risks

- (a) The combat block needs real clicks for melee — if the owner is at the machine, melee is dropped and the block is remote shots + mobs hitting the
  god-mode hero (the S1 «combat not walked» gap is still closed by the shots).
- (a) A crash late in the run costs the whole 120 min again — the cases (step 5) run first to catch cheap crashes early.
- (b) Background-window timing (frame pacing behind) differs from the owner's front game — PresentMon numbers here are health signs, not the frame-cost
  verdict (that is epic 40 phase 5, in front).
- (b) The memory threshold and the stutter ratio are `[AI]` values with no earlier baseline — the first run records them; the owner can tighten.

## Decisions made without the owner

- `[AI]` 2026-11-01 13:30 — 120 min in three blocks; memory growth ≤ 10 %/h after 15 min; a block's stutters ≤ 2× block A's.
