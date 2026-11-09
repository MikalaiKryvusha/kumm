# Bug 90 — Conan: the third-person camera goes inside creature models (a crocodile fills the screen with its skin)

**Status:** 🔴 OPEN — cause found, PARKED by the owner: `[OWNER]` 2026-11-09 19:52 «просто в баг запиши, и вернись к твоей работе»; the fix waits for his pick of A / B
**Severity:** S2 (the player loses the view in a fight)
**Version/build:** Conan 3.0.1 + the Krinik build (pack after `e961480`) · **When/context:** 2026-11-09 19:52 +03:00, the owner's play in the agent's launch L6 of the quick-win series
**Fixing:** after the owner's pick of A / B (parked by him 19:52)

## Goal vector (Avoid)
The camera never shows the inside of a creature's body: a fight with a beast keeps the hero and the beast in view.
Acceptance: Situation — a crocodile (`BP_NPC_Wildlife_Crocodile_C`) stands between the hero and the camera at 1–3 m. Action — the player turns the camera around the
hero. Result — no frame filled by the creature's texture; the hero stays visible. Check — a clip at the stand, frames read by eye (HOUSE_RULES rule 4), zero frames of skin.

## Symptom
`[OWNER]` 2026-11-09 19:50 «камера в модельки врагов проваливается, не очень хорошо» — his frame: the whole screen is a crocodile's scales, the health bar «143 / 143 (100%)»
over it, the bow in slot 1.

## Forensics (remote read in the owner's running game, no input, 19:5x)
- The hero's `ThirdPersonSpringArm`: `bDoCollisionTest = true`, `ProbeChannel = 4` (ECC_Camera), `ProbeSize = 12`. Our camera mod does NOT turn the probe off in this
  session: the code default `disable_collision_test = true` is overridden by the owner's `config.lua` (`false`), and the log has no «щуп препятствий выключен» line.
- The nearest creature `BP_NPC_Wildlife_Crocodile_C` at 90 cm: capsule response to ECC_Camera = 0 (Ignore), skeletal mesh response = 0 (Ignore), mesh collision
  enabled = 1 (QueryOnly — its physics bodies exist); capsule radius 40, half-height 50 — far smaller than the crocodile's body.

## Root cause
The game's own design: creature bodies ignore the camera channel, so the spring arm's probe stops at walls and ground but passes through every creature. Not a
defect of KrinikConanCamera. Vanilla 3.0.1 behaves the same (`[AI]` inference from the responses above; a vanilla control run is case C1 below).

## Fix plan — options for the owner (UX)
- **A. The camera bumps into creatures like into a wall.** On a creature's birth (`NotifyOnNewObject` on the NPC character class — one event per spawn, no polling) its
  skeletal mesh answers ECC_Camera with Block: the probe stops at the body (the physics asset, not the small capsule), the arm shortens. Cost: with a big beast
  behind the hero the camera jumps close to the hero's back.
- **B. The creature becomes see-through while the camera is inside it.** Needs the camera position against creature bounds every frame or a camera-distance fade in the
  creature materials (Conan's creature materials have none — not read yet). Heavier, touches the 1 ms rule.
- `[AI]` recommendation: A — native data (a collision response), one event per spawn, the same rule the game already applies to walls.

## Cases (to run after the pick)
- C1 control: our camera mod's Lua off (`enabled.txt` out) — the camera still enters the crocodile (the game's behaviour).
- C2: A on — camera orbit around a frozen crocodile at 1 m (stand: `freeze-npcs.lua`, `fixed-cam` off), clip 60 fps, zero skin frames.
- C3: A on — the bow aim and melee against a big beast: the camera does not jump more than the wall case does (by eye on the clip).
- C4: the hero's own thralls / companions — whether they also get A (the owner's word).

## Decisions made without the owner
- none yet.

## Links
`games/ConanExiles/mods/KrinikConanCamera.md` (the probe setting history: bugs 04, 08, 09).
