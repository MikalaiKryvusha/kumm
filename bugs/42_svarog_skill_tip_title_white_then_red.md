# Bug 42 — Svarog: skill tooltip title shows white for ~0.5 s, then red, when moving between skills

**Status:** 🔴 OPEN
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
none yet

## Links
EXP-0224 (XUnity re-sets TMP font on text change) · TC C72
