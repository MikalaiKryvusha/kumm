# Glossary check: for a list of English terms, find the game's own Russian rendering.
# Reads <Target>.manifest (UTF-16 JSON: source text -> keys) and ru/<Target>.locres (key -> translation).
# Read-only over the Dev Kit. [NOT-TESTED]
import sys, os, json, struct, collections

LOC = r'F:\CEDevKit\CEUE5Devkit\UE4\Content\Localization'
TARGETS = ['Exiles_UI', 'Exiles_Code', 'Exiles_Items']
TERMS = [l.strip() for l in open(sys.argv[1], encoding='utf-8') if l.strip()]

def read_fstring(d, pos):
    n = struct.unpack_from('<i', d, pos)[0]; pos += 4
    if n == 0: return '', pos
    if n > 0:
        s = d[pos:pos + n - 1].decode('latin-1'); return s, pos + n
    m = -n * 2
    s = d[pos:pos + m - 2].decode('utf-16le', 'replace'); return s, pos + m

def read_locres(path):
    d = open(path, 'rb').read()
    MAGIC = bytes([0x0E,0x14,0x74,0x75,0x67,0x4A,0x03,0xFC,0x4A,0x15,0x90,0x9D,0xC3,0x37,0x7F,0x1B])
    pos = 0; version = 0
    if d[:16] == MAGIC:
        version = d[16]; pos = 17
    else:
        raise SystemExit('legacy locres, not handled: ' + path)
    str_off = struct.unpack_from('<q', d, pos)[0]; pos += 8
    if version >= 2:
        pos += 4  # entry count
    ns_count = struct.unpack_from('<i', d, pos)[0]; pos += 4
    entries = []  # (namespace, key, string index)
    for _ in range(ns_count):
        if version >= 2: pos += 4  # namespace hash
        ns, pos = read_fstring(d, pos)
        kc = struct.unpack_from('<i', d, pos)[0]; pos += 4
        for _ in range(kc):
            if version >= 2: pos += 4  # key hash
            key, pos = read_fstring(d, pos)
            pos += 4  # source string hash
            idx = struct.unpack_from('<i', d, pos)[0]; pos += 4
            entries.append((ns, key, idx))
    # localized strings array
    p = str_off
    cnt = struct.unpack_from('<i', d, p)[0]; p += 4
    strings = []
    for _ in range(cnt):
        s, p = read_fstring(d, p)
        if version >= 3: p += 4  # ref count
        strings.append(s)
    return {(ns, key): strings[idx] for ns, key, idx in entries if 0 <= idx < len(strings)}

def read_manifest(path):
    raw = open(path, 'rb').read()
    txt = raw.decode('utf-16le' if raw[:2] == b'\xff\xfe' else 'utf-8-sig', 'replace')
    j = json.loads(txt.lstrip('﻿'))
    out = collections.defaultdict(list)  # source text -> [(ns, key)]
    def walk(node, ns):
        for ch in node.get('Children', []):
            src = ch['Source']['Text']
            for k in ch.get('Keys', []):
                out[src].append((ns, k['Key']))
        for sub in node.get('Subnamespaces', []):
            walk(sub, sub.get('Namespace', ns))
    walk(j, j.get('Namespace', ''))
    return out

found = {}
for t in TARGETS:
    man = read_manifest(os.path.join(LOC, t, t + '.manifest'))
    ru = read_locres(os.path.join(LOC, t, 'ru', t + '.locres'))
    for term in TERMS:
        if term in found: continue
        cands = collections.Counter()
        for src in (term, term.capitalize(), term.lower(), term.upper()):
            for nk in man.get(src, []):
                tr = ru.get(nk)
                if tr: cands[tr] += 1
        if cands:
            found[term] = (t, cands.most_common(3))
for term in TERMS:
    if term in found:
        t, c = found[term]
        print('%-22s %-12s %s' % (term, t, ' | '.join('%s (%d)' % (s, n) for s, n in c)))
    else:
        print('%-22s %-12s %s' % (term, '-', 'NOT IN GAME'))
