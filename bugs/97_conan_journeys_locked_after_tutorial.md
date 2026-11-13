# Bug 97 — Conan: after the tutorial every journey but fishing is locked in the Journeys window (J)

**Status:** 🔬 OPEN — not yet known whether it is the game's design (journeys unlocked by progress) or a mod defect · **Severity:** S3 until read
**Version/build:** Conan Exiles 3.0.1 build (pack as of 2026-11-13) · **When/context:** tossed by the owner mid-task, 2026-11-13 16:01, during the bug-95 work
**Fixing:** after plan 52's live check (the next session if this one closes)

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

## First steps

1. Recon of the vanilla rule: how Conan 3.0 Journeys unlock (web + the game's journey tables) — design or defect.
2. Which mods touch journeys / the tutorial / Exiles Fishing (it is the only unlocked one — the fishing mod adds its own journey?): the reconciliation register,
   `who-overwrites-table.py journey`.
3. A control: the same save without the suspected mod.
