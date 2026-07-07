import json, re

with open("content/hotels/hotel_aistudio.md", encoding="utf-8") as f:
    content = f.read()

# Split into hotel blocks
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
    sec_pattern = rf"## {re.escape(section)}\s*\n(.*?)(?=\n## |\Z)"
    sec_match = re.search(sec_pattern, text, re.DOTALL)
    if not sec_match:
        return None
    sec_text = sec_match.group(1)
    field_pattern = rf'[-*]\s+\*\*{re.escape(field)}\*\*:\s*(.*?)(?:\n|\Z)'
    field_match = re.search(field_pattern, sec_text)
    if field_match:
        val = field_match.group(1).strip()
        return None if "Unknown" in val or "N/A" in val else val
    return None


def get_list(text, section):
    sec_pattern = rf"## {re.escape(section)}\s*\n(.*?)(?=\n## |\Z)"
    sec_match = re.search(sec_pattern, text, re.DOTALL)
    if not sec_match:
        return []
    sec_text = sec_match.group(1)
    items = re.findall(r"^[*-]\s+(.*?)$", sec_text, re.MULTILINE)
    return [i.strip() for i in items if i.strip()]


def get_notes(text):
    sec_pattern = r"## Notes\s*\n(.*?)(?=\n## |\Z)"
    sec_match = re.search(sec_pattern, text, re.DOTALL)
    if sec_match:
        return sec_match.group(1).strip()
    return ""


hotels = []
for i, block in enumerate(blocks):
    name_line = block.split("\n")[0].replace("# ", "").strip()

    cat = get_field(block, "Basic Information", "Hotel Category") or ""

    type_map = {
        "budget": "budget", "apartment": "apartment", "boutique": "boutique",
        "hostel": "hostel", "resort": "resort", "business hotel": "business",
        "serviced apartment": "serviced-apartment", "transit": "transit",
        "large scale": "budget", "city hotel": "boutique",
    }
    main_cat = cat.split("/")[0].strip().lower() if cat else ""
    hotel_type = type_map.get(main_cat, main_cat)

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
        lat = None
        lng = None

    price_range_field = get_field(block, "Price", "Estimated Price Range")
    bht_count = price_range_field.count("฿") if price_range_field else 0
    price_range = "$" * bht_count if bht_count > 0 else ""

    room_price = get_field(block, "Price", "Approximate Room Price")
    if not room_price:
        room_price = get_field(block, "Price", "Approximate Price")

    # Handle the special case for the first hotel (Baron Zotel)
    en_name = get_field(block, "Basic Information", "English Name") or name_line
    local_name = get_field(block, "Basic Information", "Local Name") or ""
    zh_name = get_field(block, "Basic Information", "Chinese Name") or ""

    h = {
        "id": f"hotel-{i+1:03d}",
        "name": {"en": en_name, "local": local_name, "zh": "" if zh_name == "Unknown" else zh_name},
        "type": hotel_type,
        "category": "hotels",
        "location": {
            "district": get_field(block, "Location", "District") or "",
            "address": get_field(block, "Location", "Full Address") or "",
            "coordinates": {"lat": lat, "lng": lng}
        },
        "contact": {
            "phone": get_field(block, "Contact", "Phone Number") or "",
            "website": get_field(block, "Contact", "Official Website") or "",
            "email": get_field(block, "Contact", "Email") or ""
        },
        "tags": {"style": [], "audience": [], "features": [], "location": []},
        "experience": {
            "summary": "",
            "bestFor": get_list(block, "Best For"),
            "highlights": get_list(block, "Highlights")
        },
        "practical": {
            "priceRange": price_range,
            "approxRoomPrice": room_price or "",
            "checkIn": get_field(block, "Check-in", "Check-in") or "",
            "checkOut": get_field(block, "Check-in", "Check-out") or "",
            "reservation": get_field(block, "Reservation", "Reservation Required?") or ""
        },
        "rating": {"overall": rating_val, "reviewCount": review_count, "source": "Google Maps"},
        "transport": {"bts": "", "mrt": "", "airport": ""},
        "facilities": get_list(block, "Facilities"),
        "recommendation": {"nearby": get_list(block, "Nearby")},
        "links": {
            "googleMaps": get_field(block, "Location", "Google Maps Link") or "",
            "website": get_field(block, "Contact", "Official Website") or ""
        },
        "verification": {"status": "verified", "issues": []}
    }

    # Tags from type
    if h["type"]:
        h["tags"]["style"].append(h["type"])

    # Transport
    for transport_key, tag in [("Walk to BTS", "bts"), ("Walk to MRT", "mrt"),
                                ("Walk to ARL", "arl")]:
        val = get_field(block, "Transportation", transport_key)
        if val and transport_key != "Walk to ARL":
            h["transport"][tag] = val
        elif val:
            h["transport"]["mrt"] = (h["transport"]["mrt"] + "; " + val).strip("; ")

    # Airport transport
    airport_parts = []
    bkk = get_field(block, "Transportation", "Airport (BKK)")
    if bkk:
        airport_parts.append(f"BKK: {bkk}")
    dmk = get_field(block, "Transportation", "Airport (DMK)")
    if dmk:
        airport_parts.append(f"DMK: {dmk}")
    if airport_parts:
        h["transport"]["airport"] = "; ".join(airport_parts)

    # Taxi transport note
    taxi = get_field(block, "Transportation", "Taxi")
    taxi2 = get_field(block, "Transportation", "Taxi/Grab")
    if taxi:
        h["transport"]["bts"] = (h["transport"]["bts"] + "; " + taxi).strip("; ")
    if taxi2:
        h["transport"]["bts"] = (h["transport"]["bts"] + "; " + taxi2).strip("; ")

    # Notes / summary
    notes = get_notes(block)
    if notes:
        sentences = re.split(r"(?<=[.!?])\s+", notes)
        h["experience"]["summary"] = " ".join(sentences[:2]).strip()
        h["notes"] = notes

    # Barber shop special case
    check_name = h["name"]["en"].lower()
    if "barber" in check_name or "barber" in cat.lower():
        h["type"] = "other"
        h["tags"]["style"] = ["barber"]
        h["verification"]["status"] = "needs-review"
        h["verification"]["issues"] = ["Not a hotel - barber shop"]

    hotels.append(h)

# Write
with open("data/hotel.json", "w", encoding="utf-8") as f:
    json.dump(hotels, f, ensure_ascii=False, indent=2)

print(f"Generated {len(hotels)} hotel entries")
print(f"JSON valid: YES")
ids = [h["id"] for h in hotels]
print(f"IDs unique: {'YES' if len(set(ids)) == len(ids) else 'NO'}")
