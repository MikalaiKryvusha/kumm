# Test run report — the quick-loot selection rim on an F take (bug 75)

**Created:** 2026-11-03 21:51 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles, KrinikConanUI 0.9.0 + the new section
`krinik_loot_rim` 0.1.0 (hot by the remote for B3–B4, deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` for B5)

## 1. Work

Cases B2–B5 of `testcases/TC_conan_quick_loot_f_take_2026-11-02.md` against `[OWNER]` 2026-11-02 09:10 «при заборе предмета … контур выбора перемещается
в последнюю нижнюю правую клетку» and the way he named 2026-11-03 21:26 «можно … просто её делать невидимой на время мерцания?». Before them — the
mechanism read by a per-frame trace (`_config/quickloot-rim-trace.lua`).

## 2. Contour

The working game `D:\Games\Conan Exiles 3.0.1`, the owner's oasis save; stand: `loot-stand.sh` (noon, god, a humanoid camp corpse killed by the remote,
the hero 1.5 m off) + `loot-aim.sh` (Shift tap, the view from the hero toward the body, the sweep by the game's own answer); capture `loot-take-clip.sh`
(ffmpeg `ddagrab` 120 fps, real wheel and F by `mouse-seq.ps1`, the game in front for ≈ 7 s). REAL WORLD: accumulated — the owner's working game and save
(saves are the agent's to use, HOUSE_RULES rule 6); data and machine — his machine under the KAGO lock; path — a real F press in the real window.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-03 21:16 +03:00 | `SEQ="wait:1000,wheel:-1,wait:900,kdown:F,wait:80,kup:F,wait:2500" bash loot-take-clip.sh take4.mkv` (trace armed, no fix) | 120/1601 · the trace: one cell in row 3 at opacity 1.00 with its `AnimSelect` at 0.300 «playing» for 246 ms |
| 2 | 2026-11-03 21:38 +03:00 | the same, `krinik_loot_rim` loaded by `pult.sh "lua return dofile(…/krinik_loot_rim.lua)"` → `fix5.mkv` | 120/1588 · counters «selections 7 reads 6 last row 1, column 4» |
| 3 | 2026-11-03 21:39 +03:00 | the same → `fix6.mkv` (the last item of the row) | 120/1603 |
| 4 | 2026-11-03 21:43 +03:00 | both Lua sections out (`KrinikConanUI`, `KrinikConanArchery` `enabled.txt` moved to the scratchpad), a fresh start → `b2.mkv` | 120/1614 |
| 5 | 2026-11-03 21:49 +03:00 | `Deploy-ModPack.ps1 -PackDir D:/work/ai_sandbox/ConanExiles -Deploy -Only KrinikConanUI`, a fresh start, `SEQ="wait:1000,wheel:-1,wait:600,wheel:-1,wait:900,kdown:F,…"` → `b5.mkv` | deploy «1/1 mods, 18 files · verify 108 present, 0 missing»; the log «section krinik_loot_rim: loaded» |

## 4. Checks

Hygiene: none beyond the Lua loading without errors (the log lines «hook … set», «loaded 0.1.0»).
Functional run: real wheel and F presses in the real quick-loot window of a humanoid corpse, the game in front, 120 fps clips READ frame by frame (crops of
the window at 15–20 fps, rows 1–3).

| Case | Status | Observed |
|---|---|---|
| B2 control (our Lua out) | pass (the defect is the game's) | `b2.mkv`: after F the rim stands on the bottom-right cell (row 3, column 6) for 3 frames at 15 fps, then on the taken place |
| B3 the fix, a middle cell | pass | `fix5.mkv`: wheel to row 1 column 4, F → no rim anywhere ≈ 0.4 s, no frame in rows 2–3, then the rim on row 1 column 4 (the item that slid in) |
| B4 the last item of the row | pass | `fix6.mkv`: the amulet at row 1 column 5 taken → no rim ≈ 0.2–0.3 s, then on row 1 column 4 (the game's own choice) |
| B5 after a normal start | pass | `b5.mkv`: the helmet at row 1 column 2 taken → no rim ≈ 0.3 s, no frame in rows 2–3, then the rim on row 1 column 2 |

## 5. Found

- The cause (bug 75): the native rebuild walks the selection; the walk's last cell keeps its full rim ≈ 250 ms (one `AnimSelect` length) while the right
  cell has none. The game's C++ — not ours (B2).
- UE4SS writes `UE4SS.log` with a delay: lines of a take appeared minutes later, the trace looked silent twice (EXP-0453).
- A UE4SS object wrapper is a new Lua value on every call: `kept.panel == panel` was false for the same panel (EXP-0453).
- Stand: from 3 m the window never opened; from 1.5 m and the view from the hero toward the body the sweep hits in 6–10 steps; a sweep started while the
  game is behind reads a stale strip as «hit» (`loot-aim.sh` now brings the game to the front first).

## 6. Traces

Clips in the session scratchpad (`take4.mkv`, `fix5.mkv`, `fix6.mkv`, `b2.mkv`, `b5.mkv`) and their frame sheets (`*_f.webp`) — deleted after this report
(HOUSE_RULES rule 15); the log lines `[KrinikConanUI:LootRim]` and `[QLR]` in `UE4SS.log` of the session.

## 7. Verdict

pass — the rim never shows on another cell after an F take on our build (B3–B5), the control shows the vanilla jump (B2). Left as it is: the rim is absent for
≈ 0.3–0.4 s after a take before it lights on its place (the owner's own way: invisible while it would flicker).
