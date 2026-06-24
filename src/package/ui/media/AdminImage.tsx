import React, { useState, useEffect } from 'react';
import { getPreviewUrl } from '@/shared/utils';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/shared/utils';

interface AdminImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | undefined;
  thumbnail?: boolean;
  fallback?: React.ReactNode;
  fallbackSrc?: string;
}

// Global memory cache for loaded image URLs to avoid shimmer on subsequent mounts
const loadedImagesCache = new Set<string>();

export default function AdminImage({
  src,
  thumbnail = false,
  className,
  alt = '',
  fallback,
  fallbackSrc,
  onLoad,
  onError,
  ...props
}: AdminImageProps) {
  const resolvedUrl = src ? getPreviewUrl(src, thumbnail) : '';
  const [currentSrc, setCurrentSrc] = useState(resolvedUrl);
  const [isLoaded, setIsLoaded] = useState(() => {
    return resolvedUrl ? loadedImagesCache.has(resolvedUrl) : false;
  });
  const [hasError, setHasError] = useState(() => !resolvedUrl);

  // Sync state if resolvedUrl changes (e.g. key change or dynamic updates)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!resolvedUrl) {
      setHasError(true);
      setIsLoaded(false);
      setCurrentSrc('');
    } else {
      setHasError(false);
      setIsLoaded(loadedImagesCache.has(resolvedUrl));
      setCurrentSrc(resolvedUrl);
    }
  }, [resolvedUrl]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (hasError) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    return (
      <div 
        className={cn(
          "w-full h-full flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-lg text-gray-400 p-2 select-none",
          className
        )}
      >
        <ImageIcon className="w-5 h-5 opacity-40 mb-1" />
        <span className="text-[9px] text-gray-400 font-medium tracking-wide">加载失败</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      {/* Loading state shimmer overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center animate-pulse">
          <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
        </div>
      )}

      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={(e) => {
          if (currentSrc) {
            loadedImagesCache.add(currentSrc);
          }
          setIsLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          const resolvedFallback = fallbackSrc ? getPreviewUrl(fallbackSrc) : '';
          if (resolvedFallback && currentSrc !== resolvedFallback) {
            setCurrentSrc(resolvedFallback);
          } else {
            setHasError(true);
            onError?.(e);
          }
        }}
        {...props}
      />
    </div>
  );
}
