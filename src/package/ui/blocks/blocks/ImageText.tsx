import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Translation } from '@/shared/i18n/translation';

export interface ImageTextProps {
  title?: Translation;
  content?: Translation;
  image?: string;
  imagePosition?: 'left' | 'right';
  buttonText?: Translation;
  buttonLink?: string;
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: ImageTextProps;
}

export default function ImageText({
  t,
  props,
}: Props) {
  const { title, content, image,
    imagePosition = 'left', buttonText, buttonLink } = props;

  // 判断并获取内部链接路径
  const getInternalPath = (link: string | undefined) => {
    if (!link) return null;
    if (link.startsWith('/')) return link;
    try {
      const url = new URL(link);
      // 如果 origin 相同，或者是本地开发环境
      if (url.origin === window.location.origin) {
        return url.pathname + url.search + url.hash;
      }
    } catch {
      // 不是有效的绝对 URL，保持原样
    }
    return null;
  };

  const internalPath = getInternalPath(buttonLink);

    const value = t(content);
  // 匹配双正斜杠 // 或双反斜杠 \\ 进行拆分
  const parts = value.split(/\/\/|\\\\/).map(p => p.trim()).filter(p => p !== '');

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`flex items-center gap-8 md:gap-12 px-4 ${imagePosition === 'right' ? 'flex-row-reverse' : ''}`}>
          {/* 图片 */}
          <div className="flex-1">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 文本 */}
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl md:text-4xl font-bold">
              {t(title)}
            </h3>
            {parts.length > 1 ? (
                  <ul className="space-y-1.5 mt-1">
                    {parts.map((part, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                        {i != 0 && <span className="text-gray-900 font-black text-lg -mt-1">·</span>}
                        <span>{part}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
            <p className="text-gray-600 text-md md:text-lg leading-relaxed">
              {t(content)}
            </p>
                )}
            {buttonText && buttonLink && (
              internalPath ? (
                <Link to={internalPath}>
                  <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    {t(buttonText)}
                  </button>
                </Link>
              ) : (
                <a href={buttonLink} target="_blank" rel="noopener noreferrer">
                  <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    {t(buttonText)}
                  </button>
                </a>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
