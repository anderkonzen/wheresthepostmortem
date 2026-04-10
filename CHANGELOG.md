# Changelog

All notable changes to this project will be documented in this file.

## [0.1.1.0] - 2026-04-10

### Added
- Knight Capital postmortem: $440M trading loss from dead code activation (2012)
- Cloudflare postmortem: 1.1.1.1 BGP hijack across 300 networks in 70 countries (2024)
- Roblox postmortem: 73-hour platform outage from Consul cascading failure (2021)
- Fastly postmortem: global CDN outage from one customer config change (2021)
- Site now has 5 curated postmortem entries with full narrative summaries

## [0.1.0.0] - 2026-04-10

### Added
- Astro v6 static site with TypeScript strict mode, MDX, Tailwind CSS v4, sitemap, and RSS feed
- Warm amber editorial design system with self-hosted Source Serif 4 and Inter variable fonts (~97KB combined)
- Content collection with Zod-validated schema for postmortem entries (11 categories, 8 root cause types, severity levels)
- Homepage with editorial hierarchy: featured card, highlighted grid, standard grid, and category filter bar
- Client-side category filtering with URL parameter support and browser history integration
- Detail page with 700px reading column, severity badge, category links, and source attribution
- About page and custom 404 page
- SiteHeader with skip-to-content link and SiteFooter with RSS/GitHub/About links
- Full SEO meta tags on every page: Open Graph, Twitter Card, canonical URLs
- Accessibility: ARIA landmarks, keyboard navigation, focus indicators, prefers-reduced-motion support
- One seed postmortem entry: GitLab 2017 database deletion incident
- RSS feed at /rss.xml and auto-generated sitemap
