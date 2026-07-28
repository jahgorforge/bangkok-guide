# AI Design Handoff Guide

## Purpose

用于 AI 网站开发流程中，从 UI 设计（Figma）返回 AI 实现阶段时，明确需要提供哪些文件。

核心原则：

> 不需要把整个项目交给 AI，而是根据任务提供必要的信息。

---

# UI 优化阶段 Workflow

```
Prototype Development
    ↓
Figma UI Design
    ↓
Design Handoff Package
    ↓
AI Review / Implementation
    ↓
Browser Testing
    ↓
Final Polish
```

---

# 1. UI 优化任务需要哪些文件？

## A. 只修改视觉效果

例如：卡片样式、颜色、字体、间距、圆角、阴影、页面布局

提供：
```
✅ Figma Screenshot (PNG)
✅ HTML
✅ CSS
```

不需要：
```
❌ JS
❌ JSON
❌ 数据文件
```

---

## B. 修改交互效果

例如：Accordion 展开收起、Navigation 动画、Button 行为、页面交互

提供：
```
✅ Figma Screenshot
✅ HTML
✅ CSS
✅ JS
```

---

## C. 修改数据展示方式

例如：增加字段、改 Card 内容结构、调整数据布局

提供：
```
✅ Figma Screenshot
✅ HTML
✅ CSS
✅ JSON / Data Files
```

---

## D. 项目级重构

例如：更换框架、新设计系统、大规模页面调整

提供：
```
✅ Full Project
```

包括：
```
src/
components/
content/
data/
assets/
```

---

# 2. Recommended Design Handoff Package

不要直接发送整个项目。建立一个专门的交付文件夹：

```
design-handoff/
├── screenshots/
│   ├── homepage-desktop.png
│   └── homepage-mobile.png
├── source/
│   ├── index.html
│   └── style.css
├── assets/
│   ├── logo.svg
│   └── icons/
└── design-notes.md
```

---

# 3. Screenshot 文件类型

## PNG Screenshot

主要用途：展示最终视觉效果。

适合：整个页面、Desktop 页面、Mobile 页面、Layout 参考

优势：AI 最容易理解：
- 页面层级
- 空间关系
- 视觉比例
- 整体风格

推荐：★★★★★

---

## SVG

主要用途：传递矢量元素。

适合：Logo、Icon、简单 UI 元素

优势：
- 无损缩放
- 保留矢量信息
- 适合网页资源

不适合：整个复杂页面。

原因：复杂 SVG 会变成大量路径，AI 不容易理解组件结构。

推荐：★★★★☆

---

# 4. design-notes.md

不要只给图片。提供简单说明：

```md
# UI Update Request

Goal:
Improve visual quality without changing functionality.

Reference:
homepage.png

Changes:

1. Card Design
- More whitespace
- Softer shadow
- Keep white background

2. Navigation
- Match Figma design
- Update active state

3. Do not change:
- Data structure
- Routing
- Content
```

作用：告诉 AI 修改目标、修改范围、禁止修改内容。

---

# 5. Claude Web vs Claude Code 分工

## Claude Web

适合：设计分析。

输入：Screenshot、HTML、CSS、Figma Design

任务：找问题、提供优化建议、比较设计稿和现有页面

---

## Claude Code

适合：执行修改。

输入：已确定的设计方案、项目文件

任务：修改 CSS、修改组件、实现设计

---

# Recommended Workflow

```
Figma
    ↓
Claude Web (UI Review)
    ↓
确定修改方案
    ↓
Claude Code (Implementation)
    ↓
Browser Testing
    ↓
Final Polish
```

---

# Quick Reference

| Task | Files |
| ---- | ----- |
| Review UI | Screenshot |
| Change layout | PNG + HTML + CSS |
| Change style | HTML + CSS |
| Change interaction | HTML + CSS + JS |
| Change data display | HTML + CSS + JSON |
| Project refactor | Full Project |

---

# Core Principle

> AI 不需要知道所有代码，只需要知道完成当前任务所需要的信息。

正确的信息输入，比提供更多文件更重要。
