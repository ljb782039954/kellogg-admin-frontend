import { useEffect, type ReactNode } from 'react';
import type { ProjectIdentity } from '@/core/contracts';
import type { Translation } from '@/shared/i18n/translation';
import { useLanguage } from '@/core/app/LanguageContext';

export interface RouteLifecycleProps {
  identity: ProjectIdentity;
  title: Translation;
  children: ReactNode;
}

export function RouteLifecycle({
  identity,
  title,
  children,
}: RouteLifecycleProps) {
  const { language } = useLanguage();

  useEffect(() => {
    const routeTitle = title[language] || title.zh || title.en;
    const projectName =
      identity.name[language] || identity.name.zh || identity.name.en;
    document.title = routeTitle ? `${routeTitle} - ${projectName}` : projectName;
  }, [identity.name, language, title]);

  return children;
}
