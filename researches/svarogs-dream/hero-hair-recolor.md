# Разведка — Сварог: перекрасить волосы 3D-моделей героев в цвета их портретов

> **Created:** 2026-10-17 · по слову владельца: `[OWNER]` «Вопрос на разведку - можно ил будет 3D моделькам героев покрасить волосы в те цвета,
> что у нас в аватарках получились» · 2026-10-17
> **Parent:** портреты героев (планы 20, 28; `SvarogsDream/art/heroes_avatars_color/`)
> **Status:** 🔬 разведка 2026-10-17 16:38 — код игры прочитан, материалы сняты пультом; перекраска не начата
> **Outbound:** ответ владельцу в чате; решение «делать ли» — его

## Ответ

**Да, можно, и дёшево.** Волосы героя — отдельная сетка, её цвет задают два параметра шейдера, а не текстура.

## Как устроено в игре (декомпиляция `Assembly-CSharp.dll`, 2026-10-17)

- `StoryCharacter.hairColor` — у каждого из 62 героев в данных игры свой цвет из пяти: `HairColor { Black, Brown, Blonde, White, Red }`;
  рядом — вид причёски (`hairType`).
- `CharacterSelectionManager.cs:144` — `playerModel.hairColor = storyCharacter.hairColor;` (так же `UnderworldManager.cs:734`,
  `CastSpell.cs:4478`, `FaceStealerConversation.cs:46`, `PathOfNonDoing1.cs:100`).
- `HumanModelSelector.SetCharacterHair` (`HumanModelSelector.cs:~740`): берёт из `worldStateInjector.hairDatabase` префаб
  `HairObject` по паре (вид, цвет), пристёгивает его сетку (`SkinnedMeshRenderer`) к костям модели (`BoneCombiner.AddLimb`) и помечает
  тегом `BodyHair`.

## Материал волос (пульт `mats hair`, 2026-10-17 16:38; выгрузка `SvarogsDream/_harness/mats_hair_2026-10-17.txt`)

| Материал | Шейдер | Цвет |
|---|---|---|
| `MI_Hairs` | `DawnShader/HairShader` | `_RootColor` (0.189, 0.092, 0.000) · `_TipColor` (0.292, 0.142, 0.000) — тёмно-каштановый; текстура только `_HairAlpha` (прозрачность прядей) |
| `MI_Hairs 1` | `DawnShader/HairShader` | `_RootColor` (0.943, 0.437, 0.343) · `_TipColor` (0.745, 0.395, 0.264) — рыжий |
| `MI_Helmet` | `DawnShader/HairShaderV2` | `_RootColor`, `_TipColor`, `_DyedColor`, `_UseBaseColor` |

Остальные «hair» из выгрузки — существа и боги на `Standard`/`Legacy` (Баба Яга, Святовид, орки), к героям не относятся.

## Как перекрасить (`[AI]`, план — не начат)

1. Постфикс на `HumanModelSelector.SetCharacterHair`: сетка волос с тегом `BodyHair` → `MaterialPropertyBlock` с `_RootColor` и `_TipColor`
   этого героя. Один раз на смену модели, без своего `Update`, без копий материала.
2. Цвета на героя — из его портрета: пиксели волос над рамкой лица (каскад Хаара, как в `portrait_recenter.py`), тёмная доля — корень,
   светлая — кончики; таблица `art/heroes_hair_colors.tsv` (герой · корень · кончики), правится руками.
3. Проверка: кадр героя в мире рядом с его портретом, для 3–4 героев разных цветов; глаз владельца.

## Открытые вопросы

- Какой материал у каждого вида причёски (`HairType`): у всех ли `HairShader`, или где-то `V2` с `_DyedColor` — снять `mats` по сетке
  волос героя в мире.
- Освещение и туман мода цвета (`KrinikColorRework`) меняют цвет на экране — подбирать по кадру, а не по числам портрета.
