# TC — the HUD temperature text: red from the strong heat stage, blue from the strong cold stage, and the colour holds

> **Created:** 2026-11-01 · **Basis:** `[OWNER]` 2026-11-01 10:10 «в виджете ХУДа температура 37, и белая» · «баг» · «все что на пороге и выше этого порога -
> красным» · «а все, что на пороге и ниже порога сильного холода - синим»; stages from `W_SmoothHP::Get_TempImage` (notes `UIMod_Hosav.md`)

## Stand

- The build with `krinik_hud_outline.lua` (thresholds ±30, colour on every `EnergyReceived`); background launch; the owner's save; god on.
- Heat — the Caverns of Set (energy 33 at 10:10); cold / middle — the hero's energy set by the remote if the receiver has a setter, else a cold place
  at night (`BP_TimeOfDayManager_C:SetTimeOfDay`).
- Frames: `capture-window.ps1 -Width 3840`, crop of the temperature row; colour measured on the bright pixels of the text.

## Cases

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| T1 | energy ≥ 30 (≈ 37 °C and up) | look at the HUD at +5 s and +60 s | the temperature text red both times | pass | 10:21 caverns, energy 33: «39 °C» red at +5 s and +60 s (bright text pixels 206/110/101); before the fix the same frames were white (183/183/183 at 10:17) |
| T2 | energy between 20 and 30 («тепло») | look | white | pass | 10:24 beach, energy 21–22: «32 °C» white; the log «энергия 28.0 → зона norm» (the hysteresis exit at 29) |
| T3 | energy ≤ −30 | look | blue | partial | the log «энергия −30.0 → зона cold» 10:32:21 and «−29.0 → норм» 10:33:39 — the switch at the threshold; three north-west stands at night held −26…−30, no frame caught below −30 (the colour call is the one T1 framed red) |
| T4 | energy between −30 and 30 | look | white | pass | T2 is inside this band; energy 0…−26 logged «norm» |
| T5 | the HUD rebuilt (a new HUD after world entry) | look 5 s after | the colour of the current zone (the reported bug: white at 37) | pass | the cause: the field search took the two class TEMPLATES («полей 2») and coloured them; now «полей 3 (новые)» — the live fields, red on the frame |
| T6 | cost | the log | no per-frame work: the colour set only inside `EnergyReceived` (≈ 1 /s) | pass | the colour set only on a zone change or new fields (6 log lines in 12 min) |

Cold stand (for the next run): energy ≤ −30 was reached only in flight over (-280000, -180000) at night; on the ground at (-300000, -260000) 02:00 the
energy held −30.2 at most. A colder point is still to be found (game map).
