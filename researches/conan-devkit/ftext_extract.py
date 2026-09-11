# Extract FText (namespace, key, source) triples from cooked Zen-split packages (.uexp).
# Serialized shape in a cooked package: [int32 nsLen][ns\0][int32 33]["<32 hex>"\0][int32 srcLen][src\0]
# srcLen > 0 = ANSI bytes incl. null; srcLen < 0 = UTF-16 code units incl. null. [NOT-TESTED]
import sys, os, re, struct, json, csv

root = sys.argv[1]
out_csv = sys.argv[2]
KEY_RE = re.compile(rb'\x21\x00\x00\x00([0-9A-F]{32})\x00')

def read_fstring(d, pos):
    """Return (string, new_pos) or (None, pos) if not a plausible FString at pos."""
    if pos + 4 > len(d):
        return None, pos
    n = struct.unpack_from('<i', d, pos)[0]
    pos += 4
    if n == 0:
        return '', pos
    if 0 < n <= 4096:
        raw = d[pos:pos + n]
        if len(raw) < n or raw[-1:] != b'\x00':
            return None, pos
        try:
            return raw[:-1].decode('ascii'), pos + n
        except UnicodeDecodeError:
            return raw[:-1].decode('latin-1'), pos + n
    if -4096 <= n < 0:
        m = -n * 2
        raw = d[pos:pos + m]
        if len(raw) < m or raw[-2:] != b'\x00\x00':
            return None, pos
        return raw[:-2].decode('utf-16le', 'replace'), pos + m
    return None, pos

rows = []
for dp, dn, fn in os.walk(root):
    for f in fn:
        if not f.endswith('.uexp'):
            continue
        p = os.path.join(dp, f)
        d = open(p, 'rb').read()
        rel = os.path.relpath(p, root).replace(os.sep, '/')
        for m in KEY_RE.finditer(d):
            key = m.group(1).decode()
            src, end = read_fstring(d, m.end())
            if src is None:
                continue
            # namespace sits right before the key's length prefix: [int32 nsLen][ns\0]
            ns = ''
            start = m.start()
            # try nsLen = 0 (4 bytes of zeros) or a short ANSI namespace
            if d[start - 4:start] == b'\x00\x00\x00\x00':
                ns = ''
            else:
                for nlen in range(2, 128):
                    q = start - 4 - nlen
                    if q < 0:
                        break
                    if struct.unpack_from('<i', d, q)[0] == nlen and d[start - 1:start] == b'\x00':
                        try:
                            ns = d[q + 4:start - 1].decode('ascii')
                        except UnicodeDecodeError:
                            ns = '?'
                        break
            rows.append({'file': rel, 'namespace': ns, 'key': key, 'source': src})

with open(out_csv, 'w', encoding='utf-8', newline='') as fh:
    w = csv.DictWriter(fh, fieldnames=['file', 'namespace', 'key', 'source'])
    w.writeheader()
    w.writerows(rows)

uniq = {}
for r in rows:
    uniq.setdefault(r['source'], []).append(r)
print('triples:', len(rows), 'files:', len({r['file'] for r in rows}), 'unique sources:', len(uniq))
print('empty sources:', sum(1 for r in rows if r['source'] == ''))
print('namespaces:', sorted({r['namespace'] for r in rows})[:10])
