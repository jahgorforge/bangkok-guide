# Content Production Workflow

## Overview

Standard operating procedure for producing content for city guide projects.

This is the main guide for Phase 3 (large-scale content production).

---

## Content Pipeline

```
                 ┌──────────────────────────┐
                 │  Google Maps Saved Places │
                 │  (CSV export)             │
                 └────────────┬─────────────┘
                              │ Raw POI data
                              ▼
                 ┌──────────────────────────┐
                 │  Gemini Research          │
                 │  (per category)           │
                 └────────────┬─────────────┘
                              │ Structured markdown
                              ▼
                 ┌──────────────────────────┐
                 │  Claude Code Processing   │
                 │  → Parse markdown         │
                 │  → Map to schema          │
                 │  → Generate JSON          │
                 └────────────┬─────────────┘
                              │ Draft JSON
                              ▼
                 ┌──────────────────────────┐
                 │  Schema Validation        │
                 └────────────┬─────────────┘
                              │ Validated JSON
                              ▼
                 ┌──────────────────────────┐
                 │  Website Preview          │
                 │  (python http.server)     │
                 └────────────┬─────────────┘
                              │ Visual check
                              ▼
                 ┌──────────────────────────┐
                 │  Human Review             │
                 │  → Accuracy check         │
                 │  → Content quality        │
                 │  → Chinese summaries      │
                 └────────────┬─────────────┘
                              │ Approved
                              ▼
                 ┌──────────────────────────┐
                 │  Final JSON + Deploy      │
                 └──────────────────────────┘
```

---

## Step-by-Step Process

### Step 1: Export Data

Export your Google Maps saved places as CSV:
1. Google Maps → Your places → Saved
2. Export each list as CSV
3. CSV columns: `WKT`, `name`, `description`

### Step 2: Gemini Research

For each category, give Gemini the CSV data and ask for structured research.

Request format:

```
For each location in this CSV, produce a research document with:

- English Name
- Local/Thai Name (if available)
- POI Type (restaurant, museum, park, etc.)
- District
- Full Address
- Google Maps Rating
- Review Count
- Phone Number
- Opening Hours
- Highlights (3-5 bullet points)
- Best For (who is it for?)
- Nearby places
- Transportation
- A short summary
```

### Step 3: Structure Research

Save Gemini's output as a markdown file in `content/{category}/`.

File naming: `{category}_research_{source}.md`

### Step 4: Claude Code Processing

Give Claude Code:
1. The research markdown
2. The CSV (for ordering)
3. The content schema (`docs/content-schema.md`)

Claude Code will:
- Parse the markdown
- Map fields to the schema
- Generate valid JSON
- Validate the output

### Step 5: Validate

```bash
python -c "
import json
data = json.load(open('data/{category}.json'))
print(f'Valid: {len(data)} entries')
# Check IDs are unique
ids = [d['id'] for d in data if isinstance(d, dict)]
print(f'IDs unique: {len(set(ids)) == len(ids)}')
"
```

### Step 6: Preview

```bash
python -m http.server 8000
# Open http://localhost:8000/pages/{category}.html
```

Check:
- All cards render
- Chinese summaries display correctly
- Images/maps load
- Filter works
- Mobile layout

### Step 7: Human Review

Before finalizing:
- Verify phone numbers
- Check Google Maps links work
- Confirm district/area is correct
- Ensure summaries are concise Chinese (≤30 chars)
- Remove duplicate entries
- Fix any incorrect ratings

### Step 8: Deploy

```bash
git add data/{category}.json
git commit -m "Add {category} data ({n} entries)"
git push
```

---

## Content Quality Checklist

Before marking content as complete:

- [ ] JSON is valid
- [ ] All IDs are unique
- [ ] Required fields are present
- [ ] `experience.summary` is Chinese and ≤30 characters
- [ ] Tags use English keys
- [ ] Phone numbers are in international format (+66...)
- [ ] Google Maps links are correct
- [ ] Coordinates are present (if available)
- [ ] `verification.status` is set
- [ ] No duplicate entries

---

## Per-Category Workflow Examples

### Restaurant / Food

1. CSV → Gemini research → Markdown
2. Convert to `data/food.json`
3. Verify: name, type, district, tags, summary, phone, hours

### Hotel

1. CSV → Gemini research → Markdown
2. Convert to `data/hotels.json`
3. Fields: type, contact, facilities, transport, check-in/out

### Attraction

1. CSV → Gemini research → Markdown
2. Convert to `data/attractions.json`
3. Fields: type, admission fee, hours, transport, visit duration

### Shopping

1. CSV → Gemini research → Markdown
2. Convert to `data/shopping.json`
3. Fields: type, hours, transport, price range
