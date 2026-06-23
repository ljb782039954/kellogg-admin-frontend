import { describe, it, expect } from 'vitest';
import { projectPackage } from './index';
import { routes } from './routes';

describe('kellogg projectPackage', () => {
  it('通过 defineProjectPackage 校验（导入即校验，不抛错）', () => {
    expect(projectPackage.identity.key).toBe('kellogg');
  });

  it('路由数量与 routes 模块一致', () => {
    expect(projectPackage.routes).toHaveLength(routes.length);
  });

  it('每个 route.screenId 在 ui.screens 中有实现', () => {
    for (const r of projectPackage.routes) {
      expect(projectPackage.ui.screens[r.screenId]).toBeTypeOf('function');
    }
  });

  it('reviews entity 已接入且引用存在的 screen', () => {
    const reviews = projectPackage.entities.find((e) => e.key === 'reviews');
    expect(reviews).toBeDefined();
    expect(reviews!.screens.list).toBe('reviews');
    expect(projectPackage.ui.screens.reviews).toBeDefined();
  });

  it('blog-categories entity 已接入且引用存在的 screen', () => {
    const entity = projectPackage.entities.find((item) => item.key === 'blog-categories');
    expect(entity).toBeDefined();
    expect(entity!.screens.list).toBe('blog-categories');
    expect(projectPackage.ui.screens['blog-categories']).toBeDefined();
  });

  it('blogs entity 已接入列表与编辑 screen', () => {
    const entity = projectPackage.entities.find((item) => item.key === 'blogs');
    expect(entity).toBeDefined();
    expect(entity!.screens).toEqual({ list: 'blog-list', editor: 'blog-edit' });
    expect(projectPackage.ui.screens['blog-list']).toBeDefined();
    expect(projectPackage.ui.screens['blog-new']).toBeDefined();
    expect(projectPackage.ui.screens['blog-edit']).toBeDefined();
  });

  it('categories entity 已接入且引用存在的 screen', () => {
    const entity = projectPackage.entities.find((item) => item.key === 'categories');
    expect(entity).toBeDefined();
    expect(entity!.screens.list).toBe('categories');
    expect(projectPackage.ui.screens.categories).toBeDefined();
  });

  it('products entity 已接入组合列表与编辑 screen', () => {
    const entity = projectPackage.entities.find((item) => item.key === 'products');
    expect(entity).toBeDefined();
    expect(entity!.screens).toEqual({ list: 'products', editor: 'products' });
    expect(projectPackage.ui.screens.products).toBeDefined();
  });

  it('company-info 配置单例已接入编辑 screen', () => {
    const entity = projectPackage.entities.find((item) => item.key === 'company-info');
    expect(entity).toBeDefined();
    expect(entity!.capabilities).toEqual({ update: true });
    expect(entity!.screens).toEqual({ editor: 'company' });
    expect(projectPackage.ui.screens.company).toBeDefined();
  });

  it('navigation 配置单例已接入 header 编辑 screen', () => {
    const entity = projectPackage.entities.find((item) => item.key === 'navigation');
    expect(entity).toBeDefined();
    expect(entity!.capabilities).toEqual({ update: true });
    expect(entity!.screens).toEqual({ editor: 'header' });
    expect(projectPackage.ui.screens.header).toBeDefined();
  });

  it('footer 配置单例已接入 footer 编辑 screen', () => {
    const entity = projectPackage.entities.find((item) => item.key === 'footer');
    expect(entity).toBeDefined();
    expect(entity!.capabilities).toEqual({ update: true });
    expect(entity!.screens).toEqual({ editor: 'footer' });
    expect(projectPackage.ui.screens.footer).toBeDefined();
  });

  it('pages 配置集合已接入列表与 page-builder screen', () => {
    const entity = projectPackage.entities.find((item) => item.key === 'pages');
    expect(entity).toBeDefined();
    expect(entity!.screens).toEqual({ list: 'pages', editor: 'page-builder' });
    expect(projectPackage.ui.screens.pages).toBeDefined();
    expect(projectPackage.ui.screens['page-builder']).toBeDefined();
  });

  it('inquiries entity 已接入列表 screen，设置页作为独立业务 screen 注册', () => {
    const entity = projectPackage.entities.find((item) => item.key === 'inquiries');
    expect(entity).toBeDefined();
    expect(entity!.screens).toEqual({ list: 'inquiries' });
    expect(projectPackage.ui.screens.inquiries).toBeDefined();
    expect(projectPackage.ui.screens['inquiry-settings']).toBeDefined();
  });

  it('pageBuilder 中每个 Block 都有稳定 preview/editor 实现', () => {
    expect(projectPackage.pageBuilder?.blocks.length).toBeGreaterThan(0);
    for (const block of projectPackage.pageBuilder!.blocks) {
      expect(projectPackage.ui.blockViews[block.previewId]).toBeTypeOf('function');
      expect(projectPackage.ui.blockEditors[block.editorId]).toBeTypeOf('function');
    }
  });
});
