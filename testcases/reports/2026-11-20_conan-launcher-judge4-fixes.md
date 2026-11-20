# Run report — judge round 4 fixes: the launcher's error responses, the release script's archive size and guards, the pak modinfo guard

**Created:** 2026-11-20 11:33 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack `7c72d78` + the working tree of the round-4 fixes; launcher 1.0.0, build 0.9.1-RC1

## 1. Work

The findings of judge round 4 on `00c795d..7c72d78` (the helper's report in this chat; nine items): F1 `{{ARCHIVE_SIZE}}` had no producer and no guard; F2 the
tail check and the self-update left an error response open; F3 the stand case `fresh-429` cannot fail; F4 the shared notes name RC1's parts; F5 H2 ignores
whether the feed answered; F6 the pak guard and the write path disagree on a manifest with no modinfo entry; F7 versions compared as text in `Shown()`; F8
pre-releases are invisible to the feed; F9 cosmetics. Basis: the judge's failure scenarios, plan 55 phase E, plan 57's case set
(`testcases/TC_conan_launcher_self_sufficient_2026-11-18.md`), HOUSE_RULES 40.

## 2. Contour

The launcher stand (`ConanExiles/_config/launcher/test/self.mjs`, the stand bundle `KUMM/.work/launcher_r3/st.json`, the batch `KUMM/.work/launcher_r3/batch.sh`),
the exe `KUMM/.work/launcher_r5/build/KrinikConanLauncher.exe` compiled by `make_variant.py` from the fixed sources (build 0.9.1-RC1, launcher 1.0.0); the
release script's new blocks cut out of the real `make_release.sh` by their anchors and run on crafted inputs (`KUMM/.work/judge4fix/t_release.sh`); the
README generator and `make_public_tree.py` on the real pack; the pak guard on copies of the four source Krinik paks and on the working game's
`ConanSandbox/Mods`. REAL WORLD: accumulated — the working game with RC1 deployed (the pak guard read it, nothing written); data and machine — the owner's
machine; path — the release steps a maintainer runs (`make_release.sh`, `mods-table.mjs`, `make_public_tree.py`) and the launcher's own windows on stand
drives (no window on the owner's screen — the stand's C1 check).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-20 11:28 +03:00 | `python -I -X utf8 _config/launcher/test/make_variant.py KUMM/.work/launcher_r5/build 1.0.0` | compiled, 5535 KB |
| 2 | 2026-11-20 11:28 +03:00 | `EXE=…/launcher_r5/build/KrinikConanLauncher.exe TAG=r5 bash KUMM/.work/launcher_r3/batch.sh` (24 cases) | see §4 |
| 3 | 2026-11-20 11:29 +03:00 | `node _config/public_release/mods-table.mjs . README.template.md <scratch>` without and with `KRINIK_ARCHIVE_SIZE(_EN)`; `python -I -X utf8 _config/public_release/make_public_tree.py <scratch dir>` | exit 0 · 0 · 1 (refused) |
| 4 | 2026-11-20 11:30 +03:00 | `bash KUMM/.work/judge4fix/t_release.sh` | 9 PASS, 0 FAIL |
| 5 | 2026-11-20 11:30 +03:00 | `python -I -X utf8 KUMM/.work/judge4fix/noentry_control.py`; `python -I -X utf8 _config/devkit/set-pak-modinfo.py "<game>/ConanSandbox/Mods" --check-krinik` | exit 1 (the control pak failed by name) · exit 0 (4 / 4) |

## 4. Checks

Hygiene: `bash -n make_release.sh`; the C# compiled by `make_variant.py`; `kaif-experience-lint` 0 findings.
Functional run: the launcher exe on the stand by the player's path (search, copies list, install from the feed, from parts beside, from an unpacked build,
resume, stop, 416, 429 / 408, offline, language, title, forbidden folders), the window's log lines and titles READ; the release blocks on crafted inputs and the
README generator / public-tree guard on the real pack, their output READ; the pak guard on the working game and on a control copy, its lines READ.

- **F1 — fixed, tested.** README: without the env the draft keeps both placeholders and the generator says «LEFT FOR THE RELEASE …» (exit 0); with
  `KRINIK_ARCHIVE_SIZE='12,4 ГБ' KRINIK_ARCHIVE_SIZE_EN='12.4 GB'` the README holds «всего 12,4 ГБ» and «12.4 GB in total», 0 placeholders;
  `make_public_tree.py` refuses the committed draft («README.draft.md still holds placeholders: {{ARCHIVE_SIZE}}», exit 1, no folder written). Script
  (t_release.sh): D1 two parts of 60 + 50 MiB → «RU «0,1 ГБ» · EN «0.1 GB»», D2 the copy holds «всего 0,1 ГБ» and «0.1 GB in total» and no `{{`, D3 the
  draft untouched (3 placeholders left in it), D4 an unknown placeholder refused (exit 1); B3 a guide with `{{ARCHIVE_SIZE}}` refused (exit 1) — the control
  is the real guide of `7c72d78`, which carries the placeholder. 13 314 000 000 bytes give «12.4 GB».
- **F4 — fixed, tested.** B1 the RC1 notes pass for `Krinik_Mod_Pack_0_9_1_RC1`; B2 the same notes refused for RC2 («the notes name the parts of another release:
  Krinik_Mod_Pack_0_9_1_RC1»).
- **F9 stem — fixed, tested.** A1 0.9.1-RC1 → `Krinik_Mod_Pack_0_9_1_RC1`; A2 0.9.1+b.5 refused (exit 2).
- **F6 — fixed, tested.** The control copy whose Archery manifest lacks the entry: «[fail] KrinikConanArchery: no modinfo.json entry in manifest.json» (no empty
  «» values), the other three `[ok]`, exit 1; the working game: 4 × `[ok]`, «failed 0».
- **The stand run (run 2), 11:28:53–11:35:23: 24 cases, 340 PASS, 0 FAIL** (no case stopped by a running game, no case empty; C1 «no window of the case
  ever touched a monitor» in every case).
- **F5 — fixed, tested.** «PASS H2 the feed answered (the CL is known) — лента: сборок 1, новейшая 1.0.1 (у нас 0.9.1-RC1)…», then «PASS H2 no build folder in
  the game — … Сборка модов Krinik Mod Pack 0.9.1-RC1 для Conan Exiles Enhanced 3.1.1». The new check was not seen red: a feed that does not answer was not
  staged (GAP).
- **F7 — fixed, tested on the equal case.** H2 walks exactly the changed branch (no `BuildGame`, the record names the launcher's own build) and the title takes
  the launcher's own game; a manifest spelled «0.9.1-rc1» was not staged (GAP).
- **F2 — fixed by reading, the neighbours tested.** Every `GetResponse()` of the launcher now sits in `Feed.Respond` (feed, tail check) or in `Feed.Download`
  with a closing catch; the download cases that pass through those paths — fresh-feed, fresh-cut (the mid-part Range), fresh-stop, fresh-416 (the part dropped
  and fetched whole), fresh-429 (429 → «neterror» → «Продолжить скачивание», 408 → the same), offline — all PASS. The leak itself has no stand case (F3).
- **F3 — the comment of `fresh-429` now says what it guards and what it does not;** the leak has no stand case (loopback), closed by reading.
- **F8 — no change:** the release is published as an ordinary release (plan 55 phase E, the owner's word of 2026-11-18); the feed skipping pre-releases is the
  documented behaviour.
- **F9 — the manifest's version comments** of the nine Krinik mods at 0.9.1-RC1 name RC1 (KrinikConanHarness, still 0.9.1, kept); the docstring of
  `unlisted_krinik_note()` quotes the new sentence. **Declined:** restoring the build record in `kit-krinik-click-events.json` — the file is the kit script's
  last-run report, rewritten by every run; the building run's record is in git (`00c795d`).

## 5. Found

none — no new defect in these runs (the judge's findings themselves are listed in §1 and §4).

## 6. Traces

`KUMM/.work/launcher_r3/batch_r5.txt` and the case folders `KUMM/.work/launcher_r3/r5_*` (the launcher logs); the release checks print to the chat only
(their scratch is deleted by the script).

## 7. Verdict

pass — F1, F4, F6, the stem check seen to refuse on their controls; F5 and F7 seen on the stand's changed branch; F2 fixed by reading with every download
neighbour green; F3 relabelled honestly; F8 no change by the owner's decision; F9 done but one item declined. The full `make_release.sh` run waits for the
texts and the PDF (RC1 build).
