# Content Production Workflow

## Overview

Standard operating procedure for producing content for city guide projects.

The production workflow follows a **two-layer approach**:

1. **Guide Layer (Markdown)** — Written first. Provides city orientation.
2. **Structured Data Layer (JSON)** — Populated second. Provides searchable place data.

---

## Why Two Formats?

### Markdown for the Guide Layer

- Human-readable and easy to edit
- Renders directly on the homepage as editorial content
- Perfect for mixed content: text, tables, lists, links
- No schema overhead for narrative information
- Easy to preview and iterate

### JSON for the Structured Data Layer

- Machine-readable and searchable
- Enables filtering, sorting, and card rendering
- Consistent schema across all cities
- Easy to validate programmatically
- Supports multilingual fields (en, local, zh)

**Rule of thumb:** If it's a place someone can visit, it goes in JSON. If it's practical advice about the city, it goes in Markdown.

---

## Production Pipeline

```
                 ┌──────────────────────────┐
                 │  Research                 │
                 │  (Google Maps + Gemini)   │
                 └────────────┬─────────────┘
                              │ Research notes
                              ▼
                 ┌──────────────────────────┐
                 │  Essential Guide (MD)     │
                 │  → City orientation       │
                 │  → Transport, weather     │
                 │  → Entry, payment, safety │
                 └────────────┬─────────────┘
                              │ content/essential-guide.md
                              ▼
                 ┌──────────────────────────┐
                 │  Structured Data (JSON)   │
                 │  → Parse research         │
                 │  → Map to schema          │
                 │  → Generate per category  │
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
                 │  Final + Deploy           │
                 └──────────────────────────┘
```

---

## Step 1: Export Research Data

Export your Google Maps saved places as CSV:

1. Google Maps → Your places → Saved
2. Export each list as CSV
3. CSV columns: `WKT`, `name`, `description`

---

## Step 2: Write the Essential Guide

Before producing structured data, write the Essential Guide.

This is a Markdown file at `content/essential-guide.md` that covers:

- Transportation (BTS, MRT, airport, taxis, ride-hailing)
- Weather (seasons, what to pack)
- Entry requirements (visas, customs)
- Payment (cash, cards, mobile pay)
- Practical information (SIM, power, language, etiquette)
- Emergency contacts

**Guide Layer writing rules** (see `docs/ai-content-guideline.md` for details):
- Concise and practical
- No marketing language
- Mobile-friendly formatting
- Easy to scan with clear headings

---

## Step 3: Gemini Research (per category)

For each category, give Gemini the CSV data and ask for structured research.

Request format:

```
For each location in this CSV, produce a research document with:

- English Name
- Local Name (if available)
- POI Type
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

Save Gemini's output as a markdown file in `content/{category}/`.

---

## Step 4: Claude Code Processing

Give Claude Code:

1. The research markdown
2. The CSV (for ordering)
3. The content schema (`docs/content-schema.md`)

Claude Code will:

- Parse the markdown
- Map fields to the schema
- Generate valid JSON
- Validate the output

---

## Step 5: Validate

```bash
python -c "
import json
data = json.load(open('data/{category}.json'))
print(f'Valid: {len(data)} entries')
ids = [d['id'] for d in data if isinstance(d, dict)]
print(f'IDs unique: {len(set(ids)) == len(ids)}')
"
```

---

## Step 6: Preview

```bash
python -m http.server 8000
# Open http://localhost:8000/
# Open http://localhost:8000/pages/{category}.html
```

Check:

- Homepage renders Essential Guide correctly
- All category cards render
- Chinese summaries display correctly
- Filter and search work
- Desktop sidebar navigation works
- Mobile top navigation works
- Section cards display properly on mobile

---

## Step 7: Human Review

Before finalizing:

- Verify phone numbers
- Check Google Maps links work
- Confirm district/area is correct
- Ensure summaries are concise Chinese (≤30 chars)
- Remove duplicate entries
- Fix any incorrect ratings

---

## Step 8: Deploy

```bash
git add content/essential-guide.md data/{category}.json
git commit -m "Add {category} data ({n} entries)"
git push
```

---

## Content Quality Checklist

Before marking content as complete:

- [ ] Essential Guide is concise and accurate
- [ ] JSON is valid
- [ ] All IDs are unique
- [ ] Required fields are present
- [ ] `experience.summary` is Chinese and ≤30 characters
- [ ] Tags use English keys
- [ ] Phone numbers are in international format (+66...)
- [ ] Google Maps links are correct
- [ ] No duplicate entries
- [ ] Homepage renders correctly on mobile
- [ ] Section cards display properly
