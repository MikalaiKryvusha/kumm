"""Lint the jump/climb handbook: every '## ' section must be followed by 'TAG:' then at least one 'SOURCE:' line.

Sections named 'Not fetched / gaps' are exempt (they list what is NOT sourced). Also reports duplicate tags,
backticked references to tags that do not exist, and prints the tag index (tag | file | section title) for README.md.
Copied from researches/unity-ugui-layout/tools/check_tags.py; only the tag prefixes and the exemption differ.
Usage: python -I check_tags.py [--index]   (exit 1 when there are problems)
"""
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PREFIXES = "jump|fall|cc|phys|nav|perf|climb|anim|pitfall|svarog"
TAG_RE = re.compile(r"^TAG: ((?:%s)\.[a-z0-9.\-]+)$" % PREFIXES)
REF_RE = re.compile(r"`((?:%s)\.[a-z0-9\-]+(?:\.[a-z0-9\-]+)*)`" % PREFIXES)
EXEMPT = re.compile(r"^## (Not fetched|Sources)", re.I)


def main():
    files = sorted(f for f in os.listdir(ROOT) if re.match(r"\d\d_.*\.md$", f))
    tags = {}
    problems = []
    refs = []
    for f in files:
        lines = open(os.path.join(ROOT, f), encoding="utf-8").read().splitlines()
        for i, line in enumerate(lines):
            if line.startswith("## ") and not EXEMPT.match(line):
                nxt = lines[i + 1] if i + 1 < len(lines) else ""
                m = TAG_RE.match(nxt)
                if not m:
                    problems.append("%s:%d section without TAG line: %s" % (f, i + 1, line))
                    continue
                tag = m.group(1)
                if tag in tags:
                    problems.append("%s:%d duplicate tag %s (first in %s)" % (f, i + 2, tag, tags[tag][0]))
                j = i + 2
                if j >= len(lines) or not lines[j].startswith("SOURCE: "):
                    problems.append("%s:%d tag %s has no SOURCE line right after it" % (f, i + 2, tag))
                tags[tag] = (f, line[3:].strip())
            for r in REF_RE.findall(line):
                refs.append((f, i + 1, r))
    for f, n, r in refs:
        if r not in tags:
            problems.append("%s:%d reference to unknown tag %s" % (f, n, r))
    print("files:", len(files), " tags:", len(tags), " problems:", len(problems))
    for p in problems:
        print("  ", p)
    if "--index" in sys.argv:
        print()
        print("| Tag | File | Meaning |")
        print("|---|---|---|")
        for tag, (f, title) in tags.items():
            print("| `%s` | %s | %s |" % (tag, f, title))
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
