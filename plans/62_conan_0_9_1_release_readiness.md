# Plan 62 — Conan 0.9.1: are the open issues a reason for RC5, or can 0.9.1 ship as the full release

> **Created:** 2026-11-23 · on the owner's task 2026-11-23 11:38 (study every open issue, find what bothers the player, decide RC5 vs the full 0.9.1)
> **Parent:** HOUSE_RULES 38 / 38.1 · `researches/bug-severity/README.md` · issue registry `bugs/GITHUB_ISSUES.md`
> **Status:** 🔧 triage written 2026-11-23 11:44 +03:00 from the 38 open issues of the public repo (bodies, comments, local bug files, the RC4 retest report); the RC5 scope waits for the owner's word
> **Outbound:** the RC5 scope and the two `critical` labels (#30, #43) — the owner's word; #53 by the 1 ms rule — the owner's word on its label

## Goal vector

**Achieve:** the full 0.9.1 ships when no open issue keeps a player from playing, and the cheap defects a player meets on install, uninstall and first play are fixed.

Acceptance criteria:

1. No open issue of the industry level Critical (crash, hang, lost save, softlock with no workaround) — Meter: the `critical` label set of the public repo after the retests; Target: 0.
2. Every issue whose text says «fix built, waits for a check» is retested by the player's path on the RC it ships in and closed or reopened — Meter: the RC5 retest report in `testcases/reports/`; Target: 0 such issues left with no retest line.
3. The full 0.9.1 is the RC5 bytes with only the version line changed, after the RC5 retest passes (industry practice: the final is the last RC with no code change).

## The triage (2026-11-23, 38 open issues)

| Group | Issues | Player impact | Verdict |
|---|---|---|---|
| Labelled `critical`, need a CHECK, not a fix | #21 world freeze after a loading screen — fixed (teleport, dungeon in/out, waystone map open pass on b7d984a), the real waystone travel owed · #23 the full-screen map sticks — last seen 2026-11-07 on a pre-RC1 build; the mechanism (our second map copy) removed in pack `dc79053`; RC3 hunt in 3 variants not reproduced | a softlock if it ever happens | retest #21; a wider hunt for #23 (gamepad, map during a loading screen, map over a dialogue), then close as not reproduced |
| Labelled `critical`, not critical by the scale | #30 bow sprint (two items not defects, the jump zoom not reproduced, the FOV stays at the game's own sprint angle) · #43 launcher: the feedback plate's first open 0.13–0.39 s | comfort | the owner's word on the label (asked 2026-11-23 00:0x) |
| Cheap, the player meets it — RC5 | #16 the uninstaller leaves `ConanSandbox/Saved/ExtractedMods` (198 files, 12.8 GB) — no code touches it · #47 (duplicate #15) the launcher ends the install on «72 из 74» — two mod names with an em dash, no dash folding near `RunInstaller` (`KrinikConanUpdates.cs` ≈1160) · #43 the plate's first open (launcher 1.1.2) · #53 the first first-person switch 2–4.5 ms (over the owner's 1 ms gameplay budget, spikes included — `MASTER_PLAN.md`) | 12.8 GB not returned; «did two mods fail?»; a slow first click; one long frame | fix in RC5 |
| Fixed before RC1, never retested by me on RC2–RC4 | #3 talks with NPCs · #22 the talk prompt · #31 hub craft · #32 bush prompt · #34 first-person body shadow (R13 frame of 2026-11-23 shows head and shoulders) · #36 hub tab frames (part) · #38 #39 #40 the wall climb · #29 (the issue says built, bug 91 says the look waits for the owner) | unknown until retested | the RC5 retest sweep |
| Comfort | #41 Esc over other mods' windows (the window's own button closes it) · #42 a fast double click · #7 #20 the quick-loot rim | a workaround in reach | 0.9.2+ |
| Bow animation | #2 drinking · #5 after the knife (steps unknown) · #8 #9 crouch draw · #37 the moving aim pose · #52 the first-person stance (deferred by the owner) | looks, play goes on | 0.9.2+ |
| Cosmetic | #10 #14 #18 #19 #26 · #25 beasts inside the hero · #27 water flicker (parked by the owner) · #28 camera inside creatures (parked by the owner) | looks | 0.9.2+ |
| Enhancement | #44 talk lines fade | — | 0.9.2+ |
| Documentation | #17 Nexus page e-mail as raw BBCode | the Nexus page only | before a Nexus publication of 0.9.1 |

## Steps (after the owner's word on the scope)

- [ ] #16 — the uninstaller removes `Saved/ExtractedMods/<Mod>-Windows.{pak,ucas,utoc}` of the build's own mods only (names from the manifest), a stand case on the fixture pack (a foreign mod's files stay)
- [ ] #47 — fold «—» and «–» to «-» on both sides of the launcher's name match; a stand row with a dashed mod name; close #15 as its duplicate
- [ ] #43 — build the feedback plate ahead at the launcher's idle; the case: the first open ≤ 16 ms on the owner's screen (`.work/rc4/retest43.mjs`)
- [ ] #53 — one walk of the hero's component tree per switch instead of three; the case: the first switch after world entry ≤ 1 ms of camera lines
- [ ] the judge rounds (rule 31), RC5 built, the update RC4 → RC5 through the launcher on the copy
- [ ] the RC5 retest sweep by the player's path: #21 waystone travel, #23 the wider hunt, the «fixed, not retested» row above, N2 (a weapon swap in first person)
- [ ] the owner's word → the full 0.9.1 from the RC5 bytes (release ritual, rule 42)

## Decisions made without the owner

- `[AI]` The industry scale of `researches/bug-severity/README.md` is applied as HOUSE_RULES 38.1 states; the four RC5 items are picked by «the player meets it on install, uninstall or first play, and the fix is small».
