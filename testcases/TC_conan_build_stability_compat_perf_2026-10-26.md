# Test cases — Conan 3.0.1 build: stability, mods in the world (smoke), translations in mod UI, cost of mods

> **Created:** 2026-10-26 · **Basis:** the owner's word 2026-10-26 under `resume` — «она 1_ должна работать стабильно 2_ моды не должны
> конфликтовать, должны быть рабочими 3_ не должно быть явных просадок производительности из-за модов»; mid-turn, before 08:53 —
> «моды, которые мы поставили, нужно бы протестировать в игре, хотя бы smoke» · «если моды приносят UI - увидеть бы, что наши переводы ровно
> стали»; findings of `ConanExiles/docs/17` (sections «Имена недостающих пакетов») · **Contour:** `D:\Games\Conan Exiles 3.0.1`
> (CL-379176), test hero, pack `D:\work\ai_sandbox\ConanExiles`, 64 paks + 8 Lua mods, `Language=ru`, game in the background
> (`launch-bg.ps1`, pult `KrinikAgentRemote`), under the machine lock.

Dimensions: loader level for every pak (mounted · mod controller active · error lines only of the known list); stability (session length,
crash folder, game alive); UI of mods (HUD, inventory, ESC menu, own windows) — visible · Russian · text inside its frame; functional
spots where docs/17 found a lost dependency (Caverns of Set chest loot, Highmane crossbow, DeaHair hair, fire particles); NPC/world mods
seen in flight. Not covered in run 1 on purpose: performance pairs (q4 — a separate run with the owner's film word, HOUSE_RULES §1),
building placement, taming bosses (B1 — admin spawn route), character creation (F1).

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| L1 | Every pak mounted, every mod controller active | world entry; script over the game log: `LogPakFile … Mounted` per `modlist.txt` line, `AddActiveModControllerClass` per mod | 64/64 mounted; each mod that ships a controller has one `AddActiveModControllerClass` line | [NOT-TESTED] | |
| L2 | No new error classes | group `Error:` lines of the run log, compare with the list of the 2026-10-26 morning analysis (network, Charred_Remains stat templates, 4 merge nulls, planter TN, EoT_AlmostEmpty, Emberlight struct) | no category outside that list | [NOT-TESTED] | |
| S1 | Session stability | whole run ≥ 20 min in the world: entry, HUD, windows, flight `krinik-show`; `Saved/Crashes` before/after | no new crash folder; process alive until `close-game.ps1` | [NOT-TESTED] | |
| H1 | HUD of mods | frame `capture-window.ps1` after HUD is built | Hosav HUD, Simple Minimap, Proximity Party, Damage Meter, FPS counter visible; all their text Russian; no text out of its frame | [NOT-TESTED] | |
| U1 | Inventory window and its mod buttons | pult: open the inventory module via `GUIModuleController`; frame | Inventory Compactor / Organizer / PackRat / Arrow Quick Swap elements present; Russian; fit | [NOT-TESTED] | |
| U2 | ESC menu — Simple Modlist | pult: open the ESC menu; frame | mod list shown; labels Russian; fit | [NOT-TESTED] | |
| U3 | ModControlPanel window | pult: open its panel; frame | panel opens; Russian; fit | [NOT-TESTED] | |
| U4 | Simple Minimap tutorial and settings, Proximity Party settings, Lore & Loot settings (RU2 left open 25.10) | pult: open each; frames | Russian, no English line, fit | [NOT-TESTED] | |
| U5 | Damage Meter window | pult or F1 hint; frame | Russian (T1 passed 25.10), text fits | [NOT-TESTED] | |
| U6 | Edit Appearance, EAA fame shop, Waystones, Exiles Fishing windows | pult: open each reachable one; frames | opens; Russian; fit — unreachable ones listed as blocked with the reason | [NOT-TESTED] | |
| C1 | Caverns of Set chest loot (`Caverns_of_Set_Loot_Chest_Table` not merged, docs/17) | pult: spawn or find `BP_PL_CoS_Loot_Chest`; read its inventory count | loot present → table loss harmless; empty → defect | [NOT-TESTED] | |
| C2 | Highmane crossbow (`FC_BowProjectileGravCurve_60m` missing) | spawn `BP_HA_Crossbow` item, fire once; log `Accessed None` | bolt flies and lands; no script errors | [NOT-TESTED] | |
| C3 | Fire particles of mod stations and torches (`P_Fire_Medium`, `P_TorchFire`, `P_Fire_Edge` missing) | frame of a Caverns of Set torch / EAA gem upgrader if reachable | station works; flame missing is cosmetic — recorded, not a defect of function | [NOT-TESTED] | |
| G1 | Pult guard `no-component-sweep` reddens on the crashing command | world; pult `lua return #FindAllOf('WidgetComponent')` | done.txt `fail`, UE4SS log «отказ: перебор компонентов …», game alive | pass | 09:35:09 `7 fail lua return #FindAllOf('WidgetComponent')`, log «отказ: перебор компонентов (FindAllOf по …», process 24300 alive; repeat with SkeletalMeshComponent — `9 fail` |
| R1 | Pickup reach follows camera distance (bugs/64 item 11) | world; UE4SS log after entry and after a zoom change via `agent-cmd` `arm_length`; pult read `InteractionDistanceThirdPersonBonus` | log «дальность взятия: штанга N + сдвиг назад 100 → надбавка …» with bonus = 55 + (N + 100 − 200) + 315; value on the controller equal | pass | 09:35:06 log «штанга 280 … 550 см», «штанга 230 … 500 см» (= 55 + 130 + 315); pult `bonus=500.0` |
| R2 | Stone picked up in third person (owner's path) | owner aims at a stone in third person and presses E | stone picked up at default and far zoom | [NOT-TESTED] | |
| T1 | New strings in game | after relaunch: map footer hints, minimap tutorial button, marker page «НОВОЕ:» | «Новый маркер», «Свои маркеры», «Ясно» inside the button, «— мышь заработает…», «НОВОЕ:» | [NOT-TESTED] | |
| W1 | NPC and world mods seen in flight | during `krinik-show`: pult actor names near the camera (`FindAllOf` on actors — names only, EXP-0330) | NPC classes of RNF / Heritage / Ironlight / Night Terrors present where they live | [NOT-TESTED] | |
