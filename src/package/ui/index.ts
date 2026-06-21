import { defineProjectUi } from '@/core/app/defineProjectUi';
import { AdminLayout } from './shell/AdminLayout';
import { LoginPage } from './shell/LoginPage';
import { ErrorPage } from './shell/ErrorPage';
import { screens } from './screens';

export const projectUi = defineProjectUi({
  shell: { Layout: AdminLayout, LoginPage, ErrorPage },
  screens,
  blockViews: {},
  blockEditors: {},
});
