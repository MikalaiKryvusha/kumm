# Test run report — Conan: palm leaf shadow flicker fixed by the foliage WPO bound (bug 67)


**Created:** 2026-11-07 19:19 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan 3.0.1 build, KrinikConanGraphics 0.9.0 + unreleased fix

## 1. Work

bug 67 acceptance — continuous sun (`DynamicSky.SolarUpdateAngleDelta` 0.0025), wind on, sharp shadows, no frame-to-frame leaflet blink
  (`[OWNER]` 2026-11-07 14:54 and 15:51, verbatim in bug 67); accepted by the agent's counts by the owner's word 18:56 («не позовешь меня посмотреть, а АВТОНОМНО!»).

## 2. Contour

Conan Exiles 3.0.1 build on this PC (RTX 5070 Ti, 4K window), the oasis palm stand: `stand-keeper.sh` (god, 600 m clean-up every 20 s),
  `fixed-cam.lua` (x −77872, y 245464, z −19718, pitch −55, yaw −135), 11:00 before each clip, window capture `gfxcapture`; `KrinikConanGraphics.pak` 0.9.0 + unreleased fix
  (M_Foliage `MaxWorldPositionOffsetDisplacement` 100 cm, kit cook 2026-11-07 19:05, «0 error(s)»).

## 3. Runs


- 2026-11-07 19:08–19:10 (pak installed by hand): `TOD=11.0 SEC=4 BOX="500 940 3000 1880" bash palm-shadow-series.sh c19 "T|DynamicSky.SolarUpdateAngleDelta 0.0025" …` ×4 turning + 1 still;
    `python shadow_pop_map.py <clip> <out.webp> 14 250,470,1500,940`; `python sway.py` (scratchpad).
- 2026-11-07 19:12 `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanGraphics -WithEngineIni` → `-Verify` clean (113 / 0).
- 2026-11-07 19:14–19:17 fresh launch after the deploy (`launch-bg.ps1`, `enter-world-remote.sh`), live read of the bound and the sun step, series c20 ×3 turning.

## 4. Checks


Hygiene: kit cook «Success - 0 error(s)»; `modpack.json` parses; Deploy `-Verify` clean.
Functional run: walked on the real game (the build's own deploy, a fresh launch, the oasis palm under the moving sun); READ: blink counts per clip, the in-game values
    (`M_Foliage bound 100.0`, `delta 0.0025`), two frames 2 s apart (full sharp leaflet shadows, moved by the wind).
  - Turning sun, pak by hand, wind 0.155–0.174: 0.11 / 0.09 / 0.44 / 0.06 % blinking sand pixels — pass (before, same wind: 12–16 %, series c13–c17).
  - Still sun control: 0.30 % — pass.
  - Fresh launch after the deploy, wind 0.214–0.224: 0.14 / 0.24 / 0.21 % — pass (before at 0.23–0.27: 17–20 %, series c11).
  - Wind kept: 5–17 % of the box changes over 2 s, 0.3 per frame (smooth) — pass.

## 5. Found

the live UE4SS write of `MaxWorldPositionOffsetDisplacement` + `r.Nanite` 0/1 does not apply it (16 % vs 16–21 %) — the value must be cooked. Ruled out earlier the
  same day on the same stand: re-render/cache, Nanite buffers / LOD / streaming, SMRT, receiver mask, HZB, WPO-disable distance, DLSS, conservative shadow raster (bug 67).

## 6. Traces

clips and maps in the session scratchpad `c19/`, `c20/` (`fixed_pair.webp`); kit cook log `F:/CEUE5Devkit/UE4/Saved/Mods/KrinikConanGraphics/cook.log`;
  script `ConanExiles/_config/devkit/kit-foliage-wpo.py` + `kit-foliage-wpo.json` (before 0.0, after 100.0).

## 7. Verdict

pass — the leaflet shadows no longer blink under the continuously moving sun with the wind on; open: a gameplay crash pass with the pak, other biomes' foliage.
