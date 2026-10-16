# Count used pickup slots in a GTA SA 1.0 savegame (read-only).
# The save is a chain of blocks, each starting with b'BLOCK'. The pickups block holds the whole CPickups::aPickUps array:
# 620 entries x 0x20 bytes, the pickup type byte at +0x1C (0 = PICKUP_NONE), then the "collected" table.
# usage: python -I sa_pickups_in_save.py <GTASAsfN.b>
import sys
from collections import Counter

NUM, SIZE, TYPE_OFF = 620, 0x20, 0x1C
NAMES = {0: 'NONE', 1: 'IN_SHOP', 2: 'ON_STREET', 3: 'ONCE', 4: 'ONCE_TIMEOUT', 5: 'ONCE_TIMEOUT_SLOW', 6: 'COLLECTABLE1',
         7: 'IN_SHOP_OUT_OF_STOCK', 8: 'MONEY', 9: 'MINE_INACTIVE', 10: 'MINE_ARMED', 11: 'NAUTICAL_MINE_INACTIVE',
         12: 'NAUTICAL_MINE_ARMED', 13: 'FLOATINGPACKAGE', 14: 'FLOATINGPACKAGE_FLOATING', 15: 'ON_STREET_SLOW',
         16: 'ASSET_REVENUE', 17: 'PROPERTY_LOCKED', 18: 'PROPERTY_FORSALE', 19: 'MONEY_DOESNTDISAPPEAR',
         20: 'SNAPSHOT', 21: 'SECOND_PLAYER', 22: 'ONCE_FOR_MISSION'}

data = open(sys.argv[1], 'rb').read()
starts = []
i = data.find(b'BLOCK')
while i >= 0:
    starts.append(i)
    i = data.find(b'BLOCK', i + 5)
blocks = [(s, (starts[k + 1] if k + 1 < len(starts) else len(data)) - s - 5) for k, s in enumerate(starts)]
print('blocks:', len(blocks), 'sizes:', [b[1] for b in blocks])
cand = [k for k, (s, n) in enumerate(blocks) if NUM * SIZE <= n <= NUM * SIZE + 200]
print('pickup block candidates (index):', cand)
for k in cand:
    s, n = blocks[k]
    body = data[s + 5:s + 5 + n]
    types = Counter(body[j * SIZE + TYPE_OFF] for j in range(NUM))
    used = NUM - types.get(0, 0)
    print('block %d: used %d of %d, free %d' % (k, used, NUM, types.get(0, 0)))
    for t, c in sorted(types.items()):
        print('   type %2d %-24s %d' % (t, NAMES.get(t, '?'), c))
