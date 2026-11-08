# Mod notes — KrinikConanArchery (ours: the hero's bow)

> **Created:** 2026-10-30 · **Parent:** the mod-notes lock (KAIF #186); written from the manifest entry (`ConanExiles/modpack.json`) and plan 36 W34
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Two halves of one mod (`[OWNER]` «почему у нас какой-то BowFixes? Нельзя всё, что по стрельбе из лука - в один мод собрать?» · 2026-10-28;
name — «мод KrinikConanAim переименовываем в KrinikConanArchery»). Before: KrinikArrowAim and KrinikBowFixes.

## Where things are

- Kit pak `Mods/KrinikConanArchery.pak` (not in git): kit in mod mode `F:\CEUE5Devkit\UE4\Content\Mods\KrinikConanArchery` (`active.txt` — one active mod per
  kit) → `UnrealEditor-Cmd … -run=PythonScript -Script=_config/devkit/kit-archery-edit.py -ModDevKit -NullRHI` → `python _config/devkit/kit-buildmod.py
  KrinikConanArchery <out>` → copy into `_unpacked/KrinikConanArchery`. `modinfo.json` `devkitRevisionNumber` 1002 (else «Mod is too old», EXP-0354).
- Lua half `_unpacked/KrinikConanArchery/ue4ss` → `ue4ss/Mods/KrinikConanArchery` (install step). Load order: before `KrinikConanGameplay` (that one last).

## What it changes (manifest, version line 0.5.0–0.7.0)

| Half | Change |
|---|---|
| pak | the native draw montage `AM_combat_2h_bow_combo_heavy_c0`: the aim notify runs to the montage end (the camera no longer jumps back on a shot with RMB held); a mute sound notify keeps `S_ChargeFull` loaded |
| Lua 0.3.0 | **the arrow is born where the GAME spawns it — at the bow — and is NOT intercepted or hidden**: only its velocity is turned onto the line «bow → the camera probe's hit point» (`[OWNER]` scheme 2026-10-27 18:4x, verbatim in the `main.lua` header). The 0.1–0.2 path moved the arrow onto the camera line and hid it for the first 3 m («стерла появляется на 3 метрах - не красиво»); that path is gone, so the arrow «popping up in the crosshair» cannot happen by construction — the owner, 2026-11-01: `[OWNER]` «стрелу вернули спавниться в лук, а не перехватываем больше, и проблемы резкого ее появления в прицеле органическим образом больше нет». Do not file or test «the arrow appears late» without first reading this row |
| Lua | the hero's arrow flies to the camera's aim point; the arrow look; leaving the aim on RMB release; the camera above the arrow in first person; aim kept on a new draw; the full-charge sound only for the player's hero |
| Lua 0.5.0 | Oblivion Remastered ballistics: gravity 0.55, speed by the draw, minimum 0.5 |
| Lua 0.6.0 | the per-tick gravity recompute removed — the arrow's curve `FC_BowProjectileGravCurve_*` is dropped |
| Lua 0.7.0 | shooting in a jump: the bow fires in the air, a jump mid-draw takes off — **MOVED 2026-11-07 to `KrinikConanLocomotion` (section `krinik_air_combat`, notes `KrinikConanLocomotion.md`) by the owner's word 10:39; no longer in this mod** |

No overlaps: the 2h_bow montage is in the game's pak only among the build's 101 containers (`retoc list --path`, 2026-10-28). Cases — KUMM
`testcases/TC_conan_bow_*_2026-10-2*.md`.

## Version

The version the pause-menu mod list shows = `modinfo.json` `versionMajor/Minor/Build` of the wrapper. **Since 2026-10-31 15:5x it is the BUILD version 1.0.0**
(`[OWNER]` «в сбоке моды Krinik ставим по версии сборки 1.0.0» · 2026-10-31 15:39 — supersedes 3.0.1 of 2026-10-28) in the kit source, `kit/modinfo.json`,
the built pak (`_config/devkit/set-pak-version.py <pak> <packVersion>`) and the manifest; `build-level-mod.py` reads `packVersion` itself. Seen in game
15:51 (report `testcases/reports/2026-10-31_conan-krinik-versions-1.0.0.md`). A new build version → the same three steps for the kit paks.
**Since 2026-11-02 18:53 the build version is 0.9.0** (`[OWNER]` 18:40 «Все моды Krinik опускаем до версии 0.9.0», plan 43): `kit/modinfo.json` and the kit copy 0.9.0; the
pak's wrapper got the new `modinfo.json` + `manifest.json` MD5 by unpack → replace → repak V11 (the six platform files byte-equal, `repak hash-list` diff) — the
same job as `_config/devkit/set-pak-version.py`, no kit cook needed.

## Stuck arrow copies (plan 36 W13, facts of 2026-10-31)

- A shot leaves a `BP_DummyProjectile_C` copy (`/Game/Items/Weapons/BP_DummyProjectile.BP_DummyProjectile_C`, root `StaticMeshComponent`); the game removes
  copies a few seconds later. Our Lua logs each copy: «копия стрелы #N: удар в <component>, кость удара <bone>, прицеплена к <parent>, сокет <socket>».
- A HIT on a humanoid boss: the copy's root is attached to the creature's `CharacterMesh0`, socket = the hit bone (`b_L_lowerarm` ×3), still attached
  at +2 s (birth watch `NotifyOnNewObject` + reads at +0.3 s / +2 s on the game thread). A MISS into the ground: no attach parent, socket None.
- **Where the game puts the copy (bytecode, 2026-10-31 10:3x: `retoc-5.8 to-legacy --version UE5_7 --no-shaders --filter BP_BaseProjectile
  <_paksview-3.0.1> <work>` → `uaj exports … VER_UE5_6` → `UAssetGUI tojson … VER_UE5_8` → `kismet-trace.py … SpawnDummyProjectile`):**
  `BP_BaseProjectile.SpawnDummyProjectile` spawns `BP_DummyProjectile` (deferred) at `GetAdjustedProjectileImpactPosition` = the hit's
  `ImpactPoint` (the collision surface — capsule or physics body, NOT the visible skin), rotation = mesh rotation ∘ `ProjectileOnGroundRotationOffset`,
  and hands it `HitResultFromProjectile`, `StaticMeshToShow`, `ProjectileDummyLifetime`, `IsLootable`, `ProjectileItemTemplateID`,
  `ProjectileVelocityOnImpact`; the copy attaches itself to the hit bone. `AdjustImpactLocation` only moves the flying projectile 10 cm forward
  (`Double 10.0`). So a creature whose physics bodies are thicker than its skin (the Kappa's shell) gets arrows standing off its skin — and they
  ride the bone, so they hang «in the air» beside it as it moves. A fix lives in the copy's placement: push it along its flight direction from the
  impact point toward the bone (or onto the mesh surface) before the attach.
- **Arrow meshes (Dev Kit probe `_config/devkit/kit-probe-arrow-mesh.py`, 2026-10-31 10:39):** every bow arrow `SM_*_arrow` under
  `/Game/Items/Weapons/Bow/` is ≈ 76–85 cm long along local **Z from 0** (`SM_basic_wood_arrow` Z −0.3…76.1, `SM_iron_arrow` −0.4…76.3,
  `SM_demon_bow_arrow` −0.1…84.7), ≈ 7 cm thick — the mesh origin is at ONE END of the arrow. The first depth-push try (10:34) measured the hit
  bone ≥ 60 cm ahead of the copy origin on a humanoid — the origin is the nock end, the tip ≈ 76 cm ahead. The push that hides the tip by `tip_in`:
  (superseded below) (arrow_length from the copy's `StaticMeshToShow` bounds or 76). Live now:
  the push capped to the old 15 cm, the depth logged (pack `e536ce9`); the formula waits for a stand with a LIVING target and a look at the arrows.
- **The copy is born ≈ 1.8 m SHORT of the hit (stand 2026-10-31 10:57–11:04, a summoned green Kappa, `_config/arrow-stand.sh`):** the hit's `ImpactPoint`
  stands 180–187 cm ahead of the copy origin along the flight in every hit, the mesh's local Z runs along the flight (factor 1.00 / 0.96), the tip at +76 cm —
  so the drawn arrow hung ≈ 1.1 m before the body (side frame: horizontal, in the air before the snout; the 60 cm push did not reach). Most likely the copy
  takes the projectile's place BEFORE its last flight step. **Live (pack after `46e2069`, 11:40):** push = clamp(min(impact − tip + `tip_in_cm`, bone − tip),
  15, 200), `tip_in_cm` **−15**: the game's impact point lies DEEPER than the visible skin — by side frames (arrow 76 cm = the scale) the skin stands 21 cm
  (human thigh), 27 cm (chest), 39 cm (Kappa snout) before it; with +10 the arrow went THROUGH a human thigh and chest. With −15 and the bone cap: the shaft in
  the Kappa's head and a human chest, the tip hidden, nothing through and nothing in the air (the owner 11:09: «мне показалось, что стрелы в капу начали
  нормально втыкаться»). Report `testcases/reports/2026-10-31_conan-arrow-push-tip-to-impact.md`.
- **Arrows leave the corpse — the GAME does it (the owner 11:09: `[OWNER]` «я ее убил, и все стрелы пропали» · «что в регдоле трупа пропадают стрелы»).**
  Bytecode of `BP_DummyProjectile` (`retoc-5.8 to-legacy --filter BP_DummyProjectile` → `uaj exports` → `UAssetGUI tojson VER_UE5_8` → `kismet-trace.py …
  ExecuteUbergraph_BP_DummyProjectile`, 2026-10-31 11:3x): after `K2_AttachToComponent(HitComponent, HitBoneName, …)` the copy binds its event
  `DestroyDummyIfAttachedObjectIsDestroyed` to `HitComponent:GetOwner().OnDestroyed` → `K2_DestroyActor` of the copy; it also `SetLifeSpan(ProjectileDummyLifetime)`.
  The dead creature's actor is destroyed, so its arrows go with it. Stand P8/P9 (11:25–11:28): push off — 0 copies 2 s after the kill; push on — the 2 copies
  survive detached at 0 0 0 (why ours survive is not known; they still carry the lifespan). Keeping arrows on the corpse would be a new feature (re-attach to
  the corpse's mesh at the same bone) — not started.
- A humanoid (P7) not run yet.
- Answered 2026-10-31: «no arrow visible on the frozen boss's arm while 3 copies lived» — the copies were born ≈ 1.8 m short of the hit, so they hung in the
  air before the body, out of that crop (the bullet «The copy is born ≈ 1.8 m SHORT» above).

## Stuck copies — the cause found (2026-11-01 15:0x–15:2x, KUMM bugs/73)

The copy «≈ 1.8 m short of the hit» (the bullets above) was OURS: `dress_arrow` grew the flying `ProjectileMesh` ×3 (`mesh_scale` 3.0), and the game's
`BP_BaseProjectile.GetAdjustedProjectileImpactPosition` backs the copy off the hit along the flight by that mesh's bounds (`GetComponentBounds(ProjectileMesh)`,
bytecode by `kismet-trace.py`). Control with our Lua off: 62 cm from the hit — the tip in. Fix: `mesh_scale` 1.0 and the push «в тушку» removed (HOUSE_RULES rule 24);
a pre-hook of `SpawnDummyProjectile` restoring the size does NOT help (the bounds are read earlier). The push history in the bullets above is superseded by this paragraph.

**The copy's life (2026-11-01 17:3x, `[OWNER]` 16:18 «срок жизни стрел везде … нужжжжжжжжжен 5 минут - с возможностью настроить … в минутах, от 1, до 30»).**
The flying arrow (`BP_BaseProjectile_C`; the bow's `BP_Visual_BowProjectileBase_C`) carries `DummyProjectileOnGroundLifetime` (30 s) and
`DummyProjectileAttachedToCharacterLifetime` (15 s); the game hands one of them to the copy's `ProjectileDummyLifetime` (the copy alone has that field — setting it on
the flying arrow does nothing, the remote reads a TrivialObject). `dress_arrow` sets both to `CFG.stuck_life_min × 60` at the hero's shot; the hub row
`arc_stuck_min` (1–30 min, default 5) on the KrinikConanArchery page. Seen: 299.9 s by default, 59.9 s at 1 (report `testcases/reports/2026-11-01_conan-arrow-stuck-life.md`).
Corpses: the game destroys the copies with the creature — plan 40 phase 4.

**The ×3 arrow in flight (2026-11-01 17:5x, `[OWNER]` 16:23 «физическая оригинальная стрела x1 … визуальная модель лететь должна x3 … связаны в наконечнике»).**
`dress_arrow` → `add_visual_arrow`: `actor:AddComponentByClass(StaticMeshComponent, true, identity, false)` (works from Lua, no crash), the same static mesh and
materials, collision off, `K2_AttachToComponent(ProjectileMesh, None, Snap, Snap, KeepRelative)`, scale `CFG.visual_scale` 3, relative Z = maxZ × (1 − 3)
(maxZ from `StaticMesh:GetBounds()` Origin.Z + BoxExtent.Z — `GetBoundingBox()` comes to Lua without Min/Max; 76.3 for `SM_iron_arrow` → −152.7 cm), then
`ProjectileMesh:SetVisibility(false, false)`. The native mesh stays ×1, so the copy stands 62 cm from the hit as before. Seen: frames 116–117 of a 60 fps video
(the big head at the aim point); review folder 50 for the owner's eye — superseded: the owner played and saw it himself 21:0x (`[OWNER]` «зачем снимать видео выпуска,
если ты значешь, что я только что поиграл и видел его?»).
**Hidden at impact (2026-11-01 21:0x, `[OWNER]` 21:07 «когда стрела попадает в землю - наша x3 отображается долго вместе с настоящей x1» · «нашу x3 мгновенно нужно
скрывать, когда происходит слолкновение»).** After the impact the game keeps the flying actor alive for the trail fade, and our mesh is its own component — it stayed
beside the stuck ×1 copy. Fix: a hook on `BP_BaseProjectile_C:StopProjectileInternal` (registered at the first visual arrow, the class is loaded then) hides the
actor's own big mesh; registry «actor address → mesh», cap 64. Seen: the log «гашение крупной стрелы при ударе: подписано» at the first shot 21:10; the look —
the owner's check in the running game (asked 21:11). The background twin of a real shot: the remote `FindFirstOf('BasePlayerChar_C'):LaunchProjectile()` fires the
equipped bow from the hero with no input (21:05, seen in the archery log as a normal shot).

## No key binds — bug 85 (2026-11-07 21:3x)

The shafts sync used `RegisterKeyBind(E / Q / LMB)`; a key-bind callback runs Lua on UE4SS's input thread while this mod's game-thread Lua runs (corpse pass),
unlocked, in one Lua state — the crash of 2026-11-07 21:17 (bug 85, root cause from the UE4SS source). Removed; the guard `_config/check-lua-game-thread.py`
now refuses `RegisterKeyBind`. Kept: the quick-loot trigger (`QuickLootPanel:SlotItemAddedOrRemoved`, seen working 21:40:54 in the owner's play). Lost until a
game-thread trigger is found: the shafts after the full loot window and after a beast harvest stay in the corpse until it vanishes.

**Arrows into an already dead body (written 2026-11-07 21:42 +03:00, `[OWNER]` 21:41 «когда моб умер, но в его тело ещё стреляют - эти стрелы тоже нужно класть в добычу моба»):**
`on_corpse_hit` — at a copy's birth (+100 ms) whose attach parent's owner is a `CorpseBase`: one arrow of `ProjectileItemTemplateID` into the corpse's
`ItemInventory`, the copy's life = the corpse's, `IsLootable` false (no double take), the copy joins `corpse_arrows` (the shafts sync). Case K10 of
`testcases/TC_conan_keybind_lua_off_input_thread_2026-11-07.md` — not run yet (next launch).

## Open

- **Dead Shot («Верная рука», `Agility_10b`) — the ×2 arrow speed is the GAME's** (`BP_BaseProjectile` ubergraph, game map «Attribute perks»); since 2026-11-08 the
  build ships ×1.2 from `KrinikConanGameplay` (`vanilla_patches.py`), not from this mod. Our Lua reads the launched speed, so the draw scaling stays on top of it.
  Before: uncharged 2484–2499 cm/s without the trait, 4997–5004 with it (this mod's log, 2026-11-07 20:00). Cases D1–D2 of `TC_conan_attributes_uncapped_and_dead_shot_2026-11-08.md`.
- **Crouch stays while drawing (the owner's order 2026-11-07 22:00 +03:00, NOT BUILT):** `[OWNER]` «Если герой в присяде, то натяжение лука по ПКМ не должно выводить его из присяда в
  стойку.» · «Можно и натягивать и стрелять лук из присяда». Recon first: which call stands the hero up on the aim entry (the bow aim montage / an UnCrouch in
  `BaseBPCombat` on RMB — bytecode), then keep the crouch natively (the hero's crouch state through the draw and the shot); the crouched draw pose — the owner's eye.
- **Headshots — BUILT 2026-11-07 22:00 +03:00, NOT RUN (cases K14–K17):** lever by bytecode of `BP_CollisionComponent.TakeProjectileDamage` — the arrow's native multiplier goes as
  `DamageMultiplier` into `ApplyDamageSpecific(Type, DamageStructure, Combo, AttackBlocked, DamagedActor, HitFromDirection, HitInfo, EventInstigator, DamageCauser,
  DamageMultiplier)`; kill XP = the mob's `BP_XPHolder_C.xpToGive` (remote). Section «выстрел в голову»: a pre-hook of `ApplyDamageSpecific` (installed at hero birth +
  first hero arrow): hero instigator (a PlayerController) + a `BP_BaseProjectile` causer + bone name containing «head» → `DamageMultiplier` ×2; the hero's first hit on
  that mob and a head hit → `xpToGive` ×2 for that hit, restored 100 ms later (and on the next hero hit) if it lived. `[AI]` Only the hero's arrows get ×2 damage (NPC
  archers' head hits on the hero are not doubled) — a reading of «попадание в голову» in the bow context; the owner may widen it.
- **Headshot kill slow motion (the owner's order 2026-11-07 22:38 +03:00, NOT BUILT):** `[OWNER]` «при убийстве в голову с x2 опытом, нужно замедлять игру в 2 раза на 2 секунды от смерти
  мода» — on the ×2-XP kill (first hero hit, head, kill): global time dilation 0.5 for 2 s from the death (`GameplayStatics:SetGlobalTimeDilation`, back to 1.0 after —
  the 2 s counted in real time; check the death moment's event: the corpse birth).
- **(order text) Headshots (the owner's order 2026-11-07 21:57 +03:00):** `[OWNER]` «попадаение у голову увеличивает урон в 2 раза. Убийство моба попадаем у голову с ОДНОГО выстрела
  первого - x2 опыта, что показывается в виджете с полученным за убийство опытом.» · «Если были героем игрока нанесены любые другие удары по этому мобу, то x2 больше за
  убийство в голову не засчитывается. Убить нужно именно первым ваншотам в голову». (21:55 he asked only whether head hits are distinguishable — yes: the hit's
  `BoneName`, `b_head` on humans and the Imp, seen in the corpse log 21:40:49; beasts' head bones — per species.) Plan: (1) recon where an arrow's damage is computed
  (target side `BP_CollisionComponent.TakeProjectileDamage`, bytecode) and multiply it natively ×2 on a head bone; (2) per-mob «hero hit it before» record (any hero
  damage, not only arrows); (3) kill XP: how the game grants it (`BP_XPHolder_C` on the mob, `BP_ProgressionSystem`) and how UIMod_Hosav's kill-XP widget shows it —
  ×2 at the source so the widget shows the doubled number.

- **A missed arrow wakes the mob — BUILT 2026-11-07 21:54 +03:00, NOT RUN (case K13):** recon by the remote: a mob (`BaseNPC_C`, the Imp's controller `CreatureAIController_C`)
  has `BPTargetDistributionComponent_C` (`/Game/Systems/AI/NewAI/…`) — its hate list: `UpdatedHeardActors(NewHeardActors: Actor[])` (the game's «heard»),
  `AddToHatelist(NewTarget struct)`, `CanEngageTarget(Target, TriggeringHateType)`; its `ConanAIPerceptionComponent` senses = sight only (`AISense_NewSight`) + Conan's
  stealth hearing (`HearingRadius`), so `ReportNoiseEvent` is out. Section «промах будит моба»: in the hero-arrow stop hook (`StopProjectileInternal`, `visuals`
  registry = hero arrows only) → every `BaseNPC_C` within `CFG.miss_alert_cm` 1000 of the arrow gets `UpdatedHeardActors({ hero = arrow:GetInstigator() })`; the game
  decides who engages. Log «стрела упала: мобов в 10 м — N, «услышали» M (… мс)».
  **Timid animals flee (`[OWNER]` 2026-11-07 22:20 +03:00 «пугливые животные должны не бросаться на героя, а убегать услышав падение стрелы рядом»):** check first whether the
  game's own «heard» already makes a timid animal flee; if not — the controller's native `HumanAIController_C.StartPanic` / `GetPanicCenter` (panic centred on the
  arrow's landing point) for animals the game itself treats as fleeing (its faction / behaviour data, not a list of ours). NOT BUILT.
  **Seen 2026-11-07 22:28 +03:00 (the owner's shots near a gazelle, log «стрела упала: мобов в 10 м — 1, «услышали» 1 (1.00 мс)» ×2):** `[OWNER]` «она пугается, начинает бежать, но очень
  быстро успокаивается» → the game's own «heard» already makes a timid animal flee — only too briefly. `[OWNER]` 22:27 «нужно бы. чтобы пугливые животные не успокаивались
  минуты 2» → next: keep the flight ≈ 120 s (the controller's panic: `StartPanic` / `StartPanicTimer` / `GetPanicRadius` / `GetPanicCenter` of `HumanAIController_C` — read
  the panic timer's own duration first, set it natively).
  **Hostile mobs give up (2026-11-07 22:30 +03:00):** `[OWNER]` «не добегают до меня злые» · «бегут. но потом передумывают, и бегут назад» · «и словно не понимают, куда им бежать» ·
  «словно у них конфликт между их точкой привязки, которая их держит, и бегством за мной» · «не должно быть никаких точек привязки у злых мобов». Remote: `AddToHatelist`
  takes `/Script/ConanSandbox.TargetWrapper {RawTarget (interface), SubTargetIndex}`; `AddToHatelist({RawTarget = hero})` on a hyena 50.7 m away — it did not move (5 reads
  over 7 s). Lever named by the owner: the leash — `ConanAttackerAIController:SetShouldNotLeash(true)`; 22:29 set on 9 hyenas within 150 m for the owner's next shots.
  22:30 the owner narrowed it: `[OWNER]` «или по крайней мере. они должны спавниться где-то. но не должно быть вызовов, которые дергают их бежать назад на свою точку
  привязки» — the spawn point stays, the pull-back (leash) goes.
  22:30 result: `[OWNER]` «нет, не бежит, стоит на месте и дергается в разные стороны» (unleashed hyenas after a heard arrow) — attempt 3 of 3 blind (heard · AddToHatelist ·
  SetShouldNotLeash). STOP poking (BUG_FIXING 3-attempts rule): next is a recon of the beast AI — its behaviour tree and blackboard keys (`UpdateBBKeysFromPawn`,
  `GetAllowedHomeRange`, `ReturnHomeIfTooFarWhilePlayingIdleEmote`, `LeashIfNoTargetAnymore`, `FinishLeashing`, `ManageGiveUpHate`, `ManageLeashingHate`, `CanEngageTarget`'s
  `TriggeringHateType`), by bytecode of `BPTargetDistributionComponent` and the creature BT, before any further code. Also open: why «heard» moves a hostile toward the
  noise but not after the hero. Clue 2026-11-07 22:31 +03:00: `[OWNER]` «ближняя гиена бежит ко мне» · «а дальняя не бежит» — a DISTANCE threshold (engage / disengage / give-up range:
  `CanAttackWithinDisengagementDistance`, `ShouldBuildGiveUpHate`, the perception / aggro radius) — first thing to read in the recon.
  The order «no anchor points for hostile mobs» is wider than archery — a build-wide rule (which mod owns it: KrinikConanGameplay) — recorded, decide the home after the test.
  **Cost fix 2026-11-07 22:20 +03:00:** the first build searched `FindAllOf("BaseNPC_C")` — 12.00 ms per arrow (22:17); now `KismetSystemLibrary:SphereOverlapActors` (Pawn, class
  `BaseNPC_C`) — the remote probe found the Kappa in a 10 m sphere at ≤ 1 ms (os.clock step). Stand traps: a creature teleported far from its home is pulled back
  (`TeleportHome`, 25 m → 111 m); `FindFirstOf('PlayerController')` is a TrivialObject — use `FunCombat_PlayerController_C` (arrow-stand.sh summon is broken by it).
- **(order text)** (the owner's order 2026-11-07 21:50): `[OWNER]` «промах из лука пмо мобу, если стрела ударилась об землю, или другого
  мода. или об стену. или об предмет - где-то рядом в 10 метрах от моба - должна приводить к тому, что моб узнает об присутсткии героя и начинает к нему бежать для
  нападения на героя, словно слышит, что стрела рядом с ним упала - и это вызывает аггресию моба». Trigger: the copy's birth (`NotifyOnNewObject` BP_DummyProjectile,
  game thread, already hooked) whose hit is NOT a living creature → hostile NPCs within 1000 cm of the impact point get the hero as a target. Recon first: how Conan NPCs
  notice the player (AI perception hearing `ReportNoiseEvent`? the game's own threat / aggro list — the hero's `BP_AC_AudioController_C.AggroList` exists) — game map has
  no line yet. Only arrows of the player's hero; «hostile» — what the game itself would aggro (not thralls, not neutral villagers — check by the game's faction test).
- **Draw time by Agility — BUILT 2026-11-07 21:5x, NOT RUN:** lever found by bytecode (`BaseBPCombat`: `SetPowerCharge(Duration)` sets `PowerChargeTimeScale = Duration`,
  `PowerChargeStartTimeStamp = GetTimeSeconds()`; charge = clamp((Stop − Start) / TimeScale)). Section «натяжение по Проворству»: a post-hook of
  `BaseBPCombat_C:SetPowerCharge` (player only) writes `PowerChargeTimeScale = max(5 × 0.99^n − 0.552, 0.05)`; the full-charge «дзинь» moved from the montage's second
  hold to a delayed action at the real full moment. Agility = `GetIntStat(19, 0)`. In the game folder 21:5x — loads at the next launch.

- **Draw time by Agility (the owner's order 2026-11-07 21:43, NOT BUILT):** `[OWNER]` «каждый пункт Пропорства должен уменьшать время натяжения лука на 1%» ·
  «причем каждый процент не абсолютно применяется, а к предыдущему значению времени натяжения … оно прогрессивно 100 раз уменьшалось по 1%» → full-draw
  time = base × 0.99^Agility. Vanilla base (kit montage `AM_combat_2h_bow_combo_heavy_c0`, game map): the charge `BP_PowerCharge` starts 0.552 s, lasts 1.28 s →
  full at ≈ 1.83 s. 21:45 he asked the table for a base of 5 s (`[OWNER]` «если сделаем жл полного натяжения 5 секунд на нулевом уровне проворства») — the base is
  5 s gives 4.09 s at 20, 1.83 s (= vanilla) at 100, 0.67 s at 200. **DECIDED 2026-11-07 21:46:** `[OWNER]` «суппер, так и делаем» — base 5 s at Agility 0, × 0.99 per point. Way: the draw montage's play rate on the hero's AnimInstance
  (`Montage_SetPlayRate`) for the draw part + the bow string's own single-node rate; Agility read as `KrinikConanLocomotion` does (`read_agility`).

- **REMOVED 2026-11-02 15:3x by interview #031, answer A** (`[OWNER]` «убрать строку, пока спрайт не найден. Найдётся — вернём её уже к нему»): the hub row
  `arc_wave` (Lua PAGES, kit PAGES), `CFG.wave_opacity`, `tune_wave` and its call in `dress_arrow` are gone; the code lives in git (pack `a848a58`). The history
  below stays for the day the sprite is found.
- **The owner's word 2026-11-02 09:02 — the shock-wave sprite of a 100 % charged shot:** `[OWNER]` «при заряженном на 100% выстреле в момент выпуска стрелы вокруг
  лука появляется спрайт ударной волны - его нужно сделать отключаемым через мод Archery Криника, по умолчанию - выключен» · «настраивается через шкалу
  прозрачности». NOT DONE. Way: find the effect (the bow's full-charge release — a Niagara / particle or a widget sprite; recon on the release by the remote),
  a hub row on the KrinikConanArchery page «Ударная волна при полном заряде» — a slider of its opacity 0–100 %, default 0 (off); applied natively (the effect's
  own parameter or its spawn skipped at 0), no per-frame work.
  **Recon 2026-11-02 10:47–10:55 (live, `NotifyOnNewObject` on particle components + a real draw by `mouse-seq.ps1`; read the template 100 ms after the birth —
  at the birth it is not set):** a draw spawns `P_bow_powercharge` on the hero (`CharacterMesh0` / `b_R_prop`); a FULL charge released spawns
  **`/Game/Effects/Particles/P_bow_powercharge_release`** on the same bone — the shock wave; the flying arrow carries `P_arrow_trail_powershot`; the hit — the
  world's `P_impact_sand` / `P_Water_Impact`. (Also seen: the hero keeps every finished `P_bow_powercharge` component attached — 4 after four draws.)
  The release system: two CPU sprite emitters, material `M_particle_powershot_charged` (BLEND_Additive, unlit, the particle colour drives it; scalar params
  cameracenterfade, distancefade, curve1/2, radscale, speed, zoom — none is an intensity); NO instance parameters. Emitter 0: colour (0.5, 1, 0.5), alpha 0.3,
  lifetime 0 (the emitter's own), size 50–200; emitter 1: white, alpha 0.3 → 0, lifetime 0.15 s, size 200. **Lua reaches and WRITES the baked tables**:
  `StaticFindObject(<system>:ParticleModuleColorOverLife_0/1).ColorOverLife.Table.Values[i]` (written 0.5×, read back, restored). Plan: the slider k scales
  both colour tables from the originals (additive — dimmer is more transparent), k 0 = black = invisible; applied at load and on a hub save — zero per-frame
  and zero per-shot work. **Not seen yet:** the look at k 1 vs 0 — a remote spawn (`SpawnEmitterAttached` on `b_R_prop`, even with the lifetime stretched to
  3 s) showed nothing on the sand either way; the check is a 60 fps clip of a REAL full-charge shot (EXP-0430).
  **How the hero shoots a charged arrow (`[OWNER]` 2026-11-02 11:07 «нужно при зажатой ПКМ ещё ЛКМ нажимать» · «а ты просто ПКМ отпускаешь»):** RMB held draws
  and charges, an LMB CLICK while RMB is held releases; holding LMB and letting RMB go shoots nothing. Input: `mouse-seq.ps1 -Seq "rdown,wait:2800,lclick,wait:700,rup"`.
  The order of effects (remote, 11:10): full draw → `P_bow_powercharge_charged` (a golden flash at the hand), the LMB release → `P_bow_powercharge_release` +
  the tracer `P_arrow_trail_powershot`. `tune_wave` scales only `_release`; which flash the owner calls «the shock wave» — asked 11:10.
  **The row scaled an invisible effect — control runs 2026-11-02 12:32–12:37 (Archery Lua OUT, quiet stand, 120 fps full-screen capture of a real shot):**
  (1) vanilla: right after the release, rings go around the flying arrow and a big translucent dome opens over it (frames ≈ 4.24–4.37 s of the capture);
  (2) the same shot with ONLY the tracer's emitter E4 (`P_arrow_trail_powershot`, material `M_particle_powershot_circles`) disabled by the remote — no rings and
  no dome, the arrow alone; (3) `P_bow_powercharge_release` draws nothing on screen: its emitter E0 is disabled IN THE GAME'S ASSET (`bEnabled` false with our
  Lua out), E1 (white, 0.15 s, size 200) spawned 4 m and 8 m before the camera changed not one pixel (frame difference). So the only visible release
  effect is tracer E4 — the same «волны звукового барьера» of 2026-10-26 (plan 36 item 35) that `tune_templates` disables («кольца выкл») — and `tune_wave`
  scaled a system that shows nothing: hence «no wave at 100 %». Tracer emitters: E0–E3 the ribbon trail (`M_particle_weapon_speed_trail_arrow_linger`),
  E4 the rings (modules Lifetime_1, Size_1, ColorOverLife_1, SpawnPerUnit_0, ParameterDynamic_1, SizeScale_1, SizeMultiplyLife_1). In the aim view of our camera the
  hand (`b_R_prop`) sits under the quick bar at the screen's bottom edge. Asked the owner 12:3x with frames (review folder 61) whether the dome is his «wave» — **NO**:
  `[OWNER]` 12:38 «нет, не то» · 12:39 «а я тебя прошу спрайт, который возле лука появляется при выстреле». In the aim view the bow's lower part and the hand are
  under the quick bar and the screen edge (release frame 4.133 s of the control capture: nothing above the bar), so the sprite was never in our frames. 12:44 the owner
  shot in the game with every mod off: `[OWNER]` «странно, нет этого справйта» · «но я помню, что видел его» — vanilla has no such sprite; something of the build
  brings it (candidates: our `tune_glint` ×1.5 of `P_bow_powercharge_charged`, another pak). Next: the same shots in the full build, then control by halves.
- **The arrow-choice list on a draw (2026-11-02 13:0x, pack after `c817b4e`):** section `on_aqs_display` — a post-hook of Arrow Quick Swap's
  `UpdateDisplayUI` (`ArrowQuickSwap.md`); store key `arc_ammo_list` → `CFG.ammo_list` (default true). `[TESTED: 2026-11-02 · L1–L4 · testcases/reports/2026-11-02_conan-arrow-choice-and-bow-stance.md]`.
  Trap: the hook registration at mod load fails («no UFunction» — the mod's class is not ready); the component's birth (`NotifyOnNewObject`) registers it.
  **Since 2026-11-02 15:0x (bug 78):** `one_row_per_kind` first — AQS lists one entry per STACK (`ArrowQuickSwap.md`); the section keeps the first stack of each
  kind and rebuilds the window (`ClearVBoxAmmoWidgets`, `CreateAmmoWidgets`) — so «up» cycles and «≥ 2 kinds» counts kinds; log «стопок N, видов K».
  `[TESTED: 2026-11-02 · W5, W6 · testcases/reports/2026-11-02_conan-wheel-in-bow-aim.md]`.
- **The string frozen drawn after a draw at low stamina (bug 76) — FIXED 2026-11-02 13:5x (B1–B3 pass):** section `settle_if_stuck` — a post-hook of `BasePlayerChar_C:OnSubstateChanged_Attacking` (Entered false) + 100 ms: bow montage off and the bow string still `A_combat_bow_string_heavy_charge` → the game's `AB_human_male_C:AnimNotify_bow_secondary_settle()`. The bow string is the bow's own `AnimSingleNodeInstance` (charge 1.833 s, loop 4 s, fire 0.967 s, settle 0.667 s). No setting (`[OWNER]` 13:49).
- **The aim zoom kept through a stamina break (case S5, ours) — FIXED 2026-11-02 13:2x (S6, S7 pass; `shots_at_aim`: the re-draw hold needs a shot since the aim entry):** with RMB held, the draw broken by stamina ends the montage's FOV notify, and
  `hold_aim_on_redraw` in `on_fov_target` takes it for a re-draw — the zoom stays while the hero no longer draws. The hold must require a draw actually
  under way. The bow pose itself is vanilla (bug 76).
- seen 2026-10-31 15:51: the pause-menu list shows «v1.0.0»; the Krinik mods still stand at the bottom of the list (W11 «top» half open).
- **NEW FEATURE, 1.0.0 (`[OWNER]` 2026-11-01 09:11 «KrinikConanArchery · в этот мод идет еще одна фича · После смерти - регдол труп врага не должен уничтожать
  воткнутые в него стрелы - все стрелы сохраняются, торчат из трупа, их можно собрать.»):** every arrow copy stuck in a creature stays stuck in its ragdoll
  corpse at the same bone, visible, and the player picks it up (the copy's `IsLootable` / `ProjectileItemTemplateID`). The cause is known (the bullet «Arrows
  leave the corpse» above): the copy's `DestroyDummyIfAttachedObjectIsDestroyed` fires on the creature actor's `OnDestroyed`; the corpse is a separate
  `Corpse_C` actor (game map, «Трупы»). Route to recon first: at the creature's death, re-attach each of its copies to the corpse's mesh at the same bone
  (and drop the old binding / lifespan), by an event, no polling (HOUSE_RULES rule 7). **Recon 2026-11-01 12:5x–13:1x — NOT DONE** (report
  `testcases/reports/2026-11-01_conan-arrows-corpse-recon.md`): at corpse birth (`NotifyOnNewObject('/Script/ConanSandbox.CorpseBase')` — the blueprint
  `Corpse_C` class is not loaded at mod start, a subscription to it never fires) the copies are still attached; the creature is destroyed 1–2 s later and its
  `OnDestroyed` runs the copy's `DestroyDummyIfAttachedObjectIsDestroyed` = ubergraph 3484 = `K2_DestroyActor` FIRST, no condition — a copy re-attached to
  the corpse dies anyway; a copy spawned from Lua without its own hit leaves at once (0 0 0). Next routes: (a) unbind the copy from the creature's
  `OnDestroyed` (no Lua tool found yet); (b) spawn a copy WITH a hit on the corpse mesh (set `HitResultFromProjectile` incl. its weak `Component`); (c) a
  visual arrow (static mesh actor on the corpse bone) + the arrow items into the corpse's loot. Corpse facts: the actor's location is 37 m off the body —
  match by the same bone of the corpse mesh; `GetTransform()` from Lua reads zeros. **Our leak closed on the way:** with the «в тушку» push the copies of a
  killed creature were not cleaned by the game and hung at 0 0 0 with no life span; the section now re-attaches them to the corpse and the game's event
  removes them (0 copies 10 s after the kill).
  **Route pick (2026-11-01 22:5x, desk research of the 13:13 report):** `FORK: options (a) unbind the copy from the creature's OnDestroyed | (b) a Lua-spawned copy
  with its own hit on the corpse mesh | (c) our visual arrows on the corpse at the same bones + the arrow items into the corpse's loot | (d) patch BP_DummyProjectile's
  bytecode (event 3484 → no destroy) · price of error: (a) no Lua tool for a multicast delegate of another object, clearing all of OnDestroyed breaks the game's own
  listeners; (b) a hit struct with a weak Component set from Lua — unproven, the 13:0x Lua copy died at once; (d) a vanilla asset in our pak, every copy whose
  actor dies would float till its life ends; (c) only proven calls (AddComponentByClass + K2_AttachToComponent at a bone — the ×3 arrow, 17:5x) + one unknown:
  adding items to the corpse's loot · consulted: the 13:13 run report (runs 1–9), the bytecode of BP_DummyProjectile, the ×3 visual arrow, UE4SS docs (`researches/conan-arrows-in-corpse/README.md`)`.
  **CORRECTED 23:0x:** (a) first after all — UE4SS documents `Remove(target, funcName)` on multicast and SPARSE delegates (`OnDestroyed` is sparse), and only (a)/(b)
  keep a native copy the player takes with E (plan 40.4 criterion 3); the build's UE4SS 3.0.1 has the Lua delegate types, `Remove` itself is proven only by the live
  probe R2. **WORKS — seen 2026-11-01 23:18 and 23:25 (pack `15a7c82`):** `on_corpse_born` calls `owner.OnDestroyed:Remove(dummy, "DestroyDummyIfAttachedObjectIsDestroyed")`
  for each copy while the creature still lives (the wrapper is `MulticastSparseDelegateProperty` with `Add` / `Remove` / `Clear` in UE4SS 3.0.1), then the re-attach
  to the corpse bone; the arrows stay in the ragdoll for the corpse's life (600 s). The KILLING arrow's copy is born after the corpse: a copy born within
  `CORPSE_LATE_S` 2 s of the last corpse re-runs the pass (4 of 4 kept, 23:25). Cases A6–A8, A10 pass. **E on a shaft — NOT PROVEN either way:** two tries failed
  (A9: E at 4.7 m opened the corpse's loot; with `IsLootable` set true, E aimed at the copy's point did nothing) — the copy in a creature reads `IsLootable` false;
  why E takes ground arrows and not these is a guess, not a fact (corrected 23:40, `[OWNER]` «Из земли можно, а из трупа нельзя?»). Interview #030.
  **Loot (2026-11-02 00:02 +03:00, pack `0663f2f`, `[OWNER]` 2026-11-01 23:41 «тогда делаем, что воткнытые в трум стрелы идут в инвентарь трупа»):** the re-attach keeps the
  copy's offset from its bone (`KEEP_RELATIVE` + the creature-side `RelativeLocation/Rotation`) — before it, a shaft could hang 1.8 m from the body (the owner's frame
  23:46); one arrow per kept copy into the corpse's `ItemInventoryReplicateToAll` by `AddItemTemplate(id, −1, None, 1, true, 1, 0)` (seen 4 shafts / 4 arrows);
  `corpse_arrows` tracks corpse → item → copies; a sync destroys the shafts beyond `GetNumberOfItemsByTemplate` on the quick-loot event and after E / Q / LMB
  (the full loot window and the harvest of a beast fire no loot event). The shafts-go part SEEN 2026-11-02 00:10 (A13 pass: shafts 1 → 0 after a real E + Q). Stand trap: the live save has
  companions that kill a frozen Kappa first — stand away from them. (c) below stays the fallback (it needs the owner's word on «arrows into the corpse's loot», plan 40.4 Outbound). Former pick: `[AI]` (c) first:
  the copies are read at corpse birth (they are still attached then — run 2), the visuals live on the corpse actor (die with it), the items go into the corpse's
  loot so «их можно собрать» is the corpse's own E. Taking them from the loot hides the visuals (the loot-change event on a corpse is the native
  `QuickLootPanel:SlotItemAddedOrRemoved` — the blueprint `HandleLootContainerInventoryChanged` stays silent on a corpse, game map «Loot change event»). Next: a read-only remote recon of the corpse's inventory (component class, its add-item UFunction), then the section.
  The look of «arrows in a corpse» and «collected through the corpse's loot» go to the owner's eye on a frame.
