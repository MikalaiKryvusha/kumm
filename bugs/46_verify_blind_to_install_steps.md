# Bug 46 — `-Verify` не проверяет файлы шагов `install`, а мод без единого файла раскатывается как `[ok]`

**Status:** 🔴 OPEN
**Severity:** S2 (прибор говорит «чисто», ничего не проверив — класс «зелёное на пустом», `TESTING_FRAMEWORK.md` гейты 4 и 7)
**Version/build:** `Deploy-ModPack.ps1` на KUMM `2103e97` · **When/context:** 2026-10-14 14:38, стенд `tools/fixture-pack.mjs` (пункт
беклога «A fixture pack»)

## Symptom

1. Мод в манифесте без шагов `install` и не `pak` с `modsDir` пака: `-Deploy` печатает `[ok] Camera Control 1.0.4  (0 files)` — без
   предупреждения, что мод ничего не положил.
2. Мод с шагом `install` (`{ from: '.', to: 'Mods/<имя>' }`): `-Deploy` кладёт файл (`game/Mods/Camera Control/seed.txt`), а `-Verify`
   печатает `0 present, 0 missing` и `Verify clean` — файлы шагов `install` он не проверяет вовсе.

Ожидается: мод, положивший 0 файлов, — предупреждение; `-Verify` считает и файлы шагов `install` (present/missing).

## Repro (deterministic)

`node tools/fixture-pack.mjs` (печатает папку стенда) → `powershell -File Deploy-ModPack.ps1 -PackDir <папка> -Deploy` →
`… -Verify`. Наблюдение 14:38: deploy `2/2 mods, 2 files | verify 0 present, 0 missing`; verify `0 present, 0 missing … Verify clean`.

## Forensics

`Invoke-DeployTarget` (`Deploy-ModPack.ps1` ≈725–752): файлы кладут две ветки — `Install-PakMod` (kind `pak` + `pack.modsDir`) и цикл по
`$m.install`; при `$total -eq 0` всё равно `Ok "… ($total files)"`. Сверка `-Verify` — не прочитана (следующий шаг).

## Root cause / Hypotheses

`[AI]` Гипотеза: `-Verify` строит список ожидаемых файлов только из паков (`modlist.txt`, `Install-PakMod`) и конфигов, а шаги `install`
(копирование деревьев UE4SS-модов Palworld) в список не попадают. Проверить: какие моды пака владельца идут шагами `install` — если это
Lua-моды Palworld, их `-Verify` сейчас не видит.

## Fix plan

1. Прочитать ветку `-Verify`; добавить в неё файлы шагов `install` (тот же список, что копирует `Copy-Tree`).
2. В раскатке: `$total -eq 0` и не `-Plan` → `Warn`, не `Ok`.
3. Стенд `tools/fixture-pack.mjs`: проверки «раскатка положила 2 файла», «`-Verify` 2 present», «удалён файл → `-Verify` 1 missing,
   код 1» — красный на нынешней версии, зелёный после правки.
4. Прогон по паку владельца `-Verify -PackDir <Palworld>` до и после — на реальном мире.

## Decisions made without the owner

— (баг открыт)

## Links

`bugs/03_DONE_palworld_shaped_assumptions.md` (первый стенд), STATUS — пункт «A fixture pack».
