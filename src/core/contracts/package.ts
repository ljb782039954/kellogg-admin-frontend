import type { ProjectIdentity } from './identity';
import type { AdminMenuGroupDefinition } from './shell';
import type { AdminRouteDefinition } from './routing';
import type { EntityDefinition } from './entity';
import type { PageBuilderDefinition } from './page-builder';
import type { ProjectUiDefinition } from './ui';
import type { AdminAuthDefinition } from './auth';

export interface ProjectPackage {
  identity: ProjectIdentity;
  auth?: AdminAuthDefinition;
  menuGroups?: AdminMenuGroupDefinition[];
  routes: AdminRouteDefinition[];
  entities: EntityDefinition[];
  pageBuilder?: PageBuilderDefinition;
  ui: ProjectUiDefinition;
}
