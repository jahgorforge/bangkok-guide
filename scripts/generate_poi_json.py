import json, re

with open("content/attractions/poi.md", encoding="utf-8") as f:
    content = f.read()

# Split into POI blocks
blocks = []
current = []
for line in content.split("\n"):
    if line.startswith("# ") and not line.startswith("## "):
        if current:
            blocks.append("\n".join(current))
        current = [line]
    else:
        current.append(line)
if current:
    blocks.append("\n".join(current))


def get_field(text, section, field):
    sec = re.search(rf"## {re.escape(section)}\s*\n(.*?)(?=\n## |\Z)", text, re.DOTALL)
    if not sec:
        return None
    pat = rf'[-*]\s+\*\*{re.escape(field)}\*\*:\s*(.*?)(?:\n|\Z)'
    m = re.search(pat, sec.group(1))
    if m:
        val = m.group(1).strip()
        return None if "Unknown" in val or "N/A" in val else val
    return None


def get_list(text, section):
    sec = re.search(rf"## {re.escape(section)}\s*\n(.*?)(?=\n## |\Z)", text, re.DOTALL)
    if not sec:
        return []
    return [i.strip() for i in re.findall(r"^[*-]\s+(.*?)$", sec.group(1), re.MULTILINE) if i.strip()]


def get_notes(text):
    sec = re.search(r"## Notes\s*\n(.*?)(?=\n## |\Z)", text, re.DOTALL)
    return sec.group(1).strip() if sec else ""


def make_item(block, category, type_val, poi_name):
    en = get_field(block, "Basic Information", "English Name") or poi_name
    local = get_field(block, "Basic Information", "Local Name") or ""
    zh = get_field(block, "Basic Information", "Chinese Name") or ""

    rating_str = get_field(block, "Basic Information", "Google Rating")
    try:
        rating_val = float(rating_str) if rating_str else None
    except:
        rating_val = None

    reviews_str = get_field(block, "Basic Information", "Number of Google Reviews")
    review_count = None
    if reviews_str:
        m = re.search(r"[\d,]+", reviews_str.replace("~", ""))
        if m:
            review_count = int(m.group().replace(",", ""))

    lat_str = get_field(block, "Location", "Latitude")
    lng_str = get_field(block, "Location", "Longitude")
    try:
        lat = float(lat_str) if lat_str else None
        lng = float(lng_str) if lng_str else None
    except:
        lat = lng = None

    item = {
        "id": "",
        "name": {"en": en, "local": local, "zh": "" if zh == "Unknown" else zh},
        "type": type_val,
        "category": category,
        "location": {
            "district": get_field(block, "Location", "District") or "",
            "address": get_field(block, "Location", "Full Address") or "",
            "coordinates": {"lat": lat, "lng": lng}
        },
        "tags": {"style": [type_val], "experience": get_list(block, "Best For"), "features": []},
        "experience": {
            "summary": "",
            "bestFor": get_list(block, "Best For"),
            "highlights": get_list(block, "Highlights")
        },
        "practical": {
            "priceRange": get_field(block, "Ticket", "Admission Fee") or "",
            "openingHours": get_field(block, "Opening Hours", "Opening Hours") or "",
            "reservation": "",
            "transport": ""
        },
        "rating": {"overall": rating_val, "reviewCount": review_count, "source": "Google Maps"},
        "links": {
            "googleMaps": get_field(block, "Location", "Google Maps Link") or "",
            "phone": get_field(block, "Contact", "Phone Number") or "",
            "website": get_field(block, "Contact", "Official Website") or ""
        },
        "recommendation": {
            "bestTime": get_field(block, "Recommended Visit", "Best Time to Visit") or "",
            "visitDuration": get_field(block, "Recommended Visit", "Suggested Visit Duration") or "",
            "nearby": get_list(block, "Nearby")
        },
        "verification": {"status": "verified", "issues": []}
    }

    # Transport
    transport_parts = []
    for k in ["BTS", "MRT", "Boat", "Walk to BTS", "Walk to MRT", "Walk to ARL", "Taxi", "Train", "Bus", "Parking"]:
        v = get_field(block, "Transportation", k)
        if v:
            transport_parts.append(f"{k}: {v}")
    if transport_parts:
        item["practical"]["transport"] = "; ".join(transport_parts)

    # Notes -> summary
    notes = get_notes(block)
    if notes:
        sentences = re.split(r"(?<=[.!?])\s+", notes)
        item["experience"]["summary"] = " ".join(sentences[:2]).strip()
        item["notes"] = notes

    return item


# Classify each POI
attractions = []
shopping = []
food_items = []
guide_notes = []

for i, block in enumerate(blocks):
    name_line = block.split("\n")[0].replace("# ", "").strip()
    poi_type = get_field(block, "Basic Information", "POI Type") or ""
    poi_type_lower = poi_type.lower()

    # Determine category
    # Check food/cafe first (has priority over viewpoint/neighborhood overlaps)
    if "cafe" in poi_type_lower:
        item = make_item(block, "cafes", "cafe", name_line)
        food_items.append(item)

    elif "restaurant" in poi_type_lower or "food" in poi_type_lower:
        item = make_item(block, "food", "restaurant", name_line)
        food_items.append(item)

    elif any(t in poi_type_lower for t in ["temple", "museum", "park", "landmark", "viewpoint", "neighborhood", "historic site", "sports stadium"]):
        # Map to attraction type
        if "museum" in poi_type_lower:
            t = "museum"
        elif "park" in poi_type_lower:
            t = "park"
        elif "neighborhood" in poi_type_lower:
            t = "neighborhood"
        elif "historic site" in poi_type_lower:
            t = "historic-site"
        elif "sports stadium" in poi_type_lower or "stadium" in poi_type_lower:
            t = "landmark"
        elif "photography" in poi_type_lower or "cafe" in poi_type_lower:
            t = "viewpoint"
        else:
            t = "landmark"

        item = make_item(block, "attractions", t, name_line)
        attractions.append(item)

    elif any(t in poi_type_lower for t in ["market", "mall", "shopping", "entertainment"]):
        # Map to shopping type
        if "mall" in poi_type_lower or "mixed-use" in poi_type_lower:
            t = "mall"
        elif "market" in poi_type_lower or "night market" in poi_type_lower:
            t = "market"
        elif "riverfront" in poi_type_lower or "entertainment" in poi_type_lower:
            t = "market"
        else:
            t = "market"

        item = make_item(block, "shopping", t, name_line)
        shopping.append(item)

    elif any(t in poi_type_lower for t in ["bus terminal", "pier", "transportation", "barber", "service"]):
        guide_notes.append(f"**{name_line}** — {poi_type}")

    else:
        guide_notes.append(f"**{name_line}** — {poi_type} (unclassified)")

# Generate IDs
for i, item in enumerate(attractions):
    item["id"] = f"attraction-{i+1:03d}"

for i, item in enumerate(shopping):
    item["id"] = f"shopping-{i+1:03d}"

for i, item in enumerate(food_items):
    item["id"] = f"cafe-{i+1:03d}"

# Write attraction.json
with open("data/attraction.json", "w", encoding="utf-8") as f:
    json.dump(attractions, f, ensure_ascii=False, indent=2)

# Write shopping.json
with open("data/shopping.json", "w", encoding="utf-8") as f:
    json.dump(shopping, f, ensure_ascii=False, indent=2)

# Write guide-notes.md
with open("docs/guide-notes.md", "w", encoding="utf-8") as f:
    f.write("# Guide Notes\n\n")
    f.write("Items from POI research that don't fit into existing categories.\n\n")
    f.write("---\n\n")
    for note in guide_notes:
        f.write(f"- {note}\n")
    f.write("\n---\n\n")
    f.write("_Generated from POI research markdown._\n")

# Merge food_items into existing data files
for item in food_items:
    target_file = f"data/{item['category']}.json"
    try:
        with open(target_file, encoding="utf-8") as f:
            existing = json.load(f)
    except:
        existing = []

    # Generate next ID
    cat_prefix = item["category"].rstrip("s")  # food, cafe
    existing_ids = [e["id"] for e in existing if e["id"].startswith(cat_prefix)]
    next_num = 1
    if existing_ids:
        nums = [int(e.split("-")[-1]) for e in existing_ids]
        next_num = max(nums) + 1
    item["id"] = f"{cat_prefix}-{next_num:03d}"

    existing.append(item)
    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    print(f"Added {item['id']} to {target_file}")

print(f"\nattraction.json: {len(attractions)} entries")
print(f"shopping.json: {len(shopping)} entries")
print(f"guide-notes.md: {len(guide_notes)} items")
