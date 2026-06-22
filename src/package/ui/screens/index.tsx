import React, { type ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';

import Overview from '@/admin/Overview';
import BlocksPreview from '@/admin/BlocksPreview';
import DefaultPageBuilderRoute from '@/app/adapters/page-builder/DefaultPageBuilderRoute';
import { PagesManager } from '@/features/pages';
import { InquiriesManager, InquirySettingsEditor } from '@/features/inquiries';
import { BlogCategoriesScreen } from './blog-categories';
import { BlogEditorScreen, BlogsScreen } from './blogs';
import { CategoriesScreen } from './categories';
import { CompanyInfoScreen } from './company-info';
import { FooterScreen } from './footer';
import { MediaScreen } from './media';
import { NavigationScreen } from './navigation';
import { PageLayoutRedirect } from './PageLayoutRedirect';
import { ProductsScreen } from './products';
import { ReviewsScreen } from './reviews';

/** 迁移期薄包装器：委托给现有 feature/admin 组件；2c 将逐个替换为 package 内真身。 */
const wrap = (Component: ComponentType): ComponentType<AdminScreenProps> => {
  function Screen() {
    return React.createElement(Component);
  }
  return Screen;
};

export const screens: Record<string, ComponentType<AdminScreenProps>> = {
  dashboard: wrap(Overview),
  company: CompanyInfoScreen,
  header: NavigationScreen,
  footer: FooterScreen,
  components: wrap(BlocksPreview),
  pages: wrap(PagesManager),
  'page-builder': wrap(DefaultPageBuilderRoute),
  media: MediaScreen,
  'blog-list': BlogsScreen,
  'blog-new': BlogEditorScreen,
  'blog-edit': BlogEditorScreen,
  'blog-categories': BlogCategoriesScreen,
  products: ProductsScreen,
  categories: CategoriesScreen,
  inquiries: wrap(InquiriesManager),
  'inquiry-settings': wrap(InquirySettingsEditor),
  reviews: ReviewsScreen,
  'page-layout-redirect': PageLayoutRedirect,
};
