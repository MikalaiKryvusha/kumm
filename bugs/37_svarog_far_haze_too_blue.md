# Bug 37 — Svarog's Dream: the distant haze turns blue

**Status:** 🔴 OPEN
**Severity:** S3→ kept as a document because it is a taste item the owner named (UI_RULEBOOK "beauty is no seams")
**When/context:** 2026-10-11 ≈23:35, tossed by the owner mid-task while playing: `[OWNER]` «дымка вдали в синеву даёт... не очень красиво».

## Symptom
Far landscape fades into a blue tint; the owner finds it not pretty.

## Where to look
- KrinikColorRework 2.3.0 — far tree impostors in haze (own shader, commit `5112717`), haze colour settings.
- KrinikCameraRework — far distance 200–300 m, fog/haze defaults.
- Compare a frame with the mod's haze off vs on at the same spot (taste class: produce 2–3 variants of haze colour on one frame and let the owner pick).

## Decisions made without the owner
none yet.

## Frame
`SvarogsDream/gallery/game/2026-10-11_вода-и-дымка/01 пруд в деревне, полдень, 4K.webp` — the blue-white haze behind the far forest line.

## Second symptom (`[OWNER]` «скриншот - крыша не покрыта вдали дымкой» · 2026-10-11)
Frame `03 крыша вдали без дымки.webp` (same gallery folder): a far thatched hut at the foot of the mountain is crisp and golden while the trees and rocks around it sit in blue haze — the roof material ignores the fog/haze. Hypothesis: that object uses a shader without fog support, or our haze is applied only to terrain/trees (KrinikColorRework impostors), not to buildings. Check the hut material shader name and its fog keyword.
