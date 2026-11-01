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
| Lua 0.7.0 | shooting in a jump: the bow fires in the air, a jump mid-draw takes off |

No overlaps: the 2h_bow montage is in the game's pak only among the build's 101 containers (`retoc list --path`, 2026-10-28). Cases — KUMM
`testcases/TC_conan_bow_*_2026-10-2*.md`.

## Version

The version the pause-menu mod list shows = `modinfo.json` `versionMajor/Minor/Build` of the wrapper. **Since 2026-10-31 15:5x it is the BUILD version 1.0.0**
(`[OWNER]` «в сбоке моды Krinik ставим по версии сборки 1.0.0» · 2026-10-31 15:39 — supersedes 3.0.1 of 2026-10-28) in the kit source, `kit/modinfo.json`,
the built pak (`_config/devkit/set-pak-version.py <pak> <packVersion>`) and the manifest; `build-level-mod.py` reads `packVersion` itself. Seen in game
15:51 (report `testcases/reports/2026-10-31_conan-krinik-versions-1.0.0.md`). A new build version → the same three steps for the kit paks.

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

## Open

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
  (the full loot window and the harvest of a beast fire no loot event). The shafts-go part is deployed, not yet seen (A13 partial). Stand trap: the live save has
  companions that kill a frozen Kappa first — stand away from them. (c) below stays the fallback (it needs the owner's word on «arrows into the corpse's loot», plan 40.4 Outbound). Former pick: `[AI]` (c) first:
  the copies are read at corpse birth (they are still attached then — run 2), the visuals live on the corpse actor (die with it), the items go into the corpse's
  loot so «их можно собрать» is the corpse's own E. Taking them from the loot hides the visuals (the loot-change event on a corpse is the native
  `QuickLootPanel:SlotItemAddedOrRemoved` — the blueprint `HandleLootContainerInventoryChanged` stays silent on a corpse, game map «Loot change event»). Next: a read-only remote recon of the corpse's inventory (component class, its add-item UFunction), then the section.
  The look of «arrows in a corpse» and «collected through the corpse's loot» go to the owner's eye on a frame.
