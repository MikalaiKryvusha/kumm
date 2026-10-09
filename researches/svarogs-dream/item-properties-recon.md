# Recon — Svarog's Dream: item properties shown in the item window

> **Created:** 2026-10-09 · **Parent:** owner's word 2026-10-09 (second «?» in the inventory — items and the properties they can have) · **Status:** recon done · **Outbound:** help popup «Свойства предметов»
>
> Source: the decompiled game code (ilspycmd of `Assembly-CSharp.dll`) in the session scratchpad `acs/`; every `File.cs:N` is a
> line that was read. Item data (which items carry which property, the free-text effect lines) comes from a read-only dump of all
> 721 `ItemObject` assets made by `SvarogsDream/tools/items_stats_extract.py` (sister of `items_extract.py`, written for this recon);
> counts below are from that dump, called **[dump]**. Russian labels are what XUnity shows: `SvarogsDream/_config/xunity/*.txt`
> (file:line) and the glossary `SvarogsDream/translation/glossary.tsv` (line). The general stat mechanics (armor curve, attack speed,
> camouflage cones, crit roll) are in `inventory-stats-mechanics.md` and are only referenced here. Nothing was checked in a running
> game. **inferred** marks anything not read directly.

## 1. How the window builds its property lines

- `GameUI/ItemToolTip.cs:119-404` `SetToolTipTexts`. Name, price and weight are separate fields (`:148-156`); weight is shown
  already reduced by quality (`:155`). Then a list of property lines is built in a fixed order (`:157-313`) and poured into the
  `Stats[]` text slots (`:318-370`). The code default is 6 slots (`:74`); the prefab may override it (**inferred**). Lines past the
  last slot are not shown.
- Two kinds of line:
  - **numeric** ("label: value"): black text; when you hover with an item of the same slot equipped, the difference is shown
    green `(+N)` or red `(-N)` (`:339-361`). Percent lines multiply by 100 where the field is a multiplier (`:344`).
  - **bonus text** (`isBonusText`): a whole sentence in **blue**, or **bright red if the item's origin is Cursed** (`:326-337`).
    Never compared.
- Every numeric line appears only when the value is non-zero (or ≠ 1 for the two multipliers), so an item shows only the
  properties it has.
- After the lines: the quality name in its colour (`:262-286`), the description in quotes (`:371-382`), the origin name and the
  origin description (`:383-385`).

## 2. Numeric property lines (all of them; there are no others)

`q` = item quality 0–12. "Path" = which equip routine applies the field: **W** = weapon path `EquipmentHandler.cs:832-877`
(weapons, bows, spellbooks, torches, off-hand weapons), **A** = armor path `EquipmentHandler.cs:929-973` (armor, helmets, boots,
gloves, rings/jewelry, bags, shields). A field that the path does not apply has no effect from that slot (§6).

| # | English label (exact) | Field (`ItemStats.cs`) | Russian label seen | What it does | Quality |
|---|---|---|---|---|---|
| 1 | `Blunt Damage: x{v}` | `bluntDamage` :18 | «Дробящий Урон: x…» (zz_glossary.txt:749) | Weapon multiplier: your blunt hit = `W × (2·Blunt mastery + 0.5·Strength + buffs)` (`PlayerStats.cs:1530`). Path W (`EquipmentHandler.cs:834`). | +5%/step, +2.5% if the weapon has 2+ damage types (`ItemStats.cs:74-81`, `:146-166`) |
| 2 | `Slashing Damage: x{v}` | `slashingDamage` :20 | «Режущий Урон: x…» (zz_glossary.txt:785) | Same, with Slashing mastery and 0.5·Strength (`PlayerStats.cs:1531`). | same (`ItemStats.cs:92-99`) |
| 3 | `Piercing Damage: x{v}` | `piercingDamage` :22 | «Колющий Урон: x…» (zz_glossary.txt:778) | Same, with 3·Piercing mastery + 1·Dexterity (`PlayerStats.cs:1532`). | same (`ItemStats.cs:101-108`) |
| 4 | `Magic Damage: x{v}` | `magicDamage` :24 | «Магический Урон: x…» (zz_glossary.txt:771) | Same, with 3·Magic mastery + Intelligence (`PlayerStats.cs:1533`). | same (`ItemStats.cs:110-117`) |
| 5 | `Range: {v}` | `range` :28 | «Дальность: …» (zz_glossary.txt:780) | Added to attack reach `2 + weapon range + buffs` (`PlayerStats.cs:1833`); off-hand range kept separately, dual wield uses the shorter (`EquipmentHandler.cs:841-849`, `PlayerStats.cs:1829-1832`). | none |
| 6–9 | `Blunt Armor: {v}` / `Slashing Armor:` / `Piercing Armor:` / `Magic Armor:` | `BonusBluntArmor` … `BonusMagicArmor` :40-46 | «Защита от Дробящего / Режущего / Колющего / Магии: …» (zz_glossary.txt:747, :783, :776, :769) | Raw armor added to the matching type (`EquipmentHandler.cs:931-934`); cuts only damage of that type, diminishing curve, cap 90% at 460 (`CharacterStats.cs:450-470`, `:1299`, `:1326`, `:1339`, `:1374`). Path A only. | `+5%·q + q` (`ItemStats.cs:194-228`) |
| 10 | `Attack Speed: {v×100}%` | `AttackSpeedMultiplier` :33 (default 1) | «Скорость Атаки: …%» (zz_glossary.txt:741) | Adds `(v − 1)` to the equipped multiplier (`EquipmentHandler.cs:838`, `:938`); final speed `0.5 + Dex/50 + that + buffs`, one auto-attack per `2/speed` s (`PlayerStats.cs:1790`). So "120%" adds +0.2 to the speed number, not +20% of it. Both paths. Below 100% slows you (shields, heavy armor **[dump]**). | none |
| 11 | `CLD Reduction: {v}%` | `CooldownReduction` :35 | «Перезарядка: …%» (zz_glossary.txt:751, zz_krinik.txt:147) | Sums into `PlayerStats.CooldownReduction` (`EquipmentHandler.cs:856`, `:947`); every skill with a side (all four sides of `SpellSide`, Order and Chaos among them) has its cooldown cut by that % (`SpellInfo.cs:100-103`; `SpellSide.cs:1-7`). No clamp in those lines. | `+q/2` (`ItemStats.cs:137-144`) |
| 12 | `Movement Speed: {v×100}%` | `MovementSpeedMultiplier` :38 (default 1) | «Скорость: …%» (zz_glossary.txt:774) | Adds `(v − 1)` to the armor speed multiplier (`EquipmentHandler.cs:839`, `:939`); run speed `9 × multiplier + buffs` (`PlayerStats.cs:1720`, `:1731`). Both paths. | none |
| 13 | `Block Chance: {v}%` | `blockChance` :30 | «Шанс Блока: …%» (zz_glossary.txt:745) | Sums into block (`EquipmentHandler.cs:935`); a block cancels the whole non-spell hit (`CharacterStats.cs:1243-1258`, `:2484-2491`). Path A only; carried by 22 shields and Giant-made Armor **[dump]**. | `+q` (`ItemStats.cs:128-135`) |
| 14 | `Bonus HP: {v}` | `BonusHealth` :48 | «Здоровье: …» (zz_krinik.txt:145) | Added to max health (`EquipmentHandler.cs:840`, `:936`; `PlayerStats.cs:1490`); equipping also adds it to current health (`EquipmentHandler.cs:937`). | `+5·q + 5%·q`, and **+100 extra at quality 8 only** (`ItemStats.cs:168-179`) |
| 15 | `Bonus MP: {v}` | `BonusMana` :50 | «Мана: …» (zz_krinik.txt:146) | Added to max mana (`EquipmentHandler.cs:854`, `:944`; `PlayerStats.cs:226`). Negative values exist (Giant-made Helmet −70 **[dump]**). | same formula, same +100 at q 8 (`ItemStats.cs:181-192`) |
| 16 | `Dexterity: {v}` | `BonusAgility` :54 | «Ловкость: …» (zz_glossary.txt:758) | `AgilityBuff` (`EquipmentHandler.cs:857`, `:948`): +attack speed (Dex/50, `PlayerStats.cs:1790`) and +1 piercing per point (`:1532`). | none |
| 17 | `Strength: {v}` | `BonusStrength` :56 | «Сила: …» (zz_glossary.txt:788) | `StrengthBuff` (`EquipmentHandler.cs:858`, `:949`): +10 max health (`PlayerStats.cs:1490`), +0.5 blunt/slashing (`:1530-1531`), +2 carry weight (`:155`) per point. | none |
| 18 | `Intelligence: {v}` | `BonusIntelligence` :58 | «Интеллект: …» (zz_glossary.txt:767) | `InteligenceBuff` (`EquipmentHandler.cs:859`, `:950`): +12 max mana (`PlayerStats.cs:226`), +1 magic per point (`:1533`). | none |
| 19 | `Camouflage: {v}` | `Camouflage` :52 | «Камуфляж: …» (zz_glossary.txt:752) | `EquipedArmorCamouflage` (`EquipmentHandler.cs:946`); narrows enemy sight cone and theft-catch cones (`AIDecisionMaker.cs:234`, `CrimeManager.cs:720-760`). Negative on most metal armor **[dump]** (114 items have a negative field). Path A only. | none |
| 20 | `Critical Chance: {v}%` (bonus-text line, blue) | `criticalChance` :26 | «Критический Удар: …%» (zz_glossary.txt:754) | `BonusCriticalChance` (`EquipmentHandler.cs:860`): chance that your hit deals ×2 (`PlayerStats.cs:1557-1564`, `CharacterStats.cs:1497-1499`). Path W only; all 15 crit items are weapons **[dump]**. | `+2·q` (`ItemStats.cs:119-126`) |

Notes on the table:
- Attributes show the raw field, never scaled by quality (`ItemToolTip.cs:238-249`).
- The crit line passes the **main** item's quality for the compared item too (`ItemToolTip.cs:260`). Harmless, since bonus-text
  lines are not compared (`:326`).

## 3. Consumable lines (food, potions, essences)

| English line (exact) | Field | Russian | What it does |
|---|---|---|---|
| `Heals {v}% max hunger.` | `HungerHealValue` :61 | «Утоляет {v}% Голода.» (zz_krinik.txt:231) | `HealHunger` (`ConsumeManager.cs:403-406`). |
| `Heals {v}% max health.` | `HealthHealValue` :63 | «Восстанавливает {v}% Запаса Здоровья.» (zz_krinik.txt:229) | `HealPercentageOfHealth` (`ConsumeManager.cs:407-410`). |
| `Gain {v} experience.` | `SoulXPValue` :69 | **no translation found** in `_config/xunity` (grep); listed in `translation/untranslated.txt:2345` | Adds soul experience to your dominating side, Order or Chaos (`ConsumeManager.cs:420-422`). 5 items: soul essences, Witch Apple, Dream Flower **[dump]**. |
| `Restore {v}% of max morale.` | `MoraleHealValue` :65 | «Восстанавливает {v}% Морали.» (zz_krinik.txt:232) | `HealPercentageOfBravery` (`ConsumeManager.cs:416-418`). |
| `Restore {v}% of mana/energy.` | `ManaHealValue` :67 | «Восстанавливает {v}% Маны и Энергии.» (zz_krinik.txt:234) | Restores both mana and energy by that % (`ConsumeManager.cs:411-414`). |
| `Over a period of 10 seconds.` | (shown for Food/RawFood not of origin Consumable, `ItemToolTip.cs:250-253`) | **no translation found** (grep) | Food heals in 10 one-second ticks (`ConsumeManager.cs:255-259`); Quick Eater talent makes it instant (`:248-252`); Missing Teeth halves it (`:242-247`). Potions and Consumable-origin food apply at once (`ConsumeManager.cs:54-58`, `:383-398`). |

## 4. The free-text effect line (`CustomEffect`) and what really powers it

`CustomEffect` (`ItemStats.cs:72`) is **only a string**; the tooltip prints it as a blue (or red, Cursed) line
(`ItemToolTip.cs:292-295`). No code reads it for mechanics. The effect itself lives in an enum field of `ItemObject`
(`ItemObject.cs:22-32`), applied by the slot:

| Carrier field | Applied by | Who has it | Examples **[dump]** (CustomEffect text) |
|---|---|---|---|
| `enchantmentElement` (`Element.cs`, 70 values) | main hand → `element1`, off-hand/shield → `element2` (`EquipmentHandler.cs:861-868`, `:266`; `BuffsManager.cs:507-515`); checked with `IsElementActive` = either hand (`BuffsManager.cs:498-505`) | weapons, bows, spellbooks, torches, shields | "Weapon mastery EXP: +25%" (Element.Student → mastery XP ×1.25, `PlayerStats.cs:1182-1185`); Sword of Knowledge "+200%" (SvetovidStudent ×3, `:1186-1189`); "Order/Chaos Experience: +10%" (+10% of base XP to that side, `PlayerStats.cs:634-642`); "Night creatures damage: +50%" (Silver ×1.5 vs beasts, `CharacterStats.cs:1465-1468`); "Damage to animals: +25%" (`:1477-1480`); "Stun chance: 10%" (Bash/Earth, `:1519`); "Lightning chance: +10%" (`:1563`); "Frost: +20%" (`:1568`); "Ignite: +10%" (non-spell hits, `:1575`); "Lifesteal: 10%" (heals 10% of damage dealt, 2% Afflicted, 1% reduced, `:1763-1776`) |
| `spellBuff` (`SpellBuff.cs`) | ring slot 1 / 2 → `ringSpellBuff1/2` (`EquipmentHandler.cs:955-962`); `IsBuffActive` = either ring (`BuffsManager.cs:489-496`) | 66 items: 58 Rings of Power, 7 Named rings, Fin Flies | "Ring of Lifesteal: 7% if no lifesteal weapon" (`CharacterStats.cs:1778-1790`); "Mana regen: +40%" (`PlayerStats.cs:1941`); mostly "<Class>: <skill> now …" upgrades |
| `helmetModifier` (`HelmetBuff.cs`) | `BuffsManager.helmetBuff` (`EquipmentHandler.cs:921-927`) | 10 hats/masks | "+2 to all Flamekeeper active skills" (`SpellInfo.cs:230`); Demon/Oak Mask 5% XP conversion (`PlayerStats.cs:675-684`); Antlered Mask +10% damage (`CharacterStats.cs:1430-1433`); Zagriv Helmet "hunted by every beast" (`AIAnimal.cs:858`) |
| `movementModifier` (`MovementModifier.cs`) | boots only (`EquipmentHandler.cs:951-954`) | 23 boots | no CustomEffect; the window adds "Bonus speed on grass / in water / on roads / indoors." (`ItemToolTip.cs:296-313`; RU «Быстрее на траве / в воде / на дорогах / в помещениях.», zz_krinik_terms.txt:256-259). It gives **+1 speed** while you stand on that terrain (`AnimationFootstepSounds.cs:256-259`). |
| `bagType` (`EquipedBag.cs`) | `BuffsManager.equipedBag` and bag inventory (`EquipmentHandler.cs:963-966`, `:207-214`) | 11 bags | weight rules per bag, e.g. Cursed Bag: cursed items ×0.1, others ×1.2 (`InventoryObject.cs:227-229`) |
| `animalForm` | necklace slot → `SetSelectedAnimal` (`EquipmentHandler.cs:216-220`) | 17 necklaces | no stats at all; selects your animal form (**inferred** from the method name) |

253 of 721 items carry a CustomEffect **[dump]**. Families: weapon enchantments (XP, slayer, stun/ignite/frost/lightning,
lifesteal), class-skill ring upgrades, hat skill bonuses, bag weight rules, consumable descriptions, and curse trade-offs (§7).

## 5. What does NOT exist as an item property

- **Stamina / Endurance**: no item field (`ItemStats.cs:5-72`). `ItemAttribute.Attributes` {Damage, Intellect, Stamina, Strength}
  (`ItemAttribute.cs:6-12`) is declared but never referenced elsewhere (grep).
- **Resistances** (crowd-control, elemental, poison), **health/mana regeneration**, **crit damage**, **armor penetration**: no
  numeric item field. Lifesteal, regen and resist effects come only as CustomEffect text backed by an element/ring/helmet enum
  (§4).
- **"Weapon Mastery Experience: +25%"**: not a property line; it is the CustomEffect "Weapon mastery EXP: +25%" of training items
  (Wooden Stick, Wooden Sword, Practice Bow, Student Spellbook **[dump]**), RU «Опыт Мастерства Оружия: +25%» (zz_krinik.txt:117).

## 6. Slot rules that change what a line means (code reading)

- Weapon path (`EquipmentHandler.cs:832-877`) applies damage, range, attack/move speed, HP, MP, CDR, attributes, crit; **not**
  armor, block, camouflage.
- Armor path (`EquipmentHandler.cs:929-973`) applies armor, block, HP, attack/move speed, MP, camouflage, CDR, attributes; **not**
  crit or damage.
- The data matches: no weapon has armor, block or camouflage, and no armor-path item has crit **[dump]**. So every line in the
  window does work for that item's slot.
- Necklaces apply **no** numeric stats (`EquipmentHandler.cs:216-220`); none have any **[dump]**.
- Numeric stats from two identical plain rings (origin Jewelry: Ruby Ring +100 HP, Diamond Ring +150 MP, Ring of Wind 110% attack
  speed, Shadow Ring +20 camouflage **[dump]**) add up, since each ring slot runs the armor path once (`EquipmentHandler.cs:199`).
  Ring **effects** (`spellBuff`) do not (§8).

## 7. Quality

- Field: `InventorySlot.quality`, passed to every getter as `itemQuality` (`ItemToolTip.cs:119`). Names: 0 Terrible, 1 Rusty,
  2 Poor, 3 Passable, 4 Solid, 5 Excellent, 6 Outstanding, 7 Magnificent, 8 Mythical, 9 Utopian, 10 Divine, 11 Primordial,
  12 Absolute (`ItemStats.cs:457-476`). RU: «Ужасное / Ржавое / Плохое / Сносное / Добротное / Отличное / Выдающееся /
  Великолепное / Мифическое / Совершенное Качество (N)», «Божественное / Первородное / Абсолютное (N)» (zz_items.txt:989, :893,
  :810, :793, :938, :526, :787, :709, :757, :1028, :493, :814, :299).
- Per step: damage +5% (+2.5% multi-type), weight −5% (`ItemStats.cs:83-90`), armor +5% +1, HP/MP +5 +5% (+100 at 8), crit +2,
  block +1, CDR +1 per 2 steps; price grows too (`ItemStats.cs:654-728`). Attack speed, move speed, range, camouflage and
  attributes do not scale.
- Hidden (no quality line) for food, coins, trophies, jewelry/rings, necklaces, potions, raw food, alchemy, bags, resources
  (`ItemTracker.cs:41-48`, `ItemToolTip.cs:264-281`).
- Random quality on drop depends on origin (`ItemStats.cs:332-455`): Tool/Junk/Rusting Blade 1–5; Village Craftsman, Barbarians,
  House of Faith, Underworld, House of Coin, Ancient Forge 1–10; Divine, Named, Cursed 1–12; everything else 0.
- Naming clash: quality 10 «Божественное (10)» and origin «Божественное» use the same word (zz_items.txt:493, :500).

## 8. Origin line (`itemForge`, `ItemAttribute.cs:15-37`)

Shown as name + one-sentence description (`ItemToolTip.cs:383-385`; `ItemStats.cs:499-534`, `:740-775`). The origin is a
**rarity tier**, not a stat: it sets the name colour (`ItemStats.cs:230-283`), the icon background (`:285-330`), the quality range
(§7), the price multiplier (`:687-721`: Tool/Junk/Rusting/Village ×0.5; Barbarians/Faith/Coin/Jewelry ×2; Underworld/Ancient/
Named/Rings of Power/Alchemy ×3; Cursed ×5; Divine/Necklaces ×8; Consumable/Quest 0), and the upgrade and dismantle materials
(`GameUI/StaticForgeInterface.cs:360-380`, `GameUI/DismantleInterface.cs:340-390`).

Origins with a rule that matters to the player:
- **Rings of Power** (RU «Кольца Силы», zz_glossary.txt:556): "Ancient rings that are imbued with distinct powers. The effects do
  not stack." (`ItemStats.cs:751`; RU zz_items.txt:312 «Древние кольца, у каждого своя сила. Одинаковые не складываются.»). Code: an
  effect is on if **either** ring slot holds it (`BuffsManager.cs:489-496`), so two copies of the same ring = one effect; two
  different rings = two effects. These rings have no numeric stats **[dump]**.
- **Cursed** (RU «Проклятое», zz_items.txt:456): "Divine weapons and artifacts imbued with curses from the gods themselves."
  (`ItemStats.cs:753`). All 53 carry numeric stats plus a trade-off CustomEffect **[dump]**, shown in **bright red**
  (`ItemToolTip.cs:330-333`): e.g. "Lifesteal 25%, but a 10% chance that the weapon will attack yourself", "Your character ages one
  year every day", "No skills can be used", "Instead of dying, lose this shield and suffer a random curse". The Hexed Weaponry
  passive adds damage while a Cursed main-hand weapon is equipped (`CharacterStats.cs:1434-1437`; `PlayerEquipment.cs:362-370`);
  the Cursed Bag makes cursed items 90% lighter (`InventoryObject.cs:227-229`).
- **Divine** (RU «Божественное», zz_items.txt:500): carrying any Divine item (bags, inventory or worn) lets Vatra the Eternal spawn
  to hunt you at soul level > 10 (`BountyHuntersSpawner.cs:1023-1030`, `GameUI/BagsManager.cs:428-448`); if Vatra kills you, he
  takes your first Divine item (`CharacterStats.cs:3004-3018`). The pickup message plays an effect for Divine, Named, Necklaces,
  Cursed (`GameUI/UICharacterMessages.cs:54-76`).
- **Named** (RU «Именное», zz_items.txt:758): "There is only one item of its kind in the entire world." (`ItemStats.cs:754`).
- **Trophies** (Rare/Epic/Legendary): sold to trophy collectors at ×2/×3/×5/×10 (`ItemStats.cs:549-566`, `:764-767`).
- **Quest Item**: price 0, "cannot be sold" (`ItemStats.cs:713`, `:770`).
- Tool, Junk, Rusting Blade, Village Craftsman, Barbarians, House of Faith, Underworld, House of Coin, Ancient Forge: flavour plus
  tier (colour, quality range, price, materials); no extra rule found. Barbarians and House of Coin prices react to world events
  (`ItemStats.cs:605-616`).

## 9. Russian label gaps (for the translator)

- "Gain {v} experience." and "Over a period of 10 seconds." have no entry in `_config/xunity` (grep).
- CustomEffect lines without an entry found: "Lightning chance: +10%", "Damage to animals: +25%" / "Damage against animals:
  +25%", "Frost: +20%", "Chances to get drunk: N%", "Mana regen: +40%" (grep over `_config/xunity/*.txt`).
- Label vs glossary: the window says «Перезарядка» for "CLD Reduction" (zz_glossary.txt:751), but the glossary term for Cooldown
  Reduction is «Сокращение Перезарядки» and «Перезарядка» is the cooldown itself (glossary.tsv:37-38). A player reads «Перезарядка:
  10%» as the cooldown, not its reduction.
- "Bonus HP/MP" show as «Здоровье / Мана» without "bonus" (zz_krinik.txt:145-146); fine for gear, matches glossary.tsv:21, :23.

## 10. Unknowns

- Real `Stats[]` slot count in the prefab (code default 6, `ItemToolTip.cs:74`); whether long items lose lines. The build's own
  window (`SvarogsDream/src/KrinikUIRework/ItemWindow.cs:198`) reads CustomEffect separately.
- Whether `HealHunger` takes a percent, as the line claims (`ConsumeManager.cs:405`, method body not read).
- The +100 HP/MP at quality 8 only (`ItemStats.cs:174-177`) looks deliberate or a slip; quality 9–12 do not get it.

## Suggested Russian lines

- Качество: от Ужасного (0) до Абсолютного (12). Каждая ступень прибавляет урон, Броню, Здоровье и Ману и делает вещь легче.
- Дробящий, Режущий, Колющий, Магический Урон: множитель оружия. Ваш удар равен навыку этого типа, умноженному на него.
- Защита от Дробящего, Режущего, Колющего, Магии: срезает урон только своего типа. Чем её больше, тем меньше прибавка, предел 90%.
- Дальность: насколько дальше вы достаёте врага.
- Скорость Атаки и Скорость: прибавка к вашей скорости. Меньше 100% замедляет.
- Перезарядка: на столько процентов короче перезарядка навыков.
- Шанс Блока: шанс целиком отразить удар оружием или стрелу. Заклинания не блокируются.
- Здоровье и Мана: прибавка к запасу, пока вещь надета.
- Сила, Ловкость, Интеллект: прибавка к атрибуту. Сила даёт Здоровье, Ловкость Скорость Атаки, Интеллект Ману.
- Камуфляж: враги и стража хуже вас замечают. Минус делает вас заметнее.
- Критический Удар: шанс нанести двойной урон. Есть только у оружия.
- Синяя строка: особое свойство вещи. Красная: проклятье, у вещи есть и сила, и цена.
- Происхождение: кто сделал вещь. От него зависят цвет, цена и предел качества.
- Кольца Силы: два одинаковых кольца дают свойство один раз. Божественную вещь выслеживает Ватра Вечный.
