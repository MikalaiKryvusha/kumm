# Test run report — judge rounds 5 and 6: the launcher's state list repaint, the log pid, the mods button's old-window widgets, the release tools

**Created:** 2026-11-20 15:13 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack `e8a431c` (fixes), `648735a` (release tools); launcher 1.0.0,
build 0.9.1-RC1, game 3.1.1 (CL-383549)

## 1. Work

The fixes of judge round 5 (on `7c72d78..HEAD`) and round 6 (on the round-5 fixes): (1) `StatePanel.Set` requests the list's repaint on any content change
(a same-shape screen change left the old text); (2) every launcher log line carries `[pid]` and the stand's `perf` judges the launcher under test only;
(3) `krinik_mods_button` forgets the widgets of an inventory window that is gone (found by full name among the live `CraftingGUI_C`), never calling them;
(4) the release tools: `dash_lint.py` skips C# char literals, the guide PDF's dash gate checks the guide. Basis: the judges' findings (quoted in the pack commit
`e8a431c`), cases D7b and P· of `ConanExiles/_config/launcher/test/self.mjs`, cases G1–G5 of `testcases/TC_conan_keybinds_to_game_events_2026-11-18.md`.

## 2. Contour

The launcher stand (`self.mjs`, bundle `KUMM/.work/launcher_r3/st.json`, 288 dpi, the window off-screen); exes built by `make_variant.py`:
`KUMM/.work/launcher_r7/build` (the fix), `KUMM/.work/launcher_r7/control` (the fix with the ONE pre-fix line in `Set`), `KUMM/.work/launcher_r6/build`
(fb4b797). The working game `D:\Games\Conan Exiles 3.1.1` with KrinikConanUI deployed by `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` (114 / 0), the
owner's world save, the game driven by the remote `KrinikAgentRemote`; the machine lock `kumm`.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-20 14:38–14:43 +03:00 | `node self.mjs offline <work> launcher_r7/{build,control}/KrinikConanLauncher.exe --stand st.json` (four check versions) | the check itself fixed three times (see Found); final: build PASS, control FAIL D7b |
| 2 | 2026-11-20 14:45–14:52 +03:00 | `EXE=…/launcher_r7/build/KrinikConanLauncher.exe TAG=r7 CASES="… perf offline lang" bash launcher_r3/batch.sh` | 366 PASS, 0 FAIL |
| 3 | 2026-11-20 14:52–14:56 +03:00 | `launch-fg.ps1` · `enter-world-remote.sh` · `pult.sh "lua …ActivateModule(FName('CharacterInventory'), true/false…)"` · Esc menu + `W_IngameMenu_C:CloseAndReturnToMainMenu` | G1 PASS; the return to the menu CRASHED the game (the window was minimized by the agent) |
| 4 | 2026-11-20 15:06 +03:00 | `node self.mjs perf …/build …`, `offline …/build …`, `offline …/control …` (after round 6) | perf ALL PASS (P· pid 37620); offline build ALL PASS; control FAIL D7b |
| 5 | 2026-11-20 15:06–15:08 +03:00 | `launch-bg.ps1` · `enter-world-remote.sh` · `pult.sh` hub open → `SetCarouselIndex(1)` → `SetCarouselIndex(0)` → close → Esc menu → return to menu → `enter-world-remote.sh` → hub open / close | PASS (lines quoted in Checks) |
| 6 | 2026-11-20 15:11 +03:00 | `python dash_lint.py --only _config/launcher/KrinikConanGames.cs` (HEAD lint and the fixed one) | HEAD: 7 hits; fixed: 0 |

## 4. Checks

Hygiene: `luac -p` on the three Lua files; `node --check self.mjs`; the launcher compiled by `make_variant.py`; `check-lua-game-thread.py _unpacked/KrinikConanUI` —
0 worker-thread calls.
Functional run: the launcher walked by the stand's player path (the full batch, 25 cases) and the game by the remote on the player's hub path, the logs READ:

- D7b — PASS on the fix («a StatePanel.Invalidate mark between the «feed-wait» line and the second «offline» line»), FAIL on the control («no repaint request
  of the list on that switch»): the check fails without the fixed line.
- P· / P0–P3 — PASS, «pid 37620; other pids dropped: none»; P1 293.6 / 66.4 ms; P3 4.5–11 ms.
- G1 — PASS: 14:55:36 «кнопка «Настройки модов» поставлена в нижнюю панель инвентаря (CraftingGUI_C_2147452451)», close without an error.
- The tab switch (judge 6 finding 1) — PASS: 15:07:42.5159 «окно инвентаря …CraftingGUI_C_2147455… закрыто игрой: виджеты в нём забыты без обращения к ним»,
  15:07:42.5844 «кнопка … поставлена … (CraftingGUI_C_2147441317)».
- G2 (re-entry) — PASS: 15:08:29.6623 «окно инвентаря …CraftingGUI_C_2147441317 закрыто игрой…», 15:08:29.7029 «кнопка … поставлена … (CraftingGUI_C_2147411796)»;
  no Lua error in UE4SS.log over the run.
- G3, G5 (a real click on the list, the neighbours) — NOT RUN: the owner at the keyboard (owner-idle BUSY). G4 — covered by the tab-switch line above (the hide
  call before the new window).

## 5. Found

1. The first D7b passed on the pre-fix exe for three reasons: the start's «offline» comes from «search» (another shape); the off-screen stand window gets no
   WM_PAINT — every paint line was a frame's DrawToBitmap; the screen line is written AFTER the screen's mark. Fixed in the check (EXP-0577).
2. The game crashed at 14:56:45 on the return to the main menu: `D3D12CommandList.cpp:244 E_INVALIDARG` (`Subresource … [8, 8, 1]`), no Lua or Blueprint on
   the stack — a map transition under a MINIMIZED window (the agent minimized it to give the owner his keyboard back). Known class (game map, 2026-10-31);
   the map now names the return to the menu too. The crash report window PID 3344 closed. The rerun on the background path (window behind, not minimized) passed.
3. `dash_lint.py` mis-parsed the C# char literal `'"'` (7 false hits) and the guide PDF gate checked the mod translation tables — both fixed (`648735a`).

## 6. Traces

`KUMM/.work/launcher_r3/batch_r7.txt`; `KUMM/.work/launcher_r7/{c,d,e,f,g,h}_offline*`, `h_perf` (case folders with the launcher logs); the game's
`UE4SS.log` lines above; the crash folder `D:\Games\Conan Exiles 3.1.1\ConanSandbox\Saved\Crashes\UECC-Windows-AC4D488B43FA6FDA3FDCB69271E58900_0000`.

## 7. Verdict

partial — every launcher case passes and the new check is red on the control; the mods button's forget path is seen live on a tab switch and a re-entry;
G3 / G5 (real clicks) are owed until the owner is away from the keyboard.
