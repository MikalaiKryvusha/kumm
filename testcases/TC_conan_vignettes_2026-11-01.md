# TC — the screen-edge vignettes (hunger, thirst, low health): what draws them, and three shkalas that scale them, far left = off

> **Created:** 2026-11-01 · **Basis:** plan `plans/40_epic40_phase1_vignettes.md` (criteria 1–8); `[OWNER]` 2026-10-30 ≈08:25 «Крайнее левое положение ползунков -
> ВЫКЛ полный соответствующей виньетки» · 2026-11-01 13:20 «по умолчанию в поставлке сборки виньетки голота и жажды ВЫКЛ, виньетка нижкого здоровья тусклая, типа 10%
> или на каком значении она едва заметна»; recon `researches/conan-vignettes/README.md`; run report `testcases/reports/2026-11-01_conan-vignettes.md`

## Stand

| Part | Value | Set up by |
|---|---|---|
| Launch | the game in FRONT (house rule 16a) — screen capture sees the full-screen effects; `capture-window.ps1` (PrintWindow) sees them too | `powershell -File _config/launch-fg.ps1`; `bash _config/enter-world-remote.sh` |
| Save | the live save (rule 6) | — |
| Place | open ground, no enemies within 60 m | the save's spot (oasis −78166, 245999) |
| Time | noon | `pult.sh "lua FindFirstOf('BP_TimeOfDayManager_C'):SetTimeOfDay(12.0)"` |
| Hero | god on; food / water by a direct write and read back, refilled to 100 right after every starving case (0 % kills even with god); health by `p:AdjustHealth(<int delta>)` | `bash _config/god-on.sh`; `h=p:GetHungerSystem(); h.FoodCurrent=…`; `p:AdjustHealth(-169)` (30 of 199), `p:AdjustHealth(200)` (full) |
| Input | none during a frame series (vanity camera after ≈ 2–4 min) | — |
| Frames | screen or window capture, 1920 wide (4K for the owner's review) | `capture.ps1` / `capture-window.ps1 -Out <scratch>/<name>.jpg -Width 1920` |
| Measure | health: edge-band red excess; hunger / thirst: edge LUMA (the band is dark, not red) or an op-1 / op-0 diff map | `python -X utf8 _config/edge-band.py <frame> [--control <frame>]` |
| Control | the SAME view with the effect widget forced to op 0 by the remote, seconds apart | `hw:SetRenderOpacity(0.0)` |

## Recon probes (one unknown per remote call — a native crash is not caught by pcall, EXP-0401)

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| P1 | food 100, water 100 (control) | frame | no red at the edges; the control number | pass | 13:47: the first control frame HAD red blotches — health 121/199 (61 %), the low-health vignette; at 199/199 they are gone (edge-band −3.28 → −11.35) |
| P2 | food 0, water 100, held ≈ 10 s | frames at +3, +6, +10 s | the hunger vignette visible at the edges | pass | 13:51: a `T_BuffFullScreenEffect_HungerThirst` widget is born at food 0; a DARK green-grey band, not red (edge luma 103.8 at op 1 vs 114.4 at op 0, diff map `hg_diff.webp`); 250 ms trace: root op 1, Image op 1, colour A 0.8 — constant |
| P3 | as P2 | the effect widgets' `SetRenderOpacity(0.1)`, then `0` | fainter at 0.1, gone at 0 | pass | hunger: op 0 removes the band; health at 15 %: op 1.0 / 0.1 / 0 → edge-band 10.28 / 1.46 / 0 (`sheet_op.webp`) |
| P4 | food 100, health ≈ 15 % | find the health setter; frames | the low-health vignette; which widget | pass | `p:AdjustHealth(<int>)` (`ConanCharacter`), read back `IsFullHealth()`; the widget draws `MID_HealthScreenEffectMat`, scalar `Intensity` 0 / 0.3 / 0.7 at 100 / 60 / 15 % health — red blood splatter |
| P5 | the vignettes seen | read each effect widget's `Image` brush resource, one call each | hunger/thirst → `…_HungerThirst`; health — another | pass | as expected; a permanent fourth widget draws `T_BuffFullScreenEffect` (left untouched). Crash 13:52:26 on another call — a reflection walk of the class; never touch `Buff` or reflect this class |

## Side fix — the menu slowdown polled the whole scene (`[OWNER]` 2026-11-01 14:25 «не перебирают сотни объектов в каждом кадре?» · «или сотри объектов раз в 1...2 секунды?»)

`krinik_pause_in_menu.lua` `poll()` (every 250 ms) called `FindFirstOf("GUIModuleController")` and `FindAllOf("BasePlayerChar_C")` on every poll; now both are
cached and searched again only when dead, at most once per 2 s.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| C1 | in the world, hero alive, no menu | wait ≥ 2 min | log «минута: поисков по сцене 0 из 240 опросов» (at most 2 — the first finds) | pass | 14:29:41 — 7 (the minute of the world load), 14:30:43 — 0 of 240 |
| Z1 | the hub, page KrinikConanCamera | frame of the zoom row | «Скорость зума · больше — быстрее» (the owner 14:30: «Плавность резче, а скорость - быстрее !!») | pass | 14:32 frame `zoom_row.webp`: «Скорость зума · больше — быстрее · 9» |
| C2 | in the world | open the inventory by a REAL Tab, close it | «полноэкранный интерфейс: ОТКРЫТ» → dilation 0.03; «закрыт» → 1.0 — as before | pass | 14:29: «ОТКРЫТ» · «меню открыто: замедление времени 0.03 → лежит 0.0300»; Tab again → «закрыт» · «1.0 → лежит 1.0000». (Our hub window alone is not a full-screen GUI for the game — no slowdown there, as before) |
| C3 | the main menu (no hero) | wait 1 min | searches ≤ 30 per minute (once per 2 s), the menu NOT slowed | pass | 14:28:16 «минута: поисков по сцене 28 из 240 опросов» (was 480: two walks per poll); world entry by the remote went through in 24 s |

## Acceptance (plan criteria 1–8)

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| V1 | fresh store (no `ui_vig_*`), food 0, water 100 | 3 frames over 3 s (luma — P2) | no hunger vignette | pass | 14:03: log «виньетка hunger: сила 0.00»; live op 0.00; edge luma 110.0–110.6 vs 98.3 when the same widget is forced to op 1 |
| V2 | fresh store, water 0, food 100 | same | no thirst vignette | pass | 14:04: log «виньетка thirst: сила 0.00», live op 0.00; the op-1 / op-0 diff map `td_diff.webp` shows the band at the left, right and bottom edges (the luma mean drowned in a turtle walking in — interference; the property and the map are the evidence) |
| V3 | fresh store, health 15 % | 5 frames over 7 s | faint vignette | partial | 14:03: log «виньетка health: сила 0.10» at world entry; edge-band 0.57–1.88 vs 16.10 at op 1 — a faint pink haze (`sheet_v3.webp`); the plan's bound «> 2» was a guess — the strength is the owner's pick: review folder 48 (0 / 5 / 10 / 15 / 25 %) |
| V4 | hunger vignette, shkala 50 → 100 → 0, «Сохранить» each, REAL mouse | frames (hub open, world slowed) | the effect follows the shkala | partial | the chain works: drag + «Сохранить» → log «сохранено: голод 0.50 / 1.00 / 0.00 … применено к 2», live op = the shkala; the PROPORTION is not measured — two series gave 25 % and 12 % / 90 % of the full darkening at 50 (the hunger effect fades in after birth, the scene moves); linear opacity kept, the look goes to the owner's eye |
| V5 | thirst 0 %, shkala «Виньетка: жажда» 0 → 50 % by the REAL mouse, «Сохранить и закрыть» | remote | the live thirst effect at the shkala | pass | 15:40: store `ui_vig_thirst = 0.5`, log «сохранено: … жажда 0.50 … применено к 2», the live thirst widget op 0.50 |
| V6 | health 15 %, shkala «Виньетка: мало здоровья» 25 → 0 % by the REAL mouse | remote | far left = off | pass | 15:40: store `ui_vig_health = 0`, the live health widget op 0.00 |
| V7 | the hunger shkala at 50, then far left, «Сохранить», REAL mouse | remote + log | opacity 0 | pass | 14:11: log «сохранено: голод 0.00 … применено к 2»; live hunger op 0.00; the store key deleted (0 = default). First try FAILED: «применено к 0» — a weak-keyed table lost the UE4SS wrappers; fixed (a table by full name), re-run green |
| V8 | the hunger shkala saved at 50 % | restart the game | the strength survives | pass | 14:07 restart: `KrinikSettings.lua` holds `ui_vig_hunger = 0.5`, log «загружен: голод 0.50»; the next starvation born «сила 0.50», live op 0.50. One row only |
| V9 | all stats 100; then a vignette shown | the section's minute summary | no calls with none; worst ≤ 0.10 ms with one | pass | the section runs only on an effect's birth and on «Сохранить»; «минута: 3 вызовов, всего 0.000 мс, худший 0.000 мс» (os.clock step 1 ms) |
| V10 | the hub open, page KrinikConanUI | frame at 1080p + remote | three rows «Виньетка: …» with «i» | pass | rows seen 14:06; the owner 14:08 «(i) искажены в строках, где много теста»: the «i» boxes of rows built after the square SizeBox left the kit script (shout, three vignettes) were 22.6 × 27.3 — a lemon; kit fixed, 14:20 all five measured 22.6 × 22.6, frame `hub_fixed_rows.webp` round; the grey hint dropped on the vignette rows (the owner 14:08) |
| V3b | fresh store, world entry | read the section log and the hub row | low health shipped at 25 % (the owner 14:34 «ставь 25%») | pass | 14:35 world entry, no store: «загружен: голод 0.00, жажда 0.00, здоровье 0.25», «виньетка health: сила 0.25» |
