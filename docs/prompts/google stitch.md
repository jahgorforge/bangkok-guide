# AI UI Prototype Generation Prompt
## Mobile Guide App

> Purpose:
>
> Generate a mobile-first UI prototype for exploring product structure and visual direction before building the final design system.
>
> This prompt is used for AI UI generation tools (Google Stitch, etc.).

---

# Project Context

Create a mobile-first travel guide application.

The product is not a booking platform.

It is a personal knowledge-based city guide that helps travelers discover useful information through curated content.

The design should feel:

- Modern
- Clean
- Editorial
- Trustworthy
- Easy to scan
- Mobile-first

Avoid:

- Excessive app-like dashboards
- Heavy navigation systems
- Bottom navigation
- Complex booking flows

---

# Target Screens

Generate only two mobile screens:

1. Home Page
2. Food Page

Do not generate the entire application.

The purpose is to explore the core UI framework.

---

# Screen 1: Home Page

## Goal

Create a knowledge navigation homepage for exploring Bangkok.

The homepage should help users quickly understand:

- What to do
- Where to go
- How to explore the city

---

## Structure

Include:

### Header

- Simple top app bar
- Page title
- No unnecessary profile or action icons


### Hero / Introduction Area

Create a visually attractive introduction section.

Should communicate:

- Bangkok identity
- Travel inspiration
- Editorial feeling


### Expandable Knowledge Panel

Create an expandable section.

Collapsed state:

- Show category overview
- Encourage exploration

Expanded state:

- Reveal more detailed content

The interaction should feel like a knowledge card rather than an accordion FAQ.


### Category Navigation

Use horizontal scrolling navigation.

Examples:

- Food
- Attractions
- Shopping
- Neighborhoods
- Tips

Do not use bottom navigation.

---

# Screen 2: Food Page

## Goal

Create a restaurant discovery page.

The page should help users discover restaurants through curated knowledge.

---

## Structure

### Header

Simple page title.

Avoid unnecessary icons.

---

### Horizontal Navigation

Use horizontally scrollable categories.

Example:

- Local Food
- Street Food
- Michelin
- Cafe
- Dessert

The navigation should save vertical space.

---

### Search Area

Include a compact search bar.

Purpose:

- Search restaurants
- Search food categories

Do not make it oversized.

---

### Category Filters

Use horizontal scrolling chips.

Examples:

- Price
- Location
- Cuisine
- Recommendation

Avoid multiple rows of filters.

---

### Mini Map Section

Create a small interactive map preview.

Important:

This is NOT a navigation map.

Purpose:

- Show approximate restaurant locations
- Help users understand geographic distribution

Design requirements:

- Larger than a simple banner
- Allow future zoom interaction
- Show restaurant pins

---

### Restaurant Journal Cards

Create restaurant cards as knowledge entries.

Each card should include:

- Restaurant image
- Name
- Short description
- Category tags
- Location information
- Rating or recommendation indicator
- Action area

The feeling should be:

"personal travel journal"

rather than:

"restaurant booking app"

---

# Navigation Rules

Mobile first.

Preferred navigation:

- Top navigation
- Horizontal scrolling navigation

Avoid:

- Bottom navigation
- Desktop sidebar as default

---

# Visual Style

Use:

- Modern typography
- Clear hierarchy
- Comfortable spacing
- Rounded cards
- Subtle shadows
- Editorial layout

The interface should balance:

Information density + readability.

Avoid excessive empty space.

---

# Design Goal

The generated UI is a prototype for Figma refinement.

The output should provide:

- Layout inspiration
- Navigation exploration
- Component ideas
- Visual direction

The final design system will be created after refinement in Figma.