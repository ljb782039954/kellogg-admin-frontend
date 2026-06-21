import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import type { ProjectPackage } from '@/core/contracts';
import { QueryProvider } from './QueryProvider';
import { LanguageProvider } from './LanguageContext';
import { createAdminRouteElements } from '@/core/routing/createAdminRouteElements';

export function AdminApp({
  projectPackage,
}: {
  projectPackage: ProjectPackage;
}): ReactElement {
  return (
    <QueryProvider>
      <LanguageProvider>
        <BrowserRouter>{createAdminRouteElements(projectPackage)}</BrowserRouter>
        <Toaster position="top-right" richColors />
      </LanguageProvider>
    </QueryProvider>
  );
}
