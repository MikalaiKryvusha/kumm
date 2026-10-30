# TC — Conan: shooting the bow while jumping (plan 37, W14)

> **Created:** 2026-10-30 · **Parent:** `plans/37_conan_jump_shooting.md`; `[OWNER]` «стрельба в прыжке - одна из важнейших фисек Обливион» · 2026-10-28
> **Status:** 2026-10-30 — remote experiment 10:51–10:58 (J1–J4) and the mod path 0.7.0 11:01–11:03 (M1–M5) pass; report testcases/reports/2026-10-30_conan-jump-shooting-0.7.0.md
> **Outbound:** —

**Basis.** Bytecode 3.0.1 (`kismet-trace.py`, 2026-10-30): `BaseBPCombat::ActionTry` refuses an attack while `InSubstate(8)` (falling,
`.uexp`+66573); `StartJump` refuses only on substates 18 and 14 and the engine's `CanJump`. Approach B: for the PLAYER only, leave substate 8
when he jumps — `ExitSubstate(8)` on his combat component — so `ActionTry` lets the shot through in the air.

**Stand.** The owner's save in the oasis; the bow in hand (checked by eye on a frame before the first shot); god mode on; the companion moved
away from the line of fire; arrows in the quick bar; the game in front; real input by `mouse-seq.ps1` (Space = `kdown:0x20`/`kup:0x20`).
Observation: the arrow counter in the mod log (`#N из лука`) and the hero's height at launch (log line; the remote reads `K2_GetActorLocation`).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| J1 | Control: vanilla refuses | Space, wait 250 ms, LMB (no fix) | no `#N из лука` line while in the air | pass — 10:51, no shot line (remote experiment) |
| J2 | Substate 8 is the gate | the remote's temporary hook clears the player's substate 8 when he leaves the ground; Space, wait 250 ms, LMB | a `#N из лука` line; the hero's Z at launch higher than standing Z by > 50 cm | pass with a correction — clearing 8 INSIDE ActionTry was too late (UE4SS hooks on blueprint functions run after the body: 10:52:18 ActionTry in mode 3, no arrow); cleared at take-off (movement mode → 3): 10:52:37 arrow born in mode 3 at Z +90 cm, shot #3 |
| J3 | Jump during a draw | RMB down, wait 600 ms, Space, wait 300 ms, LMB, RMB up | the hero leaves the ground (Z rises) and the arrow flies (log line) | fail natively (10:53: StartJump called, CanJump=false — BasePlayerChar::CanJumpInternal forbids a jump while IsAttacking); pass with LaunchCharacter(0,0,420) after the refused StartJump — 10:55:40 falling, arrow born in mode 3 at Z +90 cm, charge 0.31 kept; frames: the arms draw and shoot in the air |
| J4 | NPCs unchanged | read the hook: it acts only on the locally controlled player's component | code check: `IsPlayerControlled` before `ExitSubstate` | pass — both handlers return unless IsPlayerControlled and the bow is in hand |

**The mod path — KrinikConanArchery 0.7.0** (the remote experiment moved into the mod: `HandleOnMovementModeChanged` → falling → `ExitSubstate(8)`;
`StartJump` refused while attacking with the bow → `LaunchCharacter(0, 0, JumpZVelocity)`; both only for the player with the bow in hand).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| M1 | Hooks set | world entry | log: «прыжок: перехват HandleOnMovementModeChanged поставлен», «… StartJump поставлен» | pass — both lines at world entry 11:01 |
| M2 | Instant shot in the air | Space, wait 100 ms, LMB | log «выстрел в воздухе разрешён», then «#N из лука»; a remote observer shows the arrow born in mode 3 | pass — 11:02:02 «разрешён», arrow born in mode 3 at Z +72 cm, shot #1 |
| M3 | Jump during a draw | RMB down, 600 ms, Space, 240 ms, LMB, RMB up | log «прыжок посреди натяжки: толчок 420», the arrow born in mode 3 | pass — 11:02:05 «толчок 420 см/с», arrow born in mode 3 at Z +90 cm, shot #2 at charge 0.34 |
| M4 | Control: bow on the back | key 1 (bow away), Space | no «выстрел в воздухе разрешён» line for that jump | pass — bow at sheath_bow: unlock lines 8 → 8; paired: bow back at Socket_Bow, the same jump → 8 → 10 (the log cap 10 was not reached) |
| M5 | Plain jump with the bow | Space, no attack | «разрешён» line, no «толчок» line (the native jump ran) | pass — plain jumps gave «разрешён» lines and no «толчок»; one «толчок» only, for the jump during the draw. Note: the handler runs twice per take-off (two lines) — harmless |
