import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BilingualInput from '../../components/BilingualInput';
import EditableLinkCard from '../../components/custom/EditableLinkCard';
import type { NavLink, Translation } from '@/core/types';
import { nanoid } from 'nanoid';

interface NavEditorProps {
  navItems: NavLink[];
  onChange: (items: NavLink[]) => void;
}

export default function NavEditor({ navItems, onChange }: NavEditorProps) {
  const MAX_MAIN_NAV = 5; // 一级菜单最多 5 个

  const addNavItem = () => {
    if (navItems.length >= MAX_MAIN_NAV) return;
    
    const newItem: NavLink = {
      id: nanoid(8),
      name: { zh: '新菜单', en: 'New Menu' },
      linkType: 'internal',
      href: '',
      children: [],
    };
    onChange([...navItems, newItem]);
  };

  const updateNavItemName = (index: number, value: Translation) => {
    const newNavItems = [...navItems];
    newNavItems[index] = { ...newNavItems[index], name: value };
    onChange(newNavItems);
  };

  const removeNavItem = (index: number) => {
    onChange(navItems.filter((_, i) => i !== index));
  };

  // ----- 二级菜单操作 -----
  const addSubItem = (parentIndex: number) => {
    const newNavItems = [...navItems];
    const parent = newNavItems[parentIndex];
    const children = parent.children || [];
    
    parent.children = [
      ...children,
      {
        id: nanoid(8),
        name: { zh: '新子菜单', en: 'New Sub Menu' },
        linkType: 'internal',
        href: '',
      },
    ];
    onChange(newNavItems);
  };

  const updateSubItemName = (parentIndex: number, subIndex: number, value: Translation) => {
    const newNavItems = [...navItems];
    const children = [...(newNavItems[parentIndex].children || [])];
    children[subIndex] = { ...children[subIndex], name: value };
    newNavItems[parentIndex].children = children;
    onChange(newNavItems);
  };

  const updateSubItemLink = (parentIndex: number, subIndex: number, value: Partial<NavLink>) => {
    const newNavItems = [...navItems];
    const children = [...(newNavItems[parentIndex].children || [])];
    children[subIndex] = { ...children[subIndex], ...value };
    newNavItems[parentIndex].children = children;
    onChange(newNavItems);
  };

  const removeSubItem = (parentIndex: number, subIndex: number) => {
    const newNavItems = [...navItems];
    const children = [...(newNavItems[parentIndex].children || [])];
    children.splice(subIndex, 1);
    newNavItems[parentIndex].children = children;
    onChange(newNavItems);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>导航菜单</CardTitle>
            <CardDescription>管理顶部导航栏的菜单项与下拉子菜单（最多 {MAX_MAIN_NAV} 个一级菜单）</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addNavItem} disabled={navItems.length >= MAX_MAIN_NAV}>
            <Plus className="w-4 h-4 mr-1" />
            添加主菜单 {navItems.length}/{MAX_MAIN_NAV}
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
                  {/* 主菜单配置 */}
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
                    <Button variant="ghost" size="sm" onClick={() => removeNavItem(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BilingualInput
                      value={item.name}
                      onChange={(value) => updateNavItemName(index, value)}
                      placeholder={{ zh: '菜单中文名', en: 'Menu English name' }}
                      label="菜单名称"
                    />
                    {/* 根据新需求，一级菜单不设置链接，链接只在二级子菜单中配置 */}
                  </div>

                  {/* 子菜单区域 */}
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-300 pl-4 border-l-2 border-l-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">二级下拉菜单 (可选)</span>
                      <Button variant="outline" size="sm" onClick={() => addSubItem(index)} className="h-7 text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        添加子项
                      </Button>
                    </div>
                    
                    <div className="space-y-3 flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" >
                      {item.children?.map((subItem, subIndex) => (
                        <EditableLinkCard<NavLink>
                          key={subItem.id || subIndex}
                          className="bg-white p-3 rounded border border-green-300 shadow-sm"
                          link={subItem}
                          namePlaceholder={{ zh: '子菜单名', en: 'Sub Menu' }}
                          onLinkChange={(val) => updateSubItemLink(index, subIndex, val)}
                          onNameChange={(val) => updateSubItemName(index, subIndex, val)}
                          onRemove={() => removeSubItem(index, subIndex)}
                        />
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
