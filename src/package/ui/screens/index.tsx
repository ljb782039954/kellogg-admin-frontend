import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';

import { BlogCategoriesScreen } from './blog-categories';
import { BlogEditorScreen, BlogsScreen } from './blogs';
import { CategoriesScreen } from './categories';
import { CompanyInfoScreen } from './company-info';
import { ComponentsPreviewScreen } from './components';
import { DashboardScreen } from './dashboard';
import { FooterScreen } from './footer';
import { InquiriesScreen, InquirySettingsScreen } from './inquiries';
import { MediaScreen } from './media';
import { NavigationScreen } from './navigation';
import { PageBuilderScreen } from './page-builder';
import { PageLayoutRedirect } from './PageLayoutRedirect';
import { PagesScreen } from './pages';
import { ProductsScreen } from './products';
import { ReviewsScreen } from './reviews';

export const screens: Record<string, ComponentType<AdminScreenProps>> = {
  dashboard: DashboardScreen,
  company: CompanyInfoScreen,
  header: NavigationScreen,
  footer: FooterScreen,
  components: ComponentsPreviewScreen,
  pages: PagesScreen,
  'page-builder': PageBuilderScreen,
  media: MediaScreen,
  'blog-list': BlogsScreen,
  'blog-new': BlogEditorScreen,
  'blog-edit': BlogEditorScreen,
  'blog-categories': BlogCategoriesScreen,
  products: ProductsScreen,
  categories: CategoriesScreen,
  inquiries: InquiriesScreen,
  'inquiry-settings': InquirySettingsScreen,
  reviews: ReviewsScreen,
  'page-layout-redirect': PageLayoutRedirect,
};
