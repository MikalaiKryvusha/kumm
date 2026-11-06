# Test cases — Conan: Bosses My New Besties's boss placement ghost grafted into LBPR's thrall system (plan 45 step 8a)

> **Created:** 2026-11-06 · **Parent:** `plans/45_conan_mod_reconciliation_all.md` step 8a; `[OWNER]` interview #034 Q2 = A + «если получится, то в LBPR нужно
> затянуть модельки из Bosses My New Besties» · 2026-11-06 13:34
> **Status:** 🟡 run 2026-11-06 14:15 +03:00 — G1 G2 pass, G3 partial; G4 blocked (needs a RECRUITED boss thrall item); G5 not run; report `testcases/reports/2026-11-06_conan-thrall-ghost-graft.md`
> **Outbound:** —

**Test basis.** BMNB's `ShowThrallPlaceable` (read byte-exact from its own container 2026-11-06): the placement ghost's scale =
`SelectVector((1.2, 1.2, 1.2), thrall's GetActorScale3D, HasTag(Npc.Boss.Miniboss) OR HasTag(Npc.Boss.WorldBoss))`. LBPR's own edits: 6 placement
functions reading `ST_LBPRConfig`. Expected after the graft: both, in one file.

**Dimensions.** Load (the game reads the edited asset) · the grafted code present in the live UFunction · the ghost of a boss thrall · the ghost of an
ordinary thrall (control: unchanged) · LBPR's own placement rule (unchanged). Not covered: the multiplayer path (single-player only).

## Stand

- Game: `D:\Games\Conan Exiles 3.0.1`, the build's mods; the edited pak `No_Building_Placement_Restrictions.pak` md5 `70e6d4f5…` in `ConanSandbox/Mods`.
- Launch on the background path (`launch-bg.ps1`), under the machine lock; world entry by `enter-world-remote.sh`; god mode on by the remote.
- A thrall item in the hero's inventory — how it is obtained is recorded in the game map the moment it is found (spawned by the remote, never searched for).

## Cases

| # | Situation | Action | Expected | Status | Seen |
|---|---|---|---|---|---|
| G1 | the build with the edited LBPR pak | the game starts and enters the world | no `ObjectSerializationError` / `Bad export index` for `BP_ThrallSystemComponent`; LBPR's container extracted with the new hash | pass | 3 world entries (13:57, 14:01, 14:10); log: «deleting … hash does not match» → «extracting» LBPR, no error for the asset |
| G2 | in the world | the remote lists the properties of the live UFunction `BP_ThrallSystemComponent_C:ShowThrallPlaceable` | 48 properties, among them `CallFunc_SelectVector_ReturnValue`, `CallFunc_GetActorGameplayTags_ReturnValue` | pass | «48 props: CallFunc_GetActorGameplayTags_ReturnValue, CallFunc_HasTag_ReturnValue, CallFunc_HasTag_ReturnValue_1, CallFunc_BooleanOR_ReturnValue, CallFunc_SelectVector_ReturnValue» |
| G3 | an ordinary thrall item in the inventory (`exec SpawnItem 25002 1`, the barkeeper) | the hero starts placing it (`GameItem.OnUseItem`, the player's «use») | the ghost appears; its scale = the thrall's (as in the game) | partial | frame `g2-Tavern_Barkeeper.jpg`: a human-size ghost on open sand; 7 uses, 0 script warnings from `ShowThrallPlaceable` in the log; the scale NUMBER not read (the ghost actor is not reachable from Lua — see report) |
| G4 | a boss thrall (tag `Npc.Boss.WorldBoss` or `Npc.Boss.Miniboss`) | the hero starts placing it | the ghost's scale = 1.2 | inconclusive (control run) | 2026-11-06 15:34-15:37: the cheat `ConvertPatronToThrall(PatronTemplate)` gave no item; the save's second thrall item (row Aesir_Boss, `ThrallTemplateID` 505) shows a TALLER ghost than the barkeeper (239), but the SAME height with the original LBPR pak as with the graft (sheet `testcases/reports/2026-11-06_conan-thrall-ghost-g4-sheet.webp`, one place, one camera): the height is the template's; whether that ghost carries a boss tag is unknown. Still needed: a ghost of a boss-TAGGED thrall (a recruited boss item: knock out, wheel of pain) with the same with/without pair |
| G5 | LBPR's «place anywhere» toggle on | the hero places a thrall next to another thrall | placement allowed (LBPR's rule still works) | not run | offline only: 28 of 29 exports of the edited asset byte-identical to LBPR's own (all six LBPR functions among them; only `ShowThrallPlaceable` changed — export-by-export compare); not walked in game |
