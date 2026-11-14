# Bug 101 — Conan hub: switching to and from «Снаряжение» shows a page over the bare world for 34–166 ms; «Параметры» finishes its portrait late

**Status:** 🔴 OPEN · **Severity:** S2 (the owner's stated purpose of the hub — navigation without jumps — fails on the most used tab)
**Version/build:** Conan Exiles 3.1.0, the Krinik build, KrinikConanUI `krinik_hub_controller` as of pack `4a08d5e` · **When/context:** 2026-11-14 12:38, the hub audit of
plan 48 (step 2, G1), first real-click 144 fps recording of all nine tabs
**Fixing:** this session — after the judge rounds of the key-binding work; the owner's words of 2026-11-14 12:24–12:32 make the hub's navigation the work (plan 48)

## Description

The hub was built to switch every tab in ONE frame with nothing jumping (plan 48, the owner's goal G1). By real mouse clicks it does so for the tabs where both
pages are ours (Карта, Хар-ки, Спутники, Клан, Путешествие: 1 frame, no blend), but not around the game's own pages:

1. **Our page → «Снаряжение»** (Таланты → Снаряжение at 14.33 s, Путешествие → Снаряжение at 48.54 s): the hub's dark backing disappears at once (the tab is
   see-through by design, the world shows behind the inventory), while OUR old page stays for ≈ 166 ms (the controller holds the game's newborn inventory at
   opacity 0 until no widget is born for 2 ticks) — the feat icons hang over the live world, then the inventory appears.
2. **«Снаряжение» → our page** (→ Базар at 19.04 s, → Таланты at 53.35 s): our page shows over the bare world for 34–70 ms (one blend frame), the backing fades in
   after it — on the frame the store's «Базар Черного Лотоса Недоступен При Игре Не В Сети.» stands over the world.
3. **→ «Параметры»** (33.75 s): the first frame shows the hero portrait as a head only; the body appears 60–110 ms later (late changes +56, +76, +111 ms over
   1760–2932 × 124–1492 px of 4K).
4. Smaller: after some switches a narrow strip right under the tab row (y 120–140 px of 4K) changes 28–49 ms after the switch — not read yet (a tab underline?).

## Steps to reproduce

1. The 3.1.0 game in front, the owner's world, the hub open (Tab).
2. `bash ConanExiles/_config/hubswitch/hub_run.sh <tag>` — real clicks map → feat → inv → store → attr → fol → stat → clan → jour → inv → feat, 144 fps capture.
3. `python -I ConanExiles/_config/hubswitch/hub_switches.py <tag>.mp4` in `ConanExiles/_scratch/hubswitch/h69/`.

## Expected result

Every switch: 1 changed frame, 0 blend frames, 0 late changes except the hovered tab label (plan 48 acceptance).

## Actual result

`audit1.mp4` (62 s, 5300 frames, 85 fps captured): the clean switches above; two-step switches at 14.333 + 14.500 (luma 33 → 75 → 51), 19.042 + 19.076 (blend
alpha 0.28, 51 → 100 → 35), 48.535 + 48.701, 53.347 + 53.417 (blend 0.45); «Параметры» blend 0.69 and late changes at +56 / +76 / +111 ms. Frames:
`KUMM/.work/keybinds/g1_sheet.jpg` (14.30 / 14.35 / 14.45 / 14.52, 19.03 / 19.06, 33.74 / 33.80 / 33.87).

## Build · Environment · Evidence

Conan 3.1.0 CL 383024, the owner's world `Game_1`, background launch + real input by `mouse-seq.ps1` (`hub_run.sh`), desktop HDR off for the capture. Recording
`ConanExiles/_scratch/hubswitch/h69/audit1.mp4`.

## Root cause / hypotheses

- (1)–(2): the backing belongs to the game's carousel (`W_Carousel`, its `AnimBackgroundFadeOut` made instant by our kit edit — notes `KrinikConanUI.md`): the
  NATIVE switch decides it from the target tab in the same call, while our controller shows the new page a tick later (ours) or after the hold (the game's
  pages). The backing and the page are not switched in the same frame. Direction: keep the backing as the OLD page needs it until the new page is shown, and
  switch both in one tick (force the backing on during a hold toward «Снаряжение»; force it on in the tick our page shows after «Снаряжение»).
- (3): the portrait is a render of the hero into a texture (`W_UICharacterDisplay`); the hold waits for widget births, not for the render — a vanilla look too
  (to check by a control run with the section off).
- **A probe that crashed the game (12:42):** reading `Brush.ResourceObject` of every live `Image` (`FindAllOf('Image')`) to find the backing — access violation
  0x18 in UE4SS frames (crash folder `UECC-Windows-A1E95CFB…_0000`, window closed by PID 8780, the live save checked ok). Read a brush only on a named live widget.

## Decisions made without the owner

— (open)

## Links

Plan 48 (acceptance criteria, «The owner's words 2026-11-14»), bug 97 (the kept pages), bug 64 items 15 / 17 (the dark wave — the instant `W_Carousel` fade).
