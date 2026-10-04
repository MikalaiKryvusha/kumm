# Живой мир Сварога — теория и практика индустрии: уровни детализации симуляции

> **Created:** 2026-10-05 (автономное окно 02:37–03:07)
> **Parent:** `05_architecture.md` этой папки
> **Status:** разведка исследователя: 20+ источников прочитаны целиком (PDF — pdftotext, страницы — чтение); источники, чьи
> страницы не открылись (403), помечены «не проверено»
> **Outbound:** —

## 1. Ступени симуляции — что считает каждая

| Ступень | Что | Примеры с цитатами |
|---|---|---|
| **A. Полная** | тело, анимация, ИИ игры — рядом с игроком | S.T.A.L.K.E.R.: онлайн в радиусе «usually it is about 150 meters» ([интервью](https://www.gamedeveloper.com/game-platforms/interview-inside-the-ai-of-i-s-t-a-l-k-e-r-i-)); Assassin's Creed Unity: «limit of 40 real AIs and 120 high resolution models… 10,000 crowd NPCs are on screen» ([GDC 2015](https://gdcvault.com/play/1022411/Massive-Crowd-on-Assassin-s)) |
| **B. Упрощённая в кадре** | дешевле анимация, шаг, частота | Wißner: путь «just select any route», реже обновления до «direct jump to the desired destination», 8–10 уровней ([2010](https://d-nb.info/1250173124/34)); Hitman: «1200 agents simulated, 500 on-screen», «Possession system – On-demand upgrade agent to full NPC AI» ([GDC Europe 2012](https://media.gdcvault.com/gdceurope2012/Presentations/Programming/Kasper_Fauerby_Programming_CrowdsInHitman.pdf)) |
| **C. Заместитель с личностью (наша книга)** | без тела, грубый граф, события по времени, бой в цифрах | S.T.A.L.K.E.R.: «does not play animations or sounds, does not manage his inventory actively, does not build detailed and smooth paths»; Chenney: «jumping them from intersection to intersection» — 12 800 машин за 0.07 с реального времени на секунду ([GDC 2001](https://pages.cs.wisc.edu/~schenney/research/culling/chenney-gdc2001.pdf)); Brom (IVE): уровни, задача на срезе дерева «executed atomically» ([IVA 2007](https://artemis.ms.mff.cuni.cz/main/papers/IVE_IVA07.pdf)); Watch Dogs: Legion: «They really live at that address… we actually simulate the path they take» ([Game Developer](https://www.gamedeveloper.com/design/how-watch-dogs-legion-s-play-as-anyone-simulation-works)); Kingdom Come: Deliverance 2: «All the NPCs are doing their daily routines… even when the player is long gone… nearly 2400» ([GDC 2026](https://schedule.gdconf.com/session/supporting-thousands-of-npcs-in-kingdom-come-deliverance-kingdom-come-deliverance-ii/915120)) |
| **D. Совокупность** | не личности — счёт и темп | Brom: «only their total number is remembered by the area»; Osborne & Dickinson: группа как одна сущность (по пересказу, первоисточник 403); Sunshine-Hill: средняя населённость и темп входа на отрезок пути |
| **E. Ещё не существует — рождается с «алиби»** | создаётся по требованию с правдоподобной историей | Sunshine-Hill: «it is impossible for the player to determine whether an NPC has always been around or whether they were just given an alibi a couple of seconds ago» · «Generate details lazily… When first required, not before, and not after» ([Game AI Pro](https://www.gameaipro.com/GameAIPro/GameAIPro_Chapter37_Alibi_Generation_Fooling_All_the_Players_All_the_Time.pdf)) |

**Выбор ступени — по заметности, не по расстоянию.** LOD Trader (Sunshine-Hill, [Game AI Pro ch.14](http://www.gameaipro.com/GameAIPro/GameAIPro_Chapter14_Phenomenal_AI_Level-of-Detail_Control_with_the_LOD_Trader.pdf))
минимизирует вероятность, что игрок заметит «разрыв правдоподобия»: **неправдоподобное сейчас**, **разрыв с памятью**
(«a character disappearing while momentarily around a corner, or having been frozen in place for hours while the player
was away»), **неправдоподобное долгое поведение**. С порогами по расстоянию «it was necessary to set the threshold distances
so close that things like low-quality locomotion could be clearly seen».

## 2. Переходы, согласованность, догонялка

- **Цель согласованности** (Chenney): «make sure things appear in roughly the right place at roughly the right time» и всё,
  что зритель потом увидит, «must be consistent with those inferences».
- **Две ловушки** (Warhorse / Plch et al., [AIIDE 2014](https://cdn.aaai.org/ojs/12705/12705-52-16222-1-2-20201228.pdf)):
  «The world state is either completely conserved, which is implausible if the player was away for a longer time, or
  randomly regenerated, which is implausible if the player was away for just a few seconds».
- **Появление:** «прибытие» (вошёл в зону в известном состоянии) лучше «раскрытия» (зона показалась целиком); никогда не
  рождать в кадре — «characters got into the sector the normal way» (Sunshine-Hill).
- **Память места** (Brom): кто был виден — помнит своё место; остальных расставить по правилам комнаты **до** того, как
  игрок войдёт («when s/he enters the village»).
- **Недоделанное дело** (Brom): конец каждого дела — событие в календаре; при подъёме детали дело «partially evaluated» и
  подцель ищется «carefully».
- **Раннее алиби:** «Waiting too long to generate an alibi may make it impossible to find one which is consistent» · «If the
  player were to see a character going home to a particular building, that character had better keep going home to that
  same building».
- **Гистерезис ухода** (Brom, Sunshine-Hill): уменьшать деталь лишь когда нужны ресурсы, вдали **или** после N невидимости.
- **Догонялка по интегралу** (Plch et al.): «if an NPC playing cards… should win a coin every minute, but is updated in 3
  minute intervals, it should receive 3 coins in each update»; дело, укладывающееся в пропуск, выполняется сразу, остаток
  переносится.
- **Состояние по требованию, а не опросом** (Graham, [Game AI Pro Online 2021](http://www.gameaipro.com/GameAIProOnlineEdition2021/GameAIProOnlineEdition2021_Chapter02_Efficient_Event_Based_Simulations.pdf)):
  «turning those per-frame updates into an event-driven update system… The rest is mathematically derived on demand» ·
  «Time-slicing reduces spikes; it doesn't improve overall framerate».
- **Разогрев:** Talk of the Town гонит историю грубо, а последнюю неделю — в полной детали; Sunshine-Hill: «start everyone at
  home and run them for a few in-game hours as part of the first frame».

## 3. Бой и экономика вдали — проверенные модели

- **Ланчестер** (Stanescu, Barriga, Buro, [AIIDE 2015](https://cdn.aaai.org/ojs/12780/12780-52-16297-1-2-20201228.pdf)):
  линейный закон — «Law of Ancient Warfare… battles fought with edge weapons»; общий dA/dt = −α·A^(2−n)·B, для StarCraft
  лучший порядок 1.56; точный исход мелкой стычки «PSPACE-hard». Для ближнего боя Сварога — n ≈ 1–1.5 (вывод исследователя).
- **Ланчестер предсказывает размер выжившей армии, но не КТО выжил** — нужна политика выбора целей, и «All the combats
  models are very sensitive to the target selection policy» (Uriarte & Ontañón, [arXiv](https://arxiv.org/pdf/1605.05305)).
- **Автобой Bannerlord:** удар `(0.5+0.5·rand)·40·(P_att/P_def)^0.7` с моралью ([gist](https://gist.github.com/jzebedee/be076d28f162c8d05fd7d2d72109a46f)).
- **Экономика — только открытая** (Ultima Online, [Simpson](https://dergigi.com/assets/files/UO-Economics.pdf)): замкнутая
  петля умерла от накопительства — «no longer resources available to spawn creatures and their loot. The result: the world
  became boring»; лечение — «disconnect the output from the input»: кран сверху, сток снизу. Торговцы разорялись («piles of
  things no one wanted and no cash») — лечение: скупать понемногу, «say 10 an hour». Самый принимаемый игроками сток —
  расходники.

## 4. Грабли, описанные другими

1. Пороги по расстоянию или съедают бюджет, или видны глазом (Sunshine-Hill).
2. «Всё или ничего» — разрывы истории и рывки при смене центра (Brom); «сохранить» и «перегенерировать» — оба неправдоподобны.
3. Неверный темп населения: «If the entry rate is too high, the bookstore will start out deserted and quickly fill up; if
   it's too low, the bookstore will become deserted over time».
4. Смещение заместителя: прокси Chenney был систематически быстрее — сверять со статистикой полной симуляции.
5. Цена заместителя растёт линейно — нужна ступень совокупности и чистка книги.
6. Ручная работа: каждое дело нужно уметь выполнить «атомарно»; описание поведения выросло на ~50 % (Brom).
7. Богатое скрытое состояние вредит на масштабе: «the utility of detailed NPC representation is inversely proportional to
   the number of NPCs» (Zubek, [Game AI Pro 3](http://www.gameaipro.com/GameAIPro3/GameAIPro3_Chapter34_1000_NPCs_at_60_FPS.pdf)).
8. Симуляция против сюжета: S.T.A.L.K.E.R. упростил окружающее поведение из-за сюжета; Radiant AI урезали.
9. Экономика: накопительство, разорённые торговцы, «печать» золота.
10. Раздувание сохранения: место в сохранении — тоже ресурс; Watch Dogs: Legion выводит из обращения тех, с кем не
    взаимодействовали.
11. «Operate at the level of what the player sees or one layer below» (Тарн Адамс, [Game AI Pro 2](http://www.gameaipro.com/GameAIPro2/GameAIPro2_Chapter41_Simulation_Principles_from_Dwarf_Fortress.pdf)).

## 5. Пять главных правил (внесены в `05_architecture.md`)

1. **У персонажа в каждый миг ровно один хозяин** — игра или книга; переходы — явная выдача и возврат с полным снимком.
2. **Состояние книги — с метками времени и считается формулой** (дело: начало, конец; ребро: время выхода, скорость) —
   догонялка и материализация почти даром.
3. **Считать только то, что игрок потом увидит или выведет** (кто где, жив ли, что несёт, кто чем владеет, следы боя);
   остальное — лениво, детерминированно, и запоминается, как только увидено.
4. **Открытые системы с пределами темпа:** явные краны и стоки, лимиты в час, наблюдатели инвариантов (всё золото, весь
   товар, население фракций).
5. **Бюджет и гистерезис:** фиксированные мс на кадр, материализация из пула и вразбивку, кольца с запасом, никогда не
   появляться и не исчезать в кадре, чистка книги с флагом «важный» (виденный героем).
