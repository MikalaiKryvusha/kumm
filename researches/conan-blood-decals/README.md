# Research — Conan 3.0.1: blood on the ground for up to 5 minutes (plan 36 W28)

> **Created:** 2026-10-30 · on the owner's word: `[OWNER]` «спрайты крови на земле которые - нужно чтобы держались на земле до 5 минут до исчезночения» ·
> «чтобы земля, залитая кровью - долго была в крови» · «время настраивается ползунком в модах Krinik» · 2026-10-30 ≈10:59–11:00
> **Parent:** plan 36 W28 · **Status:** recon 2026-10-30 — blood assets found; 12:28 — spawner, life (3 s) and the working route found; mod `KrinikLingeringBlood` 0.1.0 in the run · **Outbound:** the look of 5-minute blood — the owner's eye

## Found (vanilla 3.0.1, `retoc to-legacy --filter lood` over `_paksview-3.0.1`)

`/Game/Effects/blood/` holds the blood: materials `M_blood_ground_decal`, `M_blood_growing_stain`, `M_blood_scatter_decal`,
`M_blood_wall_decal` (+ `MI_blood_wall_decal_1…4`, `M_blood_wall_decal_2`), `M_blood_ceiling`, `M_blood_drop`, `M_blood_spray`, `M_blood_mist`,
`M_blood_string`, `MF_FLX_BloodColor`; particle systems `P_blood_1h_sword_fatality`, `P_blood_2h_axe_fatality`, `P_blood_ceiling_drip`,
`P_blood_decapitation`, `P_blood_katana`, `P_blood_limb_spray`, `P_blood_mid_split`, `P_skull_fragmenting`. No blueprint with «blood» in its
path spawns them — the spawner sits in combat/hit blueprints under other names.

## Live, 2026-10-30 11:22–11:24 (UE4SS hooks on `/Script/Engine.GameplayStatics`)

- `SpawnDecalAtLocation` — footprints `M_footprint_generic_shoe`, LifeSpan **5 s**; `SpawnDecalAttached` — arrow impacts `M_decal_rock_impact_01_D` on the landscape, LifeSpan **30 s** (the last parameter; the material is the FIRST callback parameter of `SpawnDecalAttached`).
- No blood through `SpawnEmitterAtLocation` / `SpawnEmitterAttached` (filter «blood»/«gore») — but the arrows did not hit the boss in that run (he walked off; frame), so blood was NOT produced: inconclusive. Next run: a frozen target (the remote) hit point-blank, the same hooks plus Niagara `/Script/Niagara.NiagaraFunctionLibrary:SpawnSystemAtLocation` / `SpawnSystemAttached`; the owner says «спрайты» — the ground blood may be particles, not decals.

**11:25 run (frozen target, 3 shots point-blank):** (correction 12:28: the 14 stains were the boss's hits on the then mortal hero, not the arrows — see below) `SpawnDecalAtLocation` placed `M_blood_ground_decal` 14 times and `SpawnEmitterAtLocation` spawned `P_blood_directional_hit_1` 14 times — THE ground blood is this decal. Its LifeSpan and whether `SetLifeSpan(300)` on the returned decal component holds are NOT read yet: at 11:35 the target (`DisableMovement` only) walked back into melee and the arrows missed. Next run: freeze by `CustomTimeDilation = 0` AND `DisableMovement`, or shoot the corpse-free boss from 3.5 m right after the teleport; the hook is ready in the chat transcript (params ctx, mat, size, loc, rot, life, ret).

## 2026-10-30 12:05–12:28 — the source, the life and the material (second run + bytecode)

- **Who places it.** `BP_CollisionComponent.DoHandleHitFeedback` (vanilla 3.0.1, `kismet-trace.py`, export at `/Game/Systems/Combat/`):
  `SpawnDecalAtLocation(M_blood_ground_decal, size, BreakHitResult.Location, ComposeRotators(...), LifeSpan 3.0)` → `SetFadeOut(0.0, 3.0, true)`.
  It runs on a WEAPON hit (melee, creature bites) — `ctx` of the call is the attacker's `BP_CollisionComponent`. Arrow hits on a creature lay
  NO ground blood (12 shots at a boss and a kappa, 0 stains). The 11:25 «14 stains» of the first run came from the boss hitting the then
  mortal hero, not from the arrows.
- **Hook parameters.** A UE4SS hook on the static `GameplayStatics:SpawnDecalAtLocation` receives `self` (the `Default__GameplayStatics`)
  FIRST, then `WorldContextObject, DecalMaterial, DecalSize, Location, Rotation, LifeSpan`; the return value is not passed. The first run's
  hook read the parameters one place off.
- **What does not work:** `life:set(60)` in the pre-hook (the stain still left in 4 s — UE4SS does not carry the edited argument into the
  call); a creature with `DetachFromControllerPendingDestroy()` or `CustomTimeDilation = 0.0001` does not hit at all.
- **The material reads `DecalLifetimeOpacity`** (cooked expressions of `M_blood_ground_decal`: DecalLifetimeOpacity ×2, PixelDepth,
  ObjectOrientation). Measured on own stains spawned side by side (12:34–12:36, frames `grid1`, `grid2`): the full stain is drawn only while
  the lifetime-opacity value is ≈0.45–0.9; at 1 (before a fade starts) — a pale ghost, below ≈0.45 — nothing. `SetFadeOut(0, 30)`: visible
  from 4.5 to 16.5 s; `SetFadeOut(27, 3)`: a ghost until 27 s, vivid at 28.5 s, gone at 32.5 s. The vanilla 3 s fade passes the value
  through the window — the stain flashes.
- **What works:** a post-hook on the native `/Script/Engine.DecalComponent:SetFadeOut` (`self` = the decal), then
  `SetFadeOut(T − 3, 3, true)` + `SetFadeIn(−start × R, R)` (a negative fade-in delay starts the value at `start` and raises it by `T / R`).
  Life 40 s, R 200: starts 0.5 · 0.6 · 0.7 — full stain until 35 s, gone at 40 s; start 0.8 turns pale by 30 s (value ≈0.95). For 300 s:
  start 0.5, rise 0.3 (R 1000) — the stain darkens slowly, like drying blood. Our own `SetFadeOut` from Lua inside the hook does not
  re-enter it (a guard flag stays anyway).
- **Correction 12:38 (my own claim of 12:28, retracted):** «`SetLifeSpan(T)` after the game's fade holds the stain» is FALSE — `SetLifeSpan`
  of a decal component is not callable from Lua (a private engine method: «attempt to call a TrivialObject value»); the 12:21:08 frame
  showed the stains of `SetFadeOut(57, 3)` of the test hook, not of `SetLifeSpan`.
- Shipped as the Lua mod `KrinikLingeringBlood` 0.1.0 (`ConanExiles/_unpacked/KrinikLingeringBlood`), `hold_s` 300, cap 200 stains;
  the slider — the Krinik window of W24. Cases — `testcases/TC_conan_blood_decal_lifespan_2026-10-30.md`.

## Next (older plan, kept for the record)

1. Find who places the ground stain and with what life: grep the vanilla unpack for `M_blood_ground_decal` / `M_blood_growing_stain`
   references (combat hit blueprints, `SpawnDecalAtLocation` with `LifeSpan`, `DecalComponent` `FadeStartDelay` / `FadeDuration`, or a decal
   module inside the `P_blood_*` particle systems); the growing stain may fade by a material time parameter.
2. Check the engine side: `r.Decal.*` cvars and a pool / max-count cap that removes old decals regardless of their life.
3. Watch it live: a fight on the stand (the oasis boss), the remote lists `DecalComponent` instances near the hero with their fade settings.
4. The fix: native (data/asset) or a Lua write of the fade delay on a decal's birth (one write per decal, no polling); the time is a slider
   in the Krinik settings window (W24 — one scrolling list); cost measured (many 5-minute decals — the GPU, and the 1 ms CPU budget).
