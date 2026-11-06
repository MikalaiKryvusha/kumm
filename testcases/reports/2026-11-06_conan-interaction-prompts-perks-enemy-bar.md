# Test run report — interaction prompts like the corpse strip, the perk gap 22, the enemy bar over its skull

**Created:** 2026-11-06 09:03 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles after `ff52637` + this batch (KrinikConanUI kit pak with
`W_EnemyHealthbar` and the five `/Game/UI/HUD/FloatingNames/W_*Info` overrides; Lua `krinik_ui_fixes` 1.5.0, `krinik_pickup_prompt`, `krinik_mod_settings` labels)

## 1. Work

Cases `testcases/TC_conan_interaction_prompts_like_corpse_strip_2026-11-06.md` (I1–I4, K1, K2, E1, P1). Basis: bug 83 (`[OWNER]` 2026-11-03 23:30 «я просил все
виджеты интеракици - влево, меньше, прозрачнее фон»), bug 64 item 46 (`[OWNER]` 23:50 «давай 22 поставим» · «там же можно скролить?»), bug 64 item 12a (`[OWNER]`
23:29 «можно было бы над черепом полоску чуть-чуть поднять»).

## 2. Contour

The working game `D:\Games\Conan Exiles 3.0.1`, the owner's oasis save, background path, 4K. Kit edit `kit-conanui-edit.py` (≈2.5 min) → `kit-buildmod.py
KrinikConanUI` (pak 15 326 811 B; `mod-overrides.py`: 15 override rows, the six new among them) → `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` (verify 107
present, 0 missing). Before the overrides: `kit-missing-refs.py` over the six vanilla widgets — 0 missing; `mod-overrides.py` over the game's Mods — no other
pak overrides them.
REAL WORLD: accumulated — the owner's working game and save, his `KrinikSettings.lua` (changed for I2, restored byte-for-byte after); data and machine — his;
path — the deployed pak and Lua loaded by a normal start.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-06 08:51 +03:00 | `machine-lock.mjs take` · `launch-bg.ps1` · `enter-world-remote.sh` · `god-on.sh` | world in 26 s; log «loaded 1.5.0» |
| 2 | 2026-11-06 08:53 +03:00 | `pult.sh "lua _G.__io_w='W_DialogueNPCInfo'; … dofile('…/_config/info-open.lua')"` · read-back · `capture-window.ps1 -Width 3840` | `translation=(-403.5, 0.0) scale=0.70 brushA=0.60` |
| 3 | 2026-11-06 08:54 +03:00 | hero `K2_TeleportTo` 2 m from the NPC · `SetControlRotation` · `mouse-seq.ps1` Shift + hold in front · read-back · frame | the game's own `W_DialogueNPCInfo` in viewport, same values |
| 4 | 2026-11-06 08:56 +03:00 | hero 5 m from the hostile boss · frame · crop | the bar and the skull apart |
| 5 | 2026-11-06 08:57 +03:00 | `mouse-seq.ps1` G · `move` + `wheel:-3` ×2 over the perk column · frames · live `PerkDescription.Slot:SetPadding` 10 / 16 / 22 on 20 rows | no scroll; the last perk whole only at 10 |
| 6 | 2026-11-06 08:57 +03:00 | `info-open.lua` for `W_PlaceableInfo`, `W_SimpleInfo`, `W_ThrallInfo`, `W_DBNORevive` · `MAXD_M=2000 strip-open.sh i4 BP_PL_Crafting_CampFire_C` | all five and the strip at −403.5 / 0.70 / 0.60 |
| 7 | 2026-11-06 08:58 +03:00 | `taskkill /PID 16492` · copy `krinik_pickup_prompt.lua` · `KrinikSettings.lua` with `ui_strip_x` 0, `ui_strip_scale` 1.0, `ui_strip_back` 0.8 · relaunch | world in 22 s |
| 8 | 2026-11-06 09:00 +03:00 | the NPC again (I2) · read-back · frame | `translation=(0,0) scale=1.00 brushA=0.80`, centred |
| 9 | 2026-11-06 09:02 +03:00 | `stone-stand.lua` · `both.lua` (talk prompt + `HB_KrinikPickup`) · NPC `K2_TeleportTo` onto the stone · `both.lua` ×6 | «plate opacity 1.00» alone; «talk=true plate opacity 0.00» ×6 |
| 10 | 2026-11-06 09:03 +03:00 | `taskkill /PID 34400` · settings restored · `machine-lock.mjs release` | no crash window |

## 4. Checks

Hygiene: `luac -p` on the three Lua files; the kit edit report `kit-conanui-edit.json` ok True with every step listed.
Functional run: walked in the live game by the player's path — the game itself showed the talk prompt over a real NPC (I1), the control with neutral hub rows
(I2), the four other prompts opened by code (I3), the container strip (I4), the «Хар-ки» tab by G and a real wheel (K1, K2), a hostile's bar (E1), the pickup
plate beside a talk prompt (P1); values READ by the remote and frames looked at.

| Case | Status | Observed |
|---|---|---|
| I1 | pass | left ≈ 0.28 of the width, 0.70, light backing |
| I2 | pass | control: centred, 1.00, dense backing — the owner's 11-03 look |
| I3 | pass (values) | four classes, the same three values; no game-shown frame |
| I4 | pass | the strip unchanged |
| K1 | pass | even gaps |
| K2 | fail | the column does not scroll; at 22 two lines of the last perk cut — the owner's pick back to him (review folder 64) |
| E1 | pass | ≈ 8 px of air under the bar; the look waits for the owner's eye (folder 66) |
| P1 | pass | «E Взять» off beside a talk prompt |

## 5. Found

1. The perk column does not scroll — the gap 22 cuts the last perk of «Сила» (K2; bug 64 item 46 back to the owner).
2. «E Взять» lit together with the talk prompt (frame 08:54) — fixed in the same run (P1).
3. The five prompts' vanilla backing is already brush alpha 0.6 (kit report: «0.6 -> 0.6»); the dense look of the owner's frame is the render at full scale over
   the same texture — at 0.70 it reads lighter (frames I1 / I2).

## 6. Traces

Frames in the session scratchpad (`i1_real.webp`, `i2.webp`, `k0.webp`, `k_10/16/22.webp`, `e1b_crop.webp`, `p_npc.webp`); copies for the owner —
`D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\64_perki_obrezka`, `65_podskazki_vlevo`, `66_cherep_zazor`. Logs: `UE4SS.log` lines «info prompt born: … placed».
The stand script `ConanExiles/_config/info-open.lua`.

## 7. Verdict

partial — bug 83 and item 12a pass; the perk gap 22 fails its own condition (the column does not scroll) and goes back to the owner.
