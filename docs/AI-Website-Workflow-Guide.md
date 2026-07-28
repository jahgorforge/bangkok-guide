# Personal AI website Development Workflow

> Version: v2.0
> Status: ✅ Validated through the Bangkok Guide project

```
Idea
  ↓
ChatGPT
(Product Structure)

  ↓
Claude Code
(MVP Prototype)

  ↓
Freeze Layout
(Content & Navigation Stable)

  ↓
Figma
(Native UI Design)

  ↓
Claude Code
(Implementation & Polish)

  ↓
Deploy

  ↓
Template Library
(Reuse)
```

---

## Workflow Explanation

### 1. Idea

明确产品目标、用户需求和核心功能。

输出：

- Product Idea
- Scope
- Target Users

---

### 2. ChatGPT (Product Structure)

负责产品规划，而不是编写代码。

输出：

- Project Brief
- Information Architecture
- Page Structure
- User Flow
- UI Strategy
- Development Plan

---

### 3. Claude Code (MVP Prototype)

快速完成可运行的 MVP。

重点：

- HTML
- CSS
- JavaScript
- Data Structure
- Responsive Layout
- 基本交互

目标不是精美，而是尽快验证产品。

---

### 4. Freeze Layout

这是 Bangkok Guide 项目验证后新增的重要阶段。

当以下内容基本稳定时，即可进入 UI 设计：

- 页面结构
- 导航结构
- 信息层级
- 卡片结构
- 数据组织
- 响应式布局

此阶段不再频繁调整整体页面架构。

---

### 5. Figma (Native UI Design)

利用 Claude Code + Figma MCP，将网站重构为 Native Figma Design。

流程：

- 分析网站结构
- 重建 Desktop 页面
- 重建 Mobile 页面
- 建立 Components
- 提取 Design System

目标：

- Native Figma Design
- Auto Layout
- Reusable Components
- Design System

这一阶段主要优化视觉设计，而不是重新规划产品。

---

### 6. Claude Code (Implementation & Polish)

根据 Figma 更新网页实现。

包括：

- UI 优化
- Design Token 同步
- HTML/CSS 调整
- 响应式优化
- 动画与交互优化
- 代码重构

保证网页最终效果与 Figma 保持一致。

---

### 7. Deploy

发布网站。

包括：

- Git 提交
- GitHub
- Vercel / Cloudflare Pages
- 浏览器验证

---

### 8. Template Library (Reuse)

项目完成后，将可复用内容沉淀为模板。

包括：

- Project Structure
- Prompt Library
- Claude Code Workflow
- Figma Template
- Design System
- Components
- Design Tokens
- HTML/CSS Template
- Documentation

下一次新项目可直接复用整个模板，而不是从零开始。

---

## Core Principles

- 先验证产品，再优化设计。
- Prototype 不追求完美，重点是快速验证。
- 页面结构稳定后，再进入 Figma。
- Figma 是设计优化阶段，而不是产品规划阶段。
- Design System 来源于实际项目，而不是预先设计。
- 每完成一个项目，都要沉淀为可复用模板，不断提升开发效率。