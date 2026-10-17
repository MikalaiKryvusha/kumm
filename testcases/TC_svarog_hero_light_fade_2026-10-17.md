# Тест-кейсы — свет над героем: плавно вечером и утром

**Created:** 2026-10-17 · **Under test:** `SvarogsDream/src/KrinikColorRework/HeroLight.cs` (префикс `HelpingLightEnabler.Update`, доля силы
`HeroLightFade.Level`), постфикс `PatchHeroLight` (Plugin.cs) — яркость × доля · **Version/build:** сборка KrinikColorRework этого вечера
**Test basis:** `[OWNER]` «стемнело в 21, а свет над головой загорелся в 23 - плохо» · «нужно чтобы свет над головой начинал загораться медленно
с 21 до 22» · «плавно» · «так же плавно гаснет - да» · «время уточню позже» · 2026-10-17. У игры — выключатель: час > 22 или < 6.

## 1. Goal vector

Achieve: с 21:00 до 22:00 свет над героем разгорается от нуля до полной силы, утром так же плавно гаснет; днём его нет.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | WHILE час между 21 и 22, сила света shall расти плавно | пульт `fieldon`/журнал: intensity в 21:15 < в 21:45 < в 22:00 = 1.75 |
| R2 | WHILE день (6–21), свет shall быть выключен | `nightLight` неактивен |
| R3 | IF в руках факел, THEN свет shall не гореть (как у игры) | `nightLight` неактивен |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered |
|---|---|---|
| час | 20:30 · 21:15 · 21:45 · 22:30 · 5:30 · 7:00 | точное утреннее время — владелец уточнит |
| условия игры | без факела | с факелом, подземелье — глазом в следующий заход |

## 4. Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| C1 | 20:30 → свет выключен | boundary | [NOT-TESTED] |
| C2 | 21:15 → свет включён, сила ≈ 0.16 × 1.75 (SmoothStep 0.25) | boundary | [NOT-TESTED] |
| C3 | 21:45 → сила ≈ 0.84 × 1.75 | boundary | [NOT-TESTED] |
| C4 | 22:30 → сила 1.75 | partition | [NOT-TESTED] |
| C5 | 5:30 → сила ≈ 0.5 × 1.75; 7:00 → выключен | boundary | [NOT-TESTED] |
| C6 | кадр в 21:30 → у героя мягкий неполный круг света | use case | [NOT-TESTED] |

## 5. Control cases

| # | Control → expected | Status + evidence |
|---|---|---|
| K1 | `HeroLight.Smooth = false` → в 21:30 света нет, в 23:00 сразу полная сила (как у игры) | [NOT-TESTED] |
