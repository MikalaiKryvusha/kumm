# Headless smoke for the Conan Enhanced Dev Kit: read the XP curve data table
# and write it as JSON next to this script. [NOT-TESTED]
import unreal, json, os, traceback
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'xp_curve.json')
res = {'ok': False}
try:
    dt = unreal.load_asset('/Game/Systems/Progression/DT_ExperienceSystemLevel')
    res['asset'] = str(dt)
    lib = unreal.DataTableFunctionLibrary
    names = [str(n) for n in lib.get_data_table_row_names(dt)]
    res['rows'] = names
    cols = []
    try:
        cols = [str(c) for c in lib.get_data_table_column_names(dt)]
    except Exception as e:
        res['col_err'] = repr(e)
    res['columns'] = cols
    table = {}
    for c in cols:
        try:
            table[c] = [str(v) for v in lib.get_data_table_column_as_string(dt, c)]
        except Exception as e:
            table[c] = repr(e)
    res['table'] = table
    csv_path = OUT.replace('.json', '.csv')
    try:
        res['csv_export'] = bool(lib.export_data_table_to_csv(dt, csv_path))
    except Exception as e:
        res['csv_export'] = repr(e)
    res['ok'] = True
except Exception:
    res['trace'] = traceback.format_exc()
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(res, f, ensure_ascii=False, indent=1)
unreal.log('XP_DUMP_DONE ok=%s -> %s' % (res['ok'], OUT))
