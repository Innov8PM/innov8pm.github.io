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
  author: string                # optional, defaults to "Innov-8"
  tags: [string, ...]           # optional, defaults to []
  draft: boolean                # optional, defaults to false
  ---
  ```

- `draft: true` excludes a post from `/blog`, its own page, and `/rss.xml`
  (it won't build a route at all).
- Body is standard Markdown. Headings start at `##` (the `#`/h1 is rendered from
  `title`). Article styling comes from the `.prose-i8` class in `global.css` —
  no typography plugin.
- Pages: listing `src/pages/blog/index.astro`, post `src/pages/blog/[...slug].astro`,
  feed `src/pages/rss.xml.js`.

### Creating a post

Run the **`/blog-post`** skill (`.claude/skills/blog-post/`) — it interviews you
and writes a correctly-formatted file. Or create the `.md` file by hand following
the schema above. Either way, run `npm run build` before pushing.
