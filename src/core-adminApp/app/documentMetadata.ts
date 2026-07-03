export interface DocumentMetadata {
  faviconHref?: string;
  title: string;
}

function getOrCreateFaviconLink(): HTMLLinkElement {
  const existingLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (existingLink) return existingLink;

  const link = document.createElement('link');
  link.rel = 'icon';
  document.head.appendChild(link);
  return link;
}

export function applyDocumentMetadata(metadata: DocumentMetadata) {
  document.title = metadata.title;

  if (metadata.faviconHref) {
    const faviconLink = getOrCreateFaviconLink();
    faviconLink.href = metadata.faviconHref;
  }
}
