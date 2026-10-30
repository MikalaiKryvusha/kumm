# Run report — Conan: shooting the bow while jumping (KrinikConanArchery 0.7.0)

**Work.** Plan 37 / plan 36 W14 — the bow works in the air: an attack in the air is let through, a jump during a draw lifts the hero; basis —
`testcases/TC_conan_jump_shooting_2026-10-30.md` (J1–J4 the remote experiment, M1–M5 the mod path); the owner's words of 2026-10-28 in plan 37.

**Contour.** Conan Exiles 3.0.1, the build's paks + Lua mods; the owner's save in the oasis; the bow in hand (socket checked: `Socket_Bow`); god
mode on (intended by `exec God`, which does nothing in 3.0.1 — the hero was mortal; EXP-0381); a hostile boss NPC that spawns at the oasis (`HumanoidNPCCharacter_20percentbigger_boss_C`, random names «Цирия Безголовая»,
«Арнос из Киммерии») killed by the remote before the cases; the game in front; machine lock taken per launch and released after.

**Runs.**
- 10:49:33 launch, `enter-world-focused.ps1`; 10:51–10:58 remote experiment: `pult.sh 'lua … RegisterHook(…ActionTry / HandleOnMovementModeChanged /
  StartJump …)'`, real input `mouse-seq.ps1 -Seq "kdown:0x20,wait:60,kup:0x20,wait:250,lclick,wait:2500"` and the draw variant
  `"rdown,wait:600,kdown:0x20,wait:60,kup:0x20,wait:240,lclick,wait:1200,rup,wait:1500"`; `capture-burst.ps1 -Count 20 -IntervalMs 60` (frames).
- 11:00:29 launch with 0.7.0 deployed; 11:02:00–11:03 the same sequences through the mod; 11:03 bow away / back (`kdown:0x31`) with jumps.

**Checks.**
- Hygiene: none (Lua loaded by the game; the hooks' set lines read in the log).
- Functional run: real input on the live build; read — the mod's log lines, a remote observer's line per arrow birth (movement mode and Z),
  two frame sheets of the jump shot.
- J1 pass (vanilla: no shot in the air) · J2 pass with a correction (clearing substate 8 inside `ActionTry` is too late — hooks run after the
  blueprint body; cleared at take-off it works) · J3 pass via `LaunchCharacter` (`CanJumpInternal` forbids a jump while attacking) · J4 pass.
- M1 pass (both hooks set) · M2 pass (arrow born in mode 3, +72 cm) · M3 pass (lift 420, arrow in mode 3, +90 cm, charge 0.34 kept) · M4 pass
  (bow on the back: no unlock; paired with the bow in hand: unlock lines 8 → 10) · M5 pass (plain jumps — no lift).
- Frames: the hero rises, then raises the bow and shoots in the air (arms play the shot; legs — not judged).

**Found.** none in the mod. Stand: the oasis spawns a hostile boss next to the hero — kill it by the remote first (recorded in the Conan map).
Untested: a jump during a draw while exhausted (the code returns on substates 13/14/18 — not run); the stamina cost of the lifted jump (the
native jump charges stamina; `LaunchCharacter` may not).

**Traces.** `D:\Games\Conan Exiles 3.0.1\ConanSandbox\Binaries\Win64\ue4ss\UE4SS.log` lines `[JumpObs]`, `[JumpTest]`, `[KrinikConanArchery] прыжок …`
(10:51–11:03); frame sheets in the session scratchpad (not kept).

**Verdict.** pass — the bow shoots in the air and a jump during a draw lifts the hero with the draw intact; open for the owner's eye: how the
jump shot looks and feels, and whether the lifted jump should cost stamina.
