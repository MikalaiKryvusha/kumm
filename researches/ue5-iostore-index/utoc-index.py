"""Каталог ассетов игры на UE5 из контейнера IoStore (.utoc) — без запуска игры.

ЗАЧЕМ. Чтобы мод под UE4SS мог попросить игру показать её собственный виджет, надо знать
ИМЯ КЛАССА этого виджета. Искать имя перебором в живой памяти игры дорого и опасно: три
крэша 08.09.2026 оплачены именно этим (пак Конана, docs/06). Имена лежат в индексе
каталога контейнера ОТКРЫТЫМ ТЕКСТОМ, и прочитать их можно с диска, ничего не запуская.

ЧТО ЧИТАЕТ. Только ИНДЕКС — список путей. Содержимое ассетов лежит в .ucas, сжато Oodle,
и распаковать его нечем: у UE5 Oodle слинкован в exe статически, отдельной библиотеки в
поставке игры нет. То есть прибор отвечает на вопрос «какие ассеты есть и как они
называются», но не на вопрос «что у них внутри».

КАК УСТРОЕН. Заголовок TOC версионный, и разбирать его целиком незачем. Индекс каталога
начинается с точки монтирования — строки FString, — поэтому прибор ищет строку и читает
дальше по формату FIoDirectoryIndexResource:

    FString MountPoint
    TArray<FIoDirectoryIndexEntry> { Name, FirstChild, NextSibling, FirstFile }  16 байт
    TArray<FIoFileIndexEntry>      { Name, NextFile, UserData }                  12 байт
    TArray<FString> StringTable

Такая же последовательность байт встречается и внутри данных, поэтому пробуются ВСЕ
вхождения, и побеждает первое, которое разобралось непротиворечиво: массивы правдоподобной
длины, строки декодируются, а обход дерева даёт ровно столько путей, сколько объявлено
файлов. Последняя проверка и есть главный сторож от ложного разбора.

ОГРАНИЧЕНИЯ, НАЗВАННЫЕ ЗАРАНЕЕ.
  * Только IoStore (.utoc). Старые pak-моды UE4 — другой формат, здесь не читаются
    (моды Конана из мастерской лежат именно так: одиночные .pak без .utoc).
  * Зашифрованный индекс не поддержан. У Конана шифрования нет: флаги контейнера 0x09
    (сжат + индексирован), GUID ключа нулевой. У другой игры может быть иначе — тогда
    прибор просто не найдёт индекс и честно скажет об этом.

  [TESTED: 2026-09-09 · прогон по 37 контейнерам Conan Exiles Enhanced 2.1.1 — 138 424
   пути; сверка с наблюдением: класс W_MainMenu_MainMenu_C, который прошлая сессия видела
   в живой памяти игры, нашёлся как UI/Widgets/MainMenu/W_MainMenu_MainMenu.uasset]

ПРИМЕНЕНИЕ:
    python utoc-index.py "<игра>/Content/Paks/"*.utoc > assets.txt
Строки, начинающиеся с '#', — сводка по контейнеру; остальные — пути ассетов.
Путь ассета переводится в имя объекта UE так: Content/ -> /Game/, а класс блюпринта
получает суффикс _C:  UI/Widgets/Modals/W_TimedMessageBox.uasset
                   -> /Game/UI/Widgets/Modals/W_TimedMessageBox.W_TimedMessageBox_C
"""
import sys, struct, os

INVALID = 0xFFFFFFFF

def read_fstring(buf, pos):
    """FString: длина int32; отрицательная означает UTF-16."""
    (n,) = struct.unpack_from('<i', buf, pos); pos += 4
    if n == 0:
        return '', pos
    if n < 0:
        n = -n
        if pos + n*2 > len(buf): raise ValueError('строка выходит за конец файла')
        s = buf[pos:pos+n*2].decode('utf-16-le', 'strict').rstrip('\0'); pos += n*2
    else:
        if pos + n > len(buf): raise ValueError('строка выходит за конец файла')
        s = buf[pos:pos+n].decode('utf-8', 'strict').rstrip('\0'); pos += n
    return s, pos

def read_array(buf, pos, size):
    (n,) = struct.unpack_from('<I', buf, pos); pos += 4
    if n > 2_000_000 or pos + n*size > len(buf):
        raise ValueError('неправдоподобная длина массива %d' % n)
    out = buf[pos:pos+n*size]; pos += n*size
    return n, out, pos

def _parse_at(data, start):
    """Разобрать индекс, считая, что он начинается ровно здесь. Иначе — исключение."""
    pos = start
    mount_point, pos = read_fstring(data, pos)
    ndirs, dirbuf, pos = read_array(data, pos, 16)
    nfiles, filebuf, pos = read_array(data, pos, 12)
    (nstr,) = struct.unpack_from('<I', data, pos); pos += 4
    if nstr > 2_000_000:
        raise ValueError('неправдоподобная длина таблицы строк')
    strings = []
    for _ in range(nstr):
        s, pos = read_fstring(data, pos)
        strings.append(s)
    if nfiles and not strings:
        raise ValueError('файлы есть, имён нет')

    dirs = [struct.unpack_from('<4I', dirbuf, i*16) for i in range(ndirs)]
    files = [struct.unpack_from('<3I', filebuf, i*12) for i in range(nfiles)]

    def name(i):
        return strings[i] if i != INVALID and i < len(strings) else ''

    out, stack, guard = [], ([(0, '')] if ndirs else []), 0
    while stack:
        guard += 1
        if guard > 500_000: raise ValueError('дерево каталогов зациклено')
        di, prefix = stack.pop()
        d = dirs[di]
        cur = prefix if d[0] == INVALID else prefix + name(d[0]) + '/'
        fi = d[3]
        while fi != INVALID:                       # файлы этого каталога — связный список
            out.append(cur + name(files[fi][0]))
            fi = files[fi][1]
        ci = d[1]
        while ci != INVALID:                       # подкаталоги — тоже связный список
            stack.append((ci, cur))
            ci = dirs[ci][2]
    # Главный сторож: ложный разбор почти никогда не сойдётся по количеству.
    if len(out) != nfiles:
        raise ValueError('обошли %d путей из %d заявленных' % (len(out), nfiles))
    return mount_point, out

def parse_all(path):
    """Все индексы каталога, какие есть в файле, — в порядке появления.

    ⚠️ ВОЗВРАЩАЕТ СПИСОК, А НЕ ПЕРВУЮ НАХОДКУ. Оплачено 2026-09-09: мод Мастерской
    `UIMod_Hosav.pak` оказался ОБЁРТКОЙ — внутри лежат три полноценных контейнера
    IoStore (Windows, WindowsServer, LinuxServer). Прибор возвращал первый
    разобравшийся и молчал об остальных, то есть выдавал СЕРВЕРНУЮ сборку мода за
    весь мод: 199 файлов вместо 204, без шейдеров и без `Slate/Hyborian_Copy`.
    Ошибка того же класса, что EXP-0058 — частичный разбор неотличим от полного,
    если не считать. Поэтому берём ВСЕ и называем каждый по смещению.
    """
    data = open(path, 'rb').read()
    starts, off = [], data.find(b'../')
    while off != -1:
        if off >= 4:
            starts.append(off - 4)                 # четыре байта назад — поле длины FString
        off = data.find(b'../', off + 1)
    found, claimed = [], set()
    for start in starts:
        try:
            mp, files = _parse_at(data, start)
        except Exception:
            continue
        # Один и тот же индекс может «зацепиться» с двух соседних якорей —
        # различаем по смещению начала, а не по содержимому: два контейнера
        # внутри одного пака бывают и полностью одинаковыми (серверные сборки).
        if start in claimed:
            continue
        claimed.add(start)
        found.append((start, mp, files))
    return found

def parse(path):
    """Совместимость: первый разобравшийся индекс или None."""
    found = parse_all(path)
    if not found:
        return None
    return found[0][1], found[0][2]

if __name__ == '__main__':
    # ⚠️ ВЫВОД ТОЛЬКО В UTF-8, И ЭТО НЕ ВКУСОВЩИНА. Оплачено 2026-09-09: прогон
    # по 44 пакам сборки Конана оборвался на `MSCasaDesFlores_Nails_Enhanced` —
    # в путях мода есть `ñ`, а перенаправление на этой машине пишет системной
    # кодировкой cp1251, где такого символа нет. Прибор упал на 25-м паке из 44,
    # и половина каталога выглядела бы полным каталогом. Тот же класс, что
    # EXP-0058: частичный результат неотличим от полного, если его не считать.
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except AttributeError:
        pass                                       # питон старее 3.7 — оставляем как есть
    total = 0
    for p in sys.argv[1:]:
        found = parse_all(p)
        short = os.path.basename(p)
        if not found:
            print('# %s: индекс каталога не найден' % short); continue
        if len(found) > 1:
            # Вложенный пак: сводка сразу говорит, что контейнеров несколько,
            # иначе читатель примет список одного из них за весь мод.
            print('# %s: ВЛОЖЕННЫЙ ПАК — индексов внутри: %d' % (short, len(found)))
        for start, mp, files in found:
            total += len(files)
            print('# %s@%d: точка монтирования=%s файлов=%d' % (short, start, mp, len(files)))
            base = mp.rstrip('/')
            for f in files:
                print(base + '/' + f)
    print('ВСЕГО %d' % total, file=sys.stderr)
