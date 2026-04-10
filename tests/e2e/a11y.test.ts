import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accessibility', () => {
  test('homepage passes axe-core scan', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('detail page passes axe-core scan', async ({ page }) => {
    await page.goto('/postmortems/gitlab-database-deletion-2017/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('about page passes axe-core scan', async ({ page }) => {
    await page.goto('/about');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('skip-to-content link works', async ({ page }) => {
    await page.goto('/');
    // Tab to focus the skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
    // Activate it
    await page.keyboard.press('Enter');
    // Main content should be the active element target
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
  });

  test('keyboard Tab navigates interactive elements', async ({ page }) => {
    await page.goto('/');
    // Tab through: skip link -> logo -> about nav -> featured card link -> filter buttons -> cards
    const focusedElements: string[] = [];
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      const tag = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
      if (tag) focusedElements.push(tag);
    }
    // All focused elements should be interactive (a or button)
    expect(focusedElements.every(tag => tag === 'a' || tag === 'button')).toBe(true);
  });

  test('focus indicators are visible on interactive elements', async ({ page }) => {
    await page.goto('/');
    // Tab to the logo link
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // logo
    const logo = page.locator('header a[href="/"]');
    // Check it has a visible outline (not outline: none)
    const outline = await logo.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.outlineStyle;
    });
    expect(outline).not.toBe('none');
  });
});

test.describe('category filters', () => {
  test('clicking category shows only matching cards', async ({ page }) => {
    await page.goto('/');
    // Click "cascading-failure" which has Roblox and Fastly in standard tier
    await page.click('div[role="group"] button[data-category="cascading-failure"]');
    // Wait for filter to apply
    const visibleCards = page.locator('[data-categories]:not([style*="display: none"])');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThan(0);
    // Each visible card should contain "cascading-failure" in its categories
    for (let i = 0; i < count; i++) {
      const categories = await visibleCards.nth(i).getAttribute('data-categories');
      expect(categories).toContain('cascading-failure');
    }
  });

  test('clicking "All" shows all cards', async ({ page }) => {
    await page.goto('/?category=database');
    await page.click('div[role="group"] button[data-category="all"]');
    const hiddenCards = page.locator('[data-categories][style*="display: none"]');
    expect(await hiddenCards.count()).toBe(0);
  });

  test('URL updates to ?category=x on filter click', async ({ page }) => {
    await page.goto('/');
    await page.click('div[role="group"] button[data-category="networking"]');
    expect(page.url()).toContain('?category=networking');
  });

  test('direct navigation to ?category=x pre-filters cards', async ({ page }) => {
    await page.goto('/?category=deploy');
    // The "deploy" button should be active
    const deployButton = page.locator('div[role="group"] button[data-category="deploy"]');
    await expect(deployButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('featured card is not affected by filter', async ({ page }) => {
    await page.goto('/');
    // Click a filter that won't match the featured card's categories
    await page.click('div[role="group"] button[data-category="networking"]');
    // Featured card should still be visible (it doesn't have data-categories attribute)
    const featuredSection = page.locator('article').first();
    await expect(featuredSection).toBeVisible();
  });
});
