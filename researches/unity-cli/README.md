# Unity CLI и ИИ-инструменты Unity — что из этого годится для Сварога

> **Created:** 2026-10-05 · **Parent:** слово владельца в чате 2026-10-05 ≈09:43 — справка CLI и ссылка
> https://unity.com/features/ai, «запишешь его дословно в отдельный файл»
> **Status:** справка и страница сохранены дословно; вывод для Сварога — ниже
> **Outbound:** —

## Что здесь лежит

| Файл | Что это | Откуда |
|---|---|---|
| `01_cli_help_verbatim.md` | справка `unity` v1.0.0-beta.12 с баннером, дословно, как её прислал владелец | чат 2026-10-05 |
| `02_unity_ai_tools_page.md` | текст страницы «Unity's AI tools», дословно, без меню и подвала сайта | https://unity.com/features/ai, снято 2026-10-05 09:44, HTTP 200 |
| `skill/` (только на диске, в git не идёт) | встроенное руководство CLI для ИИ-агентов: `SKILL.md`, `CHANGELOG.md`, `SECURITY.md`, 11 справочников `references/*.md` | `unity skill show --list` и `--path <файл>` |

Пересобрать `skill/` (например, после `unity self-update`):

```powershell
$u = "$env:LOCALAPPDATA\Unity\bin\unity.exe"
& $u --no-banner --non-interactive skill show --list   # список файлов
& $u --no-banner --no-pager --non-interactive skill show --path references/build-run-test.md
```

## Где стоит и в каком состоянии (замер 2026-10-05 09:40–09:44)

- CLI: `%LOCALAPPDATA%\Unity\bin\unity.exe`, версия 1.0.0-beta.12, канал beta. В PATH сессии агента его нет:
  вызывать по полному пути.
- Вход: `unity auth status` → выполнен (учётная запись владельца).
- Лицензия: `unity license status` → «активна: Unity Personal (Assigned), Asset Store (Assigned)». Файл лицензии
  `%LOCALAPPDATA%\Unity\licenses\UnityEntitlementLicense.xml` (09:37). Старого `C:\ProgramData\Unity\Unity_lic.ulf` нет.
  Видит ли эту лицензию редактор 2020.3.49f1, проверяется отдельным пакетным запуском (баг 15).

## Что из этого годится для Svarog's Dream (игра на Unity 2020.3.49f1)

Страница Unity называет требование прямо: «It requires Unity 6.0 and up». Отсюда разбор:

| Инструмент | Требует | Годится нам? |
|---|---|---|
| Официальный плагин Unity для Claude Code (навыки + CLI + MCP) | Unity 6.0+ | **нет** — у игры 2020.3 |
| MCP-сервер через CLI, `unity command` / `status` / `list` (живое управление редактором) | пакет `com.unity.pipeline`, Unity 6.0+ | **нет** |
| Ассистент в редакторе | Unity 6.0+, платный кредит | **нет** |
| CLI: `install`, `editors`, `license`, `auth`, `run`, `build`, `logs`, `doctor` | любой установленный редактор | **да** — установка, лицензия, пакетный запуск 2020.3 |

Что это значит для работы: шейдер земли (баг 15) собирается редактором 2020.3 в пакетном режиме —
`unity run <проект> -- …` или напрямую `Unity.exe -batchmode -nographics -projectPath … -executeMethod … -quit -logFile …`.
Живого управления редактором из CLI у нас не будет, пока игра на 2020.3.

Справочник по пакетному запуску — `skill/references/build-run-test.md`; по лицензии и входу —
`skill/references/auth-license-cloud.md`.
