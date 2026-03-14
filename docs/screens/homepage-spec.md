# Homepage Spec — Globo Studio

**Figma reference:** [`994-43399`](https://www.figma.com/design/To3gWngqoD9aoBsteRxvoT/globostudio?node-id=994-43399)
**Route:** `/`
**Status:** Ready to build

---

## Page Structure

The homepage is a single scrollable page with 5 sections and a fixed navigation bar overlaid on top.

```
<LoadingScreen />           ← Covers full viewport, plays once on first load
<Nav />                     ← Fixed, z-index top, always visible
<main>
  <section id="hero" />     ← 100vh, shader image + "Studio" SVG
  <section id="intro" />    ← 100vh, big intro text + client carousel
  <section id="work" />     ← Work cards grid + credits interlude
  <section id="about" />    ← Designer photo + bio
  <section id="contact" />  ← Contact links + 4 live clocks + footer
</main>
```

---

## Breakpoints

| Name | Canvas | Content width | Side padding |
|------|--------|--------------|--------------|
| Mobile | 393px | 353px | 20px |
| Tablet | 1024px | 960px | 32px |
| Desktop | 1728px | 1664px | 32px |

---

## 1. Loading Screen

**Component:** `<LoadingScreen />`

### Behaviour
- Covers the full viewport on initial page load (not on navigation between pages)
- Plays a reveal/fade animation, then exits to reveal the homepage
- Does not render on subsequent visits within the same session (use `sessionStorage` flag)

### Animation sequence
1. Screen starts as full black (or background colour) overlay
2. A brief logo reveal or text animation plays (duration: ~1.2s)
3. Overlay slides up or fades out, revealing the page underneath (duration: ~0.6s)
4. Once dismissed, hero section entrance animations begin

### Acceptance criteria
- Loading screen must complete before the hero is interactive
- Must respect `prefers-reduced-motion`: skip animation, show content immediately
- Total duration must not exceed 2s

---

## 2. Navigation Bar

**Component:** `<Nav />`
**Figma instances:** `home-nav-desktop` (1664×54), `home-nav-mobile` (353×48)

### Layout
The nav is a **pill-shaped bar** centered horizontally, fixed at the top of the viewport.

```
[ globo ] [ work ] [ about ] [ contact ]
     ↑
  Active pill (filled background slides to selected item)
```

| Property | Desktop | Mobile |
|----------|---------|--------|
| Width | 1664px | 353px |
| Height | 54px | 48px |
| Position | Fixed, y=32 from top | Fixed, y=20 from top |
| Padding X | 32px from viewport edge | 20px from viewport edge |

### Items
| Label | Anchor target | Default active |
|-------|--------------|----------------|
| globo | `#hero` | Yes (on load) |
| work | `#work` | — |
| about | `#about` | — |
| contact | `#contact` | — |

### Entrance animation
- On page load (after loading screen exits): nav slides in from above (`y: -100% → y: 0`)
- Duration: 400ms, easing: `ease-out`

### Active pill animation
- A filled pill indicator moves between items using Framer Motion `layoutId`
- When a user **clicks** an item: pill slides to that item, page scroll-anchors to the section
- When a user **scrolls**: active item updates automatically as sections enter the viewport (use `IntersectionObserver` with ~20% threshold)
- Transition: spring, `stiffness: 300, damping: 30`

### Case study pages
- Nav adapts to show different items when on a `/work/[slug]` page (spec TBD in case study spec)

### Acceptance criteria
- Active pill must never jump — always animates between positions
- Nav must remain legible over all section backgrounds (solid background via `--bg-nav` token)
- On mobile, nav items may collapse to icons or abbreviate — maintain all 4 links

---

## 3. Hero Section

**Section ID:** `#hero`
**Figma frame:** `Hero` inside `Frame 48095981`

### Purpose
Full-viewport first impression. Displays the "Globo" shader image with the "Studio" SVG wordmark overlaid, plus the year and "Portfolio" label.

### Layout

```
┌─────────────────────────────────────────────┐  100vh
│                                             │
│          [ shader image ]                   │  vertically + horizontally centred
│          [ "Studio" SVG ]  ← overlaid       │  positioned at bottom-right of image
│                                             │
└─────────────────────────────────────────────┘
  2026                              Portfolio   ← below image, row
```

### Shader image
- Source: `Screenshot 2026-02-24 at 12.44.31 pm` (the blurred globe/lens image)
- Must scale proportionally and remain centred in all viewport sizes
- Use `object-fit: contain` within a centred container that respects viewport dimensions

| Breakpoint | Image size in Figma | Container offset |
|-----------|-------------------|-----------------|
| Desktop | 1094×712 | 285px from left (centred in 1664) |
| Tablet | 760×495 | 100px from left (centred in 960) |
| Mobile | 338×220 | 27.5px from left (centred in 393) |

**Implementation note:** Use a `vw`/`vh`-based scaling approach so the entire hero element (image + SVG) scales proportionally. The image aspect ratio is approximately **1.536:1** (1094÷712). Maintain this ratio at all sizes.

### "Studio" SVG wordmark
- SVG file, overlaid on the bottom-right area of the shader image
- Must scale with the image (use `position: absolute` within the image container, sized as a percentage of image width)
- Desktop: approximately 47% of image width (514 / 1094 ≈ 0.47)

### "2026" / "Portfolio" labels
- Rendered below the hero image (not overlaid)
- `2026` — left-aligned, same left edge as content
- `Portfolio` — right-aligned, same right edge as content
- Font size: 42px on desktop, scales down on mobile
- These two labels sit in a flex row with `justify-content: space-between`

### Entrance animation
- After the loading screen exits, the hero image fades in with a subtle scale-up: `scale: 0.98 → 1, opacity: 0 → 1`
- Duration: 600ms, delay: 100ms after loading screen completes

### Dark mode toggle interaction
Clicking the shader image **or** the "Studio" SVG wordmark toggles the page between light and dark mode.

- **Trigger:** `onClick` on either the shader `<img>` container or the `<Studio />` SVG element
- **Transition:** Soft crossfade — apply/remove the `.dark` class on `<html>` with a CSS transition on `background-color` and `color` (duration: `400ms`, easing: `ease-in-out`)
- **State persistence:** Store the user's preference in `localStorage` (`key: 'gs-theme'`) so it survives page refresh
- **Initial state:** Read `localStorage` on mount; fall back to `prefers-color-scheme` system preference
- **Cursor:** `cursor: pointer` on both clickable elements; add a subtle `title` tooltip: `"Toggle dark mode"`
- **Interaction with scroll-triggered dark mode (§5):** The click-toggle and scroll-triggered dark mode share the same theme state. When the user scrolls down to the about section, the page always switches to the **opposite** of whatever theme is active at that moment — whether it was set manually or by default. See §5 for full logic.

#### Implementation note
Use a React context (`ThemeContext`) or a lightweight state atom to hold `'light' | 'dark'`. All sections that change appearance based on theme consume this value. Do not rely solely on CSS `prefers-color-scheme` for runtime toggling — the `.dark` class approach on `<html>` is already used by Storybook and `tokens.css`.

### Acceptance criteria
- Hero must always fill exactly 100vh regardless of device
- The shader image and Studio SVG must never overflow the viewport horizontally
- On viewport resize, the layout re-centres without a flash of incorrect layout
- No vertical scrollbar introduced by hero on any viewport
- Clicking shader or Studio SVG toggles dark/light mode with a 400ms crossfade
- Theme preference persists across page refreshes via `localStorage`
- On first visit with no stored preference, system `prefers-color-scheme` is respected

---

## 4. Intro / Heading + Carousel Section

**Section ID:** `#intro`
**Figma frame:** `Intro` (desktop: 1266×551, tablet: 960×635, mobile: 353×571)

### Purpose
Introduces the studio with a single large paragraph and a scrolling client logo carousel below it.

### Layout

```
┌─────────────────────────────────────────────┐  ~100vh (vertically centred content)
│                                             │
│   G'day. Globo is an AI native design       │
│   studio orchestrated by                   │
│   [Juan Pablo Castro], a Product            │  ← hover triggers photo pop-up
│   Designer crafting experiences and        │
│   systems globally.                         │
│                                             │
│   ╔═════════════════════╗                   │
│   ║  [logo][logo][logo] ║ →→→ (looping)    │  ← client carousel
│   ╚═════════════════════╝                   │
│                                             │
└─────────────────────────────────────────────┘
```

The text block + carousel should be **vertically centred** within the section (which fills the viewport height).

### Intro text
**Full copy:**
> G'day. Globo is an AI native design studio orchestrated by Juan Pablo Castro, a Product Designer crafting experiences and systems globally.

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Container width | 1266px | 960px | 353px |
| Left offset | 199px | 0px | 0px |
| Font | Display/heading typeface (from Figma tokens) | same | same |
| Font size | Large (confirm from Figma) | Scales down | Scales down |

### Designer name hover interaction
- The text "Juan Pablo Castro" is interactive (no underline by default)
- **On hover (desktop only):** a circular photo of Juan Pablo Castro appears near/over the name
  - Placeholder: rounded image, 80×80px, `border-radius: 50%`
  - Animation: `scale: 0.8, opacity: 0 → scale: 1, opacity: 1`, duration 200ms
  - Position: floats slightly above or beside the name; follow cursor or anchor to name
  - On mouse leave: reverses the animation out

### Client carousel
**Figma component:** `clients-caroussel` (desktop: 800×52, clipped by a mask)

- Displays **17 client logos** in a horizontal strip
- The strip loops infinitely from right to left (CSS animation or Framer Motion)
- The carousel is **masked/clipped** — logos outside the visible window are hidden
- No pause-on-hover required for MVP

| Property | Desktop / Tablet | Mobile |
|----------|-----------------|--------|
| Track height (`--carousel-height`) | `64px` | `48px` |
| Logo height (`--carousel-logo-h`) | `64px` | `48px` |
| Gap between logos (`--carousel-logo-gap`) | `56px` | `32px` |
| One full-track cycle | `50s` | `50s` |
| Visible width | 800px (desktop/tablet) | full width – padding |
| Gap from intro heading to carousel | `136px` | `72px` |

**Logo list (17 items, placeholder images for now):**
1–17: Use placeholder rectangles or actual logo images when available. Names visible in Figma layer panel (screenshots of logos 1–17).

### Scroll entrance animation
- Intro text fades in and slides up on scroll: `y: 30px → 0, opacity: 0 → 1`
- Use Framer Motion `useInView` with `once: true`
- Stagger: text block first, carousel 200ms later

### Acceptance criteria
- Carousel must loop seamlessly with no visible gap or jump at the loop point
- Designer photo hover must not cause layout shift
- Section must be vertically centred at all viewport heights
- Carousel must not overflow the page horizontally (overflow: hidden on the container)

---

## 5. Work Section

**Section ID:** `#work`
**Figma frames:** `Frame 48095978` + `Frame 48095974` with interlude text between them

### Layout structure

The work section has 4 main case-study cards, an interlude text band, and 2 personal project cards below it:

```
[ card 1 ]  [ card 2 ]   ← Row A  (main case studies)
[ card 3 ]  [ card 4 ]   ← Row B  (main case studies)

   "Designed and built with the help of the
    globo crew – Claude code, Cursor,
    Figma Make, Lovable and Paper"

[ personal 1 ]  [ personal 2 ]   ← Row C  (personal projects — open external URL in new tab)
```

There are no "Coming Soon" placeholders. All 6 card slots are populated at launch.

### Project card

**Component:** `<ProjectCard />`
**Figma instances:** `project-card-desktop` (816×810), `project-card-mobile` (353×455)

#### Card anatomy
```
┌──────────────────────────────┐  ↑
│                              │  │  image area — scales with viewport height
│         [image]              │  │  height: calc(100vh - var(--card-text-area-h))
│                              │  ↓  object-fit: cover; width: 100%
├──────────────────────────────┤  ← fixed-height text area
│  Project Title               │
│  Short description           │
└──────────────────────────────┘
```

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Card width | 816px | 464px | 353px |
| Card height | `100vh` | `100vh` | `100vh` |
| Image height | `calc(100vh - var(--card-text-area-h))` | `calc(100vh - var(--card-text-area-h))` | `calc(100svh - var(--card-text-area-h))` |
| Text area height (`--card-text-area-h`) | Fixed — confirm from Figma | Fixed — confirm from Figma | Fixed — confirm from Figma |
| Gap between cards | 32px | 32px | 48px |
| Columns | 2 | 2 | 1 |

**Viewport-height scaling — goal:**
The entire card — image, title, and description — must always be **fully visible within one viewport height**, with no scrolling required to see any part of it. The card is `100vh` tall; the image is the flexible element that absorbs viewport height variation. The text (title + description) is always fully rendered and never clipped.

**How it works:**
- Card root = `100vh` (desktop/tablet) / `100svh` (mobile — accounts for dynamic browser chrome)
- Text area = `flex-shrink: 0` at its natural/fixed height; always fully visible
- Image area = `flex: 1; min-height: var(--card-image-min-h)` — grows or shrinks to fill the remaining height
- `object-fit: cover; width: 100%` on the `<img>` tag so it fills its container proportionally at any height

**CSS variables (confirm values from Figma per breakpoint):**

| Variable | Purpose | Derived from |
|----------|---------|-------------|
| `--card-text-area-h` | Fixed height of title + description block | Figma `project-card` layer |
| `--card-image-min-h` | Minimum image height before it stops shrinking | ~40% of reference card height |

- On very short viewports (below `--card-image-min-h + --card-text-area-h`), the card is allowed to grow beyond `100vh` to prevent content loss — but this should not occur on any standard device.

**Implementation note:** Card root: `display: flex; flex-direction: column; height: 100vh` (mobile: `100svh`). Image wrapper: `flex: 1; min-height: var(--card-image-min-h); overflow: hidden`. Text wrapper: `flex-shrink: 0`.

#### Hover interaction (desktop/tablet)
Triggered when the user hovers anywhere on the card:

1. **Image shape transform:** image morphs from rectangle to **circle**
   - `border-radius: 0% → 50%`, duration: 400ms, easing: `cubic-bezier(0.4, 0, 0.2, 1)`
   - Image scales slightly to maintain visual weight (`scale: 1 → 1.05`)
2. **Title underline:** project title gets a text underline
   - Use CSS `text-decoration-color` with opacity transition, duration: 200ms
3. On mouse leave: both effects reverse

#### Click behaviour — main case study cards (Row A + B)
- Clicking anywhere on the card navigates to `/work/[slug]` (same tab)
- The entire card is wrapped in a `<Link>` or has an `onClick` handler
- Cursor: `pointer` on hover

#### Click behaviour — personal project cards (Row C)
- Clicking anywhere on the card opens an external URL in a **new tab**
- Use `<a href={url} target="_blank" rel="noopener noreferrer">`
- Cursor: `pointer` on hover
- Same hover effects (image→circle morph, title underline) apply
- Add a small external-link indicator icon (decorative, `aria-hidden="true"`) in the card corner to signal it opens externally

### Interlude text band
**Copy:** *"Designed and built with the help of the globo crew – Claude code, Cursor, Figma Make, Lovable and Paper"*

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Width | 1271px centred | 960px | 353px |
| Left offset | 196.5px | 0px | 0px |
| Font size | Large display | Scales | Scales |
| Alignment | Left | Left | Left |

### Scroll-triggered dark mode transition

When the user scrolls into the **about section** (`#about`), the page transitions softly to the **opposite** of the currently active theme — regardless of whether that theme was set manually via the hero click (§3) or by default. Scrolling back above that threshold restores the theme that was active before the transition.

#### Logic
```
themeBeforeAbout = null   // captured at the moment about section first enters view

// Fires when the TOP sentinel of #about enters the viewport (user scrolled down into about)
onAboutTopEntersViewport():
  if themeBeforeAbout === null:         // only trigger once per downward pass
    themeBeforeAbout = currentTheme
    setTheme(opposite(currentTheme))    // light→dark  OR  dark→light

// Fires when the TOP sentinel of #about exits the viewport upward
// (user has fully scrolled back above the about section)
onAboutTopExitsViewportUpward():
  if themeBeforeAbout !== null:
    setTheme(themeBeforeAbout)
    themeBeforeAbout = null
```

**Key distinction:** The theme restores **only when the top of `#about` leaves the viewport upward** — meaning the user has scrolled completely back above the section. Scrolling up from the contact section while still inside `#about` does **not** trigger a theme change. The theme stays inverted for the entire time any part of `#about` is visible or below.

**Implementation:** Place a zero-height sentinel `<div>` at the very top of `#about`. Use `IntersectionObserver` on it:
- `isIntersecting: true` → top of about entered viewport (scrolling down) → call `onAboutTopEntersViewport()`
- `isIntersecting: false` AND `entry.boundingClientRect.top < 0` → sentinel exited upward → call `onAboutTopExitsViewportUpward()`
- `isIntersecting: false` AND `entry.boundingClientRect.top > 0` → sentinel is below viewport (page load / not yet reached) → do nothing

**Examples:**
- Default (light) → scrolls down to about → **dark**; scrolls down to contact → stays dark; scrolls up into about → stays dark; scrolls above about → **back to light**
- Manually toggled to dark → scrolls to about → **light**; scrolls back above about → **back to dark**

- **Transition:** Same 400ms `ease-in-out` CSS crossfade as the hero click toggle
- **Mobile:** Same behaviour applies

### Scroll entrance animations
- Each card row fades and slides up on scroll: `y: 40px → 0, opacity: 0 → 1`
- Cards in a row stagger by 150ms (left card first, then right card)
- Interlude text fades in after Row B is fully in view
- Row C (personal projects) fades and slides up after the interlude text, staggered 150ms

### Acceptance criteria
- Image-to-circle transition must be smooth at 60fps
- The full card content — image, title, and description — must be simultaneously visible within one viewport height at all breakpoints, with no scrolling required
- Card image scales proportionally to fill remaining height after the text area (`object-fit: cover`); text area is never clipped or hidden
- On mobile, cards are full-width single column with 48px gap; each card fills the viewport individually
- Scrolling into the about section triggers a 400ms crossfade that inverts the current theme; theme stays inverted while anywhere in or below `#about`; restores only when the user scrolls fully back above `#about`
- Row C cards open external URLs in a new tab with `rel="noopener noreferrer"`
- All 6 card slots are populated — no placeholder or "Coming Soon" cards

---

## 6. About Section

**Section ID:** `#about`
**Figma frame:** `About` (desktop: 1664×1214)

### Layout

**Desktop:**
```
[ Bio text: heading + long copy ]  |  [ Photo + name + title ]
         816px wide                         533px wide (offset 1131px)
```

**Tablet:**
```
            [ Photo + name + title ]  ← right column (464px)
[ Bio heading ]
[ Bio text ]
```

**Mobile:**
```
[ Photo ]         ← full width (353×380)
[ Name / Title ]
[ Heading ]
[ Bio text ]
```

### Content

**Heading:** "Rewriting the process right now"

**Bio text (full):**
> I specialise in crafting human-centred experiences and scalable design systems that bring brands to life across products, services, and digital platforms. As a Lead Product Designer at Levo, a leading technology consultancy, I've delivered impactful digital experiences for major clients. I led the Officeworks B2B Digital Experience program, guiding product design from discovery to delivery while establishing their foundational design system and coaching designers on systematic workflows. I also led the product experience design for Taronga Zoo's new website.
>
> Previously at Open Insurance, I drove product design for car and home insurance products from strategy to delivery, while building and governing their design system.
>
> When I'm not designing, you'll find me in sunny Clovelly running, playing guitar, or daydreaming by the water. I'm always up for a coffee, chat, freelance projects, and new opportunities. Please say hello—or hola! :)

### Photo
- Source: `Portrait-3` image asset
- Desktop: 533×574px, rounded corners (from Figma: `rounded-rectangle`)
- Tablet: 464×500px
- Mobile: 353×380px, full width

**Below photo:**
- Name: "Juan Pablo Castro" — 24px
- Title: "Senior Product Designer" — 24px

### Desktop column gap
- Left text column: x=0, width=816
- Right photo column: x=1131, width=533
- Gap between them: 1131 − 816 = 315px (approx)

### Scroll entrance animation
- Photo slides in from right: `x: 60px → 0, opacity: 0 → 1`
- Text slides in from left: `x: -40px → 0, opacity: 0 → 1`
- Both triggered on `useInView`, stagger 150ms apart

### Acceptance criteria
- Bio text must be readable at all breakpoints (min font size: 16px)
- Photo must maintain aspect ratio and never crop awkwardly
- On tablet, the layout reflows gracefully (photo on top-right, text below)

---

## 7. Contact Section

**Section ID:** `#contact`
**Figma frame:** `Contact footer` (desktop: 1664×834)

### Viewport height
The contact section fills the full viewport height, matching the behaviour of the Hero (§3) and Intro (§4) sections.

- `min-height: 100vh` on the section root
- Internal content is **vertically centred** within the available height using flexbox (`flex-direction: column; justify-content: center`)
- On very short viewports (< 600px tall) the section can grow beyond `100vh` to avoid content overlap — use `min-height: 100svh` (small viewport height) for mobile to account for dynamic browser chrome

### Layout
```
┌──────────────────────────────────────────────────┐  100vh (min)
│                                                  │
│  Get in touch          Stalk me                  │  ← contact links row
│  hello@globo.studio    LinkedIn                  │
│  04 3252 0578          OnlyMe                    │
│                                                  │
│  [Clock: Sydney]  [Clock: Santiago]  [Clock: London]  [Clock: NYC]  │
│                                                  │
│  [Logo]  © Globo Studio 2026    Built with ♥ and good vibes (coding)  │
│  Designer person born in Chile. Based in Sydney, NSW  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Contact links

| Group | Label | Link |
|-------|-------|------|
| Get in touch | `hello@globo.studio` | `mailto:hello@globo.studio` |
| Get in touch | `04 3252 0578` | `tel:0432520578` |
| Stalk me | `LinkedIn` | External URL (TBD) |
| Stalk me | `OnlyMe` | External URL (TBD) |

- Layout: 2-column grid (left: email/phone, right: LinkedIn/OnlyMe) on desktop and tablet
- On mobile: stacked, left column first then right column

### Clock component

**Component:** `<Clock />`
**Figma instances:** `clock` (desktop: 392×444, tablet: 216×268, mobile: 148×184)

| Property | Value |
|----------|-------|
| Count | 4 clocks |
| Display | Analogue clock face (SVG/canvas) |
| Update | Real-time, updates every second |
| Format | Hours and minutes hands, no numerals required (minimal style) |

**Suggested timezones:**
| Clock | City | Timezone |
|-------|------|----------|
| 1 | Sydney | `Australia/Sydney` |
| 2 | Santiago | `America/Santiago` |
| 3 | London | `Europe/London` |
| 4 | New York | `America/New_York` |

> Confirm timezone selections with designer — these are inferred from the context (born in Chile, based in Sydney, global clients).

#### Clock implementation
- Use `Intl.DateTimeFormat` or `date-fns-tz` for timezone-aware time
- Render clock hands as SVG `<line>` or `<rect>` elements rotated via CSS transforms
- Hour hand, minute hand, second hand (optional — confirm with design)
- Update via `setInterval` every 1000ms, cleared on component unmount

#### Clock layout
- Desktop: 4 clocks in a row, each 392px wide with 32px gap (4×392 + 3×32 = 1664 ✓)
- Tablet: 4 clocks in a row, each 216px wide with 32px gap (4×216 + 3×32 = 960 ✓)
- Mobile: 2×2 grid, each 148px wide with 57px gap (2×148 + 57 = 353 ✓)

### Footer bar

| Element | Content |
|---------|---------|
| Logo | Globo logo SVG (86×56 desktop, 48×31 mobile) |
| Copyright | © Globo Studio 2026 |
| Tagline | Designer person born in Chile. Based in Sydney, NSW |
| Right label | Built with ♥ and good vibes (coding) |

- Desktop/tablet: logo + text left, right label right-aligned
- Mobile: logo centred, text below stacked, right label on its own line

### Acceptance criteria
- Clocks must show accurate real-time for each timezone, including DST adjustments
- Email and phone must be clickable (`mailto:` / `tel:`)
- External links must open in a new tab with `rel="noopener noreferrer"`
- Clocks must be accessible: include an `aria-label` with the city name and current time

---

## 8. Components Summary

| Component | Used in | Key props |
|-----------|---------|-----------|
| `<LoadingScreen />` | Page root | `onComplete: () => void` |
| `<Nav />` | Layout | `activeSection: string`, `variant: 'home' \| 'case-study'` |
| `<ProjectCard />` | Work section | `title`, `description`, `image`, `slug`, `href?`, `external?: boolean` |
| `<Clock />` | Contact section | `timezone: string`, `city: string` |
| `<ClientCarousel />` | Intro section | `logos: Logo[]` |
| `<DesignerPhoto />` | Intro section (hover) | `src`, `alt` — shown on hover over name |
| `<ThemeProvider />` | App root | `defaultTheme?: 'light' \| 'dark'` — wraps entire page, exposes `useTheme()` |

---

## 9. Scroll & Animation Summary

| Element | Trigger | Animation | Duration |
|---------|---------|-----------|----------|
| LoadingScreen exit | Page load | Fade/slide out | 600ms |
| Nav entrance | After loading screen | Slide down from top | 400ms |
| Hero image | After loading screen | Fade in + scale 0.98→1 | 600ms |
| **Dark mode toggle** | **Click shader or Studio SVG** | **CSS crossfade (bg + color tokens)** | **400ms** |
| Intro text | Scroll into view | Slide up + fade in | 500ms |
| Client carousel | Always | Infinite horizontal loop | 40s |
| Designer photo | Hover on name | Scale + fade in | 200ms |
| Project card hover | Mouse enter | Image→circle, title underline | 400ms |
| Project card rows A+B | Scroll into view | Staggered slide up + fade | 500ms |
| **Dark mode (scroll)** | **About section enters viewport** | **CSS crossfade — inverts current theme** | **400ms** |
| Interlude text | Scroll into view | Fade in | 500ms |
| Project card row C | Scroll into view | Staggered slide up + fade | 500ms |
| About (photo) | Scroll into view | Slide in from right | 500ms |
| About (text) | Scroll into view | Slide in from left | 500ms |
| Contact section | Scroll into view | Fade in | 400ms |

**Global rule:** All scroll-triggered animations use `once: true` (replay only on full page refresh).
**Reduced motion:** When `prefers-reduced-motion: reduce` is set, replace all transitions with instant opacity changes only.
**Theme state:** Managed via a shared `ThemeContext`. The `.dark` class on `<html>` drives all token overrides (see `tokens.css`). Both the hero click and the scroll trigger write to this context.

---

## 10. Open Questions

1. What are the 4 case study slugs/titles to use for the work cards (Row A + B)?
2. What timezone cities should the 4 clocks display? (Assumed: Sydney, Santiago, London, New York)
3. ~~Should the 2 extra card slots (Row C) be "Coming Soon" or hidden at launch?~~ **Resolved:** Row C holds 2 personal projects that open external URLs in a new tab. No "Coming Soon" cards.
4. What font is used for the display headings? (To confirm from Figma design tokens)
5. Does the clock show seconds, or only hour and minute hands?
6. What is the LinkedIn and OnlyMe URL?
7. What are the titles, descriptions, and external URLs for the 2 personal projects (Row C)?
8. Should the scroll-triggered dark mode also fire on mobile, or is it desktop/tablet only?
