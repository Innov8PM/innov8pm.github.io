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
  /** Optional LinkedIn profile URL. */
  linkedin?: string
}

export const AUTHORS = {
  'mike-wolfenden': {
    name: 'Mike Wolfenden',
    avatar: '/images/mike-wolfenden.png',
    linkedin: 'https://www.linkedin.com/in/mike-wolfenden-2120a216/',
    // PLACEHOLDER copy inferred from his public LinkedIn (Owner, Innov-8
    // Management; UK utilities / smart-meter / panel-management background).
    // Replace with Mike's own wording before publishing.
    role: 'Founder',
    bio: 'Mike is the founder of Innov-8 Management, helping UK energy and water companies bring data-driven rigour to panel management — from allocation and performance to transparent reporting across their field-service agencies.',
  },
  'will-faithfull': {
    name: 'Will Faithfull',
    role: 'CTO',
    avatar: '/images/will-faithfull.jpg',
    linkedin: 'https://www.linkedin.com/in/will-faithfull/',
  },
  innov8: {
    name: 'Innov-8',
  },
} satisfies Record<string, Author>

export type AuthorSlug = keyof typeof AUTHORS

export const getAuthor = (slug: string): Author =>
  AUTHORS[slug as AuthorSlug] ?? AUTHORS.innov8
