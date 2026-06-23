import { motion } from 'framer-motion';


interface MotionHeaderProps {
    t: (obj: { zh: string; en: string }) => string;
    title: { zh: string; en: string };
    subtitle: { zh: string; en: string };
}

export default function MotionHeader({
    t,
    title,
    subtitle,
}: MotionHeaderProps) {

    const style = {
        bg: 'bg-gray-50',
        title: 'text-gray-800',
        subtitle: 'text-gray-500',
        card: 'bg-white',
        cardBorder: 'border-gray-100',
        name: 'text-gray-800',
        price: 'text-gray-900',
        originalPrice: 'text-gray-400',
        button: 'bg-gray-800 text-white hover:bg-gray-700',
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
