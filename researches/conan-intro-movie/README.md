# Research — a short logo intro while Conan Exiles 3.0.1 loads

> **Created:** 2026-10-30 · **Parent:** plan 36 W26 (`[OWNER]` «и если можно, было бы хорошо на загрузке игры показывать этот логотип как
> вступительный интро ролик, кратким фейдом пока и кратким фейдом сокрытие - пока грузится игра» · 2026-10-30 ≈09:3x)
> **Status:** recon done 23:3x; the mp4 route under test
> **Outbound:** —

## What the game does (observed)

- `ConanSandbox/Config/DefaultGame.ini` (inside `pakchunk0-Windows.pak`, read by `repak get`):
  `[/Script/MoviePlayer.MoviePlayerSettings] bWaitForMoviesToComplete=True · bMoviesAreSkippable=True · +StartupMovies=` — **the list is empty**:
  the engine plays no movie while it loads. The splash/intro `.bk2` files of `Content/Movies` are played by the main menu itself
  (`W_MainMenu_MainMenu` → `Image_BinkPlayer`); the pack's No-Intro-Splash replaces ten of them with 392-byte stubs.
- The user config `ConanSandbox/Saved/Config/Windows/Game.ini` (diff style, `;METADATA=(Diff=true, UseCommands=true)`) has no MoviePlayer section.
- No-Intro-Splash's archive also carries `StartupUE.mp4` and `SplashScreenMiddlewareLogos.mp4` (an older build) — startup movies of this game
  have been mp4 at some point.
- The devkit ships RAD's Bink 2 encoder `Engine/Binaries/ThirdParty/Bink/Bink2ForUnreal.exe` — a GUI tool by Epic's docs (no documented command line):
  https://dev.epicgames.com/documentation/unreal-engine/bink-video-for-unreal-engine

## Route

1. The intro as a movie in `Content/Movies/` named in the user `Game.ini`: `[/Script/MoviePlayer.MoviePlayerSettings] +StartupMovies=KrinikIntro`.
2. Format: try `KrinikIntro.mp4` (ffmpeg, no GUI) first; if the movie player of this build takes only Bink — `Bink2ForUnreal.exe` (a GUI step, run when
   the owner is not on the remote desktop) → `KrinikIntro.bk2`.
3. Shipping: a `files` mod in the pack (the movie) + the ini lines by the deploy, like `Engine.ini`.

## FORK

`FORK: options mp4 by ffmpeg | bk2 by the GUI encoder · price of error a black frame or nothing at start (reversible: one ini line) · consulted Epic's Bink
docs, the game's own DefaultGame.ini, No-Intro-Splash's archive` — the cheap reversible one is tried first.
