import { defineProjectPackage } from '@/core/app/defineProjectPackage';
import { identity } from './identity/config';
import { routes, menuGroups } from './routes';
import { projectUi } from './ui';
import { reviewEntity } from './entities';

export const projectPackage = defineProjectPackage({
  identity,
  menuGroups,
  routes,
  entities: [reviewEntity],
  ui: projectUi,
});

export default projectPackage;
