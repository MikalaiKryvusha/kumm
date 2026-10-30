# Research — Conan 3.0.1: blood on the ground for up to 5 minutes (plan 36 W28)

> **Created:** 2026-10-30 · on the owner's word: `[OWNER]` «спрайты крови на земле которые - нужно чтобы держались на земле до 5 минут до исчезночения» ·
> «чтобы земля, залитая кровью - долго была в крови» · «время настраивается ползунком в модах Krinik» · 2026-10-30 ≈10:59–11:00
> **Parent:** plan 36 W28 · **Status:** recon started 2026-10-30 11:2x — the blood assets found, the spawner and its lifetime not yet · **Outbound:** —

## Found (vanilla 3.0.1, `retoc to-legacy --filter lood` over `_paksview-3.0.1`)

`/Game/Effects/blood/` holds the blood: materials `M_blood_ground_decal`, `M_blood_growing_stain`, `M_blood_scatter_decal`,
`M_blood_wall_decal` (+ `MI_blood_wall_decal_1…4`, `M_blood_wall_decal_2`), `M_blood_ceiling`, `M_blood_drop`, `M_blood_spray`, `M_blood_mist`,
`M_blood_string`, `MF_FLX_BloodColor`; particle systems `P_blood_1h_sword_fatality`, `P_blood_2h_axe_fatality`, `P_blood_ceiling_drip`,
`P_blood_decapitation`, `P_blood_katana`, `P_blood_limb_spray`, `P_blood_mid_split`, `P_skull_fragmenting`. No blueprint with «blood» in its
path spawns them — the spawner sits in combat/hit blueprints under other names.

## Next

1. Find who places the ground stain and with what life: grep the vanilla unpack for `M_blood_ground_decal` / `M_blood_growing_stain`
   references (combat hit blueprints, `SpawnDecalAtLocation` with `LifeSpan`, `DecalComponent` `FadeStartDelay` / `FadeDuration`, or a decal
   module inside the `P_blood_*` particle systems); the growing stain may fade by a material time parameter.
2. Check the engine side: `r.Decal.*` cvars and a pool / max-count cap that removes old decals regardless of their life.
3. Watch it live: a fight on the stand (the oasis boss), the remote lists `DecalComponent` instances near the hero with their fade settings.
4. The fix: native (data/asset) or a Lua write of the fade delay on a decal's birth (one write per decal, no polling); the time is a slider
   in the Krinik settings window (W24 — one scrolling list); cost measured (many 5-minute decals — the GPU, and the 1 ms CPU budget).
