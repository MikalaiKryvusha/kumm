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

## The owner's rework of 2026-10-31 00:12 — both logos for the whole load, a slow spinner under them

`[OWNER]` «показываем оба лого - оригинальный и нашей сборки и показываем на все время загрузки игры, а внизу под ними в центре крутим спинер
прогресса медленно» · 2026-10-31 00:12.

Recon 2026-10-31 00:29 +03:00 (web; no engine source in the kit):
- `FLoadingScreenAttributes` (Epic API docs, https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/MoviePlayer/FLoadingScreenAttributes):
  `bAutoCompleteWhenLoadingCompletes` closes the loading screen once loading is done; `PlaybackType` (normal / looped / loading loop);
  `bWaitForManualStop`; `MinimumLoadingScreenDisplayTime`.
- The startup movie is set up from the ini by `FDefaultGameMoviePlayer::SetupLoadingScreenFromIni` — `[AI]` from recall, NOT yet observed: it reads
  `bWaitForMoviesToComplete` and sets `bAutoCompleteWhenLoadingCompletes = !bWaitForMoviesToComplete`, PlaybackType stays normal. The game ships `True` —
  so a movie longer than the load BLOCKS the menu until it ends.
- A forum report (UE-33576, 2016, https://forums.unrealengine.com/t/startup-movies-and-loading-screens-are-interrupted-if-a-streaming-level-is-set-to-initially-loaded/364520):
  initially-loaded streaming levels cut startup movies short and make `bAutoCompleteWhenLoadingCompletes` moot — check on 3.0.1.

Route to try (cheap → dear): (1) one long movie (both logos + a slowly turning spinner baked into the frames, ≈ 2 min) and `bWaitForMoviesToComplete=False`
in the user `Game.ini` — observe: does the menu come at the normal time (the movie cut by the load) or after 2 min (the setting not read from the user ini);
(2) if the user ini is not read for it — the setting must come from the pak's `DefaultGame.ini` (a pakchunk patch: a heavier route, ask first).

## FORK

`FORK: options mp4 by ffmpeg | bk2 by the GUI encoder · price of error a black frame or nothing at start (reversible: one ini line) · consulted Epic's Bink
docs, the game's own DefaultGame.ini, No-Intro-Splash's archive` — the cheap reversible one is tried first.
