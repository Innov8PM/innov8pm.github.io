// Central registry of blog authors. Posts reference an author by their slug
// (the key below) in frontmatter, e.g. `author: mike-wolfenden`.
export interface Author {
  name: string
  /** Path to a square headshot under /public, e.g. '/images/mike-wolfenden.png'. */
  avatar?: string
  /** Optional job title shown next to the byline, e.g. 'Co-Founder'. */
  role?: string
  /** Optional short bio shown in the post footer. */
  bio?: string
}

export const AUTHORS = {
  'mike-wolfenden': {
    name: 'Mike Wolfenden',
    avatar: '/images/mike-wolfenden.png',
  },
  innov8: {
    name: 'Innov-8',
  },
} satisfies Record<string, Author>

export type AuthorSlug = keyof typeof AUTHORS

export const getAuthor = (slug: string): Author =>
  AUTHORS[slug as AuthorSlug] ?? AUTHORS.innov8
