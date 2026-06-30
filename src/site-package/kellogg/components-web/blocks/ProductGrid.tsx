import { useState } from 'react';
import ProductCard from '../custom/productCard';
import { Link } from 'react-router-dom';
import Pagination from '../custom/pagination';
import { SlidersHorizontal } from 'lucide-react';
import type { Product, Category, SortOption } from '@/types';

export interface ProductGridProps {
  itemsPerPage?: number;
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: ProductGridProps;
  categories: Category[];
  sortOptions: SortOption[];
  products: Product[];
}

export default function ProductGrid({
  t,
  props,
  categories,
  sortOptions,
  products,
}: Props) {
  const { itemsPerPage } = props;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // 筛选产品
  let filteredProducts = [...products];
  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
  }

  // 排序
  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'sales') {
    filteredProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0));
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // 默认或最新的排序
    filteredProducts.sort((a, b) =>
      new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime()
    );
  }

  if (import.meta.env.DEV) {
    console.log('itemsPerPage:', itemsPerPage);
    console.log('products数量:', products.length);
    console.log('filteredProducts数量:', filteredProducts.length);
  }

  // 分页
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="pt-20 w-full">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="w-full border-b border-gray-200">

          <div className="flex flex-col md:flex-row 
          md:items-center md:justify-between gap-4 py-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {t({ zh: '全部', en: 'All' })}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.id
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {t(cat.name)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {t(opt.name)}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Products Grid */}
        <div className="py-12">
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">
                {t({ zh: '暂无商品', en: 'No products available' })}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {paginatedProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="block group"
                  >
                    <ProductCard t={t} product={product} index={index} />
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={filteredProducts.length}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
