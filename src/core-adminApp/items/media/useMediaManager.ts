import { useEffect, useMemo, useState } from 'react';
import { useContent } from '@/core-adminApp/context/ContentContext';
import { useImageUsage } from '@/core-adminApp/hooks/useImageUsage';
import type { R2Image } from '@/cms/types';
import { findSimilarMediaImages } from './mediaSimilarity';
import { getImageDimensions } from './mediaUpload';

interface MediaManagerNotifier {
  success?: (message: string) => void;
  error?: (message: string) => void;
}

interface MediaManagerMessages {
  loadFailure: string;
  uploadSuccess: string;
  uploadFailure: string;
  syncSuccess: string;
  syncFailure: string;
  deleteConfirm: string;
  deleteInUseConfirm: (count: number) => string;
  deleteSuccess: string;
  deleteFailure: string;
  bulkDeleteConfirm: (count: number, inUseCount: number) => string;
  bulkDeleteSuccess: (count: number) => string;
  bulkDeleteFailure: string;
}

export type MediaUsageFilter = 'all' | 'used' | 'unused';

export interface UseMediaManagerOptions {
  confirmDelete?: (message: string) => boolean;
  messages?: Partial<MediaManagerMessages>;
  notify?: MediaManagerNotifier;
}

const DEFAULT_MESSAGES: MediaManagerMessages = {
  loadFailure: '无法加载媒体库',
  uploadSuccess: '上传成功',
  uploadFailure: '上传失败',
  syncSuccess: '媒体引用索引已同步',
  syncFailure: '媒体引用索引同步失败',
  deleteConfirm: '确定要永久删除这张图片吗？此操作不可撤销。',
  deleteInUseConfirm: count => `警告：该图片正在被 ${count} 处位置使用。删除将导致这些位置显示异常！\n\n确定要继续删除吗？`,
  deleteSuccess: '图片已删除',
  deleteFailure: '删除失败',
  bulkDeleteConfirm: (count, inUseCount) => inUseCount > 0
    ? `已选择 ${count} 张图片，其中 ${inUseCount} 张正在被使用。批量删除会导致对应页面或产品显示异常。\n\n确定要继续删除吗？`
    : `确定要永久删除选中的 ${count} 张图片吗？此操作不可撤销。`,
  bulkDeleteSuccess: count => `已删除 ${count} 张图片`,
  bulkDeleteFailure: '批量删除失败',
};

export function useMediaManager(options: UseMediaManagerOptions = {}) {
  const {
    confirmDelete,
    messages: customMessages,
    notify,
  } = options;
  const messages = { ...DEFAULT_MESSAGES, ...customMessages };
  const { getImagesList, uploadImage, deleteImage, syncMediaReferences } = useContent();

  const [images, setImages] = useState<R2Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncingReferences, setIsSyncingReferences] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [usageFilter, setUsageFilter] = useState<MediaUsageFilter>('all');

  const usageMap = useImageUsage(images);

  const loadImages = async () => {
    setIsLoading(true);

    try {
      const data = await getImagesList();
      setImages(data);
    } catch (error) {
      console.error('Failed to load media library:', error);
      notify?.error?.(messages.loadFailure);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredImages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return images.filter(image => {
      const usages = usageMap[image.key] || [];
      const matchesQuery = !query || image.name.toLowerCase().includes(query);
      const matchesUsage = usageFilter === 'all'
        || (usageFilter === 'used' && usages.length > 0)
        || (usageFilter === 'unused' && usages.length === 0);

      return matchesQuery && matchesUsage;
    });
  }, [images, searchQuery, usageFilter, usageMap]);

  const selectedImage = useMemo(
    () => images.find(image => image.key === selectedKey),
    [images, selectedKey]
  );

  const currentUsages = useMemo(() => {
    if (!selectedImage) return [];
    return usageMap[selectedImage.key] || [];
  }, [selectedImage, usageMap]);

  const unusedCount = useMemo(
    () => images.filter(image => !usageMap[image.key] || usageMap[image.key].length === 0).length,
    [images, usageMap]
  );

  const usedCount = useMemo(
    () => images.length - unusedCount,
    [images.length, unusedCount]
  );

  const selectedImages = useMemo(
    () => images.filter(image => selectedKeys.has(image.key)),
    [images, selectedKeys]
  );

  const selectedUsedCount = useMemo(
    () => selectedImages.filter(image => (usageMap[image.key] || []).length > 0).length,
    [selectedImages, usageMap]
  );

  const similarImages = useMemo(
    () => findSimilarMediaImages(selectedImage, images),
    [images, selectedImage]
  );

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);

    try {
      const dimensions = await getImageDimensions(file);
      await uploadImage(file, dimensions);
      notify?.success?.(messages.uploadSuccess);
      await loadImages();
    } catch (error) {
      console.error('Upload failed:', error);
      notify?.error?.(messages.uploadFailure);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSyncReferences = async () => {
    setIsSyncingReferences(true);

    try {
      const result = await syncMediaReferences();
      notify?.success?.(result.message || messages.syncSuccess);
      await loadImages();
    } catch (error) {
      console.error('Sync media references failed:', error);
      notify?.error?.(messages.syncFailure);
    } finally {
      setIsSyncingReferences(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedKey || !selectedImage) return;

    const message = currentUsages.length > 0
      ? messages.deleteInUseConfirm(currentUsages.length)
      : messages.deleteConfirm;

    if (confirmDelete && !confirmDelete(message)) return;

    try {
      await deleteImage(selectedKey);
      notify?.success?.(messages.deleteSuccess);
      setSelectedKey(null);
      await loadImages();
    } catch (error) {
      console.error('Delete failed:', error);
      notify?.error?.(messages.deleteFailure);
    }
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(prev => {
      const next = !prev;
      if (!next) setSelectedKeys(new Set());
      return next;
    });
  };

  const handleToggleSelection = (key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedKeys(new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedKeys.size === 0) return;

    const keysToDelete = Array.from(selectedKeys);
    const message = messages.bulkDeleteConfirm(keysToDelete.length, selectedUsedCount);
    if (confirmDelete && !confirmDelete(message)) return;

    setIsBulkDeleting(true);

    try {
      const results = await Promise.allSettled(keysToDelete.map(key => deleteImage(key)));
      const deletedCount = results.filter(result => result.status === 'fulfilled').length;
      const failedCount = results.length - deletedCount;

      if (deletedCount > 0) {
        notify?.success?.(messages.bulkDeleteSuccess(deletedCount));
      }
      if (failedCount > 0) {
        notify?.error?.(`${messages.bulkDeleteFailure}：${failedCount} 张图片未删除`);
      }

      setSelectedKeys(new Set());
      if (selectedKey && keysToDelete.includes(selectedKey)) {
        setSelectedKey(null);
      }
      await loadImages();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      notify?.error?.(messages.bulkDeleteFailure);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return {
    currentUsages,
    filteredImages,
    images,
    isBulkDeleting,
    isLoading,
    isSelectionMode,
    isSyncingReferences,
    isUploading,
    searchQuery,
    selectedImage,
    selectedImages,
    selectedKey,
    selectedKeys,
    selectedUsedCount,
    similarImages,
    usageFilter,
    unusedCount,
    usedCount,
    usageMap,
    handleBulkDelete,
    handleClearSelection,
    handleDelete,
    handleFileUpload,
    handleSyncReferences,
    handleToggleSelection,
    handleToggleSelectionMode,
    loadImages,
    setSearchQuery,
    setSelectedKey,
    setUsageFilter,
  };
}
