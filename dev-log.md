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

## 2026-05-16 — Full skill data accuracy pass from Fandom wiki (Patch 4.0)

**Changed:** Comprehensive correction of all four trees by reading wiki tables directly via browser. All changes below are Patch 4.0 values replacing old pre-4.0 data.

**COMBAT:**
- `muscle_memory`: fast atk dmg +5/10/15% → +10/20/30%
- `precise_blows`: crit +2/4/6%, dmg +15/30/45% → crit +4/8/12%, dmg +25/50/75%
- `whirl`: stamina cost −10/20% → −33/50%
- `crippling_strikes`: 25 vit/s (scaling desc) → 50/100/150 vit/s for 5s
- `strength_training`: +5/10/15% → +10/20/30%
- `crushing_blows`: crit +2/4/6%, dmg +15/30/45% → crit +4/8/12%, dmg +25/50/75%
- `rend`: crit +10% / AP dmg 100% → crit +20/40/60% / AP dmg 33%
- `sunder_armor`: −5/10/15% → −10/20/30%
- `arrow_deflection`: max 3 → max 2 (level 3 removed in patch 4.0)
- `fleet_footed`: max 3 (20/60/100%) → max 1 (100%)
- `counterattack`: add knockdown at R2, crit+knockdown at R3
- `deadly_precision`: max 3 → max 2 (level 3 removed)
- `lightning_reflexes`: max 3 (+15/30/45%) → max 1 (+50%)
- `cold_blood`: +0.04/0.06/0.08 AP → +0.1/0.2/0.3 AP
- `anatomical_knowledge`: +5/10/15% → +20/40/60%
- `crippling_shot`: 5/7/10s → 10/20/30s
- `resolve`: −20/60/100% → −33/67/100%
- `undying`: ×2/×3 → +33%/+67% bonus language
- `razor_focus`: sword AP gen +5/10/15% → +10/20/30%
- `flood_of_anger`: intensity +25/50/75% → +100/200/300%

**SIGNS:**
- `aard_sweep`: knockdown bonus → knockdown penalty (−21/−17/0%) description fixed
- `shock_wave`: 40/80/120 dmg → 100/200/300 dmg
- `melt_armor`: max 15/45/75% → max 15/30/45%
- `firestream`: burn chance (+5/10%) → stamina cost (−25/50%)
- `exploding_shield`: stun → knockdown; removed invented % dmg values
- `active_shield`: 30/60/100% vitality conversion → stamina drain reduction description

**ALCHEMY:**
- `heightened_tolerance`: "+1/2/3% threshold" → "threshold 50%→60/70/80%"; adds bomb dmg bonus
- `refreshment`: 5/10/15% → 10/20/30%; adds bomb dmg bonus
- `delayed_recovery`: 90/70/55% → 90/80/70%
- `poisoned_blades`: 3/6/9% → 5/10/15%; adds bomb dmg bonus
- `protective_coating`: adds bomb dmg bonus
- `fixative`: adds "2/3 oils on sword" mechanic (new in patch 4.0)
- `steady_aim`: max 3 (15/30/45%) → max 1 (50%); adds bomb dmg bonus
- `pyrotechnics`: +30/60/90 → +50/100/150; adds bomb dmg bonus
- `acquired_tolerance`: +1 → +0.5 per formula; adds bomb dmg bonus
- `tissue_transmutation`: +200/400/600 → +300/600/900 Vitality; adds bomb dmg bonus
- `frenzy`: adds bomb dmg bonus
- `endure_pain`: adds bomb dmg bonus

**Why:** Wiki tables were read directly via Chrome browser (previous session had no access). Nearly every skill had at least one wrong value — most were pre-4.0 rank 1–3 values that were never updated when max ranks were reduced and bonuses rescaled.

**Watch out:**
- `arrow_deflection` (max:2), `fleet_footed` (max:1), `deadly_precision` (max:2), `lightning_reflexes` (max:1), `steady_aim` (max:1) now have fewer ranks. The `ranks[]` array length now matches `max`. The TREES grid positions are unchanged — only the SKILLS entries differ.
- Many alchemy skills now have "duration & bomb dmg +" pattern. The bomb dmg bonus from alchemy skills is a new Patch 4.0 mechanic.

---

## 2026-05-15 — Compact build export string

**Changed:**
- Replaced `btoa(JSON.stringify(...))` export with a custom delimited format using numeric indices.
- Format: `{skillSeg}~{slotSeg}~{mutSeg}~{mutSlotsSeg}` — skills as `idx:rank` pairs, slots as 4 `mut,s0,s1,s2` groups separated by `|`, mutation as index 0–7 or `-`, mutSlots as 4 indices or `-`.
- Indices derived from `Object.keys(SKILLS)` (insertion order) and `MUTATIONS` array position — both fixed constants, order must not change.
- Added `encodeBuild()` and `decodeBuild()` helpers; updated `exportBuild()`, `importBuild()`, and URL IIFE to use them.
- Applied `encodeURIComponent()` to the `?b=` value in the exported URL; `decodeURIComponent()` in `importBuild` when a full URL is pasted.
- Result: ~75% smaller export strings (e.g. mid-size build: ~760 → ~200 chars Base64).

**Why:** Full string IDs and JSON structure made even small builds produce 400–800 char URLs. Standard Base64 `+`/`/` chars in query strings are URL-unsafe (`+` decoded as space by `URLSearchParams`), which broke loading — fixed with percent-encoding on export.

**Watch out:**
- `Object.keys(SKILLS)` key order is the index table. Never reorder SKILLS or MUTATIONS entries — it would silently corrupt all existing shared URLs.
- Standard Base64 uses `+` and `/` which break in raw query strings; always use `encodeURIComponent` when embedding Base64 in a URL param.

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
