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
| A3 | Not on a block | direct call with bLocked true | no stain line | not run |
