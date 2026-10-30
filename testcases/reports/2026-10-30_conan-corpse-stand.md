# Run report — Conan: `corpse-stand.sh`, a corpse near the hero by the remote

**Work.** The stand for the corpse cases (plan 36 W6, W10a, W25) after the 16:20 crash (EXP-0387): the 2026-10-28 way — `KillCharacter` on the live NPC found
by a full-name filter. Cases: K1 nothing within the radius → rc 2, no call made · K2 an NPC within the radius → killed, rc 0, the game alive, the death in the log.

**Contour.** Conan Exiles 3.0.1 with the build; the background launch path; the owner's save copied to `_save-backup/2026-10-30_1652-before-corpse-stand`
and restored by `save-restore.sh` (integrity ok); lock 16:52–16:5x.

**Runs.**
- 16:53 `launch-bg.ps1` · `enter-world-remote.sh` · `god-on.sh` · `bash corpse-stand.sh 40` → «nearest: none», «no NPC within 40 m», rc 2.
- 16:5x `bash corpse-stand.sh 200` → «nearest: HumanoidNPCCharacter_20percentbigger_boss_C_2147457411 43.4», «killed …», rc 0; game process present.
- `ConanSandbox.log`: «KillCharacterWithRagdoll_Implementation … Name: HumanoidNPCCharacter_20percentbigger_boss_C_2147457411»; `close-game.ps1`; restore.

**Checks.**
- Hygiene: `bash -n`.
- Functional run: the real game; read — the script's lines and exit codes, the process list, the game log.
- K1 pass · K2 pass.

**Found.** none. The default radius 30 m is too short at the owner's oasis save (the boss stands at 43.4 m) — pass 50 there.

**Traces.** Command output in the chat transcript of session 5db69748; the game log of the 16:52 session. No crash-report window.

**Verdict.** pass.
