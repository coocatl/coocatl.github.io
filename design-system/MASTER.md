# Portfolio design-system master

This file is the only cross-page design source of truth. Direction prototypes may explore different primitive values, but they must preserve these semantic roles and behavioral rules.

## Design intent

- Audience: design-conscious clients, collaborators, and recruiters.
- Product: an image-led portfolio, not a landing page or SaaS interface.
- Redesign mode: visual overhaul with route, content type, media capability, and information-architecture preservation.
- Static-first rule: every page must remain complete when animation is disabled.
- Images are evidence and narrative, not decoration.

## Token layers

### Primitive roles

- Canvas neutrals: one stable page family per direction.
- Ink scale: primary, secondary, quiet, reverse.
- Project colors: sampled from project media, never invented as generic theme labels.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 144.
- Type scale: caption, meta, body, lead, section, display.
- Radius scale: sharp 0-2px or soft 12-18px; a direction must choose one rule.
- Motion scale: fast, UI, focus, page.

### Semantic roles

- `canvas`, `canvas-raised`, `ink`, `ink-muted`, `line`, `accent`, `project-atmosphere`.
- `space-page-x`, `space-section-y`, `space-cluster`, `space-caption`.
- `type-display`, `type-section`, `type-body`, `type-meta`.
- `duration-fast`, `duration-ui`, `duration-focus`, `duration-page`.
- `ease-ui`, `ease-editorial`, `ease-page`.

### Component roles

- Header: compact, single line on desktop, clear active state, no locale/time decoration.
- Project card: visual, title, category/year, explicit idle/hover/focus/active/selected/transitioning states.
- Media: explicit intrinsic ratio, purpose-specific crop, descriptive alt, error state.
- Text action: semantic link for navigation and button for actions, visible focus, minimum 44px touch target where possible.

## Typography

- Maximum two type families in a selected direction.
- Display type earns scale through composition; it cannot repeat one oversized italic formula on every page.
- Body lines target 45-70 characters.
- Chinese fallback must be explicitly defined after the direction is selected.
- Prototype font samples use system-available faces only; production fonts require license and self-hosting review.

## Color area

- Stable neutral canvas: 55-75% of a static frame.
- Project media and project-derived atmosphere: 20-40%.
- Accent: no more than 10%, and generally sampled from the active image.
- No decorative purple glow, glass layer, or unrelated gradient ball.
- Contrast targets: 4.5:1 for body text, 3:1 for large text and component boundaries.

## Image behavior

- Card, hero, and detail sources are distinct roles even when derived from one project shoot.
- Above-fold image reserves dimensions and may use high fetch priority.
- Below-fold images use lazy loading and async decoding.
- Mobile may use a different crop or source rather than `object-fit` alone.
- No generated SVG cover template may stand in for final project media.

## Project-card state model

1. Idle: all projects legible; no arbitrary dimming.
2. Hover or keyboard focus: current project advances by controlled scale/offset; neighbors retreat according to spatial relation.
3. Active: press feedback without losing focus visibility.
4. Selected: title/media relationship prepares the detail transition.
5. Transitioning: input locked only for the transition window; route remains recoverable.
6. Reduced motion: direct navigation with no invisible initial state.

## Motion tokens for later implementation

- Fast: 140-180ms.
- UI: 240-320ms.
- Focus: 420-600ms.
- Page: 700-1000ms.
- UI ease: cubic-bezier(0.2, 0.7, 0.2, 1).
- Editorial ease: cubic-bezier(0.16, 1, 0.3, 1).
- Page ease: GSAP `power3.inOut` or a verified CustomEase.

Only transform and opacity may animate by default. Flip must use `Flip.getState`, state change, then `Flip.from`, with React-scoped cleanup and reduced-motion gating.

## Responsive and accessibility rules

- Required review sizes: 360x800, 390x844, 768x1024, 1366x768, 1440x900, 1920x1080.
- Mobile is recomposed into a clear reading order; it is not a scaled desktop canvas.
- One `h1` per page, semantic landmarks, skip link in production, visible focus, intrinsic image dimensions, route title/focus restoration.
- No interaction may depend exclusively on hover.

## Deliberate direction risks

- A: a near-full-bleed atmospheric image could obscure navigation; solve with disciplined contrast zones rather than a scrim everywhere.
- B: publication restraint could become nostalgic or passive; solve with strong cropping and one contemporary color interruption.
- C: a relational project rail could become a UI carousel; solve by keeping image scale and editorial rhythm primary.
