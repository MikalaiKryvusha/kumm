# Headless: export the player blueprint chain to T3D text and find who touches speed/jump.
import unreal, json, os, re, traceback
HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(HERE, 'bp_export')
os.makedirs(OUTDIR, exist_ok=True)
KEYS = ['RunSpeed', 'WalkSpeed', 'JumpZVelocity', 'MaxWalkSpeed', 'UpdateMaxMovementSpeed',
        'MovementSpeedOverride', 'ApplyNewMovementSpeed', 'GetMovementSpeed', 'SpeedMultiplier',
        'MovementSpeed', 'Encumbr', 'Hunger', 'Thirst', 'Sprint']
res = {'chain': [], 'exports': {}, 'hits': {}, 'errors': []}

def export(asset, path):
    task = unreal.AssetExportTask()
    task.object = asset
    task.filename = path
    task.automated = True
    task.prompt = False
    task.replace_identical = True
    ok = unreal.Exporter.run_asset_export_task(task)
    return ok, [str(e) for e in (task.errors or [])]

try:
    path = '/Game/Characters/BasePlayerChar'
    seen = 0
    while path and seen < 6:
        seen += 1
        bp = unreal.load_asset(path)
        if bp is None:
            res['errors'].append('no asset ' + path); break
        name = path.split('/')[-1]
        res['chain'].append(path)
        out = os.path.join(OUTDIR, name + '.t3d')
        ok, errs = export(bp, out)
        res['exports'][name] = {'ok': ok, 'errors': errs, 'size': os.path.getsize(out) if os.path.exists(out) else 0}
        if os.path.exists(out):
            txt = open(out, encoding='utf-8', errors='replace').read()
            h = {}
            for k in KEYS:
                lines = [l.strip()[:220] for l in txt.splitlines() if k in l]
                if lines:
                    h[k] = {'count': len(lines), 'sample': lines[:8]}
            res['hits'][name] = h
        # parent blueprint?
        parent = None
        try:
            gen = bp.generated_class()
            sup = unreal.SystemLibrary.get_class_display_name(gen)
            pc = bp.get_editor_property('parent_class')
            ppath = pc.get_path_name()
            res.setdefault('parents', []).append(ppath)
            if ppath.startswith('/Game/'):
                parent = ppath.split('.')[0]
        except Exception as e:
            res['errors'].append('parent %s: %r' % (path, e))
        path = parent
except Exception:
    res['trace'] = traceback.format_exc()
with open(os.path.join(HERE, 'bp_speed.json'), 'w', encoding='utf-8') as f:
    json.dump(res, f, ensure_ascii=False, indent=1)
unreal.log('BP_SPEED_DONE chain=%s' % res['chain'])
