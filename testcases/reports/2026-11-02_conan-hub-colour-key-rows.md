# Test run report — colour rows, the palette popup and the key capture in the Xevyr hub (plan 40.3 I6.2)

**Created:** 2026-11-02 08:28 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles `983463d` + the I6.2 edits (kit kinds `color` / `color9` / `key`, the palette and busy plates; Lua palette, key watch, adapters); kit paks 10 892 729 B (build 1, 08:10) and 10 896 745 B (build 2, 08:24)

## 1. Work

Cases C1–C9 of `testcases/TC_conan_hub_rows_audit_2026-11-01.md` (section «Colour rows, the palette popup and the key capture»); basis — the owner's
2026-11-02 07:20–07:23 decisions on mockups 8–9 (plan 40 I6.2) and the recon trace of the Damage Meter's SaveSettings.

## 2. Contour

Kit `F:\CEUE5Devkit` (two rebuilds, `scratchpad/kit_rebuild.sh`); Conan Exiles 3.0.1 in front, the oasis save; the hub opened by `KrinikHubRequest`; machine lock
`kumm` 08:05–08:28.

## 3. Runs

- 2026-11-02 08:05–08:10 kit build 1 (pass 1 exit 1 with the expected GUID ensures; pass 2 exit 0 «VB_KrinikPage_llh / _dm: re-ordered to the script»;
  build exit 0) → deploy → 08:10 `launch-fg.ps1` → `enter-world-remote.sh` → `pult.sh "lua return dofile('…/colour_probe.lua')"` → real clicks
  `mouse-seq.ps1 -Seq "move:<x>/<y>,lclick"`, keys `kdown:0x75` / `0x09`, `capture-window.ps1 -Width 3840`; 08:18 `close-game.ps1`.
- 08:19–08:24 the fixes (sRGB names, the chosen rim by the cell brush, the swatch box layout, the save snapshot) → kit build 2 (pass 1 and 2 exit 0, 0 GUID
  errors) → deploy → 08:24 launch → frames of both pages and the open palette → C6 again twice → reset and save → 08:28 `close-game.ps1`, lock released.

## 4. Checks

Hygiene: `luac -p`; no stray globals (`luac -l -l` scan); `check-lua-shadow.py` 0; `check-lua-game-thread.py` 0; kit reports `ok`.
Functional run: the live game, the window READ on 4K frames, the mods READ by the remote after each real «Сохранить». C1 pass (after the second build's look
fixes), C2 pass (the palette over the page, rows in place; the rim fix seen 08:25), C3 pass (Lore & Loot slot and component = the palette's blue), C4 pass
(cancel and a click outside keep the colour), C5 pass (Damage Meter theme = blue, alpha 0.4 by the author), C6 pass (bar 4 written, a second edit after that save
written too), C7 pass (F6 into Simple Minimap's slot; F2 is the game's — refused), C8 partial (refusal and the plate seen for ≈ 5.5 s; the fade itself not
measured — no 60 fps clip), C9 pass (every mod back to its defaults).

## 5. Found

- Fixed: colour names by linear distance (pure red «золото») → by sRGB, «свой цвет» for far colours.
- Fixed: all 16 palette cells rimmed (a transparent `BrushColor` keeps the outline) → only the chosen cell's brush is drawn.
- Fixed: the colour name sat on the swatch box's bottom edge (padding on all sides) → padding at the sides, the swatch 10 high centred.
- Fixed: the second edit of a nine-colour row after a save was lost («dm unchanged») — the saved values shared the window's live list → `snapshot`.
- Learned: the game binds 90 keys — F2 among them; free for the cursor key: F1, F3–F12, I, U, 9, 0. `mouse-seq.ps1` sends LeftAlt when it brings the game to
  the front — a key selector in waiting catches it (tests press the key in the same call as the click).

## 6. Traces

Session scratchpad `hub/c1_sheet.webp`, `c2_pair.webp`, `c5_open.webp`, `c6_open.webp`, `c7_f6.webp`, `c8_sheet.webp`, `v2_sheet.webp`; kit logs
`kit_pass1/2.log`; `UE4SS.log` lines «palette: … open / → … (not saved)», «llh: applied …», «dm: saved through the author's window», «key sm_key: F2 refused —
the game binds it», «key sm_key → F6 (not saved)», «keys the game binds: 90».

## 7. Verdict

partial — every case passes except C8's fade timing (not measured).
