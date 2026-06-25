import { getCollection } from 'astro:content'

// Turn a free-form tag into a URL-safe slug, e.g. "Panel Management" -> "panel-management".
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// All blog posts visible in the current context, newest first.
// Drafts (`draft: true`) are visible during `npm run dev` so they can be
// previewed, but are always excluded from production builds.
export const getBlogPosts = async () => {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  )
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
}
