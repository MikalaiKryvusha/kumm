# Plan 40 — EPIC: the six unfinished 1.0.0 items of the Conan build — implement, test in game, ship

> **Created:** 2026-11-01 · **Parent:** plan 39 (the honest list), section B; `[OWNER]` 2026-11-01 13:27 «пишем на всё ЭПИК план, а затем по фазам эпиков - операционные
> планы работ по реализации и тестированию и упаковки в поставку модов»
> **Status:** meta-plan written 2026-11-01 13:27 +03:00 (the chat closed at the context limit right after); phase operational plans — one per phase, written when the phase starts
> (the ladder: `/plan-epic`); phase 1 is next
> **Outbound:** the owner's eye on this meta-plan; forks per phase go to `interviews/`

## Goal vector (Achieve)

Six things the owner asked for 1.0.0 are not done or not proven (plan 39 B1–B6). Where we want to be: each of them works in the live game by the player's path,
is SEEN working (a frame or a log number per case, a run report per phase), and ships inside the build's mods and archive — or the owner moves it to the next
version by his word. No «done» / «ready» is said before the phase's acceptance table is all «seen».

## Acceptance criteria (one per phase, scenario form in each operational plan)

| # | Phase | Seen when |
|---|---|---|
| 1 | Vignettes (B1) | hunger / thirst at 5 %, health at 15 %: with the shipped defaults — no hunger / thirst vignette, a barely visible health one; each of the three shkalas moved in the window changes the vignette's strength on a frame, far left = none |
| 2 | Hub shkalas audit (A1, prerequisite of release) | every one of the 19 rows of «Моды Krinik'а» moved, saved, its effect seen in game; a row with no effect fixed or removed |
| 3 | Inventory button + list (B2) | one «Настройки модов» button in the inventory bar, a vertical list «Моды Krinik'а» · «Моды Xevyr'а» · «Рыбалка» · «Прочее» (plan 38), each entry opens its window; Hosav's and fishing buttons gone from the bar; Esc closes only the top window |
| 4 | Arrows in the corpse (B3) | 3 arrows in a Kappa and in a humanoid stay on the ragdoll at the hit places after the kill (frames), E picks one (arrow count +1), the rest go with the corpse |
| 5 | Frame cost (B4) | A-B-A-B flights build vs. build-without-our-Lua-mods: our mods ≤ 1 ms in the worst gameplay frame (PresentMon + the sections' own `os.clock` with the game in front), the blink spikes explained or gone |
| 6 | 16:9 gate (B5) | every window of the build that we brought or changed — frames at 720p, 1080p, 2K, 4K full screen; text readable, nothing cut or overlapping |
| 7 | Package and archive (B6) | `make_volumes.sh` run; the volumes unpacked on a clean game copy; `install.cmd` → `-Verify` green, the desktop shortcut present, world entered, phases 1–6 spot-checked in that install; the uninstaller returns the game and removes the shortcut |

## Phases — order and why

| Phase | What | Why this order | Gate |
|---|---|---|---|
| 1 | Vignettes: recon (`W_FullScreenEffectContainer`, `W_FullScreenBuffEffect`, `T_BuffFullScreenEffect_HungerThirst`; locate the low-health one), then the KrinikConanUI section + three hub rows + defaults | the owner's newest explicit 1.0.0 order; small and visible | criterion 1 |
| 2 | Hub shkalas audit | the window is already shipped to players; any dead row is a lie in the product | criterion 2 |
| 3 | Inventory button + list (plan 38 phase 1; «Моды Xevyr'а» / «Прочее» — the hub mode with «Открыть окно мода» rows unless the owner says otherwise — an interview) | depends on the hub being honest (phase 2) | criterion 3 |
| 4 | Arrows in the corpse — research first (`/bug-research`): unbinding `OnDestroyed` vs. a copy with its own hit vs. a visual arrow + loot items | three blind attempts are spent (report 2026-11-01_conan-arrows-corpse-recon) | criterion 4 |
| 5 | Frame cost | must measure the FINAL Lua set (after 1–4) | criterion 5 |
| 6 | 16:9 gate | must frame the FINAL UI (after 1–3) | criterion 6 |
| 7 | Package and archive; then the documents (guide, README) refreshed from the phase reports, not from the work log | the owner's order: archive and documents LAST | criterion 7 | <!-- attribution-ok: `[OWNER]` 2026-11-01 11:11–11:12 «релизный архив соберем и все документы обновим, когда сборку сделаем и протестируем на всех разрешениях 16 к 9» — verbatim in STATUS.md «ORDER» -->

Each phase's operational plan: `plans/40_epic40_phase<N>_<slug>.md` — steps with checkboxes, the stand (HOUSE_RULES rule 11), the case file in `testcases/`, the
run report, the packaging step (the mod's source in the pack, `modpack.json` entry, `-Deploy -Only` + `-Verify`), and the mod notes updated in the same commit.

## Risks

- (a) The vignettes may be drawn by a material whose strength is not a widget property — then a material parameter or the widget's opacity per buff.
- (a) Phase 2 can surface more dead rows than time allows tonight — the owner decides: fix or remove for 1.0.0.
- (b) The arrows may need a pak edit of `BP_DummyProjectile` (house rule 8) rather than Lua.
- (b) Background-window timing is wall-clock: phase 5 measures with the game in FRONT (the owner's screen) — schedule it with him.
- (c) A new owner order mid-epic re-ranks the phases (he decides).

## Decisions made without the owner

(filled at the epic's close)
