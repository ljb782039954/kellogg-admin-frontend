export function generateBlogCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 80);
}

export function sanitizeBlogCategorySlug(slug: string): string {
  return slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
}
