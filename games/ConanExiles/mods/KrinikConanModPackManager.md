# Mod notes — KrinikConanModPackManager (ours: the build's organisation — the health line, the main menu, the loading intro)

> **Created:** 2026-10-31 · **Parent:** `[OWNER]` 2026-10-31 16:48 «KrinikIntro · KrinikConanModPackStatus — вот это все организационные вопросы» · «Я предлагаю их
> объединять в KrinikConanModPackManager»; before: `ConanModPackStatus` (renamed `KrinikConanModPackStatus` at 16:3x, HOUSE_RULES rule 19) and `KrinikIntro`
> (plan 36 W26). Merged from both notes files (KrinikIntro.md removed, its text below).
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** One mod, two halves (one manifest entry, two install steps):
1. **Lua** (`_unpacked/KrinikConanModPackManager/ue4ss/` → `ue4ss/Mods/KrinikConanModPackManager`): the main-menu line «is my build alive?» — its presence proves the
   UE4SS Lua loader runs, its text says how many of the build's pak mods the game mounted (read from `ConanSandbox.log` mount lines, never by scanning engine
   objects); the main menu set-up by `config.lua` (the offline-play modal removed, the news frame, the HUD scale ×1.25 of Hosav); the interface probe
   (`probe_widget_prefix`). `MOD_NAME = "KrinikConanModPackManager"`, log prefix `[KrinikConanModPackManager]`. History: the first version (2026-09-08) crashed the game
   by constructing a TextBlock — the mod only changes the text of an existing label.
2. **The loading intro** (`_unpacked/KrinikConanModPackManager/intro/KrinikIntro.mp4` → `ConanSandbox/Content/Movies/.mp4`): a 150-second movie (3840×2160, 30 fps,
   H.264): black, the game's logo and ours side by side, under them a thin grey wheel with a gold run going round once in 6 s; fade in 0.6 s. The engine cuts it when
   loading ends — it stays on screen for the whole load. Built by `_config/branding/make-intro.py` (writes straight into the mod's `intro/` since 2026-10-31).

## The intro — how it works (recon `researches/conan-intro-movie/README.md`)

- The game's `DefaultGame.ini` (pakchunk0) has `[/Script/MoviePlayer.MoviePlayerSettings] +StartupMovies=` — one EMPTY entry; `WindowsMoviePlayer` (WMF, mp4) then
  opens `Content/Movies/.mp4` at start and logs «Unable to load movie: …/Movies/.mp4» when it is missing.
- The LIST cannot be changed by the user `Saved/Config/Windows/Game.ini` (tried 2026-10-30 23:33–23:35, `!…=ClearArray` too) — so the file is installed AS `.mp4`.
- The BOOL can: `bWaitForMoviesToComplete=False` in the pack's `_config/Game.ini` — the 150 s movie is cut at the end of the load (menu ≈ 37 s after launch, 2026-10-31 00:35).
- Between the movie's end and the menu — ≈ 3 s of black. The menu's own splash videos are another player (`WBP_SplashMoviePlayer`, stubbed by No-Intro-Splash).
- A background frame (PrintWindow, `capture-burst.ps1`) DOES catch the startup movie.

## The owner's live config

`config.lua` in the GAME folder (12.9 KB) is the owner's; any redeploy that recreates the folder carries it over (done at both renames 2026-10-31, byte-equal).

## Checks

- 2026-10-31 16:41 (as KrinikConanModPackStatus): «СБОРКА: моды 66/66 (эталон 66 модов)». The merged mod — see the run of 16:5x in STATUS.

## Open (from the intro)

- The control case (no ini line → the menu only after 150 s) not run (`testcases/TC_conan_intro_both_logos_2026-10-31.md`, I4); the ≈ 3 s black gap; the engine tries
  `.mp4` twice (start and ≈ 10 s later) — the intro may show twice.
