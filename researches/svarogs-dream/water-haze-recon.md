# Разведка — дымка над водой и водопадами (план 31, пункт 6)

> **Created:** 2026-10-18 · по слову владельца: `[OWNER]` «баг шейдеров водопадов - не покрыты дымкой» · «вообще вода вдали не покрыта
> дымкой» · 2026-10-18 (кадры: чёрная лента реки вдали, водопад без дымки)
> **Parent:** `plans/31_svarog_owner_night_items_2026-10-18.md`, пункт 6; класс бага 37 (крыши вдали)
> **Status:** 🔬 начата 2026-10-18 01:31 — веб и код; в игре не смотрено
> **Outbound:** решение развилки — после чтения раздела «Fog» документации Lux Water

## Что известно по нашему коду

- Своего шейдера воды у нас нет: вода — шейдеры игры (Lux Water, камера отражения `_WaterPlane` — баг 51); водопады — шейдер игры, имя не снято.
- Наша дымка — туман Unity: наши шейдеры собраны с `#pragma multi_compile_fog` и `UNITY_APPLY_FOG` (`unity/KrinikShaders/Assets/Shaders/KrinikBillboardTree.shader:24, 60`);
  цвет и густота — `KrinikColorRework` (`Sky.Haze`, `HazeWhite`, `HazeDensity`). Деревья-картинки в дымке, вода — нет: шейдер воды игры
  туман не применяет (или собран без вариантов тумана).

## Что говорит индустрия

- При отложенном рендере туман — эффект по экрану и по глубине; прозрачное (вода) глубину не пишет, и туман его «не видит». Лечат тремя
  путями: туман в самом шейдере воды; туман проходом ДО прозрачного (вода берёт туман дна под собой — неточно, но не голая); рендер вперёд
  ([форум Amplify](https://forum.amplify.pt/viewtopic.php?p=5126), [Unity Discussions: Stylized Water](https://discussions.unity.com/t/stylized-water-shader-desktop-mobile-vr-built-in-rp/639248?page=24),
  [Catlike Coding: Looking Through Water](https://catlikecoding.com/unity/tutorials/flow/looking-through-water/)).
- Отложенный туман пакета Post Processing — отдельный эффект и только для пути отложенного рендера
  ([Unity: Deferred Fog](https://docs.unity3d.com/Packages/com.unity.postprocessing@2.1/manual/Deferred-Fog.html)).
- Lux Water: шейдер воды рисуется вперёд и лучше всего работает с отложенным путём; поддерживает туман Azure, Enviro, Aura 2; в документации
  есть разделы «Fog» и «Underwater Fog» ([документация Lux Water 1.2.3](https://docs.google.com/document/d/1NDtUpVBgd3UYEI8LRNI4teFF3qm38h-u3Az-ozaaOX0/mobilebasic),
  [Asset Store](https://assetstore.unity.com/packages/vfx/shaders/119244)).

## Развилка (для решения после следующего шага)

FORK: А — включить туман у материалов воды по разделу «Fog» Lux Water (если там ключевое слово тумана Unity — дымка ляжет нашим цветом сама) ·
Б — свой шейдер воды с `UNITY_APPLY_FOG` · В — дымка проходом после прозрачного по глубине дна · цена ошибки — потеря отражений и пены воды
(Б), двойная дымка на непрозрачном (В) · consulted — документация Lux Water (раздел «Fog» прочитать), форумы выше.

## Следующий шаг

1. Прочитать раздел «Fog» документации Lux Water; снять пультом `mats` у материала воды и водопада: имя шейдера, ключевые слова (`shaderKeywords`).
2. Если выключатель тумана есть — путь А: включить у материалов при старте (как `RoofFog.cs` правит материалы по событию смены участков).
3. Кадр «до/после» с одного места, днём и в дымке.
