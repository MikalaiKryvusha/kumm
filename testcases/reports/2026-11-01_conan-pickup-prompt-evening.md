# Test run report — «E Взять» in game after the owner's layout, the list growth, the A-B flight (plan 42, evening)

**Created:** 2026-11-01 22:59 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles `ac31b3a` → `8ac0810` (the list fix), the gap 6 in the source after it

## 1. Work

Plan 42 cases P6–P12 of `testcases/TC_conan_hub_rows_audit_2026-11-01.md`: the owner's layout of 21:57 («фон только под словом»), his case «камни у ног, камера сверху»,
the fade by the player's path, the A-B flight of HOUSE_RULES rule 7 (P9), the component list (P11, found in this run), the E-to-word gap (`[OWNER]` 22:41 «кнопку E ближе
поставь к Взять» · 22:48 «вариант 3»). The bench start hold 20 → 40 s by `[OWNER]` 22:38 «выжидание в НАЧАЛе нужно увеличить еще на 20 секунд».

## 2. Contour

The live game 3.0.1 in the background (`launch-bg.ps1`), the oasis save, god on, food and water 100; the stone stand by `scratchpad/stand_stone.lua` (the nearest
`SM_rock_small*` with scale > 0, the hero 60 cm east, pitch −50); frames by `capture-window.ps1 -Width 3840`; real E and S by `mouse-seq.ps1`; flights by `bench-flight.sh
krinik-show`; the section's own minute line. REAL WORLD: accumulated — the owner's install and live save; data and machine — his; path — the hero walks to pickups and
presses E; the flights fly the owner's accepted reference route.

## 3. Runs

| # | Moment | Command | Outcome |
|---|---|---|---|
| 1 | 2026-11-01 22:16–22:19 +03:00 | `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`, `launch-bg.ps1`, `enter-world-remote.sh`, the stand, a 4K frame, a real E | P6, P7 pass |
| 2 | 2026-11-01 22:20–22:23 +03:00 | a teleport to a «no pickup within 5 m» spot; a real S for 4 s | the undermesh teleport and a 90 s loading screen; plate truthful (more stones in reach) |
| 3 | 2026-11-01 22:25–22:31 +03:00 | `bench-flight.sh krinik-show p9-A1-prompt-on` ×2 | the list grew 281 → 1976 (P11 found) |
| 4 | 2026-11-01 22:32–22:40 +03:00 | the fix, redeploy, restart, `scratchpad/ab_run.sh p9-A1-on` | list 634 vs 590 loaded (P11 pass); A1 at hold 20 |
| 5 | 2026-11-01 22:41 +03:00 | the stand, a real E ×8 | P8 pass |
| 6 | 2026-11-01 22:42 +03:00 | the backing's left padding 24 / 12 / 6 set live, three 4K frames | review folder 55; the owner picked 6 at 22:48 |
| 7 | 2026-11-01 22:43–22:46 +03:00 | `bench-flight.sh krinik-show p9-A1-on-h40` | A1 at hold 40 |
| 8 | 2026-11-01 22:46 +03:00 → | `scratchpad/ab_rest.sh` (B1 off, A2 on, B2 off — each a restart, a warm-up flight and a measured one) | see Checks |

## 4. Checks

Hygiene: `lua loadfile`, `check-lua-game-thread.py` — 0 worker-thread calls.
Functional run: the live game; read — 4K frames of the plate, the hero's weight around real E presses, the plate's visibility and opacity by the remote, the section's
minute lines, the flights' PresentMon summaries.

| Case | Status | Observed |
|---|---|---|
| P6 layout | pass | E in its own thin rim, nothing dark under it, the backing only behind «Взять» (frame 22:19, folder 54) |
| P7 stones at feet, camera above | pass | plate shown; a real E took a stone: weight 97.60 → 97.66 |
| P8 fade when nothing is left | pass | a real E ×8: on the 4th the last stone in reach was taken (97.72 → 97.78); the plate `Collapsed`, opacity 0.00 |
| P9 A-B flight | pass | on — CPU 14.89 / 15.38 ms (mean 15.14), off — 15.22 / 15.12 (mean 15.17); stutters on 25 / 63, off 60 / 68: the prompt's cost is inside the flight noise, «on» no worse than «off» (HOUSE_RULES rule 7). Table: | measured flights (each launch: a warm-up flight first, not counted), the hero at the oasis stones, route `krinik-show`, hold 40 s: |

| Flight | Prompt | CPU median, ms | GPU, ms | fps (median) | 1 % low | stutters ≥ 50 ms | worst, ms |
|---|---|---|---|---|---|---|---|
| A1 | on | 14.89 | 12.10 | 59.4 (65.2) | 24.7 | 25 | 169.8 |
| B1 | off | 15.22 | 11.89 | 58.0 (63.9) | 22.8 | 60 | 153.8 |
| A2 | on | 15.38 | 11.99 | 56.9 (62.9) | 23.0 | 63 | 185.0 |
| B2 | off | 15.12 | 11.94 | 57.6 (64.0) | 22.0 | 68 | 126.2 |
| P11 list growth | pass | after the fix: list 634, loaded 590 (before: 1976 vs 281) |
| P12 gap 6 | pass | 23:14 4K frame after the restart: E's rim close to «Взять», as the owner's variant 3 |
| P10 enemy health bar | partial | 23:16 a Kappa 8 m ahead — its bar 60 px above the plate; 23:19 a Kappa beside the hero — its bar on the plate's line, 50 px left of «E»; no cover in either frame, but a creature under the crosshair can bring its bar onto the plate — the owner's eye |

## 5. Found

1. The section's component list never dropped unloaded components — 281 → 1976 in one flight, the near cycle 14 → ≈ 100 s (fixed, pack `8ac0810`, EXP-0434).
2. A stand teleport to a computed spot landed under the oasis ruins — the game's undermesh teleport and a 90 s loading screen; the crosshair and our plate were
   re-created after it and the plate rebuilt itself (game map, stand row).
3. The flight start hold of 20 s left the route's first seconds on streaming stalls: A1 at hold 20 — CPU 16.61 ms, 69 stutters; at hold 40 — 14.89 ms, 25.

## 6. Traces

Frames: review folders 54 (`54_podskazka_vzyat_v_igre`) and 55 (`55_podskazka_zazor_E`) under `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\`; the UE4SS log lines
`[KrinikConanUI:PickupPrompt]` 22:16–23:xx; `bench.log` of KrinikConanBench; the flight summaries in the session's task outputs. Crash-report window: none.

## 7. Verdict

pass for P6–P9, P11, P12 (the layout, the owner's case, the fade by the real-E path, the A-B flight within noise, the list growth fixed, the gap 6);
partial for P10 (no cover seen, a close case shown to the owner). The look of the plate stays the owner's verdict (review folders 54, 55).
