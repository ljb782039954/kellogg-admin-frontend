import { useMemo } from 'react';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';

export interface UsageInfo {
  type: string;
  name: string;
  id?: string;
}

// 递归查找对象中所有的 URL
function findUrlsInObject(obj: any): string[] {
  const urls: string[] = [];
  if (!obj) return urls;
  if (typeof obj === 'string') {
    // 识别包含 assets.kelloggfashion.com 或 uploads/ 路径的 URL
    if (obj.startsWith('http') && (obj.includes('assets.kelloggfashion.com') || obj.includes('uploads/'))) {
      // 提取基础 URL（去除查询参数，如 ?w=300）
      urls.push(obj.split('?')[0]);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => urls.push(...findUrlsInObject(item)));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach(val => urls.push(...findUrlsInObject(val)));
  }
  return urls;
}

export function useImageUsage() {
  const { content, allProducts, categories } = useContent();
  const { t } = useLanguage();

  const usageMap = useMemo(() => {
    const map: Record<string, UsageInfo[]> = {};

    const addUsage = (url: string, usage: UsageInfo) => {
      if (!url || typeof url !== 'string') return;
      const baseUrl = url.split('?')[0];
      if (!map[baseUrl]) map[baseUrl] = [];
      
      // 避免重复记录相同位置
      if (!map[baseUrl].some(u => u.id === usage.id && u.name === usage.name && u.type === usage.type)) {
        map[baseUrl].push(usage);
      }
    };

    // 1. 扫描页面
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

    // 2. 扫描产品
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

    // 3. 扫描分类
    categories.forEach(cat => {
      const catName = typeof cat.name === 'string' ? cat.name : t(cat.name.zh, cat.name.en);
      if (cat.image) addUsage(cat.image, { type: '产品分类', name: catName, id: cat.id });
    });

    // 4. 扫描全局配置
    if (content.companyInfo.logo) addUsage(content.companyInfo.logo, { type: '全局配置', name: '公司 Logo' });
    // if (content.header.logo) addUsage(content.header.logo, { type: '导航栏', name: 'Logo' });
    // if (content.footer.logo) addUsage(content.footer.logo, { type: '页脚', name: 'Logo' });
    
    findUrlsInObject(content.footer).forEach(url => addUsage(url, { type: '页脚内容', name: '页脚配置' }));

    return map;
  }, [content, allProducts, categories, t]);

  return usageMap;
}
