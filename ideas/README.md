# `ideas/` — ideas, features, improvement proposals

Detailed ideas about *what* to do — usually a narrow slice of the project, described well enough for the agent to
implement. Most often written by the **owner**, but the agent proposes ideas too. One `NN_<name>.md` per idea.

**For the owner:** this is your main directory for authorship. Drop an idea here describing what you want —
the agent will tidy it into a clean structure and implement it. An idea is part of the product **vision**: the agent
implements it only after your approval.

**For the AI agent:** read the owner's ideas, fix typos, structure them minimally and implement. File your own
worthwhile idea here with the status "❓ awaiting owner approval" (the `/propose-idea` skill) and do **not**
implement it until approved. An idea document opens with the pain it solves + how we will check that it
worked (`REQUIREMENTS_FRAMEWORK.md`), and right after the H1 carries the lintable header meta:
**Created:** · **Parent:** · **Status:** · **Outbound:** (`AGENT_GUIDE.md` → Document header meta).
After implementation, write the status and date into the file and tag it `DONE`
(`git mv NN_x.md NN_DONE_x.md`).
