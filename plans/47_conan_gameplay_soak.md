# Plan 47 — a gameplay soak for the Conan build: an hour of active, varied play driven by the agent

> **Created:** 2026-11-06 · on the owner's word `[OWNER]` 20:35 «Часовой прогон на вылеты - это активное взаимодействие с миром, геймплей, а не твои демо
> летания» · «Твои демо летания, это "парадокс пестицида" - иди почитай тестинг фреймворки и интернет»
> **Parent:** MASTER_PLAN criterion 1 (a long run with no crashes and no new errors); HOUSE_RULES rule 28; the owner's evening-comfort list (18:05, item 1)
> **Status:** 🔧 planned 2026-11-06 20:36 +03:00; the 19:42 run was fly-throughs only — it counts as a fly-through stability check, NOT as the crash check
> **Outbound:** —

## Goal vector (Maintain)

The build survives the way the owner plays: an hour of varied play with no crash, no hang and no new Lua error; memory and FPS do not drift.

## Acceptance

Scale: crashes, hangs, new Lua errors, working-set growth, median FPS per 10 min. Meter: the soak script's checkpoint lines + `Saved/Crashes` + `UE4SS.log`.
Target: 0 crashes, 0 hangs, 0 new error kinds; working set growth < 10 % after the first 10 min; FPS median stable within the bench noise.

## Design (industry practice — bugnet «how to run soak tests», iXie «automated game testing with bots»: active loops of representative actions,
## varied, with checkpoints and crash fingerprints)

A script drives the game through the remote in rounds; each round shuffles the order and picks fresh places and parameters (anti-pesticide):

| Activity | How the remote drives it (each already used somewhere in the project) |
|---|---|
| Travel across areas | `tp_ground.sh` to a random spot from a list of 20+ (desert, river, jungle, north, volcano, cities, dungeons) — streaming |
| Combat | teleport next to a camp / boss from the list; god mode; kill by `KillCharacter` after N s; loot the corpse (quick loot open/take) |
| Gathering | spawn / find a resource node, harvest by the player's own action |
| Crafting | open a station, queue a recipe, take the result |
| Building | spawn a foundation item, place it, dismantle it |
| Thralls | spawn a thrall item, place it, open its inventory |
| Inventory and hub | open the hub, switch tabs by `W_Carousel_C`, open mod windows (`walk-mod-windows.sh`) |
| Survival | eat, drink, swim (teleport into water), climb |
| Loading screens | death and respawn (god off for one round), a dungeon entrance, a waystone |
| Time and weather | `SetTimeOfDay` jumps across day and night; a storm if a mod allows |
| Save | the game's own save every round |

Checkpoint every round: working set and handles of the game process, median FPS of the round (PresentMon), new `Saved/Crashes` folders, new Lua errors grouped by text.

## Steps

- [ ] 1. The place list (20+ points with what each tests) — from the game map's stands and the test cases.
- [ ] 2. One script `_config/soak-play.sh <minutes> <seed>`: rounds as above, the seed reorders and re-picks; every action logged; the game's own crash
      reporter and our checkpoint lines collected; read ONCE at the end (no wait loops).
- [ ] 3. A 15-min trial, read, fix the script; then the hour.
- [ ] 4. A run report; crashes → bug documents by fingerprint.
