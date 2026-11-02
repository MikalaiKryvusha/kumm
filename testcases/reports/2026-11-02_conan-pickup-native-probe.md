# Run report — «E Взять» by the game's own pickup probe; the E rim fade; the plate's new place (bug 77)

## 1. Work

Bug 77 (`[OWNER]` 2026-11-02 14:18–14:22: the prompt late and lingering · «ДА НЕ СПИСКО БЛИЗКИХ УЖНО ПРОВЕРЯТЬ!» · «А ЩУП ИЗ ПРИЦЕЛА!» · «КОТОРЫМ И
ПОДНИМАЮТ!» · «ЭТИМ ЖЕ ЩУПОМ РАЗ В СЕКУНДУ ЩУПАТЬ» · «фейд плохой, контур E не действует на фейд!» · «слишком далеко плашка от центра» · «поднять выше в одну
линию с точной прицела, и правее»). Basis: `testcases/TC_conan_pickup_native_probe_2026-11-02.md` (N0–N8).

## 2. Contour

Conan Exiles 3.0.1, `D:\Games\Conan Exiles 3.0.1`, the full build; the oasis save; noon, `quiet-stand.lua`, god on; the game in the BACKGROUND
(`launch-bg.ps1`), real E by `mouse-seq.ps1`; machine lock `kumm` taken 14:31, released 15:09. New code: KrinikConanUI `krinik_pickup_prompt.lua` (the check
calls `/Script/ConanSandbox.EnvironmentFunctionLibrary:PickupGatheringOneInstance`, the near list removed, `set_rim`, slot alignment (1.0, 0.5), defaults
−1 % / 0 %) and `krinik_mod_settings.lua` (the same defaults).

## 3. Runs

- 2026-11-02 14:28–14:30 — desk: `uaj func … FunCombat_PlayerController.uasset VER_UE5_6 UpdateHighlightTarget` + `uaj tojson` → the call `EX_CallMath` to import −400
  `PickupGatheringOneInstance` ← `EnvironmentFunctionLibrary` ← `/Script/ConanSandbox`; arguments: self, the pawn, self, `Local_Camera` location + forward ×
  `InteractionDistanceThirdPersonBonus`, forward, `PickupInteractionDistance`, `PickupTraceSphereRadius`, out foliage, out instance; true → `ServerSetHighlightedObject`.
- 14:36 — N0: `pult.sh "lua … fn-params.lua"` (10 parameters: WorldContextObject, Actor, Controller, Eye, ViewDir, TraceLength, TraceRadius, OutFoliage,
  OutInstance, ReturnValue); 14:37–14:39 one call by the remote (`scratchpad/uht/probe_once.lua`) at `stone-stand.lua`: with the controller's bonus field 0 the
  answer was wrong; with the bytecode's branch (AdjustableCamera active → bonus 0; else CameraThirdPerson + `ThirdPersonSpringArm.TargetArmLength`) — stone true
  (instance 828), view up false; 100 calls 12 ms, 1000 calls 0.089 ms each.
- 14:39–14:41 — deploy `-Only KrinikConanUI`, restart (`Stop-Process` of my PID, `launch-bg.ps1`, `enter-world-remote.sh`).
- 14:44–14:47 — N1 ×4, N2 ×3 by the in-game sampler (`scratchpad/uht/sample.lua`: the view turned by `SetControlRotation`, the plate's opacity every 25 ms).
- 14:47–14:48 — N3: `K2_TeleportTo` +150 m, `stone-stand.lua`, the sampler.
- 14:48–14:49 — N4: `mouse-seq.ps1 -Seq "kdown:E,wait:90,kup:E,wait:1200"` ×2 at the stone, `probe_once.lua` before and after.
- 14:50–14:52 — N5, N6: `capture-window.ps1 -Width 3840` at opacity 1, at opacity 0 (remote), at opacity 0 + rim alpha 0; the sampler with the rim alpha.

## 4. Checks

Hygiene: `luac -p` of both files; `check-lua-game-thread.py` 0; `check-lua-shadow.py` 0.
Functional run: the live game by the player's path — the view on a stone / away, a real E, frames at 4K read by eye, the section's log read.
- N0 pass — the parameters as in the bytecode; true at a stone, false at the sky; the game alive.
- N1 pass with a note — the plate at full opacity 0.29, 0.39, 0.74, 1.24 s after the view settles (target ≤ 1.2 s: one of four 0.04 s over — the owner's 1 s
  rhythm + the 0.2 s fade on frame steps).
- N2 pass — gone (opacity 0, Collapsed) 0.28, 0.33, 0.40 s after the turn.
- N3 pass — 150 m away, a place not visited: the plate at full 0.88 s (the old section: up to ≈ 14 s, bug 77).
- N4 pass — each E took the probe's target (instance 92 → the next press found 24): the taken instance leaves, the plate stays while another pickup is in reach.
- N5 pass — cause confirmed: at plate opacity 0 the E rim stayed full white on the frame (`n5_op0_crop.webp`); the section's fade now drives the rim alpha with
  the plate (sampler: rim 0.90 → 0.78 → 0.66 → 0.54 → 0.42 → 0.30 → 0.07 → 0.00 with opacity 1 → 0); at opacity 0 + rim 0 nothing on the frame.
- N6 pass — the plate on the crosshair dot's line, right edge ≈ 60 px left of the dot at 4K (`n6_full_crop.webp`).
- N7 pass with a note — warm cost 0.089 ms per check (1000 calls); the section's own minute line sums 20–30 ms per 60 checks with the 1 ms Lua clock
  («худшая 1 мс», once 3 мс) — the per-call clock rounds to whole ms, the line is an upper bound, not a measure.
- N8 pass — view at the sky / bare sand: no plate (N2 samples end Collapsed).

## 5. Found

- `PickupGatheringOneInstance` IS callable from Lua: a static of `EnvironmentFunctionLibrary` (plan 42 searched only the controller / character chains and
  wrote «not a UFunction» — corrected there).
- `InteractionDistanceThirdPersonBonus` is written by the game only inside `UpdateHighlightTarget` (at an E press): 0 until the first press.
- The E rim (RoundedBox outline) ignores the parent's render opacity.

## 6. Traces

`D:\Temp\claude\d--work-ai-sandbox-KUMM\aa2bfa46-b5af-4d2d-9a0d-3bfc4132ec45\scratchpad\` — `n6_full_crop.webp`, `n5_op0_crop.webp`,
`n5_rim0_crop.webp`, `uht/` (bytecode JSON, probe scripts); the game's `ue4ss/UE4SS.log` of the 14:40 run (lines `[KrinikConanUI:PickupPrompt]`).

## 7. Verdict

pass — N0–N8 pass, N1 and N7 with the notes above.
