import type { ImageCarouselContent } from "../../types";

const imageCarousel: ImageCarouselContent = {
  images: [
    { image: "/lilian/hero.jpg", imageAlt: { zh: "轮播 1", en: "Slide 1" } },
    { image: "/lilian/blog1.jpg", imageAlt: { zh: "轮播 2", en: "Slide 2" } },
    { image: "/lilian/blog2.jpg", imageAlt: { zh: "轮播 3", en: "Slide 3" } },
  ],
  autoplay: true,
  interval: 4000,
};

export default imageCarousel;
