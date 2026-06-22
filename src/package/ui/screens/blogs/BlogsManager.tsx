import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 model，P4 提取到 core 后删除。
import { useBlogsManager } from '@/features/blogs/model/useBlogsManager';
import { BlogList } from './BlogList';

const CATEGORY_OPTIONS = ['All', 'Industry News', 'Fabric Guide', 'OEM Tips', 'Trend Report', 'Company News'];

const STATUS_LABELS = {
  all: '全部',
  draft: '草稿',
  published: '已发布',
  archived: '已下架',
};

export function BlogsManager() {
  const navigate = useNavigate();
  const {
    blogs,
    isLoading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategory,
    statusFilter,
    setStatus,
    page,
    totalPages,
    total,
    nextPage,
    prevPage,
    goToPage,
    removeBlog,
    toggleStatus,
  } = useBlogsManager();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            博客文章管理
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-mono">
              {total} 篇
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">管理所有博客文章，支持多语言内容编辑与 SEO 配置。</p>
        </div>
        <button
          onClick={() => navigate('/blog/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-all font-medium shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          写新文章
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索标题、分类..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {(['all', 'draft', 'published', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                statusFilter === s
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-300 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">正在加载文章...</span>
          </div>
        ) : (
          <BlogList blogs={blogs} onDelete={removeBlog} onToggleStatus={toggleStatus} />
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/30">
            <span className="text-xs text-gray-400">
              第 {page} / {totalPages} 页，共 {total} 篇
            </span>
            <div className="flex gap-1">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-8 h-8 text-sm rounded-lg transition-all ${
                      p === page ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={nextPage}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
