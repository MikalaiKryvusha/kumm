# Mod notes — KrinikConanLocomotion (ours: how the hero moves — jumps in combat, run and jump growing with the hero)

> **Created:** 2026-11-07 · on the owner's word (below) · **Parent:** HOUSE_RULES rule 19 (the Krinik set), `KrinikConanArchery.md` (jump shooting 0.7.0),
> `KrinikConanGameplay.md` (section `krinik_oblivion_locomotion`)
> **Status:** 🔧 being built 2026-11-07 — the Lua mod created; jump shooting and the run / jump growth moved in; melee in a jump new · **Outbound:** —

**The owner's word, verbatim (2026-11-07 10:39 +03:00):** «Немного изменяем состав и структуру модов Krinik / ДОбавляем мод / KrinikConanLocomotion. В него входят:
/ - прыжки при стрельбе / - прыжки при махании холодным оружием / - развитие прыжка при прокачке / - развития ьега при прокачке / - ПЛАН: прыжки от карабкания по
стенам». The melee request itself, 2026-11-07 ≈10:10: «При прыжке с оружием ближнего боя - мечи и так далее - тоже нужно делать возможноть бить в воздухе, по
аналогии, как сделали стрельбу из лука в прыжке».

## What it holds

| Part | Came from | What it does |
|---|---|---|
| combat in a jump — the bow | `KrinikConanArchery` 0.7.0 (its section «стрельба в прыжке») | the bow fires in the air; a jump mid-draw takes off |
| combat in a jump — melee | new | a melee weapon strikes in the air; a jump mid-swing takes off |
| run and jump growth | `KrinikConanGameplay` section `krinik_oblivion_locomotion` | +3 cm/s to run, sprint and jump per Agility point (as in Oblivion) |
| PLAN — a jump off a climbed wall | the owner's request of 2026-11-02 09:07 (game map «Climbing») | not built |

## How the combat jump works (the game's two refusals — game map, «Атака в воздухе»)

1. `BaseBPCombat::ActionTry` refuses an attack while substate 8 (falling) — a UE4SS hook on it runs AFTER its body, so the substate is left at take-off:
   `HandleOnMovementModeChanged` → movement mode 3 → `ExitSubstate(8)`, for the player with a weapon in hand.
2. `BasePlayerChar::CanJumpInternal` refuses while `IsAttacking()` — called from C++, a hook never fires; after a refused `StartJump` the attacking hero on the
   ground, not exhausted (substates 13, 14, 18), gets `LaunchCharacter(0, 0, JumpZVelocity)`.

## Open

- Melee in the air: the attack montages carry root motion — whether the hero keeps the jump arc or hangs in the air is to be SEEN (case list in
  `testcases/TC_conan_locomotion_melee_jump_2026-11-07.md`).
