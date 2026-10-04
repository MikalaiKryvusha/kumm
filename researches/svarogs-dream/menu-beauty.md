# Research — Svarog's Dream: menu windows beauty (epic 10)

> **Created:** 2026-10-04 23:45 +03:00 · **Parent:** `ideas/07_svarog_mods.md` п. 24 · owner approved the plan 2026-10-04
> ≈23:40 · **Status:** done for the meta-plan; deepen per phase · **Outbound:** — 

Short by the owner's standing order: `[OWNER]` «старайся приносить 80% ценности за 20% усилий. Что будет багами или
импрувментами оставаться- заводи себе тикетами багами и импрувментами» · 2026-10-04 ≈23:43.

## 1. Industry sweep (sources)

| Source | What it gives this epic |
|---|---|
| Xbox Accessibility Guideline 101 «Text display» — https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/101 | text size for couch distance, line spacing ~1.5, line length ≤ 80, left alignment (rulebook Т1, Т5–Т7) |
| Xbox Accessibility Guideline 102 «Contrast» — https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/102 | text vs its background in MENU UIs is in scope; low-contrast defaults exclude low-vision players |
| WCAG 2.2 SC 1.4.3 «Contrast (Minimum)» | 4.5:1 text, 3:1 large text (rulebook Т2) |
| WCAG 2.2 SC 1.4.11 «Non-text Contrast» — https://appt.org/en/guidelines/wcag/success-criterion-1-4-11 | the SELECTED/hover state of a list row must itself differ by ≥ 3:1 from adjacent colours — the "selected god is not marked" defect |
| Game UI practice (e.g. https://www.abratabia.com/game-ui-design/) | consistent dark/opaque backing behind text over varied backgrounds; don't encode status by colour alone |
| Our gallery `SvarogsDream/gallery/refs/` (Diablo IV, FTK, Torchlight…) | opaque dark tooltips; numbers bright; list rows calm with a small colour marker |

Anti-patterns the industry dropped and we see in the game: translucent tooltips over busy content; saturated full-width
colour bars as the only category cue; fixed absolute layouts that break on translation.

## 2. Local recon (read from code, 2026-10-04)

- Dark paper for windows: `SvarogsDream/src/KrinikUIRework/Letters.cs` — `PaperSprites = { "Paper", "Mb2", "Info_b" }`,
  `DarkWindows = { "InfoPanel" }`; `Letter()` darkens paper images and lifts EVERY dark UGUI text in the window
  (`KrinikLift` mesh effect) — including text on light "White bar" plates (Help sections, Almanac entries): 1.67–1.89.
  TMP texts get only their base colour lifted (`t.color = Lift(...)`); colours from `<color>` tags are not — Help keywords
  1.24. The dialogue already has the fix for tags: `KrinikTmpLift` (vertex colours after each mesh rebuild, `Dialogue.cs`).
- Character window (`UI/CharacterPanel`, tabs `DevotionHeader` / `AttributesHeader` / `MasteryHeader`) is NOT in
  `DarkWindows` — hence two styles. Its paper sprite still to be read by `dump` (phase 2, step 1).
- Bubble text colour by its own strip — `Dialogue.cs` `BubbleTextColor` (bug 16): the pattern for "colour by background".
- Instruments: `SvarogsDream/tools/contrast.py` (WCAG from a frame), `tools/textrows.py` (letter height, line gaps).
- The menu tour sheet with all frames and measurements: `SvarogsDream/gallery/game/2026-10-04_вкладки-меню/index.html`.
- Lessons: `EXP-0136` (text colour blind to background), `EXP-0128` (layout engine, not point fixes), `EXP-0133` (parity by
  measured pairs).

## 3. Requirements

Owner verbatim: «я бы хотел, чтобы ты ещё все экраны и разделы меню и всех вкладок пересмотрел, и рам предложил план по
наведению красоты» (≈22:14) · «Начнём с твоего изучения вкладок меню, открытия квестов, богов, навыков…» (≈23:00) · on the
sheet: «да, суппер план! очень подродно расписал, спасибо, молодец!!! запиши его в планы по Сварог Дрим. И пиши его на фича
и эпик планы, и по твоему списку приступаем» (≈23:40) · the 80/20 order above. Mission and rulebook: `ideas/07`,
`SvarogsDream/docs/UI_RULEBOOK.md`.

## 4. Implications for the epic

1. Phases 1–2 are mostly configuration of what exists (`Letters.cs` lists, `KrinikTmpLift` reuse) — highest value per
   effort; do them first.
2. List rows (phase 3) and tables (phase 4) need the layout engine (`researches/unity-ugui-layout/`) — real code.
3. Every phase closes by measured frames (`contrast.py`, `textrows.py`) and the owner's eye for taste.
4. Small leftovers outside the phases become tickets (`bugs/` defects, `ideas/` improvements), not scope creep.

## 5. Open forks for the owner

None blocking. Taste points are shown as frames at phase close (row look in phase 3 — a sheet of 2–3 variants).
