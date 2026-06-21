import type {
  AdminMenuGroup,
  AdminMenuGroupDefinition,
  AdminMenuItem,
  AdminRouteDefinition,
} from '@/core/contracts';

function toAbsolute(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/** 据 routes + menuGroups 构建排序后的菜单模型；只纳入带 menu 的 route，丢弃空分组。 */
export function buildAdminMenu(
  routes: AdminRouteDefinition[],
  groups: AdminMenuGroupDefinition[],
): AdminMenuGroup[] {
  const itemsByGroup = new Map<string, AdminMenuItem[]>();
  for (const route of routes) {
    if (!route.menu) continue;
    const item: AdminMenuItem = {
      routeId: route.id,
      path: toAbsolute(route.path),
      title: route.title,
      icon: route.icon,
      order: route.menu.order,
    };
    const list = itemsByGroup.get(route.menu.group) ?? [];
    list.push(item);
    itemsByGroup.set(route.menu.group, list);
  }

  return groups
    .map((g) => ({
      id: g.id,
      title: g.title,
      order: g.order,
      icon: g.icon,
      items: (itemsByGroup.get(g.id) ?? []).sort((a, b) => a.order - b.order),
    }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => a.order - b.order);
}
