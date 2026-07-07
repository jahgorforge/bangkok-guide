# City Guide Project Workflow

Version: 1.0 （ChatGPT）


# Overview

城市旅游指南项目采用：

Research → Data Schema → JSON Database → Frontend → Optimization

流程。

目标：

快速复制不同城市项目，保持统一结构，降低维护成本。


---

# Phase 1 — Project Setup & Data Foundation

## Step 1. Create New City Project

复制已有城市项目作为模板。

保留：

- 项目结构
- Schema
- Frontend framework
- UI system
- Documentation


修改：

- city name
- project brief
- data folder


参考文档：

- docs/city-project-template.md
- docs/content-schema.md


---

## Step 2. Define City Content Structure

确定城市需要的数据分类：

例如：

```

data/

food.json
hotel.json
attractions.json
shopping.json
cafes.json
transport.json
massage.json

```


原则：

不要每个类别创建新的 Schema。

使用：

Common Schema + Category Extension


例如：

food:

- cuisine
- price
- opening hours


hotel:

- room type
- facilities


共用：

- name
- location
- rating
- tags
- links
- practical


---

## Step 3. Research Data Collection

工具：

### Gemini

用途：

- 深度搜索
- Google Maps 信息整理
- 分类研究
- 收集电话号码
- 收集评分
- 收集价格
- 总结特色


输出：

Markdown research notes


重点收集：

```

Name
English Name
Local Name
Location
Google Rating
Phone
Price Range
Opening Hours
Category
Highlights
Best For

```


---

## Step 4. Convert Research → JSON

工具：

### Claude Code


输入：

- Gemini Markdown
- content-schema.md


任务：

转换为：

```

data/category.json

```


要求：

- Schema compliant
- ID unique
- fields complete
- verification status


输出：

数据质量报告。


---

# Phase 2 — Frontend Integration & Optimization


## Step 5. Connect JSON Data

工具：

### Claude Code


任务：

读取 JSON

更新：

```

renderer.js
filter.js
components

```


目标：

实现：

- 分类展示
- 搜索
- Filter
- Card rendering


---

## Step 6. Data Preview & Validation

工具：

浏览器

检查：

- JSON 是否正确读取
- 所有字段是否显示
- 图片/地图链接
- 手机端布局


辅助：

preview-data.html


检查：

- 数据完整性
- 字段结构


---

## Step 7. Card UI Optimization

原则：

不要一次展示全部信息。


Card 只展示：

1. English Name
2. Local Name
3. Rating
4. Price
5. Top 3 tags
6. Short summary
7. Location
8. Action buttons

例如：

```

[Name]

Thai name

★★★★☆ 4.5   ฿฿

Street Food · Seafood · Local

Short description

📍 Location

[Map] [Phone]

```


详细内容进入：

Detail Page


---

## Step 8. Complete Category Expansion

按照同样流程：

```

Research
↓
JSON
↓
Frontend
↓
Review

```


顺序建议：

1. Food ✅
2. Attractions
3. Hotels
4. Cafes
5. Shopping
6. Transport
7. Massage


Food 最复杂。

其他分类可以复用流程。


---

# Tools Usage

## Gemini

定位：

Research Layer


负责：

- 找信息
- 综合资料
- Google Maps research
- 内容整理


---

## Claude Code

定位：

Execution Layer


负责：

- JSON转换
- 文件修改
- 前端开发
- 自动检查
- 重构


---

## DeepSeek API

定位：

Cost-efficient Coding Layer


适合：

- 大量代码修改
- 简单重复任务
- 批量处理


---

## Browser

定位：

QA Layer


负责：

最终验证：

- Desktop
- Mobile
- Layout
- Data display


---

# Important Documents

每个城市项目必须保留：


## 1. Project Brief

说明：

- 城市定位
- 用户群体
- 网站目标
- UI方向


位置：

```

docs/ProjectBrief.md

```


---

## 2. Content Schema

核心文件。

定义：

- JSON结构
- 字段
- 分类规则
- 数据标准


位置：

```

docs/content-schema.md

```


---

## 3. City Project Template

复制指南。


说明：

- 新城市如何建立
- 文件结构
- 开发流程


位置：

```

docs/city-project-template.md

```


---

# Future City Copy Process

新城市：

1. Copy existing project

↓

2. Update Project Brief

↓

3. Gemini research

↓

4. Claude Code generate JSON

↓

5. Run preview

↓

6. Connect frontend

↓

7. Optimize UI

↓

8. Add next category


---

# Core Principle

不要重新开发。

复制系统。

变化的是：

- 城市
- 数据

不变的是：

- Schema
- Workflow
- UI System
- Development Process
```

---

我觉得你现在这个项目的关键成果其实不是 Bangkok Guide，而是已经建立了一个**城市内容生产系统**。

以后做：

* Manila Guide
* Tokyo Guide
* Seoul Guide

基本就是：

复制项目 → 换 Project Brief → Gemini 调研 → Claude Code 执行。

其中最值得长期维护的三个文件：

1. `content-schema.md`（数据标准）
2. `city-project-template.md`（复制规则）
3. `city-project-workflow.md`（操作流程）

这三个文件以后会比代码本身更重要。代码可以让 Claude Code 重写，但你的数据结构和流程经验才是资产。
