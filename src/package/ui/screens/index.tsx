import React, { type ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import type { AdminScreenProps } from '@/core/contracts';

import Overview from '@/admin/Overview';
import BlocksPreview from '@/admin/BlocksPreview';
import DefaultPageBuilderRoute from '@/app/adapters/page-builder/DefaultPageBuilderRoute';
import { CompanyInfoEditor } from '@/features/company-info';
import { NavigationEditor } from '@/features/navigation';
import { FooterEditor } from '@/features/footer';
import { PagesManager } from '@/features/pages';
import { MediaManager } from '@/features/media';
import { BlogsManager, BlogEditor } from '@/features/blogs';
import { BlogCategoriesManager } from '@/features/blog-categories';
import { ProductsEditor } from '@/features/products';
import { CategoriesEditor } from '@/features/categories';
import { InquiriesManager, InquirySettingsEditor } from '@/features/inquiries';
import { ReviewsManager } from '@/features/reviews';

/** 迁移期薄包装器：委托给现有 feature/admin 组件；2c 将逐个替换为 package 内真身。 */
const wrap = (Component: ComponentType): ComponentType<AdminScreenProps> => {
  function Screen(_props: AdminScreenProps) {
    return React.createElement(Component);
  }
  return Screen;
};

function PageLayoutRedirect() {
  return <Navigate to="/pages" replace />;
}

export const screens: Record<string, ComponentType<AdminScreenProps>> = {
  dashboard: wrap(Overview),
  company: wrap(CompanyInfoEditor),
  header: wrap(NavigationEditor),
  footer: wrap(FooterEditor),
  components: wrap(BlocksPreview),
  pages: wrap(PagesManager),
  'page-builder': wrap(DefaultPageBuilderRoute),
  media: wrap(MediaManager),
  'blog-list': wrap(BlogsManager),
  'blog-new': wrap(BlogEditor),
  'blog-edit': wrap(BlogEditor),
  'blog-categories': wrap(BlogCategoriesManager),
  products: wrap(ProductsEditor),
  categories: wrap(CategoriesEditor),
  inquiries: wrap(InquiriesManager),
  'inquiry-settings': wrap(InquirySettingsEditor),
  reviews: wrap(ReviewsManager),
  'page-layout-redirect': PageLayoutRedirect,
};
