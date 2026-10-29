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

> **NOW 2026-10-29 21:07 — THE CONAN BUILD again; Svarog to the far shelf** (`[OWNER]` «продолжаем делать сборку КОНАНА» · «сварог откладываем в давнюю
> полку» · 2026-10-29 ≈21:05). Class A of the hub (`researches/conan-ui-text-relayout/README.md`):
> ✅ **item tooltip** — `KrinikUIFixes` 1.2.0 (auto-wrap off), cases T0–T4 pass, the owner's eye 21:38 «поп-апы описания предметов не дёргаются»; the same minute
> «и модов иконки сразу отображаются» (class B accepted) · «книзу кнопки прыгают» · «я вижу, что ты в првильном направлении».
> 🔧 **bottom bar** — cause measured (cases B0–B2 of `testcases/TC_conan_hub_bottom_bar_width_jump_2026-10-29.md`): the key glyph's ScaleBox in `W_HotkeyIcon` is
> 128 wide on a new button's first frame and 42.7 after (+85 units = the jump). NEXT: the fix — a FORK: one `W_HotkeyIcon` serves contexts with different settled
> sizes (bar 42.7/32, Q/E 48, journey 24), so a global fixed scale is wrong; read in `W_HotkeyIcon`'s bytecode how the texture is set (`SetBrushFromTexture`
> match-size? the inactive `WidthOverride` 32), then a first-frame size that keeps each context's look; B3 on three tab pairs + the owner's eye.
> Then the «Хар-ки» perk rows (bug 64 item 46): rows hold ≈ 2 lines, «Берсерк» needs 4, «Кровожадный берсерк» 5 — a fixed-height overlap, not a jump
> (frame `stats.jpg` 21:37; row layout in the game map).
> Tools of this session: `hover-watch.ps1` (real hover / `-PultCmd`), `tooltip-bbox.py`, `bar-probe.lua`; recipe: a kit asset is cooked only if listed in
> `Mods/<mod>/Local/CookInfo.ini` `FilesToCook`. The game of 21:32 runs (my launch; the owner watched it — his game now: close only by his word); `t.MaxFPS 60` was set by the remote.
>
> **PARKED 2026-10-29 21:07 — Svarog (the far shelf, not raised at entry):** the 21:02 session took it up for four minutes: saves copied
> (`SvarogsDream/_backups/svarog-saves-2026-10-29_2103-before-debt024`), configs snapped (`_harness/cfg_snap`, 21:04), the 13:43 build `f44c36e` hot-deployed
> into the game WITHOUT a run (test debt waived with this reason), cases written — `testcases/TC_svarog_debt024_tails_2026-10-29.md`. Return order: interview #024
> tails (S10c/R1 tooltip gap, CD1 skill-slot digit, `InstantTranslate` of bugs 56/57 — the run report `testcases/reports/2026-10-18_svarog-day-buff-strip-passes1-5.md`
> is partial), then the bug wave 55–62 by plan 32.
>
> **NOW 2026-10-29 18:4x — the hub of the Conan build (bug 64 item 17; plan 36 W8):** the Hosav and fishing buttons by event (pack `fae3d52`, the owner's
> eye «это ок»; screen videos deleted and paused by his word «удали записи видео, пока пауза» — check by frames or his eye).
> **18:37 — class B (late mod elements) fixed, cases I1–I7 pass** (`[OWNER]` «автономно работай» · 18:1x): EAA, EoT, Accessory System KRINIK MODIFIED,
> `KrinikPauseGameInMenu` 0.9.1, `patch-mod-asset.py` `flt:<fn>@<n>` + `PATCH_VIEW_EXCLUDE`; run report `testcases/reports/2026-10-29_conan-hub-late-mod-elements.md`.
> **Next — class A (text laid out once, then jumps):** the item tooltip auto-wrap (`W_ItemIconTooltipView`), the bottom-bar width dance (hotkey glyphs
> born 170 ms after the buttons — to verify by frames), the «Хар-ки» perk descriptions overlap (bug 64 item 46); a sweep, not one widget.
>
> **2026-10-29 15:2x — ORDER OF WORK: quick and simple first, heavy after** (`[OWNER]` «сразу делаем много мелочей, что быстро делается и быстро
> тестируется, что просто» · «потом более тяжелые и длительные задачи» · «в таком порядке» · 2026-10-29 ≈15:25). A switch to Svarog was cancelled a minute
> later (`[OWNER]` «сворог - отмена!» · ≈15:27) and «МЫ ДЕЛАЕМ КОНАН» — the work stays on the Conan build, autonomous, by the order below sorted
> quick → heavy. Svarog's debts are not raised at entry (`[OWNER]` «убери напоминание по долгам сварога в дальний ящик!» · ≈15:28).
>
> **2026-10-29 10:2x — THE OWNER'S WORK ORDER (read first): `plans/36_…` → "The owner's work order 2026-10-29", W1–W16 — the table holds each item's
> state.** Only those items are worked; any other debt of the build is asked first. The day's done list — chronicle, entry 2026-10-29 18:43.
>
> **CHAT 2026-10-28 23:14 → 2026-10-29 00:4x — where it stands:**
> - ✅ bug 67 palm shadows: 2.0 in the pack BY THE OWNER'S CHOICE (2026-10-29 01:10, «ставим 2.0 и закрываем чат»; pack 1c70cb9) — NEXT: the kit route (bug 67 → «Next path — the kit»: sky blueprint, smooth sun + rare shadow light) — cause found (`DynamicSky.SolarUpdateAngleDelta`: 2.0 calm / 0.003 flicker, the owner's eye both ways), but 2.0 was
>   REVERTED (pack 6a12183): 0.003 is there for a smooth sun — `[OWNER]` «мы же специально делали так, чтобы солнце плавно по небу двигалось...».
>   His answer: `[OWNER]` «ПЛАВНОЕ СОЛНЦЕ И НЕ МЕРЦАЮЩИЕ ТЕНИ!!!!!!!!» — FIRST in the next chat: keep 0.003, find levers that do not touch the sun
>   (bug 67 → «The owner's requirement»), each by a 60 fps clip under palms and his eye. EXP-0369. First run (recon
>   `researches/conan-shadow-flicker/2026-10-29_light-rotation-cache.md`): B1 ray-traced sun shadows live (`r.RayTracing.Enable 1`, `r.RayTracing.Shadows 1`), delta 0.003.
> - Cases still without a run (need the game, not the owner): `TC_conan_corpse_prompt_left_of_quickloot_2026-10-28.md` F4 (chest), F5 (1080p), S3/H2/H3
>   rows; `TC_conan_bow_fp_smooth_zoom_2026-10-28.md` H2, H3 (FP draw cancelled / RMB mid-draw, real input); SB3 (ten mixed draws) of the loot file.
> - 🔴 item 36 corpse prompt on two lines: our `Game.locres` CAN override the vanilla key (`vanilla-override.py`, `vanilla-overrides-ru.tsv`), but
>   the widget lays out «text · E · text» in one row — a break hangs «или нажмите» left of the icon (T1 fail); reverted; needs a layout variant.
> - 🔴 item 33(c) «k» one decimal: Hosav `BPFL_Hosav_UI.TextOverflowPrevention_Numbers` — in-place edit gives truncation only; rounding needs a
>   bytecode insertion (bug 64 row 33).
> - Plan 37 jump shooting — recon step 1 done (`ActionTry` refuses on `IsFalling`), (a)–(c) open; ≈ 1–2 h recon + 2–3 h fix.
>
> **Arrow physics (not started):** `[OWNER]` «в новом чате полностью делаем физику в конане, как была в обливионе» (2026-10-28) — Oblivion arrow flight:
> constant gravity `ProjectileGravityScale` 0.55 (Remastered vanilla), speed = 5000 × (min + (1 − min) × charge) cm/s, where `min` is NOT Oblivion's 0.25:
> `[OWNER]` «для мгновенных выстрелов в конане нужно будет какой-то винимум поставить. не такой мелкий, как в обливионе» — a setting, candidates 0.4 / 0.5 / 0.6
> (drop over 10 m −0.67 / −0.43 / −0.30 m) for his eye; the curves `FC_BowProjectileGravCurve_*` and the charge-weakened gravity — remove; first check
> whether damage depends on speed. Everything with sources and the drop table — `researches/conan-archery/README.md`, section «Физика стрелы
> оригинального Обливиона». Cases — a new `testcases/TC_*.md` before code; acceptance — drop at 10/20/30 m per the table and the owner's eye.
>
> **Tails of earlier handovers (closure 2026-10-28 17:47, items 2–5; item 1 and the 19:44 and 21:59 blocks — chronicle, entry 2026-10-28 23:09):**
> 2. **Plan 36 item 14a — edited paks bloat** (IMM_WAR 359 → 735 MB, EoT 255 → 604): `retoc pack-raw` writes `.ucas` uncompressed; the place to fix —
>    `_tools/src/retoc/retoc/src/iostore_writer.rs:68` (Oodle already in `compression.rs:33`); then rebuild every `_krinik-modified` by its manifest
>    recipe and check each by a launch. Hits the archive volumes ≤ 700 MB (plan 35, G10).
> 3. **The texts added 28.10 have not been seen in game by anyone** (IMM_WAR messages, the Ironlight journal, EoT skills and places, fish names) — mounted,
>    the world loads; the first chance to see — a frame and a case.
> 4. **Run instruments:** `_config/mouse-seq.ps1` (real SendInput input, the game window in front), `fov-sampler.lua` (remote, `lua dofile`), `rmb-case.sh
>    <label> <ms> "<steps>"`; the view — `SwitchToFirstPersonCamera()`/`SwitchToThirdPersonCamera()` by the remote; bow in hand — `InpActEvt_Shortcut0_…_25`.
>    Never read arrays of montage structs by the remote (crash 20:29). Postponed by the owner: the arrow through the grip while walking (item 44, «чинить попозже»).
> 5. **Keys:** the live `Saved/Config/Windows/Input.ini` is the only source in 3.0.1 (the pack's `_config/Input.ini` is old, not shipped). Done
>    with the game closed: left Ctrl — crouch, heavy attack — middle mouse button, the chats on numpad * and − removed, dodge — side mouse button
>    (the owner). Waits for the owner: where to move the camera mod's Ctrl combos (Ctrl+5, Ctrl+/ reset to factory) — Alt+numpad or numpad . and *.
> 6. **Evening tails:** bug 65 (crash after re-login — the fix confirmed by a re-login 2026-10-26 23:23; before DONE — 10 min of play + a twin sweep);
>    night — done 2026-10-29 (W12: the shipped default off; the console `dc` never reached the mod); smooth zoom step
>    checked (ZS1); bug 64 item 27 accessories, 28 XP captions, 29 arrow-choice flicker (Arrow Quick Swap?), 30 hunger/thirst arrows (below the icons; the
>    owner 00:1x «указатели так и не поднял ты» — first after the bow), 31 minimap coordinates — inside the circle with a backing, the whole minimap further right
>    and higher, 32 with the quick loot open, shift the corpse prompt further left (the tutorial prompt overlap — «бог с ним»); item 39 the charge ding — done
>    28.10 (sound C, item 1 above), item 38 golden light. The hero's hunger and thirst are 0 % — the remote cheats were dropped by a restart.
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
`.claude/hooks/context-budget.mjs` runs: at 75 % of the window — `/end-chat-soft`, at 85 % — `/end-chat-force` (`CLAUDE.md`).
