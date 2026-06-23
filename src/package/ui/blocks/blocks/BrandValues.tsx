import * as LucideIcons from 'lucide-react';
import MotionHeader from '../custom/motionHeader';
import type { Translation } from '@/types';

export interface BrandValue {
  id: number;
  icon: string;
  title: Translation;
  description: Translation;
}

export interface BrandValuesProps {
  title?: Translation;
  subtitle?: Translation;
  items?: BrandValue[];
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: BrandValuesProps;
}

export default function BrandValues({ t, props }: Props) {
  const { title, subtitle, items } = props;

  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        <MotionHeader t={t} title={title} subtitle={subtitle} />
        <div className="flex flex-row justify-between max-w-6xl mx-auto gap-2 md:gap-4">
          {items.map((item, i) => {
            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Star;
            return (
              <div key={i} className="text-center group">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-1">{t(item.title)}</h4>
                <p className="text-sm text-gray-500 max-w-xs line-clamp-2">{t(item.description)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
