# Bug 98 — Conan: in first person the arrow casts a shadow, the arm, the bow and the body do not

**Status:** 🔬 OPEN — recon · **Severity:** S3 (visual) until the cause is read
**Version/build:** Conan Exiles 3.0.1 build, pack `cdf8ef0` + the plan-52 post-process look · **When/context:** the owner's own play 2026-11-13 16:06 +03:00 (his frame,
first person, the bow held), during the plan-52 check
**Fixing:** this session — the first-person read below when the game is mine (the owner plays his check now), then the fix by the cause

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-13 16:06 «от стрелы тень есть, а где от всего остального?»

Expected: in first person the hero's body, arms and the held bow cast their shadow on the ground, as the arrow does.

## Forensics

**Read 2026-11-13 16:1x in the owner's running game** (`ConanExiles/_config/fp-shadow-flags.lua`, read-only; the camera mode at that moment NOT known — the owner
was playing): every visible part casts — the body pieces (`SkeletalMeshComponentBatched_*`, `SkeletalMeshComponent_*` under `CharacterMesh0`), the bow
(`BP_bow_2h_C · SkeletalMeshComponent`) and its nocked arrow (`BP_bow_2h_C · ThrowingKnife`) all read `vis 1 · CastShadow 1 · dynamic 1 · hidden-shadow 0 ·
ownerNoSee 0 · onlyOwnerSee 0 · selfShadowOnly 0`; `CharacterMesh0` (the leader pose) is invisible and casting. Fov 90. The arrow and the bow carry the SAME flags,
yet the owner saw only the arrow's shadow — so the flag set alone does not explain it (if the read was in first person), or the read was in third person.

**Our own part:** `KrinikConanCamera` hides `b_neck_1` and below by `Mesh:HideBoneByName('b_neck_1', 0)` on `SwitchToFirstPersonCamera` — a hidden bone is collapsed
for shadows too, so even with every shadow on the first-person shadow would be headless (game map, «First-person camera and the neck»).

`[OWNER]` 2026-11-13 16:25 «нужна будет тень головы и шеи, но чтобы голова и шея не мещали обзору камеры от перовго лица. Нужно придумать, как это сделать» — the
way and its sources: `researches/first-person-body-camera/README.md` §4 (owner-no-see + hidden shadow on the head parts, or the engine's `WorldSpaceRepresentation`).

**CAUSE READ 2026-11-13 17:16 (my game, the hero switched by the remote `SwitchToFirstPersonCamera()`, `fp-shadow-flags.lua` with the first-person type):** in first person
the GAME turns `CastShadow` OFF on every body piece (`SkeletalMeshComponent*` / `…Batched_*` under `CharacterMesh0`), on the bow (`BP_bow_2h_C`) and on its nocked arrow
(`ThrowingKnife`); two pieces are invisible (`vis 0` — the head / hair family); `FirstPersonPrimitiveType` = 0 on all (hypothesis 0 refuted); `MergedLodMesh` keeps
casting. The read of 16:1x (all casting) was third person. The arrow shadow the owner saw is the FIRED arrow (a separate projectile actor).
**Fix way:** a post-hook of `SwitchToFirstPersonCamera` (KrinikConanCamera already hooks it for the neck): `SetCastShadow(true)` on the visible pieces and the held weapon,
`SetCastShadow(true)` + `SetCastHiddenShadow(true)` on the invisible head pieces; the head's shadow needs the camera mod's `b_neck_1` bone hide gone (a hidden bone collapses
the shadow too) — that waits for plan 52's eye offset (the camera ahead of the neck). Step 1 now: the body, arms and bow shadow; step 2: the head with plan 52.

## Hypotheses (ranked)

0. (REFUTED 17:16) The game's first person marks the hero's parts `FirstPersonPrimitiveType = FirstPerson` (UE 5.5+: no world shadow by design); the arrow is a plain component (recon §4).
1. The game's first-person switch turns the hero's shadow off by another lever than the flags read (a per-view rule, `bCastDynamicShadow` set only in first
   person, a shadow-distance or a capsule-shadow setting) — read the same probe in first person and in third person on one stand, then the switch's bytecode.
2. The read above WAS in first person and the shadows exist but fall where the owner did not look (the sun behind him) — a control frame with the sun in front.

## Fix plan

1. Stand (mine, after the owner's game closes): oasis noon, the bow crafted (game map «Stand gear»), the sun at a known side; the probe in first person and third
   person; frames of the ground in both.
2. By the cause: a native lever at the game's first-person switch; the neck/head hiding (ours) replaced by a way that keeps the head's shadow (the owner-no-see
   head + `bCastHiddenShadow`, the UE first-person-body practice) — recon before the choice.

## The fix in code — judge round 1 and the redesign (2026-11-13 19:1x–19:2x, NOT run in game)

The first fix (17:19, `restore_fp_shadows`: 50 ms after the switch every mesh under the hero with the shadow off got `SetCastShadow(true)`, the invisible ones also
`SetCastHiddenShadow(true)`) went to a judge (round 1, read-only, a mock harness in `KUMM/.work/judgeA/`). Confirmed by the code, all fixed:
- C1 — the hidden shadow went to EVERY invisible mesh (an arrow hidden between draws, the leader pose if the game turns it off) and was never reset → dropped (the head's
  shadow is plan 52's, the neck-bone hide collapses it anyway).
- C2 — meshes off BY DESIGN got a shadow (a torch flame card, enemy arrows stuck in the hero, buff effects), and a switch back to third person within 50 ms made the
  walk run in third person → the pre-hook (it runs BEFORE the blueprint body, still in third person) records the full names of the meshes WITH a shadow; the delayed
  step lights only those that are now off; a generation counter bumped by both switches cancels a pending step. Names, not objects, cross the delay.
- C3 — errors were swallowed (the outer pcall), one bad child stopped its siblings → per-branch pcall, the error count and the first text in the log line.
- C5 — the walk's cost was not logged → both walks' times in the log line.
Desk test `KUMM/.work/fp_shadow_desk.lua` (the real block of `main.lua` on mocks): body, bow, arrow lit; the torch flame stays dark; a switch back cancels; an error on
one branch keeps its siblings — ALL PASS. Judge round 2 in flight.
**Owed in game (cases of the next stand, plan 53 world entry):** C4 — the game may turn the shadows off again later (a latent node, a bow draw, an equip): read
`_config/fp-shadow-flags.lua` ≈ 1 s after the switch and during a draw; C6 — the restored shadow shows the first-person pose (the torso pitched with the view, the arms
shifted, no head): frames of the ground looking down and up, for the owner's eye, before DONE.

## Decisions made without the owner

(filled at closing)
- `[AI]` 2026-11-13: no hidden-shadow on the head now — it waits for plan 52 (the camera at the eyes), so the shadow is the body without the head until then.

## Links

`bugs/95_conan_first_person_bow_not_visible.md`, plan 52 (the first-person look), `games/ConanExiles/mods/KrinikConanCamera.md`, game map «First-person camera and the neck».
