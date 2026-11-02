# Test run report — the four other Xevyr pages in the hub (plan 40.3 I6.3)

**Created:** 2026-11-02 07:55 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles `a26185f` + the I6.3 edits (Lua `AUTHORS`, kit pages, `keep_order`, `show_page`); kit pak 10 583 661 B

## 1. Work

Cases X1–X8 of `testcases/TC_conan_hub_rows_audit_2026-11-01.md` (section «The other four Xevyr pages»): pages Al-Merayah Reborn, Lore & Loot Highlight,
Proximity Party, Simple Minimap beside The Damage Meter; basis — recon `researches/conan-mod-settings-hub/xevyr-settings-recon.md` §2–§5.

## 2. Contour

Kit `F:\CEUE5Devkit` (active mod KrinikConanUI): `kit-krinik-modsettings.py` twice + `kit-buildmod.py`; the game Conan Exiles 3.0.1 in front, the oasis save;
machine lock `kumm` 07:43–07:55.

## 3. Runs

- 2026-11-02 07:44–07:50 `bash scratchpad/kit_rebuild.sh` (pass 1 exit 1 — the expected «did not get a GUID» ensures for the new widgets; pass 2 exit 0, «SC_KrinikMods /
  WS_KrinikPages: re-ordered to PAGES», 0 GUID errors; build exit 0) → the pak copied into `_unpacked/KrinikConanUI/` → `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`.
- 07:50 `launch-fg.ps1` → `enter-world-remote.sh` (26 s) → `bash pult.sh "lua return dofile('…/xevyr_probe.lua')"` → the hub opened by `KrinikHubRequest` →
  `capture-window.ps1 -Width 3840`; real clicks on the list names `mouse-seq.ps1 -Seq "move:0.26/<y>,lclick"`; the sliders set by the remote, «Сохранить» by a
  real click (`move:0.601/0.868`); the probe after each save; 07:55 `close-game.ps1`, lock released.

## 4. Checks

Hygiene: `luac -p`, `check-lua-shadow.py` (0), `check-lua-game-thread.py` (0); the kit report `ok`.
Functional run: the live game, the window READ on 4K frames and the mods READ by the remote after each real «Сохранить». X1 pass — five names alphabetical,
each page its own rows; X2 pass — every row = the mod's value; X3 pass — PrP slot and component 3000; X4 pass — SM slot 0.70, the minimap smaller on the frame
pair; X5 pass — LLH slot created, 0.5 in slot and component; X6 pass — AMR battlement 40, bailey 20, counter size 5 (the argument order confirmed); X7 pass —
a save without changes writes no mod; X8 pass — the defaults back, no author window left behind ours.

## 5. Found

- Fixed before the run: the kit appends pages it creates after the reused ones (`widget()` reuses by name) — the switcher index would have shown another mod's
  rows; now the kit re-orders to PAGES on the second pass and Lua shows a page by its widget.
- Learned: Proximity Party's `SaveSetting` reads its sliders (no window field needed); Simple Minimap's fields set too; AMR controller field names = the RPC
  argument names (`spawnKatana`, …).
- Defects: none in the run.

## 6. Traces

Session scratchpad `hub/x1_amr.jpg`, `x1_sheet.webp`, `x4_pair.webp`, `x8_after.webp`; kit logs `kit_pass1.log`, `kit_pass2.log`, `kit_build.log`; `UE4SS.log` lines
«amr: ServerSaveSettings sent», «llh: applied by UpdateSettings, slot LLH_Settings saved: true», «prp / sm: saved through the author's window» (07:53:32),
«… unchanged — the mod is not written» ×5 (07:54:08).

## 7. Verdict

pass.
