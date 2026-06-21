import { defineProjectPackage } from '@/core/app/defineProjectPackage';
import { identity } from './identity/config';
import { routes, menuGroups } from './routes';
import { projectUi } from './ui';

export const projectPackage = defineProjectPackage({
  identity,
  menuGroups,
  routes,
  entities: [],
  ui: projectUi,
});

export default projectPackage;
