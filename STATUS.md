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

> **NOW 2026-11-07 19:2x — chat of 2026-11-07 (fourth), `/dayloop` by the owner's word 18:56.** Bug 67 (palm shadows, a month) DONE — below. Game log after the
> deploy: no M_Foliage / shader errors; all 134 loaded foliage kinds are `M_Foliage` children — an olive tree (−132700, 202500) renders normally by frame 19:22. Open: a gameplay crash pass. Next in
> the loop: Locomotion M6 — the hero DID jump with the bow by real input at 19:24:59 and 19:26:00 (the mod's log «выстрел в воздухе разрешён»), remote Z probes are too slow;
> judge by that log line + a 60-fps clip. 19:37: draw + release by real input fired an arrow; the synthetic JUMP is unreliable (2 of ~7) — see the notes «19:37 result». Rule 30 hole closed (`input.ps1`).
> Then quick-loot R3, plan 45 boss spawns. Game running (background launch 19:14), keeper timer on.
> **FIRST NEXT CHAT — the owner's order 2026-11-07 20:50 (verbatim):** `[OWNER]` «сейчас стрелба откоючает спринт. В новом чате начнём с того, что продолжим делать мод
>   Локомодации. Спринт и стрельбу делаем возможными одновременно.» · «И откобчаем лимит на прокачку атрибутов. Делаем её бесконечной.» · «И она бесконечно будет по фотмулам
>   влиять на характеристики героя». So, in order: (a) KrinikConanLocomotion — sprint and bow shooting at the same time (now a shot cancels the sprint); (b) attributes without
>   the cap of 20 (the «+» stays); (c) every attribute keeps adding to the hero's stats by its formulas past 20 (read the game's per-point curves first — game map). Then bug 84.
> **THE OWNER'S QUEUE 19:48–20:00 (verbatim; his debt — FIRST, before the loop items):**
> 1. Bug 84 — TOP: the hub controller duplicates pages — the trait dialog under the attribute tree (19:48) AND the fullscreen map stuck twice 20:19–20:25 (two `W_FullscreenMap_C`,
>    the owner trapped; freed by the remote: map + carousel removed, game input). Control case (section off), then the fix; a game restart restores the hub.
> 2. `[OWNER]` 19:50 «я прокачал проворство до 20, и провал плюсик - это нужно убрать, так как прокачка у нас бесконечная» · «можно сколь угодно повышать дальше атрибут» —
>    attributes stop at 20 (the «+» disappears); the build's levelling is endless (KrinikConanGameplay: 10 000 levels) → attributes must rise past 20. Recon the cap first.
> 3. `[OWNER]` 19:50 «там сказано, что все стрелы летят вдвое быстрее. Это правда?» · «проверь, оно наше значение скорости умножило на два?» — ANSWERED 20:00 from the
>    Archery log: uncharged 2484–2499 cm/s before the trait «Верная рука», 4997–5004 after (×2); full charge ≈ 9960–9996. Whether to keep the ×2 — asked him.
> 4. `[OWNER]` 19:58 «при наведении прицела на такие камни, нужно показывать нашу плашку E · E Читать» — the glowing carved lore stones get our «E Читать» plate on aim.
> 5. `[OWNER]` 19:58 «тени пальм починили, но шейдер у камней и поверхностей (предположительно) такой же сломанный, требует переделки по аналогии с тенями листиков пальм» —
>    his frame: grainy / dithered shadow on a sand rock face; rocks have no WPO — a different cause to find (SMRT noise / self-shadow), same clean-stand method.
> 6. Disk D: was 100 % full 19:50 (commits failed); the owner deleted two games (14 GB free 19:59; 9.1 GB at 20:32 — something keeps writing). `_bench` 9.4 GB of old
>    recordings — waits for his «да» (classifier). The CLEAN Conan original in `D:Instals` is GONE (20:32) — `D:/Games/Conan_Exiles_3_0_1_clean_test` is now the ONLY clean copy
>    (HOUSE_RULES rule 25): never delete it; rule 25 must name it as the original. **20:41 the owner ordered deleted (verbatim list, «удаляй»):** `D:/Games/` Neverwinter
>    Nights EE, Gothic 3, Medieval Dynasty (2021) (the paused MD project has NO installed game now), For The King II, Oblivion Remastered Mods and Mafia II Mods (the mod
>    LIBRARIES of the parked packs — no git there; the packs in `D:/work/ai_sandbox` stay; a return needs a re-download).
> 7. `[OWNER]` 20:05 «с шеудером водыы, предположительно, похожая проблема, как и с шейдером тени листвы пальм - есть какая- то неестественная рябь, что-то то появляется то
>    исчезает» — his frame: fine sparkling speckles over the oasis water. Method: the clean stand, still vs turning sun first (sun glint / Lumen reflections re-evaluated
>    each light step?), then «what on the water does NOT sparkle». His frame is in the chat only (no file).
> 8. `[OWNER]` 20:12 «очень странно выглядят вдали входы в пещеры - как черное бельмо. Скала покрыта дымкой (полааю, шейдер) а этот черный вход словно не покрыт этой
>    дымкой - вероятно, баг» — a far cave mouth renders pure black, unfogged, while the rock around is hazed. Suspects: the cave-mouth blocker mesh with an unlit /
>    translucent material that skips fog; our pack Engine.ini fog settings (control: the game's default fog). Frame in the chat only.
> 9. `[OWNER]` 20:12 «отражение на воде в экранном пространстве, баг - за деревом белый след» — a bright streak on the water beside a palm trunk: the screen-space
>    reflection trace is occluded by the trunk and falls back to the sky. Levers to measure: Lumen reflections without screen traces (`r.Lumen.Reflections.ScreenTraces 0`),
>    the water's own reflection settings; check the cost (FPS) A-B-A-B.
> 10. `[OWNER]` 20:30 «посмотри, как идёт дождь сейчас» — read from a 2-s window clip 20:30: NO rain streaks visible; only translucent mist / splash puffs near the ground
>    that shift and change shape between neighbouring frames. Suspect: rain particles not drawn (or too thin at 4K / culled), only the ground mist sprites left — recon the
>    weather rain emitter vs our Engine.ini (particle / translucency cvars). `[OWNER]` 20:31 «тучка тупо над героем» — the rain comes from a small cloud fixed over the
>    hero (a hero-attached emitter), not from the sky. `[OWNER]` 20:31 «я много раз просил это исправить» — AN OLD DEBT: `plans/04_conan_ochered_zakazov.md` (2026-09-09, 2.2.3:
>    «дождь виден на больших отдалениях, появляется из воздуха; нужно сильно повысить высоту дождя» · «дождь всё ещё сломан»; mechanism there: the rain spawns in a BOX
>    around the player; the scene-capture theory refuted) — take it after bug 84, starting from that plan's section.
> ✅ **19:19 BUG 67 DONE** (`bugs/67_DONE_…`, report `testcases/reports/2026-11-07_conan-palm-shadow-wpo-bound-fix.md`): deployed by the build (`modpack.json`
> KrinikConanGraphics kind `pak`), fresh launch: bound 100, sun 0.0025, blink 0.14–0.24 % at wind 0.21–0.22. Guide line marked fixed. Open: a gameplay crash pass with the pak.
> ✅ **19:10 BUG 67 FIXED AND SEEN:** `KrinikConanGraphics.pak` (M_Foliage with `MaxWorldPositionOffsetDisplacement` 100 cm, kit-cooked) → turning sun 0.06–0.44 % blink vs
> 12–16 % before at the same wind; shadows sharp, wind on. Installed by hand in `Mods/` (before KrinikConanGameplay) + `_unpacked/KrinikConanGraphics/`. NEXT: the
> `modpack.json` entry (pak + modlist order) and a real deploy; Engine.ini sun 0.0025 deploy; a gameplay pass; the kit's `M_Foliage` stays modified (backup in the pack).
> **18:54 ROOT CAUSE FOUND (bug 67 «THE KEY»):** `M_Foliage.MaxWorldPositionOffsetDisplacement = 0` (palm MIs inherit) — Nanite leaf cluster bounds get no wind padding; a
> turning sun re-culls every frame and drops wind-displaced leaflets on some frames. The hero / trunk / rocks (no WPO) never blink. FIRST: set a real bound (≈100 cm) —
> live test, then cook `M_Foliage` with it in `KrinikConanGraphics` (kit route proven 18:40; WITHOUT the conservative patch), owner's eye. Test pak removed 18:52.
> **18:50 RESULT:** the conservative pak is IN THE GAME (`Mods/KrinikConanGraphics.pak`, modlist before KrinikConanGameplay — a test install, not in `modpack.json`): leaflet
> shadows visibly fuller, but the blink count under the turning sun did NOT drop (24–29 % at wind 0.23–0.25 vs 17–20 % before) — texel-centre sampling is not the main
> cause; the owner's eye asked (voice). If he sees no gain: remove the pak (file + modlist line; backup `scratchpad/modlist.before.txt` is temporary — the line to delete is
> `KrinikConanGraphics.pak`) and go back to the evidence: the blink needs a turning light AND moving leaves.
> ✅ **18:43 kit RESTORED** (shader sha256 `40b1c41c9f90a58dc0de…` again, `active.txt` back in KrinikConanUI) after the cook 18:40–18:42: `KrinikConanGraphics.pak` 1.18 MB
> (M_Foliage + `ShaderArchive-KrinikConanGraphics`, 123 shaders compiled with the patch, «0 error(s)») → `ConanExiles/_unpacked/KrinikConanGraphics/`. NEXT: install the pak
> (Mods/ + modlist), relaunch plain, A/B on the clean stand. The cook recipe (the kit state DURING a cook, corrected stamp — it ran 18:40, not «18:5x»):
> `F:/CEUE5Devkit/Engine/Shaders/Private/Nanite/NaniteRasterizer.ush` = the CONSERVATIVE patch (original in the pack
> `_config/devkit/engine_shader_patches/NaniteRasterizer.ush.orig`, sha256 `40b1c41c9f90a58dc0de…`; README there); the kit's ACTIVE mod moved from KrinikConanUI to the new
> kit mod `UE4/Content/Mods/KrinikConanGraphics` (`active.txt`; CookInfo cooks `/FLX_Materials/…/M_Foliage`); `kit-buildmod.py` learned plugin packages (`PLUGIN_ROOTS`).
> Cook: `python -I -X utf8 _config/devkit/kit-buildmod.py KrinikConanGraphics <out>`.
> ~~**FIRST next chat (bug 67):** the forced re-render with the light still blinks ×100 (16:26) → leaflets are lost by the shadow re-render~~ (refuted above) — test the Nanite cluster
> buffers (double MaxCandidateClusters / MaxVisibleClusters / MaxNodes, `nanitestats virtualshadowmaps`), the order in bug 67 and the recon
> `researches/conan-shadow-flicker/2026-11-07_leaf_shadows_fill_in_recon.md`; measure by `shadow_pop_map.py` on a 2-s window capture; the owner watches live. Game open (PID 49596) with live test values (throttle 0/0, pool 8192, Nanite 0.25, t.MaxFPS 144) — a restart returns the pack's values.
> **Blocks moved verbatim to the chronicle (entry 2026-11-07 19:28 +03:00):** the bug 67 handover blocks of 2026-11-07 14:47–19:19 (the bug is DONE) and the chat blocks of 2026-11-06 (fifth) … 2026-11-07 (second) (forced closures 09:46 and 12:43, the hub controller v4–v10, the dayloops of 06:24 / 10:12, the UPDATE lists). Still open from them: the hub controller player path with the game in FRONT; the minimap helper «Свои маркеры» click on our map; quick-loot R3 (last cell of a row); plan 45 step 4+ (boss / elite spawns); KrinikConanMusic M7 with bug 79 cases; mod windows of `_config/compat/ui-overflow-candidates.tsv`; the guide’s 1.0.0 list.
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
