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
- [x] The `Engine.ini` runtime-cvar warning — first slice done 2026-10-30 (its text — chronicle, entry «STATUS bonsai trim, part 18»).
- [ ] **Rewrite old Russian working documents in English when taken into work** (plans, bugs, researches, game maps) — the owner's word
      2026-10-28; the KAIF entry documents were rewritten the same evening.

---

## ❓ Awaiting human review (interviews / homework)

> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- 🎯 Oblivion-style archery (the owner 2026-10-28, a discussion, his choice of what the draw does) — chronicle, entry «STATUS bonsai trim, part 18»; recon `researches/conan-archery/README.md`.
- 🛡️ The owner's side errand of 2026-11-20 (malware check, the removal he ordered) — chronicle, entry «STATUS bonsai trim, part 18»; private report `KUMM/.work/malware_check/report.md`.
- ❓ **2026-11-20 10:58 — the owner asked whether our five pak-less mods (Camera, EngineTweaks, Locomotion, ModPackManager, RussianTranslation) should get small
      «visiting-card» paks so the game's mod list shows each with its description, author and change note.** Answered in chat: possible (plan 44 step 4,
      moved to 1.0.0; a kit-cooked pak is required — the game refuses a wrapper without AssetRegistry.bin, probes 2026-11-03), recommended for 1.0.0,
      not to hold 0.9.1-RC1; waits for his word whether he wants them in 0.9.1.
- 📧 **2026-11-20 14:44 — the live Nexus page of 0.9.0 shows the email as raw BBCode** `[email=<author's address>]…[/email]` (the owner's frame; Nexus has no
      `[email]` tag; its WYSIWYG editor rewrites our `[url=mailto:]` into it). Fix: the address as plain text after «Email:» / «Почта:» in
      `ConanExiles/_config/release/build_nexus_description.py` (lines 177, 183) and on the live page by `tools/nexus-desc.mjs`. The owner 14:44: later, the build first.
- 🗂️ The owner's older open items (the disk cleanup «your call» list of 2026-10-25; the questions of the 17.08 cleanup, Palworld, Oblivion) — chronicle, entry «STATUS bonsai trim, part 18».
- 🔴 **Do NOT run `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335 -Execute`**: the quarantine holds the only
      copy of an Elden Ring save and the personal video `ref.mp4`.
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
      run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

> **THE CHAT OF 13:34 (2026-11-23) — NOW: the FINAL release 0.9.1 instead of RC5, then the work moves to 1.0.0; no more 0.9.1 updates** (`[OWNER]` 13:47 ·
> 13:48 · the full release with the parts, launcher 1.1.2, the updated guide and the README, the notes in the RC1 form with every change · 13:51; chronicle
> entry of that moment). Done: pack `345c905` — packVersion and every shipped Krinik mod at 0.9.1 (`KUMM/.work/rc5/bump_final.mjs`), the launcher 1.1.2
> (`2808b06`); the texts committed (pack `3d9f478`, `9583f39`: the full notes, the launcher 1.1.2 notes, the guide, the README template; voice-lint 0, the
> clean read applied); the plaque's slow first open is a KNOWN ISSUE (the owner's eye 14:27 «медленно первое открытие плашки… Выпускм как есть»; #43 open);
> the KrinikConanUI kit pak rebuilt with «0.9.1» (×4, no «-RC», 8 files = RC4's) and deployed: «74/74 mods · verify 110 present, 0 missing», modinfo 66/66,
> check-krinik 4/4. RUNNING since 14:29: `make_release.sh` into `KUMM/.work/rc5_release` (log `KUMM/.work/rc5/logs/make_release.log`; the harness lost the task
> at a session restart, the processes 46336 / 45764 live on). Next: the README sizes (`.work/rc4/regen_readme.sh <log>`), the public tree
> (`make_public_tree.py` → mirror into `.work/public_repo`, add by name, push), `gh release create v0.9.1 --latest` with every file of `release/` and the notes
> copy, `launcher-v1.1.2` (`--latest=false`), `release_checklist.py --published`, `published_0_9_1/` kept texts. PUBLICATION AUTHORIZED: `[OWNER]` 14:27
> «Выпускм как есть» (GitHub; Nexus only by his own word). The update RC4 → 0.9.1 on the copy (`KUMM/.work/rc5/realcheck.mjs`) and #16 on the real game — after.
>
> **CHAT CLOSED 2026-11-23 ≈13:3x — the 0.9.1 readiness triage and the four RC5 fixes, committed and run; RC5 NOT built yet** (`[OWNER]` 11:49
> «делаем все 4 правки в RC5 сборки и лаунчер 1.1.2»). Done: the triage of 38 open issues (`plans/62_conan_0_9_1_release_readiness.md`); #16 the
> uninstaller deletes the game's copies of the build's paks (engine `gameCache`, KUMM `a225dfa9`, fixture 78 / 78); #47/#15 the launcher's counter
> folds the dashes (pack `8572e89`, «2 из 2», control «1 из 2»); #43 the plaque prepared in the idle (pack `8572e89`, the stand's first open 6.4–9.3 ms — CORRECTED 2026-11-23 14:27: on the owner's screen the first open of 1.1.2 is still slow, #43 NOT fixed, a known issue of 0.9.1;
> control 87 ms); #53 one walk per view switch (pack `6651e56`, ≈ 1 ms, accepted 12:44 — one-off actions are outside the 1 ms, `MASTER_PLAN.md`); judge
> two rounds, no defect; run report `testcases/reports/2026-11-23_conan-rc5-fixes.md`; HOUSE_RULES 14.2 (theses in chat). The blocks of this chat and of
> the RC4 chat — chronicle, entry «2026-11-23 13:3x — STATUS bonsai trim, part 22».
> **FIRST in the next chat — the RC5 release (the owner 13:25 confirmed this order):**
> 1. The release ritual for 0.9.1-RC5 + launcher 1.1.2: `python -I -X utf8 ConanExiles/_config/release/release_checklist.py` (13:2x on the RC4 state: 0 TODO,
>    13 MANUAL — the judge notes of `8572e89` `6651e56` `b30cee1` added); bump every Krinik mod and the menu line to 0.9.1-RC5, the launcher to 1.1.2
>    (`build-docs.py`); the notes RU/EN by the portrait (an RC: only its changes — #16, #47/#15, #43, #53 — plus a link to RC4); the guide with the
>    corrected plate line and its PDF; `make_release.sh` into an empty dir. The untracked `docs/guide/Krinik-Conan-3.1.1-guide.pdf` in the pack — find
>    what made it before the build.
> 2. The update RC4 → RC5 through the launcher on `KUMM/.work/rc1_install/Conan_311` (holds RC4): `Saved/ExtractedMods` kept on the update, then the
>    uninstaller removes the build's copies (#16 on the real game); the counter «74 из 74» (#47).
> 3. `node .work/rc4/retest43.mjs` on the owner's screen with launcher 1.1.2 (#43; the screen may be in Parsec's mode — re-probe, HOUSE_RULES dossier).
> 4. The RC5 retest sweep (plan 62): the ten «fixed, not retested» issues (#3 #22 #29 #31 #32 #34 #36 #38 #39 #40), #21 the real waystone travel, #23 the
>    wider hunt; close #15 as #47's duplicate; comment the fixed issues.
> 5. Still unanswered by the owner: the `critical` label of #30 (bow sprint) and #43 (launcher). Publication of RC5 / the full 0.9.1 — only by his word.
> 6. The working game holds the RC4 mods + the pack's new camera `main.lua` (god off in the save); `KUMM/.work/rc5/` holds the stand dirs, launcher builds
>    and frames of this chat — remove by `node D:/work/ai_sandbox/ConanExiles/_config/rm-tree.mjs D:/work/ai_sandbox/KUMM/.work/rc5` after the RC5 release.
>
> The block «THE CHAT OF 18:55 (2026-11-22)» — chronicle, entry «2026-11-22 23:1x — STATUS bonsai trim, part 19»; its open items are carried in the RC4 block above.
>
> The blocks «THE CHAT OF 15:18 (2026-11-22) — the RC4 scope, part 1» and «CHAT CLOSED 2026-11-22 ≈15:1x» — chronicle, entry «2026-11-22 21:1x — STATUS bonsai trim, part 17»; their open items are carried in the 18:55 block above and the RC4 list below.
>
> The working block of the chat of 21:22 and «🎯 FIRST in the next chat — THE RC4 SCOPE» — chronicle, entry «2026-11-22 23:1x — STATUS bonsai trim, part 20»; still owed from them: the comment-only marker commits of the camera's first-person section and the pause's loading-screen block (`[NOT-TESTED]` → `[TESTED: …]`, the addresses are in that entry); `-Verify` clean; #48 closes after the RC4 retest.
>
> The CHAT CLOSED block of 2026-11-22 ≈11:0x (the chat of 09:34, its FIRST list) — chronicle, entry «STATUS bonsai trim, part 16»; its open items are carried above.
>
> **Still open from the chat of 16:20** (its closed summary and the done item 1 — chronicle, entry «STATUS bonsai trim, part 7»; item 5 is now issue #17, the
> «Подтвердить» finding of item 6 is issue #14):
> 2. **The RC1 checks not run yet** (on the fresh clean copy `KUMM/.work/rc1_install/Conan_311`, 59 GB, kept for this): the uninstall back to the clean game, the
>    update over an older build, a short play of the main features, the menu tab text jitter by a 60 fps video (bug 64 row 6 — decides its known-issue line).
>    Then remove `rc1_install`, `rc1_dl`, `rc1_run` and `save_backup_2026-11-20` by `node D:/work/ai_sandbox/ConanExiles/_config/rm-tree.mjs D:/work/ai_sandbox/KUMM/.work/<dir>`.
> 4. **Cleanup is the agent's duty** (the owner 16:50–16:51): `KUMM/.work/svarog_cleanup.cmd` (SvarogsDream `_harness` 20.5 GB, review folders, `src/*/bin|obj`) —
>    the auto-mode allow list was widened 17:2x by `node KUMM/.work/automode_rule.mjs` (the owner 16:51, chronicle entry 2026-11-20 16:50): run the cleanup
>    yourself — `node D:/work/ai_sandbox/ConanExiles/_config/rm-tree.mjs <named folders>`, alone in its call; never hand it to the owner.
>    **2026-11-21 18:2x the auto-mode classifier REFUSED `rm-tree.mjs D:/work/ai_sandbox/SvarogsDream/_harness`** (Destructive or Unwanted Actions) — the
>    widened rule does not reach it; not worked around. D: had 44 GB free before the RC3 release; the RC3 check on the copy needs ≈ 30 GB more — asked the owner.
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
  2026-11-18 19:0x; HOUSE_RULES 38). Fixed and waiting for the owner's play: `bugs/101_…` (the hub flashes the bare world on a switch). Closed 2026-11-21 by the RC3
  retest: bugs 85, 97, 100, 112, 113 (DONE). The critical ones open for 0.9.1: `bugs/79_…`
  the world freeze after an in-game loading screen — the admin teleport fixed (pack b7d984a), the Dregs dungeon IN and OUT and a teleport with the waystone map open pass on b7d984a (2026-11-22 20:1x, R21e, R21a-sim); only the real waystone travel owed.
- ✅ Closed: bugs 115, 85 (DONE 2026-11-21), the camera jitter / menu abort / config override (2026-10-29), bug 118 (DONE 2026-11-22, not a build defect) — chronicle, entry «STATUS bonsai trim, part 18».
- ⏸ `bugs/89_conan_water_reflection_flicker.md` — 2026-11-09 15:45, the owner's frame at `river_bend`: dark dashes / grain blinking over the water, «как тени листвы пальм»; PARKED 2026-11-14 09:53 by the owner («в дальний ящик»).
- 🔴 `bugs/86_…` (attribute tree caption under a node icon), `bugs/87_…` (beasts walk into the hero), `bugs/88_…` (corruption debuff line fonts) — 2026-11-07, the owner's frames.
- 🔴 The owner's bugs 55–62 (2026-10-18 13:35–13:43, a wave in 5 minutes of play) — `bugs/55_…` – `bugs/62_…`; order and plan 32 — item 00000 above.

- ⏸ Bugs of paused games (Svarog, GTA SA, Medieval Dynasty) — 15, 28, 29, 38, 40, 41, 44, 45, 47, 48, 49, 50, 51, 52, 54: files in `bugs/`, summary — chronicle, entry 2026-10-28 23:10.

- 🔧 `bugs/14_pickcard_exact_name_pins_old_file.md` (fixed 2026-10-15, waits for a live `kumm check`) — `kumm check` holds on to an old file if the author once
  put the version into the file name (Bosses My New Besties, 02.10). A bug of the engine itself; the fix plan and the case are in the document.
- 🟡 `bugs/07_conan_probe_kills_ue4ss_lua_layer.md` — the symptom removed by turning the mod off, the cause not found.

## KAIF — feedback and tickets

KAIF 2.9 since 2026-10-16; the hooks are wired in `.claude/settings.json`; tickets live in `bugs/KAIF/` (the newest: 35 → origin issue #202, 2026-11-22) and go
to the origin without asking (`AGENT_GUIDE.md` → Notes from the human). The section's history — chronicle, entry «STATUS bonsai trim, part 18».
