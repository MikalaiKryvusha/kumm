# bp_export_combat.py - headless export of the hero parent blueprints to T3D (UTF-16).
# 2026-09-13: this export found why Conan resets JumpZVelocity (BaseBPCombat.TakeHealthDamage ->
# SigilLongJumpDisable writes a literal 420) and the fall damage chain (MinDamageVelocity /
# DeadlyFallVelocity). Run exactly like bp_speed.py (README section 7 command line); ~3.5 min.
# Convert to UTF-8 before t3d_trace.py / t3d_members.py.
# Headless: export the hero's parent blueprints to T3D (who writes JumpZVelocity, how fall damage is computed).
import unreal, json, os, traceback
HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(HERE, 'bp_export2')
os.makedirs(OUTDIR, exist_ok=True)
res = {'exports': {}, 'errors': []}

def export(asset, path):
    task = unreal.AssetExportTask()
    task.object = asset
    task.filename = path
    task.automated = True
    task.prompt = False
    task.replace_identical = True
    ok = unreal.Exporter.run_asset_export_task(task)
    return ok, [str(e) for e in (task.errors or [])]

for path in ['/Game/Characters/BaseBPCombat', '/Game/Characters/BaseBPChar']:
    try:
        bp = unreal.load_asset(path)
        if bp is None:
            res['errors'].append('no asset ' + path)
            continue
        name = path.split('/')[-1]
        out = os.path.join(OUTDIR, name + '.t3d')
        ok, errs = export(bp, out)
        info = {'ok': ok, 'errors': errs, 'size': os.path.getsize(out) if os.path.exists(out) else 0}
        try:
            gen = bp.generated_class()
            info['class'] = gen.get_path_name()
            info['super'] = unreal.SystemLibrary.get_path_name(gen.get_super_class()) if hasattr(gen, 'get_super_class') else '?'
        except Exception as e:
            info['class_err'] = repr(e)
        res['exports'][name] = info
    except Exception:
        res['errors'].append(traceback.format_exc())

with open(os.path.join(HERE, 'bp_combat_export.json'), 'w', encoding='utf-8') as f:
    json.dump(res, f, ensure_ascii=False, indent=1)
unreal.log('BP_COMBAT_EXPORT_DONE %s' % json.dumps({k: v.get('size') for k, v in res['exports'].items()}))
