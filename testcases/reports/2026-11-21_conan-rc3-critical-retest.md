# Test run report — five critical issues retested on the published 0.9.1-RC3 by the player's path; a locomotion error found and fixed

**Created:** 2026-11-21 22:26 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** 0.9.1-RC3 (the published bytes, see Contour) + KrinikConanLocomotion with
the death guard (pack working tree, L1 only)

## 1. Work

The retest HOUSE_RULES 44.4 asks before an issue closes, for the critical issues whose fixes shipped in RC3: #6 no damage from enemies, #11 «Начать путешествие»,
#33 journeys locked, #12 map markers, #35 the hub at the Esc menu's time; the owed waystone and dungeon cases of #21. Case set —
`testcases/TC_conan_rc3_critical_retest_2026-11-21.md` (written before the run; L1 added before its run).

## 2. Contour

The working build `D:\Games\Conan Exiles 3.1.1` was a MIXTURE before the run: pack_version 0.9.1-RC3, yet 66 of the 147 shipped files differed from the
published RC3 (third-party paks of 2026-11-20 17:36, the RC2 Graphics pak, another camera config). 22:05: the 65 differing files copied from the fresh install of
the published release (`KUMM/.work/rc1_install/Conan_311`, report `2026-11-21_conan-rc3-first-install-from-zero.md`) by `KUMM/.work/rc3_fresh/align_to_published.mjs`;
recompared by `compare_shipped.mjs`: 146 of 147 equal by SHA-256, only the player's `GameUserSettings.ini` kept. Plus the dev remote `KrinikAgentRemote`. The
owner's save (HOUSE_RULES 6), 3840 × 2160 at 300 %. Machine lock `kumm` 21:36–22:24.

## 3. Runs

1. 2026-11-21 22:08:13 – 2026-11-21 22:18 — game PID 36816, `launch-fg.ps1`, `enter-world-remote.sh`; real keys and mouse by `mouse-seq.ps1` (Esc 0x1B, Tab 0x09,
   J, Space 0x20, Enter 0x0D, Q, E, right and left clicks at screen fractions); `god-on.sh`; `pult.sh "lua return dofile('…/KUMM/.work/rc3_retest/near_humanoid.lua')"`;
   frames `capture-window.ps1` f01–f20. Closed by PID.
2. 22:18 — `save-restore.sh` from a copy of `Game_1_backup_1.db` (22:14).
3. 22:19 — `Deploy-ModPack.ps1 -Deploy -Only KrinikConanLocomotion -PackDir ConanExiles` (verify: only the dev-only KrinikConanMusic files missing).
4. 22:20:24 – 22:22 — game PID 40968, `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh off`, `pult.sh "exec suicide"`, the log read 15 s later. Closed by PID.
5. 22:22:26 – 22:24 — game PID 13264: the save restored again, entry, `god-on.sh off`, `post-key.ps1 -Key Escape` + `CloseAndReturnToMainMenu` (the save
   written with god off), re-entry, `bCanBeDamaged=true` read on `BasePlayerChar_C`, frame f22 (the heroine with her gear). Closed by PID; lock released.

## 4. Checks

Hygiene: `node --check` / a run of the stand scripts on real data (`compare_shipped.mjs`, `align_to_published.mjs`, `near_humanoid.lua`).

Functional run: the player's path on the published bytes with real input, frames and `UE4SS.log` READ.
- R0 pass — «мир загружен (8 с)», «режим бога в сохранении: ВЫКЛ (bCanBeDamaged=true)».
- R35 pass (#35) — «ESC-меню открыто: замедление времени 0.0001» → «меню закрыто: … 1.0» → Tab: «меню открыто: замедление времени 0.03», «модуль XCS_Panel: открыт».
- R11 pass (#11) — «Воин» → a real Space → «В Процессе», the card glows, the button gone.
- R33 pass (#33) — after Esc and J again, «Воин» shows «В Процессе»; the world's tracker «Воин · Уклонение».
- R12 pass (#12) — markers at (409, 569) and (896, 215) for clicks at (410, 569) and (896, 216) on the 1280 frame; «Сброс всех маркеров на карте» → «Да» removes both.
- R6 pass (#6) — next to «Киммерийский бронник I» with god off: health 146 → 81 in 2 s, death within 10 s. My mistake: reads every 2 s, god back only after the series.
- L1 pass — with the guard deployed, a death by `exec suicide`: «шаг упал» 0 (was 9 in R6); after the respawn «скорость сменилась», «взведено: герой в мире».
- N1 pass by end frames — Q / E switch «Карта» ⇄ «Путешествие», Tab and Esc close the hub; the frames in between not recorded on video.
- R21a / R21b not run (owed); the respawn neighbour passed twice. R24 partial: no bow kill happened, no crash in three processes.

REAL WORLD: accumulated — the owner's save with his heroine (level 25, journeys, markers, starving 0 % food and water), a working build that had drifted into a
mixture of releases; data and machine — his save, this machine, the published RC3 bytes; path — real keys and mouse, the game in front. Verified on the real
world for R0–R12 and R35; R6 and L1 on the same save (restored after each death).

## 5. Found

- S2 — KrinikConanLocomotion logs «шаг упал: …krinik_oblivion_locomotion.lua:242: attempt to perform arithmetic on a UObject» every second while the hero is dead
  (the death pawn has no movement component; UE4SS returns an object, not a number). Fixed in the pack (`type(mws) == "number"`), L1 pass; ships with the next build.
- S3 — the working build had drifted from the release it reported (66 of 147 files); aligned for this run. The same drift can hide in any retest on that build.
- Not a defect: the heroine starves (0 % food and water) — the game's own survival.
- The save backups `Game_1_backup_N.db` lag the live game: the 22:14 backup returned the heroine to her 22:09 spot without the 22:11 journey start
  (the recent rows sit in the SQLite write-ahead log, which a backup file copy does not carry) — the same lost the journey started on 2026-11-20.

## 6. Traces

Frames `KUMM/.work/rc3_retest/f01–f22.jpg` (work folder); the UE4SS log of each session in the game folder; `KUMM/.work/rc3_fresh/compare.out`.

## 8. Addendum — case R24b, the bow-kill crash (#24), 22:37–23:10

Contour: the same working build (Archery = published RC3 bytes; Locomotion with the L1 guard), game PID 31104 in front, machine lock `kumm` 22:37–23:10.
Runs: `KUMM/.work/rc3_retest/bow_kill_soak.sh` ×4 (outputs `soak.out`, `soak3.out`), then `ConanExiles/_config/aim-shot.sh` (fixed) once plus its control.
Checks — Functional run: per cycle a green Kappa summoned, placed 6 m ahead on the dry beach camp and frozen, two real shots (RMB, LMB), `KillCharacter`,
4 s, a liveness call. Run 1 — 15 deaths with no shot (the bow not in hand; the owner caught it 22:51: «если в руки лук не брать, то выстрелов из лука не
будет»). Run 2 — 4 kills / 7 shots, stopped by the no-shot guard. Run 3 — hits the detector did not see (`log_shots = 10`). Run 4 — 11 kills / 22 shots.
Total: **15 bow kills with real shots; 18 «к трупу прицеплено»; no crash, no crash-report window, no archery Lua error**. The cause class is closed in RC3
(no `RegisterKeyBind` call in our mods, the guard 0). The crash was rare, so 15 kills lower the risk and do not prove its absence.
Found: my two stand defects (EXP-0605, EXP-0606); `aim-shot.sh` fixed in the pack (`2e0499b`): a shot past the 10th — «1 · 1», exit 0; inventory open — «0 · 0», exit 1.
Verdict: pass — #24 can be closed.

## 9. Addendum — case S8 of the bow sprint (#30, bug 93), 23:17–23:24

Contour: the same working build, game PIDs 4916 and 41812 (background launch; `mouse-seq.ps1` brings the game forward for the real keys), the save copied
with its `-wal` before the stones (`KUMM/.work/rc3_retest/save_s8`) and put back after; machine lock `kumm` 23:17–23:24.
Runs: `sprint-run-probe.lua` (remote movement, no draw) unloaded and with `exec SpawnItem 10001 1500` (load 154 vs the bar's 76); real keys
`mouse-seq.ps1 "…kdown:W…kdown:0x10…rdown,wait:1500,lclick…"` overloaded and unloaded; the Locomotion lines of `UE4SS.log` read.
Checks — Functional run: unloaded sprint — substate 7, MaxWalkSpeed 659.5; overloaded sprint — native `K2_CanSprint` true, substate 7, MaxWalkSpeed 197.9 (no
weight refusal, a multiplier); overloaded + bow drawn by real keys — 83.2, no BowSprint line (our gate stayed shut); unloaded + bow drawn by real keys —
659.5 held, «лук натянут и спринт зажат: тип движения — спринт» ×5. The remote probe's own draw does not draw (no 11 / 15 / 16) — real keys only.
Found: none in the build. Verdict: S8 pass — the weight's effect stays with our bow sprint; the judge's worry (the override bypasses a weight refusal) has
no refusal to bypass. #30 keeps one owed case, S9 (a sheathed bow in a sprint).

## 7. Verdict

pass for #6, #11, #12, #33, #35 — each issue's own case passed by the player's path on the published RC3 bytes; the issues can be closed. #21 stays open (waystone
and dungeon owed). One new defect found and fixed in the pack (the locomotion error while dead).
