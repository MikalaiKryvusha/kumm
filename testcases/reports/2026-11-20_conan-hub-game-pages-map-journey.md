# Run report — the hub's «Карта» and «Путешествие» on the game's own pages (issues #11, #12, #33; bugs 112, 113)

## Work

The change of `ConanExiles/_unpacked/KrinikConanUI/ue4ss/Scripts/krinik_hub_controller.lua` — `GAME_PAGE` + tab 5 «Путешествие» and tab 8 «Карта» (the game's own
pages instead of our standalone copies) — against the case set `testcases/TC_conan_hub_game_pages_map_journey_2026-11-20.md` (cases J1, M1, N2). The deployed mod
also carries the dialogue change of `krinik_pause_in_menu.lua` (`NO_SLOW_MODULES`), whose case D1 was NOT run.

## Contour

The owner's working game `D:\Games\Conan Exiles 3.1.1` on the 0.9.1-RC1 release build, `KrinikConanUI` redeployed 19:31 (`Deploy-ModPack.ps1 -Deploy -Only
KrinikConanUI`; verify: only the dev-only Music / Harness files missing, as for the release). The owner's world (the heroine, level 24), 3840 × 2160 at 300 %, the
game in front, real mouse and keys by `mouse-seq.ps1`. No god mode, no teleport, no remote command in the run.

## Runs

1. 2026-11-20 19:31 — `powershell -File ConanExiles/_config/launch-fg.ps1` (PID 23688), main menu 19:32:12 (UE4SS log), «Продолжить» `mouse-seq.ps1 -Seq "move:0.104/0.404,…,lclick"`.
2. 19:38 — `J` → the hub on «Путешествие»; a click on the card «Воин» (0.26/0.30); a click on «Начать путешествие» (0.70/0.962).
3. 19:39–19:40 — the tab «Карта» (0.837/0.033); right clicks at (0.32/0.79) and (0.70/0.30), each confirmed by the dialog's «Добавить маркер»; «Сброс маркеров»
   (0.10/0.962) → «Да» (0.50/0.507). A frame after every step by `capture-window.ps1 -Width 1280`.
4. 19:41 — the game closed by its PID 23688 (my run).

## Checks

Hygiene: `loadfile` syntax check of both Lua files — ok.
Functional run: the player's path on the owner's real game (real input, his world), read on frames `KUMM/.work/wg_rc1/run/f04–f14.jpg`:
- J1 PASS — «Путешествие» is the game's own page; «Воин» → the button «Начать путешествие» with the Space badge (the owner's «Начать приключение»); after the click the
  panel says «В Процессе», the card glows as active, the button is gone (frames f05 → f06). On our copy (the owner's play 18:34) the button did nothing.
- M1 PASS — «Карта» is the game's own page: the right click opens the game's «Добавить маркер» dialog; the first marker stands at the click (click 410 / 569 on the
  1280 frame, marker 408 / 570), the second too (click 896 / 216, marker 896 / 215); «Сброс маркеров» asks «Сброс всех маркеров на карте», «Да» removes both
  (frames f09–f14). On our copy (the owner's play 18:38) the first marker landed away, no second, the reset dead.
- N2 PASS — Simple Minimap's row «Shift + мышь: Новый маркер · Свои маркеры» stands on the game's map page (added by the mod itself).
- Not covered: D0 / D1 (no NPC to talk to near the hero); M2 (the full-screen map by its own key); N1 (switch frames, Esc / Tab close on the two tabs); N3 (the five
  other copied tabs); the control on the SAME session — the control is the owner's play of 18:34–18:38 on the copies.

## Found

None new in this run. The map's left click does not add a marker (the game's own design: the right click does — the hint «Добавить маркер» shows the right button).

## Traces

Frames `D:\work\ai_sandbox\KUMM\.work\wg_rc1\run\f01–f14.jpg` (work folder, git-ignored); the UE4SS log of the session in the game folder.

## Verdict

partial — J1, M1, N2 pass by the player's path; D1 and the neighbour cases N1, N3, M2 are owed.
