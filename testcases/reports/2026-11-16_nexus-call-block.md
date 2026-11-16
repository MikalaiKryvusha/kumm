# Run report — the community call block on the Nexus page of the Conan build (mod 65)

## 1. Work

the owner's order 2026-11-16 18:02 (`[OWNER]` «в самом верху призыв помощи сообщества … подтолкнуть Нексус к скорейшему ревью сборки» · «правим наше описание»;
his «я сохранил» 18:14 and «давай, делай» 18:14 taken as the go): a bilingual call (EN, RU) at the very top of the description of
https://www.nexusmods.com/conanexilesenhanced/mods/65, written by the voice portrait, checked by a clean instance (§7B, 14 findings fixed), and the new editor tool
`tools/nexus-desc.mjs` that put it there. Basis: the block text `.work/nexus-call/call_block.bbcode` (the shown version, owner-approved).

## 2. Contour

the live Nexus Mods site, the owner's account in the debug-Chrome profile `%LOCALAPPDATA%\nexus-cdp\profile` (port 9222, window minimized, tabs
opened in the background, focus emulated); the mod edit page `/games/conanexilesenhanced/mods/65/edit/general` (SCEditor, BBCode, source mode).

## 3. Runs


1. 2026-11-16 18:08 — `node nexus-desc.mjs open "https://www.nexusmods.com/games/conanexilesenhanced/mods/65/edit/general"` · `node nexus-desc.mjs read current_live.bbcode` (59 483 chars — the backup).
2. 18:14 — `node nexus-desc.mjs read now_before_call.bbcode` (equal to the backup) · `node nexus-desc.mjs write full_with_call.bbcode` · `node nexus-desc.mjs save`.
3. 18:14 — `node kumm.mjs eval "https://www.nexusmods.com/conanexilesenhanced/mods/65" "<read the description>" --game conanexilesenhanced` (twice: position of the block; links and the old text).
4. 18:15 — the tool moved to `tools/nexus-desc.mjs` (tab file into `.work/`): `node tools/nexus-desc.mjs open <edit url>` · `node tools/nexus-desc.mjs read .work/nexus-call/readback_fresh_tab.bbcode`.

## 4. Checks


Hygiene: `node .kaif/tools/kaif-voice-lint.mjs check .work/nexus-call/call_block.bbcode` — 0 findings (before and after the §7B fixes); the §7B pass by a clean subagent — 14 defects, all fixed.
Functional run: the owner's path — the public mod page in a fresh tab, read as text. Seen: «Help us get the pack released on Nexus Mods» at offset 1677 of the page text,
  BEFORE the pack's title line (4535); the Russian heading «Помогите выпустить сборку на Nexus Mods» and «Спасибо!» present; both «GitHub» anchors → the public repo; the Nexus support address ×2;
  the old description below intact («Main features», «Русский текст»). The editor of a fresh edit tab holds 62 729 chars = the written 62 728 + the one real space, the block first.

| Case | Expected | Seen | Status |
|---|---|---|---|
| Save after `write` | Save enabled, «Mod saved successfully.» | `Save disabled=false` ×2 → «Mod saved successfully.» | pass |
| The block on the public page | first, above the title; EN and RU | offset 1677 < 4535; RU present | pass |
| The rest of the description | unchanged | the fresh editor = written text (trimmed equal) | pass |
| The tool from `tools/` | tab file outside `tools/` | `.work/nexus-desc-tab.txt`; no `tools/tab.txt` | pass |

**Judge round 1 on the tool (18:18) and the hardened version (18:2x–18:3x).** Confirmed and fixed: the keystroke could land in another SCEditor than the written one
(now exactly one editor, the keystroke into the source textarea whose text IS the editor's value); CDP errors and a dropped socket passed as success (now reject → exit 1);
`write` / `save` / `read` never failed loudly (now: text ≠ file + space, Save still disabled, empty read, no toast — exit 1); a BOM reached the page (stripped);
`pathname` broke on spaces (`fileURLToPath`); `/json/new` opened a foreground tab (now `Target.createTarget` with `background: true`); no `close`. Runs on the live page
(no content change): `open` → `read` 62 729 · `save` without `write` → «nothing written by `write` in this tab — refusing…» exit 1 · `write` → Save enabled, the pending
text recorded · the editor tampered (+«X») → `save` → «the editor text is not what `write` put there — refusing to save» exit 1 · `close` → the tab and the pending text gone ·
a BOM file → the editor's first char `[` (91). **An incident inside the test:** the FIRST hardened `save` (no pending guard yet) was run as a «refusal expected» case on a fresh
tab — Save was enabled there without an edit, and the tool SAVED: a fresh tab read the stored text after it — byte-identical to the text before (62 729, `cmp`), so the page
did not change; the pending guard was added for exactly this. So the click → toast path ran ONCE in the hardened round-1 code (that accidental save, the toast seen); since the
pending and proof guards it has not run with a publish (an identical write leaves Save disabled — Nexus sees no change, the tool refuses with exit 1, seen).

**Judge round 2 (18:26) and the fixes (18:3x).** Confirmed and fixed: a `send` on a closed socket dropped the call and Node exited 0 (now rejects; `process.exitCode`
1 until a success path sets 0); the pending text was not tied to its tab (now `{tabId, text}`, forgotten by `open` / `write` / `close`, `save` refuses another tab's);
the compare and the click ran in four evaluates (now one); `read` returned SCEditor's CONVERSION — a read-only probe in a fresh tab: the editor starts in WYSIWYG, its `val()`
62 729 vs the stored text in the page's original textarea 62 719, the diff only line breaks after `[/list]` (5 places), the support address plain in both — `read` now writes
the stored text and says whether the conversion differs; an empty `write` (refused). Runs (live, no publish): no command → usage, exit 1 · `read` → 62 719 (stored) ·
`save` without `write` → exit 1 · empty file → exit 1 · `write` → Save `[true,true]` before the key, `[false,false]` after · `save` with the pending text of another tab
→ exit 1 · the editor tampered → «refusing to save: the editor text is not what write put there», exit 1 · `open` → the pending text gone · `close` ×2 → both tabs closed.
**Judge round 3 (18:35) and the fixes (18:4x).** Confirmed and fixed: `close` printed «closed» on any error and lost the tab id (now checked by `/json/list`, the id kept
on failure); the toast proved A save, not WHICH text (now `save` reads a fresh background tab and compares the stored text with the written one, whitespace aside — Nexus
re-flows line breaks: 62 728 written → 62 719 stored; the same check is the command `verify <file>`); `read` in a written tab (refused); `write` on an unloaded page (refused);
`open` left orphan tabs (closes our previous one); the settle after the key 1.6 s (SCEditor's 1.5 s timer after a second space). Runs (live, no publish): `verify
full_with_call.bbcode` → «the stored text = the file (62719 / 62728 chars, whitespace aside)», exit 0 · `verify current_live.bbcode` (the old description) → «NOT the file
(59483)», exit 1 · `write` then `read` in that tab → refused, exit 1 · a second `open` → the first tab gone from the list, the pending text gone · `close` → gone from the list.
Found on the way: two SIMULTANEOUS loads of the edit page — the proof tab raised no editor in 30 s (twice); sequential loads work, so `verify` waits for its own tab first.

**Judge round 4 (18:42) — no defect; four risks closed (18:4x).** A whitespace-only change cannot be proven by the whitespace-blind check (`write` marks it, `save`
says «SAVED, NOT PROVEN»); a proof failing AFTER the toast now says «SAVED (the toast was seen), NOT PROVEN … do NOT save again; run: open, then verify» and the pending
text is forgotten at the toast; an evaluate during the proof tab's navigation counts as «not ready»; an empty stored text in the proof tab is «not loaded / 403», never
«wiped»; `tabSocket` throws (the proof tab is closed in `finally`); `closeTab` waits up to 5 s. Runs (live, no publish): `verify` saved → exit 0 · old → exit 1 · `write`
of the stored text (+ the space) → «note: the change is whitespace-only …», pending `wsOnly: true` · `verify` with a missing tab id → «tab AAAA not found», exit 1 · `close` → 0.
Still not run: the `save` → proof path with a real publish (the next real description edit is its first run).

The backups `current_live.bbcode` / `now_before_call.bbcode` are therefore conversions (line breaks after `[/list]` added), not byte copies of the stored text.

## 5. Found

- the debug-Chrome Nexus login had expired (`kumm status` → «не залогинен»); the owner signed in again at 18:0x — recorded in `HOUSE_RULES_REFERENCE.md` §2. No defect of the tool.

## 6. Traces

`KUMM/.work/nexus-call/` (`current_live.bbcode` — the description before the edit, `full_with_call.bbcode`, `readback_fresh_tab.bbcode` — the read-back); the WRITTEN description (= the read-back, whitespace aside) kept in the release folder as
`D:\Games\Conan Exiles Mods\Krinik_Mod_Pack_0_9_0_Nexus\nexus_full_description_2026-11-16_live.bbcode`. Not looked at: the page as rendered pixels (the window is the
owner's and minimized) — the text and the links were read from the DOM.

## 7. Verdict

pass — the block is live at the top of the page; the look of the rendered block is the owner's eye.
