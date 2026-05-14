# Mutation Circle Redesign — Design Spec
**Date:** 2026-05-14
**Status:** Approved

---

## Context

The mutation selection is currently a static 2-column card grid embedded in the Character Overview (middle panel). It has no visual connection to the active skill slots it affects, and the current implementation treats mutations as purely cosmetic — no additional slots are granted and no skill-type restrictions are enforced.

This redesign:
1. Moves the mutation UI into the Active Skills panel (right column), mirroring the in-game layout
2. Implements the 4 additional skill slots the active mutation grants in-game
3. Restricts those bonus slots to skills matching the mutation's associated type(s)
4. Adds a visual mutation circle with pie-chart coloring reflecting skill type(s)

---

## Data Changes

### 1. MUTATIONS array — add `types` field

Each mutation gains a `types` array mapping to skill color keys (`'combat'`, `'signs'`, `'alchemy'`). These drive slot filtering and circle coloring.

| Mutation | types |
|---|---|
| Euphoria | `['alchemy']` |
| Metamorphosis | `['combat', 'signs', 'alchemy']` |
| Piercing Cold | `['signs']` |
| Mutated Skin | `['combat', 'alchemy']` |
| Bloodbath | `['combat']` |
| Conductors of Magic | `['signs', 'combat']` |
| Magic Sensibilities | `['signs']` |
| Toxic Blood | `['alchemy']` |

Color mapping (already used by skill slots):
- `'combat'` → red (`var(--red)`, `#c0392b`)
- `'signs'` → blue (`var(--blue)`, `#2980b9`)
- `'alchemy'` → green (`var(--green)`, `#27ae60`)

### 2. State — add `mutSlots`

```js
S.mutSlots = [null, null, null, null]  // skill IDs or null, indices 0–3
```

Added to `S` alongside the existing `S.mutation`. Slots 0–1 render above the circle, slots 2–3 below.

### 3. URL encoding — include `mutSlots`

The payload object gains `mutSlots`:

```js
const payload = { skills: S.skills, slots: S.slots, mutation: S.mutation, mutSlots: S.mutSlots };
```

Decoding must default `mutSlots` to `[null, null, null, null]` when absent (backwards compatibility with existing shared URLs).

---

## Layout Changes

### Active Skills panel (`.char-right`)

Current: 2×2 grid of 4 skill groups.

New: vertical stack of three sections:

```
┌──────────────────────────────┐
│  [ Group 1 ]  [ Group 2 ]   │  ← existing, unchanged
├──────────────────────────────┤
│     [slot 0]  [slot 1]      │  ← bonus slots above (new)
│         ◎ CIRCLE            │  ← mutation circle (new)
│     [slot 2]  [slot 3]      │  ← bonus slots below (new)
├──────────────────────────────┤
│  [ Group 3 ]  [ Group 4 ]   │  ← existing, unchanged
└──────────────────────────────┘
```

The mutation section is a new block between the two group rows. It has no group header — it is a standalone element.

### Character Overview panel (`.char-scroll`)

The Blood & Wine mutation section (`.mut-none` + `.mut-grid`) is **removed**. The middle panel now shows only: level card, stats/summary info.

---

## Mutation Circle

### Visual
- **Size:** ~70px diameter, centered horizontally in the mutation section
- **Fill:** CSS `conic-gradient` — one equal arc per type in `mutation.types`
  - 1 type → solid color
  - 2 types → 180° each
  - 3 types → 120° each
  - No mutation → solid grey (`#444`)
- **Border:** 2px solid `var(--gold)` (`#d4a843`)
- **Inner ring:** dark cutout (~54px) showing the mutation name in gold serif font, or `"—"` if none
- **Glow:** `box-shadow` in the dominant type color, softened

### Interaction
- Click → opens the mutation selection modal (new `openMutModal()`)
- No drag-and-drop — circle is not a skill slot

---

## Mutation Selection Modal

### Trigger
`openMutModal()` — sets `.show` on `#mutation-modal`. Closed by `closeMutModal()` or clicking the overlay.

### Structure
```
┌─────────────────────────────┐
│ SELECT MUTATION          [✕] │
├─────────────────────────────┤
│  — No Mutation Selected —   │  ← full-width option
│ ┌───────────┐ ┌───────────┐ │
│ │ ◉  Name   │ │ ◉  Name   │ │  ← 2-column grid
│ │ type tags │ │ type tags │ │
│ │ desc text │ │ desc text │ │
│ └───────────┘ └───────────┘ │
│ ... (scrollable, 8 total)   │
└─────────────────────────────┘
```

### Each mutation card
- Pie-circle (38px, `conic-gradient` matching types)
- Name (serif, `var(--text)`)
- Type tags (colored spans: red/blue/green)
- Full description text

### Selection behaviour
- Clicking a card calls `selMut(id)`:
  - Sets `S.mutation = id`
  - Always **clears `S.mutSlots`** (all four set to `null`) — avoids stale skills from a prior mutation
  - Calls `fullRender()`
  - Closes the modal
- Clicking "No Mutation" calls `selMut(null)`:
  - Clears `S.mutation` and `S.mutSlots`
  - Calls `fullRender()`, closes modal

---

## Bonus Skill Slots

### Layout
Four slots arranged as two rows of two (side-by-side), each ~80px wide × 24px tall. Slots 0–1 above the circle, 2–3 below. Identical visual style to existing `.aslot`.

### Color bar indicator (Option C — approved)
A 3px strip at the bottom of each slot, divided into equal segments per accepted type. Implemented as a flex row of `<div>` segments, each with the corresponding background color.

Example — Euphoria (Alchemy only):
```
┌──────────────────────────┐
│       (slot content)     │
├──────────────────────────┤  ← 3px
│          green           │
└──────────────────────────┘
```

Example — Metamorphosis (all three):
```
┌──────────────────────────┐
│       (slot content)     │
├──────────────────────────┤
│  red  │  blue  │  green  │
└──────────────────────────┘
```

### When no mutation is selected
All four bonus slots are **hidden** (the mutation section shows only the grey circle, no slot rows). This avoids showing unfiltered empty slots that accept nothing.

### Type filtering
A skill can only be assigned to a bonus slot if its color key is in `activeMutation.types`. General skills (`'general'` / brown) are **never** accepted in bonus slots.

Filtering applies at the point of slot assignment via a dedicated `openBonusSM(slotIndex)` function (separate from the standard `openSM()`) so there is no branching in the existing slot-assignment path.

### Clearing on mutation change
When the active mutation changes (including clearing it), all four `S.mutSlots` entries are reset to `null` before rendering. This prevents invalid skills remaining in slots they no longer qualify for.

---

## Slot Assignment Flow (bonus slots)

1. User clicks an empty bonus slot → `openBonusSM(slotIndex)` opens the slot assignment modal
2. The modal lists only skills that are: (a) unlocked, (b) not already assigned to any standard slot or bonus slot, and (c) whose color key is in `activeMutation.types`
3. User clicks a skill → `assignBonusSlot(slotIndex, skillId)` sets `S.mutSlots[slotIndex]`, calls `fullRender()`
4. User clicks remove (✕) on an occupied slot → `unslotBonusSlot(slotIndex)` sets `S.mutSlots[slotIndex] = null`, calls `fullRender()`

---

## Render Function Changes

### `renderSlots()` — extended
Renders the mutation section between the two group rows. Calls a new helper `renderMutCircle()` and `renderBonusSlots()`.

### `renderMutations()` — repurposed
Currently renders the card grid in the middle panel. This function is **removed**. Its replacement is `renderMutCircle()` (circle only — no grid) and the modal is built dynamically in `openMutModal()`.

### `renderMutCircle()`
Returns the HTML string for the mutation circle element. Uses `conic-gradient` computed from `activeMutation.types`. Avoids nested template literals (existing CLAUDE.md constraint) — uses string concatenation.

### `renderBonusSlots()`
Returns HTML for the two rows of bonus slots (2 above + 2 below). Each slot knows its index. Uses the color bar for accepted types.

---

## Mobile

On mobile (≤600px), the Active Skills panel stacks below the skill trees. The mutation section remains centred. Bonus slots at full available width (side-by-side pair, each ~45% width). The circle scales down to ~56px. The modal uses the existing `.ov`/`.mdl` full-width overlay pattern.

---

## Spec Files to Update

| File | Change |
|---|---|
| `specs/spec-layout.md` | Remove mutation section from Character Overview; add mutation section to Active Skills panel spec |
| `specs/spec-state.md` | Add `mutSlots` to state shape and URL encoding section |
| `specs/spec-interactions.md` | Add mutation circle click, bonus slot assignment, mutation change clearing |
| `specs/spec-skills-data.md` | Add `types` field to each mutation entry |
| `specs/spec-mutations.md` | **New file** — authoritative spec for the mutation subsystem |

---

## New File: `specs/spec-mutations.md`

Covers: mutation data (with types), circle rendering rules (conic-gradient arcs), bonus slot layout, type filtering logic, modal behaviour, state clearing rules, mobile behaviour.

---

## Verification

1. Open `index.html` in Chrome and Safari
2. No mutation selected: circle is grey, no bonus slots visible
3. Select Bloodbath (combat-only): circle is solid red, 4 bonus slots appear with red bottom bar, only combat skills accepted
4. Select Metamorphosis (all types): circle has 3-segment pie, all non-general skills accepted in bonus slots
5. Change mutation from Bloodbath to Piercing Cold: bonus slots clear, circle turns blue
6. Slot a combat skill into a Euphoria (alchemy) bonus slot — should be rejected
7. URL share: encode a build with mutation + bonus slots, reload, verify correct restore
8. Mobile: verify mutation section renders correctly at ≤600px viewport
