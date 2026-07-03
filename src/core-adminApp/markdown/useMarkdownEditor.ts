import { useRef, type ClipboardEvent } from 'react';
import {
  formatMarkdownImage,
  getImageFileFromClipboardItems,
  insertMarkdownAtSelection,
} from './markdownInsert';

type NotificationId = string | number;

interface MarkdownEditorNotifier {
  loading?: (message: string) => NotificationId | undefined;
  success?: (message: string) => void;
  error?: (message: string) => void;
  dismiss?: (id?: NotificationId) => void;
}

interface MarkdownEditorMessages {
  uploadImageLoading: string;
  uploadPastedImageLoading: string;
  uploadSuccess: string;
  uploadFailure: string;
}

interface UseMarkdownEditorOptions {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  notify?: MarkdownEditorNotifier;
  messages?: Partial<MarkdownEditorMessages>;
}

const DEFAULT_MESSAGES: MarkdownEditorMessages = {
  uploadImageLoading: '正在上传图片...',
  uploadPastedImageLoading: '正在上传粘贴的图片...',
  uploadSuccess: '图片上传成功',
  uploadFailure: '图片上传失败',
};

export function useMarkdownEditor({
  value,
  onChange,
  onImageUpload,
  notify,
  messages: customMessages,
}: UseMarkdownEditorOptions) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messages = { ...DEFAULT_MESSAGES, ...customMessages };

  const insertAtCursor = (before: string, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const result = insertMarkdownAtSelection(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      before,
      after
    );

    onChange(result.nextValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(result.nextSelectionStart, result.nextSelectionEnd);
    }, 0);
  };

  const uploadAndInsertImage = async (
    file: File,
    loadingMessage = messages.uploadImageLoading
  ) => {
    if (!onImageUpload) return;

    const notificationId = notify?.loading?.(loadingMessage);

    try {
      const url = await onImageUpload(file);
      insertAtCursor(formatMarkdownImage(url));
      notify?.dismiss?.(notificationId);
      notify?.success?.(messages.uploadSuccess);
    } catch {
      notify?.dismiss?.(notificationId);
      notify?.error?.(messages.uploadFailure);
    }
  };

  const handlePaste = async (event: ClipboardEvent<HTMLTextAreaElement>) => {
    if (!onImageUpload) return;

    const file = getImageFileFromClipboardItems(event.clipboardData.items);
    if (!file) return;

    event.preventDefault();
    await uploadAndInsertImage(file, messages.uploadPastedImageLoading);
  };

  return {
    handlePaste,
    insertAtCursor,
    textareaRef,
    uploadAndInsertImage,
  };
}
