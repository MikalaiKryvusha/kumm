# Plan 55 — EPIC: the preliminary Krinik Conan build 0.9.1 for game 3.1.1 on GitHub and Nexus, with a launcher that updates itself and the build without breaking the player's settings and saves

> **Created:** 2026-11-17 · on the owner's word (chat 2026-11-17 19:54–20:00 +03:00): `[OWNER]` «насколько мы близки к тому, чтобы собрать предварительную версию 0.9.1
> сборки для версии игры 3.1.1 ? Главное, чтобы там всё по лаунчеру было сделано. Его умение обновляться, обновлять сборку, видеть новые версии сборки и себя.» ·
> «работаем, пиши эпики, если нужны, пиши операционные планы и планы тестирвоания, тест кейсы. Стремимся сделать лаунчер, чтобы он был качественный и рабочий, без
> багов, чтобы предусматривал разные кейсы обновления, и себя, и сборки, и не портил настройки и сейвы игроков. Стремимся это сделать для того, чтобы в ближайшие дни
> можно было выпустить предварительную сборку 0.9.1 для версии 3.1.1 на ГитХаб и нексус» · «работай автономно. Буду нужен - зови голосом» · 20:07 «веб разведка, как
> соверменные лаунчеры делают, какие технологии, какая архитектура, как обновления он получает и ставит».
> **Parent:** `plans/54_conan_launcher_updates.md` (phases 1–3 built, four release blockers, phase 4 open) · `plans/53_conan_move_3.1.0.md` (the move recipe) ·
> `ideas/23_conan_build_versions_and_launcher_update_check.md` · **Status:** 🔧 started 2026-11-17 20:1x — phase A: the build runs on 3.1.1 (20:33, TC_conan_move_3.1.1 6 pass / P6 blocked), the mods' update check left; phase B designed (research §4), the research
> `researches/conan-launcher-modern-practice/README.md` in progress · **Outbound:** the GitHub release and the Nexus upload wait for the owner's word (outward
> publishes); the forks of interview #039 go to the owner.

## Goal vector (Achieve + Avoid)

**Achieve:** a player of Conan Exiles Enhanced 3.1.1 downloads the preliminary Krinik build 0.9.1 from GitHub or Nexus, installs it, and from then on learns
from the launcher itself about every newer build and launcher and updates either with one button. **Avoid:** an update never loses what the player made — his
game and mod settings, his key bindings, his map markers, his world — and never leaves the game half-installed or the launcher dead.

## Acceptance criteria (each checked on the stand AND on a real copy of the clean 3.1.1 — `HOUSE_RULES.md` rule 25)

1. **The build runs on 3.1.1.** Situation: `D:\Games\Conan Exiles 3.1.1` is a copy of the clean version with the pack deployed. Action: the game starts, a world
   is entered. Result: «СБОРКА: моды 66/66»; UE4SS log — every Krinik Lua mod's start line; the game log — 0 «too old», 0 «missing import» beyond the recorded
   baseline. Check: `grep -c "mounted successfully" ConanSandbox.log` = the `modlist.txt` line count; `Deploy-ModPack.ps1 -Verify` exit 0.
2. **Settings survive a build update.** Situation: build 0.9.1 installed, the player changed the graphics quality, one key binding, the minimap's zoom and placed
   two map markers; the feed offers 0.9.2 whose bundle ships different defaults in two other files. Action: «Обновить сборку». Result: after the update the four
   player changes are as he left them, the two files the player never touched carry 0.9.2's defaults, `Game_0.db` byte-identical. Check: SHA-256 of every
   `Saved/Config/Windows/*.ini`, `Saved/SaveGames/*.sav` and `Game_0.db` before / after against the expected table of the case file.
3. **The same for the manual path.** Situation as 2, the player runs the 0.9.2 bundle's `install.cmd` himself (no launcher) — and the 0.9.0 → 0.9.1 path, whose
   old uninstaller knows nothing of player settings. Result and Check as in 2.
4. **A self-update that fails is rolled back.** Situation: the feed offers `launcher-vX.Y.Z` whose exe (a) has a wrong digest, (b) is not a program, (c) starts and
   dies before its window shows, (d) cannot be written (read-only folder). Action: «Обновить лаунчер». Result: in each case the old launcher is the one in the folder
   and running, with a message naming what happened. Check: SHA-256 of the exe before / after; the process list (justified: the list of running programs, a noun); the launcher log line.
5. **No update while something else holds the game.** Situation: the game runs / an install console started by the launcher runs. Action: «Обновить сборку» /
   «Обновить лаунчер». Result: refused with a message, nothing downloaded or removed. Check: the parts folder absent; the journal unchanged.
6. **The launcher shows the build it sits in.** Situation: a launcher self-updated from a newer launcher release sits in build 0.9.1's folder. Action: start.
   Result: the build version, the game version, «Что нового» of the game, the guide and the uninstaller name are 0.9.1's (from `pack\modpack.json`), not the
   values compiled into the exe. Check: the snapshot text; the click target in the log.
7. **The update matrix passes** — every row of the test plan `testcases/TC_conan_launcher_release_0_9_1_2026-11-17.md` (interrupted and resumed download, wrong
   digest, missing part, disk full, offline, GitHub 403 / 429, same / older / skipped versions, pre-release vs latest, launcher-only and build-only releases, both at
   once) has a status `pass` with its observation; `fail` → a bug document and a re-run.
8. **The release is reproducible.** One command builds the 0.9.1 shipment (bundle, parts, digests, release notes, the launcher asset) from the source; a second run
   on the same source gives the same digests for every file but the zip timestamps (or says which differ and why).
9. **Published** (the owner's word): GitHub release `v0.9.1` with the parts and their digests; the Nexus file uploaded and the page's description updated; the
   launcher of 0.9.1 started on a fresh copy of the clean 3.1.1 reads the REAL feed and shows no false plate.

## Phases and gates

| Phase | What | Gate (exit) |
|---|---|---|
| **A — the build on 3.1.1** | copy the clean version → `D:\Games\Conan Exiles 3.1.1`; `targets.json`; `-Deploy` (dry run, real), localization, mod info, the world save from 3.1.0; first start; `[Core.System]` paths; `-WithEngineIni` + config; world; Krinik mods' cases; `patch-rollback.py` (vanilla assets the hotfix changed under mods' whole copies); mods updated for 3.1.1 (`check-mod-updates.py`) | criterion 1 |
| **B — the launcher fit for players** | B1 settings and saves kept across an update (launcher AND manual path, 0.9.0 → 0.9.1); B2 self-update proves its start (handshake), else rolls back; B3 the bundle's manifest is the truth for the launcher's shown values; B4 interlocks (game, console, before any download); B5 the smaller items of plan 54 (free-space formula, parts deleted after a good unpack, a missing last part found before the download, the old bundle folder offer) | criteria 2–6 on the stand |
| **C — the test plan run** | the update matrix (criterion 7) on the fixture game, then the key rows on a fresh copy of the clean 3.1.1 with the real 0.9.1 bundle | criterion 7; the run report |
| **D — release tooling** | 0.9.1 numbers (`packVersion`, `builtFor`, `launcher.gameVersion` 3.1.1 and its Steam post), the export, the parts and digests, the notes (base: `ConanExiles/_config/release/published_0_9_0/`), the guide's version line, the launcher asset; one command | criterion 8 |
| **E — publication** | the owner's word → GitHub release; Nexus upload + description (the quarantine of 0.9.0's file — research §Nexus); the real-feed check | criterion 9 |

Phase B and phase A run in parallel (B needs no game: the fixture stand). D needs A's build; C's real rows need D's bundle. E needs the owner.

## Operational plan — the next phases (A now, B after the research doc)

### Phase A — the build on 3.1.1 (anchor: criterion 1)

- [x] A1. Copy the clean version → `D:\Games\Conan Exiles 3.1.1` (robocopy under the machine lock, 2026-11-17 20:12); `targets.json` → the single target `3.1.1`.
- [x] A2. (20:16–20:31: dry run 75/75; deploy 75/75, verify 114/0; localization equal; mod info 66/66) `Deploy-ModPack.ps1 -Deploy -DryRun -PackDir ConanExiles` → then `-Deploy` (no `-WithEngineIni` for the first start) → `-Verify`; `deploy-localization.py`;
      `set-pak-modinfo.py <Mods>`.
- [x] A3. (20:18, `save-restore.sh --check` «live save: ok») The world save and mod saves from `KUMM/.work/disk_d/save_3_1_0/` into the build (game closed; `save-restore.sh --check` on the db).
- [x] A4. (20:26–20:33: UE4SS on CL-383549, 66/66 mounted, 0 too old / missing imports, paths 90 = 90, `-WithEngineIni` + `deploy-config.py`, the world in 14 s, «СБОРКА: моды 66/66») First start under the lock (background path): UE4SS log, game log, the menu, the mod list; `[Core.System]` paths vs the pack Engine.ini
      (`swap-core-paths.py`); then `-Deploy -WithEngineIni` + `deploy-config.py`; the second start; the world.
- [x] A5. (20:5x: `check-mod-updates.py --since 2026-11-13 --all` — newer than our copies 0; 4 rebuilt after the patch, all four ours; 61 not yet rebuilt by their authors (they load: 0 too old); Doubled Storage Size gone from the Workshop — our library copy stays; the asset-level diff BLOCKED — the 3.1.0 pak list is lost, EXP-0552; the kit is still 383024) What the hotfix changed: `patch-rollback.py` on the installed mods; `check-mod-updates.py --since 2026-11-13 --all` (authors' 3.1.1 updates); the kit revision
      of 3.1.1 (`F:\CEUE5Devkit` — an Epic update after 2026-11-14?) and whether our kit paks load («too old»).
- [x] A6. (P1–P7 of the TC: 6 pass, P6 blocked; the hub pages with values) The Krinik mods' quick cases on 3.1.1 (the hub pages, the map, the bow, the wall grab) — a short TC `testcases/TC_conan_move_3.1.1_2026-11-17.md`.

### Phase B — the launcher fit for players (anchor: criteria 2–6; decisions — `researches/conan-launcher-modern-practice/README.md` §4; cases —
`testcases/TC_conan_launcher_release_0_9_1_2026-11-17.md`)

- [ ] B0. The shipped config set (§3 finding 20:22): `-Export -ConfigFrom` stops shipping the display keys (`GameUserSettings.ini` resolution / fullscreen /
      frame-rate / `LastUserConfirmed*`); the manifest gets `configPolicy` (managed · seed · strip · never). Cases M4, the decision table.
- [ ] B1. The installer owns the upgrade (§4 item 2): `shipped.json` at every install; on an installed older build — hash, save aside, uninstall, install, put back
      by the decision table, `.krinik-new` beside; the 0.9.0 hash table from the 0.9.0 release archive; the deny list in install AND restore. Tool
      `settings-table.mjs`. Cases B1′, B2′, B10′, M1–M3.
- [ ] B2. Self-update proves its start (§4 item 3): `--after-update <pid>`, the named event, 30 s, `.bad`, `.old` until the 2nd clean start, the start counter. Cases L1–L9.
- [ ] B3. The bundle's manifest is the truth for the shown values (§4 item 5). Case L10.
- [ ] B4. Interlocks (§4 item 4): the mutex, the consoles' `Process` objects, the game check before download and before uninstall, the write probe, the free-space
      need. Cases B7′–B9′, B12′.
- [ ] B5. Plan 54's smaller items: a missing last part found before the download (B5′), parts deleted after a good unpack, the old bundle folder offer; Range
      fallback (B4′); zip path traversal (B13′).
- [ ] B6. Two judge rounds on the diff; the regression of plan 54 (§3.5 of the cases).
- [ ] B7. 🔧 **FIXED 2026-11-17 22:0x, verification partial** (stand run on the final exe: 87 PASS / 0 FAIL up to B4; B8′, B5′, B2, B5 not re-run; the control
      run on 2f62b52 owed; the judge round OWED — `[OWNER]` 22:10 «нет времени на судейство» · «это будет наш долг»; plus the live-window corner fix of
      `MetalButton`, not yet seen on a live capture — STATUS «CHAT CLOSED 2026-11-17 22:1x»). **The launcher judge (2026-11-17 21:25, on pack 2f62b52) — CONFIRMED, to fix first next chat:** (1) a window closed / «Играть» within 3 s counts as a crash
      (rollback; two quick closes with .old present bring the old launcher back) — settle also on FormClosed after Shown; (2) `DeleteParts` runs BEFORE the last
      GameRunning refusal and the stop gate — move both above it, and skip download + unpack when `BundleDir\pack\modpack.json` already has the version;
      (3) a half-done revert in `SelfUpdate.Begin` can leave no exe — move `.bad` back in the catch, never delete `.old` while the exe is missing; (4) the
      previous-bundle delete guard — require `^Krinik_[A-Za-z0-9_]+$`, refuse a folder holding Saved / Content / Binaries, default «Нет». Smaller: log «окно живо»
      only after a real Set; `alive |= ready.WaitOne(0)` after the wait loop; lock `Bundle.cache`; check the NEW bundle's uninstaller name after install; the confirm
      box «после установки … удалятся» → «после распаковки»; tests — the 30 s hang case, the quick-close case, B1 asserting the tail was checked (not null).
- [ ] B8. **The crash report offers itself** — `[OWNER]` «падение само логи соберёт человеку для отправки нам в issues?» · «было бы хорошо» · 2026-11-17 21:58
      (tossed mid-B7). Today (read 21:58): nothing fires on a crash — the player presses «Отзыв» → «Собрать отчёт» (launcher) or «ОТЗЫВ» (game menu); the zip
      (`_config/player-report/collect_report.ps1`: game logs, `Saved/Crashes` of 7 days, UE4SS.log, identifiers scrubbed, no minidump) lands on the desktop and
      opens a mail to the author — not GitHub Issues. `[AI]` design (the owner's «было бы хорошо» = the mandate): at the NEXT launcher start, a `Saved/Crashes`
      folder newer than the last one the launcher saw (`<launcher>.crashes-seen`, first start only records) → the box «Игра в прошлый раз упала. Собрать отчёт
      для автора сборки?» (default «Да»); «Да» runs `collect_report.cmd`, shows the zip in Explorer, opens GitHub `issues/new` of the public build repo with a
      title prefilled (the zip is dragged in by the player — a URL cannot attach a file); «Нет» — recorded as seen, never asked again for that crash. Not at the
      crash itself: the crashed game runs nothing, and «Играть» closes the launcher (HOUSE_RULES rule 26). Cases on the stand: a fake `Crashes/<new>` folder →
      the box; the second start → no box; no folder → no box; the issue URL in the dry log. Goes into the D-fb feedback section of README and guide.

The design inputs already read (local recon, 2026-11-17 20:1x): the deploy's undo journal (`Deploy-ModPack.ps1` `Save-Original` / `Invoke-Restore`) records `replaced` /
`created` / `dir` per file and the uninstall returns the pre-build copies — so every config file the player changed after the install is lost on an update; the
shipped config set is `Saved/Config/Windows/*.ini` + `exportConfig` (four mod `.sav`: Hosav UI, Simple Minimap settings, Proximity Party, Damage Meter); the
map markers (`SimpleMinimap_MarkerData.sav`), the damage logs and `Game_0.db` are never written by the build, so the journal never touches them. The bundle's
`install.ps1` (written by `Write-BundleInstaller`) runs `-Deploy` only — it knows nothing of an installed older build.

### Phase D — an item from the owner (2026-11-17 21:11, tossed mid-work)

- [ ] D-fb. `[OWNER]` «в ридми нашем, в мануале, который в PDF собираем, должны быть описаны пути обратной связи и через ОТЗЫВ в лаунвере и сборке, и через
      issues в GitHub - я принимаю отчёты об ошибках и запросы на улучшение и там и там» · 2026-11-17 21:11. The build's README (`ConanExiles/_config/public_release/README.template.md`)
      and the PDF guide (`ConanExiles/docs/guide/guide-*.html` → PDF by `build-docs.py`) get a section «Обратная связь»: the «Отзыв» button of the launcher and of the
      game menu (what it does — the report zip) and GitHub Issues of the public repo (bugs and improvement requests), both accepted. The author-links section stays
      a section of links (HOUSE_RULES rule 22 — no sentence under it calls the links report addresses); the feedback section is its own heading.

### Phase E — publication: decided ahead

- **0.9.1 is published as an ordinary GitHub release, NOT «Pre-release»**: the launcher's feed skips drafts and pre-releases (`ConanExiles/_config/launcher/KrinikConanUpdates.cs`
  `Feed.Parse`), and `/releases/latest` (the build's «Что нового» fallback) ignores them too (research §1.4) — a pre-release 0.9.1 would be invisible to every
  launcher. «Предварительная» goes into the release TITLE and the notes. 0.9.0 is for game 3.0.1, so 0.9.1 becomes «Latest» rightly. `[AI]` — named to the owner
  in the report of 2026-11-17; his word overrides.
- The Nexus file: the same bundle; the description says what the launcher downloads and from where (the 0.9.0 quarantine letters said «None of the scripts
  downloads or runs anything from the internet» — no longer true; the new text must say it plainly).

## Risks

- **(a) high** — the Nexus file of 0.9.0 is still quarantined («Virus scan — Some suspicious files», ticket 276571, three letters); 0.9.1's launcher now downloads and
  starts an exe (self-update) — a pattern scanners score higher. Contingency: the research names what Nexus allows and what reduces the score (no self-update in
  the Nexus file? signed exe? the source and hashes in the description); the owner decides.
- **(a) high** — a settings-merge rule that keeps the player's file whole drops a fix the new build made in the same file (Engine.ini cvars). Contingency: the
  build-owned sections merge by section (`Merge-IniPart` exists); the interview fork #039.
- **(b)** — the hotfix changed vanilla assets under mods' whole copies again (as 3.1.0 did — 11 assets); contingency: plan 53 step 12's tools.
- **(b)** — GitHub's unauthenticated API limit (60 / hour / IP) on a shared network; contingency: the launcher already falls back silently; a release manifest
  asset may replace the API call.
- **(c)** — robocopy of 63 GB on a disk shared with KAGO; under the machine lock.

## Decisions made without the owner

`[AI]` (revisable): the epic's number 55 and its five phases; phase B starts before the research doc's last word only for the parts the research cannot change
(B3, B4). Filled at closing.
