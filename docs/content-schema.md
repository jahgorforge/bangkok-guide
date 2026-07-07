# Bangkok Guide — Content Database Schema v1.0

## Overview

This document defines the standardized content schema for the Bangkok Guide project.

The schema is designed to be **reusable across city guide projects** (Bangkok, Tokyo, Manila, etc.).

Each city guide creates its own data files following this exact schema so that the frontend rendering pipeline can remain identical.

---

## Principles

- Every field is optional unless marked **REQUIRED**
- Missing fields render as `""` or `null` — never produce empty UI
- Content is separated from presentation (no HTML in JSON)
- Tags use English for cross-city consistency
- Names use multilingual object for flexible display

---

## File Organization

```
data/
  categories.json        ← Category registry (unchanged from v0)
  food.json              ← Food & dining entries
  hotels.json            ← Hotel entries
  transport.json         ← Transport entries
  attractions.json       ← Attractions entries
  cafes.json             ← Cafe entries
  massage.json           ← Massage/spa entries
  shopping.json          ← Shopping entries
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

  "area": "",

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
    "source": ""
  },

  "links": {
    "googleMaps": "",
    "website": "",
    "social": ""
  },

  "recommendation": {
    "bestTime": "",
    "visitDuration": "",
    "nearby": [],
    "priority": ""
  },

  "notes": "",

  "verification": {
    "status": "",
    "issues": []
  }
}
```

---

## Field Reference

### `id` (REQUIRED)

Format: `{city}-{category}-{number}`

Examples:
```
bangkok-food-001
bangkok-attraction-001
tokyo-food-001
```

Number is zero-padded to 3 digits for consistent sorting.

---

### `name` (REQUIRED)

Multilingual name object. At minimum `en` should be populated.

| Field | Description |
|-------|-------------|
| `en` | English name |
| `local` | Name in local language (e.g. Thai) |
| `zh` | Chinese name (if applicable) |

---

### `type`

Subcategory within the main category. Uses the taxonomy defined below.

---

### `category` (REQUIRED)

Top-level category. Must match a key in `categories.json`.

---

### `area`

Neighborhood or district name. Used for filtering and "near me" queries.

Example: `"Bang Kapi"`, `"Talat Phlu"`, `"Siam Square"`

---

### `location`

| Field | Description |
|-------|-------------|
| `district` | Broader district/area |
| `address` | Full street address (if known) |
| `coordinates.lat/lng` | Decimal coordinates for map display |

---

### `tags`

Multi-dimensional tagging system for granular filtering.

| Dimension | Description | Examples |
|-----------|-------------|----------|
| `style` | Culinary/service style | `street-food`, `fine-dining`, `buffet`, `cafe` |
| `food` | Type of food (for dining) | `seafood`, `noodle`, `grill`, `dessert` |
| `experience` | What to expect | `queue`, `famous`, `local`, `touristy`, `instagrammable` |
| `audience` | Who it's for | `solo`, `couple`, `family`, `food-lover`, `group` |
| `budget` | Cost tier | `cheap`, `mid-range`, `expensive`, `premium` |

---

### `experience`

| Field | Description |
|-------|-------------|
| `summary` | Short editorial summary (1-2 sentences) |
| `bestFor` | Best use cases: `["dinner", "date-night", "group-gathering"]` |
| `highlights` | Key highlights / must-try items |

---

### `practical`

| Field | Description |
|-------|-------------|
| `priceRange` | Price indicator: `$` / `$$` / `$$$` / `$$$$` |
| `openingHours` | Opening hours text |
| `reservation` | Reservation policy |
| `transport` | How to get there (nearest BTS/MRT, etc.) |

---

### `rating`

| Field | Description |
|-------|-------------|
| `overall` | Numeric rating (1.0 - 5.0) |
| `source` | Source of rating: `personal`, `google`, `michelin`, etc. |

---

### `links`

| Field | Description |
|-------|-------------|
| `googleMaps` | Google Maps URL |
| `website` | Official website |
| `social` | Social media URL(s) |

---

### `recommendation`

Frontend-facing recommendation metadata.

| Field | Description |
|-------|-------------|
| `bestTime` | Best time to visit: `"18:00-22:00"`, `"weekday morning"` |
| `visitDuration` | Expected visit duration: `"1-2 hours"`, `"2-3 hours"` |
| `nearby` | Nearby places of interest |
| `priority` | Visit priority: `"must-visit"`, `"if-in-area"`, `"optional"` |

---

### `notes`

Free-text personal notes. Content asset from research — not displayed by default but available for reference.

---

### `verification`

Data quality tracking.

| Field | Description |
|-------|-------------|
| `status` | `"verified"`, `"needs-review"`, `"uncertain"` |
| `issues` | Array of specific issues to review |

---

## Category Taxonomy

### Food & Dining (`food`)

| Type | Description | Examples |
|------|-------------|----------|
| `restaurant` | Sit-down restaurant | Sorn, Laemcharoen |
| `street-food` | Street food stall | Jay Fai, Thip Samai |
| `buffet` | All-you-can-eat buffet | Copper Beyond, GYUMA |
| `food-court` | Food court / food hall | IT Square, Happyland Center |
| `market` | Fresh market with food | Thonburi Market Place, Bang Kapi Market |
| `food-area` | Food street / food district | Yaowarat Road |
| `night-market` | Night market | Train Night Market, Save One Go |
| `dessert` | Dessert / ice cream shop | Khanom Wan, Ni-Ang |
| `cafe` | Coffee shop / cafe | MiVana |

### Attractions (`attractions`)

| Type | Description |
|------|-------------|
| `temple` | Temple / religious site |
| `museum` | Museum / gallery |
| `viewpoint` | Observation deck / viewpoint |
| `park` | Park / garden |
| `neighborhood` | Walking district / historic area |

### Shopping (`shopping`)

| Type | Description |
|------|-------------|
| `mall` | Shopping mall |
| `market` | Market / bazaar |
| `local-shop` | Local / independent shop |

### Transport (`transport`)

| Type | Description |
|------|-------------|
| `bts` | BTS Skytrain |
| `mrt` | MRT subway |
| `taxi` | Taxi / ride-hailing |
| `airport` | Airport transfer |

---

## City Replication Guide

To create a new city guide (e.g. Tokyo):

1. Copy this schema document as reference
2. Create `data/{city}/` directory
3. Create `categories.json` with city-specific categories
4. Create data files following this schema
5. Copy HTML templates from Bangkok Guide
6. Update `js/app.js` to point to new data files

No schema changes should be needed — the frontend renders from the schema, not from hardcoded field assumptions.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-07-07 | Initial schema design |

