import { useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { useMediaManager } from '@/core-adminApp/items/media';

// 子组件
import { MediaHeader } from './MediaHeader';
import { MediaGrid } from './MediaGrid';
import { MediaDetails } from './MediaDetails';

export default function MediaManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notify = useMemo(() => ({
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
  }), []);
  const {
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
  } = useMediaManager({
    confirmDelete: message => window.confirm(message),
    notify,
  });

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await handleFileUpload(file);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <MediaHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalCount={images.length}
        usedCount={usedCount}
        unusedCount={unusedCount}
        selectedCount={selectedImages.length}
        selectedUsedCount={selectedUsedCount}
        isBulkDeleting={isBulkDeleting}
        isLoading={isLoading}
        isSelectionMode={isSelectionMode}
        isSyncingReferences={isSyncingReferences}
        isUploading={isUploading}
        usageFilter={usageFilter}
        setUsageFilter={setUsageFilter}
        onUploadClick={() => fileInputRef.current?.click()}
        onBulkDelete={handleBulkDelete}
        onClearSelection={handleClearSelection}
        onRefresh={loadImages}
        onSyncReferences={handleSyncReferences}
        onToggleSelectionMode={handleToggleSelectionMode}
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInputChange}
        className="hidden" 
        accept="image/*"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[75vh]">
        <div className="flex-1 flex overflow-hidden min-h-0">
          <div className="flex-1 overflow-hidden min-h-0">
            <MediaGrid 
              images={filteredImages}
              isLoading={isLoading}
              isSelectionMode={isSelectionMode}
              searchQuery={searchQuery}
              selectedKey={selectedKey}
              selectedKeys={selectedKeys}
              onSelect={setSelectedKey}
              onToggleSelection={handleToggleSelection}
              usageMap={usageMap}
            />
          </div>

          <div className="w-80 border-l bg-gray-50/30 overflow-y-auto hidden lg:block">
            <MediaDetails 
              image={selectedImage}
              usages={currentUsages}
              similarImages={similarImages}
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
