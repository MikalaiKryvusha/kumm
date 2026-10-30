# Run report — Conan: the white main-menu backdrop (bug 71), the main-menu logo, the both-logos intro

**Work.** Bug 71 (`[OWNER]` «ты видел, что в меню сломан фон?» · «все белое» · 2026-10-31 00:10) against `testcases/TC_conan_main_menu_white_bg_2026-10-31.md`
(M0–M4); the main-menu logo smaller and further right (`[OWNER]` 00:11); the intro reworked (`[OWNER]` 00:12, 00:41) against
`testcases/TC_conan_intro_both_logos_2026-10-31.md` (I1–I5).

**Contour.** Game `D:\Games\Conan Exiles 3.0.1` (3.0.1, 64 paks + Lua mods), background path; kit `F:\CEUE5Devkit` (`-ModDevKit`, active mod KrinikConanUI);
pack `D:\work\ai_sandbox\ConanExiles`; machine lock `kumm` 00:21–00:41.

**Runs.**
- 00:21:27 — `launch-bg.ps1` with an EMPTY `modlist.txt` → `capture-window.ps1` (M2).
- 00:22:30 — `launch-bg.ps1` with `modlist.txt` minus `KrinikConanUI.pak` → `capture-window.ps1` (M1).
- 00:27:20–00:29:40 — `UnrealEditor-Cmd … -run=PythonScript -Script=_config/devkit/kit-conanui-edit.py -ModDevKit` (exit 0, `ok: true`).
- 00:30:13–00:34:15 — `python -I -X utf8 kit-buildmod.py KrinikConanUI <scratch>/pak` (exit 0) → `mod-overrides.py` → `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` / `-Only KrinikIntro`.
- 00:30:45–00:32:25 — `make-intro.py` (dots spinner); 00:42:06–00:43:31 — `make-intro.py` (the wheel).
- 00:34:56 — `launch-bg.ps1 -HoldSec 3` + the user `Game.ini` line → `capture-burst.ps1 -Count 60 -IntervalMs 1000` from 00:35:08 (M4, I2, I3).
- `python -I kit-missing-refs.py <seven vanilla widget JSONs>` (red before the fix, green after).

**Checks.**
- Hygiene: `kit-conanui-edit.py` parses; the kit report reads both backdrop arrays back after the compile (6 + 6 paths, vanilla order); the guard
  `kit-missing-refs.py` red (exit 1, 12 refs) on the vanilla main menu before the placeholders, green (exit 0) on `W_IngameMenu` and after.
- Functional run: the real game's main menu, by the player's path (launch → menu), frames READ: M2 pass (desert backdrop, no paks), M1 pass (snowy
  backdrop without our pak — the cause), M4 pass (volcano backdrop with the fix, fire moving; our logo smaller and to the right); I1 pass (movie file
  150 s 4K, sheet read); I2 pass (both logos + spinner on screen during the load); I3 pass (menu ≈ 37 s after launch — the 150 s movie cut by the load);
  I4 blocked (the owner stopped the run 00:41); I5 pass (the wheel, crops read). M0, M3 skipped (reasons in the case file).

**Found.**
- Bug 71's cause: the kit has no `/Game/Movies`; the kit save of `W_MainMenu_MainMenu` wrote `BackgroundMovies` / `BackgroundMovieTextures` empty →
  `Image_BinkPlayer` kept its white brush. Fixed by placeholders outside CookInfo.
- The log line «MainMenuMoviePlayer.OpenSource called with null MediaSource» stands on good runs too — not evidence.
- A background frame catches the startup movie (the old claim that it does not is retracted).
- `launch-bg.ps1 -HoldSec 3` was too short: the foreground came back 0 times — the game window could take the owner's screen.
- ≈ 3 s of black between the intro and the menu.

**Traces.** Session scratchpad `bug71/` (M1_noUI.jpg, M2_nopaks.jpg, run4/ + run4_sheet.webp, intro_sheet.webp, wheel_sheet.webp, legacy/ + the widget JSONs);
`_config/devkit/kit-conanui-edit.json`; game log `ConanSandbox.log` 00:34:56–00:36:32 (clean exit by the menu's «Выйти» at 00:36:30, not the agent's).
Crash window: none.

**Verdict.** pass for bug 71, the logo place and the intro mechanics; partial for the intro as a whole — the control case I4 blocked, the wheel and the
logo size wait for the owner's eye.
