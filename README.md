# Bangkok Guide

A personal travel knowledge base for Bangkok, Thailand — covering food, shopping, hotels, transport, attractions, cafes, and massage.

Built with vanilla HTML + CSS + JavaScript. Data-driven JSON content. No frameworks, no build step.

## Project Goal

Provide a curated, structured, and easy-to-navigate personal guide to Bangkok. This project is intentionally a **single-city knowledge base**. Future city guides (Tokyo, Seoul, etc.) will be developed as independent repositories using the same architecture.

## Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom styles, responsive layout
- **JavaScript** — Vanilla JS, no frameworks
- **JSON** — Structured content database

## Content Schema

All data follows the schema defined in [`docs/content-schema.md`](docs/content-schema.md).

Key features:
- Multi-dimensional tagging (style, food, experience, audience, budget)
- Multilingual name support (English, Thai, Chinese)
- Conditional rendering — missing fields produce no empty UI
- Verification tracking for data quality

### Data Files

| File | Entries | Description |
|------|---------|-------------|
| `data/categories.json` | 7 | Category registry |
| `data/food.json` | 29 | Restaurants, street food, markets, buffets |

## Architecture

```
DATA (JSON)  →  RENDERER (JS)  →  UI (HTML/CSS)
```

Three strictly separated layers:

| Layer | Responsibility | Files |
|---|---|---|
| **Data Layer** | All content | `/data/*.json` |
| **Logic Layer** | Read JSON, build DOM | `/js/*.js` |
| **Presentation Layer** | Page shells + styling | `/*.html`, `/css/*.css` |

## Development

### Preview Locally

```bash
python -m http.server 8000
# Then open http://localhost:8000
```

Serve over HTTP — `file://` won't work for `fetch()` loading JSON.

## Deployment

Deployed via GitHub Pages: [https://jahgorforge.github.io/bangkok-guide/](https://jahgorforge.github.io/bangkok-guide/)

## Development Status

**Current Phase:** Phase 2.5 — Schema v1.0 complete, content migration in progress.

### Completed
- ✅ Project structure and templates
- ✅ UI design system (champagne palette, SVG icons, responsive layout)
- ✅ Navigation (sidebar, mobile hamburger, category wayfinding)
- ✅ Search and tag filtering
- ✅ Content schema v1.0 (`docs/content-schema.md`)
- ✅ Food data migrated to new schema (29 entries)
- ✅ Multiple data verification levels

### In Progress
- Content migration for remaining categories (attractions, shopping, hotels, etc.)

## Creating a New City Guide

See [`docs/content-schema.md`](docs/content-schema.md) for the replication guide.
