import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical, AlertTriangle } from 'lucide-react';
import BilingualInput from '@/package/ui/forms/BilingualInput';
import { LinkSelector, type PageOption } from '@/package/ui/forms/LinkSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/package/ui/primitives/card';
import { Button } from '@/package/ui/primitives/button';
import { Badge } from '@/package/ui/primitives/badge';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 model 常量，P4 提取到 core 后删除。
import { MAX_MAIN_NAV } from '@/features/navigation/model/navigation.commands';
import type { NavLink } from '@/package/types';
import type { Translation } from '@/shared/i18n/translation';

interface NavigationFormViewProps {
  navItems: NavLink[];
  pages: PageOption[];
  maxMainNav?: number;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItemName: (index: number, name: Translation) => void;
  onAddSubItem: (parentIndex: number) => void;
  onRemoveSubItem: (parentIndex: number, subIndex: number) => void;
  onUpdateSubItemName: (parentIndex: number, subIndex: number, name: Translation) => void;
  onUpdateSubItemLink: (parentIndex: number, subIndex: number, link: Partial<NavLink>) => void;
}

export function NavigationFormView({
  navItems,
  pages,
  maxMainNav = MAX_MAIN_NAV,
  onAddItem,
  onRemoveItem,
  onUpdateItemName,
  onAddSubItem,
  onRemoveSubItem,
  onUpdateSubItemName,
  onUpdateSubItemLink,
}: NavigationFormViewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>导航菜单</CardTitle>
            <CardDescription>
              管理顶部导航栏的菜单项与下拉子菜单（最多 {maxMainNav} 个一级菜单）
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onAddItem} disabled={navItems.length >= maxMainNav}>
            <Plus className="w-4 h-4 mr-1" />
            添加主菜单 {navItems.length}/{maxMainNav}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {navItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无导航菜单</p>
            <p className="text-sm mt-1">点击「添加主菜单」开始配置</p>
          </div>
        ) : (
          navItems.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-lg border ${item.pageDeleted ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-start gap-3">
                <GripVertical className="w-5 h-5 text-gray-400 mt-2 cursor-move" />

                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 w-16">主菜单 {index + 1}</span>
                      {item.pageDeleted && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          链接失效
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BilingualInput
                      colRow='row'
                      value={item.name}
                      onChange={(value) => onUpdateItemName(index, value)}
                      placeholder={{ zh: '菜单中文名', en: 'Menu English name' }}
                      label="菜单名称"
                    />
                  </div>

                  <div className="mt-4 pt-4 border-t border-dashed border-gray-300 pl-4 border-l-2 border-l-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">二级下拉菜单 (可选)</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddSubItem(index)}
                        className="h-7 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        添加子项
                      </Button>
                    </div>

                    <div className="space-y-3 flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.children?.map((subItem, subIndex) => (
                        <div
                          key={subItem.id || subIndex}
                          className="flex gap-3 bg-white p-3 rounded-lg border border-green-300 shadow-sm"
                        >
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <BilingualInput
                              value={subItem.name}
                              onChange={(val) => onUpdateSubItemName(index, subIndex, val)}
                              placeholder={{ zh: '子菜单名', en: 'Sub Menu' }}
                            />
                            <LinkSelector
                              value={subItem}
                              pages={pages}
                              onChange={(val) => onUpdateSubItemLink(index, subIndex, val)}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveSubItem(index, subIndex)}
                            className="text-red-500 mt-6 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {(!item.children || item.children.length === 0) && (
                        <div className="text-xs text-gray-400 py-2">暂无子菜单，悬停不显示下拉框。</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
