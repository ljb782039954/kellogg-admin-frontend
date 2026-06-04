import { useMemo } from 'react';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';

export interface UsageInfo {
  type: string;
  name: string;
  id?: string;
}

// Normalize URL or image path to key format (e.g. 'uploads/xxxx.png')
export function normalizeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.split('?')[0];
  const idx = cleanUrl.indexOf('uploads/');
  if (idx !== -1) {
    return cleanUrl.substring(idx);
  }
  return cleanUrl;
}

// Recursively find all image keys/paths in an object
function findUrlsInObject(obj: any): string[] {
  const urls: string[] = [];
  if (!obj) return urls;
  if (typeof obj === 'string') {
    // Match paths containing 'uploads/' (handles relative, absolute, markdown, HTML, etc.)
    const regex = /(?:https?:\/\/[^\s"'()<>]+)?\/?uploads\/[^\s"'()<>]+/g;
    const matches = obj.match(regex);
    if (matches) {
      matches.forEach(match => {
        const normalized = normalizeImageUrl(match);
        if (normalized) {
          urls.push(normalized);
        }
      });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => urls.push(...findUrlsInObject(item)));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach(val => urls.push(...findUrlsInObject(val)));
  }
  return urls;
}

export function useImageUsage() {
  const { content, allProducts, categories, allBlogs, allReviews } = useContent();
  const { t } = useLanguage();

  const usageMap = useMemo(() => {
    const map: Record<string, UsageInfo[]> = {};

    const addUsage = (keyOrUrl: string, usage: UsageInfo) => {
      if (!keyOrUrl || typeof keyOrUrl !== 'string') return;
      const cleanKey = normalizeImageUrl(keyOrUrl);
      if (!cleanKey) return;
      
      if (!map[cleanKey]) map[cleanKey] = [];
      
      // Avoid duplicate entries
      if (!map[cleanKey].some(u => u.id === usage.id && u.name === usage.name && u.type === usage.type)) {
        map[cleanKey].push(usage);
      }
    };

    // 1. Scan pages
    content.pages.forEach(page => {
      const pageTitle = typeof page.title === 'string' ? page.title : t(page.title.zh, page.title.en);
      
      page.blocks.forEach(block => {
        const urls = findUrlsInObject(block.content);
        urls.forEach(url => addUsage(url, { 
          type: '页面区块', 
          name: `${pageTitle} - ${block.type}`, 
          id: page.id 
        }));
      });

      if (page.seo) {
        const seoTitle = page.seo.title ? (typeof page.seo.title === 'string' ? page.seo.title : t(page.seo.title.zh, page.seo.title.en)) : pageTitle;
        findUrlsInObject(page.seo).forEach(url => addUsage(url, { 
          type: '页面 SEO', 
          name: seoTitle, 
          id: page.id 
        }));
      }
    });

    // 2. Scan products
    allProducts.forEach(prod => {
      const prodName = typeof prod.name === 'string' ? prod.name : t(prod.name.zh, prod.name.en);
      
      if (prod.image) addUsage(prod.image, { type: '产品主图', name: prodName, id: prod.id.toString() });
      
      const gallery = Array.isArray(prod.images) ? prod.images : [];
      gallery.forEach(url => addUsage(url, { type: '产品图集', name: prodName, id: prod.id.toString() }));

      if (prod.sizes) {
        prod.sizes.forEach(s => { 
          if (s.image) addUsage(s.image, { type: '产品变体', name: `${prodName} - ${s.name}`, id: prod.id.toString() }); 
        });
      }
      if (prod.colors) {
        prod.colors.forEach(c => { 
          const colorName = typeof c.name === 'string' ? c.name : t(c.name.zh, c.name.en);
          if (c.image) addUsage(c.image, { type: '产品变体', name: `${prodName} - ${colorName}`, id: prod.id.toString() }); 
        });
      }
      if (prod.videos) {
        prod.videos.forEach(v => addUsage(v, { type: '产品视频', name: prodName, id: prod.id.toString() }));
      }
    });

    // 3. Scan categories
    categories.forEach(cat => {
      const catName = typeof cat.name === 'string' ? cat.name : t(cat.name.zh, cat.name.en);
      if (cat.image) addUsage(cat.image, { type: '产品分类', name: catName, id: cat.id });
    });

    // 4. Scan blogs
    allBlogs.forEach(blog => {
      const blogTitle = blog.title_zh || blog.title_en || 'Untitled Blog';
      const urls = findUrlsInObject(blog);
      urls.forEach(url => addUsage(url, {
        type: '博客文章',
        name: blogTitle,
        id: blog.id.toString()
      }));
    });

    // 5. Scan customer reviews
    allReviews.forEach(rev => {
      const clientName = rev.client_name || 'Anonymous';
      const urls = findUrlsInObject(rev);
      urls.forEach(url => addUsage(url, {
        type: '客户评价',
        name: `${clientName} 的评价`,
        id: rev.id.toString()
      }));
    });

    // 6. Scan global site settings
    if (content.companyInfo.logo) addUsage(content.companyInfo.logo, { type: '全局配置', name: '公司 Logo' });
    
    findUrlsInObject(content.footer).forEach(url => addUsage(url, { type: '页脚内容', name: '页脚配置' }));

    return map;
  }, [content, allProducts, categories, allBlogs, allReviews, t]);

  return usageMap;
}
