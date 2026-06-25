// Turn a free-form tag into a URL-safe slug, e.g. "Panel Management" -> "panel-management".
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
