import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { Language, Product, Translation } from "@/cms/types";
import { toProductCardData } from "@/cms/adapters/productCard";
import { formatPrice } from "@/cms/lib/currency";
import RichText from "@/runtime/components/RichText";

export interface ProductCardProps {
  title?: string;
  imageSrc?: string;
  href?: string;
  tagText?: string;
  quantityText?: string;
  descriptionText?: string;
  priceText?: string;
  originalPriceText?: string;
  releaseText?: string;
  variant?: "standard" | "compact" | "arrival";

  // Self-formatting options
  product?: Product;
  lang?: Language;
  formatPriceText?: (price?: number) => string;
}

export function toProductCardViewProps(
  product: Product,
  {
    lang,
    variant = "standard",
    formatPriceText,
  }: {
    lang: Language;
    variant?: ProductCardProps["variant"];
    formatPriceText?: (price?: number) => string;
  },
): ProductCardProps {
  const card = toProductCardData(product, {
    lang,
    formatPriceText: formatPriceText || formatPrice,
    includeReleaseDate: variant === "arrival",
    includeDescription: true,
  });

  return {
    title: card.title,
    href: `/product/${product.id}`,
    imageSrc: card.imageSrc,
    tagText: card.tagText,
    quantityText: card.quantityText,
    descriptionText: card.descriptionText,
    priceText: card.priceText,
    originalPriceText: card.originalPriceText,
    releaseText: card.releaseText,
    variant,
  };
}

export default function ProductCard({
  title: initialTitle = "",
  imageSrc: initialImageSrc,
  href: initialHref = "#",
  tagText: initialTagText = "",
  quantityText: initialQuantityText = "",
  descriptionText: initialDescriptionText = "",
  priceText: initialPriceText = "",
  originalPriceText: initialOriginalPriceText = "",
  releaseText: initialReleaseText = "",
  variant = "standard",
  product,
  lang,
  formatPriceText,
}: ProductCardProps) {
  let title = initialTitle;
  let imageSrc = initialImageSrc;
  let href = initialHref;
  let tagText = initialTagText;
  let quantityText = initialQuantityText;
  let descriptionText = initialDescriptionText;
  let priceText = initialPriceText;
  let originalPriceText = initialOriginalPriceText;
  let releaseText = initialReleaseText;

  if (product && lang) {
    const card = toProductCardViewProps(product, {
      lang,
      variant,
      formatPriceText,
      // categoryNames,
    });
    title = card.title || "";
    imageSrc = card.imageSrc;
    href = card.href || "#";
    tagText = card.tagText || "";
    quantityText = card.quantityText || "";
    descriptionText = card.descriptionText || "";
    priceText = card.priceText || "";
    originalPriceText = card.originalPriceText || "";
    releaseText = card.releaseText || "";
  }
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



