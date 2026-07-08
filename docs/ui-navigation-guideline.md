# UI Navigation Guideline

## Purpose

Document the UI navigation architecture so every future city project follows the same navigation system.

This document is the UI reference for building new city guide projects.

---

## Navigation Overview

The framework uses two navigation systems depending on screen size:

| Screen | Navigation | Behavior |
|--------|------------|----------|
| Desktop (≥768px) | Sidebar (left) | Always visible, persistent |
| Mobile (<768px) | Top Navigation (fixed) | Horizontal scrollable, 5 tabs visible |

Both systems are populated dynamically from `data/categories.json`.

---

## Desktop Navigation

### Sidebar

- Fixed on the left side, 240px wide (200px on tablets)
- White background with right border
- Contains the site branding ("曼谷指南 Bangkok Guide") at the top
- Lists all categories as navigation links
- Each link has an SVG icon + category label
- Active category is highlighted with a left gold accent border + bold text

### Sidebar Links

```
首页 (Home)    → index.html
美食           → pages/food.html
购物           → pages/shopping.html
酒店           → pages/hotels.html
交通           → pages/transport.html
景点           → pages/attractions.html
咖啡           → pages/cafes.html
水疗           → pages/massage.html
```

### Behavior

- Clicking a category navigates to the corresponding page
- The "首页" (Home) link navigates to `index.html` (the homepage)
- The sidebar is always visible on desktop — no hamburger menu
- Sidebar scrolls independently if content overflows

### Implementation

- Rendered by `sidebar.js` → `Sidebar.renderNav(categories, activeCatId)`
- Styles in `css/sidebar.css`
- Active state via `.sidebar-nav__link--active` class

---

## Mobile Navigation

### Top Navigation Bar

- Fixed at the top of the screen, full width
- White background with bottom border
- Height: 56px (`--topbar-height`)
- Horizontally scrollable with swipe support
- Scrollbar hidden (works on all major browsers)

### Tab Display

- Each tab is exactly **20vw** wide
- Exactly **5 tabs visible** at all times on any mobile screen width
- Remaining tabs accessible by swiping left/right
- All categories from `categories.json` are included

### Active Tab

- Active tab has a **champagne-colored background** (`--color-accent-soft: #EEE2C6`)
- Black text (`--color-text`)
- Rounded corners (`border-radius: var(--radius)`)
- No underline
- Inactive tabs have default text color and no background

### Implementation

- Rendered by `sidebar.js` → `Sidebar.renderMobileNav(categories, activeCatId)`
- Nav container created dynamically if not present in HTML
- Styles in `css/layout.css` under "Mobile Top Navigation"
- Active state via `.top-nav__link--active` class

### Mobile Specific Rules

```
@media (max-width: 767px) {
  .sidebar         → display: none
  .top-bar         → display: none (legacy)
  .hamburger       → display: none (legacy)
  .sidebar-overlay → display: none (legacy)
  .top-nav         → display: flex
  .top-nav__link   → width: 20vw (5 tabs visible)
  .main-content    → margin-left: 0, padding-top: calc(56px + 16px)
}
```

---

## Homepage

### What It Is

- The homepage (`index.html`) is the **city orientation page**
- It renders `content/essential-guide.md` as its main content
- It is **NOT** a navigation page
- It is **NOT** a category page

### Content Structure

```
┌─────────────────────────────────────┐
│  Site Branding (sidebar / top nav)  │
├─────────────────────────────────────┤
│  Essential Guide (Markdown)         │
│                                     │
│  ┌─ Intro Area ──────────────────┐  │
│  │  H1: 曼谷出行指南              │  │
│  │  Paragraph: City overview      │  │
│  │  HR separator                  │  │
│  └────────────────────────────────┘  │
│                                     │
│  ┌─ Section Card ────────────────┐  │
│  │  ▼ 交通                        │  │
│  │  ┌─────────────────────────┐   │  │
│  │  │ Transport content...    │   │  │
│  │  └─────────────────────────┘   │  │
│  └────────────────────────────────┘  │
│                                     │
│  ┌─ Section Card ────────────────┐  │
│  │  ▼ 天气                        │  │
│  │  ┌─────────────────────────┐   │  │
│  │  │ Weather content...      │   │  │
│  │  └─────────────────────────┘   │  │
│  └────────────────────────────────┘  │
│                                     │
│  ┌─ Section Card ────────────────┐  │
│  │  ▼ 入境                        │  │
│  │  ┌─────────────────────────┐   │  │
│  │  │ Entry content...        │   │  │
│  │  └─────────────────────────┘   │  │
│  └────────────────────────────────┘  │
│            ...                       │
└─────────────────────────────────────┘
```

### Section Cards (Desktop)

On desktop, each `##` section in the Essential Guide is rendered as a **white card**:

- White background (`--color-card-bg: #ffffff`)
- Light border (`--color-border: #e8e6e3`)
- 6px border-radius (`--radius`)
- Subtle shadow (`box-shadow: 0 1px 3px var(--color-shadow)`)
- Hover effect: slightly darker border, stronger shadow
- Cards are always expanded on desktop
- No toggle arrow visible on desktop

### Section Cards (Mobile)

On mobile, cards become an **accordion**:

- Cards are **collapsible** — tap the header to expand/collapse
- All cards start **collapsed** by default
- Smooth expand/collapse animation: 250ms (`transition: max-height 0.25s ease`)
- Toggle arrow (▼) rotates 180° when expanded
- Card header has `min-height: 48px` for comfortable touch targets
- Title text and toggle arrow are vertically centered in the header
- Content is completely hidden when collapsed (zero max-height, no padding)

Mobile accordion rules:

```css
@media (max-width: 767px) {
  .markdown-card__header {
    cursor: pointer;
    min-height: 48px;
  }
  .markdown-card__body {
    max-height: 0;           /* collapsed by default */
    overflow: hidden;
    transition: max-height 0.25s ease;
  }
}

@media (min-width: 768px) {
  .markdown-card__body {
    max-height: none;        /* always expanded on desktop */
  }
  .markdown-card__toggle {
    display: none;           /* no toggle arrow on desktop */
  }
}
```

---

## Essential Guide Section Order

The Essential Guide should follow this recommended section order:

```
1. Transportation    — 交通
2. Weather           — 天气
3. Entry             — 入境
4. Payment           — 支付
5. Practical Info    — 实用信息
6. Emergency         — 紧急信息
```

### Section Guidelines

| Section | Content |
|---------|---------|
| **Transportation** | Public transit systems, airport transfers, taxis, ride-hailing, traffic tips |
| **Weather** | Seasons, temperature range, best time to visit, what to pack |
| **Entry** | Visa requirements, customs, arrival procedures, registration forms |
| **Payment** | Local currency, cash vs card, ATMs, mobile payment availability |
| **Practical Info** | SIM cards, power plugs, language, cultural etiquette |
| **Emergency** | Police, ambulance, fire, embassy contact information (use a table) |

Sections may be added, removed, or reordered per city. The above is a recommended starting point.

---

## Category Pages

### Desktop

```
┌──────┬──────────────────────────────────────┐
│      │  Category Title                      │
│ Side │  Description                         │
│ bar  │  [Search...]                         │
│      │  [Tag filter chips]                  │
│      │                                      │
│      │  ┌──────┐ ┌──────┐ ┌──────┐         │
│      │  │ Card │ │ Card │ │ Card │         │
│      │  └──────┘ └──────┘ └──────┘         │
│      │  ┌──────┐ ┌──────┐ ┌──────┐         │
│      │  │ Card │ │ Card │ │ Card │         │
│      │  └──────┘ └──────┘ └──────┘         │
│      │                                      │
│      │  Footer                              │
└──────┴──────────────────────────────────────┘
```

### Mobile

```
┌──────────────────────────────────────┐
│ 首页 | 美食 | 购物 | 酒店 | 交通 →   │  ← Top nav (scrollable)
├──────────────────────────────────────┤
│  Category Title                      │
│  Description                         │
│  [Search...]                         │
│  [Tag filter chips]                  │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Card                         │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │ Card                         │    │
│  └──────────────────────────────┘    │
│                                      │
│  Footer                              │
└──────────────────────────────────────┘
```

---

## Design Principles

### Simple but not simplistic

- Clean layout with clear visual hierarchy
- Every element serves a purpose
- No unnecessary decorations or animations

### Content-first

- Content determines the layout, not the other way around
- Cards and typography prioritize readability
- No hero banners or large illustrations

### Mobile-first reading experience

- The mobile experience is designed first, then enhanced for desktop
- Touch-friendly targets (minimum 48px tap areas)
- Comfortable line spacing and font sizes
- Responsive tables with horizontal scroll

### Consistent across all cities

- Same navigation pattern for every city
- Same card design, spacing, and typography
- Same responsive behavior
- Users who have seen one city guide instantly understand another

---

## Summary

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Navigation | Left sidebar | Fixed top nav, 5 tabs visible, scrollable |
| Homepage | Markdown in section cards | Markdown in accordion cards |
| Category pages | 3-column card grid | 1-column card list |
| Filters | Search + tag chips | Same, full width |
| Sidebar | Always visible | Hidden |
| Active indicator | Gold left border | Champagne background, rounded |
