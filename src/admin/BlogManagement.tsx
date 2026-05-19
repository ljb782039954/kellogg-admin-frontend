import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Tag,
  Calendar,
  User,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { Blog } from '@/types';

const STATUS_LABELS = {
  draft: { label: '草稿', class: 'bg-gray-100 text-gray-500' },
  published: { label: '已发布', class: 'bg-green-100 text-green-700' },
  archived: { label: '已下架', class: 'bg-red-100 text-red-500' },
};

const CATEGORY_OPTIONS = [
  'All',
  'Industry News',
  'Fabric Guide',
  'OEM Tips',
  'Trend Report',
  'Company News',
];

export default function BlogManagement() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 10;

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { page, pageSize: PAGE_SIZE };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      const resp = await api.getBlogs(params);
      setBlogs(resp.data || []);
      setTotalPages(resp.pagination?.totalPages || 1);
      setTotal(resp.pagination?.total || 0);
    } catch {
      toast.error('无法加载博客列表');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (blog: Blog) => {
    if (!confirm(`确定要永久删除「${blog.title_zh}」吗？此操作不可撤销。`)) return;
    try {
      await api.deleteBlog(blog.id);
      toast.success('文章已删除');
      fetchBlogs();
    } catch {
      toast.error('删除失败，请重试');
    }
  };

  const handleToggleStatus = async (blog: Blog) => {
    const nextStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      await api.updateBlog(blog.id, { status: nextStatus });
      toast.success(nextStatus === 'published' ? '已发布' : '已下架为草稿');
      setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, status: nextStatus } : b));
    } catch {
      toast.error('状态切换失败');
    }
  };

  // Client-side search filter (over current page)
  const filtered = blogs.filter(b => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      b.title_zh.toLowerCase().includes(q) ||
      b.title_en.toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {CATEGORY_OPTIONS.map(cat => (
          <button
            key={cat}
            onClick={() => { setCategoryFilter(cat); setPage(1); }}
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

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索标题、分类..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {(['all', 'draft', 'published', 'archived'] as const).map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                statusFilter === s
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {s === 'all' ? '全部' : STATUS_LABELS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-300 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">正在加载文章...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-300 gap-4">
            <FileText className="w-14 h-14 stroke-[1.2]" />
            <div className="text-center">
              <p className="text-base font-semibold text-gray-400">暂无文章</p>
              <p className="text-sm mt-1">点击右上角「写新文章」开始创作</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">封面</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">标题</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">分类</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">状态</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">发布日期</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">阅读数</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-36">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence initial={false}>
                  {filtered.map(blog => (
                    <motion.tr
                      key={blog.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Cover */}
                      <td className="px-5 py-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {blog.cover_image ? (
                            <img
                              src={blog.cover_image}
                              alt={blog.title_zh}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">{blog.title_zh}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{blog.title_en}</p>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {blog.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-md font-medium">
                                  <Tag className="w-2.5 h-2.5" />{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        {blog.category ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-lg font-medium">
                            <Globe className="w-3 h-3" />{blog.category}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_LABELS[blog.status]?.class}`}>
                          {STATUS_LABELS[blog.status]?.label}
                        </span>
                      </td>

                      {/* Publish Date */}
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {blog.publish_date
                            ? new Date(blog.publish_date).toLocaleDateString('zh-CN')
                            : new Date(blog.created_at).toLocaleDateString('zh-CN')}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400">
                          <User className="w-2.5 h-2.5" />{blog.author}
                        </div>
                      </td>

                      {/* Views */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <BarChart2 className="w-3 h-3" />
                          {blog.view_count.toLocaleString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle publish/draft */}
                          <button
                            onClick={() => handleToggleStatus(blog)}
                            title={blog.status === 'published' ? '下架为草稿' : '立即发布'}
                            className={`p-1.5 rounded-lg transition-all ${
                              blog.status === 'published'
                                ? 'text-green-500 hover:bg-green-50 hover:text-green-700'
                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            }`}
                          >
                            {blog.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => navigate(`/blog/${blog.id}/edit`)}
                            title="编辑文章"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(blog)}
                            title="删除文章"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/30">
            <span className="text-xs text-gray-400">
              第 {page} / {totalPages} 页，共 {total} 篇
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
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
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-sm rounded-lg transition-all ${
                      p === page ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
