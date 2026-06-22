import { defineProjectPackage } from '@/core/app/defineProjectPackage';
import { identity } from './identity/config';
import { routes, menuGroups } from './routes';
import { projectUi } from './ui';
import {
  blogCategoryEntity,
  blogEntity,
  categoryEntity,
  companyInfoEntity,
  footerEntity,
  navigationEntity,
  productEntity,
  reviewEntity,
} from './entities';

export const projectPackage = defineProjectPackage({
  identity,
  menuGroups,
  routes,
  entities: [
    blogCategoryEntity,
    blogEntity,
    categoryEntity,
    companyInfoEntity,
    footerEntity,
    navigationEntity,
    productEntity,
    reviewEntity,
  ],
  ui: projectUi,
});

export default projectPackage;
