# Test cases — the tails of interview #024 and the instant translation of rules with a number (bugs 56, 57)

**Created:** 2026-10-29 · **Under test:** `SvarogsDream/src/KrinikUIRework/InstantTranslate.cs` (template letter `[{][{][A-Z][}][}]` in `r:` rules →
any number, commit `f44c36e`), `TooltipFit.cs` (`PatchBuffTipAboveIcon`, `Bounds` by our paper's border), `HudRow.cs` (`DigitDropK` 0.12) ·
**Version/build:** KrinikUIRework built 2026-10-18 13:43 (`f44c36e`), never deployed before this run (the game held the 13:32 build)
**Test basis:** `[OWNER]` «и когда наводил на навыки курсор - перевда не было секунду, было на английском. затем стало на русском, старый баг» ·
«неполнота переводов» · 2026-10-18 ≈13:38–13:39 (bugs 56, 57); interview #024 Q3 «3 А, но они сейчас чуть выше середины» and Q4 (the strip);
the open cases S10c, R1, CD1 of `testcases/TC_svarog_buff_strip_order_wrap_2026-10-18.md`.

## 1. Goal vector

Achieve: a skill card in the Mastery window is Russian in its first frame, including the «Scaling: … per 100 points.» line; the cooldown digit
sits in the middle of a skill slot; the tooltip of a strip icon stands just above its icon.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| Q1 | WHEN the player hovers a skill in the Mastery window, the card's description shall be Russian from the first frame | `tmpwatch …/SpellTooltip/Description 30`: frame 0 holds no English word outside the whitelist (key names, numbers) |
| Q2 | The «Scaling: <attributes> per 100 points.» line shall be translated | the description text read by `gettext` holds no «Scaling» and no «per 100 points» |
| Q3 | The mod shall load the `r:` rules without failures | log line `instant translation: … bad 0` |
| Q4 | The cooldown digit of a skill slot shall be centred in the slot box | `node SvarogsDream/tools/digit_center.mjs <frame> <x> <y>`: \|dy\| ≤ 3 % of the box height |

## 3. Stand

- Save: the live save of 2026-10-18 13:43 (the owner's last play); copy — `_backups/svarog-saves-2026-10-29_2103-before-debt024`.
- Place: Grad, by the inn (`teleport innGradLocation`) — no enemies around, day; immortality only if the load lands in a fight (`SAFE_SPOT`).
- Hero: Tamara as saved; a skill in set 1 for CD1 — assigned by the remote (`call SpellsActionManager AssignSpell <slot> <skill>`; on 2026-10-18 it did not
  take — find why before CD1).
- Screen: 4K full screen; desktop HDR off for clips (`powershell -File SvarogsDream/tools/hdr.ps1 off`), back on only after `h.sh kill`.

## 4. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered |
|---|---|---|
| skill | «Сейсмический Толчок (Порядок)» (the owner's frame, two attributes) · one single-attribute skill | every skill of every school — the rule is one regex for all |
| moment | frame 0 after hover · after 1.5 s | — |
| switch `Translation.Instant` | on · off (control) | — |
| digit | skill slot «1» · E (passed 2026-10-18) | F, G |

## 5. Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| IT0 | Launch → the mod log has `instant translation: … rules …, bad 0` | smoke | [NOT-TESTED] |
| IT1 | Mastery window → hover «Сейсмический Толчок» → `tmpwatch` Description 30 frames → frame 0 Russian, «Scaling» line Russian | state transition | [NOT-TESTED] |
| IT2 | Same skill after 1.5 s → `gettext` Description → the same Russian text as frame 0 | regression | [NOT-TESTED] |
| IT3 | Control: `Translation.Instant` off → hover another skill → frame 0 English (the check can fail); switch back on | control case | [NOT-TESTED] |
| IT4 | A single-attribute skill → its «Scaling» line Russian | equivalence partition | [NOT-TESTED] |
| CD1 | Skill in slot «1», cast, cooldown running → frame → `digit_center.mjs` \|dy\| ≤ 3 % | measurement | [NOT-TESTED] |
| S10c | (from the strip file) hover with the real mouse on a strip icon in each of three rows → the border bottom 5–25 px (4K) above the icon top | measurement | [NOT-TESTED] |
| R1 | (from the strip file) tooltip of a row slot (E, «1») above the slot, left edge on it | regression | [NOT-TESTED] |
