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

> # 🔥 PRIORITY OF THE COMING DAYS — WE DO NOT REST UNTIL ALL THREE ARE DONE
> `[OWNER]` 2026-11-18 09:12–09:13 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-18 08:11, notes 09:12 and 09:13). Autonomous work (/dayloop) on exactly this, in this order:
>
> **1. Correct Russian in the Krinik build + a stylometric core that WORKS** — `plans/58_EPIC_academic_russian_guards_and_proofreading.md`, `HOUSE_RULES.md` 33, 35.
> Tools, machinery, rules, hooks — anything that improves Claude's Russian goes into the core (`KUMM/krinik-stylometry/`, private repo, git-ignored by KUMM;
> commit and push in its own repo). Exit: every Russian string of the build rewritten through the core and the guards, the lint 0 or allow-listed, the
> strings SEEN in the game, the launcher, the PDF; the core checks every chat reply before it goes out (Stop hook).
>
> **2. The full launcher 1.0.0 with ALL the owner's wishes, every function tested** — `plans/57_EPIC_conan_launcher_self_sufficient.md` (+ epic 55 phase B):
> finds the game on the disks, sees / downloads the latest release for the found game version, installs, updates, uninstalls, the progress bar with %, speed,
> remaining and elapsed time, the version line, no impossible window state, the KUIPS mockups as the design. The owner names it **1.0.0** (09:12) — the manifest
> says 1.1.0 today: settle the number with the self-update rule (`Feed.Newer`) before the release. Exit: a written case set for every function, a functional
> run by the player's path on a real copy of the clean 3.1.1 (`HOUSE_RULES.md` 25) — every case PASS, the run reports in `testcases/reports/`.
>
> **3. The build 0.9.1 in a working MVP state as of 2026-11-18** — epic 55. Exit: 1 and 2 done; then a release 0.9.1 can be prepared (correct Russian, MVP
> functions, the full launcher 1.0.0) — the publication itself waits for the owner's word.
>
> **Progress (2026-11-18 10:47 +03:00, chat of 10:07 closed):** 1 — the blind quality A/B of the core works: `krinik-stylometry/eval/quality/REVIEWER_BRIEF.md` +
> `eval/quality-prep.mjs` (judge round 1 fixed, selftest 17/17; round 2 findings OPEN — plan 58). Run 1 none vs v22 (texts of 2026-09-25): none better in
> 18 of 24 pairs; without typography 5.82 vs 5.18 violations per 1000 words; the core's loss is the typography of the tested draft (ГЛ15 / ГЛ16, removed by
> the owner 2026-09-25, texts never regenerated) plus noun repetition; the core cuts incomplete phrases (4 vs 10). Run 2 texts written today by one model:
> `eval/runs/none_1118/` (24) and `eval/runs/core_1118/` (24; 01–06 expanded after their last lint). 2 — epic 57 phase 1 recon COMPLETE (the game's CL is in
> `ProductVersion` of the Shipping exe); the owner's mockup remarks 10:16–10:36 applied (pack `c05aa51`): the version plate lower, the buttons' metal muted,
> no state list on an installed build, the sheet one left-to-right row; KUIPS issues #1–#3. Earlier progress lines of 2026-11-18 — chronicle entry
> 2026-11-18 10:48 (bonsai trim of the chat of 10:07).
> Note: other projects read the core from `D:/work/ai_sandbox/krinik_voice` (an older clone of the same repo) — it needs a `git pull` by its owner session.
>
> 🎯 **The Conan 3.0.1 build is the main work since 2026-10-26 ≈08:30; every other game is out of priority.** `[OWNER]` «все игры пока не в приоритере, мы
> работаем дат сборкой конана» · «она 1_ должна работать стабильно 2_ моды не должны конфликтовать, должны быть рабочими 3_ не должно быть
> явных просадок производительности из-за модов» · 2026-10-26. Work order — "Where to continue", item 0.
>
> 🆕 **Conan 3.1.0 is out (2026-11-12, Part Three of the Giant-Kings arc); THE MOVE IS UNDER WAY since 2026-11-13 18:52 — `plans/53_conan_move_3.1.0.md` (the build runs on 3.1.0 since 2026-11-13 20:0x — 66/66 mods, the owner's world; the 3.0.1 install kept on disk as the way back). Downloaded by the owner (his word 2026-11-13 14:13 +03:00)**
> (`[OWNER]` «так как я качаю 3» · «3,1,0» · «и нам нужно будет место»); D: cleaned for it the same minute — 46 GB of old profiler traces, old bench videos, the 0.9.0
> GitHub parts (all 7 verified uploaded on the release) and `mods/OLD` deleted (D free 59.6 → 108.7 GB); the Windows crash dump moved back to `C:\dump` (HOUSE_RULES
> dossier), `D:\dump` goes at the next boot (+8 GB). The move itself — the checklist below, when the download lands. Web recon 2026-11-13 09:09 —
> `researches/conan_patch_3_1_0/README.md` (§3 is the move checklist): the top risk is «only ModController classes are loaded at startup» (our
> `krinik_hub_controller.lua:80` and `krinik_mod_settings.lua:1046/1054` reach other mods' classes by `StaticFindObject`); stale vanilla tables (new item rows);
> UE4SS on the new exe; the kit revision. No staff known-issues list yet, players wait for a hotfix — when to move is the owner's call.
>
> **Svarog's Dream — the main work from 2026-10-09 to 2026-10-26** (`[OWNER]` «забей на Medieval Dynasty … мы работаем дальше над Сварогом» · 2026-10-09 ≈13:25;
> scale: 16:9 at 720p, 1080p, 2K, 4K — `MASTER_PLAN.md`). Medieval Dynasty is paused; the paragraph below is for the return.
>
> **Medieval Dynasty (paused)** — pack `D:/work/ai_sandbox/MedievalDynasty`, epic 15 (`plans/15_…`, phase 0 — `plans/16_…`),
> bug 29 (HDR) open; return checklist — chronicle, entries 2026-10-09 19:41 and 2026-10-10 03:38.
>
> **Svarog's Dream** — dossier `games/SvarogsDream/README.md`, backlog `plans/18_svarog_backlog_checklist.md`. Run rules — `HOUSE_RULES_REFERENCE.md`
> §5 "Svarog run": since 2026-10-18 the saves are the agent's to use (the owner does not play for progress, interview #022, Q5); after `h.sh kill` —
> `bash tools/reg-snap.sh restore`; remote cheats — only inside a run, with a banner (Q6); never stop time (memory
> `svarog-no-timescale-zero`); HDR, if turned off for recording — `powershell -File tools/hdr.ps1 on`.
>
> **Mafia II** — paused, dossier `games/Mafia2/README.md` (section «Дальше»); the agent does not start the story.
>
> **Conan 2.2.3** — dossier `games/ConanExiles/README.md`. Palworld — in daily use, no edits pending.
> **Oblivion Remastered is parked until its patch** — do not go there until the owner says so.
> **Cyberpunk 2077 — no game installed (removed 2026-10-30 by the owner's word).** The pack repo `D:/work/ai_sandbox/Cyberpunk2077`
> (private `cyberpunk-2077-modpack`) holds the inventory of his manual 2.1 build (19 mods, `modpack.json`), the mod settings and the 10 freshest
> saves — the starting point for a future AI-built pack.

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

- ✉️ **Nexus quarantine of mod 65 (0.9.0) — the THIRD letter is written 2026-11-13 09:09** (`[OWNER]` 09:03 «давай писать третье письмо»): `D:\Games\Conan Exiles Mods\Krinik_Mod_Pack_0_9_0_Nexus\nexus_support_quarantine_followup_2.txt`,
  a reply in ticket 276571; the three SHA-256 in it re-hashed from the release zip (match). SENT by the owner (`[OWNER]` 2026-11-13 11:02 «пиьсмо я отправил, спасибо»).
> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- ✅ **2026-11-02 00:22 — interview #030 APPLIED and seen (packs `0663f2f`, `fb6cc6a`):** arrows sit in the body (side frame, folder 56 `04_…`), one arrow per shaft
      in the corpse's loot, the shafts go when the arrows are taken (real E + Q) — TC A11, A12, A13 pass. **00:27 the Damage Meter page in the Xevyr hub works** (pack `dd73239`):
      D1, D2 pass (the author's values; a real Save writes the mod's slot through the author's window, which now closes after it), D3 flash not measured;
      the remote opens the Xevyr hub by the shared variable `KrinikHubRequest`. Next: the other four Xevyr pages (I6.3), then the list's Xevyr entry → the hub;
      ~~the left-list seam (the name mid-height)~~ FIXED 2026-11-02 07:34 +03:00 (cases L0–L2, report `2026-11-02_conan-hub-left-list-seam.md`); then the 13 blocks to 1.0.0.
- 🎯 **Oblivion-style archery — raised by the owner 2026-10-28** (a discussion, not work: `[OWNER]` «пока обсуждаем»): arrow speed — Conan's,
      the drop — Oblivion's. Vanilla `ArrowGravityScale` 0.55 and `ArrowInitialSpeedMultiplier` 5000 (Remastered) found; waits for his choice of what
      the draw does (shot power, as in Remastered, or a flatter flight, as in Conan). Recon — `researches/conan-archery/README.md`.
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

> **CHAT CLOSED 2026-11-18 10:48 +03:00 (chat of 10:07, opened by the pasted farewell → /resume; the owner's closing word 10:44–10:45 «пора закрывать это  чат, сразу после
> твоих суб-агентов. без судейства.» — the closure's judge pass skipped by his word; his remarks 10:16–10:45 are notes at the end of the chronicle).**
> Done: recon §2–3 checked, its last item closed by a probe; the mockups changed by his remarks 10:16–10:36 (pack `92a661d`, `d4eb0b0`, `c05aa51`);
> `HOUSE_RULES.md` 34.2 (the sheet is opened once, a rebuild says «F5») and 34.4 (the flow runs left to right); KUIPS issues #1 (flow direction), #2 (favicon),
> #3 (refresh an open sheet); the core quality instrument and run 1 (plan 58); EXP-0562 (a stand measures the core version that wrote its texts).
> **FIRST NEXT CHAT** (the 🔥 block above is the order): (a) the core — fix the judge's round 2 findings in `krinik-stylometry/eval/quality-prep.mjs` (plan 58
> list, the two defects first) and send the diff to a fresh judge; re-run `node krinik-stylometry/tools/voice-check.mjs --genre document` on
> `eval/runs/core_1118/01–06` and measure their words; then `node krinik-stylometry/eval/quality-prep.mjs none_1118 core_1118` → two clean reviewers, blind,
> odd / even pairs, by `eval/quality/REVIEWER_BRIEF.md` (the run-1 prompts are in this chat's plan 58 record) → `--tally none_1118 core_1118` → plan 58 run 2 and
> a row in the core's `METHODOLOGY.md` §7 → act on the result (the «тот же» row's noun repetition, «Так,» commas); then phase 5 — proofread every agent text of
> the build, surface by surface; (b) the owner's verdict on the mockups → epic 57 phase 2 (it carries the muted version plate and the bare installed column into
> `KrinikConanLauncher.cs`); (c) ONE game run: the dm-fish locres sample + the hub rows' hints + the crash offer on the real build folder; (d) owed: launcher
> R3, R5, four stale comments; `ru-reply-check` risks (plan 58: mid-turn owner messages do not reset the turn; one log record 2026-11-18 06:32Z with a JSON
> parse error of the hook's input).
> **Moved verbatim to the chronicle (entry 2026-11-18 10:48 +03:00):** the NOW block of the chat of 10:07, the block CHAT CLOSED 2026-11-18 09:3x with its
> FIRST NEXT CHAT, and the progress paragraphs of 09:25 and 10:25. Their open items are carried in FIRST NEXT CHAT above.
> **Moved verbatim to the chronicle (entry 2026-11-18 09:34 +03:00):** the NOW block of the chat of 2026-11-18 00:40. Still open from it: ONE game run (the hub rows' new hints, a locres sample of the dm-fish rows, the crash offer on the real build folder); epic 55 D4 («Что нового» 0.9.1, known issues, release notes by the owner's portrait); launcher R5 (the space need after a stopped unpack). Done in the chat of 08:10: the launcher judge round + the push, dm-fish (pass 3, in the build), the KUMM force-push.
> **Moved verbatim to the chronicle (entry 2026-11-18 01:37 +03:00):** the blocks CHAT CLOSED 2026-11-17 22:1x, NOW 19:43 and NOW 14:40. Still open from them: the walking bow draw (bug 104, the post-process route), the owner's real-key checks (wall hang drain, RMB through a wall push, bug 105 G1 / G5b / G10 / G7, G6), bug 93 (the held draw ends in a sprint); the auto-relay L1″ / L2 / L3 after the owner's «Do not ask me again» tick.
> **Moved verbatim to the chronicle (entry 2026-11-17 21:3x +03:00):** the blocks FIRST NEXT CHAT item 1 (the auto-relay task — built; its L2 / L3 open in the NOW block of 14:40) and CHAT CLOSED 2026-11-17 11:04.
> **Moved verbatim to the chronicle (entry 2026-11-17 10:52 +03:00):** the block CHAT CLOSED 2026-11-17 06:33 (+ its FIRST NEXT CHAT) and the block of the chat of 2026-11-17 04:25. Their open items are carried in the NOW block above or stay here: bug 93 (the held draw ends in a sprint; S9) · bug 105 the owner's final check (G1, G5b, G10, G7 with the bow) and G6 · plan 53 step 12 (read `researches/mod-reconciliation/GUIDE.md` first) · plan 52 put-away by a real key · the GitHub release link in the Nexus call (the owner's question).
> **Moved verbatim to the chronicle (entry 2026-11-17 06:33 +03:00):** the block CHAT CLOSED 2026-11-16 23:53 (+ its FIRST NEXT CHAT) and the block of the chat of 2026-11-16 22:12; their open items are carried in FIRST NEXT CHAT above (the bow on the wall — done; the hang's drain — interview #037 Q2; bug 105 final check; the older list).
> **Moved verbatim to the chronicle (entry 2026-11-16 23:53 +03:00):** the block CHAT CLOSED 2026-11-16 21:46 (+ its FIRST NEXT CHAT and tools); its open items (2)–(4) are carried in FIRST NEXT CHAT above.
> **Moved verbatim to the chronicle (entry 2026-11-16 21:46 +03:00):** the blocks NOW 2026-11-16 21:30 and CHAT CLOSED 2026-11-16 19:47 (+ its FIRST NEXT CHAT; its open items are in (3)–(4) above).
> **Moved verbatim to the chronicle (entry 2026-11-16 19:47 +03:00):** the NOW block of the chat of 2026-11-16 17:59 and the blocks CHAT CLOSED 2026-11-15 00:19 and NOW 2026-11-14 22:29.
> **Moved verbatim to the chronicle (entry 2026-11-15 00:02 +03:00):** the blocks NOW 2026-11-14 16:24 (dayloop: wall jump, bug 102, Pickup+), CHAT CLOSED 15:59, FIRST NEXT CHAT 15:5x and NOW 14:17 (perk page, bug 101, the first wall jump). Still open from them: interview #035 (the bow after the wall push — the owner's answer); the wall-jump TC row R6 by the owner's own keys (the synthetic Space is unreliable there), an overhang case, W11 / W13 on the final build; bug 91 real hover; the perk page (review folder 86, his perk ideas 25–40 → plan 49); bug 101 item 4 (a native read of the inventory teardown); bug 75 (quick-loot rim); M6 ping; the Pickup+ admin window (plan 53 step 12, parked to ≈ 2026-11-15); the morning items listed in the 2026-11-14 15:41 pointer below.
> **Moved verbatim to the chronicle (entry 2026-11-14 15:41 +03:00):** the blocks CHAT CLOSED 2026-11-14 13:45, NOW 11:52 (dayloop), FIRST NEXT CHAT (11:41) and NEW CHAT 09:51 of the morning chat. Still open from them: the owner's play — his six key bindings, the hub switches to / from «Снаряжение», the morning four (square page arrows, journeys refresh, craft pace after the close, Esc flag); (the run-report linter's two morning reports — fixed 15:4x); plan 53 step 12 (parked to ≈ 2026-11-15); the rollback paks in `.work/keybinds/` and `.work/arrows/` (delete after the owner's play).

> **Older pointer blocks (2026-11-03 … 2026-11-14, with their «still open» lists) and the NOW block of 2026-11-17 11:21 — moved verbatim to the chronicle, entry 2026-11-17 21:3x (second part).**

## Open bugs

Files without the DONE tag — 54 (counted 2026-11-17 06:23 +03:00; 50 on 2026-11-15). The Conan-era open ones: 64, 70, 74, 75, 79, 83–91, 93–101, 103 (the farewell
hook — the mark fix built 2026-11-17, the live closure owed), 104 (the hand on the string — the game's pose, interview #038), 105 (the wall grab — the owner's
final check, interview #037 Q1), 106 (the climb's stamina — interview #037 Q2) — the list below names the ones with live symptoms; the rest are paused games' bugs:

- 🔴 `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` — the UI of the Conan 3.0.1 build's mods, 26 items: open 4, 5, 6, 12, 13 (partly),
  15 (🟡 hub controller in the build), 16–18, 23 (EAA class cards — text in textures), 26 (late emblem in the hub); closed by a frame 2, 3, 7, 21 (4K, 2026-11-07), 7b, 8 (again 2026-10-31 at 1080p, list 540), 9–11,
  14, 16, 19, 20, 22, 24, 25 — work order in plan 35.
- 🔧 `bugs/93_…` — the bow sprint in the owner's order: build 7, `[OWNER]` 2026-11-13 11:01 «спринт и стрельба работают»; open cases S8, S9, the cost. 🔴 `bugs/94_…` — hub craft batch
  finishes at once after the close (hypothesis 2 to test). 🔴 `bugs/95_…` — the bow unseen in first person (first next).
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
