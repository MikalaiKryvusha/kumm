# Run report — the colour rectangle, choosers at their field, and the owner's 08:54–09:04 batch (Conan 3.0.1 build)

## 1. Work

The colour rectangle and «a chooser opens at its field» (`[OWNER]` 2026-11-02 08:44–08:45, plan 40 I6.2), the last Xevyr rows D5–D10, and the fixes they found;
the owner's 08:54–09:04 words: the corpse strip smaller with a lighter backing, the places of «E Взять» and the strip (left of the hero, hub rows), 5 checks a
second while «E Взять» shows, Hosav's kill XP line to the centre of the upper half; recon of the bow's full-charge shock wave. Basis — cases R1–R5, D5–D10, N1,
O1, D7b, S1–S4, P1–P3, K1/K1b, W1/W2 of `testcases/TC_conan_hub_rows_audit_2026-11-01.md`.

## 2. Contour

The owner's working game `D:\Games\Conan Exiles 3.0.1` (3.0.1, the build's 64 paks + Lua mods), the oasis save, god on, game in front (`launch-fg.ps1`), 4K
TV; pack ConanExiles from `4aca565` + this session's uncommitted edits; kit pak KrinikConanUI 13 125 661 B (10:35); Hosav's pak rebuilt 10:34 and 10:39.
REAL WORLD: accumulated — the owner's install and live save, his mod slots (DamageMeter, SimpleMinimap, LLH_Settings) written and put back; data and machine —
his; path — the inventory → «Настройки модов» window opened by the remote's shared variable, then real mouse clicks.

## 3. Runs

| # | Moment | Command | Outcome |
|---|---|---|---|
| 1 | 2026-11-02 10:14–10:24 +03:00 | `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI`; `launch-fg.ps1`; `enter-world-remote.sh`; `pult.sh "lua … open_hub.lua"`; `mouse-seq.ps1 -Seq "move:<fx>/<fy>,lclick"`; `capture-window.ps1 -Width 1920/3840` | R1–R5, D5–D7 |
| 2 | 10:21–10:23 | remote probes `layer_probe.lua`, `vol_probe.lua`, `opaque_probe.lua` (hide / recolour the swatch, plate alpha 1 live) | the black block's cause |
| 3 | 10:24–10:26 | `corpse-stand.sh 200`, `strip-open.sh`, `strip_probe.lua` (render scale 0.75, brush alpha 0.8 / 0.55 / 0.35) | review folder 59 |
| 4 | 10:28–10:35 | `kit_all.sh` (kit-conanui-edit, kit-krinik-modsettings ×2, kit-buildmod) | pak 13 125 661 B |
| 5 | 10:34, 10:39 | `rebuild-krinik-paks.py --only UIMod_Hosav` (guard: 1 of 228 chunks = the edit), copied by hand | Hosav pak with `W_Kill_xp` padding |
| 6 | 10:36–10:48 | deploy, `launch-fg.ps1`, `enter-world-remote.sh`; `killxp_pad.lua` (padding 80 / 0 / −258 live); `strip-open.sh` corpse and campfire; `stone-stand.lua`; `hide_timing.lua`; hub rows by real clicks; D7b–D10 | K1, S1, S2, P1–P3, N1, O1, D7b–D10 |
| 7 | 10:47–10:53 | `fx_watch.lua` + `mouse-seq.ps1 -Seq "rdown,…,ldown,wait:2600,lup,…"`; `fx_table.lua`, `fx_scale.lua`, `fx_spawn.lua` | the shock wave found, its table writable; its look not seen |
| 8 | 10:53 | `close-game.ps1` | closed cleanly, no crash window |

## 4. Checks

Hygiene: `luac -p` on the four edited Lua files; `check-lua-shadow.py` 0; the colour names on 16 sRGB samples on the desk (`names_desk.lua`).
Functional run: the hub walked by real clicks in the live game, the mods' save slots read back by the remote, frames read by eye and by pixel values; the strip,
the plate and the XP line read by the remote and on frames.

| Case | Status | Observed |
|---|---|---|
| R1 chooser at its field | pass | the palette at the same place for a click at either edge of the box |
| R2 a pick on the rectangle | partial → N1 | «станет» = the clicked colour (255, 28, 1); the caption read «свой цвет» |
| R3 pale / black / grey, Отмена | pass | (245, 255, 252) / (0, 10, 4) / (130, 130, 130); «palette closed unchanged» |
| R4 no room below | pass | the plate opened above bar 9 |
| R5 the list at its field | pass, seam → O1 | same place; a black block over the red swatch inside the list |
| D7 corner save | fail → D7b | `SetSelectedIndex(Index, SelectInfo)` — the call refused, the author's window left open |
| N1 hue names | pass | «синий», «красный», «синий» on the live rows; 16 desk samples right |
| O1 opaque plates | pass | (10, 11, 13) inside the list over the red swatch |
| D7b, D8, D9, D10 | pass | `RestoreAnchor` 3; `TimetoShow` 2; SM colour (0, 0, 1) α 0.69; all back to the defaults |
| S1 strip 0.75 | pass (superseded) | kit render scale 0.75, alpha 0.8 |
| S2 strip place | fail → fixed | −15 % over the hero's head; −22 % clear |
| P1 «E Взять» place | fail → fixed | −8 % on the bow arm; −14 % clear |
| P2 hub row moves the plate | pass | slot −18.3 / 61.9 = −1 % / 6 % right after «Сохранить» |
| P3 5 checks a second | pass | summaries 12.4 s apart while shown; hidden 322 ms after leaving |
| K1 XP line | fail → fixed | −516 pinned it to the top; live T 80 / 0 / −258 → centre 623 / 539 / 270 of 1080 → −258 |
| S3, S4, K1b, W1, W2 | not run | the next start (kit with 0.70 / 0.6, the Lua rows, Hosav −258, the shock-wave row) |

## 5. Found

1. The 16 muted swatch names fit no colour of the rectangle — a pure red read «свой цвет» (fixed: hue words).
2. A popup plate at alpha 0.98 over a dark-red swatch drew a black block (fixed: plates opaque; EXP-0442).
3. `ComboBoxString:SetSelectedIndex` takes `(Index, SelectInfo)` — the Damage Meter corner was never saved; the failed write left the author's window open
   (fixed both; EXP-0441, `_config/fn-params.lua`).
4. A padding of `W_Kill_xp`'s overlay slot moves the line by the whole value, not half (fixed: −258).
5. The «E Взять» plate appears up to ≈ 14 s late after the hero comes back to stones (the near-slice of 20 components a second) — open, not fixed.
6. The hero keeps every finished `P_bow_powercharge` component attached (4 after four draws) — the game's; not ours, noted.

## 6. Traces

`[KrinikConanUI:ModSettings]`, `[KrinikConanUI:PickupPrompt]`, `[KrinikConanArchery]` lines of `UE4SS.log` 10:14–10:53; frames in the session scratchpad
`r/` (h0–h1, r1a–r5k, o1, n1dm, d9b–d9c, k1–k1c, kp_sheet, s1f–s2g, p1–p2); review folder 59 `plashka_trupa_4_varianta.webp`. Crash-report window: none.

## 7. Verdict

partial — the hub's choosers, the rectangle, the Xevyr rows D5–D10 and the found fixes pass in the live game; the owner's strip size / backing choice, the
final places, Hosav's −258 and the shock-wave row wait for the next start (S3, S4, K1b, W1, W2).
