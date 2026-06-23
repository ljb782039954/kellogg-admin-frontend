import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Translation } from '@/types';

export interface ImageBannerTagProps {
  image?: string;
  tag?: Translation;
  title?: Translation;
  subtitle?: Translation;
}

interface Props {
    t: (obj: { zh: string; en: string }) => string;
    props: ImageBannerTagProps;
}


export default function ImageBannerTag({ t, props }: Props) {
    const { tag, title, subtitle, image } = props;
    const bgImage = useMemo(() => {
        return `url('${image}')`;
    }, [image]);

    return (

        <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gray-900" >
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                transition={{ duration: 1.5 }}
                className={`absolute inset-0 
                bg-[${bgImage}] 
                bg-cover bg-center
                `}
            />
            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 mb-4"
                >
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 font-medium tracking-widest text-sm uppercase">
                        {t(tag)}
                    </span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                >
                    {t(title)}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light"
                >
                    {t(subtitle)}
                </motion.p>
            </div>
        </section >

    );
}
