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
21 checks since 2026-10-28 — a new pak's place under `-Only`; all 21 passed on 2026-10-28). Not covered yet: the live Nexus path (Chrome) — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🟡 in progress | 2026-10-14: four regression tests of the pure core + launch guard + fixture stand; 2026-10-15: the stand deploys and runs `-Verify` (20 checks, bug 46 DONE); left — Engine.ini warning |
| Phase 2 — the second game | 🟢 **proven on Conan** | the engine took Conan Exiles Enhanced **without a single edit**: slug `conanexilesenhanced` from the manifest, `game_id` from the page. Oblivion Remastered stays prepared (manifest of 168 mods), waits for its patch |
| Phase 3 — compatibility | 🔲 todo | the conflict source is found: `UnrealPak -List` from the Dev Kit reads any Oodle pak (`researches/conan-devkit/`); the work — phase 3 of epic `plans/06` |
| Phase 4 — optimization presets | 🔲 todo | |

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

> Tasks the agent can do FULLY autonomously: write code → build → test on the harness → fix → commit,
> without the human and without resources only the human can provide. The loop skills
> (`/autoloop`, `/dayloop`, `/nightloop`) grind this pool.

- Done pool items (launch guard, archive-name round trip, `pickCard` cases, the `help` command, the 20-check fixture pack) — chronicle,
  entries 2026-10-14 23:22 and 2026-10-16 23:39.
- [ ] **Warn when a mod overrides `Engine.ini` at runtime** — both ailments of 21.08 were invisible to the engine:
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

> **UPDATE 2026-10-30 14:34 (chat b46b10e8):** W32 `KrinikConanGameplay` DONE (pack `2daa084`, G1–G6 pass). **Mod notes are a lock now** (the owner
> ≈14:25: «КАИФ ДОЛЖЕН ТЕБЯ ОБЯЗЫВАТЬ ДОКУМЕНТИРОВАТЬ ТВОИ ЗНАНИЯ!!!»): one file per mod `games/ConanExiles/mods/<Mod>.md` — the knowledge-hook refuses
> extracting/tracing/editing/deploying a mod until its notes are read in the session (own tool call); first notes — `UIMod_Hosav.md`; KAIF #186.
> **15:10 — EPIC «Настройки модов» FIRST** (`[OWNER]` ≈15:00 «с начало это, затем по твоему плану выше»): `plans/38_EPIC_conan_mod_settings_hub.md`
> (6 criteria, phases 0–5), research `researches/conan-mod-settings-hub/` (README; `vanilla-settings-widgets.md`; `web-sweep.md` — a helper was still
> writing it at 15:10: merge its findings into README §3–4 when it lands). **Phase 0 spike** (`plans/38_epic38_phase0_widget_spike.md`, report
> `testcases/reports/2026-10-30_conan-settings-hub-spike.md`): the game's own rows (`WBP_Setting_Checkbox`, `WBP_Setting_Dropdown`, `W_EditableLabeledSlider`,
> `WBP_Settings_Subheader`) are created from Lua and take values; a REAL click does not reach a created checkbox (3 placements). Next: S5 the slider drag;
> then rows inside a module window (our WindowRoot widget in the KrinikConanUI kit + a module row); set the subheader's `Label` before adding.
> Then the quick list below. `mouse-seq.ps1` has `move:<fx>/<fy>` now.
>
> **14:57:** W36 HUD blink DONE in game (pack `4fae579`, H1–H10): Hosav's speed 0.30 + section `KrinikConanUI:HudBlink` (partial-curve PingPong — the
> 14:34 plan «threshold patch + RenderOpacity» was replaced, correction). W34 Harness DONE: dev-only entry `"export": false`. Owner's dayloop order ≈14:37
> («Гоу, работай автономно» · «делаем сборку Конана»). Engine.ini CPU recon runs in a helper → `researches/conan-engine-ini-cpu/README.md`.
> **Next (quick first):** the guide's exclusive-mods section for the five-mod set; W6 corpse prompt on two lines; W10a quick-loot jump; W18a captions;
> W4 minimap coordinates; W11 mod list; then W13/W30 arrows, W29 shouts, G3/G4. Notes for every mod the work touches (the lock demands it).
>
> **UPDATE 2026-10-30 14:15 (chat b46b10e8):** done — W33 translation entry renamed (pack `d55a59e`); W35 the player README «Если игра упала — как
> прислать отчёт» + guide section, reports go to the author's e-mail or PlayGround profile (the owner 14:04–14:05; the section goes LARGE on page 2 of
> the manual — plan 35 Г11 item 5), texts wait for his read-through; W31 `KrinikConanUI` (pak + four Lua sections) live run U1–U8 pass (pack
> `cdc5e46`); engine: `-Only` drops a modlist line whose pak is gone. **Next: W32 `KrinikConanGameplay`** (Locomotion + LevelUncapped, same pattern:
> kit mod + Lua sections; LevelUncapped's tables must stay LAST in the load order), then W34 the Harness dev-only entry, the guide's exclusive-mods
> section rewritten for the five-mod set. The save was restored to my 14:10 copy after the run; the owner's 13:07 «верни» question still open.
> The old kit mod folders (`Content/Mods/KrinikUIFixes`, `Saved/Mods/KrinikUIFixes`, 42 files) removed file by file 14:16 — the rebuild is `kit-conanui-edit.py`.
>
> **HANDOVER 2026-10-30 13:07 (chat 759898d5 closed by the owner: «этот чат можешь закрывать, продолжить делать сборку в новом чате»).**
> **13:08 fact: the game was closed (save written 13:07, no new crash), my machine lock released; `Game_0.db` DIFFERS from the 12:05 copy — NOT
> restored (the owner may have played); the restore waits for his word.** Was: **the game may still be open from my 12:55 run** (god ON by `_config/god-on.sh`; the owner stopped my in-game
> step at 12:59 and looked at it — his game now). Ask nothing, check: `tasklist | grep -i ConanSandbox`; if it runs, it is his — leave it; when it is
> closed, compare `Saved/Game_0.db` with `Conan Exiles Mods/_save-backup/2026-10-30_1205-before-blood-run/Game_0.db` and tell him whether his hero
> state differs (my runs gave XP and wounds; every earlier launch was restored). Release my machine lock if still held:
> `node D:/work/ai_sandbox/_tools/machine-lock.mjs release --who kumm`.
> Then, in order (plan 36 rows): (1) **W34/W31–W33 — the owner's Krinik mod set** (five shipped mods + `KrinikConanHarness` NOT shipped, his word):
> W31 `KrinikUIFixes` → `KrinikConanUI` with FpsCounter, HudOutline, PauseGameInMenu as Lua sections (a kit rebuild — the name is inside the pak);
> W32 `KrinikConanGameplay` = Locomotion + LevelUncapped (keep LevelUncapped LAST in the load order); W33 the translation entry name; the Harness
> as a dev-only manifest entry `-Export` leaves out. (2) **W35 player report** — the script is fixed and tested; write the Russian README
> «Если игра упала — как прислать отчёт» + a guide section, show the owner. (3) **KrinikConanGraphics G3/G4** — the cap evicting the oldest stain
> is NOT run in game; the cost per stain must be measured as 1000 calls / 1000 (`os.clock` steps 1 ms) — the owner: «моды должны быть УВАЖИТЕЛЬНЫМИ
> К ГЛАВНОМУ ПОТОКУ»; cases G3, G4 in `testcases/TC_conan_blood_decal_lifespan_2026-10-30.md`. (4) W30 arrow blood (`TakeProjectileDamage`
> parameters first), W13 the owner's frame (arrows stay in the air when the creature moves — read the stuck copy's attach parent). Then W29, W24.
> The 12:46 and 13:02 updates of chat 759898d5 (W28 done, the stand lessons, the Krinik mod set) — chronicle, entry 2026-10-30 13:0x (second).
> **The owner's remaining BIG debt (his order 2026-10-30 08:3x; W15 and W14 — done, moved to the chronicle):**
> 3. **W24 one «Настройки модов» button + one hub of mod settings windows in the game's style** (W19–W23 fold into it: Hosav, Damage Meter, group,
>    minimap, Lore & Loot windows; Xevyr and Krinik tabs; vignette sliders) — heavy, `/plan-epic` first.
> **Then:** W26 the logo — main menu right of the game's logo, pause menu under it, an intro at start (`_config/branding/krinik-modpack-logo.webp`);
> W18 twin sweep of the restored UTF-16 scan over all mods (full unpack ≈12 GB — check disk D: first); W18a difficulty captions; W10a quick-loot
> jump («(удерж.)» shortens the row; H1 not seen by eye); W17 residual — a one-frame background lag on long fishing tips (the owner's eye).
> **Run rules learned today:** after ANY pak edit — menu frame by eye before automation; a splice `addprop` only with a name already in the name map
> (uaj REFUSED otherwise); the fishing window classes reload per open — a template fix must run per open; measure the window, never estimate it.
> **Outward, 2026-10-30:** feature request filed by the owner’s order — https://github.com/Arora-Sir/Super-Artemis/issues/3 (complete Russian localization +
> strings and text-dependent layout parameters in resource files; base 1248 strings vs `values-ru` 646, 82 literal texts in 57 layouts; we offered the
> Russian translation and device tests) — watch for the maintainer’s answer.
> **Disk D: cleaned 2026-10-30 10:0x–10:35 by the owner's word** (8 GB free → 288 GB): old session scratchpads (notes kept in
> `D:/REVISIONS/claude-scratchpads-text-2026-10-30.7z`), `_paksview-2.2.3`, Cyberpunk 2077. Kept for the next tasks: `_paksview-3.0.1` (66 GB, arrow
> gravity trace) and `Conan Exiles Mods/_text-extract-3.0.1` (20 GB, the string sweep). Rule — `HOUSE_RULES.md` §1 rule 15; the sweep hook
> `tools/hooks/scratch-sweep.mjs` is wired since 2026-10-30 11:59 by the owner (`SessionStart`, matcher `startup`, in `.claude/settings.local.json`; the agent's own settings edit is refused by the auto-mode classifier — hand the owner a script). First real sweep — the next chat's start: read its line.
>
> **PARKED 2026-10-29 21:07 — Svarog (the far shelf, not raised at entry):** the 21:02 session took it up for four minutes: saves copied
> (`SvarogsDream/_backups/svarog-saves-2026-10-29_2103-before-debt024`), configs snapped (`_harness/cfg_snap`, 21:04), the 13:43 build `f44c36e` hot-deployed
> into the game WITHOUT a run (test debt waived with this reason), cases written — `testcases/TC_svarog_debt024_tails_2026-10-29.md`. Return order: interview #024
> tails (S10c/R1 tooltip gap, CD1 skill-slot digit, `InstantTranslate` of bugs 56/57 — the run report `testcases/reports/2026-10-18_svarog-day-buff-strip-passes1-5.md`
> is partial), then the bug wave 55–62 by plan 32.
>
> **2026-10-29 15:2x — ORDER OF WORK: quick and simple first, heavy after** (`[OWNER]` «сразу делаем много мелочей, что быстро делается и быстро
> тестируется, что просто» · «потом более тяжелые и длительные задачи» · «в таком порядке» · 2026-10-29 ≈15:25). A switch to Svarog was cancelled a minute
> later (`[OWNER]` «сворог - отмена!» · ≈15:27) and «МЫ ДЕЛАЕМ КОНАН» — the work stays on the Conan build, autonomous, by the order below sorted
> quick → heavy. Svarog's debts are not raised at entry (`[OWNER]` «убери напоминание по долгам сварога в дальний ящик!» · ≈15:28).
>
> **2026-10-29 10:2x — THE OWNER'S WORK ORDER (read first): `plans/36_…` → "The owner's work order 2026-10-29", W1–W16 — the table holds each item's
> state.** Only those items are worked; any other debt of the build is asked first. The day's done list — chronicle, entry 2026-10-29 18:43.
>
> **Open tails of the 2026-10-28 chats** (palm shadows by the kit route — bug 67; cases without a run; corpse prompt on two lines — item 36; «k» rounding —
> item 33(c); jump shooting — plan 37; arrow physics «как в обливионе»; edited paks bloat — plan 36 14a; unseen 28.10 texts; run instruments; keys; evening
> tails) — moved verbatim to the chronicle, entry 2026-10-29 22:58 (second part); the owner's work order (plan 36, W1–W16) decides which are worked.
>
> **Conan build debts — plan 36 (`plans/36_conan_build_debts_plans.md`, since 2026-10-26 20:14):** 35 items with hours, done
> in a row (`[OWNER]` «пот по ним пиши планы» · «и по планам делаем»). Each item's status — in the plan's "Queue" table.
>
> Conan session rules (the movie, hours, other mods natively, the settings reference after exit) — `HOUSE_RULES.md` §1; the former "New chat order" 17:40 — chronicle, entry 2026-10-27 00:13.
> 0. **The Conan 3.0.1 build towards release 1.0.0 — plan 35 (`plans/35_conan_build_turnkey_quality.md`).** The owner's decisions of 26.10 evening (plan 35: G5,
>    G7, G10–G12, B3, B4, B7): version 1.0.0; archive — volumes ≤ 700 MB (8 paks over 700 MB → multi-volume 7-Zip zip `-tzip -mx0 -v700m`, G10); README
>    for PlayGround — a PDF on «выцветшей старинной бумаге», pages 1–2 for the storefront, thanks to Taurin78 in the fixes (G11); crafting in the inventory
>    while paused — speed up (G12); hub — no flicker and no jumps (B4). The owner's order: tech debts → translation → a run through the world → volumes and README.
>    Done 26.10 16:54–19:40 (T2b, M2, H9, U7, LM1, S1e) — chronicle, entry 2026-10-27 00:13.
>    **Next, in order (hours):** (1) Ragnar's New Factions: `RNF_Shared_WeightedSpawns` refers to 4 smelters `RNF_NPC_WadaiFlesheaters_Smelter1–4`
>    whose spawn tables do not exist (the author's error): remove the rows or add the tables, KRINIK MODIFIED — ≈ 1 h;
>    (2) G12 crafting: one real craft of «Бечевка» with the hub open (the remote does not start a craft — case P1), measure, enable `CRAFT_SPEEDUP` — ≈ 1 h;
>    (3) B4: the same hub recording on a game without paks (reference), the late emblem (bugs/64 item 26), splitting by pak — ≈ 2–3 h; B7: the fishing button
>    to Hosav and its look (inserts `BPC_EFT_Tuning.Graft` into `ButtonContainerRight`) — ≈ 2 h; (4) bugs/64 item 21 the Damage Meter slider, item 23 EAA
>    class cards (text painted in textures) — ≈ 2–4 h; (5) mod cost q4 A-B-A-B — ≈ 1–2 h; (6) archive on a clean game and volumes — ≈ 1–2 h;
>    (7) README-PDF — after 1–6. Instruments: `close-game.ps1` and `long-run.sh` should close `CrashReportClient` themselves after a crash
>    (`[OWNER]` «убирай за собой окна креш репортов, пожалуйста» · 2026-10-26 ≈19:39; the rule — `HOUSE_RULES.md` §1) — 0.3 h. Wait for the owner: interview #025 (ambush frequency; the `rawf:` instrument is ready), «table» on the fish card.
> 1. **Conan, main stream — the measurement queue** (`[OWNER]` «Замеры ручек подгрузки … Ветка появления NPC … Эталон на чистой игре без паков модов» ·
>    «можно начинать их грузить дальше по дистанции, но больше кадров выделять. У меня много врам и рам»): batches in `ConanExiles/_config/bench-batches/`
>    (README — the before/after order of each): q1 (on the fly) done 02:18 — the streaming budget and the 8 GB texture pool are within noise, «без ткани» refuted by
>    repeating q3b (40 vs 36); flight noise 36–52 stutters — only A-B-A-B pairs decide (EXP-0335). Next q2 `s.AsyncPostLoadEnabled`,
>    q3 `p.Chaos.EnableAsyncInitBody`, q4 without the mod paks. Analysis — `researches/conan-main-thread/README.md` §3–4.
> 2. **Plan 34 — rewrite our Conan mods** (`plans/34_conan_mods_cpu_respect.md`): by the Unliminium rules — events instead of polling, a shared
>    `KrinikCore` registry, a per-frame budget, self-measurement; mod cost now ≈ 0.4 ms, UE4SS hooks ≈ 0. The choice of path (step 3) — the owner's, with numbers.
> 3. Open since 25.10: the HUD outline is sharp by 2 pixels (`KrinikHudOutline`, not started); the Lore & Loot window (and AMR, Emberlight, Pickup+, Horti) does not open
>    by a bare `ActivateModule` — open them by the player's path; compatibility `ConanExiles/docs/17` (missing packages, Ancient Civ vs TDI, item
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
  15–18, 21 (Damage Meter slider), 23 (EAA class cards — text in textures), 26 (late emblem in the hub); closed by a frame 2, 3, 7, 7b, 8–11,
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
`.claude/hooks/context-budget.mjs` runs (2026-10-30: #181 farewell hook, #182 autonomy guard, #183 the agent cleans up after itself — `bugs/KAIF/21–23`): at 75 % of the window — `/end-chat-soft`, at 85 % — `/end-chat-force` (`CLAUDE.md`).
