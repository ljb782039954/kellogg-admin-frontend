export interface ImageFullProps {
  image?: string;
  alt?: { zh: string; en: string };
}

export const imageFullProps: ImageFullProps = {
  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&auto=format&fit=crop&q=80",
  alt: { zh: "高品质经典大图海报", en: "Premium Classic Brand Banner" }
};

export default imageFullProps;
