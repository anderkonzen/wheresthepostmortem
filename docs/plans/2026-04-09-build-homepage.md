# Build Homepage & Component Vocabulary — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:executing-plans to implement this plan task-by-task.

**Goal:** Build the full homepage with editorial hierarchy (featured/highlighted/standard tiers), category filters, shared header/footer, enhanced detail page, and SEO meta tags — completing DESIGN.md Steps 4-7.

**Architecture:** Astro components in `src/components/` — flat structure, no nesting. Homepage queries the postmortems collection and renders three card tiers. Client-side `<script>` island handles category filtering via URL params. SEO meta tags in BaseLayout. All pages get SiteHeader + SiteFooter.

**Tech Stack:** Astro 6.x, Tailwind CSS 4.x, client-side vanilla JS for filters

---

### Task 0: SeverityBadge and CategoryTag components

**Files:**
- Create: `src/components/SeverityBadge.astro`
- Create: `src/components/CategoryTag.astro`

**Step 1: Create SeverityBadge**

Create `src/components/SeverityBadge.astro`:

```astro
---
interface Props {
  severity: 'critical' | 'major' | 'minor';
}

const { severity } = Astro.props;

const styles = {
  critical: 'bg-severity-critical-bg text-severity-critical-text',
  major: 'bg-severity-major-bg text-severity-major-text',
  minor: 'bg-severity-minor-bg text-severity-minor-text',
};
---

<span class={`inline-block px-2 py-0.5 rounded-full text-xs font-sans font-medium uppercase tracking-wide ${styles[severity]}`}>
  {severity}
</span>
```

**Step 2: Create CategoryTag**

Create `src/components/CategoryTag.astro`:

```astro
---
interface Props {
  category: string;
  active?: boolean;
}

const { category, active = false } = Astro.props;

const label = category.replace(/-/g, ' ');
const baseClasses = 'inline-block px-3 py-1.5 rounded-full text-sm font-sans cursor-pointer transition-colors duration-150 border min-h-[44px] leading-[44px] sm:min-h-0 sm:leading-normal sm:py-1.5';
const activeClasses = 'bg-amber-accent-bg border-amber-accent text-amber-accent';
const inactiveClasses = 'border-surface-border-hover text-text-muted hover:border-amber-accent hover:text-amber-accent';
---

<button
  class={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
  data-category={category}
  aria-pressed={active ? 'true' : 'false'}
>
  {label}
</button>
```

**Step 3: Verify build**

```bash
npx astro build
```

**Step 4: Commit**

```bash
git add src/components/
git commit -m "feat: add SeverityBadge and CategoryTag components"
```

---

### Task 1: SiteHeader and SiteFooter components

**Files:**
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Create SiteHeader**

Create `src/components/SiteHeader.astro`:

```astro
---
const currentPath = Astro.url.pathname;
---

<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-amber-accent focus:text-white focus:px-4 focus:py-2 focus:rounded">
  Skip to content
</a>
<header role="banner" class="border-b border-surface-border">
  <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
    <a href="/" class="font-serif text-lg font-bold text-text-primary hover:text-amber-accent transition-colors duration-150">
      Where's the Postmortem?
    </a>
    <nav>
      <a
        href="/about"
        class={`text-sm font-sans transition-colors duration-150 ${currentPath === '/about/' || currentPath === '/about' ? 'text-amber-accent' : 'text-text-muted hover:text-amber-accent'}`}
      >
        About
      </a>
    </nav>
  </div>
</header>
```

**Step 2: Create SiteFooter**

Create `src/components/SiteFooter.astro`:

```astro
<footer role="contentinfo" class="border-t border-surface-border mt-16">
  <div class="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-sans text-text-muted">
    <p class="text-center sm:text-left">Learn from failures you didn't have to live through.</p>
    <nav class="flex gap-4">
      <a href="/rss.xml" class="hover:text-amber-accent transition-colors duration-150">RSS</a>
      <a href="https://github.com/anderkonzen/wheresthepostmortem" target="_blank" rel="noopener noreferrer" class="hover:text-amber-accent transition-colors duration-150">GitHub</a>
      <a href="/about" class="hover:text-amber-accent transition-colors duration-150">About</a>
    </nav>
  </div>
</footer>
```

**Step 3: Update BaseLayout to include header and footer**

Modify `src/layouts/BaseLayout.astro` — add imports and wrap slot:

```astro
---
import '../styles/global.css';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';

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
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="alternate" type="application/rss+xml" title="Where's the Postmortem?" href="/rss.xml" />
    <title>{title}</title>
  </head>
  <body class="bg-surface-base text-text-primary font-sans">
    <SiteHeader />
    <main id="main-content" role="main">
      <slot />
    </main>
    <SiteFooter />
  </body>
</html>
```

IMPORTANT: After this change, remove `<main>` wrapper tags from all pages (`index.astro`, `about.astro`, `404.astro`, `[...id].astro`) since `<main>` now lives in BaseLayout. Each page should directly render its content, not wrap in `<main>` again.

**Step 4: Update pages to remove duplicate `<main>` tags**

In `src/pages/index.astro`: remove `<main>` and `</main>`, keep the inner content.
In `src/pages/about.astro`: change `<main class="...">` to `<div class="...">`, same for closing tag.
In `src/pages/404.astro`: change `<main class="...">` to `<div class="...">`, same for closing tag.
In `src/pages/postmortems/[...id].astro`: change `<main class="...">` to `<div class="...">`, same for closing tag.

**Step 5: Verify build and check all pages**

```bash
npx astro build
```

All 4 pages should build. Header and footer should appear in all HTML output.

**Step 6: Commit**

```bash
git add src/components/SiteHeader.astro src/components/SiteFooter.astro src/layouts/BaseLayout.astro src/pages/
git commit -m "feat: add SiteHeader, SiteFooter, and skip-to-content link"
```

---

### Task 2: Card components (Featured, Highlighted, Standard)

**Files:**
- Create: `src/components/FeaturedCard.astro`
- Create: `src/components/HighlightedCard.astro`
- Create: `src/components/StandardCard.astro`

**Step 1: Create FeaturedCard**

Create `src/components/FeaturedCard.astro`:

```astro
---
import SeverityBadge from './SeverityBadge.astro';

interface Props {
  post: any;
}

const { post } = Astro.props;
const { title, company, date, severity, one_line_summary, reading_time } = post.data;
---

<article class="bg-surface-card rounded-lg p-8 sm:p-10">
  <a href={`/postmortems/${post.id}/`} class="block group focus:outline-2 focus:outline-amber-accent focus:outline-offset-2 rounded-lg">
    <div class="flex items-center gap-3 text-sm font-sans text-text-faint">
      <span>{company}</span>
      <span>&middot;</span>
      <span>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
      <span>&middot;</span>
      <SeverityBadge severity={severity} />
    </div>
    <h2 class="font-serif text-2xl sm:text-3xl lg:text-[2.4rem] lg:leading-tight font-bold text-text-primary mt-4 group-hover:text-amber-accent transition-colors duration-150">
      {title}
    </h2>
    <p class="font-serif text-text-secondary text-lg mt-4 leading-relaxed">
      {one_line_summary}
    </p>
    <span class="inline-block mt-4 text-amber-accent font-sans text-sm">
      Read &rarr; <span class="text-text-faint">{reading_time} min</span>
    </span>
  </a>
</article>
```

**Step 2: Create HighlightedCard**

Create `src/components/HighlightedCard.astro`:

```astro
---
import SeverityBadge from './SeverityBadge.astro';

interface Props {
  post: any;
}

const { post } = Astro.props;
const { title, company, severity, one_line_summary } = post.data;
---

<article class="bg-surface-card border border-surface-border rounded-lg p-6 transition-[border-color,box-shadow] duration-150 hover:border-surface-border-hover hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]" data-categories={JSON.stringify(post.data.categories)}>
  <a href={`/postmortems/${post.id}/`} class="block group focus:outline-2 focus:outline-amber-accent focus:outline-offset-2 rounded-lg">
    <div class="flex items-center gap-2 text-sm font-sans text-text-faint">
      <span>{company}</span>
      <span>&middot;</span>
      <SeverityBadge severity={severity} />
    </div>
    <h3 class="font-serif text-xl font-bold text-text-primary mt-3 group-hover:text-amber-accent transition-colors duration-150">
      {title}
    </h3>
    <p class="font-sans text-text-secondary text-sm mt-2 line-clamp-2">
      {one_line_summary}
    </p>
  </a>
</article>
```

**Step 3: Create StandardCard**

Create `src/components/StandardCard.astro`:

```astro
---
import SeverityBadge from './SeverityBadge.astro';

interface Props {
  post: any;
}

const { post } = Astro.props;
const { title, company, severity } = post.data;
---

<article class="bg-surface-card border border-surface-border rounded-lg p-6 transition-[border-color,box-shadow] duration-150 hover:border-surface-border-hover hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]" data-categories={JSON.stringify(post.data.categories)}>
  <a href={`/postmortems/${post.id}/`} class="block group focus:outline-2 focus:outline-amber-accent focus:outline-offset-2 rounded-lg">
    <div class="flex items-center gap-2 text-sm font-sans text-text-faint mb-2">
      <span>{company}</span>
      <span>&middot;</span>
      <SeverityBadge severity={severity} />
    </div>
    <h3 class="font-serif text-lg font-bold text-text-primary group-hover:text-amber-accent transition-colors duration-150">
      {title}
    </h3>
  </a>
</article>
```

**Step 4: Verify build**

```bash
npx astro build
```

**Step 5: Commit**

```bash
git add src/components/FeaturedCard.astro src/components/HighlightedCard.astro src/components/StandardCard.astro
git commit -m "feat: add FeaturedCard, HighlightedCard, and StandardCard components"
```

---

### Task 3: Build the full homepage

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace placeholder homepage with editorial layout**

Replace `src/pages/index.astro` entirely:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import FeaturedCard from '../components/FeaturedCard.astro';
import HighlightedCard from '../components/HighlightedCard.astro';
import StandardCard from '../components/StandardCard.astro';
import CategoryTag from '../components/CategoryTag.astro';

const allPosts = await getCollection('postmortems', ({ data }) => !data.draft);
const sorted = allPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const featured = sorted.find((p) => p.data.featured);
const highlighted = sorted.filter((p) => p.data.highlighted).slice(0, 3);
const standard = sorted.filter((p) => !p.data.featured && !p.data.highlighted);

const categories = [
  'database', 'dns', 'deploy', 'cascading-failure', 'configuration',
  'security', 'networking', 'third-party', 'caching', 'load', 'financial',
] as const;

// Collect only categories that have at least one post
const usedCategories = categories.filter((cat) =>
  allPosts.some((p) => p.data.categories.includes(cat))
);
---

<BaseLayout title="Where's the Postmortem? | Curated Incident Stories">
  <!-- Hero -->
  <section class="max-w-5xl mx-auto px-4 pt-10 pb-6">
    <h1 class="font-serif text-4xl sm:text-5xl font-bold text-text-primary">
      Where's the <span class="text-amber-accent">Postmortem</span>?
    </h1>
    <p class="text-text-secondary mt-3 text-lg max-w-2xl">
      Curated incident stories from the best engineering teams. Learn from failures you didn't have to live through.
    </p>
  </section>

  <!-- Featured -->
  {featured && (
    <section class="max-w-5xl mx-auto px-4 pb-8">
      <FeaturedCard post={featured} />
    </section>
  )}

  <!-- Filters -->
  <section class="max-w-5xl mx-auto px-4 pb-6">
    <nav role="toolbar" aria-label="Filter by category" class="flex gap-2 overflow-x-auto pb-2 -mb-2">
      <CategoryTag category="all" active={true} />
      {usedCategories.map((cat) => (
        <CategoryTag category={cat} />
      ))}
    </nav>
  </section>

  <!-- Empty filter message (hidden by default) -->
  <div id="empty-filter-message" class="hidden max-w-5xl mx-auto px-4 py-12 text-center">
    <p class="text-text-secondary">No postmortems in this category yet.</p>
    <button data-category="all" class="text-amber-accent hover:text-amber-accent-dark mt-2 font-sans cursor-pointer">
      Browse all
    </button>
  </div>

  <!-- Highlighted -->
  {highlighted.length > 0 && (
    <section id="highlighted-grid" class="max-w-5xl mx-auto px-4 pb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {highlighted.map((post) => (
          <HighlightedCard post={post} />
        ))}
      </div>
    </section>
  )}

  <!-- Standard -->
  {standard.length > 0 && (
    <section id="standard-grid" class="max-w-5xl mx-auto px-4 pb-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {standard.map((post) => (
          <StandardCard post={post} />
        ))}
      </div>
    </section>
  )}
</BaseLayout>

<script>
  function initFilters() {
    const buttons = document.querySelectorAll<HTMLButtonElement>('[data-category]');
    const filterableCards = document.querySelectorAll<HTMLElement>('[data-categories]');
    const emptyMessage = document.getElementById('empty-filter-message');
    const highlightedGrid = document.getElementById('highlighted-grid');
    const standardGrid = document.getElementById('standard-grid');

    function setFilter(category: string) {
      // Update button states
      buttons.forEach((btn) => {
        const isActive = btn.dataset.category === category;
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (isActive) {
          btn.classList.add('bg-amber-accent-bg', 'border-amber-accent', 'text-amber-accent');
          btn.classList.remove('border-surface-border-hover', 'text-text-muted');
        } else {
          btn.classList.remove('bg-amber-accent-bg', 'border-amber-accent', 'text-amber-accent');
          btn.classList.add('border-surface-border-hover', 'text-text-muted');
        }
      });

      // Filter cards
      let visibleCount = 0;
      filterableCards.forEach((card) => {
        const categories = JSON.parse(card.dataset.categories || '[]');
        const show = category === 'all' || categories.includes(category);
        card.style.opacity = show ? '1' : '0';
        card.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      // Show/hide empty message
      if (emptyMessage) {
        emptyMessage.classList.toggle('hidden', category === 'all' || visibleCount > 0);
      }

      // Hide grid sections if all their children are hidden
      if (highlightedGrid) {
        const visibleHighlighted = highlightedGrid.querySelectorAll('[data-categories]:not([style*="display: none"])');
        highlightedGrid.style.display = visibleHighlighted.length === 0 && category !== 'all' ? 'none' : '';
      }
      if (standardGrid) {
        const visibleStandard = standardGrid.querySelectorAll('[data-categories]:not([style*="display: none"])');
        standardGrid.style.display = visibleStandard.length === 0 && category !== 'all' ? 'none' : '';
      }

      // Update URL
      const url = new URL(window.location.href);
      if (category === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', category);
      }
      history.pushState({}, '', url.toString());
    }

    // Bind click handlers
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category || 'all';
        setFilter(category);
      });
    });

    // Apply filter from URL on load
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('category') || 'all';
    setFilter(initial);
  }

  // Run on initial load and on Astro page transitions (if ever added)
  initFilters();
  document.addEventListener('astro:after-swap', initFilters);
</script>
```

Key design decisions:
- `data-categories` attribute on Highlighted and Standard cards enables client-side filtering
- Featured card is NOT filtered (always shows, per DESIGN.md)
- "All" category tag is hardcoded first, other tags come from used categories only
- Empty message shows when filter matches zero cards
- URL updates via `history.pushState` for shareable filter links
- `?category=x` is read on page load to support direct navigation

**Step 2: Verify build**

```bash
npx astro build
```

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: build homepage with editorial hierarchy and category filters"
```

---

### Task 4: Enhance detail page with SeverityBadge and CategoryTag

**Files:**
- Modify: `src/pages/postmortems/[...id].astro`

**Step 1: Update detail page**

Update `src/pages/postmortems/[...id].astro` to add severity badge, category tags, and better metadata display:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import SeverityBadge from '../../components/SeverityBadge.astro';

export async function getStaticPaths() {
  const postmortems = await getCollection('postmortems', ({ data }) => !data.draft);
  return postmortems.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const { title, company, date, severity, categories, one_line_summary, source_url, reading_time } = post.data;
---

<BaseLayout title={`${title} | Where's the Postmortem?`} description={one_line_summary}>
  <div class="max-w-[700px] mx-auto px-4 py-10">
    <a href="/" class="text-amber-accent hover:text-amber-accent-dark text-sm font-sans">&larr; Back to all postmortems</a>
    <article class="mt-6">
      <header>
        <div class="flex items-center gap-3 text-sm font-sans text-text-faint">
          <span>{company}</span>
          <span>&middot;</span>
          <span>{date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
          <span>&middot;</span>
          <span>{reading_time} min read</span>
          <span>&middot;</span>
          <SeverityBadge severity={severity} />
        </div>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-text-primary mt-4 leading-tight">{title}</h1>
        <div class="flex gap-2 mt-4 flex-wrap">
          {categories.map((cat: string) => (
            <a href={`/?category=${cat}`} class="inline-block px-2 py-0.5 rounded-full text-xs font-sans border border-surface-border text-text-muted hover:border-amber-accent hover:text-amber-accent transition-colors duration-150">
              {cat.replace(/-/g, ' ')}
            </a>
          ))}
        </div>
      </header>
      <div class="mt-8 font-serif text-text-body text-[1.1rem] leading-[1.8] postmortem-content">
        <Content />
      </div>
      <footer class="mt-10 pt-6 border-t border-surface-border">
        <a href={source_url} target="_blank" rel="noopener noreferrer"
           class="text-amber-accent hover:text-amber-accent-dark font-sans text-sm">
          Read the original postmortem &rarr;
        </a>
      </footer>
    </article>
  </div>
</BaseLayout>
```

**Step 2: Verify build**

```bash
npx astro build
```

**Step 3: Commit**

```bash
git add src/pages/postmortems/
git commit -m "feat: enhance detail page with severity badge and category links"
```

---

### Task 5: SEO meta tags (OG, canonical, Twitter Card)

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Extend BaseLayout with SEO props**

Update `src/layouts/BaseLayout.astro` to accept and render SEO meta tags:

```astro
---
import '../styles/global.css';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';

interface Props {
  title: string;
  description?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
}

const {
  title,
  description = 'Curated incident stories from the best engineering teams.',
  ogType = 'website',
  canonicalUrl,
} = Astro.props;

const siteUrl = Astro.site?.toString().replace(/\/$/, '') || '';
const canonical = canonicalUrl || `${siteUrl}${Astro.url.pathname}`;
const ogImageUrl = `${siteUrl}/og-image.png`;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content={description} />

    <!-- Canonical -->
    <link rel="canonical" href={canonical} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content={ogType} />
    <meta property="og:image" content={ogImageUrl} />
    <meta property="og:site_name" content="Where's the Postmortem?" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImageUrl} />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="alternate" type="application/rss+xml" title="Where's the Postmortem?" href="/rss.xml" />
    <title>{title}</title>
  </head>
  <body class="bg-surface-base text-text-primary font-sans">
    <SiteHeader />
    <main id="main-content" role="main">
      <slot />
    </main>
    <SiteFooter />
  </body>
</html>
```

**Step 2: Update detail page to pass ogType="article"**

In `src/pages/postmortems/[...id].astro`, update the BaseLayout call:

```astro
<BaseLayout title={`${title} | Where's the Postmortem?`} description={one_line_summary} ogType="article">
```

**Step 3: Create a placeholder OG image**

Create a simple 1200x630 placeholder. For now, just create a text file noting it needs to be designed:

```bash
# We'll need a 1200x630 PNG at public/og-image.png
# For now, the meta tags reference it — a 404 for the image is acceptable until Step 11 (polish)
```

Alternatively, skip the OG image file for now — the meta tags are in place and will work once the image is added.

**Step 4: Verify build**

```bash
npx astro build
# Check that OG tags appear in built HTML:
grep -o 'og:title' dist/index.html
grep -o 'og:type.*article' dist/postmortems/gitlab-database-deletion-2017/index.html
grep -o 'rel="canonical"' dist/index.html
```

**Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/
git commit -m "feat: add SEO meta tags (OG, canonical URL, Twitter Card)"
```

---

### Task 6: Add prefers-reduced-motion and accessibility polish

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Wrap all transitions in reduced-motion media query**

Add to `src/styles/global.css` after the `.postmortem-content` styles:

```css
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

**Step 2: Verify build**

```bash
npx astro build
```

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add prefers-reduced-motion support"
```

---

### Task 7: Final verification

**Step 1: Full build check**

```bash
npx astro build
```

**Step 2: Verify output structure**

Confirm all pages build correctly with header, footer, and SEO tags.

**Step 3: Verify filter script**

Open the dev server and test:
- Clicking a category filter updates URL and hides non-matching cards
- "All" clears the filter
- Direct navigation to `?category=database` pre-filters
- Featured card is never hidden by filters

```bash
npx astro dev
```

**Step 4: Commit any cleanup**

```bash
git add -A
git commit -m "chore: final homepage build cleanup"
```
