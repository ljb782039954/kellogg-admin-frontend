import { useCallback, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { type R2Image } from '@/types';
import { useImageUsage } from '@/hooks/useImageUsage';
import { calculateHashSimilarity } from '@/lib/image';
import { getImagesList, uploadImage, deleteImage } from '../api/media.api';
import { mediaKeys } from '../api/media.keys';

type SimilarImage = {
  image: R2Image;
  matchType: 'exact_hash' | 'high_similarity' | 'exact' | 'dimension' | 'size' | 'close_size';
  reason: string;
};

export function useMediaManager() {
  const queryClient = useQueryClient();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const query = useQuery({
    queryKey: mediaKeys.list(),
    queryFn: getImagesList,
  });

  const images = query.data ?? [];
  const isLoading = query.isLoading;

  const usageMap = useImageUsage(images);

  const filteredImages = useMemo(() => {
    if (!searchQuery) return images;
    const q = searchQuery.toLowerCase();
    return images.filter((img) => img.name.toLowerCase().includes(q));
  }, [images, searchQuery]);

  const selectedImage = useMemo(
    () => images.find((img) => img.key === selectedKey),
    [images, selectedKey],
  );

  const currentUsages = useMemo(() => {
    if (!selectedImage) return [];
    return usageMap[selectedImage.key] || [];
  }, [selectedImage, usageMap]);

  const unusedCount = useMemo(
    () => images.filter((img) => !usageMap[img.key] || usageMap[img.key].length === 0).length,
    [images, usageMap],
  );

  const similarImages = useMemo<SimilarImage[]>(() => {
    if (!selectedImage) return [];

    const list: SimilarImage[] = [];

    images.forEach((img) => {
      if (img.key === selectedImage.key) return;

      if (selectedImage.hash && img.hash) {
        const similarity = calculateHashSimilarity(selectedImage.hash, img.hash);
        if (similarity === 1) {
          list.push({ image: img, matchType: 'exact_hash', reason: '视觉内容完全相同 (100%)' });
          return;
        } else if (similarity >= 0.85) {
          list.push({
            image: img,
            matchType: 'high_similarity',
            reason: `视觉相似度: ${(similarity * 100).toFixed(0)}%`,
          });
          return;
        }
      }

      const hasDimensions = !!(selectedImage.dimensions && img.dimensions);
      const sameDimensions = hasDimensions && selectedImage.dimensions === img.dimensions;
      const sameSize = selectedImage.size === img.size;
      const sizeDiff = Math.abs(selectedImage.size - img.size) / selectedImage.size;
      const closeSize = sizeDiff < 0.05;

      if (sameDimensions && sameSize) {
        list.push({ image: img, matchType: 'exact', reason: '尺寸与大小完全相同' });
      } else if (sameDimensions) {
        list.push({ image: img, matchType: 'dimension', reason: '原始尺寸相同' });
      } else if (sameSize) {
        list.push({ image: img, matchType: 'size', reason: '文件大小相同' });
      } else if (closeSize) {
        list.push({ image: img, matchType: 'close_size', reason: `大小相近 (差异 ${(sizeDiff * 100).toFixed(1)}%)` });
      }
    });

    const order = { exact_hash: 0, high_similarity: 1, exact: 2, dimension: 3, size: 4, close_size: 5 };
    return list.sort((a, b) => order[a.matchType] - order[b.matchType]);
  }, [selectedImage, images]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      let dimensions: { width: number; height: number } | undefined;
      if (file.type.startsWith('image/')) {
        dimensions = await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.onerror = () => resolve(undefined);
          img.src = URL.createObjectURL(file);
        });
      }
      await uploadImage(file, dimensions);
    },
    onSuccess: () => {
      toast.success('上传成功');
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
    onError: () => {
      toast.error('上传失败');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (key: string) => deleteImage(key),
    onSuccess: () => {
      toast.success('图片已删除');
      setSelectedKey(null);
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
    onError: () => {
      toast.error('删除失败');
    },
  });

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      uploadMutation.mutate(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [uploadMutation],
  );

  const handleDelete = useCallback(() => {
    if (!selectedKey || !selectedImage) return;

    const message =
      currentUsages.length > 0
        ? `警告：该图片正在被 ${currentUsages.length} 处位置使用。删除将导致这些位置显示异常！\n\n确定要继续删除吗？`
        : '确定要永久删除这张图片吗？此操作不可撤销。';

    if (!window.confirm(message)) return;
    deleteMutation.mutate(selectedKey);
  }, [selectedKey, selectedImage, currentUsages, deleteMutation]);

  return {
    images,
    filteredImages,
    isLoading,
    isUploading: uploadMutation.isPending,
    searchQuery,
    setSearchQuery,
    selectedKey,
    setSelectedKey,
    selectedImage,
    usageMap,
    currentUsages,
    unusedCount,
    similarImages,
    fileInputRef,
    handleFileUpload,
    handleDelete,
  };
}
