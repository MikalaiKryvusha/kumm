# Bug 36 — Svarog's Dream: camera rotation on the middle mouse button is gone

**Status:** 🔴 OPEN
**Severity:** S2 (the owner's camera control in his daily game)
**Version/build:** mod set as deployed 2026-10-11 (KrinikCameraRework 1.5.1 from 10-10 00:50, KrinikUIRework with HeroPortraits, KrinikModMenu 10-11 11:15)
**When/context:** 2026-10-11 ≈23:34, tossed by the owner mid-task while the agent's run (portraits check) had the game open: `[OWNER]` «по СКМ вращение камеры исчезло».

## Symptom
Holding the middle mouse button no longer rotates the camera.

## Forensics (observed 2026-10-11 23:34–23:37)
- `LogOutput.log` of the run: no exception or error lines; camera mod status line normal.
- The game's own key bindings (`%USERPROFILE%\AppData\LocalLow\VI Games\Svarog's Dream\gameSettings`, last entry of the bindings list) read `"Mouse3"` — identical (md5 prefix `01272111`) in every backup from `svarog-saves-2026-10-04_0945` to `…-2026-10-11_2332-before-portraits`. Unity: `Mouse2` = middle, `Mouse3` = side button. So the binding did not change in this period.
- No code in our mods reads the middle button (`grep GetMouseButton(2)|Mouse2` over `SvarogsDream/src` — none).
- Assembly identifiers: `isCameraEverRotated`, `cameraOriginalRotation`, `originalCamRotation`.

## Hypotheses (ranked, unverified)
1. The rotation binding is `Mouse3` (side button), and the middle button never rotated in this game — the owner may have used the side button. Check: hold `Mouse3` in game.
2. Something of ours swallows the game's rotation input (KrinikDevHarness hover/cursor, a UI raycast target of KrinikUIRework covering the screen). Check: disable plugins one by one (`*.dll.off`), test after each.
3. The game rotates only when not over UI — a full-screen invisible Image of ours (e.g. the new portraits module or settings layer) blocks it.

## Fix plan
Reproduce first (owner's word on which button he used before), then bisect by plugin.

## Decisions made without the owner
none yet.
