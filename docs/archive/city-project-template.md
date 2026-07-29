# City Guide Project Template

## Project Philosophy

Each city guide is an **independent project/repository**.

**Why one city per repo:**

- Easier maintenance — each city has its own issue tracker and CI
- Easier deployment — independent GitHub Pages sites
- Clearer content management — no cross-city file conflicts
- Independent iteration — each city can be at a different version

---

## Two Content Layers

Every city project has two complementary content layers:

| Layer | Format | Location | Purpose |
|-------|--------|----------|---------|
| **Guide Layer** | Markdown | `content/essential-guide.md` | Editorial city orientation, homepage content |
| **Structured Data Layer** | JSON | `data/*.json` | Searchable place database for category pages |

**Guide Layer** is written first — it provides the essential orientation for visitors.
**Structured Data Layer** is populated second — it provides detailed information about specific places.

---

## Standard Folder Structure

```
{city}-guide/
│
├── index.html                    ← Homepage (renders essential-guide.md)
│
├── pages/                        ← Category pages (one per category)
│   ├── food.html
│   ├── hotels.html
│   ├── attractions.html
│   ├── shopping.html
│   ├── cafes.html
│   ├── transport.html
│   └── massage.html
│
├── css/
│   ├── layout.css                ← App shell, top nav, responsive
│   ├── sidebar.css               ← Desktop sidebar navigation
│   ├── card.css                  ← Card grid and card component
│   └── markdown.css              ← Markdown typography, section cards
│
├── js/
│   ├── loader.js                 ← Fetch JSON and text files
│   ├── renderer.js               ← Build card DOM from data items
│   ├── sidebar.js                ← Desktop sidebar + mobile top nav
│   ├── filter.js                 ← Text search and tag filtering
│   ├── icons.js                  ← SVG icon system
│   ├── markdown.js               ← Markdown-to-HTML converter
│   └── app.js                    ← Entry point — routes logic by page
│
├── data/                         ← Structured Data Layer (JSON)
│   ├── categories.json           ← Category registry (required)
│   ├── food.json                 ← Restaurants, street food
│   ├── hotels.json               ← Hotels, hostels
│   ├── attractions.json          ← Temples, museums, parks
│   ├── shopping.json             ← Malls, markets
│   ├── cafes.json                ← Coffee shops
│   ├── transport.json            ← BTS, MRT, taxis
│   └── massage.json              ← Massage and SPA
│
├── content/
│   └── essential-guide.md        ← Guide Layer (Markdown, homepage content)
│
├── taxonomy/
│   └── tags.json                 ← Tag dictionary (English → Chinese)
│
├── assets/
│   └── icons/                    ← SVG icons (mirrored in js/icons.js)
│
└── docs/
    ├── 01-ProjectBrief.md
    ├── content-schema.md
    ├── ui-navigation-guideline.md
    └── ...
```

---

## Guide Layer Files

These files form the **Guide Layer** — editorial content for the homepage:

| File | Purpose | Required |
|------|---------|----------|
| `content/essential-guide.md` | City orientation, practical info | Yes |
| `css/markdown.css` | Markdown typography and section card styles | Yes |
| `js/markdown.js` | Markdown-to-HTML converter | Yes |

The Essential Guide is written in Markdown and rendered on the homepage inside white section cards. It covers transport, weather, entry requirements, payment, and other essential city information.

---

## Structured Data Layer Files

These files form the **Structured Data Layer** — searchable place data:

| File | Purpose | Required |
|------|---------|----------|
| `data/categories.json` | Category registry (id, label, icon, description) | Yes |
| `data/*.json` | One JSON file per category | Yes |
| `taxonomy/tags.json` | Tag dictionary for display names | Yes |

---

## Reusable Components

### Can be copied directly (no changes needed)

| Component | Files |
|-----------|-------|
| CSS system | `css/layout.css`, `css/sidebar.css`, `css/card.css`, `css/markdown.css` |
| JavaScript | `js/loader.js`, `js/renderer.js`, `js/sidebar.js`, `js/filter.js`, `js/icons.js`, `js/markdown.js`, `js/app.js` |
| Icons | `assets/icons/*.svg` |
| HTML templates | `index.html`, `pages/*.html` |
| Documentation | `docs/content-schema.md`, `docs/city-project-workflow.md`, `docs/ui-navigation-guideline.md` |

### Must be customized per city

| Item | Action |
|------|--------|
| `content/essential-guide.md` | Write city-specific Essential Guide |
| `data/categories.json` | Update category labels and icons |
| `data/*.json` | Replace all content with city data |
| `taxonomy/tags.json` | Translate tags if needed |
| `docs/01-ProjectBrief.md` | Write city-specific brief |
| `README.md` | Update project name |

---

## New City Initialization Process

```
Step 1:  Clone project template
Step 2:  Write Project Brief
Step 3:  Configure city metadata (categories.json)
Step 4:  Create tag dictionary (taxonomy/tags.json)
Step 5:  Write Essential Guide (content/essential-guide.md)
Step 6:  Research structured content (Gemini)
Step 7:  Convert research to JSON (Claude Code)
Step 8:  Validate JSON schema
Step 9:  Preview and test
Step 10: Deploy to GitHub Pages
```

### Step Details

**Step 1 — Clone:**
```
git clone git@github.com:username/{source-city}-guide.git {city}-guide
cd {city}-guide
rm -rf data/*.json content/
git remote set-url origin git@github.com:username/{city}-guide.git
```

**Steps 2-4:** Update project brief, categories, and tag dictionary.

**Step 5:** Write `content/essential-guide.md` with city orientation information.

**Step 6-7:** See `docs/content-production-workflow.md` for the content pipeline.

**Step 8:** Validate with:
```bash
python -c "import json; json.load(open('data/food.json')); print('OK')"
```

**Step 9:** Preview with:
```bash
python -m http.server 8000
```

**Step 10:**
```bash
git init && git add . && git commit -m "Initial commit"
git push -u origin main
# Enable GitHub Pages in repository Settings
```
