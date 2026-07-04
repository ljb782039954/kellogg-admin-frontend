export type Language = string;

export interface Translation {
  [lang: string]: string;
}

export type LinkType = 'internal' | 'external';

export interface NavLink {
  id: string;          // 唯一ID
  name: Translation;
  linkType: LinkType;
  href: string;        // 内部链接为 pagePath (如 '/')，外部链接为完整 URL
  pageDeleted?: boolean; // 标记链接目标页面是否已被删除
  children?: NavLink[];  // 二级子菜单
}

export interface R2Image {
  key: string;
  name: string;
  url: string;
  thumbUrl: string;
  size: number;
  dimensions?: string;
  hash?: string;
  usages?: Array<{ type: string; name: string; id?: string }>;
  uploaded: string | Date;
}
