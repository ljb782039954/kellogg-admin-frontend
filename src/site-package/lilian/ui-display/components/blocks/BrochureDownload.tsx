import OptimizedImage from "@/runtime/components/OptimizedImage";
import RichText from "@/runtime/components/RichText";

export interface BrochureDownloadProps {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  titleText?: string;
  descriptionText?: string;
  buttonText?: string;
  fileMeta?: string;
  href?: string;
}

export default function BrochureDownload({
  image,
  imageAlt = "",
  eyebrow = "",
  titleText = "",
  descriptionText = "",
  buttonText = "",
  fileMeta = "",
  href = "#",
}: BrochureDownloadProps) {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-panel rounded-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="overflow-hidden aspect-[3/4]">
            <OptimizedImage src={image} alt={imageAlt || titleText} className="w-full h-full object-cover" sizes="(max-width: 768px) 100vw, 420px" />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            {eyebrow && <p className="text-[10px] tracking-[0.2em] text-subtle uppercase mb-3">{eyebrow}</p>}
            {titleText && <h3 className="text-lg font-light mb-4 font-luxury-heading">{titleText}</h3>}
            {descriptionText && <RichText value={descriptionText} className="text-xs text-body leading-relaxed mb-6" />}
            <div className="flex items-center gap-4">
              {buttonText && <a href={href} className="px-6 py-2.5 bg-ink-strong text-on-dark text-xs tracking-wider hover:bg-ink transition-colors">{buttonText}</a>}
              {fileMeta && <span className="text-[10px] text-subtle">{fileMeta}</span>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



