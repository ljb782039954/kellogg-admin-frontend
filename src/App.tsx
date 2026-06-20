import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider } from './context/LanguageContext';

import Dashboard from './admin/Dashboard';
import Overview from './admin/Overview';

// 页面管理
import { PagesManager } from '@/features/pages';
import DefaultPageBuilderRoute from '@/app/adapters/page-builder/DefaultPageBuilderRoute';
import ComponentsPreview from './admin/BlocksPreview';

// 编辑器
import { CompanyInfoEditor } from '@/features/company-info';
import { NavigationEditor } from '@/features/navigation';
import { CategoriesEditor } from '@/features/categories';
import { FooterEditor } from '@/features/footer';
import { ProductsEditor } from '@/features/products';
import { InquiriesManager, InquirySettingsEditor } from '@/features/inquiries';
import { MediaManager } from '@/features/media';
import { BlogsManager, BlogEditor } from '@/features/blogs';
import { BlogCategoriesManager } from '@/features/blog-categories';
import { ReviewsManager } from '@/features/reviews';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Overview />} />

            <Route path="pages" element={<PagesManager />} />
            <Route path="pages/:pageId/edit" element={<DefaultPageBuilderRoute />} />
            <Route path="components" element={<ComponentsPreview />} />
            <Route path="page-layout" element={<Navigate to="/pages" replace />} />

            <Route path="company" element={<CompanyInfoEditor />} />
            <Route path="header" element={<NavigationEditor />} />
            <Route path="footer" element={<FooterEditor />} />
            <Route path="products" element={<ProductsEditor />} />
            <Route path="categories" element={<CategoriesEditor />} />
            <Route path="inquiries" element={<InquiriesManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="inquiry-editor" element={<InquirySettingsEditor />} />
            <Route path="blog" element={<BlogsManager />} />
            <Route path="blog/new" element={<BlogEditor />} />
            <Route path="blog/:id/edit" element={<BlogEditor />} />
            <Route path="blog-categories" element={<BlogCategoriesManager />} />
            <Route path="reviews" element={<ReviewsManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </LanguageProvider>
  );
}

export default App;
