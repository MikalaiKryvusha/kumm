# Test cases — food, water and weight blink in one phase (one bus)

**Created:** 2026-11-03 · **Under test:** `KrinikConanUI` section `krinik_hud_blink` (Lua) · **Version/build:** pack ConanExiles after `08bb431`
**Test basis:** `[OWNER]` 2026-11-03 19:41 (his frame: water 0 %, weight 147 / 145 = 102 %) «мерцают крассным в рассинхрон» · «Нужно синхронизировать,
чтобы слушались одну шину» · «мерцание должно быть синхронным».

## 1. Goal vector

Achieve: every icon that blinks (food, water, weight — in the early zone or at the limit) reaches its red peak at the same moment as every other one.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHILE water is at 0 % and the weight ≥ max, the section shall drive both icons by one pulse phase | k of each icon (water: 1 − G^(1/2.2) of `Border_WaterImage` content colour; weight: alpha of `Image_Weight_Blinking`) read in ONE remote call, 12 samples over 4 s · max abs(k_water − k_weight) · ≤ 0.05 |
| R2 | WHILE an icon is driven by the section, Hosav's native animation of it shall not play | `IsAnimationPlaying(NoWater)`, `IsAnimationPlaying(OverEncumbered_Weight)` in the same samples · count of `true` · 0 |
| R3 | The blink is visibly in one phase | a 60 fps clip of the HUD corner, eye · both icons red together · seen |

## 3. Coverage matrix

Partitions: both at the limit (the owner's frame) · one at the limit and one in the early zone (food 5 %). Not covered: all three in the early zone (they
already shared the phase), the limit exit (the reverse pass).

## 4. Stand

The owner's working game, full build with the edited section deployed (`-Deploy -Only KrinikConanUI`); the hero's water 0 % and weight over max (as
the save left them; else the remote sets `BP_HungerSystem.DrinkCurrent = 0` and spawns weight); god on.

## 5. Cases

| ID | Steps | Expected | Status | Observed |
|---|---|---|---|---|
| S1 | water 0 %, weight 102 %: 12 samples of k_water, k_weight, playing flags | R1, R2 | pass | 12/12 equal, no native animation (control before the edit: out of phase) |
| S2 | food set to 5 % of max: 12 samples of k_food vs k_water | k_food = 0.15…1 scaled × the same pulse — ratio constant, peaks together | pass | ratio 0.59–0.62 over 10 samples |
| S3 | 60 fps clip of the HUD icons, 6 s | red together | pass | the sheet: all three whiten and redden together |

Report: `testcases/reports/2026-11-03_conan-hud-blink-one-bus.md`.
