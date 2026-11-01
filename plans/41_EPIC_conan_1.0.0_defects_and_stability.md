# Plan 41 — EPIC: the Conan build 1.0.0 — the open defects (bug 64, mod windows, ModControlPanel, day/night) and stability

> **Created:** 2026-11-01 · **Parent:** plan 39 (the honest list), section C; `[OWNER]` 2026-11-01 13:28 «аналогично, пишем эпик планы и операционные планы» about
> «Баг 64: 12 пунктов, среди них шкала Damage Meter, текст внутри текстур у EAA, поздняя эмблема в хабе. Окна модов, которые код не открывает: AMR, Emberlight,
> Pickup+, Horti. ModControlPanel: в окне написано «Нет доступных виджетов». Ночь и день: скачок света, который вы видели, не объяснён. Стабильность: кейсы на
> стабильность не прогнаны, долгого прогона без падений нет.»
> **Sister:** `plans/40_EPIC_conan_1.0.0_unfinished_six.md` (vignettes, hub shkalas audit, inventory button, arrows in the corpse, frame cost, 16:9 gate,
> package and archive) — nothing of epic 40 is repeated here
> **Status:** meta-plan and all eight phase operational plans written 2026-11-01 13:30 +03:00; phase 1 is next
> **Outbound:** the owner's eye on this meta-plan; forks per phase go to `interviews/`

## Goal vector (Achieve)

Plan 39 section C names defects that a player of 1.0.0 meets and a stability claim nobody has measured. Where we want to be: each of the twelve open rows of
bug 64 is either fixed and SEEN fixed on a frame of the same screen in today's build, or proven already fixed (the row was stale), or moved by the owner's
word; the four mod windows the remote cannot open are reached by the player's own path and walked; ModControlPanel either shows LBPR's settings or leaves
the build by the owner's word; the light/sky jump at dusk is explained by an interference-free run (the game's own behaviour, a mod's, or the agent's own
time jumps) and fixed if it is ours; the build survives a long run with combat, windows and the hub without a crash, and every unrun stability case has a
verdict. No «done» / «ready» is said before the phase's acceptance table is all «seen» (plan 39 D).

## Scope — what is in, and why each

| Group | Items | Source |
|---|---|---|
| Bug 64 — the twelve open rows | 4 (minimap marker tutorial: late bullets, black slides) · 5 (map hint over «Сброс маркеров») · 6 (tab text jitter) · 12 (enemy health bars over the mobs) · 13 part (Russian wider than fixed buttons, 98 candidates) · 15 (the hub «пляшет» on Q/E) · 16 (Hosav button only on «Снаряжение») · 17 (late elements; class A — wrap from the previous frame) · 18 (EAA tooltip not in the game's style) · 21 (Damage Meter opacity shkala under «Масштаб») · 23 (EAA class cards — English painted into textures) · 26 (the late emblem in the hub) | `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` |
| Windows the code does not open | AMR, Emberlight, Pickup+, Horti (`walk-mod-windows.sh` 2026-10-26 18:03 — not opened by `ActivateModule`); Edit Appearance (U6, opens from its own station) | `TC_conan_build_stability_compat_perf_2026-10-26.md` rows U3–U6, U6 |
| ModControlPanel | «Нет доступных виджетов» — LBPR's settings never appear | `games/ConanExiles/mods/ModControlPanel.md` → Open |
| Day/night | the light/sky jump the owner saw — run 1 found no step, lights not tested | `researches/conan-day-night/README.md` |
| Stability | unrun / partial cases (C2, C3, W1, S1 with combat, U6 rest, DM0 by the player's path, S1d PackRat by its own button) and a long run without crashes on the final build | the same TC file; plan 35 criterion 1 «прогон ≥ 1 ч без падений» |

**Out of scope (named so nothing is dropped silently):** C1 Caverns of Set chest loot — run, FAILED, waits for the owner's choice of loot (interview, already
queued); «no E prompt over a pickable stone» (plan 39 C) — not in the owner's 13:28 list, stays in plan 39; the other open bug 64 rows (27, 28, 31, 33, 45, 46) —
not in the twelve; item 46 (perk lines overlap) is class A of item 17 and is swept with it in phase 5 if the sweep reaches it.

**Some rows are probably stale.** Rows 5, 16 and 26 of bug 64 already say «fixed» (2026-10-29), row 17a says the tooltip and the bottom bar were accepted by
the owner's eye, row 21's last build («slider 64, padding 20») was «in the library — deploy at the next game close», row 4's «NEW:» shows «НОВОЕ:» in T1
(2026-10-31). Plan 39 still lists them open. Phase 1 settles every row on today's build before any fix is written (house rule 20: `[OWNER]` 2026-10-31 17:49
«ОНО УЖЕ НАХУЙ ВСЕ ПОЧИНЕНО ТОБОЮ ЖЕ БЛЯТЬ В ПРОШЛЫХ СЕССИЯХ!!»).

## Acceptance criteria (one per phase; the scenario form is in each operational plan)

| # | Phase | Seen when |
|---|---|---|
| 1 | Bug 64 truth pass | each of the twelve rows carries a status observed TODAY on the current build: a frame (or a 60 fps clip for motion) per row, the row edited in bug 64 and plan 39 C in the same commit |
| 2 | Windows the code does not open | AMR, Emberlight, Pickup+, Horti and Edit Appearance each opened by the player's path (button, key, station, console command the mod documents), a frame of each window; Russian, fits — or its defects filed as new bug 64 rows for phase 4; no crash |
| 3 | ModControlPanel | the panel lists LBPR (and any other registered mod) with its settings, a value changed in it changes LBPR in game — or the owner's word removes MCP from the build (and the manifest, the guide, the README in the same commit) |
| 4 | Mod window text and layout | rows 4, 13 (the 98 candidates walked, every real overflow fixed), 18, 21 and the phase 2 finds: a frame of each window after the fix, nothing cut, nothing overlapping, the EAA tooltip in the game's tooltip style |
| 5 | Hub and menu motion | a 60 fps clip of the hub tab round trip (Q ×8, E ×8) and the menu tabs, build vs. a game without paks: no element of ours late by more than one frame, no width jump that the vanilla game does not have; rows 5, 6, 15, 16, 17, 26 closed by those clips |
| 6 | Enemy health bars and EAA class cards | a spawned mob at 3 / 8 / 15 m: its health bar above the head, not over the body (frames); the EAA class menu: every card's name and description Russian (frame) |
| 7 | Day/night | an interference-free dusk and dawn at a lit camp (60 fps clip + frame series): every visible step of light or sky named with its cause; ours — fixed and re-run; the game's — written down and shown to the owner, a fade only by his word |
| 8 | Stability | every unrun case of the TC file has a verdict; a long run of ≥ 120 min in one process on the final build (flights, hub, mod windows, combat): 0 new crash folders, the process alive, no error class outside the baseline, no Lua error line |

## Phases — order and why

| Phase | What | Why this order | Gate |
|---|---|---|---|
| 1 | Bug 64 truth pass — re-observe the twelve rows on today's build | half the rows may be already fixed; no fix is written for a stale row | criterion 1 |
| 2 | Windows the code does not open (AMR, Emberlight, Pickup+, Horti, Edit Appearance) | walking them finds their text defects, which join phase 4's single sweep | criterion 2 |
| 3 | ModControlPanel «Нет доступных виджетов» | small, independent; the answer may remove a mod from the build (owner's word) — better known before the window sweep | criterion 3 |
| 4 | Mod window text and layout (4, 13, 18, 21 + phase 2 finds) | one sweep over all mod windows, one locres / pak rebuild round | criterion 4 |
| 5 | Hub and menu motion (5, 6, 15, 16, 17, 26 — what phase 1 left open) | motion is measured on the final hub; epic 40 phase 3 (inventory button) changes the bottom bar — run this AFTER it, or re-clip | criterion 5 |
| 6 | Enemy health bars (12) and EAA class cards (23) | world UI and textures — independent of the windows; the texture route may need the owner's fork | criterion 6 |
| 7 | Day/night | research first (run 2), independent of 1–6; can run in parallel slots when the machine is free | criterion 7 |
| 8 | Stability — unrun cases + the long run | must test the FINAL build: after phases 1–7 AND epic 40 phases 1–4 (its Lua); BEFORE epic 40 phase 7 (archive) | criterion 8 |

**Cross-epic order.** Epic 40 phase 6 (the 16:9 gate) frames every window we changed — phases 4–6 of this epic change windows, so they land before epic 40
phase 6 or that gate re-frames them. Epic 40 phase 5 (frame cost) and this phase 8 share the final Lua set; run phase 8 right after epic 40 phase 5 on the
same build. Epic 40 phase 7 (archive) closes both epics.

Each phase's operational plan: `plans/41_epic41_phase<N>_<slug>.md` — written together with this meta-plan at the owner's word 13:28 («пишем эпик планы и
операционные планы»), corrected when its phase starts if a previous phase changed the facts.

| Phase | Operational plan |
|---|---|
| 1 | `plans/41_epic41_phase1_bug64_truth_pass.md` |
| 2 | `plans/41_epic41_phase2_mod_windows_by_player_path.md` |
| 3 | `plans/41_epic41_phase3_modcontrolpanel_no_widgets.md` |
| 4 | `plans/41_epic41_phase4_mod_window_text_layout.md` |
| 5 | `plans/41_epic41_phase5_hub_menu_motion.md` |
| 6 | `plans/41_epic41_phase6_enemy_bars_eaa_cards.md` |
| 7 | `plans/41_epic41_phase7_day_night_light_jump.md` |
| 8 | `plans/41_epic41_phase8_stability_long_run.md` |

## Common to every phase

- **Stand** (house rule 11): the machine lock `node D:/work/ai_sandbox/_tools/machine-lock.mjs take --who kumm --what <phase> --minutes <n>`; launch by the path the
  owner named last (`ConanExiles/_config/launch-bg.ps1` or `launch-fg.ps1`); `enter-world-remote.sh`; `bash _config/god-on.sh`; teleport to a clear place by
  `tp_ground.sh`; objects and creatures SPAWNED by the remote (rule 11.5a), never searched for; saves used freely (rule 6).
- **Fix order** (house rule 8): the mod's own setting → its pak edited natively (`patch-mod-asset.py extract/build`, `kismet-trace.py`, `kismet.py`, asset-strings
  TSV in `ConanExiles/_config/localization/asset-strings/`) → Lua only when the asset will not yield (once, on an event, no polling, an A-B measurement — rule 7).
- **Packaging** (house rule 20): the pak into `ConanExiles/_krinik-modified/<workshop id>`; the `modpack.json` entry's `krinikModified` note «KRINIK MODIFIED …»;
  `rebuild-krinik-paks.py --only <Mod> --install`; `.\Deploy-ModPack.ps1 -Deploy -Only "<Mod>" -PackDir D:\work\ai_sandbox\ConanExiles` then `-Verify`; in the
  SAME commit — the mod's notes `games/ConanExiles/mods/<Mod>.md`, the bug 64 row, plan 39 C, the guide `ConanExiles/docs/guide/guide-3.0.1.html` where it
  describes the thing.
- **Crash in a run** (house rule 9): `Get-Process CrashReportClient | Select Id, StartTime, MainWindowTitle` → `Stop-Process -Id <PID>`; the report carries
  «окно отчёта о падении закрыто, PID …».
- **Mod notes before mod work**: a mod without a notes file in `games/ConanExiles/mods/` gets one BEFORE its first edit (the hook will not let the work start).

## Risks

- (a) The truth pass may show more rows already fixed than open — the epic shrinks; that is the point of phase 1, not a loss.
- (a) The four windows may have no player entry in this build (the mod's button injected by a hub event that 3.0 no longer sends — the same class as Hosav's
  button, row 16) — then the entry itself is the defect, fixed in phase 2.
- (a) MCP may be incompatible with the LBPR version shipped (LBPR registers through another API) — then the fork «keep MCP / drop MCP / register LBPR by
  hand» goes to the owner.
- (b) Item 23 (text in textures) may need a texture tool for UE 5.8 IoStore that we do not have — the overlay route (a TextBlock over the card in the widget
  asset) is the fallback; both are a fork for the owner's eye.
- (b) Motion defects (phase 5) are vanilla in part — the A-B against a game without paks decides what is ours before any fix.
- (b) A long run can crash in the agent's own probe (S1c, 2026-10-26 17:32) — phase 8 runs NO reflection probe during the long run; a crash is classified
  (build / instrument) from the call stack in `Saved/Crashes/<folder>/`.
- (c) A new owner order mid-epic re-ranks the phases (he decides); epic 40 runs in parallel and can change the hub under phase 5.

## Decisions made without the owner

- `[AI]` 2026-11-01 13:30 — the phase order (truth pass first, stability last) and the split of the twelve bug 64 rows into phases 1, 4, 5, 6.
- `[AI]` 2026-11-01 13:30 — the long-run length 120 min (plan 35 asked ≥ 60 min; twice that to cover combat and windows in one process).
