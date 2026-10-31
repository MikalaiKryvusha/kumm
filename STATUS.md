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
27 checks since 2026-10-30 — a mod re-setting an Engine.ini cvar at runtime; all 27 passed on 2026-10-30). Not covered yet: the live Nexus path (Chrome) — Phase 1 in `MASTER_PLAN.md`.

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

> **Older handover pointers (2026-10-30 16:55 … 2026-10-31 12:21) — collected in the chronicle, entry 2026-10-31 16:53 +03:00 (second part).**
> - **The KUMM README undo paragraph — DONE 19:0x** by the portrait into `README.md` (after the `"export": false` paragraph; facts from `Deploy-ModPack.ps1`
>   108–233, 987–1013); voice-lint SKIPPED=3 (the portrait's §8 has no pattern table); a clean-instance §7B pass found 11 hits, all applied. The owner's proofread is open.
> - **The mod-settings hub look APPROVED 19:09** (mockup 5 of `ConanExiles/_config/settings_hub/mockups/mockups.html`, «Моды Krinik'а», per-author hubs, the
>   entry button with a vertical scrolling list — the owner's words in plan 38's header). Route — a KIT window (recon `researches/conan-mod-settings-hub/
>   mod-ui-module-registration.md`). **In flight 19:12:** a helper builds the kit window skeleton (`W_KrinikModSettings` + `DT_KrinikUIModule` + the merge) and
>   tests a real click on a game checkbox inside it — read its run report `testcases/reports/2026-10-31_conan-hub-kit-window.md` when it lands.
>   The launcher is BUILT by mockup 11 + frame 7 (pack `3c72afd`, idea 22 «BUILT 19:20»; review folder `32_launcher_built` opened 19:2x) — open: real clicks
>   on its buttons and a move to a monitor with another scale (unobserved).
>   The list under «Настройки модов» (the owner 19:14–19:16): «Моды Krinik'а» · «Моды Xevyr'а» · «Рыбалка» (its own window) · «Прочее» (always last; single-mod
>   authors) — inventory `researches/conan-mod-settings-hub/author-hub-inventory.md` (its live module-table scan is open). The slider is «шкала» everywhere
>   (HOUSE_RULES rule 21; `Game.locres` patched, pack `c394b3a` — not yet seen in game).
>   Idea 23 (versions on a public GitHub feed + the launcher's update check; later self-update of the launcher and the build) — awaits the owner's approval,
>   the public repo's name and the download place.
> - **NOW (18:54, `/dayloop` by «работай автономно» 18:53): the mod settings window — epic 38** (`[OWNER]` «нас ждет большой долг - окно настройки модов» · 18:54;
>   «рыболку можно не троггггггать, оно красивое» · 18:54 — the fishing window stays as is, it is the look's model). Plan `plans/38_EPIC_conan_mod_settings_hub.md`,
>   phase 0 `plans/38_epic38_phase0_widget_spike.md`. In flight in parallel: a helper rebuilds `KrinikConanLauncher.cs` by the approved mockup 11 + frame 7 (pack).
> - **Session 2026-10-31 15:36– (resume):** one build script for the delivery documents — `ConanExiles/build_docs_and_launcher.cmd` (author links from
>   `author_links.txt` → the guide's «Автор сборки» + PDF + `KrinikConanLauncher.exe`, plan 35 G11 item 7, pack `2336de3`); Krinik mods carry the build version
>   **1.0.0** (seen in the pause-menu list 15:51, pack `35c96d8`); **bug 72 DONE** — the install keeps an undo journal + copies (`<game>\_kumm_backup`),
>   `uninstall_krinik_build.cmd` and the launcher's «Удалить сборку» return the pre-build state (KUMM `528b63e`, fixture 34/34; the live Conan folder run U10 PASSED 16:07 —
>   0 differences of 1728 entries). So a clean game copy is NOT needed: tests run on the live game, uninstall, check, reinstall (the owner 15:51: «зачем тебе чистая версия»).
>   **The README is being rewritten from scratch by the owner's voice portrait** (plan 35 G11 item 8 — his words there): a helper reads the whole
>   `krinik_voice/AUTHOR_STYLOMETRY.md`, a second checks; KUMM `.kaif/kaif.json` → `voicePortrait`. Next after it: the mod settings windows (W19–W22, W24).
>   **16:31–16:4x:** the guide rewritten and checked (pack `048fb4b`), the owner's answers applied in part (two-line title, «Руководство пользователя», numbered
>   chapters 1., 1.1 — `0539d33`); our mods renamed `KrinikConanCamera` / `KrinikConanModPackStatus` (pack `96c1c5b`, HOUSE_RULES rule 19; the owner's live
>   `config.lua` of both carried over, seen in game 16:41); delivery names English + underscores (rule 18: `collect_report.cmd`, `uninstall_krinik_build.cmd`,
>   `_kumm_backup`, `build_docs_and_launcher.cmd`). Done 16:4x–16:5x: the guide carries the owner's answers (our mods at the top of the one composition list, «вы» steps, 7 of ours);
>   `KrinikIntro` + `KrinikConanModPackStatus` merged into **`KrinikConanModPackManager`** (`[OWNER]` 16:48 «вот это все организационные вопросы» ·
>   «Я предлагаю их объединять в KrinikConanModPackManager»; pack `9b686b5`, seen in game 16:51: «СБОРКА: моды 66/66», the intro found); the PDF opened
>   for the owner 16:5x (no verdict yet). The shipped Krinik set is 7 (HOUSE_RULES rule 19). Open: the camera's Nexus draft still says ConanCameraControl (publication name — the owner's).
> - **Waits for the owner's hands (called in chat 2026-10-31 16:2x):** `TC_conan_build_stability_compat_perf_2026-10-26` R2 — a stone picked up in third
>   person at the default and the far zoom; AIM15 — the arrow seen leaving the bow and landing under the crosshair; DM0 — F1 expands the Damage Meter: does it cover Hosav's HUD text (called 16:2x;
>   the module call leaves the meter collapsed). C1 — the Caverns of Set chest's `LootTable` points at `/Engine/UnknownPackage` by the file (docs/17): read the
>   CDO by the pult near the caverns, expect an empty chest → a defect to fix with a table of our own.
>   The emulated-input attempt of 16:25 (the hero never drew the bow) — verbatim in the chronicle, entry 2026-10-31 16:53 +03:00.
> - **2026-10-31 18:17 +03:00 — 10 launcher mockups shown** (the owner 18:06 «лаунчер некрасивый, иди в интернет в разведку и 10 макетов с вариантами давай разными»): recon
>   `researches/conan-launcher-design/README.md`, mockups pack `_config/launcher/mockups/mockups.html` (`node shoot.mjs <dir>` → 3840×2160 WebP; pack `723494b`), review folder
>   `Conan Exiles Mods/НА ОТСМОТР НИКОЛАЕМ/27_launcher_10_variants/` opened. **PICKED 18:22–18:26:** variant 2 rearranged + gold Play last + a thin rough
>   frame — mockup 11 of `mockups.html` (pack `acc7d44`), the owner's words in `ideas/22_conan_build_gui_installer.md`; shown in folder `28_launcher_variant_2_rearranged`.
>   Open: title font (Oswald vs the buttons' Georgia) and the state-driven main button. Next — rebuild `KrinikConanLauncher.cs` by mockup 11 (frame from
>   `make_frame.py` textures), frames at 720p/1080p/2K/4K (rule 17).
> - **18:02 FORCE CLOSURE (done since: the layout is pack `cdc299f`): the launcher-layout helper was still running (the owner 18:02: «лаунчер некрасивый, кнопки расположить слева в вертикальную колонку» · «описания, если нужны - справа») — its result is UNCOMMITTED in the pack working tree (`_config/launcher/`): check the frame (`scratchpad/launcher-v2/`), commit, show. The owner: «в новом чате продолжим делать».**
> - **18:01: the guide FACT-CHECKED (pack `1f82ce6`, 11 sheets, guide_lint clean; owner questions: 1.0.0 date, Num 8/2 wording, Oblivion vs Remastered, «лучше стреляет из лука» vs the code, W29/EAA emblem) and the launcher look (pack `8f757e6`, frames at 100 % only) — show, then 2K/4K × 300 % frames. Older: 17:5x the guide rewrite (pack `2f9f2b8`) was a DRAFT — facts partly from the stale 10-26 guide; a fact-verification helper started 17:51 (sources: mod notes, plan 36 W, bug 64, modpack.json; the owner: «ему можно брать факты из старого текста, но ЭТО НЕ ФАКТЫ НИХУЯ БОЛЬШЕ»). Accept its result, frames of every sheet, commit, show the owner.**
> - **FIRST next chat (from the 16:5x closure; the owner's «работайте автономно» 16:49 stands → `/dayloop`):** (a00, 17:5x) two helpers were running at the force closure — the guide rewrite FROM SCRATCH by the portrait (all owner rules: plan 35 G11 item 8, its 17:2x–17:49
>   lines; must pass `python -I _config/release/guide_lint.py docs/guide/guide-3.0.1.html`) and the launcher redesign (wallpaper, borderless, Conan-metal frame and
>   buttons — idea 22): check their output in the pack working tree (uncommitted), frames, commit, wire guide_lint into build-docs.py, show the owner; (a0) sweep the WHOLE guide for the 17:25 error class (a feature described as acting by itself — plan 35 G11 item 8), then the design recon `researches/document-design-manuals/README.md` (a helper started 17:21 — read its checklist, apply it to the guide;
>   the owner's 17:19–17:23 storefront rules are in plan 35 G11 item 8); (a) the owner's verdict on the user guide PDF
>   (opened 16:5x; his remarks go to plan 35 G11 item 8, edits by a helper WITH the portrait, then an independent check); (b) the KUMM `README.md` lacks the
>   undo journal / `-Restore` / the `uninstall` manifest key — the owner's storefront text, write it by the portrait; (c) the emulated input that did not reach
>   the game (16:25) — fix, then the bow / F1 / stone cases; (d) the mod settings windows (W19–W22, W24) — mock-ups first.
> - **Earlier FIRST list (still valid):** (1) the owner's answers: folder 25 (shout fade), the 12:14 voice question «кино выключено?» (needed for the q2–q4 frame measurements,
>   plan 36 item 23). (2) Item 28 step 2 — `install.cmd` on a copy of the game without mods, `-Verify`, world entry. (3) The remaining unrun cases of
>   `TC_conan_build_stability_compat_perf_2026-10-26.md` (U4–U6, C1–C3 …) — one launch each, frame + log. (4) W20 mod settings windows — mock-ups first (taste).
>   (5) The release gate at 720p / 1080p / 2K / 4K (rule 17). (6) Item 21 — a vanilla quick-bar frame needs a clean-game stand (also for q4).
> - **Epic «Настройки модов», phase 0 (open):** real clicks reach vanilla FLX buttons inside a vanilla window («Отмена» closed `W_InventorySettings_C`), but a
>   checkbox created by `Create(pc, class, pc)` stays dead even inside it; 48 of 49 live FLX buttons live in a window's `WidgetTree` (H4: the OUTER matters).
>   `Create(window, class, nil)` builds inside `<window>.WidgetTree`; adding it + `SetText` in ONE call crashed (15:38) — next: the same, ONE action per call,
>   stand check after each (`testcases/TC_conan_settings_hub_spike_2026-10-30.md` S11–S14, `researches/conan-mod-settings-hub/vanilla-settings-widgets.md`).
> - **Waiting for the owner:** the fishing captions' look (folder 9); the HUD blink dim start 0.25; the crash-report README; his save — the 12:05 copy question
>   («верни») still open; every run of 2026-10-31 restored the copy `_save-backup/2026-10-31_1004-before-w13-arrows` (byte-equal to the live save at 10:48).
> - Work trees kept: `_paksview-3.0.1` (66 GB) and `Conan Exiles Mods/_text-extract-3.0.1` (20 GB) — rule 15. Outward: watch https://github.com/Arora-Sir/Super-Artemis/issues/3.
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
> **Conan build debts — plan 36 (`plans/36_conan_build_debts_plans.md`, since 2026-10-26 20:14):** 35 items with hours, done
> in a row (`[OWNER]` «пот по ним пиши планы» · «и по планам делаем»). Each item's status — in the plan's "Queue" table.
>
> Conan session rules (the movie, hours, other mods natively, the settings reference after exit) — `HOUSE_RULES.md` §1; the former "New chat order" 17:40 — chronicle, entry 2026-10-27 00:13.
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
`.claude/hooks/context-budget.mjs` runs (2026-10-30: #181 farewell hook, #182 autonomy guard, #183 the agent cleans up after itself — `bugs/KAIF/21–23`): at 75 % of the window — `/end-chat-soft`, at 85 % — `/end-chat-force` (`CLAUDE.md`).
