"""Lint the handbook: every '## ' section must be followed by 'TAG:' then at least one 'SOURCE:' line.

Also reports duplicate tags, backticked references to tags that do not exist, and prints the tag index
(tag | file | first content line) used to build README.md.
Usage: python check_tags.py [--index]
"""
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAG_RE = re.compile(r"^TAG: ((?:ugui|tmp|color|perf|css2ugui|pitfall)\.[a-z0-9.\-]+)$")
REF_RE = re.compile(r"`((?:ugui|tmp|color|perf|css2ugui|pitfall)\.[a-z0-9\-]+(?:\.[a-z0-9\-]+)+)`")


def main():
    files = sorted(f for f in os.listdir(ROOT) if re.match(r"\d\d_.*\.md$", f))
    tags = {}
    problems = []
    refs = []
    for f in files:
        lines = open(os.path.join(ROOT, f), encoding="utf-8").read().splitlines()
        for i, line in enumerate(lines):
            if line.startswith("## "):
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


if __name__ == "__main__":
    main()
