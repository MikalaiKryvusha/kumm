# Research — arrows stay in the corpse: can Lua unbind the copy or spawn a copy with its own hit (plan 40.4 R1)

> **Created:** 2026-11-01 · **Parent:** `plans/40_epic40_phase4_arrows_in_corpse.md` R1; the run report `testcases/reports/2026-11-01_conan-arrows-corpse-recon.md`
> **Status:** R1 desk part done 2026-11-01 23:0x (web + the build's UE4SS); the live probes R2 / R4 not run
> **Outbound:** —

## The question

Every arrow copy `BP_DummyProjectile_C` binds its event `DestroyDummyIfAttachedObjectIsDestroyed` to the HIT actor's `OnDestroyed`; the dead creature's actor is
destroyed 1–2 s after the death and takes the copies with it (bytecode: ubergraph 3484 = `K2_DestroyActor`, no condition). Two Lua routes would keep a native,
E-pickable copy: (a) remove only that binding from the creature's `OnDestroyed`; (b) spawn a new copy whose own hit is the corpse mesh.

## Found

1. **UE4SS documents a per-binding removal on multicast delegates** — `docs.ue4ss.com/dev/lua-api/classes/multicastdelegateproperty.html`: `Remove(<target
   object>, <function name as FName or string>)` drops one binding, `Clear()` drops all; the sparse delegate (`multicastsparsedelegateproperty.html`) has the
   same API — `AActor.OnDestroyed` and `OnEndPlay` are SPARSE delegates in UE. Single-cast delegates have no Remove/Clear (assign nil). The docs are the `dev`
   branch — newer than the build's UE4SS.
2. **The build's UE4SS is `v3.0.1 Beta #0 – Git SHA 83330635`** (UE4SS.log header). Its DLL carries the Lua type names `MulticastDelegateProperty`,
   `MulticastInlineDelegateProperty`, `MulticastSparseDelegateProperty` (2 occurrences each — the pattern of a Lua class registration) next to the C++ property
   classes; whether the 3.0.1 Lua wrapper already has `Remove` / `Clear` is NOT shown by the strings — the live read decides (R2).
3. **Deferred spawn from Lua** (route b): UE4SS's `UWorld:SpawnActor(class, location, rotation)` wraps `BeginDeferredActorSpawnFromClass` +
   `FinishSpawningActor` with nothing between them (docs `uworld.html`) — no window to set `HitResultFromProjectile` before `BeginPlay`. The same two
   `GameplayStatics` functions are UFunctions and can be called from Lua directly (begin → set the copy's fields → finish) — unproven here; the UE forum pattern
   (begin, initialise, finish) is the standard way to set properties before construction scripts and `BeginPlay`. A deferred spawn may return an actor even
   when the engine logged a spawn failure — read the result.

## Next (live, the agent's own game — never the owner's, EXP-0433)

- R2: on a live Kappa with one arrow, ONE read: `tostring(creature.OnDestroyed)` and the wrapper's type; if it is a delegate wrapper — `Remove(copy,
  "DestroyDummyIfAttachedObjectIsDestroyed")` once, kill, count the copy at +10 s. A copy that outlives the creature then needs the corpse re-attach (the section
  already does it, run 7 of the 13:13 report) and its own end with the corpse (its lifespan, or a bind to the corpse's `OnDestroyed` if `Add` exists).
- R4 only if R2 fails.

## Sources

- [UE4SS — MulticastDelegateProperty](https://docs.ue4ss.com/dev/lua-api/classes/multicastdelegateproperty.html)
- [UE4SS — MulticastSparseDelegateProperty](https://docs.ue4ss.com/dev/lua-api/classes/multicastsparsedelegateproperty.html)
- [UE4SS — DelegateProperty](https://docs.ue4ss.com/dev/lua-api/classes/delegateproperty.html)
- [UE4SS — UWorld](https://docs.ue4ss.com/dev/lua-api/classes/uworld.html)
- [Unreal forum — spawning an actor with parameters](https://forums.unrealengine.com/t/spawning-an-actor-with-parameters/329151)
- [Unreal answers — remove multicast delegate](https://answers.unrealengine.com/questions/369342/view.html)
