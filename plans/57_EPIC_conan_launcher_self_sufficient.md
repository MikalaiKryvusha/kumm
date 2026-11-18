# Plan 57 — EPIC: the Conan launcher works on its own: it finds the game, sees and downloads the build, installs it with a progress bar

> **Created:** 2026-11-18 · on the owner's words 2026-11-18 08:18–08:22 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-18 08:11)
> **Parent:** the launcher of epic 55 (`plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md`); the frame the owner questioned 08:12 (an impossible state on the stand)
> **Status:** 🔧 phase 0 — mockups in KUIPS shown 2026-11-18 08:29 (12 screens, `ConanExiles/_config/launcher/design/`), waiting for the owner's verdict
> **Outbound:** the owner's verdict on the mockups (phase 0 gate); release 0.9.1 does not ship before this launcher is done — read from the owner's question
> 2026-11-18 08:35 «сборку на гитхаб ты собрался какую отправлять? 0.9.1?! ОНА КОГОВА? ПО ЛАУНЧЕРУ ВСЕ СДЕЛАНО, ЧТО Я ПОЖЕЛАЛ?» (`[AI]` reading, said to him in chat)

## Goal vector (Achieve)

A player downloads only the launcher exe. The launcher finds Conan Exiles on the PC by itself, sees whether the files of the latest build release for that
game version already lie beside it, downloads them from GitHub when they do not, and installs the build into the clean game — every long process shown by a
progress bar in the game's colours with percentages, a download also with its amount, speed, remaining and elapsed time. No window of the launcher ever shows
two states that cannot both be true (the 08:12 frame: «Игра не найдена» together with «Удалить сборку» and a live «Играть»).

## Acceptance criteria

1. Game search. Situation: a PC where Conan Exiles lies in a Steam library on any drive, or in a standard Windows install folder. Action: the player starts the
   launcher from any folder (desktop, Downloads). Result: the window shows the game's folder and version without the player pointing at it. Check: a stand with
   a stub game in a fake Steam library (`libraryfolders.vdf`) on a second path; the launcher's log names the found folder; a frame of the window.
2. Several copies: each copy is listed with its version and state (clean / build installed / other mods); the player picks one. Check: stand with two stubs.
3. No game anywhere: the window says so and offers «Указать папку игры» (a Windows folder dialog). Check: stand with no stub; a frame.
4. Build files present beside the launcher (the latest release for the found game version, hashes match the release) → «Установить сборку» installs with no
   download. Check: stand with the parts beside; the feed log shows no asset request.
5. Build files absent → «Установить сборку» downloads the parts of the latest release built for the found game version, verifies them, unpacks and installs.
   Check: local test feed (`_config/launcher/test/feed.mjs`) serving parts; the log and the frames of each phase.
6. No release for the found game version → the window names the version the latest build was made for and installs nothing. Check: stand game version 3.2.0.
7. Every process (search, download, update, install) shows a progress bar with percentages; a download also shows «N из M ГБ», speed, remaining and elapsed
   time. Check: frames during each phase at 4K; the numbers move between two frames.
8. A broken connection keeps the downloaded parts and offers «Продолжить скачивание», which resumes. Check: the feed cut mid-part on the stand.
9. Window states come from the real state only: the stand-only flag `KRINIK_LAUNCHER_STATE` is removed; every stand state is built from real files.
   Check: `grep KRINIK_LAUNCHER_STATE` in the launcher source prints nothing; the stand cases still pass.

## Phases and gates

| Phase | What | Gate |
|---|---|---|
| 0 | Mockups of every state in KUIPS (`[OWNER]` 08:19 «рисуй макеты в KUIPS») | the owner's verdict on the sheet |
| 1 | Recon: where Conan Exiles installs (Steam `libraryfolders.vdf` and registry, Epic, standard folders), how the game version is read from the install, how a release names its game version, GitHub API limits | research doc in `researches/conan-launcher-self-sufficient/` |
| 2 | Game search + version + the state model (no impossible window), the stand cases | stand cases green, control red on 1.1.0 |
| 3 | Build files beside / download from GitHub with resume + progress bar | stand cases with the local feed, frames of each phase |
| 4 | Install / update through the same progress bar; texts by the owner's portrait | stand + one real install on a copy of the clean game |
| 5 | Judge rounds, release of the launcher | owner's word on the release |

## Found on the way (2026-11-18 08:1x) — the chain that this epic closes

- The stand forced `KRINIK_LAUNCHER_STATE=installed` with no game beside the exe; the window then showed «Удалить сборку» and a live «Играть» under «Игра не найдена».
- The installer's `README.txt` (KUMM `Deploy-ModPack.ps1` → `Write-BundleInstaller`) says «Unpack this folder anywhere», `install.ps1` asks for the game path, while
  the guide says «Распакуйте архив сборки в папку игры» and the launcher finds the game only up to 3 folders above itself. A build unpacked on the desktop
  installs, and the desktop shortcut then opens a launcher that never finds the game.

## Steps (phase 0)

- [x] KUIPS found (`D:\work\ai_sandbox\KUIPS`, 1.3.1); the launcher's KUIPS project `ConanExiles/_config/launcher/design/` — `mockups.html` (the window of
      mockup 11 + what the launcher gained later), `flow-map/flow-map.json`; `kuips shoot` (4K), `layout`, `build`, `check` 0 defects; sheet opened for the owner 08:29.
- [x] The owner's remarks 08:37–08:44 applied (chronicle entry 2026-11-18 08:11): several copies — a modal dialog with a scrolling list; the state as a
      bulleted grid (dot · label · value, values on one vertical, tabular figures, so changing numbers do not move the line); the gold CTA at the top of the
      column on a fixed place, the state under it, «Руководство» / «Отзыв» / «Удалить сборку» at the bottom; the update plate — 3 px metal frame, lighter
      background, the gold «Обновить сборку» centred. Sheet rebuilt and reopened 08:46, `check` 0.
- [x] 2026-11-18 09:3x: the mockup strings re-read with the owner's portrait loaded (rule 35): four seams fixed (a pronoun for a name, two colons in a
      line, a cause joined by a comma, a cognate repetition); pack `a6b9540` also carries the 08:37–08:44 iterations, which had stayed uncommitted.
- [ ] The owner's verdict → fix the mockups → phase 1 (recon helper running 09:3x → `researches/conan-launcher-self-sufficient/README.md` §2–3). <!-- attribution-ok: a step waiting for the owner's verdict, no decision of his is claimed -->

## Decisions made without the owner

`[AI]` (revisable, all shown on the mockups): the scan's progress counts drives; several copies are a pick list with version and state; no game → «Указать
папку игры»; install has no «Отменить» (a half-installed game), download and update do; «Отменить» keeps the downloaded parts; the progress bar sits in the
column above the bottom button, the gold face of «Играть» as its fill, percentages in its middle; numbers in Cambria (lining figures, as the version lines);
the mockup's numbers (6,8 ГБ, 18,4 МБ/с) are examples, not measurements; the built sheet and frames are not committed (`kuips shoot` + `build` rebuild them).
