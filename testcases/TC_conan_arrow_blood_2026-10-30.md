# Test cases — Conan: an arrow hit on a creature leaves blood on the ground (plan 36 W30)

> **Created:** 2026-10-30 · **Parent:** plan 36 W30 (`[OWNER]` «можем сделать, чтобы стрела, попадающая во врага - тоже кровь на землю давала?» · ≈12:5x)
> **Status:** written 2026-10-30 23:51 +03:00, before the run
> **Outbound:** a real arrow hit — the owner's eye (a shot needs input)

**Basis.** The owner's ask; the native stain (hook 23:50): size (32, 67…95, 67…95), Pitch −90, random Yaw, life 3 s; `TakeProjectileDamage`
signature read by the remote. The fix: `KrinikConanGraphics` section 2 — a post-hook of `BP_CollisionComponent_C:TakeProjectileDamage`.

**Stand.** Oasis save, background launch, god mode; the boss near the hero; the remote calls the hero's `BP_CollisionComponent:TakeProjectileDamage`
DIRECTLY with ActortoDamage = the boss, empty AttackData, a default HitResult (the owner's «прямым вызовом методов»). Not covered: the real arrow path.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| A1 | Hook up | game start, UE4SS log | «раздел 2 (кровь от стрел): перехват TakeProjectileDamage встал» | run 1 23:51 **fail**: «no UFunction … found» (the BP class not loaded at mod start) → lazy hook on the first `BP_CollisionComponent_C`; run 2 23:53 **pass** (installed 10 s after start) |
| A2 | A stain under the target | direct call | log «стрела: пятно под <boss>» and section 1's «пятно …: лежит 300 с» | **blocked** 23:54: the remote command fails with no message even when only looking up the hero's `BP_CollisionComponent_C` via `GetOwner()` — next chat: find the hero's component another way (`p.BP_CollisionComponent` / `GetComponentByClass`), then the direct call |
| A3 | Not on a block | direct call with bLocked true | no stain line | **pass** 2026-10-31 08:24:4x: «стрела» lines before 2, after 2 |
| A2b | A stain under the target — the component found by class | the boss's OWN `BP_CollisionComponent_C` by `boss:GetComponentByClass(StaticFindObject('/Game/Systems/Combat/BP_CollisionComponent.BP_CollisionComponent_C'))`, then `comp:TakeProjectileDamage({}, 0, boss, nil, nil, 0, {}, false)` — one remote action per call (find → call), stand check after each | the section's line «стрела: пятно под <boss>»; a frame of the ground under the boss | **fail** 2026-10-31 08:05–08:06: the lookup WORKS (`GetComponentByClass` → `BP_CollisionComponent` of the boss at 44.7 m); the call needs `Combo` as a table (`{}` — a struct; `0` → «Parameter must be of type 'StructProperty'»), then `called ok=true` — but no section line and no section-1 stain line. A probe hook by the remote: «[probe] TPD pre» printed, «post» never → the section's POST-hook never runs. Fix: the work moved into the PRE-hook |
| A2c | as A2b after the fix | game restarted with the pre-hook build, same stand and call | «стрела: пятно под HumanoidNPCCharacter_20percentbigger_boss_C_…» then «пятно DecalComponent_…: лежит 300 с»; a frame of the stain under the boss | **pass** 2026-10-31 08:24:03: «пятно DecalComponent_2147455535: лежит 300 с» then «стрела: пятно под HumanoidNPCCharacter_20percentbigger_boss_C_2147456284» (the boss «Ульрик Зверь», 40.1 m); second hit 08:24:34 framed from 8 m: a dark-red stain on the sand under him (review folder 22). Not covered: a REAL arrow from the hero's bow (the shot needs input) — does the game's own call path reach the pre-hook the same way? The pre-hook fires on every call of the UFunction, so it should; the owner's first real shot is the check |
