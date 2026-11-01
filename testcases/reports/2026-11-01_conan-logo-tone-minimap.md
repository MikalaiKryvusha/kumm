# Test run report — the KRINIK MOD PACK logo toned to the game logo; the minimap further from the corner, its coordinates lower

**Created:** 2026-11-01 21:04 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles, KrinikConanUI pak rebuilt 21:00 (texture from
`make-pack-logo.py <out> 1.3`), `krinik_minimap_coords.lua` with `BOTTOM_INSET` 52 and `CORNER_SHIFT` (10, −10.3)

## 1. Work

`[OWNER]` 2026-11-01 20:46 «в главном меню тон логотипок Conan Exiles Enhanced и KRINIK MOD PACK отличаются» · «Можно тонокорекцией KRINIK MOD PACK привести его к
лого Conan Exiles Enhanced?» · 20:48 «словно слово KRINIK не такое как CONAN» · 20:51 «темное внутри CONAN и внутри KRINIK различается» · 20:53 «пусть твои
скрипты и измерят»; 20:46 «коардинаты на миникарте ниже» · 20:48 «миникарту чуть-чуть дальше от правого края и от верха». Cases L1, M1 of
`testcases/TC_conan_hub_rows_audit_2026-11-01.md`.

## 2. Contour

The live game 3.0.1 in the background; the main menu and the oasis save; frames by `capture-window.ps1` at 4K; the logos located in the frame by template
matching of their source textures (KRINIK 854×324 at 1016, 262; CONAN 760×380 at 148, 242).
REAL WORLD: accumulated — the owner's live save; data and machine — his; path — the main menu and the HUD as the player sees them.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 20:48 +03:00 | the remote reads both logo `Image` widgets and textures | equal: tint 1, opacity 1, SRGB true, compression 7, LOD group 16 |
| 2 | 2026-11-01 20:52 +03:00 | per-band source → frame comparison of both logos | the game lifts both darks alike (KRINIK 11 → 23, CONAN 11 → 20): the difference is in the picture |
| 3 | 2026-11-01 20:55 +03:00 | `make-pack-logo.py` dark-fill match, strengths 1.0 / 1.3 / 1.6, scored through the measured lift | 1.3 — median 19.3 against CONAN 19.2 |
| 4 | 2026-11-01 20:56–21:00 +03:00 | `import-logo-texture.py` (`KIT_LOGO_TGA`), `kit-buildmod.py KrinikConanUI` | ok, pak 9 823 105 bytes, new MD5 |
| 5 | 2026-11-01 21:01–21:03 +03:00 | `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`, `launch-bg.ps1`, menu frame, `enter-world-remote.sh`, HUD frame | L1, M1 below |

## 4. Checks

Hygiene: `lua loadfile` of the section.
Functional run: the main menu and the HUD in the live game, frames read and measured.
L1 pass — dark fill (10 / 25 / 50 / 75 %): CONAN 5 / 11 / 19 / 31, KRINIK 6 / 12 / 19 / 30 (before 11 / 17 / 25 / 38); the gold untouched (the owner's colour kept
above luminance 110). M1 pass — the ring 48 px from the top and 44 px from the right at 4K (was 33 / 33); the coordinate plate ≈ 12 px above the clock plate.

## 5. Found

1. A mistake of mine on the way: the first «как сейчас» variant was built already toned (the default output was the toned file) — caught by two identical
   measurements, the comparison redone from a strength-0 copy.

## 6. Traces

Review folder 52 «logo ton krinik» (`D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\`): before, after, the whole menu. The UE4SS log line «загружен: … отступ 52».

## 7. Verdict

pass — the dark fill matches the game logo by measurement; the minimap moved as asked. The look is the owner's eye (review folder 52).
