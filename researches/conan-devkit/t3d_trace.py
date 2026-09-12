"""Trace blueprint data flow in a UE T3D export.

usage: t3d_trace.py <file.utf8.t3d> <FunctionName> [depth]
For every node calling <FunctionName>, print the expression tree feeding its
non-exec input pins (following LinkedTo backwards).
"""
import re, sys

path, target = sys.argv[1], sys.argv[2]
DEPTH = int(sys.argv[3]) if len(sys.argv) > 3 else 10

nodes = {}   # name -> dict(cls, member, graph, pins: {pinid: pin})
cur = None
graph = None
for line in open(path, encoding='utf-8'):
    s = line.strip()
    m = re.match(r'Begin Object Class=/Script/Engine\.EdGraph Name="([^"]+)"', s)
    if m:
        graph = m.group(1)
        continue
    m = re.match(r'Begin Object Name="([^"]+)" ExportPath="/Script/\w+\.(K2Node_\w+)\'.*?:([^.\']+)\.', s)
    if m:
        cur = {'name': m.group(1), 'cls': m.group(2), 'graph': m.group(3), 'member': '', 'extra': '', 'pins': {}}
        nodes[m.group(1)] = cur
        continue
    if cur is None:
        continue
    if s == 'End Object':
        cur = None
        continue
    m = re.search(r'(?:FunctionReference|VariableReference|EventReference)=\((.*)\)$', s)
    if m:
        mm = re.search(r'MemberName="([^"]+)"', m.group(1))
        mp = re.search(r"MemberParent=\"?[^\"]*?'[^']*?\.(\w+)'", m.group(1))
        cur['member'] = (mp.group(1) + '::' if mp else '') + (mm.group(1) if mm else '?')
        continue
    for key in ('InputActionName', 'CustomFunctionName', 'StructType', 'Enum', 'IndexPinType'):
        if s.startswith(key + '='):
            cur['extra'] += s + ' '
    if s.startswith('CustomProperties Pin ('):
        mid = re.search(r'PinId=(\w+)', s)
        mnm = re.search(r'PinName="([^"]*)"', s)
        if not (mid and mnm):
            continue
        pid, name = mid.group(1), mnm.group(1)
        out = 'Direction="EGPD_Output"' in s
        cat = (re.search(r'PinType\.PinCategory="(\w*)"', s) or [None, ''])[1]
        dv = re.search(r'DefaultValue="([^"]*)"', s)
        links = []
        lk = re.search(r'LinkedTo=\(([^)]*)\)', s)
        if lk:
            for part in lk.group(1).split(','):
                part = part.strip()
                if part:
                    n, p = part.split(' ')
                    links.append((n, p))
        cur['pins'][pid] = {'name': name, 'out': out, 'cat': cat, 'default': dv.group(1) if dv else '', 'links': links}

def label(n):
    base = n['member'] or n['cls'].replace('K2Node_', '')
    if n['cls'] == 'K2Node_VariableGet':
        return 'get ' + base
    if n['cls'] == 'K2Node_VariableSet':
        return 'SET ' + base
    return base + (' [' + n['extra'].strip() + ']' if n['extra'] else '')

def expr(node_name, out_pin_id, depth, seen):
    n = nodes.get(node_name)
    if not n:
        return '<?' + node_name + '>'
    pin = n['pins'].get(out_pin_id, {'name': '?'})
    head = label(n) + ('.' + pin['name'] if pin['name'] not in ('ReturnValue', '', n['member']) else '')
    if depth <= 0 or node_name in seen:
        return head + '…'
    args = []
    for pid, p in n['pins'].items():
        if p['out'] or p['cat'] == 'exec' or p['name'] in ('self', 'WorldContextObject'):
            continue
        if p['links']:
            ln, lp = p['links'][0]
            args.append(p['name'] + '=' + expr(ln, lp, depth - 1, seen | {node_name}))
        elif p['default'] not in ('', 'None'):
            args.append(p['name'] + '=' + p['default'])
    return head + ('(' + ', '.join(args) + ')' if args else '')

hits = [n for n in nodes.values() if n['member'].split('::')[-1] == target]
print('nodes parsed:', len(nodes), '· calls of', target + ':', len(hits))
for n in hits:
    print('\n=== graph', n['graph'], '·', n['name'])
    for pid, p in n['pins'].items():
        if p['out'] or p['cat'] == 'exec' or p['name'] == 'self':
            continue
        if p['links']:
            ln, lp = p['links'][0]
            print('  ', p['name'], '=', expr(ln, lp, DEPTH, set()))
        else:
            print('  ', p['name'], '= default', p['default'])
