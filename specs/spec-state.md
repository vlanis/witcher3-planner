# Spec: State, Calculations & URL Encoding

---

## State object shape

The entire application state lives in a single `const S` object:

```js
const S = {
  // Skills invested: id -> rank (1-3). Absent key = rank 0 / not unlocked.
  skills: {},

  // 4 active slot groups. Each has a mutagen and 3 skill slots.
  slots: [
    { mut: null, skills: [null, null, null] },  // group 0
    { mut: null, skills: [null, null, null] },  // group 1
    { mut: null, skills: [null, null, null] },  // group 2
    { mut: null, skills: [null, null, null] },  // group 3
  ],

  // Selected Blood & Wine mutation id, or null
  mutation: null,

  // Bonus skill slots granted by the active mutation (4 total: 0-1 above circle, 2-3 below)
  mutSlots: [null, null, null, null],  // skill IDs at indices 0–3; null = empty

  // UI state (not persisted)
  tree: 'combat',      // active tree tab: 'combat' | 'signs' | 'alchemy' | 'general'
  sel: null,           // selected skill id, or null
  pendMG: null,        // pending mutagen group index (while modal is open)
  pendSS: null,        // pending slot-assign skill id (while modal is open)
  pendBS: null,        // pending bonus slot index (while #bonus-slot-modal is open)
};
```

**`slots[g].mut`** values: `null` | `'r'` | `'b'` | `'g'`

**`slots[g].skills[s]`** values: `null` | skill id string

---

## Persisted vs UI state

Only `skills`, `slots`, `mutation`, and `mutSlots` are persisted in the URL. The UI state (`tree`, `sel`, `pendMG`, `pendSS`, `pendBS`) is always reset on load.

---

## URL encoding

```js
// Encode
const payload = { skills: S.skills, slots: S.slots, mutation: S.mutation, mutSlots: S.mutSlots };
const code = btoa(JSON.stringify(payload));
const url = window.location.origin + window.location.pathname + '?b=' + code;

// Decode (on page load or import)
const raw = urlOrCode.includes('?b=') ? urlOrCode.split('?b=')[1] : urlOrCode;
const payload = JSON.parse(atob(raw));
```

The import function accepts both a raw base64 code and a full URL.

**Backwards compatibility:** If a stored payload does not contain `mutSlots` (old builds), default to `[null, null, null, null]` on decode.

---

## Derived values

These are computed on demand (not stored in state):

### `branchPts(color)`
Total skill points invested in a given branch color.
```js
function branchPts(color) {
  return Object.entries(S.skills)
    .filter(([id]) => SKILLS[id]?.color === color)
    .reduce((sum, [, rank]) => sum + rank, 0);
}
```

### `totalPts()`
Sum of all invested ranks across all skills.

### `slottedCount()`
Number of non-null entries across all 4 groups × 3 slots.

### `tierUnlocked(treeName, req)`
`branchPts(TREES[treeName].color) >= req`

### `isSlotted(id)`
Whether a skill id appears in any slot across any group.

---

## Minimum level calculation

The minimum character level required for the current build is the maximum of four independent constraints:

### 1. Slot constraint
```
slotLevels = [1, 2, 4, 6, 8, 10, 12, 15, 18, 22, 26, 30]
lvFromSlots = slotLevels[slottedCount - 1]  (or 1 if nothing slotted)
```

### 2. Points constraint
Players earn roughly 1 skill point per level. Places of Power grant up to ~30 bonus points. Conservative estimate:
```
lvFromPts = max(1, totalPts - 30)
```

### 3. Tier constraint
Tier 2 requires 6 branch pts, Tier 3 = 12, Tier 4 = 18. The level must be sufficient to have invested those points:
```
lvFromTiers = max(
  combatPts >= 18 ? 18 : combatPts >= 12 ? 12 : combatPts >= 6 ? 6 : 1,
  signsPts  >= 18 ? 18 : signsPts  >= 12 ? 12 : signsPts  >= 6 ? 6 : 1,
  alchPts   >= 18 ? 18 : alchPts   >= 12 ? 12 : alchPts   >= 6 ? 6 : 1
)
```

### 4. Mutagen slot constraint
Mutagen slots unlock one per group at levels 3, 9, 16, 28:
```
mutagenLevels = [3, 9, 16, 28]
lastFilledGroup = highest index i where slots[i].mut !== null  (or -1 if none)
lvFromMutagens = lastFilledGroup >= 0 ? mutagenLevels[lastFilledGroup] : 1
```

**Result:** `minLevel = max(lvFromSlots, lvFromPts, lvFromTiers, lvFromMutagens)`

---

## Render pipeline

Every state change calls `fullRender()` which calls all four render functions in order:

```
fullRender()
  ├── renderTree()    — rebuilds the skill grid HTML for the active tab
  ├── renderSlots()   — rebuilds the 4-group active slots panel + mutation circle + bonus slots
  ├── renderLevel()   — updates level number, pts bar, pills, header stats
  └── renderInfo()    — updates the right-panel skill detail (or placeholder)
```

Note: `renderMutations()` was removed in the mutation circle redesign. Mutation state (circle, bonus slots, modal) is now rendered inline within `renderSlots()`.

Each render function generates HTML via string concatenation and sets `.innerHTML` on its target element. There is no virtual DOM or diffing — full re-render on every interaction.

---

## Skill node rendering (`renderSN`)

Builds a `.sn` div as a string. Key attributes:
- `class`: space-joined list of state classes (`sn`, color, `locked`, `ranked`, `slotted`, `selected`, `dragging`)
- `draggable="true"`: only set when `rank > 0 && !locked`
- `data-id="skill_id"`: used by contextmenu handler and drag-drop
- `onclick`: calls `snClick(id)` if unlocked, empty string if locked
- `ondragstart`: calls `onSnDragStart(event, id)`

Rank pips use string concatenation (not template literals with nested backticks) to avoid Safari parse errors.

---

## Known fragility points

1. **Nested backticks** — the render functions use string concatenation for dynamic onclick attributes. Do not refactor to nested template literals — Safari's JS engine rejects them at parse time.

2. **`innerHTML` re-render** — all renders are full replacements. Event listeners must use inline `onclick`/`ondragstart` attributes; `addEventListener` on rendered elements will be lost on next render.

3. **Script placement** — the `<script>` tag is at the end of `<body>`. All DOM element references (`document.getElementById`) work because the script runs after the HTML is parsed. Do not move the script to `<head>` without adding `defer`.
