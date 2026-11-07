# Bug 75 — the quick-loot selection rim jumps to the last cell for a moment when an item is taken with F

**Status:** 🔧 the CAUSE fixed 2026-11-07 ≈11:27 +03:00 — the cell's `AnimSelect` (the rim's 0.3 s fade, played in reverse on the walk's last cell) made instant in the
KrinikConanUI kit pak; the rim moves in one frame and stays through an F take, never hidden (R1, R2 of `testcases/TC_conan_quick_loot_rim_instant_2026-11-07.md`, report
`2026-11-07_conan-quick-loot-rim-instant.md`); `krinik_loot_rim` OFF (`[OWNER]` 2026-11-07 10:57 «не нужно её прятать даже на короткий момент»); open: R3 (the last item) and the
owner's eye · before: 🟡 PARTIAL — the jump HIDDEN 2026-11-03 21:52 +03:00 (section `krinik_loot_rim` 0.1.0, cases B2–B5 pass); OWED: the proper, pretty fix (`[OWNER]` 22:18 «там долг на будущее - сделать красиво» · «починить правильно») · **Severity:** S3 visual, filed as a document by the owner's word («это баг, нужно будет испрравить») · **Version/build:** pack ConanExiles
`4aca565`, KrinikConanUI 1.0.0 (kit edit of `W_QuickLootPanel` + `krinik_ui_fixes` hooks on `QuickLootPanel:SlotItemAddedOrRemoved`) · **When/context:**
2026-11-02 09:10 +03:00, the owner's play; recorded in STATUS the same minute, this document 2026-11-02 10:4x
**Fixing:** the next game run of this session, after the hub batch (cases B1–B3 below)

`[OWNER]` «при заборе предмета выделенного в окне квик лута по F на мгновение контур выбора перемещается в последнюю нижнюю правую клетку - некрасиво, он прыгает
туда сюда» · «это баг, нужно будет испрравить» · 2026-11-02 09:10.

`[OWNER]` 2026-11-06 17:48 «выделение в быстром луте прыгает при взятии на F; - ты это частично починил» — confirms the PARTIAL status above; the owed proper fix stands.

## Symptom

In the quick-loot window (`W_QuickLootPanel`, a corpse or a chest), the player selects an item and takes it with F: for a moment the selection rim jumps to
the LAST (bottom-right) cell, then comes back. Expected: the rim stays on the taken cell (or moves straight to its neighbour), no flash.

## Repro

A corpse with ≥ 3 items (`corpse-stand.sh 200`), look at it — the quick-loot window opens; select the first item; press F. Seen by eye; a 60 fps clip is
needed (EXP-0430: a frame series misses a 1–2-frame jump).

## Forensics

**Stand try 2026-11-02 14:09 (failed, recorded for the next one):** `corpse-stand.sh 200` killed a humanoid 192 m away; `corpse-face.lua` (radius 30 m — a copy with 300 m moved the hero there) put the hero ONTO a kappa body (a beast corpse near the spot, 2.0 m); with our camera mod the crosshair aims past the body and the quick-loot window never opened; `SetControlRotation` pitch −40 + a Shift tap barely moved the view. Second try 14:11 (`_G.__cf_dist=400` + pitch −25 + Shift): night (20:20 game time), a live creature (31/31) before the hero, «E Взять» over foliage, no quick-loot window — the stand also needs daytime (time by the remote) and `quiet-stand.lua` with beasts included. Third try 14:12: noon set (`BP_TimeOfDayManager_C:SetTimeOfDay(12.0)`), but a Night Terror (`BP_NightTerrors_*`, 1136 HP) and a wolf stood over the hero — neither `quiet-stand.lua` nor a 15 m `KillCharacter` pass over `BaseBPCombat_C` caught them (0 killed): `quiet-stand.lua` must learn the Night Terrors and beasts first — DONE 14:13 (pack `40db56d`: one pass over live Characters by prefix — humanoids, `BP_NPC_Wildlife_`, `BP_NightTerrors_`; killed 3 Night Terrors and an imp, 0 left). **Working stand 14:14:** noon by the remote, the new `quiet-stand.lua`, `_G.__cf_dist=300` + `corpse-face.lua` + a Shift tap → the quick-loot window «Труп» OPENS (frame `loot4.jpg`: one stack of 6). Next: a corpse with ≥ 3 items (a humanoid), then the 120 fps F take and the control case. Next: stand the hero 3–4 m from a HUMANOID body (filter the corpse class) and aim by the camera-probe point (as `krinik_pickup_prompt` does), check the quick-loot window on a frame before any F. **Desk recon 2026-11-02 14:2x (code, no game):** our two hooks on `QuickLootPanel:SlotItemAddedOrRemoved` — KrinikConanArchery `sync_later(50)` (destroys corpse shafts beyond the arrow count) and KrinikConanUI `krinik_ui_fixes` `on_event` → `align` + `split_prompt` after `RECHECK_MS` (the strip's overlay slot alignment, the prompt split) — call no focus or selection function (`grep SetFocus|Select|Focus` → none); a layout pass could still move the rim, so the control case (both sections off) stays the next step. Candidates: the game rebuilds the grid on `SlotItemAddedOrRemoved` and the focus lands on the last created cell before the selection is restored
(vanilla), or our hook on the same event (`krinik_ui_fixes` — alignment + the corpse line; `KrinikConanArchery` — the arrow sync) disturbs the focus.

**B1 REPRODUCED 2026-11-02 15:19–15:21 (our full build, pack `a848a58`, the game in the background, `testcases/TC_conan_quick_loot_f_take_2026-11-02.md`):**
a beast corpse (Kappa) 2 m before the hero, three stacks put in by `corpse-fill.lua` (iron ×5, bone ×7, a bow); the window opened by a Shift tap; the
selection is made by the WHEEL (`QuickLootCycleSelectionNext = MouseScrollDown`), Shift is «Перейти» (to the inventory); `mouse-seq.ps1 -Seq
"wait:600,wheel:-1,wait:900,kdown:F,wait:80,kup:F,wait:2000"` under ffmpeg `ddagrab` 120 fps (≈ 83 fps effective). Frames (`scratchpad b1e_sheet.webp`, crop
of the whole window): after the take the first stack is gone, the rim stands on the LAST cell of the grid (column 5, row 3, bottom right) for 6 captured frames
(≈ 70 ms), then moves to the first cell — exactly the owner's word. Before the take the rim was on cell 1.
**B2 (control, `KrinikConanUI` and `KrinikConanArchery` Lua `enabled.txt` moved out) NOT DONE — the stand failed four times (15:23–15:26):** a humanoid corpse
made by `corpse-stand.sh 300` + `corpse-face.lua` with `_G.__cf_radius` (new) lay beside a rug; `corpse-aim.lua` (new: `FindLookAtRotation` from the camera to the
body's bone `b_pelvis` — the skeleton's names are `b_root`, `b_pelvis`, …) put the crosshair on the legs, the window did not open; then an imp walked in
(interference), and after `quiet-stand.lua` the nearest corpse was the imp's. Next: B2 with the B1 stand exactly (a BEAST corpse right by the hero: quiet-stand
first, then corpse-face with the default radius, corpse-aim, Shift), the Lua out, the same sequence; then the kit `W_QuickLootPanel` edit out if the Lua is not it.
Stand tools added: `_config/corpse-aim.lua`, `_config/corpse-fill.lua`, `corpse-face.lua` `_G.__cf_radius` and `_G.__cf_body`.

**B2 try 2026-11-03 19:22–19:34 (both Lua sections out, the owner's working game, pack `d457db7`) — NOT RUN: the quick-loot window never opened.**
Stand path, so the next try starts from the end: the live save stood in Iruk city (a living cook under the crosshair — `quiet-stand.lua` does not count city
NPCs, and kills respawning townsfolk); `exec TeleportPlayer x y z` does nothing (the reply «ok», the hero stays) — `p:K2_TeleportTo({X,Y,Z},{…})` moves him;
the ostrich-nest canyon (−61703, 268654) is a crevice — `corpse-face.lua` (always EAST of the body) put the hero inside the cliff; **the open stand is the
oasis beach (−78166, 245999, teleport z −15000, he lands at −20073)**: `quiet-stand.lua` leaves a Kappa corpse on the grass; `corpse-face.lua` with
`_G.__cf_dist=300` there gives a first-person view of the body; the new `_config/corpse-approach.lua` puts the hero on HIS OWN side of the body
(`[NOT-TESTED]` beyond this stand); `corpse-aim.lua` does not converge (pitch −88 / −77 / −54 / −82 over four calls — the camera swings with the rotation).
With the crosshair ON the Kappa's head (frame st13), the game IN FRONT (a 120 fps `ddagrab` capture by the new `_config/loot-take-clip.sh`: Shift tap,
wheel, F) — no corpse strip and no quick-loot window in any frame; the F took nothing (13 items left in each of three corpses).
**Open question this raises:** in B1 (2026-11-02, our build) the same Shift-tap recipe opened the window — so either the window needs something of
`KrinikConanUI`'s Lua (unlikely: `krinik_ui_fixes` only aligns), or the 11-02 stand differed (third person?). Next: run the SAME stand with our build ON
first (if the window opens there and not with the Lua out, that difference is itself the finding); desk read of `W_QuickLootPanel` /
`UpdateHighlightTarget` bytecode in parallel.

**The cause, read 2026-11-03 20:39–20:45 (the owner's own F takes in our running game, `_config/quickloot-trace.lua` — post-hooks on the panel's native
slots, «[QLT]» lines in UE4SS.log):** one F take = `SlotItemSelectionChanged` ×3 → `SlotItemAddedOrRemoved` → `SlotItemSelectionChanged` ×4 →
`SlotItemAddedOrRemoved`, all within 2 ms (one frame): the grid is rebuilt and the selection walks the cells, ending on the LAST one; the rim is drawn there
until the next update. All of it is NATIVE (`QuickLootPanel`, `InventoryGridViewBase` — `W_QuickLootPanel` has no blueprint functions at all).
Native levers found: panel `SlotCycleSelectionNext` / `SlotCycleSelectionPrev` (no parameters), `SlotNavigateUp/Down`, `SlotItemSelectionChanged(Item)`,
`SlotItemAddedOrRemoved(otherIndex)`; grid `GetSelectedIndex() → VirtualIndex`, `SelectItem(VirtualIndex Index, bool Force)` — `VirtualIndex` exposes NO
reflected fields: Lua gets an empty table back and `SelectItem({}, true)` only cleared the selection (frame sel12) — not usable.
**Probe now in the running game** (remote hook, not shipped): post-hook `SlotItemAddedOrRemoved` → `SlotCycleSelectionNext(); SlotCycleSelectionPrev()` in the
same frame — FAILED: the owner saw the rim jump with it (20:52). If it does not hold the rim: track the selected position ourselves (SetActor → 0,
Next/Prev ±1) and after the rebuild step back to it with the same two calls.
**Stand facts of the same hour:** with BOTH our Lua sections out the quick-loot window was NOT SEEN on any stand of the evening — but those stands aimed without the Shift tap that wakes
the idle camera (game map), so the aim itself may have failed; B2 is open, not «not runnable»; a strip opened by code (`strip-open.sh`) shows the window but takes NO input (F, wheel do nothing — it is our own instance); `_config/aim-sweep.lua`
(steps the view and stops when the GAME shows the strip) needs the game to hold the focus for the whole sweep (`NOT-TESTED`: two «miss» runs while the focus
had returned to VS Code).

## Hypotheses (ranked)

1. Vanilla: the panel re-creates its slots and the newest slot takes the focus for a frame.
2. Ours: a handler on `SlotItemAddedOrRemoved` (alignment / `SetVisibility` / the arrow sync) triggers a re-layout that moves the focus.

## Fix plan

1. Cases B1 (the jump on a 60 fps clip, our build), B2 (control: `krinik_ui_fixes` and the archery section off — HOUSE_RULES rule 24), B3 (after the fix).
2. Ours → fix our handler; vanilla → find the focus call in `W_QuickLootPanel` (kit) and keep the selection natively.

## Stand attempts (2026-11-02 11:12–11:15)

- `corpse-stand.sh 200` + the new `_config/corpse-face.lua` (the hero 150 cm from the corpse body, facing it — the body found as the corpse's first
  `SkeletalMeshComponent`, `Corpse_C` has no `Mesh` field). Two tries spoiled: (1) the game crashed at the kill — my own particle birth-watch probe was armed
  (EXP-0443; the control kill without it lived); (2) a live crocodile attacked the hero and no corpse was in view (the body read 21 m from where the hero
  was put — the face stand is `[NOT-TESTED]`). Next: a stand away from the oasis crocodiles (kill or freeze them first — `KillCharacter` on
  `BP_NPC_Wildlife_Crocodile_C`, read the nearest by name), check the corpse body place on a frame, then the 60 fps clip of an F take.

## The mechanism, measured 2026-11-03 21:09–21:17 (trace `_config/quickloot-rim-trace.lua`, 120 fps clips)

The grid of `W_QuickLootPanel` is `InventoryGridView_C` (6 × 3, `m_HideEmptySlots` true) → `SizeBox` → `ScrollBox` → `InventoryBox` → CanvasPanel `ItemGrid` with
18 POOLED `InventoryGridSlotView_C` cells (pools `m_GridSlotViewPool`, `m_ItemIconViewPool`); a rebuild re-places the cells, so their canvas order is not their
place on screen (`Slot:GetPosition()` — steps of 100). The rim is each cell's own `SelectIndicator` (a Border, visibility HitTestInvisible 3) whose RENDER
OPACITY the cell's widget animation `AnimSelect` (0.3 s) drives. After an F take the walk's last cell keeps opacity 1.00 with its `AnimSelect` «playing» at
0.300 for ≈ 250 ms while the right cell has none; then the rim lands on the right cell (the item that slid into the taken place, or the previous one when the
last item is taken). Control B2 (both our Lua sections out): the same jump — the game's C++, not ours.

## The fix (2026-11-03 21:3x, the owner's way)

`[OWNER]` 2026-11-03 21:26 «до взятия рамка стоит на первом предмете, или на том, который колесом мыши выделят. После взятия стоит на том. который подъезжает в
клетку» · «мерцает рамка переносом в нижнюю правую - можно нахуй просто её делать невидимой на время мерцания?». The new section
`ConanExiles/_unpacked/KrinikConanUI/ue4ss/Scripts/krinik_loot_rim.lua` (in `main.lua` SECTIONS): the rim's place is read one tick after every
`SlotItemSelectionChanged` (never inside a take, no param read); on a take (`SlotItemAddedOrRemoved`) every other cell's rim Border is Hidden at both slot
calls and one tick later, for 350 ms, then given back, and the place is read again. Seen: B3 (a middle cell), B4 (the last item of the row), B5 (after a
normal start) — no frame with the rim on another cell; the rim is absent ≈ 0.3–0.4 s, then lights on its place. Report
`testcases/reports/2026-11-03_conan-quick-loot-rim-hold.md`. The failed probe of 20:4x (next + prev after the rebuild) was a remote hook, never shipped.

TWINS: searched `SlotItemAddedOrRemoved|AnimSelect|SelectIndicator` in the pack's Lua (`grep -rln … --include=*.lua _unpacked _config`) — found 2 other
sites: `KrinikConanArchery/…/main.lua` and `krinik_ui_fixes.lua`, both hook the slot for other work (the arrow sync, the strip alignment) and touch no rim.
The same pooled cell class `InventoryGridSlotView_C` serves 79 widgets (the inventory, chests, the hotbar, the siege payload): whether a take or a move
there walks the selection the same way is NOT checked — no owner remark about them so far.

Hygiene: none (Lua, no unit tests). Functional run: B2–B5 in the live game, real wheel and F, 120 fps clips read frame by frame.

## The owner's verdict (live demo 2026-11-03 22:18)

`[OWNER]` 22:18 «я сам взял» · «вижу, починила, хотя и некрасиво» · «пока сойдёт». Accepted for now; the ugly part is the ≈ 0.3–0.4 s with NO rim after a take.
Way for later `[AI]`: light the kept cell's rim at once (its `SelectIndicator` opacity, or its `AnimSelect` jumped to the end) while the other rims are hidden —
not tried; listed in STATUS «Where to continue».

## Decisions made without the owner

- `[AI]` A new section `krinik_loot_rim` instead of more code in `krinik_ui_fixes`: one purpose, and the remote can load it hot without doubling the
  other section's hooks.
- `[AI]` HOLD_MS 350 (the animation's 0.3 s + a frame) — the stuck rim was measured 246 ms; shorter would risk the last frames of the stuck rim.
- `[AI]` The right cell's rim is not forced on during the hold: it lights when the game lights it (≈ 0.3–0.4 s without a rim) — the owner's own «невидимой на
  время мерцания»; lighting it at once would mean driving the game's animation (not tried).
- `[AI]` HOUSE_RULES rule 24 (no compensating patches): the cause is C++ of the game (B2), no asset or blueprint holds the walk; the owner named this way
  himself — recorded here, not asked again.

## Links

`games/ConanExiles/mods/KrinikConanUI.md` (the kit's `W_QuickLootPanel` row, `krinik_ui_fixes`), `KrinikConanArchery.md` (the loot sync), EXP-0430.
