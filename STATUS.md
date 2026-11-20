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
> **Progress of the chats of 2026-11-18:** the latest is the block «CHAT CLOSED 2026-11-18 20:4x» in «Where to continue» below (corrected 20:4x — it named the 16:0x block); the block CHAT CLOSED 14:3x and the earlier progress lines — chronicle, entries 2026-11-18 14:3x and 16:0x.
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

> **🎯 AIM OF THE CHAT OF 2026-11-18 20:51 — 0.9.1-RC1 built AND uploaded to our GitHub repository, then the full install path tested from it** (`[OWNER]` 20:54
> «нужно стремиться к тому, чтобы в этом чате собрать RC1 и для теста полного пути установки сборки залить его в GH», chronicle entry 2026-11-18 20:54 — the
> word for the outward step). Order: bug 85 rest + judge round 2 → pack push → the launcher's RC order + round-2 findings → **a judge round, code review, fixes** (`[OWNER]` 20:58 «то
> есть, после этого») → versions 0.9.1-RC1 → **a judge round
> and code review of the version change, fixes** (`[OWNER]` 20:57 «после этого тоже судейство и ревью кода и фиксинг») → **the three release texts (the guide —
> Russian only, the README and the 0.9.1 notes — RU + EN; DRAFT of pack `5f1544f`, never read by a clean instance, never shown): a clean read of RU and EN, fixes,
> one page of pairs for the owner** (`[OWNER]` 21:07 «юзер мануал · README · релиз ноутсы 0.9.1 · Переписаны корректным русским языком и английским ???» · «мы
> готовимся к выпуску»); **the user guide becomes BILINGUAL — the English pages after the Russian ones** (`[OWNER]` 21:08 «делаем юзермануал двуязычным» ·
> «после русских страниц - ставим EN страницы») → paks, guide, launcher exe → volumes →
> `make_release.sh` → GitHub → the launcher on a fresh copy of the clean 3.1.1.
> **CHAT CLOSED 2026-11-18 21:3x (`resume` 20:51; closed by the owner's word 21:36 at 57 % of the window, chronicle entry 2026-11-18 21:3x; the CLOSING JUDGE NOT RUN —
> `[OWNER]` 21:37 «на судейство нет токенов»).** Its progress blocks and the 20:4x handover — chronicle, entry «2026-11-18 21:3x — STATUS bonsai trim». The AIM above stands.
> **CHAT OF 2026-11-20 09:09 (`resume`) — progress:** item 1 DONE — pack `d473023` (the launcher's round-2 fixes: the helper's four «failing» download cases
> failed only because the main session's real game ran on the machine — `GameRunning()` is machine-wide; re-run on a free machine 24 cases / 330 checks PASS,
> the control on the pre-fix exe 31 FAIL; the stand now refuses a machine with a ConanSandbox process; report `testcases/reports/2026-11-20_conan-launcher-judge2-fixes.md`;
> the stray guide JPEG deleted). Item 2 DONE but the kit builds — pack `00c795d` (rule 40: `_config/devkit/krinik_modinfo.py` + `_config/release/krinik_change_notes.json`
> are the one source; kit-buildmod / build-level-mod write the fields, `set-pak-modinfo.py --check-krinik` guards `make_release.sh` 2b (working game) and
> `make_volumes.sh` 2c (export); the working game reads 4 of 4 empty until RC1's pak builds + deploy; report `testcases/reports/2026-11-20_conan-krinik-pak-modinfo-fields.md`;
> the 0.9.1 change-note texts need the clean read with the release texts). Judge round 3 on both (`reports/2026-11-20_judge_round3_launcher_and_pak_modinfo.md`):
> 2 defects (RC part names invisible to the launcher; the release's running-game refusal never fired — tasklist cuts names at 25 chars, EXP-0574) + 5 risks —
> all fixed in the working tree, run report `testcases/reports/2026-11-20_conan-launcher-judge3-fixes.md` (finding 6 not reproducible on the loopback stand).
> R1 DONE in the tree: `packVersion` 0.9.1-RC1 and every shipped Krinik mod's manifest version (the owner 2026-11-18 20:57 «в манифесте и модах»; modinfo keeps
> 0 9 1), parts stem `Krinik_Mod_Pack_0_9_1_RC1`, the UI pak rebuilt by the kit with «0.9.1-RC1» under the logo (kit-buildmod's rule-40 step seen live), all
> four `_unpacked` Krinik paks carry the fields (`set-pak-modinfo.py _unpacked --check-krinik` 4 / 4). Texts: the writer helper rewrote N, R (template + 30 cells,
> README.draft regenerated), G (RU) and C by the portrait — `KUMM/.work/texts091r3/REPORT.md` (decisions, the owner's lines as proposals), `pairs.md` (58 pairs);
> the guide's ENGLISH pages are NOT written yet (the brief left them out). Side errand (the owner's «УБРАТЬ!» ×3) DONE: Defender back on, Tamper Protection on by the
> owner, the January policy set and the 8 spam grants removed, a full scan of C: running (PID 14044 from 10:15, the machine lock `kumm` to 13:47 — release it
> after); private details `KUMM/.work/malware_check/report.md`.
> **FIRST in the next chat (handover of 2026-11-20):**
> 1. **Pack:** the round-3 fixes + R1 committed (`f381f3f`; the stand re-run 66 / 66, the H2 control red — report `testcases/reports/2026-11-20_conan-launcher-judge3-fixes.md`),
>    the writer's texts committed as DRAFT (`ce1f12b`); **judge round 4** on `00c795d..f381f3f` (rule 31) → fixes → `git push` of the pack (13 local commits, bug 85's included).
> 2. **Texts (the owner's META-texts order 09:47):** a clean-instance read (§7B) of N, R, G, C as the writer left them (`KUMM/.work/texts091r3/REPORT.md` — its
>    decisions 1–6); fixes; the owner's page of pairs from `pairs.md` (rule 32: one HTML page); his word on his own lines (REPORT «The owner's lines»). The guide's
>    **English pages after the Russian ones** (the owner 2026-11-18 21:08) are still owed. `{{ARCHIVE_SIZE}}` is filled after `make_release.sh`.
> 3. **RC1 is DEPLOYED in the working game** (2026-11-20 10:44, pack `f381f3f` + `ce1f12b`: 75 / 75 mods, verify 114 present 0 missing; the guard on the game's
>    Mods 4 / 4 ok). Owed: the main menu by eye — «0.9.1-RC1» under our logo, the game's mods screen with the author, URL and change note (rule 40.3);
>    re-run `set-pak-modinfo.py` on the four `_unpacked` paks + deploy again whenever the change-note table changes (the guard names a stale note).
> 4. **Bug 85** judge round 3 on `bddc495..9378982` (owed); J5, N5, N8, N9, N2's «Продолжить игру»; bug 109 → RC2.
> 5. **Then** `build-docs.py` (the 3.1.1 guide PDF committed, the launcher exe) → `make_release.sh <empty dir on D:>` → the release `v0.9.1-RC1`, an ordinary one
>    titled «0.9.1-RC1 (тестовая сборка)» (the owner's word 2026-11-18 20:54; ask him once whether it keeps 0.9.0 as the repository's «Latest») — the public
>    repo's `main` stays on the 0.9.0 tree for RC1 (the notes use the logo path that exists there) → the launcher on a fresh copy of the clean 3.1.1 (rule 25).
> 6. **The machine:** the Defender full scan of C: (PID 14044) — read `Get-MpThreatDetection` after 10:15 when it ends, then `machine-lock.mjs release --who kumm`.
> **The list below is SUPERSEDED by the list above — it moves verbatim to the chronicle at this chat's closure (bonsai trim).**
> **FIRST in the next chat:**
> 1. **The pack's working tree is UNCOMMITTED — review it first** (`git -C D:/work/ai_sandbox/ConanExiles status`): (a) the launcher round-2 fixes of a STOPPED helper —
>    `_config/launcher/KrinikConanGames.cs`, `KrinikConanLauncher.cs`, `KrinikConanUpdates.cs`, `test/click.ps1`, `test/feed.mjs`, `test/self.mjs`, `_config/release/make_release.sh`,
>    `make_volumes.sh`; its last word: after its changes the stand cases with a break or a stop FAIL (four), `fresh-feed` passes. Read the diff against the list
>    `reports/2026-11-18_judge_launcher_round2.md`, keep what is right, fix or revert, re-run the stand (`KUMM/.work/launcher57/batch1.sh` + `rc`, `never`, `refused`, the U1
>    case) on a fresh `make_variant.py` exe. (b) R1 started, untested: `_config/devkit/build-level-mod.py` (X.Y.Z of «0.9.1-RC1»), `_config/public_release/mods-table.mjs`
>    (`PACK_VERSION_BADGE` — the template's badge line still uses `PACK_VERSION`). (c) untracked `docs/guide/Krinik-Conan-3.0.1-0.9.0-page1.jpg` — find what made it, delete.
> 2. **Rule 40 — the owner's debt of 21:35:** the Krinik paks' fields of the game's mod list (author, author URL, a change note per mod) into the SOURCE — `kit/modinfo.json`
>    of KrinikConanArchery, KrinikConanGraphics, KrinikConanUI and the modinfo `build-level-mod.py` writes for KrinikConanGameplay; a per-mod change-note table for 0.9.1;
>    every pak build writes them (`set-pak-modinfo.py` exists — author «Кот Криник (KOT KRINIK)», URL the Nexus page, note = the build line — but ran on the release
>    export only); the guard in `make_release.sh` and on the working game; the main menu's mods screen looked at.
> 3. **Bug 85:** pack `9378982` LOCAL (9 local commits) — judge round 3 on `bddc495..9378982` when tokens allow; owed cases J5 (world re-entry, the mods button twice), N5,
>    N8, N9 (ten minutes of play); bug 109 (a double click inside our settings window counts once) — RC2. Then the pack push.
> 4. **R1 — the version 0.9.1-RC1:** `modpack.json` `packVersion` (the mods' own versions stay 0.9.1 — a modinfo holds three numbers); `make_release.sh` / `make_volumes.sh` —
>    the stem `Krinik_Mod_Pack_0_9_1_RC1` (no hyphen: the launcher's part pattern `Krinik_[A-Za-z0-9_]+`), the default notes path by X.Y.Z; `kit-conanui-edit.py` (the
>    menu line) → `kit-krinik-click-events.py` (idempotent; the kit editor may crash in AddCallFunctionNode — re-run, EXP-0571) → `kit-buildmod.py KrinikConanUI`; a judge
>    round on the version change (the owner 20:57).
> 5. **The texts:** the clean read r2 `reports/2026-11-18_clean_read_texts_091_r2.md` — 40 findings, facts first (the launcher is not new in 0.9.1; «Верная рука» is a cut, not
>    a buff; the RC naming; `README.draft.md` stale; the guide PDF untracked; the 7-Zip step); the writer helper was STOPPED before it changed a file. The guide gets the
>    English pages after the Russian ones (the owner 21:08); one page of pairs for the owner.
> 6. **Then** `build-docs.py` → deploy + `-Verify` → `make_release.sh <empty work dir on D:>` → the release `v0.9.1-RC1` in `MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack`
>    (an ordinary release titled «0.9.1-RC1 (тестовая сборка)»; AUTH — the owner's word 20:54) → the launcher on a fresh copy of the clean 3.1.1 (rule 25).
> **Done this chat:** the priority narrowed to two items (correct Russian → the next version); the launcher's RC order (pack `50b4bce`, `testcases/reports/2026-11-18_conan-launcher-rc-order.md`);
> bug 85 judge round 2 — 8 findings fixed (pack `9378982`), K1 K2 N1 N4 N6 N7 J2 J3 J4 PASS, N2 partial (Settings and Exit by real clicks, Krinik on top seen; «Продолжить
> игру» not pressed), J1 FAIL → bug 109; the run of 21:29–21:35 (K1, N1, N2, J1, J2 on the new pak) is NOT yet in the TC rows and the run report
> `testcases/reports/2026-11-18_conan-keybinds-judge2-run.md` — write it there from the chronicle entry 2026-11-18 21:3x and the farewell;
> Simple Modlist's Krinik-on-top fixed; the input tools no longer click a minimized game (EXP-0572); the kit crash pattern (EXP-0571); HOUSE_RULES 40; the clean read of the texts.

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
