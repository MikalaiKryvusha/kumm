# Scan cooked (Zen-split) assets for human-readable English phrases; report per file. [NOT-TESTED]
import sys, re, os, collections
root = sys.argv[1]
phrase16 = re.compile(rb'(?:[\x20-\x7e]\x00){3,}')
phrase8 = re.compile(rb'[\x20-\x7e]{4,}')
# "Health Regen", "Party Leader", "Show minimap" - a capitalised word followed by at least one more token
word = re.compile(r"^[A-Z][a-z]+(?: [A-Za-z0-9%:'\-!?.,()/]+){1,}$")
hits = collections.defaultdict(list)
total = 0
for dp, dn, fn in os.walk(root):
    for f in fn:
        if not f.endswith(('.uasset', '.umap', '.uexp', '.uheader')):
            continue
        p = os.path.join(dp, f)
        d = open(p, 'rb').read()
        found = set()
        for m in phrase16.finditer(d):
            s = m.group().decode('utf-16le')
            if word.match(s):
                found.add('u16:' + s)
        for m in phrase8.finditer(d):
            s = m.group().decode('ascii')
            if word.match(s) and not s.startswith(('Script', 'Game', 'Engine')):
                found.add(s)
        if found:
            rel = os.path.relpath(p, root).replace(os.sep, '/')
            hits[rel] = sorted(found)
            total += len(found)
print('files with phrases:', len(hits), 'phrases:', total)
for rel, fs in sorted(hits.items(), key=lambda kv: -len(kv[1]))[:14]:
    print('\n==', rel, len(fs))
    for s in fs[:16]:
        print('   ', s)
