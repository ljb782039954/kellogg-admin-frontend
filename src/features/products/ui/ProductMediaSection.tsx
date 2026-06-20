import { Plus, Trash2, Tag } from 'lucide-react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import ImageInput from '@/ui/media/ImageInput';
import type { ProductFormValues } from '../model/product.schema';

interface ProductMediaSectionProps {
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}

export default function ProductMediaSection({ watch, setValue }: ProductMediaSectionProps) {
  const images = watch('images') ?? [];
  const videos = watch('videos') ?? [];

  return (
    <section>
      <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">媒体资源</h3>

      {/* Main Image */}
      <div className="space-y-4 mb-6">
        <h4 className="text-xs font-semibold text-gray-500">产品主图</h4>
        <ImageInput
          label="产品主图"
          value={watch('image') ?? ''}
          onChange={(val) => setValue('image', val)}
          aspectRatio="square"
          maxWidth={1200}
        />
      </div>

      {/* Gallery */}
      <div className="pt-6 border-t border-gray-100 mb-6">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-1">
          <Tag className="w-3 h-3" /> 详情页图集
        </label>
        <div className="flex flex-wrap gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg group/img">
              <ImageInput
                value={img}
                onChange={(val) => {
                  const next = [...images];
                  next[idx] = val;
                  setValue('images', next);
                }}
                aspectRatio="square"
                maxWidth={1200}
              />
              <button
                type="button"
                onClick={() => {
                  const next = [...images];
                  next.splice(idx, 1);
                  setValue('images', next);
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity z-10 shadow-sm"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setValue('images', [...images, ''])}
            className="px-4 py-3 aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all bg-gray-50/50"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-bold">增加图片</span>
          </button>
        </div>
      </div>

      {/* Videos */}
      <div className="pt-6 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-1">
          <Tag className="w-3 h-3" /> 视频链接
        </label>
        <div className="space-y-4">
          {videos.map((video, idx) => (
            <div key={idx} className="flex gap-2 group/vid">
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={video}
                onChange={(e) => {
                  const next = [...videos];
                  next[idx] = e.target.value;
                  setValue('videos', next);
                }}
                className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const next = [...videos];
                  next.splice(idx, 1);
                  setValue('videos', next);
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover/vid:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setValue('videos', [...videos, ''])}
            className="w-full py-3 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-1 bg-gray-50/50"
          >
            <Plus className="w-3.5 h-3.5" /> 添加视频链接
          </button>
        </div>
      </div>
    </section>
  );
}
