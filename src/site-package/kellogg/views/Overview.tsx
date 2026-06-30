import {
  ExternalLink,
  FileText,
  ShoppingBag,
  Layers,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useContent } from '@/core/context/ContentContext';

export default function Overview() {
  const { allProducts, allBlogs , allReviews ,isLoading, error, refreshData, clearError } = useContent();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">概览</h1>
          <p className="text-gray-500 mt-1">管理您的网站内容和设置</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={refreshData}
            disabled={isLoading}
            variant="secondary"
            title="刷新数据"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              查看网站
            </a>
          </Button>
        </div>
      </div>

      {/* 提示当前连接的是否是线上环境 */}
      <Alert className='gap-3'>
        <AlertTitle className='text-gray-500'>当前连接环境:</AlertTitle>
        <AlertDescription className='text-blue-500'>
          {import.meta.env.VITE_IS_LOCAL_DEV === "true" ? '本地开发环境' : '线上正式生产环境'}
        </AlertDescription>
      </Alert>

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-5 h-5" />
          <AlertTitle>加载数据失败</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <span className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={refreshData}>重试</Button>
              <Button variant="ghost" size="sm" onClick={clearError}>关闭</Button>
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <Alert>
          <Loader2 className="w-5 h-5 animate-spin" />
          <AlertDescription>正在从服务器加载数据...</AlertDescription>
        </Alert>
      )}

      {/* 显示统计数据：有多少产品、博文、询盘 */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardTitle className="flex items-center gap-3 p-6 pb-0">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
              产品
            </CardTitle>
            <p className="text-3xl font-bold text-gray-900 px-6 pb-6 pt-2">{allProducts?.length ?? 0}</p>
          </Card>
          <Card>
            <CardTitle className="flex items-center gap-3 p-6 pb-0">
              <FileText className="w-5 h-5 text-green-500" />
              博文
            </CardTitle>
            <p className="text-3xl font-bold text-gray-900 px-6 pb-6 pt-2">{allBlogs?.length ?? 0}</p>
          </Card>
          <Card>
            <CardTitle className="flex items-center gap-3 p-6 pb-0">
              <Layers className="w-5 h-5 text-purple-500" />
              询盘
            </CardTitle>
            <p className="text-3xl font-bold text-gray-900 px-6 pb-6 pt-2">{allReviews?.length ?? 0}</p>
          </Card>
        </div>
      )}

      {/* Quick Tips */}
      <Card>
        <CardTitle className="p-6 pb-0 text-blue-900">使用提示</CardTitle>
        <ul className="space-y-2 text-sm p-6 pt-3 text-blue-700">
          <li>• 所有更改会自动保存到服务器</li>
          <li>• 文本内容需要同时输入中英文，以支持语言切换</li>
          <li>• 在「页面管理」中可以编辑各个页面的布局和组件</li>
          <li>• 在「预定义组件」中可以预览所有可用的组件效果</li>
          <li>• 点击右上角的语言按钮可以预览不同语言的显示效果</li>
          <li>• 如果数据加载失败，请检查 API 服务是否正常运行</li>
        </ul>
      </Card>

      {/* API 状态提示 */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : isLoading ? 'bg-yellow-500' : 'bg-green-500'}`} />
            <span className="text-sm text-muted-foreground">
              API 状态：{error ? '连接失败' : isLoading ? '加载中' : '已连接'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'}
          </span>
        </div>
      </Card>
    </div>
  );
}
