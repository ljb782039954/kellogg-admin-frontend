import type { Translation } from '@/types';

export interface TextSectionProps {
  title?: Translation;
  content?: Translation;
  alignment?: 'left' | 'center' | 'right';
  paddingY?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: TextSectionProps;
}

export default function TextSection({ t, props }: Props) {
  const { title, content, alignment, backgroundColor } = props;

  // backgroundColor 是16进制的 #ffffff
  const bgColor = backgroundColor ? `bg-[${backgroundColor}]` : 'bg-gray-50';

  return (
    <section className={`py-12 ${bgColor} ${alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left'}`}>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
          {t(title)}
        </h1>
        <p className="text-gray-500 max-w-2xl text-md md:text-lg mx-auto leading-relaxed">
          {t(content)}
        </p>
      </div>
    </section>
  );
}
