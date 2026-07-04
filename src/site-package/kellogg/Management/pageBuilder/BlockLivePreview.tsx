import { Suspense, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/core-adminApp/context/LanguageContext';
import { cn } from '@/lib/utils';
import type { BlockType } from '../../types';
import { kelloggBlockComponentMap } from '@site/ui-display/blockComponentMap';
import { getKelloggPreviewProps } from '@site/ui-display/previewProps';
import type { BlockType as DisplayBlockType } from '@site/ui-display/types';

interface BlockLivePreviewProps {
  type: BlockType;
  content: unknown;
  className?: string;
  variant?: 'card' | 'editor';
}

const previewScales = {
  card: {
    fallbackHeight: 420,
    viewportWidth: 1200,
  },
  editor: {
    fallbackHeight: 520,
    viewportWidth: 1200,
  },
};

function PreviewFallback() {
  return (
    <div className="h-full w-full animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
  );
}

export function BlockLivePreview({
  type,
  content,
  className,
  variant = 'editor',
}: BlockLivePreviewProps) {
  const { language } = useLanguage();
  const displayType = type as DisplayBlockType;
  const Component = kelloggBlockComponentMap[displayType];
  const previewConfig = previewScales[variant];
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [previewSize, setPreviewSize] = useState({
    scale: 1,
    height: previewConfig.fallbackHeight,
  });

  useEffect(() => {
    const updatePreviewSize = () => {
      const outerWidth = outerRef.current?.clientWidth || previewConfig.viewportWidth;
      const sourceHeight = innerRef.current?.scrollHeight || previewConfig.fallbackHeight;
      const scale = Math.min(1, outerWidth / previewConfig.viewportWidth);

      setPreviewSize((current) => {
        if (
          Math.abs(current.scale - scale) < 0.001 &&
          current.height === sourceHeight
        ) {
          return current;
        }

        return {
          scale,
          height: sourceHeight,
        };
      });
    };

    updatePreviewSize();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updatePreviewSize);
      return () => window.removeEventListener('resize', updatePreviewSize);
    }

    const resizeObserver = new ResizeObserver(updatePreviewSize);
    const outerElement = outerRef.current;
    const innerElement = innerRef.current;

    if (outerElement) resizeObserver.observe(outerElement);
    if (innerElement) resizeObserver.observe(innerElement);
    window.addEventListener('resize', updatePreviewSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePreviewSize);
    };
  }, [content, previewConfig.fallbackHeight, previewConfig.viewportWidth, type]);

  if (!Component) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border border-dashed bg-gray-50 text-xs text-gray-400',
          className,
        )}
        style={{ height: previewConfig.fallbackHeight * previewSize.scale }}
      >
        暂无真实预览
      </div>
    );
  }

  const previewProps = getKelloggPreviewProps(displayType, content, language);

  return (
    <div
      ref={outerRef}
      className={cn('overflow-hidden rounded-lg border-2 border-yellow-500 bg-white', className)}
      style={{ height: Math.ceil(previewSize.height * previewSize.scale) }}
    >
      <div
        ref={innerRef}
        className="pointer-events-none"
        style={{
          transform: `scale(${previewSize.scale})`,
          transformOrigin: 'top left',
          width: previewConfig.viewportWidth,
        }}
      >
        <Suspense fallback={<PreviewFallback />}>
          <Component {...previewProps} />
        </Suspense>
      </div>
    </div>
  );
}

export default BlockLivePreview;
