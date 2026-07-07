# City Guide Project Template

## Overview

This document describes how to create a new city guide project (e.g. Tokyo, Seoul, Chiang Mai, Manila) using the same architecture as Bangkok Guide.

Each city guide is an **independent project/repository** — not a subdirectory of Bangkok Guide.

---

## Project Structure

```
{city}-guide/
│
├── index.html
├── category.html
│
├── pages/
│   └── {city-id}/
│       └── food.html
│       └── hotels.html
│       └── ...
│
├── css/
│   ├── layout.css
│   ├── sidebar.css
│   └── card.css
│
├── js/
│   ├── loader.js
│   ├── renderer.js
│   ├── sidebar.js
│   ├── filter.js
│   ├── icons.js
│   └── app.js
│
├── data/
│   ├── categories.json
│   ├── food.json
│   ├── hotels.json
│   └── ...
│
├── assets/
│   └── icons/
│       ├── food.svg
│       ├── shopping.svg
│       ├── home.svg
│       └── ...
│
└── docs/
    ├── 01-ProjectBrief.md
    ├── 02-Sitemap.md
    └── content-schema.md (copy from Bangkok Guide)
```

---

## Step-by-step Process

### Step 1 — Clone Project Structure

Copy the project skeleton from Bangkok Guide. Remove all data files and keep only empty arrays.

Or create from scratch following the structure above.

### Step 2 — Write Project Brief

Create `docs/01-ProjectBrief.md` defining:
- City scope
- Target content categories
- Design direction

### Step 3 — Research Content (Gemini)

Use a dedicated Gemini project or conversation to research locations.

For each category, ask Gemini to produce structured research using this format:

```
# {Place Name}

### Basic Information
- Name:
- Thai/Local Name:
- Category:
- Area:
- Transport:

### Summary

### Highlights

### Practical Information
- Hours:
- Price Range:
- Reservation:

### Tags
- {tag}

### Personal Notes
```

### Step 4 — Convert to JSON

Map Gemini research into the Content Schema v1.0 defined in `docs/content-schema.md`.

Required fields:
```json
{
  "id": "{city}-{category}-{number}",
  "name": { "en": "", "local": "", "zh": "" },
  "type": "",
  "category": "",
  "location": { "district": "", "coordinates": { "lat": null, "lng": null } },
  "tags": { "style":[], "food":[], "experience":[], "audience":[], "budget":[] },
  "experience": { "summary": "", "highlights": [] },
  "practical": { "priceRange": "", "openingHours": "" },
  "links": { "googleMaps": "" },
  "verification": { "status": "needs-review", "issues": [] }
}
```

### Step 5 — Frontend Setup

Copy the frontend files from Bangkok Guide:

| File | Modify? |
|------|---------|
| `index.html` | Update title |
| `pages/` | Update paths if needed |
| `css/` | Usually no changes |
| `js/app.js` | Update `dataBase` path if needed |
| `js/icons.js` | No changes needed |
| `data/categories.json` | Update with city-specific categories |

### Step 6 — Update Navigation

- Update `data/categories.json` with local category names
- Check sidebar navigation links
- Verify all page-to-page links

### Step 7 — Test Locally

```bash
python -m http.server 8000
# Open http://localhost:8000
```

Check:
- Home page loads
- Each category page renders
- Sidebar navigation works
- Search/filter functions
- Mobile responsive layout

### Step 8 — Deploy

1. Create GitHub repository: `{username}/{city}-guide`
2. Push code
3. Enable GitHub Pages (Settings → Pages → main / root)
4. Site at: `https://{username}.github.io/{city}-guide/`

---

## Files That Stay Identical

These files typically need no changes between city projects:

```
css/layout.css
css/sidebar.css
css/card.css

js/loader.js
js/renderer.js
js/sidebar.js
js/filter.js
js/icons.js

assets/icons/*.svg
```

---

## Files That Need City-specific Updates

| File | What to change |
|------|----------------|
| `index.html` | Title, description |
| `data/categories.json` | Category labels in local language |
| `data/*.json` | All content data |
| `README.md` | Project name and description |

---

## Content Generation Workflow

```
Gemini Research (Markdown)
        │
        ▼
Data Organization (manual or script)
        │
        ▼
JSON Database (content-schema v1.0)
        │
        ▼
Frontend Rendering (renderer.js)
        │
        ▼
Static Website (GitHub Pages)
```

---

## Design Constraints

All city guides should follow the same design principles:

- **No frameworks** — Vanilla HTML + CSS + JS
- **No build step** — Files served as-is
- **Single city per repo** — No multi-city in one project
- **Data-driven** — All content in JSON
- **Privacy-first** — Personal notes stay in JSON, never exposed in HTML
- **"Simple but not cheap"** — Minimal, clean, editorial feel
