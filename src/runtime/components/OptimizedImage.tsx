import type { ImgHTMLAttributes } from 'react';
import { getOptimizedImageUrl } from '@/cms/lib/media';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | null | undefined;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  width = 800,
  height,
  priority = false,
  className,
  alt = '',
  sizes: propSizes,
  ...props
}: OptimizedImageProps) {
  if (!src) {
    return (
      <div className={cn('bg-gray-100 animate-pulse rounded-lg', className)} style={{ width: width || '100%', height: height || '100%' }} />
    );
  }

  const imageUrl = getOptimizedImageUrl(src, width);
  const srcSet = [200, 320, 480, 640, 800, 960, 1080, 1280, 1440, 1600, 1920]
    .map((candidateWidth) => `${getOptimizedImageUrl(src, candidateWidth)} ${candidateWidth}w`)
    .join(', ');
  const sizes = propSizes || '(max-width: 768px) 100vw, 33vw';

  return (
    <img
      src={imageUrl}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={cn('transition-opacity duration-300', className)}
      {...props}
    />
  );
}
