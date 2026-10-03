# Read-only scan of Svarog's Dream main scene: lights, night-named objects, RenderSettings.
import sys, UnityPy
GAME = r"D:\Games\Svarog's Dream\Svarog's Dream_Data"
env = UnityPy.load(GAME + r"\level1")

def col(c):
    return "(%.3f, %.3f, %.3f, %.2f)" % (c.r, c.g, c.b, c.a) if c is not None else "-"

def goname(comp):
    try:
        return comp.m_GameObject.read().m_Name
    except Exception as e:
        return "?"

lights, nightgos, rs = [], [], []
for obj in env.objects:
    t = obj.type.name
    if t == "Light":
        d = obj.read()
        lights.append((goname(d), d.m_Type, col(d.m_Color), d.m_Intensity, getattr(d, "m_Range", None), getattr(d, "m_Enabled", None)))
    elif t == "GameObject":
        d = obj.read()
        n = d.m_Name
        if "night" in n.lower() or "vision" in n.lower() or "moon" in n.lower():
            comps = []
            for c in d.m_Component:
                try:
                    comps.append(c.component.read().object_reader.type.name)
                except Exception:
                    pass
            nightgos.append((n, d.m_IsActive, comps))
    elif t == "RenderSettings":
        rs.append(obj.read_typetree())

print("== RenderSettings")
for r in rs:
    for k in ("m_AmbientMode", "m_AmbientSkyColor", "m_AmbientEquatorColor", "m_AmbientGroundColor", "m_AmbientIntensity", "m_Fog", "m_FogColor", "m_FogMode", "m_FogDensity", "m_SkyboxMaterial", "m_Sun"):
        print(" ", k, r.get(k))
print("== Lights (%d)" % len(lights))
for l in lights:
    print(" ", l)
print("== night/vision/moon GameObjects (%d)" % len(nightgos))
for g in nightgos:
    print(" ", g)
