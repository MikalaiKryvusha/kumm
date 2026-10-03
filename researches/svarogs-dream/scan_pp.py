# Read-only: follow PostProcessVolume -> PostProcessProfile -> settings, print raw floats of Vignette/ColorGrading.
import struct, UnityPy
GAME = r"D:\Games\Svarog's Dream\Svarog's Dream_Data"
env = UnityPy.load(GAME + r"\level1", GAME + r"\globalgamemanagers.assets", GAME + r"\sharedassets1.assets", GAME + r"\sharedassets0.assets", GAME + r"\resources.assets")
files = {n.split("\\")[-1].split("/")[-1]: f for n, f in env.files.items()}
level = files["level1"]

def head(raw):
    off = 12 + 4 + 12
    n = struct.unpack_from("<i", raw, off)[0]
    name = raw[off + 4: off + 4 + n].decode("utf-8", "replace")
    off += 4 + n; off = (off + 3) & ~3
    return name, off

def ext_file(sf, fid):
    if fid == 0:
        return sf
    path = sf.externals[fid - 1].path
    key = path.split("/")[-1]
    return files.get(key)

vols = []
for pid, obj in level.objects.items():
    if obj.type.name != "MonoBehaviour":
        continue
    mb = obj.read(check_read=False)
    try:
        sn = mb.m_Script.read().m_ClassName
    except Exception:
        continue
    if sn == "PostProcessVolume":
        vols.append((pid, obj, mb))

for pid, obj, mb in vols:
    raw = obj.get_raw_data()
    name, off = head(raw)
    fid, ppid = struct.unpack_from("<iq", raw, off)
    rest = raw[off + 12: off + 12 + 24]
    print("== Volume on", mb.m_GameObject.read().m_Name, "pid", pid, "sharedProfile", fid, ppid, "tail", rest.hex())
    sf = ext_file(level, fid)
    if sf is None:
        print("   profile file not loaded:", level.externals[fid - 1].path if fid else "")
        continue
    po = sf.objects.get(ppid)
    praw = po.get_raw_data()
    pname, poff = head(praw)
    cnt = struct.unpack_from("<i", praw, poff)[0]
    print("   profile", pname, "in", sf.name, "settings:", cnt)
    for i in range(cnt):
        sfid, spid = struct.unpack_from("<iq", praw, poff + 4 + 12 * i)
        sfile = ext_file(sf, sfid)
        so = sfile.objects.get(spid)
        sraw = so.get_raw_data()
        smb = so.read(check_read=False)
        try:
            cls = smb.m_Script.read().m_ClassName
        except Exception:
            cls = "?"
        sname, soff = head(sraw)
        body = sraw[soff:]
        floats = [round(x, 4) for x in struct.unpack_from("<%df" % (len(body) // 4), body)]
        print("   --", cls, "len", len(body))
        print("     ", floats[:80])
