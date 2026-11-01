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

> **Moved verbatim to the chronicle, entry 2026-11-01 18:18 +03:00:** the 14:24 vignettes / hub-audit paragraph (plan 40 phases 1–2).
> **OWNER DECISIONS 2026-11-01 16:17–16:18 (bug 73), also job number one:** (1) the ×3 arrow in flight is WANTED back — `[OWNER]` «Да» to «Вернуть ли стреле
> трёхкратный размер в полёте» (16:17): find the route that grows only the VISIBLE arrow, not `ProjectileMesh` whose bounds place the stuck copy (a pre-hook of
> `SpawnDummyProjectile` restoring the size did not help — bug 73 A4); control case first (rule 24). (2) `[OWNER]` 16:18 «срок жизни стрел везде, и в земле, и в
> трупах, и в стенах нужжжжжжжжжен 5 минут - с возможностью настроить в модах стрельбы из лука - в минутах, от 1, до 30» — a stuck arrow lives 5 min
> everywhere (the game gives 15 s, `ProjectileDummyLifetime`); a hub row on the KrinikConanArchery page, minutes 1–30, default 5; corpses — with phase 4.
> The owner's scheme 16:23: `[OWNER]` «значит лететь в воздухе должна физическая оригинальная стрела x1 размера, а визуальная модель лететь должна x3.
> Физическая стрела и визуальная модель сввввввввввввввввязаны в наккооооооооооооооооонечникееееееее» — the flying `ProjectileMesh` stays ×1 (the game's
> hit and copy placement); a SEPARATE visual mesh ×3 rides on it, the two joined at the TIP (the big arrow extends back from the shared point); the native
> mesh hidden in render only.
> **2026-11-01 17:20 +03:00 — THE OWNER'S DEBT BELOW IS DONE (plan 40.3 step 2, report `testcases/reports/2026-11-01_conan-mods-menu-list.md`):** the inventory bar keeps only
> «Настройки модов»; its list «Моды Krinik'а · Моды Xevyr'а · Рыбалка · Прочее» works by the real mouse; Xevyr and «Прочее» are INTERIM sub-lists of the
> mods' own windows (5 + 5); Esc keeps the inventory in all 12 windows (8 mod paks KRINIK MODIFIED: module rows Modal + CloseOnESC, new `rbool:` row kind of
> `patch-mod-asset.py`); Hosav's button collapsed, fishing not grafted, Xevyr's side tab collapsed in its window's `Construct` (60 fps video clean). Seam left:
> the PIFC window stands right of centre. **2026-11-01 17:43 +03:00 — stuck arrows live 5 min (hub row «Сколько стрела торчит в цели», 1–30 min), seen 299.9 / 59.9 s (report
> `testcases/reports/2026-11-01_conan-arrow-stuck-life.md`).** **2026-11-01 17:51 +03:00 — the ×3 visual arrow joined at the tip flies (cases V1–V3, copy still at 62 cm); review folder 50 «strela x3 v polete» waits for the owner's eye.**
> NEXT, in order: (2) «Моды Xevyr'а» and «Прочее» as our hub windows with real rows (the owner's 13:40 decision) — recon DONE
> (`researches/conan-mod-settings-hub/xevyr-settings-recon.md`), the Damage Meter page mockup in review folder 51 waits for his eye; plan 40.3 I6; (3) plan 40 phase 4 (arrows in the corpse). Game closed, lock released.
> **CHAT 5edabf9c CLOSED 2026-11-01 18:2x (soft). Also done after 17:51:** the Damage Meter opacity preview after a colour pick (author bug 0.55 vs 0.65, pack `af98be6`); our Al-Merayah «Bailey» label mistranslation fixed (pack `109e9f2`). FIRST in the next chat: the owner's eye on review folders 50 (x3 arrow) and 51 (Xevyr hub mockup) — his verdict on 51 opens the code of plan 40.3 I6 (pages bound to the mods' own values; read the recon's «Hard to bind» section first); without it — plan 40 phase 4 (`/bug-research` first; route (c) now has the AddComponentByClass fact). Stand recipe — game map, the archery stand line.
> **2026-11-01 21:13 +03:00 — chat c5fe291c, dayloop («работай автономно» 20:38, the game in the BACKGROUND by the owner's word «работай с игрой в фоне»; then «комп твой» 21:09).**
> Done: review folders 50–51 had landed in Svarog's review dir — moved to `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\` (the Conan one; game map row); folder 50 is
> closed (the owner saw the flight himself). The owner chose **variant A** for the Xevyr hub (our own colour control and key capture — plan 40.3 I6, the mockup
> badges updated). «Клавиша вызова курсора» in The Damage Meter and Simple Minimap + the refresh-rate label no longer runs over the F1 box (report
> `2026-11-01_conan-cursor-key-name.md`). The KRINIK MOD PACK logo's dark fill toned to the game logo by measurement (`make-pack-logo.py`, review folder 52). The
> minimap 6 units further from the corner and its coordinates lower — ACCEPTED 21:04–21:05. The ×3 arrow is hidden at impact (`StopProjectileInternal` hook) —
> CONFIRMED by the owner 21:13 «да, суппер работает!» · «и земля, и камни, и враги».
> **21:48 — the «E Взять» prompt over every foliage pickup (plan 42, the owner 21:14–21:34) is BUILT** (KrinikConanUI `krinik_pickup_prompt.lua`, pack `740e473`):
> once a second, the game's own pickup geometry (CORRECTED 21:53: the probe starts at «camera + view × arm» — at the hero —, reach 90, sphere 2 m; the first «from the camera itself» copy missed stones at the feet with the camera above), 55 kinds; works in game (report
> `testcases/reports/2026-11-01_conan-pickup-prompt.md`); cost measured 21:50 (100 repeats): the check 0.12 ms, the near refresh 0.18 ms, each on its own frame once a second — the A-B flight (rule 7) still owed; an enemy's
> health bar stands where the prompt stands. Water «E Попить» — step 2 of plan 42. My channel sweep of native traces crashed the owner's game 21:30 (EXP-0433).
> NEXT: the owner's eye on the prompt in play; the A-B flight; then plan 40.3 I6 (Xevyr pages, steps written); then plan 40 phase 4 (arrows in the corpse).
> **Moved verbatim to the chronicle, entry 2026-11-01 17:54 +03:00:** the done owner-debt block of 15:49 and the 15:38 dayloop paragraph.
> **Moved verbatim to the chronicle, entry 2026-11-01 15:52:** the closures of 13:27–13:43, the eea8bf94 handover items 1 (vignettes — done) and 1a (hub audit — plan 40.2), the 08:49 acceptances, the 09:5x–10:3x done list, the 13:20 vignette order (done), the 2026-10-29 15:2x work order.
> 2. The HUD temperature by the game's debuff stage — frame the comfort (white) and the cold (blue) cases (only heat was framed, review folder 47).
> 3. The inventory button «Настройки модов» (plan 38 phase 1) — write its operational plan first (the Xevyr / «Прочее» entries have no hub yet).
> 4. Arrows in the corpse — not done; routes in `games/ConanExiles/mods/KrinikConanArchery.md` → Open. Frame measurements (fps perf TC) — also covers the
>    blink section's 3–6 ms minute spikes. Archive and documents LAST (the owner's order).
> Review folders waiting for the owner's eye: 44 (shout hold), 45 (blink pink → red), 46 («Все», corners), 47 (temperature red), 50 (x3 arrow in flight), 51 (Xevyr hub mockup). The live save is the
> 2026-10-31 16:56 copy (armour, bow) — hunger / thirst at 0 % kill even with god: refill them in every run.
> **Closed handover blocks (chat ecee2807, the 08:42 hub remarks, the 09:33 caverns park, the older FIRST list) — moved verbatim to the chronicle, entry 2026-11-01 11:14 +03:00; before them (chat a3dcf82b, 04:4x–05:3x) — entry 2026-11-01 05:51.**
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
