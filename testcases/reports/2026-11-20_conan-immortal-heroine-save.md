# Run report — the heroine's god mode lives in the save (issue #6; cases G0, G2, G3)

## Work

Issue #6 (the owner's play of 0.9.1-RC1: enemies deal no damage to the heroine) against `testcases/TC_conan_immortal_heroine_2026-11-20.md`, plan 59 step 5
(«check the owner's working save for damage — first, before any fix»). Static checks before the run: `ServerSettings.ini` damage multipliers all 1; no Krinik
mod of the release sets `bCanBeDamaged` or calls `God()`.

## Contour

The owner's working game `D:\Games\Conan Exiles 3.1.1` (0.9.1-RC1 + the dev harness for the remote), his world save `ConanSandbox\Saved\Game_1.db` (3.1.x keeps
the world in `Game_1.db`; `Game_0.db` is the stale 3.0.1 file, last written 2026-11-17). Background path (`launch-bg.ps1`), remote reads only, no real input.

## Runs

1. 2026-11-20 20:14 — `launch-bg.ps1` (PID 34896), `enter-world-remote.sh`, the first read `pult.sh "lua … p.bCanBeDamaged …"` before any god command.
2. 20:15 — `god-on.sh off`; `post-key.ps1 -Key Escape`; `pult.sh "call W_IngameMenu_C_2147454298 CloseAndReturnToMainMenu"`; `enter-world-remote.sh`; the read.
3. 20:16 — the game closed by PID 34896; `launch-bg.ps1` (PID 35656); `enter-world-remote.sh`; the read.
4. 20:18 — `hostiles.lua` (the combat characters within 200 m); the heroine teleported 2.3 m from a kappa pack (−89600, 232142); health read 4 times, 4 s apart.
5. 20:19 — the game closed by PID 35656; `save-restore.sh` (fixed the same minute to pick the live `Game_1.db`) from a copy of `Game_1_backup_1.db` (20:17);
   20:19 `launch-bg.ps1` (PID 8844), world entry, the read and a frame; the game closed by PID 8844, the machine lock released.

## Checks

Hygiene: `save-restore.sh` printed «removed stale Game_1.db-wal / -shm», «integrity: ok», exit 0.
Functional run: the owner's world entered through the main menu by the remote; the heroine's state read live; a beast's attack in the world; the restored save
entered and looked at.

- G0 — fail: `bCanBeDamaged=false` at the first read of a fresh process (my D1 runs of 19:58 and 20:05 ended by closing the game by PID with god on).
- G3 — pass: off → clean exit → re-entry: true; a fresh process: true. The god-mode state is kept by the save across sessions.
- G2 — pass: health 215 → 170 → 97 → 13 → 0 in 16 s next to the kappas; the heroine died (my mistake: a pack, reads every 4 s).
- After the restore: alive, 227 / 236, at (−82309, 231568) by the campfire, the gear on the bar; a corruption mark of 4 HP from my D2 visit stays.

## Found

- **The save keeps god mode.** An agent run that switches god on (`god-on.sh`, the stand keeper) and ends without `god-on.sh off` followed by a save leaves the
  heroine immortal in the owner's next game — the likely cause of issue #6 (that his heroine of 18:3x carried it is a conclusion, not an observation: earlier
  chats ran god-on stands in this same world).
- `save-restore.sh` restored only `Game_0.db` — the 3.0.1 name; on 3.1.x it would have replaced a stale file and left the live world untouched. Fixed (the newest
  `Game_<digit>.db`, or `SAVE_DB=<name>`).
- My stand killed the heroine in the owner's world — restored from the game's own backup of 20:17.

- The guard (case G4, 20:27–20:29, a later launch PID 39168, background path, `enter-world-remote.sh` three times): «ВЫКЛ» → god on + save through the menu →
  the «ВНИМАНИЕ» line → god off + save → «ВЫКЛ». The guard reddens on the real threat (god mode saved in the world) and the owner's save ends with god OFF.

## Traces

- Frame of the restored world: `KUMM/.work/d1/06_restored.jpg`; the kappa list and the health reads are quoted above (remote `result.txt` overwritten per call).
- The save copy used for the restore: `KUMM/.work/d1/save/Game_1.db` (= `Game_1_backup_1.db` of 20:17).

## Verdict

partial — the mechanism is proven (G0 + G3) and the owner's save is mortal again (fresh-process read true); a humanoid hit (G1) and the owner's own play are the
retest of issue #6.
