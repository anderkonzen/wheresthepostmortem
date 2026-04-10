import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const dist = resolve(import.meta.dirname, '..', 'dist');
let homepage: string;
let detailPage: string;
let aboutPage: string;

beforeAll(() => {
  homepage = readFileSync(resolve(dist, 'index.html'), 'utf-8');
  detailPage = readFileSync(resolve(dist, 'postmortems/gitlab-database-deletion-2017/index.html'), 'utf-8');
  aboutPage = readFileSync(resolve(dist, 'about/index.html'), 'utf-8');
});

describe('SEO meta tags', () => {
  test('homepage has correct <title>', () => {
    expect(homepage).toContain("Where&#39;s the Postmortem? | Curated Incident Stories</title>");
  });

  test('detail page has correct <title> with postmortem title', () => {
    expect(detailPage).toContain("When a Database Engineer Accidentally Deleted the Production Database | Where's the Postmortem?");
  });

  test('detail page has <meta description> from one_line_summary', () => {
    expect(detailPage).toMatch(/meta name="description" content="An engineer ran rm -rf on production/);
  });

  test('all pages have og:title, og:description, og:url', () => {
    for (const page of [homepage, detailPage, aboutPage]) {
      expect(page).toContain('og:title');
      expect(page).toContain('og:description');
      expect(page).toContain('og:url');
    }
  });

  test('all pages have canonical URL', () => {
    for (const page of [homepage, detailPage, aboutPage]) {
      expect(page).toContain('rel="canonical"');
    }
  });

  test('detail pages have og:type=article', () => {
    expect(detailPage).toContain('og:type" content="article"');
  });

  test('homepage has og:type=website', () => {
    expect(homepage).toContain('og:type" content="website"');
  });

  test('all pages have Twitter Card meta', () => {
    for (const page of [homepage, detailPage, aboutPage]) {
      expect(page).toContain('twitter:card');
      expect(page).toContain('twitter:title');
    }
  });
});
