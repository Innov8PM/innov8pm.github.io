import rss from '@astrojs/rss'
import { getBlogPosts } from '../utils'

export async function GET(context) {
  const posts = await getBlogPosts()

  return rss({
    title: 'Innov-8 Blog',
    description:
      'Insights on panel management, data-driven allocation, and UK field services from the Innov-8 team.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
  })
}
