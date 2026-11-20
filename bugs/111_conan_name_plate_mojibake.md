# Bug 111 — a character's name on a plate shows replacement diamonds and katakana instead of letters

> **GitHub issue:** [#10](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/10) — the public tracker of this defect (HOUSE_RULES 44)

**Status:** 🔴 OPEN — recorded only; the chat is paused by the owner, no investigation started
**Severity:** S3 by the ladder (a visual defect: cosmetic by HOUSE_RULES 38, not critical) — but the owner flagged it, so it is the owner's debt
**Version/build:** Krinik Mod Pack 0.9.1-RC1 (the release build), Conan Exiles Enhanced 3.1.1, the owner's working game `D:\Games\Conan Exiles 3.1.1`
**When/context:** 2026-11-20 18:34 +03:00, the owner's own play after his working game was moved to the RC1 release build; his frame and the word «баг»
**Fixing:** after the pause — first item when the owner says to continue (owner's debt, `BUG_FIXING_FRAMEWORK.md`)

## Symptom

A dark-blue plate with a gold frame shows a name line and «Уровень 21» under it. The name line is
`�レ�タ��������` — eleven glyphs: the replacement character (a diamond with a question mark, U+FFFD) nine times, and the katakana «レ» and «タ».
«Уровень 21» on the same plate renders correctly, so the font has Cyrillic; the name STRING itself is broken (a text decoded in the wrong encoding).
Frame: `bugs/111_frames/owner_2026_11_20_1833.webp`.

## Repro (deterministic)

Not known yet. Which screen the plate belongs to (a target plate, a follower or thrall panel, an NPC dialogue header) and which character it names — to be
found from the frame and the build's UI first, then asked of the owner only if the sources do not settle it.

## Forensics

None yet.

## Root cause / Hypotheses

Not investigated (the pause). Hypotheses to check in this order, cheapest first:
1. A name string of a mod's data table or locres written to the pak in a wrong encoding by our translation pipeline (UTF-8 bytes stored where the engine reads
   UTF-16 or Latin-1) — sweep the build's text sources and the deployed paks' strings for U+FFFD and katakana.
2. A name generated at run time by a mod (new factions, named characters) from a source table with broken text.
3. A Lua mod of ours composing the plate's text from bytes (a UE4SS FString built from a Lua string with non-ASCII).

## Fix plan

Find the plate and the string's source → the encoding at fault → fix at the source (HOUSE_RULES 24, 8) → sweep every string of the same source for the same
class (twin check) → a guard that fails a pak or table holding U+FFFD → a frame of the fixed plate.

## Decisions made without the owner

- `[AI]` Severity S3 (cosmetic by HOUSE_RULES 38); priority raised to the owner's debt because he flagged it.

## Links

- Owner's frame: `bugs/111_frames/owner_2026_11_20_1833.webp`
- STATUS «Where to continue» — the PARKED line of 2026-11-20 17:42
