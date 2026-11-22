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

> **THE CHAT OF 18:55 (2026-11-22) — bug 118 SOLVED: not a defect of the build.** The seven UE4SS crashes with EAA over the hub were the agent's OWN Esc
> probe `.work/tmp/esc_listen.lua` (`ListenForInputAction` with a Lua-table delegate) sent by the remote: one stack hash in all seven, the stack's Lua shape
> («`pcall` → `return dofile` → `pcall` → UFunction») and the probe's command in every minidump; reproduced on demand twice (19:28 all mods on, 19:31 camera
> OFF). Without the probe: 10 min + 15 EAA reopen cycles clean. Tools: `ConanExiles/_config/crash-forensics.py` (stack hash + the remote commands per crash
> folder — run it FIRST after any crash in our run); the remote refuses a table delegate (guard `no-table-delegate`, G1–G3 pass 19:53). EXP-0613. Bug 108's E0b
> path (Lua `ListenForInputAction`) is dead — the Esc of mod windows is the native pak fix. **Issue #50 closed** (not planned — not a build defect).
> Also: **#49 closed** — A49 (death with the bow in first person) and A49n (empty hands) pass; **#51 filed** — KrinikConanLocomotion wrote the dead pawn's movement
> component (two `[Error] … nullptr` lines per death), fixed (`tick()` waits for a live component), L2 pass 19:59 — closes after its pack commit. The owner's save
> restored from `KUMM/.work/bug118/save_before_death` after the deaths (integrity ok). Case file rows A49, A49n, L2, G1–G3.
>
> **THE CHAT OF 15:18 (2026-11-22) — the RC4 scope, part 1 (pack `b42090f`).** (a) bug 118 — solved in the chat of 18:55 above (the camera's registry stays as
> the cheaper design, not as a crash fix). (b) **#49 the archery
> error at death** — filed, fixed (mesh guard), the death case A49 NOT run in game yet. (c) **#43 the feedback window** — a later open 13.2–13.7 ms (was 76–83 ms
> at 300 %), the first open still 92 ms (owed: draw the faces at idle after the window shows); `perf-report` stand case; the owner's eye decides the issue.
> (d) **#41 Esc** — recon in bug 108: Lua key hooks never fire; the working native path is the game's own input action «Escape» on the window
> (`SM_UI_Settings_C` does it) bound to the window's own close handler (`BndEvt__Button_81_…` closes EAA) — `ListenForInputAction` with a delegate table NOT tried
> yet (every try met crash 118 first). Not started: #21 the waystones / dungeon (R21a/R21b), #30 the bow sprint S9, #23 the stuck map. The RC4 build path for the
> new launcher already exists: `make_release.sh` → `make_manifest.py --previous-from` (RC3's `published_0_9_1-RC3/manifest.json`). The game's mods folder: every
> Krinik mod back on; `KrinikMenuProbe` (a dev leftover, «after reading — delete the mod») still enabled in the build. Case file `testcases/TC_conan_rc4_scope_2026-11-22.md`.
>
> **CHAT CLOSED 2026-11-22 ≈15:1x (the chat of 13:06 — the previous farewell pasted as the entry; soft closure by the owner's word 15:07 at 78 % context).
> Reports: `testcases/reports/2026-11-22_conan-fp-shadow-always-owner-no-see.md`; cases R21c / R21d / N1 of `testcases/TC_conan_loading_screen_waystone_dungeon_2026-11-22.md`.**
> - **The owner's debt (13:10–13:11, verbatim in `bugs/114_*`): the first-person shadow ALWAYS, everything visible to other players** — KrinikConanCamera (pack
>   `25dff5d`): no bone hide; the first-person camera moves forward 0 → 10 cm from 55° to 75° pitch (the morning's «neck» was an armour collar); the sheathed
>   weapon OwnerNoSee + CastHiddenShadow; the held item's shadow back; own hero by `IsLocalController`. S1–S7 pass on v1 / v2 (S3, N1, N2 on v2 only), regressions on v3 / v4 (S1, S2, S5–S7 / S1, the push, S5, S6), four judge rounds. The show page
>   `ConanExiles/_library/НА ОТСМОТР НИКОЛАЕМ/97_ten_vsegda_ot_pervogo_lica/pokaz.html` — opened 14:10, his look awaited. His 14:52 question on the axe's shadow —
>   answered by frames: the raised first-person pose and the blade edge-on to the sun (the game map). Not covered: a second player's client, a mount, the drawn aim.
> - **Bug 79 (#21) — the admin-teleport path FIXED** (pack `b7d984a`): two live loading screens during a load; the pause keeps up to 3 recent births and no
>   longer re-arms behind a loading screen; R21d and N1 pass; the dungeon and the waystones not run on this version.
> - **The owner's look at the launcher 15:06:** fast except the window that explains the feedback instructions (`bugs/110_*` «The owner's look»).
>
> **🎯 FIRST in the next chat — THE RC4 SCOPE (`[OWNER]` 2026-11-22 15:07 «чиним остальное все это в следующем чате...двух, и это будет скоуп на RC4»):** fix all
> six, then build RC4 by the release ritual (`release_checklist.py`, HOUSE_RULES 42). **`[OWNER]` 15:16: «RC4 уже будем собирать под новый лаунчер, который
> обновляется по файлам»** — the release is built for the launcher that updates by changed files (issue #45, closed 2026-11-21; launcher 1.1.0): read how
> that launcher's file update consumes a release (its feed / manifest) before the RC4 build and make the RC4 assets match it.
> 1. 🟡 **2026-11-22 20:1x: the dungeon (the Dregs, IN and OUT — R21e), the admin teleport (R21d) and a teleport with the waystone map open (R21a-sim) pass on
>    `b7d984a`; owed only the REAL waystone travel between two placed waystones (placing needs the building mode with real input); issue #21 commented, open.
>    The Wine Cellar is gated by a world event (`RequiredEventTag`) — use the Dregs (`BP_TriggerTeleport_InFromEntrance` / `…_OutFromEntrance`). Stand trap: an
>    admin teleport INTO a teleport trigger makes two teleports in one frame and a loading screen stuck at 99 % (not a defect).** The old text: **#21 the waystones** (R21a; Waystones Enhanced item 7770001, travel by `TeleportPlayerServer` — `games/ConanExiles/mods/WaystonesEnhanced.md`) and the dungeon
>    entrance (R21b stand: `KUMM/.work/tmp/list_teleports.lua`, the heroine set into the Wine Cellar trigger by `K2_SetActorLocation`) on the final pause version;
>    the probe `KUMM/.work/tmp/tp_widget_probe.lua` samples the time behind a load. Then close #21.
> 2. 🟡 **2026-11-22 20:2x–20:4x: #30 items 1–2 answered, not defects** — the draw holds in a sprint by REAL input (the «drops by itself» rows came from the
>    remote, which cannot hold RMB); «RMB does not draw» = the bow on its sheath (a punch, vanilla) or `NotAmmo`; S9 answered; issue #30 commented, items 1–2
>    ticked. Open (cosmetic): the camera jerk at the stamina's end, the sprint-jump view (FOV 102.1 → 107.5 kept after the landing — read KrinikConanArchery's
>    sprint-view FOV first; bug 93). The old text: **#30 the bow sprint** (bug 93): cases S8, S9 — the bow sheathed by its quick slot (`h:InpActEvt_Shortcut0_K2Node_InputActionEvent_25({KeyName=FName('One')})`),
>    real W + Shift and RMB, the Locomotion and BowSprint log lines.
> 3. **#23 the stuck full-screen map** (bug 84): not reproduced in three variants on RC3 — a wider hunt (gamepad, the map over a loading screen or a dialogue).
> 4. **#41 Esc over other mods' windows** (bug 108): in scope by the 15:07 word — native pak fixes of those windows (the Lua path is dead: KrinikConanUI.md «Clicks and Esc»).
> 5. ✅ **The KrinikConanArchery Lua error at the heroine's death** — fixed in `b42090f`, A49 / A49n pass 2026-11-22 19:55–19:59, issue #49 closed.
> 6. **#43 — the launcher's feedback-instructions window is slow** (`bugs/110_*`): measure it at 300 % (open, first frame, a press), fix, retest.
> Also owed: comments on issues #13, #4, #21 (the owner's bug-report genre, the portrait check — HOUSE_RULES 44); #48 closes after the RC4 retest; `-Verify` names 4
> KrinikConanMusic files missing in the build; DW1 of the damage window (real hits); the owner's errand — delete `D:\PATH.txt` and `D:\settings.txt`.
> Markers owed (comment-only pack commits): the camera's first-person section `[NOT-TESTED]` → `[TESTED: 2026-11-22 · TC_conan_fp_shadow_always_owner_no_see S1–S7 ·
> testcases/reports/2026-11-22_conan-fp-shadow-always-owner-no-see.md]`; the pause's loading-screen block → `[TESTED: … R21d, N1 …]`; its comment «держит САМЫЙ
> НОВЫЙ … один IsInViewport» → «до трёх последних» (the closing judge 15:14).
> Stand helpers of this chat: `KUMM/.work/fp_nosee/shot.sh` (pitch / yaw / 4K frame), `KUMM/.work/tmp/weapons_now.lua`, `fp_nosee_try.lua`, `find_rows.lua` (item search).
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
  the world freeze after an in-game loading screen — the admin teleport fixed (pack b7d984a), the dungeon passed on 3b5e1e6 and not re-run on b7d984a, the waystones not run.
- ✅ `bugs/115_DONE_conan_launcher_installed_after_uninstall_window_closed.md` (issue #46): DONE 2026-11-21 21:23 — retested on the published 0.9.1-RC3, issue closed.
- ✅ `bugs/85_DONE_conan_crash_keybind_lua_races_game_thread.md` — the bow-kill crash: DONE 2026-11-21 23:12 (issue #24 closed after 15 cycles of real bow hits finished by `KillCharacter`, no crash).
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
