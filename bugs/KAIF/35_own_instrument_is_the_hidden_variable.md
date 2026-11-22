# KAIF improvement request: before bisecting a crash or a symptom seen in the agent's own runs, read what the crash left and list what the agent sent

kaif-fp: canon/BUG_FIXING_FRAMEWORK "Instrumentation" + "A finding is not a finding until verified" :: own-instrument-as-hidden-variable :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/202
**Autocapture:** filed by the agent under the standing order «every feedback signal to the KAIF origin goes out without asking» (KUMM `AGENT_GUIDE.md`, the owner's
word 2026-09-18); field project KUMM, bug 118 and bug 93, 2026-11-22.
**Dedup attestation:** searched `bugs/KAIF/` (`grep -rl -i -E "minidump|crash forensics|own (tool|probe|command)|bisection" bugs/KAIF/` → no hit).

## Gap

`BUG_FIXING_FRAMEWORK.md` teaches the loop (reproduce → guess → one change → retest), instrumentation, twin checks and the 3-attempts rule. It does not name the
first suspect when a defect appears DURING the agent's own experiments: the agent's own instrument (a probe, a remote command, a synthetic input). Bisection then
compares variants that differ by the instrument, not by the code under test, and every «cause» found is a coincidence.

## Field evidence (KUMM, 2026-11-22)

1. **Bug 118:** seven native crashes over a day; bisection blamed a probe hook, then a UI mod, then a camera mod; a camera fix «worked» for two soaks. The cause
   was the agent's own remote command (an Esc probe passing a Lua table as a delegate) — sent in every crashed run, in no clean one. Found in one hour by evidence
   the crash leaves: the call stacks of all crashes hashed (one call site), the engine frames disassembled to their script-VM shape (the remote's command shape),
   the strings of every minidump (the probe's command in all seven), then two repros on demand, one without the suspected mod.
2. **Bug 93:** «the held draw ends by itself in a sprint» was filed from runs driven by the remote, which cannot hold a key (the game reads the physical button);
   by real input the draw holds.
3. Same evening, a third crash: `crash-forensics.py` named the agent's command from the minidump in one run.

## Proposal

Add to `BUG_FIXING_FRAMEWORK.md` (Instrumentation / Working with logs) a short rule: **when a defect shows up in the agent's own runs, the agent's instrument is
the first suspect** — (a) hash the crash stacks (one hash = one call site), (b) read what the crash artifacts hold (minidump strings, the last commands of the
remote / probe), (c) record the agent's own commands per run in the variant table, (d) before filing a symptom seen through an instrument, name what the
instrument cannot do (hold a key, a real cursor, the focus) and re-run without it. Mechanize per project: a forensics script over the crash folders; the
instrument refuses the calls that crashed (a guard with THREAT / PROVED-AGAINST).
