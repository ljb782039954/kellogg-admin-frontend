import {
  ExternalLink,
  FileText,
  ShoppingBag,
  Layers,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '@/core/context/ContentContext';

export default function Overview() {
  const navigate = useNavigate();
  const { allProducts, isLoading, error, refreshData, clearError } = useContent();

  // 快捷入口
  const quickLinks = [
    {
      name: '页面管理',
      description: '管理网站页面和布局',
      path: '/pages',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: '预定义组件',
      description: '查看所有可用组件',
      path: '/components',
      icon: Layers,
      color: 'bg-purple-500',
    },
    {
      name: '产品管理',
      description: `共 ${allProducts.length} 件产品`,
      path: '/products',
      icon: ShoppingBag,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">概览</h1>
          <p className="text-gray-500 mt-1">管理您的网站内容和设置</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="刷新数据"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            查看网站
          </a>
        </div>
      </div>

      {/* 提示当前连接的是否是线上环境 */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">当前连接环境:</h3>
        <p className="text-sm text-blue-700">
          {import.meta.env.VITE_IS_LOCAL_DEV === "true" ? '本地开发环境' : '线上正式生产环境'}
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-red-800">加载数据失败</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              重试
            </button>
            <button
              onClick={clearError}
              className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          <p className="text-blue-700">正在从服务器加载数据...</p>
        </div>
      )}

      {/* 快捷入口 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">快捷入口</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">使用提示</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• 所有更改会自动保存到服务器</li>
          <li>• 文本内容需要同时输入中英文，以支持语言切换</li>
          <li>• 在「页面管理」中可以编辑各个页面的布局和组件</li>
          <li>• 在「预定义组件」中可以预览所有可用的组件效果</li>
          <li>• 点击右上角的语言按钮可以预览不同语言的显示效果</li>
          <li>• 如果数据加载失败，请检查 API 服务是否正常运行</li>
        </ul>
      </div>

      {/* API 状态提示 */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : isLoading ? 'bg-yellow-500' : 'bg-green-500'}`} />
            <span className="text-sm text-gray-600">
              API 状态：{error ? '连接失败' : isLoading ? '加载中' : '已连接'}
            </span>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'}
          </span>
        </div>
      </div>
    </div>
  );
}
