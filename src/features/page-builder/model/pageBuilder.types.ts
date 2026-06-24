import type {
  AvailableBlock,
  BlockType,
  PageBlock,
  Translation,
} from '@/types';
import type { PropertyEditorResources } from '@/package/page-builder';
import type {
  PageBuilderPanel as CorePageBuilderPanel,
  PageBuilderSaveStatus as CorePageBuilderSaveStatus,
  PageBuilderSessionState,
} from '@/core/page-builder';

export type PageBuilderPanel = CorePageBuilderPanel;

export interface PageSeo {
  title: Translation;
  description: Translation;
  keywords: Translation;
  targetCountry: string;
}

export interface PageBuilderDraft {
  id: string;
  path: string;
  title: Translation;
  isFixed: boolean;
  type?: string;
  content?: unknown;
  blocks: PageBlock[];
  seo: PageSeo;
}

export type PageBuilderSaveStatus = CorePageBuilderSaveStatus;

export type PageBuilderState = PageBuilderSessionState<
  PageBuilderDraft,
  PageBuilderPanel
>;

export type { AvailableBlock } from '@/package/types';

export interface PageMetaChanges {
  title?: Translation;
  path?: string;
}

export interface PageBuilderViewModel {
  page: PageBuilderDraft;
  selectedPanel: PageBuilderPanel | null;
  selectedBlock?: PageBlock;
  availableBlocks: AvailableBlock[];
  isFixedLayout: boolean;
  isDirty: boolean;
  canSave: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  saveStatus: PageBuilderSaveStatus;
  error: string | null;
}

export interface PageBuilderActions {
  selectPanel(panel: PageBuilderPanel | null): void;
  addBlock(type: BlockType): void;
  removeBlock(blockId: string): void;
  moveBlock(blockId: string, targetIndex: number): void;
  toggleBlock(blockId: string): void;
  updateBlock(blockId: string, content: unknown): void;
  updateMeta(changes: PageMetaChanges): void;
  updateSeo(seo: PageSeo): void;
  undo(): void;
  redo(): void;
  save(): Promise<void>;
  requestExit(onConfirmed: () => void): void;
}

export type CommandResult<T> =
  | { ok: true; value: T; changed: boolean }
  | { ok: false; error: PageBuilderCommandError };

export type PageBuilderCommandError =
  | 'UNKNOWN_BLOCK_TYPE'
  | 'BLOCK_NOT_FOUND'
  | 'DUPLICATE_SINGLETON'
  | 'INVALID_TARGET_INDEX';

export type { PropertyEditorResources } from '@/package/page-builder';

export interface PropertyEditorProps<T = unknown> {
  value: T;
  onChange: (value: T) => void;
  resources: PropertyEditorResources;
  disabled?: boolean;
  errors?: Record<string, string>;
}
