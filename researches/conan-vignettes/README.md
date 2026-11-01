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
