# Read-only: dump ColorGrading settings of profile FinalVersion5 (sharedassets1 pid 88873) word by word.
import struct, UnityPy
G = r"D:\Games\Svarog's Dream\Svarog's Dream_Data"
env = UnityPy.load(G + r"\sharedassets1.assets", G + r"\globalgamemanagers.assets")
sf = [f for n, f in env.files.items() if n.endswith("sharedassets1.assets")][0]
raw = sf.objects[88873].get_raw_data()
off = 28; n = struct.unpack_from("<i", raw, off)[0]; off = (off + 4 + n + 3) & ~3
cnt = struct.unpack_from("<i", raw, off)[0]
for i in range(cnt):
    fid, pid = struct.unpack_from("<iq", raw, off + 4 + 12 * i)
    so = sf.objects.get(pid)
    r = so.get_raw_data()
    q = 28; m = struct.unpack_from("<i", r, q)[0]; q = (q + 4 + m + 3) & ~3
    cls = so.read(check_read=False).m_Script.read().m_ClassName
    if cls != "ColorGrading":
        continue
    print("ColorGrading pid", pid, "body offset", q)
    b = r[q:]
    rows = []
    for k in range(0, 96):
        iv = struct.unpack_from("<i", b, 4 * k)[0]
        fv = struct.unpack_from("<f", b, 4 * k)[0]
        rows.append("%3d %11d %9.4f" % (k, iv, fv))
    for k in range(0, 32):
        print("   ".join(rows[k + 32 * c] for c in range(3)))
