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

> ⚠️ **ЧАТ 2026-11-06 ЗАКРЫТ ПРИНУДИТЕЛЬНО 2026-11-06 10:52 +03:00 по слову владельца** (`[OWNER]` 10:51 «закрывай чат» · «в новом продолжим»), контекст 84 %: церемонии пропущены
> (проход судьи, обрезка STATUS, README, линтеры витрины) — долг платит первый /end-chat-soft. Ложных утверждений на месте не осталось (поправленное за чат:
> «RepairXP — опыт за изготовление» — исправлено в карте игры и плане 09:55; «51420 — два предмета под одним номером» — исправлено в разведке и STATUS 09:34).
> **NEXT CHAT, FIRST:** plan 45 step 4 — the boss merge. The maps are written and pushed (pack `2a7ed07`): `_config/krinik_patches/Heritage__HeritageSpawnDataMasses.tsv`
> (45 `copyprop:` lines) and `…__HeritageSpawnDataUniques.tsv` (10) — BMNB's `ProfessionTemplate` / `StatTemplate` / `StatModifierTemplate` / `NPCClass` into
> Heritage's 17 boss rows. NOT built yet. Do: (1) `python -I -X utf8 _config/devkit/patch-mod-asset.py build Heritage HeritageSpawnDataMasses <work>
> _config/krinik_patches/Heritage__HeritageSpawnDataMasses.tsv _config/krinik_patches/Heritage__HeritageSpawnDataUniques.tsv HeritageSpawnDataUniques`
> (check the argument order in the tool's usage first); (2) a `krinikBuild` entry for Heritage in `modpack.json` + its library copy under `_krinik-modified/3726392245`
> (Heritage is not KRINIK MODIFIED yet — the original pak to `_patch-originals`), then `rebuild-krinik-paks.py --only Heritage --expect-changed
> HeritageSpawnDataMasses --expect-changed HeritageSpawnDataUniques --install`; (3) a world start, knock out a boss of the list (e.g. the Keymaster) — recruitable;
> (4) then steps 5 (Asghaard → TDI, 47 rows), 6 (LegitReligious → Era of Trials, 59), 7 (rows the log cannot show), 8–12 (other kinds). Tools: `row-diff.py`
> (load order + object references resolved), `copyprop:`, `--expect-changed`; method — `researches/mod-reconciliation/GUIDE.md`, register `REGISTER.md`.
> Owner's open items: none waiting (perk gap 14 done, mask 3 710 done; Nexus follow-up letter drafted for him to send — ticket 276571).
> **NOW 2026-11-06 09:05 +03:00 — chat of 2026-11-06, `[OWNER]` «продолжаем делать сборку Конана 1.0.0»:** DONE in one kit build + one run (pack `1dfd312`, report
> `testcases/reports/2026-11-06_conan-interaction-prompts-perks-enemy-bar.md`): 🔧 bug 83 — all five interaction prompts like the corpse strip (I1–I4, P1 pass; the
> owner's eye — review folder 65); 🔧 bug 64 item 12a — the enemy bar 4 units over its skull (E1; folder 66); ✅ the perk gap — 22 cut the last perk (the column does
> NOT scroll); `[OWNER]` 09:17 «ставь 14» — built, seen (K3, pack `94e713a`). Next on the list: nest eggs (bug 82), a real E over a corpse in a
> bush (bug 80), the rim on F done properly (bug 75), the rest of the guide's 1.0.0 list.
> **Northern Timber - Enhanced 4.0.2** (`[OWNER]` 09:27 «Поставь, попробуй»): tried in the world — 0 load errors, overwrites ONE vanilla row (`ResourceStatTable · Resin`),
> shares no row with the build; removed after (pak, modlist, `Saved/ExtractedMods`). Whether to take it — the owner (`researches/conan-mod-candidates/`).
> **Table conflicts of the build** — `who-overwrites-table.py --shared-rows` (new): 143 rows written by 2+ mods, list and first reading in `researches/conan-table-conflicts/`;
> to judge: item 51420 (SevereWeather vs Mines of Set), LegitReligious vs EraOfTrials (59), Asghaard vs TDI (47), RSP vs EAA (8).
> **Mods must be consistent — a general rule and guide** (`[OWNER]` 09:33–09:36): `researches/mod-reconciliation/GUIDE.md` (any game; overlap kinds an OPEN list —
> tables, code, assets, resources, mechanics are the owner's examples; four outcomes A identical · B merge · C the owner chooses · D separate), `HOUSE_RULES.md`
> rule 27, hook «mod-reconciliation-gate» (`style-gate.mjs --cmds`, report `2026-11-06_mod-reconciliation-gate.md`). First judged: row 51420 — a VANILLA armour
> piece both Severe Weather and Mines of Set re-declare (not two items under one id; corrected 09:34).
> **ALL mod conflicts to be resolved** (`[OWNER]` 09:40 «Ты понимаешь что нужно будет разобраться и поршать ВСЕ конфликты?»): `plans/45_conan_mod_reconciliation_all.md` —
> the 143 rows by group (steps 1–6), the rows the log cannot show (7), assets / code / resources / mechanics (8–12). Step 1 (row 51420 Grey One Mask): outcome C (Severe Weather's breather lost to Mines of Set); `[OWNER]` 09:55 «Предлагаю 3 710»; merge = six `copyprop:` lines
> (a new operation of the pak-patch tool) in the Mines of Set map — DONE 2026-11-06 10:08 +03:00 (pack `f4a56e1`; in game: the mask a breather, armour 38). Step 2 (Xevyr's shared UI rows +
> the shared Xevyr files) — outcome A, nothing to merge (2026-11-06 10:19 +03:00). Step 3 (werewolf loot, RSP → EAA) — outcome A. NEXT: step 4 (boss / elite
> spawns: Bosses My New Besties → Heritage / EAA; Heritage → Era of Trials), then 5, 6, 7 and the other kinds 8–12. Register of judged overlaps:
> `researches/mod-reconciliation/REGISTER.md`. Russian reading copy for the owner: `researches/mod-reconciliation/GUIDE_ru.md` (HOUSE_RULES 1a).
> **Nexus quarantine** (`[OWNER]` 08:51 «каковы могут быть причины…»): our 11-03 request covers all three Nexus causes (exe source + build steps, UE4SS DLLs with
> upstream link and hashes, no nested archives; all three links answer 200 publicly 08:53) — most likely the manual queue. BUT (`[OWNER]` 09:18 «они там пишут про
> способ сборки … они поймут, как собрать?»): the letter did not name the build script and misnamed `BuildInfo.g.cs`; the README has no build section. Checked 09:19:
> a fresh public clone builds the launcher by `python _config/release/build-docs.py --no-pdf` (same size 4 429 824 B; hash differs — fixed: `-deterministic`, two
> builds one hash; report `2026-11-06_conan-launcher-deterministic-build.md`). The follow-up with full steps — `…\Krinik_Mod_Pack_0_9_0_Nexus\nexus_support_quarantine_followup.txt`,
> the owner sends it as a reply in ticket 276571. Open: a «how to build the launcher» section in the README (the owner's storefront).
> **Owner's note 2026-11-06 08:48 +03:00:** `[OWNER]` «еще нам предложили взять в сборку мод Northern Timber - Enhanced 4.0.2» · «нужно изучить его потенциальную конфликтность, и что он
> нам даст» — web recon by a helper → `researches/conan-mod-candidates/northern_timber_enhanced_web_recon.md`; then the pak-level check (`mod-overrides.py`
> against the build's Mods) by the main session; the verdict to the owner with the conflicts table (memory: advice on a mod = its conflict study).
> ⚠️ **ЧАТ cb012770 ЗАКРЫТ ПРИНУДИТЕЛЬНО 2026-11-03 23:34 +03:00 на 85 %:** церемонии пропущены (проход судьи, обрезка STATUS, README, линтеры витрины) — долг платит первый
> /end-chat-soft. Ложных утверждений на месте не осталось. Сделано в чате: рамка добычи на F скрыта (баг 75 — долг «сделать красиво»), гиря HUD без тени, ModControlPanel
> убрана (окно LBPR в «Прочее»), окно добычи не просвечивает «Путь» (баг 81), «E Взять» уступает плашке трупа (баг 80), колесо над окном — проверено, полоски
> врагов — принято владельцем; игра закрыта, замок снят; паки и KUMM запушены.
> **NEXT CHAT, FIRST (chat cb012770, 2026-11-03 23:25 +03:00):** (0) bug 83 — the NPC talk prompt and every interaction strip like the corpse strip (left, 0.70, backing 0.60; `[OWNER]` 23:30 «я просил все виджеты интеракици - влево, меньше, прозрачнее фон»); (1) OWNER'S DEBT — the perk gap 22 (`[OWNER]` 23:50 «давай 22 поставим»; `PERK_TEXT_PAD` already 22 in kit-conanui-edit.py): kit edit run + kit build + deploy + a «Сила» frame — CHECK the column with 22 on «Сила»: does it scroll or clip the last perks (`[OWNER]` 23:50 «там же можно скролить?» — not known); then the guide line
> (bug 64 item 46); (2) bug 82 — load a region with nests (ostrich lands / swamp), find a nest egg, read what it is; (3) bug 80 — one real E over a corpse in a
> bush; (4) bug 75 debt — the pretty, proper rim fix; (4a) bug 64 item 12a — the enemy bar a little higher over its skull (`[OWNER]` 23:29, a kit override of `W_EnemyHealthbar`); (5) the rest of the guide's 1.0.0 list (all checked open against bug 64). Nexus texts — not now.
> Stand recipe for the quick-loot window: `loot-stand.sh` → `quiet-stand.lua` → `loot-aim.sh` (hits in 2–10 steps) → `loot-take-clip.sh`.
> **NOW 2026-11-03 21:54 +03:00 — chat cb012770, `[OWNER]` 21:02 «делаем сборку конана 1.0.0»:** working the 1.0.0 list below in order.
> **CHAT ce994c74 CLOSED 2026-11-03 20:57 +03:00 (soft, `[OWNER]` 20:55 «работай автономно 10 минут. Затем начинай закрытие этого чата, в новом продолжим»).
> FIRST in the next chat, in order:**
> 1. 🟡 **The quick-loot rim jump on F (bug 75) — HIDDEN 2026-11-03 21:54 +03:00** (new chat): the new section `krinik_loot_rim` of KrinikConanUI hides the other cells'
>    rims for 350 ms on a take (the owner's way, 21:26 «можно … просто её делать невидимой на время мерцания?»); B2 control (the jump is the game's), B3–B5 pass
>    after a normal start — report `testcases/reports/2026-11-03_conan-quick-loot-rim-hold.md`; the guide line moved from «Известные проблемы» to KrinikConanUI.
>    Live demo 22:18 — `[OWNER]` «вижу, починила, хотя и некрасиво» · «пока сойдёт»: DEBT `[OWNER]` 22:18 «там долг на будущее - сделать красиво» · «починить правильно» (the ≈ 0.3–0.4 s with no rim; bug 75 «verdict»).
> 2. ✅ **Aiming by the game's own answer** — `_config/loot-stand.sh` (hero 1.5 m) + `_config/loot-aim.sh` hit on five stands in a row (EXP-0454).
> 3. ✅ The launcher's grey «Установить сборку» — DONE 2026-11-03 22:00 +03:00 (pack `068b935`, report `2026-11-03_conan-launcher-install-button-gold.md`; the box wording
>    waits for the owner's eye). ✅ **HUD icon shadows — DONE 2026-11-03 22:47 +03:00** (packs `d569d13`, `9ba2dbc`): the weight icon was the game's buff texture with a soft
>    black shadow, stacked twice by Hosav; our 256 px icon in Hosav's style overrides it — seen in game (W1, W2), the look waits for the owner's eye.
>    ✅ **ModControlPanel out of the build** (`[AI]` by mandate, `[OWNER]` 22:39 «аналогичный вопрос про автономность работы»): LBPR 1.0.5 never plugged into it;
>    LBPR's own window is in «Настройки модов → Прочее» (M1, M2; the real click M3 not run). Report `2026-11-03_conan-hud-weight-icon-and-mcp.md`.
>    ✅ **Bug 81 — the quick-loot window no longer lets the journey tracker's text through** (pack `a23c9a6`, way A — the tracker not drawn while the
>    window shows; seen 22:56). 🔧 **Bug 80 — over a corpse in a bush only the corpse strip** (pack `4a739c1`, guide `1bb38f8`): our «E Взять» off while the
>    strip is on screen (seen 23:05 by a code-opened strip over a bush); owed — one REAL E over a corpse lying in a bush. ✅ The quick-loot window keeps its edges under the wheel — a REAL wheel seen 2026-11-03 23:18 +03:00 (plan 36 W10a, bug 64
>    item 45 — fixed 2026-10-30, the guide listed it as open by mistake; guide `1d6a62c`). 🔬 Bug 82 (no «E Взять» over nest eggs): snake eggs work, nest eggs
>    are another object kind — the next step is a real nest under the crosshair. Next: the rest of the guide's 1.0.0 list (all checked open against bug 64:
>    items 4, 6, 12, 13, 15, 17, 23, 27, 46). Nexus texts — NOT NOW (`[OWNER]` 23:13 «пока не думай про описания для нексуса»).
> 4. Nexus: ticket 276571 — look at the Files tab of mod 65 for the quarantine line.
> Done in this chat: the Nexus page checked (Adult — the owner's tags; the e-mail a live link; the quarantine request sent); the HUD blink in one phase
> (report `2026-11-03_conan-hud-blink-one-bus.md`); bug 75 reproduced and its cause read; the game map corrected (when the quick-loot window opens; the Shift
> tap wakes the idle camera); voice rule 13 rewritten («в общем», at a run's start); EXP-0451, EXP-0452.
> **NOW 2026-11-03 19:51 +03:00 — work toward 1.0.0 resumed (`[OWNER]` 19:21 «Продолжим делать сборку? то, что отложено до 1.0.0?»); the list = the guide's chapter
> «Известные проблемы и планы на 1.0.0» (`ConanExiles/docs/guide/guide-3.0.1.html`) + kit info paks of the four Lua mods + the waystone / city frames.**
> - ✅ **Food, water and weight blink in ONE phase** (`[OWNER]` 19:41 «мерцают крассным в рассинхрон» · «одну шину»): `krinik_hud_blink` drives the limit too,
>   Hosav's animations stopped — S1–S3 pass, report `testcases/reports/2026-11-03_conan-hud-blink-one-bus.md`; the guide line updated (PDF — at the release).
> - 🟡 bug 75 (the rim jump on F) — hidden in chat cb012770, the proper fix owed; the two 2026-11-03 evening blocks on it moved verbatim to the chronicle, entry 2026-11-03 21:55 +03:00.
> - NEW owner remarks: (1) `[OWNER]` 20:14 «под иконкой перегруза тень слишком сильная, не такая, как под жаждой и голодом - там или легче или нет» · «Сделать
>   однотипно легко всем иконкам худа» — recon first (the weight icon's shadow: Hosav's image or our `Image_Weight_Blinking` paint); (2) seen by the agent 20:13:
>   the quick-loot window lies over the tutorial journal panel («Выживший — Потратьте очки характеристик») and that text shows through the window's grid — to file.
>   (3) ✅ the launcher's grey main button — DONE (item 3 above): the desktop shortcut leads to the launcher in the GAME root, where install.cmd never lies.
> - Next on the list: no «E Взять» over nest eggs; enemy health bars over the enemies. «E Взять» beside the corpse strip over a corpse in a bush — TO FIX (`[OWNER]` 19:57 «над трупом в кустах - чинить» · «нужно ту плашку показывать, которая сработает … это нужно изучить»): bug 80 — the study first (a real E over a corpse in a bush; `_config/bush-corpse.lua`).
> **NOW 2026-11-03 19:05 +03:00 — Nexus mod 65 IS PUBLISHED (16:40), but its only file is QUARANTINED** (Files tab: «quarantined by our automated safety checks»;
> header «Virus scan — Some suspicious files»): the request to the Nexus support address is written —
> `D:\Games\Conan Exiles Mods\Krinik_Mod_Pack_0_9_0_Nexus\nexus_support_quarantine_request.txt` — SENT by the owner 2026-11-03 19:10, ticket 276571 (auto-reply; support hours 09:00–17:00 GMT, extra details — a reply to that mail); Nexus names no review time — check the Files tab of mod 65 for the quarantine line; do not delete or replace the file meanwhile (help article 117).
> The e-mail line of the description is a live `mailto:` link now (both halves; the source `nexus_full_description.bbcode` fixed too). The «Adult» mark:
> RESOLVED — the owner removed the tags «Extreme violence» and «Sexualised» himself, the badge is gone (his frame 19:08).
> Route details — `HOUSE_RULES_REFERENCE.md` §2, the Nexus row.
> **The 0.9.0 release blocks of 2026-11-02 19:36 – 2026-11-03 15:09 and the 2026-11-02 chat blocks (03118042, aa2bfa46) — moved verbatim to the chronicle, entry 2026-11-03 20:56 +03:00.**
> **Older pointer blocks (2026-10-26 … 2026-11-02: chat FIRST lists, the 1.0.0 orders, plan 35/36/34 queues, the measurement queue) — moved verbatim to the chronicle, entry 2026-11-03 20:58 +03:00 (second part).** The live backlog: the guide chapter «Известные проблемы и планы на 1.0.0», epics `plans/40_…` and `plans/41_…`, `plans/36_…` (W table), `plans/35_…`, `plans/34_…`; work trees `_paksview-3.0.1` (66 GB) and `Conan Exiles Mods/_text-extract-3.0.1` (20 GB) stay.

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
