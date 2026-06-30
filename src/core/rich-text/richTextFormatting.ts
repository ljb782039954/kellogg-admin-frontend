import { marked } from 'marked';

export type RichTextFormatAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'list'
  | 'link';

interface RichTextSelection {
  selectionStart: number;
  selectionEnd: number;
}

/**
 * 格式化 Markdown 文本并返回更新后的文本值与新的光标定位范围。
 *
 * 这里接收的是选择区间而不是完整 textarea，让核心逻辑不依赖 React 或站点 UI。
 */
export function formatRichTextSelection(
  selection: RichTextSelection,
  text: string,
  action: RichTextFormatAction | string
): { newValue: string; newStart: number; newEnd: number } {
  const start = selection.selectionStart;
  const end = selection.selectionEnd;
  const selectedText = text.substring(start, end);

  let prefix = '';
  let suffix = '';
  let placeholderText = '';

  switch (action) {
    case 'bold':
      prefix = '**'; suffix = '**'; placeholderText = '加粗文本';
      break;
    case 'italic':
      prefix = '*'; suffix = '*'; placeholderText = '斜体文本';
      break;
    case 'underline':
      prefix = '<u>'; suffix = '</u>'; placeholderText = '下划线文本';
      break;
    case 'strike':
      prefix = '~~'; suffix = '~~'; placeholderText = '删除文本';
      break;
    case 'code':
      prefix = '`'; suffix = '`'; placeholderText = '代码文本';
      break;
    case 'list':
      prefix = '\n- '; suffix = '\n'; placeholderText = '列表项';
      break;
    case 'link':
      prefix = '['; suffix = '](url)'; placeholderText = '链接文本';
      break;
    default:
      return { newValue: text, newStart: start, newEnd: end };
  }

  let replacement = '';
  let newStart = start;
  let newEnd = end;

  if (selectedText.length > 0) {
    replacement = prefix + selectedText + suffix;
    newStart = start;
    newEnd = start + replacement.length;
  } else {
    replacement = prefix + placeholderText + suffix;
    newStart = start + prefix.length;
    newEnd = newStart + placeholderText.length;
  }

  const newValue = text.substring(0, start) + replacement + text.substring(end);
  return { newValue, newStart, newEnd };
}

/**
 * 兼容 textarea 调用方的薄适配器。
 */
export function handleFormatHelper(
  textarea: HTMLTextAreaElement,
  text: string,
  action: RichTextFormatAction | string
): { newValue: string; newStart: number; newEnd: number } {
  return formatRichTextSelection(textarea, text, action);
}

/**
 * 转换 Markdown 文本为 HTML (带防崩溃保护)。
 */
export function getPreviewHtml(text: string): { __html: string } {
  try {
    return { __html: marked.parse(text || '') as string };
  } catch {
    return { __html: text || '' };
  }
}
