# Run report — Conan 3.0.1, 2026-10-28 23:46 – 2026-10-29 00:50: quick-loot strip and hold prompt, spread bars, palm shadows

**Created:** 2026-10-29 00:51 +03:00 · **Run by:** the agent (claude-opus-5-5) · **Version/build:** pack commits 9b5ffcd → 24a500e

## 1. Work

STATUS queue (0a) item 35 strip after «Забрать все», (0b) item 34 «Q Забрать все (удерживайте)», the owner's words of 00:2x — spread bars
returned, corpse prompt on two lines, palm leaf shadows flicker (bug 67). Cases — `testcases/TC_conan_loot_panel_hidden_and_hold_prompt_2026-10-28.md`
(P1–P5, B1–B5, L1–L6, SB1–SB4, T1–T3), C1 of `TC_conan_corpse_prompt_left_of_quickloot_2026-10-28.md`.

## 2. Contour

`D:\Games\Conan Exiles 3.0.1`, the agent's own runs under the machine lock (kumm), game in the background, pult `KrinikAgentRemote`, real input
`mouse-seq.ps1` after `wait-input-idle.ps1`. Stand: wildlife only (exact classes `BP_NPC_Wildlife_KappaBaby_C`, `BP_NPC_Wildlife_Crocodile_C`), god
mode, the dialogue NPC 6 m away left alone. Builds: `KrinikUIFixes` 1.0.x → 1.1.0 (pak + Lua), `KrinikConanArchery` (bars on crosshair creation),
`Game.locres` override (reverted), `Engine.ini` solar delta 2.0. The bug-67 control look was the owner's, in the agent's run.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-28 23:47 | `launch-bg.ps1`, `enter-world-remote.sh`, pult `SlotTakeAll()` / `SetVisibility(1)` | P1–P5; crash 23:52:22 on my stale `_G` actor (EXP-0367), reporter PID 57076 closed |
| 2 | 2026-10-29 00:03 | `UnrealEditor-Cmd … -Script=kit-uifixes-edit.py`, `kit-buildmod.py KrinikUIFixes`, `Deploy-ModPack.ps1 -Deploy -Only KrinikUIFixes` | B1–B5 pass |
| 3 | 2026-10-29 00:16 / 00:21 | Lua half 1st and 2nd build, real Q hold `mouse-seq.ps1 -Seq "kdown:Q,wait:1600,kup:Q"` | 1st: L2/L4 fail; counters → native `SlotItemAddedOrRemoved`; 2nd: L1–L4 pass |
| 4 | 2026-10-29 00:33 | `Deploy-ModPack.ps1 … -Only "Krinik Russian Translation"` (override), corpse frame | T1 fail (layout) → reverted 00:38 |
| 5 | 2026-10-29 00:35 / 00:37 | real `mdown`, `rdown`, `ldown` | bars not seen (SB1/SB2) |
| 6 | 2026-10-29 00:40 / 00:44 | fresh launch frame; crosshair-creation hook build | bars REPRODUCED at entry (`sh0.jpg`); SB4 pass |
| 7 | 2026-10-29 00:41 – 00:46 | pult `exec DynamicSky.SolarUpdateAngleDelta 2.0` / `0.003` | owner: «ну сейчас словно тени в порядке» / «да, вернулось» |
| 8 | 2026-10-29 00:50 | `Deploy-ModPack.ps1 … -WithEngineIni`, relaunch, `grep SolarUpdateAngleDelta ConanSandbox.log` | `Set CVar [[DynamicSky.SolarUpdateAngleDelta:2.0]]` after the group's 0.015 |

## 4. Checks

- **Hygiene:** `check-lua-game-thread.py` 0 before every Lua deploy; kit edit reports `ok: true`; `Deploy-ModPack -Verify` lines 97/0, 99/0;
  locres regress 54441 → 54442, 0 lost, 0 changed.
- **Functional run:** the game in the background, read from 4K/1080 frames, the pult and UE4SS.log; real Q / RMB / MMB / LMB input. Item 34 —
  B1–B5 pass. Item 35 — L1–L4 pass, L5 partial (handler below `os.clock` resolution; A-B frame time not taken), L6/C1 equivalent. Bars — SB4 pass
  after reproduction. Prompt two lines — T1 fail (layout). Bug 67 — the owner's eye both ways.

## 5. Found

- Item 35 root cause: `Overlay_Main` spans the screen; `Left` pinned the strip to the screen edge on corpses without loot (our build-2 regression).
- The blueprint inventory handlers never fire on a corpse; only native `QuickLootPanel:SlotItemAddedOrRemoved` does.
- Spread bars show with the bow in hand right after the world loads (not on a draw).
- The corpse prompt widget lays out «text · icon · text» in one row — a `\n` cannot move «или нажмите» under it.
- Bug 67: the pack's `DynamicSky.SolarUpdateAngleDelta = 0.003` caused the palm shadow flicker.
- My stand crashed the game once (a dead actor touched from `_G`).

## 6. Traces

Frames and bursts — `D:/Temp/claude/lp/` (`p1_*`, `p2_collapsed`, `b1*`, `b2`, `l2*`, `l3_strip`, `l4*`, `t1_strip`, `sh0`, `bars_*`, `sb_*`); crash folder
`Saved/Crashes/UECC-Windows-804E1B454ED70826F8D1D1A624A0097A_0000`; recon `researches/conan-shadow-flicker/2026-10-29_recon.md`.

## 7. Verdict

partial — items 34, 35, the bars and bug 67 pass on their cases; the two-line prompt failed and is reverted; L5's frame-time A-B and the old cases
F4, F5, S3, H2, H3, SB3 are not run.
