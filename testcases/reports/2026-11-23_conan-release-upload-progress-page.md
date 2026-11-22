# Run report — the release upload progress page (`ConanExiles/_config/release/upload_progress.mjs`)

**Work.** The owner's wish 2026-11-23 00:21: a local HTML tool to watch how far an upload of our releases has got (KUMM chronicle; HOUSE_RULES_REFERENCE §6).
The basis — what the page must show: the share of the release's files and bytes on GitHub, the speed, time left and elapsed, draft or published, each file's
state; and the judge's round-1 findings (two uploaders, a GitHub error, two tabs, a stale same-name asset, the release list on every poll, the wording).

**Contour.** The real GitHub repository `MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack`; version 1 on the live RC4 upload (gh PID 39600, the release
dir `KUMM/.work/rc4_release/release`, since removed); version 2 (after judge round 1) on the published releases `launcher-v1.1.1` and an unknown tag, and on a
real 150 MiB upload into a throwaway DRAFT release `upload-progress-selftest` (invisible to players, deleted after). Windows 11, Node 24.15, PowerShell 5.1.

**Runs.**
- 2026-11-23 00:22–00:24 — version 1 on the live RC4 upload: `node _config/release/upload_progress.mjs --tag v0.9.1-RC4 --dir D:/work/ai_sandbox/KUMM/.work/rc4_release/release --port 8765`, `/status` read by `curl` twice, the page rendered by headless Chrome.
- 2026-11-23 00:37 — version 2, cases T1 T3 T4 T5 T6: `node KUMM/.work/rc4/upl_test/cases.mjs`.
- 2026-11-23 00:38–00:39 — version 2, case T2: `node KUMM/.work/rc4/upl_test/live.mjs`.

**Checks.**
- Hygiene: `node --check` of the tool.
- Functional run: the page's `/status` and HTML read against real GitHub releases and a real upload; the rendered page looked at (frame `KUMM/.work/rc4/frames/upload_page.webp`).

| # | Case | Expected | Observed | Status |
|---|---|---|---|---|
| V1 | the live RC4 upload (version 1) | the gh process found, files and bytes, speed, time left | 79 → 80 of 83, 25.45 → 25.58 GB of 27.47 GB, gh 39600, elapsed 4 423 s = 23:09:22 → 00:23, 5.83 MB/s, 324 s left; the page: 93.3 %, every file «на GitHub» / «ждёт» | pass |
| T1 | a published complete release | published, 1/1, 100 %, nothing running, the file up | `draft=false 1/1 done=5706240/5706240 running= row=up` | pass |
| T2 | a real upload into a draft | bytes grow while the file is not yet up; speed of the line; the gh PID; then 1/1, draft, nothing running | 27.5 → 66.4 → 102.1 → 138.5 → 150.0 MiB, 0/1 until gh exited, 6.19–6.38 MB/s, `running=43860`; after: `1/1 running= draft=true row=up` | pass |
| T3 | a stale asset with the same name | the file marked «на GitHub другой файл», not counted | `wrong=1 0/2`, the exe `wrong`, SHA256SUMS.txt `wait` | pass |
| T4 | a tag GitHub does not have | «Выпуска … нет», no error | `missing=true 0/1 error=null` | pass |
| T5 | two requests at once after the cache expired | one computation for both | both answers carry `at 2026-11-22T21:37:43.526Z` | pass |
| T6 | an unknown path | 404; the page itself 200 with «Чтение состояния выпуска» | favicon 404, page 200 | pass |

Not covered: two uploader processes of one tag at once (the warning line); GitHub failing mid-run (the stale line keeps the last answer); the page's stop
condition seen in a browser (the condition is the same booleans T1 returns).

**Found.**
1. Mine, in the run: `gh release delete <draft> --cleanup-tag` answers HTTP 422 «Reference does not exist» for a draft (a draft has no tag); the release itself
   was deleted (no draft left on GitHub, checked 00:39).
2. Judge round 1 (14 findings) — fixed in version 2: attribution by the files of each command line and a warning for two uploaders, a GitHub error kept as
   the last good answer marked stale, one shared computation per /status, the tag anywhere in the command line, the digest check, a 5-minute slack, the
   release polled by id, the page stopping when done, the states «Все файлы на GitHub. Черновик ждёт публикации.» and «GitHub принимает последний файл»,
   «Чтение состояния выпуска…», «Сервер страницы не отвечает», sizes in ГБ / МБ / КБ, elapsed kept after the process exits, 404 for other paths, escaped
   names, English comments. Declined: querying one known PID (the process scan is already filtered by name `gh.exe`) and taking the file set from the
   command line (the release dir IS the release's set).

**Traces.** `KUMM/.work/rc4/upl_test/cases.mjs`, `live.mjs` (their console output above) · `KUMM/.work/rc4/frames/upload_page.webp` (version 1 on the live upload).

**Round 3 (after judge round 2), 2026-11-23 00:45–00:46** — the same commands, `live.mjs` changed to name the file to gh by a MASK (`<dir>/*`, expanded by gh
itself) and to check «Прошло времени» after the upload and the page after the draft is deleted:

| # | Case | Expected | Observed | Status |
|---|---|---|---|---|
| T1 T3–T6 | as above | as above | the same five results | pass |
| T2′ | the file given by a mask | bytes never ahead: no file counted twice | 30.1 → 68.8 → 103.6 → 140.5 → 150.0 MiB, 0/1, then `finishing=true` («GitHub принимает последний файл») until gh exited 0, then 1/1 | pass |
| T7 | elapsed after the upload | frozen | `elapsed=30` at the end and 10 s later | pass |
| T8 | the polled release deleted | the page turns to «нет выпуска», no stale assets | `missing=true 0/1 error=null stale=null`; no draft left on GitHub (0) | pass |

Judge round 2 (6 correctness findings, 3 efficiency, 6 cosmetic): fixed — the mask / no-name command line, the 404 on the polled id, elapsed frozen, a
20 s timeout on every child, a failed process query kept with a note, the slack 60 s, polling every 30 s while idle, `per_page=20` for the lookup, the
plural, the wording of the stale, wrong-file and error lines, «Пока выпуск остаётся черновиком», the marker, one lookup in the digest filter. Declined: one
long-lived PowerShell child (≈ 0.4 s every 5 s only while the page is open and an upload runs — not worth a persistent process).

**Verdict.** pass — the page reads real uploads and real releases correctly in every case run; judge round 3 is running.
