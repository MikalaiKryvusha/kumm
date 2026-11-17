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
> 🆕 **Conan 3.1.0 is out (2026-11-12, Part Three of the Giant-Kings arc); THE MOVE IS UNDER WAY since 2026-11-13 18:52 — `plans/53_conan_move_3.1.0.md` (the build runs on 3.1.0 since 2026-11-13 20:0x — 66/66 mods, the owner's world; the 3.0.1 install kept on disk as the way back). Downloaded by the owner (his word 2026-11-13 14:13 +03:00)**
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

> **NOW (chat of 2026-11-17 19:43, `resume` + the owner's D: order + «работай автономно» 20:00 → /dayloop).** (1) **D: put in order by the owner's four concepts**
> (`HOUSE_RULES.md` rule 25 — clean version · shipment · source · build; chronicle entry 2026-11-17 19:43): the 3.1.1 download in `D:\Instals\` checked against its
> download hash list — 597 files, 3 775 / 3 775 pieces, exe CL-383549; our 525 files (30.5 GB) removed from it; deleted the junction `D:\Games\Conan Exiles 3.1.0`, the 3.0.1
> game, the three `_paksview-*`, the 0.9.0 bundles (texts → pack `_config/release/published_0_9_0/`), `_text-extract-3.0.1`, old workshop copies, library `OLD`,
> reviewed review folders (85–90 kept). D: free 96 → 258 GB. **There is NO game build on disk now** — the 3.1.0 world save is stashed in `KUMM/.work/disk_d/save_3_1_0/`;
> **20:1x–20:5x: the build on 3.1.1 made and checked** (`D:\Games\Conan Exiles 3.1.1`, targets.json → it; TC_conan_move_3.1.1 6 pass, P6 blocked — the 3.1.0 pak list
> lost, EXP-0552; report `testcases/reports/2026-11-17_conan-move-3-1-1.md`). **Epic 55 written** (`plans/55_EPIC_…`, research `researches/conan-launcher-modern-practice/`,
> cases `testcases/TC_conan_launcher_release_0_9_1_2026-11-17.md`). **Phase B coded, under test:** KUMM `Deploy-ModPack.ps1` `-Upgrade` (player settings kept across an
> update, dpkg rule; `configPolicy` managed / strip / never; deploy and restore refuse a running game; export strips display keys) — fixture stand 67 / 67, 9 new checks
> red on the old engine, judge round 1 running; pack: `configPolicy` in modpack.json, launcher — self-update handshake + start counter, values from the bundle's
> manifest, consoles / mutex interlocks, the build update runs install.ps1 `-Upgrade` — batch `KUMM/.work/launcher54/batch55.sh` running. **KUMM is NOT pushed
> since `82260a4`**: the harness refused the force-push that replaces the pushed commit whose MESSAGE held a forbidden word (amended locally) — the owner's call
> (`git push --force-with-lease origin main`); new KUMM commits wait for it. Older history `5c300f3` holds the same word in plan 53 (history rewrite — the owner's call).
> (2) **Next — the epic «0.9.1 for 3.1.1»** (the owner 20:00: «в ближайшие дни … выпустить предварительную
> сборку 0.9.1 для версии 3.1.1 на ГитХаб и нексус»; the launcher «качественный и рабочий, без багов … не портил настройки и сейвы игроков»): the build copy
> `D:\Games\Conan Exiles 3.1.1` + install, mods on 3.1.1, plan 54's four release blockers, release tooling, test plan and cases. Voice: plays (exit 0, `soft voice:`
> printed) yet the owner did not hear it 19:52 — the default output is the TV (HDMI) / Realtek; Parsec and Sunshine are connected.
>
> **NOW (chat of 2026-11-17 14:40, `resume` + the owner's launcher task + «работай автономно» → /dayloop).** (1) **Plan 54 — the Conan launcher's «Что нового»
> under both versions, the new-version plate, «Обновить сборку» and «Обновить лаунчер» — BUILT (phases 1–3)** in the pack (`_config/launcher/KrinikConanUpdates.cs`
> new, `KrinikConanLauncher.cs`, `build-docs.py`, manifest key `launcher`): stand cases 19 of 20 pass (W1 partial — the Steam page's post not rendered headless),
> after judge round 1's fixes the whole set re-run: 74 checks, 0 fail (report `testcases/reports/2026-11-17_conan-launcher-updates.md`). Show page for the owner —
> review folder `90_launcher_chto_novogo` (opened at the end of this chat). **Pack `950b9e5` pushed after 2 judge rounds** (round 2 re-run 15:55: 74 / 0);
> **4 RELEASE BLOCKERS in plan 54** (the update resets the player's settings via «Game config»; a new launcher that starts then dies is not rolled back; BuildInfo
> values from the bundle; no update while an install console runs) — fix them before ANY real release. Left: the blockers; the first REAL launcher release
> (`gh release create launcher-vX.Y.Z --latest=false`) and a real build release wait for the owner's word; phase 4 (release tooling, the old-bundle cleanup offer).
> (2) **Auto-relay: the cause of «the deep link opens no tab» FOUND 15:21** — `ELECTRON_RUN_AS_NODE=1` inherited from the extension host made the link's handler run
> as Node (EXP-0550); fixed in `open-chat.ps1` + the link now carries `windowId` of the project's window from `code --status` (VS Code routes by it). The link reached
> KUMM and VS Code asked «Allow 'Claude Code for VS Code' extension to open this URI?» — **the owner's tick «Do not ask me again» is owed** (a security consent;
> called by voice 15:23); until then `relay.mjs` keeps `-NoEnter`. After the tick: L1″ (windowId isolated), L2 (with Enter), L3 (a real chain). KAIF #198 comment 15:22.
> Also: the game has hotfix 3.1.1 (2026-11-14/15) — `researches/conan_patch_3_1_0/README.md` §6.
>
> **NOW (chat of 2026-11-17 11:21) — item 1 BUILT, the live open owed.** `/auto-relay` — `.claude/auto-relay/{relay.mjs,open-chat.ps1,e2e.mjs}`,
> `.claude/hooks/relay-hook.mjs` (wired in `.claude/settings.json`: UserPromptSubmit + Stop), `.claude/skills/auto-relay/SKILL.md`, one relay line in both closure
> skills. Agreed with the KAIF session 11:26: no own gauge (context-budget 80 / 92), no HANDOVER.md (STATUS + farewell file), entry «resume auto-relay continue»;
> the next chat opens only after the marked farewell, STATUS committed in the chat, and the old chat quiet (a Stop blocked by another hook waits). Checks: self-test
> 22/22, e2e 21/21 (mutants M1–M3 red), test-guards 308/308, context-budget 38/38; check 4 (hooks' tmpdir `F:\Temp`) and 5 (session id visible) pass.
> **11:41 the real opener with `-NoEnter` raised the KUMM window over KAIF (log «opened … in 'KUMM - Visual Studio Code'») — yet NO new tab: the focus sat in
> the RUNNING chat's input; an Enter would have gone there. `relay.mjs open` now passes `-NoEnter` until the link opens a tab (the handler: `Code.exe --open-url`,
> the same install).** **Live L1 (the deep link by hand, 11:37) — the tab was NOT found** in the KUMM or KAIF window: FOUR VS Code windows are open (KAIF, KCCP, KUMM, the turbine),
> the link goes to the last active one — the KCCP / turbine windows not checked. **CORRECTED 15:21 (next chat): the window was not the cause — the link reached
> NO window because of `ELECTRON_RUN_AS_NODE` (block above, EXP-0550).** Open: L2 (the opener with Enter) → L3 (a real chain) after the owner's tick.
> Cases `testcases/TC_auto_relay_2026-11-17.md`. The 5-hour usage limit stood at 96 % at 11:39, the harness banner names its reset at 14:40 <!-- claim-ok: the reset time the harness banner printed, a future time by nature -->.
>
> **FIRST NEXT CHAT — item 1, the owner's task relayed by the KAIF session `kaif-6d` (2026-11-17 11:02, a peer's message; the owner's word as it quotes it, ≈ 10:55 in
> the KAIF chat): «напиши агенту KUMM - ему задание на следующий чат - внедрить навык перехода из чата в чат в его KAIF. Так как 2.10 ещё в работе, и непонятно, когда
> выйдет версия, а в KUMM мне УЖЕ нужен этот навык» (KAIF decision №160).** Build the auto-relay skill locally from the owner's document
> `d:/work/ai_sandbox/KAIF/ideas/auto_relay_windows_guide.md` (KAIF `e34fd93`, read-only): `relay.mjs` · `relay-hook.mjs` · `open-chat.ps1` · `SKILL.md` (/auto-relay) ·
> `e2e.mjs` · the settings.json wiring · `.gitignore`; acceptance §5, risks §6. Check first (KAIF's recon researches/44 — re-verify): (1) no second window gauge —
> agree the relay threshold with `.claude/hooks/context-budget.mjs` (soft from 80 %, force from 92 %); (2) `autonomy-guard.mjs` + the relay Stop hook must not loop the
> turn or block opening the next chat after `ready`; (3) one entry and one handover: «auto-relay continue» or the resume word, `HANDOVER.md` or STATUS — one, ask the
> owner if unsure; (4) the hook's memory in `os.tmpdir()` must land in `F:\Temp`, never `D:\Temp`; (5) `node -e "console.log(process.env.CLAUDE_CODE_SESSION_ID)"` —
> empty means the chat binding is off (§6); (6) a field report to KAIF origin (/report-bug, improvement request, «Local remediation») with what the first Windows run of
> `open-chat.ps1` showed — the first run under the owner's eye (the VS Code window may not come forward, Enter may go elsewhere).
>
> **FIRST NEXT CHAT — items 2…:** (2) **The walking bow draw (#038 A — bug 104):** the cause is read (the walking chain of `AB_human_male` takes the shoulders back from the
> locomotion), a parent-graph override is OUT (EXP-0511 — other mods ship its children); recon the post-process route (plan 52, `ABP_KrinikFirstPersonLook` in
> KrinikConanArchery) or another lever, then build; cases `testcases/TC_conan_bow_draw_walking_pose_2026-11-17.md` (real RMB held, the side camera). (3) **The owner's
> real-key checks** (he plays): the hang drains 2/s and an empty bar drops the hero (TC_conan_wall_hang_stamina); RMB held through a wall push draws in the flight
> (TC_conan_bow_any_flight B7); bug 105 G1 / G5b / G10 / G7 and G6. (4) Bug 93 — the held draw ends ≈ 1 s after the full hold in a sprint (the game's reason by
> `DebugActionTryFailure` / `EndPowerCharge`; the degeneration bits now known: sprint 2 −8/s, charge hold 32 −6.7/s). Tools of this chat: `.work/hangstamina/*.lua`,
> `.work/bowflight/*.lua` (arrow-birth, refuse, window, equip probes), `ConanExiles/_config/devkit/kit-probe-ab-torso-*.py`.
>
> **CHAT CLOSED 2026-11-17 11:04 +03:00 (soft, at 80 % of the window). The chat of 2026-11-17 08:53 (resume + «начинаем с интервью по конану»; `[OWNER]` 10:27 «работай автономно до закрытия чата по переполнению контекста» → /dayloop).**
> Done: interviews #035 / #037 / #038 answered by the owner 09:18 (verbatim in each); **the hang's stamina BUILT** as our reason flag in the game's own wall tick
> (`[OWNER]` 09:33 «новый флаг разрабатываем»; pack `e6d1d97`, TC_conan_wall_hang_stamina H1–H5 pass, 2 judge rounds; the game's stamina degeneration bitmask mapped —
> game map «Climbing»); #037 Q1 — B, nothing to change. **Bug 107** (the bow in the flight after a wall, #035): the re-equip blocks the bow 1.35 s; the «arrow with speed 0»
> of the first four tries was the wall in front (CORRECTED 10:3x — the view faced the wall pushed off); re-checked 10:36: **the rearm WORKS — SHIPPED, pack `ee7e31c`**
> (TC B1′ pass, judge round 1: no defect, 5 items applied); the owner's real keys (RMB held through the push) are the final check. #038 (the standing draw kept when walking): the cause read in
> `AB_human_male`'s AnimGraph by two kit probes — the walking chain takes the shoulders back from the locomotion; the crouch branch takes the whole upper body
> (`bugs/104_…`). The edit script `devkit/kit-ab-bow-draw-upper.py` is written and NOT run: a parent-only override is the bug-95 T-pose — **the FORK for the next
> chat** is written in bug 104 — the parent override is OUT (EXP-0511), the post-process route or another lever. Bug 103: the first live marked farewell PASSED. Still open: bug 93 (the held draw
> ends in a sprint — real input). KUMM — the closing commit after `b703824`, pack `1baf59f` pushed; no game of ours runs, the machine lock released.
> The owner's question at the closing (11:08: how far is 1.0.0, which ideas are not built) — answered in chat from the documents, and the idea list was WRONG in four
> of nine: the level without a cap (idea 04), endless attributes (plan 49) and the GUI installer (idea 22) — the owner 11:09–11:10 «Уже сделано оба. Ты не прав» ·
> «Давным давно тобою сделано»; the run / jump growth from Agility (idea 03) — built in KrinikConanLocomotion `krinik_oblivion_locomotion`. All four tagged DONE.
> **The next chat re-checks `ideas/` and the phases of epics 40 / 41 against what is built** before saying anything about 1.0.0 (their status lines are older than the work).
>
> **Moved verbatim to the chronicle (entry 2026-11-17 10:52 +03:00):** the block CHAT CLOSED 2026-11-17 06:33 (+ its FIRST NEXT CHAT) and the block of the chat of 2026-11-17 04:25. Their open items are carried in the NOW block above or stay here: bug 93 (the held draw ends in a sprint; S9) · bug 105 the owner's final check (G1, G5b, G10, G7 with the bow) and G6 · plan 53 step 12 (read `researches/mod-reconciliation/GUIDE.md` first) · plan 52 put-away by a real key · the GitHub release link in the Nexus call (the owner's question).
> **Moved verbatim to the chronicle (entry 2026-11-17 06:33 +03:00):** the block CHAT CLOSED 2026-11-16 23:53 (+ its FIRST NEXT CHAT) and the block of the chat of 2026-11-16 22:12; their open items are carried in FIRST NEXT CHAT above (the bow on the wall — done; the hang's drain — interview #037 Q2; bug 105 final check; the older list).
> **Moved verbatim to the chronicle (entry 2026-11-16 23:53 +03:00):** the block CHAT CLOSED 2026-11-16 21:46 (+ its FIRST NEXT CHAT and tools); its open items (2)–(4) are carried in FIRST NEXT CHAT above.
> **Moved verbatim to the chronicle (entry 2026-11-16 21:46 +03:00):** the blocks NOW 2026-11-16 21:30 and CHAT CLOSED 2026-11-16 19:47 (+ its FIRST NEXT CHAT; its open items are in (3)–(4) above).
> **Moved verbatim to the chronicle (entry 2026-11-16 19:47 +03:00):** the NOW block of the chat of 2026-11-16 17:59 and the blocks CHAT CLOSED 2026-11-15 00:19 and NOW 2026-11-14 22:29.
> **Moved verbatim to the chronicle (entry 2026-11-15 00:02 +03:00):** the blocks NOW 2026-11-14 16:24 (dayloop: wall jump, bug 102, Pickup+), CHAT CLOSED 15:59, FIRST NEXT CHAT 15:5x and NOW 14:17 (perk page, bug 101, the first wall jump). Still open from them: interview #035 (the bow after the wall push — the owner's answer); the wall-jump TC row R6 by the owner's own keys (the synthetic Space is unreliable there), an overhang case, W11 / W13 on the final build; bug 91 real hover; the perk page (review folder 86, his perk ideas 25–40 → plan 49); bug 101 item 4 (a native read of the inventory teardown); bug 75 (quick-loot rim); M6 ping; the Pickup+ admin window (plan 53 step 12, parked to ≈ 2026-11-15); the morning items listed in the 2026-11-14 15:41 pointer below.
> **Moved verbatim to the chronicle (entry 2026-11-14 15:41 +03:00):** the blocks CHAT CLOSED 2026-11-14 13:45, NOW 11:52 (dayloop), FIRST NEXT CHAT (11:41) and NEW CHAT 09:51 of the morning chat. Still open from them: the owner's play — his six key bindings, the hub switches to / from «Снаряжение», the morning four (square page arrows, journeys refresh, craft pace after the close, Esc flag); (the run-report linter's two morning reports — fixed 15:4x); plan 53 step 12 (parked to ≈ 2026-11-15); the rollback paks in `.work/keybinds/` and `.work/arrows/` (delete after the owner's play).
> **Moved verbatim to the chronicle (entry 2026-11-14 11:40 +03:00):** the blocks CHAT CLOSED 2026-11-14 02:16, NOW 2026-11-14 00:15–02:15 and HANDOVER 2026-11-13 22:0x (the 3.1.0 kit rebuild, the devkit update, the D:\Temp cleanup). Still open from them: plan 53 step 12 (other authors' stale vanilla copies, 3 of 11 — parked until ≈ 2026-11-15 by the owner; resume `python -I -X utf8 _config/check-mod-updates.py --since 2026-11-03 --all`); the Pickup+ admin widget error (`ComboBox_DrawDebugline`); UE4SS v4.0.0 as its own step; bug 75 (the quick-loot rim, reopened); bug 98 C6 (the owner's verdict on the first-person shadow frame, review folder 85); plan 52 steps 3–4; bug 93 S8 / S9 and the no-zoom-on-sprint wish; bug 96 (the owner's play); the pack judges' B2–B4 (pack `ff30fb9` message); L1–L5 of `TC_conan_move_3.1.0_2026-11-13.md`; the quick wins by A-B-A-B; the mods-table storefront row (the foliage-shadow fix — the owner's proofreading); paks uncompressed (size only); the live run of the `attr-arrows-show.lua` / `plus-tint-probe.lua` guards; `_config/craft-*.lua` probes uncommitted; rollback paks `KUMM/.work/kit310/old/`; 6 `*.tmp` in `D:\Temp` (after a VS Code restart).
> **Moved verbatim to the chronicle (entry 2026-11-13 22:0x +03:00):** the 2026-11-13 blocks from the forced closure of 20:1x back to the HANDOVER of 11:08 (three
> forced closures — their skipped ceremonies paid by this soft closure — the NOW / HANDOVER blocks of the move onto 3.1.0, bugs 93–99, plan 52); their open items
> are in item 3 above.
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

Files without the DONE tag — 54 (counted 2026-11-17 06:23 +03:00; 50 on 2026-11-15). The Conan-era open ones: 64, 70, 74, 75, 79, 83–91, 93–101, 103 (the farewell
hook — the mark fix built 2026-11-17, the live closure owed), 104 (the hand on the string — the game's pose, interview #038), 105 (the wall grab — the owner's
final check, interview #037 Q1), 106 (the climb's stamina — interview #037 Q2) — the list below names the ones with live symptoms; the rest are paused games' bugs:

- 🔴 `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` — the UI of the Conan 3.0.1 build's mods, 26 items: open 4, 5, 6, 12, 13 (partly),
  15 (🟡 hub controller in the build), 16–18, 23 (EAA class cards — text in textures), 26 (late emblem in the hub); closed by a frame 2, 3, 7, 21 (4K, 2026-11-07), 7b, 8 (again 2026-10-31 at 1080p, list 540), 9–11,
  14, 16, 19, 20, 22, 24, 25 — work order in plan 35.
- 🔧 `bugs/93_…` — the bow sprint in the owner's order: build 7, `[OWNER]` 2026-11-13 11:01 «спринт и стрельба работают»; open cases S8, S9, the cost. 🔴 `bugs/94_…` — hub craft batch
  finishes at once after the close (hypothesis 2 to test). 🔴 `bugs/95_…` — the bow unseen in first person (first next).
- 🔧 `bugs/85_conan_crash_keybind_lua_races_game_thread.md` — the bow-kill crash: cause fixed in Archery + Camera; the KrinikConanUI twins open; the owner's gameplay is the check.
- ⏸ `bugs/89_conan_water_reflection_flicker.md` — 2026-11-09 15:45, the owner's frame at `river_bend`: dark dashes / grain blinking over the water, «как тени листвы пальм»; PARKED 2026-11-14 09:53 by the owner («в дальний ящик»).
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
`.claude/hooks/context-budget.mjs` runs (2026-10-30: #181 farewell hook, #182 autonomy guard, #183 the agent cleans up after itself — `bugs/KAIF/21–23`): at 70 % and 75 % — warnings only (the owner 2026-10-31 21:26); from 80 % — finish the work, then `/end-chat-soft` in full; `/end-chat-force` only from 92 % (the owner 2026-11-14 19:10 · 22:29; `CLAUDE.md`).
