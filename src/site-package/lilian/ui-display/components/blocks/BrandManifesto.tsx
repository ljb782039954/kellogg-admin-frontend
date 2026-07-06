export interface BrandManifestoProps {
  eyebrow?: string;
  quote: string;
  attribution?: string;
  backgroundColor?: string;
}

export default function BrandManifesto({
  eyebrow,
  quote,
  attribution,
  backgroundColor = "var(--color-ink)",
}: BrandManifestoProps) {
  return (
    <section className="py-20" style={{ background: backgroundColor }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        {eyebrow && (
          <p className="text-[10px] tracking-[0.3em] text-on-dark-faint uppercase mb-6">
            {eyebrow}
          </p>
        )}
        <h3
          className="text-2xl sm:text-3xl font-light text-on-dark leading-relaxed whitespace-pre-line"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {quote}
        </h3>
        {attribution && (
          <p className="text-xs text-on-dark-faint mt-6 tracking-wider">
            {attribution}
          </p>
        )}
      </div>
    </section>
  );
}



