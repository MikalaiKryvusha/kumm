# Test cases — Conan main menu background is white (bug 71)

> **Created:** 2026-10-31 · **Parent:** `bugs/71_conan_main_menu_background_white.md` (the owner's debt, 00:10 demo)
> **Status:** 2026-10-31 00:20 +03:00 — written before the first run
> **Outbound:** —

**Basis.** `[OWNER]` «ты видел, что в меню сломан фон?» · «все белое» · 2026-10-31 00:10. Expected: the main menu shows the game's moving
backdrop behind the logos and the buttons, as the vanilla game does.

**Evidence before the runs.** The log line `MainMenuMoviePlayer.OpenSource called with null MediaSource` stands in `ConanSandbox_2.log` of
2026-10-30 12:29 too — ten hours BEFORE our main-menu override (pack `029881e`, ≈22:5x). So the override is not the only suspect.

**Stand.** Game `D:\Games\Conan Exiles 3.0.1`, background path (`launch-bg.ps1`), no world entry — the main menu is the place. Frame:
`capture-window.ps1 -Width 3840` ≈ 40 s after start (the menu is up), WebP. Variables are the mounted paks (`ConanSandbox/Mods/modlist.txt`,
the original copied to the scratchpad first and restored after the last case) and the intro file `Content/Movies/.mp4`.
Close: `close-game.ps1`; crash window — by PID.

**Dimensions.** Decision table over the two suspects of the bug (our pak · the intro file) plus the no-mod reference; a frame is the
observation (the frame of 23:29 is white like the owner's screen — the frame IS evidence here).

| # | Case | Set-up | Expected if that suspect is the cause | Status | Observation |
|---|---|---|---|---|---|
| M0 | the build as shipped | full modlist, `.mp4` present | white (reproduces the owner's screen) | skipped | the frame of 2026-10-30 23:29 (review folder 14, «3 главное меню…») is all white — the same build |
| M1 | without our UI pak | modlist minus `KrinikConanUI.pak` | backdrop moves → our override is the cause | pass | 00:23 frame: snowy peaks and pines behind the menu — our pak is the cause |
| M2 | no mod paks at all | empty modlist | backdrop moves → some pak is the cause; white → the install, the intro file or a loose-file mod | pass | 00:22 frame: desert with braziers behind the menu; the log's «null MediaSource» line stands on this good run too |
| M3 | no paks, no intro file | empty modlist, `.mp4` moved to the scratchpad | backdrop moves → the intro file | skipped | M2 had the `.mp4` in place and a live backdrop — the intro file is innocent |
| M4 | the fix, as shipped | full modlist with the fix | the backdrop moves | pass | 00:35 burst, 35 frames of the menu: a volcano backdrop with red trees, fire changing frame to frame; our logo smaller and further right; the pak carries 7 overrides + the logo, no `/Movies` placeholder (`mod-overrides.py`); the modlist byte-equal to the original |
