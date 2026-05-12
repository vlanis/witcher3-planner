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

## 2026-05-12 — Responsive mobile layout

**Changed:**
- Added `@media (max-width: 1023px)` CSS block for all mobile overrides. Tablet landscape (≥1024px) keeps the unchanged desktop 3-column layout.
- `.char-panel` repositioned as a fixed slide-up sheet (72vh) toggled via `.sheet-open` class; `-webkit-transform: translateZ(0)` added for iOS fixed-position compositing.
- `.info-panel` hidden on mobile (excluded per `spec-interactions.md`).
- Skill tap on mobile routes to an action sheet overlay instead of hover tooltip + drag-and-drop.
- New static HTML elements added: `#sheet-footer` (VIEW BUILD button), `#sheet-handle` (tap-to-close bar), `#mobile-menu` (hamburger drawer), `#skill-action-overlay`, `#skill-action`.
- New header elements: `.hamburger-btn`, `.mobile-hdr-stats` with `#m-spent` / `#m-slotted` stat chips.
- New JS functions: `openBuildSheet`, `closeBuildSheet`, `openMobileMenu`, `closeMobileMenu`, `openSkillAction`, `closeSkillAction`, `rankUpAction`, `removeSlotAction`.
- `fullRender()` — 4 lines appended to sync mobile stat chips after every render.
- `renderSN()` — onclick branches on `window.innerWidth < 1024` to route to action sheet; `ondragstart` suppressed on mobile.

**Why:** Desktop-only layout was unusable on phones and tablets below 1024px. Mobile users need a tap-driven interaction model since drag-and-drop and hover tooltips are not viable on touch screens.

**Watch out:**
- `overflow: visible` was removed from `.app` — it conflicted with the desktop spec and had to be cleared before mobile sheet positioning worked correctly.
- `!important` removed from `#sheet-footer display` so JS `toggle`/`show`/`hide` can override it; do not re-add it.
- `-webkit-tap-highlight-color: transparent` added to interactive elements — do not remove or iOS tap flash returns.
- Drag-and-drop is fully disabled on mobile (no fallback partial support); action sheet is the only slot-assignment path on touch devices.
- Known limitation: no mobile testing on real Safari iOS hardware yet — Chrome DevTools device toolbar was used. Verify on Safari iOS before treating mobile as stable.

---

## Next session — things to consider

- The `?b=` URL can get very long for complex builds — could consider LZ compression (lz-string library) if URL length becomes a problem
- Keyboard navigation / accessibility not implemented
- No visual feedback on drag-start (ghost label works but node could also dim more clearly)
- Verify mobile layout on real Safari iOS hardware (action sheet, slide-up build panel, hamburger menu)
