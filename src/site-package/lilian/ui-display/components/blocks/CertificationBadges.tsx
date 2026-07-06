import { useState } from "react";
import RichText from "@/runtime/components/RichText";

export interface CertificationBadgeItemProps {
  name: string;
  fullName?: string;
  description?: string;
}

export interface CertificationBadgesProps {
  eyebrow?: string;
  certifications: CertificationBadgeItemProps[];
}

export default function CertificationBadges({ eyebrow = "", certifications }: CertificationBadgesProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      {eyebrow && <p className="text-sm md:text-base tracking-[0.2em] font-bold text-subtle uppercase mb-6 text-center">{eyebrow}</p>}
      <div className="flex flex-wrap justify-center gap-4">
        {certifications.map((item, index) => (
          <div key={`${item.name}-${index}`} className="relative text-center cursor-default" onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)}>
            <div className={`p-6 rounded-full border flex items-center justify-center transition-all ${hovered === index ? "border-ink-strong bg-ink-strong text-on-dark" : "border-border text-subtle"}`}>
              <span className="text-xs md:text-sm  tracking-wider">{item.name}</span>
            </div>
            {hovered === index && (item.fullName || item.description) && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-surface shadow-lg border border-border p-3 rounded-sm w-48 z-10">
                {item.fullName && <p className="text-[9px] font-medium mb-1">{item.fullName}</p>}
                {item.description && <RichText value={item.description} className="text-[9px] text-body leading-relaxed" />}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}



