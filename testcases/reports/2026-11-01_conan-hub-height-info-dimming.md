# Run report — the hub window: dimming probe, the taller window, the «i» variant 5; the launcher's guide button

## Work

The owner's three remarks on the «Моды Krinik'а» window (2026-11-01 08:42–08:43: no dimming / over the character UI, taller, the «i» still ugly) and the
launcher's «Руководство» button with the guide edits (09:06–09:19). Basis: `testcases/TC_conan_hub_no_dimming_2026-11-01.md` (D1–D4, H1–H2, I1–I2),
`testcases/TC_conan_launcher_guide_button_2026-11-01.md` (L1–L4, G1).

## Contour

Conan Exiles Enhanced 3.0.1 (`D:\Games\Conan Exiles 3.0.1`), the build of pack `ConanExiles` (KrinikConanUI section `krinik_mod_settings.lua` with
`MIN_HEIGHT`; the kit pak rebuilt 09:23–09:25 with the sans-bold «i»), background launch, the owner's save, god on; the launcher exe built by
`build-docs.py` 09:20 and run from a scratch folder with the PDF beside it. Windows 11, the TV 3840×2160.

## Runs

1. 2026-11-01 09:04–09:12 — `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`; `pult.sh "lua … ActivateModule(FName('CharacterInventory'|'ExilesFishingTuning'|'KrinikModSettings'), …)"`;
   `capture-window.ps1 -Width 3840` (D1, D2, D3 with and without our window); `pult.sh "lua … SetHeightOverride(845)"`; `pult.sh "lua return dofile('<i_variants.lua>')"` — eight «i» looks.
2. 2026-11-01 09:13 — `Deploy-ModPack.ps1 -PackDir . -Deploy -Only KrinikConanUI`, a fresh start, the log line of the section read (H1).
3. 2026-11-01 09:20 — `python -X utf8 _config/release/build-docs.py` (PDF + launcher); `KRINIK_LAUNCHER_STATE=fresh|installed KRINIK_LAUNCHER_SNAPSHOT=<file>;384|96` (L1, L2, L4); PyMuPDF text and page renders of the PDF (G1).
4. 2026-11-01 09:21–09:27 — `UnrealEditor-Cmd … -Script=kit-krinik-modsettings.py -ModDevKit -NullRHI` ×2 (exit 0), `kit-buildmod.py KrinikConanUI`, deploy, start,
   the window opened, a 4K frame of the camera page (I1), the log line again (H1).

## Checks

- Hygiene: the kit report `kit-krinik-modsettings.json` ok; `build-docs.py` exit 0; the pak version stamp unchanged (1.0.0).
- Functional run: the live game by the remote and frames read by eye; the launcher's own snapshots read by eye; the PDF read by text and two rendered pages.
- D1 pass · D2 pass · D3 pass (brightness outside the window 149.0/146.9, 97.9/95.8, 113.8/113.0) · D4 skipped (nothing to fix).
- H1 pass (`window height 845 (the tallest live page 575, mockup 5 845)` at 09:13:48 and 09:27:01) · H2 skipped (code read).
- I1 pass (all eight rows the bold upright sans «i») · I2 skipped (needs the owner's screen; the hover target unchanged).
- L1 pass · L2 pass · L3 skipped (a real click opens a PDF window on the owner's screen) · L4 pass · G1 pass.

## Found

- The «dimming» of folder 41 is not a defect of ours: the game's night behind a window opened in the world (minimap clock 05:20).
- The feedback step said «адреса» about the author's links (house rule 22) — fixed in the guide the same run.

## Traces

Frames and sheets — the session scratchpad (`d1_fish_over_inv.webp`, `d2_ours_over_inv.webp`, `d3_pair.webp`, `h845.webp`, `i_variants_sheet.webp`,
`i5_cam.webp`, `lt/l_*.webp`); the owner's review folder `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\42_hub_knopka_i_i_vysota\`; the game log
`ue4ss/UE4SS.log` lines `[KrinikConanUI:ModSettings] window height …`.

## Verdict

partial — every case run passes; H2, I2 and L3 are skipped with the reason named (each needs a real mouse on the owner's screen).
