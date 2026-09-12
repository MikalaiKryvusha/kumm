# Интервью #003 — HUD мода Hosav: строки из байткода, на вычитку

> **Заведено:** 2026-09-12 ~15:10 +03:00 · **Кому:** владельцу · **Родитель:** интервью #002
> (принято 12.09) · **Статус:** ✅ **ПРИНЯТО ВЛАДЕЛЬЦЕМ 2026-09-12 ~15:20** («вычитал — берём это в мод»),
> с одной его правкой: строка 240 ` +{0} XP ` остаётся английской · **Цена ошибки:** низкая — правка строки и
> пересборка `.locres` занимают пару минут, в игре видно сразу.

## Откуда взялись эти строки и почему их не было в #002

Разборщик `ftext_extract.py` искал `FText` только в ДАННЫХ ассета (форма с префиксом длины) и
проходил мимо второй формы — литералов, вкомпилированных в **байткод Blueprint**
(`EX_TextConst` → source, key, namespace, без префиксов длины). Именно там живут строки-шаблоны
виджетов и слова, которые в них подставляются. Разборщик починен: 794 ключа → **939**.

Пять строк владелец согласовал сразу, по своему вопросу про класс брони — они уже внесены в
таблицу #002 «Добавление №1» и **работают в игре**: `Light/Medium/Heavy` → «Лёгкая/Средняя/Тяжёлая»,
`dr` → «сниж.», `dps` → «ур/с». Ниже — оставшийся 61 случай.

## Как читать таблицу

- **«—» в колонке RU = НЕ переводить.** Так помечены (а) чистые шаблоны, где кроме `{подстановок}`
  и чисел ничего нет; (б) три отладочные строки автора, которые на экран не выходят; (в) суффиксы
  чисел `k` и `m` — по ним отдельный вопрос ниже.
- **Фигурные скобки трогать нельзя** — это подстановки движка. Имена внутри `{}` перенесены дословно.
- Строки, отличающиеся только пробелами по краям, движок различает, а таблица — нет: они получат
  один и тот же перевод. Это правильно и так и задумано.
- Колонка «примечание» называет виджет-хозяин и сколько раз строка встречается.

## Таблица — 61 строка (22 с предложенным переводом, 39 помечены «не трогать»)

| № | EN | RU (предложение) | примечание |
|---|---|---|---|
| 240 |  +{0} XP  | — | **решение владельца 12.09: оставить как есть** — «XP» на HUD уже английское, менять только здесь было бы вразнобой · W_Kill_xp ×1 |
| 241 |  -- | — | только подстановки и числа — переводить нечего · W_SmoothHP ×1 |
| 242 |  Follower - {0} {damage} to {1}  |  Спутник — {0} {damage} по {1}  | журнал урона спутника · W_DamageShown_Thralls ×1 |
| 243 |  {0}  | — | только подстановки и числа — переводить нечего · W_DamageShown,W_DamageShown_Log,W_DamageShown_Thralls… ×8 |
| 244 |  {0} {dmg} to {1}  |  {0} {dmg} по {1}  | журнал урона; {1} — «вам» или «вашему спутнику» · W_DamageShown,W_DamageShown_Log ×2 |
| 245 |  {0}%  | — | только подстановки и числа — переводить нечего · W_SmoothHP ×1 |
| 246 |  {1}{hour} : {0}{minutes}   | — | только подстановки и числа — переводить нечего · W_SmoothHP ×1 |
| 247 |  {hour} : {minutes}  | — | только подстановки и числа — переводить нечего · W_SmoothHP ×1 |
| 248 | -200 ms  | — | только подстановки и числа — переводить нечего · W_SmoothHP ×2 |
| 249 | -{text} | — | только подстановки и числа — переводить нечего · W_EnemyHealthbar_InHUD ×1 |
| 250 | 0 | — | только подстановки и числа — переводить нечего · W_SmoothHP ×2 |
| 251 | Add Thrall to Party | Добавить раба в отряд | радиальное меню; «раб» — как в игре · ModController_UI_Hosav ×1 |
| 252 | Admin has not enabled the option to invite any players outside your clan | Админ не разрешил приглашать игроков вне клана | сообщение отказа · PlayerPartyComponent_UIH ×1 |
| 253 | bonus damage | доп. урон | подпись в журнале урона · W_DamageShown,W_DamageShown_Log,W_DamageShown_Thralls ×3 |
| 254 | Could not get PlayerCount! GetSharedDebugInfo is None | — | отладочная строка автора, на экран не выходит · W_SmoothHP ×1 |
| 255 | damage | урон | подпись в журнале урона · W_DamageShown,W_DamageShown_Log,W_DamageShown_Thralls ×3 |
| 256 | DEAD | МЁРТВ | над полосой здоровья соклановца · W_UI_ClanMate_HealthAndStamina ×1 |
| 257 | Follower party disbanded | Отряд спутников распущен | PlayerPartyComponent_UIH ×1 |
| 258 | Gamepad Input detected, disabling Minimap to prevent input issues. | Обнаружен геймпад — мини-карта отключена, чтобы не мешать управлению. | ModController_UI_Hosav ×1 |
| 259 | Health reduced by {hp} / {percenthp}% | Здоровье снижено на {hp} / {percenthp}% | подсказка о потерянном здоровье · Old,W_SmoothHP,W_SmoothHP_Horse ×5 |
| 260 | HealthCustomColor is {bool} | — | отладочная строка автора · W_ExampleWidget_User ×1 |
| 261 | Invite Player To Party | Пригласить игрока в отряд | радиальное меню · ModController_UI_Hosav ×1 |
| 262 | k | — | суффикс тысяч у чисел (202,79k). Перевести — «тыс», но станет длиннее · BPFL_Hosav_UI ×2 |
| 263 | m | — | суффикс миллионов. Перевести — «млн» · BPFL_Hosav_UI ×1 |
| 264 | Max | Макс | предел шкалы · W_SmoothHP ×1 |
| 265 | Player is unavailable | Игрок недоступен | PlayerPartyComponent_UIH ×1 |
| 266 | Player party disbanded | Отряд игроков распущен | PlayerPartyComponent_UIH ×1 |
| 267 | Remove Player from Party | Убрать игрока из отряда | радиальное меню · ModController_UI_Hosav ×1 |
| 268 | Remove Thrall from Party  | Убрать раба из отряда  | радиальное меню · ModController_UI_Hosav ×1 |
| 269 | Successfully bound kill xp to player via UI | — | отладочная строка автора · W_Kill_xp ×1 |
| 270 | Wait a bit before sending another invite | Подождите, прежде чем звать снова | PlayerPartyComponent_UIH ×1 |
| 271 | you | вам | подставляется в «{0} {dmg} по {1}» · W_DamageShown_Log ×1 |
| 272 | your Follower | вашему спутнику | там же · W_DamageShown_Log ×1 |
| 273 | Your follower party is already full | Отряд спутников уже полон | PlayerPartyComponent_UIH ×1 |
| 274 | {0} | — | только подстановки и числа — переводить нечего · W_PopupDamage,W_UI_ClanMate_HealthAndStamina ×4 |
| 275 | {0}  | — | только подстановки и числа — переводить нечего · W_DamageShown_Thralls,W_SmoothHP ×5 |
| 276 | {0}   | — | только подстановки и числа — переводить нечего · W_PopupDamage ×2 |
| 277 | {0} ms  | — | только подстановки и числа — переводить нечего · W_SmoothHP ×2 |
| 278 | {0}! | — | только подстановки и числа — переводить нечего · W_PopupDamage ×1 |
| 279 | {0}% | — | только подстановки и числа — переводить нечего · Old,W_EnemyHealthbar_InHUD,W_ExampleWidget_User… ×7 |
| 280 | {armortype} / {armor} / {damagereduction}% | — | только подстановки и числа — переводить нечего · Old,W_SmoothHP_Horse ×3 |
| 281 | {armortype} / {armor}{suffix} / {damagereduction}% | — | только подстановки и числа — переводить нечего · W_SmoothHP ×1 |
| 282 | {BuffDesc} | — | только подстановки и числа — переводить нечего · W_HUD_BuffEntry ×1 |
| 283 | {BuffDurationMin} | — | только подстановки и числа — переводить нечего · W_HUD_BuffEntry ×1 |
| 284 | {BuffDuration}s | — | только подстановки и числа — переводить нечего · W_HUD_BuffEntry ×1 |
| 285 | {currentHealth}{suffix} / {maxhealth}{suffixMax} ({percentage}%) | — | только подстановки и числа — переводить нечего · W_EnemyHealthbar_InHUD,W_EnemyHealthbar_Test ×2 |
| 286 | {current} / {max} | — | только подстановки и числа — переводить нечего · Old,W_SmoothHP,W_SmoothHP_Horse… ×10 |
| 287 | {current} / {Max} | — | только подстановки и числа — переводить нечего · W_SmoothHP_TestImplementation ×1 |
| 288 | {current} / {max}  | — | только подстановки и числа — переводить нечего · W_SmoothHP,W_SmoothHP_Horse ×4 |
| 289 | {currrentWeight} / {maxWeight} ({percent}%) | — | только подстановки и числа — переводить нечего · Old,W_SmoothHP ×2 |
| 290 | {currrentWeight} / {maxWeight} ({percent}%)   | — | только подстановки и числа — переводить нечего · W_SmoothHP ×1 |
| 291 | {damage} / {arrmorpen}% / {damagetotal} total | {damage} / {arrmorpen}% / {damagetotal} всего | шапка урона, вариант без суффиксов · Old,W_SmoothHP_Horse ×6 |
| 292 | {damage}{suffix1} / {arrmorpen}% / {damagetotal}{suffix2} total | {damage}{suffix1} / {arrmorpen}% / {damagetotal}{suffix2} всего | то же с суффиксами · W_SmoothHP ×2 |
| 293 | {hour} : {minutes} | — | только подстановки и числа — переводить нечего · W_UI_TimeIndicator ×1 |
| 294 | {level} | — | только подстановки и числа — переводить нечего · W_EnemyHealthbar_Test ×1 |
| 295 | {percent}% ( {time} ) | — | только подстановки и числа — переводить нечего · Old,W_SmoothHP,W_SmoothHP_Horse ×16 |
| 296 | {percent}% ( {time} )  | — | только подстановки и числа — переводить нечего · W_SmoothHP ×3 |
| 297 | {percent}% ( {time} )   | — | только подстановки и числа — переводить нечего · W_SmoothHP ×1 |
| 298 | {xpCurrent} / {xpNeeded} | — | только подстановки и числа — переводить нечего · Old,W_SmoothHP_Horse ×3 |
| 299 | {xpCurrent}{suffix1} / {xpMax}{suffix2} ({xpNeeded}{suffix3}) | — | только подстановки и числа — переводить нечего · W_SmoothHP ×1 |
| 300 | {xpCurrent}{suffix1} / {xpNeeded}{suffix2} | — | только подстановки и числа — переводить нечего · W_SmoothHP ×1 |

## Три вопроса, где решает владелец

### Q1. Суффиксы чисел `k` и `m` (строки 262 и 263)

На HUD опыт показан как `202,79k / 222,35k`. Латинские `k`/`m` — привычный игровой жаргон и
занимают один символ.

- **A) (Рекомендовано)** Оставить `k` и `m` как есть.
- **B)** Перевести: `тыс` и `млн` — станет `202,79тыс / 222,35тыс`, строка вырастет.
- **C)** Свой вариант.

**Ответ:** A — принято вместе с таблицей целиком («в остальном всё супер»).

### Q2. «Раб» или «спутник» в меню отряда

В игре thrall переведён как «раб», follower — как «спутник», и это два РАЗНЫХ понятия в самом моде
(`Add Thrall to Party` и `Follower party disbanded` живут рядом). Предложение — сохранить обе:
«раб» для thrall, «спутник» для follower.

- **A) (Рекомендовано)** Раб = thrall, спутник = follower, как в игре.
- **B)** Везде «спутник» — короче, но теряется различие, которое делает сам мод.
- **C)** Свой вариант.

**Ответ:** A — принято вместе с таблицей целиком.

### Q3. Три отладочные строки автора (`Could not get PlayerCount!…`, `HealthCustomColor is {bool}`, `Successfully bound kill xp…`)

Это следы отладки: они пишутся в служебный вывод, а не на экран. Предложение — не переводить.

- **A) (Рекомендовано)** Не трогать.
- **B)** Перевести тоже — на случай, если где-то всё же покажутся.

**Ответ:** A — принято вместе с таблицей целиком.

## Что будет после ответа

Правки вносятся прямо в эту таблицу, дальше — одна команда пересборки
(`_config/devkit/hosav-ru-entries.py` → `GatherText` кита → `Game.locres`), раскатка
`_config/deploy-localization.py` и проверка кадром в игре. Дорога описана в
`ConanExiles/_config/localization/README.md`.
