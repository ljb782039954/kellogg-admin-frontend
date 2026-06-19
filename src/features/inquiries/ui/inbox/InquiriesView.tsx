import { Download, Search, Loader2, Inbox, ChevronRight, CheckCircle2, Clock, User, Mail, Phone, Globe, Building2, Package, Layers, FileText, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InquiriesViewModel, InquiriesActions, InquiryStatus } from '../../model/inquiry.types';

interface InquiriesViewProps {
  viewModel: InquiriesViewModel;
  actions: InquiriesActions;
  onDelete(inquiry: { id: number; name: string }): void;
}

export function InquiriesView({ viewModel, actions, onDelete }: InquiriesViewProps) {
  const { inquiries, selectedInquiry, pendingCount, page, totalPages, total, search, status, isLoading, isFetching, error } = viewModel;

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            客户询盘管理
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-mono">
              当前页 {pendingCount} 条待处理
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">查看并处理来自全球客户的产品询价及合作意向。</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={actions.exportCurrentPage}
            disabled={inquiries.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            批量导出 CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={actions.retry} className="text-red-700 font-medium hover:underline ml-4">重试</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* List Section */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-0 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索姓名、邮箱、公司..."
                value={search}
                onChange={(e) => actions.changeSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
              />
            </div>
            <div className="flex gap-2 p-1 bg-gray-50 rounded-lg">
              {(['all', 'pending', 'processed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => actions.changeStatus(s)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    status === s
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {s === 'all' ? '全部' : s === 'pending' ? '待处理' : '已处理'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400 gap-2">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">加载询盘中...</span>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-300 gap-4">
                <Inbox className="w-12 h-12 stroke-[1.5]" />
                <span className="text-sm font-medium">暂无匹配的询盘数据</span>
              </div>
            ) : (
              inquiries.map((inq) => (
                <motion.div
                  key={inq.id}
                  onClick={() => actions.selectInquiry(inq.id)}
                  className={`p-4 cursor-pointer transition-all hover:bg-gray-50 group relative ${
                    selectedInquiry?.id === inq.id ? 'bg-gray-50 ring-1 ring-inset ring-gray-900/5' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-800 text-sm truncate pr-8">
                      {inq.name}
                    </h3>
                    <div className="flex-shrink-0">
                      {inq.status === 'processed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 truncate mb-2">{inq.company || inq.email}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${selectedInquiry?.id === inq.id ? 'translate-x-1' : ''}`} />
                  </div>
                </motion.div>
              ))
            )}
            {isFetching && !isLoading && (
              <div className="flex justify-center py-3 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>共 {total} 条</span>
              <div className="flex gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => actions.changePage(page - 1)}
                  className="px-2 py-1 rounded border disabled:opacity-30 hover:bg-gray-50"
                >
                  上一页
                </button>
                <span className="px-2 py-1">{page} / {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => actions.changePage(page + 1)}
                  className="px-2 py-1 rounded border disabled:opacity-30 hover:bg-gray-50"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-0 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {selectedInquiry ? (
              <motion.div
                key={selectedInquiry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full overflow-y-auto"
              >
                {/* Detail Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                      {selectedInquiry.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedInquiry.name}</h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 提交于 {new Date(selectedInquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => actions.exportInquiry(selectedInquiry)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm"
                      title="导出个人资料"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    {(['pending', 'processed'] as InquiryStatus[]).map((s) =>
                      s !== selectedInquiry.status && (
                        <button
                          key={s}
                          onClick={() => actions.updateStatus(selectedInquiry.id, s)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                            s === 'processed'
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-amber-500 text-white hover:bg-amber-600'
                          }`}
                        >
                          标记为{s === 'processed' ? '已处理' : '待处理'}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => onDelete(selectedInquiry)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="p-8 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <section>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <User className="w-3 h-3" /> 联系信息
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 group">
                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                              <Mail className="w-4 h-4" />
                            </div>
                            <a href={`mailto:${selectedInquiry.email}`} className="text-sm text-gray-600 hover:text-blue-600 hover:underline">
                              {selectedInquiry.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                              <Phone className="w-4 h-4" />
                            </div>
                            <span className="text-sm text-gray-600">{selectedInquiry.phone || '未提供电话'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                              <Globe className="w-4 h-4" />
                            </div>
                            <span className="text-sm text-gray-600">{selectedInquiry.country || '未标记国家'}</span>
                          </div>
                        </div>
                      </section>
                    </div>

                    <div className="space-y-6">
                      <section>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Building2 className="w-3 h-3" /> 业务背景
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">{selectedInquiry.company || '个人客户'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4" />
                            </div>
                            <div className="text-sm text-gray-600">
                              关注: <span className="font-bold text-gray-900">{selectedInquiry.productType || '通用产品'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div className="text-sm text-gray-600">
                              意向数量: <span className="font-bold text-gray-900">{selectedInquiry.quantity || '面议'}</span>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  <section className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">询盘核心内容</h4>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm italic">
                      "{selectedInquiry.message}"
                    </div>
                  </section>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-12 space-y-6">
                <div className="relative">
                  <Mail className="w-20 h-20 stroke-[1]" />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white"
                  >
                    !
                  </motion.div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-bold text-gray-400">选择一条询盘以查看详情</p>
                  <p className="text-sm text-gray-300">点击左侧列表中的项目，即可在此管理客户需求。</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
