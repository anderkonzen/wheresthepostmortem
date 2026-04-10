import { describe, test, expect } from 'vitest';
import { z } from 'zod';

// Mirror the schema from src/content.config.ts for validation testing
const postmortemSchema = z.object({
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
});

const validFrontmatter = {
  title: 'Test Postmortem',
  company: 'TestCo',
  date: '2024-01-15',
  last_updated: '2024-01-20',
  severity: 'critical',
  categories: ['database'],
  root_cause_type: 'human-error',
  one_line_summary: 'Something went wrong.',
  source_url: 'https://example.com/postmortem',
  reading_time: 10,
};

describe('schema validation', () => {
  test('valid frontmatter passes Zod validation', () => {
    const result = postmortemSchema.safeParse(validFrontmatter);
    expect(result.success).toBe(true);
  });

  test('invalid severity value fails validation', () => {
    const result = postmortemSchema.safeParse({ ...validFrontmatter, severity: 'invalid' });
    expect(result.success).toBe(false);
  });

  test('missing required field fails validation', () => {
    const { title, ...withoutTitle } = validFrontmatter;
    const result = postmortemSchema.safeParse(withoutTitle);
    expect(result.success).toBe(false);
  });

  test('invalid source_url (not a URL) fails validation', () => {
    const result = postmortemSchema.safeParse({ ...validFrontmatter, source_url: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  test('invalid category fails validation', () => {
    const result = postmortemSchema.safeParse({ ...validFrontmatter, categories: ['invalid-category'] });
    expect(result.success).toBe(false);
  });

  test('invalid root_cause_type fails validation', () => {
    const result = postmortemSchema.safeParse({ ...validFrontmatter, root_cause_type: 'not-a-type' });
    expect(result.success).toBe(false);
  });
});
