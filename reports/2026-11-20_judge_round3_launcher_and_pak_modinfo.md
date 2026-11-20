# Judge round 3: the launcher and the Krinik paks' mod-list fields (ConanExiles d473023, 00c795d)

Date: 2026-11-20 09:57. Reviewer: an independent judge (a fresh helper). It read the code only. The commit message bodies were not read.

Read: `git diff <hash>~1 <hash>` of both commits, then the touched files around the changes: KrinikConanGames.cs, KrinikConanLauncher.cs (FoundScreen, Shown, RunJob, Finished, UpdateAllowed), KrinikConanUpdates.cs (Feed.Download, HasZipEnd, Bundle, BuildUpdate.Prepare and Run), KrinikConanVersion.cs, test/self.mjs, feed.mjs, click.ps1, make_stub.py, make_release.sh, make_volumes.sh, game-target.sh, KUMM Deploy-ModPack.ps1 (Export-Bundle), krinik_modinfo.py, set-pak-modinfo.py, kit-buildmod.py, build-level-mod.py, dash_lint.py and krinik_change_notes.json.

Runs, all read-only: `node --check` on self.mjs and feed.mjs; `python -m py_compile` on the five Python files; `bash -n` on both scripts; `dash_lint.py --only krinik_change_notes`; `set-pak-modinfo.py --check-krinik` on copies of the four Krinik paks in `KUMM/.work/judge3`; plain `tasklist` against `tasklist //FI`; a regex probe of the part names in node.

## Findings, most severe first

### 1. DEFECT: the launcher cannot see the parts of an RC release (the current target 0.9.1-RC1)

- `_config/release/make_release.sh:26`: `NAME="Krinik_Mod_Pack_${V//./_}"`
- `_config/release/make_volumes.sh:25` (default name): `packVersion.split('.').join('_')`
- `_config/launcher/KrinikConanUpdates.cs:643`: `static readonly Regex PART = new Regex(@"^(?<stem>Krinik_[A-Za-z0-9_]+)\.zip\.(?<n>\d{3})$", ...)`
- `_config/launcher/KrinikConanLauncher.cs:133`: `BUNDLE_NAME = new ...Regex(@"^Krinik_[A-Za-z0-9_]+$")`

Scenario: modpack.json carries `"packVersion": "0.9.1-RC1"` today, so the release parts are `Krinik_Mod_Pack_0_9_1-RC1.zip.001…`. The character class of PART has no `-`. A node probe of the same pattern gives `false` for `Krinik_Mod_Pack_0_9_1-RC1.zip.001` and `true` for `Krinik_Mod_Pack_0_9_1.zip.001`. `BuildUpdate.Prepare` therefore matches no asset, `u.Stem` stays null, and the result is `u.no.archive`. Every player sees «release-bad», and the update plate's button ends in a message box. Parts the player downloaded and put beside the launcher are not recognised either. After an update RC1 → RC2, the old `Krinik_Mod_Pack_0_9_1-RC1` folder (≈ 13 GB) is never offered for deletion, because BUNDLE_NAME rejects it as well.

If RC1 is published as a GitHub pre-release instead, `Feed.Parse` skips it (`Flag(d, "prerelease")`), and the RC ordering code never runs.

The stand cannot see the defect. Its stem is `Krinik_fixture_1_0_1` (stand.mjs:77), and the `rc` case checks only the screen, never a download.

A side effect: the default notes path becomes `draft_0_9_1-RC1/github_release_notes_0_9_1-RC1.md`, but only `draft_0_9_1/` exists, so step 1 stops unless the notes file is passed as `$2`.

Fix direction: pick one spelling for the RC tail on both sides. For example, `${V//[.-]/_}` in both scripts gives `Krinik_Mod_Pack_0_9_1_RC1`. Alternatively, allow `-` in PART and in BUNDLE_NAME. Then add a stand case whose stem carries an RC tail.

### 2. DEFECT: the «game is running» refusal of make_volumes.sh can never fire

- `_config/release/make_volumes.sh:36`: `tasklist 2>/dev/null | grep -i "ConanSandbox-Win64-Shipping" > /dev/null && { echo "the game is running - close it first"; exit 2; }`

Scenario: the table form of `tasklist` cuts every image name to 25 characters, so the process shows as `ConanSandbox-Win64-Shippi`, and the grep pattern never matches. This was observed on this machine with a running long-named process. `tasklist | grep -i "ArmouryCrate.UserSessionHelper"` printed NOT found, while `tasklist //FI "IMAGENAME eq ArmouryCrate.UserSessionHelper.exe" //NH | grep -i "ArmouryCrate.UserSession"` printed found. The listing shows the names as `ArmouryCrate.UserSessionH` and `AacKingstonDramHal_x64.ex`.

With the game running, the script goes on:
- step 1 overwrites the live Game.ini and GameUserSettings.ini, which the game rewrites when it exits;
- step 2 exports the configs of a running game.

The promise «The game must be CLOSED (make_volumes.sh refuses)» in make_volumes.sh:10 and make_release.sh:11 is false. The `grep -q` → plain grep change in this commit is right for pipefail, but the guard was dead before it and is still dead.

Fix direction: `tasklist //FI "IMAGENAME eq ConanSandbox-Win64-Shipping.exe" //NH | grep -i ConanSandbox > /dev/null`, or `tasklist //FO CSV //NH`. Git Bash needs the `//` form, because a single `/FO` is turned into a path. Ideally look for both names of the launcher's GAME_PROCESSES.

### 3. RISK: the title falls back to the found game's version when the folder of the recorded build is gone

- `_config/launcher/KrinikConanGames.cs:205`: `if (recorded != null) { if (v == recorded && recordedGame == null) recordedGame = gv; continue; }`
- `KrinikConanGames.cs:210`: `if (recorded != null) return (recorded.ToString(), recordedGame);`
- `_config/launcher/KrinikConanLauncher.cs:402`: `return (game.BuildVersion, game.BuildGame ?? game.Version ?? Bundle.GameVersion(here));`

Scenario: `_kumm_backup\pack_version.txt` says 0.9.1, but the `Krinik_Mod_Pack_0_9_1` folder is no longer in the game. For example, the player deleted the 13 GB unpacked folder after the install. `BuildGame` is then null, and once Funcom has updated the game to 3.2.0, the title reads «0.9.1 для Conan Exiles Enhanced 3.2.0». That is exactly the pairing this change removes, and it moves again when the feed teaches the CL (Games.Learn).

Fix direction: write the build's gameVersion next to pack_version.txt at install time, or prefer `Bundle.GameVersion(here)` when `Bundle.PackVersion(here) == BuildVersion`, before falling back to the found copy.

A side note: InstalledVersion now enumerates `Krinik_*` even when the record exists. An enumeration IOException now loses a record that was returned before the loop in the old code. This is unlikely.

### 4. RISK: a forbidden folder that already holds a Krinik build still gets the update plate

- `_config/launcher/KrinikConanLauncher.cs:468-476`: the `game.Kind == CopyKind.Krinik` branch sets `id = "update"` and the plate without `Games.Never(game.Dir)`. `Games.Around` (line 330) does not check never.txt either.

Scenario: the launcher sits in a reference copy that is listed in never.txt and already has a Krinik build (installed by hand). The window offers «Обновить сборку». Each press runs UpdateBuild → `Prepare` → `u.never` box. This is the same «button that always ends in the refusal» that the FoundScreen change fixed for the not-installed case.

Fix direction: check `Games.Never` in the Krinik branch too and drop the plate there.

### 5. RISK: the release guard does not check the modinfo hashes in the wrapper's manifest

- `_config/devkit/set-pak-modinfo.py:224-235` (check_krinik): reads `modinfo.json` only; `bad = krinik_modinfo.problems(mi, stem, rel) + ([] if mi.get("folderName") == stem else ["folderName"])`.

Scenario: a Krinik pak whose modinfo fields are right but whose `manifest.json` MD5/XXH128 entry for modinfo.json is stale passes `--check-krinik` and ships. Such a pak comes from a hand edit or a repack by any tool other than set-pak-modinfo's write path. The write path of the same file (lines 148-154) already treats exactly this as «not equal».

Fix direction: also `repak get` manifest.json in check_krinik and require `kit_manifest.data_ok(man, "modinfo.json", <modinfo bytes>)`.

### 6. RISK, not verified on a live server: HTTP error responses are not closed on the paths that now lead to «Продолжить скачивание»

- `_config/launcher/KrinikConanUpdates.cs:866`: `catch (Exception ex) when (NetFailure(ex)) { Stop = "net"; ... }`, which never closes `((WebException)ex).Response`;
- `KrinikConanUpdates.cs:225`: when the 416 filter is false (408, 429, 5xx), the response is left open as well.

Scenario: on .NET Framework, an unclosed `HttpWebResponse` from a ProtocolError holds its pooled connection until finalisation. The ServicePoint default for a desktop app is two connections per host. 408 and 429 are now designed as «press resume again». After two such answers with a body (GitHub's 429/403 bodies are JSON), the next resume can block for the 60 s timeout and report another broken connection.

Fix direction: `(ex as WebException)?.Response?.Close()` in Run's NetFailure catch and in the generic catch, or close it inside NetFailure.

### 7. RISK: a stand check that cannot fail

- `_config/launcher/test/self.mjs:576`: `if (cut || stop) check(/GET \/file\/\S+ .*range=bytes=\d+-/.test(fd.text()), 'the resumed part was asked by Range', ...)`

Scenario: `Feed.HasZipEnd` (KrinikConanUpdates.cs:138, `req.AddRange(from)`) asks for the last part's tail by Range on every run. The feed logs that request as `GET /file/<last part> ... range=bytes=N-`. The check therefore passes even when the cut part is fetched whole again. It does not prove D4 or D5 «resumed by Range». The new D6 lines prove their own claim and are not affected.

Fix direction: match the name of the cut file (the feed's `cut after` line could log it) or exclude the tail offset `size - 65557`.

### 8. COSMETIC

- `set-pak-modinfo.py:225`: `.lstrip("﻿")` holds a literal, invisible U+FEFF, while line 141 writes `"﻿"`. An editor that drops the character turns it into `lstrip("")`, and a BOM'd modinfo then fails with «Unexpected UTF-8 BOM». The guard still fails closed. Fix: write `"﻿"`.
- `dash_lint.py:229`: `at = text.find(json.dumps(mod) + ":")` finds the first release that names the mod. Once 0.9.2 is in the table, its hits are reported at the 0.9.1 line. Malformed JSON gives a traceback with exit 1 instead of the documented 2.
- `make_volumes.sh:46`: `--check-krinik | tail -6` can hide [fail] lines when there are more than five problems. Consider `tail -12`, or print only the [fail] lines.
- `make_release.sh:44-48` (step 2b) runs after build-docs.py. Placed before step 2, the cheap guard would stop the run sooner.
- `krinik_modinfo.py:70`: the `not (...).strip()` clause is redundant, because `!= want[k]` already covers it (want is never empty). `write_json`'s `like` parameter is unused. `kit-buildmod.py:186`: `names =[` is missing a space.

## Observed state, which is not a code defect

`--check-krinik` was run on copies of the four Krinik paks:
- **Working game.** All four fail with empty author, authorUrl and changeNote. These are the paks of 2026-11-18. make_release.sh step 2b stops the release until the new paks are deployed into the game.
- **`_unpacked`.** Archery, Gameplay and Graphics pass. KrinikConanUI fails: its pak is dated 2026-11-18 21:29 and was not rebuilt after the change.

The export still passes step 2c, because make_volumes step 2b writes the fields into the export's copies first.

## Checked, nothing found

- **`InstalledVersion`.** `v == recorded` uses ReleaseNumber's value `==`, which is null-safe. The pairing of the version and its game is consistent in the hand-made, launcher-made and recorded branches.
- **`Games.Never`.**
  - Line handling: quoted lines, CRLF, a BOM (`ReadAllText` strips it), `/` separators, UNC paths, drive-relative and relative lines (logged once).
  - Concurrency: the lock and the file-based `MetalWindow.Log` cannot deadlock with the UI thread.
  - Placement: the FoundScreen check comes before LocalBundle.
- **`Feed.Download` on a 416.** The recursion ends: after the delete `have = 0`, no Range is sent, and the filter is false. The 416 response is closed.
- **`NetFailure`.** Unchanged for non-HTTP errors, with 408 and 429 added.
- **The stop mark.** It is now cleared after the refusals, on the pool thread. There is no race with the UI, because FoundScreen is not drawn during a job. PartsDir is set by Prepare, and the Local path is skipped.
- **pipefail in both scripts.** `tail` reads to the end, so there is no SIGPIPE. The marker grep keeps `|| true`. Deploy-ModPack -Export exits 1 on failure, so pipefail sees it.
- **The volumes as release parts.** They are moved with `mv`, use 7-Zip `-v<bytes>b` naming `.001…`, and the size check uses the same LIMIT. Paths with spaces (`GAME_FWD`) are quoted. `bash -n` passes.
- **krinik_modinfo.**
  - Reading: the RC tail maps to X.Y.Z; a missing note stops the build before the cook.
  - Writing: `write_json` keeps the BOM and CRLF.
  - Hashing: kit-buildmod fills the fields before it hashes the manifest, and build-level-mod fills them before its md5.
- **`--check-krinik` on copies.** It finds empty fields and a pak found twice (a copy in a subfolder), and its exit codes are right.
- **dash_lint on the change notes.** 0 hits.
- **The new stand checks.** Each of these fails on the old code: the anchored `^pressed` checks, N3, N4, the U1 hold file, the H1 title, D5b (UpdateAllowed does not check the game, so the refusal really comes from Run), D6 and D6b. The game-process precheck uses the untruncated CSV form. The watcher-ready gate works.
- **The test tools.** `node --check` passes. feed.mjs `--status` and `--range416` are scoped right: they skip `.001` and the HasZipEnd Range request. click.ps1 is ASCII-only, has no BOM, and runs on PS 5.1.

A side effect of the allowed runs: `py_compile` and the guard and lint runs refreshed five git-ignored `.pyc` files under `_config/devkit/__pycache__` and `_config/release/__pycache__`. Nothing else in the repository was touched.
