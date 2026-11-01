# Plan 40.4 — arrows stuck in an enemy stay in its ragdoll corpse and can be picked up

> **Created:** 2026-11-01 · **Parent:** `plans/40_EPIC_conan_1.0.0_unfinished_six.md` phase 4 (criterion 4); plan 39 B3; notes `games/ConanExiles/mods/KrinikConanArchery.md` → Open
> **Status:** 🟡 criteria 1 (Kappa — arrows stay) and the killing arrow PASS 2026-11-01 23:18 / 23:25 by route (a), the UE4SS delegate `Remove` (R1 desk 23:0x, R2 live
> 23:17; pack `15a7c82`; TC A6–A8, A10); criterion 3 (E takes one shaft) — two tries failed, NOT concluded (A9; corrected 23:40) — interview #030 under discussion; criterion 2 (humanoid) and 4
> (the rest go with the corpse — by the copies' life = the corpse's) not run. Earlier: three blind attempts (report `testcases/reports/2026-11-01_conan-arrows-corpse-recon.md`)
> **Outbound:** if only route (c) survives and E cannot take a single arrow off the body — one question to the owner (`interviews/`): «стрелы — в добычу трупа» vs. drop

Basis, verbatim: `[OWNER]` 2026-11-01 09:11 «KrinikConanArchery · в этот мод идет еще одна фича · После смерти - регдол труп врага не должен уничтожать воткнутые в
него стрелы - все стрелы сохраняются, торчат из трупа, их можно собрать.»

## Goal vector (Achieve)

Today every arrow stuck in a creature vanishes 1–2 s after the kill: each copy `BP_DummyProjectile_C` binds `DestroyDummyIfAttachedObjectIsDestroyed` to the
hit actor's `OnDestroyed`, and that event's ubergraph entry 3484 is `K2_DestroyActor` first, with no condition; re-attaching the copy to the corpse cannot save
it; a Lua-spawned copy without its own hit leaves at once. Where we want to be: the arrows stay on the ragdoll at the hit places, the player takes them with E
(arrow count +1 each), the rest go away with the corpse — for a wild creature (Kappa) and a humanoid, at no per-frame cost.

## Acceptance criteria (scenario form)

1. **Kappa — arrows stay.**
   - Situation. A green Kappa frozen 8 m ahead with 3 arrows in it (head, body, leg), god on.
   - Action. The agent kills it by the remote `KillCharacter`.
   - Result. 10 s after the kill three shafts stand in the ragdoll at the three hit places.
   - Check. Frames at +2 s and +10 s (side and front, `capture-window.ps1`); the remote: 3 arrow objects (copies or our visual actors) alive at +10 s, each attached
     to the corpse's `DismemberedBodySkeletalMesh_C` at the hit bone (`GetAttachParent()`, `GetAttachSocketName()` = the bone logged at the hit).
2. **Humanoid — arrows stay.** As 1 with a humanoid. Check: the same reads and frames.
3. **E picks one.**
   - Situation. A corpse with 3 arrows (criterion 1), the hero 1.5 m from one shaft.
   - Action. The player presses E aimed at that shaft.
   - Result. The hero's arrow count grows by 1; that shaft is gone; 2 remain.
   - Check. The hero's inventory count of the arrow item (iron arrow 53612 or the shot item's `ProjectileItemTemplateID`) read before / after (recon R6);
     the remote counts 2 arrow objects on the corpse; frame.
4. **The rest go with the corpse.** Situation: 2 arrows on a corpse. Action: the corpse despawns (recon its lifetime; or the remote `K2_DestroyActor` on
   `Corpse_C`). Result: 0 arrow objects left. Check: the remote count = 0 at +2 s; no orphan at 0 0 0 (the leak of 2026-11-01).
5. **No cost.** Check: the section's minute summary in `UE4SS.log` — worst ≤ 0.1 ms; handlers run only at a hit, a death and a pickup (no timer).

## The stand (HOUSE_RULES rule 11)

| Part | Value | Set up by |
|---|---|---|
| Save | the 2026-10-31 16:56 copy (armour, bow in quick slot 1) | `bash _config/save-restore.sh "D:/Games/Conan Exiles Mods/_save-backup/2026-10-31_1656-before-manager-check"` |
| Place | open flat ground, no enemies / companions / buildings within 60 m, noon, clear | teleport + `tp_ground.sh`; `SetTimeOfDay(12.0)` |
| Hero | god on; food and water 100 read back (0 % kills even with god — STATUS); arrows: `exec MakeMeAdmin`, `exec SpawnItem 53612 50` | `god-on.sh`, remote |
| Creature | green Kappa (default class of `arrow-stand.sh`); humanoid — recon a LOADED humanoid class with a look (`Summon` needs a loaded class; `HumanoidNPCCharacter_C` comes without a look) — from `corpse-stand.sh`'s target or the game map line ≈117 | `CLASS_PATH=<path> bash _config/arrow-stand.sh summon; … place 8; … freeze` |
| Shots | 3 real shots | `bash _config/aim-shot.sh 1200` ×3 (verdict 0 = shot) |
| Kill | `npc:KillCharacter(0, FText(''), hero, {}, 0.0, hero)` | remote (pattern of `corpse-stand.sh`) |
| Corpse | match by bone of `DismemberedBodySkeletalMesh_C` (the `Corpse_C` actor stands ≈ 37 m off the body); positions by `K2_GetActorLocation` (`GetTransform` reads zeros) | remote |

## Steps

### Research (`/bug-research`, no code)

- [x] R1. DONE 2026-11-01 23:0x (desk part) — `researches/conan-arrows-in-corpse/README.md`: UE4SS documents `Remove(target, funcName)` / `Clear()` on multicast
      and sparse delegates; the build runs UE4SS 3.0.1 Beta (SHA 83330635) whose DLL has the Lua delegate types — `Remove` proven only by R2 live; `SpawnActor`
      gives no window before `BeginPlay`, the `GameplayStatics` begin / finish pair is callable directly (route b). Former text: `/bug-research` on «BP_DummyProjectile dies on the hit actor's OnDestroyed»: web (UE4SS docs and issues: unbinding / clearing a multicast delegate
      from Lua; `RegisterHook` on a BP event — can a pre-hook skip the original; `BeginDeferredActorSpawnFromClass` / `FinishSpawningActor` from UE4SS Lua),
      local (the UE4SS version in the build: `ConanSandbox/Binaries/Win64/ue4ss/` docs / changelog). Raw notes → `researches/conan-arrows-in-corpse/README.md`.
- [x] R2. DONE 2026-11-01 23:17–23:25 — the wrapper `MulticastSparseDelegateProperty` has `Remove`; with it the copies survive the creature (TC A6–A8, A10). Former text: **Route (a) — unbind.** Probe by the remote on a live Kappa with one arrow: read `creature.OnDestroyed` from Lua (type, any `Clear`/`Remove` method);
      if a method exists — clear only the copy's binding (or all — then check what else the game binds there: `kismet-trace.py` on the creature's BP for
      `OnDestroyed` binders), kill, count copies at +10 s.
- [ ] R3. **Route (a′) — the asset.** `BP_DummyProjectile` is a GAME asset: our `KrinikConanArchery` kit pak could override it (as `KrinikConanUI` overrides
      vanilla widgets). Read the ubergraph around the bind (`kismet-trace.py … ExecuteUbergraph_BP_DummyProjectile`, offsets near 3484 and the bind node):
      can a `patch-mod-asset.py` row (`bool:` / an offset jump) skip the bind or the `K2_DestroyActor`? Check `kit-missing-refs.py` cost of overriding it.
      House rule 8 applies by analogy (edit by a script next to the pak, re-appliable).
- [ ] R4. **Route (b) — a copy with its own hit.** From Lua: deferred spawn of `BP_DummyProjectile_C` with `HitResultFromProjectile` filled (Component = the corpse
      mesh, BoneName, ImpactPoint), `StaticMeshToShow`, `IsLootable` true, `ProjectileItemTemplateID`, then `FinishSpawningActor`; it then binds to the CORPSE's
      `OnDestroyed` — the wanted lifetime. Probe: one copy, read attach parent and life at +10 s.
- [ ] R5. **Route (c) — visual + loot.** A `StaticMeshActor` (mesh = the copy's `StaticMeshToShow`) attached to the corpse bone at the copy's relative transform;
      pickup = the arrow item added to the corpse's loot inventory (recon the corpse inventory add call) — E on the corpse then loots it; E on one shaft is NOT
      native here → the outbound question.
      **Fact for this route (2026-11-01 17:48, bug 73 V1–V3):** a visual mesh needs no actor spawn — `actor:AddComponentByClass(StaticMeshComponent, true,
      <identity transform>, false)` works from Lua without a crash, then `SetStaticMesh`, `SetCollisionEnabled(0)`, `K2_AttachToComponent(<mesh>, FName(<bone>),
      2, 2, 0, false)` (`krinik … add_visual_arrow` in the archery `main.lua`). For the corpse: the component on the CORPSE actor, attached to its mesh at the
      copy's bone, the copy's relative transform kept.
- [ ] R6. **Pickup facts:** what the game does today on E at a lootable copy on the ground (a miss): the interaction class / prompt, the inventory read of the arrow
      count (recon: the hero's inventory component `funcs`, e.g. a count-by-template call; record the working one in the game map).
- [ ] R7. Verdict in the research README: the chosen route, the evidence, the routes refuted; the notes' Open bullet rewritten (rule 2).

### Implementation (by the chosen route)

- [ ] I1. `ConanExiles/_unpacked/KrinikConanArchery/ue4ss/Scripts/main.lua`, section «стрелы в трупе»: at the corpse's birth (`NotifyOnNewObject` on the NATIVE
      `/Script/ConanSandbox.CorpseBase` — the BP class is not loaded at mod start) + `ExecuteInGameThreadWithDelay` until the creature's copies are known; per
      copy: route (a) unbind / (b) replacement copy on the corpse bone / (c) visual + loot; the old copy left to the game; own error counter; `os.clock` summary.
- [ ] I2. Route (a′) only: the kit/patch script `_config/devkit/patch-dummy-projectile.py` (or a `patch-mod-asset.py` table) + `KrinikConanArchery` kit rebuild
      (`kit-archery-edit.py` → `kit-buildmod.py KrinikConanArchery <out>`, `devkitRevisionNumber` 1002); `mod-overrides.py` shows the override.
- [ ] I3. The hub row `arc_corpse` («Стрелы остаются в трупе», check, default on) ONLY if the owner asks — not by default (rule 23: no row without mechanics; no
      new row without a word).
- [ ] I4. Hygiene: `loadfile`, `check-lua-game-thread.py` 0, `check-lua-templates.py` 0.

### Test in the live game

- [ ] T1. Update `testcases/TC_conan_arrows_stay_in_corpse_2026-11-01.md`: A2–A5 re-armed to `[NOT-TESTED]` for the new route, + A6 (E picks one), A7 (rest go
      with the corpse), A8 (cost), A9 (no orphan at 0 0 0), A10 (a miss into the ground still lootable — regression). The testcase-gate needs changed lines.
- [ ] T2. Lock (`--what "epic40 p4 arrows" --minutes 90`), deploy (P2), launch, world entry; the stand; Kappa then humanoid; frames side and front at +2 s / +10 s;
      E by `mouse-seq.ps1 -Seq "kdown:E,wait:300,kup:E"` with the camera aimed (recon aim: the remote sets the controller rotation toward the shaft);
      a clip of kill → shafts → pickup (rule 4).
- [ ] T3. `close-game.ps1`, lock released; crash-report window by PID if any (rule 9); report
      `testcases/reports/<YYYY-MM-DD>_conan-arrows-in-corpse.md`; review folder `НА ОТСМОТР НИКОЛАЕМ/<N> стрелы в трупе/`.

### Packaging into the build

- [ ] P1. Sources: `ConanExiles/_unpacked/KrinikConanArchery/ue4ss/Scripts/main.lua`; for route (a′) the rebuilt `KrinikConanArchery.pak` and its patch script.
- [ ] P2. `modpack.json` entry `KrinikConanArchery`: version line «0.8.0 — arrows stay in the corpse» in `version`; `verify` unchanged unless a file is added.
      `Deploy-ModPack.ps1 -PackDir D:/work/ai_sandbox/ConanExiles -Deploy -Only KrinikConanArchery` then `-Verify` → exit 0.
- [ ] P3. Same commit (rule 20): `KrinikConanArchery.md` («Stuck arrow copies», Open → done with the report), the game map's corpse block, plan 36 W13, plan 39
      B3, the guide's archery lines. Pack commit + push; KUMM commit + push.

## Risks

- (a) UE4SS Lua cannot clear a multicast delegate and cannot skip a BP event → routes (a) fail; (b) or (a′) remain.
- (a) A deferred spawn's struct fields (`HitResult` weak `Component`) may not be writable from Lua → (b) fails; (a′) or (c).
- (b) Overriding `BP_DummyProjectile` in our pak touches every projectile copy of the game (all bows, throwing weapons) — regression A10 and a thrown-weapon case.
- (b) Ragdoll bones move after the kill — attach to the bone, never to a world position.
- (c) Corpse despawn time is long (600 s seen as the corpse's life) — criterion 4 uses the remote destroy, one natural despawn observed if time allows.
