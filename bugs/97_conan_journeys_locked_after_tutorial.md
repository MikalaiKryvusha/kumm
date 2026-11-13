# Bug 97 — Conan: after the tutorial every journey but fishing is locked in the Journeys window (J)

**Status:** 🔬 OPEN — not yet known whether it is the game's design (journeys unlocked by progress) or a mod defect · **Severity:** S3 until read
**Version/build:** Conan Exiles 3.0.1 build (pack as of 2026-11-13) · **When/context:** tossed by the owner mid-task, 2026-11-13 16:01, during the bug-95 work
**Fixing:** after plan 52's live check (the next session if this one closes)

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-13 16:01 «и словно какой-то баг, или не баг. я не уверен.» · «Вот я прошёл обучение, мне сказано нажать J, чтобы выбрать путешествие - но все, кроме
рыбалки, петешествия под замком»

The HUD hint «Путешествие — Нажмите (j), чтобы выбрать путешествие» is on screen in every frame of the 2026-11-13 runs (the owner's save `Game_1`, the oasis).

## First steps

1. Recon of the vanilla rule: how Conan 3.0 Journeys unlock (web + the game's journey tables) — design or defect.
2. Which mods touch journeys / the tutorial / Exiles Fishing (it is the only unlocked one — the fishing mod adds its own journey?): the reconciliation register,
   `who-overwrites-table.py journey`.
3. A control: the same save without the suspected mod.
