# Тест-кейсы — план 29: сундук красиво, как окно поверженного

**Created:** 2026-10-17 · **Under test:** `SvarogsDream/src/KrinikUIRework/ChestLook.cs`, общая кайма `GoldFrame` (вынесена из `LootLook.cs`)
· **Version/build:** сборка KrinikUIRework этого вечера
**Test basis:** `[OWNER]` «какие некрасивые UI интерфейсы» · «нужно будет делать красиво. как сумки павшего делали. инвентарь» · 2026-10-17;
образец — окно поверженного (`LootLook.cs`, 2026-10-13); рулбук К1 (один язык с сумкой), П8 (склеено без щели).

## 1. Goal vector

Achieve: сундук выглядит одним окном с сумкой героя: тёмная бумага, кайма старым золотом, без рыжих полос, подпись читается, кнопки одного вида.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | WHEN сундук открыт рядом с сумкой, окно shall стоять низом на линии низа сумки и правым краем у каймы сумки | журнал `chest look: … glued True`, кадр |
| R2 | Полосы `Background (2)` shall быть выключены, кайма — старым золотом | кадр |
| R3 | Подпись shall читаться с пробелами | кадр |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered |
|---|---|---|
| окно | сундук | готовка, ковка, разбор, алхимия, торговец — следующие |
| разрешение | 4K | 720p/1080p/2K (рулбук В9) — следующим заходом |

## 4. Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| C1 | `call InventoryEnabler OpenStorage` → кадр: рыжих полос нет, кайма золотом, низ на линии сумки | use case | [NOT-TESTED] |
| C2 | подпись «Ваши вещи в безопасности в этом сундуке.» — с пробелами, светлым цветом подписей | use case | [NOT-TESTED] |
| C3 | кнопки «Забрать все» и «Хранить все» — одного цвета | use case | [NOT-TESTED] |
| C4 | окно поверженного (`OpenLoot`) после выноса каймы в `GoldFrame` — как раньше: кайма на месте | partition | [NOT-TESTED] |
| C5 | журнал мода: `chest look: … glued True` | use case | [NOT-TESTED] |
| C6 | `OpenCooking` и `OpenPotionCrafting` → «+» и «=» между ячейками видны, светлым цветом подписей (было чёрное 0.55 на тёмном) | use case | [NOT-TESTED] |

## 5. Control cases

| # | Control → expected | Status + evidence |
|---|---|---|
| K1 | кадр «было» `_harness/win_Storage_before.webp` (до правки) — полосы, синяя склеенная подпись, разные кнопки | [NOT-TESTED] |
