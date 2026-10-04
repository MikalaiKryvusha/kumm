#!/usr/bin/env node
// voice-reminder.mjs — Claude Code PostToolUse hook: while the game is open, the agent must speak aloud.
//
// Why (the owner's word, 2026-10-04, rendered from Russian): "when the game is open I do not see what you do in VS Code —
// voice your thoughts, what you do, what you look for … why are you silent again? … maybe let's make hooks for you?".
// A rule held by memory was broken twice within the hour; this hook holds it by code.
//
// How: after every tool call — is the game alive (its log was written in the last --alive seconds; the game writes a
// status line every 30 s) and how long since the last spoken phrase (mtime of the --stamp file, touched by the voice
// tool on every phrase)? Silent longer than --after seconds → inject a reminder into the agent's context. Repeats at
// most once per --every seconds (its own mark file next to the stamp). Silent and exit 0 on anything unexpected: a hook
// must never break the session.
//
//   node voice-reminder.mjs --log <game log> --stamp <voice stamp file> [--after 90] [--alive 45] [--every 60]
//
// @guard voice-reminder
// THREAT:         the agent works with the game for minutes without a word; the owner, who cannot see VS Code, reads the
//                 silence as a hang (field: 2026-10-04, twice in one hour)
// PROVED-AGAINST: a stamp older than --after with a fresh game log (prints the reminder) and a stale game log (silent)
// GAP:            it reminds, it cannot speak for the agent; a phrase written but never played still counts as spoken
// ON-REAL-PATH:   2026-10-04 ≈10:48 +03:00 — fired in the live session with Svarog's Dream open (silent 92 s, 107 s),
//                 the agent spoke after each; both branches also run by hand (fresh log → reminder, missing log → silent)
import { statSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const LOG = opt('--log');
const STAMP = opt('--stamp');
const AFTER = Number(opt('--after', '90'));
const ALIVE = Number(opt('--alive', '45'));
const EVERY = Number(opt('--every', '60'));

const age = (p) => { try { return (Date.now() - statSync(p).mtimeMs) / 1000; } catch { return Infinity; } };

try {
  if (!LOG || !STAMP) process.exit(0);
  if (age(LOG) > ALIVE) process.exit(0);              // game closed — nothing to narrate
  const silent = age(STAMP);
  if (silent <= AFTER) process.exit(0);
  const mark = STAMP + '.reminded';
  if (age(mark) <= EVERY) process.exit(0);
  writeFileSync(mark, String(Date.now()));
  const secs = Number.isFinite(silent) ? `${Math.round(silent)} s` : 'the whole session';
  const text = `VOICE: the game is open and you have been silent for ${secs}. The owner cannot see VS Code — `
    + 'say aloud right now, in one or two Russian sentences, what you are doing and what you look for '
    + '(Write the phrase to a UTF-8 file, then play it with the voice tool, in the background).';
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: text } }));
} catch {
  process.exit(0);
}
