# Test run report — Conan wall jump by the owner's design of 17:38 (0.5 m push, own-jump height, wall to wall) and the air control

**Created:** 2026-11-14 17:59 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan 3.1.0, pack `0b05b67` + the uncommitted KrinikConanLocomotion edit of 17:4x

## 1. Work

The owner's words of 2026-11-14 17:38–17:39 (verbatim in `games/ConanExiles/mods/KrinikConanLocomotion.md`): the push off a wall ≈ 0.5 m, light WASD steering in
the air as in Oblivion, the wall jump's height growing with the hero's jump, wall to wall. Cases W10–W14 of `testcases/TC_conan_wall_jump_2026-11-14.md`.

## 2. Contour

The owner's world on `D:\Games\Conan Exiles 3.1.0`, background launches (`launch-bg.ps1`, PIDs 36432 and 38924), the remote; the desert arch stand
(`_config/wall-stand.lua`: `find` ×2, `climb`, `jumpwall` with `_G.__ws_jdur` / `_G.__ws_steer`); REAL keys by `mouse-seq.ps1` while the PC was free (owner-idle
FREE). REAL WORLD: accumulated — the owner's save and 66 mods; data and machine — his PC; path — the remote's input events and real Space / W / D.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-14 17:44 +03:00 | `pult.sh "lua … cm.AirControl, cm.JumpZVelocity, cm.GravityScale, cm.BrakingDecelerationFalling, cm.FallingLateralFriction …"` | 0.35 (the mod's first value; the game's own 0.60 in the log «управление в воздухе 0.60 → 0.35»), 444, 1.00, 0, 0.30 |
| 2 | 2026-11-14 17:45 +03:00 | `jumpwall` on the ground with `_G.__ws_steer={yaw=r.Yaw+90}` at AirControl 0.6 and 0.35, and without steering | 102 / 88 cm; 0 / 0 cm |
| 3 | 2026-11-14 17:46–17:47 +03:00 | `mouse-seq.ps1 -Seq "…kdown:0x20…kdown:D,wait:700,kup:D…"` (a standing jump, D only in the flight) | 100 cm |
| 4 | 2026-11-14 17:48 +03:00 | `climb`, `jumpwall` with `_G.__ws_jdur=2.0` | «landed at 1.23 s: 47 cm …», «… 444 вверх (прыжок героя 444 × 1.00)» |
| 5 | 2026-11-14 17:49 +03:00 | as 4 with `_G.__ws_steer={yaw=70}` | 100 cm |
| 6 | 2026-11-14 17:50 +03:00 | on the wall: `mouse-seq.ps1 -Seq "…kdown:0x20…kdown:D,wait:800,kup:D…"` | 125 cm, (−30, −121) along the wall |
| 7 | 2026-11-14 17:50 +03:00 | on the wall: `mouse-seq.ps1 -Seq "…0x20…kdown:W,wait:350,kdown:0x20…kup:W…kdown:0x20…"` | two pushes 1.42 s apart |
| 8 | 2026-11-14 17:51–17:53 +03:00 | the AirControl write reverted (`git checkout` of `krinik_oblivion_locomotion.lua`), deploy, restart, `climb` + `jumpwall` | 46 cm; AirControl 0.60 after the jumps |

## 4. Checks

Hygiene: judge round 5 on the diff (running at 17:5x)
Functional run: the wall jump and plain jumps walked in the owner's world by the remote and by REAL Space / W / D; READ — the stand's landing lines, the hero's
place before / after, `UE4SS.log` lines of the mod, the live movement properties.

| Case | Status | Observation |
|---|---|---|
| W10 | pass | 47 cm (17:48), 46 cm (17:53, final build) from the wall start to the landing, no steering |
| W11 | pass | along the wall: remote 100 cm, real D 125 cm |
| W12 | pass | the push's up = `JumpZVelocity` 444 × 1.00 (Agility 8) |
| W13 | pass (one wall) | push, W back, Space in the air caught the wall, the next Space pushed (pushes 1.42 s apart) |
| W14 | pass | standing jump steered: remote 102 / 88 cm (AirControl 0.6 / 0.35), real D 100 cm; 0 cm without |

## 5. Found

- The game's own `AirControl` is 0.60 — WASD already steered every jump; the mod's first value 0.35 LOWERED it. Reverted: nothing of ours sets air control,
  its strength is the owner's word.
- The game resets nothing of the air control in a jump (0.60 read after the jumps of the final build).

## 6. Traces

`D:\Games\Conan Exiles 3.1.0\ConanSandbox\Binaries\Win64\ue4ss\UE4SS.log` of the 17:43 and 17:52 starts (`[KrinikConanLocomotion:WallJump]`, `[OblivionLocomotion]`);
the stand samples quoted in the TC rows.

## 7. Verdict

pass — the owner's design holds on the final build: a 0.5 m push, the jump's own height, steering in the flight (the game's), wall to wall by real keys. Open:
a two-wall gap not staged; the numbers (45 cm/s, × 1.00, the game's 0.60) for the owner's eye.
