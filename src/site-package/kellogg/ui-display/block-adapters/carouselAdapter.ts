import type { Language } from "@/cms/types";

// 迁移类型
import type { NavLink, Translation } from "@/cms/types";
export interface CarouselItemContent {
  id: number;
  image: string;
  title: Translation;
  subtitle?: Translation;
  cta?: Translation;
  link: NavLink;
}

export interface CarouselContent {
  autoPlay?: boolean;
  interval?: number;
  items?: CarouselItemContent[];
}
import type { CarouselProps } from "../components/blocks";
import { createTranslate } from "../utils/i18n";

function decodeHtml(html: string) {
  return (html || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

export function toCarouselViewProps(
  content: CarouselContent,
  lang: Language,
): CarouselProps {
  const translate = createTranslate(lang);

  return {
    autoPlay: content.autoPlay,
    interval: content.interval,
    regionLabel: lang === "zh" ? "精选内容轮播" : "Featured content carousel",
    previousLabel: lang === "zh" ? "上一张" : "Previous slide",
    nextLabel: lang === "zh" ? "下一张" : "Next slide",
    goToSlideLabelPrefix: lang === "zh" ? "转到第" : "Go to slide",
    items: (content.items ?? []).map((item) => ({
      id: item.id,
      image: item.image,
      titleText: translate(item.title),
      subtitleText: item.subtitle ? decodeHtml(translate(item.subtitle)) : "",
      ctaText: item.cta ? translate(item.cta) : "",
      href: item.link?.href || "#",
    })),
  };
}
