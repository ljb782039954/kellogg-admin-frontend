import type { ProjectUiDefinition } from '@/core/contracts';

/** 类型收窄 + 开发期校验 shell 完整性，原样返回 ui。 */
export function defineProjectUi(ui: ProjectUiDefinition): ProjectUiDefinition {
  const { shell } = ui;
  if (!shell?.Layout || !shell?.LoginPage || !shell?.ErrorPage) {
    throw new Error('[projectUi] shell 必须提供 Layout、LoginPage 与 ErrorPage');
  }
  return ui;
}
