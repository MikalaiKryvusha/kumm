# Mod notes — KrinikIntro (ours: the build's logo intro at game start)

> **Created:** 2026-10-30 · **Parent:** plan 36 W26 (`[OWNER]` «на загрузке игры показывать этот логотип как вступительный интро ролик, кратким
> фейдом пока и кратким фейдом сокрытие - пока грузится игра» · 2026-10-30 ≈09:3x)
> **Status:** living notes · built 2026-10-30 23:3x, the movie player opens it (log); on-screen look — the owner's eye
> **Outbound:** —

**What it does.** A 3-second movie (3840×2160, H.264, black with the «KRINIK MOD PACK» logo, fade in 0.6 s, fade out 0.8 s) that the engine plays
while the game loads.

## How it works (recon — `researches/conan-intro-movie/README.md`)

- The game's `DefaultGame.ini` (pakchunk0) has `[/Script/MoviePlayer.MoviePlayerSettings] +StartupMovies=` — one EMPTY entry; the engine's
  `WindowsMoviePlayer` (WMF, mp4) then opens `Content/Movies/.mp4` at start and logs «Unable to load movie: …/Movies/.mp4» when it is missing.
- `MoviePlayerSettings` is a defaultconfig class: the user `Saved/Config/Windows/Game.ini` does NOT change the list (tried 23:33–23:35, `!…=ClearArray` too).
- So the file is installed AS `ConanSandbox/Content/Movies/.mp4` — no ini edit. With it present the log has no load error (23:36).
- The menu's own splash videos are another player: `WBP_SplashMoviePlayer` (5 Bink players, `Movies/Splash/*.bk2`, stubbed by No-Intro-Splash).

## Where things are

- Source: pack `_config/branding/intro/KrinikIntro.mp4`, built by `_config/branding/make-intro.py` from `_config/branding/krinik-modpack-logo.webp`.
- Manifest: `KrinikIntro` (kind `files`), after No-Intro-Splash. Deploy: `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikIntro`.

## Open

- Seen on screen: not yet — a background frame (PrintWindow) does not catch video; the owner's eye at the next start.
- `bWaitForMoviesToComplete=True` in the game's ini: the 3 s may add to the start time if loading is faster than 3 s.
- The engine tries `.mp4` twice (start and ≈ 10 s later): the intro may show twice.
