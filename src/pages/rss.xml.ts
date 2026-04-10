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
