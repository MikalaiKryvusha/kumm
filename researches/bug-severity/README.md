# Research — bug severity: how the industry decides what is critical, and our scale for the Conan build

> **Created:** 2026-11-23 · on the owner's word 2026-11-23 00:00 (verbatim — `PROJECT_HISTORY.md` entry «2026-11-23 00:0x — the severity of a bug»): Esc not
> closing other mods' windows over the hub is comfort, not a critical bug; go to the web for an understanding of bug criticality
> **Parent:** HOUSE_RULES rule 38 (the critical-bug test) · issue #41 / `bugs/108_conan_esc_does_not_close_mod_windows_over_hub.md` (labelled `critical` by the agent)
> **Status:** 🔧 written 2026-11-23 00:0x from a web recon (sources at the end); the scale below is applied to the `critical` labels of the public repo
> **Outbound:** the reclassification of issues #30 #43 #48 against the literal rule 38 — the owner's word (asked in chat 2026-11-23 00:0x)

**Who reads it and when.** The agent, before it labels an issue `critical`, ranks bugs for the owner, or answers «which bugs are critical».

## 1. What the industry sources say

1. **Severity and priority are two fields.** Severity is what the bug does to the user (the player); priority is what it does to the schedule. A cosmetic typo
   on a storefront can be low severity and high priority; a crash in a hidden debug menu — high severity, low priority (bugnet.io, marker.io, Mozilla).
2. **The classic Bugzilla scale** (Eclipse WTP conventions, Red Hat docs): *blocker* — stops development or testing work; *critical* — crashes, loss of data,
   a severe memory leak; *major* — a major loss of function; *normal* — a regular issue, some loss of function; *minor* — a small loss of function **where an
   easy workaround exists**; *trivial* — a cosmetic problem (misspelled words, misaligned text); *enhancement* — a request, not a severity.
3. **Mozilla's S1–S4** (BMO user guide, Firefox source docs): *S1 Catastrophic* — blocks development / testing or a release, data loss, crashes for many users,
   no workaround; *S2 Serious* — major functionality severely impaired **and a satisfactory workaround does not exist**; *S3 Normal* — blocks non-critical
   functionality **or a workaround exists**; *S4 Small / Trivial* — cosmetic, low or no impact to users.
4. **Unity's «user pain»** (the Unity blog on tracking bugs by user pain): severity level 2 — no workaround, core functionality majorly impacted; level 3 — a
   workaround is possible, secondary functionality broken.
5. **Game QA** (bugnet.io severity guide, kindatechnical.com, the general game-testing guides): the top tier is *crash / data loss* (S0) and the *softlock* —
   the game runs but the player cannot progress (S1); a P0 «makes the game unplayable for any player who meets it» and only P0 halts a release; the middle tier
   is a function broken with a workaround; the bottom tier is cosmetic, no functional impact.
6. **The dividing line every source agrees on is the workaround.** A bug with a clear, low-effort workaround carries a lower severity than one that leaves the
   user stuck. The second axis is core vs secondary function; the third is data (a lost save is always top tier).

## 2. Our scale for the Conan build (the industry's, in the player's terms)

| Level | Label on GitHub | What the player meets | Examples of ours |
|---|---|---|---|
| **Critical** | `critical` | the game crashes or hangs; a save does not save or does not load; a softlock or dead end — the player cannot go on without restarting the game or without our tools; a core function (moving, fighting, gathering, building, travelling, the hub itself) unusable with NO workaround | the world frozen after a loading screen (#21); the full-screen map stuck with no hub tabs and no way to close it (#23) |
| **Major** | `bug` | a core function broken, the player can still go on by a workaround that costs him something (a reload, a lost minute, a repeated action) | — |
| **Minor (comfort)** | `bug` | an inconvenience with a workaround in reach: a key that does not do what is expected while a button does it | Esc does not close another mod's window over the hub — the window's own close button does (#41) |
| **Trivial (cosmetic)** | `bug` | how it looks, with no effect on play | overlaps, fonts, a stray label |

Rules of use:

1. **Ask the workaround question first:** can the player go on, and what does it cost him? No way on → critical; a way on → not critical.
2. **A crash, a hang, a lost save is critical whatever the frequency.** A rare crash is a critical bug with a low reproduction rate, never a minor one.
3. **A log line the player never sees and that changes nothing in play** (a Lua error printed while the hero is dead, the game unaffected) is not critical by
   the industry scale: no functional impact. HOUSE_RULES 38 names «an error» critical — the reading of that word is the owner's (asked 2026-11-23).
4. **A slowdown is judged by what it does to play.** A stutter in core gameplay over the owner's budget (1 ms of CPU for all mods in the worst gameplay frame,
   `MASTER_PLAN.md`) is the owner's standing rule and stays critical; a slow UI response outside play (a launcher screen in 350 ms) is comfort by the industry
   scale — the owner's word decides it (asked 2026-11-23).
5. **Severity is not the order of work.** The owner's word on what to fix first is the priority; a cosmetic item he wants now goes first without becoming critical.

## 3. The six issues labelled `critical` on 2026-11-23 00:0x, against the scale

| Issue | What the player meets | Workaround | Industry level | Done |
|---|---|---|---|---|
| #21 the world freezes after a loading screen | the world stops after a dungeon's loading screen | none known for the player | Critical (softlock) | label kept |
| #23 the full-screen map sticks | the map without hub tabs, does not close | none for the player (only our remote freed it) | Critical (softlock) | label kept |
| #41 Esc over the hub | another mod's window stays open on Esc | the window's own close button | Minor (comfort) | label removed — the owner's word |
| #30 the bow sprint | the draw drops in a sprint, the camera jerks | draw again; and not reproduced by real input | Major / Normal | the owner's word asked |
| #43 the launcher reacts slowly | a screen in ≈ 350 ms (fixed since RC2), the feedback plate in 0.08 s (fixed in 1.1.1) | none needed, nothing blocks | Minor | the owner's word asked (rule 38 «a slowdown») |
| #48 a Lua error while the hero is dead | nothing on screen; a line a second in UE4SS.log | none needed, play unaffected | Trivial / Minor | the owner's word asked (rule 38 «an error») |

## Sources

- Eclipse WTP, conventions of bug priority and severity — https://wiki.eclipse.org/WTP/Conventions_of_bug_priority_and_severity
- Red Hat Bugzilla, understanding a bug — https://bugzilla.redhat.com/docs/en/html/using/understanding.html
- Mozilla BMO user guide, bug fields — https://wiki.mozilla.org/BMO/UserGuide/BugFields
- Firefox source docs, defect severity — https://firefox-source-docs.mozilla.org/bug-mgmt/guides/severity.html
- Unity, a look inside tracking bugs by user pain — https://blogs.unity3d.com/de/technology/a-look-inside-tracking-bugs-by-user-pain
- bugnet.io, bug severity classification for game developers — https://bugnet.io/blog/bug-severity-classification-for-game-developers
- marker.io, bug severity vs priority — https://marker.io/blog/bug-severity-vs-priority
- kindatechnical.com, QA testing: functional, regression and compatibility — https://kindatechnical.com/game-development/qa-testing-functional-regression-and-compatibility.html
- QATestLab, software bug severity levels — https://blog.qatestlab.com/software-bugs-severity-levels/

The source pages were not opened one by one; the definitions above are the search engine's quotes of them (2026-11-23 00:0x). Before the scale becomes a
rule, open the Mozilla and Eclipse pages and check the quoted lines.
