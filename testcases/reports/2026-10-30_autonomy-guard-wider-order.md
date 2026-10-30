# Run report — the autonomy guard takes any «…автономно» as the order

**Work.** EXP-0388: the owner's «гоу автономно, делаем дальше сборку» (2026-10-30, the message after the 15:31 report; its minute not captured) did not arm `tools/hooks/autonomy-guard.mjs`; the agent ended its
turn. Basis: the owner's words «а чего ты стал? … или я не говорил работать автономно? Выясняем причину оставноки и не продолжения работы, фиксим.»
Cases: K-new-1 «гоу автономно, делаем дальше сборку» arms the mode · K-new-2 «давай автономно дальше» arms it · K-new-3 «не работай автономно, жди меня»
does not · the ten old part-K cases unchanged.

**Contour.** KUMM `tools/hooks/autonomy-guard.mjs` (UserPromptSubmit + Stop), `tools/test-guards.mjs` part K (throwaway state file in the OS temp);
the live marker `.kaif/autonomy.json`.

**Runs.**
- ≈16:05 `node tools/test-guards.mjs` on the OLD pattern with the three new cases — «180 of 183»: the three new cases FAIL (pass / pass / block-work).
- 16:05–16:06 `node tools/test-guards.mjs` on the new pattern — «183 of 183 as expected».
- 16:06 the owner's own message of 16:04 piped into the hook with a scratch state file — `{"on":true,…}`.
- Live: `.kaif/autonomy.json` read 16:06 — `on: true`, set 16:04:06 by the owner's message (its «работать автономно» matched even the old pattern);
  what the earlier «гоу автономно» message left in the marker was not observed (overwritten at 16:04); the old pattern does not match it (K-new-1 red).

**Checks.**
- Hygiene: `node --check tools/hooks/autonomy-guard.mjs`; part K selftest as above (red on the broken version, then green).
- Functional run: the hook process run on the owner's real prompt text and on the live state file; read — the marker JSON. A live Stop refused by the guard
  in this session — not yet observed (the next voluntary stop will show it).
- K-new-1 pass · K-new-2 pass · K-new-3 pass · old cases pass.

**Found.** The pattern held only «работай/работать автономно|сам» and «автопилот» — fixed to any «автономн…» with a negation guard.

**Traces.** Command output in the chat transcript of session 5db69748.

**Verdict.** partial — the arming is proven on the owner's words; the Stop refusal on the live path waits for the next stop of this session.
