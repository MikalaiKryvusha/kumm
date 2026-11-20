# Test run report — Conan build 0.9.1-RC1: the player's install path from the GitHub release

**Created:** 2026-11-20 16:39 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Krinik Mod Pack 0.9.1-RC1 (GitHub release `v0.9.1-RC1`, 10 assets),
KrinikConanLauncher 1.0.0, Conan Exiles Enhanced 3.1.1 CL-383549

## 1. Work

The full player path of a release, as the 0.9.1-RC1 notes describe it in «Установка» steps 1–4: the released launcher ALONE in an empty folder finds the game,
reads the GitHub feed, downloads the seven archive parts, checks them, unpacks, installs, and «Играть» starts the game with the pack; the main menu shows
the pack version. Basis: `plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md` (the RC1 aim: «для теста полного пути установки сборки залить его в GH»,
`[OWNER]` 2026-11-18 20:54) and `plans/57_EPIC_conan_launcher_self_sufficient.md` (download · install · play).

## 2. Contour

A fresh copy of the clean 3.1.1 (`robocopy` of the clean version, rule 25) in `KUMM/.work/rc1_install/Conan_311`; the launcher exe downloaded with the release
(`KUMM/.work/rc1_release/release/KrinikConanLauncher.exe`) copied alone into `KUMM/.work/rc1_install/launcher`, started by `KUMM/.work/rc1_install/run.mjs` with
its search roots, state, desktop and TEMP isolated in that folder (no write into the owner's folders); the network path is the real GitHub release.
REAL WORLD: accumulated — none (a fresh copy, as a new player has it); data and machine — the owner's PC and its real internet line to GitHub; path — the
launcher's own buttons pressed by `BM_CLICK` (the same handler as a mouse click, no focus taken).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-20 16:04 +03:00 | `node run.mjs start` (previous chat) | launcher PID 26040; feed read: «сборок 2, новейшая 0.9.1-RC1 … для этой игры 0.9.1-RC1»; screen `found-nofiles` «Нужно скачать: 12,8 ГБ» |
| 2 | 2026-11-20 16:09 +03:00 | `node run.mjs click 26040 install` (previous chat) | the free-space dialog (needs 40,3 GB, D: had 35,9 GB) — space freed, the download started 16:09:58 |
| 3 | 2026-11-20 16:09–16:30 +03:00 | the launcher's download | 7 parts, 13 723 879 273 bytes, 16:09:58 → 16:30:54 (≈ 21 min, ≈ 10 MB/s); «хвост архива проверен» before the first byte |
| 4 | 2026-11-20 16:30–16:31 +03:00 | the launcher's unpack | 16:30:54 → 16:31:49 (≈ 1 min) |
| 5 | 2026-11-20 16:31–16:33 +03:00 | `install.ps1 -GameDir …\Conan_311` (started by the launcher) | exit 0; «74/74 mods, 146 files · verify 115 present, 0 missing»; Game config 9 files; uninstaller and undo journal written; the desktop shortcut into the isolated desktop |
| 6 | 2026-11-20 16:33 +03:00 | the launcher restarts from the installed pack folder | PID 27048, screen `installed`, «игра … CL 383549 · Krinik» |
| 7 | 2026-11-20 16:36 +03:00 | `node run.mjs click 27048 play` | «pressed #0 of 1»; the launcher closed, `ConanSandbox.exe` 1412 + `ConanSandbox-Win64-Shipping.exe` 31460 started |
| 8 | 2026-11-20 16:38 +03:00 | `capture-window.ps1 -Out …\frames\menu2.jpg -Width 1920` | the main menu read by eye (below) |
| 9 | 2026-11-20 16:41 +03:00 | `mouse-seq.ps1 -Seq "move:0.104/0.404,…,lclick,…"` («Продолжить») | the game log: «ContinuePreviousClientSession: No save game profiles found» — the vanilla behaviour of a fresh install |
| 10 | 2026-11-20 16:42–16:44 +03:00 | `mouse-seq.ps1` clicks: «Одиночная/Совместная игра» → slot 1 → «Одиночный режим» → «Запустить игру» → «Подтвердить» | the world loads (≈ 50 s, the loading screen «Осталось: 546…»), the desert start with «Мужчина» / «Женщина» (`frames/single6.jpg`), memory 7,5 GB |
| 11 | 2026-11-20 16:44 +03:00 | `mouse-seq.ps1` «Мужчина» → «Персонаж готов» | the character creator in Russian (`frames/single7.jpg`), the sentence plate with an empty name (`frames/single8.jpg`) |
| 12 | 2026-11-20 16:45–16:49 +03:00 | `mouse-seq.ps1` «Изменить», a name typed, Enter, «Подтвердить» | the game's intro film, then the hero in the world (`frames/single18.jpg`) |
| 13 | 2026-11-20 16:49 +03:00 | `Stop-Process -Id 31460` / `-Id 1412`; `machine-lock.mjs release --who kumm` | the test game closed by PID, no crash-report window, the lock released |

## 4. Checks

Hygiene: none of its own (the release was built and stand-checked in the chat of 2026-11-20 14:10: stand 366 / 0).
Functional run: the released launcher on a fresh 3.1.1 copy, walked by its own buttons from GitHub to the game's main menu; read — the launcher log
(`KUMM/.work/rc1_install/tmp/KrinikConanLauncher.log`), the installer's summary, the installed `Engine.ini`, `UE4SS.log`, two frames of the game window.

| Case | Expected | Seen | Status |
|---|---|---|---|
| Find the game | the launcher finds the copy without being told | «найдена игра: …\Conan_311 · CL 383549 · Clean» | pass |
| Feed | the newest build for 3.1.1 is 0.9.1-RC1 | «для этой игры 0.9.1-RC1» | pass |
| Download | all parts, progress with %, speed, time left and elapsed | 7 parts, 12,8 GB in 21 min; the owner's frame at 55 %: «7,1 из 12,8 ГБ · 9,8 МБ/с · 9 мин 49 с · 11 мин 40 с» | pass |
| Unpack + install | exit 0, every mod in place | 74/74 mods, verify 0 missing | pass |
| Engine settings of the pack | the installed `Engine.ini` carries the pack's lines | `bDoFullyAsyncNavDataGathering=True`, `niagara.CreateShadersOnLoad=1`, the Chaos queue `100000`, `r.ViewDistanceScale=1.5`, `r.Lumen.TraceDistanceScale=4`, `DynamicSky.SolarUpdateAngleDelta=0.0025` | pass |
| «Играть» | the game starts, the launcher closes (rule 26) | both seen | pass |
| Main menu | «0.9.1-RC1» under the pack logo, game 3.1.1, «Отзыв» | `frames/menu2.jpg`: «3.1.1» · «0.9.1-RC1» · «ОТЗЫВ», menu in Russian; `UE4SS.log` without errors | pass |
| New game, world load | a new single-player world loads with the pack's mods | the world loaded, the desert start, the creator; `UE4SS.log` without errors | pass |
| The hero in the world | the hero stands in the world, the pack's HUD on screen | `frames/single18.jpg` 16:49: the hero in the desert, the camera behind his back; the Hosav HUD (XP 3 / 1 000, health 200 / 200, stamina 100 / 100, temperature), the minimap, the frame counter 72 top right, the notice «Открыто новое путешествие — Рыбак», the Russian tutorial; `UE4SS.log`: «СБОРКА: моды 66/66 (эталон 66 модов)» | pass |

## 5. Found

- The launcher writes no log line when «Играть» starts the game (the log ends with the feed line of PID 27048); a crash report or a support case cannot tell
  from the log whether the game was started by the launcher. S3 — one line in the next launcher build.
- The installer prints «Engine.ini not touched (pass -WithEngineIni to write it)» while the bundle's «Game config» step does write the pack's `Engine.ini`
  (checked line by line above): the line misleads a reader of the log. S3.
- On the sentence plate of the character creator the label «Подтвердить» runs over its «Enter» key badge (`frames/single8.jpg`) — the class «Russian text does not
  fit its button» of the known issues; whose string it is (the game's own or our translation) is not read yet. Cosmetic.

## 6. Traces

`KUMM/.work/rc1_install/tmp/KrinikConanLauncher.log` · `KUMM/.work/rc1_install/Conan_311/ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log` ·
`KUMM/.work/rc1_install/frames/menu1.jpg` (the pack's splash), `frames/menu2.jpg` (the main menu), `frames/single*.jpg` (the path into the world) — git-ignored work
files, removed with the copy at 16:51 (rm-tree: rc1_install 103.43 GB, rc1_release 13.75 GB); what they showed is written in the Checks table above.

## 7. Verdict

pass — the whole player path of the release passes: the launcher alone finds the game, downloads 12,8 GB from GitHub, installs 74 / 74 mods, «Играть» starts
the game, the menu shows «0.9.1-RC1», a new world loads with all 66 mods and the pack's HUD. Found: three S3 / cosmetic items above, none blocks the release.
