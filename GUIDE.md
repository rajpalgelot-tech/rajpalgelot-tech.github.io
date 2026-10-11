# Guide: finishing touches and the asset checklist

The portfolio is live and complete. A few slots are intentionally left for
assets only Rajpal can provide. Everything is wired: drop a file in place and
the site picks it up with no code changes.

## How to run locally

```bash
npm install
npm run dev
```

## Asset checklist (send these and they get slotted in)

| # | Asset | Where it goes | What happens |
| --- | --- | --- | --- |
| 1 | **Photo of Rajpal** (portrait, face centered, any size) | `public/rajpal.jpg` | Hero portrait and the About ID badge switch from the RG monogram to the real photo, auto-grayscaled to match the design |
| 2 | **Resume PDF** | `public/RajpalResume.pdf` | Three resume buttons appear: nav pill, Connect section, footer. Until then they stay hidden so the site never shows a dead link |
| 3 | **City confirmation** | one line in `src/data.ts` | Location card says "United States [EST]"; give the exact city (e.g. Cleveland) and it becomes "Cleveland, OH [EST]" |
| 4 | **Instagram (or X/Twitter) link** | `src/data.ts` | The social row shows GitHub and LinkedIn; a third button is added the moment the link exists |
| 5 | **Real experience / internship lines** (if any) | `src/data.ts` | The About section can carry an Experience card like the reference site does; currently it leads with education, which is real |
| 6 | **Email confirmation** | already wired | The site uses rajpalgelot16705@gmail.com (from the previous portfolio). Say the word and it changes everywhere in one line |
| 7 | **Higher-res project posters** (optional) | `public/projects/*.png` | Cards currently use the real screenshots from each repo. Any poster can be swapped 1:1 by replacing the file with the same name |
| 8 | **Certification details** (optional) | `src/data.ts` | Same as experience: send title, issuer, years, and it gets a card |

## Items already resolved from GitHub and the old portfolio

- Name: **Rajpal Gelot** (from the previous portfolio data)
- Education: B.S. Computer Science, Cleveland State University, 2023 to 2027
- GitHub: github.com/rajpalgelot-tech
- LinkedIn: linkedin.com/in/rajpal-gelot-825b29298
- Email: rajpalgelot16705@gmail.com
- All 9 projects with descriptions, tech tags, screenshots, source links, and
  live demo links (pulled from the repo READMEs and language stats)
- Tech stack: 18 tiles derived from the actual repo languages and tooling

## Deploy

Push to `main` of github.com/rajpalgelot-tech/rajpalgelot-tech.github.io and
GitHub Actions typechecks, runs the tests, builds, and deploys to
https://rajpalgelot-tech.github.io/ automatically.
