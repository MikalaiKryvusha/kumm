# Plan 41 · phase 5 — hub and menu motion: tab text jitter, the hub «пляшет», late elements, the Hosav button, the late emblem, the map hint

> **Created:** 2026-11-01 · **Parent:** `plans/41_EPIC_conan_1.0.0_defects_and_stability.md` phase 5; bug 64 rows 5, 6, 15, 16, 17 (class A rest), 26 — those phase 1
> leaves open; `[OWNER]` 2026-10-26 «явный признак того, что моды построены на перехватах и инжекциях НЕПРАВИЛЬНО» · 2026-10-29 «этот какой-то один блять общий класс проблем!»
> **Status:** written 2026-11-01 13:30 +03:00; not started; runs AFTER epic 40 phase 3 (the inventory button changes the hub's bottom bar)
> **Outbound:** the owner's eye on the 60 fps clips (his own clicks are the final check of motion)

## Goal vector (Achieve)

The hub and the menus must open and switch tabs like the vanilla game: everything in the first full frame, no width jump, no element appearing late or
lingering a frame on the wrong tab. Rows 16, 17 (late injection), 26 were fixed on 2026-10-29 and the bottom bar was accepted by the owner's eye
(«да, суппер с кнопками»); row 6 (tab text jitter), row 15 (the whole hub «пляшет») and class A of row 17 beyond the tooltip were never closed. Where we
want to be: a 60 fps clip of our build next to the same clip of a game without our paks shows no motion that the vanilla game does not have.

## Acceptance criteria

1. **Baseline.** Situation: the game WITHOUT the build's paks and Lua (a clean profile — recon in step 2), hub open. Action: E ×8, Q ×8, 1.2 s each; the Esc
   menu tabs. Result: a 60 fps clip of the vanilla motion. Check: the clip file; the per-switch frame sheet.
2. **Build vs baseline.** Situation: the build, the same stand. Action: the same keys. Result: per switch, no element of a mod later than the vanilla elements by
   more than one frame (16.7 ms), no width change absent from the baseline. Check: per-switch sheets side by side; `burst-strip.py` strips of the bottom bar
   and the tab row; the frame numbers written in the case.
3. **Each row named.** Rows 5, 6, 15, 16, 17, 26: each closed by its frames (or reopened with the cause). Check: the row's text in bug 64.
4. **Fix seen.** Situation: a defect of ours found in 2. Action: fix, relaunch, the same clip. Result: the defect gone, nothing new. Check: the before / after
   sheets in the review folder.
5. **No CPU cost.** A fix done in Lua runs on a game event only. Check: `check-lua-game-thread.py` 0; the section's minute summary (rule 7).

## Stand (house rule 11)

- Machine lock (≈ 90 min — two game profiles); the game in FRONT for the clips (ddagrab captures the screen): `launch-fg.ps1`, or `launch-bg.ps1` and the game
  raised only for the 30-s clip after `wait-input-idle.ps1 -Min 10` — the path is the owner's word (house rule 16).
- Clip: `ffmpeg -f lavfi -i ddagrab=framerate=60:draw_mouse=0 -c:v h264_nvenc -t 30 <out>.mp4` (57 fps measured 2026-10-29; `gdigrab` gives 15 fps at 4K — not used).
- Keys by `mouse-seq.ps1` (real E / Q, 1.2 s apart); hero standing in a clear place (`tp_ground.sh`), god on, no enemy near (rule 11.6 — a hit mid-clip voids it).

## Steps

- [ ] 1. **RECON — scope.** The rows phase 1 left open and their «before» clips; KrinikPauseGameInMenu / KrinikConanUI notes (`games/ConanExiles/mods/KrinikConanUI.md`)
      for what our Lua does on `XCS_Panel` / `CarouselWindow` events today.
- [ ] 2. **RECON — the clean baseline.** How to start 3.0.1 without the build: recon — `Deploy-ModPack.ps1` has an undeploy / a second game profile? (`.\Deploy-ModPack.ps1
      -Help` or the script's param block); else `modlist.txt` emptied and `ue4ss` disabled for one launch (both restored by `-Deploy` + `-Verify` after). Write
      the found route as one line in `games/ConanExiles/GAME_ARCHITECTURE_INTERNAL_MAP.md`.
- [ ] 3. **Case file** `testcases/TC_conan_hub_menu_motion_<date>.md` — baseline cases, build cases per row, stand first.
- [ ] 4. **TEST — baseline then build** (clips + sheets, `ffmpeg -vf "select=..."` frame extraction, `burst-sheet.py` labels in ms).
- [ ] 5. **RECON — causes** (only for motion absent from the baseline): class A — `AutoWrapText` taking the previous frame's width (row 17: the vanilla
      `W_ItemIconTooltipView` was this), key glyphs `W_HotkeyIcon_C` born ≈ 170 ms after the buttons (row 17), a mod widget injected on a delay
      (`Delay` constants, `kismet-trace.py`); row 6 — the menu tab buttons' text (which widget: `dump` by the remote during a switch).
- [ ] 6. **FIX** — native first (rule 8): wrap off / fixed width in the widget asset through the kit (`KrinikUIFixes`, `kit-uifixes-edit.py`) or the mod's
      pak (`flt:` Delay → 1e9 + birth on the native event as rows 16/17 did); Lua only on a native event (`CarouselWindow` Next/Prev/SetCarouselIndex,
      `XCS_Panel`), never a timer.
- [ ] 7. **TEST the fix** — the same clip after `rebuild-krinik-paks.py --install` / `-Deploy -Only`; before / after sheets.
- [ ] 8. **PACKAGING** — paks into `ConanExiles/_krinik-modified/<id>` (or the kit mod `KrinikUIFixes`); `modpack.json` notes; Lua mods bumped in version
      (`KrinikConanUI` section version + its notes); `.\Deploy-ModPack.ps1 -Deploy -Only "<Mod>" -PackDir D:\work\ai_sandbox\ConanExiles`; `-Verify`.
- [ ] 9. **Run report** `testcases/reports/<date>_conan-hub-menu-motion.md`; review folder «НА ОТСМОТР НИКОЛАЕМ/<N> хаб движение/» (clips + sheets, «что
      смотреть»); same commit: bug 64 rows 5, 6, 15, 16, 17, 26, the mod notes, plan 39 C, the guide if it describes the hub.

## Risks

- (a) Part of the dance is vanilla (the 2026-10-29 note: «vanilla or ours — not yet compared with a game without paks») — the baseline decides; vanilla motion is
  written down and shown, fixed only by the owner's word.
- (a) The clean-baseline route may disturb the deploy — `-Verify` after restoring is mandatory before any other phase runs.
- (b) Epic 40 phase 3 rebuilds the bottom bar — if it lands after this phase, the bottom-bar clip is re-run.
- (b) The owner's eye sees motion at 144 Hz that a 57 fps clip may miss — his clicks remain the last check (memory «мерцание UI — видео 60 к/с»).

## Decisions made without the owner

(filled at the phase's close)
