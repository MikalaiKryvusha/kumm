# Bug 101 — Conan hub: switching to and from «Снаряжение» shows a page over the bare world for 34–166 ms; «Параметры» finishes its portrait late

**Status:** 🔧 items 1–2 FIXED in game 13:27 (fix 3 — the backing owned by the hub controller), items 3–4 open · **Severity:** S2 (the owner's stated purpose of the hub — navigation without jumps — fails on the most used tab)
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

## Attempts 2026-11-14 12:55–13:13 (fix1, fix2 — both REVERTED, the controller is back at pack `df7c244`)

The backing is `W_Carousel` → `GetWidgetFromName('Background')` (not a blueprint variable — `car.Background` is nil) → its dynamic material's scalar `MaskOffset`;
read live per tab (`_config/carousel-backing.lua`): **1 only on «Снаряжение»**, 0 on Таланты, Хар-ки, Параметры, Базар. A remote write of 0 on «Снаряжение» shows
the backing behind the inventory and holds (read back after > 1 s) — the parameter IS the backing.

- **fix1** (write `MaskOffset` in the tick a page is shown; on a hold toward «Снаряжение» write 0 at its start): recording `fix1.mp4` — no change at all (14.41 +
  14.60, 19.12 + 19.15, the same two-step switches). A debug log proved the writes landed at the right moments (13:07: «on» at the hold's start, «off» at the
  show 220 ms later) — so **the game writes the backing AFTER our switch tick**: the carousel's fade (`AnimBackgroundFadeOut`, a material track) is played or
  evaluated later than `OnChildActivated`, and the reverse starts from «off».
- **fix2** (fix1 + re-assert every tick of the hold and for 8 ticks after a page is shown): `fix2.mp4` — to «Снаряжение»: the bare world 56 ms (was 166),
  then the old page WITH the backing ≈ 140 ms, then the inventory — three states instead of two (one more jump); from «Снаряжение» to Базар: unchanged, 3
  frames of the store over the world. Not shipped (half a fix with an extra jump); kept as `KUMM/.work/keybinds/krinik_hub_controller_bug101_fix2.lua`.
- **Next (the fix by form, not by racing):** the game's own fade is the competitor — make `AnimBackgroundFadeOut` a no-op in our kit edit of `W_Carousel`
  (`kit-conanui-edit.py`, the CAROUSEL block: both keys of `MaskOffset_0` at the same value, or the track removed) so that ONLY the controller writes
  `MaskOffset`, in the same game-thread tick as the page it belongs to; then the remaining gap is the tick between the native switch and `on_switch` (the game's
  page leaves inside the native call) — measure it; if a frame of bare world remains on «Снаряжение» → ours, show our page by opacity inside the
  `OnChildActivated` hook (only opacity touches are safe there — EXP-0474). (3) «Параметры» portrait: a control run with the section off first.

## Fix 3 — the kit fade a no-op, the controller owns the backing (2026-11-14 13:17–13:27) — items 1 and 2 FIXED in game

`kit-conanui-edit.py` `CAROUSEL_NOOP` (kit run: `W_Carousel: AnimBackgroundFadeOut instant … keys ['Background MaskOffset_0=0.0..0.0']`), `kit-buildmod.py
KrinikConanUI` (pak differs from the 11:24 one; rollback `.work/keybinds/old_KrinikConanUI_1124.pak`), the fix2 controller; deployed `-Only KrinikConanUI` (pak
game = source) + `set-pak-modinfo.py` 66 / 66. Live: on «Снаряжение» `MaskOffset` = 1 written by our controller. Recording `fix3.mp4` (`hub_run.sh fix3`):
Таланты → Снаряжение 14.632 — ONE switch, blend 0, late 0 (was two steps, 166 ms over the bare world); Снаряжение → Базар 19.160 — one switch, clean (was 34 ms
+ a blend); Путешествие → Снаряжение 48.833 — one, clean; Снаряжение → Таланты 53.444 — one switch, blend 0, a late change +69 ms in a top band (308–3664 ×
120–436 px) — to read; Карта, Хар-ки, Спутники, Клан, Путешествие — clean. **Still open:** item 3 (Параметры portrait +35 / +69 / +104 ms), item 4 (small late
strips under the tab row, 28–69 ms), and the owner's play.

## Item 4 read 2026-11-14 13:4x — the late band after «Снаряжение» → «Таланты» is OUR page selecting a feat

Frames of `fix3.mp4` at 53.46 / 53.53 (top band crop, `KUMM/.work/keybinds/band_pair.jpg`): 69 ms after the switch the right column of OUR «Таланты» page fills
with a card — «Строительство: Highmane's A…», «Уровень 1», «Стоимость: 1» — where the first frame showed «Уровень -- · Стоимость: --». The game's newborn page
opens with nothing selected (the same difference as TC `TC_conan_hub_kept_tabs_stale_2026-11-14.md` H1 / H8 «selection card»). So our kept page selects its
first feat a few ticks after it is shown (a key-navigation select on activation reaching the shown page — to read: `KeyNavSelectFirstGridChild` /
`KeyNavMakeSelected` on `W_FeatWindow_C` when our page is shown) — a visible jump on every visit. Also on the same frame the tab row shows the underline glow
under «Снаряжение» and «Таланты» at once for a frame (the native tab indicator — to check against the game alone). Next: a hook on the select call of the
kept page, a control run with the section off.

## Decisions made without the owner

- `[AI]` 13:17 — the hub's backing is owned by our hub controller, not by the game's carousel fade: `kit-conanui-edit.py` `CAROUSEL_NOOP` makes
  `AnimBackgroundFadeOut` a no-op (the end key takes the start value); the controller writes `MaskOffset` in the tick its page shows (the fix2 code — re-assert
  through a hold and for 8 ticks after a show — kept: harmless once no fade competes). Cheap to reverse (`CAROUSEL_NOOP = False`, one kit run). Side effect named:
  with our Lua section off but the pak on, «Снаряжение» would keep the backing (no longer see-through). In flight 13:17: the kit edit, then `kit-buildmod.py`.

## Links

Plan 48 (acceptance criteria, «The owner's words 2026-11-14»), bug 97 (the kept pages), bug 64 items 15 / 17 (the dark wave — the instant `W_Carousel` fade).
