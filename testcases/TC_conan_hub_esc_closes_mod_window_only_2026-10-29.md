# TC — Esc on an open mod window («Настройка рыбалки», «Настройки интерфейса») closes only that window, the hub stays (plan 36, W8 tails)

> **Created:** 2026-10-29 · **Parent:** STATUS handover 2026-10-29 22:58 item 1; `[OWNER]` «нужно сразу мод рыбалки закрывать» · 2026-10-29
> **Status:** run 2026-10-30 00:06–00:11 (Hosav pak with the `UIModuleTable_UIH` rows and the button bool, `KrinikPauseGameInMenu` 0.11.0 with the all-instances fix) —
> E1–E6, E8–E10 pass, E7 skipped; waits for the owner's eye. Report `testcases/reports/2026-10-30_conan-hub-esc-mod-windows.md`
> **Outbound:** —

**Basis.** The owner: Esc in the fishing panel or in Hosav's settings closes the whole hub; it must close only the mod window. Recon (2026-10-29 23:4x,
the UI module tables): vanilla popups opened over a hub tab that close alone on Esc — `PerkSelection`, `ThrallBonuses` — are rows with
`Category Modal · FullscreenGUIAction None · CloseOnESC true`, and their own cancel button (`WBP_ButtonBase`, `KeyShortcutName` «Escape») takes the Esc.
The mod rows: `ExilesFishingTuning` = `Fullscreen · None · true` (a second full-screen module), `HosavUIsettings` (Hosav's live table `UIModuleTable_UIH`;
the twin row in `DT_UIModuleTable_HosavNew`) = `Popup · Close · true`; Hosav's button also calls `ActivateModule('CharacterInventory', False)` before its own window.
Fix: (1) both rows → `Modal · None` (`enum:` lines of `patch-mod-asset.py`); (2) Hosav's button bytecode — that `False` → `True` (`bool:` line; re-activating the open hub
is harmless, checked by the remote); (3) the mod windows have no Escape button, so the modal panel swallowed Esc — `KrinikPauseGameInMenu` 0.11.0 catches Esc
(key event) and calls the window's native `TryCloseWindow`.

**Stand.** The owner's save, the hero in the world, 4K, the game in front (the owner's word 2026-10-29 ≈23:43: «в Фореграунд игру открывай для тестов»); wait
for «взведено» of `KrinikPauseGameInMenu` in `UE4SS.log`, then open the hub on «Снаряжение» by a real Tab; clicks and Esc — real input (`input.ps1`, sequence
helper in the scratchpad); frames — `capture-window.ps1`; the clip — `ffmpeg -f gdigrab -framerate 60 -i desktop` (≈14 frames/s effective at 4K).
Techniques: state transitions (hub → mod window → Esc → hub → Esc → world), use case (each button), repetition (a new window instance per open), error guessing
(the window's own close button).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| E1 | Fishing open | hub on «Снаряжение», click «Настройка рыбалки» | the fishing panel opens over the hub; the hub stays drawn under it (or hidden, but alive) | pass 00:06:52 — panel over the hub, hub drawn under it (`s2_fish`) |
| E2 | Fishing Esc | E1, then one Esc | the fishing panel closes; the hub on «Снаряжение» is on screen; the hero is NOT in the world | pass 00:06:53 — log «Esc: окно ExilesFishingTuning закрыто», frame `s3_esc1`: hub on «Снаряжение». Before the Lua part (pak only) Esc did nothing at all — the modal swallowed it |
| E3 | Hub Esc after | E2, then one more Esc | the hub closes; the hero in the world | pass 00:06:55 — `s4_esc2`: world, HUD |
| E4 | Hosav open | hub on «Снаряжение», click «Настройки интерфейса» | Hosav's settings open; the hub does not close at the click | pass 00:07:23 — `h2_hosav`: window over the hub. FAIL on the first pak (only `DT_UIModuleTable_HosavNew` edited): the hub closed at the click — the live row is in `UIModuleTable_UIH`, and the button itself deactivated the hub |
| E5 | Hosav Esc | E4, then one Esc | Hosav's settings close; the hub on «Снаряжение» is on screen | pass 00:07:24 — log «Esc: окно HosavUIsettings закрыто», `h3_esc1` hub; second Esc → world (`h4_esc2`) |
| E6 | Buttons after | E2/E5, look at the bottom bar | both buttons still in the row, clickable again (open once more) | pass — both buttons on every hub frame, reopened in E9 |
| E7 | Control | the vanilla perk selection («Хар-ки» → a perk) and Esc | closes the perk window only — the same behaviour E2/E5 copy | skipped — the vanilla behaviour is the basis taken from the asset data (row + Escape button); the hero had no perk choice pending to open the window by the player's path |
| E8 | Log | the whole run | no new errors in `ConanSandbox.log` / `UE4SS.log`, no crash | pass — no «XCS_Panel: закрыт» between the opens (the hub never closed), only offline-service errors and UE4SS offset lines; three clean exits, no crash reporter |
| E9 | Repeat | open the fishing panel and close it by Esc three times in a row, then the same for Hosav | each Esc closes the window, the hub stays (the game makes a new window instance per open — the closed one lingers) | pass 00:10:04–00:10:21 — six «Esc: окно … закрыто», frames `r1`–`r6` all hub. FAIL on 0.11.0 first cut (00:08): `FindFirstOf` took the lingering closed panel (`open=false`), the second open ignored Esc — fixed to all instances |
| E10 | Own close buttons | the fishing panel's «Закрыть»; Hosav's «Закрыть»; a frame after each | the window closes, the hub stays | pass 00:10:45–00:10:51 — `k1`→`k2` Hosav, `k3`→`k4` fishing |
| Clip | Watched | clip of fishing → Esc → Hosav → Esc | the hub never disappears | pass — `esc_clip.mp4` (9 s, 129 frames), sheet `esc_sheet.jpg`: hub → panel → hub → Hosav → hub |
