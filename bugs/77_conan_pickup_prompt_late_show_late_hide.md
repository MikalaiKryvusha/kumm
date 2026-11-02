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

**14:20, the owner:** `[OWNER]` «фейд плохой, контур E не действует на фейд!» — the fade does not reach the E key rim (`Brd_KrinikPickupKey`, its brush outline): the word and the backing fade, the rim stays. Likely the fade drives the plate's `RenderOpacity` of children that do not include the rim's own brush, or the rim is a sibling outside the faded box — check the tree (`KrinikConanUI.md` → `krinik_pickup_prompt`: `HB_KrinikPickup` = E in its own rim + «Взять») and fade ONE parent.

## Fix plan

**The owner's direction 14:20 (supersedes the near-set idea below):** `[OWNER]` «ДА НЕ СПИСКО БЛИЗКИХ УЖНО ПРОВЕРЯТЬ!» — no near list at all: check WHAT THE CROSSHAIR LOOKS AT. A line trace from the camera through the crosshair (the game's pickup reach, our camera's boom accounted for) returns the hit component and its instance index (`HitResult.Component`, `Item`); a `PickupFoliageComponent_C` hit with a live instance → the plate; anything else → no plate. One trace per check, no list, no round robin. If the visibility channel misses foliage instances, trace the channel the game's own pickup uses (read it from the hero's interaction code first).

1. (superseded) Cause: the near set depends on a slow round robin. Rebuild it by the hero's MOVE, not by the clock: when the hero has moved ≥ 3 m since the last full pass
   (or on the first check after a teleport), re-check ALL components at once (measure: 281 × `GetInstancesOverlappingSphere` — was 0.18 ms per 20 → ≈ 2.5 ms
   once per 3 m of walking, inside the 1 ms rule only if spread: then a full pass split over the next 3 checks), and keep the slice for the idle hero.
2. The late hide: log the moment the probe stops hitting and the moment the plate fades; check the fade (0.2 s) and whether a hit on the SAME instance after the
   pickup is taken keeps it.
3. Cases (new TC): walk up to a stick from 15 m — the plate within ≤ 0.5 s of the stick entering 6 m; look away — the plate gone ≤ 0.4 s; the cost line per minute.

## Decisions made without the owner

(at closing)
