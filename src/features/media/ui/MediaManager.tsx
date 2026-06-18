import { useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useMediaManager } from '../model/useMediaManager';
import { MediaHeader } from './MediaHeader';
import { MediaGrid } from './MediaGrid';
import { MediaDetails } from './MediaDetails';
import { similarMatchLabel } from '../model/findSimilarMediaAssets';

export function MediaManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    queryError, isLoading, images,
    usageMap, unusedCount, similarImages, currentUsages,
    selectedKey, selectedImage, setSelectedKey,
    selectFile, uploadState, deleteState,
    checkDeleteRisk, confirmDelete, refetch,
  } = useMediaManager();

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      selectFile(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [selectFile],
  );

  const handleDelete = useCallback(() => {
    const key = selectedKey;
    if (!key) return;
    const risk = checkDeleteRisk(key);
    if (!risk) return;

    const message = risk.hasUsages
      ? `警告：该图片正在被 ${risk.usageCount} 处位置使用。删除将导致这些位置显示异常！\n\n确定要继续删除吗？`
      : '确定要永久删除这张图片吗？此操作不可撤销。';

    if (!window.confirm(message)) return;

    confirmDelete(key).then(() => {
      toast.success('图片已删除');
      setSelectedKey(null);
    }).catch(() => {
      toast.error(deleteState.deleteError || '删除失败');
    });
  }, [selectedKey, checkDeleteRisk, confirmDelete, setSelectedKey, deleteState.deleteError]);

  const similarImagesWithLabels = similarImages.map((si) => ({
    ...si,
    reason: similarMatchLabel(si.reasonCode, si.similarity),
  }));

  return (
    <div className="space-y-6">
      <MediaHeader
        searchQuery=""
        onSearchChange={() => {}}
        totalCount={images.length}
        unusedCount={unusedCount}
        isUploading={uploadState.isUploading}
        isLoading={isLoading}
        onUploadClick={() => fileInputRef.current?.click()}
        onRefresh={refetch}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
      />

      {queryError && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm">
          {queryError}
        </div>
      )}

      {uploadState.uploadError && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm">
          上传失败: {uploadState.uploadError}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[75vh]">
        <div className="flex-1 flex overflow-hidden min-h-0">
          <div className="flex-1 overflow-hidden min-h-0">
            <MediaGrid
              images={images}
              isLoading={isLoading && images.length === 0}
              searchQuery=""
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
              usageMap={usageMap}
            />
          </div>
          <div className="w-80 border-l bg-gray-50/30 overflow-y-auto hidden lg:block">
            <MediaDetails
              image={selectedImage}
              usages={currentUsages}
              similarImages={similarImagesWithLabels}
              usageMap={usageMap}
              onSelectImage={setSelectedKey}
              onDownload={() => selectedImage && window.open(selectedImage.url, '_blank')}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
