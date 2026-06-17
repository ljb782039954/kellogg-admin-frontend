import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  SiteContent,
  Product,
  Category,
  HeaderContent,
  FooterContent,
  CustomPage,
  CompanyInfo,
  Blog,
} from '../types';
import { api } from '../lib/api';
import { toast } from 'sonner';

const blankCompany: CompanyInfo = {
  name: { zh: '', en: '' },
  logo: '',
  description: { zh: '', en: '' },
  contact: { phone: '', email: '', address: { zh: '', en: '' } },
  socialMedia: {}
};

const blankHeader: HeaderContent = {
  logoText: { zh: 'KELLOGG', en: 'KELLOGG' },
  navItems: []
};

const blankFooter: FooterContent = {
  linkGroups: [],
  newsletterPlaceholder: { zh: '', en: '' },
  newsletterButton: { zh: '', en: '' }
};

const blankContent: SiteContent = {
  companyInfo: blankCompany,
  header: blankHeader,
  footer: blankFooter,
  pages: []
};

interface ContentContextType {
  content: SiteContent;
  allProducts: Product[];
  categories: Category[];
  allBlogs: Blog[];
  isLoading: boolean;
  error: string | null;

  refreshData: () => Promise<void>;
  findPage: (id: string) => CustomPage | undefined;
  clearError: () => void;

  // Pending removal when InquiryEditor migrates
  updatePage: (pageId: string, pageData: Partial<CustomPage>) => Promise<void>;

  updateSiteSettings: (settings: CompanyInfo) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(blankContent);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const findPage = useCallback((id: string) => {
    return content.pages.find(p => p.id === id);
  }, [content.pages]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchEntity = async <T,>(p: Promise<T>, defaultValue: T): Promise<T> => {
        try { return await p; } catch (e) {
          console.warn('D1 entity load failed, using fallback:', e);
          return defaultValue;
        }
      };

      const [productsResp, categoriesData, blogsResp] = await Promise.all([
        fetchEntity(api.getProducts({ pageSize: 1000 }), { data: [], total: 0, page: 1, pageSize: 1000, totalPages: 1 }),
        fetchEntity(api.getCategories(), []),
        fetchEntity(api.getBlogs({ pageSize: 1000 }), { data: [], pagination: { page: 1, pageSize: 1000, total: 0, totalPages: 1 } }),
      ]);

      const fetchConfig = async <T,>(key: string, defaultVal: T): Promise<T> => {
        try {
          const val = await api.getConfig<T>(key);
          return val === null ? defaultVal : val;
        } catch (e) {
          console.error(`KV config load failed [${key}]:`, e);
          return defaultVal;
        }
      };

      const [
        pagesIndex,
        siteSettings,
        header,
        footer,
      ] = await Promise.all([
        fetchConfig<CustomPage[]>('pages', blankContent.pages),
        fetchConfig<CompanyInfo>('site_settings', blankContent.companyInfo),
        fetchConfig<HeaderContent>('header_config', blankContent.header),
        fetchConfig<FooterContent>('footer_config', blankContent.footer),
      ]);

      const fullPages = await Promise.all(
        pagesIndex.map(async (p) => {
          try {
            const detail = await api.getPageById(p.id);
            return { ...p, ...detail } as CustomPage;
          } catch (e) {
            return { ...p, blocks: [] } as CustomPage;
          }
        })
      );

      setContent({
        companyInfo: siteSettings,
        header: header,
        footer: footer,
        pages: fullPages,
      });

      setAllProducts(productsResp.data || []);
      setCategories(categoriesData);
      setAllBlogs(blogsResp.data || []);

    } catch (err) {
      console.error('Critical data load failure:', err);
      setError('无法连接到服务器，请检查 Worker 是否正常运行');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ============================================
  // 页面管理 - pending removal when InquiryEditor migrates
  // ============================================
  const updatePage = useCallback(async (pageId: string, pageData: Partial<CustomPage>) => {
    const existingFullPage = content.pages.find(p => p.id === pageId);
    const fullPageToSave = { ...(existingFullPage || {}), ...pageData } as CustomPage;

    await api.setConfig(`page:${pageId}`, fullPageToSave);

    const updatedPages = content.pages.map(p =>
      p.id === pageId ? { ...p, ...pageData } : p
    );
    const sanitizedIndex = updatedPages.map(p => {
      const { blocks, seo, ...rest } = p;
      return rest as CustomPage;
    });
    await api.setConfig('pages_index', sanitizedIndex);

    setContent(prev => ({ ...prev, pages: updatedPages }));
    toast.success('页面信息已更新');
  }, [content.pages]);

  // ============================================
  // 全局配置管理
  // ============================================
  const updateSiteSettings = useCallback(async (settings: CompanyInfo) => {
    await api.setConfig('site_settings', settings);
    setContent(prev => ({ ...prev, companyInfo: settings }));
    toast.success('公司信息已更新');
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        allProducts,
        categories,
        allBlogs,
        isLoading,
        error,
        refreshData,
        findPage,
        clearError,
        updatePage,
        updateSiteSettings,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
