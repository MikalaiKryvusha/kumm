# Plan 40.2 — every row of «Моды Krinik'а» moved, saved and its effect seen in the game

> **Created:** 2026-11-01 · **Parent:** `plans/40_EPIC_conan_1.0.0_unfinished_six.md` phase 2 (criterion 2); plan 39 A1; STATUS handover item 1a
> **Status:** written 2026-11-01 by a helper agent; recon done 14:4x; run 1 of 2026-11-01 14:38-14:46 (cases `testcases/TC_conan_hub_rows_audit_2026-11-01.md`): 13 rows pass, 4 partial (sharp zoom timing, arrow speeds, arrow breaking, blood), 1 not run (shout), H20-H22 not run; the defect «Сохранить и закрыть» did not reach the camera / pack manager found and fixed. Next: the partial rows by their stands (a bow shot at a frozen Kappa, a melee hit), H20-H22, rule 4a (ranges and hints)
> **Outbound:** a row with no effect that cannot be fixed within the phase → the owner decides «fix or remove for 1.0.0» (one line, his word recorded)

Basis, verbatim: `[OWNER]` 2026-11-01 13:23 «ты сделал шкалы настройки - якобы давая игрокам возможность это настраивать, но это ЕБАНАЯ показуха, потому что
за этим нет кода и механики» · «ты получается лжец».

## Goal vector (Achieve)

The hub window is shipped to players with 19 rows; each has a reader in code, but only «Сколько держится фраза врага» was moved and seen working end to end
after the store (plan 39 A1). A dead row is a lie in the product. Where we want to be: each of the 19 rows was moved by the real mouse, saved, and its effect
OBSERVED in the world — a frame or a number read from the game, not the mod's own «принято» log line (EXP-0422: a logged call is not an effect); a row that does
nothing is fixed (and re-observed) or removed from the window, the guide and the mockup.

## Acceptance criteria (scenario form)

1. **One case per row** (19 scenarios of one shape; the table below gives each row's Situation values and Check).
   - Situation. The row at its default; the stand of that row (table).
   - Action. The player moves the row to the «moved» value of the table and clicks «Сохранить и закрыть».
   - Result. The world shows the effect named in the table (a number read from the game object or a frame difference).
   - Check. The row's Check command from the table prints the «moved» effect value; before the save it printed the default effect value.
2. **Persistence.** Situation: one row per page saved at a non-default value (5 rows). Action: the game is restarted. Result: the five effects hold.
   Check: `cat "<game>/ConanSandbox/Saved/KrinikSettings.lua"` (non-camera keys), the camera's `config.lua` (camera keys); the five Check commands re-run.
3. **Close without saving changes nothing.** Situation: one row moved per page, not saved. Action: «Закрыть без сохранения». Result: no effect changed.
   Check: `cmp` of `KrinikSettings.lua` before/after = equal; the five Check commands print the old values.
4. **Reset.** Situation: a page with three rows moved and saved. Action: «Сбросить к исходным», «Сохранить». Result: the defaults' effects.
   Check: the rows' Check commands print the default values.
4a. **Sensible ends and short hints** (`[OWNER]` 2026-11-01 14:18–14:20 «у мерегрузки мин значение шкалы стоит поставить 50%» · «у голода и жажды - тоже
   50% но с другой стороны» · «есть нейкие разумные величины, которые стоит устанавливать в шкалах как мин и макс значения» · «никто не захочет, чтобы
   перегрузка мерцала с 10%, например»; 14:08 «Иногда не нужно серое пояснение» · «или очень кратко» · «и в описаниии по (i) будет объяяснено»). For every
   slider row: its min and max are values a player could actually want (the weight blink 50–95 %, the food / water blink 5–50 % already are) — a range end
   nobody would pick is narrowed; the grey hint is dropped or cut to two-three words when the «i» text already says it.
   Check: the run report's table carries «min · max · why a player wants each end» and the hint per row.
5. **Nothing dead remains.** Check: the run report's table has 19 rows, each `pass`, or `removed` with the commit that removed the row from PAGES, the kit
   tuple (`kit-krinik-modsettings.py` line ≈116), the guide and the mockup.

## The rows, their stands and checks

Values from `ConanExiles/_unpacked/KrinikConanUI/ue4ss/Scripts/krinik_mod_settings.lua` PAGES. «Recon» = the read command is not known yet; finding it is the
first step of that case (written into the mod's notes).

| # | Row (id) | Default → moved | Effect to observe | Check (remote via `cd ConanExiles/_config; bash pult.sh "lua …"`, frames by `capture-window.ps1`) |
|---|---|---|---|---|
| 1 | `cam_height` | 75 → 150 | camera higher above the hero | the hero's `USpringArmComponent.SocketOffset.Z` (camera notes: the mod writes `SocketOffset`, `TargetArmLength`); frame pair, the hero lower in frame |
| 2 | `cam_side` | 0 → 60 | over-the-shoulder view | `SocketOffset.Y` = 60; frame pair |
| 3 | `cam_dist` | 315 → 500 | the distance the numpad «+»/«−» sets | [recon 2026-11-01] no key needed: on the window CLOSE the camera applies `arm_length` when the window changed it (notes «The «Моды Krinik'а» window»); read the SpringArm `TargetArmLength` = 500 after «Сохранить и закрыть»; log «ОКНО «Моды Krinik'а»: принято 8 настроек» |
| 4 | `cam_pitch` | −2 → 10 | camera tilted | [recon] `apply_camera_pitch` (`Scripts/main.lua:594`) sets the CAMERA component's `K2_SetRelativeRotation({Pitch = camera_pitch})` — read that component's `RelativeRotation.Pitch` = 10; frame pair |
| 5 | `cam_zoom_min` | 130 → 300 | the wheel stops nearer at 300 | `mouse-seq.ps1 -Seq "wheel:1,wait:100,…"` ×30 → `TargetArmLength` = 300 |
| 6 | `cam_zoom_max` | 2125 → 1000 | the wheel stops farther at 1000 | `wheel:-1` ×40 → `TargetArmLength` = 1000 |
| 7 | `cam_sharp` | off → on | the wheel jumps without a glide | `TargetArmLength` read 50 ms after one wheel click equals the target (off: between) |
| 8 | `cam_zoom_smooth` | 9 → 20 | a faster glide | `TP_SpringArmInterpSpeed` = 20 (comment in PAGES); time to target from 10 reads 50 ms apart shorter than at 9 |
| 9 | `ui_fps` | on → off | the counter in the top-right corner gone | the counter TextBlock `GetVisibility()` = 1; frame crop of the corner |
| 10 | `ui_blink_food` | 10 % → 30 % | the food icon pulses from 30 % | food 25 % (`h.FoodCurrent=25.0`, read back): at default — no pulse, after — pulse; `Border_EatImage` content colour G < 1 in 3 of 5 reads 100 ms apart |
| 11 | `ui_blink_weight` | 90 % → 60 % | the weight icon pulses from 60 % | recon how to load the hero to 70 % of max carry (`exec MakeMeAdmin` + `exec SpawnItem <heavy id> <n>`; the id from the item table); `Image_Weight_Blinking` alpha > 0 |
| 12 | `ui_menu_slow` | 33 → 2 | the world in the inventory twice slower, not 33× | inventory open by `ActivateModule('CharacterInventory', …)`; `GameplayStatics:GetGlobalTimeDilation(world)` = 0.5 (default 0.0303) |
| 13 | `ui_craft` | on → off | hero craft in the inventory slowed with the world | [recon] `bash _config/craft-measure.sh <multiplier> [<recipe> <result> <hub 1|0>]` (default «Бечевка» 14174 from 3 fibres 12001; needs `exec MakeMeAdmin` + `SpawnItem 12001 3`) → craft time ×(1/dilation) when off; `CraftingQueue.CraftTimeMultiplier` read |
| 14 | `ui_shout_hold` | 1 → 5 s | an enemy shout stays ≥ 5 s | seen 2026-11-01 (report `2026-11-01_conan-shout-hold-slider.md`); re-run once: the log «фраза снята через X с» X ≥ 5 on a summoned humanoid's shout |
| 15 | `arc_ballistics` | on → off | arrow speed no longer depends on the draw | `aim-shot.sh 300` and `aim-shot.sh 1200`: the archery log's per-shot speed differs when on, equal when off ([recon] `CFG.ballistics` gates the draw-speed block at `main.lua:376`; the save logs «настройки окна: баллистика false …» at `:175`) |
| 16 | `arc_nobreak` | on → off | arrows can break on a hit | [recon] `CFG.no_break` sets the flying arrow's `CanBreakOnImpact = false` (`main.lua:316`): read `CanBreakOnImpact` of a fired `BP_*Projectile` (on → false, off → the game's true); 10 hits on a frozen Kappa — surviving copies on → 10, off → fewer |
| 17 | `arc_fov` | 75 → 50 | narrower view while aiming | RMB held by `mouse-seq.ps1 -Seq "rdown,wait:1500"`; `PlayerCameraManager:GetFOVAngle()` = 50; `rup` |
| 18 | `mpm_hud_scale` | 125 % → 150 % | the top HUD block larger | the Hosav HUD root's `RenderScale` ([recon] `apply_hud_scale` scales the live `W_SmoothHP_C` (`hud_scale_class`, `main.lua:807`), log «масштаб HUD x1.50 (окно «Моды Krinik'а», …)») — its `RenderTransform.Scale` = 1.5; frame pair |
| 19 | `gfx_blood` | 300 → 30 s | ground blood gone after 30 s | a melee hit on a frozen Kappa (recon a sword in a quick slot + `mouse-seq.ps1 -Seq "lclick"`); the graphics log «кровь лежит 30 с (окно «Моды Krinik'а», …)» at the next stain ([recon] `main.lua:80`; per-stain line only with `debug_log`); frames at +20 s (stain) and +40 s (none) |

## The stand (HOUSE_RULES rule 11)

| Part | Value | Set up by |
|---|---|---|
| Save | the live save; the 2026-10-31 16:56 copy (bow in quick slot 1) when entry breaks | `bash _config/save-restore.sh "D:/Games/Conan Exiles Mods/_save-backup/2026-10-31_1656-before-manager-check"` |
| Place | open ground, no enemies / companions / buildings within 60 m, noon, clear | teleport + `bash _config/tp_ground.sh`; `SetTimeOfDay(12.0)` |
| Hero | god on (`bash _config/god-on.sh`); food and water written to 100 and read back before every case except 10; admin (`exec MakeMeAdmin`) for spawns | remote |
| Creature | rows 14–16, 19: a green Kappa (14: a humanoid — recon a loaded class; `arrow-stand.sh` env `CLASS_PATH`) | `bash _config/arrow-stand.sh summon; … place 8; … freeze` (row 19: `place 1.5`) |
| Input | real mouse for every hub click (`wait-input-idle.ps1 -Min 10` first, then `mouse-seq.ps1`) | — |

## Steps

- [x] 1. **Recon of the eight «recon» cells** — done 2026-11-01 14:4x, the cells marked [recon] (offline first): read `KrinikConanCamera.md`, `KrinikConanModPackManager.md`, `KrinikConanGraphics.md`,
      the archery `main.lua` (`grep -n "arc_\|ballist\|nobreak\|break" _unpacked/KrinikConanArchery/ue4ss/Scripts/main.lua`), `craft-measure.sh` header,
      `tp_ground.sh` header; write each found read command into the table above (this plan, an edit with a reason) and into the mod's notes.
- [ ] 2. **Cases** written first: `testcases/TC_conan_hub_rows_audit_<YYYY-MM-DD>.md` — H1–H19 (the table), H20 persistence, H21 close-without-saving,
      H22 reset; the stand block; status `[NOT-TESTED]`.
- [ ] 3. **Run 1 — camera page** (rows 1–8): lock (`machine-lock.mjs take --who kumm --what "epic40 p2 audit" --minutes 60`), `launch-bg.ps1`
      (or `launch-fg.ps1` by the owner's last word), `enter-world-remote.sh`, the hub by `ActivateModule('KrinikModSettings')` over an open inventory; per row:
      Check before → real-mouse move and save → Check after → frame pair; the camera's `config.lua` copied out before the run and back after (camera notes:
      the owner's tuned file lives in the game folder).
- [ ] 4. **Run 2 — UI, archery, pack manager, graphics pages** (rows 9–19), same pattern; a 20–30 s clip per page of the hub clicks (rule 4).
- [ ] 5. **Run 3 — H20–H22** (restart, close without saving, reset). `close-game.ps1`; lock released.
- [ ] 6. **Fix pass** for every `fail` (unknown until runs 1–3): the fix in the mod's reader, a re-run of that case the same day
      (memory «Найденный баг — чинить сразу»); a row not fixable in the phase → the owner's word «fix or remove»; removal = PAGES row, kit tuple, a kit
      rebuild (twice + `kit-buildmod.py`), the guide line, the mockup row.
- [ ] 7. Run report `testcases/reports/<YYYY-MM-DD>_conan-hub-rows-audit.md` — the 19-row table «row · how the player sees it · seen (yes/no) · frame/number»
      (plan 39's closing rule).

### Packaging (only if step 6 changed code)

- [ ] P1. Sources: `ConanExiles/_unpacked/<Mod>/ue4ss/Scripts/*.lua` of the fixed mods; the kit script and the rebuilt pak if a row was removed.
- [ ] P2. `modpack.json`: the touched entries' `version` text and `verify` lists if a file was added; deploy each touched mod
      `Deploy-ModPack.ps1 -PackDir D:/work/ai_sandbox/ConanExiles -Deploy -Only <Mod>` then `-Verify` → exit 0.
- [ ] P3. Same commit (rule 20): each touched mod's notes, `KrinikConanUI.md` (PAGES), the guide `docs/guide/guide-3.0.1.html`, plan 39 A1 → seen with the
      report path, bug 64 / plan 36 rows the fix touches. Pack commit + push; KUMM commit + push.

## Risks

- (a) Camera rows trade values through shared variables (`KrinikCameraValues` / `KrinikCameraSet`), not the store — a save may apply only at the camera's next
  moment; the Check reads after one wheel click or one second.
- (a) Rows 11 and 19 need stands not built yet (load to 70 %, a melee hit) — the recon may cost more than the case.
- (b) More dead rows than the evening allows — the owner's word per row (epic risk).
- (c) The owner's tuned camera `config.lua` overwritten by the run — copy out first, back after, `cmp` it.
