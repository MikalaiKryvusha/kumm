# Bug 101 — Conan hub: switching to and from «Снаряжение» shows a page over the bare world for 34–166 ms; «Параметры» finishes its portrait late

**Status:** 🔧 items 1–2 FIXED in game 13:27 (fix 3 — the backing owned by the hub controller); item 5 (Параметры → Снаряжение bare world) FIXED 15:09, pack
`6c4ce00`; items 3–4 measured 15:0x, open (item 4 needs a native read; item 3 — real clicks) · **Severity:** S2 (the owner's stated purpose of the hub — navigation without jumps — fails on the most used tab)
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
under «Снаряжение» and «Таланты» at once for a frame (the native tab indicator — to check against the game alone). **13:41 the mechanism read** (a remote post-hook on
`/Script/ConanSandbox.FeatWindow:SlotFeatSelectionChanged`, `[FSC]` lines in UE4SS.log): switch to «Таланты» at os.clock 100.072 → the slot fires on OUR kept page
(`…450814`, opacity 0 — not shown yet) at 100.552, then at 100.618 on the game's NEWBORN (`…440874`) and on ours again in the same tick — 66 ms after the switch,
the band's late change. So the newborn's selection on its construct reaches our page as a shared selection signal and our page fills its card late. Next: find
the signal's source (the feat window's selection delegate / the shared feat inventory) and keep our page out of the newborn's selection, or apply the selection
before our page is shown; a control run with the section off.

## Item 4 measured 2026-11-14 14:53–15:04 — the card changes after the first frame ONLY on «Снаряжение» → «Таланты»

Probe `ConanExiles/_config/feat-select-probe.lua` (a post-hook on `FeatWindow:SlotFeatSelectionChanged` + counts of the window's other native handlers + per-tick
samples of every feat page's `FeatNameView` and of `CraftingGUI_C`), the remote's `SetCarouselIndex`, background game, the owner's world. TC
`TC_conan_feat_card_first_frame_2026-11-14.md` F0.

- `SlotFeatSelectionChanged(inventory, Index, Item)` — the selection belongs to the shared FEAT INVENTORY: the event fires on our kept page and on the game's newborn
  within 1 ms of each other. The newborn builds its grid over the first two ticks (`SlotCompareItems` 337, `SlotDimItem` 93 + 42) on every path.
- **Карта → Таланты, Параметры → Таланты, Клан → Таланты:** our page is shown at tick 1 WITH the last selection's card («Строительство: Highmane's A…») and the card
  stays to tick 40 — no change after the first frame.
- **Снаряжение → Таланты (the path of `fix3.mp4` 53.444):** our page shown at tick 1 with the card, at tick 2 the card is EMPTY and stays empty — with no
  selection event on our page. `CraftingGUI_C` is out of the viewport already at tick 1 (removed inside the native switch) and is destroyed at tick 2, the same tick
  the card empties: the game's inventory page, torn down, clears the shared selection, and our page's card follows by a native path that is not a UFunction.
  The real-click recording showed the mirror order on the same path («--» first, filled 69 ms later) — the order of the teardown and the selection restore races.
- Leaving «Таланты» for any tab empties our hidden page's card a tick later (invisible).
- **Why no hold:** the old page is gone at tick 1 on this path — holding our page would show the bare backing (items 1–2 of this bug). **Next:** a native read of
  what `CraftingGUI` teardown calls on the feat windows (Ghidra on `FeatWindow` handlers — `/bug-research`), or the owner's eye on whether one frame of the old card
  on this one path is worth more work; real-click F4 when the PC is free.

## Item 3 and a new item 5, measured 2026-11-14 15:04–15:12 by background window capture (`hubswitch/hub_run_bg.sh`, remote switches, ≈ 40–43 fps)

- **Item 3 «Параметры» portrait:** from Клан and Спутники the hero is WHOLE on the first frame (`stat1.mp4` 7.60, `stat2.mp4` 7.42); the only late change is the
  waist cloth settling (+33 … +133 ms, box 1852–2000 × 532–1112 px of 4K) — cloth physics of the portrait actor. The «head first» of the real-click `audit1.mp4`
  did not reproduce on this path; to re-check by real clicks (F4 of `TC_conan_feat_card_first_frame_2026-11-14.md`) when the PC is free.
- **Item 5 (new) — Параметры ↔ Снаряжение, both the game's pages:** `stat2.mp4` 12.14–12.33: Параметры → Снаряжение showed the dark backing, then the BARE WORLD for
  two frames (luma 103), then the inventory — three states, 178 ms; Снаряжение → Параметры — ≈ 84 ms of the dark backing. Cause: the old game page leaves inside the
  native switch, the newborn is held until built, and the hold's backing followed the newborn — off for the see-through inventory. **Fixed 15:09 (controller):**
  after an old GAME page the backing stays on during the hold and goes off in the tick the inventory shows. `fix5.mp4`: Параметры → Снаряжение = dark backing
  ≈ 150 ms → the inventory (no bare-world frame, frames 3.33–3.52); Снаряжение → Параметры unchanged (dark ≈ 117 ms → page). Fast burst 6 / 6 OK after the
  change. **Still open:** the dark gap itself on these two switches (nothing of ours can stand on screen there — the game removes its old page).

## Decisions made without the owner

- `[AI]` 13:17 — the hub's backing is owned by our hub controller, not by the game's carousel fade: `kit-conanui-edit.py` `CAROUSEL_NOOP` makes
  `AnimBackgroundFadeOut` a no-op (the end key takes the start value); the controller writes `MaskOffset` in the tick its page shows (the fix2 code — re-assert
  through a hold and for 8 ticks after a show — kept: harmless once no fade competes). Cheap to reverse (`CAROUSEL_NOOP = False`, one kit run). Side effect named:
  with our Lua section off but the pak on, «Снаряжение» would keep the backing (no longer see-through). In flight 13:17: the kit edit, then `kit-buildmod.py`.

## Links

Plan 48 (acceptance criteria, «The owner's words 2026-11-14»), bug 97 (the kept pages), bug 64 items 15 / 17 (the dark wave — the instant `W_Carousel` fade).
