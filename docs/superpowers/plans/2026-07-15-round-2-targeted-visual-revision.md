# Li Jiaying Portfolio Round 2 Targeted Visual Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Round 2 visual and delivery fixes to the existing Li Jiaying portfolio without changing its seven-project content model or GitHub Pages architecture.

**Architecture:** Extend the existing `ProjectMedia` model with stage-fit metadata, render the existing four featured projects through the current `ProjectStage`, and revise the existing profile, card, gallery, validation, and Playwright paths in place. Keep all URLs base-safe through React Router and `assetUrl`, copy the supplied DOCX unchanged, and package only verified source plus Round 2 QA evidence.

**Tech Stack:** React 18, TypeScript, React Router, GSAP, Vite, CSS, Sharp, Playwright Core, GitHub Pages static route generation.

---

### Task 1: Extend project media semantics

**Files:**
- Modify: `src/types/content.ts`
- Modify: `src/data/projects.ts`

- [ ] Add `MediaFit`, `MediaFrame`, optional `fit`/`frame` fields, and optional `Project.stage`.
- [ ] Assign dedicated detail-sized stage media to TAILO and Kebike as `contain/presentation`, Speaking World as `contain/poster`, and Portrait Photography as `cover/photography`.
- [ ] Mark covers and gallery images with their appropriate presentation, poster, or photography frame without changing project copy or routing.
- [ ] Run `npm run typecheck`; expect exit code 0.

### Task 2: Recompose the existing home stage

**Files:**
- Modify: `src/components/ProjectStage.tsx`
- Modify: `src/styles/stage.css`

- [ ] Replace automatic headline wrapping with three block-level Chinese lines: `把内容从` / `创意推进` / `到真实落地。`.
- [ ] Replace `.stage-aperture` with `.stage-media`, render `project.stage`, and expose `data-fit`/`data-frame` attributes.
- [ ] Place the project ticket below the media in a shared media column so it cannot cover artwork.
- [ ] Tune desktop, short-viewport, tablet, and mobile typography and media sizing while preserving keyboard, touch, GSAP, and reduced-motion behavior.
- [ ] Run `npm run typecheck`; expect exit code 0.

### Task 3: Remove the web portrait and add real resume actions

**Files:**
- Modify: `src/config.ts`
- Modify: `src/data/profile.ts`
- Modify: `src/pages/ProfilePage.tsx`
- Modify: `src/styles/profile.css`
- Delete: `public/media/profile/portrait.webp`
- Delete: `public/files/README.txt`
- Create: `public/files/cv/li-jiaying-resume.docx`
- Modify: `scripts/optimize-media.mjs`
- Modify: `scripts/generate-static-routes.mjs`

- [ ] Copy `work/_inputs/简历（0713）.docx` byte-for-byte to the public CV path.
- [ ] Add `siteConfig.cv` and a base-safe `assetUrl` download action named `李佳颖个人简历.docx`.
- [ ] Change the profile headline to `策划、视觉与现场执行。`, remove the portrait field/figure, and rebuild the hero as two columns.
- [ ] Present download, email, and print as primary, secondary, and tertiary actions.
- [ ] Remove portrait generation and portrait SEO references while leaving the portrait inside the original DOCX unchanged.
- [ ] Run a hash comparison between source and public DOCX; expect identical SHA-256 values.

### Task 4: Differentiate media boundaries

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/components/ProjectCard.tsx`
- Modify: `src/styles/projects.css`
- Modify: `src/pages/ProjectPage.tsx`
- Modify: `src/styles/project.css`

- [ ] Add shared media-border and shadow tokens.
- [ ] Keep `ProjectCard` on a base-safe React Router `Link`, expose cover-frame metadata, and strengthen the card paper edge.
- [ ] Use contain/paper treatment for presentation boards, contain/subtle edge for posters, and crop-aware edge-only treatment for photography.
- [ ] Expose `data-presentation` and per-image `data-media-frame` in detail galleries while retaining Lightbox behavior.
- [ ] Review project-detail and next-project headline density for Chinese text without mechanically shrinking every heading.

### Task 5: Add validation and Round 2 browser acceptance

**Files:**
- Modify: `scripts/validate-content.mjs`
- Create: `scripts/qa-round-2.mjs`
- Modify: `package.json`
- Create: `visual-review/round-2/*` through Playwright execution

- [ ] Validate seven projects, 34 source records, 102 optimized media files, no public portrait, no README substitute, a real DOCX larger than 100 KB, and base-safe resume configuration.
- [ ] Capture all required desktop/mobile/stage/card/profile/gallery screenshots.
- [ ] Download the DOCX through local preview and simulated `/portfolio/` preview; verify HTTP 200, OOXML ZIP signature, source byte size/hash, filename, and non-HTML response.
- [ ] Record browser console output and fail on warnings, errors, broken images, crop violations, portrait regressions, missing boundaries, or Lightbox regressions.

### Task 6: Full regression and delivery

**Files:**
- Modify: `TEST_RESULTS.md`
- Create: `outputs/li-jiaying-portfolio-github-pages-round-2/li-jiaying-portfolio-github-pages-round-2.zip`

- [ ] Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run validate`, `npm run build`, local production preview QA, Round 2 QA, and `/portfolio/` subpath QA.
- [ ] Verify `/`, `/projects`, `/profile`, `/projects/tailo`, and `/projects/kebike` by direct navigation and refresh.
- [ ] Visually inspect the required screenshots at original size.
- [ ] Package source, the real DOCX, and Round 2 evidence while excluding `node_modules`, `dist`, original private inputs, and obsolete final-review artifacts.
- [ ] Audit the ZIP for required files, zero forbidden directories, the exact DOCX hash, and the expected media count; report the final SHA-256.

## Self-review

- Spec coverage: all five confirmed problems, related GitHub Pages fixes, required screenshots, resume-download validation, and final reporting fields map to Tasks 1–6.
- Placeholder scan: no TBD/TODO steps or parallel replacement components/styles are proposed.
- Type consistency: `ProjectMedia.fit/frame` and `Project.stage` are defined once and consumed by stage, card, and gallery renderers.
