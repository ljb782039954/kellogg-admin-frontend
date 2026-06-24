import { defineProjectPackage } from '@/core/app/defineProjectPackage';
import { identity } from './identity/config';
import { routes, menuGroups } from './routes';
import { projectUi } from './ui';
import { pageBuilderDefinition } from './page-builder';
import {
  blogCategoryEntity,
  blogEntity,
  categoryEntity,
  companyInfoEntity,
  footerEntity,
  inquiryEntity,
  navigationEntity,
  pagesEntity,
  productEntity,
  reviewEntity,
} from './entities';

// primitives

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
    inquiryEntity,
    navigationEntity,
    pagesEntity,
    productEntity,
    reviewEntity,
  ],
  pageBuilder: pageBuilderDefinition,
  ui: projectUi,
});

export default projectPackage;
