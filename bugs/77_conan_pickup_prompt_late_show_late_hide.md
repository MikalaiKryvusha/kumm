# Bug 77 — «E Взять» shows up seconds late and stays seconds too long

**Status:** 🔴 OPEN · **Severity:** S2 (a visible lag of a core prompt) · **Version/build:** pack ConanExiles `40db56d`, KrinikConanUI 1.0.0 (`krinik_pickup_prompt`) ·
**When/context:** 2026-11-02 14:18–14:19 +03:00, the owner's play after the chat's closure
**Fixing:** FIRST in the next chat

`[OWNER]` «перестала появляться E взять» · «чини!» · «прямо сейчас на палку смотрю.» · «с какой-то должгой задержкой появляется и долго не исчезает» · 2026-11-02 14:18–14:19.

## Symptom

Looking at a stick on the ground (≈ 5–6 m before the hero, frame `stick.jpg` of the session scratchpad, 14:19), no «E Взять»; when it comes, it comes late and
it stays on after the view leaves the pickup.

## Forensics (14:18–14:19, remote, read-only)

- The section runs: the log line every ≈ 12.5 s «за 60 проверок своё время … близких компонентов 2 из 279–281» — and the near count stayed 2 while the hero walked
  33 m. The plate exists in the crosshair (`HB_KrinikPickup`, Collapsed, opacity 0).
- Instances within 3 m of the hero: two `PickupFoliageComponent_C` small rocks (the section's «2»), no branch — the stick lies beyond 3 m.
- Code (`krinik_pickup_prompt.lua`): `refresh_near` walks the component list `NEAR_SLICE` = 20 per check, round robin, over ≈ 280 components → a full cycle is
  ≈ 14 checks; while the plate is hidden the check runs once a second (5 / s only while it shows — the owner's 09:04 word) → a pickup that just came within
  `NEAR_CM` 600 can wait up to ≈ 14 s to enter the near set. The same arithmetic was seen 2026-11-02 morning («E Взять» up to ≈ 14 s late, STATUS).
  The late HIDE is not explained yet (the shown check runs 5 / s).

## Fix plan

1. Cause: the near set depends on a slow round robin. Rebuild it by the hero's MOVE, not by the clock: when the hero has moved ≥ 3 m since the last full pass
   (or on the first check after a teleport), re-check ALL components at once (measure: 281 × `GetInstancesOverlappingSphere` — was 0.18 ms per 20 → ≈ 2.5 ms
   once per 3 m of walking, inside the 1 ms rule only if spread: then a full pass split over the next 3 checks), and keep the slice for the idle hero.
2. The late hide: log the moment the probe stops hitting and the moment the plate fades; check the fade (0.2 s) and whether a hit on the SAME instance after the
   pickup is taken keeps it.
3. Cases (new TC): walk up to a stick from 15 m — the plate within ≤ 0.5 s of the stick entering 6 m; look away — the plate gone ≤ 0.4 s; the cost line per minute.

## Decisions made without the owner

(at closing)
