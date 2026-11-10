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

- ❓ **2026-11-10 12:49 +03:00 — the look of the corruption «+» hover label (bug 91), the owner's pick of four** — review folder `НА ОТСМОТР НИКОЛАЕМ/81_podpis_oskverneniya`
  (`chto_smotret.md`; mockup `ConanExiles/_config/mockups/corruption_label_mockup.py`): V1 a plate above the diamond · V2 under it · V3 the game's place with a plate ·
  V4 no label. To show him when he is free (he was at the keyboard at 12:5x); then the kit edit of `W_Attribute`'s `CorruptionLabel` branch.

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

> **NOW 2026-11-10 12:38 +03:00 — chat of 2026-11-10 midday («продолжаем делать Конана», dayloop by the owner's 11:29 order).** Plan 49 steps 2–5 DONE and seen live: placeholder
> perks `Krinik_Vitality_25/30/35/40` (KrinikConanUI `DT_KrinikPerks` merged into `PerksTable`), the pips follow the row's page (Lua `krinik_attr_pips`, post callback
> of the native `AttributeEntry:UpdatePipIcons`; EXP-0504), the right perk column scrolls (`SB_KrinikPerkScroll`); the arrows' owed checks D1 / D2 / M1 by real clicks,
> frames at 1080p / 2K / 720p — report `testcases/reports/2026-11-10_conan-placeholder-perks-pages.md`. Judge: 3 rounds (the 3rd — no confirmed defect). Pushed: pack
> `4c5548e` (mod) + `e57403d` (guide line, PDF, build-docs waits for Chrome). Bug 91 REPRODUCED by a real hover (the row's own `CorruptionLabel`, no plate; recon
> in the bug) — NEXT: the control case (vanilla `W_Attribute`), then variants of the label's look for the owner (taste class). Then the wheel over a row (kit refuses
> the nodes); the column's bar look → the owner's eye. The game runs (background, launch 12:41, the agent's run; lock to 13:03).
> **HANDOVER 2026-11-10 11:17 +03:00 — chat closed by the owner («закрывай чат, продолжим в новом»); FORCE-closed at 85 %: the bonsai trim of STATUS was NOT done (debt for the
> next /end-chat-soft).** Game closed, no lock, no crash window; pushed KUMM and pack `c6afcc9`; the owner ordered «работай автономно» (11:04).
> **FIRST next chat:** (1) plan 49 step 2 owed checks — a click on a DIM arrow, an arrow click on a MIDDLE row, frames at 1080p / 2K / 720p; (2) the owner's 10:28 order —
> placeholder perks 21–40 (our `DT_KrinikPerks`, row struct `PerksTableRow`, merged into `/Game/Systems/Perks/PerksTable` by `MergeDataTables`), pips per page, the right
> column scrolls (plan 49 steps 2–5); (3) bug 91. Kit scripts: `kit-attribute-paging-step2.py` → `kit-attribute-paging-look.py` (each TWICE) → `kit-buildmod.py`.
> **NOW 2026-11-10 09:4x +03:00 — chat of 2026-11-10 morning («продолжаем делать сборку конана»).**
>   - **Bug 84 — the trait dialog under the attribute tree FIXED and seen (pack `ba5b348`):** reproduced by ten real «+» clicks; cause OURS — `krinik_hub_controller`
>     added its pages at Z-order 41 over the game's modal (all hub modules and `PerkSelection` are Z 40); now 40 → the dialog on top (T2 pass). The owner's «map without
>     tabs» NOT reproduced (Tab, Q, M — M opens the hub on «Карта» with tabs). TC `TC_conan_bug84_player_path_2026-11-10.md`; bug 84 stays 🟡 for the map.
>   - **Plan 49 step 2 LIVE (pack `ba5b348`):** arrows ‹ › and «21–40» on rows past 20, pips hidden past page 0 — S1, S2, S4 pass; the wheel NOT built (kit refuses the
>     nodes, routes in plan 49); one judge round, findings verified (commit message). **The LOOK — mockup V8 ACCEPTED 10:27** («макет принят, делаем в игре,
>     шикарно!»): the full spec with numbers is in plan 49. **BUILT 10:52 and seen on a 4K frame** (`kit-attribute-paging-look.py`, textures
>     `T_KrinikPageArrow*`, left / right numbers justified by the owner's 10:46 word) — the judge round on the look script runs; NEXT: frames at 1080p / 2K / 720p,
>     the disabled-arrow click check, then the owner's 10:28 order (placeholder perks 21–40, pips per page, the right column scrolls — plan 49 steps 2–5); the wheel.
>   - Bug 92 DONE (HUD bars magenta again, pack `3ac94a4`); bug 91 OPEN (the corruption «+» hover label) — after the arrows.
>   - 11:00–11:07 the owner: numbers «слишком тяжелый вес, на -200» → the outline removed (plain PT Serif Regular); «цвет больше в бронзу» → (200, 135, 70) — rebuild
>     running at 11:08 (`kit-attribute-paging-look.py`, frame to show). 11:01 «СВАЛКА на рабочем столе» — 11 «KUMM fixture» shortcuts from the night's stand runs:
>     FIXED (KUMM `42ee2b8`: `KUMM_DESKTOP_DIR`, the stand checks the real desktop stays clean; EXP-0503). 11:04 «работай автономно» → dayloop after this cut.
> **2026-11-10 02:25 +03:00 — chat of 2026-11-10 night (dayloop, the owner's order: the Conan build 1.0.0 backlog, autonomously).**
>   - DONE: the rulebook cleaned of the owner's raw voice (AGENT_GUIDE, HOUSE_RULES, CLAUDE.md; verbatim → PROJECT_HISTORY entries 2026-11-10 01:52 / 01:55),
>     the guard `tools/hooks/guide-no-raw-voice.mjs` (PreToolUse, live refusal seen; `--staged` in pre-commit), KAIF #196; the canon rules «code goes to an independent
>     judge in rounds» and «the guide is a thesis handbook» (AGENT_GUIDE → Notes from the human). Reports `testcases/reports/2026-11-10_guide-no-raw-voice.md`.
>   - DONE: item 1 of the handover below — `KrinikConanEngineTweaks` has its own manifest entry; KUMM merges a mod's `engineIni` part by section
>     (`Deploy-ModPack.ps1`, `-EngineIniOut`, `-Verify` per key; fixture 47/47); the pack's `deploy-config.py` takes Engine.ini from the engine; deployed 02:17, the real
>     `-Verify` clean; the guide (+ Locomotion and EngineTweaks rows, PDF rebuilt) and `README.draft.md` (mods-table, 9 Krinik mods). Report
>     `testcases/reports/2026-11-10_engine-ini-mod-parts-merge.md`. Not re-read in a running game (the keys are those read live 2026-11-09 22:07).
>   - Committed and pushed: KUMM `aa37127` (rulebook + guard), `1b54d81` (the ini merge, 4 judge rounds); pack `a451ad5`. The running game read the merged Engine.ini
>     (02:33: async gathering true, both cvars set).
>   - NEXT: item 2 below (plan 49 B2) — route A is viable: the kit's Python has `BlueprintGraphEditor` (call-function / branch / variable get-set / bound-event nodes,
>     pin links; `_config/devkit/kit-probe-bp-graph-api.json`). DONE in the kit 02:55: step 1 — `_config/devkit/kit-attribute-paging-edit.py` added the int member `Page`
>     and wired `FullValue − Page × MaxAttributePointAllotment` into `UpdateView` (read back, compiles, saved into the kit's `Mods/KrinikConanUI/Content/UI/Inventory/
>     Attributes/W_Attribute.uasset`; no other build mod ships `W_Attribute` — `mod-overrides.py`). 03:0x built (`CookInfo` line, 0 missing refs), deployed, LIVE PASS
>     (TC `TC_conan_attribute_paging_step1_2026-11-10.md`: `Page` 1 → 25 shows 5 of 20, 39 → 19 of 20; `Page` 0 → vanilla). Every row lives twice among the live
>     widgets (bug 84?). Committed: pack `fca1f0c`, `28ed7a5`; KUMM `afe21fc`…`62da686`. Step 2 is DESIGNED in plan 49 (arrows = Buttons with bound OnClicked like the
>     game's «+», `UpdateView` reuse, visibility past 20, pips re-placed in `PostPipsPlacedOnCanvas` by X = (req − 20p) / 20 × 858.2 — read live 03:10).
>     The step-2 recon is COMPLETE (03:12–03:15, all nothing-saved probes): `add_component_bound_event_node` refuses widgets → the click goes by
>     `create_node_from_name("Кнопка|Событие|AssignOnClicked", pos, [<button getter pin>])` in `Construct`; the wheel by `add_function_override(bp, "OnMouseWheel")`.
>     NEXT: build step 2 in `kit-attribute-paging-edit.py` (a step-2 section: the two Buttons + label by `new_object` into `Progress`, run TWICE — GUID trap; the
>     click and wheel handlers; the visibility past 20; the pips' X in `PostPipsPlacedOnCanvas`), judge rounds, build, live cases; then items 3, 4.
>     Slip of 03:09: a short game run without the voice phrase (rule 13).
>   - **Bug 84 (the owner's top debt) REPRODUCED 03:20:** open → close → open of the attribute module by `ActivateModule` leaves TWO live `W_Attributes` windows
>     (12 visible rows; `_config/attr-rows-owners.lua`). Control 03:22: with `krinik_hub_controller` off the remote path STILL stacks two windows — the game's on
>     that path. FIRST next: the player's path (Tab / hub tab keys, real input, front, owner-idle FREE) with and without our controller; then the cause fix.
> **HANDOVER 2026-11-09 22:45 +03:00 — chat kumm-2d closed by the owner («закрывай чат»).** The game (launch 22:06, front) is the OWNER's — he plays in it; no machine lock held;
>   KCCP closed its chat. Pushed: KUMM and the pack (`conan-exiles-modpack`). Report of the evening: N1 found by the profiler and SHIPPED in the new mod.
>   **FIRST next chat (in order):**
>   1. `KrinikConanEngineTweaks` into the guide (`ConanExiles/docs/guide/guide-3.0.1.html`) and the README mod list (HOUSE_RULES rule 20 · rule 19: Krinik mods at the top);
>      then the deploy merge of several ini sources (KUMM `Deploy-ModPack.ps1` `engineIni` + a `tools/fixture-pack.mjs` case) so the mod ships its own file.
>   2. Plan 49 B2 (the owner's pick): the kit edit of `W_Attribute` — `Page` var, the `UpdateView` shift, arrows, pips re-placed in `PostPipsPlacedOnCanvas` (recon in the plan).
>   3. Sprint + bow: `sprint-run-probe.lua` with the bow in slot 1 (`InpActEvt_Shortcut0_…_25`), `_G.__srp_draw=true` → is `K2_CanSprint` the refusal.
>   4. FUTURE (the owner 22:05): the streaming-in work of the remaining hitches — research doc «Future»; the light probe only.
>   Traps of this chat: the voice is Cyrillic words only («Кей Ю Эм Эм», numbers in words — hook from this chat on); `close-game.ps1` may leave the game after 60 s — stop
>   own PID; the game drops ini comments on exit; the heavy ETW probe distorts — `hitch-trace-light.ps1` only.
>   - The detail bullets of this handover (A1, the profiler, N1, the log pair, the new mod, REA, the light probe) — moved verbatim to the chronicle, entry 2026-11-10 (bonsai trim).
> **Moved verbatim to the chronicle (entry 2026-11-09 22:44 +03:00):** the HANDOVER 2026-11-09 18:43 block (the quick-wins order of the first chat of 2026-11-09).
> **Moved verbatim to the chronicle (entry 2026-11-09 18:43 +03:00):** the blocks DONE plan 51 of 2026-11-09 16:43 and HANDOVER 2026-11-09 02:02.
> **Moved verbatim to the chronicle (entry 2026-11-09 02:02 +03:00):** the blocks NOW of 2026-11-08 22:58, DONE / IN FLIGHT of the night and HANDOVER of 2026-11-08 at 14.52.
> **Moved verbatim to the chronicle (entry 2026-11-08 14:52 +03:00):** SIDE TASK nfsu2, HANDOVER 2026-11-07 23:03, items 0 / 0b / 0c and the NOW block of 2026-11-08.
> **Moved verbatim to the chronicle (entry 2026-11-09 22:45 +03:00):** the owner's order of 2026-11-07 20:50 (FIRST NEXT CHAT: sprint + bow, attributes past 20) and THE OWNER'S QUEUE 19:48–20:00. Still open from them: bug 84 (the hub duplicates pages / the fullscreen map twice) · the lore stones' «E Читать» plate · grainy shadow on sand rocks · speckles on the oasis water · black far cave mouths (unfogged) · the bright SSR streak behind palm trunks · the rain from a small cloud over the hero (old debt, `plans/04_conan_ochered_zakazov.md`) · `_bench` 9.4 GB of old recordings waits for his «да»; sprint + bow and attribute paging — in the handover above.
> **Blocks moved verbatim to the chronicle (entry 2026-11-07 19:28 +03:00):** the bug 67 handover blocks of 2026-11-07 14:47–19:19 (the bug is DONE) and the chat blocks of 2026-11-06 (fifth) … 2026-11-07 (second) (forced closures 09:46 and 12:43, the hub controller v4–v10, the dayloops of 06:24 / 10:12, the UPDATE lists). Still open from them: the hub controller player path with the game in FRONT; the minimap helper «Свои маркеры» click on our map; quick-loot R3 (last cell of a row); plan 45 step 4+ (boss / elite spawns); KrinikConanMusic M7 with bug 79 cases; mod windows of `_config/compat/ui-overflow-candidates.tsv`; the guide’s 1.0.0 list.
> **The blocks of the 2026-11-06 chats 1-4 (forced closures of the third and the fourth, the q8 correction, the dayloops of 09:05, 12:46, 19:20, bug 67, the music mod, interview #034, plan 45 steps 1-3, Nexus quarantine) - moved verbatim to the chronicle, entry 2026-11-07 00:33 +03:00.** Still open from them: plan 45 step 4 onward (boss / elite spawns) and kinds 8-12; bug 67 palm shadows (re-shoot with hdr.ps1 off + SetTimeOfDay; build stays 2.0/-1.0); KrinikConanMusic death scene M7 with bug 79 cases (respawn, dungeon, waystone); q8 Nanite B data; G4 boss ghost by the thrall conversion path; Nexus ticket 276571 follow-up letter (the owner sends it); Northern Timber - the owner decides.
> **The 2026-11-03 chat blocks (cb012770, ce994c74, the 1.0.0 resume of 19:51, the Nexus publication of 19:05) and the 0.9.0 release pointers — moved verbatim to the chronicle, entry 2026-11-06 12:34 +03:00.** Still open from them: nest eggs (bug 82), a real E over a corpse in a bush (bug 80), the rim on F done properly (bug 75), the rest of the guide's 1.0.0 list; Nexus — ticket 276571.
> **Older pointer blocks (2026-10-26 … 2026-11-02: chat FIRST lists, the 1.0.0 orders, plan 35/36/34 queues, the measurement queue) — moved verbatim to the chronicle, entry 2026-11-03 20:58 +03:00 (second part).** The live backlog: the guide chapter «Известные проблемы и планы на 1.0.0», epics `plans/40_…` and `plans/41_…`, `plans/36_…` (W table), `plans/35_…`, `plans/34_…`; work trees `_paksview-3.0.1` (66 GB) and `Conan Exiles Mods/_text-extract-3.0.1` (20 GB) stay.

## Open bugs

Files without the DONE tag — 29 (2026-10-18 13:45):

- 🔴 `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` — the UI of the Conan 3.0.1 build's mods, 26 items: open 4, 5, 6, 12, 13 (partly),
  15 (🟡 hub controller in the build), 16–18, 23 (EAA class cards — text in textures), 26 (late emblem in the hub); closed by a frame 2, 3, 7, 21 (4K, 2026-11-07), 7b, 8 (again 2026-10-31 at 1080p, list 540), 9–11,
  14, 16, 19, 20, 22, 24, 25 — work order in plan 35.
- 🔧 `bugs/85_conan_crash_keybind_lua_races_game_thread.md` — the bow-kill crash: cause fixed in Archery + Camera; the KrinikConanUI twins open; the owner's gameplay is the check.
- 🔴 `bugs/89_conan_water_reflection_flicker.md` — 2026-11-09 15:45, the owner's frame at `river_bend`: dark dashes / grain blinking over the water, «как тени листвы пальм»; after plan 51.
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
