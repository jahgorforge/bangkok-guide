# Phase 3 UI Update – Homepage & Mobile Navigation

We are updating the information architecture of the Bangkok Guide.

This is an architecture update, not a visual redesign.

Please follow the requirements exactly.

---

# 1. Homepage Redesign

## Current

The homepage currently displays several category cards:

- Food
- Hotels
- Attractions
- Neighborhoods
- ...

These cards only act as navigation buttons.

Remove them completely.

---

## New Homepage

The homepage should render:

```
content/essential-guide.md
```

This Markdown page becomes the homepage content.

It is the first page users see when opening the website.

Do NOT create a separate "Info" page.

The homepage itself IS the Essential Guide.

---

# 2. Desktop Layout

Keep the existing desktop layout.

Keep the left sidebar.

Navigation example:

- Home
- Food
- Hotels
- Attractions
- Neighborhoods
- ...

Clicking **Home** should display:

```
content/essential-guide.md
```

No other desktop layout changes are required.

---

# 3. Mobile Layout

The mobile experience should be redesigned.

## Remove Sidebar

Do NOT use the current slide-out sidebar.

Remove it completely on mobile.

---

## Top Navigation

Replace the sidebar with a fixed horizontal navigation bar.

Requirements:

- fixed at the top
- horizontally scrollable
- swipe left/right supported
- touch friendly
- works well when more pages are added in the future

Example:

```
Home | Food | Hotels | Attractions | Neighborhoods | Cafes | Shopping | ...
```

The navigation should remain visible while scrolling.

---

## Active Navigation

The current page should always be visually highlighted.

Use a simple, clean indicator such as:

- underline
- bottom border
- accent color

Avoid large buttons or heavy styling.

Users should always know which page is currently active.

---

## Home

The Home tab displays:

```
content/essential-guide.md
```

It is NOT a category page.

It is the homepage.

---

# 4. Markdown Rendering

The Essential Guide is written in Markdown.

Please ensure:

- beautiful typography
- comfortable line spacing
- responsive tables
- responsive images
- good mobile reading experience

Do not modify the Markdown content.

---

# 5. Design Principles

Keep the existing design language.

Do NOT redesign the visual style.

The goal is to improve the information architecture and mobile usability.

Avoid adding:

- hero banners
- large illustrations
- unnecessary animations
- decorative UI

Keep everything clean, lightweight and practical.

The mobile navigation should feel similar to modern travel and content apps, where users can quickly switch between sections without opening a sidebar.

---

# 6. Scalability

The navigation should be designed for future expansion.

It should support additional pages without requiring UI changes.

Examples of future pages:

- Cafes
- Shopping
- Markets
- Museums
- Nightlife
- Day Trips

The horizontal navigation should continue scrolling naturally as more pages are added.

---

# 7. Before Finishing

After implementation, verify all of the following:

✓ Desktop sidebar still works correctly.

✓ Mobile sidebar has been completely removed.

✓ Mobile uses a fixed horizontal scrollable navigation bar.

✓ Navigation supports swipe scrolling.

✓ Current page is always highlighted.

✓ Home renders `content/essential-guide.md`.

✓ Other category pages continue to work correctly.

✓ Markdown typography is responsive on both desktop and mobile.

✓ Images and tables display correctly on small screens.

✓ The overall design remains consistent with the existing UI system.

If any issue is found, fix it before considering the task complete.
