import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Download, 
  FileText, 
  Search,
  Mail,
  Phone,
  Globe,
  Building2,
  Package,
  Layers,
  Loader2,
  ChevronRight,
  User
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  company: string | null;
  product_type: string | null;
  quantity: string | null;
  message: string | null;
  status: 'pending' | 'processed';
  created_at: string;
}

export default function InquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processed'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const resp = await api.getInquiries();
      setInquiries(resp.data || []);
    } catch (err) {
      toast.error('无法获取询盘数据');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: 'pending' | 'processed') => {
    try {
      await api.patchInquiry(id, { status });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
      toast.success(status === 'processed' ? '已标记为已处理' : '已还原为待处理');
    } catch (err) {
      toast.error('更新状态失败');
    }
  };

  const deleteInquiry = async (id: number) => {
    if (!confirm('确定要删除这条询盘吗？此操作不可撤销。')) return;
    try {
      await api.deleteInquiry(id);
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
      toast.success('已删除询盘');
    } catch (err) {
      toast.error('删除失败');
    }
  };

  const exportToTxt = (inq: Inquiry) => {
    const content = `
Inquiry Details
----------------
ID: ${inq.id}
Time: ${new Date(inq.created_at).toLocaleString()}
Status: ${inq.status}

Contact:
- Name: ${inq.name}
- Email: ${inq.email}
- Phone: ${inq.phone || 'N/A'}
- Country: ${inq.country || 'N/A'}
- Company: ${inq.company || 'N/A'}

Request:
- Product Type: ${inq.product_type || 'N/A'}
- Quantity: ${inq.quantity || 'N/A'}

Message:
${inq.message}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inquiry_${inq.id}_${inq.name}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAllToCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Country', 'Company', 'Product Type', 'Quantity', 'Status', 'Date', 'Message'];
    const rows = filteredInquiries.map(inq => [
      inq.id,
      `"${inq.name}"`,
      inq.email,
      inq.phone || '',
      inq.country || '',
      `"${inq.company || ''}"`,
      `"${inq.product_type || ''}"`,
      inq.quantity || '',
      inq.status,
      new Date(inq.created_at).toLocaleString(),
      `"${(inq.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inquiries_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('导出成功');
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inq.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            客户询盘管理
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-mono">
              {inquiries.filter(i => i.status === 'pending').length} 待处理
            </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">查看并处理来自全球客户的产品询价及合作意向。</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportAllToCsv}
            disabled={filteredInquiries.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            批量导出 CSV
          </button>
        </div>
      </div>

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
              />
            </div>
            <div className="flex gap-2 p-1 bg-gray-50 rounded-lg">
              {(['all', 'pending', 'processed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    statusFilter === s 
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
            ) : filteredInquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-300 gap-4">
                <Inbox className="w-12 h-12 stroke-[1.5]" />
                <span className="text-sm font-medium">暂无匹配的询盘数据</span>
              </div>
            ) : (
              filteredInquiries.map((inq) => (
                <motion.div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
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
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${selectedInquiry?.id === inq.id ? 'translate-x-1' : ''}`} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
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
                        <Clock className="w-3 h-3" /> 提交于 {new Date(selectedInquiry.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportToTxt(selectedInquiry)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 shadow-sm"
                      title="导出个人资料"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    {(['pending', 'processed'] as const).map(s => (
                      s !== selectedInquiry.status && (
                        <button
                          key={s}
                          onClick={() => updateStatus(selectedInquiry.id, s)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                            s === 'processed' 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-amber-500 text-white hover:bg-amber-600'
                          }`}
                        >
                          标记为{s === 'processed' ? '已处理' : '待处理'}
                        </button>
                      )
                    ))}
                    <button
                      onClick={() => deleteInquiry(selectedInquiry.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="p-8 space-y-10">
                  {/* Summary Grid */}
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
                              关注: <span className="font-bold text-gray-900">{selectedInquiry.product_type || '通用产品'}</span>
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

                  {/* Message Body */}
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
