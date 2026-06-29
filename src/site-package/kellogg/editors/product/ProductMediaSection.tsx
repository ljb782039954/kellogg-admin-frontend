import { Plus, Tag, Trash2 } from 'lucide-react';
import ImageInput from '../../components/ImageInput';
import type { Product } from '@/core/types';

interface ProductMediaSectionProps {
  product: Product;
  onUpdateField: <K extends keyof Product>(field: K, value: Product[K]) => void;
}

export default function ProductMediaSection({ product, onUpdateField }: ProductMediaSectionProps) {
  const images = product.images || [];

  const updateImages = (newImages: string[]) => {
    onUpdateField('images', newImages);
  };

  const setMainImage = (url: string) => {
    onUpdateField('image', url);
  };

  return (
    <div className="space-y-8">
      {/* Main Image */}
      <div className="space-y-4">
        <ImageInput
          label="产品主图"
          value={product.image || ''}
          onChange={setMainImage}
          aspectRatio="square"
          maxWidth={1200}
        />
      </div>

      {/* Gallery Section */}
      <div className="pt-6 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-1 text-gray-400">
          <Tag className="w-3 h-3" /> 详情页图集
        </label>
        <div className="flex flex-wrap gap-4">
          {images.map((img, imgIdx) => (
            <div key={imgIdx} className="relative aspect-square rounded-lg group/img">
              <ImageInput
                value={img}
                onChange={(val) => {
                  const nextImages = [...images];
                  nextImages[imgIdx] = val;
                  updateImages(nextImages);
                }}
                aspectRatio="square"
                maxWidth={1200}
              />
              <button
                onClick={() => {
                  const nextImages = [...images];
                  nextImages.splice(imgIdx, 1);
                  updateImages(nextImages);
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity z-10 shadow-sm"
                title="移除此图"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              updateImages([...images, '']);
            }}
            className="px-4 py-3 aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all bg-gray-50/50"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-bold">增加图片</span>
          </button>
        </div>
        <p className="mt-2 text-[10px] text-gray-400">点击"增加图片"后，在下方上传图片。</p>
      </div>

      {/* Videos Section */}
      <div className="pt-6 border-t border-gray-100 pb-4">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-1 text-gray-400">
          <Tag className="w-3 h-3" /> 视频链接 (YouTube, TikTok 等)
        </label>
        <div className="space-y-4">
          {(product.videos || []).map((video, vIdx) => (
            <div key={vIdx} className="flex gap-2 group/vid">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="请输入视频链接 (如 https://www.youtube.com/watch?v=...)"
                  value={video}
                  onChange={(e) => {
                    const nextVideos = [...(product.videos || [])];
                    nextVideos[vIdx] = e.target.value;
                    onUpdateField('videos', nextVideos);
                  }}
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>
              <button
                onClick={() => {
                  const nextVideos = [...(product.videos || [])];
                  nextVideos.splice(vIdx, 1);
                  onUpdateField('videos', nextVideos);
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover/vid:opacity-100"
                title="移除视频"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              onUpdateField('videos', [...(product.videos || []), '']);
            }}
            className="w-full py-3 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-1 bg-gray-50/50"
          >
            <Plus className="w-3.5 h-3.5" /> 添加视频链接
          </button>
        </div>
        <p className="mt-2 text-[10px] text-gray-400">我们将自动识别 YouTube, TikTok, Facebook, Twitter 等平台的视频链接。</p>
      </div>
    </div>
  );
}
