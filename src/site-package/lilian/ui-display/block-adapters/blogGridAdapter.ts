import type { BlogSummary, Language } from "@/cms/types";
import type { Translation } from "@/cms/types";

// 迁移类型
export interface BlogGridContent {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
}


import type { BlogGridProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

interface BlogGridAdapterOptions {
  content: BlogGridContent;
  blogs: BlogSummary[];
  lang: Language;
}

function formatDate(value: string | null, lang: Language) {
  if (!value) return "";
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function toBlogGridViewProps({ content, blogs, lang }: BlogGridAdapterOptions): BlogGridProps {
  const translate = createTranslate(lang);
  const displayBlogs = blogs.slice(0, content.maxItems || 3);

  return {
    titleText: translate(content.title),
    subtitleText: translate(content.subtitle),
    items: displayBlogs.map((blog) => ({
      id: String(blog.id),
      href: `/blog/${blog.slug}`,
      titleText: lang === "zh" ? blog.title_zh : blog.title_en,
      summaryText: lang === "zh" ? blog.summary_zh || "" : blog.summary_en || "",
      categoryText: blog.category || "",
      dateText: formatDate(blog.publish_date, lang),
      image: blog.cover_image || "",
    })),
  };
}
