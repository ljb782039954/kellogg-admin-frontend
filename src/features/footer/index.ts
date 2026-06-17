import { createElement } from 'react';
import { FooterEditorView } from './ui/FooterEditor';
import { useFooterEditor } from './model/useFooterEditor';

export function FooterEditor() {
  const controller = useFooterEditor();

  return createElement(FooterEditorView, {
    footer: controller.footer,
    saved: controller.saved,
    previewLang: controller.previewLang,
    hasDeletedPages: controller.hasDeletedPages,
    onSave: controller.save,
    onPreviewLangChange: controller.setPreviewLang,
    onUpdateNewsletterPlaceholder: (value) =>
      controller.updateFooter({ newsletterPlaceholder: value }),
    onUpdateNewsletterButton: (value) =>
      controller.updateFooter({ newsletterButton: value }),
    onAddGroup: controller.addLinkGroup,
    onRemoveGroup: controller.removeLinkGroup,
    onUpdateGroup: controller.updateLinkGroup,
    onAddLink: controller.addLinkToGroup,
    onRemoveLink: controller.removeLinkFromGroup,
    onUpdateLink: controller.updateLink,
  });
}

export type { FooterFormValues } from './model/footer.schema';
export { FooterEditorView };
export { useFooterEditor };
