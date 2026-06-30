import { cn } from '@/lib/utils';
import MotionHeaderDark from '../custom/motionHeaderDark';
import type { Translation, NavLink } from '@/types';

export interface CtaBannerValues {
  primaryButton?: NavLink;
  secondaryButton?: NavLink;
  backgroundImage?: string;
  backgroundColor?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface CtaBannerProps {
  title?: Translation;
  subtitle?: Translation;
  values?: CtaBannerValues;
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: CtaBannerProps;
}

export default function CtaBanner({
  t,
  props
}: Props) {
  const { title, subtitle, values } = props;
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[values?.alignment];

  const content = (
    <div className={cn('relative container mx-auto px-6 py-16 flex flex-col', alignClass)}>
      <MotionHeaderDark t={t} title={title} subtitle={subtitle} />
      <div className="flex flex-wrap gap-4">
        {values?.primaryButton?.name && (
          <a
            href={values?.primaryButton?.href}
            className="px-8 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            {t(values?.primaryButton?.name)}
          </a>
        )}
        {values?.secondaryButton?.name && (
          <a
            href={values?.secondaryButton?.href}
            className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-lg font-bold hover:bg-white/30 transition-colors"
          >
            {t(values?.secondaryButton?.name)}
          </a>
        )}
      </div>
    </div>
  );

  return (

    <div className="relative rounded-2xl overflow-hidden text-white my-8 mx-4">
      {values?.backgroundImage ? (
        <>
          <img
            src={values?.backgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary to-purple-700"
          style={values?.backgroundColor ? { backgroundColor: values?.backgroundColor } : undefined}
        />
      )}
      {content}
    </div>
  );
}
