import type { DocumentMetadata } from '@/core-adminApp/app/documentMetadata';
import siteSettings from './siteSettings.json';
import faviconHref from '/kellogg/logo.jpg';

const documentMetadata: DocumentMetadata = {
  title: `${siteSettings.brand.name.zh} 后台管理`,
  faviconHref,
};

export default documentMetadata;
