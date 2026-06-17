import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type R2Image } from '@/types';
import { type UsageInfo } from '@/hooks/useImageUsage';
import AdminImage from '@/admin/components/AdminImage';

interface MediaGridProps {
  images: R2Image[];
  isLoading: boolean;
  searchQuery: string;
  selectedKey: string | null;
  onSelect: (key: string) => void;
  usageMap: Record<string, UsageInfo[]>;
}

export function MediaGrid({
  images,
  isLoading,
  searchQuery,
  selectedKey,
  onSelect,
  usageMap,
}: MediaGridProps) {
  if (isLoading && images.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>加载资源中...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
        <ImageIcon className="w-12 h-12 opacity-20" />
        <p>{searchQuery ? '没有找到匹配的图片' : '图库暂无图片'}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-6 pr-10 pb-10">
        {images.map((img) => {
          const isUnused = !usageMap[img.key] || usageMap[img.key].length === 0;
          return (
            <button
              key={img.key}
              onClick={() => onSelect(img.key)}
              className={cn(
                'group relative aspect-square rounded-xl border-2 overflow-hidden transition-all bg-gray-50 shadow-sm',
                selectedKey === img.key
                  ? 'border-primary ring-4 ring-primary/10'
                  : 'border-transparent hover:border-primary/30 hover:shadow-md',
              )}
            >
              <AdminImage
                src={img.thumbUrl || img.url}
                fallbackSrc={img.url}
                alt={img.name}
                className="w-full h-full object-cover aspect-square"
                loading="lazy"
              />
              {isUnused && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-orange-500 hover:bg-orange-600 border-none text-[9px] h-4 px-1.5 shadow-sm">
                    未使用
                  </Badge>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-white truncate text-center font-medium">{img.name}</p>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
