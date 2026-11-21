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
| 6 | An update downloads only what changed (`[OWNER]` 2026-11-21 00:28–00:30, verbatim — `PROJECT_HISTORY.md` entry 2026-11-21 00:28); recon `researches/conan-launcher-delta-update/README.md` | a stand update with the local feed downloads only the changed files; then a real update on a copy of the game, measured in MB |

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
   - [ ] mockup · [ ] the owner's verdict · [ ] build · [ ] stand · [ ] judge <!-- attribution-ok: a step to come; his words of 11:38 are quoted in this item above -->


## Phase 6 — an update downloads only what changed

**Goal vector (Achieve).** The RC1 → RC2 update downloaded 12.8 GB in 22 min while 12 files / 37.3 MB changed (run report
`testcases/reports/2026-11-21_conan-launcher-update-rc1-rc2.md`). The launcher shall download only the files whose bytes differ from what the player already
has beside the game, verify them, and switch the bundle in one step; an RC-sized update costs tens of MB.

**Acceptance criteria.**

1. Reproducible build. The same sources give the same pak bytes. Check: cases R1–R4 of `testcases/TC_conan_reproducible_export_2026-11-21.md`; at every
   release the line «changed vs <previous>: N files, X MB» lists only the files whose source changed (case R5).
2. The release carries `manifest.json` (path · size · SHA-256 · asset, or parts for a file over 2 GiB, or the small-files group), uploaded LAST; the publisher
   reads the asset list back and every name and `digest` matches the manifest. Check: a script over `gh release view <tag> --json assets` and the manifest.
3. Update by hashes. Situation: a bundle of release N beside the game; the feed holds release N+1 that differs in K files. Action: the player presses
   «Обновить сборку». Result: the confirmation names the real download size; the feed log shows requests for those K assets (and the small-files group when
   a small file changed) and nothing else; the new bundle tree equals the manifest. Check: the stand with the local feed (`_config/launcher/test/feed.mjs`),
   its request log and a tree hash of the new bundle.
4. An interrupted update (the process killed mid-download) resumes on the next start from the staging folder; the old bundle stays untouched until the
   installer reports success. Check: the stand, a kill by PID, the second start's log and the old bundle's tree hash before/after.
5. A fresh install with no old bundle downloads every asset through the same path. Check: the stand with an empty game folder.
6. The launchers already shipped (RC1, RC2) keep a working update path. FORK: options <the volumes stay beside the per-file assets during a transition |
   the release ships no volumes and the old launcher self-updates first (plan 54 step 2.1)> · price of error <an old launcher finds no parts and cannot
   update; a double upload costs ≈ 37 min per release> · consulted <recon §5 «Transition», Velopack «1 full + 1 delta per release»>; the volumes also serve the
   manual download and Nexus — what the release page offers the player is the owner's word (asked when step 5 is reached).
   **DECIDED 2026-11-21 16:58 — C, ONE format in the end: the per-file set** (`[OWNER]` «да, согласен, чтобы не дублировать работу, желательно перейти в
   одному какому-то формату. Если дифф обновления требуют файлов, то, вероятно это вариант с файлами»; interview #042; his first answer of 16:44 was A).
   The next release carries both sets (the players' RC1 / RC2 launchers know only the volumes); the launcher learns the first install by the file list
   (criterion 5, now REQUIRED); after that release the GitHub page carries the per-file set alone, Nexus keeps one archive of its own, and the guide's manual
   install changes with it. The owner's rule for the whole update path, 16:46: «я не знаю, как делают
   системы обновления, но должно работать, так как делают такие системы» — every open question of the updater is settled by the industry's practice
   (Velopack, Steam depots, itch.io butler, zsync — the recon), not by a new invention.
7. **A player who skipped several releases updates in one press** (`[OWNER]` 2026-11-21 16:46: «пропустил несколько обновлений, запускаешь лаунчер - предлагает
   обновиться. Жмёшь обвновиться - и оно докачивает то. что тебе нужно, чтобы с твоей версии обновиться до последней»): the launcher compares the installed
   files with the LATEST release's file list and downloads only the files that differ, whatever versions lie between (the Steam depot shape: a diff of
   states, not a chain of patches); every release page carries every per-file asset (criterion 6). Check: stand case D9 — 1.0.0 installed, the feed
   offers 1.0.2, files changed in 1.0.1 AND in 1.0.2; one press installs 1.0.2, only the files that differ from 1.0.0 are requested, none of 1.0.1's.
   PASS 2026-11-21 16:57 (run 10, report `testcases/reports/2026-11-21_conan-launcher-delta-update-stand.md`).

**Steps (the next ones only; the rest are written when these close).**

- [x] 0. 2026-11-21 10:31 +03:00 — reproducible paks: repak_cli 0.2.3 packs on rayon threads in the order they finish (one folder packed three times → three
      SHA-256; `RAYON_NUM_THREADS=1` → one, at the same speed). `ConanExiles/_config/devkit/repak_tool.py` (`ENV`) passed by the `run()` of `set-pak-modinfo.py`,
      `set-pak-version.py`, `kit-buildmod.py`, `build-level-mod.py`, `patch-mod-asset.py`; report `testcases/reports/2026-11-21_conan-reproducible-export.md`
      (R1–R4, N1–N3 pass; `kit-buildmod.py` and `patch-mod-asset.py` owed a run at their next use). RC2's third-party paks were packed on many threads, so the
      first update after this change downloads them once more. Judge round 1 (0 defects, 3 risks, 5 cosmetic): the env narrowed to `repak pack` and `retoc
      to-zen` (`env_for`), `make-loc-mod.py` covered, guard `devkit/t_repak_one_thread.py` (red on the pre-fix `make-loc-mod.py`); re-run passed; pack `23e9015`;
      issue #45 of the public repo filed and commented.
- [x] 1. DONE 2026-11-21 11:10 — pack `d85e388`: self-test `t_make_manifest.py` 20 / 20 (red on three mutations), the real bundles: two runs equal, RC1 → RC2
      stopped by the guard on 62 unexpected paks; judge 2 rounds (round 1: 1 defect fixed; round 2: 0 defects). The first release after it needs
      `ConanExiles/_config/release/draft_0_9_1/changed_paks_<v>.txt` with «pack/src/*  # RC2 was packed on many threads» (RC2's paks differ byte-wise).
      `ConanExiles/_config/release/make_manifest.py <export> --tag <tag> --out <release dir> [--previous <manifest.json>]`: SHA-256 of every file; files
      under 1 MB in one stored zip `small-<hash16>.zip` written in sorted order with fixed timestamps; files over 2 GiB cut into parts; asset name
      `<hash16>-<basename reduced to [A-Za-z0-9._-]>`; the assets HARDLINKED from the export (same volume — no second 13.7 GB); `--previous` prints «changed
      vs <previous>: N files, X MB» and the list. Self-test: two runs on the RC2 bundle → the same `manifest.json`; RC1 vs RC2 → the 74 changed files of
      today (the guard red on the real broken pair), the 62 third-party paks among them.
- [x] 2. DONE in pack `d85e388` — `make_release.sh` step 4c (`--part-size RELEASE_PART`, `--previous-from`, `--allow-changed`); SHA256SUMS (step 6) covers the
      new assets. Owed: the ritual's stage E checks `manifest.json` among the published assets and keeps it in `published_<v>/`.
- [x] 3. DONE 2026-11-21 11:5x — pack `6dc79ee` + `2137cae` (judge 2 rounds): `ConanExiles/_config/launcher/KrinikConanDelta.cs` + `BuildUpdate.RunByManifest`,
      the question with the real size after the check (`box.delta.ask`), «Нет» → back with no error. The launcher reads `manifest.json` of the release (its
      asset `digest` first), hashes the bundle folders beside the game (a cache by path · size · mtime in each folder), plans (hardlink or copy into
      `<root>.staging` · download the rest), downloads with `Range: bytes=N-`, verifies every file, renames once, runs the bundle's installer as today; no
      manifest, or a broken one beside the volumes → today's volume path. Only an INSTALLED build takes this path; a first install keeps the volumes.
- [ ] 4. Stand cases of criteria 3–5 — D1–D8 PASS 2026-11-21 12:29 on the code of round 3 (NOT committed, judge round 3 running): the round-2 owed items built —
      an asset failing after the plan falls back to the volumes (`Delta.Mismatch`), a hardlink probe per seed folder with the copies counted in the space and
      copied with progress (`Job.Stage.Copy`, «Скопировано»), the bundle the launcher runs from outside the game folder as a seed, the manifest's two tries,
      the tidy exits (no `.staging` after «Нет» or after the volumes), the delete offer names the freed bytes («На диске освободится …»). Cases
      `testcases/TC_conan_launcher_delta_update_2026-11-21.md`, report `testcases/reports/2026-11-21_conan-launcher-delta-update-stand.md` (runs 8–9). Criterion 5
      is NOT met as written: a first install takes the volumes (D4) — whether it moves to the file list waits on interview #042. Owed: frames of the
      confirmation and the progress at 4K; a real FAT32 / exFAT volume (D7 used the switch `KRINIK_LAUNCHER_NO_HARDLINKS=1`).
- [ ] 5. The transition fork of criterion 6 — ANSWERED 2026-11-21 16:58: C (interview #042; A at 16:44). The ritual's stage E checks the per-file set
      beside the volumes (`release_checklist.py`, built 16:5x: TODO on the published RC2, which has no manifest — as expected); `make_release.sh` already writes
      both sets into `<work>/release`. Then a real update on a copy of the clean 3.1.1 from the installed RC2 to a locally built next build, measured in MB;
      GitHub issue #45 «Launcher: an update downloads the whole archive» by HOUSE_RULES 44 (filed at step 0).
- [ ] 6. The first install by the file list (criterion 5, required by answer C): with no installed build the launcher downloads every asset of the list into
      `<bundle>.staging` through the same path (no seeds), verifies, renames, runs the installer; the volumes stay its fallback while they exist. Then the
      files-only release mode of `make_release.sh` (no volume upload; Nexus gets its own archive), the ritual's stage E for a files-only page, the guide's
      manual install rewritten (download the launcher, press «Установить сборку»). Stand: D4 turns into «a first install by the file list» (D4b today
      expects a refusal).
- [ ] 7. MEASURE FIRST, then decide — a chunked download inside a big pak (the owner 2026-11-21 17:07–17:10 on the weight imbalance and on aligning our
      files by 1 MB or 100 MB; chronicle entry 2026-11-21 17:07). Facts: 187 files, 6 over 1 GiB hold 9 GB of 12.8 GB (70 %); a changed big pak downloads
      whole. Alignment alone gives nothing to a whole-file updater, repak 0.2.3 has no alignment option, and 12.6 GB are third-party paks their authors
      repack. What would help is a content-defined chunk index per big file (itch.io butler, zsync) with HTTP Range reads from the per-file asset already on
      GitHub. The measurement: at the next update of a big third-party mod, chunk its old and new pak offline and count the bytes a chunked download would
      fetch; a big gain → an idea for the owner, then a step here.

## Decisions made without the owner

`[AI]` (phase 6, revisable): repak on one thread rather than a packer of our own (one environment line, proven by R1); the per-file assets are hardlinks of
the export; the plan writes only steps 0–5 of phase 6.

`[AI]` (phase 6 step 4, round 3, revisable): an asset whose bytes fail its hash twice counts as the release not matching its list and falls back to the
volumes, asking the archive question first (a network fault twice in a row costs the player one more question, never a silent 13.7 GB); the hardlink is
probed once per seed folder by a real link (a drive letter cannot tell exFAT from NTFS); the stand forces «no links» by the environment switch
`KRINIK_LAUNCHER_NO_HARDLINKS=1`, as the launcher's other stand switches; the fallback box gets one reason line «Обновить только изменившиеся файлы не
получилось.» and the delete offer names the freed bytes plus «Файлы, которые новая сборка взяла из прежней, останутся в новой сборке.» when files are
shared; the copies of old files show the row «Скопировано».

`[AI]` (revisable, all shown on the mockups): the scan's progress counts drives; several copies are a pick list with version and state; no game → «Указать
папку игры»; install has no «Отменить» (a half-installed game), download and update do; «Отменить» keeps the downloaded parts; the progress bar sits in the
column above the bottom button, the gold face of «Играть» as its fill, percentages in its middle; numbers in Cambria (lining figures, as the version lines);
the mockup's numbers (6,8 ГБ, 18,4 МБ/с) are examples, not measurements; the built sheet and frames are not committed (`kuips shoot` + `build` rebuild them).
