import type { CSSProperties } from "react";
import OptimizedImage from "@/runtime/components/OptimizedImage";

export interface Partner {
  id?: string;
  logo: string;
  name: string;
  color?: string;
  link?: string;
}

export interface PartnerLogosProps {
  titleText?: string;
  subtitleText?: string;
  moreText?: string;
  items?: Partner[];
}

export default function PartnerLogos({
  titleText = "",
  subtitleText = "",
  moreText = "",
  items = [],
}: PartnerLogosProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {titleText && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">{titleText}</h2>
            {subtitleText && <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600">{subtitleText}</p>}
          </div>
        )}
        <div className="flex justify-center items-center gap-8 px-8 flex-wrap">
          {items.map((partner, index) => {
            const logoNode = partner.logo ? (
              <OptimizedImage src={partner.logo} alt={partner.name} width={200} className="max-w-[80%] max-h-[80%] object-contain" />
            ) : (
              <div className="text-xl font-bold" style={{ color: partner.color } as CSSProperties}>{partner.name}</div>
            );

            return partner.link ? (
              <a
                key={partner.id || `${partner.name}-${index}`}
                href={partner.link}
                className="w-32 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow grayscale hover:grayscale-0"
              >
                {logoNode}
              </a>
            ) : (
              <div key={partner.id || `${partner.name}-${index}`} className="w-32 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow grayscale hover:grayscale-0">
                {logoNode}
              </div>
            );
          })}
        </div>
        {moreText && <p className="text-center text-sm text-gray-400 mt-8">{moreText}</p>}
      </div>
    </section>
  );
}
