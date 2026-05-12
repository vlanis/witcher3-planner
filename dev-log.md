# Dev Log

Running log of changes, bugs, and decisions. Update this after every Claude CLI session so context carries forward.

---

## Session template

```
## YYYY-MM-DD — [brief topic]
**Changed:** what was modified
**Why:** reason / what was broken
**Watch out:** anything fragile or that might need revisiting
```

---

## 2026-05 — Initial build (Claude.ai chat)

### Features implemented
- Single-file HTML build planner
- 5×4 grid skill tree (Combat, Signs, Alchemy) + General flat list
- Accurate Patch 4.0 skill data sourced from Witcher Wiki
- Active skill slots panel: 4 groups × 3 slots with mutagen diamonds
- Color synergy indicator per group
- Blood & Wine mutation selector (8 mutations)
- Minimum level calculator
- Skill point counter
- Click to rank up / rank pips for precise rank setting
- Right-click to downrank
- Drag-and-drop skill → active slot
- Equip (☆/★) button on skill nodes
- Info panel (right column) with full skill detail and action buttons
- Export build as shareable URL (`?b=` param)
- Import from URL or raw code
- URL auto-load on page open
- Export toast notification

### Bugs fixed along the way
- Nested backtick JS syntax error (Safari rejects them) — fixed by converting to string concatenation throughout `renderSN` and `renderInfo`
- `rounds: null` stray property on `advanced_pyrotechnics` skill — removed
- Flex child height collapse in Chrome/Safari — fixed with `min-height: 0` on all scrollable flex children + explicit `height: calc(100vh - 46px)` on all three panels
- Script block truncation after revert operation — all action functions (`switchTree`, `fullRender`, etc.) were silently cut; restored by re-injecting the full actions block

### Data corrections applied
- Survival Instinct: +500 flat → +15% max Vitality (Patch 4.0 change)
- General skills: expanded from 13 to 20 (added Combat's Fires, Battle Frenzy, Heavy Artillery, Gorged on Power, Attack is the Best Defense, Gourmet, Strong Back)
- Battle Trance: moved from investable skill to root passive note
- Killing Spree: moved to Tier 4 of Trial of the Grasses column (was misplaced)
- Precise Blows: moved to Tier 2 of Fast Attack column (was at Tier 1)
- All fabricated Tier 4 skills removed and replaced with wiki-accurate ones
- Combat columns renamed: "Crossbow" → "Marksmanship"

### Architecture decisions
- Single file: deliberate, makes hosting trivial and sharing easy
- No framework: keeps it auditable and editable without tooling
- Full innerHTML re-render: simple and sufficient; no virtual DOM needed
- Inline onclick attributes: required because innerHTML wipes addEventListener bindings

---

## Next session — things to consider

- Mobile layout: the current layout is desktop-only (3-column fixed). Mobile was attempted but reverted due to layout bugs. A proper responsive approach would likely need a tab-based single-column layout on mobile rather than stacked panels.
- The `?b=` URL can get very long for complex builds — could consider LZ compression (lz-string library) if URL length becomes a problem
- Keyboard navigation / accessibility not implemented
- No visual feedback on drag-start (ghost label works but node could also dim more clearly)
