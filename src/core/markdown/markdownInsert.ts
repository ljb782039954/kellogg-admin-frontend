export interface MarkdownSelectionInsertResult {
  nextValue: string;
  nextSelectionStart: number;
  nextSelectionEnd: number;
}

export function insertMarkdownAtSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  before: string,
  after = ''
): MarkdownSelectionInsertResult {
  const selected = value.substring(selectionStart, selectionEnd);

  return {
    nextValue: value.substring(0, selectionStart) + before + selected + after + value.substring(selectionEnd),
    nextSelectionStart: selectionStart + before.length,
    nextSelectionEnd: selectionStart + before.length + selected.length,
  };
}

export function formatMarkdownImage(url: string, alt = 'image'): string {
  return `\n![${alt}](${url})\n`;
}

export function getImageFileFromClipboardItems(items: DataTransferItemList): File | null {
  const imageItem = Array.from(items).find(item => item.type.startsWith('image/'));
  return imageItem?.getAsFile() || null;
}
