import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { ProjectPackage } from '@/core/contracts';
import { AdminApp } from './AdminApp';

export interface AdminAppHandle {
  mount(container?: HTMLElement): void;
}

/** 稳定应用入口：createAdminApp(projectPackage).mount()。 */
export function createAdminApp(projectPackage: ProjectPackage): AdminAppHandle {
  return {
    mount(container = document.getElementById('root')!) {
      createRoot(container).render(
        <StrictMode>
          <AdminApp projectPackage={projectPackage} />
        </StrictMode>,
      );
    },
  };
}
