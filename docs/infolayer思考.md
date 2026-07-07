下面是我们这次讨论的简要整理版，适合作为项目笔记保存（例如 Obsidian）。重点记录**当前架构思路、后续扩展方向和UI考虑**。

---

# Bangkok Guide 项目阶段总结（Food完成后）

## 当前阶段状态

✅ **Food 模块已跑通**

完成内容：

* Gemini / 人工整理资料
* Claude Code 数据清洗
* JSON Schema v1.0 转换
* 前端 Card 渲染
* Filter / Tag 支持
* 手机端展示优化

当前项目已经验证：

> 「Markdown 信息 → JSON 数据 → 前端展示」这一套流程可复制。

后续城市扩展可以直接复制整个 Project。

---

# 一、数据架构思路

## 1. Content Layer（核心数据层）

目前：

```
data/
├── food.json
├── hotel.json
├── attraction.json
```

特点：

* 结构化信息
* 多条记录
* 适合 Card 展示
* 可以筛选、分类

统一使用：

```
content-schema.md
```

作为模板。

例如：

Food:

```
name
type
location
tags
experience
price
rating
links
recommendation
verification
```

Hotel / Attraction：

原则：

> 复制 Food Schema，不重新设计新的 Schema。

原因：

* 保持整个项目统一
* Claude Code 容易维护
* 未来复制城市简单

如果不同类型有特殊需求：

采用：

```
base schema
+
optional fields
```

例如：

Hotel增加：

```
roomType
amenities
distanceToAirport
```

Attraction增加：

```
ticketPrice
openingHours
duration
```

而不是重新建立 hotel-schema。

---

# 二、Guide Layer / Info Layer（新增思考）

目前发现：

有一些重要内容无法放入 food/hotel/attraction。

例如：

## 城市基础信息

```
Bangkok Overview

- 最佳旅游季节
- 天气
- 温度
- 雨季
- 穿衣建议
```

---

## 实用信息

```
Emergency

- Police
- Hospital
- Tourist Police
- Embassy
```

---

## 官方资源

```
Official Links

- Tourism Authority
- Transport
- Airport
- Government websites
```

---

## Travel Guide

```
Suggested Routes

- 3 Days Bangkok
- 5 Days Bangkok
- Family Trip
- Food Trip
```

---

这些特点：

不是多个地点记录，而是：

> 一个主题对应一篇内容。

因此不适合 Content Layer。

建议增加：

## Guide Layer（推荐名字）

比 Info Layer 更符合项目定位。

结构：

```
data/
│
├── content/
│   ├── food.json
│   ├── hotel.json
│   └── attraction.json
│
└── guides/
    ├── weather.json
    ├── emergency.json
    ├── transport.json
    ├── itinerary.json
    └── city-overview.json
```

以后整个项目：

```
Bangkok Guide

├── Explore Layer
│
│   Food
│   Hotel
│   Attraction
│
└── Guide Layer
    │
    Weather
    Transport
    Practical Info
    Trip Planning
```

---

# 三、UI目前不用大改，但需要提前考虑

## 现在主页结构

当前：

```
Home

Food Card
Hotel Card
Attraction Card
Shopping Card
...
```

电脑：

类似卡片展示。

手机：

实际上已经接近 List。

---

## 未来问题

加入 Guide Layer 后：

现在首页逻辑：

```
Categories
```

会变成：

```
Explore
+
Plan Your Trip
```

可能需要重新分区。

例如：

主页：

```
Bangkok Guide


Explore Bangkok

🍜 Food
🏨 Hotels
📍 Attractions


Plan Your Trip

🌤 Weather
🚇 Transport
📞 Essential Info
🗺 Itineraries
```

---

## Sidebar

比较容易调整。

现在：

```
Food
Hotel
Attraction
```

以后：

```
Explore

Food
Hotels
Attractions


Plan

Weather
Transport
Practical Info
Itineraries
```

因为 sidebar 本质是 list。

---

## Home Page

暂时不要改。

原因：

现在最重要：

1. 完成数据流程
2. 验证多个分类
3. 累积内容

等：

```
Food
Hotel
Attraction
```

全部完成后，再统一调整首页。

---

# 四、目前推荐执行顺序

## Phase 2（继续完成 Content Layer）

优先：

### 1. Hotel

原因：

结构简单。

流程：

```
Gemini research
        ↓
Claude Code
        ↓
hotel.json
        ↓
frontend display
```

---

### 2. Attraction

结构稍复杂：

增加：

* ticket
* duration
* opening hours

---

完成：

```
Food
Hotel
Attraction
```

基本就是核心旅游数据库。

---

## Phase 3（Guide Layer）

再做：

```
Weather
Transport
Emergency
Itinerary
City Overview
```

因为这些需要不同的数据结构。

---

# 五、当前项目核心文档

以后复制城市时：

必须保留：

```
docs/

content-schema.md

city-project-template.md

README.md
```

作用：

## content-schema.md

定义：

> 数据怎么写。

## city-project-template.md

定义：

> 新城市怎么复制。

## README.md

定义：

> 项目说明。

---

# 六、当前最大的成果

现在项目已经从：

> 做一个曼谷网页

变成：

> 建立一个可复制的城市旅行知识库框架。

以后新增城市：

例如：

```
Tokyo Guide
Seoul Guide
Manila Guide
```

流程：

复制项目

↓

替换城市数据

↓

Claude Code 根据 Schema 处理

↓

生成网站

---

当前阶段重点：

**不要急着优化UI。**

先把：

```
Food
Hotel
Attraction
```

三个核心 Content Layer 跑通。

然后再设计 Guide Layer 和新版首页结构。
