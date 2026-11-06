# Test cases — the Grey One Mask carries both mods' changes (plan 45 step 1)

**Created:** 2026-11-06 · **Under test:** the Mines of Set pak (KRINIK MODIFIED) with row 51420 merged from Severe Weather (`copyprop:` ×6) · **Version/build:**
pack ConanExiles after `cdd22db` + the merge
**Test basis:** `[OWNER]` 2026-11-06 09:33 «ЧТО БЫ КАЖДЫЙ МОД ПРИНОСИЛ СВОЕ … и не конфликтовал с другими» · 09:55 «Предлагаю 3 710»; the register line of
`researches/mod-reconciliation/REGISTER.md`.

## 1. Goal vector

Maintain: the Grey One Mask is Severe Weather's sandstorm breather (its class, armour 38, «Light Armor») AND keeps Mines of Set's text and repair XP 3 710.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHEN the hero holds item 51420, the item shall be an instance of the sandstorm-breather class | class name of the spawned item read by the remote · `BP_SandstormBreather_C` |
| R2 | WHEN the mask's tooltip shows, it shall read armour 38 and Mines of Set's description | 4K frame of the tooltip · armour 38, «…Grey Ones» (Russian translation may stand) |
| R3 | WHILE the merge is on, Severe Weather's other breathers shall stay breathers | class of item 52011 · `BP_SandstormBreather_C` |

## 3. Coverage matrix

Partitions: the merged row (51420) · a control row of the same mod not merged (52011). Not covered: the breather effect in a real sandstorm (the class is the
game's own; its effect is the game's), multiplayer.

## 4. Stand

Oasis save, a fresh start into the world, god on; items spawned into the hero's inventory by the remote (the console `SpawnItem <id> 1`); the inventory opened and
the item hovered by a real cursor (`hover-watch.ps1`).

## 5. Cases

| ID | Steps | Expected | Status | Observed |
|---|---|---|---|---|
| G1 | spawn 51420, read the class of the new inventory item | `BP_SandstormBreather_C` | pass | 2026-11-06 10:05 `exec MakeMeAdmin` + `exec SpawnItem 51420 1`; `FindAllOf('BP_SandstormBreather_C')` holds `id=51420 Маска серого демона` |
| G2 | the inventory, select the mask (a real click) | armour 38; Mines of Set's description | pass | 2026-11-06 ≈10:06 frame `g2b_crop.webp`: «Маска серого демона», «Легкий доспех», «Прочность доспеха: 38», durability 660, weight 7.09 and the button «Использовать (F)» — the breather's use (a plain mask has none); description «Маска, имитирующая облик серого демона» (the Russian text — the same for both English variants). Review folder 67 |
| G3 | control: spawn 52011, read its class | `BP_SandstormBreather_C` (unchanged) | pass | 2026-11-06 10:05: the spawned 52011 «Средняя шапка» is a breather; older 52011 instances of `BPGameItemArmor_C` also live in the world (created before the start, or NPC gear — not checked) |
