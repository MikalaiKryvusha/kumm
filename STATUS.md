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

- ❓ **2026-11-07 07:4x — the hub controller's player-path test needs the game in FRONT** (real mouse clicks on the tabs, Esc/Tab closing, a 144 fps recording
  of the switches): the work of plan 48 runs background-only by the owner's word of 2026-11-06 23:32. Asked in the chat; until his word the section is proven
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

> **NOW 2026-11-07 14:47 +03:00 — chat of 2026-11-07 (third), `/resume` «продолжаем делалть конан» → bug 67 palm shadows; the owner 13:46 «комп твой, работай
> автономно» · «бери игру вперед» → `/dayloop` after this item.** Clean stand built (fixed CameraActor `fixed-cam.lua`, window capture `gfxcapture`, time 14.0
> per clip, quiet-stand catches the camp boss now; tools row HOUSE_RULES_REFERENCE «shadow / clip stand»). Measured (report
> `testcases/reports/2026-11-07_conan-palm-shadow-levers-wind-steps.md`): the every-frame light flickers with AND without wind; finer texels −1.5/−2.0 do NOT help
> (lever 1 refuted); light steps 0.1° / 0.25° calm like 2.0 by the metric — **REJECTED by the owner 14:53: any step (2°, 0.1°) is an unacceptable sharp shadow
> move; target = continuous light, SHARP shadows, no frame-to-frame leaf flicker (bug 67, verbatim).** Also refuted 15:0x–15:2x: SMRT 32/16, Nanite
> `MaxPixelsPerEdge` 0.5/0.25 (no change); ray-traced sun shadows give BLOBS (baked ray-tracing proxies of the palms, `RayTracingProxies.ProjectEnabled 1`), 41 fps;
> the palm leaves are OPAQUE geometry (`MI_AfricanOilPalm01/D01/02` on `M_Foliage`, blend 0) — no mask threshold to lower. The probe of all mesh components crashed
> the game once (fixed, `palm-material-probe.lua`). NEXT for bug 67: `/bug-research` (3+ levers failed) — how shipped games keep crisp foliage shadows under a
> continuously moving sun; candidates: palm assets without RT proxies (kit), VSM page-grid stabilisation. Game closed, lock released, build unchanged (2.0 / −1.0).
> **16:1x — live with the owner (bug 67, full log in the bug):** his eye set the sun step **0.0025** (pack Engine.ini, not deployed yet — the game runs it live);
> refuted by his eye today: texel ×2/×4/×10, throttle off, Nanite edge 0.25, WPO-disable off, cache off, SMRT 0 (×30 worse), SMRT 32/16, DLSS off (×9 worse);
> the leaf material cannot be thickened (mask-based wind, no pivots). Tools: `leaf_pop_finder.py`, `shadow_pop_map.py` (blink counts), review folder 72.
> OPEN: helper recon `researches/conan-shadow-flicker/2026-11-07_leaf_shadows_fill_in_recon.md` (why leaflets vanish for frames) → its first live test with the
> owner. Game open (PID 49596) with live test values (throttle 0/0, pool 8192, Nanite 0.25, t.MaxFPS 144) — a restart returns the pack's values.
> ⚠️ **Чат 2026-11-07 (второй) закрыт принудительно 2026-11-07 12:43 +03:00 на 85 % окна: церемонии пропущены (проход судьи, обрезка STATUS, README, линтеры витрины) —
> долг платит первый /end-chat-soft.** Ложных утверждений на месте: нет (исправлено в этом чате: «E/Q пульта ходят только по 4 вкладкам» — в карте игры и плане 48).
> Игра закрыта, замок снят, всё запушено (KUMM `43b54c7`+, пак `d85dfbe`). Сделано за чат — блоки UPDATE ниже и NOW: пустой хаб при быстром переключении,
> значки EoT на «Параметрах», строка мини-карты, «E Взять» (подложка, 10/с, фейд 0,1), новый мод KrinikConanLocomotion (удар мечом в прыжке), «пляска» хаба,
> рамка лута мгновенная, подсказки Inventory Compactor, значки еды в хабе, загон Emberlight, правило 30 (владелец за клавиатурой → без ввода).
> **ПЕРВЫМ в следующем чате:** тени пальм (баг 67). `[OWNER]` 2026-11-07 12:59 «ТО ЕСТЬ - ТО ЖЕ САМОЕ, что было месяц назад? И опять нахуй будут тени пальм мерцать
> из-за перерисовки кеша?!» — мелкая ступень солнца НЕ его цель (это компромисс со скачками); цель — плавное солнце без мерцания: путь B исследования
> 2026-11-06 (`researches/conan-shadow-flicker/2026-11-06_vsm_foliage_recon.md`) — в ките плавная смена двух направленных источников ≈0,5 с на каждом шаге света
> (сначала найти, какой блюпринт поворачивает свет: `BP_TimeOfDayManager` в ките, UDS-небо, вероятно, в ProtectedAssets); потом ролики с `hdr.ps1 off`;
> **проверка веба 13:02 (по просьбе владельца):** «ступени не дают всех трёх» верно ЛИШЬ при запрете перерисовки каждый кадр; Fortnite даёт плавное солнце
> перерисовкой тени солнца каждый кадр (без кэша, ≈½ разрешения) — это путь A' к замеру; «мерцание от поворота сетки» — МОЙ вывод, источником не подтверждён;
> другие кандидаты мерцания листвы на VSM (форум Epic): контактные тени источника, Two Sided Foliage, TSR на листьях мельче пикселя, LodBias −1; «смена двух
> источников» в Skyrim — не подтверждено (известно только: шаг + переход `fSunShadowUpdateTime`). Сначала дискриминирующие замеры, потом решение;
> `[OWNER]` 13:04 «можно так переделать пересчет листьев пальм, чтобы на мелких углах повората солнца ЛИСТЬЯ НЕ ПРЫГАЛИ ТУДА СЮДА, не скрывались и показывались!!! ·
> Повысить строгость их показа!» → рычаги: (1) мельче тексель солнца `ResolutionLodBiasDirectional`/`…Moving` −1.5 (игра Cine) и −2.0 (у нас −1.0 — грубее игры)
> — ПЕРВЫЙ замер; (2) порог маски листа в тени (материал/ассет); (3) тень-прокси пальмы (Fortnite), ассет в ките; выстрел из лука в прыжке настоящими кнопками
> (Locomotion M6); рамка лута R3 (последний предмет ряда). Перед любым вводом — `powershell -File D:/work/ai_sandbox/_tools/owner-idle.ps1` (правило 30).
> Диск D: 93 ГБ свободно; кандидаты на удаление — решение владельца: `_text-extract-3.0.1` 20 ГБ, два комплекта выпуска 0.9.0 по 13 ГБ, `_bench` 9 ГБ, Svarog 24 ГБ
> (рабочие деревья агента — жёсткие ссылки, место не освобождают).
> **UPDATE 2026-11-07 12:2x:** (5) DONE — Inventory Compactor's two buttons show the game's dark tooltip (`krinik_ui_fixes` 1.7.0, notes `InventoryCompactor.md`);
> (7) DONE 12:30 — the Emberlight pen in Russian (pack `d9964dd`). (6) DONE — eating / drinking in the hub: the gauges poll at once and animate 0.1 × dilation (`krinik_pause_in_menu` 0.17.0; the stat itself rose at once, the
> gauges lagged ≈ 10 s + 3.3 s); pack `2856384`, report `2026-11-07_conan-compactor-tooltips-and-eating-gauges.md`. Queue empty of the owner's items → NEXT: palm
> shadows re-shoot (bug 67: HDR off, `SetTimeOfDay` per clip), the bow's air shot by real input (Locomotion M6), quick-loot R3.
> **UPDATE 2026-11-07 12:1x:** (1)–(4) DONE and pushed — KrinikConanLocomotion in the build (pack `158b186`, melee M1–M5 pass, the bow's air shot by real input open),
> «E Взять» timing (P1), the hub dance (D2), the quick-loot rim instant with `krinik_loot_rim` off (pack `543b0ef`, R1/R2 pass, R3 open). NEXT: (5) the bag-header
> tooltips, (6) eating under the hub's slow time — IMM_WAR overrides `BP_HungerSystem` / `BPGameItemFood` (recon the restore rate first). D: — 93 GB free; the agent's
> trees (`D:\Temp\claude`, `_paksview-*`) are hard links (free ≈ 0 if deleted); the real candidates (`_text-extract-3.0.1` 20 GB, the clean copy 59 GB) are the owner's call.
> **NOW 2026-11-07 ≈11:00 +03:00 — chat of 2026-11-07 (second), `/dayloop` (the owner's «работай автономно» 10:12), the owner's queue in order:**
> DONE + pushed (pack `f59a5a2`, KUMM `b3f6ce0`): the empty hub on fast tab switching (38 of 38 bursts), EoT icons on «Параметры» on time, the minimap row on our
> «Карта», the «E Взять» backing under E (alpha 0.45). IN WORK (deployed, under test): (1) `KrinikConanLocomotion` — the new mod (HOUSE_RULES 19): jump
> shooting moved from Archery, the run/jump growth from Gameplay (its Lua half gone), melee — one swing in the air (`krinik_air_combat`); (2) «E Взять» checks
> 10 / s while shown, fade 0.10 s; (3) the hub's middle «dances» on item select — `CraftingGUI` ScaleBox content height followed the item (fix: `SizeBox_2`
> fixed height at birth, `krinik_ui_fixes` 1.6.0; live A/B shift 2–3 px → 0; a 1 px «Прочность» residual inside the details panel to read). QUEUE: (4) the
> quick-loot rim — no animations, instant moves, then drop our hide-the-rim patch (`krinik_loot_rim`) if the last-cell jump is gone (the owner 10:57);
> (5) the two bag-header tooltips («Выберите стопку…») in the game's tooltip look (10:58); (6) eating / drinking in the inventory raises hunger / thirst
> slowly under the hub's world time 0.03 — fix «по аналогии, как исправляли по крафту» (10:59–11:00); then palm shadows re-shoot (bug 67), the Emberlight pen.
> ⚠️ **Чат 2026-11-07 закрыт принудительно 2026-11-07 09:46 +03:00 на 85 % окна: церемонии пропущены (проход судьи, обрезка STATUS, README, линтеры витрины) —
> долг платит первый /end-chat-soft.** Ложных утверждений на месте: нет (исправлены в этом же чате: «наша страница характеристик не привязана к герою»,
> «мод мини-карты держит одну строку», выдуманный хеш пака — во всех местах). Игра закрыта, замок снят, всё запушено.
> **ПЕРВЫМ в следующем чате:** (1) загон Emberlight — таблица готова `ConanExiles/_config/localization/asset-strings/Emberlight__W_AnimalPen.tsv`, нужна
> строка `krinikBuild` для Emberlight в `modpack.json`, сборка пака (как у Ironlight, `games/ConanExiles/mods/Emberlight.md` «Open»), выкатка, кадр
> `walk-mod-windows.sh <dir> W_AnimalPen`; (2) проверка пути игрока для контроллера хаба — ждёт слова владельца об игре впереди (раздел «Awaiting»);
> (3) обход остальных окон модов из `_config/compat/ui-overflow-candidates.tsv` тем же циклом (EXP-0478).
> **NOW 2026-11-07 06:47 +03:00 — chat of 2026-11-07, `/dayloop` (the owner's «Работай автономно» 06:24), plan 48:** the v4 crash CAUSE found — a stale Lua ref to a page the
> game destroyed (each native «Параметры» activation kills other stats windows); v5 keeps pages by name (27 switches, 0 crashes). **v7 = the mixed controller
> (pack `aec1471`, `hubswitch/shadow-pages-v7.lua`):** our own pages for 7 tabs, the game's own «Снаряжение» and «Параметры» held invisible until quiet (the game
> tolerates no second inventory or stats window — v6, v8 closed the hub); 13 switches over all 9 tabs, 0 crashes, every frame the right page complete; per-tick
> probe — one page per tick on 9 of 11 transitions, a direct click between «Снаряжение» and «Параметры» shows 3–4 ticks of bare world (open). Report
> `testcases/reports/2026-11-07_conan-hub-controller-shadow-pages.md`. **v9 (pack `1d97341`) adds the lifecycle:** our pages collapse when the hub closes (event
> checks on Esc/Tab/ActivateModule, no timer), back on reopen — 3/3 by the remote. **v10 (pack `45dfa04`): lazy build** one page per tick, nearest first
> (max 77 ms per page, in the hub); RAM flat over 5 cycles → pages kept until the world is left. **IN THE BUILD since 07:35 — section `krinik_hub_controller`
> of KrinikConanUI (pack `374b90d`, deployed; `692460f` — idle while the hub is closed, 2 open/close cycles 0 errors):** one page per tick on every probed
> transition, the minimap row on our «Карта», 0 errors; bug 64 item 15 → 🟡. Also this chat: bug 79 respawn case passes (no freeze); `pult.sh` works by an
> absolute path (pack `42fc264`). NEXT: the player's
> path with the game in FRONT (real clicks, Esc/Tab, 144 fps recording — the owner's word needed: the game was ordered background-only); the minimap
> helper's «Свои маркеры» click on our map; DONE 08:49: our Lua mods cost within the flight noise (A-B-A-B, CPU −0.06 ms, report `2026-11-07_conan-our-lua-mods-cost-abab.md`) — the build's +0.9 ms is the
> paks'; next: by pak groups. Bug 64 item 21 (Damage Meter window) seen fixed at 4K 08:51. **Item 27 (Accessory System «Снаряжение EAA» tab) partly fixed 09:00**
> (pack `f007d6e`, legend pass 2 `4cf0340`: captions «(торговец)» / «(админ)» fit, the legend in 12 short lines inside its panel bar the last ≈ 7 px; left — gem letters' font); the window
> opens by the remote (game map, `acs_WardrobeGUI`). Queue (guide's 1.0.0 list, item 13): mod windows from `_config/compat/ui-overflow-candidates.tsv` by frames —
> the thrall stats panel needs a thrall stand first. **09:0x–09:12 two walks of 12 mod settings windows** (report `2026-11-07_conan-mod-settings-windows-walk.md`):
> fixed Al-Merayah labels, «Сохранить» buttons, Emberlight farming descriptions (pack `291942b`); Pickup+ hint FIXED 09:19 (the translation stitcher lost
> sources with «|», pack `38e806c`); open — Ironlight admin headers and buttons FIXED 09:28 (culture-invariant FText — an asset edit, pack `6413000`); EAA enchanting buttons
> fit (pack `4596f3a`, walk 3 of the EAA windows 09:30); walk 4 — the EAA admin menu Shift+V line fixed 09:38. Walk 5: the minimap marker line fixed 09:43; open — the Emberlight animal pen's English words (bug 64 item 13).
> ✅ **Chat of 2026-11-06 (fifth) soft-closed 2026-11-07 00:32 +03:00 by the owner's word (00:30, «завтра продолжим»).** The debt of the two forced closures of 2026-11-06
> is PAID: STATUS trimmed (89 lines to the chronicle), experience lint 0 findings, attribution lint 0 new (bug 67 line marked), budget gate passed, engine
> syntax + 4 core tests green, the chat's claims re-checked (deployed KrinikConanUI = build 2, test mods removed, modlist and settings restored, pushes in sync).
> **FIRST next chat — plan 48 (our hub controller), the game ONLY in the background, `pult.sh` exit 4 = stop:** bisect steps (f) show our W_Attributes alone,
> (g) our FeatWindow → our W_Attributes by opacity + next-tick visibility without a native switch, (h) the same with the switch — then v5 of
> `hubswitch/shadow-pages-v4.lua`; after it holds 9 tabs: the mods' adapters by the API (inventory in plan 48), the lifetime by RAM, real clicks (front, ask).
> **NOW 2026-11-06 22:03 +03:00 — chat of 2026-11-06 (fifth), the owner's three orders 21:01 («делаем сборку конана» · «чиним переключения страниц на хабе» · «тестируем E
> Взять над кустом с трупом»):** (1) **hub dark wave REMOVED** — vanilla `W_Carousel.AnimBackgroundFadeOut` (0.5 s mask slide) made instant in the
> KrinikConanUI kit pak (pack `850f57c`); build 1 lost the see-through «Снаряжение» (exclusive range end — `[OWNER]` 21:30 «мне не нравится»), build 2 fixed it;
> W1/W2 pass, vanilla control proves it. **The 2–6 frame page assembly is VANILLA** (same with the hub slowdown off and with no mod paks) — waits for the
> owner's choice (asked in chat): leave it, or hide each new page until it is built (a short empty backing instead of the assembly). Report
> `testcases/reports/2026-11-06_conan-hub-instant-switch.md`, bug 64. (2) **Bug 80 DONE** — a real E over a corpse in a bush opens the corpse, «E Взять» never
> shows with the strip (report `2026-11-06_conan-bush-corpse-real-e.md`). Stand rule: wait out the «Обновляется каталог обликов» plate before a run
> (`[OWNER]` 21:30). Game closed, lock released, HDR on.
> **The owner chose 22:10 (bug 64, verbatim):** the old page stays until the new one is complete, then one frame — **plan 48**. Prototype (remote, not in the
> build) holds the new page invisible until no widget is born → the late assembly gone on 7 of 9 tabs; to/from «Снаряжение» the bare world still shows 50–160 ms
> (3 tries — stop). **The owner 22:57: fix the CAUSE** — the game rebuilds each tab window on every visit; a live `IsPersistent` edit at the main menu is
> too late (22:59); set at the controller's birth (23:09) it keeps the windows, but each page still rebuilds its content on every show. The owner's design
> 23:07: lazy background build of the other pages, nearest first; lifetime by a RAM measurement (23:18). NEXT: what each page re-creates on activation, then
> the lazy build — plan 48 «Progress».
> **NOW 2026-11-07 00:24 +03:00 — `/dayloop` (the owner's order 23:53, game ONLY in the background — his word 23:32; verbatim in plan 48):** the owner decided OUR hub
> controller + a standard API for the other mods' hub UI (plan 48: API draft, inventory of 8 embeds). Proven: our code builds complete pages
> (`WidgetBlueprintLibrary:Create`); a page kept in the viewport shows with 0 rebuilds; the native switch rebuilds heavy pages even when kept → our controller
> shows its own instances (shadow pages). The shadow prototype CRASHES the game on the first switch in a clean game (reproducible); the bisect found one crash
> rule (`SetVisibility` inside `OnChildActivated`) and narrowed the rest to the first native opening of a page with our instance + hooks present — NEXT
> step in plan 48. **HOUSE_RULES 29 (new, the owner's word 00:03):** `pult.sh` exits 4 on a dead game; every series ends with `|| break`. Review folder 70 — the «Снаряжение» switches ×15. Tools
> `ConanExiles/_config/hubswitch/` (`hub_run.sh <tag>`, `hub_switches.py`).
> **The blocks of the 2026-11-06 chats 1-4 (forced closures of the third and the fourth, the q8 correction, the dayloops of 09:05, 12:46, 19:20, bug 67, the music mod, interview #034, plan 45 steps 1-3, Nexus quarantine) - moved verbatim to the chronicle, entry 2026-11-07 00:33 +03:00.** Still open from them: plan 45 step 4 onward (boss / elite spawns) and kinds 8-12; bug 67 palm shadows (re-shoot with hdr.ps1 off + SetTimeOfDay; build stays 2.0/-1.0); KrinikConanMusic death scene M7 with bug 79 cases (respawn, dungeon, waystone); q8 Nanite B data; G4 boss ghost by the thrall conversion path; Nexus ticket 276571 follow-up letter (the owner sends it); Northern Timber - the owner decides.
> **The 2026-11-03 chat blocks (cb012770, ce994c74, the 1.0.0 resume of 19:51, the Nexus publication of 19:05) and the 0.9.0 release pointers — moved verbatim to the chronicle, entry 2026-11-06 12:34 +03:00.** Still open from them: nest eggs (bug 82), a real E over a corpse in a bush (bug 80), the rim on F done properly (bug 75), the rest of the guide's 1.0.0 list; Nexus — ticket 276571.
> **Older pointer blocks (2026-10-26 … 2026-11-02: chat FIRST lists, the 1.0.0 orders, plan 35/36/34 queues, the measurement queue) — moved verbatim to the chronicle, entry 2026-11-03 20:58 +03:00 (second part).** The live backlog: the guide chapter «Известные проблемы и планы на 1.0.0», epics `plans/40_…` and `plans/41_…`, `plans/36_…` (W table), `plans/35_…`, `plans/34_…`; work trees `_paksview-3.0.1` (66 GB) and `Conan Exiles Mods/_text-extract-3.0.1` (20 GB) stay.

## Open bugs

Files without the DONE tag — 29 (2026-10-18 13:45):

- 🔴 `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` — the UI of the Conan 3.0.1 build's mods, 26 items: open 4, 5, 6, 12, 13 (partly),
  15 (🟡 hub controller in the build), 16–18, 23 (EAA class cards — text in textures), 26 (late emblem in the hub); closed by a frame 2, 3, 7, 21 (4K, 2026-11-07), 7b, 8 (again 2026-10-31 at 1080p, list 540), 9–11,
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
