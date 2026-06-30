import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider } from '@/core/context/LanguageContext';
import { ContentProvider } from '@/core/context/ContentContext';

// Admin 组件
// import Login from './site-package/kellogg/Login';
import Dashboard from './site-package/kellogg/Dashboard';
import Overview from './site-package/kellogg/views/Overview';
// import AccountSettings from './site-package/kellogg/AccountSettings';

// 页面管理
import { DynamicPagesManager, PageLayoutEditor } from './site-package/kellogg/pageBuilder';
import ComponentsPreview from './site-package/kellogg/views/BlocksPreview';

// 编辑器
import CompanyInfoEditor from './site-package/kellogg/editors/companyInfo/CompanyInfoEditor';
import HeaderEditor from './site-package/kellogg/editors/headerEditor';
import ProductsEditor from './site-package/kellogg/editors/product/ProductsEditor';
import CategoriesEditor from './site-package/kellogg/editors/product/ProductCategories';
import FooterEditor from './site-package/kellogg/editors/footerEditor/FooterEditor';
import InquiryEditor from './site-package/kellogg/editors/inquiry/InquiryEditor';
import InquiryManagement from './site-package/kellogg/editors/inquiry/InquiryManagement';
import MediaManager from './site-package/kellogg/editors/media/MediaManager';
import BlogManagement from './site-package/kellogg/editors/blog/BlogManagement';
import BlogEditor from './site-package/kellogg/editors/blog/BlogEditor';
import BlogCategoryManager from './site-package/kellogg/editors/blog/BlogCategoryManager';
import CustomerReviewsManagement from './site-package/kellogg/editors/customerReviews/CustomerReviewsManagement';

function App() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Overview />} />

              {/* 页面管理 */}
              <Route path="pages" element={<DynamicPagesManager />} />
              <Route path="pages/:pageId/edit" element={<PageLayoutEditor />} />
              <Route path="components" element={<ComponentsPreview />} />

              {/* 兼容旧路由 */}
              <Route path="page-layout" element={<Navigate to="/pages" replace />} />

              {/* 公司信息和组件管理 */}
              <Route path="company" element={<CompanyInfoEditor />} />
              <Route path="header" element={<HeaderEditor />} />
              <Route path="footer" element={<FooterEditor />} />

              <Route path="products" element={<ProductsEditor />} />
              <Route path="categories" element={<CategoriesEditor />} />
              <Route path="inquiries" element={<InquiryManagement />} />
              <Route path="media" element={<MediaManager />} />
              <Route path="inquiry-editor" element={<InquiryEditor />} />
              {/* Blog Management */}
              <Route path="blog" element={<BlogManagement />} />
              <Route path="blog/new" element={<BlogEditor />} />
              <Route path="blog/:id/edit" element={<BlogEditor />} />
              <Route path="blog-categories" element={<BlogCategoryManager />} />
              <Route path="reviews" element={<CustomerReviewsManagement />} />
              {/* <Route path="account" element={<AccountSettings />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </ContentProvider>
    </LanguageProvider>
  );
}

export default App;

// 修改
