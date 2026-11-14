# Bug 97 — Conan: after the tutorial every journey but fishing is locked in the Journeys window (J)

**Status:** 🔧 fix pending the owner's play — OUR hub controller showed a stale journey page; the native `RefreshGrid` on every show, cases J1b–J6 pass 10:39
(section «Root cause found»); the other kept tabs — twin list, unchecked · **Severity:** S2 (the
owner's play misled: the game said «choose a journey» while our page showed them locked)
**Version/build:** Conan Exiles 3.0.1 build (pack as of 2026-11-13) · **When/context:** tossed by the owner mid-task, 2026-11-13 16:01, during the bug-95 work
**Fixing:** this session — dayloop item 2 (after the page-arrow diamonds, before bug 94) by the owner's word `[OWNER]` 2026-11-14 09:56 «очень важно разобраться с
закрытыми путешесьвиями» (was: after plan 52's live check). The tables below are 3.0.1's — re-read on 3.1.0 first (the patch changed vanilla tables, plan 53 step 12).

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-13 16:01 «и словно какой-то баг, или не баг. я не уверен.» · «Вот я прошёл обучение, мне сказано нажать J, чтобы выбрать путешествие - но все, кроме
рыбалки, петешествия под замком»

The HUD hint «Путешествие — Нажмите (j), чтобы выбрать путешествие» is on screen in every frame of the 2026-11-13 runs (the owner's save `Game_1`, the oasis).

## Recon 2026-11-13 16:2x — the game's own rule (desk, the 3.0.1 tables)

The vanilla table `/Game/Systems/Progression/DT_NewJourney` (51 rows, struct `JourneyTableRow`; read by `retoc to-legacy` + `uaj tojson` from `_paksview-3.0.1`) opens a
journey by ONE of: `UnlockedByFeat` (a learned feat), `UnlockedAtLevel`, `UnlockedByFindingMapMarker`, or the previous journey's `UnlockTheseJourneysWhenCompleted`;
`StartHidden` rows appear only when unlocked. Visible-but-locked rows and their key (feat names and levels from `/Game/Items/Feats/FeatTable`):

| Journey | Opens by |
|---|---|
| Warrior · Archer | feat 4 «Warrior» · feat 6 «Archer» — level 1, cost 0, NOT given on spawn: learned by hand in the knowledge window |
| Armorer · Tanner · Thralltaker | feats 8 · 9 · 51961 — level 10 (cost 2 · 2 · 3) |
| Tinkerer · Outrider · Farmer | feats 41020 (level 12) · 2514 (level 15) · 18520 (level 18) |
| Blacksmith · Mason · Acolyte · Sorcerer · Cartographer · PurgeDefender · Adventurer | level 10 · 10 · 12 · 20 · 25 · 30 · 60 |
| Mountaineer | a map marker found |
| Survivor (the tutorial) → SurvivalShelter, Homesteader, RegionTravel_EL | completing Survivor |

The two mods with journeys add their OWN rows, none overwrites a vanilla one: Ironlight-Core `IL_DT_JourneyMerge` — 7 rows `Ironlight*` (level 10); JaarFishing
`DT_Fishing_NewJourney` — the fishing journey, the one the owner sees open. **Reading:** the locks are the game's design (a fresh hero right after the tutorial has
none of those feats or levels) — not a mod defect. To confirm on the owner's world: does his hero know feat 4 / 6 and are Warrior / Archer still locked? If he knows
feat 6 (the bow recipe) and Archer stays locked, THAT is a defect.

## Root cause found — 2026-11-14 10:0x–10:1x (live, 3.1.0, the owner's world `Game_1`, remote; TC `testcases/TC_conan_journeys_stale_hub_page_2026-11-14.md`)

- **The game's data and rule are right.** The hero's `BP_AC_ExilesJourney` (class `NewJourneyComponent`) holds `m_JourneyData` — 61 rows {Name, CurrentStep, Unlocked,
  NumSteps, StepCompletionMask, …}; 13 rows Unlocked=true: Survivor (CurrentStep 26 of 25 — done), SurvivalShelter, Homesteader, RegionTravel_EL (Survivor's follow-ups),
  Warrior, Archer (feats 4 and 6 known — `FeatInventory:HasItemByTemplateID(id, 0)`), Blacksmith, Mason, Acolyte (levels), ExilesFishing (JaarFishing),
  InvocationsAndDesecration, RelicsOfFaith, IronlightFounding (mods); feats 8, 9, 41020, 2514, 18520, 51961 unknown → their journeys locked. `GetJourneyUnlockStatus(name)`
  agrees. The active journey is still `Survivor` (finished) — why the HUD keeps «Нажмите (j), чтобы выбрать путешествие».
- **The window on a fresh world entry is right** (frame 10:0x): the unlocked journeys coloured, the rest locked.
- **The defect — our hub controller (`KrinikConanUI/krinik_hub_controller.lua`, plan 48) shows a STALE journey page.** It builds OUR instance of 7 tabs (Таланты,
  Хар-ки, Путешествие, Клан, Спутники, Карта, Базар) once and keeps it for the world session, hiding the game's page that is born fresh at every switch. A card's
  lock is drawn when the card is filled; our page is filled once. Everything that opens a journey later (a learned feat, a level, the tutorial's end) never
  reached our page — the owner's «все, кроме рыбалки» after the tutorial fits it.
  ~~Case J1 (10:1x): page built → hub closed → `UnlockJourney('Tanner')` → reopened: «Кожевник» still locked~~ — **corrected 10:4x: J1 proved nothing** — the remote
  «close» never closed the hub (EXP-0520; no «хаб закрыт» line) and `UnlockJourney` reaches the cards only after a delay (the game's own fresh page showed the
  same lock right after it). **The honest case J1b (10:3x):** our page shown, then tab «Снаряжение», `ServerPurchaseFeat(9)` (the knowledge window's own call),
  back to «Путешествие»: the game's newborn page — «Кожевник» open; our kept page — locked. The page's native `RefreshGrid(bHideCompletedJourneys)` (17 ms)
  fixed ours on the spot.
- **The class — the other kept tabs (twin list, not checked yet):** Таланты (`W_FeatWindow`), Хар-ки (`W_Attributes`), Клан (`W_GuildView`), Спутники
  (`W_FollowersView` — a thrall placed while the hub was closed), Карта (`W_FullscreenMap`), Базар (`W_StoreWindow`). Each gets a check by the same method —
  change the state the way the player does, compare our page with the game's newborn page — and, if stale, its own native refresh in `REFRESH`.
- A side finding, not this bug: Caverns of Set (`BP_Caverns_of_Set_C`) OVERWRITES the vanilla row `Mountaineer` of `DT_NewJourney` (game log «Found existing table
  entry … RowName: Mountaineer, overwriting from /Game/Mods/Mines_of_Set/Tables/Caverns_of_Set_Journey_Table») — the recon above («none overwrites a vanilla one»)
  was wrong for it; a stale-copy question for plan 53 step 12 (the mod's row vs the 3.1.0 one).
- **Fix (final, 2026-11-14 10:3x):** `REFRESH[5]` in `krinik_hub_controller.lua` — every time OUR page of «Путешествие» is shown (a switch or the opening), the
  page's own `RefreshGrid(GetHideCompletedJourneys())` runs first (17 ms, at the switch — the owner allows lag when a window opens). Cases J2 (a feat learned
  between two switches), J3 (a real close by the close button, reopen: our page = the game's newborn on all 40 cards), J4 (fast-burst 6 / 6), J5, J6 — pass.
  The first fix of 10:1x («remove our pages at every close, rebuild at the next opening») was REVERTED: it was built on J1, it left the staleness inside one
  opening, and the judge found four weak spots in it (a lazy step building a stale page after the close, names cleared on a failed removal, a false close
  costing a rebuild, garbage per opening).

## First steps (2026-11-13 — done)

1. Recon of the vanilla rule: how Conan 3.0 Journeys unlock (web + the game's journey tables) — design or defect.
2. Which mods touch journeys / the tutorial / Exiles Fishing (it is the only unlocked one — the fishing mod adds its own journey?): the reconciliation register,
   `who-overwrites-table.py journey`.
3. A control: the same save without the suspected mod.
