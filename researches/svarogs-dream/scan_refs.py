# Read-only: resolve script names of MonoBehaviours in level1 and dump raw PPtr fields of the night-related ones.
import struct, UnityPy
GAME = r"D:\Games\Svarog's Dream\Svarog's Dream_Data"
env = UnityPy.load(GAME + r"\level1", GAME + r"\globalgamemanagers.assets", GAME + r"\sharedassets1.assets")
TARGET = {"NightVisionEnabler", "HelpingLightEnabler", "WorldTime", "PostProcessingManager", "NightLightsManager", "BuffsManager"}
level = [f for n, f in env.files.items() if n.endswith("level1")][0]

def script_name(mb):
    try:
        return mb.m_Script.read().m_ClassName
    except Exception as e:
        return None

def pptrs_after_name(raw, count=12):
    # MonoBehaviour base: PPtr GO(12) + m_Enabled(1, align 4) + PPtr Script(12) + m_Name(len+bytes, align 4)
    off = 12 + 4 + 12
    n = struct.unpack_from("<i", raw, off)[0]; off += 4 + n; off = (off + 3) & ~3
    out = []
    while off + 12 <= len(raw) and len(out) < count:
        fid, pid = struct.unpack_from("<iq", raw, off); out.append((fid, pid)); off += 12
    return out

def describe(fid, pid):
    if fid != 0:
        return "external(%d,%d)" % (fid, pid)
    o = level.objects.get(pid)
    if o is None:
        return "missing %d" % pid
    try:
        d = o.read()
        name = getattr(d, "m_Name", "") or ""
        if hasattr(d, "m_GameObject"):
            name = d.m_GameObject.read().m_Name + "/" + o.type.name
        return "%s %s" % (o.type.name, name)
    except Exception as e:
        return o.type.name

found = {}
for pid, obj in level.objects.items():
    if obj.type.name != "MonoBehaviour":
        continue
    mb = obj.read(check_read=False)
    sn = script_name(mb)
    if sn in TARGET:
        raw = obj.get_raw_data()
        go = mb.m_GameObject.read().m_Name
        print("==", sn, "on", go, "pid", pid)
        for fid, p in pptrs_after_name(raw, 8):
            print("   ", fid, p, describe(fid, p))
