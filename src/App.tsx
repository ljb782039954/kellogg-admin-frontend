import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider } from '@/core/context/LanguageContext';
import { ContentProvider } from '@/core/context/ContentContext';

// Admin 组件
// import Login from '@site/Login';
import Dashboard from '@site/Dashboard';
import Overview from '@site/views/Overview';
// import AccountSettings from '@site/AccountSettings';

// 页面管理
import { DynamicPagesManager, PageLayoutEditor } from '@site/Management/pageBuilder';
import ComponentsPreview from '@site/views/BlocksPreview';

// 编辑器
import CompanyInfoEditor from '@site/Management/companyInfo/CompanyInfoEditor';
import HeaderEditor from '@site/Management/header';
import ProductsEditor from '@site/Management/product/ProductsEditor';
import CategoriesEditor from '@site/Management/product/ProductCategories';
import FooterEditor from '@site/Management/footer/FooterEditor';
import InquiryEditor from '@site/Management/inquiry/InquiryEditor';
import InquiryManagement from '@site/Management/inquiry/InquiryManagement';
import MediaManager from '@site/Management/media/MediaManager';
import BlogManagement from '@site/Management/blog/BlogManagement';
import BlogEditor from '@site/Management/blog/BlogEditor';
import BlogCategoryManager from '@site/Management/blog/BlogCategoryManager';
import CustomerReviewsManagement from '@site/Management/customerReviews/CustomerReviewsManagement';

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
