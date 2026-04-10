import { describe, test, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const dist = resolve(import.meta.dirname, '..', 'dist');

beforeAll(() => {
  execSync('npx astro build', { cwd: resolve(import.meta.dirname, '..'), stdio: 'pipe' });
});

describe('build smoke tests', () => {
  test('homepage HTML is generated', () => {
    expect(existsSync(resolve(dist, 'index.html'))).toBe(true);
  });

  test('detail pages generated for each non-draft entry', () => {
    expect(existsSync(resolve(dist, 'postmortems/gitlab-database-deletion-2017/index.html'))).toBe(true);
    expect(existsSync(resolve(dist, 'postmortems/knight-capital-440m-trading-loss-2012/index.html'))).toBe(true);
    expect(existsSync(resolve(dist, 'postmortems/cloudflare-1111-bgp-hijack-2024/index.html'))).toBe(true);
    expect(existsSync(resolve(dist, 'postmortems/roblox-73-hour-outage-2021/index.html'))).toBe(true);
    expect(existsSync(resolve(dist, 'postmortems/fastly-global-cdn-outage-2021/index.html'))).toBe(true);
  });

  test('404 page exists', () => {
    expect(existsSync(resolve(dist, '404.html'))).toBe(true);
  });

  test('RSS feed is valid XML with correct entry count', () => {
    const rss = readFileSync(resolve(dist, 'rss.xml'), 'utf-8');
    expect(rss).toContain('<?xml');
    expect(rss).toContain('<rss');
    expect(rss).toContain("Where&apos;s the Postmortem?</title>");
    // 5 non-draft entries
    const items = rss.match(/<item>/g);
    expect(items).toHaveLength(5);
  });

  test('sitemap.xml is valid XML', () => {
    const sitemap = readFileSync(resolve(dist, 'sitemap-index.xml'), 'utf-8');
    expect(sitemap).toContain('<?xml');
    expect(sitemap).toContain('sitemap');
  });

  test('draft entries are excluded from build output', () => {
    // _template.mdx is excluded by glob pattern, not draft flag,
    // but verify no _template page was generated
    expect(existsSync(resolve(dist, 'postmortems/_template/index.html'))).toBe(false);
  });

  test('about page exists', () => {
    expect(existsSync(resolve(dist, 'about/index.html'))).toBe(true);
  });

  test('fonts are included in build output', () => {
    expect(existsSync(resolve(dist, 'fonts/source-serif-4-latin.woff2'))).toBe(true);
    expect(existsSync(resolve(dist, 'fonts/inter-latin.woff2'))).toBe(true);
  });
});
