"""Fetch a documentation page (or raw source file) and print it as plain text.

Used to build this handbook from the real pages instead of from memory.
Usage:  python fetch_text.py <url> [<url> ...]
        python fetch_text.py --raw <url>          (print the body unchanged, e.g. a .cs file)
        python fetch_text.py --grep <regex> <url> (print only matching lines, with line numbers)
Writes nothing to disk; prints to stdout (UTF-8).
"""
import html
import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding="utf-8")


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (handbook fetch)"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", errors="replace")


def to_text(page):
    # DocFX (package docs) keeps the body in <article ...>; Unity manual/scripting in <div class="content"...>
    m = re.search(r"<article[^>]*>(.*?)</article>", page, re.S)
    if not m:
        m = re.search(r'<div[^>]*id="content-wrap"[^>]*>(.*)', page, re.S)
    body = m.group(1) if m else page
    body = re.sub(r"<(script|style|nav|header|footer)[^>]*>.*?</\1>", "", body, flags=re.S)
    for n in range(1, 7):
        body = re.sub(r"<h%d[^>]*>" % n, "\n\n" + "#" * n + " ", body)
        body = re.sub(r"</h%d>" % n, "\n", body)
    body = re.sub(r"<li[^>]*>", "\n- ", body)
    body = re.sub(r"<tr[^>]*>", "\n", body)
    body = re.sub(r"<t[dh][^>]*>", " | ", body)
    body = re.sub(r"<(br|/p|p|/div|div|/pre|pre)[^>]*>", "\n", body)
    body = re.sub(r"<code[^>]*>", "`", body)
    body = re.sub(r"</code>", "`", body)
    body = re.sub(r"<img[^>]*alt=\"([^\"]*)\"[^>]*>", r"[img: \1]", body)
    body = re.sub(r"<[^>]+>", "", body)
    body = html.unescape(body)
    body = re.sub(r"[ \t]+", " ", body)
    body = re.sub(r"\n\s*\n\s*\n+", "\n\n", body)
    return body.strip()


def main(argv):
    raw = False
    pattern = None
    urls = []
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--raw":
            raw = True
        elif a == "--grep":
            pattern = re.compile(argv[i + 1])
            i += 1
        else:
            urls.append(a)
        i += 1
    for url in urls:
        print("=" * 8, url)
        try:
            page = fetch(url)
        except Exception as e:  # report plainly, never fill in from memory
            print("FETCH FAILED:", e)
            continue
        text = page if raw else to_text(page)
        if pattern:
            for n, line in enumerate(text.splitlines(), 1):
                if pattern.search(line):
                    print("%6d: %s" % (n, line))
        else:
            print(text)


if __name__ == "__main__":
    main(sys.argv[1:])
