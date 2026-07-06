import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";
// TODO 涓嶉渶瑕佸睍绀?鍒嗙被
export interface ProductCardProps {
  title: string;
  imageSrc?: string;
  href?: string;
  tagText?: string;
  quantityText?: string;
  descriptionText?: string;
  priceText?: string;
  originalPriceText?: string;
  releaseText?: string;
  variant?: "standard" | "compact" | "arrival";
}

export default function ProductCard({
  title,
  imageSrc,
  href = "#",
  tagText = "",
  quantityText = "",
  descriptionText = "",
  priceText = "",
  originalPriceText = "",
  releaseText = "",
  variant = "standard",
}: ProductCardProps) {
  const isCompact = variant === "compact";

  return (
    <a href={href} className="group block h-full text-ink-strong">
      <article className="h-full flex flex-col">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-media">
          {imageSrc ? (
            <OptimizedImage
              src={imageSrc}
              alt={title}
              width={720}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-subtle">No Image</div>
          )}
          {(tagText || releaseText) && (
            <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
              {tagText && (
                <span className="bg-surface-glass px-3 py-1 text-[10px] rounded uppercase text-ink-strong">
                  {tagText}
                </span>
              )}
              {releaseText && (
                <span className="bg-ink-glass px-3 py-1 text-[10px] uppercase text-on-dark">
                  {releaseText}
                </span>
              )}
            </div>
          )}
        </div>

        <div className={`${isCompact ? "pt-3" : "pt-4"} flex flex-col flex-1`}>
          
          <div className="flex items-start justify-between gap-4">
            <h3 className={`${isCompact ? "text-sm" : "text-base"} font-luxury-heading leading-snug group-hover:text-body transition-colors`}>
              {title}
            </h3>
            {originalPriceText && (
              <p className="text-xs text-subtle line-through">{originalPriceText}</p>
            )}
          </div>
          {(quantityText) && (
            <div className="flex flex-wrap justify-between  items-center gap-x-3 gap-y-1 text-[10px] uppercase text-subtle">
              {quantityText && <span className="mt-2 text-base whitespace-nowrap">{quantityText}</span>}
              {priceText && <span className="mt-2 text-base font-semibold whitespace-nowrap">{priceText}</span>}
            </div>
          )}
          {descriptionText && !isCompact && (
            <RichText value={descriptionText} className="mt-2 text-sm leading-6 text-body line-clamp-2" />
          )}
        </div>
      </article>
    </a>
  );
}



