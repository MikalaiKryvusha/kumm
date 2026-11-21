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

## 7. Verdict

pass for #6, #11, #12, #33, #35 — each issue's own case passed by the player's path on the published RC3 bytes; the issues can be closed. #21 stays open (waystone
and dungeon owed). One new defect found and fixed in the pack (the locomotion error while dead).
