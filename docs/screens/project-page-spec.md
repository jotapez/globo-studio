# Project Page Spec — Globo Studio

**Figma reference:** [`994-45176`](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=994-45176)
**Route:** `/work/[slug]`
**Status:** Ready to build

---

## Page Structure

The project page is a single scrollable page with a fixed navigation bar overlaid on top. There is no loading screen — navigation arrives directly from the homepage work cards.

```
<Nav variant="project" items={[…]} />   ← Fixed, z-index top, 3 items
<main>
  <div class="page-wrapper">            ← rounded-[80px], bg token, p-[32px]
    <ProjectIntro />                    ← Always first — heading + intro copy
    <ContentBlock … />                  ← Repeating content blocks (any order)
    <ContentBlock … />
    …
  </div>
</main>
<ContactFooter showClocks={false} />    ← Same component, clocks hidden
```

---

## Breakpoints

Matches the homepage breakpoints exactly.

| Name | Canvas | Content width | Side padding |
|------|--------|--------------|--------------|
| Mobile | 393px | 353px | 20px |
| Tablet | 1024px | 960px | 32px |
| Desktop | 1728px | 1664px | 32px |

---

## 1. Navigation (Project Variant)

**Component:** `<ProjectNav />` (wraps `<Nav variant="project" />`)
**Figma reference:** Nav instances within `994-45176`

### Layout
Identical pill-shaped bar, same spring animation, same fixed position, same visual style as the homepage nav. Two responsive variants are rendered and toggled by breakpoint.

#### Desktop (md+) — 5 items

```
[ Globo ]  [ Officeworks ]  [ Taronga Zoo ]  [ Open Insurance ]  [ Levo ]
                   ↑ active item highlighted (filled pill)
```

All five items are equal-width (`flex-1`). Each project item links to its `/work/[slug]` page. The active item (current project) has its click suppressed — you are already there.

| Property | Value |
|----------|-------|
| Width | 1664px |
| Height | 54px |
| Position | Fixed, y=32 from top |
| Padding X | 32px from viewport edge |
| Item count | 5 |

| Label | Target | Notes |
|-------|--------|-------|
| `Globo` | `/` | Navigates to homepage |
| `Officeworks` | `/work/officeworks` | Active when on this case study |
| `Taronga Zoo` | `/work/taronga-zoo` | Active when on this case study |
| `Open Insurance` | `/work/open-insurance` | Active when on this case study |
| `Levo` | `/work/levo` | Active when on this case study |

#### Mobile (<md) — 3 items (unchanged)

```
[ Globo ]  [ <Client Name> ]  [ Next project ]
                ↑ active (filled pill on load)
```

First and last items shrink to content width; the client name item fills the remaining space (`flex-1`).

| Property | Value |
|----------|-------|
| Width | 353px |
| Height | 48px |
| Position | Fixed, y=20 from top |
| Padding X | 20px from viewport edge |
| Item count | 3 |

| Label | Target | Notes |
|-------|--------|-------|
| `Globo` | `/` | Navigates to homepage |
| `[Client name]` | — | Active on load; label matches the case study (e.g. "Officeworks") |
| `Next project` | `/work/[next-slug]` | Cycles to the next case study in order |

### Implementation

`<ProjectNav>` renders two `<Nav variant="project">` instances wrapped in responsive `<div>` containers. The desktop instance is `hidden md:block`; the mobile instance is `md:hidden`. No JS-based viewport detection — pure CSS breakpoint toggle.

```tsx
// components/ui/ProjectNav.tsx
<>
  {/* Desktop: 5 items */}
  <div className="hidden md:block">
    <Nav variant="project" items={desktopItems} activeSection={activeSlug} … />
  </div>
  {/* Mobile: 3 items */}
  <div className="md:hidden">
    <Nav variant="project" items={mobileItems} activeSection="client" … />
  </div>
</>
```

**`ProjectNav` props:**

```tsx
interface ProjectNavProps {
  clientName: string;   // active item label (mobile) and match key (desktop)
  activeSlug: string;   // current project slug — sets activeSection on desktop
  nextHref: string;     // "Next project" href (mobile only)
  allProjects: Array<{ slug: string; clientName: string }>; // desktop nav items
  nextLabel?: string;   // override "Next project" label (default)
  disabled?: boolean;
  className?: string;
}
```

**Usage in `page.tsx`:**

```tsx
<ProjectNav
  clientName={project.clientName}
  activeSlug={project.slug}
  nextHref={`/work/${project.nextSlug}`}
  allProjects={getNavProjects()}  // from lib/projects.tsx
/>
```

### Entrance animation
Same as homepage: nav slides in from above (`y: -100% → y: 0`) on page load.
- Duration: 400ms, easing: `ease-out`

### Active pill animation
Same spring as homepage: `stiffness: 380, damping: 30`. On project pages, the active pill is always on the current project item and never moves during a session.

### Acceptance criteria
- Desktop: 5 equal-width items; active pill on the current project
- Desktop: clicking the active project item does nothing (no navigation)
- Desktop: all other project items navigate to their respective `/work/[slug]` pages
- Mobile: 3 items; Globo + active client name + Next project (unchanged behaviour)
- "Globo" navigates to `/` at all breakpoints (same tab)
- "Next project" (mobile) navigates to the next case study slug (same tab)
- All pill spring animations and hover effects are identical to homepage nav
- Adding a new project requires only a new entry in `lib/projects.tsx` — the nav updates automatically

---

## 2. Page Wrapper

**Figma node:** `994-45176` (outer frame)

The entire page content (intro + all content blocks) lives inside a rounded wrapper that creates the inset "card" appearance.

```tsx
<div className="rounded-[80px] bg-[var(--bg-page)] flex flex-col gap-[56px] p-[32px] max-w-[var(--content-width-desktop)] mx-auto">
  …
</div>
```

| Property | Value |
|----------|-------|
| Background | `var(--bg-page)` — `#f8f8f7` light / dark-mode equivalent |
| Max width | `var(--content-width-desktop)` — 1664px; centred with `mx-auto` |
| Border radius | `rounded-[80px]` |
| Padding | `p-[32px]` (desktop) |
| Gap between blocks | `gap-[56px]` |
| Layout | `flex flex-col` |

**Token note:** The page wrapper uses the same `--bg-page` token as the homepage background. No new token is needed here.

---

## 3. Project Details Section

The project details section is composed of one fixed intro block (always first) followed by any number of repeating content layout blocks in any order, with caption text blocks interspersed between them. The exact sequence is determined per case study.

---

### 3a. Intro Block

**Figma reference:** Intro frame within `994-45176`
**Component:** `<ProjectIntro />`

Always the first block inside the page wrapper. A two-column, 50/50 split layout.

```
┌──────────────────────────┬──────────────────────────┐
│  [Mixed serif/sans       │  [Intro body copy]        │
│   heading — 2 lines]     │  20px / 28px line-height  │
│                          │  Helvetica Neue            │
└──────────────────────────┴──────────────────────────┘
```

| Property | Value |
|----------|-------|
| Layout | `flex gap-[32px]` (two equal columns) |
| Padding | `pt-[24px] px-[24px]` |
| Column widths | 50% / 50% |

#### Left column — Heading

Mixed typography: key nouns in **Instrument Serif** (serif), supporting/modifier words in **Helvetica Neue** (sans). The heading is rendered as a single `<h1>` with inline `<span>` elements to switch between faces.

| Property | Value |
|----------|-------|
| Font size | `64px` |
| Line height | `84px` |
| Color | `var(--text-primary)` |

**Format:** `"[Client] — [project tagline]"` — e.g. `"Officeworks — Building a B2B digital experience"`

**Example markup:**

```tsx
<h1>
  <span className="font-serif">Officeworks</span>
  <span className="font-sans"> — Building a </span>
  <span className="font-serif">B2B</span>
  <span className="font-sans"> digital experience</span>
</h1>
```

> The exact split of which words are serif vs. sans is defined per case study. The designer will annotate this in Figma.

#### Right column — Intro body

| Property | Value |
|----------|-------|
| Font | Helvetica Neue (sans) |
| Font size | `20px` |
| Line height | `28px` |
| Color | `var(--text-primary)` |

This is a short descriptive paragraph (2–4 sentences) summarising the project context and the designer's role.

#### Mobile / Tablet reflow
- Mobile: single column, heading first then body copy
- Tablet: single column or narrow two-column — confirm from Figma (TBD)

#### Acceptance criteria
- Heading serif/sans split renders correctly at all viewport sizes
- Body copy is never clipped or overflowing
- 50/50 split holds on desktop; columns stack gracefully on mobile

---

### 3b. Hero Image Layout

**Figma reference:** Hero image block within `994-45176`
**Component:** `<ContentBlock variant="hero" />`

A full-width composited image block — typically a mockup with iPad, MacBook, or phone devices, rotated and masked for visual impact.

```
┌────────────────────────────────────────────────────┐
│                                                    │
│        [Composited device mockup image]            │
│         (iPad + MacBook, masked, rotated)          │
│                                                    │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | None (image fills the block) |
| Padding | None |
| Border radius | `rounded-[56px]` |
| Image | `object-fit: cover`, fills container |
| Width | Full width of page wrapper |

---

### 3c. Single Image — White Card

**Figma reference:** Single image (white bg) block within `994-45176`
**Component:** `<ContentBlock variant="single-white" />`

Used for UI screenshots and interface mockups where a white/neutral background provides contrast.

```
┌────────────────────────────────────────────────────┐ ← rounded-[56px]
│                                                    │ ← bg: white
│    p-[48px]                                        │
│    ┌──────────────────────────────────────────┐    │
│    │         [Screenshot / UI image]          │    │
│    └──────────────────────────────────────────┘    │
│                                                    │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `var(--background/project-card)` — white / near-white |
| Padding | `p-[48px]` |
| Border radius | `rounded-[56px]` |
| Image | `object-fit: contain`, centered |

**Token:** `--bg-project-card` — `#ffffff` light / `#1a1a1a` dark. Added to `tokens.css`.

---

### 3d. Single Image — Project Color Background

**Figma reference:** Single image (colored bg) block within `994-45176`
**Component:** `<ContentBlock variant="single-color" />`

Used for design system documentation, illustrations, and UI images that pair with the project's brand color.

```
┌────────────────────────────────────────────────────┐ ← rounded-[56px]
│                                                    │ ← bg: project color
│    p-[40px]                                        │
│    ┌──────────────────────────────────────────┐    │
│    │      [Design system / illustration]      │    │
│    └──────────────────────────────────────────┘    │
│                                                    │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | Project brand color — passed as `color` prop on the component |
| Padding | `p-[40px]` desktop/tablet · `p-[16px]` mobile |
| Border radius | `rounded-[56px]` desktop/tablet · `rounded-[16px]` mobile |
| Image | `object-fit: contain`, centered |

**Token:** `--bg-project-ow: #e0e2e8` (Officeworks). Added to `tokens.css` under `PROJECT COLORS`.

Add further project tokens to the same section as each case study is built:
`--bg-project-[slug]: <color>` — no dark-mode override needed (brand colors are always fixed).

**Component:** `<SingleImageColorBackground />` — pass color via the `color` prop:

```tsx
<SingleImageColorBackground
  src="/projects/officeworks/design-system.png"
  alt="Officeworks design system component library overview"
  color="var(--bg-project-ow)"
  aspectRatio="3614/4096"
/>
```

**Key differences from `SingleImageWhiteCard`:**
- Background = project brand color (prop), not `--bg-project-card` semantic token
- Padding = `40px` desktop/tablet (not 48px)
- Mobile border radius = `16px` = `--radius-block-mobile` (not `24px` = `--radius-card-mobile`)
- `aspectRatio` is a required prop (varies per project image)

---

### 3e. Full-Bleed Image Layout

**Figma reference:** Full-bleed image block within `994-45176` (nodes `994:45203` desktop / `1057:1296` tablet / `994:45255` mobile)
**Component:** `<FullBleedImageLayout />`

Similar to `SingleImageColorBackground` but the image fills the entire card with no padding — typically a full-screen UI screenshot. The card IS the image container (no inner wrapper).

```
┌────────────────────────────────────────────────────┐ ← rounded-[56px] desktop/tablet
│  [Full-bleed UI screenshot — fills entire block]   │ ← rounded-[16px] mobile
│                                                    │
│                                                    │
└────────────────────────────────────────────────────┘
```

| Property | Desktop / Tablet | Mobile |
|----------|-----------------|--------|
| Background | Project brand color — passed as `color` prop | same |
| Padding | None | None |
| Border radius | `56px` (`--radius-block`) | `16px` (`--radius-block-mobile`) |
| Image fit | `object-cover` | `object-cover` |

**Background:** Project brand color — passed as `color` prop (same approach as `SingleImageColorBackground`).
Token `--bg-project-ow` (already in `tokens.css`) covers the Officeworks case study.
Add further project tokens to the `PROJECT COLORS` section of `tokens.css` as each case study is built.

The distinction from `HeroImageLayout` is that this block has a brand color background beneath the image (visible if the image has transparent areas or leaves any gap at the card edges), whereas hero has no background. Unlike `HeroImageLayout`, a single `aspectRatio` prop covers all breakpoints — no responsive ratio change.

**Component:** `<FullBleedImageLayout />` — pass color via the `color` prop:

```tsx
<FullBleedImageLayout
  src="/projects/officeworks/catalogue-intro.png"
  alt="Custom catalogues feature introduction screen"
  color="var(--bg-project-ow)"
  aspectRatio="4096/2808"
/>
```

**Key differences from `SingleImageColorBackground`:**
- No padding — image is full-bleed, card IS the image container
- Image uses `object-cover` (not `object-contain`) — fills every pixel
- Border radius identical: `--radius-block` desktop/tablet, `--radius-block-mobile` mobile

**Key differences from `HeroImageLayout`:**
- Has a background color (brand tint shows if image leaves gaps); hero has no background
- No responsive aspect ratio change — one `aspectRatio` prop covers all breakpoints

---

### 3f. Two-Image Layout

**Figma reference:** Two-image block within `994-45176`
**Component:** `<ContentBlock variant="two-image" />`

Side-by-side equal columns, each with the project color background.

```
┌──────────────────────────┐  ┌──────────────────────────┐
│                          │  │                          │
│    [Image A]             │  │    [Image B]             │
│    bg: project color     │  │    bg: project color     │
│    rounded-[56px]        │  │    rounded-[56px]        │
│                          │  │                          │
└──────────────────────────┘  └──────────────────────────┘
            ↑ 50%                          ↑ 50%
                    gap-[32px]
```

| Property | Value |
|----------|-------|
| Layout | `flex gap-[32px]` (two equal columns) |
| Each column background | `var(--bg-project-card)` (project color) |
| Each column border radius | `rounded-[56px]` |
| Padding on each column | None (image is full-bleed within column) |
| Image | `object-fit: cover`, 100% width and height |
| Container | No outer background; each column has its own bg |

**Mobile reflow:** Stack vertically — both images full width, `gap-[32px]` between them.

---

### 3g. Caption Text

**Figma reference:** Caption text instances within `994-45176`
**Component:** `<CaptionText alignment="left | right | center | space-between" />`

Short descriptive labels that appear between content blocks. Four alignment variants exist.

```
Container: full width, px-[16px]
Text node:  w-[627px], 16px / 24px, var(--text-muted), Helvetica Neue
```

| Variant | CSS | Use |
|---------|-----|-----|
| `left` | `flex justify-start` | Label for the block above, left-reading default |
| `right` | `flex justify-end` | Label right-aligned for visual balance |
| `center` | `flex justify-center` | Centered standalone descriptor |
| `space-between` | `flex justify-between` | Two captions — one left, one right |

| Property | Value |
|----------|-------|
| Container padding | `px-[16px]` |
| Text width | `w-[627px]` (single caption); for `space-between`, each caption is `w-[627px]` |
| Font | Helvetica Neue (sans) |
| Font size | `16px` |
| Line height | `24px` |
| Color | `var(--text-muted)` — `#686868` |

**Example markup (space-between):**

```tsx
<CaptionText alignment="space-between">
  <span>Design system components overview</span>
  <span>Officeworks B2B — 2024</span>
</CaptionText>
```

**Mobile:** `w-[627px]` becomes `w-full`; `space-between` stacks vertically (`flex-col gap-[8px]`).

---

## 4. Contact Footer (No Clocks, No Viewport Fill)

**Component:** `<ContactFooter showClocks={false} className="min-h-0" />`
**Figma reference:** Contact footer within `994-45176`

The same `<ContactFooter />` component used on the homepage, but with two differences:
- The clocks row is hidden (`showClocks={false}`)
- The section does **not** fill the viewport height — it sizes to its content (`className="min-h-0"` overrides the default `min-h-svh` via twMerge)

All other content is unchanged: contact links, footer bar (logo, copyright, tagline, built-with label).

This applies at all breakpoints (mobile, tablet, desktop).

### Layout (no clocks, content height)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Get in touch          Stalk me                  │  ← contact links row (unchanged)
│  hello@globo.studio    LinkedIn                  │
│  04 3252 0578          OnlyMe                    │
│                                                  │
│  ← no clock row →                                │
│                                                  │
│  [Logo]  © Globo Studio 2026    Built with ♥     │  ← footer bar (unchanged)
│  Designer person born in Chile. Based in Sydney  │
│                                                  │
└──────────────────────────────────────────────────┘
  ↑ height = content only, no viewport stretch
```

### Usage

```tsx
<ContactFooter showClocks={false} className="min-h-0" />
```

### Acceptance criteria
- Clock row is completely absent — no empty space where it would have been
- Footer does not stretch to fill the viewport at any breakpoint
- Contact links, footer bar, and all links work identically to the homepage contact section
- External links open in new tab with `rel="noopener noreferrer"`

---

## 5. Components Summary

| Component | File | Key props (new or changed) |
|-----------|------|---------------------------|
| `<Nav />` | `components/ui/Nav.tsx` | Add `variant?: 'home' \| 'project'`, `items?: NavItem[]` |
| `<ContactFooter />` | `components/ui/ContactFooter.tsx` | Add `showClocks?: boolean` (default: `true`) |
| `<ProjectIntro />` | `components/ui/ProjectIntro.tsx` *(new)* | `heading: ReactNode`, `body: string` |
| `<ContentBlock />` | `components/ui/ContentBlock.tsx` *(new)* | `variant: 'hero' \| 'single-white' \| 'single-color' \| 'full-bleed' \| 'two-image'`, `image: string \| [string, string]`, `alt: string \| [string, string]` |
| `<CaptionText />` | `components/ui/CaptionText.tsx` *(new)* | `alignment: 'left' \| 'right' \| 'center' \| 'space-between'`, `children: ReactNode` |

### Route

A new Next.js dynamic route is needed:

| File | Purpose |
|------|---------|
| `app/work/[slug]/page.tsx` | Project page — fetches case study data by `slug`, renders layout |
| `app/work/[slug]/layout.tsx` | (Optional) Can use root layout — no special layout needed |
| `lib/projects.ts` | Case study data (title, slug, color token, intro, content blocks) |

---

## 6. Scroll & Animation Summary

| Element | Trigger | Animation | Duration |
|---------|---------|-----------|----------|
| Nav entrance | Page load | Slide down from top (`y: -100% → 0`) | 400ms |
| Page wrapper | Page load | Fade in (`opacity: 0 → 1`) | 400ms |
| Intro block | Page load / scroll into view | Slide up + fade (`y: 20px → 0, opacity: 0 → 1`) | 500ms |
| Content blocks | Scroll into view | Slide up + fade (`y: 30px → 0, opacity: 0 → 1`) | 500ms, `once: true` |
| Caption text | Scroll into view | Fade in (`opacity: 0 → 1`) | 300ms, `once: true` |

**Global rule:** All scroll-triggered animations use `once: true`.
**Reduced motion:** When `prefers-reduced-motion: reduce` is set, replace all transitions with instant opacity changes only.

---

## 7. Open Questions

1. What is the complete ordered list of case study slugs? (Needed to implement "Next project" cycling.)
2. For each case study: what is the exact serif/sans split in the heading? (Designer to annotate in Figma per project.)
3. What is the `--bg-project-card-[slug]` color for each case study beyond Officeworks? (Confirmed for OW: `#e0e2e8`.)
4. What is the mobile/tablet layout for the intro block — single column stack, or narrow two-column? (Confirm from Figma.)
5. Should caption text `w-[627px]` be a fixed pixel width at all viewport sizes, or switch to a percentage/max-width on mobile/tablet?
6. Does the page wrapper `rounded-[80px]` / `p-[32px]` persist on mobile, or does it collapse to `rounded-none` / `p-[20px]`?
7. Is there a page entrance transition when navigating from a work card on the homepage (e.g. a shared-element or crossfade)?

---

## 8. iOS Status Bar

**Rule:** Each project page sets `<meta name="theme-color">` to `project.bgColor`
so the iOS Safari status bar matches the outer page background.

**Implementation:** `themeColor: project.bgColor` in `generateMetadata()` inside
`app/work/[slug]/page.tsx`. No additional token or CSS change required — the value
comes from the existing `bgColor` field on the `Project` type in `lib/projects.tsx`.

**Scope:** Project pages only. The homepage and other routes do not set this tag.
