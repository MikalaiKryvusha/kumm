# Test run report — Conan hub: fast switching, the minimap row, EoT icons on «Параметры», the «E Взять» backing

**Created:** 2026-11-07 10:39 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles 3.0.1 build (pack before this report's commit); KrinikConanUI with
the controller fix, Era of Trials KRINIK MODIFIED (Delay @2 silenced)

## 1. Work

The owner's four words of 2026-11-07 10:10–10:23 (verbatim in `testcases/TC_conan_hub_fast_switch_2026-11-07.md` and in the mod notes): (1) fast hub tab
switching leaves a tab unopened or empty — cases F1–F7 of that TC; (2) the Era of Trials icons on «Параметры» show late — frames at 0.3 / 1.5 / 5 s;
(3) the Simple Minimap row on «Карта» stands high — frame F7; (4) «E Взять»: the backing under E too, its opacity +10 — a frame at a stone. Plan 48, bug 64 items 15, 17.

## 2. Contour

The live game on the agent's machine, background path (`launch-bg.ps1`), the owner's oasis save (the saves are the agent's — HOUSE_RULES rule 6), world entered
by `enter-world-remote.sh`, god on; the machine lock taken 10:16. Three game starts: before the fix (10:16), with the controller fix (10:20), with the EoT pak
installed (10:35). REAL WORLD: accumulated — the owner's save and settings as he plays them; data and machine — his game folder and his machine; path — the hub
switched by the game's own native functions (index and Next/Prev), NOT his mouse clicks and keys (the game in front was not used).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-07 10:18 +03:00 | `bash pult.sh "lua _G.__fb_cfg = { bursts = 6, seed = 7 }; return dofile('…/hubswitch/fast-burst.lua')"` | 0 · 4 of 6 OK, 2 empty, 8 false closes |
| 2 | 2026-11-07 10:22 +03:00 | the same, after `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` | 0 · 6 of 6 OK |
| 3 | 2026-11-07 10:23 +03:00 | `… bursts = 12, seed = 11 … fast-burst.lua` + `capture-window.ps1 -Width 1920` | 0 · 12 of 12 OK; frame complete |
| 4 | 2026-11-07 10:25 +03:00 | `… bursts = 10, seed = 5 … fast-burst-eq.lua` | 0 · 10 of 10 by a ring of 9 (tool's ring of 4 wrong) |
| 5 | 2026-11-07 10:27 +03:00 | `… bursts = 10, seed = 23 … fast-burst-eq.lua` (ring 9) | 0 · 10 of 10 OK |
| 6 | 2026-11-07 10:29 +03:00 | `SetCarouselIndex(2)` → `(3)`, `capture-window.ps1` at 0.3 / 1.5 / 5 s | EoT icons absent at 0.3 s, present at 1.5 s — the defect seen |
| 7 | 2026-11-07 10:30 +03:00 | remote `SetVerticalAlignment(2)` on our map helper slot + 4K frames before / after | row centred after |
| 8 | 2026-11-07 10:33 +03:00 | new Lua, old EoT pak: «Параметры» frame at 0.3 s, count of `EoT_W_CharInfoMagicDisplay_C` in stats windows | icons at 0.3 s; 2 sets (ours + the mod's late one — pak not yet installed) |
| 9 | 2026-11-07 10:34 +03:00 | `python -I -X utf8 _config/devkit/rebuild-krinik-paks.py --only EraOfTrials --expect-changed EoT_AC_InterfaceInjectorComponent --install` | 0 · 2549 chunks, 1 changed on purpose; Delays read back 1e9→15, 1e9→1060, 0.2→1860, 0.1→2380 |
| 10 | 2026-11-07 10:36 +03:00 | «Параметры» ×4 visits, frame at 0.3 s, the count after each | 1 set every visit, log «вставлены (4–8 мс)» ×4 |
| 11 | 2026-11-07 10:37 +03:00 | «Снаряжение» frame at 0.3 s; «Карта» 4K frame | EoT icons and «Аксессуары» present; minimap row centred |
| 12 | 2026-11-07 10:38 +03:00 | `bash pult.sh "lua return dofile('…/stone-stand.lua')"` + read `HB_KrinikPickup` + 4K frame | plate shown (vis 3, op 1), backing under E and the word |

## 4. Checks

- Hygiene: none beyond the tools' own runs (no unit tests for Lua sections).
- Functional run: the live game in the background — the hub switched by the game's native functions in bursts (38 bursts), every tick's drawn pages READ by the
  probe, `UE4SS.log` READ («хаб закрыт» lines, «значки EoT: вставлены»), frames READ by eye (complete page, EoT icons at 0.3 s on both tabs, the minimap row, the
  «E Взять» plate). Cases: F1 fail (before), F2, F3, F4, F6, F7 pass. Not walked: the owner's real mouse clicks and real E / Q keys (the game in front).

## 5. Found

- The hub's close test fired inside a switch (the old page gone, the newborn not yet recorded) and left an empty hub — fixed (`game_page_in_viewport`).
- Our lazy page builds left a stale «newborn» for the next `OnChildActivated` — fixed (`S.building`).
- The Simple Minimap row's slot was copied from an unplaced helper (VAlign Top) — fixed with the mod's own Left / Center / 0.
- The Era of Trials stats-window Delay 0.1 (→ 1060) under the hub's time 0.03 — silenced in the pak, the icons injected on the portrait's birth.
- The game map's «E/Q from the remote walk 4 tabs only» was false — corrected in the map and plan 48.

## 6. Traces

`UE4SS.log` of the run (lines «[KrinikConanUI:HubController] хаб закрыт», «[KrinikConanUI:PauseGameInMenu] портрет героя в окне характеристик»); frames in the session
scratchpad (`hub_after_burst.webp`, `stats_sheet.webp`, `st2_03_crop.webp`, `map_before_crop.webp`, `map_after_crop.webp`, `map2_crop.webp`, `inv3_crop.webp`,
`pick_crop.webp`); probes `ConanExiles/_config/hubswitch/fast-burst.lua`, `fast-burst-eq.lua`.

## 7. Verdict

pass — for the switch paths walked (the game's native functions by index and by Next/Prev); the owner's mouse and keys in front are the open remainder.
