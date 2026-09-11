# Интервью #002 — русский перевод интерфейса мода «Hosav's Custom UI»: вычитка таблицы

> Тема: владелец вычитывает предложенный перевод 172 строк мода и решает три вопроса формы.
> Источник: слово владельца 2026-09-12: «давай поучимся локализовать. Напиши таблицу АНГЛ строк,
> которые ты нашёл в моду, рядом колонка РУ твоего предложения — и мне на вычитку. Я согласую, и ты
> попробуешь сделать моду локализацию».
> Статус: **🟡 ждёт вычитки владельца**
> Вовне: после согласования — опыт «мод-перевод» (фаза 2 эпика `plans/06`): свой `.locres` для `ru`
> по ключам мода, без правки самого мода.

## Как вычитывать

Правь колонку **RU** прямо в таблице. Строку, которую переводить не надо, помечай «—» в колонке RU.
Внизу — три вопроса с вариантами, там строки «**Ответ:**». Всё остальное я решил сам и написал почему.

## Что известно (откуда строки и почему именно эти)

- Мод распакован штатным `UnrealPak` кита; из 200 ассетов текст несут 52. Прибор вытащил из них
  **794 текста с ключами локализации, из них 294 уникальных** (`researches/conan-devkit/hosav-ftext.csv`).
  У всех текстов ключ есть, пространство имён пустое — значит, перевод можно подложить своим
  `.locres`, не трогая мод.
- Из 294 уникальных **172 — настоящие подписи интерфейса** (ниже). Остальные 122 — образцы
  конструктора («838 / 933», «19:01», «9999»), внутренние имена перечислений (`FuncomDefault`,
  `ColdEmbrace`), имена модов и тестовые строки — они игроку не видны или не должны меняться;
  их список в конце, переводить не предлагаю.
- **Термины сверены с русской локализацией самой игры** (прибор `researches/conan-devkit/glossary.py`
  читает манифесты и `ru/*.locres` кита): Followers → **Спутники**, Thrall → **Раб**, Corruption →
  **Скверна**, Endurance → **Выносливость**, Bazaar → **Базар**, Mount → **Скакун**, Armor →
  **Доспехи**, Crafting → **Создание предметов**, Hue → **Тон**, Saturation → **Насыщенность**,
  Crippled → **Увечье**, Unavailable → **Недоступен**, Cancel → **Отмена**, Close → **Закрыть**.
  Слов Shelter, Consciousness, Encumbrance, Hotbar, Minimap, Party в словаре игры отдельной строкой
  нет — для них мой вариант помечен «⚠ нет в словаре игры».
- Регистр и пробелы в оригинале сохранены как есть (у автора бывают хвостовые пробелы и опечатки
  «Visbillity»): ключ привязан к тексту, править оригинал нельзя.

## A. Окно настроек — заголовки разделов и переключатели (86)

| № | EN (как в моде) | RU (предложение) | Примечание |
|---|---|---|---|
| 1 | Hosav's UI Settings | Настройки интерфейса Hosav | имя автора не переводим |
| 2 | Personal UI Settings : | Настройки личного интерфейса: | |
| 3 | Custom Personal UI | Свой личный интерфейс | «Custom» здесь = «мой вместо ванильного» |
| 4 | Healthbar Settings | Полоса здоровья | |
| 5 | Healthbar Visbillity | Показывать полосу здоровья | опечатка автора в EN — оставляем |
| 6 | Healthbar Values | Числа на полосе здоровья | |
| 7 | Healthbar Custom Color | Свой цвет полосы здоровья | |
| 8 | Health Color Picker | Выбор цвета здоровья | |
| 9 | Health Numeric Text | Здоровье числом | |
| 10 | Staminabar Settings | Полоса выносливости | |
| 11 | Staminabar Visbillity | Показывать полосу выносливости | |
| 12 | Staminabar Values | Числа на полосе выносливости | |
| 13 | Staminabar Custom Color | Свой цвет полосы выносливости | |
| 14 | Stamina Color Picker | Выбор цвета выносливости | |
| 15 | Health and Stamina/Endurance Text Custom Color | Свой цвет текста здоровья и выносливости | |
| 16 | Health and Stamina/Endurance Text Color Picker | Выбор цвета текста здоровья и выносливости | |
| 17 | Corruption Values  | Скверна числом | |
| 18 | Corruption Bar Custom Color | Свой цвет полосы скверны | |
| 19 | Corruption Bar Color Picker  | Выбор цвета полосы скверны | |
| 20 | Consciousness Percentage | Сознание в процентах | ⚠ нет в словаре игры («Consciousness» — шкала оглушения) |
| 21 | Experience Settings | Опыт | |
| 22 | Current Level | Текущий уровень | |
| 23 | Experience Amount | Опыт числом | |
| 24 | Experience Percentage | Опыт в процентах | |
| 25 | Experience Progress Indicator | Полоса опыта | |
| 26 | Experience Progress Custom Color | Свой цвет полосы опыта | |
| 27 | Experience Color Picker | Выбор цвета опыта | |
| 28 | Additional HUD Settings | Дополнительно на экране | |
| 29 | Armor Values | Доспехи числом | |
| 30 | Damage Values | Урон числом | |
| 31 | Weight Values | Вес числом | |
| 32 | Food Values | Еда числом | |
| 33 | Water Values | Вода числом | |
| 34 | Temperature Values | Температура числом | |
| 35 | Temperature Type  | Единицы температуры | |
| 36 | Shelter Percentage | Укрытие в процентах | ⚠ нет в словаре игры |
| 37 | Crafting Time in Seconds | Время создания в секундах | |
| 38 | In-Game Time of Day | Игровое время суток | |
| 39 | Server Info | Сведения о сервере | |
| 40 | Compass | Компас | |
| 41 | Compass Background Custom Color | Свой цвет фона компаса | |
| 42 | Compass Background Color Picker  | Выбор цвета фона компаса | |
| 43 | Minimap | Мини-карта | ⚠ нет в словаре игры |
| 44 | Minimap Border | Рамка мини-карты | |
| 45 | Minimap Border Color Picker  | Выбор цвета рамки мини-карты | |
| 46 | Minimap Show Local Time | Местное время на мини-карте | |
| 47 | Select Minimap Position  | Положение мини-карты | |
| 48 | Minimap Custom Position :  | Своё положение мини-карты: | |
| 49 | Centered UI Stats / Custom Position | Показатели по центру / своё положение | |
| 50 | Centered UI Custom Position :  | Своё положение центрального блока: | |
| 51 | Select Healthbar Position  | Положение полосы здоровья | |
| 52 | Select Detail Font Size  | Размер шрифта подписей | |
| 53 | Detail Font/Icons Custom Color | Свой цвет подписей и значков | |
| 54 | Font Color Picker  | Выбор цвета шрифта | |
| 55 | Select Hotbar Size  | Размер панели быстрого доступа | ⚠ «Hotbar» — в игре «панель быстрого доступа», сверить глазом |
| 56 | Hotbar Only In Inventory | Панель быстрого доступа только в инвентаре | |
| 57 | Age of Calamitious Faction Emblem on HUD | Эмблема фракции Age of Calamitous на экране | AoC — чужой мод, имя не переводим |
| 58 | Custom Target UI | Свой интерфейс цели | |
| 59 | Target Healthbar Enabled | Полоса здоровья цели | |
| 60 | Target Level | Уровень цели | |
| 61 | Target Health Custom Color | Свой цвет здоровья цели | |
| 62 | Target Health Color Picker | Выбор цвета здоровья цели | |
| 63 | Target Consciousness Custom Color | Свой цвет сознания цели | |
| 64 | Target Consciousness Color Picker | Выбор цвета сознания цели | |
| 65 | Target Level Background Custom Color | Свой цвет фона уровня цели | |
| 66 | Target Level Background Color Picker | Выбор цвета фона уровня цели | |
| 67 | Target AoC Faction Visibillity | Фракция AoC у цели | |
| 68 | Show health lost in enemy healthbar | Показывать потерянное здоровье врага | |
| 69 | Combat Settings | Бой | |
| 70 | Damage Indicator (Right) | Индикатор урона (справа) | |
| 71 | Damage Indicator Icons | Значки индикатора урона | |
| 72 | Simplistic Damage Indicator | Упрощённый индикатор урона | |
| 73 | Damage Indicator Color Picker  | Выбор цвета индикатора урона | |
| 74 | Damage Indicator for Follower (Left) | Индикатор урона спутника (слева) | |
| 75 | Follower Damage Indicator Icons | Значки индикатора урона спутника | |
| 76 | Follower Simplistic Damage Indicator | Упрощённый индикатор урона спутника | |
| 77 | Follower Damage Indicator Color Picker  | Выбор цвета индикатора урона спутника | |
| 78 | Damage Indicator Log (Lower Right) | Журнал урона (справа внизу) | |
| 79 | Damage Indicator Log Icons | Значки журнала урона | |
| 80 | Simplistic Damage Indicator Log | Упрощённый журнал урона | |
| 81 | Damage Indicator Log Color Picker  | Выбор цвета журнала урона | |
| 82 | Damage Indicator Follower Log Color Picker  | Выбор цвета журнала урона спутника | |
| 83 | Use Float Damage | Всплывающий урон | |
| 84 | Kill XP Feedback | Опыт за убийство | |
| 85 | Kill XP Feedback Background | Фон уведомления об опыте | |
| 86 | Kill XP Feedback Names | Имя убитого в уведомлении | |
| 87 | Kill XP Feedback Amount | Число опыта в уведомлении | |
| 88 | Kill XP Feedback Sound | Звук уведомления об опыте | |
| 89 | Mount Settings | Скакун | |
| 90 | Mount Healthbar Visbillity | Показывать здоровье скакуна | |
| 91 | Mount Healthbar Values | Здоровье скакуна числом | |
| 92 | Mount Healthbar Custom Color | Свой цвет здоровья скакуна | |
| 93 | Mount Health Color Picker | Выбор цвета здоровья скакуна | |
| 94 | Mount Endurancebar Visibillity | Показывать выносливость скакуна | |
| 95 | Mount Endurancebar Values | Выносливость скакуна числом | |
| 96 | Mount Endurancebar Custom Color | Свой цвет выносливости скакуна | |
| 97 | Mount Endurance Color Picker | Выбор цвета выносливости скакуна | |
| 98 | Mount Level Display | Уровень скакуна | |
| 99 | Mount Level Background | Фон уровня скакуна | |
| 100 | Mount Level Background Custom Color | Свой цвет фона уровня скакуна | |
| 101 | Mount Background Color Picker | Выбор цвета фона скакуна | |
| 102 | Party UI Settings | Группа | ⚠ «Party» нет в словаре игры; «группа» — привычное |
| 103 | Show Party UI in HUD  | Показывать группу на экране | |
| 104 | Ally Names | Имена союзников | |
| 105 | Ally Health | Здоровье союзников | |
| 106 | Ally Health Custom Color | Свой цвет здоровья союзников | |
| 107 | Ally Health Color Picker | Выбор цвета здоровья союзников | |
| 108 | PvE Player Stamina | Выносливость игроков на PvE | |
| 109 | Buff Settings | Эффекты | ⚠ «Buff» — в игре «эффекты», сверить глазом |
| 110 | Buffs in UI | Эффекты на экране | |
| 111 | Buff Timer | Таймер эффектов | |
| 112 | Buff Description | Описание эффектов | |
| 113 | Other Settings | Прочее | |
| 114 | Bazaar Enabled | Кнопка «Базар» | |
| 115 | Disable IQoL Hooks | Отключить элементы IQoL | IQoL — чужой мод |
| 116 | Save | Сохранить | |
| 117 | Close | Закрыть | |
| 118 | Consider helping me out by donating :  | Поддержать автора: | |
| 119 |    Donate    | Пожертвовать | |
| 120 | SOME FEATURES MAY NOT YET BE IMPLEMENTED OR BE WIP | НЕКОТОРЫЕ ВОЗМОЖНОСТИ ЕЩЁ НЕ ГОТОВЫ | |
| 121 | No longer supported, I recommend checking out Xevyr's Minimap | Больше не поддерживается — советую мини-карту от Xevyr | |
| 122 | This option disables all HUD elements from IQoL. REMEMBER TO LOAD THIS MOD AFTER IQoL IF YOU USE IQoL | Отключает все элементы IQoL на экране. ЕСЛИ ИСПОЛЬЗУЕТЕ IQoL — ГРУЗИТЕ ЭТОТ МОД ПОСЛЕ НЕГО | |

## B. Окно настроек — подсказки под переключателями (46)

| № | EN (как в моде) | RU (предложение) |
|---|---|---|
| 123 |  - Instead of the vanilla HUD, you can use my custom UI with loads of customisable options below | — Вместо стандартного интерфейса можно включить мой, с множеством настроек ниже |
| 124 |  - more options for the custom UI to customize what elements you want to have enabled or change.  | — Дополнительные настройки моего интерфейса: какие элементы показывать и как |
| 125 |  - Replaces the vanilla target healthbar with my custom version which you can change the looks of with below settings | — Заменяет стандартную полосу здоровья цели на мою, вид настраивается ниже |
| 126 |  - Shows player and thrall party when you have invited or been invited to one. | — Показывает группу игроков и рабов, когда вы пригласили кого-то или приглашены сами |
| 127 |  - Change what buff information to show/hide | — Какие сведения об эффектах показывать |
| 128 |  - Other settings for the UI that is not neccessarily connected to the custom UI (like the hotbar) | — Прочие настройки интерфейса, не связанные напрямую с моим (например, панель быстрого доступа) |
| 129 |  - An always accurate display of damage the enemy/ally has taken in their healthbar. | — Точное отображение полученного врагом или союзником урона на его полосе здоровья |
| 130 |  - Shows a compass in my custom UI that shows N, W, E and S and which direction the player is facing | — Компас в моём интерфейсе: стороны света и направление взгляда |
| 131 | - Will disable all the IQoL UI Elements on your in-game HUD | — Отключает все элементы IQoL на игровом экране |
| 132 | - Will make your hotbar invisible unless you are in your inventory | — Панель быстрого доступа видна только в инвентаре |
| 133 |  - When crafting, will show how many seconds are left before the item is finished crafting (CURRENTLY DISABLED TO INVESTIGATE AN ISSUE) | — При создании предмета показывает, сколько секунд осталось (СЕЙЧАС ОТКЛЮЧЕНО: ИЩЕТСЯ ОШИБКА) |
| 134 | - Set the size of your hotbar | — Размер панели быстрого доступа |
| 135 |  - Will move the HUD down just above the hotbar by default, if hotbar only in inventory is enabled, the HUD will move even further down. | — Опускает интерфейс к панели быстрого доступа; если панель показывается только в инвентаре — опускает ещё ниже |
| 136 |  - If you want a visible black background for your HUD so it is easier to see, you can increase the opacity. | — Чтобы интерфейс лучше читался, можно добавить чёрную подложку: увеличьте непрозрачность |
| 137 |  - Show Server FPS, current player amount and your Ping to the server | — FPS сервера, число игроков и ваш пинг |
| 138 |  - Show in-game time | — Игровое время |
| 139 |  - If you have AoC, having this enabled will show your faction icon just below your level bar | — Если стоит AoC, под полосой уровня появится значок вашей фракции |
| 140 |  - Show what armor type you have, how much armor and the % damage reduction | — Тип доспехов, их значение и % снижения урона |
| 141 |  - Show weapon damage, armor penetration and total damage after calculating your stats | — Урон оружия, пробитие доспехов и итоговый урон с учётом характеристик |
| 142 |  - Show temperature in Temperature type set above | — Температура в единицах, выбранных выше |
| 143 |  - Show how much weight you have right now out of the max and how many % encumbered you are. | — Текущий вес из максимального и % перегруза |
| 144 |  - Show how much food you have and how much time is left until it runs out | — Запас еды и сколько времени он продержится |
| 145 |  - Show how much water you have and how much time is left until it runs out | — Запас воды и сколько времени он продержится |
| 146 |  - Set the font size of water, food, armor info etc in the HUD | — Размер шрифта подписей: вода, еда, доспехи и прочее |
| 147 |  - Show how much health is reduced (more accurate than vanilla) from corruption | — На сколько скверна снизила здоровье (точнее, чем в игре) |
| 148 |  - Setup what will show up when targeting someone | — Что показывать при наведении на цель |
| 149 |  - Disabling this will disable any healthbars showing up in combat | — Если выключить, в бою не будет никаких полос здоровья |
| 150 |  - If you want to remove the Bazaar button from the tab screen in your inventory etc. Not all of us even wanna see that. | — Убирает кнопку «Базар» с вкладок инвентаря. Не всем она нужна |
| 151 |  - Show how much Shelter you have with a progress bar and percentage. | — Укрытие полосой и в процентах |
| 152 |  - Set the color of the same text as mentioned above and their respective icons  | — Цвет тех же подписей и их значков |
| 153 | - Will show amount of experience you get when you kill someone or something. | — Показывает, сколько опыта дало убийство |
| 154 | - Will show or hide the blood background for XP Feedback | — Кровавый фон уведомления об опыте |
| 155 | - Will show or hide the name of the killed enemy for XP Feedback | — Имя убитого врага в уведомлении об опыте |
| 156 | - Will show or hide the amount of XP for the XP Feedback | — Число опыта в уведомлении |
| 157 | - Will enable or disable a low volume sound when the XP feedback shows up. | — Тихий звук при появлении уведомления об опыте |
| 158 |  - Enables or Disables Icons for the Damage Indicator | — Значки в индикаторе урона |
| 159 |  - With Simplistic Enabled you will only see how much damage you dealt. With it off you will see who you damaged as well. | — В упрощённом виде показывается только урон; в полном — ещё и кому он нанесён |
| 160 |  - Shows MMO Type Damage Indicator that pops up on the screen as your thrall does damage.  | — Индикатор урона в духе MMO: всплывает, когда бьёт ваш раб |
| 161 |  - Enables or Disables Icons for the Follower Damage Indicator | — Значки в индикаторе урона спутника |
| 162 |  - With Simplistic Enabled you will only see how much damage your follower dealt. With it off you will see who your follower damaged as well. | — В упрощённом виде показывается только урон спутника; в полном — ещё и кому он нанесён |
| 163 |  - Shows MMO Type Damage Indicator that pops up on the screen as you or your thrall takes damage. | — Индикатор урона в духе MMO: всплывает, когда бьют вас или вашего раба |
| 164 |  - Enables or Disables Icons for the Damage Indicator Log | — Значки в журнале урона |
| 165 |  - With Simplistic Enabled you will only see how much damage you or your follower took. With it disabled you can discern if you or your follower was the one to take damage. | — В упрощённом виде показывается только полученный урон; в полном видно, кто его получил — вы или спутник |
| 166 |  - Shows a more traditional screen popup, that is dynamically placed depending on damaged character's position. (Disables Damage Other Damage Indicator) | — Привычные всплывающие цифры над тем, кого ударили (отключает индикатор урона справа) |
| 167 |  - Shows MMO Type Damage Indicator that pops up on the screen as you do damage.  | — Индикатор урона в духе MMO: всплывает, когда бьёте вы |
| 168 | - Will automatically be disabled with gamepad input to prevent input issues. | — При игре с геймпада отключается само, чтобы не мешать вводу |
| 169 | - Shows the AoC Faction of your target | — Фракция AoC у цели |
| 170 |  - If the server is PVE, this can be enabled to see nearby players stamina. | — На PvE-сервере показывает выносливость игроков рядом |

## C. Палитра цвета (34)

| № | EN (как в моде) | RU (предложение) | Примечание |
|---|---|---|---|
| 171 | Color Picker Simple | Выбор цвета | |
| 172 | Link color wheel with value | Связать круг цвета с яркостью | |
| 173 | HUE | ТОН | как в игре: Hue → Тон |
| 174 | Saturation | Насыщенность | как в игре |
| 175 | Value | Яркость | в игре «Value» = «Стоимость» — другой смысл, здесь яркость |
| 176 | Alpha | Прозрачность | в игре «Alpha» = «Вожак» — другой смысл |
| 177 | Alpha Channel | Канал прозрачности | |
| 178 | Red Channel | Красный канал | |
| 179 | Green Channel | Зелёный канал | |
| 180 | Blue Channel | Синий канал | |
| 181 | Hexadecimal Value | Шестнадцатеричный код | |
| 182 | Hex: | Hex: | |
| 183 | H: / S: / V: / A: / R: / G: / B: | — (оставить) | однобуквенные подписи ползунков |
| 184 | New | Новый | |
| 185 | Old | Старый | |
| 186 | Random Color | Случайный цвет | |
| 187 | Click to restore old color | Нажмите, чтобы вернуть старый цвет | |
| 188 | OK | ОК | как в игре |
| 189 | Cancel | Отмена | как в игре |
| 190 | Color Picker Health Bar | Цвет полосы здоровья | заголовки окон палитры |
| 191 | Color Picker Stamina Bar | Цвет полосы выносливости | |
| 192 | Color Picker Mount Endurance Bar | Цвет полосы выносливости скакуна | |
| 193 | Color Picker Mount Health Bar | Цвет полосы здоровья скакуна | |
| 194 | Healthbar Color | Цвет полосы здоровья | |
| 195 | Staminabar Color | Цвет полосы выносливости | |
| 196 | Corruption Bar Color | Цвет полосы скверны | |
| 197 | Experience Progress Color | Цвет полосы опыта | |
| 198 | Health/Stamina/Endurance Color | Цвет здоровья и выносливости | |
| 199 | Details Font Color | Цвет шрифта подписей | |
| 200 | Compass Background Color | Цвет фона компаса | |
| 201 | Minimap Border Color | Цвет рамки мини-карты | |
| 202 | Nearby Ally Health Color | Цвет здоровья союзников рядом | |
| 203 | Damage Indicator Color | Цвет индикатора урона | |
| 204 | Damage Indicator Follower | Цвет индикатора урона спутника | |
| 205 | Damage Indicator Log | Цвет журнала урона | |
| 206 | Damage Indicator Log for Follower | Цвет журнала урона спутника | |
| 207 | Mount Health Color | Цвет здоровья скакуна | |
| 208 | Mount Endurance Color | Цвет выносливости скакуна | |
| 209 | Mount Level Background Color | Цвет фона уровня скакуна | |
| 210 | Target Health Color | Цвет здоровья цели | |
| 211 | Target Consciousness Color | Цвет сознания цели | |
| 212 | Target Level Background Color | Цвет фона уровня цели | |

## D. Группа, экран и прочие надписи (22)

| № | EN (как в моде) | RU (предложение) | Примечание |
|---|---|---|---|
| 213 | Hosav's UI  Party Manager | Группы — интерфейс Hosav | |
| 214 | Party Manager | Управление группой | |
| 215 | Player Party | Группа игроков | |
| 216 | Follower Party | Группа спутников | |
| 217 | Leave Player Party | Покинуть группу игроков | |
| 218 | Disband Follower Party | Распустить группу спутников | |
| 219 | Admin : All players can invite players outside of clan | Админ: все могут приглашать игроков вне клана | |
| 220 | Personal : Can be invited to party | Личное: меня можно приглашать в группу | |
| 221 | Personal : Players outside of clan can invite you | Личное: игроки вне клана могут меня приглашать | |
| 222 | UI Settings | Настройки интерфейса | кнопка на экране |
| 223 | UNAVAILABLE | НЕДОСТУПЕН | как в игре |
| 224 | Remove | Удалить | как в игре |
| 225 | SERVER FPS | FPS СЕРВЕРА | |
| 226 | FPS | FPS | — |
| 227 | Server Name : \n\nServer IP :\n\nServer Time : \n\nLocal Time : | Сервер: \n\nIP сервера:\n\nВремя сервера: \n\nМестное время: | переносы строк сохранить |
| 228 | Disabled In Trial | Отключено в пробной версии | |
| 229 | Small / Medium / Large | Мелкий / Средний / Крупный | размер шрифта |
| 230 | Top / Middle / Bottom | Сверху / Посередине / Снизу | положение |
| 231 | Imperial / Metric | Фаренгейт (°F) / Цельсий (°C) | единицы температуры |
| 232 | FuncomDefault | Как в игре | внутреннее имя, но показывается в списке |
| 233 | Crippled | Увечье | как в игре; образец эффекта |
| 234 | Regain 5 health every 10 seconds | Восстанавливает 5 здоровья каждые 10 секунд | образец описания эффекта |

## E. Не переводить — образцы конструктора и внутренние имена (122)

Числа-заглушки (`838 / 933`, `98%`, `19:01`, `9999`, `5500 XP`, `320 ms`, `Medium / 1231 / 65%`,
`Health reduced by 22 (11%)`, `Dealt 54 Damage to Hyrkanian Archer`, `Undead Warrior`, `Stormy`,
`999s`, `89000/600000`) — в игре подменяются живыми значениями. Внутренние имена перечислений и
тестов (`ColdEmbrace`, `ElvenCovenant`, `Felgarth`, `Stormhold`, `Elvanor`, `Vanghoul`, `None`,
`StoreStuff`, `DevMap`, `Modname`, `Modname2`, `Cold Embrace`), координаты `X`/`Y`, буквы компаса
`N`/`E`/`S`/`W` (см. Q2). Полный список — `researches/conan-devkit/hosav-ftext.csv`.

## ВОПРОСЫ

### Q1. Таблица согласована?

- **A) (Рекомендовано)** Да, с моими правками прямо в колонке RU — берёшь в работу.
- **B)** Нет, переделать по замечаниям ниже.
- **D)** Свой вариант.

**Ответ:**

### Q2. Буквы компаса N / E / S / W

- **A) (Рекомендовано)** Оставить латиницу — так на самом компасе игры и на всех картах.
- **B)** Перевести: С / В / Ю / З.
- **D)** Свой вариант.

**Ответ:**

### Q3. Тон подсказок: «вы» или без обращения

Подсказки автора написаны от первого лица («my custom UI»). В переводе я убрал «мой/я» и
обращение («можно включить», «показывает»), чтобы читалось как игра, а не как чат с автором.

- **A) (Рекомендовано)** Без обращения, безлично — как выше.
- **B)** На «вы», сохранив голос автора («вы можете включить мой интерфейс»).
- **D)** Свой вариант.

**Ответ:**

## Что будет после согласования

Опыт фазы 2 эпика (`plans/06`): по 794 ключам мода собрать `ru`-`.locres` (термин → перевод из
этой таблицы), положить его в свой pak по пути локализации, проверить в игре снимком экрана окна
настроек Hosav: подписи русские, мод не тронут. Если игра `.locres` из пака мода не подхватит —
запасной путь через Lua-слой UE4SS (`SetText` по именам виджетов), он у нас уже есть.
