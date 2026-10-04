# Bug 18 — Svarog's Dream: minimap tooltip — title over the distance, italic description

**Status:** 🔴 OPEN (ticket by the owner's order «заводи себе тикетами багами и импрувментами» · 2026-10-04 ≈23:43)
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

none yet.
