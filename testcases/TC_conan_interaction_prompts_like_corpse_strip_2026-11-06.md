# Test cases — interaction prompts like the corpse strip (bug 83), the perk gap 22 (bug 64 item 46), the enemy bar over its skull (bug 64 item 12a)

**Created:** 2026-11-06 · **Under test:** KrinikConanUI — Lua `krinik_ui_fixes` (the strip placement extended to every interaction prompt widget) and
the kit pak (`kit-conanui-edit.py`: `PERK_TEXT_PAD` 22, a gap between `W_EnemyHealthbar`'s bar and its skull) · **Version/build:** pack ConanExiles `ff52637` + this batch
**Test basis:** `[OWNER]` 2026-11-03 23:30 «я просил все виджеты интеракици - влево, меньше, прозрачнее фон» · «как ты сделал для трупов» (bug 83);
`[OWNER]` 2026-11-03 23:50 «давай 22 поставим» · «там же можно скролить?» (bug 64 item 46); `[OWNER]` 2026-11-03 23:29 «можно было бы над черепом полоску
чуть-чуть поднять» (bug 64 item 12a).

## 1. Goal vector

Achieve: every interaction prompt the game draws for an object or an NPC stands where the corpse strip stands and looks like it (left −22 % of the width,
render scale 0.70, backing alpha 0.60 — the hub rows «Плашка трупа»); the perk descriptions of «Сила» keep a 22-unit gap and the column still shows its last
perk; the enemy health bar keeps air above its skull.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHEN the crosshair rests on a talkable NPC, the talk prompt shall stand left of the screen centre by the strip's shift | prompt centre x share of the 4K width · frame · 0.28 ± 0.03 (centre 0.50 − 0.22) |
| R2 | WHEN the talk prompt shows, it shall be drawn at the strip's scale and backing | render scale and brush alpha read by the remote · 0.70 and 0.60 |
| R3 | WHEN any other interaction prompt widget shows (placeable, simple object, thrall), it shall follow R1–R2 | the same reads per widget class · as R1–R2 |
| R4 | WHILE the «Хар-ки» tab shows «Сила», the last perk description shall be reachable (visible or by scroll) | frame of the column bottom · the last perk's text readable · yes |
| R5 | WHEN an enemy's health bar shows, the bar shall stand higher over the skull than in vanilla | pixel gap bar-bottom → skull-top on a 4K frame · vs the 2026-11-03 frame · larger |

## 3. Coverage matrix

Partitions: widget class (NPC talk · placeable · simple object · thrall · container — regression); our section on / off (control); third person. Not
covered: first person, gamepad, a 720p pass (the strip is a render translation in screen shares — scale-free).

## 4. Stand

Oasis save, noon by the remote, `quiet-stand.lua` (kills hostiles only — a talkable NPC must stay), god on (`god-on.sh`). NPC prompt: the hero 2 m from a
talkable NPC, the view on it (aim by the game's answer — the prompt widget in the viewport). A prompt widget may also be opened by code like `strip-open.sh`
when its class takes `SetObject`. Enemy bar: a summoned fighter (`CheatManager:Summon` of `HumanoidNPCCharacter_C`) 4 m off. Perks: the inventory, tab
«Хар-ки», a real hover on «Сила» (`hover-watch.ps1 -At 0.13/0.25`).

## 5. Cases

| ID | Steps | Expected | Status | Observed |
|---|---|---|---|---|
| I1 | the crosshair on a talkable NPC, our build | the prompt left of centre (R1), scale 0.70, backing 0.60 (R2); 4K frame | pass | 2026-11-06 08:54 «Поборник Внешней тьмы» (`BP_HumanoidDialogueNPC_C`), hero 2 m off, view by the remote + a real Shift: the game showed `W_DialogueNPCInfo` itself; read `translation=(-403.5, 0) scale=0.70 brushA=0.60` (−403.5 = −22 % of 1834 units); frame `i1_real.webp`: the prompt at ≈ 0.28 of the width, small, a light backing; log «info prompt born … placed» |
| I2 | I1 with the hub rows at neutral (control: `ui_strip_x` 0, `ui_strip_scale` 1.0, `ui_strip_back` 0.8 in `KrinikSettings.lua`, fresh start) | the prompt centred, full size, dense backing (vanilla) | pass | 2026-11-06 09:00 read `translation=(0,0) scale=1.00 brushA=0.80`; frame `i2.webp`: centred, large, the dense torn-edge backing — the owner's 11-03 look. Our rows drive the prompt; the settings file restored after |
| I3 | the other prompt classes (placeable, simple, thrall, downed ally) — opened by code (`_config/info-open.lua`) | R3 for each | pass (values) | 2026-11-06 08:57 `W_PlaceableInfo`, `W_SimpleInfo`, `W_ThrallInfo`, `W_DBNORevive`: each `translation=(-403.5, 0) scale=0.70 brushA=0.60`; no frame of a game-shown one (no building or thrall at the stand) |
| I4 | regression: a container strip (campfire / corpse) | unchanged — left, 0.70, 0.60 | pass | 2026-11-06 08:58 `strip-open.sh` on a campfire: `Border_Underlay translation=(-403.5, 0) scale=0.70 brushA=0.60` |
| K1 | «Хар-ки» → «Сила», perk pad 22 | gaps 22 between descriptions; frame | pass | 2026-11-06 08:57 the built pak, «Сила» (G): frame `k0.webp` — even air between the six descriptions |
| K2 | K1, the column bottom: wheel down over the perk column | the last perk readable — the column scrolls or fits (R4) | fail | 2026-11-06 08:57 a real wheel −6 over the column: it does NOT scroll; «Сокрушительные удары» clipped by the window bottom. Live paddings by the remote on 20 rows, one frame each: 10 — the last perk whole; 16 — its last line «щитом» on the edge; 22 — two lines cut (review folder 64). The owner's pick 22 assumed a scroll — back to him |
| E1 | a hostile's health bar over it, our build | a visible gap between the bar and the skull (R5); frame | pass | 2026-11-06 08:56 the hostile boss «Носс Убивец» 8 m off: crop `e1b_crop.webp` — ≈ 8 px of air between the bar's bottom edge and the skull (it touched on the owner's 11-03 frame); the look waits for the owner's eye |
| P1 | «E Взять» beside a talk prompt (found 08:54: both lit): the hero at a pickable stone (`stone-stand.lua`), then the NPC teleported onto the stone | «E Взять» off while the talk prompt shows | pass | 2026-11-06 09:02 after `krinik_pickup_prompt` learned the five prompts: at the stone alone «plate opacity 1.00» (positive control), with the NPC on it «talk=true plate opacity 0.00» ×6 reads over 6 s; frame `p_npc.webp` |
