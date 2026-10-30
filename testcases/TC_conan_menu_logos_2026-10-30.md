# Test cases — Conan: the build's logo and versions in the main menu and the Esc menu (plan 36 W26)

> **Created:** 2026-10-30 · **Parent:** plan 36 W26 (`[OWNER]` 22:39–22:51: main menu — ours right of the game's logo, Esc menu — left; under the
> game's logo 3.0.1, under ours 1.0.0; in the game the version text small)
> **Status:** written 2026-10-30 23:05 +03:00, before the run · frames 23:06–23:29: D1 M1 E1 pass on build 2, V1 pass on build 4 · report `testcases/reports/2026-10-30_conan-menu-logos.md`
> **Outbound:** the owner's eye on the two menu frames

**Basis.** The owner's words above; the trees `_config/devkit/kit-probe-tree.json`; the kit edit `kit-conanui-edit.py` (MENUS block) — ours 421×159
at L 475 T 134 in the main menu, 561×213 at R 601 T 106 in the Esc menu; versions 14 pt Cardo SC, the game's beige.

**Stand.** Background launch (`launch-bg.ps1`), the main menu frame before world entry; the Esc menu by the remote
`ActivateModule(FName('IngameMenu'), true, false)` after `enter-world-remote.sh`; frames `capture-window.ps1 -Width 3840`. Mixer 1 %.

Dimensions: the two menus · the logo pair (overlap, size balance) · the version lines (placement, legibility) · neighbours (the nav column of the
main menu, the Simple Modlist panel and the buttons of the Esc menu). Not covered: 2K/4K windows (UI units, scale-free), a resolution change live.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| D1 | The pak carries both menus and the texture | `mod-overrides.py` | overrides of `W_MainMenu_MainMenu`, `W_IngameMenu`; 8 assets | **pass** 23:04: 8 assets, 7 vanilla overrides incl. both menus; deployed pak hash = built (23:12) |
| M1 | Main menu | launch, frame of the main menu | ours to the right of the game's logo, no overlap, same visual height; «3.0.1» under the game's logo, «1.0.0» under ours, small, centred; the nav column untouched | build 1 23:07 **fail (polish)**: placement right, but «1.0.0» higher than «3.0.1» and 14 pt tinier than the game's «Версия»; build 2 23:14 **pass**: one line, 18 pt. The menu video is not in a background frame (white) |
| E1 | Esc menu | world entry, `ActivateModule IngameMenu`, frame | ours to the left of the game's logo, no overlap; versions under both; buttons and the mod list panel not covered | build 1 23:07 **fail**: ours (561 wide) over the Simple Modlist panel's right edge; build 2 23:15 **pass**: capped to 400×152, a clear gap to the panel, versions on one line |
| V1 | Each version under its own logo, one gap (the owner 23:15) | builds 3–4: frames `m3/e3` 23:21 (ours by the alpha box — «1.0.0» lower: the texture's soft shadow), `m4/e4` 23:29 (by the solid box) | both versions one gap under the visible bottom of their logos | build 3 **fail** (shadow), build 4 **pass** by eye; the 23:21 Esc frame caught the HUD minimap over the menu (opened 2 s after world entry — stand timing, not the edit; 23:29 with 3 s — clean) |
| R1 | Nothing else changed | the corpse strip by `strip-open.sh` (the same pak) | the strip as accepted 22:38 | **skipped**: the strip's widget is untouched by the menu edit (the kit log shows the same WBP_ContainerInfo steps) — not re-framed |
