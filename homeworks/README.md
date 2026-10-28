# `homeworks/` — tasks from the agent to the human

Tasks the agent asks the **human** to do — what it cannot do itself because of its digital,
bodiless nature: test on real hardware, act in the physical world, use an account/access
only the human has, buy something, observe offline. Each document describes the task in concrete
steps for the human and collects the human's observations and results back. One
`NN_<name>.md` each.

**For the owner:** if the agent opened a homework, it needs your help in the physical/offline world. Do the
steps and write your observations back into the document — the agent will read them and continue.

**For the AI agent:** blocked on something only a human with a body can do — don't get stuck: open a
homework with clear, minimal, numbered steps and a place for the human's results, then continue
other work. Right after the H1 comes the lintable header meta: **Created:** · **Parent:** · **Status:** ·
**Outbound:** (`AGENT_GUIDE.md` → Document header meta). Once the human answers, take the results into account and
tag the file `DONE` (`git mv NN_x.md NN_DONE_x.md`).

**A "taste" homework** (the acceptance criterion is a perception adjective; `AGENT_GUIDE.md` →
"The taste class"): the agent hands the human an ARTIFACT to perceive — never a link and never someone else's
benchmark; all candidates on the SAME material, blind labels, the key alongside. Two permanent
fields in every such document: **"What you can already watch/listen to right now"** (paths to the artifacts)
and **"Verdicts given"** (the owner's decisions, recorded verbatim — a verdict is canon and
is never asked twice).
