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

## 2026-05-15 — CSS and data extraction

**Changed:**
- Created `styles.css` (~505 lines) — all CSS extracted from `<style>` block in `index.html`, includes desktop, mobile responsive, and animation rules.
- Created `data.js` — all game data constants (SKILLS, MUTATIONS, tier thresholds, color mappings) extracted from inlined data objects.
- Restructured SKILLS and MUTATIONS: translatable strings now wrapped in `text: { name, desc, ranks }` object for i18n readiness; structural properties (`icon`, `color`, `max`) remain top-level.
- Renamed conflicting color mappings: three `colorMap` declarations consolidated to `COLOR_HEX` (RGB hex values) and `COLOR_CODE` (single-letter skill color codes).
- New constant: `TIER_THRESHOLDS = [0, 6, 12, 18]` — replaces inline threshold checks throughout render logic.
- Deduplicated globals: `SL`, `ML`, `mc`, `typeColors`, `colorN` — were re-declared in multiple function bodies, now single definitions in data.js.
- Updated `index.html` property paths and removed all extracted data; full integration of external files into render functions.
- `index.html` size: ~1629 lines → ~870 lines.

**Why:** Single-file structure was becoming unwieldy and code review unfriendly. Extracting styles and data improves maintainability, allows version control of game data separately from UI logic, and prepares the codebase for potential i18n (translation support). Deduplication of locals removes hidden state bugs and improves testability.

**Watch out:**
- `data.js` must be loaded before `index.html`'s `<script>` block for all constants to be available at runtime.
- Changing SKILLS or MUTATIONS `text` structure or adding new `types` requires coordinated updates in render functions (especially `renderSN`, `mutConicGrad`, bonus slot filtering).
- `COLOR_HEX` and `COLOR_CODE` are now the source of truth — any color changes must go there; removing one will break downstream usage.
- CSS extracted to file — ensure `styles.css` is served or embedded before `index.html` loads to avoid FOUC (flash of unstyled content) in production.

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

## 2026-05-15 — Mutation circle redesign

**Changed:**
- **Layout restructure:** Mutation selection moved from Character Overview (middle panel) to Active Skills panel (right panel). Replaced static mutation card grid with clickable 70px mutation circle (conic-gradient pie chart, gold border).
- **State expansion:** Added `types` array to each MUTATIONS entry (drives circle segment colors and bonus slot filtering). Added `S.mutSlots = [null,null,null,null]` to state (persisted in URL encoding).
- **Bonus slots:** 4 new skill slots appear above and below the mutation circle when a mutation is active. Slots filter by skill color matching mutation `types` — each slot shows a 3px bottom color bar indicating accepted types.
- **UI components:** New `#sel-mut-modal` for 2-column mutation selection (pie circle + type tags + description per mutation). New `#bonus-slot-modal` for filtered skill assignment UI.
- **New JS functions:** `mutConicGrad()`, `renderMutCircle()`, `openSelMutModal()`, `closeSelMutModal()`, `openBonusSM()`, `closeBonusSM()`, `assignBonusSlot()`, `unslotBonusSlot()`.
- **Updated functions:** `renderSlots()` (restructured for new layout), `selMut()`, `unslot()`, `fullRender()`, `exportBuild()`, `importBuild()`, `resetAll()`.
- **Drag-and-drop:** Extended to support bonus slots with type validation (only skills matching mutation types can be dragged to bonus slots).
- **Mobile CSS:** Mutation circle scaled to 56px on mobile (≤1023px). Bonus slots 80px. Modal 1-column on ≤1023px.
- **JS code style:** All new functions use `var` + `function` keywords (no `const`/`let`, no arrow functions). No nested template literals to preserve Safari compatibility.
- **Cleanup:** Removed `renderMutations()` entirely. Updated all 4 spec files. Created new `specs/spec-mutations.md` documenting mutation types and bonus slot behavior.

**Why:** Previous design put mutation selection in a cramped spot (Character Overview panel) where it competed with skill detail info. Bonus slots introduce a strategic element: player can invest extra points into complementary skills for their chosen mutation. Circular pie chart visualizes the mutation's type composition more intuitively than static cards.

**Issues encountered and resolved:**
- Block-scoped function declarations inside `if` blocks (`barHTML`, `bSlot`) caused Safari to hang. Fixed by converting them to `var` expressions (e.g., `var barHTML = function() { ... }`).
- Duplicate `.slots-grid` CSS rule found in two places; removed one copy.
- `renderGroup` was declared as a function inside an `if` block. Converted to `var` expression for consistency and Safari safety.

**Watch out:**
- The 4-way mutation type system (Red, Blue, Yellow, Green) must align across `mutConicGrad()`, bonus slot filtering, and drag-and-drop validation. Changing mutation `types` requires updating all three places.
- `mutConicGrad()` uses 4 hardcoded stops (0°, 90°, 180°, 270°) to map colors. If types ever change in count or order, this function must be rebuilt entirely.
- Bonus slots only appear when a mutation is selected. Deselecting the mutation wipes all bonus-slot skills (handled in `selMut()` reset block). Users are notified in the spec but not warned in-UI.
- Mobile modal still uses `position: fixed` for modals; verify on real Safari iOS to ensure proper layering and dismiss behavior.

---

## Next session — things to consider

- The `?b=` URL can get very long for complex builds — could consider LZ compression (lz-string library) if URL length becomes a problem
- Keyboard navigation / accessibility not implemented
- No visual feedback on drag-start (ghost label works but node could also dim more clearly)
- Verify mobile layout on real Safari iOS hardware (action sheet, slide-up build panel, hamburger menu, mutation circle modal)
- Consider adding a "clear bonus slots" quick action if players want to swap mutations and reset bonus assignments atomically
