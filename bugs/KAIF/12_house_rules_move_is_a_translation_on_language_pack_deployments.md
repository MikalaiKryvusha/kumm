# KAIF improvement request: on a language-pack deployment the 2.8 move of project facts into `HOUSE_RULES.md` is a hand translation the update task never mentions

kaif-fp: 2.8 news "PROJECT FACTS MOVED FROM THE GUIDE TO THE HOUSE-RULES FILE" · `.kaif/_house-rules-template.md` · task item `language-arrivals` :: house-rules-move-needs-rendering :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/152
**Autocapture:** KAIF 2.9 (updated 2.7 → 2.9, route `bootstrap`, 2026-10-16) · project KUMM · sphere `programming` · language `ru`
(language pack) · tracking `origin` · agent system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `ls bugs/KAIF/` → nothing on house rules; `gh issue list --repo MikalaiKryvusha/KAIF --state all --search
"house rules language pack translate"` → #85 (budgets of a translated canon) is a different class; no match for the move.

## Gap

The skeleton says: "The owner reads this file, so the copy is written in the project's working language (`.kaif/kaif.json` →
`language`), headings included." The 2.8 migration tells the agent to "move your tables and recipe into `HOUSE_RULES.md`". On a
language-pack deployment those tables live in the English `AGENT_GUIDE.md`, so the move is a RENDERING of English rows into the
owner's language. Here: 44 rows (test harness 9, environment dossier 15, tools 20), several of them paragraph-long hook
descriptions with the owner's quotes. The `language-arrivals` item names only the skeleton file; nothing says the moved rows must
be rendered. Two more costs we paid: (1) the guide, the skills and the task point at the English section names ("Tools of this
project", "Stands, environments and devices"), while the skeleton asks for headings in the owner's language — we kept both
(Russian heading, English name in parentheses); (2) the rendering is where meaning breaks: an independent judge found one row
whose Russian inverted a guard's logic (a run allowed only when BOTH conditions hold read as allowed when EITHER does), and ~23
smaller language defects in the first draft.

## Proposal

1. One sentence in the 2.8 migration note and in the update task: on a language-pack deployment the moved rows are rendered into
   the owner's language — commands, paths and quotes verbatim — and the rendering is checked against the English source.
2. Keep the English section names as anchors in the skeleton (e.g. `## 3. <localized heading> (Stands, environments and devices)`),
   so pointers in the guide and skills stay valid in every language.

## Field evidence

KUMM, 2026-10-16, update 2.7 → 2.9: ≈ 25 minutes for the rendering; the judge's findings F5 (logic inversion) and F12 (language)
were on that rendering. Fixed before the commit.

## Local remediation (per the "defect in KAIF itself" contour, if applied)

`HOUSE_RULES.md` written in Russian with the English section names in parentheses.
