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

## Fix, part 1 — colour (2026-10-12)
Cause: the haze is scene fog coloured with the sky's HORIZON colour (`Sky.cs` `Haze`, `m.Horizon`) — blue by day. New setting
`Sky.HazeWhite` (0 — horizon colour, 1 — neutral grey of the same luminance), default 0.8. The sky's horizon veil already lerps to
`unity_FogColor`, so no seam. Run: noon, tilt 12°, 0 / 0.5 / 0.8 / 1 — blue goes away by steps, no horizon line
(`testcases/reports/2026-10-12_svarog-clock-weight-and-haze.md`, sheet `gallery/game/2026-10-12_дымка-белёсая/`).
Open: second symptom (roof without haze) — not yet looked at; noticed: far tree billboards are bright green over the haze.

## Decisions made without the owner
- `[AI]` Default 0.8 (not 1): a trace of the sky's tone stays, per «серость чуть-чуть» — the owner judges by the sheet.

## Frame
`SvarogsDream/gallery/game/2026-10-11_вода-и-дымка/01 пруд в деревне, полдень, 4K.webp` — the blue-white haze behind the far forest line.

## Second symptom (`[OWNER]` «скриншот - крыша не покрыта вдали дымкой» · 2026-10-11)
Frame `03 крыша вдали без дымки.webp` (same gallery folder): a far thatched hut at the foot of the mountain is crisp and golden while the trees and rocks around it sit in blue haze — the roof material ignores the fog/haze. Hypothesis: that object uses a shader without fog support, or our haze is applied only to terrain/trees (KrinikColorRework impostors), not to buildings. Check the hut material shader name and its fog keyword.

## Target colour (`[OWNER]` «дымка вдали не в сеневу должна уходить, а в белезну и серость чуть-чуть» · 2026-10-11)
The far haze should fade towards a whitish, slightly grey tone — not blue. Acceptance: on frames 01–03 the far forest, rocks and the hut go pale whitish-grey; the owner judges by eye.
