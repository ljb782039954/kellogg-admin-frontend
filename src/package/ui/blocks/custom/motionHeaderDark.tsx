import { motion } from 'framer-motion';


interface MotionHeaderDarkProps {
    t: (obj: { zh: string; en: string }) => string;
    title: { zh: string; en: string };
    subtitle: { zh: string; en: string };
}

export default function MotionHeaderDark({
    t,
    title,
    subtitle,
}: MotionHeaderDarkProps) {

    const style = {
        bg: 'bg-gray-900',
        title: 'text-white',
        subtitle: 'text-white/70',
        card: 'bg-gray-800',
        cardBorder: 'border-gray-700',
        name: 'text-white',
        price: 'text-white',
        originalPrice: 'text-gray-500',
        button: 'bg-white text-gray-900 hover:bg-gray-100',
        tag: 'bg-red-500 text-white',
    }

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
        >
            <h2 className={`text-2xl md:text-4xl font-bold mb-4 ${style.title}`}>
                {t(title)}
            </h2>
            <p className={`text-md md:text-lg ${style.subtitle}`}>
                {t(subtitle)}
            </p>
        </motion.div>

    );
}
