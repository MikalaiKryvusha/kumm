# Bug 42 — Svarog: skill tooltip title shows white for ~0.5 s, then red, when moving between skills

**Status:** ✅ DONE 2026-10-17 03:52 — fix `1050849` verified in game (TC N1–N3)
**Severity:** S3 (cosmetic flicker; owner-visible)
**Version/build:** SvarogsDream `62a50d0` · **When/context:** 2026-10-13 morning in-game review; owner's word: `[OWNER]` «а заголовки навыков при ховере в поп-апе сразу розовые, и чеерез мгновение красными становялся» · 2026-10-13
**Test case:** `testcases/TC_svarog_hero_card_2026-10-12.md` C72

## Symptom
Mastery screen, skill tree: hovering one skill, then moving straight to another, the new tooltip's title (Chaos red, e.g. «Укус Преследователя (улучшение)») is drawn WHITE (owner saw it as pink) for ≈28 frames (≈0.47 s at 60 fps), then turns red. The first hover from empty space shows the final colour at once.

## Repro (deterministic)
1. Open Mastery (class badge on the hero card), class «Охотник».
2. Real mouse onto node (760,628), wait 1 s, real mouse onto node (2040,628).
3. Record the screen: `ffmpeg -f lavfi -i "ddagrab=output_idx=0:framerate=60" -t 3 …` (script pattern: scratchpad `rec_hover.sh`).

## Forensics
- Video `SvarogsDream/_harness/c72/hover.mkv`, strip `strip.webp`: ≈0.5 s blank between tooltips, then ≈28 frames white title, then red.
- `TextMeshProUGUI.color` of `…/MasterySkills/SpellTooltip/Name` polled 10× right after the switch: always (1, 0.29, 0.29) — the PROPERTY is red the whole time; the white is in the mesh/material.
- The Name text has sub-meshes with other materials: «Manrope-Medium Material», «Constantia Regular SDF Material»; XUnity's OverrideFontTextMeshPro swaps the TMP font on every text change (EXP-0224).

## Hypotheses (ranked, not verified)
1. The first frames render through a fallback-font sub-mesh (Constantia → Manrope) whose vertex colours are not yet updated after XUnity swaps the font; the next mesh rebuild applies the red.
2. `KrinikTmpLift` (vertex colour pass) runs on a stale mesh during the font swap.

## Fix plan
Not started. First: `dump` the Name text + sub-mesh materials frame by frame (pult `wait 0.05` series) during a switch; then force `ForceMeshUpdate()` after our styling in `PatchSpellTip`.

## Decisions made without the owner
- `[AI]` 2026-10-15: the tooltip's `Style` takes the letter window's final colour at once (fix `1050849`), instead of `ForceMeshUpdate()` of
  the plan above — the cause by code was the second styler, not the mesh.
- `[AI]` 2026-10-17: closed on one class («Охотник») and one switch observed frame by frame; other classes not run.

## Links
EXP-0224 (XUnity re-sets TMP font on text change) · TC C72

## 2026-10-15 — cause by code, fix deployed, not observed in game yet

Cause (by code, `[AI]`): the Mastery window is a «letter» window (`KrinikLetter`): for 2 s after a show it re-styles every frame, then every
`Refresh = 0.5` s, and its `Lift` turns the author's red into the juicy `#FF4A4A` (rulebook §6a p. 5). The skill tooltip lives inside it.
On a skill switch the tooltip's own `Style` paints the title first (lerp toward white by `TipTextBrightness`) — white/pink — and the window's
next pass ≤ 0.5 s later repaints it red: «≈28 frames white, then red» matches the 0.5 s refresh. The polled `color` being red all the time
(2026-10-13) is not explained yet — the poll may have run after the pass.
Fix: SvarogsDream `1050849` — `Style` gives a TMP text inside a `KrinikLetter` the window's final colour at once (`Lift` is idempotent on a
lifted colour). Deployed 21:12; TC K1/K2 (`testcases/TC_svarog_batch3_smallbugs_2026-10-15.md`) blocked — the mastery tooltip path is not
addressable before the first hover; the probe `tmpwatch <path> <frames>` is in the pult for the next run.

## ✅ STATUS: DONE (2026-10-17 03:52 +03:00)

Hygiene: NONE (no code changed in the verifying run).
Functional run: the owner's game, Mastery → class «Охотник», the real cursor from node (760,628) to node (2040,628); `tmpwatch` of
`UI/CharacterPanel/MasteryPanel/MasterySkills/SpellTooltip/Name` read: after the text switch to «Укус Преследователя (улучшение)» the
property and mesh colour are (1.00 0.29 0.29) in all 18 samples (≈0.13 s apart — the old ≈0.47 s white phase would show in 3–4); frame
`n3_b` — the title is juicy red. Report `testcases/reports/2026-10-17_svarog-bug42-skill-tip.md`, TC `testcases/TC_svarog_bug42_skill_tip_2026-10-17.md`.
