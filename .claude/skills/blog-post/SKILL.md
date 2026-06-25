---
name: blog-post
description: Create a new Innov-8 blog post — interviews the user for content, then writes a correctly-formatted Markdown file into src/content/blog/. Use when the user wants to write, draft, or publish a blog post on the Innov-8 site.
---

# Create an Innov-8 blog post

Produce a new post as a Markdown file at `src/content/blog/<slug>.md`. The file
name (kebab-case, no date) becomes the URL: `/blog/<slug>`. The site is static —
the post is published by building and pushing; there is no CMS.

## 1. Gather the content

If the user hasn't already supplied it, ask for (batch the questions):

1. **Title** — the headline.
2. **Angle / summary** — one or two sentences. Becomes the `description`
   (also used on the listing card, the `<meta>` description, and RSS). Keep it
   under ~160 chars and make it genuinely descriptive, not a teaser.
3. **Body** — the substance. Either the user dictates it, or they give bullet
   points and you draft it. If drafting, match the Innov-8 voice: practical,
   grounded in the work (panel management, data-driven allocation, audit trails,
   forecasting, UK field services — energy & water). No hype, no emoji.
4. **Tags** — 1–3, kebab-case (e.g. `panel-management`, `announcements`,
   `forecasting`). Optional.
5. **Author** — a slug from `src/authors.ts` (e.g. `mike-wolfenden`), not a
   display name. Defaults to `innov8`. If the user names an author who isn't in
   `src/authors.ts` yet, add them first: ask for a square headshot, save it to
   `public/images/<slug>.png`, and add an `AUTHORS` entry (name, avatar, and
   optionally role/bio). The build fails on an unknown author slug.
6. **Cover image** — optional, but encouraged. A banner shown atop the post and
   as the listing thumbnail. If the user has one, save it under
   `public/images/posts/<slug>/` and set `cover` (+ `coverAlt`). Landscape
   (~16:9) works best.
7. **Draft?** — if the user is not ready to publish, set `draft: true` (it won't
   appear anywhere or build a route until flipped to `false`).

**Actively encourage visuals.** Posts read far better with pictures and
diagrams. Prompt the user for a cover image, and for any process/flow described
in the body, suggest a diagram. Store images under `public/images/posts/<slug>/`
and reference with an absolute path. For a captioned image or diagram, use an
HTML figure in the Markdown body (export diagrams as SVG where possible):

```html
<figure>
  <img src="/images/posts/<slug>/diagram.svg" alt="Real description" />
  <figcaption>Short caption.</figcaption>
</figure>
```

Never ship an image reference whose file doesn't exist (it renders broken). If
the user wants a visual but has no file yet, leave a clear TODO rather than a
dead path. Every image needs real `alt` text.

Derive the **slug** from the title: lowercase, hyphenated, stop-words trimmed,
no trailing punctuation. Confirm it with the user if ambiguous. If a file with
that slug already exists, pick a distinct one rather than overwriting.

Use **today's date** for `pubDate` (format `YYYY-MM-DD`). Don't invent a date —
if you don't know it, ask.

## 2. Write the file

Write to `src/content/blog/<slug>.md` with exactly this frontmatter shape
(omit optional keys the user didn't provide rather than leaving them blank):

```markdown
---
title: <title>
description: <summary>
pubDate: <YYYY-MM-DD>
author: <author-slug>       # key from src/authors.ts; omit to default to innov8
tags:
  - <tag>
cover: /images/posts/<slug>/cover.jpg   # optional banner + thumbnail
coverAlt: <alt text>                     # optional, with cover
draft: false                # or true while drafting
---

<body — Markdown. Start headings at ## (h1 is rendered from the title).>
```

Body conventions:
- Start section headings at `##` (never `#` — the title is the h1).
- Plain Markdown only: paragraphs, `##`/`###`, lists, `**bold**`, `>` quotes,
  links, fenced code. Styling is handled by `.prose-i8` in `global.css`.
- No emoji. No raw image URLs to external hosts — put images in `public/` and
  reference `/path.png` if needed.

## 3. Verify

After writing, run `npm run build` — the schema in `src/content.config.ts` is
enforced at build time, so this confirms the frontmatter is valid and the route
generates. Report the local URL (`/blog/<slug>`) and remind the user the post
goes live when the branch is merged to `main` (GitHub Pages deploy).

Do not commit or push unless the user asks. If they do, follow the repo's
branching policy (never commit straight to `main`).
