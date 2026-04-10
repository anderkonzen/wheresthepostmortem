# Scaffold Astro Project — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold a production-ready Astro project with content collections, Zod schema validation for postmortem entries, RSS feed, sitemap, Tailwind CSS, and self-hosted fonts — fully configured per the DESIGN.md spec.

**Architecture:** Astro v6 static site with content collections using the glob loader pattern (`src/content.config.ts`). MDX for postmortem content. Tailwind CSS with custom design tokens (warm amber theme). Fonts self-hosted from `public/fonts/`. Integrations: `@astrojs/mdx`, `@astrojs/rss`, `@astrojs/sitemap`, `@astrojs/tailwind`.

**Tech Stack:** Astro 6.x, Tailwind CSS 4.x, MDX, TypeScript, Zod (bundled with Astro)

---

### Task 0: Initialize Astro project with npm

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`

**Step 1: Create the Astro project**

Run the Astro CLI with the minimal (empty) template, TypeScript strict:

```bash
cd /Users/anderson.konzen/Projects/anderkonzen/wheresthepostmortem
npm create astro@latest . -- --template minimal --typescript strict --install --git false
```

Note: `--git false` because we already have a git repo. The `.` means current directory.

If the CLI prompts about existing files, allow it to proceed (only CLAUDE.md and DESIGN.md exist, which won't conflict).

**Step 2: Verify the scaffold**

```bash
npx astro build
```

Expected: Build succeeds, outputs to `dist/`.

**Step 3: Add .gitignore entries**

Ensure `.gitignore` includes:
```
node_modules/
dist/
.astro/
```

**Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/ .gitignore
git commit -m "feat: scaffold Astro project with minimal template"
```

---

### Task 1: Install and configure integrations

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json` (via npm install)

**Step 1: Install integrations**

```bash
npx astro add mdx sitemap tailwind
```

This installs `@astrojs/mdx`, `@astrojs/sitemap`, and `@astrojs/tailwind` and auto-updates `astro.config.mjs`.

Then install RSS separately (it doesn't have an `astro add` command):

```bash
npm install @astrojs/rss
```

**Step 2: Configure astro.config.mjs**

After the `astro add` commands, verify/edit `astro.config.mjs` to match:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://wheresthepostmortem.com',
  integrations: [mdx(), sitemap(), tailwindcss()],
});
```

Note: `site` is required for sitemap and RSS to generate absolute URLs. Use a placeholder domain for now.

**Step 3: Verify build**

```bash
npx astro build
```

Expected: Build succeeds with integrations loaded.

**Step 4: Commit**

```bash
git add astro.config.mjs package.json package-lock.json src/
git commit -m "feat: add MDX, sitemap, Tailwind, and RSS integrations"
```

---

### Task 2: Configure Tailwind with design tokens

**Files:**
- Create or Modify: Tailwind CSS config (check if `astro add tailwind` created a config file, or if Tailwind v4 uses CSS-based config)
- Create: `src/styles/global.css`

**Step 1: Set up Tailwind with design tokens from DESIGN.md**

Tailwind v4 uses CSS-based configuration via `@theme`. Create `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-amber-accent: #b45309;
  --color-amber-accent-bg: #fffbeb;
  --color-amber-accent-dark: #92400e;

  --color-surface-base: #faf8f5;
  --color-surface-card: #ffffff;
  --color-surface-border: #e8e3da;
  --color-surface-border-hover: #c9c1b3;

  --color-text-primary: #1a1a1a;
  --color-text-body: #3a3a3a;
  --color-text-secondary: #666666;
  --color-text-muted: #888888;
  --color-text-faint: #999999;

  --color-severity-critical-bg: #fef2f2;
  --color-severity-critical-text: #dc2626;
  --color-severity-major-bg: #fff7ed;
  --color-severity-major-text: #c2410c;
  --color-severity-minor-bg: #f0fdf4;
  --color-severity-minor-text: #16a34a;

  --font-serif: "Source Serif 4", Georgia, serif;
  --font-sans: Inter, system-ui, sans-serif;
}
```

**Step 2: Import global CSS in a base layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Curated incident stories from the best engineering teams.' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body class="bg-surface-base text-text-primary font-sans">
    <slot />
  </body>
</html>
```

**Step 3: Update index.astro to use the layout**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Where's the Postmortem? | Curated Incident Stories">
  <main>
    <h1 class="font-serif text-4xl font-bold text-text-primary">
      Where's the <span class="text-amber-accent">Postmortem</span>?
    </h1>
    <p class="text-text-secondary mt-2">
      Curated incident stories from the best engineering teams.
    </p>
  </main>
</BaseLayout>
```

**Step 4: Verify build and dev server**

```bash
npx astro build
```

Expected: Build succeeds, design tokens applied.

**Step 5: Commit**

```bash
git add src/styles/ src/layouts/ src/pages/index.astro
git commit -m "feat: configure Tailwind with warm amber design tokens and base layout"
```

---

### Task 3: Download and self-host fonts

**Files:**
- Create: `public/fonts/source-serif-4-latin.woff2`
- Create: `public/fonts/inter-latin.woff2`
- Modify: `src/styles/global.css`

**Step 1: Download variable font files**

Download Source Serif 4 (variable, latin subset) and Inter (variable, latin subset) from Google Fonts API:

```bash
mkdir -p public/fonts

# Source Serif 4 Variable (latin, weight 200-900)
curl -L "https://fonts.gstatic.com/s/sourceserif4/v12/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf64IM3N0a8.woff2" \
  -o public/fonts/source-serif-4-latin.woff2

# Inter Variable (latin, weight 100-900)
curl -L "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2" \
  -o public/fonts/inter-latin.woff2
```

Note: These URLs may need to be updated. If they 404, go to https://fonts.google.com, select Source Serif 4 and Inter, inspect network requests to find current `.woff2` URLs for latin variable fonts. Alternatively:

```bash
# Alternative: use fontsource packages
npm install @fontsource-variable/source-serif-4 @fontsource-variable/inter
```

Then copy the woff2 files from `node_modules/@fontsource-variable/*/files/` to `public/fonts/`.

**Step 2: Add @font-face declarations to global.css**

Add to the top of `src/styles/global.css` (before `@import "tailwindcss"`):

```css
@font-face {
  font-family: "Source Serif 4";
  src: url("/fonts/source-serif-4-latin.woff2") format("woff2");
  font-weight: 200 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
    U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
    U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-latin.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
    U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
    U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

**Step 3: Verify fonts load**

```bash
npx astro build
ls -la dist/fonts/
```

Expected: Font files copied to dist/fonts/, total < 150KB.

**Step 4: Commit**

```bash
git add public/fonts/ src/styles/global.css
git commit -m "feat: self-host Source Serif 4 and Inter variable fonts"
```

---

### Task 4: Define content collection with Zod schema

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/postmortems/_template.mdx`
- Create: `src/content/postmortems/gitlab-database-deletion-2017.mdx` (seed test entry)

**Step 1: Create content collection config**

Create `src/content.config.ts` (Astro v5+ pattern with glob loader):

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postmortems = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/postmortems' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    date: z.coerce.date(),
    last_updated: z.coerce.date(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    highlighted: z.boolean().default(false),
    severity: z.enum(['critical', 'major', 'minor']),
    categories: z.array(z.enum([
      'database', 'dns', 'deploy', 'cascading-failure', 'configuration',
      'security', 'networking', 'third-party', 'caching', 'load', 'financial',
    ])),
    root_cause_type: z.enum([
      'human-error', 'configuration-change', 'deploy-failure', 'cascading-failure',
      'security-breach', 'third-party-dependency', 'capacity', 'latent-bug',
    ]),
    one_line_summary: z.string(),
    source_url: z.string().url(),
    reading_time: z.number(),
  }),
});

export const collections = { postmortems };
```

Note: In Astro v5+, the `slug` field is replaced by `id` which is auto-generated from the filename. Name MDX files with the desired slug (e.g., `gitlab-database-deletion-2017.mdx` → id is `gitlab-database-deletion-2017`).

**Step 2: Create the template file**

Create `src/content/postmortems/_template.mdx`:

```mdx
---
title: ""
company: ""
date: 2026-01-01
last_updated: 2026-04-09
draft: true
featured: false
highlighted: false
severity: "major"
categories: []
root_cause_type: "human-error"
one_line_summary: ""
source_url: ""
reading_time: 0
---

## What Happened

(Narrative of the incident timeline. 1-3 paragraphs.)

## Impact

(Blast radius: users affected, duration, data loss, financial impact. Be specific with numbers.)

## Root Cause

(Technical explanation of why it happened. Not just "human error" but the system conditions that made the error possible.)

## Lessons

(What changed as a result. What the reader should take away.)
```

**Step 3: Create one seed entry for validation testing**

Create `src/content/postmortems/gitlab-database-deletion-2017.mdx`:

```mdx
---
title: "When a Database Engineer Accidentally Deleted the Production Database"
company: "GitLab"
date: 2017-01-31
last_updated: 2026-04-09
draft: false
featured: true
highlighted: false
severity: "critical"
categories: ["database"]
root_cause_type: "human-error"
one_line_summary: "An engineer ran rm -rf on production. Five backup strategies all failed."
source_url: "https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/"
reading_time: 12
---

## What Happened

On January 31, 2017, a GitLab database engineer was troubleshooting replication lag between the primary and secondary PostgreSQL databases. After a long night of debugging, the engineer ran `rm -rf` on what they believed was the secondary database directory. It was the primary.

Within seconds, 300GB of production data began disappearing. The engineer hit Ctrl-C, but by then only 4.5GB remained. GitLab.com was down.

## Impact

GitLab.com was unavailable for approximately 18 hours. About 5,000 projects, 5,000 comments, and 700 new user accounts from the six hours preceding the incident were permanently lost. The incident was live-streamed on YouTube as the team worked to recover, drawing widespread attention across the tech community.

## Root Cause

The immediate cause was a human error: running a destructive command on the wrong database server. But the deeper failure was systemic. GitLab had five separate backup and replication strategies in place, and all five had failed or were misconfigured. LVM snapshots were never tested. Regular SQL dumps had silently stopped working. Replication was the very thing being debugged when the deletion happened.

## Lessons

GitLab's radical transparency during and after the incident became a model for the industry. They published a detailed postmortem, live-streamed the recovery, and shared exactly what went wrong with every backup layer. The key takeaway: untested backups are not backups. Every organization should regularly verify that their recovery procedures actually work, not just that backup jobs are running.
```

**Step 4: Verify build with content collection**

```bash
npx astro build
```

Expected: Build succeeds, content collection is validated against Zod schema. If frontmatter is wrong, build should fail with a clear error.

**Step 5: Commit**

```bash
git add src/content.config.ts src/content/postmortems/
git commit -m "feat: define postmortem content collection with Zod schema and seed entry"
```

---

### Task 5: Create RSS feed page

**Files:**
- Create: `src/pages/rss.xml.ts`

**Step 1: Create RSS feed endpoint**

Create `src/pages/rss.xml.ts`:

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const postmortems = await getCollection('postmortems', ({ data }) => !data.draft);

  return rss({
    title: "Where's the Postmortem?",
    description: 'Curated incident stories from the best engineering teams.',
    site: context.site!,
    items: postmortems
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.one_line_summary,
        link: `/postmortems/${post.id}/`,
      })),
  });
}
```

**Step 2: Verify build**

```bash
npx astro build
cat dist/rss.xml
```

Expected: Valid XML with one entry (the GitLab seed).

**Step 3: Commit**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat: add RSS feed at /rss.xml"
```

---

### Task 6: Create placeholder pages (detail, about, 404)

**Files:**
- Create: `src/pages/postmortems/[...id].astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/404.astro`

**Step 1: Create detail page route**

Create `src/pages/postmortems/[...id].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const postmortems = await getCollection('postmortems', ({ data }) => !data.draft);
  return postmortems.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BaseLayout title={`${post.data.title} | Where's the Postmortem?`} description={post.data.one_line_summary}>
  <main class="max-w-[700px] mx-auto px-4 py-10">
    <a href="/" class="text-amber-accent hover:text-amber-accent-dark text-sm">&larr; Back to all postmortems</a>
    <article class="mt-6 font-serif text-text-body text-[1.1rem] leading-[1.8]">
      <h1 class="text-text-primary text-3xl font-bold leading-tight">{post.data.title}</h1>
      <p class="text-text-muted text-sm font-sans mt-2">
        {post.data.company} &middot; {post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} &middot; {post.data.reading_time} min read
      </p>
      <div class="mt-8 prose-headings:font-serif prose-headings:text-text-primary prose-headings:font-semibold prose-headings:mt-10 prose-headings:mb-4 prose-p:mb-4">
        <Content />
      </div>
      <div class="mt-10 pt-6 border-t border-surface-border">
        <a href={post.data.source_url} target="_blank" rel="noopener noreferrer"
           class="text-amber-accent hover:text-amber-accent-dark font-sans text-sm">
          Read the original postmortem &rarr;
        </a>
      </div>
    </article>
  </main>
</BaseLayout>
```

**Step 2: Create about page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About | Where's the Postmortem?">
  <main class="max-w-[700px] mx-auto px-4 py-10">
    <h1 class="font-serif text-3xl font-bold text-text-primary">About</h1>
    <div class="mt-6 font-serif text-text-body text-[1.1rem] leading-[1.8] space-y-4">
      <p>
        <strong>Where's the Postmortem?</strong> is a curated collection of the most compelling public postmortems and incident stories in tech.
      </p>
      <p>
        Developers learn from each other's incidents. But most postmortem collections are raw link dumps with zero curation. This site is the opposite: fewer entries, more thought per entry. Every summary is handwritten, every incident is selected for what it teaches.
      </p>
      <p>
        Entries are selected for drama, educational value, and quality of the original write-up. The goal is 30-50 of the best, not a comprehensive list of everything.
      </p>
      <p>
        Have a postmortem to suggest? <a href="https://github.com/anderkonzen/wheresthepostmortem/issues" class="text-amber-accent hover:text-amber-accent-dark">Open an issue on GitHub</a>.
      </p>
    </div>
  </main>
</BaseLayout>
```

**Step 3: Create 404 page**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Not Found | Where's the Postmortem?">
  <main class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
    <h1 class="font-serif text-3xl font-bold text-text-primary">Postmortem not found.</h1>
    <p class="text-text-secondary mt-3 text-lg">
      This incident has no write-up. (Or you mistyped the URL.)
    </p>
    <a href="/" class="text-amber-accent hover:text-amber-accent-dark mt-6 font-sans">
      Browse all postmortems
    </a>
  </main>
</BaseLayout>
```

**Step 4: Verify build**

```bash
npx astro build
ls dist/postmortems/
ls dist/404.html
ls dist/about/
```

Expected: Detail page generated for the GitLab entry, 404.html exists, about/index.html exists.

**Step 5: Commit**

```bash
git add src/pages/
git commit -m "feat: add detail page route, about page, and 404 page"
```

---

### Task 7: Final verification and cleanup

**Step 1: Full build check**

```bash
npx astro build
```

Expected: Clean build, no warnings.

**Step 2: Verify output structure**

```bash
find dist -type f | sort
```

Expected output should include:
- `dist/index.html`
- `dist/404.html`
- `dist/about/index.html`
- `dist/postmortems/gitlab-database-deletion-2017/index.html`
- `dist/rss.xml`
- `dist/sitemap-index.xml`
- `dist/fonts/source-serif-4-latin.woff2`
- `dist/fonts/inter-latin.woff2`

**Step 3: Dev server smoke test**

```bash
npx astro dev
```

Manually verify: homepage renders, detail page renders, fonts load, 404 page works.

**Step 4: Commit any final cleanup**

```bash
git add -A
git commit -m "chore: final scaffold cleanup"
```
