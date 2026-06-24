import { useCallback, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { R2Image } from '@/shared/media/types';
import { toAppError } from '@/shared/api/errors';
import { getImagesList, uploadImage, deleteImage } from '../api/media.api';
import { mediaKeys } from '../api/media.keys';
import { indexMediaUsages } from './indexMediaUsages';
import { findSimilarMediaAssets } from './findSimilarMediaAssets';
import type { DeleteRisk } from './media.types';

interface UploadState {
  isUploading: boolean;
  uploadError: string | null;
}

interface DeleteState {
  isDeleting: boolean;
  deleteError: string | null;
}

export function useMediaManager() {
  const queryClient = useQueryClient();
  const selectionIdRef = useRef(0);

  const query = useQuery({
    queryKey: mediaKeys.list(),
    queryFn: getImagesList,
  });

  const images = query.data ?? [];
  const usageMap = useMemo(() => indexMediaUsages(images), [images]);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const selectedImage: R2Image | undefined = useMemo(
    () => (selectedKey ? images.find((img) => img.key === selectedKey) : undefined),
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

  const similarImages = useMemo(
    () => (selectedImage ? findSimilarMediaAssets(selectedImage, images) : []),
    [selectedImage, images],
  );

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadImage(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mediaKeys.lists() }),
  });

  const deleteMutation = useMutation({
    mutationFn: (key: string) => deleteImage(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });

  const selectFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      const id = ++selectionIdRef.current;
      uploadMutation.mutate(file, {
        onSuccess: () => {
          if (id !== selectionIdRef.current) return;
        },
      });
    },
    [uploadMutation],
  );

  const checkDeleteRisk = useCallback(
    (key: string): DeleteRisk | null => {
      const img = images.find((i) => i.key === key);
      if (!img) return null;
      const usages = usageMap[img.key] || [];
      return { key, imageName: img.name, usageCount: usages.length, hasUsages: usages.length > 0 };
    },
    [images, usageMap],
  );

  const confirmDelete = useCallback(
    async (key: string) => {
      await deleteMutation.mutateAsync(key);
    },
    [deleteMutation],
  );

  return {
    images,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    queryError: query.error ? toAppError(query.error).message : null,
    usageMap,
    unusedCount,
    similarImages,
    currentUsages,
    selectedKey,
    selectedImage,
    setSelectedKey,
    selectFile,
    uploadState: {
      isUploading: uploadMutation.isPending,
      uploadError: uploadMutation.error ? toAppError(uploadMutation.error).message : null,
    } as UploadState,
    deleteState: {
      isDeleting: deleteMutation.isPending,
      deleteError: deleteMutation.error ? toAppError(deleteMutation.error).message : null,
    } as DeleteState,
    checkDeleteRisk,
    confirmDelete,
    refetch: () => queryClient.invalidateQueries({ queryKey: mediaKeys.lists() }),
  };
}
