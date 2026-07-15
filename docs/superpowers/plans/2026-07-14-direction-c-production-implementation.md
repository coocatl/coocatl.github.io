# Direction C Production Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the failed production visual layer with the user-selected Direction C Hybrid Studio while preserving the existing React routes, content validation, media capabilities, 404 behavior, and print path.

**Architecture:** Keep the supplied Vite/React project as the only production source. Move project-specific composition values into typed project data, render them through shared home/card/detail components, use one GSAP lifecycle for entrance and one GSAP Flip lifecycle for the relational project field, and remove the previous shader/object visual system after its imports are gone.

**Tech Stack:** React 18, TypeScript, React Router 6, GSAP 3 with Flip, CSS, Playwright Core, Vite 8.

---

### Task 1: Prepare licensed type and project media

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `public/demo/hybrid-studio/*`
- Modify: `src/main.tsx`

- [ ] **Step 1:** Install `@fontsource-variable/archivo` and `@fontsource-variable/newsreader`; verify both packages include OFL license files.
- [ ] **Step 2:** Copy the four selected original cover images and four generated alternate detail images into `public/demo/hybrid-studio/` with descriptive stable filenames.
- [ ] **Step 3:** Import only the required variable-font CSS entrypoints in `src/main.tsx`.
- [ ] **Step 4:** Run `npm run typecheck`; expected result is exit code 0.

### Task 2: Make the content model drive composition

**Files:**
- Modify: `src/types/content.ts`
- Replace: `src/data/projects.ts`
- Modify: `src/data/profile.ts`
- Modify: `src/config.ts`
- Modify: `scripts/validate-content.mjs`

- [ ] **Step 1:** Add typed `card` composition data (`x`, `rotation`, `ratio`, `objectPosition`) and explicit `statement`, `context`, `contribution`, and `outcome` fields to `Project`.
- [ ] **Step 2:** Replace the four same-template projects with Afterimage, Field Notes, Blue Interval, and Balance Study, using the selected/generated raster media and project-derived colors.
- [ ] **Step 3:** Replace synthetic company/award/profile claims with clearly labeled demonstration practice copy and no invented metrics.
- [ ] **Step 4:** Extend content validation to verify cover/frame existence and required narrative fields.
- [ ] **Step 5:** Run `npm run validate`; expected result is `Validated 4 projects.`

### Task 3: Replace the global visual foundation

**Files:**
- Replace: `src/styles/tokens.css`
- Replace: `src/styles/reset.css`
- Replace: `src/styles/global.css`
- Create: `src/components/RouteEffects.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1:** Define the Direction C neutral canvas, charcoal ink, cobalt/coral signals, Archivo/Newsreader typography, spacing, focus, and motion tokens.
- [ ] **Step 2:** Add semantic reset rules, skip-link styles, minimum touch targets, visible focus, selection, and reduced-motion primitives.
- [ ] **Step 3:** Add route title updates, top-of-page restoration, and main-content focus restoration in `RouteEffects`.
- [ ] **Step 4:** Mount the skip link and `RouteEffects` once in `App.tsx` without changing the route map.
- [ ] **Step 5:** Run `npm run lint && npm run typecheck`; expected result is exit code 0.

### Task 4: Implement the home project stage without WebGL

**Files:**
- Replace: `src/components/ProjectStage.tsx`
- Replace: `src/styles/stage.css`
- Modify: `src/components/SiteHeader.tsx`

- [ ] **Step 1:** Render the selected Direction C composition: practice identity, one active project, single arch aperture, project ticket, edge metadata, and direct project/work/profile links.
- [ ] **Step 2:** Implement previous/next buttons, arrow-key selection, number-key selection, touch swipe, and direct navigation without wheel hijacking.
- [ ] **Step 3:** Use one scoped GSAP timeline for active-project copy/media changes; gate it behind `prefers-reduced-motion` and clean it up on every selection.
- [ ] **Step 4:** Keep every content element visible in the CSS-only and reduced-motion state.
- [ ] **Step 5:** Run `npm run lint && npm run typecheck`; expected result is exit code 0.

### Task 5: Implement the relational project field with GSAP Flip

**Files:**
- Create: `src/components/ProjectCard.tsx`
- Replace: `src/pages/ProjectsPage.tsx`
- Replace: `src/styles/projects.css`

- [ ] **Step 1:** Render all cards through one `ProjectCard`, with ratios, positions, rotations, and crops taken from typed data rather than `nth-child` selectors.
- [ ] **Step 2:** Implement explicit idle, hovered/focused, active, selected, and transitioning state attributes.
- [ ] **Step 3:** Capture `Flip.getState` before focus-state changes, then run `Flip.from` after React commits; scope and kill animation on unmount.
- [ ] **Step 4:** Disable Flip for reduced motion and coarse-pointer mobile layouts while retaining direct links and visible focus.
- [ ] **Step 5:** Run `rg -n "nth-child|!important" src`; expected result contains no art-direction selectors or overrides.

### Task 6: Rebuild detail, media, profile, and print composition

**Files:**
- Replace: `src/pages/ProjectPage.tsx`
- Replace: `src/styles/project.css`
- Replace: `src/pages/ProfilePage.tsx`
- Replace: `src/styles/profile.css`
- Modify: `src/components/MediaSupport.tsx`

- [ ] **Step 1:** Build the Direction C project hero with a project-derived color field, clipped full-resolution detail image, metadata, and narrative sections.
- [ ] **Step 2:** Preserve video, PDF, PPTX, lazy media, download, and missing-file behavior while removing decorative pill/card styling.
- [ ] **Step 3:** Build the profile as one studio-world composition with an honest project-material image instead of a CSS portrait and a linear practice history instead of bubbles.
- [ ] **Step 4:** Preserve print profile output with navigation, project atmosphere, and interactive actions removed.
- [ ] **Step 5:** Run `npm run validate && npm run typecheck`; expected result is exit code 0.

### Task 7: Remove the failed visual implementation and unused dependencies

**Files:**
- Delete: `src/components/ShaderBackground.tsx`
- Delete: `src/components/ProjectObject.tsx`
- Delete: `src/components/AnimatedTitle.tsx`
- Delete: `src/styles/responsive.css`
- Modify: `src/styles/index.css`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1:** Search and remove every import/reference to the shader, random primitives, animated character-title formula, old responsive patch, and Three.js types.
- [ ] **Step 2:** Remove `three` and `@types/three` after source references reach zero.
- [ ] **Step 3:** Keep responsive rules colocated with each page stylesheet and import one stylesheet per responsibility.
- [ ] **Step 4:** Run `npm ci` and `npm run qa`; expected result is exit code 0 with four validated projects.

### Task 8: Browser, accessibility, performance, and final packaging proof

**Files:**
- Create: `scripts/qa-production.mjs`
- Create: `visual-review/round-2/*`
- Create: `ACCESSIBILITY_REVIEW.md`
- Create: `PERFORMANCE_REPORT.md`
- Create: `TEST_RESULTS.md`
- Create: `outputs/fed-cleanroom-hybrid-studio-source.zip`

- [ ] **Step 1:** Capture home, projects idle/focus, detail hero, and profile at 360x800, 390x844, 768x1024, 1366x768, 1440x900, and 1920x1080.
- [ ] **Step 2:** Test click, keyboard, touch, refresh, browser back, 404, reduced motion, print, image loading, console, and horizontal overflow in Playwright.
- [ ] **Step 3:** Record DOM-based accessibility checks and file/route/line evidence in `ACCESSIBILITY_REVIEW.md`.
- [ ] **Step 4:** Measure built asset bytes, first-screen raster bytes, LCP, CLS, and interaction timing; record before/after evidence in `PERFORMANCE_REPORT.md` without speculative optimization.
- [ ] **Step 5:** Run fresh `npm ci`, `npm run qa`, and production-browser QA; record exact output in `TEST_RESULTS.md`.
- [ ] **Step 6:** Package source without `node_modules`, `dist`, QA browser profiles, or temporary files; verify the ZIP listing and hash.

## Self-review

- The plan implements the user-selected C composition rather than producing a fourth direction.
- The existing route and media contracts remain; composition is data-driven and project-specific.
- Three.js is removed because the selected direction's memorable device is achieved by real project media and CSS clipping.
- Static composition precedes motion, and reduced motion remains a complete layout.
- Final completion requires fresh build plus real browser evidence, not screenshots alone.
