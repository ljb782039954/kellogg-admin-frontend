import OptimizedImage from "@/runtime/components/OptimizedImage";
import type { BulkPrice, Language, Product } from "@/cms/types";
import { toProductCardData } from "@/cms/adapters";
import { formatPrice } from "@/cms/lib/currency";

export interface ProductCardProps {
  href?: string;
  title?: string;
  imageSrc?: string;
  tagText?: string;
  quantityText?: string;
  priceText?: string;
  basePrice?: number;
  releaseText?: string;
  categoryText?: string;
  variant?: "standard" | "arrival";
  
  // Self-formatting options
  product?: Product;
  lang?: Language;
  formatPriceText?: (price?: number) => string;
}

function formatKelloggQuantityText(bulkPrice: BulkPrice) {
  return bulkPrice.maxQty
    ? `${bulkPrice.minQty}-${bulkPrice.maxQty} PCS`
    : `${bulkPrice.minQty}+ PCS`;
}

export function toProductCardProps(
  product: Product,
  {
    lang,
    variant = "standard",
    formatPriceText,
  }: {
    lang: Language;
    variant?: "standard" | "arrival";
    formatPriceText?: (price?: number) => string;
  },
): ProductCardProps {
  const card = toProductCardData(product, {
    lang,
    formatPriceText: formatPriceText || formatPrice,
    preferBulkPrice: variant !== "arrival",
    includeOriginalPrice: false,
    includeReleaseDate: true,
    formatQuantityText: formatKelloggQuantityText,
  });

  return {
    variant,
    title: card.title,
    imageSrc: card.imageSrc,
    tagText: card.tagText,
    releaseText: card.releaseText,
    quantityText: card.quantityText,
    priceText: card.priceText,
    basePrice: card.basePrice,
  };
}

export default function ProductCard({
  href,
  title: initialTitle = "",
  imageSrc: initialImageSrc,
  tagText: initialTagText,
  quantityText: initialQuantityText,
  priceText: initialPriceText,
  basePrice: initialBasePrice,
  releaseText: initialReleaseText,
  categoryText,
  variant = "standard",
  product,
  lang,
  formatPriceText,
}: ProductCardProps) {
  let title = initialTitle;
  let imageSrc = initialImageSrc;
  let tagText = initialTagText;
  let quantityText = initialQuantityText;
  let priceText = initialPriceText;
  let basePrice = initialBasePrice;
  let releaseText = initialReleaseText;
  const resolvedHref = href || (product ? `/product/${product.id}` : undefined);

  if (product && lang) {
    const card = toProductCardProps(product, { lang, variant, formatPriceText });
    title = card.title || "";
    imageSrc = card.imageSrc;
    tagText = card.tagText;
    releaseText = card.releaseText;
    quantityText = card.quantityText;
    priceText = card.priceText;
    basePrice = card.basePrice;
  }

  const renderCard = () => {
    if (variant === "arrival") {
      return (
        <div className="group">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-6">
            {imageSrc ? (
              <OptimizedImage src={imageSrc} alt={title} width={640} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
            )}
            {releaseText && <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-900 shadow-sm">{releaseText}</div>}
            {tagText && <div className="absolute bottom-4 left-4 px-4 py-1.5 bg-amber-500 text-white rounded-full text-xs font-bold shadow-sm">{tagText}</div>}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{title}</h3>
              {priceText && <span className="text-lg font-medium text-gray-500 whitespace-nowrap">{priceText}</span>}
            </div>
            {categoryText && <p className="text-sm text-gray-400 capitalize">{categoryText}</p>}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group h-full flex flex-col">
        <div className="aspect-[3/4] overflow-hidden relative bg-gray-50">
          {imageSrc ? (
            <OptimizedImage src={imageSrc} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
          )}
          {tagText && <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-sm z-10">{tagText}</span>}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">{title}</h3>
          <div className="flex items-center justify-between mt-auto">
            {(quantityText || priceText) && (
              <>
                {quantityText && (
                  <p className="text-xs md:text-sm font-semibold text-gray-400 uppercase group-hover:text-amber-600 transition-colors">
                    {quantityText}
                  </p>
                )}
                {priceText && <p className="text-sm md:text-base font-bold text-gray-900" data-base-price={basePrice}>{priceText}</p>}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const card = renderCard();

  return resolvedHref ? (
    <a href={resolvedHref} className="block h-full">
      {card}
    </a>
  ) : (
    card
  );
}
