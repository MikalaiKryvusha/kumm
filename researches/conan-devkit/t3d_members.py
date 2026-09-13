"""List the variables and functions a blueprint graph references, from a UE T3D export.

usage: t3d_members.py <file.utf8.t3d> <GraphName> [<GraphName> ...]

Why (2026-09-13, idea 03): hooking Conan's ApplyNewMovementSpeed from UE4SS installs
and never fires. The working lever was the DATA the formula reads — the graph of
GetEncumbranceSpeedMultiplier names EncumbranceTier0..4SpeedMultiplier, and writing
those variables scales run speed exactly. This tool answers "what does function X
read?" in one command instead of an inline script.

Companion of t3d_trace.py (which follows pins backwards from a call site).
"""
import re
import sys

NODE = re.compile(r"Begin Object Name=\"([^\"]+)\" ExportPath=\"/Script/\w+\.(K2Node_\w+)'.*?:([^.']+)\.")
MEMBER = re.compile(r'(?:FunctionReference|VariableReference)=\(.*?MemberName="([^"]+)"')


def members(path: str) -> dict[str, dict[str, set[str]]]:
    graphs: dict[str, dict[str, set[str]]] = {}
    cur_graph, cur_cls = None, None
    with open(path, encoding="utf-8", errors="replace") as f:
        for line in f:
            s = line.strip()
            m = NODE.match(s)
            if m:
                cur_cls, cur_graph = m.group(2), m.group(3)
                continue
            mm = MEMBER.search(s)
            if mm and cur_graph:
                kind = "variables" if cur_cls.startswith("K2Node_Variable") else "calls"
                graphs.setdefault(cur_graph, {"variables": set(), "calls": set()})[kind].add(mm.group(1))
    return graphs


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    sys.stdout.reconfigure(encoding="utf-8")
    g = members(sys.argv[1])
    rc = 0
    for name in sys.argv[2:]:
        if name not in g:
            print(f"{name}: no such graph in the export")
            rc = 1
            continue
        print(f"{name}")
        print(f"  variables: {sorted(g[name]['variables'])}")
        print(f"  calls:     {sorted(g[name]['calls'])}")
    return rc


if __name__ == "__main__":
    sys.exit(main())
