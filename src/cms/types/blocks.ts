import type { Translation } from "./common";

export type BlockType = string;
export type ComponentCategory = "product" | "marketing" | "content" | "media";

export interface ComponentMeta<TContent = Record<string, unknown>> {
  type: string;
  name: Translation;
  description: Translation;
  icon: string;
  category: ComponentCategory;
  hasGlobalData: boolean;
  singleton?: boolean;
  defaultProps: Partial<TContent>;
}

export interface PageBlock<TContent = Record<string, any>> {
  id: string;
  type: string;
  content: TContent;
  isVisible: boolean;
}

export interface CustomPage {
  id: string;
  path: string;
  title: Translation;
  isFixed: boolean;
  type?: "fixed-block" | "dynamic-block" | "fixed-layout";
  content?: unknown;
  blocks: PageBlock[];
  seo?: {
    title: Translation;
    description: Translation;
    keywords?: Translation;
    targetCountry?: string;
  };
}
