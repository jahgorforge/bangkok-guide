# AI Content Guideline

## Purpose

Define content quality standards for AI-generated travel guide content.

These guidelines ensure consistency across different cities and categories when using AI for content production.

---

## Guide Layer Writing Rules

The Guide Layer (`content/essential-guide.md`) is the first thing visitors see. It must be concise, practical, and trustworthy.

### Writing Principles

- **Concise** — Short sentences, direct information. Every sentence should serve a purpose.
- **Practical** — Useful for travelers making decisions. Include specific numbers, names, and tips.
- **Neutral** — Factual and objective. Avoid subjective judgments about places.
- **Mobile friendly** — Short paragraphs, clear headings, scannable lists.
- **Easy to scan** — Use headings, tables, and bullet points to organize information.
- **No marketing language** — No "must-see", "hidden gem", "breathtaking", or "incredible".
- **No exaggerated descriptions** — State facts without embellishment.

### Formatting Rules

- Use `##` for section headings (e.g., `## Transportation`, `## Weather`)
- Use `**bold**` for key terms (e.g., `**BTS轻轨**`, `**MRT地铁**`)
- Use `-` for unordered lists
- Use tables for structured data (e.g., emergency contacts, price comparisons)
- Use `---` as section separator between major topics
- Keep paragraphs under 3 sentences
- Use `*italic*` for disclaimers or supplementary notes

### What the Guide Layer Covers

The Essential Guide should cover these topics, in this order:

1. Transportation (public transit, airport, taxis, ride-hailing)
2. Weather (seasons, temperature, what to pack)
3. Entry requirements (visas, customs, arrival forms)
4. Payment methods (cash, cards, mobile pay, ATMs)
5. Practical information (SIM cards, power plugs, language, etiquette)
6. Emergency contacts (police, ambulance, embassy)

Sections may be added or removed per city.

### Example (Transportation Section)

```
## 交通

**BTS 轻轨（高架）**：覆盖市中心、购物区、素坤逸路，避堵首选。

**MRT 地铁（地下）**：与 BTS 在 Asok、Sala Daeng、Mo Chit 等站换乘。

**机场交通**：
- 素万那普（BKK）：机场快线直达 Phaya Thai（换 BTS），约 30 分钟
- 廊曼（DMK）：乘 A1/A2 巴士到 Mo Chit 换 BTS，或打车 / Grab

**出租车**：上车先问 "By meter?"，打表最划算。
```

---

## Writing Style (Structured Data)

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

## Guide Writing vs Structured Data Generation

These are two distinct AI tasks that require different approaches.

### Guide Writing

| Attribute | Detail |
|-----------|--------|
| Output | `content/essential-guide.md` (Markdown) |
| Tone | Editorial, informative, concise |
| Research source | Official sources, general knowledge |
| AI role | Write and organize practical information |
| Human review | Verify accuracy of all claims |

### Structured Data Generation

| Attribute | Detail |
|-----------|--------|
| Output | `data/*.json` (JSON) |
| Tone | Factual, structured, database-like |
| Research source | CSV exports, Google Maps, Gemini research |
| AI role | Parse and map unstructured data to schema |
| Human review | Verify phone, hours, ratings, address |

**Important:** These tasks should not be combined. Write the Guide first, then generate structured data separately.

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

- [ ] Essential Guide is concise, factual, and mobile-friendly
- [ ] Summary is Chinese, ≤30 characters
- [ ] No invented information
- [ ] Tags are English and relevant
- [ ] All verification statuses are set
- [ ] Phone uses international format
- [ ] No duplicate entries
- [ ] Content is practical, not promotional
