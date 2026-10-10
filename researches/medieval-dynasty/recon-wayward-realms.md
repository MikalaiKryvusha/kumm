# Recon — The Wayward Realms simulation (2026-10-08)

> **For:** epic 15 "make Medieval Dynasty's world alive" (`living-world.md` §5a, owner's words about Wayward Realms, GPU and graph DB).
> **Method:** primary sources only — English auto-captions of OnceLost Games' own YouTube devlogs/podcasts pulled with `yt-dlp`
> (14 transcripts read/grepped), the Steam news API (full text of every Steam announcement), the Steam store API (store
> description), Wayback CDX for Kickstarter. Quotes below are verbatim from auto-captions (so spelling like "Vulcan", "Ijar" =
> Eyjar, "BGM" = VGM is the caption engine's, not mine). Timestamps let anyone re-check.
> **Bottom line:** the owner is right on both counts, and our own repo already had it once —
> `researches/svarogs-dream/living-world/02b_rpg_worlds.md` §1 and `ideas/02_conan_world_life.md` item 4 ("closed 09.09") quote
> the same devlog. The note in Game Of Dream 17 simply lost the URL.

**The primary source:** OnceLost Games devlog **"Foundations For A Living Breathing World"**,
<https://www.youtube.com/watch?v=nuNqB2450go> — announced on Steam 2026-02-20 ("Brand new DevLog available right now!",
<https://store.steampowered.com/news/app/1685310/view/517487250982830560>). Speaker for the NPC-texture and graph-DB parts
introduces himself at 04:50: "I'm Kai, the technical director on the Wayward Realms."

---

## 1. NPC simulation at scale (GPU, counts, what is simulated, near/far)

### 1.1 The "NPCs as an image on the GPU" mechanism — confirmed, verbatim

Source: <https://www.youtube.com/watch?v=nuNqB2450go> (17:46–22:32)

| Claim | Verbatim quote (timestamp) |
|---|---|
| Pixel position = NPC ID | "every single pixel in this image has two pieces of information. First of all, it has a location in this image" (18:03) · "that gives us a unique number for each one of these pixels. Which means they can all have a unique ID." (18:40) |
| The editor's NPCs live in that image | "all of those NPCs are already in the database, and this is why. Because we have this image of them." (18:53) |
| Colour channels = position | "have the red, green, and blue values correspond to X, Y, and Z coordinates." (19:16) |
| Float precision, Vulkan | "Because we are using Vulcan to process this image, that allows us to go all the way up to the millionth place in decimals. So, we go from 0 to 254.999999." (19:20) |
| Centimetre accuracy | "with a 500,000 square kilometer world, that means we can keep track of every single NPC all the way down to the centimeter." (19:35) |
| 1 M NPCs = one 1K texture | "this is just for a million NPCs. This would just be what's called a 1K texture, 1024 by 1024, which means that it is significantly lower resolution than what you would find on a rock in the game." (19:53) |
| Parallel per-pixel update | "GPUs is that they process every pixel in parallel, which means that we can process all of the movement of all of these individual NPCs individually and keep them in game live at all times." (20:15) |
| Spatial select as image op | "if we want to select all of the pixels that are a particular color of red, we can instantly do that." (20:36) |
| World event → range update | "let's say the head of a city dies, we can very, very quickly get all of the pixels that are within a certain RGB range of that location, and then update all of them in the database instantly." (20:50) |
| Rumour carriers | "you have a merchant that travels from one city to the next and as they're moving along any NPC that is within their range gets new information or new knowledge provided they talk to them. A rumor could potentially spread to an NPC if they believe it." (21:09) |
| Cost claim | "the entire world is running and moving at all times in the background while the game is running and it's doing so while using very very little processing power." (21:27) |
| Interaction without player | "They can interact with each other whether the player is nearby or not. So the world is constantly alive, constantly moving." (22:03) |
| Lives outside the engine | "we built this purely in Vulcan directly and it was more or less trivial to transfer over to the new engine because it's an external system that we can just easily hook into." (22:19) |
| What was actually shown | "these are all from Unreal Engine, but here's an one of the first images of having this implemented … at the time we rendered a bunch of spheres moving around" (21:39) |

`[AI]` Note on the numbers (my arithmetic, not their claim): 500,000 km² ≈ a 707 km square; with 8-bit colour a step would be
≈ 2.8 km, so the "254.999999" range means a floating-point texture, not an ordinary RGB picture. A 32-bit float has ~7
significant digits, so "centimetre" over 707 km is at the edge of float32 — plausible only with per-region offsets or wider
formats; they did not say which.

### 1.2 How many NPCs — the number grows release to release

| Date | Claim | Source + quote |
|---|---|---|
| Steam store (undated, campaign era) | "Big cities with hundreds or thousands of NPCs" | Steam store description via <https://store.steampowered.com/api/appdetails?appids=1685310> (page: <https://store.steampowered.com/app/1685310/The_Wayward_Realms/>) |
| 2025-10-17 | "our crowd system can currently keep track of several million NPCs in real time. Whether they're currently visible to the player or all the way across the world" | "An Honest Update" <https://www.youtube.com/watch?v=tgCyFyvicis> (07:38) |
| 2025-12-03 live AMA (uploaded 2025-12-09) | "our NPC system that can handle 10 million NPCs in real time. That's we built that. That's separate." | "Wayward Radio Ep 12: The 2025 LIVE AMA" <https://www.youtube.com/watch?v=gmFI2jJnjpw> (20:47) |
| 2026-02-20 | "this is just for a million NPCs" (the 1K-texture example) | <https://www.youtube.com/watch?v=nuNqB2450go> (19:53) |

### 1.3 What is simulated per NPC

- **Daily schedule, individually tracked, interruptible** — Yan (podcast "How AI Is Used In The Wayward Realms", 2025-05-27,
  <https://www.youtube.com/watch?v=ojBCo_vP9Ac>, 61:04): "Every single one of our NPCs will actually have a daily schedule and
  they'll walk around and everywhere. So that at any particular time you can go you can actually just track an NPC or whatever
  and they'll be exactly to sort of where their schedule is but their schedule can be interrupted changed maybe there's a
  festival".
- **Outfit by profession, status, season, workday** — <https://www.youtube.com/watch?v=tgCyFyvicis> (07:45): "their outfits
  can change depending on their profession, their social status, the time of year, and even whether they're going to work or
  have the day off."
- **Stats → job, personality, speech** — same video: "an array of stats that drives everything for how these NPCs actually come
  to be. So from there, their place in society, the job that they're capable of doing, their personality, their traits, and
  their speech are all determined." · "a fairly perceptive person might become a hunter."
- **Buildings by purpose, data-driven** — same video: "the purpose of every single one of these buildings is what's going to
  determine what is put there. And that is not random information."
- **NPCs trading and interacting** — AMA (<https://www.youtube.com/watch?v=gmFI2jJnjpw>, 21:12): the world database "logos …
  keeps track of NPCs interacting with each other and trading with each other."
- **Background world-scale things they say need GPU** — AMA (91:16): "You cannot simulate 10 million NPCs on the CPU if you
  want your game to run at more than 5 seconds per frame. Uh, you cannot simulate entire city states moving around and going to
  war with each other in the background. You cannot simulate the movement of a king's army. You cannot simulate storms across an
  ocean." (stated as plan: "that we are going to be running in the background at all times").

### 1.4 Level of detail — near field / far field

- **Three AI systems** — Yan, <https://www.youtube.com/watch?v=ojBCo_vP9Ac> (05:49): "we basically have three major systems of
  which the VGM is one part … our near field system uh which uh interacts specifically for um individual NPCs, what what they
  do, tactics, combat … And then we have the third system which is the farfield system which uh handles grouping and scheduling".
- **Far field is coarse; untouched NPCs stay at baseline** — same video (61:30): "that level of in simulation is not very uh
  it's very coarse in that sense. I mean each of them have that individual movement but … we can't simulate the outcomes of
  everything." · "it will not really deal with you know NPCs that are not being interacted by any of those systems. it won't
  change them from their baseline so to speak. Uh unless the VGM decides in this quest I need to pick someone and change them".
- **Deep simulation only where the player looks; world events/factions run regardless** — Victor, "Wayward Radio Ep 16: The
  Early Access Chat", 2026-04-28, <https://www.youtube.com/watch?v=Cv4ljhp503Q> (46:52): "we do have the world in the background
  being simulated to some extent. It's just not always really in-depth simulation. And for those really in-depth moments, that's
  when we do go like with what the player is going to see. With the exception again of world events and and faction stuff that's
  happening in the background cuz those do happen with or without you."

## 2. Graph database and world-state storage

Source: <https://www.youtube.com/watch?v=nuNqB2450go> (22:38–28:44) unless noted.

- **Built into the engine, for quests:** "we actually built directly into Realm Engine at this point is a graph database. And the
  reason that we have a graph database is for handling quests." (22:44)
- **World = tiles with IDs, like the NPC pixels:** "the entire world is represented in tiles and just like the pixels on the NPC
  texture, we have tiles that all have a unique X and Y coordinate, which means we can give all of them a unique ID." (23:52) —
  editor tiles: "Each of these tiles represents 10 square meters." (07:23)
- **Facts live in the graph until the player arrives (materialize on entry):** "in tile 568, which happens to be a patch of woods,
  we create some rum that is located there and we create some wolves … This just exists in the graph database and if the player
  goes over to tile 568, in addition to creating all of the trees, we create the case of rum and the wolves." (24:05)
- **Why a graph:** "it allows us to connect things via relationships that we can then query extremely quickly." (24:41)
- **Resolve history at materialization:** "we see that tile 568 already exists in the graph database, and we don't create wolves
  because they would get killed by bears, so we create wolf corpses." (25:07)
- **NPCs read the player's graph neighbourhood:** "whenever you talk to any NPC, the NPC can also get information based on this
  graph database and all of the things that the player is connected to. And thieves want anything of value." (25:31)
- **The player is not special:** "because the merchant is still rendered in the world the entire time, whether the player is
  nearby or not, they're not just enlisting help from the player because the player is not special." (26:01)
- **Storage growth handled by decay:** "how is this not going to take gigabytes of space if the player plays for a while? …
  there's nobody who thinks that the answer to that question is eternity." · "information expands and it contracts over time as
  the player moves through the world." (27:20–27:56)
- **Player-centred density:** "what the player is doing is the thing that is going to have the most connections in the graph."
  (28:01)
- **Reputation = walking graph edges:** "it parses that exact same graph database … as we walk all of those graph connections, we
  have a positive reputation with them." (32:56)
- **The world database has a name — "logos":** AMA <https://www.youtube.com/watch?v=gmFI2jJnjpw> (21:12): "our like dynamic world
  database which we call logos that actually responds to the things that the VGM is doing and and keeps track of NPCs interacting
  with each other and trading with each other."
- **Forgetting is a design rule:** Yan, <https://www.youtube.com/watch?v=ojBCo_vP9Ac> (63:07): knocked-over furniture in a
  lived-in house is back next day, in an abandoned one it stays — "you need to forget some things too in order for it to be
  realistic."
- **Modders get the database:** <https://www.youtube.com/watch?v=nuNqB2450go> (34:52): "Anybody who owns a copy of the Wayward
  Realms has access to not only the entire world database, but all of the game logic." (AngelScript, `main.as`).

Not stated anywhere I read: which graph DB product (Neo4j or home-grown), schema, query language. "Built directly into Realm
Engine" suggests home-grown.

## 3. The Virtual Game Master (VGM)

- **Public pitch** — Steam store description: "A virtual Game Master keeps things interesting for you, making other characters
  and their factions react and plot their next move based on your actions, resulting in no two players having the exact same game
  experience." (<https://store.steampowered.com/app/1685310/The_Wayward_Realms/>)
- **It is rules code, not an LLM** — Michael, <https://www.youtube.com/watch?v=ojBCo_vP9Ac> (04:03): "It is a system designed to
  observe the player observe the world state and also impact the player impact the world state … it is for the most part just
  standard coding … heruristics and logic and rules, if statements, else statements … reading databases, executing on databases".
  AMA (<https://www.youtube.com/watch?v=gmFI2jJnjpw>, 100:15): "the VGM is not an LLM."
- **What it reads** — AMA (100:46): "it's taking game variables and storing them and then reading them and occasionally feeding them
  possibly feeding you into an LLM" · for early access: "the VGM is going to be watching the player, watching the world state, and
  then putting in front of the player events."
- **What it decides — slot-filling templates** — AMA (≈101:40): "taking a bunch of elements that are standardized, mixing them and
  linking them together with game variable objects, right? Oh, we need an NPC. We use this NPC … we'll pick the skill from the
  player's high highest ranking skills … Build that into a … structure of connections on on a node graph … Drops that in".
  Yan (<https://www.youtube.com/watch?v=ojBCo_vP9Ac>, 22:45): "we have a database of quests and they they have certain inputs and
  outputs like kind of like puzzle pieces that can match together … Do we have a quest? Do we have a node? Do we have a subquest of
  that matches". Casting by tags: "I need someone who's a warrior and you won't cast like a villager for that role."
- **Memory of grudges → casting** — Yan (17:44): "maybe you screwed someone over and then … we kind of remember that as a piece of
  text and then … it might need to cast a character to be in one of the roles of the quest. It will then look at that and be like,
  'Oh, you screwed that one over. That's be a good nemesis.'"
- **Engineering view** — Kai, AMA (≈102:50): "a suite of tools and those go from um statistical analysis tools to data parsing tools
  to um like Quest and database state machine management tools and … some level of natural language processing tools" · "there's no
  point in the game where we just like generate an entire quest line from nothing … It all comes from game data. It comes from
  databases."
- **Dialogue = translation, not generation** — <https://www.youtube.com/watch?v=nuNqB2450go> (29:47): "we have the graph of
  fundamental game truth. And what we do is we run it through a natural language processing system … we build these very, very simple
  sentences and then we translate those into a more floral, expressive, personality-fitting, NPC-appropriate expression" · example
  core sentence: "Thieves want gold, give us rum, ignore the merchant." (30:53)
- **Other VGM decisions shown** — defeat outcomes: "Players can experience a variety of vanquished scenarios that the VGM will choose
  for them based on the context of their defeat." (<https://www.youtube.com/watch?v=tgCyFyvicis>)
- **Local LLM limits** — Yan (<https://www.youtube.com/watch?v=ojBCo_vP9Ac>, ≈39:59): "running on uh sort of a Vulcan back end …
  say you're running a 1060, which is our minspec … feed off back into the CPU mode, in which case you can still do the C uh the quest
  parsing stuff, but the real-time like dialogue curling … might be disabled … above like 8 gigs of VRAM, you can probably run the 4
  billion parameter model. And then if you're above 11, you can probably run the 8 billion parameter model". Michael (37:33): "this
  LM is going to be sitting on people's computers. This isn't going to be a cloud thing."

## 4. Pitfalls, limits, engine, status

- **Unreal could not host the crowd sim** — <https://www.youtube.com/watch?v=nuNqB2450go> (22:09): "This was one of the things that
  we were never able to successfully implement within Unreal Engine anyway". AMA (<https://www.youtube.com/watch?v=gmFI2jJnjpw>,
  ≈21:40–22:39): systems were "already pulled out into pure C++" and "the only thing Unreal Engine was doing was like calculating <!-- claim-ok: video timestamp mm:ss, not a clock time -->
  some lighting and handling our textures and doing a little bit of animation stuff."
- **Engine switch** — Steam announcement 2025-12-01 "Transitioning Away From Unreal"
  (<https://store.steampowered.com/news/app/1685310/view/1817483467045970> via Steam news API): "we are fully transitioning away from
  Unreal Engine and building our own proprietary engine." Base: AMA (12:52) "the Wicked Engine, which uh we've announced is sort of
  our base um as well as what our fork of it". Engine name in devlog: "Realm Engine". Scripting: AngelScript (devlog 34:52).
- **GPU budget trade** — AMA (24:38): "this is one of the first games that has a split of resource use on a graphics card. We're not
  just using the graphics card for graphics. We're also potentially using it for AI system, NLP systems, other types of calculations."
  (91:52): emulating "a living city state in the background … is a worthwhile trade-off for us for the details of rocks in a cave".
- **Scope limits stated by them** — "we can't simulate the outcomes of everything" (Yan, above); consequence dial: "anyone you sight may
  very well just like you have like a whole like a whole lineup of bad guys lined up out the door … sometimes, you know, someone that
  you stole from is just someone that you stole from." (<https://www.youtube.com/watch?v=ojBCo_vP9Ac>, 60:20)
- **Demo honesty** — Kai, devlog (05:22): the systems are "not hooked up to any 3D assets. So, we can't show it in a way that is
  in-game". The GPU crowd was shown as moving spheres.
- **Status / schedule slips** — Kickstarter era: early access "toward the later part of 2025" (Steam announcement 2024-06-28); then
  "Our new target is to release to our Kickstarter backers in June of next year" (2025-12-01); then Victor, 2026-05-25
  (<https://www.youtube.com/watch?v=MEIBORTcAAc>): "we are looking at pushing the early access launch date back a bit … another two to
  three months … we did lose a key member". As of the 2026-09-29 podcast description (<https://www.youtube.com/watch?v=Umt5_atUs1s>)
  the call is still "KICKSTARTER: Reserve your early access now!", and the 2026-08-25 episode says "In the first days of Early Access,
  players will discover … Eyjar" (future tense); Steam store API: `"coming_soon": true`. **Nothing playable has shipped; every claim
  above is a developer claim with no independent verification.**

## 5. Transferable patterns for a UE4 mod (Medieval Dynasty) — `[AI]` synthesis, not their words

1. **Agents as a flat table, ID = index, position = 3 floats.** That is all the "image" is. At Medieval Dynasty's scale (hundreds,
   at most low thousands of villagers/travellers) a plain CPU array in Lua/C++ or a sidecar process is enough; the GPU trick only pays
   past ~10⁵ agents. Take the data shape, not the GPU.
2. **Sim outside the engine, hooked in.** Their crowd sim is "an external system that we can just easily hook into". For a UE4SS mod:
   world state + tick in a separate process (or a Lua module with no actor references), the game only queries/receives deltas.
3. **Tile-ID grid + fact store; materialize on entry.** Store facts per tile ("cart, rum, wolves"), not live actors; when the player's
   streaming bubble reaches the tile, spawn the *outcome* after resolving history ("wolf corpses"). This is the cheapest way to make
   off-screen events visible.
4. **Range query as the event primitive.** "All agents within R of X" → update knowledge/state. Same primitive drives rumours,
   raids, deaths, market news.
5. **Carriers spread news.** Traders/travellers walking between villages pass facts to agents they meet — information diffusion
   without a global broadcast.
6. **Two tiers.** Far field = schedule + coarse travel, near field = the game's own AI. Untouched agents stay at baseline; only
   agents touched by a quest/event/faction system diverge.
7. **TTL / decay on every fact.** Bears in tile 568 are not eternal; a lived-in house gets cleaned. Keeps storage bounded and the
   world readable.
8. **Graph for relationships, reputation by walking edges.** Player-centred: the player's actions create most edges; NPC dialogue
   and faction attitude query the neighbourhood.
9. **Director = rules over templates with typed slots.** Quest templates with inputs/outputs, cast NPCs/items by tag filter, grudges
   remembered as facts. LLM optional and only for paraphrase of a simple fact sentence.
10. **Second-order chains come from data, not scripts** (our epic's rule): their buildings and NPC jobs are derived from data ("not
    random information"); for Medieval Dynasty the recipe graph plays that role.

---

## What I could not find

- **Kickstarter update text** (e.g. "Production Progress", posts 4278299, 4441113, 4441522): Wayback has the pages (HTTP 200) but the
  body is client-rendered — no text in the HTML; live Kickstarter returns 403/429 to curl with a browser User-Agent.
- **Official site** <https://waywardrealms.com> did not answer (socket closed / no response).
- **Six later podcast transcripts** (Ep 10 "How Soon Is Now?", Ep 4, Ep 11, Ep 18, Ep 19, Ep 21): YouTube returned HTTP 429 for
  captions after ~15 downloads. Ep 10 (2025-10-28) may hold more crowd-system detail. `yt-dlp` here also needs `--no-plugin-dirs`
  (bgutil plugin/script version mismatch breaks it otherwise).
- **The 2022 "Devlog 1: World Generation Systems"** video (GameBanshee 2022-08-29) is not in the channel's current list.
- **Which graph DB** (product, schema), **what the far-field step does exactly** (pathing vs. teleport-by-schedule), **frame cost
  numbers** for the GPU crowd, **how NPC interactions are computed** on the GPU — none stated.
- **CUDA** — not said anywhere I read; they say Vulkan.
- **No third-party technical interview** (PC Gamer, RPS, GamesIndustry) about the simulation turned up; press only repeats the
  engine announcement and the store text.

## Sources

Primary (OnceLost Games):
- Devlog "Foundations For A Living Breathing World" (2026-02-20) — <https://www.youtube.com/watch?v=nuNqB2450go>
- Steam: "Brand New DevLog Out Now" — <https://store.steampowered.com/news/app/1685310/view/517487250982830560>
- "An Honest Update: Setbacks, Solutions, & What's Coming" (2025-10-17) — <https://www.youtube.com/watch?v=tgCyFyvicis>
- "Wayward Radio Ep 12: The 2025 LIVE AMA" (live 2025-12-03, uploaded 2025-12-09) — <https://www.youtube.com/watch?v=gmFI2jJnjpw>
- "Wayward Radio Ep. #5: How AI Is Used In The Wayward Realms" (2025-05-27) — <https://www.youtube.com/watch?v=ojBCo_vP9Ac>
- "Wayward Radio Ep 16: The Early Access Chat" (2026-04-28) — <https://www.youtube.com/watch?v=Cv4ljhp503Q>
- "An Important Announcement from Once Lost Games" (2026-05-25) — <https://www.youtube.com/watch?v=MEIBORTcAAc>
- "Wayward Radio Ep 17: Building Toward the Best First Experience" (2026-05-26) — <https://www.youtube.com/watch?v=bYlnzDTykJ4>
- "Wayward Radio Ep 20: The Cultures of Eyjar" (2026-08-25, description) — <https://www.youtube.com/watch?v=liy9w8cAki4>
- "Wayward Radio Ep #21" (2026-09-29, description) — <https://www.youtube.com/watch?v=Umt5_atUs1s>
- Steam "Transitioning Away From Unreal" (2025-12-01) — <https://store.steampowered.com/news/app/1685310/view/1817483467045970>
- Steam news API (all announcements) — <https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1685310&count=200&maxlength=0>
- Steam store page / API — <https://store.steampowered.com/app/1685310/The_Wayward_Realms/> ·
  <https://store.steampowered.com/api/appdetails?appids=1685310>
- Channel — <https://www.youtube.com/@OnceLostGames/videos>

Secondary (context only): Wikipedia <https://en.wikipedia.org/wiki/The_Wayward_Realms> · Tom's Guide
<https://www.tomsguide.com/news/wayward-realms-rpg-elder-scrolls> · PCGamesN
<https://www.pcgamesn.com/the-wayward-realms/new-engine-ditches-unreal-engine-5> · GameBanshee 2022
<https://www.gamebanshee.com/news/126753-the-wayward-realms-development-update-world-generation-systems.html>

Our own earlier copies of the same finding: `researches/svarogs-dream/living-world/02b_rpg_worlds.md` §1 ·
`ideas/02_conan_world_life.md` item 4.

---

## Essence (Pareto)

The 20% of mechanisms that give 80% of a living world, each one simple. Format: mechanism · why it scales · who claims/proved it.
Wayward Realms has **not shipped**, so for them read "claimed and demoed", not "proved".

1. **Flat agent table (ID = index, pos = xyz)** · one array, one loop (or one GPU pass), no per-agent objects · Wayward, devlog 18:03–20:24 (claimed 1 M / 10 M).
2. **Agents as data, actors only near the player** · cost of an off-screen agent is a few bytes · Wayward far/near field (Ep 5, 05:49); S.T.A.L.K.E.R. A-Life online/offline switch (our `02b_rpg_worlds.md` §2, not re-checked here).
3. **Schedules, not thinking** · a lookup by hour gives "where is X now" with no pathing for most agents · Wayward Ep 5 (61:04): "Every single one of our NPCs will actually have a daily schedule".
4. **Untouched agents stay at baseline** · only agents touched by a quest/event/faction diverge, so state grows with interaction, not population · Wayward Ep 5 (61:30).
5. **Facts per tile, resolve on materialization** · nothing ticks off-screen except facts; the outcome is computed once when seen ("wolf corpses") · Wayward devlog 24:05–25:17.
6. **Range query = universal event primitive** · one spatial select serves deaths, raids, rumours, news · Wayward devlog 20:50.
7. **Travelling carriers spread information** · diffusion is free side-effect of movement · Wayward devlog 21:09.
8. **Decay / forgetting (TTL on facts)** · bounded memory, readable world · Wayward devlog 27:20 ("nobody who thinks that the answer … is eternity"); Ep 5 63:07.
9. **Player-centred graph of relations; reputation = walk edges** · density goes where the player plays, not everywhere · Wayward devlog 28:01, 32:56.
10. **Director = rules over slot-typed templates, cast by tag** · authored content × systemic casting = variety without generation · Wayward Ep 5 (22:45), AMA 101:40.
11. **Simple fact sentence → optional paraphrase** · truth stays in data; the language layer is replaceable/optional · Wayward devlog 29:47 ("not generative in any way").
12. **Sim as an external service the engine hooks into** · survives engine changes; testable alone · Wayward devlog 22:19 (moved from UE to own engine "more or less trivial").

### Over-engineering traps the sources warn about

- **Simulating every outcome** — "we can't simulate the outcomes of everything" (Ep 5, 61:30); deep sim only where the player is (Ep 16, 46:52).
- **Unbounded memory of everything** — "how is this not going to take gigabytes …?" → decay (devlog 27:20).
- **Consequence inflation** — "a whole lineup of bad guys lined up out the door … someone that you stole from is just someone that you stole from" (Ep 5, 60:20): turn the dial down.
- **Generating content whole cloth with an LLM** — explicitly avoided: "there's no point in the game where we just like generate an entire quest line from nothing" (AMA 103:54); local models capped at ~8B and a 1060 min-spec falls back to CPU with real-time dialogue off (Ep 5, ≈39:59).
- **Personifying the director** — "we also kind of tend to personify it a bit too much … this is a system" (AMA ≈100:24).
- **Carrying a heavy engine you mostly bypass** — UE was only doing "some lighting … textures … a little bit of animation" (AMA ≈22:32); the crowd sim never worked inside UE (devlog 22:09). <!-- claim-ok: video timestamp mm:ss, not a clock time -->
- **Rendering fidelity vs. background sim** — GPU is shared; they trade "the details of rocks in a cave" for a living city state (AMA 91:52).
- **Rewriting the engine costs years** — early access slipped from late 2025 → June 2026 → "two to three months" more (2026-05-25), and is still "reserve your early access" on 2026-09-29. For a mod: never build infrastructure the host game already has.
