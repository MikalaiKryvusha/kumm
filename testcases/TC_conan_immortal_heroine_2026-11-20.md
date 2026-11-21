# TC — enemies deal no damage to the heroine (issue #6)

> **Created:** 2026-11-20 · **Parent:** issue #6 (the owner's play of 0.9.1-RC1, 2026-11-20 ≈18:3x), plan 59 step 5
> **Status:** written 2026-11-20 20:13 — run 20:14–20:20: G0 fail, G2 pass, G3 pass, G1 and N1 not run; report `testcases/reports/2026-11-20_conan-immortal-heroine-save.md`
> **Outbound:** the result goes to issue #6 as a comment

## Test basis

- Issue #6 (filed from the owner's words of 2026-11-20): «При атаках врагов герой не получает урона и остаётся бессмертным»; exact steps unknown.
- Plan 59 step 5: before any fix, check whether the agent's own dev god mode (`_config/god-on.sh` → `CheatManager:God()` → the hero's `bCanBeDamaged` false) stayed
  in the owner's save.
- Read 2026-11-20 20:1x: `ServerSettings.ini` of the working game — `PlayerDamageTakenMultiplier=1`, `NPCDamageMultiplier=1`; no Krinik mod of the release sets
  `bCanBeDamaged` or calls `God()` (grep over `_unpacked/Krinik*`: only the dev bench, not installed before 2026-11-20 19:57); no agent run of 2026-11-20 before the
  owner's play switched god mode in his world (reports of the day).

## Stand

The working game `D:\Games\Conan Exiles 3.1.1` (0.9.1-RC1 + the dev harness for the remote), the owner's save (HOUSE_RULES 6). God mode is NOT switched on at
entry: the first remote read comes before any `god-on.sh`. An enemy for the hit — the nearest hostile humanoid or beast within 60 m, or one spawned by the remote
in front of the heroine; the heroine's health read before and after.

## Dimensions

State at entry (as saved) × source of the hit (a humanoid NPC · a beast) × the world after a clean exit through the menu (persisted or not). Not covered: thralls,
falling damage, the corruption damage (seen working 2026-11-20 20:08 — «Здоровье снижено на 1 HP» at the corruption plant).

## Cases

| ID | Case | Expected | Status |
|---|---|---|---|
| G0 | Enter the world; the first remote read: `bCanBeDamaged` of the heroine, her health, `CheatManager` present | `bCanBeDamaged` true (a mortal heroine) — false means the save or an earlier agent run carries god mode | **fail → the cause** (20:14, a fresh process, no god command before the read): `bCanBeDamaged=false`, CheatManager present. Confound named: my D1 runs of 19:58 and 20:05 had switched god on and the game was closed by PID with it on |
| G1 | A hostile humanoid hits the heroine three times (stand: the nearest camp or a spawned enemy) | health drops after each hit, the log of the hit present | skipped then — G2 showed damage. **Run 2026-11-21 22:16 as case R6 of `testcases/TC_conan_rc3_critical_retest_2026-11-21.md`: pass** — «Киммерийский бронник I», health 146 → 81 in 2 s (and the heroine died: my reads were too sparse, EXP-0603); issue #6 closed 22:31 |
| G2 | A beast hits the heroine three times | health drops | **pass, with my mistake** (20:18): next to a pack of kappas the health went 215 → 170 → 97 → 13 → 0 in 16 s — damage works with `bCanBeDamaged=true`; I read the health only every 4 s and the heroine died. The save was put back from `Game_1_backup_1.db` (20:17, before the death) by `save-restore.sh`; 20:20 she stands alive by the campfire, 227 / 236, the gear on the bar (frame `KUMM/.work/d1/06_restored.jpg`) |
| G3 | If G0 read false: `god-on.sh off`, a clean exit through the Esc menu to the main menu, «Продолжить» again, the read of G0 | true after the re-entry — the state was the agent's; still false — the save keeps it, find the field | **pass → the mechanism** (20:15–20:17): `god-on.sh off` → true; Esc menu → `CloseAndReturnToMainMenu` → «Продолжить» → true; a FRESH process (closed by PID, relaunched) → true. With G0 (false in a fresh process after a run that ended with god on): **the save keeps the god-mode state across sessions** |
| G4 | The guard in `_config/enter-world-remote.sh` (reads the flag after every agent entry): an entry into a save with god OFF, then god on → save through the menu → entry, then god off → save → entry | «режим бога в сохранении: ВЫКЛ», then the «ВНИМАНИЕ: в сохранении включён режим бога» line (the red run), then «ВЫКЛ» again | **pass** (20:27–20:29, background path): «ВЫКЛ (bCanBeDamaged=true)» → `god-on.sh` + Esc + `CloseAndReturnToMainMenu` → «ВНИМАНИЕ: в сохранении включён режим бога (bCanBeDamaged=false)…» → `god-on.sh off` + the same save → «ВЫКЛ». The owner's save is left with god OFF |
| N1 | Neighbours: the heroine's own attacks still hurt an enemy; the corruption still lowers the health cap | both work | — |
