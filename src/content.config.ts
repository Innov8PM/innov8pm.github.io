import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { AUTHORS } from './authors'

const authorSlugs = Object.keys(AUTHORS) as [string, ...string[]]

// Blog posts live as Markdown files in src/content/blog/<slug>.md
// The file name (without .md) becomes the URL slug: /blog/<slug>
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.enum(authorSlugs).default('innov8'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
