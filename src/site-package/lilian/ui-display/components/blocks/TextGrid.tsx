import RichText from "@/runtime/components/RichText";


export interface TextGridProps {
  items: Array<{
    title: string;
    text: string;
  }>;
}

export default function TextGrid({ items }: TextGridProps) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
        {items.map((item, i) => (
          <div key={i}>
            <h4
              className="text-xs md:text-sm font-semibold tracking-wider uppercase mb-2"
              style={{ color: "var(--color-ink)" }}
            >
              {item.title}
            </h4>
            <RichText value={item.text} className="text-xs md:text-sm leading-relaxed text-subtle"/>
          </div>
        ))}
      </div>
    </section>
  );
}



