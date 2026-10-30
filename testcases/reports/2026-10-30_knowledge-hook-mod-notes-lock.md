# Run report — knowledge-hook: the lock on mod work (one notes file per mod)

**Work.** `tools/hooks/knowledge-hook.mjs` `notesGate` — the owner's order 2026-10-30 ≈14:25–14:33 (verbatim in the hook header, KAIF #186): work on a
mod is refused until its notes `games/ConanExiles/mods/<Mod>.md` exist and are read in the session; a study prompts to write the findings there;
Stop blocks while a studied mod's notes are unwritten. Basis — the hook's self-test cases M13–M18 and the live session path.

**Contour.** Claude Code session b46b10e8 in KUMM, the hook wired as PreToolUse (Bash|PowerShell|Edit|Write) in `.claude/settings.local.json`,
PostToolUse and Stop as before; the Conan pack `ConanExiles`, the mod `UIMod_Hosav`.

**Runs.**
- 2026-10-30 ≈14:30 `node tools/hooks/knowledge-hook.mjs --selftest` — 18 of 18 ok (M1–M12 old, M13–M18 new); again 14:32 after the header edit.
- ≈14:31 live, before reading the notes: `python -I -X utf8 patch-mod-asset.py extract UIMod_Hosav W_SmoothHP <scratch>` → refused by the hook.
- ≈14:31 Read of the notes in the SAME message as the extract → the extract refused again (the Read is not in the session log yet).
- ≈14:32 the extract in its own call after the Read → ran (313 exports), then the PostToolUse prompt «ты разобрал UIMod_Hosav. Найденное — … в
  games/ConanExiles/mods/UIMod_Hosav.md».

**Checks.**
- Hygiene: self-test 18/18; `node --check`.
- Functional run: the live agent session — the deny reason, the pass and the prompt were read in the tool results above.
- M13 pass · M14 pass · M15 pass · M16 pass · M17 pass · M18 pass; live deny / pass / prompt — pass.

**Found.** A Read sent in the same message as the command does not count yet (session log written after the message) — recorded in the mod notes
and the hook header; not a defect of the lock.

**Traces.** The tool results of session b46b10e8 (≈14:31–14:32); the hook's self-test output.

**Verdict.** pass — the lock refuses mod work before the notes are read, lets it through after, and prompts the write; the Stop block is proven by
the self-test only (M17), not yet seen live.
