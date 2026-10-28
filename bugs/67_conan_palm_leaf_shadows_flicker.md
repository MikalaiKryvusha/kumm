# Bug 67 — Conan 3.0.1: shadows of palm leaves flicker

**Status:** 🔴 OPEN · **Severity:** S2 · **Version/build:** Conan Exiles Enhanced 3.0.1 (UE 5.8), the 3.0.1 build of the pack
**When/context:** raised by the owner 2026-10-29 00:2x while playing in the agent's run: `[OWNER]` «и очень сильно бесит баг с мерцающими
тенями от листвы пальм...» · «нужна повторная разведка, как это можно исправить» · «это беды UE5, как я понимаю...». The same symptom was raised
2026-09-16 on 2.1.1 («я стою под пальмами, и тени от их листьев мерцают»).
**Fixing:** this session — a new recon (`researches/conan-shadow-flicker/2026-10-29_recon.md`), then A/B runs by its plan, the owner's eye decides.

## The owner's requirement (2026-10-29, after the 2.0 revert)

`[OWNER]` «МОЙ ВЫБОР: ПЛАВНОЕ СОЛНЦЕ И НЕ МЕРЦАЮЩИЕ ТЕНИ!!!!!!!!» — both, neither bought with the other: `DynamicSky.SolarUpdateAngleDelta`
stays 0.003 (or any value whose steps are not seen), and the leaf shadows do not flicker. Search order: levers that do not touch the sun
(recon R3 DLSS model/mode — now Balanced, preset F; R4 `ResolutionLodBiasDirectional` −1.0 → −1.5/−2.0; R7 `UseReceiverMaskDirectional`), then any
cvar that keeps VSM pages from invalidating on a small light rotation; verify each by a 60 fps clip under palms and the owner's eye.
The bar is other games: `[OWNER]` «как в других ИГРАХ!!!!» · «и плавно, и не мерцает!» — first recon step: how shipped UE5 games with a moving sun and
VSM (and their community fixes) keep both — Epic's guidance on time-of-day with VSM, the settings those games ship.
`[OWNER]` «эти ебучие тени не должны перерисовываться и пересчитываться так часто!» — the target design: the visible sun moves smoothly, the
shadow-casting light (and the VSM cache) updates rarely. Recon of that question — `researches/conan-shadow-flicker/2026-10-29_light-rotation-cache.md`.

## Goal vector and acceptance

Avoid: leaf shadows on sand under palms visibly jitter frame to frame. Done when the owner, standing under palms at 4K, says the shadows do
not flicker, and the look of the shadows is not worse (his 16.09 verdict on a blur lever: «качество теней ужасное просто» — rejected).

## Symptom

Shadows of palm leaves shimmer/flicker while the leaves sway (wind WPO), at 4K output (DLSS), sun moving.

## What is known (pointers, not retold)

- Mechanism and three rejected levers (2.1.1, 16.09) — `researches/conan-shadow-flicker/README.md`: VSM pages invalidated every frame by WPO foliage.
- Never run: the discriminating run with `r.Shadow.Virtual.Enable=0` (VSM vs the temporal upscaler).
- New 5.8 candidates — pack `docs/03-cvars-конана.md`, «Мерцание теней листвы пальм — новые кандидаты 5.8».

## Fix (2026-10-29 00:4x)

Root cause (re-recon `researches/conan-shadow-flicker/2026-10-29_recon.md`): our own `Engine.ini` set `DynamicSky.SolarUpdateAngleDelta = 0.003`
(the game: 0.015) — the sun light turned ~50 times a second, each turn invalidating the VSM pages. Live A-B-A in one session under palms:
`2.0` → `[OWNER]` «ну сейчас словно тени в порядке»; back to `0.003` → «да, вернулось». The pack's `Engine.ini` now carries `2.0` (commit 24a500e);
the game log applies it after the quality group's 0.015. Run report `testcases/reports/2026-10-29_conan-loot-strip-hold-prompt-bars-shadows.md`.
Open: whether the sun's step every few seconds is noticed in play — then 1.0 or 0.5.

**Status:** 🟢 2.0 BY THE OWNER'S CHOICE 2026-10-29 01:10 (pack 1c70cb9; «все решаения - гавно. ставим 2.0 и закрываем чат»); history: 2.0 was reverted once (pack 6a12183): 0.003 was set on purpose for a smoothly moving sun (the comment above the
line in `Engine.ini`), and the owner: «мы же специально делали так, чтобы солнце плавно по небу двигалось...» · «ты блять взял и откатил это?».
The trade-off is the owner's: smooth sun (0.003, flicker) vs calm shadows (2.0, the light steps every few seconds). Next: 0.1 / 0.25 / 0.5 under palms
(video + his eye) and the recon levers that do not touch the sun (R3 DLSS preset, R4 LOD bias −1.5).

## Decisions made without the owner

- `[AI]` 2.0 written, not a middle value: it is the value the owner looked at; 1.0 / 0.5 are the named fallbacks if the step is visible.

## Next path — the kit (the owner, 2026-10-29 01:1x)

`[OWNER]` «в этой сборке - а разме не мы эту сборку собираем?» · «и целвый кит на 170 гигов есть!» — the search above covered engine cvars only. Next:
edit the sky blueprint in the kit (Ultra Dynamic Sky / `DynamicSky`): keep the visible sun moving smoothly, update the shadow-casting directional light
rarely (and, if possible, ease between its steps instead of jumping) — the same kit route as `KrinikUIFixes` / `KrinikConanArchery`. First step:
read the sky blueprint (which asset drives `DynamicSky.SolarUpdateAngleDelta`, where the light rotation is set).
