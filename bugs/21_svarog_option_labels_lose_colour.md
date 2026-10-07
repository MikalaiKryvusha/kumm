# Bug 21 — Svarog's Dream: подписи вариантов «(Уйти)», «(Торговля)», «(Начать Квест)» в нашем переводе без цвета автора

**Status:** 🔧 fix pending verification (в игре не видено)
**Severity:** S2 — видимая игроку потеря оформления автора на всех переведённых вариантах с подписью; данные не задеты
**Version/build:** SvarogsDream `f500c70` и раньше · **When/context:** 2026-10-07 ≈11:33, подготовка партии лавок (эпик 14, фаза 2)

## Symptom

Машинный словарь игры хранит варианты ответа так: «Not yet. <color=#8C0A0A>(Leave)</color>», а наш `zz_dialogue.txt` — «Not
yet. (Leave)=Пока нет. (Уйти)». По коду игры вывод: наш перевод подставляется, но подпись в скобках теряет цвет автора; если перевод
опаздывает (шаблон с числами), игрок видит машинный вариант. В игре не наблюдалось — вывод из кода и словарей.

## Repro (deterministic)

`python -I tools/dialogue_keycheck.py "D:/Games/Svarog's Dream" <zz_dialogue.txt коммита f500c70>` → `missed 17`, код 1.

## Forensics

`Fluent/OptionsPresenter.cs` (декомпиляция `Assembly-CSharp`, 2026-10-07), строки 153–162:

```
componentInChildren.text = option.OptionText;
componentInChildren.text = componentInChildren.text.Replace("(Leave)", "<color=#8C0A0A>(Leave)</color>");
… (Fight)/(Combat)/(Attack) #B73700 · (Trade) #1C325C · (Start the quest) → "(Start the Quest)" #0E005E ·
(Start the siege) → "(Start the Siege)" #0E005E · (Quest Direction) #005C4E · (Decision) #7A3691
```

XUnity `Config.ini`: `TextGetterCompatibilityMode=False`, `HandleRichText=True`. Машинный словарь: окрашенных ключей «(Leave)» 25,
«(Trade)» 12, «(Fight)» 5, «(Quest Direction)» 3, простых — 0. Наших реплик с подписью игры — 98 из 127 со скобками в конце.

## Root cause

Генератор `tools/dialogue_xunity.py` писал ключ в форме исходной строки кода, а игра меняет текст варианта уже после его записи:
точный ключ XUnity подставляет в первом присваивании, `Replace` по русскому ничего не находит — цвета нет; при опоздании перевода
`Replace` красит английский, и XUnity ищет окрашенный ключ, которого у нас не было.

## Fix

`tools/dialogue_xunity.py` → `OPTION_COLORS`, `option_colored()`: русская подпись в скобках получает тег цвета игры; второй ключ —
английский в окраске игры (с её «Start the Quest»). Проверка `tools/dialogue_keycheck.py` стоит в `translation_deploy.sh`.
TWINS: searched `Replace("(` по всей декомпиляции `Assembly-CSharp` (2026-10-07 11:39) — 2 файла: `Fluent/OptionsPresenter.cs`
(девять подписей, все в `OPTION_COLORS`) и `ExpansionModelSelector.cs:81` (убирает «(Clone)» из имени объекта — не текст, не наш случай).
До DONE — случаи D3–D5 и K1 в игре (`testcases/TC_svarog_dialogue_translation_2026-10-07.md`).

## Decisions made without the owner

- `[AI]` цвет подписи — ровно цвет автора, русская подпись в тех же скобках; вид не менялся.

## Links

Отчёт `testcases/reports/2026-10-07_svarog-dialogue-option-colours.md` · эпик `plans/14_EPIC_svarog_dialogues_translation.md` (критерий 3).
