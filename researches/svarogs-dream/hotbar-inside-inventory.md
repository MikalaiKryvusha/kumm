# Разведка — панель быстрых действий как часть сумки (выживачи)

> **Created:** 2026-10-14 · по слову владельца: `[OWNER]` «квик экшены становятся частью сумки, как в майнкрафте и других выживачах» ·
> «веб разведка быстрая на эту тему» · 2026-10-14
> **Parent:** `ideas/18_svarog_predmety_v_bystryh_yacheykah.md`
> **Status:** 🔬 быстрая разведка 2026-10-14 (две выдачи поиска); вторая разведка 2026-10-17 — вики Minecraft, Terraria, Valheim, Rust и
> ещё семи игр открыты, исходник событий uGUI прочитан (раздел «Сверка по источникам» в конце)
> **Outbound:** схема — владельцу до кода

## Как это сделано у других

| Игра | Где панель | Перенос | Клавиши |
|---|---|---|---|
| Minecraft | нижний ряд сумки, видна и без сумки | перетаскивание мышью между сумкой и панелью; Shift + щелчок — стопка в другой раздел | 1–9 — выбрать ячейку; навести на вещь в сумке и нажать цифру — вещь уходит в эту ячейку панели |
| Valheim | верхний ряд сумки (8 из 32 ячеек) — он и есть панель | как любая ячейка сумки | 1–8 |
| Терraria, Rust | панель — ряд сумки / «пояс» (по памяти, источника в выдаче нет) | — | — |

Источники: [список клавиш Minecraft — Croma](https://www.croma.com/unboxed/must-know-minecraft-hotkeys-and-keyboard-shortcuts),
[CodaKid — Minecraft shortcuts](https://codakid.com/minecraft-shortcuts/), [перенос в панель Minecraft](https://cloud.binaryage.com/?p=6723)
(низкого доверия); [Valheim — сумка, 8 из 32 ячеек — панель (Keengamer)](https://www.keengamer.com/articles/guides/valheim-1-0-how-to-increase-your-inventory-space/),
[Mobalytics — Valheim inventory](https://mobalytics.gg/gamebase/guides/valheim-inventory-management-guide).

## Что из этого следует для Сварога (`[AI]` предложение, не решение)

1. Ячейки панели — это ряд сумки: та же вещь лежит в одном месте, панель её показывает и жмёт клавишей. Перетаскивание сумка ↔ панель —
   обычный перенос между ячейками; вещь не копируется.
2. Навести на вещь в сумке и нажать цифру — вещь встаёт в эту ячейку панели (приём Minecraft) — дёшево и быстро для луков.
3. Что делает клавиша ячейки — по виду вещи: оружие — взять в руки (смена лука), еда — съесть, зелье — выпить, навык — как сейчас.
4. Панель при открытой сумке не тускнеет — она часть сумки (`[OWNER]` «панель квик экшенов не нужно тонировать при открытой супке»).

Развилки к владельцу: навыки и вещи — в одних ячейках или навыки отдельно; сколько ячеек отдать под вещи.

## Сверка по источникам 2026-10-17 (вторая разведка)

Открыты вики и исходники, список ссылок — в конце раздела. Fandom отвечает роботу ошибкой 402, поэтому страницы Valheim, Rust,
Diablo и Grim Dawn прочитаны через API той же вики (`<вики>.fandom.com/api.php?action=parse`), а вики Stardew Valley закрыта Cloudflare и
прочитана по копии в web.archive.org. «По памяти» в таблице — источник этого не подтвердил.

### Как устроена панель у других

| Игра | Где лежит вещь панели | Ячеек | Мышь: перенос, стопки | Навести + цифра | Клавиша ячейки по виду вещи | Навыки на той же панели |
|---|---|---|---|---|---|---|
| Minecraft | нижний ряд сумки: «the bottom nine slots within the player's inventory»; на экране те же ячейки | 9 (+27 сумки, +рука со щитом) | ЛКМ берёт стопку, кладёт, меняет местами; ПКМ берёт половину или кладёт по одной; Shift+щелчок перекидывает между панелью и сумкой; протяжка раскладывает стопку поровну; щелчок мимо окна выбрасывает вещь | меняет вещь с ячейкой панели местами, в пустую — переносит; F — то же с левой рукой | цифра только выбирает; еду едят, удерживая «использовать» (1,6 с), при полном голоде нельзя | навыков нет |
| Terraria | ряд сумки («a single row of ten») | 10 (+40 сумки, 4 монеты, 4 патрона) | ПКМ берёт одну вещь, Shift — в открытый сундук, Ctrl — в мусор, Alt — «любимое»: сортировка не трогает панель и любимые вещи | нет | цифра выбирает, ЛКМ применяет; зелья — своими клавишами: H выпивает лучшее лечебное из сумки, J — ману, B — все баффы | навыков нет |
| Valheim | верхний ряд сетки 8×4: «8 of which make the hotbar»; ячеек снаряжения нет, надетое подсвечено синим | 8 из 32 | ЛКМ берёт и кладёт, щелчок мимо сетки выбрасывает, ПКМ надевает (и оружие тоже: «active weapon not only on the hot keys»), Shift+ЛКМ делит стопку | нет | 1–8 — взять в руки при закрытой сумке, «mostly the switching of weapons» | навыков нет |
| Rust | одна сумка: подобранное ложится сначала в панель, потом в сумку | 6 (1–6, колесо) | половина стопки — средняя кнопка (`attack3` «Take half a stack») | нет | аптечку «put onto your hotbar and press the corresponding number» или в сумке щелчок → «Use» | навыков нет |
| 7 Days to Die | пояс — отдельное хранилище: сумка «separate from the Toolbelt» | 10 (1–0, колесо), сумка 27–45 | перетащить в нужную ячейку пояса; Shift+ЛКМ — в первую свободную ячейку пояса, обратно тоже Shift+щелчок | нет | вики не говорит | навыков нет |
| Don't Starve | вся сумка — полоса внизу экрана, видна всегда | 15 (+3 ячейки снаряжения) | Ctrl+щелчок делит стопку пополам; Shift+щелчок — в другой сундук | нет | 1–0, −, = — первые 12 ячеек: **еду съедает, инструмент берёт в руки**, на прочем герой говорит реплику | навыков нет |
| Stardew Valley | верхний ряд сумки («the hotbar (the top row of inventory)»); Tab прокручивает ряды на панель | 12 (сумка 12/24/36) | ПКМ берёт одну вещь, Shift+ПКМ — половину, Shift+ЛКМ поднимает вещь в верхний ряд; вынести за окно — выбросить | нет | еду кладут на панель и жмут «действие» (ПКМ) | навыков нет |
| Diablo I | пояс — своя панель для зелий и свитков | 8 (1–8) | — | — | выпить или прочесть | отдельно |
| Diablo II | пояс — отдельное хранилище внутри надетого пояса, только зелья и свитки | 4 столбца × 1–4 ряда | Shift+ЛКМ в сумке отправляет зелье в его столбец пояса; подобранные зелья встают в пояс сами | — | 1–4 или ПКМ — выпить; следующее зелье падает в ячейку сверху; Shift+цифра — отдать наёмнику | отдельно |
| Diablo IV | вещей на панели нет | 4 навыка (1–4) + 2 на мыши | — | — | зелье — своя клавиша Q; эликсиры — из сумки или из колеса действий (E) | только навыки |
| Grim Dawn | общая панель: игроки ставят расходник на клавишу 1; лечебное зелье с версии 1.2 стало навыком со своими кнопками на панели | 10 + вторая панель (Y) | — | — | зелья — свои клавиши E и R | **вместе с вещами** |

### Что из этого следует

1. **В выживачах панель — не ссылка, а место хранения.** Ни в одной из семи игр ячейка панели не указывает на вещь где-то ещё: вещь лежит в
   ячейке. Шесть игр делают панель рядом сумки, 7 Days to Die — отдельным поясом, но вещь и там лежит в нём самом. Поэтому вещь не
   копируется: перенос — одна операция «снять здесь, положить там».
2. **Клавиша ячейки знает вид вещи.** Don't Starve прямо пишет: цифра на еде съедает её, на инструменте берёт его в руки. Valheim — цифра
   берёт оружие в руки. Minecraft, Terraria и Stardew только выбирают ячейку и применяют вещь второй кнопкой — это неудобно в бою с
   луком.
3. **Приём «навести и нажать цифру» есть только в Minecraft.** Остальные обходятся переносом мышью и Shift+щелчком.
4. **Навыков в выживачах нет вовсе**, поэтому первую развилку они не решают. Решают её ролевые игры: Diablo II и IV держат навыки и
   зелья раздельно, Grim Dawn кладёт навыки и вещи на одну панель, но зельям даёт свои клавиши.
5. **Сварог уже живёт по образцу пояса Diablo II.** Ячейки еды и зелий на панели — это ячейки снаряжения `Food`, `Potion1–4` (баг 46,
   декомпиляция), то есть отдельное хранилище по виду вещи, а не ряд сумки.

### Как это делают в Unity (uGUI)

- **Порядок событий** (исходник `StandaloneInputModule.cs`, ветка 2017.1 открытого uGUI). Перетаскивание начинается, когда курсор ушёл
  дальше порога `EventSystem.pixelDragThreshold`. При отпускании кнопки модуль сначала зовёт `OnDrop` у ячейки под курсором
  (`ExecuteHierarchy` ищет обработчик вверх по родителям), потом `OnEndDrag` у исходной ячейки. Щелчок и бросок взаимоисключающие:
  отпускание над той же ячейкой — `OnPointerClick`, иначе — `OnDrop`. Значит, цель решает, принять ли вещь, а источник в `OnEndDrag` только
  смотрит, приняли её или нет.
- **Интерфейсы.** Источник — `IBeginDragHandler`, `IDragHandler`, `IEndDragHandler`; документация: `IBeginDragHandler` без `IDragHandler`
  событий не получает. Цель — `IDropHandler`; источник цель узнаёт из `eventData.pointerDrag`.
- **Значок под курсором.** Пример Unity к `IDragHandler` создаёт объект «icon» под корневым `Canvas`, ставит его последним
  (`SetAsLastSibling`), копирует спрайт и в `OnEndDrag` уничтожает. Значок не должен ловить лучи, иначе `OnDrop` достанется ему самому:
  `CanvasGroup.blocksRaycasts = false` или `Graphic.raycastTarget = false`. Учебник generalistprogrammer к этому добавляет прозрачность
  0,6 на время переноса и возврат на место, если ни одна ячейка вещь не приняла.
- **Обмен.** Цель в `OnDrop` берёт источник из `pointerDrag`, меняет вещи местами **в модели** (инвентарь, снаряжение), интерфейс
  перерисовывается из модели. Бросок мимо: модель не менялась, вещь осталась на месте.
- **Мод поверх чужого интерфейса.** У ячеек панели Сварога уже есть свой `UISlotBase.OnDrop`, и он меняет вещи местами только с другим
  `UISlotBase`. По документации Harmony префикс может пропустить оригинал, а постфикс выполняется всегда; авторы советуют постфикс ради
  совместимости. Для чужого источника (ячейка сумки) нужен префикс на `UISlotBase.OnDrop`: свой случай обработать, остальное отдать игре.

### Ловушки

- **Дублирование и пропажа вещей.** Мод Valheim EquipmentAndQuickSlots держал быстрые ячейки в отдельных инвентарях. Описание версии 2.1.14
  предупреждает, что мод «может уничтожить всю броню»; версия 3.0 несёт команды `eaqs_validate` (переносит перекрытые вещи и вещи за
  пределами сетки) и `eaqs_restorebackup` (возвращает вещи из резервной копии). Вывод: одно место хранения на вещь и один атомарный перенос.
- **`OnEndDrag` может не прийти.** Трекер Unity: при низкой частоте кадров и быстром повторном нажатии после переноса `OnEndDrag` не
  вызывается; затронута 2020.3, ответ — Won't Fix. Кроме того, `ExecuteEvents` шлёт события только включённым компонентам
  (`isActiveAndEnabled`): если сумку закрыли посреди переноса, исходная ячейка `OnEndDrag` не получит и значок останется висеть. Убирать
  значок нужно ещё и в `OnDisable`, а вещь в модели не трогать до броска.
- **Щелчок сквозь значок.** На форуме Unity «дубли при переносе» оказались не ошибкой переноса: щелчок проходил к спаунеру под вещью.
- **Несовместимая ячейка.** Пояс Diablo II принимает только зелья и свитки, ячейки патронов и монет Terraria — только своё. Отказ — до
  броска: ячейка показывает «нельзя», вещь остаётся где была.
- **Бой.** Terraria: цифра, нажатая во время применения вещи, показывает значок смены и меняет ячейку, когда применение закончится.
- **Геймпад.** Перенос uGUI работает только от указателя. Unity даёт навигацию между ячейками (`Selectable`, режимы Automatic и
  Explicit), а перенос на геймпаде делают кнопками «взять» и «положить»; у Stardew на геймпаде LB/RB листают ряды панели, X переносит
  одну вещь.

### Что следует для Сварога (`[AI]` предложение, не решение)

1. Перенос сумка ↔ панель — одна операция над моделью игры (снаряжение `Food`, `Potion1–4`, оружие), а не копия в интерфейсе. Интерфейс
   рисуется из модели.
2. Ячейка панели проверяет вид вещи до броска: подсвечивает «можно» или «нельзя». Отказ оставляет вещь в сумке, на землю она не падает
   (кейс H4 пакета 5).
3. Клавиша ячейки действует по виду вещи, как в Don't Starve: еда — съесть, зелье — выпить, лук или другое оружие — взять в руки. Без
   второй кнопки «применить».
4. Смену оружия посреди выстрела не рвать: нажатая клавиша ждёт конца выстрела, как в Terraria.
5. Значок переноса — на верхнем `Canvas`, `blocksRaycasts = false`, уборка в `OnEndDrag` и в `OnDisable`.
6. Вход в чужой интерфейс — префикс Harmony на `UISlotBase.OnDrop`; вещи, которые игра и так понимает, отдавать ей.
7. Геймпад отложить: у владельца мышь и клавиатура; «взять и положить» кнопками можно добавить позже, если понадобится.

### Развилки владельцу — что говорят источники

- **(а) Навыки и вещи в одних ячейках или раздельно.** Выживачи ответа не дают: навыков у них нет. Diablo II и IV держат навыки и зелья
  раздельно, Grim Dawn — на одной панели, но зелья выносит на свои клавиши. Владелец уже сказал в интервью 015 (В2), что превращение в
  зверя можно повесить «на любую из кнопок квик экшенов, как скил», — это ближе к общей панели. Тонкость: если панель — ряд сумки, навык
  в сумке не хранится. В общей ячейке тогда лежит либо вещь, либо ссылка на навык.
- **(б) Сколько ячеек отдать под вещи.** Источники: Rust — 6, Valheim — 8, Minecraft — 9, Terraria и 7 Days to Die — 10, Stardew и
  Don't Starve — 12 клавиш; Diablo II — 4 столбца зелий, Grim Dawn — 10 общих ячеек и вторая панель. Выживачи держат 8–10 ячеек на
  ряд цифр 1–0. У вещей в Свароге сейчас есть ячейка еды, четыре ячейки зелий в снаряжении и два комплекта
  оружия.

### Источники (открыты 2026-10-17)

- Minecraft: [Inventory](https://minecraft.wiki/w/Inventory), [Heads-up display](https://minecraft.wiki/w/Heads-up_display),
  [Food](https://minecraft.wiki/w/Food)
- Terraria: [Inventory](https://terraria.wiki.gg/wiki/Inventory), [Controls](https://terraria.wiki.gg/wiki/Controls)
- Valheim: [Inventory](https://valheim.fandom.com/wiki/Inventory) (через API вики); мод
  [EquipmentAndQuickSlots](https://thunderstore.io/c/valheim/p/RandyKnapp/EquipmentAndQuickSlots/), описание 2.1.14 —
  [gamepressure](https://www.gamepressure.com/download/valheim-equipment-and-quick-slots-v215-mod/ze12ee1) (по выдаче поиска)
- Rust: [Controls](https://rust.fandom.com/wiki/Controls), [Beginner's Guide](https://rust.fandom.com/wiki/Beginner%27s_Guide),
  [Large Medkit](https://rust.fandom.com/wiki/Large_Medkit) (через API вики), [Keybinds — Facepunch](https://wiki.facepunch.com/rust/Keybinds)
- 7 Days to Die: [Inventory](https://7daystodie.wiki.gg/wiki/Inventory), [Toolbelt](https://7daystodie.wiki.gg/wiki/Toolbelt)
- Don't Starve: [Inventory](https://dontstarve.wiki.gg/wiki/Inventory), [Controls](https://dontstarve.wiki.gg/wiki/Controls)
- Stardew Valley (копии web.archive.org): [Inventory](https://stardewvalleywiki.com/Inventory),
  [Controls](https://stardewvalleywiki.com/Controls), [Energy](https://stardewvalleywiki.com/Energy)
- Diablo I–III: [Belts](https://diablo.fandom.com/wiki/Belts) (через API вики); Diablo IV:
  [клавиши — ProGameTalk](https://progametalk.com/diablo-4/pc-controller-key-bindings/)
- Grim Dawn: [V1.2.0.0](https://grimdawn.fandom.com/wiki/V1.2.0.0), [Build 12](https://grimdawn.fandom.com/wiki/Patch_Notes_Build_12_(Sept_13,_2013))
  (через API вики), [форум Crate — клавиши](https://forums.crateentertainment.com/t/customizing-hotkeys-for-easier-gameplay/101396)
- Unity: [Supported Events](https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/SupportedEvents.html),
  [IDragHandler](https://docs.unity3d.com/Packages/com.unity.ugui@1.0/api/UnityEngine.EventSystems.IDragHandler.html),
  [IBeginDragHandler](https://docs.unity3d.com/Packages/com.unity.ugui@1.0/api/UnityEngine.EventSystems.IBeginDragHandler.html),
  [IDropHandler](https://docs.unity3d.com/Packages/com.unity.ugui@1.0/api/UnityEngine.EventSystems.IDropHandler.html),
  [CanvasGroup.blocksRaycasts](https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CanvasGroup-blocksRaycasts.html),
  [Navigation](https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-SelectableNavigation.html);
  исходники [StandaloneInputModule.cs](https://github.com/Unity-Technologies/uGUI/blob/2017.1/UnityEngine.UI/EventSystem/InputModules/StandaloneInputModule.cs),
  [ExecuteEvents.cs](https://github.com/Unity-Technologies/uGUI/blob/2017.1/UnityEngine.UI/EventSystem/ExecuteEvents.cs),
  [PointerInputModule.cs](https://github.com/Unity-Technologies/uGUI/blob/2017.1/UnityEngine.UI/EventSystem/InputModules/PointerInputModule.cs);
  [трекер — OnEndDrag не вызывается](https://issuetracker.unity.com/issues/665/ienddraghandleronenddrag-is-not-called-when-quickly-pressing-after-a-drag-in-low-frame-rate);
  [форум — дубли при переносе](https://discussions.unity.com/t/onenddrag-problematically-creating-duplicate-dragged-items/839859);
  [учебник generalistprogrammer](https://generalistprogrammer.com/tutorials/unity-drag-drop-system-complete-tutorial-ui-gameplay)
- Harmony: [Postfix](https://harmony.pardeike.net/articles/patching-postfix.html)
