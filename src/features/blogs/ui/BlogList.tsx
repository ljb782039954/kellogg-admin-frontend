import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  BarChart2,
  Tag,
  Globe,
  BookOpen,
} from 'lucide-react';
import type { Blog } from '@/types';
import AdminImage from '@/admin/components/AdminImage';

const STATUS_LABELS = {
  draft: { label: '草稿', class: 'bg-gray-100 text-gray-500' },
  published: { label: '已发布', class: 'bg-green-100 text-green-700' },
  archived: { label: '已下架', class: 'bg-red-100 text-red-500' },
};

interface BlogListProps {
  blogs: Blog[];
  onDelete: (blog: Blog) => void;
  onToggleStatus: (blog: Blog) => void;
}

export function BlogList({ blogs, onDelete, onToggleStatus }: BlogListProps) {
  const navigate = useNavigate();

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-300 gap-4">
        <BookOpen className="w-14 h-14 stroke-[1.2]" />
        <div className="text-center">
          <p className="text-base font-semibold text-gray-400">暂无文章</p>
          <p className="text-sm mt-1">点击右上角「写新文章」开始创作</p>
        </div>
      </div>
    );
  }

  return (
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
            {blogs.map((blog) => (
              <motion.tr
                key={blog.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <AdminImage
                      src={blog.cover_image}
                      thumbnail={true}
                      alt={blog.title_zh}
                      className="w-full h-full object-cover"
                      fallback={
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-gray-300" />
                        </div>
                      }
                    />
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-gray-800 line-clamp-1">{blog.title_zh}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{blog.title_en}</p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-md font-medium"
                          >
                            <Tag className="w-2.5 h-2.5" />{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {blog.category ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-lg font-medium">
                      <Globe className="w-3 h-3" />{blog.category}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_LABELS[blog.status]?.class}`}
                  >
                    {STATUS_LABELS[blog.status]?.label}
                  </span>
                </td>

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

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <BarChart2 className="w-3 h-3" />
                    {blog.view_count.toLocaleString()}
                  </div>
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onToggleStatus(blog)}
                      title={blog.status === 'published' ? '下架为草稿' : '立即发布'}
                      className={`p-1.5 rounded-lg transition-all ${
                        blog.status === 'published'
                          ? 'text-green-500 hover:bg-green-50 hover:text-green-700'
                          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                      }`}
                    >
                      {blog.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => navigate(`/blog/${blog.id}/edit`)}
                      title="编辑文章"
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDelete(blog)}
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
  );
}
