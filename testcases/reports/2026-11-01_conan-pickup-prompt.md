# Test run report — the light «E Взять» prompt over foliage pickups (plan 42)

**Created:** 2026-11-01 21:48 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles, KrinikConanUI Lua section `krinik_pickup_prompt.lua` (uncommitted
at the run, committed with this report)

## 1. Work

The owner's word 2026-11-01 21:14–21:34 (verbatim in plan 42 and the section header): a light «E Взять» when the hero can take a stick, stone, fibre … with E;
the look «ненавязчивый … полупрозрачный фейд фон … фон у E едва заметный», the check «лучом перед героем раз в 1 секунду». Cases P1–P5 of
`testcases/TC_conan_hub_rows_audit_2026-11-01.md`.

## 2. Contour

The live game 3.0.1 in the background (`launch-bg.ps1`), the oasis save, god on, food and water written to 100; the hero put beside a stone by the remote,
the camera turned by `SetControlRotation`; frames by `capture-window.ps1`; the section's own log.
REAL WORLD: accumulated — the owner's live save; data and machine — his; path — the hero walking up to a pickup and pressing E (E by `mouse-seq.ps1`).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 21:37–21:40 +03:00 | `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`, `launch-bg.ps1`, `enter-world-remote.sh`, the stand, frames, E | P1, P2, P4 pass; P3 redefined |
| 2 | 2026-11-01 21:39 +03:00 | the section's summary | 204 ms / 60 checks, worst 6 ms — over budget |
| 3 | 2026-11-01 21:42–21:44 +03:00 | cached controller, near sphere 6 m, slice 20, backing 0.85; redeploy | 49 ms / 60, worst 4 ms |
| 4 | 2026-11-01 21:45 +03:00 | per-part costs by the remote (50 repeats) | hero+location 0.10 ms, the game's line 0.02, a 20-component slice 0.16 |
| 5 | 2026-11-01 21:46–21:47 +03:00 | the near refresh moved to its own half-second frame, hero cached; redeploy | 20 ms / 60 = 0.33 ms a check, worst 3 ms |

## 4. Checks

Hygiene: `lua loadfile`; `check-lua-game-thread.py` — 0 worker-thread calls (the first draft had two `LoopAsync`, rewritten as an
`ExecuteInGameThreadWithDelay` chain).
Functional run: the live game; read — frames of the prompt, the hero's weight before / after E, the section's minute summaries.
P1 pass · P2 pass · P3 redefined (see Found 1) · P4 pass · P5 partial (the worst sample 3 ms with a 1 ms clock; the A-B flight owed).

## 5. Found

1. The game's foliage pickup is a 2 m sphere along a 90 cm probe starting at «camera + view × arm» (at the hero; CORRECTED 21:53 — this line first said «from the CAMERA») — E took a stone with the crosshair in the sky. The prompt copies that
   geometry, so it shows wherever E takes, including off-aim; the owner should know this is the game's own leniency.
2. My first cost was 6 ms worst: `FindFirstOf` every second and a 30 m sphere returning thousands of indices — fixed (cache, 6 m, split frames).
3. An enemy's health bar stands where the prompt stands (frame 21:47) — a layout overlap to look at.
4. After a teleport the near list catches up within ≈ 14 s (the slice of 20 a second); walking — no lag seen.

## 6. Traces

Frames in the session scratchpad (`pick/p2.jpg`, `p3c.jpg`, `p4c.jpg`, `p2cc.jpg`); the UE4SS log lines `[KrinikConanUI:PickupPrompt]` 21:38–21:47.

## 7. Verdict

partial — the prompt works and tells the truth; 21:50, 100 repeats in the live game: the check 0.12 ms, the near refresh 0.18 ms, each on its own frame once a second; the A-B flight of rule 7 is still owed.
