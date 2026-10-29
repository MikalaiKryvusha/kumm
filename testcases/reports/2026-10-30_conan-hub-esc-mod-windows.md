# Test run report — Esc on a mod window over the hub closes only that window (fishing panel, Hosav's settings)

**Created:** 2026-10-30 00:12 +03:00 · **Run by:** the agent (Claude Opus 5.5) ·
**Version/build:** Conan Exiles 3.0.1 (CL-379176) + the Conan build; `JaarFishing.pak` KRINIK MODIFIED with `DT_Fishing_UIModule` (built 2026-10-29 23:47),
`UIMod_Hosav.pak` KRINIK MODIFIED with `UIModuleTable_UIH`, `DT_UIModuleTable_HosavNew` and the `W_UI_SettingsButton` bool (built 2026-10-30 00:01),
`KrinikPauseGameInMenu` 0.11.0 (Esc of mod windows, all-instances fix 00:08)

## 1. Work

The owner's item: Esc in «Настройка рыбалки» or «Настройки интерфейса» closed the whole hub; it must close only that window. Cases —
`testcases/TC_conan_hub_esc_closes_mod_window_only_2026-10-29.md` (E1–E10 + the watched clip).

## 2. Contour

The live game `D:\Games\Conan Exiles 3.0.1` on the owner's save, hero in the world, 4K full screen, the game in front (owner's word 2026-10-29 ≈23:43); real
input (Tab, clicks, Esc); frames by `capture-window.ps1`; the clip by ffmpeg gdigrab. Machine lock `kumm` taken 23:48, released 00:12.
REAL WORLD: accumulated — the owner's save and his settings of Hosav and Exiles Fishing; data and machine — his save, his machine; path — the hub by Tab and the
two bottom-bar buttons, the way he opens them — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-29 23:48 +03:00 | `launch-bg.ps1 -HoldSec 0` · `enter-world-remote.sh` · Tab · click fishing · Esc · click Hosav | first paks: fishing over the hub but Esc does nothing; Hosav click closes the hub |
| 2 | 2026-10-29 23:5x +03:00 | `pult.sh "call W_EFT_Panel_C_… TryCloseWindow"`; `pult.sh 'lua … ActivateModule(FName("HosavUIsettings"), true, false)'`; `… ActivateModule(FName("CharacterInventory"), true, false)` | TryCloseWindow closes the panel, hub stays; Hosav alone opens over the hub; re-activating the open hub is harmless |
| 3 | 2026-10-30 00:06 +03:00 | relaunch with Hosav pak 2 + Lua 0.11.0; `seq.ps1 'key:0x09','click:974,2086','key:0x1B','key:0x1B'` and the Hosav twin `click:356,2086` | E1–E6 pass; the third sequence (00:08) — second panel open ignored Esc (stale instance) |
| 4 | 2026-10-30 00:09 +03:00 | relaunch with the all-instances fix; `seq.ps1` E9 (3 × fishing, 3 × Hosav), E10 (own close buttons), the 60 fps clip | all pass |

## 4. Checks

Hygiene: `check-lua-game-thread.py` — 0 worker-thread calls; `patch-mod-asset.py` guards (JSON round trip, to-zen byte-for-byte control, rows after write and in
the zen chunk) green on both builds; `kismet-trace.py` on the built button: token №4 after `Name CharacterInventory` is `True`, the other 12 bool tokens unchanged.
Functional run: walked the hub → mod window → Esc → hub → Esc → world path by real input on the live game, read the frames (2×2 and 3×2 sheets), the module and
«Esc:» lines of `UE4SS.log`, and the 9 s clip.

- E1 pass · E2 pass · E3 pass · E4 pass · E5 pass · E6 pass · E7 skipped (no pending perk choice; the vanilla behaviour is the asset basis) · E8 pass · E9 pass · E10 pass · clip pass.

## 5. Found

- The live Hosav row is in `UIModuleTable_UIH` (`HosavUIsettings`), not only in `DT_UIModuleTable_HosavNew` — the first pak edited the twin only.
- Hosav's own button deactivated the hub (`ActivateModule('CharacterInventory', False)`) before opening its window — fixed in bytecode.
- A Modal mod window without an Escape-shortcut button swallows Esc — closed by `KrinikPauseGameInMenu` 0.11.0 via `TryCloseWindow`.
- The game creates a new window instance per open; `FindFirstOf` returned the closed one — fixed (all instances, the open one).

## 6. Traces

Scratchpad of session 075c1f98: `s1_hub…s4_esc2.jpg`, `seqA.jpg`, `seqH.jpg`, `seqR.jpg`, `seqK.jpg`, `esc_clip.mp4`, `esc_sheet.jpg`; `UE4SS.log` lines
2026-10-30 00:06:50–00:11:32 (quoted in the case file).

## 7. Verdict

pass — every run case passed on the live game by the player's path; E7 skipped with its reason. The owner's eye pending.
