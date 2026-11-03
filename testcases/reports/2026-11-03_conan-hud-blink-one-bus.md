# Run report — food, water and weight blink in one phase (one bus)

**Work:** `KrinikConanUI` section `krinik_hud_blink` — at the limit (food / water 0 %, weight ≥ max) the icon is now driven by OUR pulse with peak 1 and
Hosav's native animation stopped, so every blinking icon follows ONE phase `os.clock() % PERIOD_S`. Basis: `testcases/TC_conan_hud_blink_one_bus_2026-11-03.md`;
`[OWNER]` 2026-11-03 19:41 «мерцают крассным в рассинхрон» · «Нужно синхронизировать, чтобы слушались одну шину» · «мерцание должно быть синхронным».

**Contour:** the owner's working game `D:\Games\Conan Exiles 3.0.1`, full build; the section deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`
(`-Verify` 108 present, 0 missing; `cmp` of the deployed file — equal); the hero at the oasis with water 0 % and weight 147 / 145 (102 %) as the save left
them; god on.

**Runs:**
- 2026-11-03 19:43 — control on the OLD section: `bash pult.sh "lua return dofile('…/_config/blink-phase.lua')"` × 10, 0.25 s apart.
- 2026-11-03 19:45 — the new section (after `launch-bg.ps1` + `enter-world-remote.sh`): the same × 12 (S1).
- 2026-11-03 19:46 — S2: `hs.FoodCurrent = hs.FoodMax * 0.05`, the same × 10.
- 2026-11-03 19:46 — S3: `ffmpeg -f lavfi -i ddagrab=framerate=60 -t 6` while `mouse-seq.ps1 -Seq "wait:5800"` held the game in front; sheet of the HUD
  icons, 4 fps.

**Checks:**
- Hygiene: none beyond the deploy's `-Verify`.
- Functional run: the owner's game, the blink read by the remote in one call per sample (k of each icon of the same frame) and seen on a 60 fps clip.
- Control (old section): both native animations playing (`*`), k water / weight 0.11 / 0.83, 0.84 / 0.73, 0.23 / 0.01, 0.03 / 0.58 … — out of phase. The defect reproduced.
- S1 pass: 12 of 12 samples k_water = k_weight (0.07 / 0.07 … 1.00 / 1.00 … 0.96 / 0.96), no native animation playing (R1, R2).
- S2 pass: food 5 % (early zone) — k_food / k_water constant 0.59–0.62 (0.58 / 0.98, 0.11 / 0.18, 0.53 / 0.86): the same phase, a smaller peak.
- S3 pass: on the frame sheet all three icons whiten and redden together; food at 4 % paler (R3).

**Found:** none new. Not covered: the exit from the limit (Hosav's reverse pass is stopped by the same poll — not observed), all three in the early zone
(shared the phase before the edit).

**Traces:** `ConanExiles/_config/blink-phase.lua` (the sampler); scratchpad frames `blink_sheet.jpg`, clip `blink.mkv` (session scratchpad, not kept).

**Verdict:** pass.
