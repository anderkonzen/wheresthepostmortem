# Where's the Postmortem?

[![Deploy](https://img.shields.io/github/deployments/anderkonzen/wheresthepostmortem/production?label=vercel&logo=vercel)](https://wheresthepostmortem.vercel.app)
[![CI](https://github.com/anderkonzen/wheresthepostmortem/actions/workflows/ci.yml/badge.svg)](https://github.com/anderkonzen/wheresthepostmortem/actions/workflows/ci.yml)
[![Postmortems](https://img.shields.io/badge/postmortems-10-b45309)](https://wheresthepostmortem.vercel.app)
[![License](https://img.shields.io/github/license/anderkonzen/wheresthepostmortem)](LICENSE)

Curated incident stories from the best engineering teams. Learn from failures you didn't have to live through.

**[Read the postmortems](https://wheresthepostmortem.vercel.app)**

---

## What is this?

A curated collection of the most compelling public postmortems in tech, presented like a magazine rather than a link dump. Fewer entries, more thought per entry. Every summary is handwritten, every incident is selected for what it teaches.

**Currently featuring 10 postmortems** covering database failures, networking incidents, deploy disasters, security breaches, and cascading failures from companies like GitLab, AWS, Meta, GitHub, Cloudflare, and more.

## Suggest a Postmortem

Know a great public postmortem that should be here? We'd love to hear about it.

**[Open an issue](https://github.com/anderkonzen/wheresthepostmortem/issues/new?title=Suggest:%20[Company]%20-%20[Incident]&body=**Source%20URL:**%20%0A**Company:**%20%0A**Year:**%20%0A**Why%20it's%20interesting:**%20%0A)** with:
- A link to the original postmortem
- The company and year
- Why you think it's interesting

Good candidates: dramatic stories, surprising root causes, lessons that apply broadly, radical transparency.

## Tech Stack

- [Astro](https://astro.build) v6 (static site)
- [Tailwind CSS](https://tailwindcss.com) v4
- [MDX](https://mdxjs.com) for content
- Deployed on [Vercel](https://vercel.com)
- Tested with [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev)

## Development

```bash
npm install
npm run dev          # Start dev server at localhost:4321
npm run build        # Build static site to dist/
npm test             # Run Vitest unit tests
npm run test:e2e     # Build + run Playwright E2E tests
```

## Adding a Postmortem

1. Copy `src/content/postmortems/_template.mdx`
2. Name it `company-incident-year.mdx` (this becomes the URL slug)
3. Fill in the frontmatter and write the four sections: What Happened, Impact, Root Cause, Lessons
4. Run `npm run build` to validate the schema
5. Open a PR

See [DESIGN.md](DESIGN.md) for the full content schema and editorial guidelines.

## License

MIT
