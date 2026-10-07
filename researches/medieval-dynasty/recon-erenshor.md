Recon — Erenshor simulated players (2026-10-08)

Scope: how Erenshor's "SimPlayers" work, judged by mechanism. The sources are the Steam store and Steam API, all 182 Steam announcements (API dump), five developer videos (YouTube auto-captions pulled with yt-dlp), the community wiki (wiki.gg API), three Thunderstore mods whose authors decompiled the game's sim code, the open-source CustomSimFramework repo, and all 2,080 English Steam reviews (Steam API).
Already in the project and not repeated here: Erenshor's row in `Game_Of_Dream/search_reports/steam_dream_search_2026-09-27.md` (score 4.3, "94% из 2160"), and one Gedonia review that mentions the Erenshor demo.

Conventions:
- Every quote is copied verbatim. Where the Steam API mangled curly apostrophes or quotes, I normalised them to straight ones and changed nothing else.
- Quotes marked **[auto-captions]** are YouTube automatic captions. The words are what the recogniser heard, so the name "Erenshor" often comes out as "Aaron Shore", "air insure" and similar.
- Steam news links follow the pattern `https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/<gid>`. Only the gid and date are given below. Tag **N:<gid>** means that announcement.

---

## 1. What Erenshor is

| Fact | Source | Verbatim |
|---|---|---|
| Developer / publisher | Steam appdetails API, https://store.steampowered.com/api/appdetails?appids=2382520 | `developers ['Burgee Media']`, `publishers ['Burgee Media']` |
| Steam app id | https://store.steampowered.com/app/2382520/ | app id **2382520** |
| Early Access release | same API | `'date': 'Apr 14, 2025'` |
| Leaving Early Access | store page, EA block | "Leaving Early Access: 2027" · "The plan is for Early Access to go on for approximately 18 months." |
| 1.0 target (press summary) | MassivelyOP 2026-07-18, https://massivelyop.com/2026/07/18/erenshors-solo-dev-discusses-retention-issues-the-use-of-llms-and-the-mmo-sims-path-to-1-0/ | "the 1.0 launch set for Q2 2027 will add more raids and another new class" |
| Free demo | Steam news N:5159491482915532505 (2023-09-09) | title: "Erenshor free demo now live!" |
| Solo developer | Steam news N:1816849002021362 (2025-11-24) | signed "Brian "Burgee", and all the SimPlayers. Especially Scrubby." |
| Current build started | N:1829528821318024 (2026-04-14) | "Today's version of Erenshor was begun in 2021." |
| Engine: **Unity** (inferred) | CustomSimFramework source, https://github.com/PuzzelPiece/CustomSimFramework (Code/SimTemplateBuilder.cs) | `using UnityEngine;` · mods require "BepInEx 5.4.23.5" (Thunderstore). No official engine statement found. |
| Reception | Steam reviews API query_summary (pulled 2026-10-08) | `'review_score_desc': 'Very Positive', 'total_positive': 1966, 'total_negative': 114, 'total_reviews': 2080` |
| Design pitch | store, About | "Erenshor is built from the ground up to be a single player experience." · "Grow together as a 'server' in order to defeat Erenshor's toughest opponents" |

---

## 2. SimPlayers: what they do and how they decide

### 2.1 Population size and composition

- **About 100, then 120, then 145, then a player-set slider (recommended 180).**
  - "The "SimPlayer" server population is over 100, with many more to come." (N:5510784213117607147, 2024-01-24)
  - "SimPlayers are more performant. In the full build this means more online (We're up to around 120)." (N:1793384379360597, 2025-03-06)
  - "SimPlayer population increased to approximately 145 players" (v0.2 notes, N:1811138915500486, 2025-09-22)
  - "Players can increase server population on Admin Panel on main menu" · "Increase to add Reavers. Recommend a minimum of 180 total." (v0.3, N:1823191198611560, 2026-02-02)
- **Twelve hand-authored "fixed" sims plus about 130 generated from pools.** Wiki, https://erenshor.wiki.gg/wiki/Simulated_Players:
  - "These simulated players (SimPlayers) are considered fixed or unique, they will always be the same class and have the same personality no matter which real user has generated them upon game launch."
  - The fixed sims are Jethro, Phanty, Brock, Dancer, Baetil, Cyndara, Leliril, Behox, Blademann, Eron, Scrubby and Sparkles.
  - "These simulated players are randomly generated down to the class, faction and personality, no two real players games will be the same in regards to these sim players."
- **Some sims were written by community members.** "a lot of folks have bought the tier where you can write and create your own simulated player for everyone else to play with" (**[auto-captions]**, 2024 update video, https://www.youtube.com/watch?v=8qslgMBOUe8)

### 2.2 What they do on their own

| Behaviour | Verbatim + source |
|---|---|
| Level up, find loot, trade, join guilds | "These players will level up alongside you (whether you're online or not), they'll find new items on their own and they'll find them with your help. They'll ask for loot drops, they'll buy and sell loot, join and leave guilds, and even invite you to raids as they get to know you. They'll remember you and how you treat them." (store page) |
| Talk, bicker, group | "Simulated Players are coming to life! They talk, bicker, request to buy items. They can group with you, invite you to things or respond to your invites. They really add a great feel to the game in general even if you're not interacting with them." (N:5124584686244691447, 2023-07-27) |
| Camp spawns and compete for XP | "the simulated players do go after XP um so you will come on spawns that you're hoping to Camp already being camped sometimes" (**[auto-captions]** "Meet the Simulated Players", https://www.youtube.com/watch?v=CDfaLdwcYRg) |
| Scatter after a group disbands | "they will all go off their own way to do whatever they're gonna do some will group with each other some will work on quests it's just a matter of what their goal is at that time while you're playing" (same video) |
| Group organically, camp spots | "SimPlayers are more likely to group together organically in the world" · "Groups of SimPlayers are more likely to camp established camp spots instead of flooding zones" · "Reduced frequency of lone, reckless SimPlayers charging solo into high-end zones" (v0.3, N:1823191198611560) |
| Form guilds as they level | "As Sim players level up, they will begin to break off and form their own guilds. And as you can see in this clip, if they like you enough, they will invite you to join as well." (**[auto-captions]** v0.3 preview, https://www.youtube.com/watch?v=DuMvfWuBiS8) · "Guilds will naturally form and populate over time." (v0.3) |
| Guild quests (want to be present for the drop) | "Guildmates can issue guild quests requesting help for obtaining specific items" · "They prefer to be present when the quest item is acquired" (v0.3) · "However, the Sim players are always happier when they get to participate in finding their own items." (**[auto-captions]** DuMvfWuBiS8) |
| Guild chat conversations on a timer | "Conversations that guild sims start and carry on their own, on the guild chat timer." · "At 1 that's roughly every 2 to 4 minutes." (CustomSimFramework, https://thunderstore.io/c/erenshor/p/TeamSaltyBois/CustomSimFramework/) |
| Fake demand spam ("WTB") | Hardcoded template `"WTB <item>, offering <gold> gold. Open a trade with me."`, source `SimPlayer.DoWTBSpam`, "random item from ItemDB" (CustomSimFramework repo, Code/Packs/CATEGORY_REFERENCE.md) |
| Auction house as sellers and buyers | "Simulated players list items at a significant mark up, typically ranging from 4-6x the buy price listed on the tool tip based upon their greed values." · "Simulated players gain money by fighting in the world and selling items of their own." (wiki, https://erenshor.wiki.gg/wiki/Auction_House) |
| Gear progression | "SimPlayers will acquire their own Sivakruxes and Planar stones, rate of acquisition will probably need tweaks" (N:1798454487670483, 2025-05-03) · "SimPlayers will begin to fill in any absurdly low gear (im talking a level 12 with cloth armor) with more level appropriate, but still upgradable gear." (N:1797820624439182, 2025-04-24) |
| Plan ahead (spells) | "SimPlayers now have gotten better at planning, and they've pre-bought their spells so when they level up they'll have them at their disposal immediately." (N:1811772772284196, 2025-09-26) |
| Shop on their own in town | "when you enter Port Azure with a party, they will disperse and do their own shopping." (**[auto-captions]** Summer 2026 video, https://www.youtube.com/watch?v=SmWc_3G6igo) · "SimPlayers now use food and water" (N:1837955055363541, 2026-07-13) |
| Raids | "3 groups can join in on the raids, totaling 15 players (14 simplayers + player)." (raid FAQ, N:1832065502824716) · "your entire guild will show up to the reliquary where you summon them [music] because everybody wants to go." (**[auto-captions]** SmWc_3G6igo) |
| Rivalry | "There is a "Friends Club" guild: A snobby guild that will not group with the player and will try to compete with you." · "The Gods of Erenshor will periodically challenge players to slay a randomly selected mob. The Guild(s) who do this will gain rank. "Friends Club" will regularly compete against you for this challenge." (v0.3 notes, N:1821922921823845) |
| Leaving and joining guilds | "If they like you enough, they'll even leave their existing guild to join yours. Friends' Club members are an exception; they will not leave their guild for yours, nor party with you." (wiki, https://erenshor.wiki.gg/wiki/Guild) |
| Recruit drives | "This will spam a shout to whatever zone you're in and tempt other SimPlayers to join your guild. You'll have more success with a higher guild rating" (N:1838407329254304, 2026-07-15) |
| Answer questions from data | "SimPlayers answer questions in /say, /shout, and /guild regarding items, quests, mob locations (WIP)" (v0.3) · "made possible by the creation of a "game knowledge database" which is built at runtime, and may increase initial game load time by ~5 seconds" (N:1821922921823845) |
| Simulated GM / rules | "If you exploit NPC pathing or if you say rude things to Sim players, they will report you to a simulated GM who will come and ask you to stop." (**[auto-captions]** DuMvfWuBiS8) · "In-game GMs now exist and roam the world" (v0.3) |
| Cheat a little (feels human) | "You'll see SimPlayer duelists use Backstab at level 6+. This skill is not available for purchase on the Island. The SimPlayers are cheaters." (N:1793384379360597) |

### 2.3 How they decide

- **No LLM: state machines and decision trees.** "*Note that SimPlayers do not use LLM or any other emerging AI model. They are run by a mixture of state machines and decision trees. This means no token fees, and no lapse in service after a certain amount of use." (store page)
- **Group combat is explicit rules attached to roles** (Main Tank, Main Assist, Healer, Crowd Control, Puller). Examples:
  - "Main Assist (MA): SimPlayers will always target whoever the MA is targeting." · "If the MA dies, the SimPlayers will announce a new, temporary MA in group chat." (N:1795283637819795, 2025-03-27)
  - "-if target is > 4 levels above SimPlayer, do not use major damage spells until it is at <95% life" (N:1798454487752534, 2025-05-06)
  - "SimPlayers will no longer cast DOT spells on full health mobs." · "SimPlayers will not pull if they're out of mana." (N:1790214123182064, 2025-02-02)
- **The player commands them by chat keyword.** "careful / cautious - reduces SimPlayer aggro range to 6 meters" · "aggressive / burn - reverts SimPlayer aggro range to the default 32 meters" (wiki, Simulated_Players)
- **Personality comes from a few numbers plus voice.** The decompile-based schema in `Code/Data/SimDefinition.cs` (https://github.com/PuzzelPiece/CustomSimFramework) describes every field:
  - `SkillLevel = 40f; // observed vanilla range ~0-65`. The developer describes the same idea: "depending on that simulated player's given skill level they'll use that knowledge to some level of Effectiveness" (**[auto-captions]** 2023 recap, https://www.youtube.com/watch?v=8b0JnRzOBPQ).
  - `PersonalityType`: "Set 1 nice / 2 tryhard / 3 mean to choose (4-5 = plain, no bio pool)."
  - Live dials: Patience "LIVE (dead-in-group nag interval etc.)"; GearChase "LIVE (copied to the body at spawn)".
  - Greed: "Greed's real meaning is auction-house pricing, not loot appetite."
  - **Goal dials that are declared but unused:**
    - LoreChase: "DEAD: stored in tracking, never read by the game"
    - SocialChase: "DEAD: stored in tracking, never read by the game"
    - DedicationLevel: "DEAD: stored in tracking, never read by the game"
    - Troublemaker: "DEAD: read only on live bodies, but never copied to them"
  - Typing quirks: `TypesInAllCaps`, `TypesInAllLowers`, `TypesInThirdPerson`, `LovesEmojis`, `TypoRate` ("per-word roll vs 150 (vanilla sims use 0-10); the LIVE typo dial"), and `SignOffLines` ("occasionally appended to messages (~10% chance)").
  - Each sim has 35 dialogue lists (Greetings, Died, WantsDrop, InsultsFun, LFGPublic, GoodLastOuting, BadLastOuting, BeenAWhile and so on).
- **The developer's framing of personality is written dialogue, not generated behaviour.** "they all have dialogue that's specifically written for them and their personalities you may have the friendly player who's always looking to help you may have the player who's constantly watching YouTube on the other monitor and will wipe your raid over and over again" (**[auto-captions]** 8b0JnRzOBPQ)
- **Responses are probabilistic, which avoids a whole crowd answering at once.** Wiki, Simulated_Players:
  - "Generic LFG has a 20% response rate, but naming a specific SimPlayer guarantees a response"
  - hello: "40% will respond, or 100% if you name them specifically"
  - ding: "SimPlayers may congratulate you (40% chance for normal SimPlayers, 50% for troublemakers who may respond sarcastically)"
- **Level coherence gates both grouping and knowledge.**
  - "SimPlayers will only accept if they are within 3 levels of you." (wiki)
  - Guild topics: "`RequiredLevelToKnow` is the **level coherence dial**. Sims can only OPEN a topic if they're within `ReqLevel-2 .. MaxLevelToAsk`" (CustomSimFramework, Code/Packs/README.md)

### 2.4 Do they live when the player is not near? Partly, and mostly not in real time

The mechanism, pieced together from the sources:

**(a) A data roster for everyone, bodies only in the player's zone.**
- "In the world, a custom sim is exactly one more sim in the roster. The cost only materializes when the game spawns them near you, the same as any vanilla sim." (CustomSimFramework, Thunderstore)
- Pipeline named in source: "registers it in SimPlayerMngr.ActualSims, the same list the game's own pre-authored sims live in. From there the vanilla pipeline handles everything: save data creation (ESSaveData/Sims<Name>), roster tracking, zone placement, spawning" (Code/SimTemplateBuilder.cs).
- The roster-side record is `SimPlayerTracking`, and the body is spawned by `SimPlayerTracking.SpawnMeInGame` (patch list, Thunderstore).
- The Group Builder lists every sim with "the zone they are currently in" (wiki). So zone placement exists as data. Whether unspawned sims move between zones during play was **not found**.

**(b) Off-screen progress is a catch-up at session boundaries, not a continuous simulation.**
- "Every time you log out, there is a minimum of 6 hours of simulated activity generated. If you are logged out for more than six hours, it will simulate the entire duration you were offline. This keeps the game world active by progressing SimPlayers auctions, gearing and leveling even between sessions." (wiki, Simulated_Players → World Progression)
- "The vanilla system grants simulated players most of their levels in abrupt bursts each time you log in, depending on which slot the sims are assigned to." (Sim Passive Leveling Overhaul, https://thunderstore.io/c/erenshor/p/TeamSaltyBois/SimPassiveLevelingOverhaul/)
- "Keep in mind that rival sims gain levels on login." (Sims Start At Level 1, https://thunderstore.io/c/erenshor/p/TeamSaltyBois/SimsStartAtLevel1/)
- The developer tuned it as a capped batch:
  - "SimPlayers are limited to a maximum of 2 items gained between play sessions (up for further tuning)" (N:1797185861610385, 2025-04-16)
  - "SimPlayers will level slightly faster between sessions to keep up" (N:1796631172417145)
  - "Adjustments to the quality of gear SimPlayers get between sessions (much more in line with level)" (N:1797185861671306)
- The auction house also settles at boundaries: "You can try disconnecting and logging back in to simulate six hours of time passing to improve sell rates" (wiki, Auction_House).

**(c) Progress is anchored to the player ("tethered").**
- "Each SimPlayer is bound to a character slot, which makes their progression roughly match the character in that slot." (wiki)
- "/friend ... rebinds them to your current character, ensuring that they will always be at a close enough level to group with them." (wiki)
- "SimPlayers will no longer out-level you in the same party" (N:6148070194801613346, 2024-11-08)
- Slot values from the decompile: "0-10 = progression follows that character slot. 12 = light daily bump. 99 = independent (rival-rate catch-up + faster gear chase)". Rivals: "the game forces those to 99 every login" (SimDefinition.cs).
- In the demo this behaviour was switched off: "SimPlayers in the demo should not have been 'self progressing' but they were." (N:1786573930915620, 2024-12-28)

**(d) The world stops when you log off.** A player put it this way: "Because everything is simulated, once you log off, the world and game doesn't just keep moving on without you, so you never fall behind and you never feel rushed to get anything done." (review, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
The developer, on the world being static: "Aaron sha is a relatively static world and the player's character is not a hero he's just a person living in the world so his ability to make changes will be minimal" (**[auto-captions]** 8b0JnRzOBPQ).

### 2.5 Memory of the player and relationships

- **Episodic memory (since 2025-07-02).** "Our SimPlayer friends are less goldfish than before!" · "SimPlayers will remember your last outings, or if they haven't seen you in a while, or if you shared the loot! They're more likely to refer to previous adventures when greeting you or when you greet them." (N:1803527891703578)
  - How it is put together, from the decompile docs: `<Greeting>! ` then optional memory segments: `<BeenAWhile>` or `<ReturnToZone> <zone>! <Good/BadLastOuting> <GotAnItemLastOuting> <item>.` (CustomSimFramework, Code/Packs/README.md)
- **Numeric favour (since 2025-11-14).**
  - "your SimPlayers now keep a more accurate running (numerical value) memory of how much they like you."
  - "You gain favor by grinding xp and sharing loot"
  - "You lose favor by kicking them from a group while they're dead, failing to invite them when they show up, and by hogging too much loot."
  - "These numbers will be used for guild logic and other things" (N:1816307528954983)
- **Favour gates guild membership.** "Invite SimPlayers to your guild. They want to "know" you first, so take them out XPing if they aren't sure. Awarding them loot they want helps too." · "You can /friend then to lower the threshold to join" (v0.3)
- **Small grudges.**
  - "Inviting a SimPlayer to group and then not inviting him when he arrives will annoy them" (N:1795917897485504)
  - "If you curse or are rude to a SimPlayer, they may block you from sending them further tells. They will automatically unblock you after a few minutes."
  - "sorry - ... This clears their memory of being abandoned" (wiki)
- **Relationships between sims** are limited to guild membership, the antagonist guild and guild-chat conversations. Pairwise sim-to-sim opinions are claimed on the store page ("their own opinions of you and of the other players"), but **no mechanism for them was found**.

---

## 3. Developer statements: architecture, tricks, limits

**Why no LLM** (**[auto-captions]**):
- "even the computer I'm developing a and shuron probably would not be able to run a large language model and the game at the same time without Major Performance issues" (8b0JnRzOBPQ)
- "everything's custom written all of the game content is familyfriendly and I can guarantee that because I wrote all of it" (8qslgMBOUe8)
- MassivelyOP's summary of the 2026 Reddit post: "he feels the tech isn't ready and that AI's operation is unethical, low quality, expensive, and unreliable." (MassivelyOP 2026-07-18). This is the journalist's paraphrase; the original Reddit post could not be fetched.

**Autonomy target:** "the sim players should be relatively autonomous. You're going to give them direction and tell them what they should be doing, and they should execute it without a ton of micromanagement from you." (**[auto-captions]** SmWc_3G6igo)

**Tricks that make them feel like players** (all from patch notes):
- Typed chat with personal quirks, typos and sign-offs (see 2.3).
- Ambient zone shouts: "Ambient shouts for each zone. Lines ending in a question mark can get yes or no answers from other sims nearby." (CustomSimFramework)
- "SimPlayers may send a tell to alert you if they've been attacked while traveling to your group" (v0.3)
- "SimPlayers in your group will wander around a bit and reposition themselves while idle" (v0.3)
- "SimPlayers far below your level will compliment your gear sometimes" (N:1790214123182064)
- Asking for drops: `WantsDrop` lines; "SimPlayers will now consider their currently stored items when asking for an upgrade. ... (They still ask for nonsense sometimes)" (N:1798454487618773)
- Unique death lines: "SimPlayers now have unique dialog lines for when they die and are awaiting a revive." (N:1793384379360597)
- Leaderboard-like social surface: "Guilds now appear in /who" · "Rank calculation: Roster Strength (your top 15 only) + world achievements" (v0.3), plus a deliberate catch-up item: "an item that will bring down all Guild Rankings, allowing for a "catchup mechanic"." (v0.3)
- Fiction of a server: "Erenshor's 'servers' will never be shut down, because they don't exist." (N:1816849002021362) · a "Server Admin Panel" for XP, HP, loot and population (N:1802354289701672)
- Bugs played as authenticity: "SimPlayers running in place / lagging: as authentic as this is it's (usually) not intended." (N:1796631172417145) · "It's against Erenshor's non-existent TOS for them to ditch you." (N:1826992588602814)

**Performance and engineering limits:**
- Population costs load time and frame rate: "(Increases load times and possibility of low frame-rate in some crowded areas)" (N:1821922921823845)
- "SimPlayer gear loading spread across frames for smoother zone entry." (v0.2, N:1811138915500486)
- "Optimizations to SimPlayer scripts for performance" (N:1796631172350948)
- Exception that bypasses the cap: ""Friended" SimPlayers will always load into game, despite server population settings" (v0.3)
- Mod authors say the work is placed at load boundaries: "Framework work happens at load boundaries, inside load screens you're already waiting on." (CustomSimFramework)
- **Navigation is the chronic cost:**
  - "SimPlayers are also still occasionally wandering off or falling off of the navmesh and getting stuck. This is a "most wanted bug" at the moment." (N:1799088287972965)
  - "It's like training cats with these SimPlayers..." (N:1797185861766692)
  - Fix pattern: "Their new method requires them to sample a valid navmesh from the player's position, or else they'll pause their following until the player is back on valid ground." (N:1795283637819795)
- Awareness radius:
  - "There was an edge case where a mob could spawn within your SimPlayer's area of awareness, but out of line of sight." (N:1825093633183744)
  - "This keeps all SimPlayers in range of eachother for heal detection and other awareness." (N:1838407329269415)
- **Persistence: one save file per sim.**
  - "SimPlayerDataManager.SaveAllSimData — Prefix ... Fires at every save point: zone changes (including teleports), logout, quit, respawn." (Sim Passive Leveling Overhaul)
  - "The auction house rereads every sim's file with no error handling" (same)
  - "The game's SimPlayerDataManager.SimPlayerData list is never cleared. Every login APPENDS a freshly-read record per sim" (CustomSimFramework, SimTemplateBuilder.cs)
  - Developer: "a rare save / load sequencing issue that could cause SimPlayers to lose ascensions" (N:1838407329255723, 2026-07-16)
- Saves are moddable by design: "I've left save files unencrypted and the curious user may uncover some Developer Commands in the game too." (N:1802354289701672)

---

## 4. What players praise and criticise

Base: all 2,080 English Steam reviews (1,966 positive, 114 negative). Each quote is a sentence copied from the review.

**Praise:**
- "i was blown away when i saw a party of simplayers camping a spawn!!" (155 helpful, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "The world is alive with Simplayers (AI-driven characters that simulate a real server), shared across all your alts, and it's wild how much this adds to the immersion." (126, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "They remember and mention past events." · "Bots will comment on gear you wear." (60, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "Told a sim player to get ****ed and they blocked me." (45, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "Though saying "Hello" in guild chat and having 150 or bots say hello back felt special." (15, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "Building a guild bit by bit and poaching players from other guilds is another fun goal." (15, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "I love jumping on and seeing sim'd players I grouped with are around, looking for a group, and have progressed since I played last." (13, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "The Sims are simple but I still find myself getting attached to my regular party and guild members since they're always saying this or that or asking for help acquiring an item." (12, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)

**Criticism:**
- "While the concept of SimPlayers is interesting, in practice they feel much more like traditional NPCs than actual simulated players. They don't meaningfully quest or progress through content; they mostly just exist in the world and wander around. Because of this, the illusion of a living MMO breaks fairly quickly." (56 helpful, negative, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "Sims definitely don't seem to have much agency and do seem to just sorta run around on predefined paths. Maybe give Sims some goals?" (32, negative, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "Where are the sim players?" · "I would sometimes see sims standing outside a dungeon later on but they seemingly never went in." · "The game would do well with some drama between the sims and the player IMO." (90, positive, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "repeating limited dialogue until they start feeling more like lifeless scripts than companions and not to mention them just ♥♥♥♥♥♥♥ running to point A to point B." (6, 301 h, negative, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "If you ask the world, your guild, your party, local chat, anything, that it doesnt know about, instead of responding, instead of any inane bable that a random mmorpg server would serve up, silence." (8, negative, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "The "AI" partners are just scripted events, they will say the same 10 lines over and over" (8, negative, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "Very slow game pace, impossible to continue without simplayers, and when partied with simplayers they do 100% of the work" (8, negative, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- "The SimPlayers could use a little more depth. It could even be simple, like one is always fishing even when they group with you, or one occasionally pulls trains of 20+ mobs across the zone." (23, positive, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/)
- Chat noise: "pushed off the page by the Simplayer chat spam" (13, negative, https://steamcommunity.com/profiles/<steamid>/recommended/2382520/). The developer added filters for this: "(On by default) you can now toggle "WTB" spam in chat." (6/25/25 notes, N:1803527891482062)

**Pattern across the reviews:** players praise what sims say, remember and do in the player's own zone (camping, chatter, memory, guild poaching). They criticise the lack of visible goals and of off-screen consequence: no dungeon presence, wandering, a finite set of lines, and silence on unknown topics.

---

## 5. Transferable patterns for a medieval-village "MMO of autonomous subjects" — **SYNTHESIS (mine, not sourced claims)**

The pattern name comes first; the Erenshor evidence it rests on follows.

1. **Two-tier existence.** Every subject is a cheap record (name, class/role, level, wealth, favour, zone, last-seen). Only subjects near the player get a body. Erenshor: roster vs `SpawnMeInGame`; "cost only materializes when the game spawns them near you". For Medieval Dynasty this means villagers and NPCs of other villages exist as rows, and only the local valley is embodied.
2. **Off-screen life as a batch at boundaries.** Resolve elapsed time when the player logs in, sleeps, changes zone or passes a season, with a cap per batch. Do not tick unseen bodies. Erenshor: login catch-up, "minimum of 6 hours", "maximum of 2 items gained between play sessions".
   - Caveat for the owner's "the world lives without the hero": Erenshor's batch is anchored to the player (slot tether, no out-levelling). A Rangers-like world needs the batch to run on world rules, not on player level.
3. **Visible goals beat hidden goal dials.** Erenshor declared LoreChase, SocialChase and DedicationLevel and never read them, and players complained of "no agency". Each goal must produce something the player can observe: a camp, a trade post, a recruit shout, an "I'm going to X".
4. **Voice is the cheapest personality.** Combine a personality type (nice / tryhard / mean), 2–3 live numeric dials (greed → prices, patience → nag interval, gear-chase), typing quirks and pooled lines. In a medieval setting the chat channel would be gossip, market cries and tavern talk.
5. **Memory as a short structured record surfaced by a greeting composer.** Store last outing (good or bad), item given, place, and time since. Add one numeric favour that gains from sharing and helping and loses from abandoning, hogging or being kicked. Gate social actions (joining a guild, a household, a work crew) on that favour.
6. **Institutions emerge from aggregates.** Guilds form as members level. Rank = strength of the top 15 + event wins. Add one antagonist institution that levels faster (Friends Club, rival speed ×1.25 in the mod). Add a "catch-up" lever so the leader does not lock the race. A medieval equivalent is villages or houses ranked by roster and deeds, a rival lord, and a bad harvest acting as the catch-up.
7. **World events as races.** "Spirits/Gods of Erenshor" periodically pick a target, and guilds race for it. The bookkeeping is cheap and creates rivalry without combat AI. A medieval equivalent is a bounty on a wolf pack or a royal commission.
8. **An economy you can believe from three numbers.** Per-subject greed sets the price multiplier. Subjects earn money from their activity. Sales are settled at boundaries. Fake demand ("WTB <random item>") makes the market feel crowded.
9. **A knowledge base derived from game data.** The game's own databases are indexed at load so subjects can answer "where does X drop/spawn". Answers are gated by the subject's level or role (`RequiredLevelToKnow`). For Medieval Dynasty, recipe and resource tables become villager know-how.
10. **Probabilistic chorus.** 20–40% of subjects respond to a broadcast, and a named one always answers. This prevents a choir effect at no cost.
11. **Authored named subjects plus pooled generated ones.** Twelve hand-written premades carry the memorable stories (Jethro, Scrubby); about 130 are generated. Content stays data-driven (JSON packs), so others can add subjects.
12. **A population knob with an honest cost note,** plus an "always load my friends" exception.
13. **Commands by natural-ish keywords and roles** (MA, puller, CC → foreman, hauler, guard). The subject runs a role state machine. The player gives direction, not micromanagement.

---

## What I could not find

- The full text of the developer's Reddit AMA (r/pcgaming/comments/1v4f1te) and of the "Planar March" Reddit post (r/MMORPG/comments/1uy4w5j). Reddit refused direct fetch, and the mirrors sit behind an anti-bot challenge, which I did not bypass. Only MassivelyOP's secondary summary is used.
- Whether unspawned sims move between zones or fight during play. The roster stores a zone, but no source describes real-time off-screen ticking. The mod's "Passive XP stacks with whatever sims earn from their own kills out in the world" refers to spawned sims.
- Any mechanism for sim-to-sim opinions or relationships beyond guild membership and the rival guild, although the store page claims sims have opinions "of the other players".
- Any per-sim leaderboard (as in Space Rangers). There are only guild rankings, `/who`, `/all players` and a DPS meter.
- Hard performance numbers (ms per sim, maximum population tested). Only qualitative warnings exist.
- An official engine statement. Unity is inferred from mod source and BepInEx.
- The decision-tree structure itself, i.e. which states and transitions exist. Only behaviour notes and field names surfaced; no source repo for the game.

---

## Essence (Pareto) — 20% of mechanisms giving 80% of the "living server" effect

Format: mechanism · why it scales · who proved it (source).

1. **Roster rows plus bodies only near the player** · cost grows with what is on screen, not with population (120 → 145 → 180+ on one indie dev's code) · Erenshor via CustomSimFramework "cost only materializes when the game spawns them near you"; population notes N:1793384379360597, N:1811138915500486, N:1823191198611560.
2. **Catch-up batch at session or zone boundaries, capped** · one pass over rows per boundary and zero per-frame cost; the cap keeps it believable · wiki "minimum of 6 hours of simulated activity"; N:1797185861610385 "maximum of 2 items gained between play sessions".
3. **Typed chat from pooled lines plus quirks plus a probabilistic chorus** · lines are data and the cost is constant per message; this is what reviewers quote most ("blown away", "150 or bots say hello back") · store "pre-written personalities"; wiki 20%/40% response rates; reviews above.
4. **A short memory record plus one favour number** · O(1) per subject and enough to produce "they remember me" · N:1803527891703578, N:1816307528954983; review "They remember and mention past events."
5. **Aggregate institutions ranked by simple sums plus periodic race events** · rivalry with no extra AI, since rank = top-15 strength + wins · v0.3 notes N:1823191198611560 / N:1821922921823845.
6. **One antagonist faction with a speed bonus** · a single flag turns the population into a competitor · "Friends Club" (v0.3); "Rival sims level roughly 25% faster" (Sim Passive Leveling Overhaul); rivals forced to slot 99 (SimDefinition.cs).
7. **Knowledge answers derived from game tables at load** · zero authoring per fact and ~5 s load cost · N:1821922921823845.
8. **Economy from a greed multiplier, activity income and fake WTB demand** · three numbers and one template make a "server economy" · wiki Auction_House; CATEGORY_REFERENCE.md `DoWTBSpam`.

**Over-engineering traps the sources warn about:**
- **An LLM per subject.** The developer rejects it for cost, hardware and content curation ("would not be able to run a large language model and the game at the same time"; "I wrote all of it"). Reviewers ask for one anyway, so expect that pressure.
- **Goal dials without a consumer.** LoreChase, SocialChase, DedicationLevel and Troublemaker were declared and stored but never read (SimDefinition.cs). The result is "no agency" reviews. Do not add a trait unless something visible reads it.
- **Moving many bodies on a navmesh.** This is the chronic bug source ("most wanted bug", "like training cats"). Keep off-screen subjects as rows, and make embodied ones degrade safely (pause rather than path into a void).
- **Abrupt catch-up bursts.** They break immersion ("abrupt bursts each time you log in", which motivated a whole mod). Smooth the batch or spread it.
- **Per-subject save files with no error handling.** These produced load hangs, lost ascensions and a list that is never cleared (Sim Passive Leveling Overhaul patch list; N:1838407329255723). Keep the save format simple, atomic and defensive.
- **Chat spam.** A chorus with no throttles drowns the player ("pushed off the page by the Simplayer chat spam"). Developer fixes: Local Chat tab, WTB toggle, probabilistic replies.
- **Illusion limited to the player's zone.** Reviewers notice sims never enter dungeons and only run "point A to point B". The cheap fix is visible traces of off-screen goals (reports, rumours, changed stock), not deeper simulation.
