# Research — Conan: the screen-edge vignettes (hunger, thirst, low health) — epic 40 phase 1

> **Created:** 2026-11-01 · **Parent:** plan 40 phase 1; plan 36 W23; `[OWNER]` 2026-11-01 13:20 «по умолчанию в поставлке сборки виньетки голота и жажды ВЫКЛ,
> виньетка нижкого здоровья тусклая, типа 10% или на каком значении она едва заметна»
> **Status:** recon started 2026-11-01 13:31 +03:00 (live game, remote dump)
> **Outbound:** —

## Facts (live dump 2026-11-01 13:31, `ForEachProperty` by the remote)

- **`W_FullScreenEffectContainer_C`** (`/Game/UI/HUD/W_FullScreenEffectContainer`, one live instance, visibility 4): `HitIndicators` (Overlay), `EffectContainer`
  (Overlay — the buff effects sit here), `Owner` = the hero `BasePlayerChar_C`, `Active Effects`, `Playing` true, **`ActiveDamageEffect`** = a
  `W_FullScreenBuffEffect_C` (the damage / low-health effect), **`CurrentDamageThreshold` = 60**, `HitWidgets`, `CurrentActiveEffect`.
- **`W_FullScreenBuffEffect_C`** (`/Game/UI/HUD/W_FullScreenBuffEffect`): `Image` (Image), `Effect` (Border), animations `Anim_Puls`, `Anim_FadeSlow`,
  `Anim_FadeFast`, `Anim_FadeOut`, delegates `AnimationFinished`, `WidgetDestroyed`, `BuffBrushInitialized`, `Playing`, `Importance` (0), `Buff` (not readable as
  an object by the dump — read with `:get()` or by its class), a timer `Handle`.
- Textures (3.0.1 paks): `UI/Textures/GUIs/HUD/T_BuffFullScreenEffect_HungerThirst` (hunger AND thirst share one), `_ExtremeHeat`, `_ExtremeCold`, `_Heatstroke`,
  `_Frostbite`, `T_BuffFullScreenEffect`, `…Smoke`.

## Hypothesis to test next

The animations drive the CHILDREN (`Image` / `Effect`) — the effect widget's own root `RenderOpacity` is then free: strength = `RenderOpacity` of each
`W_FullScreenBuffEffect_C` set by our section on its birth (`NotifyOnNewObject`) by its kind (hunger/thirst → the `T_…HungerThirst` brush; low health →
`ActiveDamageEffect`), 0 = off. Check: a frame at hunger 5 % with RenderOpacity 1 vs 0.1 vs 0; the same for health at 15 %. Which buff a widget shows — read
`Buff`'s class or the `Image` brush's resource name.

## Crash 2026-11-01 13:31:43 (game down, crash report closed by PID 23472; `Saved/Crashes/UECC-Windows-DCA8667F4C3EF7E2474D3899F66D8B14_0000`)

Sequence: food set to 4 % by the remote (executed), then ONE remote call that walked every `W_FullScreenBuffEffect_C` and read `w.Image.Brush.ResourceObject`, `w.Buff:GetClass()`, `GetRenderOpacity()`, `GetVisibility()` — never logged as executed: the game died inside it. A native access violation is not a Lua error (pcall does not catch it, EXP-0401). Next: one unknown per call — first only `GetFName` + `GetRenderOpacity` of each effect widget; the brush and `Buff` later, one by one, after the crash dump is read.

## Probe 2026-11-01 13:33–13:35 (one unknown per call — no crash)

- Food 4 %: ONE live `W_FullScreenBuffEffect_C` (`…2147459071`, RenderOpacity 1.00) — most likely the container's `ActiveDamageEffect`; no hunger effect yet.
- Food 0 %: TWO more effect widgets are born (`…2147456923`, `…2147455601`) — the hunger vignette starts at 0 % (starving), not earlier.
- RenderOpacity 0.1 on the two new widgets vs 1.0: on window frames (`capture-window.ps1`, 3 s after food 0) NO vignette is visible in either frame — inconclusive: the effect may fade in slowly (`Anim_FadeSlow`) or the background window capture may not show it.
Next: hold food 0 for ≈ 10 s (refill right after — hunger at 0 kills even with god), frame with the game in FRONT (screen capture) at op 1 / 0.1 / 0; then the low-health effect (health 15 %) the same way; then identify each widget by its `Image` brush in a call of its own.

## Probe 2026-11-01 13:47–13:52 (game in FRONT, `capture.ps1` screen frames, `_config/edge-band.py`) — the route is found

- **Which widget is which** — `w.Image.Brush.ResourceObject` read alone is SAFE (no crash): the low-health widget (`…2147459071`, the container's
  `ActiveDamageEffect`, alive from the HUD's birth) draws `MID_HealthScreenEffectMat_<n>` — a dynamic instance of `/Game/UI/Textures/GUIs/HUD/HealthScreenEffectMat`
  with ONE scalar `Intensity`: 0.0 at full health, 0.3 at 60 % (119/199), 0.7 at 15 % (30/199) — the game writes it on the health change. A second permanent widget
  draws `T_BuffFullScreenEffect` (generic). The hunger widget is born when food hits 0 and draws `T_BuffFullScreenEffect_HungerThirst` — the SAME texture for
  thirst, so the brush cannot tell hunger from thirst.
- **The low-health vignette is red blood splatter at the edges and is already visible at 61 % health** (frame `p1_ctrl.jpg` at 121/199 — the «red blotches» first
  taken for heat; at 199/199 they are gone).
- **Strength = the effect widget's own `SetRenderOpacity(k)`** — the game does not rewrite it: at health 15 % the edge-band excess over the op-0 frame of the same
  view is 10.28 at op 1.0, 1.46 at op 0.1, 0 at op 0 (sheet `sheet_op.webp`: full frame → barely visible → none). Hunger: the image is constant (root op 1,
  `Image` op 1, `ColorAndOpacity.A` 0.8 — a 250 ms trace over 10 s, no pulse in these fields); the vignette is a DARK green-grey band at the edges, not red: edge
  luma 103.8 at op 1 vs 114.4 at op 0 (same view) — the redness measure does not see it; measure luma for hunger / thirst.
- Old hunger widgets stay findable by `FindAllOf` after the food is refilled (3 after three starvings) — setting opacity on them is harmless.
- The vanity (idle) camera swings overhead during a series; `EnableVanityCameraMode(false)` did not stop it at once — frame pairs are taken on ONE view within seconds.

## Crash 2026-11-01 13:52:26 (crash report closed by PID 14096; the owner saw it: «креш»)

ONE remote call that walked the BP class `W_FullScreenBuffEffect_C` with `ForEachProperty` (plus `GetPropertyClass` in a pcall) and `ForEachFunction` — a native
access violation. Together with 13:31:43 (`w.Buff:GetClass()` among other reads): **never touch `Buff` or walk this class's reflection from Lua.** Hunger vs thirst is
decided without `Buff`: at the widget's birth read `GetHungerSystem()` — food 0 → hunger, drink 0 → thirst, both → the larger of the two strengths.
