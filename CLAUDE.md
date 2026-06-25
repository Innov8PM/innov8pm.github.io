# Innov-8 site — repo conventions

Static **Astro 6** site (Tailwind 4, no runtime/server). Builds to `dist/` and
deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.

- Dev: `npm run dev` → http://localhost:4321
- Build: `npm run build` (this is the CI gate — keep it green)
- Brand tokens live in `src/styles/global.css` (`@theme`): `brand-50…950`,
  `charcoal`, fonts `Outfit` (display/headings) + `DM Sans` (body). Never
  hardcode hex in components — use the `brand-*` / `charcoal` Tailwind utilities.

## Blog

The blog is **static** — posts are Markdown files compiled at build time. No CMS,
no database.

- **Posts:** `src/content/blog/<slug>.md` — the file name is the URL slug
  (`/blog/<slug>`). Use kebab-case, no dates in the filename.
- **Schema** (validated by `src/content.config.ts`; build fails if invalid):

  ```yaml
  ---
  title: string                 # required
  description: string           # required — also used for cards, <meta>, RSS
  pubDate: YYYY-MM-DD            # required
  updatedDate: YYYY-MM-DD       # optional
  author: slug                  # optional slug into src/authors.ts; defaults to "innov8"
  tags: [string, ...]           # optional, defaults to []
  draft: boolean                # optional, defaults to false
  cover: /images/posts/x.jpg    # optional banner + listing thumbnail
  coverAlt: string              # optional alt text for the cover
  ---
  ```

- **Tags are links.** Each tag links to `/blog/tag/<slug>` (auto-generated
  archive of posts with that tag). The author byline links to
  `/blog/author/<slug>`. Both archive pages are built automatically — no manual
  page needed.

- **Authors** live in `src/authors.ts` (name, optional avatar, role, bio,
  linkedin). The
  `author` frontmatter value is a *slug* (a key in that file, e.g.
  `mike-wolfenden`), not a display name — the build fails on an unknown slug.
  To add a writer: drop a square headshot in `public/images/<slug>.png` and add
  an entry to `AUTHORS`. A "Written by" card (avatar, name, date, optional role,
  LinkedIn link, and bio) renders at the **bottom** of each post.

- `draft: true` excludes a post from `/blog`, its own page, and `/rss.xml`
  (it won't build a route at all).
- Body is standard Markdown. Headings start at `##` (the `#`/h1 is rendered from
  `title`). Article styling comes from the `.prose-i8` class in `global.css` —
  no typography plugin.

### Images & diagrams (encouraged)

Posts read better with visuals. Store post images under
`public/images/posts/<slug>/` and reference them with an absolute path.

- **Plain image:** `![Alt text](/images/posts/my-post/chart.png)` — a standalone
  image is centred and rounded automatically.
- **Image with caption / diagrams:** use an HTML figure (Markdown allows inline
  HTML). Export diagrams as **SVG** (crisp at any size) or PNG and embed them
  the same way:

  ```html
  <figure>
    <img src="/images/posts/my-post/allocation-flow.svg" alt="How a case flows from intake to the best-ranked agency" />
    <figcaption>Cases are allocated by postcode-level performance ranking.</figcaption>
  </figure>
  ```

  `.prose-i8 figure` / `figcaption` styling centres the image and styles the
  caption. Always give images real `alt` text.
- Pages: listing `src/pages/blog/index.astro`, post `src/pages/blog/[...slug].astro`,
  feed `src/pages/rss.xml.js`.

### Creating a post

Run the **`/blog-post`** skill (`.claude/skills/blog-post/`) — it interviews you
and writes a correctly-formatted file. Or create the `.md` file by hand following
the schema above. Either way, run `npm run build` before pushing.
