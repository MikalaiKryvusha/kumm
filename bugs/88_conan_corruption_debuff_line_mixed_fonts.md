# Bug 88 — the corruption debuff line: two font sizes in one caption, the red plate covers two thirds

**Status:** 🔴 OPEN — recorded from the owner's frame (tossed mid-test, not worked yet)
**Severity:** S3-visible
**Version/build:** Conan Exiles 3.0.1 build · **When/context:** 2026-11-07 22:41 +03:00 — `[OWNER]` «странный вид виджета» + a frame, during the headshot stand
**Fixing:** after the archery cases of bug 85 (the UI queue: bugs 64, 84, 86)

## Symptom (the frame, described — the image lives in the chat only)

A debuff row (skull icon, red plate): «Сильная скверна — Макс. ОЗ снижены на 175». «Сильная скверна —» is in a smaller font than «Макс. ОЗ снижены»; «на 175» wraps to a
second line in the small font again; the red plate fills only ≈ 2/3 of the row width, the rest is dark.

## To do

Find the widget (the status-effect / debuff row — vanilla, UIMod_Hosav or ours), whether the two sizes come from the translation (two runs of rich text / a bold
part) or the widget; the plate width — a progress bar (remaining duration?) or a fixed-size brush. Frames at 4K and 1080p.
