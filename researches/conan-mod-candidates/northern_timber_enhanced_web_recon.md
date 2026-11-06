# Recon — Northern Timber - Enhanced 4.0.2 (web)

> **Created:** 2026-11-06 · **Parent:** the owner's chat request 2026-11-06 08:47 · **Status:** web recon done; pak-level check done 2026-11-06 09:09 +03:00 (no vanilla file overridden); the in-game table-merge log check waits for the owner's word · **Outbound:** —

Read-only web recon. Nothing from the mod was downloaded or run; no login; nothing posted. Steam pages were read through the public Workshop page, the public comment-render endpoint and the public `ISteamRemoteStorage/GetPublishedFileDetails` API (pulled 2026-11-06 08:50–08:53). Nexus was checked through the public Nexus GraphQL API (`api.nexusmods.com/v2/graphql`) because the Nexus website returns 403 to the fetcher.

## Sources

| # | What | URL |
|---|---|---|
| S1 | Workshop page, Enhanced item **3802299666** "Northern Timber - Enhanced 4.0.2" | https://steamcommunity.com/sharedfiles/filedetails/?id=3802299666 |
| S2 | Its change notes (2 entries) | https://steamcommunity.com/sharedfiles/filedetails/changelog/3802299666 |
| S3 | Its comments (49, all read) | https://steamcommunity.com/sharedfiles/filedetails/comments/3802299666 |
| S4 | Its discussions (0 topics) | https://steamcommunity.com/workshop/filedetails/discussions/3802299666 |
| S5 | Legacy (UE4) Workshop item **1928978003** "Northern Timber 3.0.16" | https://steamcommunity.com/sharedfiles/filedetails/?id=1928978003 |
| S6 | Legacy change notes (70 entries) | https://steamcommunity.com/sharedfiles/filedetails/changelog/1928978003 |
| S7 | Legacy comments (1,317, all read and grepped) | https://steamcommunity.com/sharedfiles/filedetails/comments/1928978003 |
| S8 | Old item 2855051043 "Northern Timber 3.0.0" (2022, file size 0, no tags) | https://steamcommunity.com/sharedfiles/filedetails/?id=2855051043 |
| S9 | Author's piece list (Google Sheet "Northern Timber Mod - Build Piece List") | https://docs.google.com/spreadsheets/d/1zcSDgTOWbnAxdU4U30MprvgYbi7gTj-bYRzQD4rjsDI/edit?usp=sharing |
| S10 | Author's direct-download link for 4.0.2 (viewer page title only read) | https://drive.google.com/file/d/1fZpbAS3FRkigrPqg3cCygMpqFoehh2K1/view?usp=sharing |
| S11 | Author's other Enhanced mod "Sand and Stone - Enhanced 4.0.2" (3744894329) | https://steamcommunity.com/sharedfiles/filedetails/?id=3744894329 |
| S12 | Author's Discord (from S1, not visited — needs login) | https://discord.gg/d2SY2HR |
| S13 | Nexus Mods — `conanexilesenhanced` (56 mods) and `conanexiles` (98 mods), full lists via GraphQL | https://www.nexusmods.com/conanexilesenhanced · https://www.nexusmods.com/conanexiles |

Author: **shogakusha** (the same creator owns S1, S5, S8, S11 per the API).

## What it adds

Four build sets, all the author's own pieces, per the description (S1):

| Set | Tier | Pieces (S1 description) | Pieces in S9 sheet | Notes (S1) |
|---|---|---|---|---|
| Northern Timber | T1 | 95 | 90 | "designed to be a better visual fit in the northern areas. It offers minor Cold Insulation. The set is designed to allow upgrade from Sandstone T1. Now includes a Snowy Thatch Roof option!" |
| Stockade | T2 | 61 | 56 | "can be used to upgrade from Northern Timber Tier 1" |
| Bossonian | T3 | 139 | 101 | upgrades from NT T1 and Stockade T2; "Now includes a Snowy Roof option!" |
| Murayama | T3 | 144 | 95 | "a cold weather couterpart to the original Yamatai set"; "does not include Wedge Foundation, Wedge Ceiling or Wedge Roof tiles by design"; 45° and shallow 26° roofs, half walls, half sloping walls, half stair |

- Totals: **439** pieces by the description, **342** rows in the author's sheet (S9). The sheet matches the old 3.0.0 description counts (90/56/101, S8), so it is likely stale; the description is the newer figure. The sheet also lists "Murayama Wedge / Murayama Wedge - alt", which contradicts the "no wedge" line — not resolved.
- Piece kinds in the sheet (S9): foundations, wedge foundations, walls, sloping/inverted/shallow-sloping walls, doorframes and doors, hatch frames and hatch doors, 2x2 gateways and gate doors, frames/windows, ceilings, pillars, stairs (incl. half and log stairs), thatch/tiled/shingle roofs in 45° and shallow pitch, rooftops/caps/junctions, awnings, snow variants, roof decorations, Bossonian Corbel, lattice panels; Murayama shoji, fusuma (Peacock, White Pine, Bamboo, Chrysanthemum, Cranes, Ducks, Fuujin, Raijin, Taiko …), noren curtains, Shikiri panel, Moon Gate.
- **New in 4.0.x — placeables moved from the author's Asshuri Treasures mod** ("which is not porting to Enhanced"), learned through the **'Murayama Timber Wright' feat** (S2, both entries; repeated by the author in S3 on 27 Oct): Yamatai Oil Candle, Yamatai Stone Lantern - small, Tetsubin, Chawan, Chasen, Chashaku, Yamamichibon, Natsume, Bed - Futon (Wave)(blue), Bed - Futon (Kikko)(yellow), Yamatai Candle Stand, Uwabaki Slippers, Irori (Stove), Nambu Cookpot, Ofuda, Yamatai Lantern - Standing, Yamatai Lantern - Hanging, Yamatai Bridge, Yamatai Bridge - Join (19 items) + **admin spawn only**: Meditation Stones. Author (S3, 27 Oct): "So you now have a Large freely placeable Irori, a smaller snapping Irori and the Nambu pot." — so the Irori counts as a stove and the Nambu Cookpot is a cooking item; whether they work as crafting stations (cooking recipes) is not stated — not found.
- **Feats / knowledge:** Legacy author statements (S7): "each build set in the Northern TImber Mod has its own Feat which must be learned. They should be 0 points to learn assuming you have the base game build tier Feat learned" (2021-03-11); "these are building pieces, should be crafted by hand in your inventory like base game building pieces (with the exception of the Iron Pickaxe which is the Blacksmiths bench)" (2022-05-06). Feat names seen in legacy comments/change notes: Northern Timber Wright, Northern Timber Roofer, Stockade Timber Wright, Stockade Timber Roofer, Bossonian Timber Wright, Bossonian Timber Roofer, Murayama Timber Wright, Murayama Timber Roofer (8). For the Enhanced build only **Murayama Timber Wright** is confirmed by name (S2); the rest are assumed carried over — not confirmed.
- **Tool:** legacy 2.2.5 change note (S6, 2 Nov 2020): "Introducing the T2 Iron Pickaxe. learned as part of the Northern TImber Wright Feat", crafted at the Blacksmith's bench (S7). Whether the Enhanced 4.0.x keeps the Iron Pickaxe — not found.
- **NPCs, spawns, map/world changes, new crafting stations:** none mentioned anywhere — not found.
- **Chroma / tinting:** not available in Enhanced. Author (S3, 4 Oct): "Having spoken with the authors of Emberlight, Chroma does not appear to be feasible in Enhanced edition. So unfortunately changing color of building pieces is not feasible in Enhanced edition."

## Vanilla changes

- The description and both 4.0.x change notes claim **no** change of vanilla data (recipes, item tables, spawn tables, stability) — no such statement found in either direction for 4.0.x.
- Author on dependencies (S7, 2022-05-21): "My mods are not dependent on any other mod, each is free standing."
- One legacy line touches a vanilla tool's behaviour (S6, 2.2.5, 2 Nov 2020): "Resin is still viable for Northern Timber building pieces! - T1 Stone Pick will gather Resin from Trees at low rates". Whether the mod edits the vanilla stone pick's harvest data, or only notes vanilla behaviour, is not stated — open question; check in the pak.
- The pieces use vanilla materials (user LIVAN, S7, 2023-05-03: "your mod use vanilla materias"); piece recipes are the mod's own rows — no evidence of vanilla recipe rows being overridden. Not confirmed at pak level.
- Legacy 2.1.7 change note (S6): "Removed a bad reference to a base game Material file" — the mod references base-game materials. In Enhanced this is the source of the known texture bug (see below).
- Upgrade path: designed to upgrade from vanilla Sandstone T1 (S1), i.e. it plugs into the vanilla build-upgrade chain via tags; no vanilla piece is replaced.

## Versions

| Version | Item | Date (UTC, from API/change notes) | Game | Source |
|---|---|---|---|---|
| **4.0.2** | 3802299666 | 2026-09-15 19:47 (Workshop "Updated 15 Sep @ 12:47pm" PDT) | Enhanced. Change note: "4.0.2 release / Compatible with Enhanced edition 2.2.0" (the "2.2.0" is verbatim; it does not match game 3.0.x — likely the author's mistake or another numbering) | S1, S2 |
| 4.0.0 | 3802299666 | 2026-09-15 19:42 (item created; first upload) | "Compatible with Enhanced edition" | S2 |
| 3.0.16 | 1928978003 | 2025-09-28 | Legacy UE4 ("Ready for 3.0 Age of Heroes Chapter 2 Sep release!!!"); Workshop tag **Legacy** | S5, S6 |
| 3.0.0 | 2855051043 | 2022-08-28 / 08-30 | Legacy (test/side item, file size 0 in API) | S8 |
| 2.x … | 1928978003 | from 2019-12-05 | Legacy | S6 (70 change notes) |

- Enhanced is a **separate Workshop item with a new mod ID** (3802299666); the legacy item 1928978003 stays tagged "Legacy". Whether legacy save data (placed pieces) maps onto the Enhanced item — not found.
- Game 3.0.0 patch (6 Oct 2026): a user asked if the mod needs an update; author (S3, 6 Oct) quoted the devkit changelog "DevKit 3.0.0 (378787) … contains no modding related changes" and answered "So you should be safe". No statement about 3.0.1 specifically — not found.
- Port history (S7): 2026-05-06/07 author: porting "Unlikely, at least not for some time … significant broken materials"; 2026-07-05 "initial work on porting … going well"; 2026-08-24 "contemplating releasing what I have completed, which is all four build sets, with a few broken materials"; released 2026-09-15.
- The Enhanced Workshop item has no update after 2026-09-15 (API `time_updated`), although the author on 21 Oct mentions "my last update where I fixed some" — this most likely refers to 4.0.2 itself; not confirmed.

## Requirements

- Steam "Required items": **none** on the page (S1). No DLC listed (S1).
- Workshop tags: **Buildings, Enhanced** (S1).
- In-game: each set's feat must be learned (0 points, needs the base-game build tier feat — legacy statement, S7).
- Load order — the only author advice found is legacy (S7, 2020-11-16): "You probably want LBPR below all your build set mods like GCAM and Dude's, SVS, Emberlight, Savage Steel." No Enhanced-specific load-order note — not found. (A hosting-blog claim about load order after Fashionist could not be confirmed on the page itself.)

## Known conflicts and bugs (quotes)

Enhanced (4.0.x), S3:
- **Missing textures on some pieces** — user Zeelot, 20 Oct: "there are some textures not loading in on some peices (the edges of ceilings)". Author, 21 Oct: "It appears that Funcom has removed some older master materials (which child materials rely upon) from the base game cook … even with my last update where I fixed some, others it seems were removed as part of game optimization."
- **Light artefacts on lanterns** — user, 26 Oct: "some of your lights/lanterns … have textures that present triangular, or cylindrical shapes when lit". Author, 26 Oct: "I will see if I can figure that out. Maybe Nanite or something."
- **Roof decorations** — user GrownupGeekgirl, 19 Sep: "struggling with getting the roof deco pieces to work"; author asked to report on Discord. Outcome not found.
- **Murayama disappeared** — user Exotia, 28 Sep: "murayama set has disappeared"; author, 29 Sep, asked for details ("Mod was last updated 2 weeks ago, no change since then"). Outcome not found.
- **Missing T1 corner pillar** — user, 6 Oct: "wasn't in a corner pillar for the T1 wood". No reply found. (Legacy: corner "Piers" lived in the author's separate Arena Pier mod, S7 2022-08-23.)
- **Chroma not possible** in Enhanced (quote above).
- Discussions tab: 0 topics (S4). The author routes bug reports to the Discord "Mod Bug Reports" channel (S3, 21 Sep) — not readable without login.

Legacy (for context; may or may not carry over), S7:
- Stability loss of placeables when upgrading floors/ceilings to the mod's pieces: author 2022-05-19: "if the upgrading piece collision is lower than ~2cm then the placeables may lose contact and therefore lose stability"; 2025-05-19: "The floor/ceiling upgrade thing is a known issue … a drop of >2.5cm".
- Thralls and the mod's stairs: author 2022-09-06 "I had noticed some problems with thralls and those stairs. Have not figured it out yet"; user 2025-05-19 "thralls would not walk up the stairs at all".
- Server started without the mod → pieces vanish permanently: author 2026-05-08: "with Funcom's scripts to clean up unused referenced in the gameDB file, those pieces would remain gone even if the mod were re-loaded".
- Emberlight Ivy / SVS webs intersecting build pieces caused client crashes (author, 2021-10-10).

Named modpack mods — mentions found:
- **Emberlight**: legacy only — Chroma cooperation (S7, 2020–2024), Ivy crash note (2021-10-10); Enhanced: Chroma not feasible (S3). No conflict report for Enhanced.
- **Pippi**: legacy only — author's own server list 2019-12-07 "works fine on my server: - Pippi - … - Emberlight - Fashionist - Asshuri Treasures - Arena Pier - Northern Timber …"; on 2020-11-16, answering a list that included Pippi and Emberlight: "I am not aware of any direct conflicts between Northern TImber and anything on your list."
- **Hosav**: legacy only, a different mod (EEWA): author 2020-05-04 "I spoke with Testerle (Better Thralls) and Hosav (EEWA) and neither can think of anything among the three mods that could cause a conflict." Nothing about Hosav UI.
- **EAA, Ragnar's New Factions, Better Tavern Patrons, Beyond Decor II, Asghaard Ancient Civilization, Al Merayah Reborn, Caverns of Set, Hosav UI, Lore & Loot (LLHighlight), Night Terrors, PvE Plus Ambush**: not found in any of the 1,366 comments, the change notes, or the descriptions.

## Numbers

| Field | Value | Source |
|---|---|---|
| Download size | **483,375,294 bytes** (Workshop "483.375 MB") | S1, API |
| Legacy 3.0.16 size (for comparison) | 703,371,082 bytes | S5, API |
| Files | Author's direct download is a single file **`NorthernTimber4.0.2.pak`** (Drive viewer title). The Workshop item's file list is not visible — single pak assumed, not confirmed | S10 |
| Current subscribers | 14,168 (lifetime 15,490) | S1, API |
| Favorites | 631 (lifetime 655) | S1, API |
| Unique visitors | 11,389 | S1 |
| Ratings | 272, 5-star display | S1 |
| Collections | 812 | S1 |
| Comments / discussions / change notes | 49 / 0 / 2 | S1–S4 |
| Posted / updated | 2026-09-15 19:42 / 19:47 UTC | API |
| Legacy item | 261,778 current subs (450,429 lifetime), 12,378 favorites, 70 change notes, last update 2025-09-28 | S5, S6 |
| Nexus Mods | **not published** on either slug: none of the 56 `conanexilesenhanced` or 98 `conanexiles` mods matches "Timber", "Northern", "shogakusha", "Murayama", "Bossonian", "Stockade" | S13 |
| Endorsements | n/a (no Nexus page) | — |
| Author active? | Yes — last author comment 2026-10-27 (S3); Workshop shows "Offline" at read time; releases also via Discord and Google Drive | S1, S3 |

## Localization

- No localization or language list mentioned on the page, in the change notes or in any comment (searched for russian, translat, locali, language) — **not found**. Russian localization: not found. Only English text appears in the descriptions and the piece list. Whether the pak carries any string tables — pending the pak check.

## Pak-level check (the main session, 2026-11-06 09:09 +03:00)

- **The file:** `NorthernTimber4.0.2.pak` from the author's Google Drive link, 483 375 294 B — byte-equal in size to the Workshop file of 4.0.2. Kept only in the
  session scratchpad; nothing of it was run.
- **Conflict kind 1 (a vanilla file overridden):** `mod-overrides.py` over the pak and the build's 65 paks — **0 vanilla paths** in the mod (1 688 assets, all
  under its own folder). It overrides no game file and shares no file with any mod of the build.
- **Conflict kind 2 (rows merged into the game's tables by its controller `BP_NT_ModController`):** its own tables `dt_NT_ItemTable`, `dt_NT_RecipesTable`,
  `dt_NT_FeatTable`, `dt_NT_ResourceStatTable`, `dt_NT_BuildingGameplayTagTable`, `dt_NT_BuildingGameplayTagsOrder`, `dt_NT_ConstructionSubClassData`. Build mods
  merging into the SAME vanilla tables: items / recipes / feats — Era of Trials, WO Riding Thralls, the fishing mod, EAA and others (ordinary for any content
  mod; a clash only when ROW NAMES / item IDs coincide); **resource yields — `DT_EAA_ResourceStatTable` (EAA) and `DT_NightTerrors_ResourceStatTable`** — the
  one place with a real chance of a row clash (NT's legacy note: «T1 Stone Pick will gather Resin from Trees» = a vanilla tool's yield row; whoever loads later
  wins that row). Building gameplay tags — the build carries `DT_GameplayTag_Building_Custom` / `_Shupaa` in two mods each.
- **What decides kind 2:** only the game's own log (`_config/who-overwrites-table.py`: «MergeDataTables - Found existing table entry … overwriting»). A trial start
  with the pak in the working game was REFUSED by the agent's permission guard (a third-party download loaded into the game) — waits for the owner's word.

## In-game trial (2026-11-06 09:30 +03:00, `[OWNER]` 09:27 «Поставь, попробуй»)

- Installed into the working game before the Krinik mods (modlist line 63), a fresh start into the world (28 s). The game mounted it and registered
  `/Game/Mods/NorthernTimber/` as a mod controller; **0 errors / warnings** under `/Game/Mods/NorthernTimber` in `ConanSandbox.log`.
- `who-overwrites-table.py` (3 896 merges, 44 tables): Northern Timber **overwrote exactly ONE existing row — `ResourceStatTable · Resin`** (the resin yield; its
  legacy note «T1 Stone Pick will gather Resin from Trees»). `--shared-rows`: **no row** where Northern Timber and another build mod both wrote. Its item / recipe /
  feat rows are all NEW rows (new rows are not logged — the game prints only overwrites), so no item-ID collision with the build was seen.
- The `Resin` row belongs to vanilla; no build mod overwrites it, so Northern Timber's version stands as is. The change is gameplay (resin from trees by a pick),
  the owner's call.
- Removed after the run: the pak, the modlist line (byte-equal to the backup), and the game's extracted copies `Saved/ExtractedMods/NorthernTimber-Windows.{pak,ucas,utoc}`
  (the game unpacks every mod there at mount — a removed mod leaves them behind).
- Not checked: the missing textures and lantern artifacts the author lists (an in-game look at the build pieces), performance.

## Open questions

1. Does the pak override any vanilla asset or data-table row (recipes, harvest tables — see the legacy "T1 Stone Pick will gather Resin from Trees" line, feat tables, build-upgrade tags)? Pak-level check pending in the main session.
2. Does Enhanced 4.0.x still ship the Iron Pickaxe and the Roofer feats (8 feats in legacy)? Only "Murayama Timber Wright" is confirmed for 4.0.x.
3. Do the Irori (Stove) and Nambu Cookpot act as crafting/cooking stations with their own recipes?
4. Are the asset paths the same as the legacy mod (relevant only if someone carries a legacy save)?
5. Which pieces show missing-material textures in 3.0.x Enhanced (author: "no good way to determine them from within the devkit")? — needs an in-game look.
6. "Compatible with Enhanced edition 2.2.0" in the 4.0.2 note vs game 3.0.1 — the author's devkit-3.0.0 statement (6 Oct) says no modding changes; 3.0.1 not addressed.
7. Real piece count (439 by description vs 342 in the sheet) — the pak check can count.
8. Compatibility with the listed modpack mods (EAA, Ragnar's New Factions, Better Tavern Patrons, Beyond Decor II, Asghaard, Al Merayah Reborn, Caverns of Set, Hosav UI, LLHighlight, Night Terrors, PvE Plus Ambush) — no web evidence either way; a building-only mod with its own pieces is unlikely to overlap, but this is not a finding — pak-level check.
