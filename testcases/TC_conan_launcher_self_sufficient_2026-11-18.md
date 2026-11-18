# Test plan and cases — the self-sufficient Conan launcher: it finds the game, matches the release to the game version, downloads with resume, installs on one progress bar, in Russian and English

**Created:** 2026-11-18 · **Under test:** `ConanExiles/_config/launcher/` — `KrinikConanLauncher.cs` (the window and the `Launcher` controller), `KrinikConanGames.cs`
(search, CL, state folder), `KrinikConanUpdates.cs` (feed markers, `Job` / `Meter`, `BuildUpdate`), `KrinikConanWidgets.cs` (state panel, progress bar,
update plate, language switch, copies list), `KrinikConanText.cs` (the RU / EN table) · **Version/build:** launcher 1.1.0 (number not settled — plan 57 FORK),
pack 0.9.1, the fixture build 1.0.1 of `test/stand.mjs`
**Test basis:** `plans/57_EPIC_conan_launcher_self_sufficient.md` criteria 1–11 (10–11: the owner 2026-11-18 15:08, passed by the main session); the accepted
KUIPS mockups `ConanExiles/_config/launcher/design/mockups.html` (pack `95f8b52` + `75b310e`, strings final); `researches/conan-launcher-self-sufficient/README.md`
§2–3; HOUSE_RULES rules 17 (720p–4K), 23 (mockup elements not carried are listed), 25 (tests on copies, never on the clean version), 30 (no real input).
**Tools:** `_config/launcher/test/self.mjs` (this set), `stand.mjs` (bundle 1.0.1 in 75 zip volumes, built by the real engine), `feed.mjs` (`--game` marker,
`--cut`, `--rate`), `make_stub.py` (`game <CL>`, `scan <CL>`), `click.ps1` (`-Key`, visible-window filter), `live.mjs` (regression of plans 54 / 55).

## 1. Test plan

**What and why.** The launcher now acts without the player's help: it walks the drives, reads the game's build number, picks the release, downloads
gigabytes into the game folder and runs the installer. A wrong pick installs a build for another game version; a wrong state shows buttons that lie
(the frame of 2026-11-18 08:12). The set covers where a game can lie, what the copy holds, what the feed offers, what lies next to the launcher, and
what happens to the network, the player's stop and the language.

**Dimensions (named techniques).** Equivalence partitions of the game's place (Steam library current / old format · `X:\Games\<name>` · `X:\Program Files\<name>`
· around the launcher · remembered · none); of the copy's content (clean · Krinik installed · other mods · other game version · unknown CL); of the build
source (feed download · parts beside · unpacked bundle beside); state transitions of the install (found → download → unpack → install → installed, with
the net break, the stop and the restart); decision table screen = f(game, copy, feed, files) — every screen of the 12 mockups plus the three not mocked
(feed reading, feed offline, the player's stop); boundary of the version match (CL equal / CL with no release / CL unknown); the language (system ru /
en × saved choice none / ru / en); resolutions 96 · 144 · 192 · 288 dpi (720p 100 % · 1080p 150 % · 2K 200 % · 4K 300 %).

**Consciously not covered.** The Windows folder dialog after a real pick (the stand cannot type a path into it without real input — the press and the
dialog's appearance are covered, the validation of a picked folder is read in code only); Epic / Xbox copies (Enhanced is Steam-only, research §2.2);
a real 13 GB download from GitHub (the courtesy rule: one live GET is planned for R1, not a loop); a second monitor with another scale.

**Stands.** (1) Stand folders as drives and a fake Steam (`KRINIK_LAUNCHER_SEARCH_ROOTS`, `KRINIK_LAUNCHER_STEAM`), the case's own state folder, TEMP and desktop;
the window off-screen without a taskbar button (`KRINIK_LAUNCHER_FRAMES`) — every row. (2) The owner's real drives read-only (R1). (3) A fresh copy of the clean
3.1.1 (`HOUSE_RULES.md` 25) — R2.

**Exit.** Every row `pass` with its observation; a control run on the launcher before this work (pack `c05aa51` sources) fails the new rows; the run report
`testcases/reports/2026-11-18_conan-launcher-self-sufficient.md`.

## 2. Cases

Status: `todo` · `pass` · `fail` · `blocked` · `skipped`. Each row is one action; Check names what is read (the launcher log in the case's TEMP, the frames, the files).

### 2.1 Finding the game (criteria 1–3, 9)

| # | Situation | Action | Expected | Check | Status |
|---|---|---|---|---|---|
| G0 | no game on the stand drives, no Steam | start; press the gold button | screen «notfound»: «Лаунчер не нашёл игру ни в библиотеках Steam, ни в папках Games на дисках, ни в Program Files.» + the hint; gold «Указать папку игры»; the press opens the Windows folder dialog; «Отмена» leaves the launcher as it was | `self.mjs none` | todo |
| G1 | the game in a second Steam library (current `config\libraryfolders.vdf`, `appmanifest_440900.acf` StateFlags 4) | start | found; screen «found-nofiles» with folder, version 3.1.1, «1.0.1 для игры 3.1.1», the size; the SteamID of the manifest never in the log | `self.mjs steam` | todo |
| G1b | the same, old `LibraryFolders` format in `steamapps\` | start | found as G1 | `self.mjs steam-old` | todo |
| G2 | `D:\Games\Conan Exiles Enhanced` (any name) | start | found as G1 | `self.mjs games` | todo |
| G3 | `E:\Program Files\Conan Exiles` | start | found as G1 | `self.mjs pf` | todo |
| G4 | four copies: Steam clean 3.1.1 · D:\Games with build 0.9.0 · E:\Games\Other with other mods · F:\Program Files 3.0.1 | start; Down key on the list; gold «Установить сборку» of the list | the copies list opens with 4 rows, each «Conan Exiles <version> · <state> · <path>» («без модов» / «установлена сборка 0.9.0» / «установлены другие моды» / «сборка для этой версии ещё не вышла»); the picked copy is remembered; the window shows it («Играть») | `self.mjs many` | todo |
| G5 | the Shipping exe has no «-CL-» in ProductVersion, only inside the file | start | CL 383549 found by the scan; version 3.1.1 | `self.mjs scan` | todo |
| G6 | the game's CL 390000 has no release | start | screen «noversion»: «Версия игры: CL-390000», «Сборка для игры CL-390000 ещё не вышла.», «Последняя сборка: 1.0.1 для игры 3.1.1»; no install button; nothing downloaded | `self.mjs unknown` | todo |
| G7 | the copy picked in G4 | start again | the remembered copy, no search | `self.mjs many` (second start) | todo |
| G8 | the launcher inside a game folder | start | that game, no search | `self.mjs around` | todo |
| G9 | criterion 9 | `grep -rn KRINIK_LAUNCHER_STATE[^_] ConanExiles/_config/launcher/*.cs` | prints nothing | the command | todo |

### 2.2 Getting and installing the build (criteria 4, 5, 7, 8)

| # | Situation | Action | Expected | Check | Status |
|---|---|---|---|---|---|
| D1 | clean 3.1.1, the feed has 1.0.1 for CL-383549, nothing beside, the feed sends 600 KB/s | «Установить сборку» | the bar: download (amount moves between two frames, speed, time left, time spent) → unpack → install («Скопировано модов» 2 из 2) → the build's own launcher starts from the game folder, the downloaded one closes; the mods of 1.0.1 in the game, the parts gone, the shortcut on the stand desktop | `self.mjs fresh-feed` | todo |
| D2 | the 75 parts lie next to the launcher | «Установить сборку» | screen «found-files»; the bar checks the parts («verify»); no file request to the feed; installed as D1; the player's parts stay | `self.mjs fresh-beside` | todo |
| D3 | the launcher inside an unpacked bundle, the feed dead | «Установить сборку» | screen «found-files» offline; install on the bar; then «Играть» | `self.mjs fresh-local` | todo |
| D4 | the feed breaks the first file after 30 000 bytes | «Установить сборку», then «Продолжить скачивание» | screen «neterror» with the amount and «Лаунчер сохранил скачанные файлы…»; the resume asks by Range; installed | `self.mjs fresh-cut` | todo |
| D5 | a slow feed | «Установить сборку», «Остановить», restart, «Продолжить скачивание» | screen «paused» («Вы остановили скачивание.») before and after the restart; the resume by Range; installed | `self.mjs fresh-stop` | todo |
| D7 | the feed refuses | start; «Проверить снова» | screen «offline»; the press asks the feed again | `self.mjs offline` | todo |

### 2.3 Language (criteria 10–11)

| # | Situation | Action | Expected | Check | Status |
|---|---|---|---|---|---|
| LG1 | no saved choice, system en-US | start | English window («The launcher did not find the game…») | `self.mjs lang` | todo |
| LG2 | LG1's window | press the switch | the whole window in Russian at once, no restart; `language.txt` = `ru` in the stand state folder; a frame | `self.mjs lang` | todo |
| LG3 | saved `ru`, system en-US | start | Russian (the saved choice wins) | `self.mjs lang` | todo |
| LG4 | every screen | frames at 96 / 144 / 192 / 288 dpi in both languages | every string fits its place, nothing cut or overlapping, the switch shows the chosen language gold | `self.mjs shot:<screen> --dpi N` + the agent's eye on the sheet | todo |

### 2.4 Real world, control, regression

| # | Situation | Action | Expected | Check | Status |
|---|---|---|---|---|---|
| R1 | the owner's real drives and Steam, read-only, the launcher's state in a stand folder | start a lone launcher | the real copies are found (the log names them); nothing written outside the stand folder | log; `%LOCALAPPDATA%\KrinikConanLauncher` before / after | todo |
| R2 | a fresh copy of the clean 3.1.1 (rule 25), the real 0.9.1 bundle | the player's path | installed, «Играть» | phase 4 gate | todo |
| K1 | control: the launcher of pack `c05aa51` (before this work) on G2, D1, LG1 | the same cases | they fail (no search, no fresh install, no English) | `self.mjs games|fresh-feed|lang` on the old exe | todo |
| X1 | regression of plans 54 / 55 (self-update, build update, crash offer, old-bundle guard) | `live.mjs` batch | as before | `.work/launcher54/batch58.sh` on the new exe | todo |
| U1 | the owner's `%LOCALAPPDATA%\KrinikConanLauncher` | every case | untouched | the last line of every case | todo |
