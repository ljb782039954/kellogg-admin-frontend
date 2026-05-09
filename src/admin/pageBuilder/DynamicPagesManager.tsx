// 动态页面管理 - 页面列表视图
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import {
  Plus,
  Trash2,
  Edit,
  FileText,
  Lock,
  ExternalLink,
  Search,
  Copy,
  Settings
} from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { type CustomPage } from '@/types';
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
import { useToast } from '@/hooks/use-toast';
import BilingualInput from '../components/BilingualInput';

export function DynamicPagesManager() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { content, addPage, deletePage, updatePage } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [duplicateSourcePage, setDuplicateSourcePage] = useState<CustomPage | null>(null);
  const [editPage, setEditPage] = useState<CustomPage | null>(null);

  // 新页面表单状态
  const [newPageTitle, setNewPageTitle] = useState({ zh: '', en: '' });
  const [newPagePath, setNewPagePath] = useState('');

  // 创建新页面
  const handleCreatePage = useCallback(async () => {
    if (!newPageTitle.zh.trim() || !newPagePath.trim()) {
      toast({
        title: '请填写完整信息',
        description: '页面标题（中文）和 URL 路径不能为空',
        variant: 'destructive',
      });
      return;
    }

    const path = `/${newPagePath.replace(/^\//, '')}`;

    // 检查 path 是否已存在
    const pathExists = content.pages.some((p) => p.path === path);
    if (pathExists) {
      toast({
        title: 'URL 路径已存在',
        description: '请使用其他 URL 路径',
        variant: 'destructive',
      });
      return;
    }

    // 生成唯一 ID
    const pageId = `page_${nanoid(8)}`;

    // 创建新页面结构
    const newPage: CustomPage = {
      id: pageId,
      path,
      title: {
        zh: newPageTitle.zh.trim(),
        en: newPageTitle.en.trim() || newPageTitle.zh.trim(),
      },
      isFixed: false,
      blocks: duplicateSourcePage 
        ? duplicateSourcePage.blocks.map(b => ({ ...JSON.parse(JSON.stringify(b)), id: `block_${nanoid(8)}` })) 
        : [],
      seo: duplicateSourcePage 
        ? JSON.parse(JSON.stringify(duplicateSourcePage.seo || {})) 
        : {
            title: {
              zh: newPageTitle.zh.trim(),
              en: newPageTitle.en.trim() || newPageTitle.zh.trim(),
            },
            description: { zh: '', en: '' },
          }
    };

    await addPage(newPage);

    // 重置表单
    setNewPageTitle({ zh: '', en: '' });
    setNewPagePath('');
    setDuplicateSourcePage(null);
    setIsCreateDialogOpen(false);

    toast({
      title: duplicateSourcePage ? '页面复制成功' : '页面创建成功',
      description: `已创建页面「${newPageTitle.zh}」`,
    });

    // 跳转到编辑页面
    navigate(`/pages/${pageId}/edit`);
  }, [newPageTitle, newPagePath, content.pages, duplicateSourcePage, addPage, navigate, toast]);

  // 更新页面设置
  const handleUpdatePageSettings = useCallback(async () => {
    if (!editPage) return;
    if (!newPageTitle.zh.trim() || !newPagePath.trim()) {
      toast({
        title: '请填写完整信息',
        description: '页面标题（中文）和 URL 路径不能为空',
        variant: 'destructive',
      });
      return;
    }

    const path = `/${newPagePath.replace(/^\//, '')}`;

    // 检查 path 是否被其他页面占用
    const pathExists = content.pages.some((p) => p.id !== editPage.id && p.path === path);
    if (pathExists) {
      toast({
        title: 'URL 路径已存在',
        description: '请使用其他 URL 路径',
        variant: 'destructive',
      });
      return;
    }

    const updatedPage = {
      ...editPage,
      path,
      title: {
        zh: newPageTitle.zh.trim(),
        en: newPageTitle.en.trim() || newPageTitle.zh.trim(),
      },
    };

    await updatePage(editPage.id, updatedPage);
    
    setEditPage(null);
    setIsCreateDialogOpen(false);
    setNewPageTitle({ zh: '', en: '' });
    setNewPagePath('');

    toast({
      title: '设置更新成功',
      description: `页面「${newPageTitle.zh}」设置已保存`,
    });
  }, [editPage, newPageTitle, newPagePath, content.pages, updatePage, toast]);

  // 打开编辑设置弹窗
  const handleOpenEditDialog = useCallback((page: CustomPage) => {
    setEditPage(page);
    setNewPageTitle(page.title);
    setNewPagePath(page.path.replace(/^\//, ''));
    setIsCreateDialogOpen(true);
  }, []);

  // 删除页面
  const handleDeletePage = useCallback(async () => {
    if (!deletePageId) return;

    const page = content.pages.find(p => p.id === deletePageId);
    if (page?.isFixed) {
      toast({
        title: '无法删除',
        description: '系统固定页面不能被删除',
        variant: 'destructive',
      });
      setDeletePageId(null);
      return;
    }

    await deletePage(deletePageId);
    setDeletePageId(null);

    toast({
      title: '删除成功',
      description: '页面已删除',
    });
  }, [deletePageId, content.pages, deletePage, toast]);

  // 进入编辑页面
  const handleEditPage = useCallback((pageId: string) => {
    navigate(`/pages/${pageId}/edit`);
  }, [navigate]);

  // 打开复制页面弹窗
  const handleOpenDuplicateDialog = useCallback((page: CustomPage) => {
    setDuplicateSourcePage(page);
    setNewPageTitle({ zh: `${page.title.zh} (副本)`, en: `${page.title.en} (Copy)` });
    setNewPagePath(`${page.path.replace(/^\//, '')}-copy`);
    setIsCreateDialogOpen(true);
  }, []);

  // 过滤页面列表
  const filteredPages = useMemo(() => {
    return content.pages.filter((page) => {
      const query = searchQuery.toLowerCase();
      return (
        page.title.zh.toLowerCase().includes(query) ||
        page.title.en.toLowerCase().includes(query) ||
        page.path.toLowerCase().includes(query)
      );
    });
  }, [content.pages, searchQuery]);

  // 分离固定页面和动态页面
  const fixedPages = useMemo(() => filteredPages.filter((p) => p.isFixed), [filteredPages]);
  const dynamicPages = useMemo(() => filteredPages.filter((p) => !p.isFixed), [filteredPages]);

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
        <Button onClick={() => {
          setDuplicateSourcePage(null);
          setNewPageTitle({ zh: '', en: '' });
          setNewPagePath('');
          setIsCreateDialogOpen(true);
        }}>
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

      {/* 固定页面列表 */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          固定页面
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          这些是网站的核心页面，不能被删除，但可以编辑页面内容
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fixedPages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onEdit={() => handleEditPage(page.id)}
              onEditSettings={() => handleOpenEditDialog(page)}
              onDuplicate={() => handleOpenDuplicateDialog(page)}
              onDelete={() => { }} // 禁止删除固定页面
            />
          ))}
        </div>
      </div>

      {/* 自定义页面列表 */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          自定义页面
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          自定义页面，可以自由创建、编辑和删除
        </p>
        {dynamicPages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dynamicPages.map((page) => (
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
            <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-sm">还没有自定义页面</p>
              <p className="text-xs mt-1">点击「创建新页面」按钮开始</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 创建/复制页面弹窗 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        if (!open) setDuplicateSourcePage(null);
        setIsCreateDialogOpen(open);
      }}>
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
                  onChange={(e) => setNewPagePath(e.target.value.replace(/[^a-z0-9-]/gi, '-').toLowerCase())}
                  placeholder="about-us"
                />
              </div>
              <p className="text-xs text-gray-500">
                只能使用小写字母、数字和连字符 (例如: about-us)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDuplicateSourcePage(null);
              setEditPage(null);
              setIsCreateDialogOpen(false);
            }}>
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
  page: CustomPage;
  onEdit: () => void;
  onEditSettings: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function PageCard({ page, onEdit, onEditSettings, onDuplicate, onDelete }: PageCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
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
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ExternalLink className="w-4 h-4" />
          <span className="truncate">{page.path}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{page.blocks?.length || 0} 个积木块</span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t">
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
        </div>
      </CardContent>
    </Card>
  );
}

export default DynamicPagesManager;
