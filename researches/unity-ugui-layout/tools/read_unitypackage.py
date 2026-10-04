"""Stream a .unitypackage from a URL (in memory, nothing written to disk) and print asset files.

Usage:
  python read_unitypackage.py <url>                          list asset paths (.shader / .cginc / .cs)
  python read_unitypackage.py <url> <file-name> [<regex>]    print that asset (only lines matching regex, numbered)
Used for the TMP Essential Resources package, which holds the TMP SDF shader sources.
"""
import io
import re
import sys
import tarfile
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")


def main(argv):
    url = argv[0]
    data = urllib.request.urlopen(url, timeout=180).read()
    tf = tarfile.open(fileobj=io.BytesIO(data), mode="r:gz")
    names = {}
    for m in tf.getmembers():
        if m.name.endswith("/pathname"):
            p = tf.extractfile(m).read().decode("utf-8").splitlines()[0]
            names[m.name.split("/")[0]] = p
    if len(argv) == 1:
        for v in sorted(names.values()):
            if v.endswith((".shader", ".cginc", ".cs")):
                print(v)
        return
    want = argv[1]
    pattern = re.compile(argv[2]) if len(argv) > 2 else None
    for k, v in names.items():
        if v.split("/")[-1] == want:
            src = tf.extractfile(k + "/asset").read().decode("utf-8", "replace")
            print("=" * 10, v)
            for i, line in enumerate(src.splitlines(), 1):
                if pattern is None or pattern.search(line):
                    print("%5d: %s" % (i, line.rstrip()))


if __name__ == "__main__":
    main(sys.argv[1:])
