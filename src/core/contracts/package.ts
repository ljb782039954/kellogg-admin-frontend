import type { ProjectIdentity } from './identity';
import type { AdminRouteDefinition } from './routing';
import type { EntityDefinition } from './entity';
import type { PageBuilderDefinition } from './page-builder';
import type { ProjectUiDefinition } from './ui';

export interface ProjectPackage {
  identity: ProjectIdentity;
  routes: AdminRouteDefinition[];
  entities: EntityDefinition[];
  pageBuilder?: PageBuilderDefinition;
  ui: ProjectUiDefinition;
}
