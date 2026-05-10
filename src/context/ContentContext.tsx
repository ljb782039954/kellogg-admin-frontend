import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type {
  SiteContent,
  Product,
  Category,
  HeaderContent,
  FooterContent,
  CustomPage,
  CompanyInfo,
  ProductInput,
  CategoryInput,
  R2Image,
} from '../types';
import { api } from '../lib/api';
import { toast } from 'sonner';

// 初始空白状态
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
  // 状态
  content: SiteContent;
  allProducts: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // 数据获取
  refreshData: () => Promise<void>;
  findPage: (id: string) => CustomPage | undefined;
  clearError: () => void;

  // 商品 CRUD (D1)
  createProduct: (data: ProductInput) => Promise<Product>;
  updateProduct: (id: number, data: Partial<ProductInput>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;

  // 分类 CRUD (D1)
  createCategory: (data: CategoryInput) => Promise<Category>;
  updateCategory: (id: string, data: Partial<CategoryInput>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // 页面管理 (KV)
  updatePage: (pageId: string, pageData: Partial<CustomPage>) => Promise<void>;
  addPage: (page: CustomPage) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;

  // 全局配置管理 (KV)
  updateSiteSettings: (settings: CompanyInfo) => Promise<void>;
  updateHeader: (header: HeaderContent) => Promise<void>;
  updateFooter: (footer: FooterContent) => Promise<void>;

  // 资源管理
  uploadImage: (file: File, dimensions?: { width: number; height: number }) => Promise<{ url: string; thumbUrl: string; key: string }>;
  getImagesList: () => Promise<R2Image[]>;
  deleteImage: (key: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(blankContent);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const findPage = useCallback((id: string) => {
    return content.pages.find(p => p.id === id);
  }, [content.pages]);

  // 全局刷新逻辑
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. 获取所有实体数据 (带容错，表不存在时返回空)
      const fetchEntity = async <T,>(p: Promise<T>, defaultValue: T): Promise<T> => {
        try { return await p; } catch (e) {
          console.warn('D1 entity load failed, using fallback:', e);
          return defaultValue;
        }
      };

      const [productsResp, categoriesData] = await Promise.all([
        fetchEntity(api.getProducts({ pageSize: 1000 }), { data: [], total: 0, page: 1, pageSize: 1000, totalPages: 1 }),
        fetchEntity(api.getCategories(), []),
      ]);

      // 2. 从 KV 获取所有页面和配置 (核心积木系统依赖)
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
        footer
      ] = await Promise.all([
        fetchConfig<CustomPage[]>('pages', blankContent.pages),
        fetchConfig<CompanyInfo>('site_settings', blankContent.companyInfo),
        fetchConfig<HeaderContent>('header_config', blankContent.header),
        fetchConfig<FooterContent>('footer_config', blankContent.footer),
      ]);

      // adminApp 专门：一次性加载所有的完整页面数据进行匹配
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
        pages: fullPages, // Directly use full pages
      });

      setAllProducts(productsResp.data || []);
      setCategories(categoriesData);

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
  // 商品与分类 (目前核心逻辑)
  // ============================================
  const createProduct = useCallback(async (data: ProductInput) => {
    const p = await api.createProduct(data);
    await refreshData();
    return p;
  }, [refreshData]);

  const updateProduct = useCallback(async (id: number, data: Partial<ProductInput>) => {
    await api.updateProduct(id, data);
    await refreshData();
  }, [refreshData]);

  const deleteProduct = useCallback(async (id: number) => {
    await api.deleteProduct(id);
    setAllProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const createCategory = useCallback(async (data: CategoryInput) => {
    const c = await api.createCategory(data);
    const categoriesData = await api.getCategories();
    setCategories(categoriesData);
    return c;
  }, []);

  const updateCategory = useCallback(async (id: string, data: Partial<CategoryInput>) => {
    await api.updateCategory(id, data);
    const categoriesData = await api.getCategories();
    setCategories(categoriesData);
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await api.deleteCategory(id);
    const categoriesData = await api.getCategories();
    setCategories(categoriesData);
  }, []);

  // ============================================
  // 页面管理 (真正的积木持久化)
  // ============================================
  const updatePage = useCallback(async (pageId: string, pageData: Partial<CustomPage>) => {
    const existingFullPage = content.pages.find(p => p.id === pageId);
    const fullPageToSave = { ...(existingFullPage || {}), ...pageData } as CustomPage;

    // 1. 保存全量数据到 page:[id]
    await api.setConfig(`page:${pageId}`, fullPageToSave);

    // 2. 更新 pages_index 并剔除 blocks
    const updatedPages = content.pages.map(p =>
      p.id === pageId ? { ...p, ...pageData } : p
    );
    const sanitizedIndex = updatedPages.map(p => {
      const { blocks, ...rest } = p;
      return rest as CustomPage;
    });
    await api.setConfig('pages_index', sanitizedIndex);

    // 后同步 State
    setContent(prev => ({ ...prev, pages: updatedPages }));
    toast.success('页面信息已更新');
  }, [content.pages]);

  const addPage = useCallback(async (page: CustomPage) => {
    // 1. 保存全量数据到 page:[id]
    await api.setConfig(`page:${page.id}`, page);

    // 2. 更新 pages_index
    const updatedPages = [...content.pages, page];
    const sanitizedIndex = updatedPages.map(p => {
      const { blocks, ...rest } = p;
      return rest as CustomPage;
    });
    await api.setConfig('pages_index', sanitizedIndex);

    setContent(prev => ({ ...prev, pages: updatedPages }));
    toast.success('已新建页面');
  }, [content.pages]);

  const deletePage = useCallback(async (pageId: string) => {
    // 1. 删除 page:[id]
    await api.deleteConfig(`page:${pageId}`).catch(console.error);

    // 2. 更新 pages_index
    const updatedPages = content.pages.filter(p => p.id !== pageId);
    const sanitizedIndex = updatedPages.map(p => {
      const { blocks, ...rest } = p;
      return rest as CustomPage;
    });
    await api.setConfig('pages_index', sanitizedIndex);

    setContent(prev => ({ ...prev, pages: updatedPages }));
    toast.success('已删除页面');
  }, [content.pages]);

  // ============================================
  // 全局配置管理
  // ============================================
  const updateSiteSettings = useCallback(async (settings: CompanyInfo) => {
    await api.setConfig('site_settings', settings);
    setContent(prev => ({ ...prev, companyInfo: settings }));
    toast.success('公司信息已更新');
  }, []);

  const updateHeader = useCallback(async (header: HeaderContent) => {
    await api.setConfig('header_config', header);
    setContent(prev => ({ ...prev, header }));
    toast.success('导航配置已同步');
  }, []);

  const updateFooter = useCallback(async (footer: FooterContent) => {
    await api.setConfig('footer_config', footer);
    setContent(prev => ({ ...prev, footer }));
    toast.success('页脚配置已同步');
  }, []);

  // ============================================
  // 资源管理
  // ============================================
  const uploadImage = useCallback(async (file: File, dimensions?: { width: number; height: number }) => {
    return api.uploadImage(file, dimensions);
  }, []);

  const getImagesList = useCallback(async () => {
    return api.getImagesList();
  }, []);

  const deleteImage = useCallback(async (key: string) => {
    await api.deleteImage(key);
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        allProducts,
        categories,
        isLoading,
        error,
        refreshData,
        findPage,
        clearError,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        updatePage,
        addPage,
        deletePage,
        updateSiteSettings,
        updateHeader,
        updateFooter,
        uploadImage,
        getImagesList,
        deleteImage,
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
