---
name: game-hunt
description: Hunt defects in a modded game build by the bug-bounty method adapted to game testing — a session goal with one or two defect classes, a coverage walk over the play matrix with negatives recorded, a baseline control behind every claim, a seven-question gate before a finding becomes a bug document or an issue comment, the sibling hunt, the owner's "find more" protocol and a retraction appendix. Use when testing a build or a mod by play, for the play report of a release candidate, or when the owner says bugs remain that the agent did not find. Not for fixing (BUG_FIXING_FRAMEWORK.md, systematic-debugging) and not for web security.
trigger: /game-hunt
---

> **Adapted for KUMM from [claude-bughunter](https://github.com/elementalsouls/Claude-BugHunter)** (© Sachin Sharma; skill text
> CC BY 4.0, code MIT), upstream commit `c5d5c38`, clone in `D:/work/ai_sandbox/_tools/claude-bughunter`. Taken: the method of
> `skills/bb-methodology`, `skills/triage-validation`, `skills/evidence-hygiene`, `commands/autopilot.md`, `commands/pickup.md`.
> Changed: every web-security part dropped; the phases, the gate questions, the false-positive rules and the evidence rules rewritten
> for game testing; the coverage ledger is the project's play matrix; the outputs are KAIF documents. Why and what else was left out —
> `researches/agent-skill-packs/README.md`.
> ⚠️ Read only those METHOD files upstream. Its `hunt-*` attack skills tripped the model's safeguards on 2026-11-20 21:40 and paused
> the session (`EXPERIENCE.md`, the lesson of that date).

Trigger aliases (ru): «охота на баги», «поищи баги в сборке», «протестируй сборку игрой», «найди ещё баги»

# Game hunt

A hunt is not "look around the game". It is: prove that a PLAYER loses something because of OUR build, with the control that rules
out the game itself. Coverage and correctness are two separate axes and both stay on full: the gate below kills single findings,
never the session.

## Where it plugs in

| | |
|---|---|
| Inputs | the game map `games/<Game>/GAME_*_MAP.md`, the mods' notes `games/<Game>/mods/*.md`, the play matrix `testcases/TC_<game>_play_matrix.md`, the last play report's «Not covered», open `bugs/` and issues of the target |
| Hands | the agent's play skills (`ConanExiles/_config/skill.sh <name>`, plan 60), the remote, the background input path (HOUSE_RULES: the game in the background takes no owner keyboard) |
| Outputs | the play report (`testcases/_play-report-template.md`), bug documents (`/report-bug`), comments on existing issues, matrix row statuses |

## 1. Session start — the HUNT line, before touching the game

Read the matrix statuses, the last report's «Not covered» and the target's open bugs first (the upstream `/pickup`): a row that passed
on this pack commit is not walked again unless one of its mods changed. Then write one line:

`HUNT: target <matrix rows · mod · feature> · goal <crash | freeze | slowdown | dead button | dead end | save-load | wrong behaviour | cosmetic> · classes <one or two from §2> · route <wide | deep>`

| Signal | Route |
|---|---|
| a new build, a new mod, an update of the game, the first report of a release candidate | **wide** — every row of the target, shallow |
| a row with a fresh owner bug, a mod changed since the last report, a cluster of issues on one mechanism | **deep** — few rows, every class |

## 2. Defect classes — pick one or two per session, rotate the rest

| Class | What to try |
|---|---|
| Transitions | loading screens, waystones, dungeons, death and respawn, save and load, menu open and close, alt-tab, a resolution or window-mode change — the mod's state before and after |
| Input | binds that collide (the camera owns the numpad), a key held across a transition, spam, double clicks, input during an animation, a text field that eats game keys |
| UI | dead buttons, focus traps, overlaps, untranslated or cut text, flicker (a 60 fps video, not frames), the Esc menu column |
| Timing and performance | frame-time spikes and hitches on the player's path (run, fight, open world), a leak over a long session |
| Mod interplay | two mods writing the same value or widget, load order, a third-party mod we ship next to ours |
| Persistence | settings, binds and the save survive a restart of the game and of the launcher |
| Long session | an hour of play: the defects that need time |
| World and AI | NPCs, creatures and the camera around what our mods change |

## 3. The loop — non-linear, go back whenever stuck

RECON (the map, the notes, the pack's change log since the last report) → MAP (every key, button and transition our mods touch on
the target) → FIND (walk the class checklists with real input) → PROVE (§4 control, a repro twice from a fresh state) → GATE AND
FILE (§5, §6).

| Stuck because | Go to |
|---|---|
| 20 minutes on a row and nothing | rotate: class → row → mod |
| found one defect | 20 minutes of SIBLINGS: the same mod, the same mechanism, the same habit of its author |
| a new surface appeared while finding | back to MAP, list it, then walk it |
| a symptom with no repro | write it under «Weird, not yet a bug» with what was seen, move on |
| 30 minutes on one repro with no progress | stop poking — `/bug-research` |

## 4. False-positive discipline — four hard rules

1. **Baseline control.** Every claim "our mod causes X" carries its control: the same action with the mod off or on the vanilla path,
   compared by frame, state numbers or log, never by impression. A log line alone is not the effect: look at the state or the screen.
2. **Unique markers.** A probe's log marker is a random string of 8+ characters with no English word in it. Before claiming "the code
   ran", grep the BASELINE log for the marker; if it occurs naturally, change the marker.
3. **Sample, not a spike (performance).** At least 10 interleaved runs per group (A-B-A-B, never all A then all B), mean, median and σ
   per group; a signal needs the suspect mean ≥ 2σ above the control. One 2× spike is jitter. The project's worst-frame rules still apply.
4. **Count what ran.** A walk of N steps prints N result lines; fewer means the walk ate steps. A loop over more than five items is
   written in a real language with a line per iteration, not a shell loop.

## 5. The seven-question gate — in order, before anything is filed

One wrong answer kills or downgrades THIS finding; the hunt goes on.

1. **Can a player hit it now, step by step?** Fill: Setup (save, place, gear) · Input (exact keys and clicks on the real input path) ·
   Result (what is seen) · Impact (what the player loses) · Rate (every time, 1 in N). Input cannot be written → not a finding; it goes
   under «Weird».
2. **Is the cause in our scope?** Our mods, the pack, the launcher. Run the vanilla control: the game does it without us → a known-issue
   line, not our bug. An author's defect in a mod we ship is fixed in our mods (the owner's rule), so it IS in scope.
3. **Does it need powers a player lacks?** God mode, teleport, the console, the dev harness. Reproduce without them, or mark it dev-only.
4. **Is it already known?** `bugs/`, the issue index, interviews, the release notes' known issues, the game map. Known → a comment on
   the existing document with the new observation, never a duplicate.
5. **Is it intended?** The owner's decisions (HOUSE_RULES, interviews) and the mod's own design. Intended → killed.
6. **Is the effect shown, not "technically possible"?** A frame, a video or a state-and-log pair of the actual effect.
7. **Which severity?** HOUSE_RULES 38: critical = crash, freeze, slowdown, lag, error, dead button, dead end, no save, no load, an extra
   or a missing window; a visual defect is cosmetic.

**Before the word "critical"** answer each in one line, or the severity is wrong: the full chain reproduced twice from a fresh state ·
the one sentence of what the player loses · the pack commit and the build named · no dev-only precondition left in the chain.

**Kill fast:** Q1 not fillable in 5 minutes → «Weird»; more than two preconditions at once → «Weird»; documented behaviour → killed.

## 6. Evidence

- Order: the frame before → the action (a 60 fps video for flicker and motion) → the frame after → the log slice with the markers.
- Files: `<YYYY-MM-DD>_<game>_<row>_<step>.webp` (WebP, native 4K for the owner's review).
- Privacy: no owner profile name, SteamID or the game copy's origin in anything public (issues, Nexus, README) — crop or blank it first.

## 7. When the owner says bugs remain — the "find more" protocol

Default assumption: he is right and the hunt stopped early. Walk three more classes of §2 end to end on the same rows, write every
negative as a row × class × result line, and only then answer — with that table. "Nothing more to find" without the table is not an
answer.

## 8. Retraction — never drop a finding silently

A finding that fails reproduction goes into the play report's «Found» as a «Retracted» block: original signal · the observation that
disproves it · why it looked like a bug (a natural marker, jitter, a log line without the effect, vanilla behaviour) · the date. If it
was already filed or said to the owner, it is a standing falsehood: correct it where it stands (AGENT_GUIDE, the sixth obligation).

## 9. Session end

- [ ] Matrix rows walked: status, date, pack commit.
- [ ] «Weird, not yet a bug» and «Tried, nothing found» lists in the play report — the next session does not repeat them.
- [ ] Findings that passed the gate → `/report-bug` or a comment on the existing issue; the play report's «Not covered» names the rest.
- [ ] One voice line: what was hunted, what was found, what is next.
