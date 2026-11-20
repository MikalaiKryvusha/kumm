# Plan 57 — EPIC: the Conan launcher works on its own: it finds the game, sees and downloads the build, installs it with a progress bar

> **Created:** 2026-11-18 · on the owner's words 2026-11-18 08:18–08:22 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-18 08:11)
> **Parent:** the launcher of epic 55 (`plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md`); the frame the owner questioned 08:12 (an impossible state on the stand)
> **Status:** 🔧 phases 2–4 BUILT, verification PARTIAL 2026-11-18 16:03 +03:00 (pack `590495e`, run report `testcases/reports/2026-11-18_conan-launcher-self-sufficient.md`:
> criteria 1–11 pass on stand builds, the 16:00 fixes not re-run on the final exe, 12 computed only, 13 not run, the language dropdown not built; 13 mockup screens
> since the dropdown screen «language», pack `09d5c40`). Phase 0 GATE PASSED 2026-11-18 15:03 +03:00 — the mockups ACCEPTED by the owner with one condition: the Russian of their strings is rewritten
> (`[OWNER]` 2026-11-18 15:03, verbatim — `PROJECT_HISTORY.md` entry 2026-11-18 15:03); mockups in KUIPS shown 2026-11-18 08:29 (12 screens, `ConanExiles/_config/launcher/design/`)
> (his remarks 10:04 and 10:06 applied); phase 1 recon COMPLETE 2026-11-18 10:10 +03:00 — `researches/conan-launcher-self-sufficient/README.md`, its last open item closed by a
> read-only probe: the game's CL is in `ProductVersion` of the Shipping exe (1.1 ms), no 200 MB scan needed
> **Outbound:** the owner's verdict on the mockups (phase 0 gate); release 0.9.1 does not ship before this launcher is done — read from the owner's question
> 2026-11-18 08:35 «сборку на гитхаб ты собрался какую отправлять? 0.9.1?! ОНА КОГОВА? ПО ЛАУНЧЕРУ ВСЕ СДЕЛАНО, ЧТО Я ПОЖЕЛАЛ?» (`[AI]` reading, said to him in chat)

## Goal vector (Achieve)

A player downloads only the launcher exe. The launcher finds Conan Exiles on the PC by itself, sees whether the files of the latest build release for that
game version already lie beside it, downloads them from GitHub when they do not, and installs the build into the clean game — every long process shown by a
progress bar in the game's colours with percentages, a download also with its amount, speed, remaining and elapsed time. No window of the launcher ever shows
two states that cannot both be true (the 08:12 frame: «Игра не найдена» together with «Удалить сборку» and a live «Играть»).

## Acceptance criteria

1. Game search. Situation: a PC where Conan Exiles lies in a Steam library on any drive, or in `X:\Games\<any name>` on any fixed drive (the owner
   2026-11-18 10:04: copies are often installed in `C:\Games` or `D:\Games` — searched right after Steam), or in a standard Windows install folder. Action: the player starts the
   launcher from any folder (desktop, Downloads). Result: the window shows the game's folder and version without the player pointing at it. Check: a stand with
   a stub game in a fake Steam library (`libraryfolders.vdf`) on a second path; the launcher's log names the found folder; a frame of the window.
2. Several copies: each copy is listed with its version and state (clean / build installed / other mods); the player picks one. Check: stand with two stubs.
3. No game anywhere: the window says so and offers «Указать папку игры» (a Windows folder dialog). Check: stand with no stub; a frame.
4. Build files present beside the launcher (the latest release for the found game version, hashes match the release) → «Установить сборку» installs with no
   download. Check: stand with the parts beside; the feed log shows no asset request.
5. Build files absent → «Установить сборку» downloads the parts of the latest release built for the found game version, verifies them, unpacks and installs.
   Check: local test feed (`_config/launcher/test/feed.mjs`) serving parts; the log and the frames of each phase.
6. No release for the found game version → the window names the version the latest build was made for and installs nothing. Check: stand game version 3.2.0.
   The screen gives the player NO further hint (`[OWNER]` 2026-11-18 16:18 «ничего»). The launcher's own version is 1.0.0 (`[OWNER]` 2026-11-18 16:18 «номер лаунчера:
   1.0.0, так как это его первое появление на свет будет»; manifest and mockups changed, pack `eec880b`).
7. Every process (search, download, update, install) shows a progress bar with percentages; a download also shows «N из M ГБ», speed, remaining and elapsed
   time. Check: frames during each phase at 4K; the numbers move between two frames.
8. A broken connection keeps the downloaded parts and offers «Продолжить скачивание», which resumes. Check: the feed cut mid-part on the stand.
9. Window states come from the real state only: the stand-only flag `KRINIK_LAUNCHER_STATE` is removed; every stand state is built from real files.
   Check: `grep KRINIK_LAUNCHER_STATE` in the launcher source prints nothing; the stand cases still pass.
10. Languages (`[OWNER]` 2026-11-18 15:08, verbatim — `PROJECT_HISTORY.md` entry 2026-11-18 15:03): every player-visible string comes from a per-language table
    (Russian and English; `[AI]` the set said to the owner in chat 15:09, open to his word); a language switch stands to the left of the block of the window buttons
    and the version plate (mockup element `.lang`). Action: the player picks the other language. Result: the whole window re-renders in it at once, no restart;
    every state screen fits at 720p–4K. Check: a grep of the launcher source finds no player-visible Cyrillic or English literal outside the tables; frames of
    every state in both languages.
11. The first start follows the Windows UI language (ru → Russian, any other → English, `[AI]` fallback); a choice the player made is saved and every later start
    opens in it. Check: stand runs with `CurrentUICulture` ru-RU, en-US, de-DE and no saved choice; then a switch, a restart, the saved language; the save lands in
    the launcher's state location (`KRINIK_LAUNCHER_STATE_DIR` on the stand), never in the owner's AppData.
    The switch is a DROPDOWN (`[OWNER]` 2026-11-18 15:55 «выпадайкой, так как языков будет МНОГО в будущем»): the closed field shows the current code and a
    chevron; the list opens down from the field over the window, each language named in itself; mockup screen `language`.
12. The window opens CENTRED on the desktop working area of its monitor, the whole window inside the screen (`[OWNER]` 2026-11-18 15:56 «нужно, чтобы он по центру
    работчего стола открывался. А то сейчас как-то внизу справа открывается обрезанный краями экрана»). Check: starts at 100 %, 200 %, 300 % scale and 720p / 1080p /
    4K — the window rect lies inside `Screen.WorkingArea` and its centre is the area's centre ±2 px; the log line names both rects.
13. A normal start always has its taskbar button with the build icon (`[OWNER]` 2026-11-18 15:55 «как так лаунчер запущен, что у меня в винде на панели задач нет
    иконки???»); only the frames stand is invisible — its window never intersects a monitor (the owner saw stand windows on his screen 15:55; one, 10 min old, was
    stopped by PID). Check: a normal start → the taskbar button exists (UI Automation); a frames run → the window rect intersects no `Screen.AllScreens` bounds.

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
- [x] 2026-11-18 10:24 +03:00: the owner's remarks 10:16–10:20 applied (pack `92a661d`): the version line 8 px lower in a light plate; no state list on `installed` and
      `update` (the versions stand under the logos, the path distracts the player); the sheet is one left-to-right row (rule 34.4). Phase 2 carries the
      plate and the bare column into `KrinikConanLauncher.cs` (today the real launcher still draws the line at `LVER_GAP` 6 with no plate).
- [ ] The owner's verdict → fix the mockups → phase 1 (recon helper running 09:3x → `researches/conan-launcher-self-sufficient/README.md` §2–3). <!-- attribution-ok: a step waiting for the owner's verdict, no decision of his is claimed -->

## Steps (phases 2–4) — the helper session of 2026-11-18 15:07–16:02

- [x] 2026-11-18 16:01 +03:00: game search, CL, copies, the state model, RU / EN table, KUIPS column, download / parts beside / bundle beside, resume, the bar,
      hidden installer with mod count, window placement — pack `590495e` (pushed). Run report `testcases/reports/2026-11-18_conan-launcher-self-sufficient.md`.
- [ ] Full re-run on the final exe: `bash .work/launcher57/batch1.sh` with `CASES` = all 16 plan-57 cases, then `shots.sh` (the 16:00 fixes are not re-run).
- [ ] The language DROPDOWN (`[OWNER]` 2026-11-18 15:55, passed by the main session): replace `LangSwitch` (`KrinikConanWidgets.cs`) by a field «RU ▾» at
      top 18 / right 110 / height 28 and a list opening down (top 50, right 110, width 176) «Русский  RU», «English  EN», the current with the gold left bar —
      geometry from the mockup screen `language` of `design/mockups.html`.
- [ ] C13 (a visible normal start: taskbar button + icon, centred) — only with the owner away; K1 control on `c05aa51` (`.work/launcher57/old/`); X1 regression
      `batch58.sh`; the release body marker `<!-- krinik-game: <v> CL-<n> -->` in the release tooling (epic 55 D); R2 a real install on a copy of the clean 3.1.1.
- [x] 2026-11-18 18:2x: the language DROPDOWN built (`LangSwitch` field «RU ▾» + `LangList` / `LangItem`, the mockup screen `language`; closed by a pick, a second
      press, Esc, a click outside, the window going to the background); stand case `lang` LG1–LG4 25 / 25, the open-list frame matches the mockup (place, width,
      row height); not carried: the list's drop shadow (a transparent WinForms edge shows only the window picture, not the version plate beside it — rule 23).
- [x] Judge round 1 on `c05aa51..21075fb` (2026-11-18 18:32, report `reports/2026-11-18_judge_launcher_c05aa51_21075fb.md`), each finding verified in the code:
      D1 the reference copy — FIXED by `never.txt` in the launcher's state folder (search, the remembered copy and the install refuse it; this PC: `D:\Instals`);
      D2 the installed version — FIXED: KUMM `Deploy-ModPack.ps1` writes `_kumm_backup\pack_version.txt`, the launcher reads it (0.9.0 installs: the hand-unpacked
      bundle wins); D3 every unfinished download read «связь прервалась» — FIXED (marks `net` / `user` / `error`, no mark → «Лаунчер не закончил скачивание
      сборки.»); D4 PARTLY REFUTED — the accepted mockups keep the header on the build's own game («0.9.1 · 3.1.1» on «noversion»); the real defect, the title
      «0.9.1 для … 3.0.1», FIXED (pack and game shown as one pair); D5 Play / Uninstall live while the uninstaller runs — FIXED (screen «removing»); D6 a
      remembered copy is final — needs a new UI element not on the mockups → the owner; R7 Steam half-installed, R8 the CL cut at a chunk end, R9 the CL scan on
      every Refresh, R10 `per_page=30`, R11 4xx read as a broken connection, R14 the window no longer centred after growth — FIXED; R12 REFUTED (the old-bundle
      delete is asked, default «Нет», with the folder and its size, and the hand-unpacked 0.9.0 folder is its main case); R13 ACCEPTED as a risk (a watchdog
      killing a long 13 GB install would leave a half-installed game); the strings guard skipped exception texts — FIXED (two Russian exception texts that
      reach the player moved into the table, the rest are English log text). New stand cases: `refused` (V1 V2), `removing` (U1), `never` (N1 N2), D4b in
      `fresh-cut`; the frames stand now also hides the Windows question boxes (a WH_CBT hook — the uninstall question had shown on the owner's screen 18:44)
      and the watcher's readiness line; the update stand `live.mjs` runs in the frames mode too. Full `self.mjs` run (18 cases) — see the run report.
- [ ] Judge round 2 on the new diff.

## The owner's remarks of 2026-11-20 on the RC1 launcher

1. **Buttons react slowly and elements show slowly** (`[OWNER]` 2026-11-20 11:37: «есть замечание по лаунчеру -  в нём как-то медленно нажимаются кромки и
   показываются элементы-  это особенность фронтенд движка на котором он собран?» — «кромки» = «кнопки»). Answered in chat: WinForms itself is not slow, the
   cause is ours; candidates named, not yet measured. A slowdown is critical (HOUSE_RULES 38) → `bugs/110_conan_launcher_slow_button_feedback.md`.
   - [ ] measure the paint and refresh times on the stand at 300 % · [ ] fix the cause · [ ] stand + frames at the four resolutions · [ ] judge
2. **«О проекте» instead of the links list at the bottom left** (`[OWNER]` 2026-11-20 11:38: «и внизу слева есть список контактов, было бы хорошо его превратить
   в кнопку [О проекте] - по которому бы открывался модальный диалог, или плашка, как у нас уже есть под это - и там контакты, ссылки, авторство описать, чтобы
   не занимать место на окне лаунчера»). The plate is the same overlay as the copies chooser; it holds the authorship and the links section (HOUSE_RULES 22: a
   section of links under «Ссылки», never «контакты» in the UI). Order (HOUSE_RULES 34, 23): KUIPS mockup in `ConanExiles/_config/launcher/design/` (a
   button state on the main screens + the open plate) → `kuips shoot / layout / build / check` → my look → the owner's look → build → stand + frames at the
   four resolutions → judge. In RC1 if accepted before the archive is built, otherwise in RC2 (said to the owner 11:38).
   - [ ] mockup · [ ] the owner's verdict · [ ] build · [ ] stand · [ ] judge

## Decisions made without the owner

`[AI]` (revisable, all shown on the mockups): the scan's progress counts drives; several copies are a pick list with version and state; no game → «Указать
папку игры»; install has no «Отменить» (a half-installed game), download and update do; «Отменить» keeps the downloaded parts; the progress bar sits in the
column above the bottom button, the gold face of «Играть» as its fill, percentages in its middle; numbers in Cambria (lining figures, as the version lines);
the mockup's numbers (6,8 ГБ, 18,4 МБ/с) are examples, not measurements; the built sheet and frames are not committed (`kuips shoot` + `build` rebuild them).
