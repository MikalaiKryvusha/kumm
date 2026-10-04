# Bug 19 — Vibepollo: после сессии экран возвращается, но помощник считает возврат проваленным (устаревший «золотой» снимок)

**Status:** 🔧 fix pending verification — данные исправлены 2026-10-05 00:17 +03:00, проверка — на следующем конце сессии
**Severity:** S2 — после отключения экран ~8 с остаётся в режиме стрима (1280×800), потом минуты повторов «восстановление не
удалось»; при неудачном сессионном снимке экран мог остаться в режиме стрима
**Version/build:** установлена Vibepollo 2.0.0-beta.3 (`9ad4e7ec`), помощник экрана `C:\Program Files\Apollo\tools\sunshine_display_helper.exe`
от 2026-09-14; исходники `D:\work\ai_sandbox\Vibepollo` (HEAD `ebcce9f5d`)
**When/context:** `[OWNER]` «я отключаюсь, верни 4к» · 2026-10-05 ≈00:08; затем «убрать сторожа, удалить нахуй. починить
вайбполо, чтобы восстанавливал настройки экрана после завершения сессии» · ≈00:13

## Goal vector

Achieve: после конца любой сессии стрима экран сам возвращается в 3840×2160, 144 Гц, HDR вкл — сразу и без цикла повторов.
Критерий: в журнале помощника после `CLIENT DISCONNECTED` — восстановление с `success=true` (в исходниках —
«Golden restore confirmed»), без строк «golden snapshot remains pending»; `Win32_VideoController` → 3840×2160 @144.

## Forensics (журналы 2026-10-05)

- `C:\Program Files\Apollo\config\logs\sunshine-20261003-184222-457.log`: сессия 00:02:46 с клиента 1280×800 переключила экран
  на 1280×800; 00:07:52 `CLIENT DISCONNECTED`, 00:07:53 `REVERT`.
- `%APPDATA%\Sunshine\logs\sunshine_display_helper-20261005-000245-449.log`: `Restore: using golden-first strategy` →
  `Snapshot load rejected: baseline device is no longer available: {e0671c87-…} for path=golden` (есть только `{246139a8-…}`)
  → сессионный снимок «current» применён в 00:08:00.784 (`setDisplayConfig`, HDR Enabled — экран вернулся) → но
  `golden_restore_is_pending()` → «session fallback applied while golden snapshot remains pending» → `success=false` → цикл
  повторов до «Restore polling: window exhausted» (00:14:05). То же после сессии 00:10–00:12.
- `%APPDATA%\Sunshine\display_golden_restore.json` от 2026-04-22 — устройство `{e0671c87-…}`: экран под прежним путём
  (видимо, до замены видеокарты 3080 Ti → 5070 Ti).

## Root cause

`dd_always_restore_from_golden = true`, а «золотой» снимок ссылается на устройство, которого больше нет. Код
(`src/platform/windows/display_helper_v2/operations.cpp`, `golden_restore_is_pending`) считает такое устройство «временно
отсутствующим монитором» и держит восстановление незавершённым; сессионный возврат не засчитывается.

## Fix (данные, 2026-10-05 00:17)

`display_golden_restore.json` переписан на текущее устройство `{246139a8-657f-51ee-8c86-8ee9b157a978}` с той же базой
(3840×2160, 144/1, HDR on, primary, 0,0, rotation 0) — это та база, которую помощник сам восстанавливает из сессионного
снимка (журнал 00:12:12: `setHdrState … Enabled`). Старый файл — рядом, `display_golden_restore.json.bak-2026-04-22-old-gpu`.
Снимок читается с диска при каждом восстановлении (`TextSnapshotStorage::load_with_metadata`) — перезапуск не нужен.
Штатный путь для будущего — кнопка экспорта «золотого» снимка в веб-интерфейсе (`POST /api/display/export_golden`).

## Остаётся (улучшения кода, не сделаны)

- В исходниках уже есть порог: сессионный возврат принимается после 3 попыток (`kGoldenFallbackCompletionThreshold`);
  установленная сборка старше и этого порога не знает. Обновление установки — решение владельца (сборка, установка в
  Program Files, перезапуск службы).
- Улучшение: если устройство «золотого» снимка не видно вообще (не только неактивно), а единственный физический экран — с тем же
  режимом, предупреждать в веб-интерфейсе («золотой снимок устарел — переснять?»), а не молча крутить повторы.

## Decisions made without the owner

- `[AI]` Исправил данными (переписал снимок), а не кодом и не переустановкой: одна правка файла, полностью обратимая (копия
  рядом), даёт поведение, которое владелец уже выбрал настройкой `dd_always_restore_from_golden = true`.
- `[AI]` HDR в снимке — «on», как в старом снимке и как помощник восстанавливает после сессии.
- Сторож разрешения (`SvarogsDream/tools/ensure-4k.ps1`) удалён по слову владельца, в git он не попадал.
