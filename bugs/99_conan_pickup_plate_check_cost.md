# Bug 99 — Conan: the «E Взять» plate's check — 0.6 ms once a second; the «over the 1 ms budget» reading retracted (the cheap trims stay open)

**Status:** 🟡 the «over budget» reading is RETRACTED 2026-11-13 17:1x (section «Stand 17:12» below; `[OWNER]` 17:08 «на нихуя она не стоит» — he was right): a check
costs 0.6 ms in ITS frame (once a second), within the 1 ms of a frame; the 2–31 ms worst readings are not attributed to it — open only as a cheap trim of the foliage
probe and the calls between the parts · **Severity:** S3 · was: S2
**Version/build:** pack HEAD `cdf8ef0` (`krinik_pickup_prompt.lua` with the bug-96 actor branch) · **When/context:** found by judge round 4 of bug 96, 2026-11-13 16:4x,
in the owner's own `UE4SS.log` (his check of the build, 16:04–16:46)
**Fixing:** this session, on my stand when the owner's game closes — the parts timed one by one, then the costly part rewritten

## Symptom

The section's own minute summaries in the owner's log, 16:06–16:46: 47 summaries, 2 817 checks, 1 776 ms — **0.63 ms per check on average**; the worst check of a
summary ≥ 2 ms in 24 of 47; the worst readings 5 ms (16:06:03), 15 ms (16:30:12), 31 ms (16:43:19). A check runs once a second (10 a second while the plate shows),
on the game thread, inside one frame. Before bug 96 the check cost 0.089 ms (1000 calls, report `testcases/reports/2026-11-02_conan-pickup-native-probe.md`); the
bug-96 header says «actor branch 0.125 ms + foliage probe 0.045 ms» — measured by 200 calls AT a bush, not in the owner's world.
Caveats: `os.clock` is wall time in 1 ms steps (a reading of k proves only «more than k − 1 ms»; a preempted game thread counts too); the sum of whole-ms readings is
still an unbiased average.

## Repro

`grep -a "PickupPrompt\].*своё время" UE4SS.log` over any session of the build, then the per-summary sum ÷ checks (the awk line of the 16:4x read in the chat log of
this session: `sed -E 's/.*проверок ([0-9]+), своё время ([0-9.]+) мс, худшая ([0-9.]+).*/\1 \2 \3/'`).

**Probe in the owner's game 2026-11-13 17:0x** (`_config/pickup-cost-parts.lua`, N 20, third person, his place at that moment): sphere and line multi-traces 0 hits,
< 0.05 ms each (0 ms over 20 calls); the per-hit loop 0; the foliage probe 0.100 ms — yet the mod's own summaries there read ≈ 0.5 ms a check. So the traces are NOT
where the time goes at an empty view; the remote cannot see the mod's internal list (each UE4SS mod has its own Lua state, EXP-0438). **Instrument added** (working
tree, loads at the next start): the minute summary now carries the parts — «подсказки N мс (в списке K)», «цель-актор», «растения» — and the list size.

## The owner's correction 17:15 — every number below and above was taken with the game in the BACKGROUND

`[OWNER]` 2026-11-13 17:15 «ты некорректно меряешь цену модов» · «игра в фоне, винда с такими приложениями работает иначе». Both the owner's session (16:06–16:46 —
he worked in VS Code, the game behind) and my stand (`launch-bg.ps1`) ran the game as a background window: Windows gives it less CPU (no foreground boost, background
power throttling) and `os.clock` (wall time) counts those waits as the mod's cost. The numbers are not a measurement — re-measure with the game in FRONT
(HOUSE_RULES rule 11 6f), the same minute summaries, the hero standing, then lit at a stone.

## Stand 17:12 (my game, BACKGROUND — not a measurement, see above; the owner's save at its entry point, third person, the hero standing; TC `TC_conan_pickup_plate_cost_2026-11-13.md` C1–C2)

The first minute with the part timers: 60 steps, 36 ms (0.60 ms a check), worst step 4 ms; parts — info prompts 2 ms (the list EMPTY — hypothesis 0 refuted here),
actor branch 6 ms (0.10), foliage probe 11 ms (0.18), the rest 17 ms (0.28: the controller / camera reads, `show`, pcall). The SAME minute in the other sections of the
same log: HudBlink 232 polls 42 ms (worst 2 ms) + 1 089 colour steps 81 ms (worst 3 ms) — 123 ms a minute, three times the plate's 36; KrinikConanMusic worst 1 ms;
BowSprint 2 174 calls 17 ms. Reading: the 1 ms clock and game-thread stalls give every section 2–3 ms worst readings in the same minutes — the plate's spikes are not
its own cost; per frame at 60 fps the plate averages ≈ 0.01 ms. The heavier consumer is HudBlink (its colour tween every 33 ms while an icon is in its zone).

## Hypotheses (ranked)

0. `strip_on_screen` — `GetFullName()` (a string built per widget) on EVERY info prompt remembered since the game start; the list only grows (pooled widgets stay valid).
1. The actor branch (`actor_target`): two multi-traces (sphere + line, channel 6) over everything in reach, `InteractableInterface` per hit, `CheckLineOfSight` —
   in a base or a city many hits per check.
2. `strip_on_screen`: `GetFullName` + `IsInViewport` + `IsVisible` on every live info widget remembered at birth — the list grows with every placeable / thrall prompt.
3. The worst readings (15, 31 ms) are a garbage-collection or a preemption landing inside a step, not our work — tell apart by timing the parts.

## Fix plan

1. Stand: the owner's save at the place of his session; the parts timed separately by the remote (`os.clock` over 200 calls each — actor branch, foliage probe,
   `strip_on_screen`, the camera read), the hit count of each trace logged.
2. Fix the costly part natively (the game's own cheaper call, an event instead of a re-read, fewer hits — the trace radius exactly the game's), then the same
   200-call measure and a minute of the summaries in the owner's world.
3. Done when: the average ≤ 0.1 ms and no summary's worst step ≥ 2 ms over 10 minutes of play in the same place.

## Decisions made without the owner

(filled at closing)

## Links

`bugs/96_conan_no_take_prompt_over_bush.md` (judge rounds 3–4), `games/ConanExiles/mods/KrinikConanUI.md` (`krinik_pickup_prompt` row), `HOUSE_RULES.md` rule 7.
