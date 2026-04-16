import { Heart, ShoppingCart } from 'lucide-react';
import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingProductHome } from '../../features/products/productSlice';
import { useNavigate } from 'react-router-dom';
import { getWishlist, toggleWishlist } from '../../features/wishlist/wishlistSlice';


const TrendingProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trendingAll, loading } = useSelector((state) => state.products);
  const { wishlist } = useSelector(s => s.wishlist)

  useEffect(() => {
    dispatch(fetchTrendingProductHome())
    dispatch(getWishlist())
  }, [dispatch]);


  const isWishlisted = (productId) =>
    wishlist?.some(item => (item._id || item).toString() === productId.toString())

  const handleWishlist = (e, productId) => {
    e.stopPropagation()
    dispatch(toggleWishlist(productId))
  }
  return (
    <section className='py-11 bg-gray-100'>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className='text-[26px] md:text-4xl lg:text-5xl font-extrabold mb-1 tracking-tight text-gray-900'>
            Trending Collection
          </h2>

          <p className='text-gray-400 mt-1 text-sm md:text-base max-w-md mx-auto leading-relaxed'>
            Explore our most loved styles of the season
          </p>

          <div className="mt-2 md:mt-4 flex items-center justify-center gap-2">
            <div className="h-0.5 w-12 bg-gray-200 rounded-full" />
            <div className="h-0.75 w-8 bg-blue-500 rounded-full" />
            <div className="h-0.5 w-12 bg-gray-200 rounded-full" />
          </div>
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible pb-4 scrollbar-hide">
          {trendingAll.map((product) => {

            const hasDiscount = product.discountPercentage > 0 ||
              (product.discountPrice && product.discountPrice < product.price)
            const displayPrice = hasDiscount ? product.discountPrice : product.price
            const originalPrice = hasDiscount ? product.price : null

            return (
              <motion.div
                key={product._id}
                whileHover={{ y: -4 }}
                className="group min-w-55 lg:min-w-0 cursor-pointer"
              >
                <div
                  className="aspect-3/4 relative overflow-hidden rounded-xl"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
                  />

                  {product.images?.[1]?.url && (
                    <img
                      src={product.images?.[1]?.url}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                  )}

                  <button
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer"
                    onClick={(e) => handleWishlist(e, product._id)}
                  >
                    <Heart
                      size={16}
                      className={isWishlisted(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                  </button>
                </div>

                <div className="mt-2">
                  <h3 className="text-sm text-[#585c70] font-semibold truncate border-b border-dashed border-gray-300 pb-0.5">
                    {product.name}
                  </h3>

                  <p className="text-sm text-[#737577] mt-1">
                    {product.subCategory?.name}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-[#58595B] font-semibold">
                      ₹{Math.round(displayPrice)}
                    </p>
                    {originalPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        ₹{Math.round(originalPrice)}
                      </p>
                    )}
                  </div>
                </div>

              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TrendingProduct
