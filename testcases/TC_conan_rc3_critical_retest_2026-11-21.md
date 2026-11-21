# TC — the critical issues fixed before 0.9.1-RC3, retested on the published RC3 by the player's path (#6, #11, #12, #33, #35, #21)

> **Created:** 2026-11-21 · on the owner's words 2026-11-21 21:47 «будем сборку конана дальше фиксить?» and 21:58 «гоу» (the queue told 21:49, STATUS «NEXT after P1»)
> **Parent:** HOUSE_RULES 44.4 (an issue closes only after the agent's own retest by the player's path) · `bugs/GITHUB_ISSUES.md`
> **Status:** written 2026-11-21 22:07 +03:00 before the run; run 22:08–22:24 — R0, R35, R11, R33, R12, R6, L1 pass; N1 pass by end frames; R21a, R21b not run;
> R24 no crash. Report `testcases/reports/2026-11-21_conan-rc3-critical-retest.md`
> **Outbound:** each result goes to its issue as a comment; a pass closes the issue

## Test basis

- #6 «Combat: enemies deal no damage to the hero» — cause: the save kept the agent's god mode; the entry guard of `enter-world-remote.sh` (pack `29a612b`);
  `testcases/TC_conan_immortal_heroine_2026-11-20.md` G1 (a humanoid's hits) was left to a retest.
- #11 «Start adventure» and #33 «journeys locked» — `bugs/112_…`, `bugs/97_…`: «Путешествие» is the game's own page since pack `dc79053`; case J1 of
  `testcases/TC_conan_hub_game_pages_map_journey_2026-11-20.md` (expected: the journey buttons act; a journey opened in the session shows open at once).
- #12 map markers — `bugs/113_…`, case M1 of the same set (each marker at its click, the second placed, the reset removes both).
- #35 the hub at the Esc menu's time — `bugs/100_…`, first step 2: real Esc → the menu → real Esc out → Tab → the log line names the menu's 0.03, never 0.0001.
- #21 the world frozen behind an in-game loading screen — `bugs/79_…`: teleport and respawn passed; waystone travel and a dungeon entrance owed.

## Stand

The working build `D:\Games\Conan Exiles 3.1.1` made byte-equal to the published RC3 at 22:05 (146 of 147 shipped files equal by SHA-256 to the fresh install from
GitHub in `KUMM/.work/rc1_install/Conan_311`; only the player's `GameUserSettings.ini` kept) plus the dev remote `KrinikAgentRemote` the stand needs. The owner's save
(HOUSE_RULES 6). Machine lock `kumm`. The game in front (`launch-fg.ps1`), real mouse and keys by `mouse-seq.ps1`; frames by `capture-window.ps1`; the mods' lines
read from `ue4ss/UE4SS.log` after each case; god mode OFF unless a case says otherwise.

## Dimensions

Entry state (the save as left by 2026-11-20 20:29, god OFF) × the six issues' own paths × the hub's two entries (J key, Tab). Not covered: other journeys than
the one free card; humanoid hits beyond one enemy; the full-screen map by its own key (M2); the five other copied hub tabs (N3).

## Cases

| ID | Steps | Expected | Status | Observed |
|---|---|---|---|---|
| R0 | `launch-fg.ps1` → the main menu → «Продолжить» → the world; the remote reads the heroine's `bCanBeDamaged` before any god command | the world loads; `bCanBeDamaged` true | pass | 22:09:12 `enter-world-remote.sh`: «мир загружен (8 с)», «режим бога в сохранении: ВЫКЛ (bCanBeDamaged=true)»; frame f01: health 176 / 236 |
| R35 | in the world: real Esc → the Esc menu → real Esc → Tab (the hub opens on the inventory) → Tab closes it | the log: «ESC-меню открыто: 0.0001» for the menu, then «признак ESC-меню сброшен», then for the hub «меню открыто: … 0.03» — never 0.0001 for the hub | pass | 22:09:41 «ESC-меню открыто: замедление времени 0.0001», 22:09:44 «меню закрыто: замедление времени 1.0», 22:09:46 «меню открыто: замедление времени 0.03» + «модуль XCS_Panel: открыт». No «признак ESC-меню сброшен»: on the real path the game itself closed `SML_ModList`, nothing was stuck to clear (the expected line was mine, written from the remote path) |
| R11 | J → the hub on «Путешествие» → a journey card not yet taken → «Начать путешествие» (click, then Space on a second card if one is free) | the button acts: the panel says «В Процессе», the card glows active | pass | 22:11: «Воин» showed not taken (the start of J1 on 2026-11-20 was lost with the save restored from a backup); a real Space → «В Процессе», the card glows, the button gone (frames f05 → f06) |
| R33 | after R11, close the hub and open «Путешествие» again | the journey started in R11 shows as taken (open) at once, no other journey shows locked against the game's state | pass | Esc closed the hub (f07: the world shows the tracker «Воин · Уклонение»); J → «Воин» «В Процессе», glowing (f08) |
| R12 | the hub's «Карта»: right click at two named points, each confirmed by «Добавить маркер»; «Сброс маркеров» → «Да» | each marker within a few pixels of its click; the second placed; the reset removes both | pass | 22:13 on the 1280 frame: click (410, 569) → marker (409, 569); click (896, 216) → marker (896, 215); «Сброс всех маркеров на карте» → «Да» → both gone, the game's own icons stay (f10–f14) |
| R6 | a hostile humanoid within reach (the nearest camp, or placed by the stand tools) hits the heroine; health read every second; god ON again at half health | health drops after each hit | pass, with my mistake | 22:16:48 the heroine 4 m from «Киммерийский бронник I» (`near_humanoid.lua`), god off; frame 2 s later: 146 → 81; by the fifth frame (10 s) she was dead — I read every 2 s and switched god on only after the series. The save put back from the 22:14 backup |
| L1 | added 22:19 before its run (found in R6): KrinikConanLocomotion with the `type(mws) == "number"` guard deployed; enter, god off, `exec suicide`, 10 s on the respawn screen, respawn | no «шаг упал» line in `UE4SS.log` while dead (was 9 lines, 22:16:55–22:17:03, `…krinik_oblivion_locomotion.lua:242: attempt to perform arithmetic on a UObject`); after the respawn the section logs «скорость сменилась» as before | pass | 22:21:4x `exec suicide` → 15 s: «шаг упал» 0; «модуль RespawnPointSelection: закрыт», «скорость сменилась: MaxWalkSpeed 474.0», «взведено: герой в мире» |
| R21a | waystone travel (Waystones Enhanced): stand at a waystone, travel to another | the world time 1.0 read 5 s after the arrival; no «полноэкранный интерфейс: ОТКРЫТ» from the loading screen; the heroine lands | not run | Waystones Enhanced has no notes file (HOUSE_RULES 2) and a waystone is player-built; owed |
| R21b | a dungeon entrance (walk into its portal) and out | the same as R21a | not run | owed with R21a. Neighbour seen twice: death → respawn 22:17 and 22:21, no freeze, «взведено: герой в мире» |
| R24 | passive, the whole session: bow kills where the session gives them | no crash; `UE4SS.log` has no Lua error of a key bind | partial | no bow kill in the session; no crash in three game processes |
| R24b | added 22:37 before its run (#24, bug 85 — its cause class is closed in RC3: `check-lua-game-thread.py` 0 calls, no `RegisterKeyBind` outside comments in our mods, the UE4SS sample mods off): `KUMM/.work/rc3_retest/bow_kill_soak.sh 15` — per cycle a green Kappa summoned 8 m ahead and frozen (`arrow-stand.sh`), two REAL bow shots (`aim-shot.sh`: RMB, LMB — the LMB the removed bind used to catch), the kill by `KillCharacter`, 4 s for the corpse and the arrows' rebirth, the game's life checked (`pult.sh` exit 4 = dead) | 15 kills, no crash, no crash-report window; `UE4SS.log`: the «стрелы в трупе» lines per kill, no Lua error of KrinikConanArchery. The crash was rare (the owner's many kills before it), so a pass lowers the risk and does not prove its absence | pass | four runs 22:40–23:08, game PID 31104. Run 1: 15 `KillCharacter` deaths with NO shot (the bow was not in her hands — my mistake, EXP-0605). Run 2: 4 kills, 7 real shots, stopped by the driver's no-shot guard. Run 3: the shots hit but the detector went blind (EXP-0606). Run 4 (after a Kappa clean-up): 11 kills, 22 real shots, 2 / 2 every cycle. **Total 15 bow kills with real shots, 18 lines «к трупу прицеплено» (the arrows re-attached to the corpse — the path of the old crash), no crash, no crash-report window, no Lua error of KrinikConanArchery** |
| N1 | neighbours (HOUSE_RULES 39): the switches to and from «Карта» and «Путешествие» by mouse and Q / E; Esc and Tab close the hub from both | no bare-world frame, the hub closes | pass by end frames | Q ×3 «Карта» → «Путешествие», E ×3 back, Tab closed the hub, Esc closed it from «Путешествие» (f15–f17, f07); the frames in between were not recorded on video |
