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

- ✅ **2026-11-02 00:22 — interview #030 APPLIED and seen (packs `0663f2f`, `fb6cc6a`):** arrows sit in the body (side frame, folder 56 `04_…`), one arrow per shaft
      in the corpse's loot, the shafts go when the arrows are taken (real E + Q) — TC A11, A12, A13 pass. **00:27 the Damage Meter page in the Xevyr hub works** (pack `dd73239`):
      D1, D2 pass (the author's values; a real Save writes the mod's slot through the author's window, which now closes after it), D3 flash not measured;
      the remote opens the Xevyr hub by the shared variable `KrinikHubRequest`. Next: the other four Xevyr pages (I6.3), then the list's Xevyr entry → the hub;
      ~~the left-list seam (the name mid-height)~~ FIXED 2026-11-02 07:34 +03:00 (cases L0–L2, report `2026-11-02_conan-hub-left-list-seam.md`); then the 13 blocks to 1.0.0.
- ⚠️ **CHAT 70dda2b5 FORCE-CLOSED 2026-11-02 00:31 +03:00 at 85.5 % (the hook's number).** Last step NOT done: the left-list seam fix (`SC_KrinikMods.Slot:SetVerticalAlignment(1)`
      in `fill_window`) left the hub window EMPTY in game (frame 00:30) — reverted to `dd73239` and redeployed; the cause is not read (check UE4SS.log for the
      fill error first). **Resolved 2026-11-02 07:3x:** the empty window was opened during the world load (log «module opened, but no visible …»), not the edit; the real
      cause of the seam — the hidden pages' list rows stayed (32 units each); `fill_window` now collapses `HB_KrinikModItem_<key>`. Game closed, machine lock released, everything pushed. Закрыто принудительно: церемонии (проход судьи, обрезка STATUS, README, линтеры
      витрины) пропущены — долг платит первый /end-chat-soft. Ложных утверждений на месте не осталось.
- (superseded) 🟡 **2026-11-02 00:02 +03:00 — the loot part BUILT (pack `0663f2f`):** arrows sit in the body (no shafts in the air — the owner's 23:46 frame fixed), one arrow per
      shaft goes into the corpse's loot (seen 4/4), a real Q takes them; the shafts go after a real Q — seen 00:10 (TC A13 pass); owed: a clean side frame of the shafts in a body (A11).
- (was) 🔴 **OWNER'S DEBT — interview #030 answered 2026-11-01 23:41 — A:** `[OWNER]` «тогда делаем, что воткнытые в трум стрелы идут в инвентарь трупа». To apply, in
      order: (1) a read-only remote recon of the corpse's inventory — its component class and the add-item UFunction (`scratchpad` probe `corpse_probe.lua` lists
      the corpse's components; `pult.sh "funcs <component>"`); (2) KrinikConanArchery `on_corpse_born` / `rebirth`: one arrow item (`ProjectileItemTemplateID` of
      the copy) into the corpse's loot per copy kept; (3) when the arrows leave the loot (`QuickLootPanel:SlotItemAddedOrRemoved`), the shafts go; cases in
      `TC_conan_arrows_stay_in_corpse_2026-11-01.md`. Not built yet.
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

> **Older handover blocks of 2026-11-01 — moved verbatim to the chronicle, entries 05:51 · 11:14 · 15:52 · 17:54 · 18:18 · 21:56 · 21:58 · 23:00.** Still open from them:
> the HUD temperature comfort (white) and cold (blue) frames (folder 47); review folders 44–47 and 50 for the owner's eye; refill hunger / thirst in every run.
> **Chat c5fe291c (20:33–21:58) — its done list moved verbatim to the chronicle, entry 2026-11-01 21:58 +03:00:** review folders moved to the Conan dir; Xevyr variant A;
> «Клавиша вызова курсора»; logo tone; minimap (accepted); ×3 arrow hidden at impact (confirmed); bug 73 DONE; «E Взять» prompt (plan 42) — the probe as the camera
> mod sees it, fade 0.2 s, the backing only under the word at 0.35 (pack `ac31b3a`; 0.35 also set live in the running game; the layout needs a restart).
> **NOW (chat 70dda2b5, from 22:13; dayloop from 22:55 by `[OWNER]` «работай автономно»):** DONE and seen in game — «E Взять»: the owner's layout (P6, P7), the
> fade by the real-E path (P8), the A-B flight within noise (P9: on 15.14 ms vs off 15.17 ms), the list growth fixed (P11), the E-to-word gap 6 by `[OWNER]` 22:48 «вариант 3» (P12);
> the bench start hold 20 → 40 s (`[OWNER]` 22:38); hub mode — the list names the hub, H1–H3 pass; **arrows stay in the corpse**, the killing arrow too (UE4SS delegate
> `Remove`, TC A6–A8, A10); the test-after-code hook no longer reads heredoc bodies; the guard `check-lua-shadow.py`. Run report
> `testcases/reports/2026-11-01_conan-pickup-prompt-evening.md`. ❓ interview #030 (arrows into the corpse's loot) waits for the owner. Mockups 8–9 (own colour picker,
> own key capture; refusal «Эта клавиша уже занята» by `[OWNER]` 23:34) — review folder 57. **IN FLIGHT 23:3x:** the kit rebuilt with the Damage Meter page rows
> (`scratchpad/kitout/KrinikConanUI.pak`, 10 000 867 B, not yet copied into `_unpacked`), the Damage Meter adapter in `krinik_mod_settings.lua` (read the slot,
> write through the author's window, `[NOT-TESTED]`) — cases D1–D4 of `TC_conan_hub_rows_audit_2026-11-01.md`. Review folders for the owner: 54, 55 (taken: 6), 56, 57.
> **Handover written 2026-11-01 23:41 by a PREMATURE /end-chat-force (the window was 68–70 %, not at its limit — `[OWNER]` 23:43 «ты опять слишком рано чат закрыл» ·
> «И ХУК ИСПРАВЬ»; the gate is in `.claude/hooks/context-budget.mjs` now); the chat CONTINUES in the dayloop. The work order stands:**
> 1. **The owner's debt — interview #030 answered 23:41:** arrows stuck in a corpse go into its loot (steps in «Awaiting human review» above). The arrows already
>    stay in the corpse (pack `15a7c82`); nothing of the loot part is built.
> 2. Plan 40.3 D1–D4 — the Damage Meter page: the kit is rebuilt with its rows and deployed (pack, `_unpacked/KrinikConanUI/KrinikConanUI.pak` 10 000 867 B,
>    UNCOMMITTED — the pak is git-ignored, nothing to commit), the adapter is in `krinik_mod_settings.lua` (`[NOT-TESTED]`). The Xevyr hub cannot be opened by the
>    remote (`_G.__krinik_hub` lives in KrinikConanUI's own Lua state — EXP-0438): switch the list's «Моды Xevyr'а» entry to `hub = "xevyr"` for a test, or a shared variable.
> **NOW (chat of 2026-11-02 from 07:17, dayloop by `[OWNER]` 07:21 «работай над сборкой Конана автономно»):** the left-list seam FIXED (L0–L2); the
> owner's 07:20–07:23 decisions on mockups 8–9 applied (palette and busy-key refusal as popups over the window, «Принять», no accepted-key caption — folder 57
> re-shot, plan 40 I6.2). **Plan 40 I6.3 DONE 07:56:** the Xevyr hub has all five pages (Al-Merayah 13 rows, Lore & Loot 3, Proximity Party 4, Simple Minimap 6,
> Damage Meter 8), each reading and writing the author's own values — X1–X8 pass (report `2026-11-02_conan-hub-xevyr-four-pages.md`; kit pak 10 583 661 B in
> `_unpacked/KrinikConanUI/`, git-ignored). NEXT: I6.2 — the colour popup and the key capture (operational steps written in plan 40), then the list's
> «Моды Xevyr'а» entry → the hub (it stays a sub-list until the colour and key rows exist).
> 3. The owner's eye waits on review folders 54 (prompt in game), 56 (arrows in a corpse + the enemy bar beside «E Взять»), 57 (mockups 8–9).
>    **Shown 2026-11-02 07:19 +03:00** (Explorer, all three); their notes corrected first: 56 — the answered loot question removed; 54 — «игра открыта» removed, the gap note added (frames predate variant 3). Verdicts not given yet.
> ⚠️ Закрытие 23:41 было преждевременным, чат продолжается; церемонии закрытия (проход судьи, обрезка STATUS, README, линтеры витрины) — при настоящем закрытии.
> Ложных утверждений на месте не осталось: «калька» в уроке и «вытянуть стрелу нельзя» в кейсе A9, интервью, конспекте и плане исправлены там, где стояли.
> **CHAT c5fe291c CLOSED 2026-11-01 21:57 +03:00 (soft; `[OWNER]` 21:55 «и в новом чате продолжим делать сборку»). FIRST in the next chat, in order:**
> 1. Restart the game when the owner is out of it (the backing-only-under-the-word layout of `ac31b3a` loads at start), then his verdict on «E Взять» (stones at his feet with the camera above; fade; backing 0.35); then the prompt's A-B flight (rule 7) and the
>    enemy health bar sitting where the prompt sits (`plans/42_conan_pickup_prompt_foliage.md` → Next steps; report `testcases/reports/2026-11-01_conan-pickup-prompt.md`).
> 2. Plan 40.3 I6 — the Xevyr pages with real rows, own colour and key controls (variant A, `[OWNER]` 20:37); the steps I6.1–I6.4 are written in
>    `plans/40_epic40_phase3_inventory_button_list.md`; read `researches/conan-mod-settings-hub/xevyr-settings-recon.md` «Hard to bind» first.
> 3. Plan 40 phase 4 — arrows stay in the corpse (`/bug-research` first). Then epic 40 phases 5–7 and epic 41 (8 phases, none started) — 16 blocks to 1.0.0
>    counted at 21:55 (the list said to the owner in chat).
> Review folders waiting for the owner: 51 (Xevyr page look — variant A chosen, the look itself not answered), 52 (logo tone), 53 (prompt mockup — taken).
> Never in the owner's running game: a sweep of native calls over enum values (EXP-0433); a desktop recording while the game is not in front (EXP-0431).
> **Frame measurements are free now** (the «кино» condition erased 08:46): the unrun cases of `testcases/TC_conan_3.0.1_ru_fps_perf_2026-10-25.md` (PF1, BN1–BN4, BN7–BN9 and 7 more — the bench flights, `_config/bench-flight.sh` / `bench-batch.sh`, A-B-A-B pairs) and plan 36 item 23 (q2–q4) — the agent runs them itself, ≈ 2–3 h; a heavy block for a fresh chat.
> **2026-11-01 08:58 — RELEASE 1.0.0 TONIGHT (2026-11-01 evening)** — `[OWNER]` 2026-11-01 08:58 «делаем сейчас 2, а 3 делаем в новой версии сборки. систему афиксов я ОЧЕНЬ ОЧЕНЬ ОЧЕНЬ ХОЧУ, но сейчас делать если возьмемся - это нахуй еще на неделю затянет работу над 1.0.0 - а выпустить релиз хочется уже сегодня вечером, а сейчас 9 утра сегодня». Order for the next chat: the release blockers first — the hub remarks (0), the caverns chests by option 2 (interview #029 answered; notes `games/ConanExiles/mods/CavernsOfSet.md` → Decision), plan 35 item 6 (archive on a clean game, volumes ≤ 700 MB), the README-PDF, the 1.0.0 release on the public repo. **ALSO BEFORE THE RELEASE, IN 1.0.0** (`[OWNER]` 2026-11-01 09:01 «ДО ВЫПУСКА, ЭТО ВСЕ ИДЕТ В ВЕРСИЮ 1.0.0» — about this list): the inventory button «Настройки модов» (plan 38 phase 1); the hub row «how long an enemy shout stays on screen»; the video of every food / water blink intensity; the English «All» and «Top Left» in two mods' dropdowns (bug 64 items 47, 49 — the `lit:` route of item 48); the third-person stone pickup — SPAWN the stone and test (R2); the frame measurements (fps perf TC, plan 36 item 23); **09:11 added:** arrows stay stuck in
the ragdoll corpse and can be picked up (KrinikConanArchery — notes `games/ConanExiles/mods/KrinikConanArchery.md` → Open, the cause already known). `[AI]` affixes (idea 24) stay in the NEXT version by the owner's own word of 08:58 «3 делаем в новой версии сборки»; confirmed 09:01 «афиксы в новой версии». Affixes (random item properties) — the next build version, `ideas/24_conan_loot_affixes_next_version.md`.
> **ORDER (`[OWNER]` 2026-11-01 11:11–11:12 «да не нужно архив собирать!! Сборка же еще не готова!!» · «релизный архив соберем и все документы обновим,
> когда сборку сделаем и протестируем на всех разрешениях 16 к 9»):** the release archive and the document refresh go LAST — after the build is finished and
> tested at 720p / 1080p / 2K / 4K. The 11:10 archive run was stopped and its 16 GB removed; `make_volumes.sh` waits for that moment.
> - **Earlier FIRST list (still valid):** (2) Item 28 step 2 — `install.cmd` on a copy of the game without mods, `-Verify`, world entry. (3) The remaining unrun cases of
>   `TC_conan_build_stability_compat_perf_2026-10-26.md` (U4–U6, C1–C3 …) — one launch each, frame + log. (4) W20 mod settings windows — mock-ups first (taste).
>   (5) The release gate at 720p / 1080p / 2K / 4K (rule 17). (6) Item 21 — a vanilla quick-bar frame needs a clean-game stand (also for q4).
> - **Waiting for the owner:** the crash-report README.
> - Work trees kept: `_paksview-3.0.1` (66 GB) and `Conan Exiles Mods/_text-extract-3.0.1` (20 GB) — rule 15. Outward: watch https://github.com/Arora-Sir/Super-Artemis/issues/3.
>
> **PARKED 2026-10-29 21:07 — Svarog (the far shelf, not raised at entry):** the 21:02 session took it up for four minutes: saves copied
> (`SvarogsDream/_backups/svarog-saves-2026-10-29_2103-before-debt024`), configs snapped (`_harness/cfg_snap`, 21:04), the 13:43 build `f44c36e` hot-deployed
> into the game WITHOUT a run (test debt waived with this reason), cases written — `testcases/TC_svarog_debt024_tails_2026-10-29.md`. Return order: interview #024
> tails (S10c/R1 tooltip gap, CD1 skill-slot digit, `InstantTranslate` of bugs 56/57 — the run report `testcases/reports/2026-10-18_svarog-day-buff-strip-passes1-5.md`
> is partial), then the bug wave 55–62 by plan 32.
>
> **2026-10-29 10:2x — THE OWNER'S WORK ORDER (read first): `plans/36_…` → "The owner's work order 2026-10-29", W1–W16 — the table holds each item's
> state.** Only those items are worked; any other debt of the build is asked first. The day's done list — chronicle, entry 2026-10-29 18:43.
>
> **Conan build debts — plan 36 (`plans/36_conan_build_debts_plans.md`, since 2026-10-26 20:14):** 35 items with hours, done
> in a row (`[OWNER]` «пот по ним пиши планы» · «и по планам делаем»). Each item's status — in the plan's "Queue" table.
>
> Conan session rules (hours, other mods natively, the settings reference after exit) — `HOUSE_RULES.md` §1; the former "New chat order" 17:40 — chronicle, entry 2026-10-27 00:13.
> 0. **The Conan 3.0.1 build towards release 1.0.0 — plan 35 (`plans/35_conan_build_turnkey_quality.md`).** The owner's decisions of 26.10 evening (plan 35: G5,
>    G7, G10–G12, B3, B4, B7): version 1.0.0; archive — volumes ≤ 700 MB (8 paks over 700 MB → multi-volume 7-Zip zip `-tzip -mx0 -v700m`, G10); README
>    for PlayGround — a PDF on «выцветшей старинной бумаге», pages 1–2 for the storefront, thanks to Taurin78 in the fixes (G11); crafting in the inventory
>    while paused — speed up (G12); hub — no flicker and no jumps (B4). The owner's order: tech debts → translation → a run through the world → volumes and README.
>    Done 26.10 16:54–19:40 (T2b, M2, H9, U7, LM1, S1e) — chronicle, entry 2026-10-27 00:13.
>    **Next, in order (hours):** (1) Ragnar's New Factions — DONE 2026-10-29 (KRINIK MODIFIED: the 4 smelter rows and the dead Zingaran boss row
>    removed from `RNF_Shared_WeightedSpawns`, manifest `krinikBuild`; checked 2026-10-30 23:5x — this line was stale);
>    (2) G12 crafting: one real craft of «Бечевка» with the hub open (the remote does not start a craft — case P1), measure, enable `CRAFT_SPEEDUP` — ≈ 1 h;
>    (3) B4: the same hub recording on a game without paks (reference), the late emblem (bugs/64 item 26), splitting by pak — ≈ 2–3 h; B7: the fishing button
>    to Hosav and its look (inserts `BPC_EFT_Tuning.Graft` into `ButtonContainerRight`) — ≈ 2 h; (4) bugs/64 item 21 the Damage Meter slider, item 23 EAA
>    class cards (text painted in textures) — ≈ 2–4 h; (5) mod cost q4 A-B-A-B — ≈ 1–2 h; (6) archive on a clean game and volumes — ≈ 1–2 h;
>    (7) README-PDF — after 1–6. Instruments: `close-game.ps1` and `long-run.sh` close `CrashReportClient` themselves after a crash — DONE (both call
>    `close-crash-reporter.ps1`; checked 2026-10-31 19:0x — this line was stale). Wait for the owner: interview #025 (ambush frequency; the `rawf:` instrument is ready), «table» on the fish card.
> 1. **Conan, main stream — the measurement queue** (`[OWNER]` «Замеры ручек подгрузки … Ветка появления NPC … Эталон на чистой игре без паков модов» ·
>    «можно начинать их грузить дальше по дистанции, но больше кадров выделять. У меня много врам и рам»): batches in `ConanExiles/_config/bench-batches/`
>    (README — the before/after order of each): q1 (on the fly) done 02:18 — the streaming budget and the 8 GB texture pool are within noise, «без ткани» refuted by
>    repeating q3b (40 vs 36); flight noise 36–52 stutters — only A-B-A-B pairs decide (EXP-0335). Next q2 `s.AsyncPostLoadEnabled`,
>    q3 `p.Chaos.EnableAsyncInitBody`, q4 without the mod paks. Analysis — `researches/conan-main-thread/README.md` §3–4.
> 2. **Plan 34 — rewrite our Conan mods** (`plans/34_conan_mods_cpu_respect.md`): by the Unliminium rules — events instead of polling, a shared
>    `KrinikCore` registry, a per-frame budget, self-measurement; mod cost now ≈ 0.4 ms, UE4SS hooks ≈ 0. The choice of path (step 3) — the owner's, with numbers.
> 3. Open since 25.10: the HUD outline is sharp by 2 pixels (`KrinikHudOutline`, not started); the AMR, Emberlight, Pickup+, Horti windows do not open
>    by a bare `ActivateModule` (Lore & Loot `LLH_Settings` DOES since 2026-10-31 16:15 — report `2026-10-31_conan-mod-windows-u4-u6.md`) — open them by the player's path; compatibility `ConanExiles/docs/17` (missing packages, Ancient Civ vs TDI, item
>    51420); DLSS scale 0.58 — show the owner.
>
> The Conan 3.0.1 build — 64 paks + 8 Lua mods, everything mounts (plan 33; the former "PARKED ORDER" — chronicle, 2026-10-25 22:15).
> **Svarog — return order** (the far shelf since 2026-10-29 21:07, see PARKED above): interview #024 answers (Q3 digit lower, Q4 strip order and
> bright passives — built 2026-10-18 09:14, run in game 13:00–13:35 the same day, partial; correction 2026-10-29: "never run in game" stood here wrongly); 00000 — the owner's bug wave 2026-10-18 (plan 32, bugs 55–62, the ⇅ button; chronicle 2026-10-26 19:38);
> 0000–000 — the items of 17.10 (J4, J5, G1, pop-ups, hair, storages, tips, frames, HUD C3/C4/K1; chronicle 2026-10-25 12:07); 00 — plan 27
> (`plans/27_svarog_random_hero_traits.md`: fixes 8–10 of `AuthorBugs.cs` in combat, case R8; the "New hero" window, "Veles' Protection", Staggered, attribute > 95 → 90).
> Svarog — CPU budget, run order, the MVP jump decision: chronicle, entry 2026-10-27 21:08 (moved verbatim).

## Open bugs

Files without the DONE tag — 29 (2026-10-18 13:45):

- 🔴 `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` — the UI of the Conan 3.0.1 build's mods, 26 items: open 4, 5, 6, 12, 13 (partly),
  15–18, 21 (Damage Meter slider), 23 (EAA class cards — text in textures), 26 (late emblem in the hub); closed by a frame 2, 3, 7, 7b, 8 (again 2026-10-31 at 1080p, list 540), 9–11,
  14, 16, 19, 20, 22, 24, 25 — work order in plan 35.
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
