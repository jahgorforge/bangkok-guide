# Bangkok Guide - Map & Restaurant Card Interaction Design

## Overview

The Food page uses a map-connected restaurant discovery pattern.

The goal is not only to display restaurant cards, but to help users understand:

- Where restaurants are located
- The relationship between restaurants and the user's current location
- Which restaurant card is currently being viewed

The map is an important part of the content experience, not only a navigation tool.

---

# Core Interaction Concept

The Food page combines:

- Restaurant cards
- Interactive map
- User location
- Active restaurant state

The relationship:

```

Restaurant Card
↓
Active Card
↓
Highlight Map Marker
↓
Show Location Relationship

```

When users browse restaurant cards, the map should respond accordingly.

---

# Layout Structure

Mobile-first layout:

```

Food Page

├── Header
│   ├── Page title
│   └── Search
│
├── Horizontal Navigation
│
├── Filter Chips
│
├── Sticky Mini Map
│
└── Restaurant Card List

```

---

# Mini Map Behavior

## Purpose

The map is NOT primarily for navigation.

It is used to show:

- Restaurant locations
- User location
- Relative distance
- Geographic relationship between restaurants


## Map Content

The map should display:

- Restaurant markers
- Current user location marker
- Active restaurant marker


Example:

```

```
   Restaurant A ●

          📍 User
```

Restaurant B ○

```

---

# Restaurant Marker States

Each restaurant marker has different states.

## Default State

Normal restaurant marker.

Example:

```

○

```

---

## Active State

When the corresponding restaurant card becomes active:

The marker should:

- Increase size
- Become visually highlighted
- Optionally animate
- Clearly indicate the selected restaurant

Example:

```

◎

```

---

# Card Scroll Interaction

## Active Restaurant Detection

When the user scrolls the restaurant card list:

The system should detect which card is currently active.

A card becomes active when:

- It is fully or mostly visible in the viewport
- It reaches the primary viewing position

Recommended implementation:

Use scroll observation / intersection detection.

Example:

```

User scrolls

↓

Card A becomes 100% visible

↓

Active Restaurant = Card A

↓

Map updates marker A

```

---

# Map and Card Synchronization

The relationship is bidirectional in the future.

## Card → Map

When a card becomes active:

```

Card A active

↓

Map marker A highlighted

↓

Map centers or adjusts view if needed

```

---

## Map → Card (Future Enhancement)

When users tap a map marker:

```

User taps Marker A

↓

Restaurant Card A becomes active

↓

Scroll card list to Restaurant A

````

---

# Data Requirements

Each restaurant should contain geographic information.

Example:

```json
{
  "id": "jay_fai",
  "name": "Jay Fai",
  "location": {
    "latitude": 13.xxxx,
    "longitude": 100.xxxx
  },
  "tags": [
    "street food",
    "michelin"
  ],
  "phone": "",
  "description": ""
}
````

The map markers should be generated from restaurant data.

---

# Implementation Notes

## Frontend Responsibilities

The implementation should support:

* Mobile-first responsive layout
* Sticky map behavior
* Restaurant card scrolling
* Active card detection
* Marker state updates

## Figma Prototype Limitation

Figma is only used to validate:

* Layout
* Information hierarchy
* Visual relationship

Complex behaviors should be implemented in code.

Examples:

* Scroll detection
* Marker animation
* Card-map synchronization
* Map API integration

---

# Design Principle

The map should answer:

"Where is this restaurant compared with me?"

The card should answer:

"Why should I go there?"

Together they help users make travel decisions.

````


