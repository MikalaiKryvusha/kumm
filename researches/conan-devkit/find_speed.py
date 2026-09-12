# Headless: where does Conan keep run speed? Movement component classes, speed-ish
# properties/functions on the character, float stat enums, and CDO defaults.
import unreal, json, os, traceback, re
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'find_speed.json')
res = {'movement_classes': {}, 'char_members': {}, 'enums': {}, 'cdo': {}, 'errors': []}
PAT = re.compile(r'speed|sprint|walk|run|jog|velocity|movement|encumb|agil|athlet', re.I)

def members(cls):
    out = {}
    for k, v in cls.__dict__.items():
        if k.startswith('_') or not PAT.search(k):
            continue
        doc = (getattr(v, '__doc__', '') or '')
        out[k] = doc.split('\n')[0][:200]
    return out

try:
    names = dir(unreal)
    for name in names:
        try:
            cls = getattr(unreal, name)
            if not isinstance(cls, type):
                continue
            if issubclass(cls, unreal.CharacterMovementComponent):
                res['movement_classes'][name] = {
                    'bases': [b.__name__ for b in cls.__mro__[1:4]],
                    'members': members(cls)}
            if name in ('ConanCharacter', 'StatHolder', 'ConanPlayerCharacter', 'BasePlayerChar'):
                res['char_members'][name] = members(cls)
            if issubclass(cls, unreal.EnumBase) and re.search(r'Stat|Speed|Movement', name):
                vals = {}
                for m in dir(cls):
                    if m.isupper():
                        try:
                            vals[m] = int(getattr(cls, m).value)
                        except Exception:
                            pass
                if vals and (len(vals) < 200):
                    res['enums'][name] = vals
        except Exception as e:
            res['errors'].append('%s: %r' % (name, e))
    # defaults of the player blueprint's movement component
    try:
        bp = unreal.load_class(None, '/Game/Characters/BasePlayerChar.BasePlayerChar_C')
        cdo = unreal.get_default_object(bp)
        res['cdo']['class'] = str(bp)
        mc = cdo.get_editor_property('character_movement')
        res['cdo']['movement_component'] = str(mc.get_class().get_name())
        for p in ('max_walk_speed', 'max_walk_speed_crouched', 'max_acceleration', 'jump_z_velocity',
                  'max_swim_speed', 'max_fly_speed', 'max_custom_movement_speed'):
            try:
                res['cdo'][p] = mc.get_editor_property(p)
            except Exception as e:
                res['cdo'][p] = repr(e)[:120]
        # every float property on the component whose name looks speed-ish
        extra = {}
        for k in dir(mc):
            if PAT.search(k) and not k.startswith('_'):
                try:
                    v = mc.get_editor_property(k)
                    if isinstance(v, (int, float, bool)):
                        extra[k] = v
                except Exception:
                    pass
        res['cdo']['speedish'] = extra
    except Exception:
        res['cdo']['trace'] = traceback.format_exc()[-800:]
except Exception:
    res['trace'] = traceback.format_exc()
res['errors'] = res['errors'][:20]
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(res, f, ensure_ascii=False, indent=1, default=str)
unreal.log('SPEED_DONE -> %s' % OUT)
