# Test run report — Conan quick loot: the selection rim instant, our hide-the-rim patch off

**Created:** 2026-11-07 12:09 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** KrinikConanUI kit pak with `InventoryGridSlotView.AnimSelect` instant (built 11:21,
`kit-conanui-edit.py` GRIDSLOT block, `kit-conanui-edit.json` gridslot end 3.3e-5 s); Lua section `krinik_loot_rim` off

## 1. Work

Cases R1–R5 of `testcases/TC_conan_quick_loot_rim_instant_2026-11-07.md` — the owner's word of 2026-11-07 10:57 (verbatim in the TC).

## 2. Contour

The live game, the oasis save, god on; the game brought to the front by `mouse-seq.ps1` for each real input and the owner's window restored after (frames show
his VS Code before and after). REAL WORLD: accumulated — the owner's save; data and machine — his game folder; path — real Shift, wheel and F through Windows
input, the player's own path.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-07 11:12 +03:00 | `python -I -X utf8 _config/mod-overrides.py <out.tsv> "<game>/ConanSandbox/Mods"` | 0 · no mod ships `InventoryGridSlotView` |
| 2 | 2026-11-07 11:14 +03:00 | `UnrealEditor-Cmd … -Script=…/kit-probe-gridslot.py -ModDevKit -NullRHI` | 0 · AnimSelect 0.3 s (SelectIndicator opacity 0→1), AnimMouseOver 0.1 s |
| 3 | 2026-11-07 11:16–11:21 +03:00 | `UnrealEditor-Cmd … -Script=…/kit-conanui-edit.py -ModDevKit` + `kit-buildmod.py KrinikConanUI <out>` | 0 · ok True, AnimSelect end 3.3e-5 s; pak 15.5 MB |
| 4 | 2026-11-07 11:24–11:27 +03:00 | `bash loot-stand.sh` · `bash loot-aim.sh` · `SEQ="wait:800,wheel:-1,wait:700,wheel:-1,wait:900,kdown:F,wait:80,kup:F,wait:2200" bash loot-take-clip.sh rim1.mkv` | 0 · R1, R2 |
| 5 | 2026-11-07 11:41–11:44 +03:00 | the stand again, `corpse-fill.lua` | R3 not run (aim miss; a one-item corpse) |
| 6 | 2026-11-07 11:46–12:08 +03:00 | `KrinikConanUI.pak` renamed out of `<game>/ConanSandbox/Mods`, a fresh start, stand, a frame at open; renamed back | R5 |

## 4. Checks

- Hygiene: `kit-missing-refs.py` on `InventoryGridSlotView` — 5 /Game packages, 0 missing in the kit.
- Functional run: the real game, real input; READ — every 120 fps frame of `rim1.mkv` (672 frames) by `rim_yellow.py` (the rim's cells per frame), crops by eye
  (`rim_cells.webp`), the open-state frame of the control.

## 5. Found

- The rim moves in one frame and stays on its cell through an F take — the vanilla jump to the walk's last cell is gone with the instant `AnimSelect`, so the
  hiding patch (`krinik_loot_rim`) is no longer needed and is off.
- At open the window shows no rim until the first wheel step — the same with vanilla cells (R5), the game's own behaviour.

## 6. Traces

Session scratchpad: `rim1.mkv`, `rimf/` (frames), `rim_yellow.py`, `rim_cells.webp`, `ctl_open_win.webp`; `ConanExiles/_config/devkit/kit-probe-gridslot.json`,
`kit-conanui-edit.json`.

## 7. Verdict

pass for R1, R2 (the owner's two demands on the path walked); R3 (the last item) not run — partial coverage said aloud.
