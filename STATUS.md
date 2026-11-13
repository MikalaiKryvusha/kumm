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
> 🆕 **Conan 3.1.0 is out (2026-11-12, Part Three of the Giant-Kings arc); THE MOVE IS UNDER WAY since 2026-11-13 18:52 — `plans/53_conan_move_3.1.0.md` (the build still runs on 3.0.1 until it is accepted). Downloaded by the owner (his word 2026-11-13 14:13 +03:00)**
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
- (done) **2026-11-10 12:49 +03:00 — the look of the corruption «+» hover label (bug 91), the owner's pick of four** — review folder `НА ОТСМОТР НИКОЛАЕМ/81_podpis_oskverneniya`
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

> **NOW 2026-11-13 20:0x +03:00 — THE BUILD RUNS ON 3.1.0 (pack `ff30fb9`, plan 53).** Target `D:\Games\Conan Exiles 3.1.0` (a junction onto the owner's download
> folder — its name stays out of git); deployed 75/75, UE4SS 1181 on the new exe, main menu Revision 383,024 in Russian, «СБОРКА: моды 66/66» (the 3.1.0 log format
> fixed in KrinikConanModPackManager), the owner's world `Game_1` + mod saves + his `config.lua` files copied from 3.0.1 (hash-checked), world entered three times; no
> «too old», no missing imports. Machine lock released, no game of mine open. **NEXT (in order):** (1) DONE 20:05 (the camera records at the HUD's birth, «вернули 10» right after loading; owed C4 draw, C6 frames) —
> record at the HUD's birth (bug 98, notes «Open»); (2) DONE 20:07 (in game not yet seen) rebuild the 4 patched mods on the new originals — `rebuild-krinik-paks.py --only <C> --against-original`
> (SevereWeatherEnhanced, No_Building_Placement_Restrictions, IMM_WAR, EnhancedArmoryAndArsenal; the 3.1.0 view needs `Saved/ExtractedMods` — exists now);
> (3) the 11 vanilla assets the patch changed under mods' whole copies (`_config/patch-rollback.py`, list in plan 53 step 5): our `M_Foliage` (KrinikConanGraphics),
> EAA's `BP_PL_Crafting_Station` (3.1.0's crafting-queue fix), LegitReligious' stat table, Storage Reach's console table, LBPR (after its rebuild), map tiles of
> Shemite / Ymir's / Caverns of Set — judge each by `researches/mod-reconciliation/GUIDE.md` kind 6; (4) the «3.0.1» under our menu logo → a KrinikConanUI kit
> rebuild (`kit-conanui-edit.py` game version); (5) Pickup+ admin widget error new in 3.1.0 (`ComboBox_DrawDebugline` class missing); (6) UE4SS v4.0.0
> (`mods/_incoming/UE4SS_v4.0.0`) as its own step; (7) judges' open findings in the pack commit message (B2 journal, B3 per-asset proof, B4 level-mod view).
> **NOW 2026-11-13 19:1x +03:00 — DAYLOOP (the owner 18:52 «комп твой, работай автономно. Замерами не занимаемся, занимаемся развитием сборки»): the move onto 3.1.0, plan 53.**
>   - 3.1.0 = `CL-383024`, installed IN PLACE in the owner's download folder `D:\Instals\<…>` (his 18:53 word; the name stays out of this repo, it is in the pack's
>     `targets.json` once set) — still being written at 19:1x (files newer than 2 min); deploy only when it stops.
>   - Step 1 done: 12 Workshop mods newer than our copies (4 KRINIK MODIFIED: Severe Weather, LBPR, Immersive Warriors, EAA — recipes to re-apply); steamcmd into
>     `D:\Games\Conan Exiles Mods\workshop-3.1.0` running (9 of 12 at 19:10). Nexus 6 of 6 unchanged. UE4SS v4.0.0 downloaded to `mods/_incoming/UE4SS_v4.0.0`
>     (a separate step after the first launch on 1181). The late-class fix in KrinikConanUI (`find_loaded`, hub controller) — written, `[NOT-TESTED]`, cases L1–L6.
>   - **The owner 18:57: D:\Temp is HIS folder** — the agent's work only in `KUMM\.work\` and the pack's `_scratch\` (HOUSE_RULES rule 15; 15 pack tools retargeted,
>     pack `3010045`); this session still has `TEMP=D:\Temp` — set `TEMP`/`TMP`/`TMPDIR` to `.work/tmp` in commands; the harness itself keeps background-task
>     output under `D:\Temp\claude\…` (not ours to move mid-session; the new `env` in `settings.local.json` applies from the next start).
>   - Judges running on the 17:xx code (camera shadow, pickup plate rounds 3–4, game-front `-OwnerAsked`; the owner-presence hook redesign) — then commit.
> **NOW 2026-11-13 16:2x +03:00 (chat after `resume`, the owner's «продолжаем делать сборку Конана"):** the game PID 30492 (launched by the previous chat «for his check»)
> was held open for an hour by mistake — closed 17:04 by his word «ты игру открыл, ты и закрывай, игра у тебя в разработке» (memory `dont-kill-game-owner-is-in`); lock released.
>   - Bug 75 REOPENED (the owner 16:07): the 2026-11-07 instant `AnimSelect` is in the deployed pak — another path; the read-only `quickloot-rim-trace.lua` is loaded
>     into his game (`grep '\[QLR\]' UE4SS.log` — 0 lines at 16:23, he took nothing yet). Next: read his takes once, else my own stand (R3 + variants) when his game closes.
>   - Bug 98 filed (first-person shadow): flags read (all visible parts cast; camera mode unknown) — stand when the game is mine. Bug 97 read: the game's design (feats /
>     levels), one check left on his hero (feat 6 «Archer» known and the Archer journey still locked = a defect).
>   - Plan 52 step 3 needs a live recon of the bow wield / sheath event (plan 52 step 3 note). The owner 16:25 asked for the head + neck SHADOW without them in the
>     first-person view — the way: `researches/first-person-body-camera/README.md` §4 (owner-no-see + hidden shadow on the head parts; first read `FirstPersonPrimitiveType`).
>   - Owner-presence hook: rounds 1–2 refuted the text-guessing pass → redesigned BY QUOTE (the agent writes his verbatim words into `tools/hooks/.owner-ask.txt`, the
>     command carries `-OwnerAsked`; the hook checks the words stand in his last human message < 20 min) + the git-chain and enter-world gaps closed; part M 27 cases,
>     211/211; round 3 running → then commit KUMM + the pack's `game-front.ps1`, `launch-fg.ps1` (`-OwnerAsked` param), `fp-shadow-flags.lua`, `pickup-cost-parts.lua`.
>   - `krinik_pickup_prompt.lua` (bug 96): rounds 3–4 applied in the working tree (not committed, not run in game); bug 99: 0.6 ms a check once a second — the «over
>     budget» reading RETRACTED 17:1x (the owner was right; other sections show the same 2–3 ms worst readings; HudBlink costs 3× more). Next: judge round 5 → commit; then bug 75, bug 98, plan 52.
> ⚠️ Закрыто принудительно 2026-11-13 16:06: церемонии пропущены (проход судьи, обрезка STATUS, README, линтеры витрины) — долг платит первый /end-chat-soft.
> Ложных утверждений на месте: нет.
> **16:05 the owner's order** (`[OWNER]` «ПЕРЕДЕЛАТЬ ХУК!!!!!!!» · «он должен быть тебе помощником, а не препятствием!» · «я тебя явно попросил запустить мне игру, а хук
> тупой не понимает этого!»): `tools/hooks/owner-presence.mjs` lets `launch-fg` / `game-front` through when the owner's LAST chat message asks for the game (it reads the
> transcript); `ConanExiles/_config/game-front.ps1 -OwnerAsked` skips its own presence check (pack, uncommitted at the close — commit it first). Seen working 16:06: the
> game (PID 30492, launched 16:04 for the owner's own check) brought forward. The owner checks the build himself and gives feedback in the next chat — the game
> stays OPEN for him (his run now); machine lock «kumm» until 17:04. Owed: a guard self-test case for the new pass (`tools/test-guards.mjs`).
> **The owner's note 16:06 (his own frame, first person, the bow held):** `[OWNER]` «от стрелы тень есть, а где от всего остального?» — the arrow casts a shadow, the
> arm, the bow and the body do not (the remote read 2026-11-13: the hero's mesh components carry `bCastHiddenShadow=false`, the head is hidden). Recon next chat:
> first-person shadow of the hidden / owner-only body parts (UE `bCastHiddenShadow`, the game's first-person shadow setting) — bug doc to file.
> **The owner 16:07:** `[OWNER]` «по окну квиклута баг сохраняется, что рамка првыгает в последнюю клетку» — the quick-loot selection frame jumps to the last cell
> (the open item «quick-loot R3 (last cell of a row)» of the 2026-11-07 handover) — still live in his play; a bug doc + a fix in the next chat.
> **The owner 16:08 (his frame, first person, the bow held, looking straight up):** `[OWNER]` «что это слева на экране, когда камеру вертикально вверх поднимаешь?» — the
> hero's own shoulder / neck base from inside (the combat pose's full bend; KrinikConanCamera hides only `b_neck_1` and below — the shoulder is the torso mesh). Same
> root as bug 95 (B10 baseline frames); plan 52's spine counter-bend is the fix to verify with this exact view (case B10 on the post-process route).
> **HANDOVER 2026-11-13 16:0x +03:00 — this chat closes at ≈ 83 % context. FIRST next chat:**
>   1. Plan 52 step 4 — the post-process look is BUILT and DEPLOYED (archery pak 1.48 MB: sound + montage + `ABP_KrinikFirstPersonLook`, NO vanilla anim override) and
>      seen working live 16:00: `_config/fp-look-pp.lua` sets it on the hero only (`LoadAsset` needs the FULL object path), `PitchNow` follows the view, `Alpha` blends,
>      third person with it attached and off — no bind pose, log 0 anim errors; first person −55 with `Active` on (Alpha 0.58 mid-blend) — the bow hand 49° (vanilla 78°).
>      The frame was blocked by the «Снаряжение» window that opened by itself at the world entry (closing it by `ActivateModule(...,false)` failed — close with a real
>      Esc when the PC is free). NEXT: full-alpha frames −55 / −80, tune `NeckShare` / `EyeX/Y/Z` live (the eye axis unknown — try 8 cm on each), third person + NPCs +
>      the log again, then step 3 (KrinikConanArchery Lua: set the PP class at the hero's birth, `Active` on events: first person · bow in hand · no draw), then ONE HTML
>      page with captions to the owner (rule 32). The kit's active mod is KrinikConanArchery.
>   2. Bug 97 (new, the owner 16:01): journeys locked after the tutorial except fishing — design or a mod: recon first.
>   3. Bug 96 round-2 fixes are tested in game (TC run 4) — pack Lua committed with this closure, the quiet-machine cost number and a fresh judge round on the diff OWED.
>   4. The owner downloads Conan 3.1.0 — the move checklist `researches/conan_patch_3_1_0/README.md` §3 when it lands.
> **NOW 2026-11-13 15:0x +03:00 (chat after `resume`, the owner's «делаем конана»):**
>   - Bug 95 option B — the kit edit FOUND after a bisection (`_config/devkit/kit-ab-fp-upright.py`: a member `KrinikFirstPersonUpright` set in `BlueprintUpdateAnimation`
>     behind `Branch(isThirdPerson OR isNPC)`, the first-person selector reads it; the enum via `Conv_ByteToInt`, EXP-0510); the saving run + the archery pak cook were
>     running at 15:0x (kit active mod = KrinikConanArchery — put `active.txt` back to KrinikConanUI after). Next: deploy, cases B1–B10 (TC `TC_conan_fp_bow_visible_…`).
>     The owner's question 15:00 answered: no mod hides the bow or the arms (live read); the neck hiding of bug 69 is a crutch over the same full-bend combat pose.
>     15:14 BUILT + deployed (pack Lua/pak NOT committed yet): the bow in the frame looking down (B1–B3, B10 pass). The owner 15:19–15:22: the camera looks down from the
>     head's centre — not real; recon `researches/first-person-body-camera/`; his pick A (body, eyes forward, neck bends) or B (arms + weapon only) — review folder 84.
>     **15:25 the owner picked A; 15:26 he saw the heroine in a T-POSE — the parent override broke the child anim BPs (EXP-0511); ROLLED BACK 15:27 (archery pak = the
>     2026-11-02 build, verified by a third-person frame; the kit's archery folder cleaned of the override and its cook line).** Now: plan 52 — our own post-process anim
>     blueprint on the hero's mesh only (`SetOverridePostProcessAnimBP`); step 1 kit recon running 15:3x. Shows go as ONE HTML page with captions (HOUSE_RULES rule 32).
>     **15:4x step 2 in flight:** `_config/devkit/kit-pp-fp-look.py` (trial run without save; `KRINIK_PP_SAVE=1` saves + adds the cook line) builds
>     `/Game/Mods/KrinikConanArchery/ABP_KrinikFirstPersonLook` (Input → L2C → spine counter (Roll = Pitch × SpineUndo) → neck (Roll = −min(Pitch,0) × NeckShare) → head
>     eye offset → C2L; `Active` set by Lua on events, `Alpha` blended in its EventGraph from the main anim's native `Pitch`). Then step 3: KrinikConanArchery Lua sets
>     the PP class on the hero + writes `Active`; step 4: cases C1–C5 (third person + NPCs + the log FIRST), tune live, ONE HTML page to the owner.
>     Kit active mod = KrinikConanArchery (`active.txt` back to KrinikConanUI when the archery kit work ends). Game closed. Machine lock «kumm» until 16:07.
>   - Bug 96 judge round 2 — applied and run (TC run 4: F1 real E, F3, F4, R3, R5 pass; differential SAME 24); finding 5 refuted (the cameras read inactive between
>     inputs). Owed: the quiet-machine cost number, then the commit (pack Lua not committed yet).
>   - The game of this chat (PID 10568, background) stays open for the bow cases; machine lock «kumm» until 15:26.
> **HANDOVER 2026-11-13 11:08 +03:00 — the dayloop chat of 2026-11-13 closes by the owner's word (`[OWNER]` 11:06 «тот чат закрывай, в новом продолжаем»).** DONE:
>   - **Bow sprint in the owner's order (bug 93) — WORKS by his own play (open cases remain)** (`[OWNER]` 11:01 «спринт и стрельба работают»): build 7 of `krinik_bow_sprint.lua` (the gate
>     open from substate 11; a third lever tried and removed), S1b, S3, S6 by real input (report `testcases/reports/2026-11-13_conan-bow-sprint-sprint-then-draw.md`),
>     5 judge rounds, pack `d3e92f9`. Open: S8 overloaded, S9 sheathed bow, the cost (worst callback 2 ms at a 1 ms clock step → a frame-time A-B).
>   - **Conan 3.1.0 recon** (out 2026-11-12, not downloaded): `researches/conan_patch_3_1_0/README.md`, §3 = the move checklist (`[OWNER]` 11:02 «за разведку 3.1.0 спасибо»).
>   - **Nexus quarantine — the third letter** written and SENT by the owner (11:02).
>   - KrinikConanUI: placeholder-perk widget hooks only with the placeholders on (pack `ca3cdef`); the page arrows' generator in Conan gold (pack `d6c2897`).
>   - The evening chat of 2026-11-10 left its work uncommitted — committed this chat (KUMM `02571b3`, pack `d3e92f9`).
> **HANDOVER 2026-11-13 13:30 +03:00 — chat force-closed by the owner's word (`[OWNER]` 13:29 «этот чат пора закрывать через минут 5, продолжим в новом»).**
> ⚠️ Закрыто принудительно 2026-11-13 13:30: церемонии пропущены (проход судьи по передаче, обрезка STATUS, README, линтеры витрины) — долг платит первый /end-chat-soft.
> Ложных утверждений на месте: нет.
> FIRST next chat: (a) bug 95 option B — read `ConanExiles/_config/devkit/kit-probe-ab-fp-look.json` (the kit probe started 13:28 in the background, read-only;
> if the file is missing or `"ok": false`, re-run the command in the script header under the machine lock) → the AnimGraph node that bends the upper body by
> `…FirstPersonAgressive` and what selects Passive vs NotPassive → the smallest native kit edit → build → first-person frames looking down (TC
> `testcases/TC_conan_fp_bow_visible_2026-11-13.md`). **The probe's first run ended 13:31: `"ok": false` — the AnimGraph has 492 nodes, 5 watched getters were
> found, then a traceback at script line 75 (inside the downstream walk `hop`) — read the traceback in the JSON, fix, re-run; the lock is released;** (b) bug 96 judge ROUND 2 DONE 13:3x — no defect; 4 risk/quality findings recorded in `bugs/96_…`
> «Judge round 2» (the cost reorder first) — verify, apply, re-run F1–F5 + a many-hit cost measurement, then the owner's play closes the bug; (c) then the handover list below from item 2. The machine lock «kumm» expires by itself at 13:48; the game is closed.
> **Done this chat (2026-11-13 11:46 until the close):** bug 96 fixed (below); bug 95 cause found and option B chosen; bug 74 twin-checked (eggs spawn no actor);
> KUMM `5423161`, `1a0c2a6`, `439e990`, `8e00173`, `e28f31a` + the closing commit; pack `26f4cfa` + the probe script commit.
> **Bug 96 (was NOW 11:46):** FOUND and FIXED, pack `26f4cfa` pushed and deployed: a pickup bush touched once by E becomes a
> `BP_ResourceActor_C` with the same look, E keeps gathering from it, and the plate asked only the foliage probe; `krinik_pickup_prompt.lua` now asks the game's
> actor branch first (`GetIsPickupResource`). Runs 2–3 pass (`testcases/TC_conan_no_take_prompt_bush_2026-11-13.md`, report
> `testcases/reports/2026-11-13_conan-bush-prompt-resource-actor.md`); review folder 83 holds the 4K frame. Judge round 1: 9 findings, all fixed; **round 2 OWED** —
> two fresh judges failed to start (API 403, 12:4x); the bug closes DONE after a clean round 2 and the owner's play. Open there: F6 (a tool-hit resource actor).
> **FIRST next chat (in order; the owner asked 11:06 «квик вины?» — offered: his two bugs first, then the «+», then quick wins; his pick decides):**
>   0. `bugs/96_…` — the owner's 11:09: no «E Взять» over a bush — see NOW above.
>   1. `bugs/95_…` — CAUSE FOUND 13:1x (the owner clarified 12:59: the HELD bow when looking down; the drawn one is seen): in the game's first person the upper
>      body pitches with the view as one piece, the held bow stays ≈ 75° below the frame's centre at every pitch — the game's design, not our mods; no ready mod
>      found. **The owner chose B 13:20** (upright upper body while the bow is held and not drawn). Recon so far (bug 95 «Recon of the anim blueprint»): `AB_human_male`
>      sets `AdjustForLookingUpAndDownFirstPersonAgressive` = the full view pitch, `…Passive` = 15 % of it; cached poses `FirstPersonPosePassive` / `…NotPassive`.
>      NEXT: a kit probe (`BlueprintEditorLibrary.list_graphs` / `list_output_pins` on the AnimGraph getters, method of `_config/devkit/kit-probe-bp-graph-api.py`)
>      → the bone-modify node and what selects Passive vs NotPassive → the smallest native edit → kit build → first-person frames looking down. Before: the lead is KrinikConanArchery's first-person arm shift (`fp_aim_offset` Y 16 Z 6, `fp_hip_offset` Y 24 Z 11) + the aim's
>      narrower view. Stand: the honest bow (game map «Stand gear»: the hero CRAFTS bow 51401; `AddItemTemplate` weapons cannot be wielded), the run direction along
>      the shore (game map «Sprint stand direction»). Frames first person, bow drawn, shift on vs off.
>   1a. The owner's wish 11:07 (relayed by KCCP, verbatim in `bugs/93_…` «The owner's next wish»): no aim zoom while sprinting with the bow — sprint first, then draw
>      still zooms (draw first, then sprint already drops it, and he likes that). Pairs with item 1 (both are the bow's first-person / FOV camera).
>   2. `bugs/94_…` — hub craft: the owner crafts in the «Снаряжение» column with «Сделать 10» / «Сделать много» (his frame 11:03); hypothesis 2 — one queue entry for the
>      whole batch reads the hub's 0.03 multiplier once; test by a real F in the open hub, `ConanExiles/_config/craft-close-test.sh` as the counter.
>   3. The «+» and the page arrows in Conan gold — one kit session (plan 49, the 2026-11-13 line).
>   4. Quick wins — `researches/ue5-guru-tweaks-2026-11/README.md` §2 ranked candidates (A2–A5, B1–B7), each by an A-B-A-B measurement (HOUSE_RULES rule 11 6b–6e).
>   5. From the 2026-11-10 handover (chronicle entry 2026-11-13 11:08 +03:00): the KrinikConanUI key binds (recon F1, a route choice), the wall jump at `desert_arch`, the simple melee air swing.
> Rules learned this chat (EXPERIENCE 0507, 0508): cases cover BOTH input orders; prove the stand gear by a control case before any conclusion; the owner-presence hook
> counts the agent's own `mouse-seq` input — wait ≥ 10 s between real-input calls; re-place the hero before each case and keep runs ≤ 3 s.
> State at the close: the game was left open for the owner (build 7); at 11:10 no Conan process ran — he closed it; the machine lock released; KUMM `HEAD`, pack `ca3cdef` pushed.
>
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
