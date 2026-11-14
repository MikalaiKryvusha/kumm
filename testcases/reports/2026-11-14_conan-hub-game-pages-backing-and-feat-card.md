# Test run report — Conan hub: the backing between the game's two pages (bug 101 item 5), the «Таланты» card and the «Параметры» portrait (items 4, 3)

**Created:** 2026-11-14 15:13 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles 3.1.0 CL 383024, the Krinik build, KrinikConanUI
`krinik_hub_controller.lua` as of pack `fd74729` + the item-5 change (deployed 15:08)

## 1. Work

Bug 101 items 3, 4 and the new item 5 against the owner's goal for the hub (plan 48 G1: every switch one frame, nothing late). Cases: F0 of
`testcases/TC_conan_feat_card_first_frame_2026-11-14.md`; the item-5 change checked by background window capture and a fast-burst run.

## 2. Contour

The owner's world (slot `Game_1`), background launch (`launch-bg.ps1`), god on, the hub opened by the remote; switches by the native
`CarouselWindow:SetCarouselIndex` (the function a tab click reaches); the game window recorded by `gfxcapture` (≈ 40–43 fps, desktop HDR left on — washed frames).
REAL WORLD: accumulated — the owner's world and save of 2026-11-13, his key bindings; data and machine — his PC, his game folder; path — the background twin of a
tab click (remote), NOT his mouse: the real-click path is F4, open.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-14 14:53 +03:00 | `bash pult.sh "lua _G.__fsp_tab=1; return dofile('D:/work/ai_sandbox/ConanExiles/_config/feat-select-probe.lua')"` (Карта → Таланты) | 0 · card at tick 1 = tick 40 |
| 2 | 2026-11-14 14:56 +03:00 | the same probe, tabs 0 then 1 (Снаряжение → Таланты), three times | 0 · card filled at tick 1, empty from tick 2 |
| 3 | 2026-11-14 15:02 +03:00 | the same probe, tabs 3 → 1, 5 → 1 | 0 · card stable on both |
| 4 | 2026-11-14 15:04 +03:00 | `bash hubswitch/hub_run_bg.sh stat1 5 3 5 3 5 3` | 0 · 5 switches, Параметры: late only the waist cloth |
| 5 | 2026-11-14 15:06 +03:00 | `bash hubswitch/hub_run_bg.sh stat2 6 3 0 3 6 3` | 0 · Параметры → Снаряжение 178 ms, bare world 2 frames |
| 6 | 2026-11-14 15:10 +03:00 | `bash hubswitch/hub_run_bg.sh fix5 0 3 0 3 0 3` (after the change) | 0 · no bare-world frame |
| 7 | 2026-11-14 15:11 +03:00 | `bash pult.sh "lua _G.__fb_cfg = { bursts = 6, seed = 11 }; return dofile('…/hubswitch/fast-burst.lua')"` + `_G.__fb.report()` | 0 · 6 / 6 OK |
| 8 | 2026-11-14 15:14 +03:00 | `bash hubswitch/hub_run_bg.sh m_all 0 2 3 7 1 4 6 8 5 0` (7 switches recorded — the clip was too short; fixed in the script) | 0 · first-frame pairs for TC mod elements M1–M7 |
| 9 | 2026-11-14 15:21 +03:00 | `bash hubswitch/hub_run_bg.sh fix5b 0 3 0 3` (after the judge's round-3 branch fix, the game relaunched) | 0 · no bare-world frame |
| 10 | 2026-11-14 15:22 +03:00 | fast burst again, `seed = 23` | 0 · 6 / 6 OK |

## 4. Checks

Hygiene: `luac -p krinik_hub_controller.lua` — syntax ok; the game copy = the source (`cmp`).
Functional run: the hub in the owner's world walked by native tab switches; READ — the probe's `[FSP]` lines in `UE4SS.log` (selection events, card text per
tick), the recordings by `hub_switches.py` (frames per switch, blend, late boxes) and by eye on frame sheets (`portrait_sheet`, `gear_stat_sheet`, `fix5_sheet`).

| Case | Status | Observation |
|---|---|---|
| F0 (item 4) | partial | card stable from Карта, Параметры, Клан; Снаряжение → Таланты: filled at tick 1, empty from tick 2 (the game's inventory page destroyed that tick) |
| item 3 | partial | the hero whole on the first frame from Клан / Спутники; late = the waist cloth settling (+33 … +133 ms); «head first» not reproduced here |
| item 5 before | fail | Параметры → Снаряжение: dark backing → bare world 2 frames (luma 103) → inventory, 178 ms |
| item 5 after | pass | dark backing ≈ 150 ms → inventory, no bare-world frame (frames 3.33–3.52) |
| fast burst | pass | 6 / 6 bursts end on the last target, 0 bare, 0 overlay — before and after the round-3 branch fix |
| item 5 after the round-3 fix | pass | `fix5b.mp4`: Параметры → Снаряжение 40 → 33 → 32 → 49 (dark → inventory), Снаряжение → Параметры 49 → 33 → 40 |
| TC mod elements M1–M7 | pass ×6, partial ×1 (M6 ping) | first frame = frame +0.5 s on Снаряжение, Хар-ки, Параметры, Карта (sheets `m_gear`, `m_attr`, `m_map`, `portrait_sheet`); background twin, not real clicks |
| Снаряжение → Хар-ки | note | `m_all.mp4` 7.567: one intermediate dark frame (blend 0.51, 94 ms at 42 fps) — the game page leaves inside the native switch, our page shows a tick later; at 144 fps by real clicks (`fix3.mp4`) this path was one frame |

## 5. Found

- Bug 101 item 5 (new): the bare world between the game's two pages — fixed in this run.
- Item 4's mechanism: the selection is the shared feat inventory's; the game's inventory teardown clears our kept page's card (bug 101 «Item 4 measured»).

## 6. Traces

Recordings `ConanExiles/_scratch/hubswitch/bg/stat1.mp4`, `stat2.mp4`, `fix5.mp4`; sheets `KUMM/.work/perks/shots/portrait_sheet.webp`, `gear_stat_sheet.webp`,
`fix5_sheet.webp`; `[FSP]` lines in the game's `UE4SS.log` of the 14:52 / 15:08 launches.

## 7. Verdict

partial — item 5's bare-world frames are gone and the fast burst holds; items 3 and 4 measured, not fixed; the real-click path (F4) not run (the owner at the PC).
