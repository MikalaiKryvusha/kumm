# Bug 67 — Conan 3.0.1: shadows of palm leaves flicker

**Status:** 🔴 OPEN · **Severity:** S2 · **Version/build:** Conan Exiles Enhanced 3.0.1 (UE 5.8), the 3.0.1 build of the pack
**When/context:** raised by the owner 2026-10-29 00:2x while playing in the agent's run: `[OWNER]` «и очень сильно бесит баг с мерцающими
тенями от листвы пальм...» · «нужна повторная разведка, как это можно исправить» · «это беды UE5, как я понимаю...». The same symptom was raised
2026-09-16 on 2.1.1 («я стою под пальмами, и тени от их листьев мерцают»).
**Fixing:** this session — a new recon (`researches/conan-shadow-flicker/2026-10-29_recon.md`), then A/B runs by its plan, the owner's eye decides.

## Goal vector and acceptance

Avoid: leaf shadows on sand under palms visibly jitter frame to frame. Done when the owner, standing under palms at 4K, says the shadows do
not flicker, and the look of the shadows is not worse (his 16.09 verdict on a blur lever: «качество теней ужасное просто» — rejected).

## Symptom

Shadows of palm leaves shimmer/flicker while the leaves sway (wind WPO), at 4K output (DLSS), sun moving.

## What is known (pointers, not retold)

- Mechanism and three rejected levers (2.1.1, 16.09) — `researches/conan-shadow-flicker/README.md`: VSM pages invalidated every frame by WPO foliage.
- Never run: the discriminating run with `r.Shadow.Virtual.Enable=0` (VSM vs the temporal upscaler).
- New 5.8 candidates — pack `docs/03-cvars-конана.md`, «Мерцание теней листвы пальм — новые кандидаты 5.8».

## Decisions made without the owner

(filled at closing)
