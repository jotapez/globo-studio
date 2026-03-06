# PRD: Globo Studio — Portfolio Website

**Author:** Juan Pablo Castro
**Status:** Draft v1.0
**Last Updated:** 2026-03-06
**Timeline:** MVP in 1–2 weeks → Full launch within 3 months

---

## 1. Executive Summary

### Problem Statement
The senior product design job market is highly competitive. Without a polished, memorable online presence, qualified designers get filtered out before their work is even seen by hiring decision-makers.

### Proposed Solution
Build a minimalistic, responsive, and animated portfolio website (Globo Studio) that showcases 4 case studies and communicates Juan Pablo Castro's identity as a Product Designer. The site must load fast, feel premium, and be fully deployed on Vercel within 1–2 weeks.

### Success Criteria

| KPI | Target |
|-----|--------|
| Job offer secured | ≥ 1 within 3 months of launch |
| Recruiter-initiated contact | ≥ 3 per month via email/LinkedIn |
| Lighthouse Performance score | ≥ 90 on mobile |
| Lighthouse Accessibility score | 100 |
| Core Web Vitals – LCP | < 2.5s on 4G |
| Avg. session duration | > 2 min (measured via Vercel Analytics or Plausible) |

---

## 2. User Experience & Functionality

### User Personas

**Persona 1 — The Design Recruiter**
- Works at a staffing agency or in-house HR team
- Screens 30–50 portfolios per week
- Needs: fast load, clear role/title, scannable work samples
- Pain point: sites that are slow, hard to navigate, or don't show the depth of work

**Persona 2 — The Head of Design**
- Senior IC or manager evaluating a potential hire
- Reads case studies in detail to assess design thinking and process
- Needs: clear problem framing, documented process, outcomes
- Pain point: case studies with no context or measurable results

---

### User Stories & Acceptance Criteria

#### Story 1 — Homepage Navigation
> As a recruiter, I want to jump to any section of the homepage instantly so I can assess the designer without excessive scrolling.

**AC:**
- A fixed pill-shaped navigation bar is visible at all times on scroll
- The nav contains exactly 4 anchor links (e.g., Work, About, Process, Contact)
- Active link state updates as the user scrolls past each section
- Nav adapts/transforms on case study pages (different link set)
- Nav is functional and visually present on mobile, tablet, and desktop

#### Story 2 — First Impression (Hero Section)
> As a recruiter, I want to immediately understand who this designer is and what they do within 5 seconds of landing.

**AC:**
- Hero section displays logo, name, and a one-line role descriptor above the fold on all viewports
- Hero layout adapts to viewport height (no fixed pixel heights)
- The page completes a loading animation before the hero content is interactive
- Loading animation does not block perceived performance — skeleton or reveal-based

#### Story 3 — Case Study Discovery
> As a hiring manager, I want to browse the available case studies from the homepage so I can decide which ones to read.

**AC:**
- Homepage displays all 4 case studies as cards with title, brief description, and a preview image
- Each card links to its respective case study page
- Cards that are TBD/WIP show a "Coming Soon" state (not broken links or 404s)
- Grid layout responds across breakpoints per Figma spec (node `994-43399`)

#### Story 4 — Case Study Deep Dive
> As a hiring manager, I want to read a full case study with context, process, and outcomes so I can evaluate the designer's thinking.

**AC:**
- Each case study page uses a shared template (node `994-45176`)
- The template supports: hero image, problem statement, process sections, outcome metrics, and image galleries
- Background color and hero images are unique per case study (4 distinct themes)
- Page includes a back-navigation element to return to the homepage

#### Story 5 — Contact
> As a recruiter, I want to find the designer's contact info without hunting for it so I can reach out immediately.

**AC:**
- Email and LinkedIn are visible on the homepage (per Figma: `hello@globo.studio`, LinkedIn, phone)
- Links are clickable (`mailto:` and external URL)
- Contact info is present on case study pages or in the footer

---

### Page Map

| Page | Route | Status |
|------|-------|--------|
| Homepage | `/` | In design (Figma complete) |
| Case Study 1 | `/work/[slug]` | Content ready |
| Case Study 2 | `/work/[slug]` | Content ready |
| Case Study 3 | `/work/[slug]` | Placeholder |
| Case Study 4 | `/work/[slug]` | Placeholder |

---

### Non-Goals (Out of Scope)

- **Contact form** — Direct email/LinkedIn links are sufficient for MVP
- **Multi-language support** — English only
- **Blog or writing section** — Not part of this brief
- **CMS integration** — Content is static; no admin panel needed
- **Authentication or user accounts**
- **Search functionality**

---

## 3. Technical Specifications

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 (App Router, static export) | SEO-friendly, fast static output, Vercel-native |
| Styling | Tailwind CSS v4 | Utility-first, minimal bundle, matches design precision |
| Typography | Google Fonts via `next/font` | Zero layout shift, self-hosted at build time |
| Animations | Framer Motion | Scroll-based reveals, pill nav animation, page transitions |
| Deployment | Vercel (free tier) | Zero-config, instant preview deploys, CDN |
| Analytics | Vercel Analytics (or Plausible) | Privacy-friendly session/duration tracking |

### Architecture Overview

```
/app
  layout.tsx          # Root layout: font loading, nav, metadata
  page.tsx            # Homepage (single-page, anchor sections)
  work/
    [slug]/
      page.tsx        # Dynamic case study page
/components
  Nav.tsx             # Animated pill navigation
  HeroSection.tsx     # Viewport-height adaptive hero
  CaseStudyCard.tsx   # Homepage work grid card
  CaseStudyTemplate.tsx # Shared case study layout
  LoadingScreen.tsx   # Animated loading/reveal
/data
  projects.ts         # Static data for all 4 case studies
/public
  images/             # Optimized assets per case study
```

### Responsive Breakpoints
Per Figma designs, the site must be tested and pixel-accurate at:

| Breakpoint | Target |
|-----------|--------|
| 375px | Mobile (primary) |
| 768px | Tablet |
| 1280px+ | Desktop |

### Animation Specifications

| Element | Animation | Library |
|---------|-----------|---------|
| Initial page load | Reveal/fade-in loading screen | Framer Motion |
| Scroll sections | Staggered content reveal on enter | Framer Motion (`useInView`) |
| Pill nav | Background/position transition on scroll | Framer Motion (`useScroll`) |
| Nav active state | Smooth indicator slide | Framer Motion `layoutId` |
| Page transitions | Fade between routes | Framer Motion `AnimatePresence` |

### Performance Requirements

- Images must use `next/image` with `priority` on hero images
- Static export (`output: 'export'`) — no server-side rendering at runtime
- No client-side JS loaded for non-interactive sections
- Font subsetting via `next/font` — only load character sets used

### SEO & Metadata

- Each page must have unique `<title>` and `<meta description>`
- Open Graph image defined for homepage and each case study
- `robots.txt` and `sitemap.xml` generated at build time

### Security & Privacy

- No user data collected beyond anonymized analytics
- No third-party tracking scripts (no GA unless privacy-configured)
- External links use `rel="noopener noreferrer"`
- No environment secrets needed for static export

---

## 4. Design Specifications

### Figma References

| Screen | Figma Node | Notes |
|--------|-----------|-------|
| Homepage | [`994-43399`](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=994-43399) | Desktop + mobile breakpoints defined |
| Case Study Template | [`994-45176`](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=994-45176) | Shared template, unique colors per project |

### Design Tokens (to be extracted from Figma)
- Typography: To be confirmed from Figma (appears to use a serif/display face for headings, sans-serif for body)
- Colors: Base palette + 4 unique case study accent colors
- Spacing: 8pt grid system (standard for Tailwind)

---

## 5. Risks & Roadmap

### Phased Rollout

**MVP (Week 1–2) — Launch-ready**
- [ ] Project scaffolding (Next.js 15, Tailwind v4, Framer Motion)
- [ ] Homepage with 2 real case studies + 2 "Coming Soon" placeholders
- [ ] Pill nav with scroll behavior
- [ ] Loading animation
- [ ] Case study template (populated for 2 studies)
- [ ] Deployed to Vercel with custom domain (`globo.studio`)
- [ ] Mobile-first responsive layout

**v1.1 (Week 3–4)**
- [ ] Remaining 2 case studies live (pending content)
- [ ] OG images and full SEO metadata
- [ ] Analytics integration
- [ ] Cross-browser QA (Safari, Firefox, Chrome)

**v2.0 (Month 2–3)**
- [ ] Performance audit and Lighthouse score optimization
- [ ] Accessibility audit (target: 100 Lighthouse score)
- [ ] Potential motion preferences (`prefers-reduced-motion`) support

---

### Technical Risks

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Framer Motion bundle size impacts LCP | Medium | Use dynamic imports, only load on client where needed |
| Case study content (2 TBD) delays launch | High | Launch with "Coming Soon" cards; don't block MVP |
| Tailwind v4 API changes breaking DX | Low | Pin version in `package.json`, review changelog |
| Custom font causing layout shift | Low | Use `next/font` with `display: swap` and size adjustments |

---

## Open Questions

1. What are the slugs/titles for all 4 case studies? (needed to set up routes and static data)
2. What is the target custom domain? (`globo.studio`?)
3. Should the 2 placeholder case studies be hidden or shown as "Coming Soon" on launch?
4. Are there any specific transition/animation references (e.g., sites you like the feel of)?
