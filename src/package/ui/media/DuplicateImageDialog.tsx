import AdminImage from './AdminImage';
import { Button } from '@/package/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/package/ui/primitives/dialog';
import { ScrollArea } from '@/package/ui/primitives/scroll-area';
import type { DuplicateImageMatch } from '@/shared/media/domain/findDuplicateImages';

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
            妫€娴嬪埌鐩镐技鍥剧墖
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            绯荤粺妫€娴嬪埌鍥惧簱涓凡鏈変笌鎮ㄥ綋鍓嶄笂浼犲唴瀹归珮搴︾浉浼硷紙95% 浠ヤ笂锛夌殑鍥剧墖锛屽缓璁洿鎺ュ鐢ㄤ互鑺傜害瀛樺偍绌洪棿骞舵彁鍗囧姞杞芥晥鐜囥€?          </DialogDescription>
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
                    {image.dimensions || '鏈煡灏哄'} 鈥?鐩镐技搴?{' '}
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
                  澶嶇敤姝ゅ浘
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 pt-3 border-t flex gap-2 sm:justify-end">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-xs text-gray-500">
            鍙栨秷
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onForceUpload}
            disabled={isUploading}
            className="text-xs"
          >
            鍧氭寔涓婁紶鏂板浘
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
