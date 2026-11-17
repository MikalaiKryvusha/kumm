# Test cases — Conan: the hang on a wall spends stamina (our reason flag, KrinikConanLocomotion `krinik_wall_jump`)

**Created:** 2026-11-17 · **Under test:** `krinik_wall_jump.lua` — the hang flag `hang_on` (up at the grab, down at the climb's end) and the drain in the game's own
stamina tick on the wall (`BasePlayerChar_C:ReceiveClimbingStaminaCostModifier`) · **Version/build:** the Conan build on 3.1.0, pack working tree after `965f10f`
**Test basis:** `[OWNER]` 2026-11-16 22:31 «вис на стене должен медленно но расходывать выносливость, помимо того что ползание по стене расходует выносливость» ·
2026-11-17 09:18 «можно без таймера? а просто следить за событием "повис на стене" и за событием "слез со стены", а в промежутке - снимать выносливость с определённой
скоростью» · 09:33 «новый флаг разрабатываем» · «Ты делаешь эту фичу корректно без багов» (verbatim in `interviews/interview_037_conan_wall_climb_bow_and_hang_stamina.md`,
`bugs/106_conan_wall_jump_and_hang_cost_no_stamina.md`); the rate −2 / s — `[AI]`, interview #037 Q2 recommendation (no number from the owner).

## 1. Goal vector

Achieve: a hero on a wall loses stamina slowly for the whole time between the grab and the climb's end, by the game's own tick (no timer of ours), so an empty
bar drops the hero off the wall the way the game drops an exhausted climber; off the wall nothing of this runs.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHILE the hero hangs still on a wall, the mod shall take stamina at 2 per second | stamina lost per second · `GetIntStat(5, 0)` read by the remote at the start and after 10 s · 20 ± 2 |
| R2 | WHILE the hero crawls along a wall, the mod shall take its 2 per second on top of the game's own crawl cost | the loss in a crawl minus the game's own crawl cost of the same crawl (control) · same reads · ≈ 2 / s more |
| R3 | WHEN the bar reaches 0 on the wall, the game shall drop the hero, and the mod shall never take the bar below 0 | mode 7 → 3 / 1 and the lowest bar value · the 15 ms sampler · drop seen, minimum 0 |
| R4 | WHEN the climb ends (over the top, down, a push, a drop), the mod shall stop taking stamina | the bar on the ground after a hang · the sampler · rises by the game's regen, no fall |
| R5 | WHEN the hero grabs a wall again, the mod shall start from zero — no lump for the time off the wall | the first 1 s of a second hang · the sampler · ≤ 3 lost in the first second |
| R6 | The mod's work on the wall shall stay inside the 1 ms budget | the worst call of `on_climb_tick` · the log line «вис кончился … худший вызов N мкс» · ≤ 200 µs |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered (risk named) |
|---|---|---|
| hero state on the wall | still (H1) · crawling (H2) · empty bar (H3) | hanging from a ceiling (same mode, not reached on the stand — low) |
| how the climb ends | push (H4) · drop by exhaustion (H3) · climbed down (H4b) | over the top (needs a low ledge with input held — the same mode change, low) |
| re-entry | a second grab after the ground (H5) | a grab during a hitch / a pause menu (dt capped at 0.25 s — by reading, not run) |
| cost | the per-hang log line (H6) | the game in front (rule 6f) — the background figure is an upper bound only |
| input | the remote's input events (`wall-stand.lua`) | real keys — the owner is at the keyboard (rule 30); the game's events are the same |

## 4. Cases

Stand: the desert arch (`tp_ground.sh 17929 244723`, `wall-stand.lua find` ×2, `climb`), the game in the BACKGROUND (`launch-bg.ps1`), stamina refilled by
`AdjustStaminaCurrent(200)` before a case; the sampler `KUMM/.work/hangstamina/stamina-calls-probe.lua` (`sample`); the log `UE4SS.log` lines `[KrinikConanLocomotion:WallJump]`.

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| H1 | Hang still 10 s from a full bar → the bar falls 2 / s, ≈ 1 step per 0.5 s; 20 ± 2 lost | partition (still) | pass · 108 → 88 in 10.0 s, a step per ≈ 0.5 s (r1); r3 108 → 98 in 5.0 s · report `testcases/reports/2026-11-17_conan-wall-hang-stamina.md` |
| H2 | Crawl up the wall (`AddMovementInput` up) 1.5 s → the loss ≈ the game's crawl cost + 3 | partition (moving) | pass · 108 → 94 in 2.5 s with 1.5 s of crawl (z +135 cm): the game's crawl cost plus ours (5 over the window) · same report |
| H3 | Hang still from 10 stamina → at 0 the game drops the hero; the bar never below 0 while on the wall | boundary (empty bar) | pass · 10 → 0 in 4.9 s, the game dropped the hero at 0, never below 0, regen on the ground · same report |
| H4 | Push off the wall (`wall-stand.lua jumpwall`) → the log «вис кончился (режим 3) …»; on the ground the bar regenerates | state (climb → falling) | pass · «вис кончился (режим 3): 36.6 с …, расход виса 73» before the push line; ground 22 → 108 · same report |
| H4b | Climb down (`ExitClimbing()` by the remote) → «вис кончился (режим …)»; no further loss | state (climb → walking / falling) | pass · with the wish cleared: mode 3 → 1, 13 → 108, no drain (the stand's leftover wish re-grabbed in 0.04 s — a new hang from zero) · same report |
| H5 | 5 s on the ground, then a new grab → the first second loses ≤ 3 | state (re-entry) | pass · every hang's line: taken = 2 × time (7.6 s → 15 … 36.8 s → 73) · same report |
| H6 | The log line at the hang's end → worst call ≤ 200 µs, ticks ≈ 10 per second on the wall | measurement | partial · 10 ticks / s; 2–15 % of the calls crossed the 1 ms clock step (a mean below ≈ 0.15 ms); the background path only — the in-front cost (rule 6f) not measured · same report |

## 5. Control cases — MUST

| # | Control → expected: the behaviour is absent | Status + evidence |
|---|---|---|
| K1 | The build without this edit (the game before the redeploy, 2026-11-17 09:29, same stand) — hang still 4 s → the bar does not move | pass · 83 → 83 over 4.0 s (sampler `0.017 st=83 mm=7 | 4.015 end`), report `testcases/reports/2026-11-17_conan-wall-hang-stamina.md` |

## 6. Verdict

[TESTED: 2026-11-17 09:50 · H1–H5 and K1 pass on the remote's path (the game's own climb and its events), H6 partial (the cost in front not measured) · report
`testcases/reports/2026-11-17_conan-wall-hang-stamina.md`] — real keys: the owner's play.
