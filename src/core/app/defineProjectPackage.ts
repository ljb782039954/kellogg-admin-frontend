import type { ProjectPackage } from '@/core/contracts';
import { defineProjectUi } from './defineProjectUi';

/** 返回项目包的所有完整性错误；空数组表示通过。 */
export function validateProjectPackage(pkg: ProjectPackage): string[] {
  const errors: string[] = [];

  const groupIds = new Set((pkg.menuGroups ?? []).map((g) => g.id));

  const routeIds = new Set<string>();
  const routePaths = new Set<string>();
  for (const route of pkg.routes) {
    if (routeIds.has(route.id)) errors.push(`重复的 route id: ${route.id}`);
    routeIds.add(route.id);
    if (routePaths.has(route.path)) errors.push(`重复的 route path: ${route.path}`);
    routePaths.add(route.path);
    if (!pkg.ui.screens[route.screenId]) {
      errors.push(
        `route "${route.id}" 引用的 screenId "${route.screenId}" 不存在于 ui.screens`,
      );
    }
    if (route.menu && !groupIds.has(route.menu.group)) {
      errors.push(
        `route "${route.id}" 的 menu.group "${route.menu.group}" 不存在于 menuGroups`,
      );
    }
  }

  const entityKeys = new Set<string>();
  for (const entity of pkg.entities) {
    if (entityKeys.has(entity.key)) errors.push(`重复的 entity key: ${entity.key}`);
    entityKeys.add(entity.key);
    for (const screenId of [entity.screens.list, entity.screens.editor]) {
      if (screenId && !pkg.ui.screens[screenId]) {
        errors.push(
          `entity "${entity.key}" 引用的 screenId "${screenId}" 不存在于 ui.screens`,
        );
      }
    }
  }

  const blockTypes = new Set<string>();
  for (const block of pkg.pageBuilder?.blocks ?? []) {
    if (blockTypes.has(block.type)) errors.push(`重复的 block type: ${block.type}`);
    blockTypes.add(block.type);
    if (!pkg.ui.blockViews[block.previewId]) {
      errors.push(
        `block "${block.type}" 的 previewId "${block.previewId}" 不存在于 ui.blockViews`,
      );
    }
    if (!pkg.ui.blockEditors[block.editorId]) {
      errors.push(
        `block "${block.type}" 的 editorId "${block.editorId}" 不存在于 ui.blockEditors`,
      );
    }
  }

  return errors;
}

/** 类型收窄 + 开发期完整性校验；失败抛聚合错误，成功原样返回。 */
export function defineProjectPackage(pkg: ProjectPackage): ProjectPackage {
  defineProjectUi(pkg.ui);
  const errors = validateProjectPackage(pkg);
  if (errors.length > 0) {
    throw new Error(`[projectPackage] 校验失败:\n- ${errors.join('\n- ')}`);
  }
  return pkg;
}
