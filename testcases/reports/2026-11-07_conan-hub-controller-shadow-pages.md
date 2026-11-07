# Run report — Conan hub controller: crash cause, v5–v8, the mixed design

## Work

our hub controller (plan 48) — the v4 crash bisect (f), then prototypes v5–v8; basis — plan 48 «Shadow-pages prototype» and the owner's design
(old page until the new one is complete, then one frame; `[OWNER]` 2026-11-06 22:10 and 23:48, verbatim in plan 48); cases — `testcases/TC_conan_hub_shadow_pages_bisect_2026-11-07.md`.

## Contour

Conan Exiles 3.0.1 build (pack `8779e5d` → `aec1471`), background game (`launch-bg.ps1`), world entered by `enter-world-remote.sh`, the hub opened
by the remote; prototypes by a remote `dofile` (not in the build); the machine lock taken for each game.

## Runs


- 2026-11-07 06:27–06:29 — F1/F2: `extra-pages-switch.lua`, our W_Attributes shown, then a touch of all refs → crash 06:29:10 (report window PID 46156 closed).
- 06:32–06:38 — census: `bash pult.sh "lua return dofile('…/hubswitch/page-census.lua')"` every 10 s over 90 s, F1 again, stats + attributes in a clean game.
- 06:42–06:46 — v5: `shadow-pages-v5.lua`, `NextCarouselWindow` ×18, then ×9 with a birth trace.
- 06:47–06:52 — native parents (`ForEachFunction`), `SetInteractionActor` (hero / nil) on our CraftingGUI, the game's attributes page for comparison.
- 06:53–06:56 — v6: `shadow-pages-v6.lua`, ×12 switches; 06:57–07:01 — three-frame and close/open tests of our CraftingGUI; `SetCarouselIndex(4…8)`.
- 07:03–07:08 — v7: `shadow-pages-v7.lua`, `SetCarouselIndex` 1…8, 0, 4, 0, 8, 3 with frames; then `tick-visibility-probe.lua` over 11 switches.
- 07:09–07:10 — v8: `shadow-pages-v8.lua` + the probe over 12 switches.
- 07:17–07:32 — v9 (close/reopen ×3), v10 (lazy build, private bytes over 5 cycles), the Simple Minimap helper on our map.
- 07:34–07:37 — the section in the build: `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanUI`, world entry, the probe, `SetCarouselIndex` ×13, a close by `ActivateModule(CharacterStatsWindow,false)`.

## Checks


- Hygiene: none beyond the remote's own `pcall` results.
- Functional run: the real game in the background, the hub's tab switches by the native carousel calls (`NextCarouselWindow`, `SetCarouselIndex`) — not the
  player's mouse path; READ: the game process alive after every step (`pult.sh` exit 4), `UE4SS.log`, the crash context, frames of every switch (v5, v7 —
  13 frames), the per-tick list of drawn pages (v7, v8).
- F1 pass; F2 fail → cause found (stale ref); V1 (v5) pass — 27 switches, 0 crashes; v6 fail — the hub closed (our inventory window); V7 pass — 13
  switches, every frame the right page complete; T7 partial — 9 of 11 transitions one page per tick, game → game 3–4 ticks bare; T8 (v8) fail.

## Found


- The v4 crash cause: a Lua table of widget refs touched after the game destroyed one of them (EXP-0475; the stale-ref rule in the game map).
- The game keeps ONE stats window and ONE open inventory window: a second of either is killed or closes the hub (v6, v8).
- `ActivateModule(CharacterInventory, false, false)` closes the hub — the game map said only a real Esc could.
- Corrected in the same hour: our W_Attributes was reported «not bound to the hero»; the save really has 0 in every attribute (the game's page shows the same).
- Open: Снаряжение ↔ Параметры by a direct click shows 3–4 ticks of the bare world.

## Traces

frames `f1.jpg`, `v5_1.jpg`, `v5_2.jpg`, `att_bind.jpg`, `att_game.jpg`, `craft_sia.jpg`, `craft_nil.jpg`, `sheet3.jpg`, `sheet_b.jpg`, `sheet_c.jpg`,
`sheet_idx.jpg`, `v7_sheet.jpg` in the session scratchpad (working files, not kept); crash folder `Saved/Crashes/UECC-Windows-8D19…_0000`; the tools in the pack
`_config/hubswitch/` (`page-census.lua`, `shadow-pages-v5…v8.lua`, `tick-visibility-probe.lua`).

## Verdict

partial — the section `krinik_hub_controller` is in the build: one page per tick on 13 of 13 probed transitions, 0 errors, the minimap row on our map; the controller core (v7) holds on all 9 tabs with no crash and shows the old page until the new one on 9 of 11 transitions;
not yet seen: the player's mouse path, a 144 fps recording, the hub's close and re-open with our pages, the mods' embed on our «Карта».
