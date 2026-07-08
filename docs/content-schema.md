# City Guide — Content Database Schema v2.0

## Overview

This document defines the standardized content schema for city guide projects.

Each city is an independent repository sharing the same schema so that:
- The frontend rendering pipeline is identical across cities
- Data files are interchangeable
- New cities can be created by cloning + replacing data

---

## Two Content Formats

The framework uses two complementary content formats for different purposes:

### Markdown — Guide Layer (`content/essential-guide.md`)

- **Not part of the JSON schema.**
- The Essential Guide is a plain Markdown file displayed on the homepage.
- Used for editorial, narrative content: city orientation, practical advice, travel tips.
- Rendered as white section cards with accordion behavior on mobile.
- Markdown was chosen because it is human-readable, easy to edit, and perfect for mixed content (text, tables, lists, links).
- No schema validation needed — content is reviewed visually.

### JSON — Structured Data Layer (`data/*.json`)

- **This schema document applies only to JSON data files.**
- Used for structured, searchable place data.
- Each JSON file represents one category (food, hotels, attractions, etc.).
- Enables filtering, sorting, and consistent card rendering.
- Schema validation ensures frontend compatibility across all cities.

**Separation rule:** Editorial content lives in Markdown. Structured place data lives in JSON. Never mix the two.

---

## Principles

- **JSON is the source of truth for structured data** — all place data lives in JSON files
- **Markdown is the source of truth for editorial content** — the Essential Guide lives in `content/essential-guide.md`
- **Content ≠ Presentation** — no HTML in JSON, no hardcoded content in HTML
- **Every field is optional** unless marked **REQUIRED**
- **Missing fields produce no empty UI** — render as `""` or `null`
- **Tags are English keys** — display names resolved via `taxonomy/tags.json`
- **Names are multilingual** — `{en, local, zh}` for flexible display

---

## Language Rules

### User-facing content (must be Chinese)

| Field | Language | Example |
|-------|----------|---------|
| `experience.summary` | Chinese | 曼谷唯一保有米其林星的街头小吃 |
| `notes` | Chinese | 排队需2-3小时 |
| `experience.highlights` | Chinese | 蟹肉蛋卷 |

### Internal system fields (must be English)

| Field | Language | Example |
|-------|----------|---------|
| `id` | English | `bangkok-food-001` |
| `category` | English | `food` |
| `type` | English | `street-food` |
| `tags.*` | English | `seafood`, `michelin` |
| `name.en` | English | `Jay Fai` |
| `name.local` | Local | `เจ๊ไฝ` |

---

## File Organization

```
content/
  essential-guide.md        ← Guide Layer (Markdown, not part of JSON schema)

data/
  categories.json           ← Category registry (required)
  food.json                 ← Restaurants, street food, buffets
  hotels.json               ← Hotels, hostels, apartments
  attractions.json          ← Temples, museums, parks, landmarks
  shopping.json             ← Malls, markets, shops
  cafes.json                ← Coffee shops, dessert shops
  transport.json            ← BTS, MRT, taxis, airport
  massage.json              ← Massage and SPA

taxonomy/
  tags.json                 ← Global tag dictionary (English → Chinese)

css/
  markdown.css              ← Markdown typography and section card styles

js/
  markdown.js               ← Markdown-to-HTML converter (used by homepage)
```

---

## Item Schema

```json
{
  "id": "city-category-number",

  "name": {
    "en": "",
    "local": "",
    "zh": ""
  },

  "type": "",

  "category": "",

  "location": {
    "district": "",
    "address": "",
    "coordinates": {
      "lat": null,
      "lng": null
    }
  },

  "tags": {
    "style": [],
    "food": [],
    "experience": [],
    "audience": [],
    "budget": []
  },

  "experience": {
    "summary": "",
    "bestFor": [],
    "highlights": []
  },

  "practical": {
    "priceRange": "",
    "openingHours": "",
    "reservation": "",
    "transport": ""
  },

  "rating": {
    "overall": null,
    "reviewCount": null,
    "source": ""
  },

  "links": {
    "googleMaps": "",
    "phone": "",
    "website": ""
  },

  "recommendation": {
    "bestTime": "",
    "visitDuration": "",
    "nearby": [],
    "priority": ""
  },

  "verification": {
    "status": "",
    "issues": []
  },

  "notes": ""
}
```

---

## Field Reference

### `id` (REQUIRED)

Format: `{city}-{category}-{number}` (zero-padded to 3 digits).

Examples:
```
bangkok-food-001
tokyo-attraction-001
```

### `name` (REQUIRED)

| Subfield | Requirement | Example |
|----------|-------------|---------|
| `en` | Required | `Jay Fai` |
| `local` | If available | `เจ๊ไฝ` |
| `zh` | If commonly used | `痣姐` |

Frontend displays: English (primary) + Local (secondary). Chinese is stored but not shown on card.

### `type`

Subcategory used for filtering and badge display.

Examples: `street-food`, `restaurant`, `buffet`, `museum`, `park`, `mall`, `boutique`.

### `category` (REQUIRED)

Must match a key in `categories.json`. Current valid values: `food`, `hotels`, `attractions`, `shopping`, `cafes`, `transport`, `massage`.

### `tags`

Multi-dimensional tagging system. All values are **English keys**; display names come from `taxonomy/tags.json`.

| Dimension | Purpose | Examples |
|-----------|---------|----------|
| `style` | Service style | `street-food`, `fine-dining`, `boutique` |
| `food` | Type of food | `seafood`, `noodle`, `grill` |
| `experience` | What to expect | `queue`, `famous`, `instagrammable` |
| `audience` | Who it's for | `solo`, `family`, `food-lover` |
| `budget` | Cost tier | `cheap`, `mid-range`, `premium` |

### `experience`

| Field | Type | Description |
|-------|------|-------------|
| `summary` | string | Short Chinese description (≤30 chars preferred) |
| `bestFor` | string[] | Use cases: `["dinner", "date-night"]` |
| `highlights` | string[] | Key reasons to visit, signature dishes |

### `practical`

| Field | Type | Description |
|-------|------|-------------|
| `priceRange` | string | `$` / `$$` / `$$$` / `$$$$` |
| `openingHours` | string | e.g. `10:00-22:00` |
| `reservation` | string | Policy: `Required`, `Recommended`, `Not needed` |
| `transport` | string | How to get there |

### `rating`

| Field | Type | Description |
|-------|------|-------------|
| `overall` | number | 1.0 - 5.0 |
| `reviewCount` | number | Number of Google reviews |
| `source` | string | `Google Maps`, `personal` |

### `links`

| Field | Type | Description |
|-------|------|-------------|
| `googleMaps` | string | Google Maps URL |
| `phone` | string | International format: `+66...` |
| `website` | string | Official website |

### `recommendation`

| Field | Type | Description |
|-------|------|-------------|
| `bestTime` | string | Best time to visit |
| `visitDuration` | string | Expected visit duration |
| `nearby` | string[] | Nearby places of interest |
| `priority` | string | `must-visit`, `if-in-area`, `optional` |

### `verification`

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `verified`, `needs-review`, `uncertain` |
| `issues` | string[] | Specific items to verify |

---

## Tag Dictionary System

Tags are stored as English keys in data files. Display names are resolved via `taxonomy/tags.json`.

### File: `taxonomy/tags.json`

```json
{
  "street-food": {
    "zh": "街头小吃"
  },
  "seafood": {
    "zh": "海鲜"
  },
  "michelin": {
    "zh": "米其林"
  }
}
```

### Resolution Rule

```
display = tagDictionary[tag]?.zh || tag
```

If no mapping exists, the English key is displayed as-is (hyphens converted to spaces).

### Maintenance

When adding new tags to data files, also add an entry to `tags.json`. This keeps the display layer consistent across all cities.

---

## Category Taxonomy

### Food

| Type | Description |
|------|-------------|
| `restaurant` | Sit-down restaurant |
| `street-food` | Street food stall |
| `buffet` | All-you-can-eat |
| `food-court` | Food hall |
| `market` | Fresh market with food |
| `night-market` | Night market |
| `dessert` | Dessert / ice cream |
| `cafe` | Coffee shop |

### Hotels

| Type | Description |
|------|-------------|
| `boutique` | Boutique hotel |
| `apartment` | Apartment hotel |
| `budget` | Budget hotel |
| `hostel` | Hostel |
| `transit` | Transit near airport |

### Attractions

| Type | Description |
|------|-------------|
| `museum` | Museum |
| `park` | Park / garden |
| `landmark` | Landmark / stadium |
| `neighborhood` | Historic / walking district |
| `temple` | Temple / religious site |
| `viewpoint` | Observation deck / viewpoint |

### Shopping

| Type | Description |
|------|-------------|
| `mall` | Shopping mall |
| `market` | Market / bazaar |

---

## Content Quality Guidelines

- **Summaries must be Chinese** — concise, practical, ≤30 characters preferred
- **Avoid generic AI descriptions** — no exaggerated marketing language
- **Prefer practical information** — transport tips, best times, suitable audiences
- **Do not invent facts** — if information is unavailable, leave as `null` or `""`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v2.0 | 2026-07-08 | Added Guide Layer documentation, Markdown vs JSON distinction |
| v1.0 | 2026-07-07 | Initial schema design |
