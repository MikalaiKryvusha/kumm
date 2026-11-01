# Test run report — «Настройки модов»: the list, the bar cleared, Esc in every mod window (plan 40.3 step 2)

**Created:** 2026-11-01 17:18 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles (uncommitted at the run; committed with this report), KrinikConanUI 1.0.0
section `krinik_mods_button` (list), `krinik_pause_in_menu` 0.16.0; eight mod paks rebuilt KRINIK MODIFIED (module rows)

## 1. Work

Plan 40.3 step 2 — the owner's debt of 2026-11-01 15:49 («она там одна должна остаться» · «настройки рыбалки и настройки интерфейса оттуда уходят» ·
«красная справа вертикальная по модам ксавьера - тоже уходит»): the inventory bar keeps only «Настройки модов»; its list «Моды Krinik'а · Моды Xevyr'а ·
Рыбалка · Прочее»; Xevyr and «Прочее» as sub-lists of the mods' own settings windows (the interim form — the owner's 13:40 decision wants our hub windows with
real rows, the next step). Cases B5–B14 of `testcases/TC_conan_mods_menu_button_2026-11-01.md`.

## 2. Contour

The live game Conan Exiles 3.0.1 in front (4K, 144 Hz TV), the live save (oasis spot, no enemies), god on, hunger and thirst refilled and frozen by the remote;
inventory by a real Tab, clicks by the real mouse (`mouse-seq.ps1`), Esc and Q/E by real keys. Machine lock `kumm` 16:26–17:16.
REAL WORLD: accumulated — the owner's live save and his settings files (the hub store, the mods' `.sav`) as they stood; data and machine — his machine and game
folder; path — the player's door: Tab → «Настройки модов» → entry → window → Esc. The 720p / 2K frames — not taken (plan 40 phase 6 gate).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 16:26 +03:00 | `powershell -File launch-fg.ps1` + `bash enter-world-remote.sh` + remote probes (`pult.sh "lua …"`) | probes: Xevyr side tab = `XCS_W_Container` (4 mods), a Lua-built VerticalBox of vanilla buttons in the bar's Overlay shows above the button and `IsHovered` sees the real cursor |
| 2 | 2026-11-01 16:30 +03:00 | `bash walk-mod-windows.sh <out> DN_UI_Settings PrP_Settings … IdeaPoet_EdAp_W_UI_MainMenu` | 15 windows framed: 12 usable; ModControlPanel empty, Pickup+ drawn in pieces, Edit Appearance not a settings window |
| 3 | 2026-11-01 16:36 +03:00 | deploy `-Only KrinikConanUI`, relaunch, B5, B6, B10, B11 (Hosav), B8 (Damage Meter) | B11 failed for Damage Meter: Esc closed the inventory too |
| 4 | 2026-11-01 16:39 +03:00 | live font probe `t:SetFont({…FontMaterial=f.FontMaterial…})` | the game crashed (ACCESS_VIOLATION in UE4SS); crash window closed, PID 33852 |
| 5 | 2026-11-01 16:43–16:49 +03:00 | live row edits `dt:ForEachRow(… row.Category / row.CloseOnESC …)` on modules not yet created + real Esc | Category Modal AND CloseOnESC true keep the inventory (SM, LLH, Night Terrors pass; PrP with Modal only, EAA with CloseOnESC only — fail) |
| 6 | 2026-11-01 16:50 +03:00 | `python patch-mod-asset.py build <Mod> …` for 8 mods (recipes `krinikBuild`), `Deploy-ModPack.ps1 -Deploy -Only <8 mods> KrinikConanUI` | all guards green; deploy 9/9, verify 108/108 |
| 7 | 2026-11-01 16:53 +03:00 | `bash esc_all.sh` (scratchpad: each of 12 windows by the real mouse through the list, then real Esc) | 12 of 12 pass |
| 8 | 2026-11-01 16:56–17:04 +03:00 | B12, B13, font and width fix redeploys, the batch again, tab cycles Q/E | 12 of 12 pass again; the Xevyr tab re-shown on returns — defect |
| 9 | 2026-11-01 17:13 +03:00 | `ffmpeg -f lavfi -i "ddagrab=output_idx=0:framerate=60" -t 12 …` during Tab, E, Q, E, Q | the tab visible ≥ 2 frames on the return from «Таланты» (birth + next tick build) |
| 10 | 2026-11-01 17:15 +03:00 | the same recording after the `Construct` post-hook build | no tab in any frame of the first open and two returns |

## 4. Checks

Hygiene: `lua -e "assert(loadfile(…))"` for both sections; `check-lua-templates.py` 0 findings; `check-lua-game-thread.py` 0; `py_compile patch-mod-asset.py`;
the builder's own guards per pak (control round trip, to-zen byte-identical, rows checked after write and in the zen chunk).
Functional run: the inventory bar, the list, both sub-lists and all 12 windows walked by the real mouse and keys in the live game; read — frames (1080p, 4K),
module states by the remote, the UE4SS log lines of the section, a 60 fps video of the right edge.

- B5 pass (after two failed builds of the Xevyr hide — see Found) · B6 pass · B7 pass · B8 pass · B9 pass · B10 pass · B11 pass (after the module row edit)
  · B12 pass · B13 pass · B14 skipped (not measured; the closed-inventory path is one boolean test).

## 5. Found

1. Esc in eight mod windows also closed the inventory under them — the rows' Category (Popup / Fullscreen) and CloseOnESC false; fixed natively (KRINIK MODIFIED
   module rows, `_config/krinik_patches/*UIModule*.tsv`, new row kind `rbool:` in `patch-mod-asset.py`).
2. The list's labels mixed two fonts in one word (Cardo SC capitals for Latin, a sans fallback for Cyrillic) — fixed: Noto Sans Normal set after every label.
3. The list was narrower than its button — fixed: SizeBox with the button's width as the minimum.
4. The Xevyr side tab came back after tab switches (the window is re-created and re-shown by its Open) and, with a birth hook, flashed for frames — fixed: the
   content `MenuContainer` collapsed in a post-hook of the window's `Construct`.
5. A UE4SS crash from `SetFont` with a freshly built table holding the old `FontMaterial` (my probe, not shipped code).
6. Seam left: the PIFC window now stands right of centre (it was left of centre as a Fullscreen row) — the window goes into our «Прочее» hub in the next step.
7. `god-on.sh` right after `enter-world-remote.sh` reported FAILED once (the hero not yet spawned); a retry after 10 s succeeded.

## 6. Traces

Frames and videos in the session scratchpad (`f/b5.jpg`, `b6c.jpg`, `b10b.jpg`, `b12a/b.jpg`, `f2.jpg`, `f3c.jpg`, `cyc.jpg`, `modal2.jpg`, `xev2.mkv`, `xev3.mkv`,
`xev3zoom.jpg`); the UE4SS log `…/ue4ss/UE4SS.log` lines `[KrinikConanUI:ModsButton]`, `[KrinikConanUI:PauseGameInMenu] Esc:`; the crash `ConanSandbox.log` 13:39:18 UTC.

## 7. Verdict

pass — B5–B13 seen working on the player's path in the live game at 1080p and 4K; B14 skipped; 720p / 2K frames belong to the release gate.
