import { useState, useEffect, useMemo, useRef } from 'react';
import { useContent } from '@/context/ContentContext';
import { type R2Image } from '@/types';
import { toast } from 'sonner';
import { useImageUsage } from '@/hooks/useImageUsage';

// 子组件
import { MediaHeader } from './media/MediaHeader';
import { MediaGrid } from './media/MediaGrid';
import { MediaDetails } from './media/MediaDetails';

export default function MediaManager() {
  const { getImagesList, uploadImage, deleteImage } = useContent();
  const usageMap = useImageUsage();
  
  const [images, setImages] = useState<R2Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const data = await getImagesList();
      setImages(data);
    } catch (err) {
      console.error('Failed to load media library:', err);
      toast.error('无法加载媒体库');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const filteredImages = useMemo(() => {
    if (!searchQuery) return images;
    return images.filter(img => 
      img.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [images, searchQuery]);

  const selectedImage = useMemo(() => {
    return images.find(img => img.key === selectedKey);
  }, [images, selectedKey]);

  const currentUsages = useMemo(() => {
    if (!selectedImage) return [];
    return usageMap[selectedImage.key] || [];
  }, [selectedImage, usageMap]);

  const unusedCount = useMemo(() => {
    return images.filter(img => !usageMap[img.key] || usageMap[img.key].length === 0).length;
  }, [images, usageMap]);

  const similarImages = useMemo(() => {
    if (!selectedImage) return [];
    
    const list: { image: R2Image; matchType: 'exact' | 'dimension' | 'size' | 'close_size'; reason: string }[] = [];
    
    images.forEach(img => {
      if (img.key === selectedImage.key) return;
      
      const hasDimensions = !!(selectedImage.dimensions && img.dimensions);
      const sameDimensions = hasDimensions && selectedImage.dimensions === img.dimensions;
      const sameSize = selectedImage.size === img.size;
      
      const sizeDiff = Math.abs(selectedImage.size - img.size) / selectedImage.size;
      const closeSize = sizeDiff < 0.05; // 5% difference threshold
      
      if (sameDimensions && sameSize) {
        list.push({
          image: img,
          matchType: 'exact',
          reason: '尺寸与大小完全相同'
        });
      } else if (sameDimensions) {
        list.push({
          image: img,
          matchType: 'dimension',
          reason: '原始尺寸相同'
        });
      } else if (sameSize) {
        list.push({
          image: img,
          matchType: 'size',
          reason: '文件大小相同'
        });
      } else if (closeSize) {
        list.push({
          image: img,
          matchType: 'close_size',
          reason: `大小相近 (差异 ${(sizeDiff * 100).toFixed(1)}%)`
        });
      }
    });
    
    const order = { exact: 0, dimension: 1, size: 2, close_size: 3 };
    return list.sort((a, b) => order[a.matchType] - order[b.matchType]);
  }, [selectedImage, images]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
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
      toast.success('上传成功');
      loadImages();
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('上传失败');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!selectedKey || !selectedImage) return;
    
    const message = currentUsages.length > 0 
      ? `警告：该图片正在被 ${currentUsages.length} 处位置使用。删除将导致这些位置显示异常！\n\n确定要继续删除吗？`
      : '确定要永久删除这张图片吗？此操作不可撤销。';

    if (!window.confirm(message)) return;

    try {
      await deleteImage(selectedKey);
      toast.success('图片已删除');
      setSelectedKey(null);
      loadImages();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('删除失败');
    }
  };

  return (
    <div className="space-y-6">
      <MediaHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalCount={images.length}
        unusedCount={unusedCount}
        isLoading={isLoading}
        isUploading={isUploading}
        onUploadClick={() => fileInputRef.current?.click()}
        onRefresh={loadImages}
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
