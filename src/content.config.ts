import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postmortems = defineCollection({
  loader: glob({ pattern: '**/[!_]*.mdx', base: './src/content/postmortems' }),
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
