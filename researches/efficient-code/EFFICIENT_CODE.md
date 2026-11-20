# Research — efficient code: the rulebook for every algorithm and program entity we write

> **Created:** 2026-11-20 · on the owner's words 2026-11-20 11:43–11:45 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-20 11:4x, the efficient-code rule)
> **Parent:** `bugs/110_conan_launcher_slow_button_feedback.md` (the launcher redrew its whole background on every screen change); the same class in Svarog
> (`researches/svarog-native-mod-architecture/README.md`, plan 24) and in the Conan mods (HOUSE_RULES rule 7)
> **Status:** 🔧 written 2026-11-20 from a web recon (sources at the end) and our three recurrences; held by the hook `efficient-code-gate`
> **Outbound:** the class and the gate — KAIF improvement request `bugs/KAIF/33_*`

**Who reads it and when.** The agent, in full, before writing or changing any algorithm or program entity (a class, a function, a loop, a cache, a
handler, a draw routine) in any language of our projects. The hook `efficient-code-gate` (`tools/hooks/style-gate.mjs`, PreToolUse) refuses a Write or Edit
of a code file until this file was read whole within the last 60 minutes. Unity- and mod-specific depth: `researches/svarog-native-mod-architecture/README.md`.

## 0. The law

**The work a piece of code does is proportional to what CHANGED, never to what EXISTS.** A full pass over everything (every widget, every row, every
object of the scene, the whole window's drawing) on every event, frame, tick or click is forbidden. A full pass is legal only at birth (the first build of a
window, the first load of a table) or when everything really changed (a new window size, a new language, a new map). `[OWNER]` 2026-11-20 11:44 ·
HOUSE_RULES rule 41.

## 1. Before the first line — six answers (write them in the design note, the plan step or the commit body)

1. **Trigger.** Which event runs this code: creation, show, a data change, a size change, an input? "Every frame / every tick / a timer that polls" is the
   answer only for something that truly changes every frame (an animation, a camera); then it touches only that thing.
2. **Inputs.** Exactly what does the result depend on? Name them. The result is cached under a key of those inputs and recomputed only when the key changes.
3. **N per event.** How many items does one run touch? If the event changes one thing and the run touches N, rewrite it to touch the one thing (update in
   place, a registry lookup, an invalidated rectangle).
4. **Static and volatile apart.** What never or rarely changes (a background, a layout, a table, text blocks) is built once and kept; what changes (a number,
   a hover face, a progress bar) is drawn or computed alone, on top of the kept part.
5. **Budget.** The cost limit and where it is read: mods — 1 ms of CPU for all mods in the worst gameplay frame (`MASTER_PLAN.md`); an interface — one
   interaction (a press, a hover, a screen change) finishes inside one 60 Hz frame, 16 ms, at the owner's 4K / 300 % scale.
6. **The measurement exists before "done".** A timer in the log or a stand case reads the real cost on the real scale; a design whose cost was never measured
   is not finished (§2.7).

## 2. The canons — what each says and how we apply it

1. **Dirty flag: defer work until its result is needed, and do it only when its inputs went stale.** A flag is set when the primary data changes; the
   derived value is recomputed only when it is read and the flag is set (Nystrom, *Game Programming Patterns*, «Dirty Flag»; Unity Learn, «Dirty flag
   pattern»). Apply: every cache has a "stale" condition tied to its inputs, never an unconditional reset.
2. **Memoize with an explicit dependency key.** A cached value is reused until one of its declared dependencies changes; a dependency left out of the key
   leaves the cache stale, and an input that is a fresh object every time defeats the cache (React `useMemo`). Apply: build the key from the inputs (size,
   scale, language, the texts, the version) and compare it; log a recompute with its reason while debugging.
3. **Localized invalidation instead of a full recompute on every mutation.** Too much work recomputed on every mutation is the classic UI bottleneck; the
   cure is to recompute only the affected elements, and the incremental result must equal the full one (Donner SVG engine, incremental invalidation design;
   *Spineless Traversal for Layout Invalidation*, arXiv 2411.10659). Apply: update the one row, the one widget, the one rectangle; keep a full rebuild as the
   checked fallback, not the default path.
4. **Retained caching with a volatile layer.** Unreal's Invalidation Box caches child geometry: cached widgets are not pre-passed, ticked or painted until
   invalidated; widgets that change every frame are marked Volatile and redrawn alone (Epic, «Invalidation in Slate and UMG», «Optimization guidelines for
   UMG»). In WinForms: draw a complex background once into a bitmap (`Format32bppPArgb`) and copy only the clip rectangle in `OnPaint`; pass the changed
   rectangle to `Invalidate(rect)`; cache fonts and GDI objects instead of creating them in every paint (Microsoft, «Painting Performance and Form Background
   Images», «Custom painting and drawing»). GDI+ draws on the CPU: at 300 % every pixel costs nine times the 100 % price.
5. **Events over polling.** Prefer events; keep Tick for logic that truly runs every frame; a timer is not cheaper than Tick by itself — what runs in it
   matters; an overlap event replaces a per-frame distance check (Unreal Community Wiki, «Fundamental Blueprint Practices»; Epic forums). The observer
   pattern removes repeated checks; throttle it when updates flood (Wikipedia, «Observer pattern»).
6. **A data structure for the query.** Keep a registry (a dictionary by key, a list filled on creation and emptied on destruction) instead of searching the
   scene or walking widget trees each time (`researches/svarog-native-mod-architecture/README.md`; UE4SS: `NotifyOnNewObject` / hooks instead of
   `FindAllOf` in a loop).
7. **Measure first; the critical 3 %.** Programmers' guesses about where time goes fail; the big wins sit in a small part of the code found by measurement
   (Knuth 1974, «Structured Programming with go to Statements»; Facebook, «The Mature Optimization Handbook»). This is NOT a licence for O(N)-per-event
   designs: §1 is the default shape of code, not an optimization; measurement then finds what §1 missed.

## 3. Our recurrences of this class (each one cost the owner's time)

| Where | When | What the code did | Cost seen | Fix |
|---|---|---|---|---|
| Svarog's Dream mods | 2026-10-12 – 10-14 | the speech bubble rebuilt every frame, scene searches every frame, a full pass over the letters window every frame | main thread 21.5 ms per frame, the bubble 11–12 ms | plan 24, the 1 ms budget, «mods extend the game» (`MASTER_PLAN.md`) |
| Conan build mods | 2026-10 – 11 | checks on timers and scene searches (`FindAllOf`) instead of events | HOUSE_RULES rule 7, bug 99 (the pickup plate's check cost) | events, `os.clock` self-measurement, A-B-A flights |
| The Conan launcher 1.0.0 | 2026-11-20 | `MetalWindow.Relayout()` reset the whole background cache on every call (screen change, state list change, language), and rebuilt every text block | 282–304 ms per background render at 300 % (wallpaper 157 ms, lettering 56 ms, shade 37 ms); the owner: buttons react and elements show slowly | bug 110: the cache keyed by its inputs, text blocks built only when their inputs change, a stand budget |

## 4. How the rule is held (code, not memory)

- **The gate:** `efficient-code-gate` — `node tools/hooks/style-gate.mjs --gate --style researches/efficient-code/EFFICIENT_CODE.md …` on Write | Edit of
  `*.cs *.lua *.mjs *.js *.py *.ps1 *.sh *.cpp *.h` under `D:/work/ai_sandbox/`; the Read of this file in full stamps it (`--mark`).
- **The judge:** every judge brief (HOUSE_RULES rule 31) lists «work not proportional to the change: a full pass, a full redraw, a scene search or a cache
  reset on every event» as a class to hunt, with the six answers of §1 as the check.
- **The stand:** an interface carries a stand case that measures a press, a hover and a screen change at 300 % and fails over 16 ms (bug 110 adds it to the
  launcher); a mod carries its `os.clock` minute summary (HOUSE_RULES rule 7).

## Sources

- R. Nystrom, *Game Programming Patterns*, «Dirty Flag» — https://gameprogrammingpatterns.com/dirty-flag.html
- Unity Learn, «Dirty flag pattern» — https://learn.unity.com/course/design-patterns-unity-6/tutorial/dirty-flag-pattern
- React `useMemo` (dependency list, stale cache, unstable inputs) — https://flaviocopes.com/react-hook-usememo/
- Donner, «Incremental invalidation» design doc — https://jwmcglynn.github.io/donner/md_docs_2design__docs_20005-incremental__invalidation.html
- *Spineless Traversal for Layout Invalidation* — https://arxiv.org/html/2411.10659v4
- Epic, «Invalidation in Slate and UMG» — https://dev.epicgames.com/documentation/en-us/unreal-engine/invalidation-in-slate-and-umg-for-unreal-engine
- Epic, «Optimization guidelines for UMG» — https://dev.epicgames.com/documentation/en-us/unreal-engine/optimization-guidelines-for-umg-in-unreal-engine
- Microsoft, «Painting Performance and Form Background Images» — https://docs.microsoft.com/en-us/archive/blogs/mhendersblog/painting-performance-and-form-background-images
- Microsoft, «Custom painting and drawing (Windows Forms)» — https://learn.microsoft.com/en-us/dotnet/desktop/winforms/controls/custom-painting-drawing
- Unreal Community Wiki, «Fundamental Blueprint Practices» — https://unrealcommunity.wiki/Fundamental%20Blueprint%20Practices
- Wikipedia, «Observer pattern» — https://en.wikipedia.org/wiki/Observer_pattern
- Facebook Engineering, «The Mature Optimization Handbook» — https://engineering.fb.com/core-data/the-mature-optimization-handbook
- M. Skarupke, «Revisiting Knuth's "Premature Optimization" Paper» — https://probablydance.com/2025/06/19/revisiting-knuths-premature-optimization-paper/
