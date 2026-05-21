# Fintagic Web

Marketing single-page site for **Fintagic** — accounting and fractional CFO for direct-to-consumer brands.

## Stack

- [Vite 6](https://vitejs.dev/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [Framer Motion](https://www.framer.com/motion/) for reveals, transitions, marquees, springs, and the interactive confetti field
- [GSAP](https://gsap.com/) + [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) for the scroll-pinned hero box-roll and the capabilities carousel

## Scripts

```bash
npm install      # install dependencies
npm run dev      # start the Vite dev server (http://localhost:5173)
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
```

## Project layout

```
public/                  static assets served as-is
  fintagic-logo.png      brand wordmark
  cards/                 illustrations used in the Capabilities carousel
  why/                   illustrations used in the Why Us bento
  tools/                 tool/integration logos for the marquee strip

src/
  App.tsx                page composition (Navbar + sections + Footer)
  index.css              Tailwind + theme tokens (colors, fonts) + fallback font metrics
  main.tsx               React entry
  components/
    Navbar.tsx           pill nav with collapsing logo/contact on scroll
    Hero.tsx             scroll-driven 3D box-roll (GSAP ScrollTrigger)
    Capabilities.tsx     scroll-driven looping arc carousel (GSAP) with 3D tilt cards
    WhyUs.tsx            "Not your average" — diagonal bento with clip-path reveal
    Clients.tsx          "Company we keep" — animated headline + tool logo marquee
    Stats.tsx            "Work that moves the numbers" — bento grid with corner-clip reveal
    Verticals.tsx        radial hex diagram of DTC verticals
    CaseStudies.tsx      slide carousel of work
    Credentials.tsx      animated headline + seal-style certification badges
    FinalCTA.tsx         "Ready for clean books?" + dodging "No" button + DOM-based confetti
    Footer.tsx           slim copyright / legal / socials row
    CapabilityArt.tsx    isometric 3D vector illustrations for the carousel cards
    Reveal.tsx           shared on-scroll fade-up wrapper
    SectionHeading.tsx   shared section heading primitive
  data/
    site.ts              copy + data for every section (capabilities, values, stats, tools, etc.)
```

## Notes

- Theme tokens (brand colors, display/sans fonts) are declared in `src/index.css` under `@theme` and consumed throughout as Tailwind utilities (`bg-green`, `text-ink`, `font-display`, etc.).
- Webfonts (Urbanist + Inter) are loaded from Google Fonts with metric-adjusted local fallbacks declared in `src/index.css` to avoid layout shift on the heading text.
- `prefers-reduced-motion` is respected globally via the CSS reset and individually inside the "No" button dodge.
