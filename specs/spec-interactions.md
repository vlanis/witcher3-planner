# Spec: Interactions

All user-facing interactions in the planner. When adding or changing behaviour, verify against this file.

---

## Skill tree panel

### Clicking a skill node (`.sn`)
- If the skill's tier is **locked** (insufficient branch points): no action
- If the skill is **unranked** and tier is unlocked: set rank to 1, select the skill, re-render
- If the skill is already ranked: select the skill (updates info panel), no rank change
- Selecting an already-selected skill: deselects it (clears info panel)

### Clicking a rank pip (`.pip`)
- Pip at rank N clicked when current rank < N: set rank to N
- Pip at rank N clicked when current rank == N (clicking the highest active pip): downrank by 1 (toggle off)
- Pip click stops propagation — does not also trigger node click
- If downranking to 0: skill is removed from any active slot it occupies

### Right-click on a skill node
- Decrements rank by 1
- If rank reaches 0: skill is removed from any active slot
- Browser context menu is suppressed for skill nodes only
- Does nothing if the skill is locked or unranked

### Equip button (`.eq-btn`, ☆/★)
- Only visible when skill rank > 0 and tier is unlocked
- ☆ (not slotted): opens the slot assignment modal
- ★ (already slotted): immediately removes the skill from its current slot

### Tree tab switching
- Switches the visible skill tree
- Clears the selected skill
- Re-renders the tree and info panel

---

## Drag and drop (skill → active slot)

- Only ranked skills (rank > 0) are draggable
- Dragging an unranked skill: `preventDefault()`, drag does not start
- On drag start: browser's default ghost is hidden; a custom floating label appears at cursor
- While dragging over an empty `.aslot`: slot highlights gold (`.drag-over` class)
- Occupied slots do not highlight and cannot receive a drop
- On drop onto empty slot: skill is assigned to that slot; if the skill was already in another slot, it is removed from there first
- On drag end (drop anywhere non-slot, or Escape): ghost removed, highlight cleared, nothing assigned

---

## Active skill slots panel

### Clicking the mutagen diamond (`.mut-d`)
- Opens the mutagen selector modal for that group
- Options: Remove / Greater Red / Greater Blue / Greater Green

### Clicking ✕ on an occupied slot
- Removes that skill from the slot immediately; no confirmation

### Synergy indicator
- Shown below each group's slots
- **No mutagen:** grey, "No mutagen slotted"
- **Partial match (1–2 skills match mutagen color):** gold-dim, "◆ N/3 match"
- **Full match (all 3 occupied slots match mutagen color):** bright gold, "✦ Full Synergy"
- Matching slots show a subtle inner glow

---

## Info panel (right column)

- Updates when a skill node is clicked
- Shows: icon, branch category, skill name, full description, all rank effects, tier unlock status, action buttons
- **UPGRADE → RN button:** visible when rank < max and tier is unlocked; sets rank to N
- **DOWNGRADE button:** visible when rank > 0; decrements rank (labeled "DOWNGRADE (REMOVE)" at rank 1)
- **EQUIP TO SLOT button:** visible when rank > 0, not already slotted; opens slot modal
- **REMOVE FROM SLOT button:** visible when skill is slotted; removes from slot immediately
- When no skill is selected: shows placeholder text

---

## Slot assignment modal

- Opens when EQUIP TO SLOT is clicked or ☆ equip button is clicked
- Shows a 2-column grid of 12 slots (4 groups × 3 slots)
- Empty slots: clickable, if the group's mutagen color matches the skill color the slot is marked ✦ (synergy hint) in gold
- Occupied slots: greyed out, not clickable
- Clicking an empty slot: assigns skill to that slot, closes modal
- Clicking outside modal overlay: closes modal, no assignment

---

## Mutagen modal

- Opens when a mutagen diamond is clicked
- Options rendered as coloured dots + labels
- Selecting an option: sets mutagen for that group, closes modal
- "Remove Mutagen": clears the slot
- Clicking outside: closes, no change

---

## Mutation circle

The mutation circle replaces the old static mutation card grid. It lives in the Active Skills panel between skill groups 1–2 and 3–4.

- **Clicking the mutation circle** → calls `openSelMutModal()` → shows `#sel-mut-modal`
- **Clicking a mutation card in the modal** → calls `selMut(id)` → sets `S.mutation`, clears `S.mutSlots = [null,null,null,null]`, closes modal, calls `fullRender()`
- **Clicking "No Mutation" in the modal** → calls `selMut(null)` → same behaviour as above
- **Clicking outside the modal overlay** → calls `closeSelMutModal()`, no change

---

## Bonus slot interactions

Bonus slots (`.mut-bonus-slot`) appear above and below the mutation circle only when a mutation is active.

- **Clicking an empty bonus slot** → calls `openBonusSM(slotIndex)` → shows `#bonus-slot-modal` with skills filtered to those matching the mutation's accepted types
- **Clicking a skill in the bonus slot picker** → calls `assignBonusSlot(slotIndex, skillId)` → sets `S.mutSlots[slotIndex] = skillId`, closes modal, calls `fullRender()`
- **Clicking ✕ on an occupied bonus slot** → calls `unslotBonusSlot(slotIndex)` → sets `S.mutSlots[slotIndex] = null`, calls `fullRender()`
- **Changing the active mutation** (via `selMut`) → always clears all 4 `S.mutSlots` entries

---

## Mutation selection modal (`#sel-mut-modal`)

- Opened by `openSelMutModal()` (called from circle click)
- Content: "No Mutation" option at top, then 2-column grid of 8 mutation cards
- Each card shows: mini conic circle, mutation name, type tags, description
- Currently active mutation card is highlighted
- Clicking a card or "No Mutation" calls `selMut()` and closes modal
- Clicking outside the modal overlay calls `closeSelMutModal()`

---

## Bonus slot skill picker modal (`#bonus-slot-modal`)

- Opened by `openBonusSM(slotIndex)`
- Content: filtered list of eligible skills — must meet all three conditions:
  1. `S.skills[id] > 0` (has invested ranks)
  2. `SKILLS[id].color` maps to a color in the mutation's `types`
  3. `isSlotted(id)` is false (not already in a standard or bonus slot)
- Selecting a skill calls `assignBonusSlot(slotIndex, id)` and closes modal
- Clicking outside overlay calls `closeBonusSM()`, no assignment

---

## Header stats bar

Updates live on every state change:
- **MIN LV** — minimum character level required for this build (see spec-state.md for calculation)
- **SPENT** — total skill points invested across all trees
- **COMBAT / SIGNS / ALCHEMY** — points invested in each branch
- **SLOTTED** — number of active slots occupied / 12

---

## Export / Import / Reset

### EXPORT button
- Serialises current state to Base64 JSON
- Constructs a shareable URL: `<origin><pathname>?b=<base64>`
- Attempts to copy URL to clipboard via Clipboard API
- Falls back to `prompt()` dialog if clipboard is unavailable
- Shows a brief toast notification on success: "Build URL copied to clipboard!"

### IMPORT button
- Opens a `prompt()` dialog
- Accepts either a raw Base64 code or a full URL containing `?b=`
- Parses and loads the build; if invalid shows `alert('Invalid build code.')`

### RESET button
- Confirms with `confirm()` dialog before proceeding
- Clears all skills, all slots, clears mutation selection, clears all 4 bonus mutation slots (`S.mutSlots = [null,null,null,null]`)

### URL auto-import on page load
- On load, checks `window.location.search` for `?b=` parameter
- If found: decodes and applies the build silently
- If malformed: logs a warning to console, loads empty build

---

## Tooltip

- Appears on hover over any skill node or rank pip
- Shows skill name + current rank effect (or base description if unranked)
- Hovering a specific pip shows the effect for that rank
- Follows cursor with an offset; repositions to stay within viewport
- Disappears on mouse leave
- Desktop only — no tooltip on touch

---

## Keyboard / accessibility

No keyboard shortcuts currently implemented. Future consideration.
