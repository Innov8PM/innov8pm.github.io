import { OGImageRoute } from 'astro-og-canvas'
import { getBlogPosts } from '../../utils'

// Build-time generated Open Graph cards. Blog posts get a unique card from
// their title/description; the home and blog-listing pages get static cards.
// Images are emitted to /og/<key>.png.
const posts = await getBlogPosts()

const staticPages: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Panel management for UK field services',
    description:
      'Data-driven allocation, transparent dashboards, and performance optimisation for energy and water companies.',
  },
  blog: {
    title: 'Notes from the panel',
    description:
      'Insights on panel management, data-driven allocation, and UK field services.',
  },
}

const pages = {
  ...staticPages,
  ...Object.fromEntries(
    posts.map((post) => [
      post.id,
      { title: post.data.title, description: post.data.description },
    ])
  ),
}

const { getStaticPaths, GET: renderImage } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    logo: { path: './public/logo-light.png', size: [190] },
    bgGradient: [
      [11, 48, 57], // brand-950
      [20, 137, 154], // brand-600
    ],
    border: { color: [62, 198, 207], width: 10, side: 'inline-start' }, // brand-400
    padding: 70,
    font: {
      title: {
        families: ['Outfit'],
        weight: 'ExtraBold',
        size: 62,
        color: [255, 255, 255],
        lineHeight: 1.15,
      },
      description: {
        families: ['DM Sans'],
        weight: 'Normal',
        size: 30,
        color: [178, 236, 239], // brand-200
        lineHeight: 1.4,
      },
    },
    fonts: ['./src/assets/fonts/Outfit.ttf', './src/assets/fonts/DMSans.ttf'],
  }),
})

// astro-og-canvas returns the PNG with no Content-Type header. Static builds
// serve the file by extension so it's fine, but `astro dev` serves this route
// dynamically — without the header the browser renders a broken image. Wrap
// the handler to set it (also correct if ever served dynamically in prod).
const GET: typeof renderImage = async (ctx) => {
  const res = await renderImage(ctx)
  return new Response(res.body, {
    status: res.status,
    headers: { ...Object.fromEntries(res.headers), 'Content-Type': 'image/png' },
  })
}

export { getStaticPaths, GET }
