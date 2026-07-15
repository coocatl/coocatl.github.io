# Portfolio Visual Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the failed visual layer of the supplied clean-room portfolio while preserving its verified routing, data, media, and deployment foundations, with user selection at the static-direction gate before full implementation.

**Architecture:** Keep the supplied React/Vite project as the sole source of truth. Establish one documented design system, create three deliberately distinct static HTML/CSS direction prototypes outside the production route tree, then apply only the selected direction to the shared production components and delete superseded visual code.

**Tech Stack:** React 18, TypeScript, Vite, React Router, GSAP, CSS, Playwright/Chrome QA.

---

## Phase A — Required visual gates before production implementation

### Task 1: Establish the baseline

**Files:**
- Create: `audit/before/console-log.txt`
- Create: `CURRENT_VISUAL_FAILURES.md`

- [ ] Run `npm ci`, then `npm run build`, and record the exact results.
- [ ] Start the current production preview without modifying source.
- [ ] Capture home desktop/mobile, projects, project detail, and profile screenshots in `audit/before/`.
- [ ] Record console warnings and errors in `audit/before/console-log.txt`.
- [ ] Write a concise element-by-element critique in `CURRENT_VISUAL_FAILURES.md`, tied to screenshot evidence.

### Task 2: Document skill and reference usage

**Files:**
- Create: `SKILL_APPLICATION_MATRIX.md`
- Create: `reference/REFERENCE_EVIDENCE.md`

- [ ] Record which mandatory skills were available locally and which official sources were consulted remotely.
- [ ] For each skill, document adopted rules, rejected defaults, reason, and verification method.
- [ ] Capture only verifiable public reference evidence for FED and Interface Craft; label unavailable or ambiguous evidence `UNVERIFIED`.
- [ ] Reuse Aleksi Lab only as an engineering and restraint precedent; do not import its project content.

### Task 3: Establish the design-system source of truth

**Files:**
- Create: `design-system/MASTER.md`
- Create: `design-system/pages/home.md`
- Create: `design-system/pages/projects.md`
- Create: `design-system/pages/project-detail.md`
- Create: `design-system/pages/profile.md`

- [ ] Define canvas, typography roles, spacing, image behavior, color-area rules, card states, motion tokens, focus states, and reduced-motion requirements in `MASTER.md`.
- [ ] Keep page documents limited to genuine page-specific composition differences.
- [ ] Document the deliberate design risk for each candidate direction.

### Task 4: Produce three static visual directions

**Files:**
- Create: `visual-directions/shared/direction-shell.css`
- Create: `visual-directions/direction-a/index.html`
- Create: `visual-directions/direction-a/styles.css`
- Create: `visual-directions/direction-b/index.html`
- Create: `visual-directions/direction-b/styles.css`
- Create: `visual-directions/direction-c/index.html`
- Create: `visual-directions/direction-c/styles.css`
- Create: `visual-directions/README.md`

- [ ] Build Direction A as a dark, project-color atmospheric stage whose depth comes from media and layering rather than decorative WebGL.
- [ ] Build Direction B as a warm editorial-paper composition with strong image/text baselines and no 3D decoration.
- [ ] Build Direction C as a restrained studio hybrid with project-color atmosphere, relational browsing, and one justified experimental device.
- [ ] Ensure the three directions differ in composition, type hierarchy, image behavior, and spatial logic—not only palette.
- [ ] Provide static sections for home, projects idle/focus, detail hero, profile upper page, typography specimen, and color-area specimen.
- [ ] Implement desktop and mobile layouts inside each prototype.

### Task 5: Verify and present the visual gate

**Files:**
- Create: `visual-review/round-1/notes.md`
- Create: `visual-review/round-1/console.txt`
- Create: screenshots for every required direction/state in `visual-review/round-1/`.

- [ ] Serve the static prototypes and capture 1440x900 and 390x844 evidence in Chrome.
- [ ] Capture projects idle/focus, detail hero, profile upper page, type specimen, and color specimen for each direction.
- [ ] Check overflow, headings, focus visibility, console output, and reduced-motion behavior.
- [ ] Compare all three directions against baseline and verified references in `notes.md`.
- [ ] Stop and ask the user to select A, B, C, or a precise combination. Do not modify production visual components before selection.

## Phase B — Execute only after the user selects a direction

### Task 6: Replace the production visual foundation

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Modify: `src/styles/reset.css`
- Create: `src/styles/typography.css`
- Create: `src/styles/motion.css`

- [ ] Translate the selected static direction into shared tokens and typography.
- [ ] Remove duplicate and legacy visual rules instead of appending override files.
- [ ] Add verified local font files and licenses only when licensing permits redistribution.

### Task 7: Rebuild shared production compositions

**Files:**
- Replace: `src/components/ProjectStage.tsx`
- Replace: `src/pages/ProjectsPage.tsx`
- Replace: `src/pages/ProjectPage.tsx`
- Replace: `src/pages/ProfilePage.tsx`
- Modify shared component-local styles under `src/styles/`.

- [ ] Implement static home, projects, detail hero, and profile compositions first.
- [ ] Verify static screenshots with animation disabled before adding interaction.
- [ ] Preserve data contracts, media types, routes, 404, and print behavior.

### Task 8: Implement relational interaction and motion

**Files:**
- Create or modify one shared project-card component.
- Create or modify one GSAP transition module with React cleanup.

- [ ] Add explicit idle, hover, keyboard focus, active, selected, and transitioning card states.
- [ ] Implement GSAP Flip only after the static states pass visual review.
- [ ] Keep routing functional without motion and provide a complete reduced-motion path.
- [ ] Omit Three.js unless a measured, content-related case passes the brief's conditions.

### Task 9: Complete responsive, accessibility, performance, and media integration

**Files:**
- Modify component-local responsive styles.
- Modify media components only where evidence shows a defect.
- Create: `PERFORMANCE_REPORT.md`
- Create: `ACCESSIBILITY_REVIEW.md`

- [ ] Test the six required viewports, 200% text zoom, keyboard navigation, touch targets, route focus restoration, print CV, and media fallbacks.
- [ ] Measure LCP, CLS, first-screen image bytes, JavaScript bytes, and font bytes before and after.
- [ ] Use route/component splitting only when measurements justify it.

### Task 10: Remove superseded code and perform final verification

**Files:**
- Delete failed shader, random primitive, obsolete stage, responsive patch, and generated demo SVG implementations after references are removed.
- Create: `TEST_RESULTS.md`

- [ ] Search for dead imports, duplicate selectors, `nth-child` art direction, `!important`, versioned filenames, and unused dependencies.
- [ ] Run fresh `npm ci`, formatting, lint, typecheck, content validation, tests, build, dependency audit, and production-browser QA.
- [ ] Capture final visual evidence and compare it with baseline and the selected static direction.
- [ ] Package one clean source ZIP without `node_modules`, temporary screenshots, or system caches.

## Self-review

- The plan preserves one project and one production source of truth.
- Gate 2 produces three compositionally distinct directions and Gate 3 blocks production implementation until user selection.
- Required baseline, evidence, design-system, browser, accessibility, performance, cleanup, and packaging outputs are represented.
- No alternative production implementation, V2 component, CSS override layer, or unverified reference claim is permitted.
