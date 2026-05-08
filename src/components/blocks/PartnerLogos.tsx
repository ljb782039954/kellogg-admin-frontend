import MotionHeader from "../custom/motionHeader";
import type { Translation } from '@/types';

export interface Partner {
  id?: string;
  logo: string;
  name: string;
  color?: string;
  link?: string;
}

export interface PartnerProps {
  title?: Translation;
  subtitle?: Translation;
  items?: Partner[];
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: PartnerProps;
}

export default function PartnerLogos({ t, props }: Props) {
  const { title, subtitle, items, } = props;

  // 如果没有数据，直接返回null
  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <MotionHeader t={t} title={title} subtitle={subtitle} />
        <div className="flex justify-center items-center gap-8 px-8 flex-wrap">
          {items.map((partner, i) => (
            <div
              key={i}
              className="w-32 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow grayscale hover:grayscale-0 cursor-pointer"
            >
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="max-w-[80%] max-h-[80%] object-contain" />
              ) : (
                <div
                  className="text-xl font-bold"
                  style={{ color: partner.color }}
                >
                  {partner.name}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-8">
          {t({ zh: '以及更多优质合作伙伴...', en: 'And many more quality partners...' })}
        </p>
      </div>
    </section>
  );
}
