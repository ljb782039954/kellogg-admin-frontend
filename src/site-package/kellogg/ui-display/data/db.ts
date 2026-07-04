import type { Product, Category } from '@/cms/types';

export const mockCategories: Category[] = [
  {
    id: 'outerwear',
    name: { zh: '精选外衣', en: 'Premium Outerwear' },
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'footwear',
    name: { zh: '潮流鞋履', en: 'Trendy Footwear' },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'accessories',
    name: { zh: '质感配饰', en: 'Classic Accessories' },
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'apparel',
    name: { zh: '时尚男装/女装', en: 'Apparel & Clothing' },
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80'
  }
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: { zh: '经典防水防风派克服', en: 'Classic Waterproof Windbreaker Parka' },
    price: 129.99,
    originalPrice: 169.99,
    bulkPrices: [
      { minQty: 10, maxQty: 49, price: 109.99 },
      { minQty: 50, maxQty: null, price: 89.99 }
    ],
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    videos: [
      'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40179-large.mp4'
    ],
    rating: 4.8,
    sales: 1240,
    tag: { zh: '爆款推荐', en: 'Best Seller' },
    category: 'outerwear',
    releaseDate: '2026-04-10',
    description: {
      zh: '专为都市与户外出行打造的派克服，采用高密度防水科技面料，兼顾透气性与防风保暖效果。经典直筒剪裁，百搭利落。',
      en: 'A parka crafted for both urban commuting and outdoor exploration, featuring high-density waterproof tech fabric. Breathable, windproof, and stylishly versatile.'
    },
    isFeatured: true,
    fabric: { zh: '85% 聚酯纤维 + 15% 锦纶 (特级防水处理)', en: '85% Polyester + 15% Nylon (Premium DWR Treatment)' },
    notes: { zh: '建议低温手洗或专业干洗，不可漂白。', en: 'Hand wash cold or professional dry clean. Do not bleach.' },
    isActive: true,
    sizes: [
      { name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }, { name: 'XXL' }
    ],
    colors: [
      { name: { zh: '曜石黑', en: 'Obsidian Black' }, image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=120&auto=format&fit=crop&q=80' },
      { name: { zh: '军绿色', en: 'Army Green' }, image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=120&auto=format&fit=crop&q=80' }
    ],
    customFields: [
      { name: { zh: '版型', en: 'Fit Type' }, value: { zh: '合体/直筒', en: 'Regular Fit' } },
      { name: { zh: '厚度', en: 'Thickness' }, value: { zh: '适中', en: 'Medium' } }
    ]
  },
  {
    id: 2,
    name: { zh: '极简牛皮复古托特包', en: 'Minimalist Leather Retro Tote Bag' },
    price: 89.50,
    originalPrice: 110.00,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    videos: [],
    rating: 4.9,
    sales: 850,
    tag: { zh: '限时优选', en: 'Editor\'s Pick' },
    category: 'accessories',
    releaseDate: '2026-05-01',
    description: {
      zh: '选用进口头层牛皮，经植物鞣制工艺加工。手感软韧温润，内部超大空间配有独立隐藏拉链袋，满足日常通勤所需。',
      en: 'Crafted from imported top-grain cowhide leather, vegetable-tanned to feel soft and supple. Large capacity with a zipped inner pouch for seamless utility.'
    },
    isFeatured: true,
    fabric: { zh: '100% 天然头层牛皮', en: '100% Natural Top-grain Cowhide Leather' },
    notes: { zh: '请避免雨淋或长时间暴晒，建议定期涂抹皮具保养油。', en: 'Avoid rain or prolonged sun exposure. Clean with leather lotion periodically.' },
    isActive: true,
    sizes: [
      { name: '均码 (One Size)' }
    ],
    colors: [
      { name: { zh: '焦糖棕', en: 'Caramel Brown' }, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=120&auto=format&fit=crop&q=80' },
      { name: { zh: '复古黑', en: 'Retro Black' }, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=120&auto=format&fit=crop&q=80' }
    ]
  },
  {
    id: 3,
    name: { zh: '网面缓震科技运动鞋', en: 'Tech Cushioning Breathable Sneakers' },
    price: 99.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    videos: [],
    rating: 4.7,
    sales: 2300,
    tag: { zh: '新品上架', en: 'New' },
    category: 'footwear',
    releaseDate: '2026-06-02',
    description: {
      zh: '中底搭载新一代高弹缓震材质，脚感轻盈软弹。鞋面采用多层透气网眼，夏天穿着依旧保持清爽不闷脚。',
      en: 'Engineered cushion midsole provides ultra-responsive cushioning and lightness. Mesh upper keeps your feet cool and fresh even in hot summer days.'
    },
    isFeatured: true,
    isActive: true,
    sizes: [
      { name: '39' }, { name: '40' }, { name: '41' }, { name: '42' }, { name: '43' }, { name: '44' }
    ],
    colors: [
      { name: { zh: '竞速红', en: 'Racing Red' } },
      { name: { zh: '极地白', en: 'Polar White' } }
    ]
  },
  {
    id: 4,
    name: { zh: '意式剪裁高支全羊毛西装', en: 'Italian Fit Pure Merino Wool Suit' },
    price: 350.00,
    originalPrice: 420.00,
    bulkPrices: [
      { minQty: 5, maxQty: 19, price: 310.00 },
      { minQty: 20, maxQty: null, price: 270.00 }
    ],
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80'
    ],
    videos: [],
    rating: 5.0,
    sales: 320,
    category: 'apparel',
    releaseDate: '2026-03-15',
    description: {
      zh: '选用 100 支澳洲美丽奴细羊毛织造，面料细腻垂坠。纯正意式西服版型，胸衬与肩垫软硬适中，塑造硬朗挺拔的男士线条。',
      en: 'Woven from 100S superfine Australian merino wool. Authentic Italian tailoring with premium internal canvas to shape a sharp, refined silhouette.'
    },
    isFeatured: false,
    isActive: true,
    sizes: [
      { name: '46 (S)' }, { name: '48 (M)' }, { name: '50 (L)' }, { name: '52 (XL)' }, { name: '54 (XXL)' }
    ],
    colors: [
      { name: { zh: '海军蓝', en: 'Navy Blue' } }
    ]
  },
  {
    id: 5,
    name: { zh: '手工针织美利奴粗针毛衣', en: 'Hand-knitted Chunky Merino Sweater' },
    price: 110.00,
    originalPrice: 130.00,
    image: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800&auto=format&fit=crop&q=80'
    ],
    videos: [],
    rating: 4.6,
    sales: 450,
    category: 'apparel',
    releaseDate: '2026-05-20',
    description: {
      zh: '经典麻花纹针织结构，加厚保暖。落肩版型，慵懒闲适，带给您冬天里最温暖的拥抱。',
      en: 'Chunky cable-knit merino wool sweater. Relaxed shoulder design for a cozy, laidback look, giving you the warmest hug in winter.'
    },
    isFeatured: false,
    isActive: true,
    sizes: [
      { name: 'S' }, { name: 'M' }, { name: 'L' }
    ],
    colors: [
      { name: { zh: '米杏色', en: 'Oatmeal Beige' } }
    ]
  },
  {
    id: 6,
    name: { zh: '水洗棉质口袋落肩T恤', en: 'Washed Cotton Pocket Drop-Shoulder Tee' },
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
    ],
    videos: [],
    rating: 4.8,
    sales: 1580,
    tag: { zh: '日常必备', en: 'Essential' },
    category: 'apparel',
    releaseDate: '2026-05-25',
    description: {
      zh: '选用 240g 重磅精梳棉，经环保重水洗工艺处理，抗缩水且触感绒软。前胸设计小口袋装饰，丰富层次感。',
      en: 'Crafted from 240g heavy-weight combed cotton, stone-washed to resist shrinkage and feel ultra-soft. Classic front chest pocket details.'
    },
    isFeatured: true,
    isActive: true,
    sizes: [
      { name: 'M' }, { name: 'L' }, { name: 'XL' }, { name: 'XXL' }
    ],
    colors: [
      { name: { zh: '水洗白', en: 'Washed White' } }
    ]
  }
];
