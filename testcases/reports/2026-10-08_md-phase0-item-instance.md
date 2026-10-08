# Test run report — Medieval Dynasty фаза 0: где у экземпляра вещи хранить свойство (шаг 0.11)

**Created:** 2026-10-08 10:22 +03:00 · **Run by:** агент (Claude Opus 5.5), автономный час · **Version/build:** Medieval
Dynasty 2.7.0.3, UE4SS 1161; пак `MedievalDynasty`: `KrinikBridge` v10 (`inv <N>`, только чтение)

## 1. Work

Есть ли у отдельной вещи (экземпляра в инвентаре) свои поля, куда можно положить свойство дорожки В — «Острое»,
«Треснувшее», «Закалённое» (`[OWNER]` интервью #008, вопрос 5). Основа — план `plans/16_epic15_phase0_recon_and_stand.md`,
шаг 0.11; кейсы `testcases/TC_md_phase0_item_instance_2026-10-08.md` (I1–I3).

## 2. Contour

Машина владельца, его последний сейв Оксбоу, загруженный маршрутом `tools/route-restart-load.ps1`; только чтение памяти
игры. REAL WORLD: accumulated — сейв владельца (копия `_save-backup\2026-10-08_1007`); data and machine — его игра и ПК;
path — запуск и загрузка, как у него; запись — нет.

## 3. Runs

Окно прогонов: 2026-10-08 10:19 – 2026-10-08 10:22 +03:00 (время в таблице — того же дня).

| # | Время | Команда | Что прочитано |
|---|---|---|---|
| 1 | ≈10:19 | `lua tools/test-bridge.lua _unpacked/KrinikBridge/Scripts/main.lua`; мутант «первый попавшийся инвентарь» | ALL OK; мутант — 1 FAILED (инвентарь сундука вместо героя) |
| 2 | ≈10:20 | `powershell -File tools/route-restart-load.ps1` | запуск → меню 12.2 с → мир 29.3 с |
| 3 | 10:21:36 | `inv 40` в `KrinikBridge/in.txt` | «вещей 12, показано 12» и строки ниже |
| 4 | ≈10:22 | `CloseMainWindow` | процессов игры 0 |

Строки ответа (сокращено): `SimpleLargeBackpack n=1 HP=100 MaxHP=100` · `HoseJoined n=1 HP=100 MaxHP=500` ·
`LongFurHood n=1 HP=100 MaxHP=500` · `Coin n=318689` · `Meat n=112 HP=10 MaxHP=10` · `TunicVest_B n=1 HP=100 MaxHP=1000` ·
`NobleBoots n=1 HP=100 MaxHP=200` · `DriedMeat n=4 HP=60 MaxHP=60` · у всех `Cond=1.0 Fresh=1.0 Note=None Eq=false`.

## 4. Checks

Hygiene: стенд моста ALL OK, мутант краснеет.
Functional run: игра на сейве владельца, команда `inv 40` через мост, прочитан ответ построчно.

- I1 pass — мост v10 загружен, мир через 29.3 с.
- I2 pass — 12 вещей, поля экземпляра читаются (ниже).
- I3 skipped — двух экземпляров одного ID у героя нет, инструментов в сумке нет.

## 5. Found

- `InventoryComponent_C.Inventory_New` — карта **ID вещи → массив экземпляров** `ST_ItemInventorys`; стопка (мясо,
  монеты) — один экземпляр с `Count`.
- **`MaxHP` — своё у каждого экземпляра** и разное (штаны 500, жилет 1000, сапоги 200 при `HP` 100) — родной носитель
  «Закалённое / Треснувшее» (больше / меньше запас прочности); `HP` похоже на проценты — сверить при износе.
- **`NoteDetailsRowName`** — имя-поле экземпляра, у всех `None` — кандидат на метку свойства («Острое» и др.).
- Надетые вещи в этой карте не видны (`Eq=false` у всех) — броня героя отдельно (`ArmorCharacter`).
- Открыто: переживают ли записанные `MaxHP` / метка сохранение и загрузку — прогон с записью и своим слотом сохранения.

## 6. Traces

`D:\Games\Medieval Dynasty (2021)\Medieval Dynasty\Medieval_Dynasty\Binaries\Win64\ue4ss\Mods\KrinikBridge\out.txt`
(строка `inv 40`, 10:21:36); стенд `MedievalDynasty/tools/test-bridge.lua`.

## 7. Verdict

partial — носители найдены и прочитаны живьём (MaxHP экземпляра, метка-имя); запись и переживание сохранения не
проверены.
