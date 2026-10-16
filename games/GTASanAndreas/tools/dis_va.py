# Disassemble a function of gta_sa.exe 1.0 US by its virtual address (PE sections map VA -> file offset).
# usage: python -I dis_gen.py <gta_sa.exe> <hex VA> <byte count> <pylib dir>
import sys, struct
exe, va_s, n_s, pylib = sys.argv[1:5]
sys.path.insert(0, pylib)
import capstone

va, n = int(va_s, 16), int(n_s)
data = open(exe, 'rb').read()
pe = struct.unpack_from('<I', data, 0x3C)[0]
nsec = struct.unpack_from('<H', data, pe + 6)[0]
optsz = struct.unpack_from('<H', data, pe + 20)[0]
base = struct.unpack_from('<I', data, pe + 24 + 28)[0]
sec = pe + 24 + optsz
off = None
for i in range(nsec):
    s = sec + i * 40
    vsz, vaddr, rsz, raw = struct.unpack_from('<IIII', data, s + 8)
    if base + vaddr <= va < base + vaddr + max(vsz, rsz):
        off = raw + (va - base - vaddr)
        break
if off is None:
    sys.exit('VA not in any section')
md = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_32)
for ins in md.disasm(data[off:off + n], va):
    print('%08x  %-8s %s' % (ins.address, ins.mnemonic, ins.op_str))
