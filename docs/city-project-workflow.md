# City Guide Project Workflow

## Overview

```
Research → Data Schema → JSON Database → Frontend → Optimization
```

This workflow is designed to be repeated for each new city project.

---

## Phases

### Phase 0: Project Initialization

**Goal:** Set up the project skeleton.

Tasks:
- Create repository
- Copy project template
- Write Project Brief
- Configure categories

**Output:** Ready-to-develop repository with empty data files.

---

### Phase 1: UI & Architecture

**Goal:** Establish the frontend system.

Tasks:
- Set up HTML pages
- Configure CSS system
- Implement JavaScript rendering
- Verify pages render

**Output:** Functional website with static placeholder content.

---

### Phase 2: Core Development

**Goal:** Connect data to frontend.

Tasks:
- Implement data loading
- Create card rendering
- Add filtering and search
- Optimize mobile layout

**Output:** Data-driven website with real content.

---

### Phase 3: Content Production

**Goal:** Populate the website with curated content.

Tasks:
- Research locations (Gemini)
- Convert research to JSON (Claude Code)
- Validate schema compliance
- Review and refine content
- Add transport, hours, phone, rating

**Output:** Complete city guide with all categories populated.

See `docs/content-production-workflow.md` for the detailed SOP.

---

### Phase 4: Optimization

**Goal:** Refine content and user experience.

Tasks:
- Improve content quality
- Translate summaries to Chinese
- Add missing data (phone, hours, etc.)
- Optimize card layout
- Polish filtering

**Output:** Production-ready website.

---

### Phase 5: Deployment & Maintenance

**Goal:** Launch and maintain.

Tasks:
- Deploy to GitHub Pages
- Tag releases
- Add new entries over time
- Fix data issues as discovered

**Output:** Live website at `https://{username}.github.io/{city}-guide/`.

---

## AI-Assisted Development Workflow

```
                 ┌─────────────────┐
                 │  Research (Gemini) │
                 └────────┬────────┘
                          │ Markdown notes
                          ▼
                 ┌─────────────────┐
                 │  Data Processing │
                 │  (Claude Code)   │
                 └────────┬────────┘
                          │ JSON files
                          ▼
                 ┌─────────────────┐
                 │  Schema Validation │
                 └────────┬────────┘
                          │ Validated JSON
                          ▼
                 ┌─────────────────┐
                 │  Frontend Render │
                 │  (Browser)       │
                 └────────┬────────┘
                          │ Visual feedback
                          ▼
                 ┌─────────────────┐
                 │  Human Review   │
                 └────────┬────────┘
                          │ Approved
                          ▼
                 ┌─────────────────┐
                 │  Deploy (GitHub  │
                 │  Pages)          │
                 └─────────────────┘
```

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `docs/content-schema.md` | Data standard and field definitions |
| `docs/city-project-template.md` | Project structure and replication guide |
| `docs/city-project-workflow.md` | This document — development lifecycle |
| `docs/content-production-workflow.md` | Content production SOP |
| `docs/ai-content-guideline.md` | AI content quality standards |

---

## Tool Assignments

| Tool | Role | Responsibility |
|------|------|---------------|
| **Gemini** | Research Layer | Location research, content summarization |
| **Claude Code** | Execution Layer | JSON generation, frontend dev, validation |
| **Browser** | QA Layer | Desktop + mobile visual verification |
| **Project Owner** | Decision Layer | Content approval, product decisions |

---

## Version Tagging Convention

```
v1.0  — Phase 1 complete (structure + UI)
v2.0  — Phase 2 complete (data + rendering)
v3.0  — Phase 2.5 complete (polish + schema)
v4.0  — Phase 3 complete (full content)
```


可以。我建议不要写得太长，作为 `city-project-workflow.md` 后面的「Future City Project Quick Start」章节即可。重点是让未来自己快速知道**新城市从哪里开始、查哪些文件**。

你可以直接追加：

```md
# Future City Project Quick Start

When creating a new city guide project, follow this document order:

```

city-project-workflow.md
↓
city-project-template.md
↓
ProjectBrief.md
↓
content-schema.md
↓
content-production-workflow.md
↓
ai-content-guideline.md
↓
Development & Content Production

```

---

## Step 1 — Understand the Workflow

Read:

`city-project-workflow.md`

Purpose:

- Understand the overall project lifecycle
- Identify the current development phase
- Follow the correct sequence of tasks

---

## Step 2 — Create Project Structure

Reference:

`city-project-template.md`

Actions:

- Copy the project template
- Create a new independent city project
- Update city name and project configuration

---

## Step 3 — Define City Strategy

Create:

`docs/ProjectBrief.md`

Define:

- City positioning
- Target users
- Content scope
- Design and content direction

---

## Step 4 — Follow Data Standards

Reference:

`content-schema.md`

Purpose:

- Keep JSON structure consistent
- Ensure frontend compatibility
- Maintain reusable data format

---

## Step 5 — Produce Content

Reference:

`content-production-workflow.md`

Process:

```

Information Collection
↓
AI Processing
↓
JSON Generation
↓
Schema Validation
↓
Frontend Preview
↓
Human Review
↓
Publishing

```

---

## Step 6 — Maintain Content Quality

Reference:

`ai-content-guideline.md`

Ensure:

- Consistent writing style
- Practical travel information
- No invented facts
- No exaggerated marketing language

---

## Core Principle

Each city is an independent project.

Reuse:

- Framework
- Workflow
- Schema
- UI System

Customize:

- City data
- Images
- Content strategy
- Local information
```

这个版本放在 workflow 后面比较合适，因为它相当于一个**项目启动导航页**。

以后你开新城市时，只需要打开 `city-project-workflow.md`，看到最后这一节，就知道下一步该看哪个文件，不需要重新回忆整个系统。
