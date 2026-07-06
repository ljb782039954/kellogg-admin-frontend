import OptimizedImage from "@/runtime/components/OptimizedImage";
import { useCallback, useRef, useState } from "react";

export interface BeforeAfterSliderProps {
  eyebrow?: string;
  beforeImage: string;
  beforeImageAlt?: string;
  afterImage: string;
  afterImageAlt?: string;
}

export default function BeforeAfterSlider({
  eyebrow = "",
  beforeImage,
  beforeImageAlt = "",
  afterImage,
  afterImageAlt = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nextPosition = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(5, Math.min(95, nextPosition)));
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      {eyebrow && <p className="text-[10px] tracking-[0.2em] text-subtle uppercase mb-4 text-center">{eyebrow}</p>}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-sm select-none aspect-video"
        onMouseMove={(event) => handleMove(event.clientX)}
        onTouchMove={(event) => handleMove(event.touches[0].clientX)}
      >
        <OptimizedImage src={afterImage} alt={afterImageAlt} className="absolute inset-0 w-full h-full object-cover" sizes="100vw" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <OptimizedImage
            src={beforeImage}
            alt={beforeImageAlt}
            className="absolute inset-0 h-full object-cover max-w-none"
            sizes="100vw"
            style={{ width: `${100 / position * 100}%` }}
          />
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-surface cursor-ew-resize" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-surface rounded-full shadow-md flex items-center justify-center">
            <span className="text-[10px] text-body">|||</span>
          </div>
        </div>
      </div>
    </section>
  );
}



