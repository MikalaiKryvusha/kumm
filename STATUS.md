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

> **NOW (chat of 2026-11-18 08:10, `выполни resume`; the owner's words of 08:11–08:22 — chronicle entry 2026-11-18 08:11).** (1) **Dash rule scoped**
> (`HOUSE_RULES.md` 33.5, `RUSSIAN_RULES.md` §11, plan 56 «Scope»): only text the agent wrote, only a dash wrong from the start; re-read `2d4b104` for legal dashes
> that were changed. (2) **The 08:12 frame was an impossible state** (stand flag `KRINIK_LAUNCHER_STATE=installed` with no game) + the unpack-anywhere chain
> (installer README vs guide) — both closed by plan 57. (3) **Launcher version line «Лаунчер: 1.1.0»** under the window buttons, centred on the pair (08:13, 08:20) —
> in `KrinikConanLauncher.cs` (`LVER_*`, `capsCenter`), seen on a 4K snapshot; judge round running, pack commit after it. (4) **NEW EPIC — `plans/57_EPIC_conan_launcher_self_sufficient.md`**
> (08:18–08:22): the launcher finds the game on the disks, sees / downloads the latest release for the found game version, installs; a Conan-coloured
> progress bar with %, download speed, remaining and elapsed time. **Phase 0: 12 mockups in KUIPS** (`HOUSE_RULES.md` 34; `ConanExiles/_config/launcher/design/`,
> sheet `design/flow-map.html` opened for the owner 08:29) — **waiting for his verdict**, then phase 1 recon. (5) Still open from the chat of 00:40 (below): the launcher
> judge round + the pack push; dm-fish pass 2 under the new scope; the game run; D4 notes; the KUMM force-push (the owner's call).
>
> **NOW (chat of 2026-11-18 00:40, `resume` + «работай автономно в дневном цикле до переполнения контекста - затем закрывай чат» → /dayloop).**
> (1) **Epic 55 B7 verified** — batch on the final exe 138 / 0, control on 2f62b52 26 FAIL in the new cases, the button corners seen fixed on the live window
> (report `testcases/reports/2026-11-18_conan-launcher-b7-verification.md`). **Judge round on B7 → 7 risks, 5 cosmetic, all confirmed and fixed in the pack**
> (unpack marker `pack\.krinik_unpacked`, crash handler, keepOld / RestoreSlot, space formula, stand cases B15′ half bundle + control FAIL on the B7 exe;
> plan 55 B7 lists them). **B8 the crash-report offer BUILT** (`OfferCrashReport`, stand case B16′ `crash`); exe `0d6282b2…`, `batch58.sh` running at 01:10;
> **judge round 2 on the launcher running**. (2) **The owner's order 00:44 — no dash instead of a verb in any Russian text** (`HOUSE_RULES.md` 33, `RUSSIAN_RULES.md`
> §11, plan 56, `ConanExiles/_config/release/dash_lint.py`, wired into `build-docs.py` before the PDF): rewritten — hub rows, report tool (+ GitHub Issues as the
> second feedback path = D-fb), perks, settlement log, guide, README template, launcher strings; the camera mod's dev README left the shipment; **800 lines of
> `dm-fish-ru.tsv` — a helper rewriting into `.work/dash_fix/dm_fish_new.tsv`**, then apply by script with key / token parity, locres rebuild, a sample in game.
> (3) **Phase D: D1–D3 done** (plan 55 «Phase D — release tooling»): numbers 0.9.1 / launcher 1.1.0 / game 3.1.1 in `modpack.json`; README template fills
> versions and mod counts (9 + 63) from the manifest; guide → `guide-3.1.1.html`. **D4 owed — «Что нового» 0.9.1, known issues, release notes: the owner's
> text by his portrait.** (4) Show page for the owner opened 01:20: review folder `91_launcher_ugolki_i_tire` (corners before / after, the label).
> (5) **dm-fish 800 rows: the helper's rewrite REJECTED by a clean sample read (12 of 61 rows worse) and reverted** — my brief banned every dash, the norm
> allows several; plan 56 step 4 holds the new brief, the four old errors, the kept work files in `.work/dash_fix/`. The lint stays strict, so the PDF build
> is refused until that pass is done. (6) **Launcher judge round 3: D1 + R1, R3, R4, R6, C4, C8 fixed** (plan 55 B8 lists them and the OWED R2, R5, R7, C1–C3,
> C5–C7); exe `c834b0d4…`; the stand now builds the launcher under test as 1.0.0 (`batch58.sh`, the manifest says 1.1.0). **In game NOT seen yet:** the hub
> rows' new hints. Pack LOCAL commits `8ec5b4a` (launcher: B7 judge fixes + B8 + round-3 fixes) and `28a2bc9` (L8 past the settle), `2d4b104` (texts, the dash lint, 0.9.1 numbers, the 3.1.1 guide), `926c887` (C1, C2, C3, C5, C6; stand 175 / 0) — all LOCAL.
> The tooling judge round (01:40) found coverage gaps — asset-strings, the Hosav locres, the installer's mod versions, no lint on `--no-pdf` launcher builds (plan 56 «Judge round on the tooling»): FIRST text item of the next chat.
> **FIRST NEXT CHAT:** (a) a judge round on the launcher's last fixes (crash handler only before settle, guarded report start, seen stamp by creation time
> in %LOCALAPPDATA%, keepOld refuses self-update), then push the pack; (b) dm-fish pass 2 — DONE 01:5x by the helper (175 rows changed, 663 rows keep a dash with its class in allowed.tsv, incl. classes beyond the brief: apposition, parallel ellipsis, explanation, addition; 6965 left as «Древний камень» on purpose, the literal-EN option in optional_6965.tsv; review it first via diff.txt) — it wrote `.work/dash_fix/pass2/new.tsv` +
> `allowed.tsv`: parity by `apply_dmfish.py` (repoint it to pass2), a clean sample read, allow-list the kept dashes with their class, `make_locres_fix.py` →
> `locres-set-tr.py`, `deploy-localization.py`; (c) ONE game run: the hub rows' new hints + a locres sample + the crash offer on the real build folder;
> (d) epic 55 D4 — «Что нового» 0.9.1, known issues, release notes BY the owner's portrait (git log of the pack since 2026-11-02), a clean check, then shown
> to him; (e) the owed launcher items R5, C7 (plan 55 B8); C1, C2, C3, C5, C6 are fixed in `926c887`
— they go into the judge round of item (a) before the push; (f) the KUMM force-push — still the owner's call.
>
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
