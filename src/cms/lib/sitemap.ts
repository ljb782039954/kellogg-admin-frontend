import type { CmsCustomPage } from "@/cms/types";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: string;
  image?: {
    loc: string;
    title?: string;
  };
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/$/, "");
}

export function joinSiteUrl(siteUrl: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeSiteUrl(siteUrl)}${normalizedPath}`;
}

export function getCmsPageSitemapPath(page: CmsCustomPage): string | null {
  if (!page.path) return null;
  return page.path.startsWith("/") ? page.path : `/${page.path}`;
}

export function renderSitemapXml(urls: SitemapUrl[]): string {
  const entries = urls.map((url) => {
    const imageEntry = url.image
      ? `
    <image:image>
      <image:loc>${escapeXml(url.image.loc)}</image:loc>
      ${url.image.title ? `<image:title><![CDATA[${url.image.title}]]></image:title>` : ""}
    </image:image>`
      : "";

    return `
  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority ? `<priority>${url.priority}</priority>` : ""}${imageEntry}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("")}
</urlset>`.trim();
}
