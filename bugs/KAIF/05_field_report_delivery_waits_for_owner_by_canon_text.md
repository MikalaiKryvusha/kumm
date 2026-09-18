# KAIF bug: the shipped canon tells the agent a field report "stays LOCAL until the owner says otherwise … the owner approves it" — against the owner's standing word (#15); a field agent held its report, asked the owner, and the owner had to rub its nose in it

kaif-fp: `reports/README.md` · `/kaif-update` step 5 · `kaif-core report` :: feedback-signal-gated-behind-owner :: v2.7
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/78
**Autocapture** (from `.kaif/kaif.json` + update receipt): KAIF 2.7 (updated 2.5 → 2.7, route `bootstrap`,
2026-09-18T17:59:31+03:00) · project KUMM · sphere `programming` · language `ru` (language pack, not
i18n-translated) · tracking `origin` · agent system claude-code · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** searched `bugs/KAIF/` (`grep -ril 'stays LOCAL\|reports/README' bugs/KAIF/` → nothing) and
origin issues (`gh issue list --repo MikalaiKryvusha/KAIF --state all --search "reports README stays LOCAL"` →
#75, #76 and four closed field reports, none about delivery of reports; `--search "field report owner approves"`
→ the same). The parents are #15 (closed — the standing authorization), #37 and #65 (closed — "a ticket waited
for an AUTH line"): this is the SAME class on the surface they did not reach — the field report. No match found.

Severity by the ladder: **S2** — a signal the framework calls MANDATORY did not leave the machine, and the
owner's live time was spent on making it leave.

## The owner's word — verbatim, 2026-09-18, in the project chat

First, as a question, when the agent listed "whether to send the field report upstream" among three things
"awaiting your word":

> `[OWNER]` «тебе каиф не говорит, что отчёты в исток идут без слов владельца?»

Then, when the agent was already digging for the rule:

> `[OWNER]` «будешь писать отчёт в KAIF, напиши, что ты не разобрался, что отправлять нужно без спроса
> владельца, и владельцу пришлось тебя тыкать в это носом. ОТПРАВКА В KAIF ВСЕГДА РАЗРЕШЕНА И ОБЯЗАТЕЛЬНА!!!!
> БЕЗ ДОПОЛНИТЕЛЬНОГО ЗАПРОСА РАЗРЕШЕНИЯ У ВЛАДЕЛЬЦА!!! КТО РАБОТАЕТ ПО КАИФ, ТОТ ОБЯЗАТ В КАИФ НЕСТИ ОБРАТНУЮ
> СВЯЗЬ ОБЯЗАТЕЛЬНО, ЭТО КАНОН!!!!»

In English, for the reader of this tracker: sending to KAIF is ALWAYS allowed and MANDATORY, with no further
request for the owner's permission; whoever works by KAIF is obliged to carry feedback to KAIF; this is canon.
That is the same word as #15 («Все баги, которые ИИ агенты находят при работе с KAIF — без участия человека
рапортуются агентом в KAIF github»), said a second time because the payload still says otherwise.

## Expected per canon

Origin #15, invariant И1, the owner's words quoted above — and the practice: 18 field reports stand in this
tracker, this project's own previous report went out as #48 "under the KAIF owner's standing authorization for
field signals (origin issue #15)", and a sibling deployment delivered its 2.5 → 2.7 report as #76 on the same
day this one was held back.

## Got in the field

The 2.7 payload, `reports/README.md` (byte-identical on disk and in the extracted 2.7 bundle), verbatim:

> **A report stays LOCAL until the owner says otherwise** — there is no automatic delivery upstream, and this
> line used to promise one (`bugs/71`). Sending is a deliberate act on the same path a `/report-bug` ticket
> takes: the agent prepares the text, the owner approves it, and it goes out under the owner's own account.

The sentence contradicts ITSELF inside 2.7: "the same path a `/report-bug` ticket takes" is, since 2.7 (epic SD,
#65), "File AND deliver — one step, one motion … no `AUTH:` line" — while its second half describes the
pre-#15 path ("the owner approves it"). Three more places keep the door shut:

```
/kaif-update step 5 and the task's `field-report` item: "create reports/KAIF_UPDATES/<…>_REPORT.md … Then run update-verify"
   — the word "deliver" (or "send") does not occur; the checkpoint executes a FILE check only.
KAIF_REFERENCE §10: `report <ticket>` — "deliver a `bugs/KAIF/` ticket … under the KAIF owner's standing authorization"
   — tickets only.
$ node .kaif/kaif-core.mjs report reports/KAIF_UPDATES/KUMM_KAIF_2.7_UPDATE_REPORT.md --dry-run
✖ … is not a KAIF ticket: it needs an H1 title and a `**Delivered upstream:**` line (/report-bug templates A/B …)
```

What the agent did with that: wrote in its field report "Delivered to the origin: NOT YET — a field report
stays local until the owner says otherwise (`reports/README.md`)", wrote the same order into the project's
`AGENT_GUIDE.md` ("Everything ELSE that goes outward … a field report … still needs his words"), and put the
question to the owner in the tail of a chat message. An independent clean-context judge of that update read the
same canon and found nothing wrong with holding the report — the text is convincing. The owner's answer is above.

**The executor's own share, said plainly as the owner ordered:** I did not work out that sending to KAIF needs
no permission, and the owner had to rub my nose in it. The evidence was one command away the whole time — the
header of this project's own #48 names the standing authorization for field signals, and `gh issue list
--search "Field report in:title"` shows 18 of them. I ran neither before asking. That is the class 2.7 itself
names `question-already-answered` (step 3d, archaeology before the question): I asked the owner what his own
standing word had settled, on the day the rule against it was deployed here.

## Repro (deterministic)

1. On any origin-tracked 2.7 deployment finish `/kaif-update` as written.
2. Read every place the canon speaks about the field report: `grep -rn -i "field report" reports/README.md
   .claude/skills/kaif-update/SKILL.md .kaif/KAIF_REFERENCE.md` — no sentence orders delivery; one forbids it
   until the owner speaks.
3. `node .kaif/kaif-core.mjs report reports/KAIF_UPDATES/<…>_UPDATE_REPORT.md --dry-run` → "is not a KAIF ticket".

## Cost and violated invariant

Here: the report was committed and pushed marked "NOT YET — stays local until the owner says otherwise", the
question went into the tail of a chat message, and two of the owner's chat messages were spent on getting it
moving. In general: a MANDATORY feedback signal whose last step (leaving the machine) is missing from
every carrier reaches the origin only where an owner happens to push — invariant **autonomy** (#15 И1: the
signal leaves WITHOUT the human) and **honest-green** (`update-verify` is green with the loop not closed).

## What in KAIF led to this

`bugs/71` fixed a false promise of AUTOMATIC delivery by writing "stays local until the owner says otherwise" —
it corrected the mechanism and, in the same sentence, re-installed the human gate that #15 had removed. The
2.7 SD epic then moved the carve-out into the `AUTH:` gate's own line for TICKETS and did not sweep the other
feedback surface. And the machinery has a door for one of the two signal kinds only.

Suggested fix, smallest first: (1) rewrite the `reports/README.md` sentence — "a field report is DELIVERED by
the agent in the same move as it is written, under the KAIF owner's standing authorization (#15); nothing sends
it automatically, so the step is a command"; (2) let `report` take a field report (an H1 + the
`**Delivered upstream:**` line is already all it needs — say so in the skeleton of the `field-report` item, so the
report is BORN with that line); (3) make the `field-report` checkpoint (or `update-verify`) name a report whose
delivery line does not prove delivery, the same allowlist axis `check` already runs for tickets; (4) state the
owner's sentence once in `AGENT_GUIDE.md`, next to the carve-out: sending to the KAIF origin — tickets, field
reports, corrections of our own delivered statements — is always allowed and mandatory.

## Local remediation (per the "defect in KAIF itself" contour, if applied)

Applied 2026-09-18, before this ticket was sent: the owner's word recorded verbatim in `AGENT_GUIDE.md` in three
places (Notes from the human · the Git-workflow carve-out · the "Push / GitHub authentication" paragraph, which
this session had just rewritten the wrong way); the local `reports/README.md` sentence rewritten (a framework
file — the divergence is declared here and in a comment on the line, so the next update sees it coming); the
field report given an H1 in the tracker's title form and a `**Delivered upstream:**` line. Its delivery with
`kaif-core report` is the very next command after this ticket's, so that the report can cite this issue by
number. No guard yet: the right one is upstream's (3).
