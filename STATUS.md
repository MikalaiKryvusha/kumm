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
- ✅ The pack's code of the evening chat 2026-11-10 + bug 93 build 7 — committed and pushed 2026-11-13 10:5x (pack `d3e92f9`, 5 judge rounds, the last clean).
- ✅ **the «+» brightness (plan 49)** — decided 13:41 G1 (Conan gold `#E9C27A`), confirmed 19:11 with the page arrows in the same style; TO BUILD (handover item 4).
- ✅ bug 91 — the owner picked V1 13:04 (a plate above the diamond); built in the kit, deployed 13:12 (pack `eef82bf`); the real-hover check waits for a free PC.

- ❓ **2026-11-07 07:4x — the hub controller's player-path test needs the game in FRONT** (real mouse clicks on the tabs, Esc/Tab closing, a 144 fps recording
  of the switches): the work of plan 48 runs background-only by the owner's word of 2026-11-06 23:32 <!-- attribution-ok: verbatim in plans/48 --> — SUPERSEDED 2026-11-07 13:46 by the owner (the machine is the agent's, the game may go to the front — verbatim in bug 67 DONE, STATUS chronicle entry). The section is proven
  by the remote's switches only.

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

> **NOW — chat of 2026-11-14 from 11:52 (DAYLOOP by the owner's word 11:53 «работай автономно, продолжаем фиксить баги в сборке конана»):**
> (a) **plan 53 step 14 DONE 12:16** — the owner's six key bindings work in 3.1.0: his whole 3.0.1 `Input.ini` (the defaults of 3.0.1 and 3.1.0 are byte-identical;
> the «new actions» reading was false — corrected) is the pack's `_config/Input.ini` and in the game; real keys on video + the defaults control — report
> `testcases/reports/2026-11-14_conan-owner-keybinds-310.md`; a full dodge roll not seen (the hero overloaded 268 %) — for his play. (b) **bug 97 twins checked
> 12:3x–12:52 — no stale data** (probe v2 reaches list entries; `TC_conan_hub_kept_tabs_stale_2026-11-14.md`; notes: the map page lacks Simple Minimap's ping
> marker, the feat list keeps more built rows). (b2) **bug 101 OPEN** — real clicks at 144 fps: to / from «Снаряжение» a page hangs over the bare world 34–166 ms
> (the backing `W_Carousel` → `Background`, `MaskOffset` 1 only on «Снаряжение», switched natively a tick apart from our page); «Параметры» portrait late. (c) **the owner 12:24–12:32: the hub is an MVP — it needs work and tests**; goals: no lag /
> no jump on navigation, an easy mod-embedding mechanism, mod elements on a page's FIRST frame → the hub audit, plan 48 «The owner's words 2026-11-14» (step 1
> done; next: real-input 144 fps run of all 9 tabs, the mod-element list and its first-frame check, the embedding contract). (d) 52 voice files renamed by their
> write time (names up to 77 min ahead of the clock) + `stamp-gate.mjs` v3 (EXP-0526). Code judged: round 1 — 2 defects + 6 quality fixed; round 2 running.
> **FIRST NEXT CHAT (written 11:41):** (1) the owner's play is the check of today's four fixes — square page arrows, the hub's journey page refresh (bug 97),
> hub crafting at the real pace after the close (bug 94), the Esc flag reset (bug 100); (2) restore his six key bindings on 3.1.0 (plan 53 step 14 — the rows are
> listed there, real-key check); (3) bug 97 twins — the other kept hub tabs (Таланты, Клан, Спутники, Карта, Базар) checked by the same method; (4) the open list
> of the night (pointer line below), the wall jump (`KrinikConanLocomotion` PLAN row), bug 75 (the quick-loot rim). Rollback of today's UI pak (the arrows):
> `KUMM/.work/arrows/old_KrinikConanUI.pak` (12 MB; delete once the owner has played the build). The game and the source Lua are equal (cmp, 11:4x).
> **NEW CHAT 2026-11-14 09:51 +03:00 — /resume done, the Conan backlog shown to the owner in chat. His pick 2026-11-14 09:53 +03:00: the bugs of his play are the work, the water
> reflections (bug 89) go to the far drawer (`[OWNER]` 09:53, verbatim in bug 89). Order taken: instant crafting (94) first, then the rest of «Баги из вашей игры»; the wall jump (a jump off a climbed wall,
> `KrinikConanLocomotion` PLAN row) added to the queue by the owner 09:54 («еще я хотел прыжки из карабкания по вертикальным поверхностям»).**
> **09:56 DAYLOOP by the owner's word** (`[OWNER]` 09:55 «работай автономно в дневнгм цикле») **· the gold «+» ACCEPTED** («золото интеофнйса принято и одобряю», plan 49;
> the first-person shadow of folder 85 — no verdict yet, bug 98 C6 stays) **· loop item 1: the page arrows' diamonds even, not squashed** (his word, plan 49) **· item 2: the locked journeys (bug 97) —** `[OWNER]` 09:56 «очень важно
> разобраться с закрытыми путешесьвиями» **·** then bug 94
> (recon 09:5x: the instant-craft world is slot `Game_1.db` (the owner's new game of 2026-11-13), the minute-bandage world `Game_0.db` (2026-11-10) — no craft row in either
> `dw_settings`, no buffs, no craft property).
> **10:50 progress:** item 1 DONE in game — the arrow buttons lost their sizing TextBlock, the brushes' `ImageSize` 34.27² (kit, pak 7/7, deployed): Next
> 55 × 54 px at 4K (was 55 × 61), ≈ 26 × 26 at 1080p. Item 2 FIXED in game — our hub controller's kept journey page was stale; `REFRESH[5]` calls the page's
> native `RefreshGrid` on every show (my first cause claim of 10:15 rested on an invalid case — corrected everywhere, that first fix reverted). Run report
> `testcases/reports/2026-11-14_conan-page-arrows-square-and-journeys-refresh.md`; judge rounds 1–2 done (round 2: no correctness defect); PACK `9e6a826` pushed. **11:06 item 3 (bug 94) FIXED in game, not committed yet:** reproduced by the
> owner's path (C2: «Сделать 10» on bows, hub closed → 9 bows in ≈ 2 s); the queue's data = `RecipeItem` stats 16 (duration) / 9 (elapsed); `krinik_pause_in_menu`
> `rescale_queue` multiplies them by new/old on every multiplier change → C2f: after the close one bow per ≈ 3 s. Open: C5 (a reopen mid-batch — waits for a free
> PC), judge round 3 running, then commit (TC `TC_conan_craft_hub_close_2026-11-14.md`). C5 PASSED 11:12 (a reopen mid-batch keeps ≈ 3 s a bow); run report
> `testcases/reports/2026-11-14_conan-craft-hub-close-rescale.md`. Judge round 3 (11:18): mechanism confirmed; fixed in the working tree and DEPLOYED (game PID 29588):
> the Esc menu no longer rescales (a separate `queue_scale`; Esc = pause, and a batch at 0.0001 would be saved on «quit to main menu» and finish at once after
> the load), elapsed written before duration when shrinking, null slots by `IsValid`, failures counted; E1 PASSED 11:28 (the Esc menu: the batch stands; out: ≈ 3 s a
> bow). **PACK `9de0b63` pushed — bug 94 fixed, waits for the owner's play.** The remote `CraftItems` crafts instantly in ANY state (no entry) — the «instant
> world» was that. **Bug 100 FIXED in game 11:35, PACK `4a08d5e` pushed (two known limits in the bug):** a stuck `esc_open.IngameMenu` (the remote's activation, the game closed
> only `SML_ModList`) made the next hub run at 0.0001; `poll` clears `esc_open` on the full-screen close edge (run B100b). Game closed, machine lock released.
> **Plan 53 step 14, recon done 11:37:** his six key edits listed against the 3.1.0 `DefaultInput.ini` (plan 53) — restore with a real-key check next chat.
> **NEW finding (plan 53 step 14):** the owner's key bindings (`Input.ini` of 3.0.1 — chats off the
> numpad, his dodge key) did not move to 3.1.0 — the game runs on defaults; ~~carry his rows over onto the 3.1.0 action list, not the old file whole~~ (FALSE —
> corrected 2026-11-14 12:1x: the defaults of 3.0.1 and 3.1.0 are byte-identical, his whole file went in and works in game — plan 53 step 14). Earlier: the
> «instant without the hub» reading is confounded (bug 94 «Correction»); the player-path stand is ready (bug 94 «The player-path stand») — the F-batch case
> waits for a free PC (owner-presence BUSY twice at 10:4x). The harness
> TEMP is STILL `D:\Temp` (its background-task output lands in `D:\Temp\claude\…`): VS Code was not restarted after the user TEMP moved to `F:\Temp` — told
> the owner; the 8 leftovers in `D:\Temp` wait for that restart. Untracked on entry, not mine: `researches/pc-usb-lag/`, a Svarog PDF in `researches/svarogs-dream/`.
> **Moved verbatim to the chronicle (entry 2026-11-14 11:40 +03:00):** the blocks CHAT CLOSED 2026-11-14 02:16, NOW 2026-11-14 00:15–02:15 and HANDOVER 2026-11-13 22:0x (the 3.1.0 kit rebuild, the devkit update, the D:\Temp cleanup). Still open from them: plan 53 step 12 (other authors' stale vanilla copies, 3 of 11 — parked until ≈ 2026-11-15 by the owner; resume `python -I -X utf8 _config/check-mod-updates.py --since 2026-11-03 --all`); the Pickup+ admin widget error (`ComboBox_DrawDebugline`); UE4SS v4.0.0 as its own step; bug 75 (the quick-loot rim, reopened); bug 98 C6 (the owner's verdict on the first-person shadow frame, review folder 85); plan 52 steps 3–4; bug 93 S8 / S9 and the no-zoom-on-sprint wish; bug 96 (the owner's play); the pack judges' B2–B4 (pack `ff30fb9` message); L1–L5 of `TC_conan_move_3.1.0_2026-11-13.md`; the quick wins by A-B-A-B; the mods-table storefront row (the foliage-shadow fix — the owner's proofreading); paks uncompressed (size only); the live run of the `attr-arrows-show.lua` / `plus-tint-probe.lua` guards; `_config/craft-*.lua` probes uncommitted; rollback paks `KUMM/.work/kit310/old/`; 6 `*.tmp` in `D:\Temp` (after a VS Code restart).
> **Moved verbatim to the chronicle (entry 2026-11-13 22:0x +03:00):** the 2026-11-13 blocks from the forced closure of 20:1x back to the HANDOVER of 11:08 (three
> forced closures — their skipped ceremonies paid by this soft closure — the NOW / HANDOVER blocks of the move onto 3.1.0, bugs 93–99, plan 52); their open items
> are in item 3 above.
> **Moved verbatim to the chronicle (entry 2026-11-13 11:08 +03:00):** the HANDOVER 2026-11-10 19:58 block (bonsai trim). Still open from it: the KrinikConanUI key binds
> (recon F1), the wall jump, the simple air swing, a new-game smoke before the owner's long test play.
> **Moved verbatim to the chronicle (entry 2026-11-10 19:58 +03:00):** the blocks HANDOVER 2026-11-10 13:48, NOW 12:38, HANDOVER 11:17, NOW 09:4x, the night block 02:25 and HANDOVER
> 2026-11-09 22:45 (bonsai trim). Still open from them: bug 91 real-hover frame, the judge round on `kit-corruption-label-plate.py`, bug 88, bug 84 (the map), the hub
> controller player path, sprint + bow (now built), the streaming-in hitches (future).
> **Moved verbatim to the chronicle (entry 2026-11-09 22:44 +03:00):** the HANDOVER 2026-11-09 18:43 block (the quick-wins order of the first chat of 2026-11-09).
> **Moved verbatim to the chronicle (entry 2026-11-09 18:43 +03:00):** the blocks DONE plan 51 of 2026-11-09 16:43 and HANDOVER 2026-11-09 02:02.
> **Moved verbatim to the chronicle (entry 2026-11-09 02:02 +03:00):** the blocks NOW of 2026-11-08 22:58, DONE / IN FLIGHT of the night and HANDOVER of 2026-11-08 at 14.52.
> **Moved verbatim to the chronicle (entry 2026-11-08 14:52 +03:00):** SIDE TASK nfsu2, HANDOVER 2026-11-07 23:03, items 0 / 0b / 0c and the NOW block of 2026-11-08.
> **Moved verbatim to the chronicle (entry 2026-11-09 22:45 +03:00):** the owner's order of 2026-11-07 20:50 (FIRST NEXT CHAT: sprint + bow, attributes past 20) and THE OWNER'S QUEUE 19:48–20:00. Still open from them: bug 84 (the hub duplicates pages / the fullscreen map twice) · the lore stones' «E Читать» plate · grainy shadow on sand rocks · speckles on the oasis water · black far cave mouths (unfogged) · the bright SSR streak behind palm trunks · the rain from a small cloud over the hero (old debt, `plans/04_conan_ochered_zakazov.md`) · `_bench` 9.4 GB of old recordings waits for his «да»; sprint + bow and attribute paging — in the handover above.
> **Blocks moved verbatim to the chronicle (entry 2026-11-07 19:28 +03:00):** the bug 67 handover blocks of 2026-11-07 14:47–19:19 (the bug is DONE) and the chat blocks of 2026-11-06 (fifth) … 2026-11-07 (second) (forced closures 09:46 and 12:43, the hub controller v4–v10, the dayloops of 06:24 / 10:12, the UPDATE lists). Still open from them: the hub controller player path with the game in FRONT; the minimap helper «Свои маркеры» click on our map; quick-loot R3 (last cell of a row); plan 45 step 4+ (boss / elite spawns); KrinikConanMusic M7 with bug 79 cases; mod windows of `_config/compat/ui-overflow-candidates.tsv`; the guide’s 1.0.0 list.
> **The blocks of the 2026-11-06 chats 1-4 (forced closures of the third and the fourth, the q8 correction, the dayloops of 09:05, 12:46, 19:20, bug 67, the music mod, interview #034, plan 45 steps 1-3, Nexus quarantine) - moved verbatim to the chronicle, entry 2026-11-07 00:33 +03:00.** Still open from them: plan 45 step 4 onward (boss / elite spawns) and kinds 8-12; bug 67 palm shadows (re-shoot with hdr.ps1 off + SetTimeOfDay; build stays 2.0/-1.0); KrinikConanMusic death scene M7 with bug 79 cases (respawn, dungeon, waystone); q8 Nanite B data; G4 boss ghost by the thrall conversion path; Nexus ticket 276571 follow-up letters (sent by the owner 2026-11-06 and 2026-11-13); Northern Timber - the owner decides.
> **The 2026-11-03 chat blocks (cb012770, ce994c74, the 1.0.0 resume of 19:51, the Nexus publication of 19:05) and the 0.9.0 release pointers — moved verbatim to the chronicle, entry 2026-11-06 12:34 +03:00.** Still open from them: nest eggs (bug 82), a real E over a corpse in a bush (bug 80), the rim on F done properly (bug 75), the rest of the guide's 1.0.0 list; Nexus — ticket 276571.
> **Older pointer blocks (2026-10-26 … 2026-11-02: chat FIRST lists, the 1.0.0 orders, plan 35/36/34 queues, the measurement queue) — moved verbatim to the chronicle, entry 2026-11-03 20:58 +03:00 (second part).** The live backlog: the guide chapter «Известные проблемы и планы на 1.0.0», epics `plans/40_…` and `plans/41_…`, `plans/36_…` (W table), `plans/35_…`, `plans/34_…`; work trees `_paksview-3.0.1` (66 GB) and `Conan Exiles Mods/_text-extract-3.0.1` (20 GB) stay.

## Open bugs

Files without the DONE tag — 29 (2026-10-18 13:45):

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
`.claude/hooks/context-budget.mjs` runs (2026-10-30: #181 farewell hook, #182 autonomy guard, #183 the agent cleans up after itself — `bugs/KAIF/21–23`): at 70 % and 75 % — warnings only (the owner 2026-10-31 21:26), at 85 % — the closure (`CLAUDE.md`).
