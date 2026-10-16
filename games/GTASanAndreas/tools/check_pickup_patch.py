# Read-only check of a RUNNING gta_sa.exe (1.0 US) for bug 52: is PickupOldestFirst in place, are the pickup timers 10 min?
# Reads process memory only (PROCESS_VM_READ), writes nothing. Cases C4, C5 of testcases/TC_gtasa_pickup_oldest_first_2026-10-16.md.
# usage: python -I check_pickup_patch.py
import ctypes, struct, sys
from ctypes import wintypes as wt

k32 = ctypes.WinDLL('kernel32', use_last_error=True)
psapi = ctypes.WinDLL('psapi', use_last_error=True)
PROCESS_QUERY_INFORMATION, PROCESS_VM_READ = 0x0400, 0x0010

def find_pid(name):
    arr = (wt.DWORD * 4096)()
    needed = wt.DWORD()
    psapi.EnumProcesses(arr, ctypes.sizeof(arr), ctypes.byref(needed))
    for pid in arr[:needed.value // 4]:
        h = k32.OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, False, pid)
        if not h:
            continue
        buf = ctypes.create_unicode_buffer(260)
        psapi.GetModuleBaseNameW(h, None, buf, 260)
        k32.CloseHandle(h)
        if buf.value.lower() == name:
            return pid
    return None

def read(h, addr, n):
    buf = ctypes.create_string_buffer(n)
    got = ctypes.c_size_t()
    if not k32.ReadProcessMemory(h, ctypes.c_void_p(addr), buf, n, ctypes.byref(got)) or got.value != n:
        raise OSError('ReadProcessMemory failed at 0x%08X' % addr)
    return buf.raw

def module_of(h, addr):
    mods = (wt.HMODULE * 1024)()
    needed = wt.DWORD()
    psapi.EnumProcessModules(h, mods, ctypes.sizeof(mods), ctypes.byref(needed))
    class MI(ctypes.Structure):
        _fields_ = [('base', ctypes.c_void_p), ('size', wt.DWORD), ('entry', ctypes.c_void_p)]
    for m in mods[:needed.value // ctypes.sizeof(wt.HMODULE)]:
        mi = MI()
        psapi.GetModuleInformation(h, m, ctypes.byref(mi), ctypes.sizeof(mi))
        base = mi.base or 0
        if base <= addr < base + mi.size:
            name = ctypes.create_unicode_buffer(260)
            psapi.GetModuleBaseNameW(h, m, name, 260)
            return name.value
    return None

pid = find_pid('gta_sa.exe')
if pid is None:
    sys.exit('NOT READ: gta_sa.exe is not running')
h = k32.OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, False, pid)
code = read(h, 0x457000, 7)
print('0x457000:', code.hex(' '))
if code == bytes.fromhex('33dbb8fc889700'):
    print('C4: original bytes - PickupOldestFirst NOT in place')
elif code[0] == 0xE9:
    target = (0x457000 + 5 + struct.unpack('<i', code[1:5])[0]) & 0xFFFFFFFF
    print('C4: jmp -> 0x%08X in module %s' % (target, module_of(h, target)))
else:
    print('C4: other bytes - another hook?')
for addr, key in ((0x457236, 'TimePickupShort'), (0x457243, 'TimePickupLong'), (0x457250, 'TimePickupMoney')):
    print('C5: 0x%06X %-16s = %d' % (addr, key, struct.unpack('<i', read(h, addr, 4))[0]))
k32.CloseHandle(h)
