# Play report — <packVersion>: an hour of play on the release build by the player's path

> Copy to `testcases/reports/<YYYY-MM-DD>_conan-play-<packVersion>.md` (the name the release gate looks for). The gate
> `ConanExiles/_config/release/check_play_report.py <packVersion>` reads the «- Name:» lines below and the matrix table literally (KUMM plan 59, remedy 1).

## Work

The release build <packVersion> against the play matrix `testcases/TC_conan_play_matrix.md` (every row P… and R…), played by the player's path.

- Build: <packVersion>
- Played: <minutes> min
- Video: <absolute path of the session video>
- God mode and teleports: <which rows ran with god mode or a teleport, which without; damage, death and combat rows — without>
- God mode off at the end: <the line of `god-on.sh off`, e.g. «god off: ok (bCanBeDamaged=true)»>
- Not covered: <the matrix rows not walked and why — or «none»>

## Contour

<the game folder, the save, the resolution, the input path (real mouse and keys, the game in front), the session start and end>

## Runs

<the session with its moments and commands; one line per segment of the play>

## Checks

Hygiene: <what>
Functional run: <what was played, on which contour, what was read>

| Row | Status | Observation |
|---|---|---|
| P1 | <pass · fail · blocked · skipped> | <what was seen — never empty> |
| … | | |

## Found

<the defects as new issues of the public repository (HOUSE_RULES 44), each with its regression row added to the matrix — or «none»>

## Traces

<the video, frames, logs>

## Verdict

<pass · partial · fail — with the reason>
