# Bug 46 — мод без строк `verify` проверяется молча «никак» (`Verify clean`), а мод без единого файла раскатывается как `[ok]`

**Status:** 🔴 OPEN
**Severity:** S2 (прибор говорит «чисто», ничего не проверив — класс «зелёное на пустом», `TESTING_FRAMEWORK.md` гейты 4 и 7)
**Version/build:** `Deploy-ModPack.ps1` на KUMM `2103e97` · **When/context:** 2026-10-14 14:38, стенд `tools/fixture-pack.mjs` (пункт
беклога «A fixture pack»)

## Symptom

1. Мод в манифесте без шагов `install` и не `pak` с `modsDir` пака: `-Deploy` печатает `[ok] Camera Control 1.0.4  (0 files)` — без
   предупреждения, что мод ничего не положил.
2. Мод с шагом `install` (`{ from: '.', to: 'Mods/<имя>' }`) и без строк `verify`: `-Deploy` кладёт файл
   (`game/Mods/Camera Control/seed.txt`), а `-Verify` печатает `0 present, 0 missing` и `Verify clean` — проверять ему нечего (сторожевые
   пути мода задаёт его список `verify`), и он молчит об этом.

Ожидается: мод, положивший 0 файлов, — предупреждение; включённый мод, которому `-Verify` нечего проверить, — предупреждение.

## Repro (deterministic)

`node tools/fixture-pack.mjs` (печатает папку стенда) → `powershell -File Deploy-ModPack.ps1 -PackDir <папка> -Deploy` →
`… -Verify`. Наблюдение 14:38: deploy `2/2 mods, 2 files | verify 0 present, 0 missing`; verify `0 present, 0 missing … Verify clean`.

## Forensics

`Invoke-DeployTarget` (`Deploy-ModPack.ps1` ≈725–752): файлы кладут две ветки — `Install-PakMod` (kind `pak` + `pack.modsDir`) и цикл по
`$m.install`; при `$total -eq 0` всё равно `Ok "… ($total files)"`.
`Invoke-VerifyTarget` (≈640–672, прочитано 14:39): проверяет у каждого мода пути из его списка `verify` в манифесте, `userConfig`, паки по
`modlist.txt` и `steam_emu`. Файлы шагов `install` проверяются, только если автор пака вписал их сторожевые пути в `verify` — так задумано.

## Root cause

Поправка 14:39 (первая запись этого раздела, 14:38, называла дефектом «`-Verify` не видит шаги `install`» — неверно, см. выше): у модов
стенда нет `verify`, проверять было нечего. Дефект уже: мод без строк `verify` и не покрытый `modlist.txt` проверяется молча «никак», а
итог — `Verify clean`; раскатка такого мода с 0 файлов — `[ok]`. Проверить на паке владельца: есть ли включённые моды без `verify`.

## Fix plan

1. `-Verify`: включённый мод без `verify` и без покрытия `modlist.txt` → `Warn "<мод>: nothing to verify"` (не молчать).
2. В раскатке: `$total -eq 0` и не `-Plan` → `Warn`, не `Ok`.
3. Стенд `tools/fixture-pack.mjs`: модам — `verify` на положенный файл; проверки «раскатка положила 2 файла», «`-Verify` 2 present»,
   «удалён файл → `-Verify` 1 missing, код 1», «мод без `verify` → предупреждение» — красный на нынешней версии, зелёный после правки.
4. Прогон по паку владельца `-Verify -PackDir <Palworld>` до и после — на реальном мире.

## Decisions made without the owner

— (баг открыт)

## Links

`bugs/03_DONE_palworld_shaped_assumptions.md` (первый стенд), STATUS — пункт «A fixture pack».
