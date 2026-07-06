export interface BlogSidebarArticleProps {
  title: string;
  date?: string;
}

export interface BlogSidebarProps {
  categoriesTitle?: string;
  categories: string[];
  popularTitle?: string;
  popularArticles: BlogSidebarArticleProps[];
  newsletterTitle?: string;
  newsletterDescription?: string;
  emailPlaceholder?: string;
}

export default function BlogSidebar({
  categoriesTitle = "Categories",
  categories,
  popularTitle = "Popular Articles",
  popularArticles,
  newsletterTitle = "Newsletter",
  newsletterDescription = "",
  emailPlaceholder = "Your email",
}: BlogSidebarProps) {
  return (
      <div className="bg-panel p-6 rounded-sm space-y-8">
        <div>
          <h4 className="text-xs font-medium mb-3">{categoriesTitle}</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((tag) => (
              <span key={tag} className="text-[10px] border border-border px-2 py-1 text-body hover:border-subtle cursor-default transition-colors">{tag}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-medium mb-3">{popularTitle}</h4>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <div key={`${article.title}-${index}`} className="border-b border-border pb-2 last:border-0">
                <p className="text-xs text-ink hover:text-ink-strong cursor-default transition-colors">{article.title}</p>
                {article.date && <p className="text-[9px] text-subtle mt-0.5">{article.date}</p>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-medium mb-2">{newsletterTitle}</h4>
          {newsletterDescription && <p className="text-[10px] text-subtle mb-3">{newsletterDescription}</p>}
          <div className="flex border-b border-border pb-1">
            <input type="email" placeholder={emailPlaceholder} className="flex-1 bg-transparent text-xs outline-none" />
            <span className="text-xs cursor-default text-subtle">&rarr;</span>
          </div>
        </div>
      </div>
  );
}



