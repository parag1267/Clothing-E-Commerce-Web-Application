import { Heart, ShoppingCart } from 'lucide-react';
import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingProductHome } from '../../features/products/productSlice';
import { useNavigate } from 'react-router-dom';


const TrendingProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trendingAll, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchTrendingProductHome())
  }, [dispatch]);
  return (
    <section className='py-11 bg-gray-100'>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className='text-3xl font-bold mb-8 text-center'>
          Trending Collection
        </h2>

        <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible pb-4">
          {trendingAll.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ y: -4 }}
              className="group min-w-55 lg:min-w-0 relative rounded-xl overflow-hidden bg-white shadow hover:shadow-xl transition"
            >

              <button className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-xl transition-all duration-300 z-20 hover:scale-110 group/wishlist'>
                <Heart size={18} />
              </button>

              <div className="relative h-64 md:h-72 overflow-hidden bg-gray-100" onClick={() => navigate(`/product/${product._id}`)}>
                <img src={product.images?.[0]?.url} alt={product.name} className="absolute w-full h-full object-cover group-hover:opacity-0 transition-all duration-500 ease-out group-hover:scale-110" />

                <img src={product.images?.[1]?.url} alt={product.name} className='absolute w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:scale-110' />
              </div>

              <div className="p-5 text-left">
                <h3 className='font-semibold text-gray-900 text-base md:text-lg mb-1 line-clamp-1 hover:text-gray-700 transition'>{product.name}</h3>

                <p className='text-gray-600 mb-4'>₹{product.price}</p>
                <button className='w-full bg-gray-900 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 font-medium text-sm group/btn'>
                  <ShoppingCart size={16} className="group-hover/btn:scale-110 transition-transform" /> Add to Cart
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrendingProduct
