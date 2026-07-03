import type {
  Category,
  Product,
  SortOption
} from '@/core-adminApp/types';

import type {
  CategoriesProps,
  NewArrivalsProps,
  FeaturedProductsProps,
  ProductGridProps,
} from '@/components/blocks';

// ============================================
// 基础共享数据，这个是用于预览组件样式的数据，不可删除。
// ============================================

export const categories: Category[] = [
  { id: 'casual', name: { zh: '休闲装', en: 'Casual Wear' }, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop' },
  { id: 'formal', name: { zh: '正装', en: 'Formal Wear' }, image: 'https://images.unsplash.com/photo-1594932224456-75a7724a10f8?w=400&h=400&fit=crop' },
  { id: 'dresses', name: { zh: '连衣裙', en: 'Dresses' }, image: 'https://images.unsplash.com/photo-1539008835279-43469efad90f?w=400&h=400&fit=crop' },
  { id: 'sportswear', name: { zh: '运动装', en: 'Sportswear' }, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop' },
  { id: 'underwear', name: { zh: '内衣', en: 'Underwear' }, image: 'https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=400&h=400&fit=crop' },
  { id: 'outerwear', name: { zh: '外衣', en: 'Outerwear' }, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop' },
];

export const products: Product[] = [
  {
    id: 1,
    name: { zh: '简约米色羊毛针织衫', en: 'Minimalist Beige Wool Sweater' },
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?w=800&q=80'],
    rating: 4.8,
    sales: 1200,
    tag: { zh: '热销', en: 'Hot' },
    category: 'casual',
    releaseDate: '2024-01-15',
    isFeatured: true,
    isActive: true,
  },
  {
    id: 2,
    name: { zh: '经典黑色阔腿裤', en: 'Classic Black Wide-leg Pants' },
    price: 459,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80'],
    rating: 4.6,
    sales: 890,
    category: 'formal',
    releaseDate: '2024-02-01',
    isFeatured: true,
    isActive: true,
  },
  {
    id: 3,
    name: { zh: '白色纯棉T恤', en: 'White Cotton T-Shirt' },
    price: 199,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'],
    rating: 4.5,
    sales: 2300,
    category: 'dresses',
    releaseDate: '2024-02-15',
    isFeatured: false,
    isActive: true,
  },
  {
    id: 4,
    name: { zh: '高性能运动外套', en: 'High-Performance Sports Jacket' },
    price: 459,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'],
    rating: 4.6,
    sales: 780,
    tag: { zh: '折扣', en: 'Sale' },
    category: 'sportswear',
    releaseDate: '2024-01-25',
    isFeatured: false,
    isActive: true,
  },
  {
    id: 5,
    name: { zh: '无缝舒适内衣套装', en: 'Seamless Comfort Underwear Set' },
    price: 299,
    image: 'https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=800&q=80'],
    rating: 4.9,
    sales: 2100,
    category: 'underwear',
    releaseDate: '2024-03-15',
    isFeatured: true,
    isActive: true,
  },
  {
    id: 6,
    name: { zh: '深灰色休闲西装', en: 'Dark Grey Casual Suit' },
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'],
    rating: 4.7,
    sales: 320,
    category: 'formal',
    releaseDate: '2024-02-20',
    isFeatured: true,
    isActive: true,
  },
  {
    id: 7,
    name: { zh: '花卉印花连衣裙', en: 'Floral Print Dress' },
    price: 659,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80'],
    rating: 4.8,
    sales: 1100,
    category: 'dresses',
    releaseDate: '2024-03-05',
    isFeatured: true,
    isActive: true,
  },
  {
    id: 8,
    name: { zh: '高性能运动外套', en: 'High-Performance Sports Jacket' },
    price: 459,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'],
    rating: 4.6,
    sales: 780,
    tag: { zh: '折扣', en: 'Sale' },
    category: 'sportswear',
    releaseDate: '2024-01-25',
    isFeatured: false,
    isActive: true,
  },
  {
    id: 9,
    name: { zh: '无缝舒适内衣套装', en: 'Seamless Comfort Underwear Set' },
    price: 299,
    image: 'https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1621335829175-95f437384d7c?w=800&q=80'],
    rating: 4.9,
    sales: 2100,
    category: 'underwear',
    releaseDate: '2024-03-15',
    isFeatured: true,
    isActive: true,
  },
  {
    id: 10,
    name: { zh: '防风防水风衣', en: 'Windproof Waterproof Trench Coat' },
    price: 1199,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80'],
    rating: 4.8,
    sales: 150,
    category: 'outerwear',
    releaseDate: '2024-03-20',
    isFeatured: true,
    isActive: true,
  },
  {
    id: 11,
    name: { zh: '纯棉系带束脚裤', en: 'Cotton Drawstring Joggers' },
    price: 259,
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80'],
    rating: 4.5,
    sales: 950,
    category: 'casual',
    releaseDate: '2024-02-10',
    isFeatured: false,
    isActive: true,
  },
  {
    id: 12,
    name: { zh: '复古洗水牛仔夹克', en: 'Vintage Washed Denim Jacket' },
    price: 529,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800&q=80'],
    rating: 4.7,
    sales: 640,
    category: 'casual',
    releaseDate: '2024-01-05',
    isFeatured: false,
    isActive: true,
  },
];

export const sortOptions: SortOption[] = [
  { id: 'newest', name: { zh: '新品优先', en: 'Newest' } },
  { id: 'sales', name: { zh: '销量优先', en: 'Sales' } },
  { id: 'rating', name: { zh: '评分优先', en: 'Rating' } },
  { id: 'price-asc', name: { zh: '价格从低到高', en: 'Price: Low to High' } },
  { id: 'price-desc', name: { zh: '价格从高到低', en: 'Price: High to Low' } },
];

export const categoriesPreviewData = {
  categories: categories,
};

export const sortOptionsPreviewData = sortOptions;

export const productPreviewData = {
  featuredProducts: {
    title: { zh: '精选推荐', en: 'Featured Products' },
    subtitle: { zh: '本季热门单品', en: 'This Season\'s Hot Items' },
  },
  newArrivals: {
    title: { zh: '新品上市', en: 'New Arrivals' },
    subtitle: { zh: '探索最新款式', en: 'Discover the Latest Styles' },
  },
  productGrid: {
    subtitle: { zh: '探索我们的完整系列', en: 'Explore Our Complete Collection' },
    categories: categories,
    itemsPerPage: 12,
  }
};

// ============================================
// 各组件预览数据映射 (兼容 ComponentsPreview)
// ============================================

export const categoriesPreview: { props: CategoriesProps; categories: Category[] } = {
  props: {
    showAll: true,
    maxItems: 8
  },
  categories: categories
};

export const newArrivalsPreview: { props: NewArrivalsProps; products: Product[] } = {
  props: {
    title: { zh: '新品上市', en: 'New Arrivals' },
    subtitle: { zh: '探索最新款式', en: 'Discover the Latest Styles' },
    maxItems: 4
  },
  products: products
};

export const featuredProductsPreview: { props: FeaturedProductsProps; products: Product[] } = {
  props: {
    title: { zh: '精选推荐', en: 'Featured Products' },
    subtitle: { zh: '本季热门单品', en: 'This Season\'s Hot Items' },
    maxItems: 4
  },
  products: products.filter(p => p.isFeatured)
};

export const productGridPreview: { props: ProductGridProps; categories: Category[]; sortOptions: SortOption[]; products: Product[] } = {
  props: {
    itemsPerPage: 8
  },
  categories: categories,
  sortOptions: sortOptions,
  products: products
};
