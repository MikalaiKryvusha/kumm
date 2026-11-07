# Test run report — KrinikConanLocomotion (melee in a jump), the hub's «dance» on item select, «E Взять» timing

**Created:** 2026-11-07 11:10 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles 3.0.1 build; KrinikConanLocomotion 0.9.0 (new), KrinikConanUI
(`krinik_ui_fixes` 1.6.0, `krinik_pickup_prompt` 100 ms / 0.10 s), KrinikConanArchery without its jump section, KrinikConanGameplay without its Lua half

## 1. Work

Cases M1–M6, D1–D2, P1 of `testcases/TC_conan_locomotion_melee_jump_2026-11-07.md` — the owner's words of 2026-11-07 10:10–10:53 (verbatim in the TC header's sources).

## 2. Contour

The live game on the agent's machine, background path, the owner's oasis save (the agent's to use — HOUSE_RULES rule 6), god on, the machine lock held since
10:16. Game starts 11:00 (all four mods deployed; the game's `ue4ss/Mods/KrinikConanGameplay` removed file by file) and 11:06 (the take-off combo reset).
REAL WORLD: accumulated — the owner's save; data and machine — his game folder; path — the hero's own input events and real mouse clicks on the hub (the game
brought forward for each click and the owner's window restored); NOT his keyboard / mouse for swings and shots.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-07 10:44 +03:00 | `bash pult.sh "lua _G.__aap = { jump = false … }; return dofile('…/_config/air-attack-probe.lua')"` (×2) | 0 · ground swings by the remote work |
| 2 | 2026-11-07 10:45 +03:00 | the same with `jump = true` (control), then `exit8 = true` | 0 · refused in the air; with substate 8 left — swings, arc unchanged |
| 3 | 2026-11-07 10:46 +03:00 | `jump-mid-swing-probe.lua` without / with `launch` | 0 · the game waits for the swing's end; launch works (not shipped for melee — the owner 10:47) |
| 4 | 2026-11-07 10:52–10:57 +03:00 | real clicks `mouse-seq.ps1 -Seq "move:0.257/0.426,…"` / `"move:0.525/0.85,…"`, `capture-window.ps1 -Width 3840`, remote `SetHeightOverride(1082)` | D1 fail before; live A/B shift → 0 |
| 5 | 2026-11-07 11:03 +03:00 | `bash pult.sh "lua return dofile('…/_config/air-swing-twice.lua')"` | 0 · `light_c0` in the air, `c1` after landing |
| 6 | 2026-11-07 11:04 +03:00 | the two clicks again + whole-screen diff | D2 pass |
| 7 | 2026-11-07 11:05 +03:00 | `stone-stand.lua` + `pickup-away-probe.lua` ×3 | P1 pass |
| 8 | 2026-11-07 11:08 +03:00 | `combo-then-air.lua` ×2 | M3 pass |
| 9 | 2026-11-07 11:09 +03:00 | `exec SpawnItem 51405 1`, slot 3 event, `air-attack-probe.lua` jump / ground | M5 pass; M6 skipped (the remote's LMB shoots nothing with the bow) |

## 4. Checks

- Hygiene: `modpack.json` parsed (79 mods); `Deploy-ModPack.ps1 -Deploy -Only <each>` verify 112 present, 0 missing.
- Functional run: the live game — the hero's montage, movement mode and height READ per tick by probes; `UE4SS.log` READ (sections loaded, hooks set, the
  per-jump lines); whole-screen 4K frames READ by eye and by a diff (D1, D2); the plate's opacity READ per tick (P1). Not walked: real swings / shots by the
  owner's keys and mouse; the bow's shot in the air (M6).

## 5. Found

- The hub's middle scaled with the selected item (ScaleBox ScaleToFit over a content height that followed the item's description) — fixed at the window's birth.
- A hook on `ComboWindowOpen` never fires for the player's swings — removed; the combo is reset at take-off instead.
- The remote's LMB event does not shoot the bow (the bow fires by RMB hold) — the bow's air shot stays a real-input case.
- The swing montages are vanilla this session (`AM_combat_2h_sword_primary_light_c*`) and Immersive Warriors' (`DGS_Combo*`) in the 10:35 session — which one the
  game uses is not settled.

## 6. Traces

`UE4SS.log` lines `[KrinikConanLocomotion:AirCombat]`, `[KrinikConanUI:UIFixes] loaded 1.6.0`; frames in the session scratchpad (`sel_stone.jpg`, `sel_krom.jpg`,
`cmp_full_diff.webp`, `fix_diff.webp`, `h2_a.jpg`, `h2_b.jpg`, `h2_diff.webp`, `h2_dur.webp`); probes under `ConanExiles/_config/`.

## 7. Verdict

partial — melee in a jump, the hub dance and «E Взять» pass on the paths walked; the bow's air shot (M6) and the owner's real keys are open.
