# AI Content Guideline

## Purpose

Define content quality standards for AI-generated travel guide content.

These guidelines ensure consistency across different cities and categories when using AI for content production.

---

## Writing Style

### Preferred

- **Concise** — Short sentences, direct information
- **Practical** — Useful for travelers making decisions
- **Informative** — What, where, when, how
- **Local perspective** — Written from a local/resident point of view

### Avoid

- Travel blog clichés ("hidden gem", "off the beaten path")
- Exaggerated adjectives ("amazing", "incredible", "breathtaking")
- Fake personal experiences ("I stumbled upon this place...")
- Generic descriptions that could apply to any venue
- Marketing language ("must-visit", "one-of-a-kind") — use sparingly

---

## Content Structure

Each entry should answer:

1. **What is it?** — Type of place
2. **Why visit?** — Key highlights (1-2 sentences)
3. **Best for whom?** — Solo, couple, family, etc.
4. **Practical tips** — Hours, price, reservation
5. **How to get there** — Nearest BTS/MRT, transport tips

### Summary Formula

```
[Type] known for [feature]. Best for [audience].
```

Examples:
- "街头小吃，米其林星级蟹肉蛋卷是招牌，排队需2-3小时。"
- "Bang Kapi区经济型公寓，近MRT黄线，适合预算有限的旅客。"

---

## Language Standards

### User-facing text

Must be Chinese:
- `experience.summary`
- `experience.highlights`
- `notes`

Length: ≤30 characters preferred for summaries.

### Internal fields

Must be English:
- `name.en`
- `type`
- `tags.*`
- `category`

### Mixed fields

- `name.local` — Local language (e.g. Thai)
- `name.zh` — Chinese name (if commonly used)

---

## Data Accuracy Rules

### Do NOT invent

- Phone numbers — leave empty if unknown
- Ratings — use real Google Maps ratings only
- Addresses — verify before including
- Opening hours — state if approximate

### DO verify

- Category/type matches the actual venue
- District is correct
- Tags are relevant and not excessive
- Coordinates match the location

### Flag uncertain data

Use `verification` field:

```json
"verification": {
  "status": "needs-review",
  "issues": ["Opening hours unconfirmed"]
}
```

---

## Tag Usage

- Tags are English keys (e.g. `seafood`, not `海鲜`)
- Add new tags to `taxonomy/tags.json` with Chinese translation
- Don't add excessive tags — 3-5 meaningful tags per entry
- Prefer existing tags over creating new ones

### Tag Categories

```
style:      street-food, fine-dining, boutique, market
food:       seafood, noodle, grill, dessert
experience: queue, famous, instagrammable, local
audience:   solo, couple, family, food-lover
budget:     cheap, mid-range, expensive, premium
```

---

## Per-Category Guidelines

### Restaurants & Food

Focus on:
- Cuisine type and signature dishes
- Price range and value
- Atmosphere (street food, fine dining, casual)
- Reservation requirements
- Language barriers (menu in English?)

### Hotels

Focus on:
- Room size and amenities
- Proximity to BTS/MRT
- Airport access
- Suitable traveler type
- Nearby food/shopping

### Attractions

Focus on:
- Admission fee and hours
- Best time to visit
- Visit duration
- Photography tips
- Nearby attractions

### Shopping

Focus on:
- Type of goods
- Price level
- Bargaining culture
- Best time to visit
- Transport access

---

## AI Usage Principles

### AI should

- Organize raw information into structured format
- Summarize long descriptions into concise Chinese
- Extract key facts from research material
- Map unstructured data to the content schema
- Suggest tags based on venue characteristics

### AI should NOT

- Invent phone numbers, ratings, or addresses
- Create fake reviews or personal experiences
- Exaggerate or make unsupported claims
- Translate names inconsistently
- Generate content without source material

---

## Review Checklist

Before marking content as final:

- [ ] Summary is Chinese, ≤30 characters
- [ ] No invented information
- [ ] Tags are English and relevant
- [ ] All verification statuses are set
- [ ] Phone uses international format
- [ ] No duplicate entries
- [ ] Content is practical, not promotional
