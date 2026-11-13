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
//
// Second mode (2026-11-13 21:30 +03:00, the owner's order — HOUSE_RULES rule 13, verbatim in PROJECT_HISTORY.md entry 2026-11-13 21:30): regular voice
// comments during ALL work, game or no game. `--always --voice-dir <voice/> --mark <file>`: the last spoken phrase is the newest `*.txt` in the voice
// folder (every phrase is written there first, rule 13.2); silent longer than --after → the reminder, at most once per --every.
//
//   node voice-reminder.mjs --always --voice-dir <KUMM/voice> --mark <.work/voice-reminder.mark> [--after 300] [--every 120]
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const LOG = opt('--log');
const STAMP = opt('--stamp');
const DIR = opt('--voice-dir');
const ALWAYS = args.includes('--always');
const MARK = opt('--mark', STAMP ? STAMP + '.reminded' : undefined);
const AFTER = Number(opt('--after', '90'));
const ALIVE = Number(opt('--alive', '45'));
const EVERY = Number(opt('--every', '60'));

const age = (p) => { try { return (Date.now() - statSync(p).mtimeMs) / 1000; } catch { return Infinity; } };
// the newest phrase file of the voice folder — its age is the silence
const newest = (dir) => { try { return Math.min(...readdirSync(dir).filter((f) => f.endsWith('.txt')).map((f) => age(join(dir, f)))); } catch { return Infinity; } };

const isDir = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };
// the hook event on stdin: a subagent's tool call (`agent_id`) is not the agent the owner listens to — it never gets the reminder nor spends the mark (judge round 2)
const fromSubagent = () => { try { return !!JSON.parse(readFileSync(0, 'utf8') || '{}').agent_id; } catch { return false; } };

try {
  if (!(STAMP || DIR) || !MARK) process.exit(0);
  if (fromSubagent()) process.exit(0);
  // --log wins over --always: with a game log the hook speaks only while that game is open; no game and no --always — off
  if (LOG ? age(LOG) > ALIVE : !ALWAYS) process.exit(0);
  if (DIR && !isDir(DIR)) process.exit(0);             // a wrong --voice-dir (missing, a file) is «unexpected» → silent, never a reminder every --every
  const silent = DIR ? newest(DIR) : age(STAMP);       // an existing folder with no phrase yet → Infinity → «the whole session»
  if (silent <= AFTER) process.exit(0);
  if (age(MARK) <= EVERY) process.exit(0);
  const secs = Number.isFinite(silent) ? `${Math.round(silent)} s` : 'the whole session';
  // The wording follows the SOURCE of the silence (judge round 2, finding 4): a stamp is touched only by the game's voice tool (SvarogsDream/tools/voice_say.py) —
  // sending the agent to silero_tts/say.py (no stamp) would remind every --every while it speaks; a voice folder is filled by rule 13's phrase files.
  const text = !DIR
    ? `VOICE: the game is open and you have been silent for ${secs}. The owner cannot see VS Code — `
      + 'say aloud right now, in one or two Russian sentences, what you are doing and what you look for '
      + '(Write the phrase to a UTF-8 file, then play it with the voice tool, in the background).'
    : `VOICE (HOUSE_RULES rule 13): you are working and the owner has not heard you for ${secs}. The owner cannot see VS Code — `
      + 'say aloud right now, in one or two Russian sentences, what you did, what you found and what is next '
      + '(Write the phrase to voice/<stamp>_<meaning>.txt, then play it with silero_tts/say.py in the background).';
  mkdirSync(dirname(MARK), { recursive: true });       // `.work/` is git-ignored: a fresh clone has no folder for the mark (judge, finding 5)
  writeFileSync(MARK, String(Date.now()));
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: text } }));
} catch {
  process.exit(0);
}
