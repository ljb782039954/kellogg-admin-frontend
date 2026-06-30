import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Search,
  Youtube,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { getYoutubeThumbnailUrl, useCustomerReviewsManagement } from '@/core/items/review';
import ReviewFormDialog from './ReviewFormDialog';
import StarDisplay from './starDisplay';

const STATUS_LABELS = {
  published: { label: '已发布', cls: 'bg-green-100 text-green-700' },
  draft: { label: '草稿', cls: 'bg-gray-100 text-gray-500' },
};

export default function CustomerReviewsManagement() {
  const notify = useMemo(() => ({
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
  }), []);
  const {
    dialogOpen,
    editingReview,
    isLoading,
    page,
    reviews,
    searchTerm,
    statusFilter,
    total,
    totalPages,
    closeDialog,
    fetchReviews,
    handleDelete,
    handleToggleStatus,
    openCreate,
    openEdit,
    setPage,
    updateSearchTerm,
    updateStatusFilter,
  } = useCustomerReviewsManagement({
    confirmDelete: message => window.confirm(message),
    notify,
    pageSize: 15,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            客户评价管理
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-mono">
              {total} 条
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            管理客户评价，支持 YouTube 视频嵌入和成衣图片展示。
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-all font-medium shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          新增评价
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索客户名称、国家..."
            value={searchTerm}
            onChange={e => updateSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {(['all', 'published', 'draft'] as const).map(s => (
            <button
              key={s}
              onClick={() => updateStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                statusFilter === s
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {s === 'all' ? '全部' : STATUS_LABELS[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-300 gap-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">加载中...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-300 gap-4">
            <Star className="w-14 h-14 stroke-[1.2]" />
            <div className="text-center">
              <p className="text-base font-semibold text-gray-400">暂无评价</p>
              <p className="text-sm mt-1">点击右上角「新增评价」开始录入客户评价</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">媒体</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">客户信息</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-28">评分</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">状态</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">排序</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-32">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence initial={false}>
                  {reviews.map(review => (
                    <motion.tr
                      key={review.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Media Preview */}
                      <td className="px-5 py-3">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                          {review.media_type === 'video' ? (
                            <>
                              {/* YouTube thumbnail */}
                              {(() => {
                                const thumbnail = getYoutubeThumbnailUrl(review.media_url, 'default');
                                return thumbnail ? (
                                  <img
                                    src={thumbnail}
                                    alt={review.client_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Youtube className="w-5 h-5 text-red-500" />
                                  </div>
                                );
                              })()}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-5 h-5 bg-red-600/80 rounded-full flex items-center justify-center shadow-lg">
                                  <svg className="w-2.5 h-2.5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              </div>
                            </>
                          ) : review.media_url ? (
                            <img
                              src={review.media_url}
                              alt={review.client_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Client Info */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{review.client_name}</p>
                        {review.country && (
                          <p className="text-xs text-gray-400 mt-0.5">{review.country}</p>
                        )}
                        <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                          {review.review_text_en.replace(/<[^>]+>/g, '')}
                        </p>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3">
                        <StarDisplay rating={review.rating} />
                        <span className="text-xs text-gray-400 mt-1 block">{review.rating.toFixed(1)}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_LABELS[review.status]?.cls}`}>
                          {STATUS_LABELS[review.status]?.label}
                        </span>
                      </td>

                      {/* Sort Order */}
                      <td className="px-4 py-3 text-gray-500 text-xs font-mono">{review.sort_order}</td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleStatus(review)}
                            title={review.status === 'published' ? '下架为草稿' : '发布'}
                            className={`p-1.5 rounded-lg transition-all ${
                              review.status === 'published'
                                ? 'text-green-500 hover:bg-green-50 hover:text-green-700'
                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            }`}
                          >
                            {review.status === 'published' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEdit(review)}
                            title="编辑"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(review)}
                            title="删除"
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
              第 {page} / {totalPages} 页，共 {total} 条
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

      {/* Dialog */}
      {dialogOpen && (
        <ReviewFormDialog
          review={editingReview}
          onClose={closeDialog}
          onSaved={fetchReviews}
        />
      )}
    </div>
  );
}
