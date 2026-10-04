# Research — a world that lives without the hero: how the reference games do it (recon for idea 10)

> **Created:** 2026-10-05 (owner: `[OWNER]` «разведка под это нужна тебе в интернете?» · «сделай, а затем закрываем чат» ·
> 2026-10-05 ≈02:29)
> **Parent:** `ideas/10_svarog_bumazhnaya_zhizn.md` (the owner's vision: the world lives fully without the hero) ·
> `researches/svarogs-dream/simulation.md` (what Svarog's Dream itself does — nothing beyond its 3×3)
> **Status:** ⛔ SUPERSEDED — a first skim (six searches, search-engine summaries only, no articles read), judged weak by the
> owner (`[OWNER]` «какая-то разведка у тебя убогая и слабая получилась» · «даже примера архитектуры и кода нет» ·
> 2026-10-05 ≈02:32). The real recon is the folder `living-world/` (five researchers reading primary sources, architecture
> with C# code). Kept for history; one correction stands: Kenshi freezes off-screen.
> **Outbound:** conclusions reach the owner through the epic meta-plan (Russian)

## 1. What the references actually do (found, with sources)

| Game | Off-screen life | Source |
|---|---|---|
| **Space Rangers 2** | The whole galaxy is simulated: AI rangers trade, fight Dominators, pirate or get pirated, upgrade gear — "the same things as you", except government missions; pirates rob transports; the military fights the Klissans on its own and on easy difficulty can win without the player; systems are captured and freed, coups and discoveries happen | [ru.wikipedia](https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D1%81%D0%BC%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5_%D1%80%D0%B5%D0%B9%D0%BD%D0%B4%D0%B6%D0%B5%D1%80%D1%8B_2:_%D0%94%D0%BE%D0%BC%D0%B8%D0%BD%D0%B0%D1%82%D0%BE%D1%80%D1%8B), [Elite Games FAQ](https://www.elite-games.ru/spacerangers/sr2/faq.shtml), [fcenter.ru](https://fcenter.ru/online/hardarticles/games/11966-Kosmicheskie_rejndzhery_2) |
| **S.T.A.L.K.E.R. (A-Life)** | Two modes: online (full AI near the player) and offline — "a low-resource mathematical text simulation" for NPCs out of view; squads travel the map offline; a global director sets faction behaviour by territory held ("lairs") and dispatches squads to claim neighbours; stalkers hunt artifacts, sell them to traders, upgrade gear. S.T.A.L.K.E.R. 2's A-Life 2.0 works in a limited "active bubble" | [Steam discussion A-Life 2.0](https://steamcommunity.com/app/1643320/discussions/0/571540929904713471/), [Living Zone addon (CoC)](https://www.moddb.com/mods/call-of-chernobyl/addons/living-zone-by-skelja-for-coc) |
| **Oblivion (Radiant AI)** | ~1000 NPCs with daily schedules (shop, eat, work); actors outside loaded cells are still simulated "to an extent" (low-level processing) and can travel cell to cell; hostile NPCs and creatures mostly do NOT run off-screen | [UESP: Radiant](https://en.uesp.net/wiki/Oblivion:Radiant), [What was Radiant AI, anyway?](https://blog.paavo.me/radiant-ai/) |
| **Kenshi** | Everything not loaded around the player's characters is **frozen**; raids and events wait until you return. Raids are scheduled by faction with ranges (up to 9 km) | [Kenshi wiki: Events](https://kenshi.fandom.com/wiki/Events), [Steam: faction raids](https://steamcommunity.com/app/233860/discussions/0/3115896179321973163/) |
| **The Wayward Realms** | Over a hundred islands, scores of factions vying for influence; a virtual "Game Master" makes characters and factions react and plot; custom engine that runs even on laptops without a dedicated GPU. **Not found:** the owner's "million characters on CUDA cores, stored in RGB channels" — no source in this sweep; the GPU-less claim argues against a GPU-only simulation | [PC Gamer](https://www.pcgamer.com/former-elder-scrolls-devs-announce-grand-rpg-the-wayward-realms/), [PCGamesN](https://www.pcgamesn.com/the-wayward-realms/ai-rpgs-game-master), [thegeek.games](https://thegeek.games/2025/12/03/the-wayward-realms-makes-a-stunning-move-bethesda-veterans-drop-unreal-engine-5-for-a-custom-engine-that-runs-even-on-gpu-less-laptops-video/) |

Industry pattern ("AI/simulation LOD"): near — full AI, animation, collision; middle — simplified AI, lower update rate; far —
cheap simulation with statistical movement between points; very far — no individual simulation. NPCs switch online ⇄
offline as the player moves. Sources: [GTA crowds write-up](https://dev.to/saeedjt/gta-6-npc-technology-how-open-world-crowds-are-actually-simulated-43j8),
[Open World NPC Simulation System (UE forum)](https://forums.unrealengine.com/t/bohdan-bitkovin-yuzhda-open-world-npc-simulation-system-scalable-online-offline-npcs/2644446),
[AAAI: An AI System for Large Open Virtual World](https://cdn.aaai.org/ojs/12705/12705-52-16222-1-2-20201228.pdf),
[GameDev.net: efficiently simulate the whole world](https://www.gamedev.net/forums/topic/665060-open-world-rpg-how-to-efficiently-simulate-the-whole-world/5206445/).

**Correction of a hearsay datum:** Kenshi — often cited as a living world — freezes everything off-screen. Of the owner's
references, only Space Rangers and A-Life actually simulate the world without the player; Oblivion partly (schedules of
persistent NPCs); Svarog's Dream not at all (`simulation.md`).

## 2. What it means for Svarog's Dream (input for the meta-plan)

The proven shape is **A-Life over the game's own characters**:

1. **The ledger (offline layer).** Every character the game streams in gets an off-screen record: position, home, routine
   slot, faction, health, purse/inventory summary, current task. Cheap data, ticked by game hour (Space Rangers ticks per
   day) — hundreds of records cost a fraction of a millisecond; no threads, no GPU needed at this scale.
2. **Online ⇄ offline switch.** Our sleep beyond 300 m is already the switch (`SvarogsDream` `89a0629`); waking = applying
   the ledger to the game object (position, health, inventory), going offline = writing it back.
3. **Offline behaviours, stage by stage** (each stage verified by "leave — wait N game hours — come back — the world
   changed"): (a) routines (idea 10 phase 1); (b) travellers move between settlements on the world path graph and trade
   — the game's economy already keeps trader stock as data (`StorageManager`), so selling loot is a data operation;
   (c) encounters: beasts × people, bandits × travellers — outcome by a combat roll on the records (who dies, who loots);
   (d) factions — a director like A-Life's: territory → aggression → dispatch squads (the game's own faction-war battles
   start only within 150 m of the player — `FactionWarBattleController.cs:321-332`); (e) travellers taking and completing
   quests — last, the riskiest for the game's quest state.
4. **Consistency rules learned from the references:** the player's world must never contradict the ledger on waking
   (Kenshi's frozen honesty is better than a fake); off-screen deaths must reach the game's own records (`deadCharacters`);
   respawn must exist or the world empties (Svarog has no respawn timers — only tile re-creation).

## 3. Open questions for the owner (to the epic's interview, not decided here)

- Scale of "the world": the 5×5 ring, the whole map (238 tiles), or everything incl. dungeons?
- Who may die off-screen: anyone, or not quest characters / traders?
- Respawn: new travellers from settlements (the A-Life way) — how often?
