# Run report — bug 85 recon: how the game closes windows on Esc / Tab, and what a click looks like from Lua

## Work

Cases R1, R2 of `testcases/TC_conan_keybinds_to_game_events_2026-11-18.md` (basis: bug 85 — the five KrinikConanUI key binds; the requirement that every
behaviour they served stays).

## Contour

The build `D:\Games\Conan Exiles 3.1.1` (KrinikConanUI 0.9.1 with its key binds, as shipped), the owner's world save, the game launched by `launch-bg.ps1`
(background, PID 2288) and entered by `enter-world-remote.sh`; the remote `KrinikAgentRemote`; keys posted into the game's window by the new
`ConanExiles/_config/post-key.ps1` (PostMessage — no SendInput, the owner's keyboard and window untouched).

## Runs

2026-11-18 19:34–19:44 +03:00, one game session. Commands:

- `bash pult.sh "lua _G.__cf = {class='/Script/ConanSandbox.WindowRoot', …}; return dofile('…/class-funcs.lua')"` (also GUIModuleController, FLXButtonBase, EscapeStackNode);
- `bash pult.sh "lua _G.__fp = {…}; return dofile('D:/work/ai_sandbox/KUMM/.work/bug85/func-params.lua')"`;
- `bash pult.sh "lua return dofile('D:/work/ai_sandbox/KUMM/.work/bug85/close-hooks-probe.lua')"`;
- `bash pult.sh "lua _G.__tab=0; return dofile('…/hubswitch/open-tab.lua')"`; `powershell -File post-key.ps1 -Key Escape` / `-Key Tab`;
- a loop over 11 list modules: `ActivateModule(<m>, true)` → `post-key.ps1 -Key Escape` → `IsModuleActive(<m>)`, `#m_EscapeStack`, `IsFullscreenGUIActive()`;
- the game closed by `powershell -File close-game.ps1 -GamePid 2288` (5.7 s, no crash reporter).

## Checks

Hygiene: none (recon; no code of the build changed in this run).
Functional run: the real game in the background (the build of 3.1.1, the owner's world) — the game's own path read by the remote while keys were posted into its window.

  - R1 — pass: the functions and delegates listed (bug 85 section «2026-11-18 19:3x–19:4x»).
  - R2 — pass: hub open → 1 escape-stack node; a posted Esc → `WindowRoot:Close(CraftingGUI_C)` + `ActivateModule`, the hub closed, the stack 0; a posted Tab →
    `ActivateModule`, the hub closed; `InventorySettingsPopup` + a posted Esc → the popup closed, the hub stays; our `KrinikModSettings` + a posted Esc → nothing
    (stack 2, the window and the hub open, our UE4SS Esc bind silent — it reads the real keyboard); the census: `SM_UI_Settings`, `NightTerrorsSettings` close
    themselves; `KrinikModSettings`, `AMR_Settings`, `LLH_Settings`, `PrP_Settings`, `DN_UI_Settings`, `EmberlightMasterConfig`, `EAA_Armorsettings`,
    `PIFC_Settings`, `ExilesFishingTuning`, `HosavUIsettings` stay open with the hub; `LBPRWidgetID` — the hub closes, the LBPR window stays active.

## Found

1. Ten mod windows of the list swallow Esc on the game's own path (the owner's EAA report of 19:40 is one of them).
2. LBPR: Esc closes the hub and leaves its window open.
3. The hub controller's Esc / Tab key binds are redundant — its `ActivateModule` hook already sees both closes.

## Traces

The probes in `KUMM/.work/bug85/` (recon only); the remote's replies in the chat of 2026-11-18 19:3x–19:4x; bug 85 section «2026-11-18 19:3x–19:4x».

## Verdict

pass — the recon answered both questions; the fix is designed from it (bug 85 «The fix»).
