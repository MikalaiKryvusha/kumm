# Test run report — the hub's left list with few pages (the Xevyr hub's name mid-height)

**Created:** 2026-11-02 07:34 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles `5aa9e0a` + the `fill_window` edit of `krinik_mod_settings.lua`

## 1. Work

The seam seen in case D1 (2026-11-02 00:25): in the Xevyr hub the one mod name stood mid-height in the left list. Cases L0–L2 of
`testcases/TC_conan_hub_rows_audit_2026-11-01.md` (section «The left list of a hub with few pages»).

## 2. Contour

Conan Exiles 3.0.1 (`D:\Games\Conan Exiles 3.0.1`); `KrinikConanUI` deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`; the oasis save, the game
in front (`launch-fg.ps1`), 4K window captures; machine lock `kumm` 07:27–07:33.

## 3. Runs

- 2026-11-02 07:27 `powershell -File launch-fg.ps1` → `bash enter-world-remote.sh` (world 24 s) → after the HUD birth
  `bash pult.sh 'lua ModRef:SetSharedVariable("KrinikHubRequest", "xevyr"); …ActivateModule(FName("KrinikModSettings"), true, false)'` →
  `capture-window.ps1 -Width 3840`; probes `bash pult.sh 'lua …GetWidgetFromName(FName(n)).Slot.VerticalAlignment … GetDesiredSize()'`; the live collapse
  of `HB_KrinikModItem_<cam|ui|arc|mpm|gfx>` by the remote, frame.
- 07:30 `close-game.ps1`; the edit; `luac -p`; deploy; 07:31 `launch-fg.ps1` → `enter-world-remote.sh` → the Xevyr hub (07:32:24) → frame; the hub closed
  and opened without a hub request (07:32:47) → frame; 07:33 `close-game.ps1`, lock released.

## 4. Checks

Hygiene: `luac -p krinik_mod_settings.lua` — OK; deploy verify 108 present, 0 missing.
Functional run: the real game, the hub opened by the remote (the list's Xevyr entry is still a sub-list), the window READ on 4K frames and by widget
numbers. L0 pass — the cause measured: every slot Fill, the list's desired height 214 for one 53-unit name, five Krinik rows visible at 32 each (their
  border collapsed, the row and its hidden bar Image not). L1 pass — after the fix the name stands at the top, level with the page title. L2 pass — the
  Krinik hub's five names from the top as before.

## 5. Found

- Fixed: hidden pages left empty rows in the list (ours, `fill_window`).
- The previous chat's 00:30 «empty window»: the window was opened by the remote during the world load — log «module opened, but no visible
  W_KrinikModSettings_C found» (00:30:37) — so it was never filled; the alignment edit tried then was not the cause.

## 6. Traces

Frames in the session scratchpad `hub/l0_xevyr.jpg`, `l0_live_fix.jpg`, `l1_xevyr.jpg`, `l2_krinik.jpg`; `UE4SS.log` lines «window … opened: filled ok in
11.00 ms» (07:32:24), «… 22.00 ms» (07:32:47).

## 7. Verdict

pass.
