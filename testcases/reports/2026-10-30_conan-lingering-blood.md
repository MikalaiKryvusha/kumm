# Run report — Conan: ground blood stays 5 minutes (KrinikLingeringBlood 0.1.0)

**Work.** Plan 36 W28 — blood stains on the ground held up to 300 s instead of the game's 3 s; basis —
`testcases/TC_conan_blood_decal_lifespan_2026-10-30.md` (B1–B5 recon, L1–L6 the mod); the owner's word 2026-10-30 ≈10:59.

**Contour.** Conan Exiles 3.0.1 with the build; the mod deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikLingeringBlood` (twice: the
`SetLifeSpan` build, then the fade build); the owner's save copied before (`Conan Exiles Mods/_save-backup/2026-10-30_1205-before-blood-run`)
and restored after each launch; god by `_config/god-on.sh`, food/water by a direct write, noon by the remote; the oasis beach; machine lock per launch.

**Runs.**
- 12:04:51 launch — recon: hooks on `SpawnDecalAtLocation` / `SetFadeOut` by `pult.sh`, hits by a kappa and Night Terrors on the god hero,
  frames by `capture-window.ps1` / `capture-burst.ps1`; bytecode of `BP_CollisionComponent` by `kismet-trace.py`.
- 12:30:55 launch — mod build 1 (`SetLifeSpan(300)`); 12:34–12:36 own stains side by side (`SpawnDecalAtLocation` + `SetFadeOut` /
  `SetFadeIn` variants, `grid1`, `grid2`).
- 12:38:02 launch — mod build 2 (`SetFadeOut(297, 3)` + `SetFadeIn(-500, 1000)`); a crocodile's two hits at 12:39:16–19, the crocodile
  removed; top-down frames of the same spot at +10, +60, +120, +180, +285, +305, +330 s (the camera reset by a real wheel step before the
  last three — a Shift tap does not reset the game's idle camera, the +240 s frame was the idle orbit).

**Checks.**
- Hygiene: `check-lua-game-thread.py` — 0 worker-thread calls; `modpack.json` parses.
- Functional run: hits on the god hero in the game, the mod's lines in `UE4SS.log` and the frames read by eye.
- B1 pass (life 3.0, the attacker's `DoHandleHitFeedback`) · B2 fail as designed (`SetLifeSpan` not callable; pre-hook edit lost) · B3 pass
  (vanilla gone by +4.6 s) · B4 skipped · B5 pass · L1 pass · L2 pass · L3 pass (stain at +10/+60/+120/+180/+285 s) · L4 pass (none at
  +305/+330 s) · L5 pass (= B3) · L6 partial (`os.clock` has 1 ms steps on Windows: «4 stains, 1.000 ms» bounds the cost at ≈0.25 ms per stain).

**Found.**
- Build 1: `DecalComponent:SetLifeSpan` is a C++ method, not callable from Lua («attempt to call a TrivialObject value») — fixed by the fade
  route in build 2, the same run.
- The material draws the full stain only for a lifetime-opacity value ≈0.45–0.9 (measured, `grid1`/`grid2`) — the reason for the fade-in route.
- My own claim of 12:28 «SetLifeSpan holds the stain» was false — retracted in `researches/conan-blood-decals/README.md`.

**Traces.** `UE4SS.log` lines `[KrinikLingeringBlood]` 12:38:12–12:39:19; frames — the session scratchpad (`hold/`, `grid1/`, `grid2/`,
`burst2/`); the owner's review folder `SvarogsDream/НА ОТСМОТР НИКОЛАЕМ/24 Конан — кровь на земле 5 минут/`.

**Verdict.** pass — the stain holds 5 minutes and leaves on time; the look of a long stain and the 200-stain cap wait for the owner's eye; the
cost needs a finer clock to be a number.
