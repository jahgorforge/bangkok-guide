import json, os
from collections import Counter

all_tags = Counter()
for f in os.listdir("data"):
    if not f.endswith(".json"):
        continue
    try:
        with open(f"data/{f}", encoding="utf-8") as fh:
            data = json.load(fh)
    except:
        continue
    for item in data:
        if not isinstance(item, dict):
            continue
        tags = item.get("tags", {})
        if isinstance(tags, list):
            for t in tags:
                if t:
                    all_tags[t.lower().strip()] += 1
        elif isinstance(tags, dict):
            for vals in tags.values():
                if isinstance(vals, list):
                    for t in vals:
                        if t:
                            all_tags[t.lower().strip()] += 1

# Full Chinese translations
translations = {
    "street-food": {"zh": "街头小吃"},
    "night-market": {"zh": "夜市"},
    "buffet": {"zh": "自助餐"},
    "restaurant": {"zh": "餐厅"},
    "food-court": {"zh": "美食广场"},
    "food-area": {"zh": "美食区"},
    "market": {"zh": "市集"},
    "local-market": {"zh": "本地市场"},
    "cafe": {"zh": "咖啡馆"},
    "boutique": {"zh": "精品"},
    "apartment": {"zh": "公寓"},
    "hostel": {"zh": "青年旅舍"},
    "transit": {"zh": "中转"},
    "service": {"zh": "服务"},
    "heritage": {"zh": "老字号"},
    "vintage": {"zh": "复古"},
    "chain": {"zh": "连锁"},
    "mall": {"zh": "商场"},
    "landmark": {"zh": "地标"},
    "museum": {"zh": "博物馆"},
    "park": {"zh": "公园"},
    "neighborhood": {"zh": "街区"},
    "viewpoint": {"zh": "观景点"},
    "temple": {"zh": "寺庙"},
    "seafood": {"zh": "海鲜"},
    "variety": {"zh": "多样选择"},
    "thai": {"zh": "泰式"},
    "noodle": {"zh": "面食"},
    "grill": {"zh": "烧烤"},
    "dessert": {"zh": "甜品"},
    "sushi": {"zh": "寿司"},
    "crab": {"zh": "蟹肉"},
    "shrimp": {"zh": "虾"},
    "beef": {"zh": "牛肉"},
    "pork": {"zh": "猪肉"},
    "coffee": {"zh": "咖啡"},
    "fruit": {"zh": "水果"},
    "fruits": {"zh": "水果"},
    "durian": {"zh": "榴莲"},
    "mangosteen": {"zh": "山竹"},
    "ice-cream": {"zh": "冰淇淋"},
    "sweet": {"zh": "甜点"},
    "international": {"zh": "国际料理"},
    "japanese": {"zh": "日式"},
    "korean": {"zh": "韩式"},
    "local": {"zh": "本地"},
    "famous": {"zh": "知名"},
    "queue": {"zh": "排队"},
    "bustling": {"zh": "热闹"},
    "authentic": {"zh": "地道"},
    "peaceful": {"zh": "宁静"},
    "romantic": {"zh": "浪漫"},
    "quality": {"zh": "品质"},
    "fun": {"zh": "有趣"},
    "unique": {"zh": "独特"},
    "legendary": {"zh": "传奇"},
    "casual": {"zh": "休闲"},
    "premium": {"zh": "高端"},
    "michelin": {"zh": "米其林"},
    "solo": {"zh": "独自"},
    "couple": {"zh": "情侣"},
    "family": {"zh": "家庭"},
    "friends": {"zh": "朋友"},
    "group": {"zh": "团体"},
    "food-lover": {"zh": "美食爱好者"},
    "families": {"zh": "适合家庭"},
    "cheap": {"zh": "便宜"},
    "budget": {"zh": "平价"},
    "mid-range": {"zh": "中等"},
    "expensive": {"zh": "高价"},
    "bts": {"zh": "近BTS"},
    "mrt": {"zh": "近MRT"},
    "airport": {"zh": "近机场"},
    "parking": {"zh": "有停车场"},
    "pool": {"zh": "泳池"},
    "gym": {"zh": "健身房"},
    "wifi": {"zh": "WiFi"},
    "balcony": {"zh": "阳台"},
    "elevator": {"zh": "电梯"},
    "laundry": {"zh": "有洗衣"},
    "bar": {"zh": "酒吧"},
    "spa": {"zh": "水疗"},
    "lunch": {"zh": "午餐"},
    "dinner": {"zh": "晚餐"},
    "drinks": {"zh": "饮品"},
    "breakfast": {"zh": "早餐"},
    "bbq": {"zh": "烧烤"},
    "hotpot": {"zh": "火锅"},
    "barber": {"zh": "理发"},
    "gallery": {"zh": "画廊"},
    "nightlife": {"zh": "夜生活"},
    "antiques": {"zh": "古董"},
    "river-view": {"zh": "河景"},
    "air-conditioned": {"zh": "有空调"},
    "all-you-can-eat": {"zh": "吃到饱"},
    "work-friendly": {"zh": "适合办公"},
    "date-night": {"zh": "适合约会"},
    "instagrammable": {"zh": "网红打卡"},
    "central-location": {"zh": "位置中心"},
    "good-for-groups": {"zh": "适合团体"},
    "student-favorite": {"zh": "学生最爱"},
    "local-favorite": {"zh": "当地人最爱"},
    "local-experience": {"zh": "地道体验"},
    "budget-friendly": {"zh": "实惠"},
    "tourist-friendly": {"zh": "游客友好"},
    "special-occasion": {"zh": "特别场合"},
    "bucket-list": {"zh": "此生必去"},
    "first-time": {"zh": "初次体验"},
    "quick-meal": {"zh": "快速用餐"},
    "group-gathering": {"zh": "适合聚餐"},
    "night-out": {"zh": "夜晚好去处"},
    "cheap-eats": {"zh": "平价美食"},
    "seafood-lover": {"zh": "海鲜爱好者"},
    "fresh-seafood": {"zh": "新鲜海鲜"},
    "live-seafood": {"zh": "活海鲜"},
    "crab-lover": {"zh": "蟹肉爱好者"},
    "dessert-lover": {"zh": "甜品爱好者"},
    "coffee-lover": {"zh": "咖啡爱好者"},
    "backpacker": {"zh": "背包客"},
    "digital-nomad": {"zh": "数字游民"},
    "digital-nomads": {"zh": "数字游民"},
    "food-lover": {"zh": "美食爱好者"},
    "photography": {"zh": "摄影"},
    "shopping": {"zh": "购物"},
    "river": {"zh": "河畔"},
    "riverside": {"zh": "河畔"},
    "city-center": {"zh": "市中心"},
    "second-hand": {"zh": "二手"},
    "street-food": {"zh": "街头小吃"},
    "local-food": {"zh": "本地美食"},
    "weekend-market": {"zh": "周末市场"},
}

# Write dictionary
result = {}
for tag in sorted(all_tags.keys()):
    if tag in translations:
        result[tag] = translations[tag]
    else:
        result[tag] = {"zh": tag.replace("-", " ").replace("_", " ")}

os.makedirs("taxonomy", exist_ok=True)
with open("taxonomy/tags.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

# Report
untranslated = [t for t in sorted(all_tags.keys()) if t not in translations]
print(f"Total unique tags: {len(all_tags)}")
print(f"Dictionary entries: {len(result)}")
print(f"With Chinese translation: {len(all_tags) - len(untranslated)}")
print(f"Fell back to English: {len(untranslated)}")
if untranslated:
    print(f"\nUntranslated tags (shown in English):")
    for t in untranslated[:20]:
        print(f"  - {t}")
    if len(untranslated) > 20:
        print(f"  ... and {len(untranslated)-20} more")
