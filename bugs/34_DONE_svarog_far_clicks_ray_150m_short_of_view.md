# Bug 34 — Svarog's Dream: at max zoom-out a click on a far item or villager makes the hero run there and do nothing

**Status:** ✅ DONE 2026-10-10 19:06 — KrinikCameraRework 1.3.2 deployed, far pick-up and far talk verified on the owner's save (below)
**Severity:** S2 — our own fix (bug 33, 1.3.1) was too short; found by the owner in play, not by the agent
**Version/build:** SvarogsDream, KrinikCameraRework 1.3.1 (bug 33 fix) · **When/context:** 2026-10-10 ≈18:46, the owner after his play
16:14–18:45: `[OWNER]` «Я замечал, что вдали кликаю по цветку или жителю - герой подбигает и ничего не делает, словно только вблизи клики
действительно активируют приближение героя к предмету и взаимодействие с ним, а на расстоянии эти клики просто в землю рядом уходили.»

## Symptom

At max zoom-out, a right click (the owner's action button) on an item or a villager in the upper part of the screen: the hero runs to
the spot and stands; nothing is picked, no conversation. Near targets work.

## Repro (deterministic)

Owner's save (Bara), 1280×720 borderless, camera at max zoom-out (123.8 m from the hero), pitch 50°:
`h.sh "comps GroundItemInteraction 40"` (field `cam=` — distance from the camera, added for this bug) → pick an item whose `cam` > 150 →
`call KrinikUIRework.IconProbe List` for its icon point → `tools/mouse.ps1 -X <x> -Y <y> -Button right`.
18:54: axe at 163 m from the camera — hero ran to it (1.7 m) and stood, the axe stayed. Control: the same axe, now 124 m from the camera,
the same click — picked.

## Root cause

- Bug 33 lengthened the game's 100 m mouse rays by `MaxZoomFactor` (×1.5 → 150 m), keeping the vanilla ratio "reach / camera distance".
  But a tilted camera sees the ground much farther than it stands from the hero: at 123.8 m and 50° the top of the 720p frame is
  160–170 m from the camera; at 35° — 200+ m. Every target past 150 m from the camera was still unreachable.
- The run itself works because the game's ground click is `Physics.Raycast(ray, out hit, LayerMask.GetMask("Ground"))` — the
  layer mask lands in the `maxDistance` slot (decompiled `PlayerController.Update`), so the ground ray reaches far and hits any layer.
  The hero walks to the clicked point; the target ray (100 → 150 m) found nothing, so there is no target to act on.

## Fix

KrinikCameraRework 1.3.2, `PatchMouseRayReach`: rays of `PlayerController` and `CursorIcons` (10 rays in 3 methods: click on item,
recipe, storage, villager; petting; the first-world portal check; cursor pick/talk/attack) reach `max(100 × MaxZoomFactor,
Camera.main.farClipPlane)` — the far clip is already fitted to the top of the frame by `FitFarClip` (+15 %). Spells, the bomb and pet
orders (30 rays) stay at ×`MaxZoomFactor`.

`FORK:` options <A: every mouse ray to the far clip | B: clicks and cursor to the far clip, spells/bomb/pets ×1.5 | C: a bigger factor
for all> · price of error <A — `CastSpell.FinishingMove` has no range check of its own: the ray length IS its dash radius, so A turns it
into a 280 m dash; B — a spell aimed past 150 m still falls back to the ground point (as in 1.3.1); C — still a cap, just farther> ·
consulted <the game's code: `PlayerController.Update` (target rays 100 m, the ground ray effectively unlimited), `CursorIcons.LateUpdate`,
`CastSpell.FinishingMove`/`EvadeShot`; the owner's word on the symptom; the owner's standing rule "nothing caps" (memory
owner-vibe-nothing-caps)>. B — what is seen is clickable; the spell balance is untouched.

## Verification

`testcases/TC_svarog_far_clicks_2026-10-10.md`, report `testcases/reports/2026-10-10_svarog-far-clicks.md`: K1 (repro + control on
1.3.1), C1 (axe 175 m from the camera picked), C2 (guard 172 m — hero walked 58 m, the guard answered), C3 (cursor "talk" far = near),
C4 (log: 10 rays → far clip, 30 → 150, guard 40/33), C5 (near click unchanged), C6 (save rolled back 7/7).

`TWINS: searched Physics.Raycast* with 100f after a mouse ray in Assembly-CSharp (bug 33 census) — 40 sites in 33 methods; 10 click/cursor
sites moved to the far clip, 30 spell/bomb/pet sites kept ×1.5 on purpose (FORK above).`

## Decisions made without the owner

- `[AI]` Spells, the bomb and pet orders keep ×1.5 (FORK B above) — a balance question, the owner reported clicks only.
- `[AI]` Reach source = the camera's far clip (what is drawn), not a fixed number.

## Links

bug 33 (`bugs/33_DONE_svarog_mouse_rays_100m_at_zoom_out.md`) · EXP-0207 · EXP-0209 · plan 18 («Слово владельца 2026-10-10 ≈18:46»)

## ✅ STATUS: DONE (2026-10-10 19:06 +03:00)

- Hygiene: camera mod and harness build without errors; guard `tools/ray-reach-check.sh` — 40 rays in 33 methods, matches the census.
- Functional run: the owner's save, his 720p borderless mode, right clicks as he plays (his action button), K1/C1–C5 above, read by
  `comps`, `cursorinfo` and frames.
- REAL WORLD: accumulated — the owner's save after his play 16:14–18:45 and his mod configs; data and machine — his machine, his display
  mode; path — max zoom-out, a right click on a far item/villager. Not walked: spells and pet orders far away (kept as in 1.3.1 on purpose).
- Standing falsehood: bug 33 and STATUS said «на отдалении значок даёт „говорить“, щелчок открывает разговор» — true only for targets
  within 150 m of the camera (the banker was near); corrected in `bugs/33_…`, `STATUS.md`, `plans/18_…`.
