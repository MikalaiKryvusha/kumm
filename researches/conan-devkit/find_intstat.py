# Headless: which reflected classes own GetIntStat & co, their signatures, and ECharIntStatID values.
import unreal, json, os, traceback
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'find_intstat.json')
KEYS = ('get_int_stat', 'set_int_stat', 'add_to_int_stat', 'get_total_int_stat_modification',
        'get_attribute_points_earned', 'add_undistributed_attribute_points')
res = {'owners': {}, 'enum': None, 'errors': []}
try:
    for name in dir(unreal):
        try:
            cls = getattr(unreal, name)
            if not isinstance(cls, type):
                continue
            own = {}
            for k in KEYS:
                if k in cls.__dict__:
                    own[k] = (getattr(cls, k).__doc__ or '')[:600]
            if own:
                bases = [b.__name__ for b in cls.__mro__[1:6]]
                res['owners'][name] = {'bases': bases, 'funcs': own}
        except Exception as e:
            res['errors'].append('%s: %r' % (name, e))
    for en in ('CharIntStatID', 'ECharIntStatID'):
        e = getattr(unreal, en, None)
        if e is not None:
            vals = {}
            for m in dir(e):
                if m.isupper() or m.startswith('ATTRIBUTE'):
                    try:
                        vals[m] = int(getattr(e, m).value)
                    except Exception as ex:
                        vals[m] = repr(ex)
            res['enum'] = {'name': en, 'values': vals}
            break
except Exception:
    res['trace'] = traceback.format_exc()
res['errors'] = res['errors'][:30]
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(res, f, ensure_ascii=False, indent=1)
unreal.log('INTSTAT_DONE owners=%d -> %s' % (len(res['owners']), OUT))
