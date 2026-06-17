import AdminImage from '@/admin/components/AdminImage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DuplicateImageMatch } from '../domain/findDuplicateImages';

interface DuplicateImageDialogProps {
  duplicates: DuplicateImageMatch[];
  isUploading: boolean;
  onReuse: (url: string) => void;
  onForceUpload: () => void;
  onCancel: () => void;
}

export function DuplicateImageDialog({
  duplicates,
  isUploading,
  onReuse,
  onForceUpload,
  onCancel,
}: DuplicateImageDialogProps) {
  return (
    <Dialog open={duplicates.length > 0} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            检测到相似图片
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            系统检测到图库中已有与您当前上传内容高度相似（95% 以上）的图片，建议直接复用以节约存储空间并提升加载效率。
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-60 mt-3 border rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-100 bg-gray-50/50">
            {duplicates.map(({ image, similarity }) => (
              <div key={image.key} className="flex items-center gap-3 p-3 bg-white">
                <div className="w-12 h-12 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                  <AdminImage
                    src={image.thumbUrl || image.url}
                    fallbackSrc={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {image.dimensions || '未知尺寸'} • 相似度:{' '}
                    <span className="font-bold text-orange-600">
                      {(similarity * 100).toFixed(1)}%
                    </span>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs font-medium text-primary hover:text-primary-hover hover:bg-primary/5 h-8 shrink-0"
                  onClick={() => onReuse(image.url)}
                >
                  复用此图
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 pt-3 border-t flex gap-2 sm:justify-end">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs text-gray-500">
            取消
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onForceUpload}
            disabled={isUploading}
            className="text-xs"
          >
            坚持上传新图
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
