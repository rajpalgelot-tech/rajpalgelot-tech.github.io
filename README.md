# Rajpal Gelot Portfolio

A dark, single-page developer portfolio in the monochrome "system terminal"
style: boot screen, pill navigation, live system clock, marquee ticker,
draggable ID badge, tech stack grid, flip-card project carousel with domain
filters, contact section, and a giant wordmark footer.

Built with **TypeScript + Vite, zero runtime dependencies**. Every line of
content lives in one file ([`src/data.ts`](src/data.ts)).

## Live

**https://rajpalgelot-tech.github.io/**

Deployed automatically by GitHub Actions on every push to `main`
(typecheck + 20 Vitest tests first, then a Pages deploy).

## Sections

| Section | What is inside |
| --- | --- |
| Boot | System boot overlay with progress counter, once per page load |
| Hero | Typing name animation, tagline, Explore / Get In Touch buttons, portrait with grid-layer hover, philosophy quote, three role cards, live local clock, marquee ticker |
| 01. About Me | Draggable ID badge, short bio with expandable full version, education and focus cards |
| 02. Tech Stack | 18 tiles with brand icons, pulled from the real repos |
| 03. Projects | 9 flip cards with real screenshots, domain filters (Systems / Distributed / Algorithms / Full Stack), index counter, prev and next |
| 04. Let's Connect | Email card with copy button, location and response cards, GitHub and LinkedIn, resume button, working contact form (opens the visitor's mail app) |
| Footer | Navigation, socials, specializations, direct network, giant wordmark, likes button |

## Project data

The 9 project cards mirror the real repositories, each linking to its source
and its live GitHub Pages demo:

RajSQL (C++17 database in WebAssembly), Raft consensus, Chain (blockchain),
Pipeline (CPU), Regex (NFA/DFA), Heap (memory allocator), Sync (CRDT),
Job Tracker, and Campus Booking.

## Edit the content

Everything personal is in [`src/data.ts`](src/data.ts): name, email, tagline,
philosophy quote, hero roles, ticker words, bio paragraphs, stack tiles,
projects, and footer columns. Photo and resume slots are wired but dormant:

- Drop `rajpal.jpg` into `public/` and the hero portrait plus the About badge
  switch from the RG monogram to the photo automatically (grayscale, matching
  the design).
- Drop `RajpalResume.pdf` into `public/` and the three resume buttons (nav,
  Connect, footer) appear automatically. Until then they stay hidden.

## Run it

```bash
npm install
npm run dev        # local server
npm test           # 20 Vitest tests
npm run build      # typecheck + production build into dist/
```

## Developer

Site designed and engineered by **Heet Soni**
([github.com/HeetSoni26](https://github.com/HeetSoni26)) for Rajpal Gelot.

## License

MIT
