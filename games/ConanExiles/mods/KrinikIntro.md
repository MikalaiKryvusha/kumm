# Mod notes — KrinikIntro (ours: the build's intro while the game loads)

> **Created:** 2026-10-30 · **Parent:** plan 36 W26 (`[OWNER]` «на загрузке игры показывать этот логотип как вступительный интро ролик, кратким
> фейдом пока и кратким фейдом сокрытие - пока грузится игра» · 2026-10-30 ≈09:3x; reworked by `[OWNER]` «показываем оба лого - оригинальный и нашей
> сборки и показываем на все время загрузки игры, а внизу под ними в центре крутим спинер прогресса медленно» · 2026-10-31 00:12 and «спинер загрузки
> сделать спокойнее, не точками, а колесо с крутящимся спокойным фейдом» · 00:41)
> **Status:** living notes · the both-logos movie seen on screen 2026-10-31 00:35 (dots spinner); the wheel spinner built 00:43, deployed, on screen — the owner's next start
> **Outbound:** —

**What it does.** A 150-second movie (3840×2160, 30 fps, H.264): black, the game's logo and ours side by side, under them a thin grey wheel along which a
gold run (the Conan logo's gold) goes round once in 6 s — a sharp front, the tail fading back into grey (`[OWNER]` 2026-10-31 01:12); fade in 0.6 s.
The engine cuts it when loading ends — so it stays on screen for the whole load.

## How it works (recon — `researches/conan-intro-movie/README.md`)

- The game's `DefaultGame.ini` (pakchunk0) has `[/Script/MoviePlayer.MoviePlayerSettings] +StartupMovies=` — one EMPTY entry; the engine's
  `WindowsMoviePlayer` (WMF, mp4) then opens `Content/Movies/.mp4` at start and logs «Unable to load movie: …/Movies/.mp4» when it is missing.
- The LIST cannot be changed by the user `Saved/Config/Windows/Game.ini` (tried 2026-10-30 23:33–23:35, `!…=ClearArray` too) — so the file is installed AS
  `ConanSandbox/Content/Movies/.mp4`.
- The BOOL can: `bWaitForMoviesToComplete=False` in the user `Game.ini` (the pack's `_config/Game.ini`) — with it the 150 s movie was cut at the end of the
  load, the main menu ≈ 37 s after launch (2026-10-31 00:35, a 1-frame/s burst). The game keeps the section when it rewrites the file on exit (moved to the top).
- Between the movie's end and the menu — ≈ 3 s of black (the menu itself still loading).
- The menu's own splash videos are another player: `WBP_SplashMoviePlayer` (5 Bink players, `Movies/Splash/*.bk2`, stubbed by No-Intro-Splash).
- A background frame (PrintWindow, `capture-burst.ps1`) DOES catch the startup movie (00:35).

## Where things are

- Source: pack `_config/branding/intro/KrinikIntro.mp4`, built by `_config/branding/make-intro.py` (the logo pair from `make-wallpapers.py`).
- Manifest: `KrinikIntro` (kind `files`), after No-Intro-Splash; the ini line — `_config/Game.ini`. Deploy: `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikIntro`.

## Open

- The control case (no ini line → the menu only after 150 s) was not run — the owner stopped the run at 00:41 (cases `testcases/TC_conan_intro_both_logos_2026-10-31.md`, I4).
- The ≈ 3 s black gap before the menu.
- The engine tries `.mp4` twice (start and ≈ 10 s later): the intro may show twice.
