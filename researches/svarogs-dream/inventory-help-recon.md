# Recon — Svarog's Dream: inventory help popup facts (weapons, equipment, potions)

> **Created:** 2026-10-09 · **Parent:** owner's word 2026-10-09 (one «?» in the inventory corner → one detailed help popup) · **Status:** recon done · **Outbound:** help popup texts (StatTips.cs / new HelpPopup)
>
> Source: the decompiled game code (ilspycmd of `Assembly-CSharp.dll`) in the session scratchpad `acs/`. Every `File.cs:N` is a
> line that was read. Item names come from `SvarogsDream/translation/items_en.tsv` (extracted from the game's ItemObjects), game
> texts from `SvarogsDream/translation/translated.tsv`. The 16 inventory stats are in `inventory-stats-mechanics.md` and are not
> repeated here. Nothing was checked in a running game. **inferred** marks anything not read directly.

## 1. Weapons and hands

- **Weapon kinds** (`ItemCategory.cs`): Axe, Sword, TwoHanded, Spear, Bow, SpellBook, Torch, Shield, OffHand. Item types: Weapon,
  Bow, SpellBook, Torch, Shield (`ItemType.cs:9-20`).
- **Two-handed** = TwoHanded, Bow, SpellBook, Torch, Spear (`ItemObject.cs:148-155`). One-handed = Axe, Sword.
- **Slots.** Weapon, Bow, Torch, SpellBook go to the main-weapon slot; Shield (and off-hand items) to the second slot
  (`PlayerEquipment.cs:490-496`). The second slot's game hint: "Occupied by shield or two-handed weapon." (`SlotDescription.cs:55-58`).
- **Two-handed vs shield.** Putting a two-handed item in the main slot shows it in the second slot too and moves an equipped
  shield to the inventory (`StaticInterface.cs:163-175`, `PlayerEquipment.cs:274-295`). If the inventory has no free slot the
  swap is refused with "Inventory full." (`InventoryObject.cs:665-690`); a deferred unequip that still finds no room drops the
  item on the ground (`PlayerEquipment.cs:286-295`).
- **Stances** follow the hands: Axe/Sword + Shield → one-hand-and-shield; Axe/Sword + Axe/Sword → dual weapons; TwoHanded,
  Spear, Bow, SpellBook (mage stance), Torch each their own (`EquipmentHandler.cs:767-803`, `:813-814`).
- **Dual wielding** (glossary «Два Оружия»): a one-handed `Weapon` fits the second/backup-second slot only while the Dual
  Wielding skill is learned (`InventorySlot.cs:90-93`; flag set by `SpellName.DualWielding` level > 0, `BuffsManager.cs:1354-1356`;
  `PlayerStats.cs:1588-1595`). Penalty: attack speed and every damage part × (0.4 + upgrade %) (`PlayerStats.cs:1540-1553`,
  `:1795-1799`), range = the shorter weapon (`PlayerStats.cs:1829-1832`). Game text: "Combined damage and attack speed are reduced
  by 60% … randomly slashes 2-3 times" (`untranslated.txt:10731`, see stats recon).
- **Off-hand items** (category OffHand in the shield slot) add their stats as a second-hand weapon (`EquipmentHandler.cs:248-251`).
  Burning Eye (id 587) is a light source instead (`EquipmentHandler.cs:236-246`; name `items_en.tsv`). Skull Totem (585): on
  unequip, 10% chance of a random curse, at most once per in-game day (`EquipmentHandler.cs:634-638`).
- **Torch** is a light source (`EquipmentHandler.cs:353-356`) and counts as two-handed (`ItemObject.cs:148-155`).
- **Weapon multiplier.** The item card shows "Blunt Damage: x1.2" etc. (`ItemToolTip.cs:158-173`); it multiplies the hero's
  base from weapon mastery + attribute (stats recon §10–13). Game text: "you can possess the best bow in the world and still deal
  more damage with a wooden sword because you are proficient with slashing and not with bows" (`translated.tsv:53`).
- **Weapon element.** A weapon's enchantment element becomes the hero's main element, a shield's the secondary one
  (`EquipmentHandler.cs:847`, `:863-871`, `:266`).
- **Skills need the right weapon**: "Requires melee weapon equipped." / "Requires bow equipped." / "Requires spellbook equipped." /
  "Requires dual wielding equipped." (`SpellActivator.cs:361-384`); a cursed-weapon element blocks skills ("Cursed weapon.",
  `SpellActivator.cs:385-388`).
- **Range** (melee vs ranged) — see stats recon §8: `2 + weapon range + …` (`PlayerStats.cs:1803-1834`).
- **Ammunition: none.** No arrow/ammo counter exists in the code (grep for ammo/quiver/arrowCount: no hits). Arrows are only a
  visual in the hand (`EquipmentHandler.cs:728-735`). **inferred from absence.**

## 2. Backup set, weapon swap, drawing/sheathing

- **Backup slots**: equipment slots 11 (BackupWeapon) and 12 (BackupShield) (`EquipmentSlots.cs:14-15`). Items there give **no
  stats**: equip/unequip returns early for backup slots (`EquipmentHandler.cs:18-21`, `:426-429`; `PlayerEquipment.cs:76-80`,
  `:235-239`).
- **Swap (X)**: `SwapWeapons()` swaps main weapon ↔ slot 11 and shield ↔ slot 12 (`PlayerEquipment.cs:297-308`); default key X
  = `PlayerAction.ChangeWeapon` (`ControllsManager.cs:36`, `:184-187`; enum `PlayerAction.cs:13`). Game hint: "By default, the X key
  will swap between the main and backup weapon." (`SlotDescription.cs:59-66`).
- **Secondary skill bar** (setting `isSecondarySlots`, `GameSettings.cs:137`): when on, the same swap also flips the skill bar
  to the second set (`PlayerEquipment.cs:307` → `SpellsActionManager.cs:85-93`).
- **Caps Lock** = `PlayerAction.SwapWeapon` (`ControllsManager.cs:34`, `:164-167`): toggles `WorldState.isEquiped` and shows/hides
  the action bar; a bow drops its arrow from the hand (`PlayerActionBar.cs:128-167`). Weapon hidden → movement +1 (stats recon §1,
  `PlayerStats.cs:1722-1731`). Game tip: "To show or hide action bar, press the Caps Lock key or make it persistent in the game
  settings." (`translated.tsv:2160`).

## 3. Equipment

- **Slots** (`EquipmentSlots.cs:3-21`): head (0), main weapon (1), shield/second hand (2), chest (3), legs (4), feet (5), hands (6),
  ring 1 (7), necklace (8), potion 1 (9), food (10), backup weapon (11), backup shield (12), bag 1 (13), bag 2 (14), potions 2–4
  (15–17), ring 2 (18).
- **Item → slot** (`PlayerEquipment.cs:469-518`): Helmet/FullHelmet/HelmetStatic/EmptyHelmet/Mask → head; Chest/Top/TopSleeves →
  chest; Pants/ShortPants → legs; Boots/ShortBoots → feet; Gloves/Gauntlets/LongGloves → hands; Jewelry → ring; Necklace →
  necklace; Potion → potion 1; Bag → bag 1, or bag 2 if bag 1 is taken; Food/RawFood → food.
- **What gear gives** (`ItemStats.cs:18-72`; applied in `EquipmentHandler.cs:929-973`, weapons `:832-877`): four armor types,
  block, bonus HP, bonus MP, Strength/Dexterity/Intelligence, camouflage, movement-speed and attack-speed multipliers, cooldown
  reduction, crit, range. Equipping HP/MP gear tops up current HP/MP by the bonus (`EquipmentHandler.cs:937`, `:945`).
- **Boots** may carry a terrain bonus: "Bonus speed on grass / in water / on roads / indoors." (`ItemToolTip.cs:296-313`;
  `EquipmentHandler.cs:951-954`). Slot hints: boots "to walk faster", gloves "for protection and attack speed", head "Be aware of
  helm disadvantages." (`SlotDescription.cs:91-110`).
- **Special helmets** set a helmet buff (Fire, Ice, Necromancer, Runic, Doombringer, OrderToChaos, ChaosToOrder, Beast, Antler,
  Zagriv, Fishing; `HelmetBuff.cs`; `EquipmentHandler.cs:921-927`), e.g. class-skill bonuses (`SpellInfo.cs:230-245`).
- **Rings**: two slots; a ring's spell buff goes to ring buff 1 or 2 (`EquipmentHandler.cs:955-962`). "Ancient rings that are
  imbued with distinct powers. The effects do not stack." (Rings of Power, `ItemStats.cs:751`).
- **Necklace** selects the animal form (`EquipmentHandler.cs:216-221`, unequip `:476-478`). Hint: "Equip the necklace here to
  change the form. Changing form is on the Space key by default." (`SlotDescription.cs:83-86`).
- **No attribute requirements**: a slot checks only the item type (`InventorySlot.cs:84-110`). **No set bonuses**: `EquipmentSet`
  is a list of NPC outfits (`EquipmentSet.cs`). **No durability/repair**: no such field or word in the code (grep "durability":
  no hits). **inferred from absence** for the last two.
- **Comparison**: hovering an item opens a second card with the equipped item of the same slot; better values green, worse red
  (`UserInterface.cs:311-332`; `ItemToolTip.cs:339-361`, `:390-403`). Off when the setting `isComparisonDisabled` is on
  (`GameSettings.cs:111`, `UserInterface.cs:334-337`) and never for gathered/hunted food or consumables (`UserInterface.cs:319`).
  Colour-blind setting swaps green/red for blue/red (`ItemToolTip.cs:101-117`).

## 4. Quality, forge, dismantling, item origin

- **Quality 0–12**, names: Terrible 0, Rusty 1, Poor 2, Passable 3, Solid 4, Excellent 5, Outstanding 6, Magnificent 7, Mythical 8,
  Utopian 9, Divine 10, Primordial 11, Absolute 12 (`ItemStats.cs:457-476`), each with its colour (`:478-497`).
- **What quality changes per step**: weapon damage multiplier +5% (+2.5% for weapons with several damage types) (`ItemStats.cs:74-117`);
  armor `+ q + 5%·q` (`:194-228`); bonus HP/MP `+5·q + 5%·q`, +100 extra at quality 8 (`:168-192`); block +1 (`:128-135`); crit +2
  (`:119-126`); cooldown reduction +q/2 (`:137-144`); **weight −5%** (`:83-90`); price grows (`:654-728`).
- **Quality is hidden** for food, coins, trophies, jewelry, necklaces, potions, raw food, alchemy, bags, resources
  (`ItemTracker.cs:41-48`; `ItemToolTip.cs:262-281`).
- **Drop quality** is rolled by the item's origin: tools/junk/rusting blades up to 5; craftsman and faction forges up to 10;
  divine/named/cursed up to 12 (`ItemStats.cs:332-455`).
- **Forge upgrade**: +1 quality per upgrade for gold (`CookingManager.cs:315-323`) plus materials (`StaticForgeInterface.cs:315-331`; requirements by item type and
  origin `:359-…`). Gold = item price × 5% (0→1) rising to ×100% (8→9), ×200%, ×400%, ×1000% for 9→10, 10→11, 11→12
  (`StaticForgeInterface.cs:159-254`). Max quality by forge: 9 basic, 10 advanced, 11 horde, 12 huge horde (`:553-568`). Messages:
  "Not enough gold.", "At maximum quality.", "Add <material> xN." (`:265-307`). Materials: Armor Scraps, Divine Scraps, Blade Parts,
  Bow Parts, Magic Dust (and Divine variants), Mithril accepted as a substitute (`:333-340`; names `items_en.tsv` ids 494–502).
- **Dismantling** turns an item into those materials; more from pricier items, the second material scales with quality
  (`DismantleInterface.cs:167-431`, give-out `:457-470`). Alt + right-click dismantles at once (`UserInterface.cs:411-417`).
- **Origin («forge») label** on every card, coloured: grey (tool, junk, rusting blade, village craftsman, trophies, coins), teal
  (Barbarians, House of Faith/Coin forges, rare trophies, alchemy, jewelry, upgrade materials), purple (Underworld, Ancient,
  epic trophies, consumables, Rings of Power), green (food, herbs, alchemy ingredients), red (divine, named, legendary trophies,
  necklaces), dark red (cursed), pink (quest items) (`ItemStats.cs:230-283`; card `ItemToolTip.cs:383-385`). Each has a one-line
  description (`ItemStats.cs:740-775`), e.g. Named "There is only one item of its kind in the entire world."

## 5. Inventory, weight, bags

- **Open**: key I (`PlayerAction.Inventory`, `ControllsManager.cs:27`, `:139-142`); not in animal form, not in the Underworld
  (`:135-142`). Tip: "Press the 'I' key …" (`translated.tsv:2160`). No Tab binding exists (grep `KeyCode.Tab`: no hits).
- **Size**: the `Inventory` class defaults to 24 slots (`Inventory.cs:7`); the asset may override it (**inferred**). Full
  inventory → loot falls on the ground with "Inventory full." (`InventoryObject.cs:94-115`).
- **Mouse**: right-click equips an item (`UserInterface.cs:433`; `PlayerEquipment.cs:310-323`) or, with a bag tab open, puts it
  in that bag (`:419-430`); right-click on a consumable uses it (`:352-365`). Drag outside the window drops it on the ground
  (`:479-523`). Shift + drag splits a stack, except to/from equipment (`:696-703`). Stackable items merge (`InventoryObject.cs:122-155`).
- **Carry limit** = `100 + 2 × Strength` (+Heavy Lifter sigil %, +200 Pack Hauler talent, ×2 Strongback Potion)
  (`PlayerStats.cs:153-169`). Weight counts inventory + equipment + equipped bags (`BagsManager.cs:479-497`), shown as `X/Max`
  (`UserInterface.cs:203-208`).
- **Overweight**: weight text turns red and the HoldingTooMuch debuff starts (`UserInterface.cs:209-217`) → the hero can only walk
  (speed = default/3) (`BuffsManager.cs:1607-1609`; `PlayerController.cs:147-158`); fast travel costs ×1.5 food and ×1.25 hours
  (`WorldMap.cs:3062-3097`, `:3119-3122`). Light load speeds Dexterity growth by up to +50% (`PlayerStats.cs:841-842`).
- **Bags**: two bag slots, "Equip your bag here to expand the inventory." (`SlotDescription.cs:67-74`). A bag opens as a tab that
  replaces the stats panel (`BagsManager.cs:187-262`). A bag can be removed only when empty (`InventoryObject.cs:579-622`,
  `UserInterface.cs:495-506`). Bag weight modifiers (`InventoryObject.cs:191-259`): Trader's −20% all; Alchemy −50% alchemy items
  (Fine −60%); Weaponsmith/Armorsmith −50% weapons/armor and resources; Svetovid −50% potions and food; Veles +50%; Cursed −90%
  cursed items, +20% others; Baba Jaga 0 weight with ≥5 negative talents. Buttons move all items to/from a bag, and alchemy items
  into an alchemy bag (`BagsManager.cs:508-566`, `:169`, `:178`).
- **Auto-routing settings**: `isItemsBag` sends new pickups into equipped bags first; `isIngredientsBag` does that for raw food and
  alchemy only (`BagsManager.cs:134-161`; `GameSettings.cs:87-89`).
- **Sorting**: a toggle panel; sort by type, price, weight, name; applies to the main inventory and the open bag
  (`BagsManager.cs:568-652`). Type order: alchemy, raw food, potions, food, trophies, necklaces, jewelry, boots, pants, chest,
  gloves, helmets, weapons, shields, torches, bows, spellbooks, bags, other (`:726-929`).

## 6. Potions

- **Four potion slots** (`EquipmentSlots.cs:12`, `:18-20`). W drinks the active one (on key release), E cycles to the next filled
  slot, hold W + 1…4 drinks that slot (`SpellActivator.cs:79-114`; keys W/E = `ControllsManager.cs:51`, `:40`, `:193-196`;
  `SpellsActionManager.cs:322-358`). Slot hint: "By default press the W key to use it and press the E key to switch to the next
  potion." (`SlotDescription.cs:35-50`). WASD layout moves potion to E and cycle to R (`ControllsManager.cs:326-337`).
  Right-click on a potion puts it in potion slot 1 (`PlayerEquipment.cs:505-506`).
- **Instant effect** ("Instantly:", `SpellsActionManager.cs:411`; `ConsumeManager.cs:217-233`). Health/hunger/morale/mana values
  are **% of max** (`ConsumeManager.cs:401-424`; card "Heals N% max health.", `ItemToolTip.cs:206-225`). Mana restore also restores
  energy (`ConsumeManager.cs:411-415`).
- **Refused when useless**: "Health is already full." / "Mana is already full." / both (`SpellActivator.cs:406-430`).
  Potions and food work while swimming and while skills are silenced (`SpellActivator.cs:351`, `:391`).
- **Cooldown**: exists (skill slot with a cooldown; base value in game data, not code). Potions Addict ×0.5 cooldown and ×0.9
  potency; Potions Allergic ×1.5 cooldown and ×0.8 potency; Mokosh devotion shortens potion and food cooldowns
  (`SpellInfo.cs:104-125`; `ConsumeManager.cs:383-399`). Potion Expert sigil raises potency (`ConsumeManager.cs:394-397`).
- **Buff potions** (`ConsumeManager.cs:426-582`; names `items_en.tsv`): Owl (night vision 300 s), Cleanse (removes poison/plague
  and disables), Perun's / Veles / Stribog's (+1 Strength / Intelligence / Dexterity permanently + a 300 s buff), Potion of Haste
  300 s, Strongback 300 s (double carry weight, "Carry twice the amount of weight for 5 minutes." `translated.tsv:534`), Berserk 30 s
  (×1.5 blunt/slashing, +0.5 attack speed; costs 10% of current HP per second while HP > 50, `PlayerStats.cs:355-363`), Blunt /
  Slashing / Piercing / Spellbook potions 300 s (damage-type boost), Manaward 60 s, Grand Mana 120 s, Freeborn 30 s, Dajbog's
  (+1 Bravery, 300 s), Mokosh Elixir (+1 Endurance, shield = ¼ max HP), Titan's Brew (350 shield HP), Poison / Strong Poison
  (poisoned weapon), Goblin's Bomb (thrown at the cursor), Failed Potion (50%: heal 100 or take 100), Morana's Gift (kills the
  hero). Durations scale with the potency multiplier (`300f * num`). Everflowing Horn (709) heals 300 HP and is **not consumed**
  (`ConsumeManager.cs:41`, `:540-542`).

## 7. Food and hunger

- **One food slot**, key Q (`EquipmentSlots.cs:13`; `PlayerAction.Food` = Q, `ControllsManager.cs:50`;
  `SpellActivator.cs:107-110`). Hint: "By default press the Q key to use the food." (`SlotDescription.cs:87-90`). Game tip: "The
  food slot has a 30-second cooldown." (`translated.tsv:2160`, game text, the value itself is in data).
- **Over 10 seconds**: food heals one tenth per second for 10 s (`ConsumeManager.cs:240-262`; "Over 10 seconds:",
  `SpellsActionManager.cs:453`; card "Over a period of 10 seconds.", `ItemToolTip.cs:250-253`). Quick Eater talent: instant;
  Missing Teeth: half (`ConsumeManager.cs:242-252`).
- **Food buffs**: fish dishes give 900 s attribute buffs (Fish Soup Strength, Delicate Baked Fish Bravery, Sushi Dexterity, Fresh
  Fish Slice Intelligence, Skewered Fish Energy) (`ConsumeManager.cs:112-131`; names `items_en.tsv` 642–646). Mana Morel resets the
  potion cooldown, Timecap resets all cooldowns (`:132-135`, `:143-146`). Beer/Wine may make you Drunk 60 s (`:74-111`).
- **Hunger**: max 100 (200 with the Abstinence virtue) (`PlayerStats.cs:1442-1449`). It drops 0.05 every 3 s (`PlayerStats.cs:107`,
  `:270`, `:1877-1897`), i.e. **≈1 per minute, full to empty ≈100 min** (computed from those lines). States: > 50 Nourished,
  1–50 Hungry, 0 Starving (`PlayerStats.cs:2062-2071`). Starving stops health regeneration (`BuffsManager.cs:1585-1591`; globe text
  "Not regenerating when hungry.", `UIGlobeStat.cs:97`). Fed and out of combat: +1% max HP per second (`PlayerStats.cs:1998-2013`).
- **Auto-eat** (setting `isAutoEatFood`, default off, `GameSettings.cs:65`): every 5 s, if hunger ≤ 0, eats one item of the first
  **Cooked Food** stack in the main inventory (not bags, not the food slot), skipping beer, wine and a few special foods
  (`AutoEatFoodManager.cs:7-34`).
- **Consumables** (origin Consumable): "Directly consumable items (usable via right-click)." (`ItemStats.cs:768`;
  `UserInterface.cs:352-365`).

## 8. Gold, trade, special items

- **Coins** become gold the moment they are moved or dropped (`InventoryObject.cs:556-568`; `UserInterface.cs:507-511`,
  `:536-540`, `:667-671`).
- **Selling**: right-click while trading sells at once (`UserInterface.cs:370-388`); dragging onto a trader slot sells too
  (`:529-561`). The trader's gold is limited: "out of money" refuses the sale (`:370-375`; `StorageManager.cs:4781-4791`). "Sell
  all" from the open bag (`StaticTradeInterface.cs:125-149`).
- **Buying** costs **×5** the sell price (Vulgar talent ×1.2, discount trader ×0.8, Trader sigil −level%, trade buff ±5%)
  (`ItemStats.cs:546-588`). Items you sold are marked and bought back at the sell price (`StorageManager.cs:4800-4805`;
  `ItemToolTip.cs:153`, `:314-317`). World events shift prices (`ItemObject.cs:43-137`; `ItemStats.cs:590-652`).
- **Junk-tier** (tool, junk, rusting blade, village craftsman) sells at half price (`ItemStats.cs:689-694`); Junk: "May not be
  valuable, but it's better than fighting with bare hands." (`:745`).
- **Trophies** sell to trophy collectors ×2 / ×3 (rare) / ×5 (epic) / ×10 (legendary) (`ItemStats.cs:549-566`, `:764-767`).
- **Quest items**: cannot be sold, dropped or right-click used; price 0 (`UserInterface.cs:346`, `:490`, `:531`;
  `ItemStats.cs:711-714`, `:770` "…cannot be sold."). Consumables cannot be dropped either (`UserInterface.cs:490`). Some
  specific consumables are unsellable (`StorageManager.cs:252-259`).
- **Chest/storage**: right-click moves the item into the open chest (`UserInterface.cs:389-393`); during cooking/alchemy it goes
  to the station (`:399-406`).

## Quirks worth knowing (code reading)

- The potion slot tooltip says "heal N health" (`SpellsActionManager.cs:414`) while the item card and the code use % of max
  (`ItemToolTip.cs:212`; `ConsumeManager.cs:409`).
- Adding to an existing stack overwrites the stack's quality with the new item's (`InventoryObject.cs:152-153`).
- The default key table (`ControllsManager.cs:24-65`) and the reset table (`:343-384`) differ for Character screen (P vs J) and
  Almanac (L vs P); inventory keys (I, X, Caps Lock, Q, W, E) are the same in both.

## Unknowns

- Base potion and food cooldowns (game data; only the game tip "30-second" for food).
- The exact player inventory size (asset), the effects of Hungry/Nourished beyond regeneration, and what "helm disadvantages"
  means (likely negative stats in item data, **inferred**).

---

## Suggested popup structure

Plain modern Russian, no «—», glossary terms capitalized, «вы». Each line → the facts above (section numbers in brackets are for
traceability; drop them in the build). Terms outside the glossary (запасное оружие, слот еды, качество) are lowercase until the
owner adds them.

**1. Оружие** [§1]
- Меч и топор занимают одну руку, во вторую можно взять щит.
- Двуручное оружие, копьё, лук, Книга Заклинаний и Факел занимают обе руки. Надетый щит при этом уйдёт в инвентарь.
- Множитель урона в карточке («x1,2») умножает ваше Мастерство Оружия этого вида. Лучший лук слабее простого меча, если вы мечник.
- Два Оружия доступны после изучения умения. Скорость Атаки и урон тогда ×0,4 (улучшения умения поднимают), Дальность Атаки по более короткому клинку.
- Умения требуют своего оружия: ближнего боя, лука, Книги Заклинаний или Двух Оружий.

**2. Запасное оружие и Caps Lock** [§2]
- Клавиша X меняет оружие и щит на запасной комплект. Запасной комплект ничего не даёт, пока не в руках.
- Если в настройках включена вторая панель умений, X переключает и её.
- Caps Lock убирает и достаёт оружие, вместе с ним прячется панель действий. С убранным оружием Скорость на 1 выше.

**3. Экипировка** [§3]
- Ячейки: голова, тело, штаны, перчатки, сапоги, два кольца, Ожерелье, две сумки, четыре зелья и еда.
- Броня даёт Защиту от каждого вида урона отдельно. Ещё вещи дают Здоровье, Ману, атрибуты, Камуфляж, Скорость и Скорость Атаки.
- Требований к атрибутам нет, комплектов нет, вещи не ломаются.
- Ожерелье задаёт Звериный Облик (Пробел). Кольца Силы одного вида не складываются.
- Наведите на вещь: рядом откроется надетая, лучше зелёным, хуже красным. Сравнение отключается в настройках.

**4. Качество и кузница** [§4]
- Качество от 0 до 12. Каждая ступень: урон оружия +5%, больше Защиты и Здоровья, Шанс Блока +1, Критический Удар +2, вес −5%.
- В кузнице качество поднимают за золото и материалы. Обычная кузница доводит до 9, лучшие до 10, 11 и 12.
- Разборка превращает ненужную вещь в материалы для улучшения. Alt и правый клик разбирают сразу.
- Цвет строки происхождения: серый у простых вещей, красный у божественных и именных, розовый у квестовых.

**5. Инвентарь, вес и сумки** [§5]
- Правый клик надевает вещь, при открытой сумке кладёт её туда. Перетащите за окно, чтобы бросить; с Shift стопка делится.
- Предел веса: 100 и по 2 за каждое очко Силы.
- С перегрузом вы идёте только шагом, а Быстрое Перемещение стоит больше еды и времени.
- Сумки добавляют места, некоторые облегчают свой груз. Снять сумку можно только пустой.
- Сортировка раскладывает вещи по типу, цене, весу или имени.

**6. Зелья** [§6]
- Четыре ячейки зелий. W пьёт выбранное, E переключает на следующее, W с цифрой 1–4 пьёт из этой ячейки.
- Зелье действует сразу и лечит долю Запаса Здоровья. Зелье маны восполняет и Энергию.
- При полном Здоровье зелье лечения не выпьется. Пить можно и в воде, и когда враг лишил вас умений.
- У зелий есть Перезарядка. Усиливающие зелья действуют 5 минут, Зелье Берсерка 30 секунд и каждую секунду забирает 10% Здоровья.

**7. Еда и Голод** [§7]
- Одна ячейка еды, клавиша Q. Еда действует 10 секунд, по десятой части в секунду.
- Голод убывает примерно на 1 в минуту. При нуле Здоровье не восстанавливается; сытым вне боя оно растёт на 1% в секунду.
- Рыбные блюда усиливают атрибут на 15 минут.
- Включите в настройках автоеду: при пустом Голоде вы сами съедите приготовленную еду из инвентаря.

**8. Торговля и особые предметы** [§8]
- Правый клик у торговца продаёт вещь сразу. Покупка в 5 раз дороже продажи, своё проданное выкупается по цене продажи.
- Золото у торговца ограничено. Монеты становятся золотом, как только вы их тронете.
- Трофеи коллекционеры берут в 2, 3, 5 или 10 раз дороже.
- Квестовые предметы нельзя продать или выбросить.
