# Research — sky optics for Svarog's Dream: twilight, dawn and dusk, luminosity of the sky and its bodies, a sun-elevation model for game hours

> **Created:** 2026-10-13 (web recon 17:40–18:20) · **Parent:** owner's word 2026-10-13 (quote: «иди в интернет за разведкой механики и
> оптики неба!»), with scope additions passed on by the main agent the same evening: luminosity of the sky and celestial bodies, the moon's
> own mechanics, region = Poland / Czechia / Slovakia (~50° N), a pre-industrial world (no light pollution, local solar time), Slavic names,
> the Blood Moon and the daytime moon · **Status:** recon done · **Outbound:** conclusions to the owner in chat via the main agent.
>
> Extends `sky-recon.md` (the sky shader, moods, haze, aurora, sunsets by season); nothing there is repeated here.

**Labels.** `[FACT]` = a number or statement from the cited source (read by me, unless marked *via search summary*: the page itself was
not opened, and only a search engine's summary of it was read). `[DERIVED]` = my arithmetic on sourced formulas or numbers (the formula
is cited). `[REC]` = my recommendation for our mod; not a measured fact.

The owner's complaint, restated: at 03:30 (summer) the moon is still up, but the water already shows the full dawn sun glint, while the
sky's sun disc only clears the horizon at ≈04:30. Physics says: **no glint, no shadows and no direct light of any kind until the sun's
upper limb is above the horizon**. Before that, the land and the water are lit by the sky alone, and the water mirrors the glowing sky.

---

## 1. The single driver: sun elevation

Everything in the sky follows one number, the elevation `e` of the sun's centre (negative = below the horizon). Official boundaries:

| Event | Sun centre | Source |
|---|---|---|
| astronomical twilight begins (morning) / ends (evening) | −18° | `[FACT]` [USNO definitions, copy](https://academics.uccs.edu/rtirado/PES_1600_SolarEnergy/Horizon_Rise_Set_Twilight.pdf), [Wikipedia: Twilight](https://en.wikipedia.org/wiki/Twilight) |
| nautical twilight boundary | −12° | same |
| civil twilight boundary | −6° | same |
| sunrise / sunset (upper limb on the horizon) | −0.833° = 16′ solar radius + 34′ mean refraction | `[FACT]` USNO copy above; [Wikipedia: Sunrise](https://en.wikipedia.org/wiki/Sunrise) ("the Sun's center is 50 arcminutes below the horizon"); NOAA uses zenith 90.833° ([NOAA solar equations](https://gml.noaa.gov/grad/solcalc/solareqns.PDF)) |

What each phase looks like:

- **e < −18° — night.** "Scattered light from the Sun is less than that from starlight and other natural sources" (USNO). "When the Sun's
  depth is more than 18°, the sky generally attains its maximum darkness" `[FACT]` [Wikipedia: Sky brightness](https://en.wikipedia.org/wiki/Sky_brightness).
- **−18…−12° — astronomical twilight.** For a long stretch after it begins, the morning light is "so faint that it is practically
  imperceptible" (USNO). Only the highest air over the horizon is still sunlit (Sky brightness). Naked-eye studies place the first
  perceptible dawn at a depression of ≈14.6° (Sinai 14.61°, Assiut 13.67°, Hail 14.66°) `[FACT, via search summary]`
  ([NRIAG article](https://nriag.journals.ekb.eg/article_453025.html)).
- **−12…−6° — nautical twilight.** The sea horizon is visible even on a moonless night; general outlines of ground objects can be made out;
  detailed work is impossible (USNO). The illumination is **at its bluest** around −12° at a dark rural site `[FACT]`
  ([Spitschan et al. 2016, PMC4895134](https://pmc.ncbi.nlm.nih.gov/articles/PMC4895134)). Below −6°, "99% of the atmosphere in the zenith
  direction is in the Earth's shadow", yet "35% of the atmosphere along the line of sight [toward the sunset point] is still directly
  illuminated" until −12° `[FACT]` (Sky brightness).
- **−6…−0.83° — civil twilight.** Terrestrial objects are clearly distinguished, the horizon is sharp, "the brightest stars are visible"
  (USNO). Facing **toward the sun**: the *purple light*, a luminous segment over the sunrise point, "reaching a maximum both in size and
  luminance when the Sun is 3° or 4° below the horizon", and it "disappears when the Sun is about 6° below the horizon" `[FACT]`
  ([WMO Cloud Atlas: purple light](https://cloudatlas.wmo.int/en/purple-light.html)). Facing **away from the sun**: the *Earth's
  shadow*, "a dark bluish to purplish band" just above the horizon, spanning 180° of it, visible "during the civil stage of twilight";
  above it the pink *Belt of Venus*, "roughly 10–20°" above the horizon, with no defined line between the two; before sunrise the shadow
  "appears to recede as the Sun rises" `[FACT]` ([Wikipedia: Earth's shadow](https://en.wikipedia.org/wiki/Earth%27s_shadow),
  [Wikipedia: Belt of Venus](https://en.wikipedia.org/wiki/Belt_of_Venus)). The belt is "more vivid in winter"; in summer it is "faded and dim
  above the yellowish-orange band near the horizon" (Belt of Venus).
- **e ≥ −0.83° — the disc is up.** Low sunlight loses "the blue and green components … almost completely, leaving the longer-wavelength
  orange and red hues"; sunset colours are usually more brilliant than sunrise colours because evening air carries more particles `[FACT]`
  (Sunrise).

### 1.1 Stars by sun elevation (naked eye)

Sky brightness at the zenith in twilight, an empirical fit to one night of SQM readings `[FACT]` ([hnsky.org](https://www.hnsky.org/sqm_twilight.htm),
x = sun elevation in degrees): μ ≈ −1.057·x + 6.749 for 0…−12°; μ ≈ −0.0744·x² − 2.5768·x − 0.5845 for −12…−18°. It agrees with the reference
table of Hänel et al. 2018: end of civil twilight 12.9 mag/arcsec², end of nautical 19.4 `[FACT]` ([arXiv 1709.09558, Table 2](https://arxiv.org/pdf/1709.09558)).
Limiting magnitude from sky brightness (Crumey 2014, quoted in the same review): m_lim = 0.426·μ − 2.365 − 2.5·log F, F = 1.4…2.4 `[FACT]`.

`[DERIVED]` (both formulas combined; Crumey's fit is built for bright skies and under-reads the darkest sky; see the Bortle figures in §5):

| Sun e | Sky μ (mag/″²) | Faintest star | What that means |
|---|---|---|---|
| 0° | 6.7 | ≈ 0 | only Venus (−4.9 max), Jupiter (−2.9 max), Sirius (−1.5) when you know where to look |
| −2° | 8.9 | ≈ +0.5…+1 | the brightest handful (Vega +0.03, Capella, Arcturus) |
| −4° | 11.0 | ≈ +1.4…+2 | first-magnitude stars, the brightest of the Big Dipper |
| −6° | 13.1 | ≈ +2.3…+2.9 | main constellation figures appear |
| −8° | 15.2 | ≈ +3.2…+3.8 | |
| −10° | 17.3 | ≈ +4.1…+4.7 | |
| −12° | 19.4 | ≈ +5.0…+5.6 | almost the full star field; the Milky Way is still washed out |
| −15° | 21.3 | ≈ +5.8…+6.4 | the Milky Way bulge (20.5–21.0 mag/″², Hänel Table 2) now stands out against the sky |
| ≤ −18° | 21.7–22 | ≈ +6.5 (Crumey) · 7.6–8.0 (Bortle 1) | full night |

Star magnitudes are from `[FACT]` [Wikipedia: Apparent magnitude](https://en.wikipedia.org/wiki/Apparent_magnitude).
So: **bright stars fade out between −6° and −2°, faint dust between −15° and −10°, and the Milky Way is the first to go (from ≈ −16°) and
the last to return.**

---

## 2. Light on the ground and on the water

### 2.1 Illuminance by sun elevation

`[DERIVED]` from the USNO Circular 171 clear-sky model (Janiczek & DeYoung 1987, [DTIC scan](https://apps.dtic.mil/sti/pdfs/AD1112511.pdf)),
as transcribed in the open [skylight](https://github.com/bluegreen-labs/skylight) package (`src/subroutines.h → atmos()`, `src/skylight.cpp`:
E = 133775 · atmos(h); the first term of `atmos` is the direct beam on a horizontal plane, the second is the sky's diffuse light). I ran the
formula myself:

| Sun e | Air mass | Direct beam, normal to the sun (lux) | Direct on the ground (lux) | Sky light on the ground (lux) | Total (lux) |
|---|---|---|---|---|---|
| −6° | 167 | 0 | 0 | 3.0 | 3.0 |
| −4° | 118 | 0 | 0 | 24 | 24 |
| −2° | 73 | 0 | 0 | 169 | 169 |
| 0° | 39 | 38 | 0 | 757 | 757 |
| +1° | 28 | 386 | 7 | 1 234 | 1 240 |
| +2° | 21 | 1 767 | 62 | 1 719 | 1 780 |
| +3° | 16 | 4 735 | 248 | 2 150 | 2 398 |
| +5° | 10.6 | 14 374 | 1 253 | 2 832 | 4 085 |
| +10° | 5.6 | 40 917 | 7 105 | 3 975 | 11 080 |
| +20° | 2.9 | 72 617 | 24 837 | 5 668 | 30 505 |
| +30° | 2.0 | 87 970 | 43 985 | 7 278 | 51 263 |
| +60° | 1.15 | 104 975 | 90 911 | 12 034 | 102 945 |

Measured anchors that agree: "dark limit of civil twilight under a clear sky" 3.4 lux; "sunrise or sunset on a clear day" 400 lux; direct
sunlight 32 000–100 000 lux `[FACT]` ([Wikipedia: Lux](https://en.wikipedia.org/wiki/Lux)); end of nautical twilight 8.1 mlux, end of civil
3.4 lux, direct sunlight 129 000 lux `[FACT]` (Hänel Table 2).

What follows from the table:

1. **Before sunrise the scene is lit by the sky only** — no direct beam, so no shadows and no sun glint. The light grows about ×7–8 per 2°
   of elevation (3 → 24 → 169 → 757 lux).
2. **The direct beam switches on over the first few degrees above the horizon**: it is ≈ 0.04 % of its noon strength at 0°, 1.7 % at 2°,
   14 % at 5°, 39 % at 10°, 69 % at 20°. Up to ≈ +2° the sky still out-lights the sun on the ground — shadows are faint and long.
3. **Air mass** (path length through the air relative to the zenith) is ≈ 39 at the horizon and 5.6 at 10° — the reason the low sun is dim
   and red.

### 2.2 What the water shows

- Water reflects ≈ 2 % of light at normal incidence, rising toward 100 % at grazing angles — `[FACT, via search summary]` Fresnel reflectance
  of the air–water surface ([Ocean Optics Web Book: the level sea surface](https://oceanopticsbook.info/view/surfaces/the-level-sea-surface)).
  Seen from our flat camera, water is a near-mirror of the sky near the horizon.
- **Before sunrise** the lake mirrors the twilight sky: the purple segment and the orange band over the sunrise point, the blue-violet Earth's
  shadow on the opposite side, and the bright stars and the moon while they last. There is no sun glint: the sun is not in the sky to be
  reflected.
- **The glint appears with the disc.** The disc's luminance is huge even at the horizon — "solar disk at horizon" 600 kcd/m² vs. 1.6 Gcd/m² at
  noon `[FACT]` ([Wikipedia: Orders of magnitude (luminance)](https://en.wikipedia.org/wiki/Orders_of_magnitude_(luminance))) — so the first
  glint is visible at once, deep orange-red, then whitens and strengthens with the direct beam (§2.1).
- A moon glint (glitter path) works the same way at night, with the moon's luminance (moon surface 2.5 kcd/m², same source).

---

## 3. Durations at ~50° N (Prague / Kraków), bounds Bratislava 48.15° N and Warsaw 52.23° N

**Local apparent solar time** (sundial time: solar noon = 12:00; no time zones, no daylight saving — a pre-industrial world). `[DERIVED]` with
the NOAA hour-angle formula ([NOAA solar equations](https://gml.noaa.gov/grad/solcalc/solareqns.PDF), zenith 90.833° for rise/set; 96°, 102°,
108° for the twilights). Cross-check `[FACT]`: the sunrise-sunset.org API for Prague (50.08° N) gives, on 21 Dec 2026, a day of 8 h 07 min, civil
dawn 4 h 40 min before solar noon (= 07:20 solar), nautical 05:38 solar, astronomical 05:58 solar; on 21 Jun, a day of 16 h 27 min, civil
dawn 03:04 solar, nautical 01:58 solar, no astronomical twilight ([June](https://api.sunrise-sunset.org/json?lat=50.08&lng=14.42&date=2026-06-21&formatted=0),
[December](https://api.sunrise-sunset.org/json?lat=50.08&lng=14.42&date=2026-12-21&formatted=0)). That matches my table to within 4 min.

**Main reference, 50.06° N:**

| Date | Sunrise | Sunset | Day | Civil tw. | Nautical tw. | Astronomical tw. | Full night (sun < −18°) | Sun at noon / at midnight |
|---|---|---|---|---|---|---|---|---|
| 21 Jun | 03:49 | 20:11 | 16 h 23 m | 45 min | 66 min | **all night** | **none** | +63.4° / −16.5° |
| early May, early Aug | 04:31 | 19:29 | 14 h 57 m | 38 min | 49 min | 60 min | 4.2 h | +56.4° / −23.4° |
| equinoxes (20 Mar, 23 Sep) | 05:55 | 18:05 | 12 h 10 m | 32 min | 38 min | 40 min | 8.2 h | +39.9° / −39.9° |
| early Nov, early Feb | 07:14 | 16:46 | 9 h 31 m | 35 min | 39 min | 38 min | 10.8 h | +23.9° / −55.9° |
| 21 Dec | 07:58 | 16:02 | 8 h 04 m | 39 min | 42 min | 40 min | 11.9 h | +16.5° / −63.4° |

Twilight durations are per side (morning or evening). The day is a little longer than 12 h at the equinox because of refraction and the
solar radius.

**Bounds:**

| Date | Bratislava 48.15° N | Warsaw 52.23° N |
|---|---|---|
| 21 Jun | 03:58–20:02, 16 h 04 m; civil 42 min; full night 1.1 h (sun reaches −18.4°) | 03:37–20:23, 16 h 47 m; civil 49 min; nautical 81 min; no full night (sun only to −14.3°) |
| equinox | 05:55–18:05, 12 h 10 m; civil 31 min | 05:55–18:05, 12 h 11 m; civil 34 min |
| 21 Dec | 07:50–16:10, 8 h 21 m; civil 37 min | 08:09–15:51, 7 h 42 m; civil 41 min |

Facts behind the June row: twilight can last through midnight near the solstices poleward of 48.561° (astronomical), 54.561° (nautical),
60.561° (civil) `[FACT]` (Wikipedia: Twilight); "at latitudes greater than 48 N or S … astronomical twilight lasts all night in midsummer"
`[FACT]` ([Jensen et al. 2001](https://graphics.cs.yale.edu/sites/default/files/nightsky.pdf)). **In Central Europe a June night has no real
darkness:** a pale glow walks along the northern horizon from the sunset point to the sunrise point. A "grey night" is one when nautical or
astronomical twilight lasts all night `[FACT]` (Twilight).

Twilight is shortest near the equinoxes and longest at the solstices; in June it is longest of all. At the horizon the sun climbs 0.12° per minute
in June and 0.16° per minute at the equinox at 50° N `[DERIVED]` (derivative of the same formula).

---

## 4. Luminosity of the sky and its bodies (study note)

### 4.1 Apparent magnitudes `[FACT]` ([Wikipedia: Apparent magnitude](https://en.wikipedia.org/wiki/Apparent_magnitude))

| Body | Magnitude |
|---|---|
| Sun | −26.83 |
| Full Moon | −12.74 (mean distance); −12.60 at perihelion |
| Venus, at its brightest (crescent phase) | −4.92 |
| Jupiter | −2.94 max, −2.20 mean |
| Sirius (brightest star) | −1.47 |
| Vega (zero point) | +0.03 |
| Naked-eye limit, very good conditions | +6.5 (Bortle class 1: 7.6–8.0, §5) |

"The Sun appears to be approximately 400 000 times as bright as the full Moon" (14.09 mag, factor ≈ 432 513) `[FACT]`. Each 5 magnitudes = ×100.

### 4.2 Illuminance on the ground

| Source | Lux | Source of the number |
|---|---|---|
| direct sunlight | 32 000–100 000 · brightest 120 000 · 129 000 | [Lux](https://en.wikipedia.org/wiki/Lux), [Daylight](https://en.wikipedia.org/wiki/Daylight), Hänel |
| shade under a clear blue sky, midday | 20 000 | Daylight |
| overcast day, midday | 1 000–2 000 | Daylight |
| clear sunrise / sunset (ambient) | 400 | Daylight, Lux |
| overcast sunrise / sunset | 40 | Daylight |
| end of civil twilight, clear | 3.4 | Lux, Hänel |
| end of nautical twilight, clear | 0.0081 | Hänel |
| full moon at the zenith (maximum) | 0.32 | Hänel |
| full moon, clear night | 0.25 · "typically 0.05–0.1" · 0.05–0.3 | Daylight · [Moonlight](https://en.wikipedia.org/wiki/Moonlight) · Lux |
| typical summer full moon (the full moon rides low in summer) | 0.05–0.1 | Hänel |
| half moon at the zenith (maximum) | 0.025 | Hänel |
| quarter moon | 0.01 | Daylight |
| Venus at its brightest | 0.00014 | Daylight |
| starlight + airglow, clear moonless sky | 0.002 | Daylight, Lux |
| natural starlit night | 0.0006–0.0009 | Hänel |
| starlight without airglow | 0.0002 | Daylight |
| overcast moonless night | 0.0001 · < 0.0006 | Daylight · Hänel |

Night-sky irradiance budget `[FACT]` (Jensen et al. 2001, Fig. 2, W/m²): sunlight 1.3×10³; full moon 2.1×10⁻³; bright planets 2.0×10⁻⁶;
zodiacal light 1.2×10⁻⁷; integrated starlight 3.0×10⁻⁸; airglow 5.1×10⁻⁸; diffuse galactic light 9.1×10⁻⁹; cosmic light 9.1×10⁻¹⁰.
"The sky is never completely black" (same paper). Airglow is "the principal source of light in the night sky on moonless nights" (same);
at the zenith it is about 65 % of a dark sky's brightness, zodiacal light 27 %, scattered starlight 7 % `[FACT]` (Sky brightness).

### 4.3 Sky luminance

| Condition | cd/m² | Source |
|---|---|---|
| clear sky at noon | 10 000 (clear 3 000–5 000, average 8 000) | Orders of magnitude (luminance) |
| cloudy sky at noon · average cloudy sky | 1 000 · 2 000 | same |
| overcast day, zenith | 32–640 | Hänel |
| typical photographic scene at sunrise/sunset | 25 | Orders of magnitude (luminance) |
| end of civil twilight, zenith | 0.45 | Hänel |
| end of nautical twilight, zenith | 0.0019 | Hänel |
| Milky Way bulge | 0.0027 | Hänel |
| natural starlit night, zenith | 0.0002–0.0003 (darkest sky 0.0004 in the other table) | Hänel; Orders of magnitude (luminance) |
| overcast natural night | < 0.0002 | Hänel |
| moon surface | 2 500 | Orders of magnitude (luminance) |
| solar disc at the horizon · at noon | 600 000 · 1.6×10⁹ | same |

The sky near the horizon "is often about half as bright as at zenith" `[FACT]` (same page, footnote).

### 4.4 Colour

| Light | Colour temperature | Approx. sRGB, 8-bit, D65 white (`[DERIVED]`: Planck spectrum → CIE 1931 → sRGB, normalised to max channel) |
|---|---|---|
| sunrise / sunset sun | 1 850 K `[FACT]` ([Color temperature](https://en.wikipedia.org/wiki/Color_temperature)) | 255 132 0 |
| sun a few degrees up | ≈ 2 500–3 500 K `[REC]` interpolation | 255 166 74 → 255 200 140 |
| sun high (spectrum ≈ 5 800 K black body) | 5 775–5 800 K `[FACT]` ([Sunlight](https://en.wikipedia.org/wiki/Sunlight)) | 255 241 235 |
| "vertical daylight" | 5 500–6 000 K `[FACT]` (Color temperature) | ≈ 255 238 225 |
| overcast daylight | 6 500 K `[FACT]` | 255 249 254 (white) |
| clear blue poleward sky | 15 000–27 000 K `[FACT]` | ≈ 180 200 255 |

- **Twilight light is blue.** Short wavelengths are relatively enriched as the sun sinks; the bluest point is near −12° at a dark site
  `[FACT]` (Spitschan 2016). Photographers call it the "blue hour" (same).
- **Moonlight is physically redder than sunlight**: the lunar albedo "is approximately twice as large for red … than for blue" `[FACT]`
  (Jensen 2001); moonlight has "slightly more long-wavelength (red) light than daylight", and its bluish or silvery look is an illusion
  caused by the Purkinje effect `[FACT]` (Moonlight).
- **Purkinje shift**: at low light the eye's peak sensitivity moves from ≈ 555 nm (cones) to ≈ 507 nm (rods), toward blue `[FACT]`
  ([Wikipedia: Purkinje effect](https://en.wikipedia.org/wiki/Purkinje_effect)). Night rendering in graphics adds a **blue shift**, "the
  subjective impression that night scenes exhibit a bluish tint", plus loss of acuity and colour `[FACT]` (Jensen 2001, tone mapping section).
  This is why games tint the night blue and desaturate it: it is the eye, not the light.
- The moon *disc* itself is bright (EV100 15, the same as a sunny landscape `[FACT]` [Wikipedia: Exposure value](https://en.wikipedia.org/wiki/Exposure_value))
  and is seen with cones: pale yellow-white, not blue.

### 4.5 Dynamic range and what it means for our tone mapping

- Sun vs full moon ≈ 4×10⁵ in brightness; daylight vs night ambient 10⁶–10⁸ `[FACT]` (Spitschan 2016). EV100: full sun 15, sunset 12,
  just after sunset 9–11, landscape under a full moon (altitude > 40°) −3…−2, the Milky Way's centre −11…−9 `[FACT]` (Exposure value).
  Sun to moonlit landscape ≈ 17–18 stops `[DERIVED]`.
- Engines that render this physically use **auto-exposure**: Unreal recommends a sun of 120 000 lux and a moon of 0.26 lux `[FACT]`
  ([Unreal: Sky Atmosphere](https://dev.epicgames.com/documentation/en-us/unreal-engine/sky-atmosphere-component-in-unreal-engine)), and its
  physical-units guide tells you to widen the auto-exposure / histogram EV100 range ([Unreal: physical lighting units](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-physical-lighting-units-in-unreal-engine)).
- Our game has **fixed exposure** — its own day/night ratio sets a light intensity per hour (see `LightCycle.cs`). With fixed exposure, the
  physical 10⁸ range has to be **compressed by hand**. `[REC]` Drive the overall scene brightness by the **logarithm** of the physical illuminance
  (the eye adapts roughly logarithmically), with a readable night floor:

  | Sun e | ≤ −18 | −15 | −12 | −9 | −8 | −6 | −4 | −2 | 0 | +5 | +10 | +20 | +60 |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|---|
  | lux (§2.1, Hänel; −9…−15 log-interpolated `[DERIVED]`) | 0.0008 | 0.0025 | 0.0081 | 0.17 | 0.45 | 3.4 | 24 | 169 | 757 | 4 085 | 11 080 | 30 505 | 102 945 |
  | log₁₀ lux | −3.1 | −2.6 | −2.1 | −0.8 | −0.35 | 0.53 | 1.4 | 2.2 | 2.9 | 3.6 | 4.0 | 4.5 | 5.0 |

  Brightness 0…1 = InverseLerp(log₁₀ E_night, 5.0, log₁₀ E(e)), where E_night is the night floor of the current night: full moon 0.25 lux
  (−0.6), half moon 0.01–0.025 (≈ −1.8), moonless 0.0008 (−3.1). **On a moonlit night the dawn becomes noticeable later**, at about −8.5°,
  where twilight overtakes the full moon (`[DERIVED]`: 0.45 lux at −8° vs 0.25 lux); on a moonless night already at ≈ −15°. Moonlight "can be
  detected for solar elevations of −8° or less" `[FACT]` (Spitschan 2016, citing Palmer & Johnsen).

---

## 5. Pre-industrial night: Bortle class 1

No artificial light anywhere — the natural sky. `[FACT]` ([Wikipedia: Bortle scale](https://en.wikipedia.org/wiki/Bortle_scale)), class 1 "excellent
dark-sky site": naked-eye limit 7.6–8.0; sky 21.76–22.0 mag/arcsec²; the zodiacal light "visible and colorful"; the gegenschein "readily
visible"; the zodiacal band visible; the Scorpius–Sagittarius Milky Way "cast[s] obvious shadows"; airglow "readily visible"; "Venus and
Jupiter affect dark adaptation". Class 2: limit 7.1–7.5; zodiacal light bright enough to cast shadows at dusk and dawn.

- Natural zenith brightness on a moonless night at mid-latitudes ≈ 21.9 mag/arcsec² (V) `[FACT]` (Sky brightness); in a city "the entire night
  sky is regularly 5 to 50 times brighter" (same) — a medieval sky has none of that.
- Star count `[FACT]` ([Wikipedia: Naked eye](https://en.wikipedia.org/wiki/Naked_eye)): ≈ 5 600 stars brighter than +6 in a typical dark sky,
  ≈ 45 000 brighter than +8 in perfect conditions (whole sky; half of them above the horizon at any moment `[DERIVED]`).
- Airglow: emission lines at 557.7 nm (green, O I), 630 nm (red, O I) and 589 nm (Na) `[FACT]` (Jensen 2001) — in a class-1 sky it is a faint
  greenish band a few tens of degrees above the horizon (the band's height is my reading of photographs, `[REC]`-grade).
- **Zodiacal light ("false dawn")**: a column brighter at the horizon and tilted along the ecliptic, best seen at mid-northern latitudes "in the western
  sky in the spring after the evening twilight has completely disappeared, or in the eastern sky in the autumn just before the morning twilight
  appears" `[FACT]` ([Wikipedia: Zodiacal light](https://en.wikipedia.org/wiki/Zodiacal_light)). Moonlight hides it.
- The moon brightens the whole sky: near full moon a clear night's zenith brightness is ≈ 4.3 mcd/m², vs ≈ 0.25 mcd/m² moonless `[FACT, via search
  summary]` (Potsdam measurements, [arXiv 1307.2038](https://arxiv.org/pdf/1307.2038)) — ≈ ×17: the Milky Way and the faint dust vanish under a full
  moon; only the stars to ≈ +4…+5 stay `[DERIVED]` with Crumey's formula.

---

## 6. The moon: mechanics, the morning moon, the Blood Moon

### 6.1 Where the moon is, by phase

`[FACT]` ([Wikipedia: Lunar phase](https://en.wikipedia.org/wiki/Lunar_phase)), approximate times:

| Phase | Rises | Highest | Sets | Seen |
|---|---|---|---|---|
| new | ≈ 06:00 | ≈ 12:00 | ≈ 18:00 | invisible (too close to the sun) |
| first quarter | ≈ 12:00 | ≈ 18:00 | ≈ 00:00 | afternoon and early night |
| full | ≈ 18:00 | ≈ 00:00 | ≈ 06:00 | sunset to sunrise |
| last quarter | ≈ 00:00 | ≈ 06:00 | ≈ 12:00 | late night and morning |

The moon moves about 12° per day relative to the sun; the synodic month is 29.53 days `[FACT]` (same) — so it rises ≈ 49 min later each day
`[DERIVED]`. The moon is above the horizon about 12 hours of every 24 `[FACT, via search summary]` ([Universe Today](https://www.universetoday.com/articles/why-can-we-see-the-moon-during-the-day)).

- **Why a moon at 03:30 dawn is right.** A full moon sets at sunrise: at dawn it hangs low in the west-southwest, opposite the glow. Each
  waning day it is further east and higher at dawn: the last-quarter moon is at its highest at sunrise. Only around new moon is there no moon
  at dawn. `[DERIVED]`: in our summer mapping (§8) a full moon at 03:30 stands ≈ 9° up in the south-west.
- **Height through the year.** A full moon is opposite the sun, so it takes the *winter* sun's path in summer and the *summer* sun's path
  in winter `[DERIVED]` from geometry: at 50° N the June full moon culminates only ≈ 16° up, the December full moon ≈ 63°. Hence Hänel's "typical
  summer full moon" of 0.05–0.1 lux vs 0.32 lux for a full moon at the zenith.
- **Brightness by phase**: a quarter moon gives far less than half the full moon's light: "moonlight at full moon is much more than at first or
  third quarter", although "the visible area illuminated is only twice as large"; between phase angles 4° and 0° the brightness "increases by
  more than 40%" (the opposition surge) `[FACT]` ([Wikipedia: Opposition surge](https://en.wikipedia.org/wiki/Opposition_surge)). Half moon at the zenith
  25 mlux vs full 320 mlux `[FACT]` (Hänel) — ≈ 1/13. Phase law used by USNO Circular 171 (skylight code): P = 0.892·exp(−3.343 / tan(E/2)^0.632)
  + 0.0344·(sin E − E·cos E), E = phase angle, normalised by 0.418·P / (1 − 0.005·cos E − 0.03·sin(moon altitude)) `[FACT]`
  (`skylight.cpp`).

### 6.2 The moon in the dawn and daytime sky

- The moon's surface luminance is ≈ 2 500 cd/m²; a clear day sky is 3 000–10 000 cd/m² `[FACT]` (Orders of magnitude, luminance). So a daytime full
  moon adds only ≈ 25–80 % to the sky behind it `[DERIVED]`: visible, but pale and low in contrast — a "washed" disc of the sky's own blue
  plus grey-white. The lit part of a half moon is ≈ 1/6 as bright per area as a full moon (`[DERIVED]` from the 1/13 above over half the
  area), so a daytime crescent is the faintest of all.
- In twilight the contrast is huge: at −6° the zenith sky is 0.45 cd/m² vs the moon's 2 500 cd/m² — **the moon outshines every part of the
  twilight sky by ×1000 or more** `[DERIVED]`; it fades from "dominant" to "pale" only in the first 5–10° of the sun's climb.
- **When to see a morning moon**: during the waning half of the month (after full moon until a few days before new moon) the moon is up in the
  morning `[FACT]` (Lunar phase table above); the gibbous moons, with large lit area, are the easiest to spot in daylight `[FACT, via search
  summary]` (popular sources, e.g. [Science Focus](https://www.sciencefocus.com/science/why-is-the-moon-sometimes-visible-during-the-day)).
  Near new moon it is "lost in the glare" (same).
- **A low moon is orange/red** for the same reason as a low sun: the long path through the air strips the blue `[FACT]` (Sunrise, Earth's shadow
  pages describe this for sunlight; the same air mass ≈ 39 at the horizon applies to moonlight). `[REC]` low-moon tint: from ≈ 255 166 74
  (on the horizon) through 255 214 170 (≈ 5°) to the normal pale silver above ≈ 15°.

### 6.3 Blood Moon — a total lunar eclipse

- Why red: sunlight reaching the moon passes through Earth's atmosphere first; "Rayleigh scattering removes short-wavelength colors such as
  violet and blue", and the refracted red light falls into the umbra `[FACT]` ([Wikipedia: Lunar eclipse](https://en.wikipedia.org/wiki/Lunar_eclipse)).
  A lunar eclipse "is also called a blood moon" (same).
- Duration: totality "may last up to nearly 107 minutes"; the whole eclipse up to 236 minutes; visible "from anywhere on the night side of Earth"
  `[FACT]` (same). It can happen only at full moon.
- Frequency: 228 lunar eclipses in the 21st century (≈ 2.3 per year, at least two each year); 28.8 % of lunar eclipses are total `[FACT]` (same).
  From one place a total eclipse is seen about once every 2–2.5 years `[FACT, via search summary]` (Space.com ≈ 40–45 per century at a given spot).
- Brightness: one measured eclipse (May 2022) had the moon at visual magnitude −0.8 ± 0.3 at mid-totality `[FACT, via search summary]`
  ([Sky & Telescope](https://skyandtelescope.org/observing/useful-projects-for-a-lunar-eclipse/)) — ≈ 60 000× fainter than −12.7 `[DERIVED]`. Dark
  eclipses are much fainter; volcanic eruptions (Pinatubo 1991) make eclipses dark for years, and the 9 Dec 1992 eclipse was rated L0 by many
  observers `[FACT]` ([Wikipedia: Danjon scale](https://en.wikipedia.org/wiki/Danjon_scale), [NASA: Danjon scale](https://eclipse.gsfc.nasa.gov/OH/OHres/Danjon.html)).
  During totality the sky darkens to a moonless-night level — the Milky Way returns `[DERIVED]`.

Danjon scale `[FACT]` (NASA page above, verbatim descriptions) with shader colours `[REC]` (my approximations of the described colours, sRGB 8-bit;
not measured spectra):

| L | Description (NASA) | Disc centre | Rim of the umbra | Brightness vs normal full moon `[REC]` |
|---|---|---|---|---|
| 0 | "Very dark eclipse. Moon almost invisible, especially at mid-totality." | 40 22 18 | 70 40 30 | ≈ 0.5 % |
| 1 | "Dark Eclipse, gray or brownish in coloration. Details distinguishable only with difficulty." | 85 60 50 | 110 80 65 | ≈ 1 % |
| 2 | "Deep red or rust-colored eclipse. Very dark central shadow, while outer edge of umbra is relatively bright." | 110 35 20 | 175 70 40 | ≈ 2 % |
| 3 | "Brick-red eclipse. Umbral shadow usually has a bright or yellow rim." | 165 60 35 | 230 160 80 | ≈ 4 % |
| 4 | "Very bright copper-red or orange eclipse. Umbral shadow has a bluish, very bright rim." | 210 100 45 | 170 200 230 | ≈ 8 % |

(The brightness column is a game value for a fixed-exposure display, not physics: the physical drop is ×10⁴–10⁵, which on our screen would be a
missing moon.)

---

## 7. How games and engines model this

- **Sun elevation drives the sky.** Unreal's Sky Atmosphere: "a sky color that will vary, depending on the altitude of the sun"; the sky colour
  follows the time-of-day simulation `[FACT]` (Unreal Sky Atmosphere doc). The underlying technique (Hillaire 2020) "supports dynamic time of day"
  with small look-up tables `[FACT]` ([Hillaire 2020, EG digital library](https://diglib.eg.org/handle/10.1111/cgf14050)).
- **Sun and moon are separate lights.** Unreal: "two atmospheric Directional Lights", "0 for the Sun and 1 for the Moon"; moon 0.26 lux vs sun
  120 000 lux `[FACT]` (Unreal Sky Atmosphere doc). In Unity HDRP users likewise run sun and moon as two alternating directional lights `[FACT,
  via search summary]` ([Unity forum](https://forum.unity.com/threads/possible-bug-hdrp-physically-based-sky-sudden-flash-of-light-when-sun-first-moves.1214043/)).
  That is how they avoid a "moon light → sun light" direction flip: the moon light fades out on its own path, the sun light fades in on its own.
- **Blends by elevation with smoothstep** are the hobby-engine norm, e.g. a Godot sky: day = smoothstep(−0.2, 0.4, sun.y), night =
  smoothstep(0.2, −0.4, sun.y) `[FACT, via search summary]` ([Godot forum](https://forum.godotengine.org/t/simple-sky-shader-replacement/133402)) —
  the two ranges overlap, so dawn has both night and day weights at once.
- **Night rendering**: a physically based night sky (Jensen et al. 2001) models the moon, stars, zodiacal light and airglow, and tone-maps with
  rod/cone simulation, loss of acuity and a blue shift `[FACT]` (Jensen 2001).

---

## 8. Recommendations for our model (game hours, not angles) `[REC]`

### 8.1 What the code does now (read 2026-10-13, read-only)

`Sky.cs` blends moods by hour keys {0 night, 3 night, 5.5 dawn, 8 day, 19.5 day, 22 dusk, 24 night}; the sun disc's height follows the mood
weights; winter is the summer clock stretched (`SeasonHour`, day 7–20 → 5–22). `LightCycle.cs` keeps the game's hourly angle table (sun on the
west horizon at 02:00, jump to the east horizon at 03:00, 90° at 11:00) and fades the light out before the jump, then back in behind `Sky.SunUp`.
Problems from the physics' point of view:

1. Dawn peaks 0.5 h **after** the game's sunrise (5:00 → 5.5), dusk peaks **at** sunset (22) — dawn and dusk do not mirror each other.
2. The disc, the light and the stars each have their own hour curves; nothing guarantees that the glint waits for the disc.
3. The stretched winter has summer's shape: winter nights are as short and as light as summer ones, in proportion.
4. The game's day is centred at 13:30 (5–22 and 7–20 both have their midpoint at 13:30); its light table culminates at 11:00.

### 8.2 One pseudo-sun for everything

Compute one elevation (and azimuth) from the game hour with the real spherical formula (NOAA, §3), at φ = 50° N, with a **virtual declination
per game season** chosen so that the upper limb touches the horizon exactly at the game's `IsItDayTime` bounds, and a solar noon at **13:30**
(the centre of both game days):

```
e(h) = asin( sin φ · sin δ + cos φ · cos δ · cos(15° · (h − 13.5)) )
φ = 50.06°;  δ = +26.04° (summer, spring, autumn: day 05:00–22:00);  δ = +5.16° (winter: day 07:00–20:00)
azimuth: the matching formula; sunrise azimuth ≈ 47° (NE) in summer, ≈ 82° (almost E) in winter
```

`[DERIVED]` this gives (dawn / dusk, game hours; 1 game hour = 60 real seconds):

| Event (sun e) | Summer-type day 05–22 | Winter day 07–20 |
|---|---|---|
| night minimum | −13.9° at 01:30 (no astronomical night, like a real June at 50–52° N) | −34.8° at 01:30 |
| astronomical dawn, −18° | never | 05:05 / 21:55 |
| first perceptible glow, ≈ −15° | never (the glow never fully leaves the north) | 05:27 / 21:33 |
| nautical, −12° | 02:47 / 00:13 | 05:47 / 21:13 |
| −9° | 03:35 / 23:25 | 06:07 / 20:53 |
| civil, −6° | 04:10 / 22:50 | 06:27 / 20:33 |
| purple light peak, −4° | 04:31 / 22:29 | 06:40 / 20:20 |
| −2° | 04:50 / 22:10 | 06:53 / 20:07 |
| **upper limb on the horizon, −0.83°** | **05:00 / 22:00** | **07:00 / 20:00** |
| centre on the horizon, 0° | 05:07 / 21:53 | 07:05 / 19:55 |
| +2° | 05:24 / 21:36 | 07:18 / 19:42 |
| +5° | 05:48 / 21:12 | 07:37 / 19:23 |
| +10° | 06:24 / 20:36 | 08:08 / 18:52 |
| +20° | 07:32 / 19:28 | 09:11 / 17:49 |
| noon | +66.0° at 13:30 | +45.1° at 13:30 |

Hourly elevations, summer-type: 0:−11 1:−14 2:−14 3:−11 4:−7 5:−1 6:+7 7:+15 8:+24 9:+34 10:+43 11:+53 12:+60 13:+65 14:+65 15:+60 16:+53
17:+43 18:+34 19:+24 20:+15 21:+7 22:−1 23:−7. Winter: 0:−31 1:−34 2:−34 3:−31 4:−26 5:−19 6:−10 7:−1 8:+9 9:+18 10:+27 11:+35 12:+41 13:+45
14:+45 15:+41 16:+35 17:+27 18:+18 19:+9 20:−1 21:−10 22:−19 23:−26.

At **03:30 in summer** the pseudo-sun is at ≈ −9.5°: nautical twilight. Correct picture: a blue-violet glow low in the north-east, stars down to
≈ +4 still out, the moon (if up) bright; ground lit by the sky alone, ≈ 0.1–0.2 lux; water mirrors the glow and the moon; **no glint**.

### 8.3 Thresholds (all by e, so dusk mirrors dawn automatically)

| What | Starts (morning) | Done (morning) | Evening = mirror | Basis |
|---|---|---|---|---|
| Milky Way and faint star dust fade out | −16° | −12° | −12° → −16° | §1.1 (Milky Way bulge vs sky) |
| stars fade, faint first, bright last (by magnitude) | −12° | −2° (Sirius/Venus last, ≈ 0°) | reverse | §1.1 table |
| moonLIGHT (illumination, its direction light) fades out | −12° | −6° | −6° → −12° | twilight 0.008 lux at −12°, 3.4 lux at −6° vs full moon 0.25 lux |
| moon DISC: from dominant to a pale day moon | −6° | +10° (keep ≈ 25–40 % contrast by day if the phase puts it above the horizon) | reverse | §6.2 |
| glow over the sunrise point (sky toward the sun) | −15° (faint) | grows to 0° | reverse | §1 |
| purple segment over the sunrise point | −6° | peak −4°, gone by ≈ −1° | reverse | WMO |
| Earth's shadow + Belt of Venus on the opposite horizon | −6° | gone ≈ +1° | reverse | Earth's shadow |
| disc: upper limb on the horizon | −0.83° | fully up ≈ +0.5° | reverse | USNO |
| **direct light: shadows, water glint** | **0° (the disc is up)** | ramp, see below | reverse | §2.1 |
| colour of the direct light | 1 850 K at 0° | ≈ 3 500 K by +10°, ≈ 5 800 K by +30° | reverse | §4.4 |
| sky (ambient) light | log curve §4.5 from the night floor | 5.0 at noon | reverse | §4.5 |

**Direct-light ramp** (sun light intensity and glint): physically 0.04 % / 1.7 % / 14 % / 39 % / 69 % of noon at 0° / 2° / 5° / 10° / 20°. For a
fixed-exposure screen use the square root of that: **0 / 0.13 / 0.37 / 0.62 / 0.83 / 1.0 at 0° / 2° / 5° / 10° / 20° / 60°** — the low sun
reads as sunny by 5–10° (as in photographs) without a pop at the horizon. In summer game time: glint from 05:07, half strength ≈ 06:05 (≈ +7°), 0.83 at 07:32 (+20°), full toward noon.

**Direction flip.** Never rotate a lit light. The game has one main light; turn it toward the pseudo-sun while it is dark: the moonlight ends at
e = −6°, the sun's direct light starts at 0°, so any direction change in between is invisible. Better still (the Unreal way): a second, weak
directional light for the moon, with its own path (§8.4).

**Asymmetry worth keeping.** Same timings, different palettes: evening air is dustier, so sunsets are more saturated and warmer than sunrises
(Sunrise page); dawn cooler and cleaner. The existing seasonal sunset palettes (`sky-recon.md`) can stay as the dusk side.

### 8.4 The moon in game terms

- Phase p (0 new … 0.5 full …): moon hour angle = sun hour angle − 360°·p; the moon rises about p·24 h after the sun. With our 16-day cycle that
  is 90 min later each day (real: ≈ 49 min).
- Moon declination ≈ δ_sun · cos(2π·p) — the full moon low in summer, high in winter (§6.1).
- Waning moons (p 0.5–1) fill the dawns, waxing moons (0–0.5) the dusks; around p ≈ 0 there is no moon.
- Low moon: reddened tint below ≈ 15° (§6.2). Blood Moon: only at p = 0.5, rare (real ≈ once per 2–2.5 years; in game, a rare
  event), 1–1.8 game hours of totality, Danjon colours §6.3, sky darkened to the moonless floor during totality.

### 8.5 Forks for the owner

- **F1. Summer nights are physically "grey".** With the 05–22 day at 50° N, the pseudo-sun never goes below −13.9°: the Milky Way never fully
  appears (it would peak at ≈ 50 % by the −12…−16° fade), and a faint glow stays on the northern horizon all night. That is the real June of
  Prague and Kraków (§3). Options: (a) keep it — honest "white-ish" summer nights, rich star nights in autumn and winter; (b) count the season's
  own minimum as full night for the stars (stars and Milky Way full at 00:15–02:45 in summer). My lean: (a) for the glow on the horizon, (b) for
  the Milky Way, because summer nights in the game are short in real time anyway.
- **F2. Spring and autumn.** The game uses the summer day (05–22) for spring and autumn. Real equinox at 50° N is 12 h 10 m. Following
  `IsItDayTime` keeps the sky in step with the game's own NPCs and lights; giving spring/autumn their own day (e.g. 06:00–21:00) would make the
  sky diverge from the game's day/night logic by an hour at each end. My lean: follow `IsItDayTime` (δ = 26° for all three).
- **F3. Noon at 13:30 vs 12:00.** A pre-industrial world keeps solar time (noon 12:00). The game's day bounds put noon at 13:30. Keeping 13:30
  keeps the disc on the horizon exactly when the game says day begins and ends; the game's clock then reads 1.5 h "ahead of the sun", like a
  modern summer-time clock. My lean: keep 13:30 — the clock is the game's, the sky must agree with it.

---

## 9. Slavic names for the sky (short, for flavour)

- **Zorya Utrennyaya and Zorya Vechernyaya** (Зоря Утренняя / Вечерняя), the morning and evening dawn: two maiden sisters standing on either
  side of the Sun's golden throne; the morning one opens the gate of the heavenly palace when the Sun sets out, the evening one closes it when
  he returns; a later myth adds a third, the **Midnight Zorya** (Полуночная), who with her sisters guards a dog chained to the Little Bear —
  if the chain breaks, the world ends `[FACT]` ([Wikipedia: Zorya](https://en.wikipedia.org/wiki/Zorya), citing Afanasyev 1865 and Toporkov 1995
  "Slavyanskaya Mifologiya").
- **Venus**: **Денница** (Dennitsa), "the herald of the day", the morning star; also Утренница, Зоряница, Belarusian Зарніца; the evening star
  is **Вечерница**; in a Serbian tale the Sun sits on a throne between "Утренница и Вечерница" `[FACT]` ([ru.wikipedia: Денница](https://ru.wikipedia.org/wiki/Денница),
  citing Ivanov & Toporov 1990, Karpenko 1981); Serbo-Croatian Zornjača / Večernjača (Zorya article).
- **Pleiades**: **Стожары** (Stozhary), a name of Slavic origin; also Утиное Гнездо (Duck's Nest), Семь Сестёр; in Slavic paganism imagined as a
  herd of cows or as the wives of Veles `[FACT]` ([ru.wikipedia: Стожары](https://ru.wikipedia.org/wiki/Стожары), citing Rut 1987 "Russian folk
  astronymy").
- **The night by cockcrow** (Russian peasant tradition): first cocks ≈ midnight, second cocks — before the dawn, third cocks — the dawn itself
  `[FACT, via search summary]` ([Kirov museum article](https://kirmuseum.org/sites/default/files/ebook/2021/kuznecovoi_i._a._stata_1_kv._2021.pdf),
  [Michelson's phrase dictionary](https://dic.academic.ru/dic.nsf/michelson_new/7610/%D0%BF%D0%B5%D1%82%D1%83%D1%85%D0%B8)). Mapped to e: third
  cocks ≈ civil dawn; second cocks ≈ nautical `[REC]`.
- Kolo / Kolyada and the moon (Месяц) lore were not researched with sources this round.

---

## Sources (all opened 2026-10-13)

Astronomy and twilight: [Wikipedia Twilight](https://en.wikipedia.org/wiki/Twilight) · [USNO rise/set/twilight definitions (copy)](https://academics.uccs.edu/rtirado/PES_1600_SolarEnergy/Horizon_Rise_Set_Twilight.pdf) ·
[Wikipedia Sunrise](https://en.wikipedia.org/wiki/Sunrise) · [NOAA solar equations](https://gml.noaa.gov/grad/solcalc/solareqns.PDF) · [sunrise-sunset.org API](https://api.sunrise-sunset.org/json?lat=50.08&lng=14.42&date=2026-06-21&formatted=0) ·
[Wikipedia Belt of Venus](https://en.wikipedia.org/wiki/Belt_of_Venus) · [Wikipedia Earth's shadow](https://en.wikipedia.org/wiki/Earth%27s_shadow) · [WMO purple light](https://cloudatlas.wmo.int/en/purple-light.html) ·
[Wikipedia Sky brightness](https://en.wikipedia.org/wiki/Sky_brightness) · [hnsky SQM twilight](https://www.hnsky.org/sqm_twilight.htm) · [Hänel et al. 2018, arXiv 1709.09558](https://arxiv.org/pdf/1709.09558) ·
[NRIAG dawn depression](https://nriag.journals.ekb.eg/article_453025.html) (summary).
Light and luminance: [Wikipedia Lux](https://en.wikipedia.org/wiki/Lux) · [Daylight](https://en.wikipedia.org/wiki/Daylight) · [Orders of magnitude (luminance)](https://en.wikipedia.org/wiki/Orders_of_magnitude_(luminance)) ·
[USNO Circular 171 (DTIC)](https://apps.dtic.mil/sti/pdfs/AD1112511.pdf) via [skylight](https://github.com/bluegreen-labs/skylight) · [Spitschan et al. 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC4895134) ·
[Wikipedia Apparent magnitude](https://en.wikipedia.org/wiki/Apparent_magnitude) · [Color temperature](https://en.wikipedia.org/wiki/Color_temperature) · [Sunlight](https://en.wikipedia.org/wiki/Sunlight) ·
[Exposure value](https://en.wikipedia.org/wiki/Exposure_value) · [Purkinje effect](https://en.wikipedia.org/wiki/Purkinje_effect) · [Ocean Optics Web Book](https://oceanopticsbook.info/view/surfaces/the-level-sea-surface) (summary).
Night and moon: [Jensen et al. 2001](https://graphics.cs.yale.edu/sites/default/files/nightsky.pdf) · [Moonlight](https://en.wikipedia.org/wiki/Moonlight) · [Opposition surge](https://en.wikipedia.org/wiki/Opposition_surge) ·
[Lunar phase](https://en.wikipedia.org/wiki/Lunar_phase) · [Lunar eclipse](https://en.wikipedia.org/wiki/Lunar_eclipse) · [Danjon scale](https://en.wikipedia.org/wiki/Danjon_scale) · [NASA Danjon](https://eclipse.gsfc.nasa.gov/OH/OHres/Danjon.html) ·
[Bortle scale](https://en.wikipedia.org/wiki/Bortle_scale) · [Zodiacal light](https://en.wikipedia.org/wiki/Zodiacal_light) · [Naked eye](https://en.wikipedia.org/wiki/Naked_eye) · [arXiv 1307.2038](https://arxiv.org/pdf/1307.2038) (summary) ·
[Sky & Telescope](https://skyandtelescope.org/observing/useful-projects-for-a-lunar-eclipse/) (summary) · [Science Focus](https://www.sciencefocus.com/science/why-is-the-moon-sometimes-visible-during-the-day) (summary) · [Universe Today](https://www.universetoday.com/articles/why-can-we-see-the-moon-during-the-day) (summary).
Engines: [Unreal Sky Atmosphere](https://dev.epicgames.com/documentation/en-us/unreal-engine/sky-atmosphere-component-in-unreal-engine) · [Unreal physical lighting units](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-physical-lighting-units-in-unreal-engine) ·
[Hillaire 2020](https://diglib.eg.org/handle/10.1111/cgf14050) · [Unity forum](https://forum.unity.com/threads/possible-bug-hdrp-physically-based-sky-sudden-flash-of-light-when-sun-first-moves.1214043/) (summary) · [Godot forum](https://forum.godotengine.org/t/simple-sky-shader-replacement/133402) (summary).
Slavic: [Zorya](https://en.wikipedia.org/wiki/Zorya) · [Денница](https://ru.wikipedia.org/wiki/Денница) · [Стожары](https://ru.wikipedia.org/wiki/Стожары) · [Kirov museum](https://kirmuseum.org/sites/default/files/ebook/2021/kuznecovoi_i._a._stata_1_kv._2021.pdf) (summary).
Blocked and not used: timeanddate.com (403), AMS glossary (403), DTIC illumination report AD0632918 (403).
