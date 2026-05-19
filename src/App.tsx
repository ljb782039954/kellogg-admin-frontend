import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider } from './context/LanguageContext';
import { ContentProvider } from './context/ContentContext';

// Admin 组件
// import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import Overview from './admin/Overview';
// import AccountSettings from './admin/AccountSettings';

// 页面管理
import { DynamicPagesManager, PageLayoutEditor } from './admin/pageBuilder';
import ComponentsPreview from './admin/BlocksPreview';

// 编辑器
import CompanyInfoEditor from './admin/editors/CompanyInfoEditor';
import HeaderEditor from './admin/editors/headerEditor';
import ProductsEditor from './admin/editors/ProductsEditor';
import CategoriesEditor from './admin/editors/CategoriesEditor';
import FooterEditor from './admin/editors/FooterEditor';
import InquiryEditor from './admin/editors/InquiryEditor';
import InquiryManagement from './admin/InquiryManagement';
import MediaManager from './admin/MediaManager';
import BlogManagement from './admin/BlogManagement';
import BlogEditor from './admin/BlogEditor';
import BlogCategoryManager from './admin/BlogCategoryManager';

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
