# City Guide Project Template

## Project Philosophy

Each city guide is an **independent project/repository**.

**Why one city per repo:**

- Easier maintenance — each city has its own issue tracker and CI
- Easier deployment — independent GitHub Pages sites
- Clearer content management — no cross-city file conflicts
- Independent iteration — each city can be at a different version

---

## Standard Folder Structure

```
{city}-guide/
│
├── index.html              ← Landing page
├── category.html           ← Generic category page
│
├── pages/                  ← Category pages
│   ├── food.html
│   ├── hotels.html
│   ├── attractions.html
│   ├── shopping.html
│   ├── cafes.html
│   ├── transport.html
│   └── massage.html
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
│   ├── attractions.json
│   ├── shopping.json
│   ├── cafes.json
│   ├── transport.json
│   └── massage.json
│
├── taxonomy/
│   └── tags.json           ← Tag dictionary (English → Chinese)
│
├── assets/
│   └── icons/              ← SVG icons
│
├── content/                ← Research notes (not deployed)
│   ├── food/
│   ├── hotels/
│   └── ...
│
└── docs/
    ├── 01-ProjectBrief.md
    ├── content-schema.md
    └── ...
```

---

## Reusable Components

### Can be copied directly (no changes needed)

| Component | Files |
|-----------|-------|
| CSS system | `css/layout.css`, `css/sidebar.css`, `css/card.css` |
| JavaScript | `js/loader.js`, `js/renderer.js`, `js/sidebar.js`, `js/filter.js`, `js/icons.js`, `js/app.js` |
| Icons | `assets/icons/*.svg` |
| HTML templates | `index.html`, `pages/*.html` |
| Documentation | `docs/content-schema.md`, `docs/city-project-workflow.md` |

### Must be customized per city

| Item | Action |
|------|--------|
| `data/categories.json` | Update category labels and icons |
| `data/*.json` | Replace all content with city data |
| `taxonomy/tags.json` | Translate tags if needed |
| `docs/01-ProjectBrief.md` | Write city-specific brief |
| `README.md` | Update project name |

---

## New City Initialization Process

```
Step 1: Clone project template
Step 2: Write Project Brief
Step 3: Configure city metadata (categories.json)
Step 4: Create tag dictionary (taxonomy/tags.json)
Step 5: Research content (Gemini)
Step 6: Convert research to JSON (Claude Code)
Step 7: Validate JSON schema
Step 8: Preview and test
Step 9: Deploy to GitHub Pages
```

### Step Details

**Step 1 — Clone:**
```
git clone git@github.com:username/bangkok-guide.git {city}-guide
cd {city}-guide
rm -rf data/*.json content/ taxonomy/_tag_scan.txt
git remote set-url origin git@github.com:username/{city}-guide.git
```

**Step 2-4:** Update project brief, categories, and tag dictionary.

**Step 5-6:** See `docs/content-production-workflow.md` for the content pipeline.

**Step 7:** Validate with:
```bash
python -c "import json; json.load(open('data/food.json')); print('OK')"
```

**Step 8:** Preview with:
```bash
python -m http.server 8000
```

**Step 9:**
```bash
git init && git add . && git commit -m "Initial commit"
git push -u origin main
# Enable GitHub Pages in repository Settings
```
