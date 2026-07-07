# Bangkok Guide — System Design Specification

A static, data-driven personal travel knowledge base. No backend, no frameworks, no build step required to run it — just files a browser can open.

---

## 1. System Architecture

### 1.1 Architectural Model

The entire system follows one rule:

```
DATA (JSON)  →  RENDERER (JS)  →  UI (HTML/CSS)
```

There are three layers, strictly separated:

| Layer | Responsibility | Files |
|---|---|---|
| **Data Layer** | Holds all content (places, categories) | `/data/*.json` |
| **Logic Layer** | Reads JSON, builds DOM elements | `/js/*.js` |
| **Presentation Layer** | Page shells + styling only | `/*.html`, `/css/*.css` |

No layer reaches backward. HTML never contains hardcoded place data. JS never contains hardcoded styling. JSON never contains presentation logic (no HTML strings inside JSON).

This separation is what makes the system maintainable: adding a new place means editing one JSON entry — nothing else.

### 1.2 Why No Backend Is Needed

Because:
- Content changes infrequently (personal curation, not live data)
- No user accounts or write operations exist
- All filtering/search is small-scale and can run entirely in-browser
- Hosting can be pure static files (GitHub Pages, Netlify, S3, or even opened locally)

This eliminates an entire class of complexity: no server, no API, no database, no auth, no deployment pipeline beyond "copy files."

### 1.3 Folder Structure

```
/bangkok-guide
│
├── index.html                 (Home page)
├── category.html              (Generic category page template)
│
├── /data
│   ├── categories.json        (List of categories + metadata)
│   ├── food.json
│   ├── hotels.json
│   ├── transport.json
│   ├── attractions.json
│   ├── massage-spa.json
│   ├── shopping.json
│   └── cafes.json
│
├── /js
│   ├── loader.js              (Fetches JSON files)
│   ├── renderer.js             (Builds card DOM from data)
│   ├── sidebar.js               (Nav + mobile menu behavior)
│   └── filter.js                (Optional: search/tag filtering)
│
└── /css
    ├── layout.css
    ├── sidebar.css
    └── card.css
```

**Key design decision:** one generic `category.html` template is reused for every category, rather than one HTML file per category. The page reads a URL parameter (e.g. `?cat=food`) to know which JSON file to load. This avoids duplicating markup seven times and keeps the "no hardcoded content" rule intact.

---

## 2. Page Structure

### 2.1 Home Page (`index.html`)

Purpose: navigation hub only, no place data.

Contents:
- Title / short intro ("Bangkok Guide")
- A grid or list of category tiles, generated from `categories.json`
- Each tile links to `category.html?cat=<id>`

Even the home page's category list is data-driven — adding a category to `categories.json` automatically adds a tile, satisfying the extensibility requirement.

### 2.2 Category Page (`category.html`)

One template, reused for all categories. On load, it:

1. Reads the `cat` parameter from the URL
2. Looks up that category's label/metadata from `categories.json`
3. Fetches the matching data file (e.g. `food.json`)
4. Renders the top bar title dynamically
5. Renders all items as cards in the main content grid
6. Initializes filter/search controls if enabled for that category

If the JSON file is missing or empty, the page shows a simple "No entries yet" state rather than breaking — this matters for extensibility, since new categories can exist before their data is filled in.

---

## 3. Component Design

### 3.1 Layout Shell (present on every page)

```
┌─────────────────────────────────────────┐
│ Top Bar (page title)                     │
├───────────┬───────────────────────────────┤
│           │                               │
│  Sidebar  │      Main Content Area        │
│  (nav)    │      (card grid)              │
│           │                               │
└───────────┴───────────────────────────────┘
```

- **Top Bar:** minimal — just a title (page name or category name). No search bar globally; search lives inside category pages only.
- **Sidebar:** static list of categories, generated from `categories.json` at load. Highlights the active category.
- **Main Content Area:** the only region that changes meaningfully between categories. Houses the card grid, and optionally the filter/search bar above it.

### 3.2 Sidebar Component

**Desktop behavior:** always visible, fixed-width column, no toggle needed.

**Mobile behavior:** collapsed by default behind a hamburger icon; toggling it slides/overlays the same nav markup used on desktop — same data source, same DOM structure, just a CSS/visibility difference. This avoids maintaining two separate navigation implementations.

### 3.3 Card Component (the core UI unit)

A single card renders one JSON item into a consistent visual block:

```
┌──────────────────────────────┐
│  Name                         │  ← primary title
│  Location                     │  ← secondary text
│  ★ Rating (if present)        │  ← optional
│  [tag] [tag] [tag]            │  ← optional, small pills
│  "Notes text..."              │  ← short personal comment
│                                │
│  [ View on Map ]  [ Call ]     │  ← optional action row
└──────────────────────────────┘
```

**Rendering rule:** every optional field (`rating`, `tags`, `notes`, `links`) is conditionally rendered — if the field is absent in JSON, that DOM element is not created at all (not just hidden). This keeps card markup clean and avoids empty UI artifacts.

**Action Area rules:**
- `links.googleMaps` present → render a "View on Map" button, `target="_blank"`, `rel="noopener"`
- `links.phone` present → render a "Call" button using a `tel:` href
- Neither present → action row is omitted entirely, not shown empty

### 3.4 Card Grid (Responsive Layout)

Single grid container, column count controlled purely by CSS breakpoints — no JS involved in layout:

| Viewport | Columns |
|---|---|
| Desktop (≥1024px) | 3 |
| Tablet (600–1023px) | 2 |
| Mobile (<600px) | 1 |

### 3.5 Filter / Search Component (Optional, V1.1)

A lightweight bar above the card grid within a category page:

- **Text search input:** filters cards by matching against `name` (and optionally `notes`/`tags`) as the user types
- **Tag filter:** clickable tag chips (derived from the union of tags present in that category's JSON); clicking toggles a tag on/off as an active filter

**Important constraint:** filtering only ever hides/shows already-rendered cards. It never re-fetches data or re-renders from scratch. This keeps the feature genuinely lightweight and dependency-free.

---

## 4. Interaction Rules

### 4.1 Navigation

- Sidebar links are plain `<a href="category.html?cat=...">` — real page loads, not SPA routing
- No history management, no client-side router needed
- Active category is visually indicated by reading the same URL parameter the page already parsed

### 4.2 Filtering / Search

- Purely client-side, operates only on the already-loaded JSON for the current category
- No network calls triggered by typing or tag clicks
- Filtering is additive: search text AND active tag filters both apply (intersection), so a user can combine "cheap" tag + "noodle" search term

### 4.3 External Actions

- **Google Maps:** opens in a new tab (`target="_blank"`), never navigates away from the guide
- **Phone:** uses a standard `tel:` link, deferring to the OS/device to handle the call
- Neither action requires JavaScript beyond building the correct `href` — no API calls, no map SDKs, no embedded map iframes (explicitly out of scope per non-goals)

### 4.4 Failure/Empty States

- Missing/empty JSON file → category page shows a plain "No entries yet" message
- Item missing optional field → that field's UI element simply doesn't render (see 3.3)
- This ensures partial or in-progress data never produces a broken-looking page, which matters since this is a personal, evolving knowledge base.

---

## 5. Data Flow Explanation

**End-to-end flow for viewing a category:**

1. User clicks "Food" in the sidebar → browser navigates to `category.html?cat=food`
2. `category.html` loads, JS (`loader.js`) reads `cat=food` from the URL
3. `loader.js` fetches `/data/food.json`
4. `renderer.js` receives the parsed JSON array and, for each item, builds one card element following the Card Component rules (§3.3)
5. Cards are appended into the main content grid
6. If filtering is enabled, `filter.js` attaches listeners to the search input/tag chips; these listeners only add/remove a CSS class (e.g. `.hidden`) on already-rendered cards — no re-render, no re-fetch
7. Clicking a card's action buttons triggers a normal browser navigation (new tab for maps, `tel:` handoff for phone) — nothing routed through the app's own JS logic

**Data flow for the home page:**

1. `index.html` loads → fetches `categories.json`
2. Renders one tile per category entry (label + link to `category.html?cat=<id>`)
3. No place-level data is touched on this page at all

This flow is identical regardless of category — the same loader/renderer code path handles Food, Hotels, Transport, etc., because they all conform to the same item schema (§6 of the original spec).

---

## 6. Extensibility Design

| To add... | You only need to... |
|---|---|
| A new **place** | Add one object to the relevant category's JSON file |
| A new **category** | Add an entry to `categories.json` + create its JSON data file. No HTML or JS changes. |
| A new **card field** (e.g. "price range") | Add the field to the JSON schema; update the card renderer once to conditionally display it. All existing cards remain valid since the field is optional. |

This project is intentionally a single-city knowledge base. Future city guides (Tokyo, Seoul, Chiang Mai, etc.) will be developed as independent repositories using the same project architecture, not as extensions of this repository.

---

## 7. Summary of Design Principles Applied

- **Single source of truth:** JSON is the only place content lives
- **One template, many pages:** category pages share one HTML/JS implementation
- **Conditional rendering over hardcoded layout:** optional fields disappear cleanly when absent
- **No premature complexity:** no router, no framework, no backend — because none is needed for the stated goals
- **Graceful degradation:** empty or partial data never breaks the page
- **Symmetry between mobile and desktop nav:** one data source, one markup structure, CSS-only behavioral difference
