import { Heart, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewArrivals } from '../../features/products/productSlice';
import { getWishlist, toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { useNavigate } from 'react-router-dom';

const NewArrivalsHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist } = useSelector(state => state.wishlist);

  const handleWishlist = (e,productId) => {
    e.stopPropagation();
    dispatch(toggleWishlist(productId));
  };

  const isWishlisted = (productId) => {
    return wishlist?.some(item => (item._id || item).toString() === productId.toString());
  }

  const { newArrivals, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchNewArrivals());
    dispatch(getWishlist());
  }, [dispatch]);

  const calculateDiscountPercentage = (price, discountPrice) => {
    if (!discountPrice || discountPrice >= price) return null;
    const discount = ((price - discountPrice) / price) * 100;
    return Math.round(discount);
  }

  return (
    <div className='bg-gray-50'>
      <section className='max-w-7xl mx-auto px-4 md:px-6 py-20'>
        <div className="flex flex-col sm:flex-row items-center md:justify-between mb-10 text-center sm:text-left gap-2 md:gap-4">
          <div>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mt-1'>
              New Arrivals
            </h2>

            <p className='text-gray-400 mt-1 text-sm'>
              Discover our latest fashion collection
            </p>
          </div>

          <button
            onClick={() => navigate('/product/newarrival')}
            className="hidden lg:block border px-5 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300">
            View All
          </button>


        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((item) => {

            const hasDiscount = item.discountPercentage > 0 ||
              (item.discountPrice && item.discountPrice < item.price)
            const displayPrice = hasDiscount ? item.discountPrice : item.price
            const originalPrice = hasDiscount ? item.price : null

            return (
              <div key={item._id} className="group cursor-pointer">

                <div
                  className="aspect-3/4 relative overflow-hidden rounded-xl"
                  onClick={() => navigate(`/product/${item._id}`, { state: item })}
                >
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
                  />

                  {item.images?.[1]?.url && (
                    <img
                      src={item.images?.[1]?.url}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                  )}

                  {hasDiscount && (
                    <span className="md:absolute md:top-3 md:left-3 md:bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      ₹{Math.round(originalPrice - displayPrice)} OFF
                    </span>
                  )}

                  <button
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer"
                    onClick={(e) => handleWishlist(e, item._id)}
                  >
                    <Heart
                      size={16}
                      className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 ${isWishlisted(item._id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                    />
                  </button>
                </div>

                <div className="mt-2">
                  <h3 className="text-xs md:text-sm text-[#585c70] font-semibold  border-b border-dashed border-gray-300 pb-0.5">
                    {item.name}
                  </h3>

                  <p className="text-xs md:text-sm text-[#737577] mt-1">
                    {item.subCategory?.name}
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

              </div>
            )
          })}
        </div>

        <div className="lg:hidden mt-6 text-center">
          <button
            onClick={() => navigate('/product/newarrival')}
            className="border px-5 py-2 rounded-full hover:bg-blue-500 hover:text-white transition">
            View More
          </button>
        </div>
      </section>
    </div>
  )
}

export default NewArrivalsHome
