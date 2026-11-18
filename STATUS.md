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
> **⚡ 2026-11-18 18:17–18:19 — the build 0.9.1 with the launcher 1.0.0 is the focus, and the three items below are ONE linked goal, done together** (`[OWNER]`
> «КРИТИЧЕСКИ ВАЖНО СОБРАТЬ СБОРКУ 0.9.1 с лаунчером 1.0.0» · «стремимся это сделать!!!» · «фокусируемся на этой работе» · «это приоритет #1 из трех пунктов» · 18:17 ·
> «там три связанных пункта вместе» · 18:19; chronicle entry 2026-11-18 18:17). Nothing of items 1 and 2 is cut: the build is assembled from all three. «Собрать» =
> the shipment built and verified (launcher 1.0.0 exe, export bundle, parts, digests, PDF guide, release notes) — publication still waits for his word.
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
> **3. The build 0.9.1 in a working MVP state — the ROUGH POLISH of the build: the critical bugs of the build and its mods fixed** (critical = HOUSE_RULES 38:
> crashes, slowdowns, lags, errors, dead buttons, dead ends, no save, no load) — a working, more-or-less stable state; epic 55. Item 3 is its own work, NOT the sum
> of items 1 and 2 (`[OWNER]` 2026-11-18 19:29, chronicle entry 2026-11-18 19:29; corrected 2026-11-18 19:29 +03:00 — this line said «Exit: 1 and 2 done» until then). The release
> 0.9.1 is assembled from all three; the publication itself waits for the owner's word.
>
> **Progress of the chats of 2026-11-18:** the latest is the block «CHAT CLOSED 2026-11-18 16:0x» in «Where to continue» below; the block CHAT CLOSED 14:3x and the earlier progress lines — chronicle, entries 2026-11-18 14:3x and 16:0x.
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

> **UPDATE 20:3x — the design changed after judge round 1 (`F:\Temp\…\scratchpad\judge_bug85_r1.md`, findings D1–D3, R1–R8 — summary in bug 85):** D2 CONFIRMED in
> the game 20:22 — a Lua-made FLX button (`W_KrinikButton`, Create with the GameInstance AND with the window as owner) never pressed on Esc; so: **(a)** the mods
> button and its list = vanilla `WBP_ButtonBase` inside a kit wrap `W_KrinikClickWrap` (Overlay root, `OnPreviewMouseButtonDown` → `KrinikPreview`, Unhandled) →
> `on_click` by IsHovered (the old route, now on the game thread); the outside press = `W_KrinikClickCatcher`; **(b)** our window's Esc = kit
> `OnPreviewKeyDown` → `KrinikEsc` → `close_window` (Lua hook at the first opening); **(c)** Esc of OTHER mods' windows (fishing, Hosav, AMR, LLH, PrP, DN,
> Emberlight, EAA, PIFC) is DROPPED until a native pak fix — `[AI]` 20:3x, said to the owner in chat (crash > convenience), bug 108 to file (with his EAA note);
> `W_KrinikButton` removed from the kit (the uasset deleted, the CookInfo line dropped). Kit run 7 crashed the kit editor in `AddCallFunctionNode` 1 s in
> (probably the stale registry entry of the deleted asset) — run 8 running 20:3x. Lua rewritten (the guard on the source: 0): `krinik_click.lua` (wrap +
> catcher), `krinik_mods_button.lua`, `krinik_pause_in_menu.lua` (the Esc block → a note), `krinik_mod_settings.lua` (KrinikEsc). The deployed build still
> has the 20:17 pak + the first Lua (W_KrinikButton) — redeploy after run 8 + `kit-buildmod.py`. Owed: K1–K8 by the player's path (the real mouse — owner
> FREE), judge round 2 on the new diff, pack commit, bug 108. My recon probe crashed the game at 20:20 (GetPropertyClass on a struct, EXP-0570) — not the build.
> Also this chat: the owner's sunset picture graded like v2 (D:\Sunset_Ancient_Valley_{Realism,Warm}.webp) and his two upscales cut into
> `art/wallpapers(_source)` as `V2_female_beta` (pack, NOT committed yet).
>
> **NOW — chat of 2026-11-18 19:24 (`resume` + the previous farewell's order).** (1) **Bug 85, the five KrinikConanUI key binds — code written, NOT yet built or
> run:** recon R1–R2 by the remote + `ConanExiles/_config/post-key.ps1` (a key posted into the game's window: the game acts, UE4SS binds do not see it) —
> bug 85 section 2026-11-18 19:3x–19:4x; the hub's close passes `ActivateModule` (Esc and Tab); ten mod windows swallow Esc natively (EAA among them — the owner
> 19:40, the same class), LBPR closes the hub instead. Fix = blueprint events on the game thread: kit `_config/devkit/kit-krinik-click-events.py` (saved: the click
> catcher, `W_KrinikModSettings` preview-mouse event, both menus' feedback event; `W_KrinikButton` — runs 1–5, the last pick «События|AssignSignalClicked»),
> Lua module `krinik_click.lua` + five sections rewritten (the guard on the source: 0). Mod notes: `games/ConanExiles/mods/KrinikConanUI.md` «Clicks and Esc
> without key binds». TC `testcases/TC_conan_keybinds_to_game_events_2026-11-18.md` (R1, R2 done; K1–K9, C1 owed). Next: the kit green → `kit-buildmod.py
> KrinikConanUI` → copy the pak → `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` → the TC by the player's path (real mouse needs the game in front and
> `owner-idle.ps1` FREE) → judge rounds (round 1 running on the Lua + kit + post-key diff; the owner 19:48: new code and architecture need a good independent review
> and a manual functional run). (2) **The art folder — the owner's debt of 15:38 applied 20:0x** (he could not find the arts 20:00): pack commit — `art/logos`, `icons`,
> `wallpapers`, `wallpapers_source`, `screenshots`; scripts and the manifest moved; launcher res images and both icons rebuilt byte-identical. LOCAL, rides with the
> pack push. Release step owed: the public tree of 0.9.1 and `build_nexus_description.py` (raw logo URL → `art/logos/…`) go out in the SAME release, the Nexus page
> updated with them. (3) Item 3 of the priority is the rough polish (critical bugs) — corrected 19:29 (the line above). The Russian proofreading goes after RC1 into RC2.
>
> **Chat of 2026-11-18 18:16 (`resume` → the owner: «КРИТИЧЕСКИ ВАЖНО СОБРАТЬ СБОРКУ 0.9.1 с лаунчером 1.0.0», the three items one goal). Done by 19:0x
> (pack committed `9d2a8b4` launcher + versions + tooling, `5f1544f` texts — LOCAL, the push waits for judge round 2 running 19:1x → `reports/2026-11-18_judge_launcher_round2.md`):** the launcher: the language DROPDOWN (stand `lang` 25 / 25); judge round 1 (`reports/2026-11-18_judge_launcher_
> c05aa51_21075fb.md`) — D1 `never.txt` (this PC: `%LOCALAPPDATA%\KrinikConanLauncher\never.txt` = `D:\Instals`), D2 the installed version from KUMM
> `Deploy-ModPack.ps1` → `_kumm_backup\pack_version.txt` (fixture-pack 71 / 71), D3 stop marks + «не закончил скачивание», D4 title pair (header per the mockups),
> D5 screen «removing», R7–R11, R14 fixed; R12 refuted, R13 accepted risk, D6 (switch the remembered copy) → the owner; the frames stand hides question boxes
> (WH_CBT) and `live.mjs` runs in frames mode; `self.mjs` 18 cases: the full run r11 242 / 2 → both fixed (r12, r13), never 8 / 8; `batch58` 187 / 2 (never.txt
> written mid-run; the «error» mark on a refusal → `u.Started`, fixed, NOT re-run). Versions: every Krinik mod 0.9.1 (`[OWNER]` 18:52; manifest, kit modinfo ×6,
> Lua headers; paks Graphics / Archery / Gameplay by `set-pak-version.py`, UI rebuilt in the kit — menu lines from the manifest; originals in `.work/kit091/orig`);
> deployed into `D:\Games\Conan Exiles 3.1.1` 4 / 4, verify 114 / 0; SMOKE PASSED 19:01–19:05 (the menu shows 3.1.1 / 0.9.1 under the logos at 4K —
> `.work/kit091/menu_091*.webp`; the world in 8 s; 66 / 66 mounted, 0 too old / missing import; HUD, minimap, «E Взять» on a world frame; the game closed cleanly).
> Texts: clean read (`reports/2026-11-18_clean_read_three_texts_091.md`) → the writer helper rewrote README / guide for 0.9.1 + the notes
> `_config/release/draft_0_9_1/github_release_notes_0_9_1.md` (marker line 1, the first-person bow added); the owner's lines → `.work/texts091/owner_proposals.md`
> (page owed). Release tooling: `_config/release/make_release.sh` (one command, [NOT-TESTED]) + `make_volumes.sh` `KRINIK_VOLUME_BYTES` (no second 13 GB copy —
> the owner asked 18:55 why 50 GB). KUMM `236a886`, `32e58e9` (idea 26 — the plate in the world over the item, the owner 19:06) — LOCAL.
> **The owner's orders 19:02 (verbatim in the chat; chronicle owed):** «и нужно будет тестовую сборку собирать и тестировать качание через лаунчер по боевому пути -
> из релиза ГХ» · «и установка на чистую версию». ASKED 19:1x in chat: where the test release lives — A a separate public test repo (recommended), B a draft /
> pre-release in the main repo (the launcher does not see them), C the real v0.9.1 at once. ANSWERED 19:08: OUR repository, «0.9.1-RC1», every later fix RC2, RC3 … (plan 55 phase E; the RC ordering in the launcher owed).
> **Bug 85 (the crash class) — NOT fixed, the first item of the next chat:** five `RegisterKeyBind` in KrinikConanUI (`krinik_feedback.lua:91`,
> `krinik_mods_button.lua:285`, `krinik_mod_settings.lua:1380`, `krinik_pause_in_menu.lua:680`, `krinik_hub_controller.lua:354`); found 18:58: `FLXButtonBase` has
> NO click UFunction (Signal* are delegates; the click is native C++), so the replacement is research: a kit-bound custom event per button (as the attribute page
> arrows, `kit-attribute-paging-step2.py`), the game's own Esc / Tab handling for the two key binds; hook the hero's AnyKey only in gameplay (the camera's way).
> **ORDER FOR THE NEXT CHAT (`[OWNER]` 2026-11-18 19:23, verbatim: «Падение 85. Научить лаунчер порядку номеров RC. и после этого только Провести третий круг
> судьи и отправить пак на GitHub.»):** 1) bug 85 — the five KrinikConanUI key binds; 2) the launcher's RC ordering (0.9.1-RC1 < RC2 < 0.9.1); 3) the round-2
> findings fixed with them; ONLY THEN 4) judge round 3 and the pack push; then RC1 by `make_release.sh` → the release → the launcher on a fresh clean 3.1.1.
> **Corrections by the closing judge (19:21):** «every Krinik mod 0.9.1» = the 10 at the build version, KrinikConanMusic stays 0.1.0 (not shipped); all KUMM
> commits of this chat are PUSHED (`e468a17`); the test-release question was ANSWERED 19:08 / 19:11 (RC1 in our repo, Linux format) — not owed; judge round 2
> is DONE (not running); plan 57 «Judge round 2» box and plan 55 R1, R2, R6 (deploy + menu frame) boxes are stale-unchecked — tick them next chat. The r12–r14
> stand runs have no saved totals (chat output only).
> **Judge round 2 DONE 19:1x — `reports/2026-11-18_judge_launcher_round2.md`, NOT yet verified against the code, NOT fixed (the chat closed at 80 %):** D1
> `make_release.sh` / `make_volumes.sh` have no `pipefail` (a failed build-docs / export hides behind `| tail`); D2 `make_release.sh` does not pass
> `KRINIK_VOLUME_BYTES` and still splits a second 13 GB copy; D3 the installed build's game half comes from the found copy (0.9.1 «для 3.2.0» after a patch —
> record the build's gameVersion); R4 a quoted line in never.txt is skipped silently; R5 RunJob deletes the stop mark before Run's refusals; R6 `/pressed/` in
> `self.mjs` matches «not pressed» (use `/^pressed/`); R7 the U1 stub uninstaller exits before the probes; R8 416 now dead-ends (delete the part, refetch) and
> 408 / 429 should stay «net»; C9 a bundle in a forbidden folder offers install; C10 the watcher gate runs the case on a timeout. The pack commits `9d2a8b4`,
> `5f1544f` stay LOCAL until these are fixed and a round 3 is clean (the owner's judge rule).
> NEXT: round 2's fixes → round 3 → pushes; bug 85; the owner's page (texts + proposals + D6); his answer on the test release → `make_release.sh` → the test release →
> the launcher downloads it on a fresh copy of the clean 3.1.1.
>
> The block «CHAT CLOSED 2026-11-18 16:0x» (the chat of 14:59, its FIRST NEXT CHAT list) — moved verbatim to the chronicle, entry 2026-11-18 19:2x.

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
