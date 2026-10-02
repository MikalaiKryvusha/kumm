# Bug 14 — `pickCard` pins an old file when the author's file name carried the version

> **Created:** 2026-10-02 · **Parent:** Conan move to 2.2.3 (`plans/09`), `node kumm.mjs check` · **Status:** 🔴 open
> **Severity: S2** — `check` said "up to date" for a mod whose library file was built for the old engine; the
> game would have refused it ("Mod is too old"), and an hour of in-game bisecting would follow.

## Symptom

`node kumm.mjs check --root D:\work\ai_sandbox\ConanExiles` printed for Bosses My New Besties (Nexus 18):
`have 3.0.0 · nexus 3.0.0` — no update. `node kumm.mjs files 18` shows two NEWER main files:

```
MAIN  file_id=142  v3.0.2  2026-09-17T12:19:38Z  BossesMyNewBesties
MAIN  file_id=127  v3.0.2  2026-09-10T01:15:01Z  BossesMyNewBesties
MAIN  file_id=122  v3.0.0  2026-09-01T23:23:08Z  BossesMyNewBesties 3.0     <- our library file
```

The library file had `devkitRevisionNumber` 1001 (old kit); 3.0.2 has 1002.

## Root cause

`pickCard` (`kumm.mjs` ~line 596): the library name `BossesMyNewBesties 3.0 18 3.0.0 …` gives the base
`BossesMyNewBesties 3.0`, and the EXACT-name branch returns card 122 — the only card whose author name still
contains "3.0". The author put the version into the file name once and dropped it later, so the exact match
locks the variant to the old file forever. The branch exists to tell Steam/Gamepass, Capped/plain apart;
it never asks whether a newer main file of the same lineage exists.

## Fix plan

Exact or prefix match decides the VARIANT, not the file: when the matched card is not the newest main
card, and the newest main card's name equals the matched name with a trailing version token removed
(or the two names share the whole prefix up to the first digit), take the newest. Then a fixture case in
the round-trip test (`test-parse-archive.mjs` has the cutting harness): cards 142/127/122 above → 142.

## Workaround used

`node kumm.mjs get 18 142` by hand (2026-10-02).

## Decisions made without the owner

none yet.
