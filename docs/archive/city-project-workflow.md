# City Guide Project Workflow

## Overview

```
Research → Guide Layer → Data Layer → UI Integration → Polish & Release
```

This workflow is designed to be repeated for each new city project.

Two complementary content layers:

- **Guide Layer** (`content/essential-guide.md`) — Markdown editorial content for the homepage
- **Structured Data Layer** (`data/*.json`) — Searchable place database for category pages

---

## Phases

### Phase 1: Project Initialization

**Goal:** Set up the project skeleton.

Tasks:
- Create repository
- Copy project template
- Write Project Brief
- Configure categories
- Create empty data files

**Output:** Ready-to-develop repository with empty data files.

---

### Phase 2: Framework Development

**Goal:** Establish the frontend system.

Tasks:
- Set up HTML page structure
- Configure CSS system (layout, sidebar, cards)
- Implement JavaScript rendering (loader, renderer, filter, sidebar, app)
- Implement Desktop Sidebar Navigation
- Implement Mobile Top Navigation (fixed, horizontal scrollable)
- Verify all pages render correctly on desktop and mobile

**Output:** Functional website framework with static placeholder content.

---

### Phase 3: Guide Layer & Homepage

**Goal:** Write the Essential Guide and build the homepage.

Tasks:
- Research essential city information (transport, weather, entry requirements, etc.)
- Write `content/essential-guide.md` in Markdown
- Ensure the homepage renders the Markdown correctly
- Verify responsive typography, tables, and images

**Output:** A complete homepage that serves as the city orientation page.

**Key decision:** The homepage IS the Essential Guide. It is NOT a navigation page.

---

### Phase 4: Content Production

**Goal:** Populate the structured database with curated place data.

Tasks:
- Research locations per category
- Convert research to JSON following the schema
- Validate schema compliance
- Review and refine content
- Add practical details (transport, hours, phone, ratings)

**Output:** Complete city guide with all categories populated.

See `docs/content-production-workflow.md` for the detailed SOP.

---

### Phase 5: Polish & Release

**Goal:** Refine content and user experience, then launch.

Tasks:
- Improve content quality
- Add missing data
- Optimize mobile experience
- Polish filtering and search
- Deploy to GitHub Pages
- Tag release version

**Output:** Production-ready live website.

---

## Two Content Layers

### Guide Layer

| Attribute | Detail |
|-----------|--------|
| Format | Markdown (`content/essential-guide.md`) |
| Purpose | City orientation, practical info at a glance |
| Audience | First-time visitors |
| Content | Transport, weather, entry, payment, emergency |
| Rendering | Homepage, inside white section cards |

### Structured Data Layer

| Attribute | Detail |
|-----------|--------|
| Format | JSON (`data/*.json`) |
| Purpose | Searchable database of places |
| Audience | Visitors looking for specific venues |
| Content | Restaurants, hotels, attractions, shops, cafes |
| Rendering | Category pages, filterable card grid |

**Rule:** Guide Layer is written first, then Structured Data is populated. The Guide gives context; the Data provides details.

---

## AI-Assisted Development Workflow

```
                 ┌─────────────────┐
                 │  Research        │
                 │  (Gemini / Human)│
                 └────────┬────────┘
                          │ Research notes
                          ▼
                 ┌─────────────────┐
                 │  Guide Layer     │
                 │  (Markdown)      │
                 └────────┬────────┘
                          │ essential-guide.md
                          ▼
                 ┌─────────────────┐
                 │  Data Processing │
                 │  (Claude Code)   │
                 └────────┬────────┘
                          │ JSON files
                          ▼
                 ┌─────────────────┐
                 │  Schema          │
                 │  Validation      │
                 └────────┬────────┘
                          │ Validated data
                          ▼
                 ┌─────────────────┐
                 │  Frontend Render │
                 │  (Browser)       │
                 └────────┬────────┘
                          │ Visual feedback
                          ▼
                 ┌─────────────────┐
                 │  Human Review    │
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
| `docs/ui-navigation-guideline.md` | UI architecture and navigation reference |

---

## Tool Assignments

| Tool | Role | Responsibility |
|------|------|---------------|
| **Gemini** | Research Layer | Location research, content summarization |
| **Claude Code** | Execution Layer | JSON generation, frontend dev, validation, documentation |
| **Browser** | QA Layer | Desktop + mobile visual verification |
| **Project Owner** | Decision Layer | Content approval, product decisions |

---

## Version Tagging Convention

```
v1.0  — Phase 1 complete (project init + structure)
v2.0  — Phase 2 complete (framework + UI)
v3.0  — Phase 2.5 complete (polish + schema refinement)
v3.1  — Phase 3 complete (Guide Layer + homepage redesign)
v4.0  — Phase 4 complete (full content production)
v5.0  — Phase 5 complete (polish + deploy)
```

---

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
ui-navigation-guideline.md
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

## Step 5 — Understand UI Navigation

Reference:

`ui-navigation-guideline.md`

Purpose:

- Understand the navigation system
- Desktop sidebar vs mobile top nav
- Homepage as Essential Guide
- Section cards and accordion behavior

---

## Step 6 — Produce Content

Reference:

`content-production-workflow.md`

Process:

```
Information Collection
↓
Essential Guide (Markdown)
↓
Structured Data (JSON)
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

## Step 7 — Maintain Content Quality

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

**Reuse:**
- Framework
- Workflow
- Schema
- UI System

**Customize:**
- City data
- Images
- Content strategy
- Local information
