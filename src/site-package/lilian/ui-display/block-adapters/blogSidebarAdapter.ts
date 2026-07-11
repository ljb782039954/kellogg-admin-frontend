// import type { Language } from "@/cms/types";
// import type { Translation } from "@/cms/types";

// // 迁移类型
// export interface BlogSidebarArticle {
//   title: Translation;
//   date?: string;
// }

// export interface BlogSidebarContent {
//   categoriesTitle?: Translation;
//   categories: Translation[];
//   popularTitle?: Translation;
//   popularArticles: BlogSidebarArticle[];
//   newsletterTitle?: Translation;
//   newsletterDescription?: Translation;
//   emailPlaceholder?: Translation;
// }


// import type { BlogSidebarProps } from "../components/base/BlogSidebar";
// import { createTranslate } from "../utils/i18n";

// export function toBlogSidebarViewProps(content: BlogSidebarContent, lang: Language): BlogSidebarProps {
//   const translate = createTranslate(lang);

//   return {
//     categoriesTitle: translate(content.categoriesTitle, "Categories"),
//     categories: content.categories.map((category) => translate(category)),
//     popularTitle: translate(content.popularTitle, "Popular Articles"),
//     popularArticles: content.popularArticles.map((article) => ({
//       title: translate(article.title),
//       date: article.date,
//     })),
//     newsletterTitle: translate(content.newsletterTitle, "Newsletter"),
//     newsletterDescription: translate(content.newsletterDescription),
//     emailPlaceholder: translate(content.emailPlaceholder, "Your email"),
//   };
// }
