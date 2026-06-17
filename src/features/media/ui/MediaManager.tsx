import { useMediaManager } from '../model/useMediaManager';
import { MediaHeader } from './MediaHeader';
import { MediaGrid } from './MediaGrid';
import { MediaDetails } from './MediaDetails';

export function MediaManager() {
  const {
    filteredImages, isLoading, isUploading,
    searchQuery, setSearchQuery,
    selectedKey, setSelectedKey,
    selectedImage, usageMap, currentUsages, unusedCount, similarImages,
    fileInputRef, handleFileUpload, handleDelete,
  } = useMediaManager();

  return (
    <div className="space-y-6">
      <MediaHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredImages.length}
        unusedCount={unusedCount}
        isUploading={isUploading}
        isLoading={isLoading}
        onUploadClick={() => fileInputRef.current?.click()}
        onRefresh={() => window.location.reload()}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[75vh]">
        <div className="flex-1 flex overflow-hidden min-h-0">
          <div className="flex-1 overflow-hidden min-h-0">
            <MediaGrid
              images={filteredImages}
              isLoading={isLoading}
              searchQuery={searchQuery}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
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
