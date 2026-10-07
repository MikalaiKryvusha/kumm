# Bug 25 — Svarog's Dream: окно рецепта («Хлеб») — светлая бумага и бледный текст

**Status:** 🔴 OPEN
**Severity:** S2 — читаемость окна (рулбук О1, Т2); данные не задеты
**Version/build:** SvarogsDream `2a4ed60` · **When/context:** 2026-10-07 21:48, найдено владельцем в своей игре во время закрытия
чата; кадр снят агентом по его просьбе

## Symptom

`[OWNER]` «сделай прямо сейчас скриншот, игра уже открыта - светлый диалог очередной нашёл» · 2026-10-07 ≈21:48.
Окно рецепта `UI/ActionBar/ActionBarMain/UIRecipe` (рецепт «Хлеб»: «Смешай муку с водой, добавь одно яйцо, потом запекай 30
минут.», яйцо + мука = хлеб, кнопка «OK») — светлая кремовая бумага с тёмно-зелёной рамкой, заголовок и текст бледно-серые
(Gabriela). Ожидается по рулбуку О1: тёмная бумага, светлый текст, как у писем и разговоров; контраст текста ≥ 4.5 (Т2).

## Repro (deterministic)

Кадр владельца: `SvarogsDream/_harness/owner1.webp` (вне git). Окно открывается рецептом (у очага/книги рецептов); пультом —
`call CookingManager ShowPoetry …` открывает то же окно записки (досье, раздел пульта), рецепт — пока не найдено как.

## Forensics

Путь окна — `UI/ActionBar/ActionBarMain/UIRecipe` (`findall UIRecipe`, 21:48). Записки в том же окне (поле
`…/UIRecipe/Poetry/PoetryMessage`) тёмные; ветка рецепта, видимо, своей подложкой мимо `Letters.cs`.

## Root cause / Hypotheses

1. `Letters.cs` темнит бумагу записки, но у рецепта — другой фон/спрайт внутри `UIRecipe`, мимо правила.

## Fix plan

`dump UI/ActionBar/ActionBarMain/UIRecipe 4` при открытом рецепте → какая Image светлая → в правило тёмной бумаги; контраст
`tools/contrast.py`.

## Decisions made without the owner

(при закрытии)

## Links

`SvarogsDream/docs/UI_RULEBOOK.md` О1, Т2; `ideas/07`; баг 24 (окно разговора).
