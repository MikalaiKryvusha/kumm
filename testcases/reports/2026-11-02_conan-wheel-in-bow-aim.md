# Run report — the wheel in the bow aim chooses arrows and keeps the camera (bug 78)

## 1. Work

Bug 78 (`[OWNER]` 2026-11-02 14:22–14:23 «а как выбирать стрелы при натяжении?» · «зум камеры меняется»). Basis:
`testcases/TC_conan_wheel_in_bow_aim_2026-11-02.md` (W0–W6).

## 2. Contour

Conan Exiles 3.0.1, the full build, the oasis save, noon, `quiet-stand.lua`, god on, the bow in hand (`BP_bow_2h_C@Socket_Bow`), iron arrows by
`exec SpawnItem 53612 10`, later bone arrows `exec SpawnItem 51184 400` (several stacks of one kind); the game in the background, real RMB and wheel by ONE
`mouse-seq.ps1` sequence; the in-game recorder `scratchpad/uht/aqs_rec.lua`, counters `scratchpad/uht/aqs_hooks.lua`. Machine lock `kumm` taken 14:31,
released 15:09. New: the translation key row (`dm-fish-ru.tsv`, `Game.locres` via `locres-set-tr.py` key rows), KrinikConanCamera «колесо в прицеле»,
KrinikConanArchery `one_row_per_kind`.

## 3. Runs

- 2026-11-02 14:52–14:53 — W0 (old build): separate `mouse-seq` calls (RMB released between them — the foreground handed back), then one sequence
  `rdown,wait:1200,wheel:-1,wait:600,wheel:-1,wait:600,wheel:1,wait:600,rup` with the recorder.
- 14:53–14:55 — cause hunt: hooks on AQS inputs; `EAA_MC_C:DisableInput` / `EnableInput`; `Default__InputSettings.ActionMappings` read; AQS bytecode
  (`patch-mod-asset.py extract ArrowQuickSwap AQS_Actor_Component` → `uaj exports` → `kismet-trace.py` ExecuteUbergraph / CycleAmmoSelection /
  GetCurrentAmmoInventory); the two `CycleArrow_*` mappings added by the remote (`aqs_map.lua`) and the sequence again.
- 14:56–14:57 — `locres-set-tr.py` with a key row NOT in the source (red, code 3), `--check`, the write, `locres-regress.py`.
- 14:58–15:00 — deploy `KrinikConanCamera` (the owner's `config.lua` copied out and back, SHA-256 460788E9… equal), `KrinikConanRussianTranslation`; restart;
  W1, W2, W3.
- 15:00–15:01 — wheel up ×3 in the aim with counters.
- 15:03–15:08 — deploy `KrinikConanArchery` (`one_row_per_kind`, then with the window rebuild), restarts; W5 (up/up/down, then 400 bone arrows and up ×3);
  W6 frames by `capture-window.ps1` during the hold; the window's row count and the cost by the remote.

## 4. Checks

Hygiene: `luac -p` of the camera and archery `main.lua`; `check-lua-game-thread.py` 0; `check-lua-shadow.py` 0; the locres guard red on a key row absent from the source.
Functional run: the live game by the player's path — real RMB held, real wheel clicks, the values read by an in-game recorder every 100 ms, frames read by eye.
- W0 reproduced — in the aim (`aim=true`) the arm 273 → 299 → 329 → 294, `ActiveAmmo` 51184 throughout.
- W1 pass — after the fix the input settings hold `CycleArrow_UP=MouseScrollUp`, `CycleArrow_UP=Gamepad_DPad_Up`, `CycleArrow_DOWN=MouseScrollDown` — added by
  AQS itself.
- W2 pass — in the aim: ammo 51184 → 53612 → 51184 on two down clicks, the arm 230 with step 0; the camera log «прицел лука: вход — колесо выбирает стрелы, зум стоит».
- W3 pass — out of the aim one click: the arm 230 → 250, step back to 20–23.
- W4 pass — `locres-regress`: 54457 → 54457, lost 0, changed 1 (`D71D7D204737C8044CCD97BC0B6B9301 | Нет -> None`).
- W5 pass — before `one_row_per_kind` wheel up did not change the arrow (`CurrentAmmo` 51184, 51184, 53612: up from index 0 lands on the second bone stack);
  after it: up/up/down → 51184 → 53612 → 51184 → 53612; with 6 stacks (5 bone) up ×3 → 51184 → 53612 → 51184 → 53612 each click; the Archery log
  «стопок 6, видов 2».
- W6 pass — the window: `CreateAmmoWidgets` makes 3 rows per list entry (a wrap ring): 18 rows from the raw 6 stacks, 6 rows after our pass; the frame shows
  «Железная · Костяная (selected) · Железная». Cost of AQS refill + our pass + rebuild: 0.20 ms (20 repeats), once per aim entry.

## 5. Found

- Ours: the build's Russian translated Arrow Quick Swap's service text «None» (the literal of `CheckCustomBindings`, compared with a key's display name) to «Нет»
  through the shared row 3464 of `dm-fish-ru.tsv` — the mod never bound its arrow actions to the wheel in the Russian build. The wheel axis event of AQS is
  empty in its graph; arrows cycle only by `CycleArrow_UP/DOWN`.
- Another mod's input: `EAA_MC_C` has input enabled and eats `MouseWheelAxis` (AQS saw 0 every frame); irrelevant to the fix — AQS does not use the axis.
- The author's: `GetCurrentAmmoInventory` adds one entry per STACK; with two stacks of a kind the cycle stalls on «up» and our «≥ 2 kinds» count was wrong.

## 6. Traces

`D:\Temp\claude\d--work-ai-sandbox-KUMM\aa2bfa46-b5af-4d2d-9a0d-3bfc4132ec45\scratchpad\` — `w6_list_crop.webp`, `w6_list2_crop.webp`, `aqs/`
(the asset JSON, `ug.txt`, `cycle.txt`, `inv.txt`), `uht/aqs_*.lua`; the game's `ue4ss/UE4SS.log` of the 15:07 run.

## 7. Verdict

pass — W0 reproduced, W1–W6 pass.
