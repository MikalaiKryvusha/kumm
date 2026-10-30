# Test cases — Conan intro: both logos for the whole load, a slow spinner under them

> **Created:** 2026-10-31 · **Parent:** plan 36 W26 · `researches/conan-intro-movie/README.md`
> **Status:** 2026-10-31 00:30 +03:00 — written before the first run
> **Outbound:** the look — the owner's eye

**Basis.** `[OWNER]` «показываем оба лого - оригинальный и нашей сборки и показываем на все время загрузки игры, а внизу под ними в центре крутим
спинер прогресса медленно» · 2026-10-31 00:12.

**Stand.** Game `D:\Games\Conan Exiles 3.0.1`, background path (`launch-bg.ps1`); the movie `_config/branding/intro/KrinikIntro.mp4` (150 s) deployed
as `Content/Movies/.mp4`; a frame series from the launch (`capture-burst.ps1`, 1 frame/s) and the moment the main menu appears (log + frame).
The user `Saved/Config/Windows/Game.ini` — the variable of case I3.

**Dimensions.** The movie file itself (I1), the frame on screen during the load (I2), when the load ends with the movie still running — the
two values of `bWaitForMoviesToComplete` (I3, I4).

| # | Case | Set-up | Expected | Status | Observation |
|---|---|---|---|---|---|
| I1 | the movie file | `make-intro.py` | 150 s, 3840×2160, both logos side by side, a 12-dot ring under them turning once per 4 s (frames at 0.3 s, 1 s, 3 s, 100 s) | pass | 2026-10-31 00:32 +03:00 ffprobe 150.0 s · 3840×2160 · 30 fps · 7.98 MB; the sheet: 0.3 s dim (fade-in), the head at the right (1 s), the left-top (3 s), the top (100 s = 25 turns) — both logos side by side, the ring under them |
| I2 | the movie on screen while loading | deploy, launch | frames of the load show the logos and the spinner | pass | 00:35 burst (dots spinner build): five frames of both logos + the ring, then ≈ 3 s black, then the menu |
| I3 | the movie cut by the end of the load | user `Game.ini` `[/Script/MoviePlayer.MoviePlayerSettings] bWaitForMoviesToComplete=False` | the main menu ≈ 40 s after launch, not after 150 s | pass | launch 00:34:56, the menu in the burst ≈ 00:35:33 (≈ 37 s) — the 150 s movie was cut; the section survived the game's rewrite of `Game.ini` on exit |
| I4 | control: the game's own setting | no user line (the game's `True`) | the main menu only after the 150 s movie — proves I3 is the setting's work | partial | second try 2026-10-31 00:59 +03:00 (launch 00:55:53, no line): the log differs from I3 — the engine ticked 315 frames under the movie before the menu widget opened (+42 s after the movie start), against 17 frames (+28 s) with the line: the game waits on the movie instead of loading straight through. Whether the movie kept the screen to 150 s — not seen: no frame; the owner closed the game at 00:59:10 («я закрыл»). The line restored, lock released |
| I5 | the wheel spinner (`[OWNER]` «не точками, а колесо с крутящимся спокойным фейдом» · 00:41) | `make-intro.py` rebuilt | a thin ring, a soft light going round clockwise once per 6 s | pass | crops at 1 / 2.5 / 4 / 5.5 s: the light at right / bottom / left / top-left, as computed; 150 s, 7.76 MB; deployed (md5 equal); on screen — the owner's next start |
