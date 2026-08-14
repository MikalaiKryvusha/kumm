# KAIF improvement request: wiring `kaif:*` handles rewrites the owner's whole `package.json`, not just the `scripts` key

kaif-fp: `kaif-core.mjs` (package.json wiring, `~:1842`) :: tool-diff-wider-than-intent :: v2.2

**Autocapture** (from `.kaif/kaif.json`): KAIF 2.2 · project KUMM · sphere `programming` · language `ru` ·
i18n 8 owner docs localized · tracking `origin` · agent system claude-code (+4 mirrored) ·
OS Windows 11 Pro 10.0.26200 · Node v24.15.0

**Dedup attestation:** searched `bugs/KAIF/` (`ls bugs/KAIF/` → directory did not exist; this is its first
ticket) and origin issues (`gh issue list --repo MikalaiKryvusha/KAIF --state all --search "package.json"`
→ 1 hit, issue #5, the KAGO field report, whose only mention is the row *"`kaif:*` handles wired into
`package.json`"* — it does not report the reformatting; `--search "reformat formatting"` → no results).
No match found.

## Gap

The install step announces a narrow, additive action:

```
+ wired kaif:* handles into package.json
```

The diff it produces is not narrow. Of 31 changed lines in this project, **5 are the intended `scripts`
block and 24 are whitespace-only rewrites** of keys the machinery had no business touching — the owner's
compact hand-formatting of `bin`, `engines`, `keywords` and `files` was expanded to one-value-per-line,
plus a trailing newline added.

The cause is the obvious one: the wiring reads the file, mutates the object, and writes
`JSON.stringify(pkg, null, 2)` back. That normalizes every key, not the one that changed.

This collides directly with the framework's own git-hygiene rule, which the deployed `AGENT_GUIDE.md`
states in the imperative:

> **`git diff --stat` before every commit — of the set that is ACTUALLY LEAVING.** Anything in it you
> did not intend to change — STOP and explain it first. This includes diffs *your tools* generated
> (lock files, manifests, formatters): an agent trusts its tools even more blindly than itself — read
> those diffs line by line.

An agent that obeys that rule must stop and explain a 24-line diff the framework itself generated in the
owner's manifest, on the very first commit of the deployment. The rule is right; the machinery is what
makes it fire.

## Field evidence

KUMM, 2026-08-15 01:0x +03:00. `git diff package.json` after the mechanical install:

```diff
-  "bin": { "kumm": "kumm.mjs" },
-  "engines": { "node": ">=22" },
+  "bin": {
+    "kumm": "kumm.mjs"
+  },
+  "engines": {
+    "node": ">=22"
+  },
   "license": "MIT",
   "author": "Mikalai Kryvusha",
-  "keywords": ["nexusmods", "mods", "modding", "cdp", "chrome-devtools-protocol", "cli", "mod-manager"],
-  "files": ["kumm.mjs", "README.md", "LICENSE"]
-}
\ No newline at end of file
+  "keywords": [
+    "nexusmods",
...
+  "scripts": {
+    "kaif:version": "node .kaif/kaif-core.mjs version",
+    "kaif:check": "node .kaif/kaif-core.mjs check",
+    "kaif:update": "node .kaif/kaif-core.mjs update"
+  }
+}
```

Nothing broke — the change is semantically empty apart from the added key, verified:

```
$ node -e "...compare parsed HEAD:package.json against parsed current minus scripts..."
semantically identical apart from scripts: true
keys added: scripts
keys removed: (none)
```

**Low severity.** No value changed, no behavior changed, and `npm` does not care. The cost is entirely
in the review contour: the owner's file no longer looks like the owner wrote it, and the deployment's
first commit carries a diff whose bulk the agent did not author and cannot justify line by line.

The residual risk is the interesting one. A project with a formatter or a `package.json` lint in CI gets
a spurious failure; a project where the owner curates that file by hand gets a silent restyling they
never approved. Both land on the framework, not on the agent, because the agent is told to trust the
mechanical pass.

## Proposed change (smallest that closes the gap)

Preserve the file's existing shape and touch only the key being added:

1. **Detect the file's own indentation** before writing (the two-space assumption is usually right, but
   the compact single-line style above is not an indentation question at all), and
2. **splice the `scripts` block textually** rather than re-serializing the whole object — or, if a full
   re-serialize is unavoidable, **say so in the install output**: `+ wired kaif:* handles into
   package.json (file re-serialized: N lines reformatted)`.

Option 2 alone would close most of the gap. The defect is not the reformatting; it is the reformatting
happening **silently under a message that promises an additive edit** — which is exactly what the
git-hygiene rule warns the agent to distrust.

A third option, cheapest of all: keep the behavior and add one line to the adaptation task's `verify`
item — *"the machinery re-serializes `package.json`; the whitespace-only part of that diff is expected"*.
That turns an unexplained diff into a documented one at zero implementation cost.

## Expected effect and its check

After the change, a fresh install into a project with a hand-formatted `package.json` produces a diff
containing only the `scripts` block. Check:

```bash
git diff --numstat package.json    # expect ~5 added lines, 0 removed (or 1 removed for a missing EOF newline)
```

Invariant served: **owner-work-safety** — the machinery does not restyle the owner's files as a side
effect of adding to them; and **honest-green** — the install's own output describes the full extent of
what it changed.

## Local remediation

None. The reformatting is accepted as-is in this project and committed together with the deployment —
reverting it would fight the machinery on every future `kaif:*` rewiring, and the change is semantically
empty. Recorded here so the next `/kaif-update` sees the divergence coming rather than stepping into it.
