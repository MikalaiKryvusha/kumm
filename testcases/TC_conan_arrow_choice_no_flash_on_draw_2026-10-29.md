# TC — the arrow-choice window does not flash on a bow draw; it still shows on the wheel (bug 64 item 29)

> **Created:** 2026-10-29 · **Parent:** bug 64 item 29 (`[OWNER]` «в момент натяжения в прицеле справа на экране словно виджет выбора стрел на мгновение
> появляется и исчезает - что это?» · 2026-10-26)
> **Status:** run 2026-10-29 16:03–16:08 — A1, A3 pass; A2 pass by a direct call (the synthetic wheel did not reach the mod — the owner's hand); A4 pass
> **Outbound:** —

**Basis.** Arrow Quick Swap: `UpdateDisplayUI` on substate 16 (aiming) → `AddToViewport(AmmoUI)`; the window is born with `CanvasPanel_32.RenderOpacity`
1.0 (not stored) until the mod hides it. Fix: `addprop:CanvasPanel_32/RenderOpacity 0` (`uaj` learned `addprop`); the wheel path calls
`HideDisplay` → `RevealDisplay`, the `Reveal` animation drives the opacity.

**Stand.** The owner's save, the beach, 4K, the bow on hotbar slot 1, arrows of several kinds in the bag (slots 5–8 of the frame 15:46: 24, 100, 100, 100),
no enemies; real input by `mouse-seq.ps1` after the owner's input idle (`1` to take the bow, RMB hold for the draw, the wheel while aiming);
frame series `capture-burst.ps1` during the draw; the right half of each frame read. Techniques: state transitions (idle → aiming → wheel → release),
control case (the original pak shows the flash — the owner's report and the mod's code; not re-run).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| A1 | No flash on a plain draw | bow in hand; burst; RMB hold 1.5 s, release | no arrow-choice window in any frame of the draw | pass 16:05 — bow taken by the remote `InpActEvt_Shortcut0_K2Node_InputActionEvent_25({KeyName=FName("One")})`; during a 4.5 s real RMB hold the remote saw `UI_AmmoDisplay_C … inViewport=true DisplayHidden=true`; 40 frames — no window (only the game's tutorial note at the right) |
| A2 | The window shows on the wheel while aiming | RMB hold; wheel −1 at 0.6 s; burst | the window appears after the wheel (and the arrow kind changes) | pass by a direct call 16:07 — real `wheel:-1` left `DisplayHidden=true` (did not reach the mod); `call UI_AmmoDisplay_C_… RevealDisplay` while aiming → frame: the list «Костяная стрела · 424x Железная стрела · 424x Железная стрела» over the sight, `DisplayHidden=false` |
| A3 | Second draw after the wheel | release, wait 2 s, RMB hold again; burst | no flash on the second plain draw | pass 16:08 — after the reveal, a new RMB hold: mid-draw frame without the window |
| A4 | No new errors | `UE4SS.log`, `ConanSandbox.log` grep for AmmoDisplay / ArrowQuickSwap errors | none | pass 16:2x — ConanSandbox.log: 14 lines name the mod, one warning «Falling back to imperfect hashmap» for its container — present for all 13 retoc-repacked containers of the build (pack-raw, known), no error |
