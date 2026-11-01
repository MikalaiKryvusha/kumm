# Plan 40.6 — the 16:9 gate: every window we brought or changed, framed at 720p, 1080p, 2K and 4K full screen

> **Created:** 2026-11-01 · **Parent:** `plans/40_EPIC_conan_1.0.0_unfinished_six.md` phase 6 (criterion 6); plan 39 B5; HOUSE_RULES rule 17; plan 35 release gate
> **Status:** written 2026-11-01 by a helper agent; not started; runs after phases 1–3 (it frames the FINAL UI)
> **Outbound:** the frame sheets go to the owner's eye (review folder); a taste remark goes back as a fix in this phase

Basis, verbatim: `[OWNER]` 2026-10-31 09:32 «все наши моды в сборке, которые приносят или меняют UI, должны уважительно масштабироваться с разрешением игры в
стандартном ряду 16 к 9» · 2026-11-01 11:12 «релизный архив соберем и все документы обновим, когда сборку сделаем и протестируем на всех разрешениях 16 к 9».

## Goal vector (Achieve)

Each window was looked at in the resolution it was made in (mostly 4K, sometimes 1080p); the build has never been walked as a whole at 720p, 1080p, 2K and 4K.
Where we want to be: an inventory of every screen element we brought or changed, a frame of each at each of the four resolutions in true full screen, every text
readable (not smaller than the game's own text at that size), nothing cut, nothing overlapping; defects fixed and re-framed; the Windows-side windows (launcher,
installer and uninstaller consoles, the feedback waiting window) checked at the matching display scales.

## Acceptance criteria (scenario form)

1. **The inventory is complete.** Check: the report's element list = the union of (a) `KrinikConanUI` kit overrides and own assets (`KrinikConanUI.md` tables),
   (b) the UI sections of `KrinikConanUI` (FPS counter, HUD outline and temperature colour, blink, shout fade, feedback plate, mods-menu button and list, hub),
   (c) entries of `modpack.json` marked KRINIK MODIFIED whose edit touches UI (`grep -n "KRINIK MODIFIED" D:/work/ai_sandbox/ConanExiles/modpack.json` — 15 lines
   on 2026-11-01, each read), (d) the launcher, `install.cmd` / uninstaller console windows, the feedback collector's waiting window and address box.
2. **One scenario per element × resolution** (rows of the report's matrix).
   - Situation. The game in full screen at <R> (720p · 1080p · 2K · 4K); the element shown by the remote.
   - Action. The agent takes a frame of the game window.
   - Result. The frame is <R> pixels wide; every text of the element readable; no text cut at a box edge; no element over another.
   - Check. `capture-window.ps1 -Out <f>` then the frame's width read (`/c/Python314/python.exe -X utf8 -c "from PIL import Image;print(Image.open(r'<f>').size)"`)
     = <R> width; the agent's eye on the frame with a crop at 2× of each text block; the smallest text height in px measured ≥ the game's own smallest
     menu text in the same frame.
3. **Windows-side windows at display scales.** Situation: the launcher snapshot at DPI 96, 144, 192, 288 (100–300 %). Action: `KRINIK_LAUNCHER_SNAPSHOT=<out>;<dpi>`
   run of `bin/KrinikConanLauncher.exe`. Result: no clipped text, images not pixelated. Check: four PNG snapshots → WebP, looked at; sizes logged.
4. **Defects fixed.** Every `fail` cell has a fix commit and a re-frame `pass` at that resolution AND at 4K (no regression). Check: the matrix in the report.

## The stand (HOUSE_RULES rule 11)

| Part | Value | Set up by |
|---|---|---|
| Resolution | full screen at each R; the game writes `ResolutionSizeX` back on exit (DPI 300 % trap, report 2026-10-25) — restore the owner's 4K after | `pult.sh "exec r.SetRes 1280x720f"` · `1920x1080f` · `2560x1440f` · `3840x2160f` (used 2026-10-31 / 11-01); the last call 4K |
| World | a safe spot, noon, clear, no enemies; HUD visible (if the whole HUD stands hidden: `SetVisibility(4)` per widget — game map) | teleport, `SetTimeOfDay(12.0)` |
| Elements | each shown BY CODE: hub `ActivateModule('KrinikModSettings')`, inventory, corpse strip `strip-open.sh <tag>` (+ `corpse-stand.sh`), main / Esc menus (`esc-when-idle.ps1`), a shout (summoned humanoid), blink (food 8 %), temperature colours (heat / cold stages — recon the remote route used for review folder 47), tooltip (`hover-watch.ps1` — the game in front) | remote |
| Hero | god on; food / water 100 except the blink case | `god-on.sh` |
| Frames | game window content, WebP for keeping, native size | `capture-window.ps1`, `capture-burst.ps1` for animated elements |

## Steps

- [ ] 1. **Inventory** (≈ 1 h, offline): build the element list of criterion 1 into `testcases/TC_conan_16x9_gate_<YYYY-MM-DD>.md` (one row per element: how it
      is shown by code, which texts to check); read the KRINIK MODIFIED entries' `$comment` to keep only UI edits; the launcher TC
      `testcases/TC_conan_launcher_guide_button_2026-11-01.md` for its snapshot DPI set.
- [ ] 2. **Cases** in the same file: element × {720p, 1080p, 2K, 4K} cells `[NOT-TESTED]`, plus the four launcher DPI cells and the console windows.
- [ ] 3. **Run, one resolution at a time** (≈ 2 h): lock (`--what "epic40 p6 16x9" --minutes 120`), `launch-bg.ps1` (background is fine — the frames come from
      `PrintWindow`; tooltip cells need the game in front by `hover-watch.ps1`), world entry; `r.SetRes` to R; walk the element list by code; frames into
      `<scratch>/gate/<R>/<element>.webp`; per R a sheet (`burst-sheet.py` or a Pillow tile) for the agent's eye; status per cell the same move.
- [ ] 4. **Windows side** (≈ 0.5 h): launcher snapshots at 96 / 144 / 192 / 288 dpi; `install.cmd` and the uninstaller console on the fixture stand
      (`node tools/fixture-pack.mjs` builds one) at the owner's 300 % — a screenshot of the console; the feedback waiting window at 300 %.
- [ ] 5. **Fix pass** (≈ 1–3 h, unknown until the run): each fail fixed in its source (kit script + rebuild twice + `kit-buildmod.py`, a section, a mod's pak
      edit script), re-framed at that R and at 4K the same day.
- [ ] 6. **Owner's eye:** `НА ОТСМОТР НИКОЛАЕМ/<N> 16 на 9 все окна/` — one sheet per resolution + «что смотреть»; opened by `Invoke-Item` (folder).
- [ ] 7. Restore 4K (`r.SetRes 3840x2160f`), `close-game.ps1`, lock released; report `testcases/reports/<YYYY-MM-DD>_conan-16x9-gate.md` with the matrix.

### Packaging into the build (≈ 0.5 h, only for fixes)

- [ ] P1. Sources: the touched kit scripts and rebuilt paks under `ConanExiles/_unpacked/<Mod>/`, sections under `ue4ss/Scripts/`, launcher sources under
      `_config/launcher/` (rebuilt by `build_docs_and_launcher.cmd`).
- [ ] P2. `modpack.json`: touched entries' `version` text; `Deploy-ModPack.ps1 -PackDir D:/work/ai_sandbox/ConanExiles -Deploy -Only <Mod>` per mod, `-Verify` → 0.
- [ ] P3. Same commit (rule 20): the mods' notes, bug 64 items the fixes close, plan 39 B5, plan 35 release-gate row, the guide if a screen changed.
      Pack commit + push; KUMM commit + push.

## Risks

- (a) `r.SetRes` in a live session may not re-layout some widgets as a fresh launch at R would — one element per R also checked after a relaunch at R (set in
  `GameUserSettings.ini` before launch, restored after).
- (a) DPI 300 % makes the game write 1280 back — the owner's 4K restored and read back at the end.
- (b) Foreign mods' windows we did not edit are out of scope; a defect seen in them goes to epic 41 / bug 64, not fixed here.
- (c) Taste remarks after the sheets may reopen phase 1–3 work — the owner decides the order.

## Effort

≈ 5–8 h: inventory and cases 1 h · four-resolution run 2 h · Windows side 0.5 h · fixes 1–3 h · packaging 0.5 h; plus the owner's look.
