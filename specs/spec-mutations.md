# Mutation Subsystem — Spec

This file is the authoritative reference for the Blood & Wine mutation circle, bonus slots, and all related rendering and interaction logic.

---

## Mutation Data

| ID | Name | Types | Description |
|---|---|---|---|
| euphoria | Euphoria | alchemy | Each toxicity point increases sword damage and Sign intensity by 0.75%. |
| metamorphosis | Metamorphosis | combat, signs, alchemy | Critical effects trigger random decoctions for 120s at no toxicity cost (up to 5 simultaneously). |
| piercing_cold | Piercing Cold | signs | Aard has 30% freeze chance. Knocked-down + frozen = instant death. |
| mutated_skin | Mutated Skin | combat, alchemy | Each AP reduces damage taken by 15% (max 45%). |
| bloodbath | Bloodbath | combat | Each kill: +5% attack power until hit (max 250% in 5-stack increments). |
| conductors_magic | Conductors of Magic | signs, combat | Sword attacks deal bonus damage equal to a % of Sign intensity. |
| magic_sensibilities | Magic Sensibilities | signs | Sword critical hits trigger a random sign effect for free. |
| toxic_blood | Toxic Blood | alchemy | Taking damage deals toxicity-scaled damage back to the attacker. |

---

## Circle Rendering

- Size: 70px diameter (56px on mobile)
- Background: CSS `conic-gradient` using equal arcs per type
  - 1 type: 360° solid
  - 2 types: 180° each
  - 3 types: 120° each
  - No mutation active: solid #555 (grey)
- Border: 2px solid `var(--gold)`
- Inner cutout: 52px circle (42px on mobile), shows mutation name abbreviation or "—" in `var(--gold)` Cinzel font
- Glow: `box-shadow` using the first type's color at 40% opacity
- Clickable — calls `openSelMutModal()`

---

## Bonus Slot Layout

- 4 slots total: indices 0–1 displayed above the circle, 2–3 below
- Only rendered when a mutation is active (hidden when `S.mutation === null`)
- Each slot uses the same `.aslot` visual as standard active skill slots, plus class `.mut-bonus-slot`
- Color bar: 3px strip at the bottom of each slot; one color segment per accepted type:
  - combat → `var(--red-b)` (#e05040)
  - signs → `var(--blue-b)` (#3498db)
  - alchemy → `var(--green-b)` (#27ae60)

---

## Type Filtering

**Type → color key mapping** (matches the `color` property on SKILLS entries):

| Type | Color key |
|------|-----------|
| combat | 'red' |
| signs | 'blue' |
| alchemy | 'green' |

A skill is eligible for a bonus slot if all three conditions are true:
1. `S.skills[id] > 0` — the skill has at least 1 invested rank
2. `SKILLS[id].color` is in the set of color keys derived from the mutation's `types`
3. `isSlotted(id)` is `false` — the skill is not already assigned to a standard slot or another bonus slot

General skills (color: `'brown'`) are never accepted in bonus slots.

---

## State

| Property | Type | Description |
|---|---|---|
| `S.mutation` | `string \| null` | Active mutation ID, or `null` for none |
| `S.mutSlots` | `[null\|string, null\|string, null\|string, null\|string]` | Skill IDs in bonus slots 0–3 |
| `S.pendBS` | `number \| null` | Bonus slot index currently being assigned (modal open), or `null` |

`S.pendBS` is UI-only and is never persisted in the URL.

---

## State Clearing Rules

| Action | Effect on mutSlots |
|---|---|
| `selMut(id)` (any id including null) | Sets `S.mutSlots = [null,null,null,null]` before `fullRender()` |
| `resetAll()` | Sets `S.mutation = null` and `S.mutSlots = [null,null,null,null]` |
| `unslot(id)` | Removes `id` from `S.mutSlots` in addition to `S.slots` |
| `unslotBonusSlot(i)` | Sets `S.mutSlots[i] = null`, calls `fullRender()` |

---

## Modal Behaviour

### `#sel-mut-modal` (Mutation Selection)

- **Opened by:** `openSelMutModal()` — called from the mutation circle `onclick`
- **Closed by:** `closeSelMutModal()` — called on backdrop click
- **Content:**
  - "No Mutation" option at the top
  - 2-column grid of 8 mutation cards; each card shows a mini conic circle, mutation name, type tags, and description
  - The currently active mutation card is visually highlighted
- **Selection:** clicking a card calls `selMut(id)`; clicking "No Mutation" calls `selMut(null)`

### `#bonus-slot-modal` (Bonus Slot Skill Picker)

- **Opened by:** `openBonusSM(slotIndex)` — called from an empty bonus slot `onclick`
- **Closed by:** `closeBonusSM()` — called on backdrop click or after selection
- **Content:** filtered list of eligible skills (see Type Filtering above), showing skill name and current rank
- **Selection:** clicking a skill calls `assignBonusSlot(slotIndex, skillId)`, assigns it to `S.mutSlots[slotIndex]`, and calls `fullRender()`

---

## URL Encoding

`S.mutSlots` is included in the persisted payload:

```js
const payload = { skills: S.skills, slots: S.slots, mutation: S.mutation, mutSlots: S.mutSlots };
```

**Backwards compatibility:** payloads that do not contain `mutSlots` (builds saved before this feature) default to `[null, null, null, null]` on decode.

---

## Mobile

| Property | Desktop | Mobile |
|---|---|---|
| Circle diameter | 70px | 56px |
| Inner cutout | 52px | 42px |
| Bonus slot width | standard `.aslot` width | 80px |
| Mutation modal grid | 2 columns | 1 column |
