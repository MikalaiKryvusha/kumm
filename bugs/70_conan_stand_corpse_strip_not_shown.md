# Bug 70 — the agent's corpse stand stopped showing the corpse strip (WBP_ContainerInfo) after 2026-10-30 19:58

**Status:** 🔬 research-only (the owner: «пора на разведку» · 2026-10-30 21:12) · **Severity:** S2 (a run hour lost; blocks W6 centred)
**Version/build:** Conan 3.0.1 + the build; KrinikConanUI kit pak of 2026-10-30 (several) · **When/context:** W6 centred corpse prompt (the owner's mock-up
«да, верно» 19:56), dayloop.
**Fixing:** next session, before W6 centred goes back ON.

## Goal vector · done when

Achieve: the stand puts a corpse strip on screen on demand. Done when `corpse-prompt-shot.sh` (or its successor) shows the strip in ≥ 4 of 5 fresh
launches of the oasis save `_save-backup/2026-10-30_1831-before-w6-corpse-prompt`, the frame read each time.

## Symptom

`corpse-loot-geom.sh` prints «no WBP_ContainerInfo_C in viewport»; the frame shows the hero beside a corpse with no strip; the UE4SS log has no
«hook …WBP_ContainerInfo_C:SetObject set» line (the widget is never created in that launch).

## Timeline (all 2026-10-30, background launch, oasis save unless said)

| Time | Build | Stand | Strip |
|---|---|---|---|
| 18:35 | vanilla strip | croc killed ON the hero (0.8 m), no move | ✅ (b1b) |
| 18:51 | pad 2 | move X+70 at the hero's Z, geom | ✅ 2nd try (p1n) |
| 19:19 | pad 8, 19:15 save | X+70, Z = corpse+150 (teleport false) | ✅ (p1b) |
| 19:28 | pad 1, 19:15 save | same | ✅ 2nd try (p1c) |
| 19:41 | pad 1, control locres | same, after killing the boss at 70 m | ✅ 1st try (c1) |
| 19:58 | line build 1 (TextBlock) | boss at 34 m, X+70 Z+150 | ✅ 2nd try (ctr) |
| 20:21 | line build 3 (styled TextBlock) | boss 45 m; a live crocodile on the hero, killed | ❌ 9 tries incl. 4 offsets |
| 20:37 | line build (re-inserted) | wildlife DESTROYED, boss killed | ❌ 5 tries |
| 20:46 | kit asset reset from vanilla, line OFF | wildlife destroyed; corpse-stand killed a DialogueNPC 150 m away | ❌ 4 tries |
| 21:09 | same | corpse-stand 200 killed an NPC at ≈35 m while the BOSS «Эника из Киммерии» (alive, 75/75) stood next to the hero; aim on the boss's name plate | ❌ V1–V4 (V4 after killing the boss) |

The «class not loaded» probe (`LoadAsset` then `StaticFindObject(…WBP_ContainerInfo_C)` = false) gave the same answer on the vanilla-reset build —
it proves nothing (EXP-0393).

## Code chain (read, no edits)

1. `corpse-stand.sh R` kills the NEAREST live `HumanoidNPCCharacter_C` within R (3D distance; the oasis boss at 45 m is «not within 50» some launches).
2. The move and the aim use `FIND` (`corpse-loot-geom.sh` line 12, `corpse-prompt-test.sh`): the nearest **`DismemberedBodySkeletalMesh_C`** by
   2D distance, its `K2_GetComponentLocation()` = C. The hero goes to C+offset; the camera aims at C+AIMZ (3 passes) → frame → strip check.
3. The strip is created by the game when the interaction trace from the camera hits a lootable corpse.

## Hypotheses (ranked)

- **H1 — the aim target is not the fresh corpse.** `FIND` takes the nearest `DismemberedBodySkeletalMesh_C` — any body piece in the world, not the
  NPC just killed. V1 at 21:09 moved the hero to a body 35 m away while the kill had been elsewhere, and the live boss stood there. Every failing run
  after 20:21 killed a different NPC than the body FIND picked (crocodile under the hero 20:21; DialogueNPC 150 m 20:46; NPC 35 m 21:09).
  Check: print the killed NPC's location in `corpse-stand.sh` and FIND's C — are they the same body?
- **H2 — a live character between camera and corpse takes the trace** (the boss's name plate on the aim point at 21:09; the crocodile at 20:21).
- **H3 — the corpse is not lootable yet / not at all** (a DialogueNPC may leave no lootable corpse).

## Next steps (the coding session)

1. `corpse-stand.sh` returns the killed NPC's world location (`K2_GetActorLocation` before `KillCharacter`); the stand moves and aims at THAT point,
   not at FIND's nearest body piece.
2. Before aiming, move every live `Character` within 10 m away (never kill companions — the save is restored after the run anyway).
3. Kill only a hostile `HumanoidNPCCharacter*` in front of the hero within 15 m (the oasis boss walks up on her own ≈30 s after entry).
4. Objective check: the UE4SS line «hook …ContainerInfo_C:SetObject set» + `corpse-loot-geom` «inViewport=true» + the frame.
5. Then W6 centred: `LINE1_ENABLED = True` in `kit-conanui-edit.py`, the override row ON (`vanilla-overrides-ru.tsv`, line-2 text), build, frame.

Web search: not used — the defect is in our own stand tooling (pure internal), no outside source applies.

## Decisions made without the owner

- `[AI]` W6 centred switched OFF on a false inference (EXP-0393); the kit asset reset from vanilla — the old one kept in the session scratchpad
  `broken-wbp\`. To be undone after the stand works.

## Links

plan 36 W6 · `testcases/TC_conan_corpse_prompt_two_lines_2026-10-30.md` · STATUS PARKED 20:5x · EXP-0392, EXP-0393 · review folder 11 (`4 МАКЕТ`)
