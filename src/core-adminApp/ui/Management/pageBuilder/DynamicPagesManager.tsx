// 动态页面管理 - 页面列表视图
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit,
  FileText,
  Lock,
  ExternalLink,
  Search,
  Copy,
  Settings,
  Layers
} from 'lucide-react';
import { useDynamicPagesManager } from '@/core-adminApp/items/page-builder';
// import { type CmsCustomPage } from '@site/types';
import { type CmsCustomPage } from '@/cms/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/core-adminApp/hooks/use-toast';
import BilingualInput from '../../Input/BilingualInput';

export function DynamicPagesManager() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    deletePageId,
    duplicateSourcePage,
    dynamicBlockPages,
    editPage,
    fixedBlockPages,
    fixedLayoutPages,
    isCreateDialogOpen,
    newPagePath,
    newPageTitle,
    searchQuery,
    closeCreateDialog,
    handleCreateDialogOpenChange,
    handleCreatePage,
    handleDeletePage,
    handleEditPage,
    handleOpenDuplicateDialog,
    handleOpenEditDialog,
    handleUpdatePageSettings,
    openCreateDialog,
    setDeletePageId,
    setNewPagePath,
    setNewPageTitle,
    setSearchQuery,
  } = useDynamicPagesManager({
    notify: toast,
    onNavigateToEdit: (pageId) => navigate(`/pages/${pageId}/edit`),
  });

  return (
    <div className="space-y-6">
      {/* 页面标题和操作区 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">页面管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            管理网站页面，添加或编辑页面内容和组件
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          创建新页面
        </Button>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="搜索页面..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 1. 可视化积木页面 */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2 text-gray-800">
            <Layers className="w-4 h-4 text-indigo-500" />
            积木组件编排页面
          </h2>
          <p className="text-sm text-gray-500">
            支持使用“可视化编辑器”自由添加、排序和配置积木块组件的页面
          </p>
        </div>

        {/* 预设积木页面 */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pl-1">
            <Lock className="w-3.5 h-3.5" /> 系统预设 (不可删除)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fixedBlockPages.map((page) => (
              <PageCard
                key={page.id}
                page={page}
                onEdit={() => handleEditPage(page.id)}
                onEditSettings={() => handleOpenEditDialog(page)}
                onDuplicate={() => handleOpenDuplicateDialog(page)}
                onDelete={() => { }}
              />
            ))}
          </div>
        </div>

        {/* 自定义积木页面 */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pl-1">
            <FileText className="w-3.5 h-3.5" /> 自定义落地页 (可配置与删除)
          </h3>
          {dynamicBlockPages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dynamicBlockPages.map((page) => (
                <PageCard
                  key={page.id}
                  page={page}
                  onEdit={() => handleEditPage(page.id)}
                  onEditSettings={() => handleOpenEditDialog(page)}
                  onDuplicate={() => handleOpenDuplicateDialog(page)}
                  onDelete={() => setDeletePageId(page.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-gray-500">
                <FileText className="w-10 h-10 mb-2 text-gray-300" />
                <p className="text-xs">还没有自定义落地页</p>
                <p className="text-[11px] text-gray-400 mt-1">点击右上角「创建新页面」开始创建</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 2. 固定布局页面 */}
      <div className="pt-6 border-t space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2 text-gray-800">
            <FileText className="w-4 h-4 text-blue-500" />
            固定布局系统页面 (数据驱动)
          </h2>
          <p className="text-sm text-gray-500">
            这些页面的 UI 架构在前台已固定（如博客、询盘、客户案例）。您在此处仅可修改其访问标题及 SEO 推广配置。
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fixedLayoutPages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onEdit={() => {}}
              onEditSettings={() => handleOpenEditDialog(page)}
              onDuplicate={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>

      {/* 创建/复制页面弹窗 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editPage ? '编辑页面设置' : duplicateSourcePage ? '复制页面' : '创建新页面'}
            </DialogTitle>
            <DialogDescription>
              {editPage 
                ? '修改页面的基础信息和访问路径'
                : duplicateSourcePage 
                  ? `正在复制页面「${duplicateSourcePage.title.zh}」的布局和 SEO 设置。请设置新页面的标题和路径。` 
                  : '创建一个新的自定义页面，您可以在页面中添加各种积木块组件'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>页面标题</Label>
              <BilingualInput
                value={newPageTitle}
                onChange={setNewPageTitle}
                placeholder={{ zh: '请输入中文标题', en: 'Enter English title' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="path">URL 路径</Label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">/</span>
                <Input
                  id="path"
                  value={newPagePath}
                  onChange={(e) => setNewPagePath(e.target.value)}
                  placeholder="about-us"
                />
              </div>
              <p className="text-xs text-gray-500">
                只能使用小写字母、数字和连字符 (例如: about-us)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeCreateDialog}>
              取消
            </Button>
            <Button onClick={editPage ? handleUpdatePageSettings : handleCreatePage}>
              {editPage ? '保存设置' : duplicateSourcePage ? '确认复制' : '创建页面'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <AlertDialog open={!!deletePageId} onOpenChange={() => setDeletePageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该页面及其所有内容，无法恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePage} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// 页面卡片组件
interface PageCardProps {
  page: CmsCustomPage;
  onEdit: () => void;
  onEditSettings: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function PageCard({ page, onEdit, onEditSettings, onDuplicate, onDelete }: PageCardProps) {
  const isFixedLayout = page.type === 'fixed-layout';

  return (
    <Card className="hover:shadow-md transition-shadow gap-1">
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base truncate">{page.title.zh}</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-6 h-6 text-gray-400 hover:text-gray-600"
                onClick={onEditSettings}
              >
                <Settings className="w-3.5 h-3.5" />
              </Button>
            </div>
            {page.title.en && page.title.en !== page.title.zh && (
              <CardDescription className="truncate">{page.title.en}</CardDescription>
            )}
          </div>
          {page.isFixed && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              <Lock className="w-3 h-3 mr-1" />
              固定
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ExternalLink className="w-4 h-4" />
          <span className="truncate">{page.path}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          {isFixedLayout ? (
            <span className="text-blue-500 font-medium">系统固定布局 (数据驱动)</span>
          ) : (
            <span>{page.blocks?.length || 0} 个积木块</span>
          )}
        </div>
        <div className="flex items-center gap-2 pt-2 border-t">
          {isFixedLayout ? (
            <Button variant="outline" size="sm" className="flex-1" onClick={onEditSettings}>
              <Settings className="w-4 h-4 mr-1" />
              设置 SEO 与元数据
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-1" />
                编辑
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={onDuplicate}>
                <Copy className="w-4 h-4 mr-1" />
                复制
              </Button>
              {!page.isFixed && (
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={onDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DynamicPagesManager;
