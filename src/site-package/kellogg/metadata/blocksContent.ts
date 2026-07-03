import type { 
  CarouselProps, 
  BrandValuesProps, 
  StatisticProps, 
  TestimonialProps, 
  FAQProps, 
  TextSectionProps, 
  ImageBannerProps, 
  ImageBannerTagProps, 
  ImageTextProps, 
  CountdownProps, 
  PartnerProps, 
  GalleryProps, 
  FeatureListProps, 
  CtaBannerProps,
} from '../components-web/blocks';

// ============================================
// 导出产品相关数据
// ============================================
export * from '@/core-adminApp/metadata/productsContent';

// ============================================
// 各组件预览数据映射
// ============================================

export const carouselPreview: { props: CarouselProps } = {
  props: {
    autoPlay: true,
    interval: 3000,
    items: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
        title: { zh: '简约之美', en: 'Beauty of Simplicity' },
        subtitle: { zh: 'Less is More，探索极简主义的永恒魅力', en: 'Less is More, explore the timeless charm of minimalism' },
        cta: { zh: '探索系列', en: 'Explore Collection' },
        link: { id: 'l1', name: { zh: '探索系列', en: 'Explore Collection' }, href: '/products', linkType: 'internal' }
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
        title: { zh: '经典剪裁', en: 'Classic Cut' },
        subtitle: { zh: '精湛工艺，打造属于你的完美轮廓', en: 'Exquisite craftsmanship, creating your perfect silhouette' },
        cta: { zh: '立即选购', en: 'Shop Now' },
        link: { id: 'l2', name: { zh: '立即选购', en: 'Shop Now' }, href: '/products', linkType: 'internal' }
      },
    ]
  }
};

export const brandValuesPreview: { props: BrandValuesProps } = {
  props: {
    title: { zh: '品牌价值', en: 'Brand Values' },
    subtitle: { zh: '我们坚持的理念', en: 'What We Stand For' },
    items: [
      {
        id: 1,
        icon: 'Leaf',
        title: { zh: '环保材质', en: 'Eco-Friendly' },
        description: { zh: '采用可持续发展的环保面料，守护地球家园', en: 'Using sustainable eco-friendly materials to protect our planet' },
      },
      {
        id: 2,
        icon: 'Award',
        title: { zh: '精湛工艺', en: 'Craftsmanship' },
        description: { zh: '每一件产品都经过严格的质量把控', en: 'Every product undergoes strict quality control' },
      },
      {
        id: 3,
        icon: 'Heart',
        title: { zh: '完善的服务', en: 'Perfect Service' },
        description: { zh: '完善的售前售后服务，让您购物无忧', en: 'Perfect pre-sales and after-sales service, let you shop without worry' },
      }
    ]
  }
};

export const statisticsPreview: { props: StatisticProps } = {
  props: {
    title: { zh: '我们的成就', en: 'Our Achievements' },
    subtitle: { zh: '我们的成长历程', en: 'Our Growth Journey' },
    items: [
      { id: 1, value: '10+', label: { zh: '年行业经验', en: 'Years Experience' } },
      { id: 2, value: '5K+', label: { zh: '满意客户', en: 'Happy Customers' } },
      { id: 3, value: '500K+', label: { zh: '每年出货量', en: 'Annual Shipment' } },
    ]
  }
};

export const testimonialsPreview: { props: TestimonialProps } = {
  props: {
    title: { zh: '客户评价', en: 'Customer Reviews' },
    subtitle: { zh: '听听他们怎么说', en: 'What They Say About Us' },
    maxItems: 3,
    items: [
      {
        id: 1,
        name: { zh: '张小姐', en: 'Ms. Zhang' },
        role: { zh: '时尚博主', en: 'Fashion Blogger' },
        content: { zh: 'KELLOGG 的设计简约而不简单，每次穿上都能感受到品质的用心。', en: 'KELLOGG\'s designs are simple yet sophisticated. You can feel the quality in every piece.' },
        avatar: 'https://i.pravatar.cc/150?u=1',
      },
      {
        id: 2,
        name: { zh: '王先生', en: 'Mr. Wang' },
        role: { zh: '平面设计师', en: 'Graphic Designer' },
        content: { zh: '面料非常舒适，版型很好，是我喜欢的极简风格。', en: 'The fabric is very comfortable, and the silhouette is great. It\'s the minimalist style I love.' },
        avatar: 'https://i.pravatar.cc/150?u=2',
      },
      {
        id: 3,
        name: { zh: '李小姐', en: 'Ms. Li' },
        role: { zh: '职场精英', en: 'Professional' },
        content: { zh: '发货很快，包装精美，售后服务也非常周到。', en: 'Fast shipping, beautiful packaging, and excellent after-sales service.' },
        avatar: 'https://i.pravatar.cc/150?u=3',
      },
    ]
  }
};

export const faqPreview: { props: FAQProps } = {
  props: {
    title: { zh: '常见问题', en: 'FAQ' },
    subtitle: { zh: '找到您需要的答案', en: 'Find the Answers You Need' },
    items: [
      {
        id: 1,
        question: { zh: '如何选择合适的尺码？', en: 'How do I choose the right size?' },
        answer: { zh: '我们提供详细的尺码表供您参考。建议您在购买前测量。', en: 'Refer to our size chart and measure before buying.' },
      },
      {
        id: 2,
        question: { zh: '配送需要多长时间？', en: 'How long does shipping take?' },
        answer: { zh: '订单通常在 24 小时内发出，预计 2-5 个工作日内送达。', en: 'Orders usually ship within 24 hours and arrive in 2-5 business days.' },
      },
      {
        id: 3,
        question: { zh: '支持退换货吗？', en: 'Do you support returns and exchanges?' },
        answer: { zh: '我们支持 7 天无理由退换货，请确保吊牌齐全。', en: 'We support 7-day returns, please keep the tags attached.' },
      },
      {
        id: 4,
        question: { zh: '如何选择合适的尺码？', en: 'How do I choose the right size?' },
        answer: { zh: '我们提供详细的尺码表供您参考。建议您在购买前测量。', en: 'Refer to our size chart and measure before buying.' },
      },
      {
        id: 5,
        question: { zh: '配送需要多长时间？', en: 'How long does shipping take?' },
        answer: { zh: '订单通常在 24 小时内发出，预计 2-5 个工作日内送达。', en: 'Orders usually ship within 24 hours and arrive in 2-5 business days.' },
      },
      {
        id: 6,
        question: { zh: '支持退换货吗？', en: 'Do you support returns and exchanges?' },
        answer: { zh: '我们支持 7 天无理由退换货，请确保吊牌齐全。', en: 'We support 7-day returns, please keep the tags attached.' },
      },
    ]
  }
};

export const textSectionPreview: { props: TextSectionProps } = {
  props: {
    title: { zh: '品牌故事', en: 'Brand Story' },
    content: { 
      zh: 'KELLOGG 诞生于 2024 年，我们致力于为都市人群提供极简而不简单的生活方式建议和高品质单品。我们的每一个设计都蕴含着对细节的极致追求。', 
      en: 'KELLOGG was born in 2024. We are committed to providing urban residents with minimalist yet sophisticated lifestyle advice and high-quality items. Every design of ours contains the ultimate pursuit of details.' 
    },
    alignment: 'center',
    paddingY: 'medium',
  }
};

export const imageBannerPreview: { props: ImageBannerProps } = {
  props: {
    title: { zh: '视觉之美', en: 'Visual Beauty' },
    subtitle: { zh: '探索我们最新的极简生活方式图片库', en: 'Explore our latest minimalist lifestyle gallery' },
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
    height: 'medium',
    overlay: true,
    buttonText: { zh: '立即查看', en: 'View Now' },
    linkUrl: '/gallery'
  }
};

export const imageBannerTagPreview: { props: ImageBannerTagProps } = {
  props: {
    tag: { zh: '2026春夏系列', en: '2026 Spring Summer Collection' },
    title: { zh: '视觉之美', en: 'Visual Beauty' },
    subtitle: { zh: '探索我们最新的极简生活方式图片库', en: 'Explore our latest minimalist lifestyle gallery' },
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
  }
};

export const imageTextPreview: { props: ImageTextProps } = {
  props: {
    title: { zh: '精湛工艺，品质保证', en: 'Exquisite Craftsmanship, Quality Guaranteed' },
    content: { 
      zh: '我们引进了国际先进的生产设备，确保每一件产品都达到最高标准。我们对品质的执着追求，是我们品牌的核心竞争力。', 
      en: 'We have introduced internationally advanced production equipment to ensure every product meets the highest standards. Our persistent pursuit of quality is the core competitiveness of our brand.' 
    },
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    imagePosition: 'left',
    buttonText: { zh: '了解更多', en: 'Learn More' },
    buttonLink: '/about'
  }
};

export const countdownPreview: { props: CountdownProps } = {
  props: {
    title: { zh: '限时促销', en: 'Limited Time Offer' },
    subtitle: { zh: '全场低至 5 折，欲购从速', en: 'Up to 50% off, shop now' },
    values: {
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
    }
  }
};

export const partnerLogosPreview: { props: PartnerProps } = {
  props: {
    title: { zh: '合作伙伴', en: 'Our Partners' },
    subtitle: { zh: '与全球知名品牌携手共进', en: 'Working with world-renowned brands' },
    items: [
      { name: 'Partner 1', logo: 'https://picsum.photos/200/100?random=1' },
      { name: 'Partner 2', logo: 'https://picsum.photos/200/100?random=2' },
      { name: 'Partner 3', logo: 'https://picsum.photos/200/100?random=3' },
      { name: 'Partner 4', logo: 'https://picsum.photos/200/100?random=4' },
      { name: 'Partner 5', logo: 'https://picsum.photos/200/100?random=5' },
    ]
  }
};

export const galleryPreview: { props: GalleryProps } = {
  props: {
    title: { zh: '产品细节', en: 'Product Details' },
    subtitle: { zh: '近距离感受工艺之美', en: 'Feel the beauty of craftsmanship up close' },
    items: [
      { caption: { zh: '面料细节', en: 'Fabric Detail' }, src: 'https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?w=800&q=80' },
      { caption: { zh: '剪裁细节', en: 'Tailoring Detail' }, src: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80' },
      { caption: { zh: '穿搭灵感', en: 'OOTD Inspiration' }, src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80' },
      { caption: { zh: '极简生活', en: 'Minimalist Life' }, src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80' },
    ]
  }
};

export const featureListPreview: { props: FeatureListProps } = {
  props: {
    title: { zh: '我们的服务优势', en: 'Our Service Features' },
    subtitle: { zh: '为您提供最优质的购物体验', en: 'Providing the best shopping experience' },
    items: [
      {
        icon: 'Truck',
        title: { zh: '免费配送', en: 'Free Shipping' },
        description: { zh: '订单满299元即可享受全国免费配送服务', en: 'Free shipping on orders over ¥299' },
      },
      {
        icon: 'RotateCcw',
        title: { zh: '7天无理由退换', en: '7-Day Returns' },
        description: { zh: '收到产品7天内可申请无理由退换货', en: 'Return or exchange within 7 days' },
      },
      {
        icon: 'Shield',
        title: { zh: '正品保障', en: 'Authentic Guarantee' },
        description: { zh: '100%正品保证，假一赔十', en: '100% authentic products guaranteed' },
      },
      {
        icon: 'Headphones',
        title: { zh: '专属客服', en: '24/7 Support' },
        description: { zh: '7x24小时在线客服，随时为您解答', en: 'Round-the-clock customer support' },
      },
    ]
  }
};

export const ctaBannerPreview: { props: CtaBannerProps } = {
  props: {
    title: { zh: '开启您的简约生活', en: 'Start Your Minimalist Life' },
    subtitle: { zh: '注册即可享受首单 9 折优惠', en: 'Sign up and get 10% off your first order' },
    values: {
      primaryButton: { 
        id: 'p1',
        name: { zh: '立即加入', en: 'Join Now' }, 
        href: '/register',
        linkType: 'internal'
      },
      secondaryButton: { 
        id: 'p2',
        name: { zh: '随便看看', en: 'Browsing' }, 
        href: '/products',
        linkType: 'internal'
      },
      alignment: 'center'
    }
  }
};
