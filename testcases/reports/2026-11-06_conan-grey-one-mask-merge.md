# Test run report — the Grey One Mask merged from Severe Weather into Mines of Set (plan 45 step 1)

**Created:** 2026-11-06 10:07 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles after `cdd22db` + `copyprop:` (patch-mod-asset.py), the map
`_config/krinik_patches/Mines_of_Set__Caverns_of_Set_Item_Table.tsv` (+6 lines), `rebuild-krinik-paks.py --expect-changed`

## 1. Work

Cases `testcases/TC_conan_grey_one_mask_merge_2026-11-06.md` G1–G3. Basis: `[OWNER]` 2026-11-06 09:55 «Предлагаю 3 710»; the register line of
`researches/mod-reconciliation/REGISTER.md`.

## 2. Contour

The working game `D:\Games\Conan Exiles 3.0.1`, the owner's oasis save, background path, 4K; the Mines of Set pak rebuilt by its recipe and installed into the
library and the game.
REAL WORLD: accumulated — the owner's game with all 65 mods; data and machine — his; path — the installed pak loaded by a normal start.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-06 ≈09:57 +03:00 | `rebuild-krinik-paks.py --only Mines_of_Set` | «куски разошлись: 1 из 3733 (первый c8d90c2384ddf4cf00000001) — НЕ СТАВЛЮ» — the strict check without the key, as designed |
| 2 | 2026-11-06 ≈09:58 +03:00 | read the built `zen-check.json` and the work's `raw-mod/manifest.json` | the changed chunk = `Caverns_of_Set_Item_Table.uasset`; row 51420: `BP_SandstormBreather_C`, 38, «Light Armor», 3710, «…Grey Ones», 46 rows (the original also 46) |
| 3 | 2026-11-06 ≈10:02 +03:00 | `rebuild-krinik-paks.py --only Mines_of_Set --expect-changed Caverns_of_Set_Item_Table --install` | «кусков 3733 … сошлись, поставлены»; the game's pak 10:02 |
| 4 | 2026-11-06 10:04 +03:00 | `launch-bg.ps1` · `enter-world-remote.sh` · `god-on.sh` · `exec MakeMeAdmin` · `exec SpawnItem 51420 1` · `exec SpawnItem 52011 1` · `FindAllOf` | G1, G3 |
| 5 | 2026-11-06 ≈10:06 +03:00 | G (hub), a click on «Снаряжение», wheel to the end, a real click on the mask, `capture-window.ps1 -Width 3840` | G2 |

## 4. Checks

Hygiene: `ast.parse` of both tools; the manifest JSON parses.
Functional run: the installed pak in the owner's game, by the player's path (the item in the inventory, its details panel READ on a 4K frame):

| Case | Status | Observed |
|---|---|---|
| G1 | pass | the spawned 51420 is a `BP_SandstormBreather_C` |
| G2 | pass | «Легкий доспех», «Прочность доспеха: 38», 660, 7.09, the button «Использовать (F)» |
| G3 | pass | the spawned 52011 stays a breather |

## 5. Found

1. The rebuild check said «байт в байт» for the whole pak while one chunk changed by design — the message now names the expected changed chunks.
2. Older `BPGameItemArmor_C` instances of 52011 exist in the world beside the breather ones — not traced (made before the start or NPC gear).
3. The mod's notes counted 47 rows; the table has 46 (fixed in the notes).

## 6. Traces

Frames in the session scratchpad (`g2b_crop.webp`, `inv3_crop.webp`); review folder `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\67_maska_serogo`.

## 7. Verdict

pass.
