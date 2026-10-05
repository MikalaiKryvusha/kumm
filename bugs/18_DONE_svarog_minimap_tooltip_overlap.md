# Bug 18 — Svarog's Dream: minimap tooltip — title over the distance, italic description

**Status:** ✅ DONE 2026-10-05 11:07 (ticket by the owner's order «заводи себе тикетами багами и импрувментами» · 2026-10-04 ≈23:43)
**Severity:** S3-class papercut kept as a ticket at the owner's word
**Version/build:** `SvarogsDream` `KrinikUIRework` at `02a078e`
**When/context:** 2026-10-04 23:34 +03:00, seen by the agent on a frame while fixing bug 16 (cursor rested on the minimap)

## Goal vector

Avoid: a HUD tooltip that overlaps itself. Done when «Направления» and «1077м» have a visible gap and the description is
upright (rulebook Т3 «курсива нет нигде», В4 «ничего не налезает»).

## Symptom

Frame `SvarogsDream/gallery/game/2026-10-04_вкладки-меню/c_minimap_tooltip_overlap.webp`: the last letter of «Направления»
covers the «1» of «1077м»; «Направление к следующей квестовой локации.» is italic with tight lines; translucent backing.

## Repro

`tools/mouse.ps1 -X 3700 -Y 600 -Button move` (cursor on the minimap) → `tools/h.sh "shot t"`.

## Hypotheses

1. `FitTitleBeforeValue` (`Plugin.cs`) did not run for this tooltip, or measured before the translation arrived.
2. The italic removal (ideas/07 п. 1) does not reach this tooltip's description text.

## Decisions made without the owner

- `[AI]` Closed as not reproducible on the current build, with the owner's eye as the acceptance; the exact change that cured it is not established (the fit code existed already at the frame of 23:34).

## 2026-10-05 10:24 — overlap not reproducible; owner: open the tooltip DOWNWARD

Not reproducible on `SvarogsDream` `73b7d2b` (2026-10-05 10:24, fresh start, owner's save, first hover of the session):
cursor on the minimap (`mouse.ps1 -X 3700 -Y 600 -Button move`) → `GlobeToolTip`; the mod log says
`globe title fit: 'Направления' 122->102 (need 348, room 293)`; the frame shows a clear gap between «Направления» and
«1258м», the description upright (no italic), solid dark backing. Frame:
`SvarogsDream/gallery/game/2026-10-05_баг18-подсказка-карты/after_minimap_tooltip.webp`.
Owner: `[OWNER]` «подсказка выглядит хорошо» · 2026-10-05 ≈10:24.

Hygiene: none (no code change). Functional run: one game start, hover, frame read by eye and by the owner.
Left for the translation task: the title says «Направления» (plural) over «Направление к следующей квестовой локации».

Owner after the frame: `[OWNER]` «только её не вверх а вниз нужно открывать» · 2026-10-05 ≈10:25 — the tooltip grows up from
the cursor and covers the minimap; it must open below the cursor. Not DONE until that.

**Fix 2026-10-05 10:29:** `KrinikUIRework` `PatchGlobeTipBelow` (`SvarogsDream` `2f12a6c`) — a globe stat in the upper half of
the canvas puts the tooltip's top under its own bottom with a gap, right edge inside the canvas; the spheres at the bottom
keep the game's placement. Run `testcases/reports/2026-10-05_svarog-bug18-compass-tooltip.md` — pass. Waits for the owner's eye.

## ✅ STATUS: DONE (2026-10-05 11:07 +03:00)

Owner on the frame: `[OWNER]` «суппер! Ты починил» · 2026-10-05 ≈11:06. Hygiene: build. Functional run:
`testcases/reports/2026-10-05_svarog-bug18-compass-tooltip.md` — pass (compass tooltip below, twice; spheres unchanged).
