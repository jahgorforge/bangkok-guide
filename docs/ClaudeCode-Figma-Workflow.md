# Claude Code ↔ Figma 工作流（Part 1）

> Version: v1.1
> Status: ✅ Website → Native Figma Design 工作流已验证

---

# 目标

建立 Claude Code 与 Figma 的协同工作流，实现：

```
Claude Code
    ↓
Figma（设计）
    ↓
Claude Code（实现）
```

目前已完成前半部分：

```
Claude Code
    ↓
Figma
```

---

# Step 1：连接 Figma MCP

在 Claude Code 中执行：

```
I want to connect Claude Code to the official Figma MCP server.

My environment:
- Windows 11
- Figma Desktop is already installed.
- I have a Figma Education account.
- Claude Code is already installed and working.

Please:

1. Check whether Figma MCP is already installed.
2. If not, install the official Figma MCP server using the current recommended method (do not use deprecated commands).
3. Guide me through the authentication process.
4. Verify that the connection works.
5. Create a simple test by reading or creating a Figma file.
6. Explain each step before executing it, and stop whenever my confirmation is required.

Please follow the latest official Figma documentation rather than older tutorials.
```

完成后确认：

* ✅ Figma MCP 已安装
* ✅ OAuth 登录成功
* ✅ 能读取 Figma 文件
* ✅ Claude Code 与 Figma 已连接

---

# Step 2：将网页重构为 Figma Design

目标：

将现有网站重构为可编辑的 Native Figma Design，为后续 UI 优化和 Design System 建立基础。

转换流程：

```
HTML / CSS / Assets
        ↓
Claude Code + Figma MCP
        ↓
Native Figma Design
        ↓
Design System
```

---

## 输入文件

建议提供：

- HTML（index.html、food.html 等）
- CSS（必须）
- 图片 / SVG Icons / Logo（建议）
- JSON（如页面由数据生成）

---

## 推荐流程

### Phase 1：分析网页

先让 Claude Code 分析网站结构，不立即生成 Figma。

分析内容：

- Desktop 布局
- Mobile 响应式布局
- 可复用组件
- 颜色、字体、间距等设计规范

确认页面结构后，再开始生成。

---

### Phase 2：生成 Desktop 页面

先只生成桌面版：

- 01 Desktop - Home
- 02 Desktop - Food

要求：

- 使用 Native Figma 元素（不是截图）
- 使用 Auto Layout
- 保持现有网站视觉，不重新设计
- 建立可复用 Components
- 完成后停止，等待检查

重点检查：

- 页面结构是否正确
- Sidebar 是否完整
- 卡片布局是否合理
- Layer 结构是否清晰

---

### Phase 3：生成 Mobile 页面

Desktop 确认后，再生成：

- 03 Mobile - Home
- 04 Mobile - Food

要求：

- 按照实际响应式布局重建
- 不直接缩放 Desktop
- 复用已有 Components
- 保持视觉一致

---

### Phase 4：生成 Design System

最后创建：

- 05 Design System

内容包括：

- Colors
- Typography
- Components
- Icons

原则：

- 从已有页面提取
- 不新增不存在的设计
- 保持简单、实用

---

## 输出目标

完成后应包含：

- ✅ Native Figma Design
- ✅ Desktop Pages
- ✅ Mobile Pages
- ✅ Auto Layout
- ✅ Reusable Components
- ✅ Design System

---

## 当前完成状态

✅ Claude Code ↔ Figma MCP 已连接

✅ Bangkok Guide 已成功重构为 Native Figma Design

当前 Figma 文件结构：

```
01 Desktop - Home
02 Desktop - Food
03 Mobile - Home
04 Mobile - Food
05 Design System
```

已完成：

- Desktop / Mobile 双端页面
- Native Figma 设计
- Auto Layout
- Reusable Components
- Design System 基础

---

## 下一阶段

```
Figma
    ↓
UI 优化 / Design Refinement
    ↓
Claude Code
    ↓
同步更新 HTML / CSS
    ↓
浏览器验证
    ↓
Git 提交版本
```
