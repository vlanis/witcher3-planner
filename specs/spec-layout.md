# Spec: Layout & CSS Architecture

---

## Overall structure

The page is a **fixed 3-column app layout** — header pinned at top, three panels filling the remaining viewport height. No page-level scroll. Each panel scrolls independently.

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER  (fixed height 46px, full width)                        │
├───────────────────┬─────────────────────────┬───────────────────┤
│                   │                         │                   │
│  TREE PANEL       │  CHARACTER PANEL        │  INFO PANEL       │
│  (580px fixed)    │  (flex: 1, min-width    │  (210px fixed)    │
│                   │   280px)                │                   │
│  scrolls          │  scrolls                │  scrolls          │
│  independently    │  independently          │  independently    │
│                   │                         │                   │
└───────────────────┴─────────────────────────┴───────────────────┘
```

---

## Critical CSS rules — do not change without testing

The following rules exist to fix cross-browser flex scroll bugs (Chrome, Safari, Firefox). Removing or changing them will break the layout:

```css
html, body {
  height: 100%;
  overflow: hidden;   /* prevents page-level scroll */
}

.app {
  display: flex;
  height: calc(100vh - 46px);
  overflow: hidden;   /* contains the three panels */
}

/* Each panel MUST have all three of these: */
.tree-panel {
  height: calc(100vh - 46px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Each scrollable body MUST have min-height: 0 */
/* Without this, Safari and Chrome collapse flex children to zero */
.tree-body {
  flex: 1;
  min-height: 0;      /* CRITICAL — do not remove */
  overflow-y: auto;
}

/* Same pattern applies to .char-scroll and .info-scroll */
```

**Why `min-height: 0` is required:** Flex items default to `min-height: auto`, which prevents them from shrinking below their content height. This makes `flex: 1` unable to constrain the child, so the parent's `overflow: hidden` clips the content to zero. Setting `min-height: 0` overrides this default and allows the flex child to scroll correctly.

---

## CSS variables

All colours and spacing use CSS custom properties defined in `:root`. Never use hardcoded hex values — always reference a variable.

```css
/* Colours */
--gold, --gold-l, --gold-d, --gold-dim   /* gold palette */
--red, --red-b, --red-bg, --red-bdr      /* combat / red skills */
--blue, --blue-b, --blue-bg, --blue-bdr  /* signs / blue skills */
--green, --green-b, --green-bg, --green-bdr  /* alchemy / green skills */
--brown, --brown-b                       /* general skills */

/* Backgrounds (dark layered) */
--bg      /* darkest — page background */
--bg2     /* header, panel backgrounds */
--bg3     /* card backgrounds */
--bg4     /* hover states */
--bg5     /* inset / input backgrounds */

/* Borders */
--border   /* subtle structural border */
--border2  /* more visible border */

/* Text */
--text     /* primary body text */
--text-d   /* dimmed / secondary text */
--text-b   /* bright / heading text */
```

---

## Left panel — skill tree

### Tree tabs
- 4 tabs (Combat, Signs, Alchemy, General)
- Each tab has a color class: `.combat`, `.signs`, `.alchemy`, `.general`
- Active tab underlined with branch color, subtle background tint
- Tab height: 44px minimum (tap target)

### Column headers
- Rendered as a CSS grid matching the skill grid columns
- 5 columns for Combat/Signs/Alchemy; 1 column for General
- Hidden when General tab is active (column headers not meaningful)
- Class `.col-hdr-row` with modifier `.gen` for General

### Tier rows
- Each tier row has a lock bar (`.tier-bar`) showing tier label + unlock requirement
- Lock bar uses `.unlocked` or `.locked` modifier class
- Below the lock bar: a CSS grid of skill nodes (`.tier-grid`)
- 5 columns: `grid-template-columns: repeat(5, 1fr)`
- 4 columns for General: `grid-template-columns: repeat(4, 1fr)`
- Gap: 3px between nodes

### Skill node (`.sn`)
- `min-height: 58px`
- 2px colored left border (`.sn::before`) — color matches branch
- State classes stacked: `.ranked` (has points), `.slotted` (in active slot), `.selected` (clicked), `.locked` (tier not unlocked), `.dragging` (being dragged)
- Content: icon row (`.sn-row1`) + description (`.sn-desc`, 2-line clamp) + bottom row (`.sn-bottom`) with rank pips and equip button

### Rank pips (`.pip`)
- 7×7px squares
- `.on.{color}` class when filled
- Right-aligned equip button (`.eq-btn`) after pips

---

## Middle panel — character

### Level card (`.lv-card`)
- Large level number (36px Cinzel) + label + reason text
- Skill points progress bar below
- Requirement pills (`.pills`) showing which thresholds are active

### Active skill slots section

The active slots panel uses a three-row layout when a mutation is active:

```
┌─────────────────────────────┐
│  Groups 0 & 1  (row 1–2)   │
├─────────────────────────────┤
│  Mutation section           │
│  [slot 0] [circle] [slot 1] │
│  [slot 2] [circle] [slot 3] │
├─────────────────────────────┤
│  Groups 2 & 3  (row 3–4)   │
└─────────────────────────────┘
```

When no mutation is active, the mutation section collapses to just the clickable circle (no bonus slots shown).

**Skill slot groups** (`.slots-grid`, 2-column grid of 4 groups):
- Each group (`.sg`) contains:
  - Header with mutagen diamond + label
  - 3 skill slots (`.aslot`)
  - Synergy bar (`.syn-bar`)
- Mutagen diamond (`.mut-d`): 16×16px, `transform: rotate(45deg)`
- Diamond color classes: `.rm` (red), `.bm` (blue), `.gm` (green)
- Skill slot height: 27px, dashed border when empty, solid when occupied

**Mutation circle** (`.mut-circle`):
- 70px diameter circle (56px on mobile)
- CSS `conic-gradient` background, one arc segment per type color
- 2px gold border (`var(--gold)`)
- Inner cutout text: mutation name abbreviation or "—"; Cinzel font, `var(--gold)` color
- Clickable — opens `#sel-mut-modal`
- `box-shadow` glow using the first type's color at 40% opacity

**Bonus slots** (`.mut-bonus-slot`, also `.aslot`):
- 4 total: indices 0–1 displayed above the circle, 2–3 below
- Only rendered when a mutation is active
- Same visual as standard `.aslot` + class `.mut-bonus-slot`
- 3px color bar at bottom of each slot — one segment per accepted type color (combat=`var(--red-b)`, signs=`var(--blue-b)`, alchemy=`var(--green-b)`)

---

## Right panel — info panel

- Fixed 210px width
- Shows detail for the selected skill
- Sections: icon → category badge → skill name → description → rank effects → tier status → action buttons
- Action buttons (`.ibtn`) are full-width, stacked vertically
- Placeholder text when nothing selected

---

## Modals

- Overlay (`.ov`): `position: fixed; inset: 0` with semi-transparent black
- Modal card (`.mdl`): centered, `min-width: 260px; max-width: 360px`
- Click outside modal to close
- Mutagen modal: list of coloured dot options
- Slot assignment modal: 2-column grid of 12 slot buttons
- Mutation selection modal (`#sel-mut-modal`): "No Mutation" option + 2-column grid of mutation cards, each with a mini conic circle, mutation name, type tags, and description
- Bonus slot skill picker (`#bonus-slot-modal`): filtered list of eligible skills (ranked, matching type color, not already slotted); 1-column on mobile

---

## Typography

| Context | Font | Size |
|---------|------|------|
| Labels, headings, buttons | Cinzel (serif display) | 7–13px |
| Body text, descriptions | Crimson Text (serif) | 10–15px |
| Skill node names | Cinzel | 8px |
| Tier bar labels | Cinzel | 7.5px |
| Rank effect text | Crimson Text | 10px |
| Header stats | Cinzel Bold | 14–15px |

---

## Z-index layers

| Layer | Value | What |
|-------|-------|------|
| Base content | 0 | Panels, skill nodes |
| Header | 50 | Sticky header bar |
| Tooltip | 999 | Hover tooltip |
| Modal overlay | 200 | Mutagen / slot modals |
| Drag ghost | 1000 | Custom drag label |

---

## Mobile responsive layout (≤1023px)

Tablet landscape (≥1024px) uses the unchanged desktop 3-column layout. Below 1024px, a separate CSS block (`@media (max-width: 1023px)`) activates a touch-first layout.

### Breakpoint summary

| Width | Layout |
|-------|--------|
| ≥1024px | Desktop — 3-column, drag-and-drop, hover tooltips |
| ≤1023px | Mobile — single column, slide-up sheet, action overlay |

### Key mobile changes

- **`.info-panel`** — hidden on mobile (no room; info accessible via action sheet)
- **`.char-panel`** — repositioned as a fixed slide-up sheet (72vh), toggled via `.sheet-open` class; `-webkit-transform: translateZ(0)` for iOS compositing
- **`.tree-panel`** — fills full width
- **Header** — shows `.hamburger-btn` (opens drawer) and `.mobile-hdr-stats` chip row (`#m-spent`, `#m-slotted`)
- **Mutation circle** — scales to 56px (from 70px desktop); bonus slots to 80px
- **Modals** (`#sel-mut-modal`, `#bonus-slot-modal`) — 1-column grid instead of 2-column

### Mobile-only static HTML elements

| Element | Purpose |
|---------|---------|
| `#sheet-footer` | "VIEW BUILD" button — opens the slide-up character sheet |
| `#sheet-handle` | Tap-to-close bar at top of sheet |
| `#mobile-menu` | Hamburger drawer (navigation, export, import, reset) |
| `#skill-action-overlay` | Dimmed backdrop for skill action sheet |
| `#skill-action` | Action sheet listing rank up / equip / remove options for a tapped skill |

### Mobile interaction routing

Skill node `onclick` branches on `window.innerWidth < 1024`:
- **Desktop:** `snClick(id)` — selects skill, updates info panel
- **Mobile:** `openSkillAction(id)` — opens action sheet overlay

Drag-and-drop (`ondragstart`) is fully suppressed on mobile. Slot assignment goes through the action sheet instead.

### Mobile JS functions

`openBuildSheet`, `closeBuildSheet`, `openMobileMenu`, `closeMobileMenu`, `openSkillAction`, `closeSkillAction`, `rankUpAction`, `removeSlotAction`

### `fullRender()` mobile sync

4 lines appended to `fullRender()` sync the mobile stat chips (`#m-spent`, `#m-slotted`) after every render.

---

## What must NOT be changed without explicit instruction

- `overflow: hidden` on `body` and `.app`
- `min-height: 0` on `.tree-body`, `.char-scroll`, `.info-scroll`
- `height: calc(100vh - 46px)` on `.app`, `.tree-panel`, `.char-panel`, `.info-panel`
- The `position: relative` + `::before` pattern on `.sn` for the colored left border
- CSS variable names (other code references them by name)
