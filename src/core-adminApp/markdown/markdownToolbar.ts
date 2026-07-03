export interface MarkdownToolbarAction {
  label: string;
  title: string;
  before: string;
  after?: string;
  italic?: boolean;
}

export const DEFAULT_MARKDOWN_TOOLBAR: readonly MarkdownToolbarAction[] = [
  { label: 'B', title: '加粗', before: '**', after: '**', italic: false },
  { label: 'I', title: '斜体', before: '*', after: '*', italic: true },
  { label: 'H2', title: '二级标题', before: '\n## ', after: '', italic: false },
  { label: 'H3', title: '三级标题', before: '\n### ', after: '', italic: false },
  { label: '""', title: '引用', before: '\n> ', after: '', italic: false },
  { label: '</>', title: '代码块', before: '\n```\n', after: '\n```', italic: false },
  { label: '—', title: '分割线', before: '\n---\n', after: '', italic: false },
];
