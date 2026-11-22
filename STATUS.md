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

> **THE CHAT OF 23:47 (2026-11-22) — finishing the RC4 publication.** The 23:09 upload did NOT die with the chat: `gh` PID 39600 alive at 23:48, 47 of 83 assets
> on the draft (the volumes `.zip.001`–`.007` and the a–f per-file assets still going; 65 at 00:06), waited on by `Wait-Process` in the background (EXP-0616).
> **The update RC3 → RC4 through the launcher on the copy PASSED** (report `testcases/reports/2026-11-23_conan-launcher-update-rc3-rc4.md`): the launcher
> 1.1.0 → 1.1.1 by itself, 11 files / 39,0 МБ fetched, no volume, 74/74 deployed, verify 115 / 0, the RC4 screen; the installer's exit 1 of run 1 was my stand's
> missing `desk` folder (driver fixed), run 2 exit 0 with the shortcut. Not filed yet: `install.ps1` returns 1 when only the shortcut fails (minor). The copy
> `rc1_install/Conan_311` now holds RC4 — the next update test from the PUBLISHED release needs RC3 back or waits for RC5.
> **The owner's desktop shortcut** «Krinik Conan.lnk» (changed 2026-11-20 17:38) opens the RC1 launcher 1.0.0 in the working game
> (`D:\Games\Conan Exiles 3.1.1\Krinik_Mod_Pack_0_9_1_RC1\KrinikConanLauncher.exe`), while the game holds RC4 (`pack_version.txt`, put by `Deploy-ModPack.ps1`,
> which makes no shortcut). After the draft is lifted: start that launcher, «Обновить лаунчер» from the real GitHub feed → 1.1.1 in place, the shortcut then
> opens 1.1.1 (promised to the owner 00:19). Upload at 00:20: 79 of 83, 21.3 GB; left `.zip.006`, `.zip.007`, Shemite `.p1`, `.p2`. The «вошло в v0.9.1-RC4» comments for issues #4 #13 #21 #43 #48 drafted in `.work/rc4/issue_comments/` (voice-lint 0, core 0;
> the clean read's findings being applied), the issue #52 body rewritten by the portrait in `52_body_new.md` (not yet edited on GitHub). The owner's 23:08
> question «which bugs are critical» answered in chat against the bug files and the open issues (23:5x): #21 waystone owed, #23 the stuck map (the one real
> dead end, not reproduced), #30 not reproduced by real input, #43 / #48 retest; #41 Esc is comfort by the owner's word 00:00 (label `critical` removed,
> scale `researches/bug-severity/README.md`, HOUSE_RULES 38.1; whether #30 #43 #48 keep `critical` — asked in chat 00:0x); **owed: a bug file + issue for the first-person view switch ≈ 3 ms in
> one frame (over the 1 ms budget; camera notes line 123)**.
>
> **2026-11-23 00:29 — v0.9.1-RC4 PUBLISHED:** the upload ended `exit=0` at 00:29:36; `gh release view` reads draft=false, 83 assets, Latest = v0.9.1-RC4
> (https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/releases/tag/v0.9.1-RC4). (That line and its commit 59cefa0e came from the previous
> chat's session kumm-82, woken by its own upload's end; told 00:31 that this chat owns the publication.)
>
> **2026-11-23 00:30–00:39 — THE PUBLICATION STEPS DONE (this chat):** the 83 assets compared with the release dir by name and size, all `uploaded`;
> `launcher-v1.1.1` published 00:30 (`--latest=false`, exe 5 706 240 B, digest = the local SHA-256; Latest stays v0.9.1-RC4); **the owner's working-game
> launcher updated 1.0.0 → 1.1.1 from the REAL feed** 00:33 (his desktop shortcut's target replaced in place; I answered «Нет» to the crash-report question
> about MY stand crash of 20:57:23 first); the «вошло в v0.9.1-RC4» comments posted on #4 #13 #21 #43 #48 and read back; #52's body replaced by the portrait
> rewrite; the launcher notes kept in `published_0_9_1-RC4/`; `release_checklist.py --published` — 0 TODO, 15 MANUAL, 10 OK; the release pages and the public
> README read back (RC4); `rc4_release` (41 GB), `public_tree_rc4`, `rc4/kit_out`, `rc4/keep` removed (D: 61 GB free). **New tool:** the upload progress page
> `ConanExiles/_config/release/upload_progress.mjs` (the owner's wish 00:21; report `testcases/reports/2026-11-23_conan-release-upload-progress-page.md`;
> judge rounds 1–4 fixed, round 5 running; NOT committed yet). **Left of the RC4 list:** the issues close only after the retest on the published release
> (#21 needs the real waystone travel); the owner's answer on `critical` for #30 #43 #48 (asked 00:0x, none yet).
>
> **2026-11-23 00:52 — the owner: «работай автономно до переполнения контекста, выпускай RC4 и затем закрывай чат» → /dayloop, then /end-chat-soft at 80 %.**
> Done in the loop: (1) **#43 retested on the PUBLISHED launcher 1.1.1 in the working game** — a repeated plate open 20–38 ms, the FIRST open 134–390 ms
> (the stand said 10.9–14.0 / ≈ 100 ms); the owner 01:09 «d 1.1.1 первое открытие медленное, да, баг есть» → **standing falsehood corrected 01:1x** in the
> RC4 and launcher-v1.1.1 release bodies, the #43 comment (with a «Поправка» paragraph), the pack's draft / published notes and the guide source (the guide
> PDF asset keeps the old line — hashed in `manifest.json`); bug 110 has the section and the open item (the first open ≤ 16 ms). (2) **issue #53** filed —
> the first-person view switch ≈ 3 ms (S3, `bug`). (3) **engine, not committed yet:** `install.ps1` warns and keeps exit 0 when the shortcut cannot be
> written (missing folder, empty Desktop path, missing drive; fixture cases at the END of `tools/fixture-pack.mjs`); `Invoke-FileRetry` in
> `Deploy-ModPack.ps1` retries the rename of `_kumm_player.partial` and the removal of `_kumm_backup` (the stand's «Access denied» / «being used» in 3 runs of 6;
> after the fix 3 / 3 clean, 74 checks).
>
> **CHAT CLOSED 2026-11-22 ≈23:1x — RC4 PUBLICATION IN PROGRESS** (`[OWNER]` 23:07 «публикуем релиз РЦ4»): the public tree (scan 0) pushed to the public repo
> `1bdac32`; `gh release create v0.9.1-RC4 --latest --title "0.9.1-RC4" --notes-file KUMM/.work/rc4_release/release_notes_Krinik_Mod_Pack_0_9_1_RC4.md
> release/*` started 23:09:22 in the background (83 files ≈ 26 GB; a DRAFT until the last file; log `KUMM/.work/rc4/logs/gh_release.log`). **FIRST in the next
> chat:** (1) `gh release view v0.9.1-RC4 -R MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack --json isDraft,assets --jq '"draft=\(.isDraft) assets=\(.assets|length)"'`
> — 83 assets and draft false = done; if the upload died with the chat: `gh release upload v0.9.1-RC4 <the missing files of KUMM/.work/rc4_release/release>` →
> `gh release edit v0.9.1-RC4 --draft=false --latest`; (2) `gh release create launcher-v1.1.1 --latest=false --title "Krinik launcher 1.1.1" --notes-file
> ConanExiles/_config/release/draft_0_9_1/github_release_notes_launcher_1_1_1.md KUMM/.work/rc4_release/release/KrinikConanLauncher.exe`; (3) the body as published
> into `_config/release/published_0_9_1-RC4/` (the notes and `manifest.json` are already there — pack commit of this closing); (4) `release_checklist.py --published`;
> (5) issues #4 #13 #21 #43 #48 — «вошло в v0.9.1-RC4» comments, closed after the retest on the published release (#21 needs the real waystone travel);
> (6) the update RC3 → RC4 through the launcher on `KUMM/.work/rc1_install/Conan_311`: `node KUMM/.work/rc4/realcheck.mjs` (the local feed; never run yet);
> (7) cleanup `KUMM/.work/rc4_release` (41 GB) only after the upload is verified; `public_tree_rc4`, `rc4/kit_out`, `rc4/keep` (the camera config copy, the
> `KrinikMenuProbe` `enabled.txt`) — remove; (8) the RC4 notes have no update-size line (12 files, 46.6 MB) — published without it.
> Then the carried items of the 18:55 chat: plan 61 step 2 (our kit «Esc catcher» on EAA); the real waystone travel (#21); a talk with an NPC over the map started
> by a REAL E (M2); #30 the sprint-jump view; issue #52 (the first-person bow stance — for later, by the owner's word 22:39); the issue #52 text re-checked by the
> portrait (filed with the portrait loaded > 1 h earlier). The owner asked 23:08 which bugs are critical for comfortable play — answered from STATUS in chat
> (the waystone travel, Esc in mods' windows, the first-person view switch ≈ 3 ms, the talk over the map by E); a list checked against every bug file is owed.
>
> **RC4 BUILT 23:06** — the owner 22:56 waived the play hour («час не нужно, собираем так, так как мы пока хотфиксингом занимается»; `KUMM/.work/rc4/waiver.txt`,
> `KRINIK_PLAY_GATE_WAIVER`): `make_release.sh` OK into `KUMM/.work/rc4_release/release` (7 volumes, 83 per-file assets + `manifest.json`, the guide PDF, the
> launcher 1.1.1, SHA256SUMS; stream `c3c34837…`, 13 723 733 770 B = «12,8 ГБ»; **changed vs 0.9.1-RC3: 12 files, 46.6 MB**); the release-page notes with sizes
> `KUMM/.work/rc4_release/release_notes_Krinik_Mod_Pack_0_9_1_RC4.md`; README.draft unchanged (the same 12,8 ГБ). The work dir is 41 GB, D: 21 GB free. Log
> `KUMM/.work/rc4/logs/07_make_release.log`. **NEXT:** (1) one line about the update size in the RC4 notes (both halves, by the portrait: «Обновление с RC3 скачает
> 12 изменившихся файлов, около 47 МБ») — draft + the copy in the work dir; (2) the update RC3 → RC4 through the launcher on the copy `KUMM/.work/rc1_install/Conan_311`:
> `node KUMM/.work/rc4/realcheck.mjs` (adapted, never run); (3) the owner's word for the publication — then `gh release create v0.9.1-RC4 --latest` with every file
> of the release dir, `launcher-v1.1.1` (`--latest=false`, `draft_0_9_1/github_release_notes_launcher_1_1_1.md`), `release_checklist.py --published`, the
> public tree (`make_public_tree.py`), issues #4 #13 #21 #43 #48 commented and closed after the retest; (4) cleanup of `KUMM/.work/rc4_release` after the upload. Owed in game: a weapon swap in first person on the new pass («просмотрено N» small),
> quit to menu and back. `KrinikMenuProbe` disabled in the working game (its `enabled.txt` in `KUMM/.work/rc4/keep/`). The owner plays another game 22:19 —
> no real input, no voice until he frees the machine. Next: THE PLAY HOUR (`testcases/TC_conan_play_matrix.md`, rows R11–R13 added; recorder `KUMM/.work/rc4/play/rec_session.sh`; report
> `testcases/reports/2026-11-22_conan-play-0.9.1-RC4.md`; the gate `check_play_report.py`) → `make_release.sh` → the update RC3 → RC4 on the copy
> `KUMM/.work/rc1_install/Conan_311` (RC3 installed; driver `KUMM/.work/rc3/realcheck.mjs` to adapt) → the owner's word for the publication.
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
