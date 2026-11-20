# Plan 60 — the agent plays the build itself: a skills library over the remote and a play driver that writes the play report

> **Created:** 2026-11-20 · on the owner's words 2026-11-20 20:37–20:42 (the retest is the agent's own game — HOUSE_RULES 44.4; «поищи в интернете, как тебе -
> ИИ агенту - играть в игру» · «какие фреймворки есть для этого» · «мне выжимка не нужна» · «это тебе нужно.»; chronicle entry 2026-11-20 20:37)
> **Parent:** `researches/ai-agent-plays-game/README.md` (the recon, step 1 of the ladder); plan 59 (the release gate on a play report)
> **Status:** 🔧 phase 1 started 2026-11-20 20:43
> **Outbound:** —

## Goal vector (Achieve)

The pain: every check of the build is a one-off stand script written per case; cases that need a kind of NPC, a fight without god mode or a walk across the map
stay «blocked», and the release gate (plan 59) demands an hour of play that nothing produces. Where we want to be: the agent plays the build by the player's path
through named, reusable SKILLS (the field's pattern — a slow planner over a skills library; Cradle, Voyager, TypeGo), and a DRIVER walks the play matrix and
writes the play report the gate reads.

## Acceptance criteria

1. Situation: the working game in the world, the dev harness installed. Action: the agent calls a skill by name through one command. Result: the skill acts
   in the game and returns a line of what it observed (state numbers, the window open, a frame path). Check: `bash ConanExiles/_config/skill.sh <name> [args]`
   prints `OK <name>: …` or `FAIL <name>: …` and exits 0 / 1.
2. Cases D2 (a reply option in a talk) and G1 (a humanoid hits the heroine without god mode) of issues #3 and #6 are walked by skills — no new one-off script.
3. The driver walks a list of matrix rows, writes `testcases/reports/<date>_conan-play-<version>.md` with the table, the video path, the pack commit and the
   god-mode line, and `check_play_report.py` reads it (green on a full walk, red on a partial one).

## Phases

1. **Skills v1 (now):** `ConanExiles/_config/skills/skills.lua` (one Lua module the remote loads; one function per skill, each returning a result line) and
   `ConanExiles/_config/skill.sh <name> [args]` (calls the remote, prints the line, exit code from OK / FAIL). Skills: `state` (hero place, health, god mode,
   dilation, open modules), `god <on|off>`, `go <x> <y>` (on the ground), `talkers` (dialogue NPCs loaded, nearest first), `talk <class>` (2 m from the
   nearest, E in the background, the talk window read), `replies` (the reply options of the open talk, their texts), `reply <n>` (choose option n, read
   what the talk shows next), `hostiles` (combat characters within 200 m), `take_hit <class>` (one creature of that class next to the hero, health read every
   0.5 s, god mode back on below half health). Proven on D2 and G1.
2. **The driver:** walks rows of the matrix by skills (a row → a list of skill calls + the expected observation), records the session video, writes the
   report; first on the rows the skills already cover.
3. **The first real play report** of RC2 by the driver plus the agent's own exploratory play, through the gate.

## Steps of phase 1

- [ ] 1. Read the dialogue window's widget tree live (the reply buttons, their texts, how a click is delivered) — recon into the game map.
- [ ] 2. `skills.lua` + `skill.sh` with the skills above; each with its observation line.
- [ ] 3. D2 by `talk` + `replies` + `reply`; G1 by `hostiles` + `take_hit` (god mode off; the save restored if the heroine dies).
- [ ] 4. Judge rounds; run report; issues #3 / #6 retest comments; the game map and the reference rows.

## Decisions made without the owner

- `[AI]` The skills live inside the remote (UE4SS Lua, the game thread) rather than a pixel agent: the recon shows pixel-only agents finish under 1 % of games;
  state from the game, pixels only for what the eye must judge.
