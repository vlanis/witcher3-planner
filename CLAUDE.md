# Witcher 3 Build Planner — Project Brief

## What this is

A single-file, self-contained HTML build planner for **The Witcher 3: Wild Hunt (Next Gen / Patch 4.0)**. No build step, no framework, no server — one `.html` file that opens directly in a browser.

The planner lets players design a character build before committing skill points in-game: unlock skills, assign them to active slots, slot mutagens, choose a Blood & Wine mutation, and share the result via a URL.

---

## Technology

- **Pure HTML + CSS + vanilla JS** — no libraries, no bundler, no npm
- CSS lives in `styles.css` (external file, must load before `index.html`'s script)
- Game data (skills, mutations, constants) lives in `data.js` (must load before `index.html`'s script)
- Remaining JS lives in a single `<script>` block at the bottom of `<body>` in `index.html`
- No external dependencies except a Google Fonts import (Cinzel + Crimson Text)
- Runs as a local file (`file://`) or hosted on any static host (GitHub Pages, Netlify)

---

## Game data accuracy

All skill data is sourced from the Witcher Wiki (witcher.fandom.com) and reflects **Patch 4.0 (Next Gen Update)** specifically:

- All investable skills max at **Rank 3** (was Rank 5 pre-4.0)
- Acquired Tolerance toxicity bonus is 50% lower than pre-4.0
- Delayed Recovery threshold changed to 55% (buffed)
- Survival Instinct gives +15% max Vitality (was +500 flat)
- Battle Trance is a **root passive**, always active, not an unlockable skill
- Heavy Artillery triples bomb damage (was ×2 pre-4.0)

---

## Skill tree structure

Three main trees (Combat, Signs, Alchemy) each follow an identical grid:
- **5 columns** — one per sub-branch
- **4 rows (Tiers)** — one skill per cell (column × tier intersection)
- Tier unlock thresholds: T1=0 pts, T2=6 pts, T3=12 pts, T4=18 pts (points in that branch)

General skills are a flat list of 20 single-rank skills with no tier gate.

See `spec-skills-data.md` for the complete authoritative skill list.

---

## Key constraints — never break these

1. **Three-file app** — `index.html` (markup + render logic), `styles.css` (all styles), `data.js` (all game data). No additional files.
2. **No external JS libraries** — no React, no Vue, no jQuery
3. **Game accuracy** — skill names, descriptions, and tier positions must match the wiki exactly
4. **URL sharing** — the `?b=` query parameter must always encode/decode correctly
5. **No backend** — everything runs client-side only
6. **Safari + Chrome + Firefox desktop** — must work in all three; do not use APIs unavailable in Safari

---

## Files in this project

| File | Purpose |
|------|---------|
| `index.html` | Markup, render logic, and event handlers |
| `styles.css` | All CSS — desktop layout, mobile responsive, animations |
| `data.js` | All game data: SKILLS, MUTATIONS, TREES, TIER_THRESHOLDS, COLOR_HEX, COLOR_CODE |
| `CLAUDE.md` | This file — project context for Claude CLI |
| `specs/spec-skills-data.md` | Authoritative skill data (names, descriptions, ranks, tier positions) |
| `specs/spec-interactions.md` | All user interactions and expected behaviours |
| `specs/spec-layout.md` | Layout structure, CSS architecture, sizing rules |
| `specs/spec-mutations.md` | Mutation circle, bonus slots, type filtering, state |
| `specs/spec-state.md` | State shape, URL encoding, data flow |
| `dev-log.md` | Running log of changes made and issues encountered |

---

## Render architecture

Every state mutation calls `fullRender()`, which fully replaces `.innerHTML` in four panels in order: `renderTree()` → `renderSlots()` → `renderLevel()` → `renderInfo()`. No diffing, no virtual DOM — full replacement every time. (`renderMutations()` was removed in the mutation circle redesign — mutation state is now rendered inline within `renderSlots()`.)

---

## Known fragility points — read before touching render code

1. **No nested template literals** — `renderSN`, `renderInfo`, and related functions build HTML via string concatenation. Do not refactor to nested backtick template literals; Safari's JS engine rejects them at parse time and the whole page breaks silently.

2. **Inline event handlers only** — all `onclick`, `ondragstart`, etc. must be inline attributes on the generated HTML strings. `addEventListener` bindings on rendered elements are destroyed on the next `fullRender()` call.

3. **Script at end of `<body>`** — the `<script>` tag relies on the DOM already being parsed. Do not move it to `<head>` without adding `defer`.

---

## Spec authority order

When skill data conflicts across sources: `specs/spec-skills-data.md` > Witcher Wiki > `dev-log.md` > code comments.

---

## Dev-log discipline

Update `dev-log.md` at the end of every Claude CLI session using the template at the top of that file. This is the primary way context carries forward between sessions.

---

## Testing workflow

No build step. To test: open `index.html` directly in a browser (`file://` works). Verify in Chrome and Safari at minimum — Firefox is lower priority but should not be broken.
