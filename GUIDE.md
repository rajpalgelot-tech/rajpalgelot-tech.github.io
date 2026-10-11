# Guide: finishing touches and the asset checklist

The portfolio is live and complete. A few slots are intentionally left for
assets only Rajpal can provide. Everything is wired: drop a file in place and
the site picks it up with no code changes.

## Credits

- Site design and development: **Heet Soni** (github.com/HeetSoni26),
  also credited in the footer of the site itself.
- Portfolio owner and content source: **Rajpal Gelot**
  (github.com/rajpalgelot-tech).

## How to run locally

```bash
npm install
npm run dev
```

## Asset checklist (send these and they get slotted in)

| # | Asset | Where it goes | What happens |
| --- | --- | --- | --- |
| 1 | **Photo of Rajpal** (portrait, face centered, any size) | `public/rajpal.jpg` | Hero portrait and the About ID badge switch from the RG monogram to the real photo, auto-grayscaled to match the design. The cybernetic HUD layer drops onto the real photo. Plus a better project poster using his photo is planned |
| 2 | **Resume PDF** (final, after reviewing `Rajpal_Resume.docx`) | `public/RajpalResume.pdf` | Three resume buttons appear: nav pill, Connect section, footer. Until then they stay hidden so the site never shows a dead link |
| 3 | **Phone number** | `Rajpal_Resume.docx` + portfolio contact | The resume has a gray +1 (XXX) XXX-XXXX placeholder; send the real number and it goes into the resume and the site |
| 4 | **Real experience / internship lines** (if any) | `src/data.ts` + resume | The About section can carry an Experience card; currently projects serve as the experience section on both resume and site |
| 5 | **Certification details** (optional) | `src/data.ts` + resume | Send title, issuer, years, and both get a section |

## Items already resolved (no longer pending)

- Name: **Rajpal Gelot** (from the previous portfolio data)
- Education: B.S. Computer Science, Cleveland State University, 2023 to 2027
- GitHub: github.com/rajpalgelot-tech
- LinkedIn: linkedin.com/in/rajpal-gelot-825b29298
- Instagram: instagram.com/gelot_rajpaal (third social button, live)
- Email: rajpalgelot16705@gmail.com (confirmed by Rajpal)
- City: Cleveland, OH (location card now shows "Cleveland, OH [EST]")
- All 9 projects with descriptions, tech tags, screenshots, source links, and
  live demo links (pulled from the repo READMEs and language stats)
- Tech stack: 18 tiles derived from the actual repo languages and tooling
- Experience section: since there are no internships, the resume and the site
  present the projects as the experience ("Projects & Experience")

## Deploy

Push to `main` of github.com/rajpalgelot-tech/rajpalgelot-tech.github.io and
GitHub Actions typechecks, runs the tests, builds, and deploys to
https://rajpalgelot-tech.github.io/ automatically.
