import type { ComponentType } from 'react';
import type { AdminScreenProps } from '@/core/contracts';
// eslint-disable-next-line no-restricted-imports -- P2c 迁移期保留 model，P4 提取到 core 后删除。
import { useFooterEditor } from '@/features/footer/model/useFooterEditor';
import { FooterEditorView } from './FooterEditor';

export { FooterEditorView, FooterPreview } from './FooterEditor';

export function FooterEditor() {
  const controller = useFooterEditor();

  return (
    <FooterEditorView
      footer={controller.footer}
      saved={controller.saved}
      previewLang={controller.previewLang}
      hasDeletedPages={controller.hasDeletedPages}
      pages={controller.pages}
      onSave={controller.save}
      onPreviewLangChange={controller.setPreviewLang}
      onUpdateNewsletterPlaceholder={(value) =>
        controller.updateFooter({ newsletterPlaceholder: value })
      }
      onUpdateNewsletterButton={(value) =>
        controller.updateFooter({ newsletterButton: value })
      }
      onAddGroup={controller.addLinkGroup}
      onRemoveGroup={controller.removeLinkGroup}
      onUpdateGroup={controller.updateLinkGroup}
      onAddLink={controller.addLinkToGroup}
      onRemoveLink={controller.removeLinkFromGroup}
      onUpdateLink={controller.updateLink}
    />
  );
}

export const FooterScreen: ComponentType<AdminScreenProps> = function FooterScreen() {
  return <FooterEditor />;
};
