# Разведка 02 — что забрала уборка диска C 17.08.2026 и что из этого возвращается

> **Создано:** 2026-08-21 · **Родитель:** вопрос владельца в чате 21.08 («настройки OBS слетели,
> может на диске F есть бекап?») · **Статус:** разбор закончен 2026-08-21 ~11:00 +03:00, ничего не
> восстанавливалось — только чтение и пробные прогоны без `-Execute`; решения за владельцем ·
> **Наружу:** 🔴 два предупреждения по безопасности (ниже) и семь дефектов в
> `D:\work\ai_sandbox\KRINIK_AI_DISK_CLEANUP_TOOL` — его автору

## 🔴 Прочесть до любых действий

1. **НЕ запускать `restore.ps1` из набора `F:\_QUARANTINE_C\2026-08-17_2325\`.** Он не проверяет
   поле `removed` и **создаст шестнадцать исключений антивируса на путях зловреда**, которых уборка
   даже не снимала, плюс вернёт шесть зловредных задач планировщика вперемешку с легитимными.
   От срабатывания сейчас спасает только другой дефект — скрипт падает на 22-й записи из-за
   отсутствующего `mal-task-5.xml`. Возвращать штучно, через `Restore-Quarantine.ps1 -Id`.
2. **НЕ запускать `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335 -Execute`**, пока не забраны три
   вещи из раздела 3: в этом наборе лежит **единственный экземпляр** сохранения Elden Ring и
   личное видео `ref.mp4` (3.59 ГБ, съёмка с телефона 04.08.2024).

## Поправка к выводу дневной сессии

В `EXPERIENCE.md` (`EXP-0025`) и в `PROJECT_HISTORY.md` записано, что уборка **повредила базу
профилей драйвера NVIDIA**. Разбор это **не подтвердил**: у каталога `C:\ProgramData\NVIDIA
Corporation\Drs` время записи до сих пор 27.06.2022 — ни один файл в нём не появлялся и не исчезал.
Содержимое `nvdrsdb0.bin` могло быть переписано без следа в каталоге, но проверить это **уже нечем**:
ручное восстановление 21.08 затёрло метки, а самая ранняя теневая копия — от 18.08 23:39, то есть
уже после уборки.

Что остаётся твёрдым: «Восстановить» в глобальных параметрах 3D дало измеренное восьмикратное
улучшение. Что снято: **связь этого с уборкой не доказана** — она правдоподобна по времени и
только. Подробности — `EXP-0027`.

Что уборка с графикой сделала точно: стёрла 25.26 ГБ скомпилированных шейдеров DirectX без отката,
пересоздала `GLCache` целиком (18.08 21:24:44), **сняла задачу автозапуска RTSS** (до сих пор
отсутствует, резервная копия цела) и **перенесла файл подкачки с D: на C:**, отключив автоуправление.

---

# Что забрала уборка 17.08 и что из этого возвращается

Проверял только чтением: ни одного `-Execute`, ни одного восстановления, ни одного перемещения. Пробные прогоны `Restore-Quarantine.ps1` без `-Execute` — запускал, их вывод приведён дословно.

---

## 1. Что уборка на самом деле сделала 17.08

Семь заходов за вечер. Три оставили журнал в `D:\work\ai_sandbox\KRINIK_AI_DISK_CLEANUP_TOOL\reports\`, четыре — **не оставили ничего**.

| время | что | журнал | опись |
|---|---|---|---|
| 21:08:52–21:08:57 | `Run-Safe`, упал на pip-cache | `run_safe_2026-08-17_2108.log` | **нет** (манифест не записался) |
| 21:14:41–21:17:09 | `Run-Safe`, 8 записей | `run_safe_2026-08-17_2114.log` | `2026-08-17_2114\manifest.json` |
| 22:46:05–22:49:05 | `Run-Stage2`, 5 записей + 3 деинсталляции | `run_stage2_2026-08-17_2246.log` | `2026-08-17_2246\manifest.json` |
| 23:25 | `Remove-Deadweight` | **нет** | `2026-08-17_2325\deadweight\manifest.json` |
| 23:29 | `Remove-Deadweight` | **нет** | `2026-08-17_2329\deadweight\manifest.json` |
| 23:35:55–23:41 | `Invoke-Cleanup`, 18 осколков | **нет** | `2026-08-17_2335\manifest.json` |
| ~23:44 | `Move-Pagefile` | **нет** | нет |

### Класс А — ПЕРЕМЕЩЕНО в карантин (обратимо), 10 091 676 963 Б = 9,40 ГиБ

19 записей, метод `quarantine-folder`, все с `"exitCode": 1` (это robocopy «файлы скопированы», не ошибка).

- `2026-08-17_2246`: `orphan-drweb-cureit` — `C:\Users\krinik\Doctor Web`, 1 434 571 534 Б.
- `2026-08-17_2335`: 18 записей, сумма `bytesBefore` = **8 657 105 429 Б** (тулза печатает это как «8,06 GB», потому что делит на 1 ГиБ). Крупнейшие: `orphan-videorepair` 3 587 200 263 · `orphan-jagex` 2 488 467 424 · `orphan-iotlink` 484 334 536 · `orphan-flashintegro` 436 133 541 · `orphan-national-instruments` 432 775 687 · `orphan-bethesda` 318 767 104.

На диске сейчас `F:\_QUARANTINE_C` — **26 175 файлов, 10 092 921 112 Б**. Разница с суммой манифестов (~1,24 МБ) — сами манифесты и резервные копии deadweight. Ни один набор не стёрт, `Clear-Quarantine.ps1` не запускался.

### Класс Б — УДАЛЕНО НАСОВСЕМ (отката нет)

Побайтово, из манифестов (`bytesBefore − bytesLeft`):

- набор `2114`: pip-cache 13 470 649 583 · user-temp 6 572 494 473 · crash-dumps 142 851 658 · nvidia-glcache 19 523 141 · windows-temp 2 496 199 · nvidia-dxcache **0** (`bytesBefore` = `bytesLeft` = 3 821 568, не удалилось ничего) → **20 208 015 054 Б = 18,82 ГиБ**
- набор `2246`: audient-logs 1 840 381 043 · windows-panther 1 200 344 529 · asus-armoury-logs 679 877 296 · solidworks-dumps 244 498 125 → **3 965 100 993 Б = 3,69 ГиБ**

Плюс упавший заход 21:08, у которого манифеста нет вообще, только строки журнала:
```
[nvidia-dxcache] ...  deleted 25,26 GB; 0,00 GB left behind
[live-kernel-reports] ...  deleted 11,65 GB
```
Точных байтов по этим двум **не наблюдал** — их никто не записал.

**Итого удалено без отката: 24 173 116 047 Б (22,51 ГиБ) побайтово + 36,91 ГиБ по округлённым цифрам журнала ≈ 59,4 ГиБ.**

### Класс В — штатная очистка вендора (`native`)

- `npm cache clean --force` — `bytesBefore` 3 166 829 102, `exitCode: 0`.
- `python -m pip cache purge` — **провалилась**: `C:\Python314\python.exe: No module named pip`, и при `ErrorActionPreference = Stop` это убило весь заход 21:08. В 21:14 та же запись прошла уже обычным `delete-contents`.
- `dism /StartComponentCleanup` — `skipped (disabled in catalog)`.

### Класс Г — деинсталляции чужими деинсталляторами (22:46–22:49), резервных копий нет вообще

- `Наследие` / `C:\Program Files (x86)\Legacy_3.0` — `registry entry: GONE`, `folder: GONE`, +1,27 GB.
- `PyCharm Community Edition 2022.2.4` — `registry entry: GONE`, `folder: STILL THERE, 0,00 GB`, +1,30 GB.
- `iTunes {7400380A-CBC7-4263-944C-18D0A0FAEC7A}` — `registry says /I (modify); rewritten to /X (remove)`, `folder: GONE`, +0,36 GB. Отметка времени подтверждает: `C:\Program Files` LastWriteTime = **17.08.2026 22:48:58**.

### Класс Д — настройки, службы, задачи (23:25 и 23:29, без журнала)

Набор `2325`, 40 записей: 4 обычные задачи (**RTSS**, **NVIDIA GeForceNow**, ASUS `P508PowerAgent_sdk`, `UpdateTorrent`) + 6 зловредных задач, 2 службы (`TailscaleFunnelAuto`, `ProtonVPN WireGuard`), значение `HKCU...\Run\DAEMON Tools Lite Automount`, ярлык автозапуска, 5 ключей реестра политик Chrome/Edge, 2 значения `ExtensionManifestV2Availability`, 3 расширения браузера. Плюс 16 исключений Defender, которые **только перечислены**: у всех шестнадцати `"removed": false` и поля `backup` нет.
Набор `2329`: 22 политических исключения Defender сняты (`removed: true`) и 2 расширения удалены.

### Класс Е — системная настройка (`Move-Pagefile`, ~23:44, без журнала)

Автовыбор снят, `D:\pagefile.sys` (системный, 21 ГБ) выведен из списка, объявлен `C:\pagefile.sys 4096 65536`. Сейчас на машине именно так: `AutomaticManagedPagefile = False`, единственная запись `C:\pagefile.sys` InitialSize 4096 / MaximumSize 65536, файл уже вырос до **AllocatedBaseSize 14386 МБ**, PeakUsage 2142 МБ. Прежнее состояние зафиксировано в `MASTER_PLAN.md:16-17` — «ДВА файла подкачки: новый `C:\pagefile.sys` 4 ГБ и старый `D:\pagefile.sys` 21 ГБ».

### Дыра в учёте свободного места

30,74 ГБ в начале 21:08 → 105,75 ГБ в конце 22:49. Но: конец захода 2 — `free on C: at end : 89,35 GB` (21:17:09), начало захода 3 — `free on C: at start: 98,77 GB` (22:46:05). **+9,42 ГБ за 89 минут без единой строчки журнала.** Чем — не наблюдал.

---

## 2. Что из этого объясняет сломанное

### NVIDIA — прямой связи НЕТ, и это доказуемо

Ни один путь настроек NVIDIA в тулзе не упомянут. В `catalog\targets.json` ровно две записи NVIDIA — `nvidia-dxcache` (`...\AppData\Local\NVIDIA\DXCache`) и `nvidia-glcache` (`...\GLCache`), обе — подпапки кэша шейдеров.

Решающее наблюдение: **у каталога `C:\ProgramData\NVIDIA Corporation\Drs` LastWriteTime до сих пор 27.06.2022 18:49:34**, а CreationTime всех шести файлов внутри — 27.06.2022. Время записи каталога меняется, когда в нём появляется или исчезает запись. Оно не менялось. Значит `nvdrsdb0.bin` / `nvdrsdb1.bin` **никто не удалял и не пересоздавал**.

Было ли переписано их СОДЕРЖИМОЕ 17–18.08 — **уже не наблюдаемо**. Твоё ручное восстановление 21.08 (`nvdrsdb0.bin` LastWrite 21.08.2026 9:50:28, `nvdrsdb1.bin` 9:57:07) затёрло время записи, а время записи хранит только последнюю. Самая ранняя копия хоть где-то — в теневых копиях 1 и 2, `18.08.2026 23:39:46`, то есть уже после уборки. Дотянуться до состояния «до 17.08» нечем.

Что уборка **действительно** сделала с графикой:

1. Стёрла 25,26 ГБ скомпилированных шейдеров DirectX без отката. Сейчас в `DXCache` **64 файла, 266,6 МБ**, из них только **18** созданы до 17.08 21:08 — остальное нарастает заново. Каждый ненайденный шейдер компилируется в рантайме, и выглядит это ровно как системные подтормаживания.
2. `GLCache` пересоздан целиком — CreationTime корня **18.08.2026 21:24:44**, хотя журнал обещал `DELETE, no undo (contents, folder stays)`. Папку тоже снесло.
3. **Пропала задача автозапуска `RTSS`** — и это самое интересное, что осталось сломанным прямо сейчас. `Get-ScheduledTask -TaskName RTSS` → ABSENT, процесс RTSS не запущен, при этом `C:\Program Files (x86)\RivaTuner Statistics Server` **на месте**. RTSS — это хук D3D/OpenGL, на котором держатся оверлей и ограничитель кадров; без автозапуска покадровая развёртка ведёт себя иначе по всей системе. Резервная копия задачи цела.
4. Файл подкачки перестал быть системным и растёт по требованию (см. выше). Отдельный, независимый источник рывков. Причинно-следственную связь я не измерял.

Остаточные 13 % я не мерил и приписать их чему-то одному не могу.

### OBS — связь прямая, но только для ОДНОЙ из трёх настроек

Конфиг OBS цел. В карантине нет ничего с OBS: строка `obs` не встречается ни в одном из пяти манифестов. Ни один файл под `%APPDATA%\obs-studio` не создан 17.08 или позже, у `basic\profiles` LastWriteTime до сих пор **02.10.2022 20:42:33** — то есть с 2022 года ни один профиль не появлялся и не исчезал; коллекция сцен 119 814 байт на месте.

Поменялся ровно один файл — `basic.ini`. Теневые копии 1, 2 и 3 держат его **4958 байт, LastWrite 17.08.2026 23:15:49**; живой — **4933 байта, LastWrite 20.08.2026 22:52:52**. Полный построчный диф даёт **пять** расхождений, а не три:

```
<=  AudioEncoder=CoreAudio_AAC          =>  AudioEncoder=ffmpeg_aac
<=  RecAudioEncoder=ffmpeg_pcm_s24le    =>  RecAudioEncoder=ffmpeg_aac
<=  FFExtension=mp4                     (строки в живом файле нет)
<=  Token=ya29.a0AdMD6Ei04rhbg…         =>  Token=ya29.a0AdMD6EiJaaUGG…   (262 символа, [YouTube])
<=  DockState=AAAA/wAAAAD9…             =>  DockState=AAAA/wAAAAD9…       (718 символов, [YouTube - RTMP])
```

**Настройки пережили ночь уборки.** Теневая копия 1 (создана 19.08 0:34:07), 2 (19.08 2:23:54) и 3 (19.08 23:07:08) — все три ещё несут хорошую версию от 17.08 23:15:49. Переписал файл сам OBS при закрытии сессии 20.08 22:52:52 (журнал `2026-08-20 20-15-48.txt`).

Причина по `AudioEncoder` наблюдаема прямо:

- `2026-08-17 19-52-12.txt:80` — `19:52:12.907: [CoreAudio encoder]: Adding CoreAudio AAC encoder`, строка 147 — `- CoreAudio_AAC (CoreAudio AAC)`, строка 311 — `[CoreAudio AAC: 'adv_stream_audio']: settings:` (то есть это был живой кодировщик стрима).
- `2026-08-20 20-15-48.txt:80` — `20:15:48.638: [CoreAudio encoder]: CoreAudio AAC encoder not installed on the system or couldn't be loaded`, дальше восемь раз `Encoder ID 'CoreAudio_AAC' not found`.
- Между этими двумя точками единственное, что убрало код кодировщика, — этап 2 в 22:46–22:49 снёс iTunes. Сегодня `CoreAudioToolbox.dll` не находится нигде на `C:` (рекурсивный поиск, 0 попаданий), `C:\Program Files\iTunes` не существует, и ни в одной теневой копии его нет (все четыре сделаны 19–20.08, уже после).

**Поправка к правдоподобной версии, которая могла до тебя дойти.** Это НЕ «снесли Apple Application Support». Apple Application Support на этой машине **никогда не стоял**:

- `C:\Program Files\Common Files\Apple` и `C:\Program Files (x86)\Common Files\Apple` — у обоих CreationTime И LastWriteTime `14.04.2023 20:55:36`, внутри по одному потомку `Mobile Device Support`. Контроль: у родителей время записи 17.08 сдвинулось (`C:\Program Files` — 22:48:58, `C:\Program Files (x86)` — 23:41:05), значит удаление внутри Apple-папок оставило бы след. Не оставило.
- Записи деинсталляции «Apple Application Support» нет: в кустах только `Bonjour`, `Bonjour SDK`, `Apple Mobile Device Support 16.5.0.12`.
- `HKLM:\SOFTWARE\Apple Inc.` содержит только `Apple Mobile Device Support` и `Bonjour`; в `WOW6432Node` добавляется `Apple Software Update`. Ключа AAS нет.
- В машинном `PATH` нет ни одной записи с Apple или iTunes.
- `D:\Soft\iTunes64Setup.exe` (200 998 888 Б, 14.04.2023) несёт ровно четыре MSI: `AppleMobileDeviceSupport64.msi`, `AppleSoftwareUpdate.msi`, `Bonjour64.msi`, `iTunes64.msi`. Строка «Apple Application Support» встречается в файле **ноль раз** (искал и ASCII, и UTF-16 с вычищенными нулями).

То есть кодировщик приехал вместе с самим iTunes, в `C:\Program Files\iTunes`. Вытащить из этого пакета «отдельный `AppleApplicationSupport64.msi`» **невозможно — его там нет**.

Причина двух остальных значений **не наблюдалась**. `ffmpeg_pcm_s24le` 20.08 был на месте (`2026-08-20 20-15-48.txt:150`: `- ffmpeg_pcm_s24le (FFmpeg PCM (24 бита))`), контейнер не менялся (`RecFormat2=mkv` в обоих файлах). Так что смена `RecAudioEncoder` вполне могла быть твоей собственной. `FFExtension` относится к ветке Custom Output (FFmpeg), которая не активна (`RecType=Standard`, `FFFormat=` пусто) — сегодня она ни на что не влияет.

---

## 3. Что можно вернуть

Три кандидата прошли враждебную проверку. Пробный прогон у всех трёх я выполнил, вывод ниже дословный.

### 3.1 National Instruments — единственный ЗАРЕГИСТРИРОВАННЫЙ продукт, уехавший в карантин

`C:\Program Files (x86)\National Instruments` унесён целиком: 1480 файлов, **432 775 687 Б** — байт в байт с `bytesBefore` манифеста. При этом машина до сих пор считает продукты установленными: **11** записей деинсталляции с «LabVIEW» в имени (`NI LabVIEW Runtime 2015 SP1 f5`, `NI LabVIEW Runtime 2016 f1`, `NI LabVIEW 2015/2016 Run-Time Engine Web Server`, `Real-Time NBFifo`, `2016 Deployment Framework`, `Runtime Interop 2015/2016`, две Non-English Support), и `HKLM:\SOFTWARE\WOW6432Node\National Instruments\Common\Installer` до сих пор читает `NIDIR : C:\Program Files (x86)\National Instruments\` и `NISHAREDDIR : C:\Program Files (x86)\National Instruments\Shared\`. Внутри карантина лежат `Shared\LabVIEW Run-Time\2015\lvrt.dll` (16 177 864 Б) и `2016\lvrt.dll` (16 257 416 Б) — оба настоящие PE-образы. Ни одной копии `lvrt*.dll` больше нет ни в `C:\Program Files\National Instruments` (там остался только огрызок `Shared`, 67 файлов), ни в `System32`/`SysWOW64`. Назначение пусто: `Test-Path 'C:\Program Files (x86)\National Instruments'` → **False**, перезаписывать нечего.

```powershell
# 1. ПРОБНЫЙ ПРОГОН — выполнен, вывод дословно:
Set-Location 'D:\work\ai_sandbox\KRINIK_AI_DISK_CLEANUP_TOOL'
.\Restore-Quarantine.ps1 -Stamp 2026-08-17_2335 -Id orphan-national-instruments
#   === RESTORE DRY RUN  (2026-08-17_2335) ===
#   [orphan-national-instruments]
#     F:\_QUARANTINE_C\2026-08-17_2335\orphan-national-instruments  ->  C:\Program Files (x86)\National Instruments
#   DRY RUN - nothing was changed. Add -Execute to act.

# 2. БОЕВОЙ — из ПОВЫШЕННОЙ консоли (назначение в Program Files (x86)):
.\Restore-Quarantine.ps1 -Stamp 2026-08-17_2335 -Id orphan-national-instruments -Execute
```

Две оговорки. `Move-TreeToQuarantine` (`lib\Common.ps1:400`) зовёт robocopy с `'/MOVE','/E','/R:1','/W:1'` — без `/COPYALL` и `/SEC`, так что ACL не переносятся и дерево унаследует права `Program Files (x86)`. Уезжало оно тем же способом, так что это свойство кругового рейса, а не новая порча. И `/MOVE` **съедает копию в карантине** — второго шанса из этого набора не будет.

Что сломанное приложение действительно падает без `lvrt.dll` — я не проверял, ни одного LabVIEW-приложения не запускал. Это вывод, а не наблюдение.

### 3.2 Сохранение Elden Ring — единственный экземпляр, и он в карантине

`F:\_QUARANTINE_C\2026-08-17_2335\orphan-eldenring-roaming` — 3 файла, **57 938 170 Б**, точно как `bytesBefore`:
```
28967888   76561197960267366\ER0000.sl2
28967888   76561197960267366\ER0000.sl2.bak
    2394   GraphicsConfig.xml
```
`C:\Users\krinik\AppData\Roaming\EldenRing` не существует. Поиск `ER0000.sl2*` и `*.sl2*` по всем пяти локальным дискам (C, D, E, F, J — включая `J:\OLD_HDD`) дал единственное попадание: эту самую пару в карантине. Самой игры нигде не нашлось (обход C/D/E/F/J на глубину 4).

Ничего не сломано прямо сейчас. Важно другое: `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335 -Execute` сотрёт весь набор целиком (8 657 105 429 Б), вместе с этим сохранением. И если переустановишь игру, не вернув папку заранее, она создаст на этом пути пустое сохранение.

```powershell
# ПРОБНЫЙ ПРОГОН — выполнен:
Set-Location 'D:\work\ai_sandbox\KRINIK_AI_DISK_CLEANUP_TOOL'
.\Restore-Quarantine.ps1 -Stamp 2026-08-17_2335 -Id orphan-eldenring-roaming
#   [orphan-eldenring-roaming]
#     F:\_QUARANTINE_C\2026-08-17_2335\orphan-eldenring-roaming  ->  C:\Users\krinik\AppData\Roaming\EldenRing
#   DRY RUN - nothing was changed. Add -Execute to act.

# БОЕВОЙ штатным способом (внимание: это /MOVE, копия в карантине исчезнет):
.\Restore-Quarantine.ps1 -Stamp 2026-08-17_2335 -Id orphan-eldenring-roaming -Execute
```

Для незаменимых данных **безопаснее не так**. Штатный возврат — перемещение: было «один экземпляр в карантине», станет «один экземпляр на `C:`», избыточности ноль. Копией лучше:
```powershell
Copy-Item -LiteralPath 'F:\_QUARANTINE_C\2026-08-17_2335\orphan-eldenring-roaming' `
          -Destination 'C:\Users\krinik\AppData\Roaming\EldenRing' -Recurse
```
Побочное: SteamID папки — `76561197960267366`, это accountID 1638, подозрительно ранний номер. Взгляни сам, твоё ли это сохранение, прежде чем считать его незаменимым.

### 3.3 `ref.mp4` — это не остаток программы, это твоё видео

Вся запись `orphan-videorepair` — один файл: `F:\_QUARANTINE_C\2026-08-17_2335\orphan-videorepair\ref.mp4`, **3 587 200 263 Б**, 05.08.2024 19:20:54. Байт в байт с манифестом, дубликатов нет — искал по имени и по точному размеру на всех пяти дисках.

Что внутри, разобрал по коробкам MP4: `ftyp mp42/isom`, `mdat` 3 586 632 296 Б, `moov` в конце файла. Метаданные съёмки: `realme / realme`, `RMX3301`, `qcom`, приложение `mcpro24fps 039ae`, объектив `24mm, f/1.8`, 59.878452 к/с, кодек `c2.qti.hevc.encoder`; `mvhd` timescale 10000 / duration 5695037 = **569,5 с (9,49 мин)**, дата съёмки 04.08.2024 09:44:09. Не образец от вендора — телефонная съёмка. Подтверждение: те же маркеры `RMX3301|mcpro24fps` нашлись ещё в трёх файлах твоего архива — `J:\OLD_HDD\Pic\Фото\2023\V230705-192844-60fps-auto_exp-tmc_auto_0.mp4` и два от 25.08.2023. И внутри `ref.mp4` по смещению 3 586 635 512 лежит обнулённая старая структура метаданных с живым `moov`, дописанным в конец, — подпись файла, переписанного ремонтной утилитой. Ровно то, о чём предупреждал сам каталог: `"risk": "Если внутри лежат восстановленные тобой видеофайлы — они уедут в карантин, откуда их можно вернуть."`

Возвращать его в `C:\ProgramData\VideoRepair` смысла нет — это 3,59 ГБ обратно на `C:` ни за чем. Забери его к себе:
```powershell
Copy-Item -LiteralPath 'F:\_QUARANTINE_C\2026-08-17_2335\orphan-videorepair\ref.mp4' `
          -Destination 'E:\Video\ref_2024-08-04_realme_mcpro24fps.mp4'
```
Сделать это **до** любого `Clear-Quarantine.ps1 -Stamp 2026-08-17_2335 -Execute`.

Штатный вариант, если всё же надо на место, — пробный прогон выполнен, печатает `orphan-videorepair -> C:\ProgramData\VideoRepair`; боевой `.\Restore-Quarantine.ps1 -Stamp 2026-08-17_2335 -Id orphan-videorepair -Execute`.

### 3.4 Задача RTSS — вне трёх проверенных, но проверил сам, и это единственное графически значимое, что до сих пор отсутствует

Помечаю честно: через ту же враждебную проверку, что три пункта выше, этот кандидат **не проходил**. Я проверил его сам в этой сессии.

`Get-ScheduledTask -TaskName RTSS` → ABSENT. Сам RivaTuner на диске (`C:\Program Files (x86)\RivaTuner Statistics Server` существует), процесс RTSS не запущен. Резервная копия цела: `F:\_QUARANTINE_C\2026-08-17_2325\deadweight\task-rtss.xml`, 1211 Б, разбирается как валидный XML — `URI: \RTSS`, `Command: C:\Program Files (x86)\RivaTuner Statistics Server\RTSS.exe`, `Arguments: /s`, триггер `<LogonTrigger />`, `RunLevel HighestAvailable`.

```powershell
# ИЗ ПОВЫШЕННОЙ КОНСОЛИ. Только эта задача, не через сгенерированный restore.ps1 (см. п.4).
$xml = Get-Content -LiteralPath 'F:\_QUARANTINE_C\2026-08-17_2325\deadweight\task-rtss.xml' -Raw
Register-ScheduledTask -Xml $xml -TaskName 'RTSS' -TaskPath '\' -Force
```
Пробного прогона тут не бывает: у `Register-ScheduledTask` параметра `-WhatIf` нет (проверил — `(Get-Command Register-ScheduledTask).Parameters.ContainsKey('WhatIf')` = False). Проверить можно только тем, что XML читается и содержит правильную команду, — это я сделал.

Тем же способом, если понадобятся: `task-asus-mouse.xml` (1213 Б, `\ASUS\P508PowerAgent_sdk`, тоже ABSENT), `task-updatetorrent.xml` (1275 Б, ABSENT), `task-geforcenow.xml` (1510 Б; это обновлятор GeForce NOW, к локальному рендеру отношения не имеет). Значение автозапуска DAEMON Tools тоже снято и до сих пор отсутствует в `HKCU...\Run` (там сейчас OneDriveSetup, LGHUB, ZeroTierUI, Steam, NVIDIA Broadcast, LosslessScaling, MicrosoftEdgeAutoLaunch, PM2, Docker Desktop), опись — `run-daemon-tools.json`, 206 Б.

### 3.5 OBS — возвращать ЗНАЧЕНИЯ, а не файл

Читаешь так (только чтение, безопасно прямо сейчас):
```powershell
$sc = '\\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Users\krinik\AppData\Roaming\obs-studio\basic\profiles\Krinik\basic.ini'
[System.IO.File]::ReadAllLines($sc) | Select-String -Pattern '^(AudioEncoder|RecAudioEncoder|FFExtension)='
```
и вбиваешь в интерфейс OBS при **закрытом** OBS (иначе он перезапишет при выходе). Порядок:

- `AudioEncoder=CoreAudio_AAC` — только ПОСЛЕ того, как кодировщик снова появится в системе, и только когда свежий журнал OBS напечатает `[CoreAudio encoder]: Adding CoreAudio AAC encoder`. Иначе OBS опять молча свалится на `ffmpeg_aac` и перепишет `basic.ini`.
- `RecAudioEncoder=ffmpeg_pcm_s24le` — сначала вспомни, не ты ли это менял 20.08. Причины со стороны уборки не наблюдалось.
- `FFExtension=mp4` — можно не трогать, ветка неактивна.

---

## 4. Что вернуть НЕЛЬЗЯ

**Всё, что удалено методами `delete-*` и `native`.** Это не мнение, это записано в самой тулзе — `Restore-Quarantine.ps1` явно отказывается: `if ($e.method -eq 'native') { ... no undo: this was a vendor purge command ... }` и `if ($e.method -like 'delete-*') { ... no undo: deleted outright by the owner's decision ... }`. Сюда попадают 24 173 116 047 Б побайтово плюс ~36,9 ГиБ из упавшего захода 21:08: 25,26 ГБ шейдеров DirectX, 11,65 ГБ дампов WATCHDOG (включая `WATCHDOG-20260811-0034.dmp` — улику по зависаниям карты 11.08, которую ты сам разрешил стереть), 13,47 ГБ кэша pip, 6,57 ГБ `%TEMP%`, 1,84 ГБ журналов Audient, 1,2 ГБ Panther, 0,68 ГБ ASUS, 0,24 ГБ дампов SolidWorks, 0,14 ГБ CrashDumps. Копий нет нигде: `wbadmin get versions` → `No backup was found`, File History никогда не настраивалась (`fhsvc` Stopped/Manual, каталога данных нет ни на одном диске), `C:\Windows\System32\config\RegBack` пуст, во всех пяти корзинах только `desktop.ini` по 129 байт.

**iTunes, PyCharm, Legacy_3.0.** `Remove-Product.ps1` вообще не делает резервных копий — в файле нет ни строчки про quarantine или backup, кроме косметической на строке 172. Только переустановка. Причём для CoreAudio единственный наблюдаемо существующий путь — переставить весь пакет `D:\Soft\iTunes64Setup.exe` (iTunes 12.12.8.2), приняв, что он же накатит `Apple Mobile Device Support` / `Bonjour` / `Apple Software Update` поверх нынешних (AMDS 16.5.0.12, InstallDate 20230414 — из того же пакета 2023 года). И это **гипотеза, а не почин**: какой именно файл и по какому пути грузил OBS, наблюдать нечем — `C:\Program Files\iTunes` снесён, описи его содержимого не осталось. После установки требуй, чтобы в новом журнале OBS появилось `[CoreAudio encoder]: Adding CoreAudio AAC encoder`, и только потом трогай `basic.ini`.

**Содержимое базы профилей NVIDIA на состояние до 17.08.** Копии не существует нигде: живые файлы затёрты твоим восстановлением 21.08, самая ранняя теневая копия — 18.08 23:39:46, уже после. Файлов `.nip` на C, D, F нет. `nvdrsdb.bin` по 2 170 640 Б в `DriverStore\FileRepository\nv_dispi.inf_amd64_...` и в `System32\drivers` от 22.07.2026 — это заводская база профилей драйвера, не твои настройки.

**Точка восстановления, которая закрыла бы всё.** Она существовала в момент уборки: журнал `run_safe_2026-08-17_2114.log` сам её напечатал — `79  20260816223300.301309-000  Запланированная контрольная точка`, то есть 17.08 01:33 по местному. Сегодня `Get-ComputerRestorePoint` возвращает **одну** запись: `80, Центр обновления Windows, 20260818232343` (19.08 02:23:43), уже после порчи. Точка 79 вычищена ротацией. Отката тома к 17.08 нет.

**Файл `basic.ini` OBS целиком копировать НЕЛЬЗЯ.** В теневой копии вместе с хорошими кодировщиками лежит старый OAuth-токен `[YouTube] Token=` (262 символа) и старый `DockState=` (718 символов). Копирование файла откатит живой токен Google и раскладку доков. Возвращать только значения, руками.

**`restore.ps1` из набора `2325` запускать НЕЛЬЗЯ** — подробности в п.5. Он вернёт шесть зловредных задач и попытается создать 16 исключений Defender, которых уборка даже не снимала.

**Задача `OOuUqatYMScEf2` (`mal-task-5`)** — манифест утверждает `"backup": "mal-task-5.xml", "removed": true`, но файла на диске нет: в каталоге лежат только `mal-task-1,2,3,4,6.xml`. Единственное сломанное обещание опись во всём хранилище. Возвращать её и не надо, но манифест как полный указатель восстановления — не заслуживает доверия.

**Восемь резервных копий реестра и три папки расширений из набора `2325`** (`pol-chrome-allowlist.reg` 406 Б, `pol-chrome-whitelist.reg` 406 Б, `pol-edge-allowlist.reg` 408 Б, `pol-edge-whitelist.reg` 408 Б, `reg-chrome-forced-install.reg` 390 Б, `pol-chrome-mv2.json` 132 Б, `pol-edge-mv2.json` 133 Б, `ext-xfinder`, `ext-adblocker-*`) — на диске лежат, но сгенерированный `restore.ps1` их молча пропустит: ветвей `browser-extension`, `registry-key`, `registry-value` в нём нет. Руками — `reg.exe import` и копирование папок. Скорее всего и не надо: это как раз политики и расширения, которые снимались как зловредные.

---

## 5. Дыра в самой тулзе: какое правило пропустило настройки

Разбираю от главного к частному. Всё цитируемое — из твоего кода.

### 5.1 У сторожа нет понятия «настройки». Это корень

`lib\Common.ps1` держит два списка. `$BlockedExact` перечисляет `C:\Users\krinik\AppData\Roaming`, `...\AppData\Local`, `C:\ProgramData` — и комментарий над ним прямо объявляет:

> `BlockedExact  - containers. May not be a target themselves, but their children are fair game.`

`$BlockedTrees` защищает несущее в ОС, твои `Documents`/`Videos`/`Pictures`/`Downloads`/`Saved Games`/`source`/`.ssh`, двух вендоров сохранений в LocalLow, CUDA, wsl и Docker. Между каталогом настроек любого вендора и переездом не стоит **ничего**, кроме того, попал ли он в `catalog\targets.json`. `Test-Guard.ps1:54` даже утверждает обратное как требование: `C:\ProgramData\Jagex` стоит в списке `$mustAllow` — «сторож ОБЯЗАН это пропустить». Журнал 21:08 это и печатает в блоке `MUST ALLOW`.

### 5.2 Единственный рантайм-барьер структурно не может защитить настройки

`Test-FolderIsLive` спрашивает одно: лежит ли путь образа процесса или службы ВНУТРИ папки —
```
if ((ConvertTo-ComparablePath $img).StartsWith($p + '\')) { ... }
```
Но каталог настроек по определению не содержит исполняемого файла: exe живёт в `Program Files`, конфиг — в `Roaming`/`ProgramData`. Проверка спасла `Program Files\LGHUB` именно потому, что там лежали бинарники (комментарий в коде это и говорит: «four processes plus a service, with no uninstall entry of its own»). Для `ProgramData\ProtonVPN` или `Roaming\Guild Wars 2` она бесполезна по построению.

### 5.3 ТО САМОЕ ПРАВИЛО, по которому уехал National Instruments

Признак «осколка» у тебя — «нет записи в реестре деинсталляции + файлы старые». Но эта проверка сделана **руками один раз** и заморожена прозой в `catalog\targets.json`. Ни один скрипт её не перепроверяет: `grep -rn -i "uninstall" --include=*.ps1` находит кусты `...\CurrentVersion\Uninstall\*` **только** в `Remove-Product.ps1:44-46`, и то чтобы НАЙТИ продукт для сноса. `Invoke-Cleanup.ps1`, `Scan-Disk.ps1` и `lib\Common.ps1` реестр деинсталляции не читают вообще.

Единственное предусловие, которое каталог умеет выражать, — `requiresAbsent`, и это путь на диске, а не ключ реестра:
```
Invoke-Cleanup.ps1:111   if ($t.requiresAbsent) {
Invoke-Cleanup.ps1:112       if (Test-Path -LiteralPath $t.requiresAbsent) { ... refuse ... }
```
(Полный набор полей записи каталога: `enabled, filePattern, id, measuredGB, method, nativeCommand, path, reclaimEstimateGB, requiresAbsent, requiresAdmin, risk, tier, title, warn, why`. Реестрового предусловия нет ни одного.)

И вот запись, которая из-за этого уехала, `catalog\targets.json:244-251`, целиком:
```json
"id": "orphan-national-instruments",
"title": "Осколок: National Instruments",
"path": "C:\\Program Files (x86)\\National Instruments",
"measuredGB": 0.41,
"tier": "review",
"method": "quarantine-folder",
"why": "Последняя запись в файлы — 2 декабря 2016 года. Почти десять лет без единого обращения.",
"risk": "Нет."
```
Обоснование — **чистый возраст файлов**. Ни слова про реестр, в отличие от соседей («Записи в реестре удаления нет…»). А рядом всё это время лежали 11 записей LabVIEW и `NIDIR : C:\Program Files (x86)\National Instruments\`. `run_stage2_2026-08-17_2246.log:98` печатает `  ok    orphan-national-instruments` — сторож не возразил, потому что возражать ему было нечем.

Что закрыть: научить запись каталога реестровому предусловию и заставить `Invoke-Cleanup` отказывать `quarantine-folder`, чей путь упоминается либо в `InstallLocation` любой записи деинсталляции, либо в любом строковом значении вендорских ключей под `HKLM\SOFTWARE[\WOW6432Node]`. Важная деталь: **ни у одной записи NI нет `InstallLocation`** (проверил — выборка по «указывает в PF(x86)\National Instruments» даёт ноль строк), так что проверки одного `InstallLocation` не хватило бы. Ловит только скан значений.

### 5.4 Метод `native` вообще минует сторожа

`Invoke-Cleanup.ps1:99-100` применяет `Test-CleanupTarget` только к `delete-*` и `quarantine-*`:
```
if ($t.method -like 'delete-*' -or $t.method -like 'quarantine-*') {
    $guard = Test-CleanupTarget $t.path
```
У записи `native` проверяется не путь, а строка команды в каталоге — то есть ничем не проверяется. Сегодня там только npm и dism, и оба безобидны, но правило есть правило.

### 5.5 `Remove-Product.ps1` — без сторожа, без каталога, без копии

Он находит продукт по regex имени или по коду, переписывает `/I` на `/X` (`ConvertTo-MsiUninstallArguments`) и отдаёт управление чужому деинсталлятору: `Start-Process -FilePath $split.Exe -ArgumentList $split.Arguments -Wait -PassThru`. Что этот деинсталлятор снесёт — тулза не контролирует и никуда не записывает. Именно это единственное действие вечера дотянулось до живого рабочего процесса: три продукта в `Run-Stage2.ps1:85-92`, среди них `{7400380A-...}` = iTunes, и вместе с ним — кодировщик CoreAudio, которым писался стрим. В манифесте набора `2246` этих трёх деинсталляций **нет вообще**: там пять записей, и продуктов среди них нет. Уборка знает, что она переместила и что удалила; что она деинсталлировала — она не описывает.

### 5.6 Сгенерированный `restore.ps1` — четыре отдельных дефекта

Это самый неприятный кусок, потому что он рекламируется как откат в одну команду.

1. **Нет ветвей** для `browser-extension`, `registry-key`, `registry-value` — 8 копий реестра и 3 папки расширений молча пропускаются.
2. **Не проверяется поле `removed`.** Цикл идёт по всем записям подряд, а ветка
   ```powershell
   'defender-exclusion' { Add-MpPreference -ExclusionPath $e.path }
   ```
   срабатывает и для записей с `"removed": false`. В наборе `2325` таких **16**, и это пути вида `C:\Program Files (x86)\bOgzivOxfQWlfiaaBhR`, `C:\ProgramData\TNhAqTFcWbUgIWVB`, `C:\WINDOWS\System32\Tasks\OOuUqatYMScEf2`. То есть «откат» **создал бы** шестнадцать исключений антивируса на путях зловреда, которых уборка вообще не снимала. Это не возврат — это установка.
3. **Зловредные задачи лежат в одном наборе отката с легитимными.** Записи 14–17 — GeForceNow, RTSS, UpdateTorrent, ASUS; записи 18–23 — шесть задач `BMuaDioLKglvBmGcFzs2`, `GtmFrAeViSMGjYG2`, `mvjpZMnaJoelqkkfj2`, `vXoGdkvhCaQdlx`, `OOuUqatYMScEf2`, `youtube-distraction-…`. Один запуск возвращает и то и другое.
4. **Единственное, что спасает — случайность.** На записи 22 из 40 (`mal-task-5`) скрипт читает отсутствующий `mal-task-5.xml`, а `$ErrorActionPreference = 'Stop'` в его шапке роняет весь прогон. Поэтому до записей 24–39 (те самые 16 исключений Defender) он бы просто не дошёл. От бага защищает баг.

Плюс дрейф версий: `restore.ps1` пишется из here-string внутри `Remove-Deadweight.ps1`, поэтому у набора `2325` он 1298 Б и без ветки `defender-policy-exclusion`, а у `2329` — 1609 Б и с ней. Правка тулзы не правит уже написанные на диск скрипты.

### 5.7 Отчётность врёт в двух местах

- `run_safe_2026-08-17_2108.log` печатает предупреждение Windows «Невозможно создать новую точку восстановления… менее 1440 минут», а следующей строкой — `restore point created`. Точка не создавалась. (В более поздних заходах это уже исправлено: `Run-Safe.ps1` считает точки до и после и пишет честное «restore point NOT created».)
- `run_safe_2026-08-17_2114.log:182` — `Nothing was deleted. To undo:   .\Restore-Quarantine.ps1 -Stamp 2026-08-17_2114`. В этом заходе 8 записей, все `delete-*`/`native`, у каждой `"quarantine": null`, и каталог `F:\_QUARANTINE_C\2026-08-17_2114` содержит **только `manifest.json` (4175 Б)**, никакой полезной нагрузки. Отдавать нечего, а строка обещает откат. 21,69 ГБ ушли безвозвратно под подпись «ничего не удалено».
- `reports\` вообще не полон: последний журнал заканчивается `Время окончания: 20260817224905`, а три набора карантина (`2325`, `2329`, `2335`) и правка файла подкачки произошли в 23:25–23:44 без единой строчки. Любой вывод вида «в журналах этого нет, значит этого не было» слабее, чем выглядит.

---

## Чего я не наблюдал

- Причины смены `RecAudioEncoder` с `ffmpeg_pcm_s24le` на `ffmpeg_aac`. Кодировщик 20.08 был доступен, контейнер не менялся.
- Какой именно файл и по какому пути грузил OBS для CoreAudio_AAC — `C:\Program Files\iTunes` снесён, описи не осталось.
- Содержимого базы профилей NVIDIA до 17.08 — восстановить нечем, наблюдать нечем.
- Значения `FFExtension` по умолчанию в OBS — не знаю, «потеряно» оно или «равно умолчанию».
- Куда ушли 9,42 ГБ между 21:17:09 и 22:46:05.
- Реального падения LabVIEW-приложения из-за отсутствующего `lvrt.dll` — ни одного не запускал.
- Состояния ACL дерева NI до переезда 17.08.
- Влияния возврата задачи RTSS или файла подкачки на остаточные рывки — ничего не измерял.