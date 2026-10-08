# Plan 17 — Medieval Dynasty: a focus-free pilot that walks known game paths by anchors

> **Created:** 2026-10-08 · **Parent:** owner's words in chat 2026-10-08 ≈09:52–09:55: `[OWNER]` «и нужно тебе разрабатывать
> быструю автоматизацию, ала селением по якорям» · «если якори быстро читать не умеешь» · «то на Open CV» · «как я делал с
> симпле мморпг, найдешь в моем GH» · «чтобы ты БЫСТРО умел ходить по уже изученным ранее тобою путям»; and «Ты обязан её
> запускать, перезапускать, загружать, играть, тестироват!» · **Status:** 📐 drafted 2026-10-08 10:38 (autonomous hour);
> not started · **Outbound:** —
>
> Executor steps in English (Languages canon). Recon of the anchors — `researches/medieval-dynasty/game-internals.md`,
> «Load chain of the main menu».

## Goal vector (Achieve)

**Pain.** The agent drives the game by screen coordinates and keys (`tools/route-restart-load.ps1`): every key waits for the
game window to be in front, so while the owner types in VS Code the run stalls or the key lands in his window; the route
loads only «the newest save», and the game autosaves during runs, so each run starts from the previous one's world.

**Where we want to be.** The agent walks known paths by ANCHORS — the game's own widgets and functions called through
UE4SS — with no window focus: «restart → load save <name> → world» in one command, from a FIXED save copy; the eye (screen
grab, OpenCV as a fallback) only confirms.

## Acceptance criteria

1. **Load by name without focus.**
   - Situation. The game is in its main menu; VS Code is in front; a copy of the owner's save exists as slot `Krinik_Ox`.
   - Action. The agent writes `load Krinik_Ox` into the pilot's command file.
   - Result. The world of that save is loaded; no key or click was sent to any window.
   - Check. Bridge `where` prints coordinates within 60 s; the pilot log lists each step with its anchor and a timestamp.
2. **Same start every run.** Two consecutive runs of «restart + load Krinik_Ox» give the same hero position and the same
   positions of the 10 nearest villagers (bridge `snap` / `moved` — 0 m drift at load).
3. **Owner's saves untouched.** sha256 of all owner slots before = after the pilot's runs (the copy slot excepted).

## Steps

- [x] **17.1 Recon the owner's Simple MMORPG automation** — DONE 2026-10-08 10:40: `researches/medieval-dynasty/recon-anchor-pilot.md` (picture anchors + wait/click with confidence lowering, «which of few screens», error states, human call; our primary anchor = UE4SS widget, OpenCV = fallback). — find the repository on the owner's GitHub (`gh repo list
  MikalaiKryvusha`), read how its «paths by anchors» were recorded and replayed; write the lessons to
  `researches/medieval-dynasty/recon-anchor-pilot.md` (anchor: «как я делал с симпле мморпг, найдешь в моем GH»).
- [x] **17.2 Pilot mod `KrinikPilot` v1 (action mod, UE4SS Lua)** — DONE 2026-10-08 10:48 (+ `confirmslot`, `usefn`; stand ALL OK, mutant red). — command file `pilot.txt`, one route per line; steps
  `wait <Class> [sec]`, `call <Class> <Function>`, `set <Class> <Prop> <int|string>`, `pickslot <UserSaveName>` (find the
  `UI_SaveGameSlot_C` row by name in `UI_LoadMenu_C.SB_SaveSlots`, set `SelectedSaveSlot`); each step logged with time and
  result; stand `tools/test-pilot.lua` with a mutant (anchor: «по якорям»).
- [~] **17.3 Route `load <name>`** — 8 of 9 steps by anchors LIVE 10:44–10:48 (menu → slot by name → Solo → «Start game» screen); the «Start game» anchor is open (report `testcases/reports/2026-10-08_md-anchor-pilot.md`). Hints (offline, 10:53): `UI_MapChoosingMenu` carries `Oxbow`/`Valley` and calls `UseFunction` 5×, yet it did not appear within 10 s live; `UI_SessionCodeNewGame_C` is alive but is a row (`ButtonFunction`, `ParentPanel`) — next: a pilot step `buttons` that lists live rows with their `ButtonFunction` and `ParentPanel` class, then `ParentPanel:UseFunction(<that string>)`. Done 10:58: `buttons UI_SessionCodeNewGame_C` → 3 rows `CopyToClipboard`, no parent (bug 30 DONE) — not the «Start game» row; next: `buttons` over the other row classes of the menu (`UI_HorizontalOptionButton_C`, the main menu's own button rows). Done 11:00: `buttons UI_MenuButton_C` → 54 rows, no `ButtonFunction`/`ParentPanel` under these names (TrivialObject) — outline done 11:00: `UI_MenuButton` fields are `ButtonName` (Str), `ParenPanel` (sic, Object), `Text`, `Index`; click = `OnClickedDispatcher` (or `Select`). Next: a pilot step `menubuttons` (ButtonName + Text + ParenPanel name), then `ParenPanel:UseFunction(ButtonName)` or a `Select` + panel `ConfirmAction` for «Start game». **FOUND 11:01 live** (`menubuttons`): row `StartGame` «Начать игру», parent `UI_NewGameConfigurationMenu_C` (inside `UI_NetworkModeSelectingMenu_C`) — the 9th step is `call UI_NewGameConfigurationMenu_C ConfirmAction` or `UseFunction("StartGame")` on it (a step with a string argument). Tried 11:03: `callstr UI_NewGameConfigurationMenu_C UseFunction StartGame` — «ок» (some instance accepted it) but the world did not load; next: pick the instance that is IN the visible `UI_NetworkModeSelectingMenu_C` (its WidgetTree path from `menubuttons`), or `ConfirmAction` on it. — `UI_MainMenu_C:Load` → `pickslot` → `UI_LoadMenu_C:ConfirmSelection` → Solo/Co-op
  panel (its widget is found by recon inside this step) → «Start game» → wait for `BP_PlayerCharacter_C`. Test case file first
  (`testcases/TC_md_anchor_pilot_*.md`).
- [ ] **17.4 Fixed save copy** — copy the owner's chosen save to `Krinik_Ox.sav` + `Krinik_Ox_Label.sav` (only if the menu
  lists custom slot names — check `GetSaveFiles`); never write into the owner's slots.
- [ ] **17.5 Eye fallback** — when an anchor is missing (a widget renamed by a patch), a screen grab + OpenCV template match
  of the button image (anchor: «то на Open CV»); only after 17.3 works.
- [ ] **17.6 Report and judge** — run report in `testcases/reports/`, `/fable-judge`.

## Risks

- **(a)** Calling a UI event out of its normal order can leave the menu half-initialised → each step waits for its widget
  and logs; the coordinate route stays as the fallback.
- **(a)** A custom slot name may not appear in the menu → 17.4 checks first; else use a fixed `SaveSlotN` that the owner
  does not use (ask).
- **(b)** A patch renames widgets → the pilot logs «anchor missing» and stops instead of clicking blind.

## Decisions made without the owner

Filled at closing.
