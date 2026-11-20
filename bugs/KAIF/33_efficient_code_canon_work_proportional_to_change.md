# KAIF improvement request: an efficient-code canon — the work of code proportional to what changed — with a read gate before writing code and a judge class

kaif-fp: canon/PHILOSOPHY+fable-judge :: o-n-full-pass-per-event :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/200
**Autocapture:** filed by the agent on the owner's order «заводи это импрувментом в апстрим KAIF» · 2026-11-20 11:45 (KUMM chat), field project KUMM (Conan build launcher, C# WinForms)
**Dedup attestation:** searched `bugs/KAIF/` (`grep -rl -i -E "dirty flag|full pass|proportional to|per-frame|O\(N\)|polling" bugs/KAIF/` → one hit, #19 about the `/resume` token cost — a different subject) and open origin issues (`gh issue list --repo MikalaiKryvusha/KAIF --state open --search "efficient OR performance OR \"full pass\" OR polling"` → only #179, the same `/resume` cost) — no duplicate.

## Gap

KAIF's thinking canon has simplicity (KISS, Occam), Pareto, «code before cognition», measurement in testing — and nothing that tells the agent how much work
its code may do per event. `PHILOSOPHY.md` speaks of the agent's process, not of the runtime shape of the code it writes; `TESTING_FRAMEWORK.md` has
«countable quality proxies» but no performance budget; `/fable-judge` and the project judges hunt false claims, weakened tests, twins — not «a full pass on
every event». So a weak session writes the first shape that works: rebuild everything, redraw everything, search everything, on every click or frame — and
every check stays green, because nothing measures the cost.

## Field evidence

One field project paid for the same class three times in six weeks, each time found by the owner's eye, never by a check:

1. **Svarog's Dream mods (Unity), 2026-10-12 – 10-14:** a speech bubble rebuilt every frame (11–12 ms), scene searches every frame, a full pass over a
   letters window every frame; main thread 21.5 ms per frame. The owner set a 1 ms CPU budget for all mods and the rule «mods extend the game's native code,
   not crutches» (KUMM `MASTER_PLAN.md`, plan 24, `researches/svarog-native-mod-architecture/`).
2. **Conan Exiles mods (UE4SS Lua), 2026-10 – 11:** checks on timers and `FindAllOf` scene searches instead of events (KUMM `HOUSE_RULES.md` rule 7; bug 99).
3. **The Conan build launcher 1.0.0 (C# WinForms, GDI+), 2026-11-20:** the owner — «в нём как-то медленно нажимаются кромки и показываются элементы» («кромки» is a typo for «кнопки», buttons).
   Measured on the stand at the owner's 4K / 300 % scale (timers in a copy of the sources): `Relayout()` reset the background cache on EVERY call (a screen
   change, a state-list change, a language change) → 282–304 ms re-render (wallpaper 157 ms, lettering 56 ms, shade 37 ms); every call also rebuilt all text
   glyph paths and scanned every pixel of both logos (`SolidBox`, `LockBits` + a double loop) although the logos never change; the state panel rebuilt the
   glyph paths and the CPU box-blur shadows of ALL its lines on every progress tick (19–33 ms); every width measurement created and destroyed a GDI+ `Font`.
   After the fix by the canons below: a screen change ≈ 30–40 ms instead of ≈ 350 ms, a progress tick 4–8 ms instead of 19–31 ms, a header-text change 57 ms
   instead of 300 ms, the background re-rendered only at birth (KUMM `bugs/110_conan_launcher_slow_button_feedback.md`, run report of 2026-11-20).

The owner's verdict, verbatim (KUMM chat 2026-11-20 11:43–11:44): «Я устал от того, что ты постоянно допускаешь эти ошибки. и в свароге с этого начали» ·
«и в конане потом» · «и вот опыть ты лаунчер так построил» · «ты делаешь какие-то O(N) полные циклы всегда - это КРАЙНЕ КРАЙНЕ ПЛОХАЯ ПРАКТИКА!!!!!».

Where the practice is proven (principle proposal): the dirty-flag pattern (R. Nystrom, *Game Programming Patterns*; Unity Learn); memoization with a
dependency key (React `useMemo`); localized invalidation instead of a full recompute (Donner SVG engine; *Spineless Traversal for Layout Invalidation*,
arXiv 2411.10659); retained caching with a volatile layer (Unreal UMG Invalidation Box / Volatile; Microsoft — a pre-computed background bitmap,
`Invalidate(rect)`, cached fonts); events over per-frame polling (Unreal community practice; the observer pattern); measure first, the critical 3 % (Knuth
1974; Facebook «The Mature Optimization Handbook»). Links in KUMM `researches/efficient-code/EFFICIENT_CODE.md`.

## Proposed change (smallest that closes the gap)

1. **`PHILOSOPHY.md` — one principle with its executable carrier:** «The work a piece of code does is proportional to what CHANGED, never to what EXISTS. A
   full pass on every event, frame, tick or click is legal only at birth or when everything changed.» Carrier: six answers before the first line of an
   algorithm or program entity — trigger · inputs (the cache key) · N per event · static vs volatile · budget · the measurement that exists before «done».
2. **A shipped rulebook template** (`.kaif/_efficient-code-template.md`, the KUMM file as the seed) the project fills with its platform's specifics and its
   own recurrences table.
3. **A read gate (optional hooks module):** reading the rulebook whole stamps; a Write | Edit of a code file is refused while the stamp is missing, older
   than the rulebook or older than 60 minutes (KUMM runs it with its existing `style-gate.mjs`: `--gate --style <rulebook> --stamp <file> --paths
   "<code-file regex>"`, `--mark` on Read).
4. **`/fable-judge` and the review brief:** a hunted class «work not proportional to the change» — a full pass, a full redraw, a scene search or a cache
   reset on every event — checked against the six answers.
5. **`TESTING_FRAMEWORK.md`:** an interface or a per-frame component carries a stand case with a time budget at the owner's real scale (UI: an interaction
   inside one 60 Hz frame for feedback; a mod: its own frame budget), proven red on the pre-fix build.

## Expected effect and its check

The next project that builds a UI, a mod or a loop answers the six questions before the code, and its judge round reports any full-pass-per-event it
finds; the owner stops finding this class by eye. Check: in the field project, no new recurrence row in the rulebook's table after the gate is wired; the
launcher's stand budget case red on the pre-fix exe, green on the fixed one. Invariants served: honest-green (a stand that measures cost), owner-work-safety
(the owner's time), simplicity (the default shape of code is the cheap one).
