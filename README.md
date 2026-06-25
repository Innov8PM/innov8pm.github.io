# Innov-8 website

Marketing site and blog for **Innov-8 Management** — the panel management
platform for UK field services. Built with [Astro](https://astro.build) and
Tailwind CSS, deployed as a fully static site to GitHub Pages.

- **Live:** https://innov8pm.github.io
- **Stack:** Astro 6, Tailwind CSS 4, TypeScript. No runtime or database — every
  page (including the blog) is rendered to static HTML at build time.

## Getting started

Requires **Node ≥ 22.12**.

```sh
npm install
npm run dev        # http://localhost:4321
```

| Command           | Action                                            |
| :---------------- | :------------------------------------------------ |
| `npm install`     | Install dependencies                              |
| `npm run dev`     | Start the dev server at `localhost:4321`          |
| `npm run build`   | Build the production site to `./dist/`            |
| `npm run preview` | Preview the production build locally              |

`npm run build` is the CI gate — keep it green. Note: edits to files that feed
`getStaticPaths` (`src/authors.ts`, `src/content.config.ts`) don't hot-reload;
restart `npm run dev` after changing them.

## Project structure

```text
src/
├── components/        Astro components (Nav, Hero, Footer, PostCard, …)
├── content/blog/      Blog posts as Markdown (one file per post)
├── layouts/           Layout.astro — shared <head>, SEO, OG/Twitter meta
├── pages/
│   ├── index.astro    Home page (composed from components/)
│   ├── blog/          Listing, posts ([...slug]), tag + author archives
│   ├── og/            Build-time generated Open Graph card images
│   └── rss.xml.js     RSS feed
├── styles/global.css  Tailwind theme + brand tokens + .prose-i8 article styles
├── authors.ts         Blog author registry
├── content.config.ts  Blog collection schema (Zod-validated frontmatter)
└── consts.ts          Site-wide metadata (name, social handle, default OG)
public/                Static assets (logos, images, fonts for OG cards)
```

## Blog

Posts are Markdown files in `src/content/blog/<slug>.md`; the filename is the URL
slug (`/blog/<slug>`). Frontmatter is validated against the schema in
`src/content.config.ts`, so an invalid post fails the build.

Features:

- **Authors** — defined once in `src/authors.ts`, referenced by slug from
  frontmatter. Byline links to an auto-generated `/blog/author/<slug>` page.
- **Tags** — link to auto-generated `/blog/tag/<slug>` archive pages.
- **Cover images** — optional banner + listing thumbnail.
- **Open Graph cards** — a unique 1200×630 social card is generated for every
  post at build time (`astro-og-canvas`), plus the home and blog pages.
- **RSS** — `/rss.xml`.

The conventions (frontmatter schema, image/diagram guidance, authors) are
documented in detail in [`CLAUDE.md`](./CLAUDE.md). The quickest way to author a
post is the **`/blog-post`** skill in `.claude/skills/`, which interviews you and
writes a correctly-formatted file.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages. No manual deploy step.
