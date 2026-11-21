# KUMM — Current Status

> This file is read by the AI agent before every task. Update it on every significant change of state.
> It is the PRIMARY handoff between sessions: a new agent session starts with empty context and must be
> able to get productive from this file alone. Write accordingly — concrete, with file paths and commands.
> 🧠 Prime thinking principle — `PHILOSOPHY.md` (SIMPLICITY: KISS + Occam). Read your working framework
> in `AGENT_GUIDE.md`.
>
> ⚠️ **STATUS is a SUMMARY of NOW, not a chronicle.** A status file that only ever grows turns into
> the project's history book, and the agent that came for a quick "where are we" drowns in it
> (field: a 2 300-line STATUS — "an abyss, not a summary"). The rules that keep it a summary:
>
> - **Every line passes two tests:** *"if I remove this line, will the next agent make a mistake?"*
>   and *"does a newcomer still read the whole file in one sitting?"* Soft target: **~200 lines**
>   (one-two screens of substance) — the guard is a warning, not a wall, but crossing it means a
>   trim is overdue.
> - **Closed work is MOVED OUT, not accumulated:** when a phase/session's entry is no longer "now",
>   move it VERBATIM into `PROJECT_HISTORY.md` (the chronicle — that is what it is for).
>   `/end-chat-soft` carries a "bonsai trim" step for exactly this (`/pause` stays ceremony-free by design).
> - **Leave the file the way you'd want to find it:** fresh summary of what works, what's in
>   progress, what's next, the pitfalls, and WHERE TO LOOK for the details (plans, bugs, history) —
>   pointers, not retellings.

---

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

> 07–08.10, Medieval Dynasty up to the pause, Svarog 09.10–10.10 — chronicle, entries 2026-10-10 03:38, 2026-10-10 16:31, 2026-10-11 00:46.
> 2026-10-28 23:2x (context-budget hook, HOUSE_RULES compacted, documents in English) and 2026-10-29 — chronicle, entry 2026-10-29 18:43;
> the hub work of 2026-10-29 — "Where to continue" → NOW.
---

## Where we are now

> # 🔥 PRIORITY OF THE COMING DAYS — WE DO NOT REST UNTIL BOTH ARE DONE
> `[OWNER]` 2026-11-18 09:12–09:13 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-18 08:11, notes 09:12 and 09:13). Autonomous work (/dayloop) on exactly this, in this order:
>
> **⚡ 2026-11-18 18:17–18:19 — the build 0.9.1 with the launcher 1.0.0 is the focus, the items below are ONE linked goal, done together** (`[OWNER]`
> «КРИТИЧЕСКИ ВАЖНО СОБРАТЬ СБОРКУ 0.9.1 с лаунчером 1.0.0» · «стремимся это сделать!!!» · «фокусируемся на этой работе» · «это приоритет #1 из трех пунктов» · 18:17 ·
> «там три связанных пункта вместе» · 18:19; chronicle entry 2026-11-18 18:17). «Собрать» =
> the shipment built and verified (launcher 1.0.0 exe, export bundle, parts, digests, PDF guide, release notes) — publication still waits for his word.
>
> **⏭ 2026-11-18 20:51 — TWO items are left; the correct-Russian item (plan 58: every string through the core, the proofreading after RC1 into RC2) is OUT of
> 0.9.1 and moves to the next version** (`[OWNER]` 20:51, chronicle entry 2026-11-18 20:51). Rules 33 and 35 and the hooks already running stay in force for any
> text written now; the proofreading of the whole build is not a gate of 0.9.1.
>
> **⏮ 2026-11-20 09:47 — the correct-Russian item COMES BACK into 0.9.1, but for the build's META information only, not the mods** (`[OWNER]` 09:47, chronicle
> entry 2026-11-20 09:47): README, the user guide, the release notes, the Nexus page, the mods' descriptions (README / guide tables, the game's mod list),
> the Krinik paks' change notes, the wallpapers' names — written by the owner's portrait, rules 33 · 35 · 35.6, `kaif-voice-lint check`, a clean read, the
> page of pairs for the owner. OUT: the mods' in-game strings and translation tables (plan 58's every-string proofreading stays in the next version).
>
> **1. The full launcher 1.0.0 with ALL the owner's wishes, every function tested** — `plans/57_EPIC_conan_launcher_self_sufficient.md` (+ epic 55 phase B):
> finds the game on the disks, sees / downloads the latest release for the found game version, installs, updates, uninstalls, the progress bar with %, speed,
> remaining and elapsed time, the version line, no impossible window state, the KUIPS mockups as the design. The owner names it **1.0.0** (09:12) — the manifest
> says 1.1.0 today: settle the number with the self-update rule (`Feed.Newer`) before the release. Exit: a written case set for every function, a functional
> run by the player's path on a real copy of the clean 3.1.1 (`HOUSE_RULES.md` 25) — every case PASS, the run reports in `testcases/reports/`.
>
> **2. The build 0.9.1 in a working MVP state — the ROUGH POLISH, FIXING AND TESTING of the build: the critical bugs of the build and its mods fixed** (critical = HOUSE_RULES 38:
> crashes, slowdowns, lags, errors, dead buttons, dead ends, no save, no load) — a working, more-or-less stable state; epic 55. This item is its own work, NOT the sum
> of the others (`[OWNER]` 2026-11-18 19:29, chronicle entry 2026-11-18 19:29; «грубая полировка, фиксинг и тестирование 0.9.1» · 20:51). The release
> 0.9.1 is assembled from both items; the publication itself waits for the owner's word.
>
> Note: other projects read the core from `D:/work/ai_sandbox/krinik_voice` (an older clone of the same repo) — it needs a `git pull` by its owner session.
>
> 🎯 **The Conan 3.0.1 build is the main work since 2026-10-26 ≈08:30; every other game is out of priority.** `[OWNER]` «все игры пока не в приоритере, мы
> работаем дат сборкой конана» · «она 1_ должна работать стабильно 2_ моды не должны конфликтовать, должны быть рабочими 3_ не должно быть
> явных просадок производительности из-за модов» · 2026-10-26. Work order — "Where to continue", item 0.
>
>
> The move to 3.1.0 (done; the build runs on 3.1.1) and the 2026-11-18 progress pointer — chronicle, entry «2026-11-20 11:0x — STATUS bonsai trim, part 3».
> The paused games (Svarog's Dream, Medieval Dynasty, Mafia II, Conan 2.2.3, Oblivion Remastered parked until its patch, Cyberpunk 2077 with no game
> installed) — their return pointers moved verbatim to the chronicle, entry «2026-11-20 12:2x — STATUS bonsai trim, part 4».

The engine works and the owner uses it daily for Palworld. It checks its pure core (the first test since 2026-09-08, four since 2026-10-14):
`node test-parse-archive.mjs`, `test-archive-roundtrip.mjs`, `test-pick-card.mjs`, `test-help-commands.mjs` (exit 0 = green), and the game
half runs on a fake pack — `node tools/fixture-pack.mjs` (`-ListMods`, `-Deploy -DryRun`, a real `-Deploy` and `-Verify`, paks after `-Only`:
37 checks since 2026-11-01 — the undo journal, the player's uninstaller, the desktop shortcut; all 37 passed on 2026-11-01). Not covered yet: the live Nexus path (Chrome) — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🟡 in progress | 2026-10-14: four regression tests of the pure core + launch guard + fixture stand; 2026-10-15: the stand deploys and runs `-Verify` (20 checks, bug 46 DONE); Engine.ini runtime-cvar warning — first slice 2026-10-30 |
| Phase 2 — the second game | 🟢 **proven on Conan** | the engine took Conan Exiles Enhanced **without a single edit**: slug `conanexilesenhanced` from the manifest, `game_id` from the page. Oblivion Remastered stays prepared (manifest of 168 mods), waits for its patch |
| Phase 3 — compatibility | 🔲 todo | the conflict source is found: `UnrealPak -List` from the Dev Kit reads any Oodle pak (`researches/conan-devkit/`); the work — phase 3 of epic `plans/06` |
| Phase 4 — optimization presets | 🔲 todo | |

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

> Tasks the agent can do FULLY autonomously: write code → build → test on the harness → fix → commit,
> without the human and without resources only the human can provide. The loop skills
> (`/autoloop`, `/dayloop`, `/nightloop`) grind this pool.

- Done pool items (launch guard, archive-name round trip, `pickCard` cases, the `help` command, the 20-check fixture pack) — chronicle,
  entries 2026-10-14 23:22 and 2026-10-16 23:39.
- [x] **Warn when a mod overrides `Engine.ini` at runtime** — FIRST SLICE DONE 2026-10-30 16:3x: `-Verify` warns «<Mod> sets <cvar>=<v> at runtime (<file>:<line>); the pack's Engine.ini sets <v>» for `source.folder` mods (report `testcases/reports/2026-10-30_engine-ini-runtime-cvar-warning.md`; next slices: archives / Workshop paks, blueprint bytecode). Both ailments of 21.08 were invisible to the engine:
      the deploy checked every file and still shipped a build whose graphics a Lua mod rewrites in the world.
      A cheap first slice needs no running game: scan the mods' sources for
      `[SystemSettings]` and `r.*` assignments and report which collide with the pack's `Engine.ini`.
      Field arguments (Palworld `r.ViewDistanceScale` in four places; in Conan the rival is the game itself) — chronicle,
      entry 2026-10-06 23:38, section «Доводы к пункту Engine.ini».
- [ ] **Rewrite old Russian working documents in English when taken into work** (plans, bugs, researches, game maps) — the owner's word
      2026-10-28; the KAIF entry documents were rewritten the same evening.

---

## ❓ Awaiting human review (interviews / homework)

> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- 🎯 **Oblivion-style archery — raised by the owner 2026-10-28** (a discussion, not work: `[OWNER]` «пока обсуждаем»): arrow speed — Conan's,
      the drop — Oblivion's. Vanilla `ArrowGravityScale` 0.55 and `ArrowInitialSpeedMultiplier` 5000 (Remastered) found; waits for his choice of what
      the draw does (shot power, as in Remastered, or a flatter flight, as in Conan). Recon — `researches/conan-archery/README.md`.
- 🛡️ **2026-11-20 09:5x — the owner's side errand (a browser game, then «check C for malware»): the game planted nothing, the Chrome cache is cleared; leftovers of
      an EARLIER infection weaken the machine's antivirus.** The owner ordered the removal (10:10–10:13, «УБРАТЬ!» ×3, Chrome closed by him 10:13): the
      helper backs up, cleans the local policy file and the live policy values, turns protection back on, restarts the full scan, revokes the 8 spam
      notification grants; Tamper Protection is the owner's own switch in Windows Security. Details are private and stay out
      of this public repo: `KUMM/.work/malware_check/report.md` (git-ignored). A full scan of C: runs detached (Defender, under the machine lock `kumm` to 13:47).
- ❓ **2026-11-20 10:58 — the owner asked whether our five pak-less mods (Camera, EngineTweaks, Locomotion, ModPackManager, RussianTranslation) should get small
      «visiting-card» paks so the game's mod list shows each with its description, author and change note.** Answered in chat: possible (plan 44 step 4,
      moved to 1.0.0; a kit-cooked pak is required — the game refuses a wrapper without AssetRegistry.bin, probes 2026-11-03), recommended for 1.0.0,
      not to hold 0.9.1-RC1; waits for his word whether he wants them in 0.9.1.
- 📧 **2026-11-20 14:44 — the live Nexus page of 0.9.0 shows the email as raw BBCode** `[email=<author's address>]…[/email]` (the owner's frame; Nexus has no
      `[email]` tag; its WYSIWYG editor rewrites our `[url=mailto:]` into it). Fix: the address as plain text after «Email:» / «Почта:» in
      `ConanExiles/_config/release/build_nexus_description.py` (lines 177, 183) and on the live page by `tools/nexus-desc.mjs`. The owner 14:44: later, the build first.
- 🧹 Disk cleanup 2026-10-25 — the "your call" items of `C:\REVISIONS\…_ИТОГ.md`, `D:\REVISIONS\…_ИТОГ.md` are the owner's (chronicle, 2026-10-25 22:15).
- 🔴 **Do NOT run `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335 -Execute`**: the quarantine holds the only
      copy of an Elden Ring save and the personal video `ref.mp4`.
- 🗂️ **Old questions to the owner** (cleanup 17.08 — malware, RTSS, iTunes, quarantine; Palworld `LoadingRange` 25600 — what to restore;
      Oblivion — mod-list rows and reshades; the "not a Steam install" line and the anonymisation rule) — chronicle, entry 2026-10-12 19:22.
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
      run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

> **NOW 2026-11-21 16:5x — the chat of 16:34 («продолжаем делать сборку Конана»).** Interview #042 ANSWERED: **C** (16:58; A at 16:44) — ONE format in the
> end, the per-file set: the next release carries both sets (RC1 / RC2 launchers), the launcher learns the first install by the file list (plan 57 phase 6
> step 6), then the volumes leave the GitHub page, Nexus keeps one archive; the owner 16:46: the updater works «так, как делают такие системы», and a player
> who skipped releases updates in one press to the latest (plan 57 criteria 6 and 7; case D9 PASS). **Pack `4da1a28` PUSHED** — the launcher's update by
> the file list with judge rounds 3 and 4 fixed (21 findings, 0 defects; «review: 2 rounds» in the message): every asset checked before the question,
> `Unusable` → the volumes on any unusable list (4xx, bad digest, mismatch), the staging's own bytes counted free and removed after «Да», read-only and
> exFAT bundles, `Pour` progress and stop, the strings by the clean reads, the ritual's stage E checks the per-file set and the kept manifest's digest;
> bug 115 / issue #46 (commented): `Describe` AND `Installed` need the journal, the leftover removed, the uninstaller template `if %errorlevel% neq 0`.
> Stand run 11 (D1–D9, D5c, U-X2, U-X; report `testcases/reports/2026-11-21_conan-launcher-delta-update-stand.md`). NEXT: plan 57 phase 6 step 6 — the first
> install by the file list (then the files-only mode of `make_release.sh`, the guide's manual install, D4 rewritten); step 5's real update on a copy of the
> clean 3.1.1; step 7 is a measurement at the next big-mod update. Also done: the claim guard reads «+03:00» as a zone (`tools/check-claim-before-evidence.mjs`,
> 310/310, judged in round 4); `make-info-pak.py` removed (pack `e41dfd0`); D6 waits for the new launcher (pack `e6b4243` — a stand launcher had stayed
> running). The stand folders and `.work/repro` removed 17:2x (≈ 10 GB); the runners `.work/delta/run_r6.sh` and `.work/uninst/errorlevel.mjs` stay.
>
> **2026-11-21 12:29 — the chat of 12:06 (the owner pasted the previous chat's farewell): the round-2 owed items of the launcher's update by the file list
> are BUILT and D1–D8 PASS on the stand (run 9; report `testcases/reports/2026-11-21_conan-launcher-delta-update-stand.md`), NOT committed — judge round 3
> running (code + a clean read of the four new strings). Changed in the pack: `_config/launcher/KrinikConanDelta.cs` (`Mismatch` → the volumes, the hardlink
> probe, copies with progress, the outside bundle as a seed, `Links`), `KrinikConanUpdates.cs` (`RunByManifest` two tries, `Tidy`, `Job.Stage.Copy`),
> `KrinikConanLauncher.cs` (the freed size in the delete offer, «Скопировано», the reason line of the fallback box), `KrinikConanText.cs`, `test/feed.mjs`
> (`--corrupt`), `test/live.mjs` (delta D1–D8). Stand runner `KUMM/.work/delta/run_r3.sh` (`RUN_DIR=…`, one stand per case, ≈ 4 min). The transition fork
> asked as `interviews/interview_042_conan_release_page_archive_or_file_list.md` (page opened 12:27, closed without an answer). NEXT: the judge's findings →
> fix → rerun → commit + push the pack with the review line → then, by the owner's answer, the real update on a copy of the game.**
>
> **2026-11-21 10:4x — the delta update, plan 57 PHASE 6 (the chat of 10:20 «resume»; the chat of 00:4x did not close — no farewell after the recon).**
> Step 0 DONE, pack `23e9015` pushed: the cause of the 13.56 GB re-download is repak_cli 0.2.3 packing on rayon threads in finish order (one folder → three
> SHA-256; one thread → one, same speed); `ConanExiles/_config/devkit/repak_tool.py` `env_for(args)` — one thread for `repak pack` and `retoc to-zen` only
> (judge round 1: on every child it made `retoc pack-raw` ≈ 4× slower) — passed by the `run()` of six devkit scripts; guard `devkit/t_repak_one_thread.py`.
> Step 1 built:
> `_config/release/make_manifest.py` (per-file manifest, hardlinked assets, parts over 2 GiB, the stored small-files zip, `--previous` → «changed vs»), step 4c of
> `make_release.sh`, the RC2 manifest kept as the previous one (`published_0_9_1-RC2/manifest.json`, computed from the bundle). Cases
> `testcases/TC_conan_reproducible_export_2026-11-21.md`, report `testcases/reports/2026-11-21_conan-reproducible-export.md` (partial: R5 at the next release;
> `kit-buildmod.py` and `patch-mod-asset.py` owed a run at their next use). Issue #45 «Launcher: an update downloads the whole archive…» filed, its first comment
> (the pak order fixed) posted after the push. The manifest code is committed, pack `d85e388` (judge 2 rounds). Step 3 DONE and PUSHED, pack `6dc79ee` + `2137cae` (launcher judge round 1: 2 defects +
> 8 risks fixed; round 2: 1 defect (the fallback asked nothing) + 2 risks fixed; the strings' clean read: 5 applied). The round-2 owed items (R2, R3, R6 and
> the cosmetics) — built in the chat of 12:06, see the NOW line above. `ConanExiles/_config/launcher/KrinikConanDelta.cs` +
> `BuildUpdate.RunByManifest` (only for an INSTALLED build with no started volume download; a broken manifest falls back to the volumes) + the question with the
> real size after the check; the stand (`stand.mjs --delta`, `feed.mjs --assets`, `live.mjs delta [--decline|--bad-list]`) D1, D2, D6 pass (report
> `testcases/reports/2026-11-21_conan-launcher-delta-update-stand.md`, runs 6–7). RC2's paks are multi-thread packed, so the first
> manifest update downloads the third-party paks once more. The stand files `KUMM/.work/repro/` (≈ 12 GB of copies, hardlinks and parts) go after the commit.
>
> **DONE 2026-11-20 ≈22:0x — the owner's side task of 21:35 (skill packs into KAIF), then RC2 resumes from the line below.** Packs live in `D:/work/ai_sandbox/_tools`,
> KUMM links to them: superpowers ×5 skills and REA's skill symlinked into `.claude/skills` (`node tools/skill-packs.mjs check` — 10/10 OK), MCP `rea` (6.10.1,
> Ghidra 12.2) and `context7` at local scope (both «✔ Connected» by `claude mcp get`; their tools load in the NEXT session), KUMM's own `/game-hunt` (Claude-BugHunter's
> method for game testing), the call points — `AGENT_GUIDE.md` → "Third-party skill packs at their call points"; JDK 25 machine-wide (the owner 21:52). Recon and
> what was left out — `researches/agent-skill-packs/README.md`. The official LSP plugins (`csharp-lsp`, `lua-lsp`, `pyright-lsp`, `typescript-lsp`) instead of Serena — installed by the owner's word 22:02 (local scope, servers
> machine-wide). First real use DONE 2026-11-20 22:19 +03:00 (the session after the restart): REA (the launcher exe — 88 types, 588 methods), Context7 (the sources of two
> language servers), LSP for Python, Lua and JS (JS after `typescript` 7.0.2 → 5.9.3: TypeScript 7 ships no `tsserver.js`); LSP for C# serves only C# under
> the session folder and KUMM has none — C# stays a text grep (`researches/agent-skill-packs/README.md`). Still owed: the independent judge on `tools/skill-packs.mjs` and `.claude/skills/game-hunt/SKILL.md` (skipped — the owner moved to a new session at 21:59; the script
> was run red/green with three mutants).
> **NOW 2026-11-20 22:39 +03:00 — RC2 resumed in the chat of 22:07.** Done: mod versions committed (pack `3ac54fc`), the `c27e3a7` note pushed; the UI kit chain ran
> (`KUMM/.work/rc2/kit_chain.sh`: steps 1–5 «Success - 0 error(s)», logs `KUMM/.work/rc2/logs/`, then `kit-buildmod.py` → `KUMM/.work/rc2/kit_out`); the guide read whole
> and edited by the portrait (the four human verbs of programs, the Graphics row, RC2 in the history / what's new, the block «Исправлено в тестовой сборке
> 0.9.1-RC2»; voice-lint: 15 old false hits — CSS percentages, the game term «уникальных», an HTML comment), its clean read at a helper; README.draft RC1 → RC2
> (the draft is regenerated from `README.template.md` by `mods-table.mjs` after `make_release.sh`). `release_checklist.py` (NOT committed, judge rounds 1–2 done,
> 4 judge rounds, committed pack `1bc593d` with the guide, README.draft, `game-front.ps1`): the review check takes the verdict paragraph (note first), finds code
> commits by files, the window starts at the newest build release `v*`; verdict notes on `033d419`, `dc79053`, `e1c0691`, `1bc593d`, `292f129`, `4d1d867`,
> `d7e2583` pushed. **The ritual: 0 TODO, 13 MANUAL, 6 OK (22:57).** The UI pak deployed, «0.9.1-RC2» seen under our logo in the main menu (frame
> `KUMM/.work/rc2/menu_rc2.webp`). `dc79053`'s deferred findings: H1 the dark backing between hub tabs 4↔5 (issue #36), H2 the map's hold timeout unmeasured,
> P1 `FindAllOf('W_Carousel_C')` on every tick of a hold, Q2 dead REFRESH / MAP_PAGE code. **Twins removed 23:04 (NOT committed, at the judge):** the
> busy-keyboard waits and refusals left after the owner's 19:37 cancel — `sprint-cost-run.sh`, `m6-air-shot.sh`, `ab-launch.sh`, `n1-launch.sh`, `ab-video.sh`,
> `hubswitch/hub_run.sh`, `loot-take-clip.sh`, `aim-shot.sh`, the `hover-watch.ps1` comment, and `mouse-seq.ps1`'s `-MarkOwn` calls (no reader left); kept on
> purpose: `esc-when-idle.ps1` (its job is pressing Esc when the keyboard is free). Owed: a functional run of `mouse-seq.ps1` with the game after the build.
> `build_nexus_description.py`: the guide link's label said 3.0.1 while the URL is 3.1.1 — fixed (NOT committed); the email as plain text was already there,
> its run waits for the Nexus step after the release (the owner 14:44).
> **23:20 — released parts built** (`make_release.sh` exit 0, `KUMM/.work/rc2_release/release`: 7 parts, launcher, guide PDF, SHA256SUMS; run report
> `testcases/reports/2026-11-20_conan-rc2-build.md`), pack `2c7c5e4` (the twins, README sizes and the synced Graphics row), the public repo `39896bd` pushed;
> **v0.9.1-RC2 PUBLISHED 2026-11-20 23:57, Latest, 10 assets (13 745 398 619 B)**; the ritual `--published`: 0 TODO, 9 OK (the Latest line fixed, pack `4bb6932`;
> texts kept in `_config/release/published_0_9_1-RC2`); the shipment dir and the RC1 parts deleted. U1 pass (RC1 from local parts, 74/74, 0 missing), U2 pass
> (the RC1 launcher: «новейшая 0.9.1-RC2», screen `update`), **U3 pass 00:22** (21 min download, 74/74, 0 missing), **U5 pass** (the player's marker kept), U4
> by proxy (the installed UI pak carries «0.9.1-RC2») — report `testcases/reports/2026-11-21_conan-launcher-update-rc1-rc2.md`. The machine lock released 00:27.
> **🔥 OWNER'S WORD 2026-11-21 00:28 — FIRST next: the launcher's update must download only what changed, never the whole 13 GB for a small update**
> (verbatim — chronicle entry 2026-11-21 00:28). Recon (Steam depots / itch.io butler / zsync / a patch archive from the previous release) → a plan in the
> launcher epic (plans/57, plan 54 case B) → code → the update RC1 → RC2 again on the copy, measured in MB; a GitHub issue «Launcher: an update downloads the
> whole archive» by rule 44. **Recon DONE 00:45 → `researches/conan-launcher-delta-update/README.md` (read it first):** RC1 → RC2 really changed 12 files,
> 37.3 MB, but 62 third-party paks (13.56 GB) differ byte-wise at the same size — the export's `set-pak-modinfo.py` rewrites every pak wrapper in a non-fixed
> order (checked: `UIMod_Hosav.pak` 26 599 644 B in both, sha256 d79254b1… vs e5ebbe20…). **Step 0: a reproducible export** (fixed entry order, no rewrite when
> nothing changed; a guard: export twice, compare). Then option A: a per-file manifest (path, size, sha256) with each big file as its own release asset, small
> files in one zip, files over 2 GiB split (`Shemite_City_State.pak` 2 396 312 301 B); the launcher hashes local files, stages, downloads only the difference,
> verifies, renames once, runs today's installer; the old bundle kept until success. GitHub: asset < 2 GiB, ≤ 1000 assets, Range works (single ranges),
> the signed asset URL lives ≈ 1 h. RC1/RC2 launchers know only the volumes — the self-update brings the new launcher first.
> Also from the uninstall check 00:28–00:32 (the same report): the game returned to clean (hash list: missing 0, bad 0); the RC1 bundle (13.7 GB) stays
> after the update; after the uninstall the launcher showed «installed» instead of «Установить сборку» (HOUSE_RULES 26) — reproduce, file, fix.
> Owed next: the issues #3 #11 #12 #33 get «вошло в v0.9.1-RC2» comments (close only after their open cases M2, N1, N3, D2); the RC1 bundle folder stays beside
> RC2 in the copy (look at the L9 delete offer); the test copy `KUMM/.work/rc1_install` (≈ 59 GB + 2 bundles) and `KUMM/.work/rc2_update` to remove when the
> RC1/RC2 install checks close (the uninstall back to the clean game is the one left); the Svarog cleanup needs a wider auto-mode rule or the owner's hand.
> The update test (cases `testcases/TC_conan_launcher_update_rc1_to_rc2_2026-11-20.md`): the RC1 launcher and parts moved into `KUMM/.work/rc1_install/Conan_311/rc1_launcher`,
> started by `KUMM/.work/rc2_update/start.ps1` (TEMP, state, desktop, search roots, Steam isolated; log `KUMM/.work/rc2_update/tmp/KrinikConanLauncher.log`),
> buttons by `node KUMM/.work/rc2_update/click.mjs <pid> install|update|play`; U1 (RC1 from local parts) started 23:20. After the upload: delete
> `KUMM/.work/rc2_release` and `Conan_311/rc1_launcher` (D: had 36 GB free), U2–U5, the ritual `--published`, issues #3 #11 #12 #33 commented and closed after the
> retest. The Svarog cleanup (`SvarogsDream/_harness` 20.5 GB) was refused by the auto-mode classifier — its allow rule covers `KUMM/.work` only. Machine lock to 00:27.
>
> **CHAT CLOSED 2026-11-20 ≈21:2x (the chat of 19:53 «resume», autonomous; soft closure at the 80 % budget).** Done (packs `29a612b`, `e1c0691`, `d7e2583`,
> `4d1d867`; reports `testcases/reports/2026-11-20_conan-dialogue-world-pace.md`, `…_conan-immortal-heroine-save.md`): issue #3 — talks keep the world at 1.0
> (both talk windows) AND the NPC's answers in a talk are visible again (my `krinik_shout_fade` hid them since 2026-10-31; control, fix, retest at the Iruk
> merchant); issue #6 — the save keeps my god mode, the owner's save is mortal, `enter-world-remote.sh` warns at every entry; the release gate on a play report
> (`check_play_report.py`, 29 cases, step 0 of `make_release.sh`, waiver by the owner's word); HOUSE_RULES 44.4 (the retest is my own play); plan 60 (skills +
> play driver), recon `researches/ai-agent-plays-game/`; idea 27 = issue #44; KAIF #201. Detail of this chat — chronicle, entry «STATUS bonsai trim, part 9».
> **FIRST in the next chat (the owner ordered autonomous work 19:37):**
> 0. **🔥 0.9.1-RC2 — the owner's order 21:09–21:14 («собираем RC2» · notes super short, only what RC2 fixed + a link to RC1 · «собирай без часа» — the play gate
>    waived by his word through `KRINIK_PLAY_GATE_WAIVER` · «отгрузили игрокам сломанное гавно» · «максимально быстро чинить» · «это будет новый релиз формально»).**
>    Done: packVersion 0.9.1-RC2, notes `ConanExiles/_config/release/draft_0_9_1/github_release_notes_0_9_1_RC2.md` (four fixes worded «был баг — исправлен» by his
>    21:12 word, voice-lint 0), KrinikConanUI change note + the RC2 lines, pack `e1c0691` pushed (judge round of 21:14 read, its findings below).
>    A `make_release.sh` run of 21:14 (log `KUMM/.work/rc2_release.log`) was STOPPED by me at step 2b — the partial export lies in `KUMM/.work/rc2_release` (empty it by `rm-tree.mjs` first); its KrinikConanUI pak carries the menu
>    version line «0.9.1-RC1» (kit `kit-conanui-edit.py` PACK_VERSION is read at the KIT build): **first** rebuild the UI kit pak (`kit-conanui-edit.py`,
>    `kit-krinik-modsettings.py` ×2, `kit-krinik-click-events.py` ×2, `kit-buildmod.py KrinikConanUI`, copy into `_unpacked`, deploy, `set-pak-modinfo.py`),
>    then a clean `make_release.sh` again (empty the work dir file by file, `rm-tree.mjs`). FIRST run the release ritual `python -I -X utf8 ConanExiles/_config/release/release_checklist.py` (5 TODO on 21:2x: Krinik mod versions, the menu line, the guide, the README, a code commit without review) and READ THE GUIDE against the owner's RC1 remarks (he: «НУ И ЗРЯ!», 21:24). Then the whole HOUSE_RULES 42 list: the GitHub release `v0.9.1-RC2`
>    (notes, title, `--latest`, parts + launcher + guide PDF + SHA256SUMS), README / public tree, the guide's version (HTML + PDF), read back each in its medium;
>    then I check the launcher's update RC1 → RC2 on a copy of the game with RC1 (the owner's purpose of RC2). Judge round of 21:14 owed fixes: the NPC's FIRST
>    line of a talk may be born before `IsModuleActive` turns true and stay hidden (check the greeting by a burst); `t_play_report.py` depends on a clean tree;
>    the gate does not watch the git-ignored built paks and `docs/guide/guide-3.1.1.html`. The NPC answers in a talk are visible again (fix in `e1c0691`, seen at the Iruk merchant 21:05).
> 1. **Owed retests and judge findings of this chat:** G1 (a humanoid hits the heroine, god OFF) for issue #6; the talk GREETING line (born before
>    `IsModuleActive` turns true?) by a burst; N1 (switches between the four game pages), N3 (every button of the five copied tabs), M2; `dialogue-stand.lua`
>    one-call flags not yet run in the game. The dev harness (`ue4ss/Mods/KrinikAgentRemote`, `KrinikMenuProbe`, `KrinikConanBench`) is in the owner's working
>    game since 19:57 — remove it when the RC2 checks end. The owner plays other games on this PC: Conan by the BACKGROUND path only (`post-key.ps1`, E added).
> 3. The next roots (plan 59, issue clusters): the bow states (#2, #5, #8, #9, #30, #40); first person and shadows (#4, #13, #34); the name plate (#10). Every fix: control case, real input, comment on its issue, a matrix row.
> 4. Plan 59: steps 3, 4 (the gate in `make_release.sh`), 5, 6 done 2026-11-20; step 2 owed — fill the matrix from the nine mods' notes and show it to the owner as a page.
> 5. Owed to the owner (17:40): views of the mods' NEW locations (Shemite City State, Caverns of Set / Akhlut Outpost, Ymir's Respite, the Al-Merayah fortress) and a
>    new hub frame, shown as a page before they go into the README.
> 6. The desktop: «Krinik Conan.lnk» → the release launcher; the old «Krinik Conan (dev).lnk» and `Krinik_Launcher_dev` in the game folder stay (auto mode
>    refused the deletion — the owner may delete them).
> 7. Work files to remove when their tasks close (file by file, `rm-tree.mjs`): `KUMM/.work/wg_rc1`, `.work/public_repo`, `.work/public_tree`, `.work/readme_shots`,
>    `.work/issues` (keep `filed.json` until the index is trusted).
>
> **Still open from the chat of 16:20** (its closed summary and the done item 1 — chronicle, entry «STATUS bonsai trim, part 7»; item 5 is now issue #17, the
> «Подтвердить» finding of item 6 is issue #14):
> 2. **The RC1 checks not run yet** (on the fresh clean copy `KUMM/.work/rc1_install/Conan_311`, 59 GB, kept for this): the uninstall back to the clean game, the
>    update over an older build, a short play of the main features, the menu tab text jitter by a 60 fps video (bug 64 row 6 — decides its known-issue line).
>    Then remove `rc1_install`, `rc1_dl`, `rc1_run` and `save_backup_2026-11-20` by `node D:/work/ai_sandbox/ConanExiles/_config/rm-tree.mjs D:/work/ai_sandbox/KUMM/.work/<dir>`.
> 4. **Cleanup is the agent's duty** (the owner 16:50–16:51): `KUMM/.work/svarog_cleanup.cmd` (SvarogsDream `_harness` 20.5 GB, review folders, `src/*/bin|obj`) —
>    the auto-mode allow list was widened 17:2x by `node KUMM/.work/automode_rule.mjs` (the owner 16:51, chronicle entry 2026-11-20 16:50): run the cleanup
>    yourself — `node D:/work/ai_sandbox/ConanExiles/_config/rm-tree.mjs <named folders>`, alone in its call; never hand it to the owner.
> 5. **Nexus:** the live 0.9.0 page shows `[email=…]` raw — fix by `tools/nexus-desc.mjs`; the Nexus publication of 0.9.1 only by the owner's word.
> 6. **RC2 list:** judge 7's deferred risks (`place()` two live windows, `btn` after a failed wrap, the second `forget_old_window()`, dash_lint C# forms), G5, bug 85
>    D2 / D3, the «О проекте» plate (mockup waits for his look), the guide's English pages (asked 14:4x, no answer), the Camera cell look, the three S3 findings of
>    the install report (no log line for «Играть»; «Engine.ini not touched» misleads; «Подтвердить» over its Enter badge).

## Open bugs

Files without the DONE tag — 54 (counted 2026-11-17 06:23 +03:00; 50 on 2026-11-15). The Conan-era open ones: 64, 70, 74, 75, 79, 83–91, 93–101, 103 (the farewell
hook — the mark fix built 2026-11-17, the live closure owed), 104 (the hand on the string — the game's pose, interview #038), 105 (the wall grab — the owner's
final check, interview #037 Q1), 106 (the climb's stamina — interview #037 Q2) — the list below names the ones with live symptoms; the rest are paused games' bugs:

- 🔴 `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` — the UI of the Conan 3.0.1 build's mods, 26 items: open 4, 5, 6, 12, 13 (partly),
  15 (🟡 hub controller in the build), 16–18, 23 (EAA class cards — text in textures), 26 (late emblem in the hub); closed by a frame 2, 3, 7, 21 (4K, 2026-11-07), 7b, 8 (again 2026-10-31 at 1080p, list 540), 9–11,
  14, 16, 19, 20, 22, 24, 25 — work order in plan 35.
- 🔧 `bugs/93_…` — the bow sprint in the owner's order: build 7, `[OWNER]` 2026-11-13 11:01 «спринт и стрельба работают»; open cases S8, S9, the cost. 🔴 `bugs/94_…` — hub craft batch
  finishes at once after the close (fixed 2026-11-14, waits for the owner's play). ✅ `bugs/95_…` — the bow in first person: look B ships, the owner accepted it 2026-11-16 18:40
  (interview #036; this line said «🔴 first next» until 2026-11-18 19:0x — corrected after the owner caught it).
- **Critical = the software's technical state: crashes, slowdowns, lags, does not start, falls, errors, no window, extra windows, a button that does not press,
  blockers, dead ends, cannot continue, does not save, does not load; a visual defect is cosmetic** (`[OWNER]` 2026-11-18 18:58 · 18:59, chronicle entry
  2026-11-18 19:0x; HOUSE_RULES 38). Fixed and waiting for the owner's play: `bugs/101_…` (the hub flashes the bare world on a switch), `bugs/97_…` (journeys locked
  after the tutorial). The critical ones open for 0.9.1: `bugs/85_…` the rare crash from key binds — five binds left in KrinikConanUI; `bugs/79_…` the world freeze
  after an in-game loading screen — waystone and dungeon cases not run; `bugs/100_…` the hub at the Esc menu's time — fixed, judge owed.
- 🔧 `bugs/115_conan_launcher_installed_after_uninstall_window_closed.md` (issue #46, critical — a dead end): the uninstaller's console closed by its X left the
  launcher on «installed»; fixed 2026-11-21 (the journal is the sign, the leftover is removed), stand case U-X; commit with the round-3 launcher work.
- 🔧 `bugs/85_conan_crash_keybind_lua_races_game_thread.md` — the bow-kill crash: cause fixed in Archery + Camera; the KrinikConanUI twins open; the owner's gameplay is the check.
- ⏸ `bugs/89_conan_water_reflection_flicker.md` — 2026-11-09 15:45, the owner's frame at `river_bend`: dark dashes / grain blinking over the water, «как тени листвы пальм»; PARKED 2026-11-14 09:53 by the owner («в дальний ящик»).
- 🔴 `bugs/86_…` (attribute tree caption under a node icon), `bugs/87_…` (beasts walk into the hero), `bugs/88_…` (corruption debuff line fonts) — 2026-11-07, the owner's frames.
- 🔴 The owner's bugs 55–62 (2026-10-18 13:35–13:43, a wave in 5 minutes of play) — `bugs/55_…` – `bugs/62_…`; order and plan 32 — item 00000 above.

- ⏸ Bugs of paused games (Svarog, GTA SA, Medieval Dynasty) — 15, 28, 29, 38, 40, 41, 44, 45, 47, 48, 49, 50, 51, 52, 54: files in `bugs/`, summary — chronicle, entry 2026-10-28 23:10.

- 🔧 `bugs/14_pickcard_exact_name_pins_old_file.md` (fixed 2026-10-15, waits for a live `kumm check`) — `kumm check` holds on to an old file if the author once
  put the version into the file name (Bosses My New Besties, 02.10). A bug of the engine itself; the fix plan and the case are in the document.
- 🟡 `bugs/07_conan_probe_kills_ue4ss_lua_layer.md` — the symptom removed by turning the mod off, the cause not found.
- ✅ Camera jitter at rest, the menu abort, the config file overriding the camera code — DONE 2026-10-29 by the owner's word («давно исправлено»).

## KAIF — feedback and tickets

KAIF 2.9 since 2026-10-16 (from 2.7 in one step; report `reports/KAIF_UPDATES/KUMM_KAIF_2.9_UPDATE_REPORT.md`): project facts — in
`HOUSE_RULES.md`, the KAIF hooks are wired in `.claude/settings.json` (the client reads them at session start). KAIF feedback — without asking
the owner (`AGENT_GUIDE.md` → Notes from the human, his word of 18.09). Tickets #72, #73, #78–#82 closed by the origin in 2.8 (`bugs/KAIF/03–08_DONE_*`);
open: #140 (`bugs/KAIF/09_*`, the origin moved it to 2.10) and three tickets of that update — #150–#152 (`bugs/KAIF/10–12_*`).
#179 (`bugs/KAIF/19_*`, 2026-10-28): `/resume` costs ≈ 140 k tokens (measured 2026-10-29 10:08 by the transcript `usage`: 64 k → 181 k = 117 k,
`EXPERIENCE.md` grepped by tag, not read whole) — proposed: read each document's "entry slice" at entry; rules as statements
without rationale (the owner's word, in the ticket's comments); until the origin decides, the ritual reads everything. Since 2026-10-28 the hook
`.claude/hooks/context-budget.mjs` runs (2026-10-30: #181 farewell hook, #182 autonomy guard, #183 the agent cleans up after itself — `bugs/KAIF/21–23`): at 70 % and 75 % — warnings only (the owner 2026-10-31 21:26); from 80 % — finish the work, then `/end-chat-soft` in full; `/end-chat-force` only from 92 % (the owner 2026-11-14 19:10 · 22:29; `CLAUDE.md`).
