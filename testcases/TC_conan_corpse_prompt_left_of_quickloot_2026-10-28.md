# Test cases — Conan: the corpse prompt strip moves left of the quick-loot window (bug 64 item 32)

> **Created:** 2026-10-28 · **Basis:** owner 2026-10-27 00:2x (bug 64 item 32) — «словно если открывается этот виджет быстрого лута, то подсказку
> над трупом - нужно на экране двигать левее»; 2026-10-28 19:0x — «нужно будет чинить виджет взаимодействия с поверженным врагом - чтобы есть есть
> окно быстрого лута. то чтобы виджет смещался левее - чтобы он не переккрывал быстрого лута диалог».
> **Contour:** `D:\Games\Conan Exiles 3.0.1`, the agent's own run; vanilla widget `UI/Widgets/HUD/Interact/WBP_ContainerInfo` (pakchunk1110):
> `Overlay_Main` → `OverlaySlot_5` (prompt strip `Border_Underlay`: name, «Труп», action tutorial; padding L/R 20) and `OverlaySlot_3`
> (`W_QuickLootPanel`, padding Left 500). No mod overrides the widget (path sweep over 72 mod containers, 2026-10-28). Our Russian action text
> is longer than the English one — the strip grows past x = 480 and runs under the loot panel.
> Meter: pult reads the absolute geometry of the live `Border_Underlay` and `W_QuickLootPanel` of `WBP_ContainerInfo_C` (left, right in screen
> px); a 4K window frame in the background (`capture-window.ps1`) — the eye.

**Expected:**
- E1 With the quick-loot panel shown, the strip's right edge stands at least 8 px left of the panel's left edge (4K), measured live.
- E2 The strip stays fully on screen (left edge ≥ 0) and keeps its text on one line as before.
- E3 Without the quick-loot panel (an empty corpse, a chest without the panel) the strip stands where it stood before the fix (± 2 px) — the fix
  moves it only when the panel is shown (owner: «если открывается этот виджет быстрого лута»).
- E4 The quick-loot panel stands where vanilla puts it (left edge 1180 ± 4 of 2000 on the 4K frame scaled to 2000, same corpse) — owner 20:31
  on build 1, which moved it right: «а квик лут - ты сдвинул вправо?» · «может не стоило?».

Dimensions: target (corpse with loot · corpse emptied · chest) × view (third person · first person) × resolution (4K · 1080p). Not covered: thralls,
co-op, other container kinds (placeable armour display, rift chest) — same widget, same slots.

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| R1 | Reproduce on the vanilla widget | own run, kill an NPC (pult `KillCharacter`), show the module on the corpse (`ActivateModule('ContainerInfo')` + the widget's `SetObject(corpse)` — the highlight path is blocked by the high camera, N1), frame | strip right edge > panel left edge (the defect) | pass (defect reproduced) | 20:01 frame `R1_module`: strip centred on the screen, «…нажмите E, чтобы забрать предметы» runs ≈300 frame px under the panel (panel left at 1180 of 2000). Pult geometry reads 0 (UE4SS does not return FGeometry) — the meter is the 4K frame |
| F1 | Corpse with loot, third person, after the fix | same as R1 on the fixed widget | E1, E2; frame: no overlap | pass (build 2) | 20:44 frame `F2_build2`: strip «Труп · Разделайте труп… нажмите E, чтобы забрать предметы» from x 145 to ≈1128, panel left edge 1180 — gap ≈ 50 frame px (≈96 px at 4K), no overlap, strip fully on screen |
| F2 | Corpse with loot, first person | `SwitchToFirstPersonCamera()`, look at the same corpse | E1, E2 | fail → build 2 | build 1 (strip Left, panel Right), 20:29 frame `F2_fp`: no overlap, gap ≈ 268 frame px; but the strip text starts at x 35 of 2000 (almost at the screen edge) and the PANEL moved ≈ 88 px right — owner: «а квик лут - ты сдвинул вправо?» · «может не стоило?». Build 2: panel back to the vanilla Center, strip Left with padding 120 both sides |
| F3 | Corpse emptied (loot taken) | take all, look again | E3 (strip where R1/F0 had it, panel hidden) | [NOT-TESTED] — not run 28.10 | |
| F4 | Chest or other loot container | look at a container that shows the panel | E1, E2 | [NOT-TESTED] | |
| F5 | 1080p | switch to 1920×1080, repeat F1 | E1 (scaled: ≥ 4 px), E2 | [NOT-TESTED] | |
| N1 | Note — the highlight path | own run: the corpse is not highlighted from the high third-person camera (steep pitch): `ImpactPoint + forward·10` goes under the sand and the eye-line check fails | — | noted | twin of bug 64 item 11 for a high camera; into bug 64 |
| X1 | HUD XP line reads «XP:» (owner 20:33: «в моде худа замени "Опыт" на "XP"») | rows 299–300 of interview #003 → `hosav-ru-entries.py` → kit GatherText → `locres-regress.py` → `deploy-localization.py`; relaunch; 4K frame of the top-left HUD | «XP: 98 842 / …», no «Опыт:» there; regress: only these keys changed | pass | regress 20:40: 54 441 → 54 441, lost 0, changed 1 (the XP template); `deploy-localization.py --check` «всё на месте»; relaunch 20:41, frame `hud2`: «XP: 99 502 / 102,19k (2 695)» |
| H1 | HUD Hosav: no level pointers at hunger / thirst (owner 20:3x: «в моде ХУДа убрать стрелочки-указатели уровня у голода и жады») | `Slider_Food`/`Slider_Water` thumb `ImageSize` 0 (`UIMod_Hosav__W_SmoothHP.tsv`), rebuilt pak; 4K frame of the HUD, crop of the two rows | no red ◀ ▶ pairs at the stomach and drop icons; icons, numbers and bars as before | pass | before: frame `R1_vanilla_e` crop — red ◀ ▶ pairs at both icons; after relaunch 20:41, frame `hud2`: none; rows «0% ( 00 : 00 )», weight «134 / 145 (92%)» intact |
| H2 | HUD Hosav: red blink of hunger / thirst / overload twice slower (owner: «мерчание красным голода, жажды, перегруза - в два раза медленнее») | `PlayAnimation` speed 1.0 → 0.5 in `Progress_Food`, `Progress_Drink`, `Get_WeightText`; burst of frames (`capture-burst.ps1`, 100 ms) while hunger, thirst and weight are critical | one red cycle lasts 2× the vanilla one | pass | redness of the icons (R−G) on bursts: ours — peaks 1947/3975/5917/7829 ms, period ≈1,96 s; control in the same run: the pult played `NoFood` at the native 1.0 — food peaks 788/1758/2710/3685 ms, period ≈0,97 s, while thirst (ours) ≈1,93 s → 2×; probe animation stopped after. Overload: same edit, not measured separately (weight 92 %, not critical) |
| R2 | The bow mod renamed (owner 20:39: «мод KrinikConanAim переименовываем в KrinikConanArchery») | game `ue4ss/Mods/KrinikConanArchery` (folder moved, no `KrinikArrowAim` left), relaunch, UE4SS.log | `[KrinikConanArchery]` lines; no `[KrinikArrowAim]` after the relaunch; bow hooks set once | pass | relaunch 20:41: `[KrinikArrowAim]` 0 lines, `[KrinikConanArchery] 0.3.0 …`, each notify hook «поставлен» once; game Mods has only `KrinikConanArchery` |
| C1 | Control: original pak back | remove the fix, relaunch, R1 again | the overlap returns | [NOT-TESTED] | |
