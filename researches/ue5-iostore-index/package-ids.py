"""Номер пакета UE5 (FPackageId) → путь ассета, по оглавлениям IoStore (.utoc и pak-обёртки модов) — без запуска игры.

ЗАЧЕМ. Журнал игры называет недостающий пакет только номером: `LoadErrors: While trying to load package /Game/Mods/…,
a dependent package None (1A1BFCEEE27A46C0) was not available`. 2026-10-26 таких номеров в сборке Конана 3.0.1 — 135, у двух десятков
модов (KUMM researches/conan-main-thread, ConanExiles docs/17). Чтобы чинить совместимость, надо знать, ЧЕЙ это пакет: игры другой
версии, мода, которого нет в сборке, или пропавший ассет самого мода.

КАК. В оглавлении контейнера после заголовка FIoStoreTocHeader (сигнатура `-==--==--==--==-`, поле TocHeaderSize, поле TocEntryCount)
лежит массив FIoChunkId по 12 байт; первые 8 байт (uint64, little-endian) — номер пакета для чанков данных пакета. Файл индекса
каталога (FIoFileIndexEntry.UserData) — это индекс в этом массиве. Пути берутся разбором индекса каталога из utoc-index.py.
Сторож от ложного разбора — тот же, что там (число путей = число файлов), плюс заголовок ищется ПЕРЕД индексом и должен вмещать
все UserData.

    python package-ids.py <файлы .utoc/.pak…> > ids.tsv        # строки «номер\tпуть\tфайл»
    python package-ids.py --find <номера.txt> <файлы…>           # только искомые номера (по одному в строке, шестнадцатерично)
[NOT-TESTED]
"""
import importlib.util, os, struct, sys

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location("utoc_index", os.path.join(HERE, "utoc-index.py"))
U = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(U)

MAGIC = b"-==--==--==--==-"
INVALID = 0xFFFFFFFF


def index_with_userdata(data, start):
    """Как utoc-index._parse_at, но вместе с путями возвращает UserData каждого файла (индекс записи оглавления)."""
    pos = start
    mount_point, pos = U.read_fstring(data, pos)
    ndirs, dirbuf, pos = U.read_array(data, pos, 16)
    nfiles, filebuf, pos = U.read_array(data, pos, 12)
    (nstr,) = struct.unpack_from("<I", data, pos); pos += 4
    strings = []
    for _ in range(nstr):
        s, pos = U.read_fstring(data, pos)
        strings.append(s)
    dirs = [struct.unpack_from("<4I", dirbuf, i * 16) for i in range(ndirs)]
    files = [struct.unpack_from("<3I", filebuf, i * 12) for i in range(nfiles)]
    name = lambda i: strings[i] if i != INVALID and i < len(strings) else ""
    out, stack = [], ([(0, "")] if ndirs else [])
    while stack:
        di, prefix = stack.pop()
        d = dirs[di]
        cur = prefix if d[0] == INVALID else prefix + name(d[0]) + "/"
        fi = d[3]
        while fi != INVALID:
            out.append((cur + name(files[fi][0]), files[fi][2]))
            fi = files[fi][1]
        ci = d[1]
        while ci != INVALID:
            stack.append((ci, cur))
            ci = dirs[ci][2]
    if len(out) != nfiles:
        raise ValueError("обошли %d путей из %d" % (len(out), nfiles))
    return mount_point, out


def package_ids(path):
    """[(номер пакета, путь)] по всем контейнерам файла; заголовок — ближайшая сигнатура перед индексом каталога."""
    data = open(path, "rb").read()
    heads, off = [], data.find(MAGIC)
    while off != -1:
        heads.append(off); off = data.find(MAGIC, off + 1)
    res = []
    for start, _mp, _files in U.parse_all(path):
        before = [h for h in heads if h < start]
        if not before:
            continue
        h = before[-1]
        header_size, entry_count = struct.unpack_from("<II", data, h + 20)
        mp, files = index_with_userdata(data, start)
        if any(ud >= entry_count for _, ud in files):
            raise ValueError("%s: UserData вне оглавления (%d записей)" % (path, entry_count))
        base = mp.rstrip("/")
        for p, ud in files:
            if not p.endswith((".uasset", ".umap")):
                continue
            (pid,) = struct.unpack_from("<Q", data, h + header_size + ud * 12)
            res.append((pid, base + "/" + p))
    return res


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    args = sys.argv[1:]
    want = None
    if args and args[0] == "--find":
        want = {int(l.strip(), 16) for l in open(args[1], encoding="utf-8") if l.strip()}
        args = args[2:]
    n = 0
    for f in args:
        try:
            pairs = package_ids(f)
        except Exception as e:
            print("# %s: %s" % (os.path.basename(f), e), file=sys.stderr); continue
        for pid, p in pairs:
            n += 1
            if want is None or pid in want:
                print("%X\t%s\t%s" % (pid, p, os.path.basename(f)))
    print("пакетов просмотрено: %d" % n, file=sys.stderr)
