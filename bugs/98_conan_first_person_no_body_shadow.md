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

## Hypotheses (ranked)

1. The game's first-person switch turns the hero's shadow off by another lever than the flags read (a per-view rule, `bCastDynamicShadow` set only in first
   person, a shadow-distance or a capsule-shadow setting) — read the same probe in first person and in third person on one stand, then the switch's bytecode.
2. The read above WAS in first person and the shadows exist but fall where the owner did not look (the sun behind him) — a control frame with the sun in front.

## Fix plan

1. Stand (mine, after the owner's game closes): oasis noon, the bow crafted (game map «Stand gear»), the sun at a known side; the probe in first person and third
   person; frames of the ground in both.
2. By the cause: a native lever at the game's first-person switch; the neck/head hiding (ours) replaced by a way that keeps the head's shadow (the owner-no-see
   head + `bCastHiddenShadow`, the UE first-person-body practice) — recon before the choice.

## Decisions made without the owner

(filled at closing)

## Links

`bugs/95_conan_first_person_bow_not_visible.md`, plan 52 (the first-person look), `games/ConanExiles/mods/KrinikConanCamera.md`, game map «First-person camera and the neck».
